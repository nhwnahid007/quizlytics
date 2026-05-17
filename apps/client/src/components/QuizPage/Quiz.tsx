import { CheckCircle2, Clock3, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizQuestion } from "@quizlytics/types";
import type { MarkedAnswer } from "@/types/client";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/Shared/StateBlocks";
import ConfirmExitModal from "./ConfirmExitModal";
import { cn } from "@/lib/utils";

interface QuizProps {
  question?: QuizQuestion;
  currentQuestion: number;
  totalQuestion: number;
  setAnswer: (index: MarkedAnswer) => void;
}

const QUESTION_SECONDS = 30;

const Quiz = ({
  question,
  currentQuestion,
  totalQuestion,
  setAnswer,
}: QuizProps) => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(QUESTION_SECONDS);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const autoSubmittedRef = useRef(false);

  const progressPercent =
    totalQuestion > 0 ? Math.round((currentQuestion / totalQuestion) * 100) : 0;
  const timerPercent = Math.round((remainingTime / QUESTION_SECONDS) * 100);
  const isTimerWarning = remainingTime <= 5;

  const submitAnswer = useCallback(
    (answer: MarkedAnswer) => {
      autoSubmittedRef.current = true;
      setAnswer(answer);
      setSelectedOption(null);
    },
    [setAnswer]
  );

  useEffect(() => {
    autoSubmittedRef.current = false;
    setRemainingTime(QUESTION_SECONDS);
    const interval = setInterval(() => {
      setRemainingTime(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [question, submitAnswer]);

  useEffect(() => {
    if (remainingTime === 0 && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      submitAnswer(null);
    }
  }, [remainingTime, submitAnswer]);

  const handleNext = () => {
    if (selectedOption === null) return;
    submitAnswer(selectedOption);
  };

  const handleSkip = () => {
    submitAnswer(null);
  };

  if (!question) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-gray-950">
            Question unavailable
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            This quiz question could not be loaded.
          </p>
          <Button
            type="button"
            onClick={() => router.push("/Dashboard")}
            className="mt-5 min-h-11 rounded-xl bg-primary-color px-5 text-white"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-3 py-5 sm:px-4">
      <section className="relative flex w-full max-w-4xl flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-xl shadow-gray-200/60 sm:p-6">
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40"
          aria-label="Close quiz"
        >
          <X size={22} aria-hidden="true" />
        </button>

        <div className="mb-6 pr-12">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary-color">
                Question {currentQuestion} of {totalQuestion}
              </p>
              <h1 className="mt-1 text-sm font-semibold text-gray-500">
                {progressPercent}% complete
              </h1>
            </div>
            <div
              className={cn(
                "inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border px-3 py-2 font-mono text-sm font-bold transition",
                isTimerWarning
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-gray-200 bg-gray-50 text-gray-700"
              )}
              aria-live={isTimerWarning ? "assertive" : "polite"}
            >
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              {remainingTime}s
            </div>
          </div>
          <ProgressBar value={progressPercent} label="Quiz progress" />
          <ProgressBar
            value={timerPercent}
            label="Question timer"
            className="mt-2 h-1 bg-gray-100"
            indicatorClassName={isTimerWarning ? "bg-red-500" : "bg-gray-400"}
          />
        </div>

        <div className="mb-6 rounded-2xl bg-gray-50 p-4 sm:p-5">
          <h2 className="text-lg font-bold leading-7 text-gray-950 sm:text-xl">
            {question.question}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {question.options.map((item: string, index: number) => {
            const isSelected = index === selectedOption;

            return (
              <button
                type="button"
                key={index}
                onClick={() => setSelectedOption(index)}
                aria-pressed={isSelected}
                className={cn(
                  "flex min-h-14 items-center gap-3 rounded-2xl border p-4 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40 sm:text-base",
                  isSelected
                    ? "border-primary-color bg-primary-color/10 text-gray-950 shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:border-primary-color/40 hover:bg-primary-color/5"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-black",
                    isSelected
                      ? "border-primary-color bg-primary-color text-white"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                  )}
                  aria-hidden="true"
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 leading-6">{item}</span>
                {isSelected ? (
                  <>
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 text-primary-color"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Selected</span>
                  </>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            className="min-h-11 rounded-xl border-gray-200 px-5 font-bold text-gray-600 hover:bg-gray-100"
          >
            Skip
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={selectedOption === null}
            className="min-h-11 rounded-xl bg-primary-color px-6 font-bold text-white hover:bg-primary-color/90 disabled:cursor-not-allowed"
          >
            Next Question
          </Button>
        </div>
      </section>

      <ConfirmExitModal
        open={showExitConfirm}
        onOpenChange={setShowExitConfirm}
        onLeave={() => router.push("/Dashboard")}
      />
    </main>
  );
};

export default Quiz;
