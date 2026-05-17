"use client";
import React, { useCallback, useEffect, useState } from "react";
import QuizResult from "./QuizResult";
import Quiz from "./Quiz";
import QuizTimer from "./QuizTimer";
import type { QuizQuestion } from "@quizlytics/types";
import type { ManualQuizRecord, MarkedAnswer } from "@/types/client";
import { ErrorState, SkeletonBlock } from "@/components/Shared/StateBlocks";

const QuizScreen = ({
  quizKey,
  allQuestions = [],
  quizSet,
  isLoading = false,
  searchCategory,
  searchLavel,
  artLink,
  timerMinutes,
}: {
  quizKey?: string | null;
  allQuestions?: QuizQuestion[];
  quizSet?: ManualQuizRecord[];
  isLoading?: boolean;
  searchCategory?: string;
  searchLavel?: string;
  artLink?: string;
  timerMinutes?: number | null;
}) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [forceEnd, setForceEnd] = useState(false);

  const [markedAnswer, setMarkedAnswer] = useState<MarkedAnswer[]>(
    new Array(allQuestions?.length)
  );

  const isQuizEnded = currentQuizIndex === allQuestions?.length || forceEnd;

  useEffect(() => {
    setCurrentQuizIndex(0);
    setForceEnd(false);
    setMarkedAnswer(new Array(allQuestions.length));
  }, [allQuestions.length]);

  const calculateResult = () => {
    let correctAnswers = 0;
    allQuestions?.forEach((element, index) => {
      if (element.correct_answer == markedAnswer[index]) {
        correctAnswers++;
      }
    });

    return {
      totalQuiz: allQuestions?.length,
      correctAnswers,
      percentageMark:
        allQuestions.length > 0
          ? Math.trunc((correctAnswers / allQuestions.length) * 100)
          : 0,
    };
  };

  const handleTimeUp = useCallback(() => {
    setForceEnd(true);
  }, []);

  if (!Array.isArray(allQuestions)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <ErrorState
          title="Quiz could not load"
          description="The questions returned by the server were not in the expected format."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center p-4">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-5 w-44" />
            </div>
            <SkeletonBlock className="h-11 w-20 rounded-xl" />
          </div>
          <SkeletonBlock className="mb-6 h-2 w-full" />
          <SkeletonBlock className="mb-6 h-28 w-full rounded-2xl" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map(item => (
              <SkeletonBlock key={item} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <ErrorState
          title="No questions found"
          description="This quiz has no questions yet. Try another quiz mode or retry generation."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Timer */}
      {timerMinutes && !isQuizEnded && (
        <QuizTimer
          durationMinutes={timerMinutes}
          quizKey={quizKey}
          onTimeUp={handleTimeUp}
        />
      )}

      {isQuizEnded ? (
        <QuizResult
          quizSet={quizSet}
          quizStartKey={quizKey}
          result={calculateResult()}
          markedAnswer={markedAnswer}
          allQuestions={allQuestions}
          searchLavel={searchLavel}
          searchCategory={searchCategory}
          artLink={artLink}
          isQuizEnded
        />
      ) : (
        <Quiz
          question={allQuestions[currentQuizIndex]}
          currentQuestion={currentQuizIndex + 1}
          totalQuestion={allQuestions?.length}
          currentAnswer={markedAnswer[currentQuizIndex]}
          onBack={() => {
            setCurrentQuizIndex(index => Math.max(index - 1, 0));
          }}
          setAnswer={(index: MarkedAnswer) => {
            setMarkedAnswer(arr => {
              const newArray = [...arr];
              newArray[currentQuizIndex] = index;
              return newArray;
            });
            setCurrentQuizIndex(index => index + 1);
          }}
        />
      )}
    </div>
  );
};

export default QuizScreen;
