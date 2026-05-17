"use client";
import useAllMCQ from "@/app/hooks/useAllMCQ";
import useSearchCategory from "@/app/hooks/useSearchCategory";
import useSearchLevel from "@/app/hooks/useSearchLevel";
import MakeExam from "@/components/Modals/MakeExam";
import QuizScreen from "@/components/QuizPage/QuizScreen";
import QuizEditor from "@/components/QuizPage/QuizEditor";
import { getMCQ } from "@/requests/get";
import React, { useEffect, useState, useCallback } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import type { QuizQuestion } from "@quizlytics/types";
import { Button } from "@/components/ui/button";

function GenerationProgress({ elapsedSeconds }: { elapsedSeconds: number }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card w-[90%] max-w-md p-8 rounded-2xl shadow-2xl border border-border text-center">
        <Loader2 className="h-10 w-10 text-primary-color animate-spin mx-auto mb-5" />
        <h2 className="text-xl font-bold text-foreground mb-3">
          Generating your quiz with AI...
        </h2>
        <p className="text-muted-foreground">
          This usually takes 10-30 seconds.
        </p>
        <p className="mt-4 text-sm font-medium text-foreground">
          Elapsed: {elapsedSeconds}s
        </p>
        {elapsedSeconds > 20 ? (
          <p className="mt-5 rounded-xl border border-primary-color/30 bg-primary-color/5 p-4 text-sm text-muted-foreground">
            This is taking longer than usual. Try a smaller question count if it
            keeps happening.
          </p>
        ) : null}
      </div>
    </div>
  );
}

const Page = () => {
  const [searchCategory, setSearchCategory] = useSearchCategory();
  const [searchLavel, setSearchLavel] = useSearchLevel();
  const [loadData, setLoadData] = useState<boolean>(false);
  const [allMCQ, setAllMCQ] = useAllMCQ();
  const [showMakeExam, setShowMakeExam] = useState<boolean>(true);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [includeExplanations, setIncludeExplanations] =
    useState<boolean>(false);

  const fetchQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setElapsedSeconds(0);

    const elapsedInterval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    try {
      const data = await getMCQ(
        searchCategory,
        searchLavel,
        questionCount,
        includeExplanations
      );
      if (!data || data.length === 0) {
        throw new Error("No questions were generated. Please try again.");
      }
      setAllMCQ(data);
      clearInterval(elapsedInterval);
    } catch (err) {
      setAllMCQ([]);
      clearInterval(elapsedInterval);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate quiz. AI might be busy."
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    includeExplanations,
    questionCount,
    searchCategory,
    searchLavel,
    setAllMCQ,
  ]);

  useEffect(() => {
    if (loadData) {
      fetchQuiz();
    }
  }, [loadData, fetchQuiz]);

  const handleConfirmEdit = (editedQuestions: QuizQuestion[]) => {
    setAllMCQ(editedQuestions);
    setShowEditor(false);
  };

  const handleRegenerate = () => {
    setShowEditor(false);
    setLoadData(false);
    // Small delay then re-fetch
    setTimeout(() => {
      setLoadData(true);
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="grow">
        {showMakeExam ? (
          <MakeExam
            setShowMakeExam={setShowMakeExam}
            setSearchLavel={setSearchLavel}
            setSearchCategory={setSearchCategory}
            setLoadData={setLoadData}
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            includeExplanations={includeExplanations}
            setIncludeExplanations={setIncludeExplanations}
          />
        ) : isLoading ? (
          <GenerationProgress elapsedSeconds={elapsedSeconds} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Generation Failed
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => fetchQuiz()}
                  className="bg-primary-color hover:bg-primary-color/90 text-white gap-2 h-12 rounded-xl"
                >
                  <RefreshCw className="h-5 w-5" />
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowMakeExam(true)}
                  className="text-muted-foreground"
                >
                  Change Topic
                </Button>
              </div>
            </div>
          </div>
        ) : showEditor && allMCQ.length > 0 ? (
          <QuizEditor
            questions={allMCQ}
            onConfirm={handleConfirmEdit}
            onRegenerate={handleRegenerate}
          />
        ) : (
          <QuizScreen
            allQuestions={allMCQ}
            isLoading={false}
            searchLavel={searchLavel}
            searchCategory={searchCategory}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
