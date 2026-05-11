"use client";
import useAllMCQ from "@/app/hooks/useAllMCQ";
import useSearchCategory from "@/app/hooks/useSearchCategory";
import useSearchLevel from "@/app/hooks/useSearchLevel";
import MakeExam from "@/components/Modals/MakeExam";
import QuizScreen from "@/components/QuizPage/QuizScreen";
import QuizEditor from "@/components/QuizPage/QuizEditor";
import { getMCQ } from "@/requests/get";
import React, { useEffect, useState, useCallback } from "react";
import { CheckCircle2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import type { QuizQuestion } from "@quizlytics/types";
import { Button } from "@/components/ui/button";

const STEPS = [
  "Analyzing topic...",
  "Generating questions...",
  "Finalizing...",
];

function GenerationProgress({ step }: { step: number }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card w-[90%] md:w-120 p-8 rounded-2xl shadow-2xl border border-border">
        <h2 className="text-xl font-bold text-foreground text-center mb-8">
          Generating Your Quiz
        </h2>
        <div className="space-y-4">
          {STEPS.map((label, i) => {
            const isCompleted = step > i;
            const isCurrent = step === i;
            return (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  isCompleted
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : isCurrent
                      ? "bg-primary-color/5 border border-primary-color/30"
                      : "bg-muted border border-transparent"
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : isCurrent ? (
                    <Loader2 className="h-6 w-6 text-primary-color animate-spin" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isCompleted
                      ? "text-green-700 dark:text-green-400"
                      : isCurrent
                        ? "text-primary-color"
                        : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
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
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGenerationStep(0);

    // Update steps dynamically every 1.5s while waiting
    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1500);

    try {
      const data = await getMCQ(searchCategory, searchLavel);
      if (!data || data.length === 0) {
        throw new Error("No questions were generated. Please try again.");
      }
      setAllMCQ(data);
      clearInterval(stepInterval);
      setGenerationStep(3);
      // Small pause to let the "Finalizing" success state be visible
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      setAllMCQ([]);
      clearInterval(stepInterval);
      setError(err instanceof Error ? err.message : "Failed to generate quiz. AI might be busy.");
    } finally {
      setIsLoading(false);
    }
  }, [searchCategory, searchLavel, setAllMCQ]);

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
          />
        ) : isLoading ? (
          <GenerationProgress step={generationStep} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Generation Failed</h2>
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
