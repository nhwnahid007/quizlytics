"use client";
import useAllMCQ from "@/app/hooks/useAllMCQ";
import useSearchCategory from "@/app/hooks/useSearchCategory";
import useSearchLevel from "@/app/hooks/useSearchLevel";
import MakeExam from "@/components/Modals/MakeExam";
import QuizScreen from "@/components/QuizPage/QuizScreen";
import QuizEditor from "@/components/QuizPage/QuizEditor";
import { getMCQ } from "@/requests/get";
import React, { useEffect, useState, useCallback } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { QuizQuestion } from "@quizlytics/types";

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

  const fetchQuiz = useCallback(async () => {
    setIsLoading(true);
    setGenerationStep(0);

    // Animate through steps
    const timer1 = setTimeout(() => setGenerationStep(1), 2000);
    const timer2 = setTimeout(() => setGenerationStep(2), 5000);

    try {
      const data = await getMCQ(searchCategory, searchLavel);
      setAllMCQ(data);
      setGenerationStep(3);
      // Brief pause to show "Finalizing" completion
      await new Promise((r) => setTimeout(r, 500));
      setShowEditor(true);
    } catch {
      setAllMCQ([]);
    } finally {
      setIsLoading(false);
      clearTimeout(timer1);
      clearTimeout(timer2);
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
