"use client";

import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import type { Dispatch, SetStateAction } from "react";
import type { QuizQuestion, UserExamAnswer } from "@quizlytics/types";
import { CheckCircle2, Clock3 } from "lucide-react";
import { ProgressBar } from "./StateBlocks";
import { cn } from "@/lib/utils";

interface MCQProps {
  currentMCQ: number;
  setCurrentMCQ: Dispatch<SetStateAction<number>>;
  exactMCQ: QuizQuestion | null;
  userExamData: UserExamAnswer[];
  setUserExamData: Dispatch<SetStateAction<UserExamAnswer[]>>;
  examId: string;
  setExamId: Dispatch<SetStateAction<string>>;
  setShowResult: Dispatch<SetStateAction<boolean>>;
}

const EMPTY_OPTIONS: string[] = [];
const QUESTION_SECONDS = 10;
const TOTAL_QUESTIONS = 10;

const MCQ = ({
  currentMCQ,
  setCurrentMCQ,
  exactMCQ,
  setUserExamData,
  examId,
  setExamId,
  setShowResult,
}: MCQProps) => {
  const { id, question } = exactMCQ || {};
  const options = exactMCQ?.options ?? EMPTY_OPTIONS;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] =
    useState<number>(QUESTION_SECONDS);
  const autoAdvancedRef = useRef(false);

  const { data: session } = useSession();
  const name = session?.user?.name;
  const email = session?.user?.email;
  const profile = session?.user?.profile;
  const image = session?.user?.image;

  function generateExamId() {
    const array = new Uint8Array(8);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

  useEffect(() => {
    const generatedExamId = generateExamId();
    setExamId(generatedExamId);
  }, [setExamId]);

  useEffect(() => {
    autoAdvancedRef.current = false;
    setSelectedAnswer(null);
    setSecondsRemaining(QUESTION_SECONDS);
  }, [currentMCQ]);

  const saveExamData = useCallback(
    (answer: string | null) => {
      const examData = {
        ...(exactMCQ ?? {}),
        examId,
        exam_date: new Date().toISOString(),
        user_answer: answer,
        user_name: name ?? null,
        user_email: email ?? null,
        user_profile: profile || image || null,
        options,
      };

      setUserExamData((prevData: UserExamAnswer[]) => {
        const isAlreadyRecorded = prevData.some(
          item => item.id === examData.id
        );
        if (!isAlreadyRecorded) {
          return [...prevData, examData];
        }
        return prevData;
      });
    },
    [email, exactMCQ, examId, image, name, options, profile, setUserExamData]
  );

  const advanceQuiz = useCallback(
    (answer: string | null) => {
      autoAdvancedRef.current = true;
      saveExamData(answer);
      if (currentMCQ < TOTAL_QUESTIONS) {
        setCurrentMCQ(currentMCQ + 1);
      } else {
        setShowResult(true);
      }
    },
    [currentMCQ, saveExamData, setCurrentMCQ, setShowResult]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsRemaining(prevSeconds => Math.max(prevSeconds - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentMCQ]);

  useEffect(() => {
    if (secondsRemaining === 0 && !autoAdvancedRef.current) {
      autoAdvancedRef.current = true;
      advanceQuiz(null);
    }
  }, [advanceQuiz, secondsRemaining]);

  const handleNext = () => {
    if (!selectedAnswer) return;
    advanceQuiz(selectedAnswer);
  };

  const handleSkip = () => {
    advanceQuiz(null);
  };

  const progressValue = Math.round((currentMCQ / TOTAL_QUESTIONS) * 100);
  const timerWarning = secondsRemaining <= 5;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary-color">
            Question {currentMCQ} of {TOTAL_QUESTIONS}
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-500">
            {progressValue}% complete
          </p>
        </div>
        <div
          className={cn(
            "inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border px-3 py-2 font-mono text-sm font-bold",
            timerWarning
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-gray-200 bg-gray-50 text-gray-700"
          )}
        >
          <Clock3 className="h-4 w-4" aria-hidden="true" />
          {secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}s
        </div>
      </div>

      <ProgressBar value={progressValue} label="Exam progress" />

      <h3 className="my-5 rounded-2xl bg-gray-50 p-4 text-lg font-bold leading-7 text-gray-950">
        {question}
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option, index) => {
          const inputId = `radio${id}-${index}`;
          const selected = selectedAnswer === option;

          return (
            <label
              htmlFor={inputId}
              key={option}
              className={cn(
                "flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-primary-color/40",
                selected
                  ? "border-primary-color bg-primary-color/10 text-gray-950"
                  : "border-gray-200 bg-white text-gray-700 hover:border-primary-color/40 hover:bg-primary-color/5"
              )}
            >
              <input
                type="radio"
                name="radio"
                id={inputId}
                value={option}
                checked={selected}
                onChange={event => setSelectedAnswer(event.target.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-black",
                  selected
                    ? "border-primary-color bg-primary-color text-white"
                    : "border-gray-200 bg-gray-50 text-gray-500"
                )}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1 leading-6">{option}</span>
              {selected ? (
                <CheckCircle2
                  className="h-5 w-5 text-primary-color"
                  aria-hidden="true"
                />
              ) : null}
            </label>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleSkip}
          className="min-h-11 rounded-xl border-gray-200 px-5 font-bold text-gray-600"
        >
          Skip
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="min-h-11 rounded-xl bg-primary-color px-6 font-bold text-white disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </section>
  );
};

export default MCQ;
