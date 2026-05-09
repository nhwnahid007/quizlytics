"use client";
import React, { useState, useCallback } from "react";
import QuizResult from "./QuizResult";
import Quiz from "./Quiz";
import QuizTimer from "./QuizTimer";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import type { QuizQuestion } from "@quizlytics/types";
import type { ManualQuizRecord, MarkedAnswer } from "@/types/client";

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
      percentageMark: Math.trunc((correctAnswers / allQuestions.length) * 100),
    };
  };

  const handleTimeUp = useCallback(() => {
    setForceEnd(true);
  }, []);

  // Check if allQuestions is an array
  if (!Array.isArray(allQuestions)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-30">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen">
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
          setAnswer={(index: MarkedAnswer) => {
            setMarkedAnswer((arr) => {
              const newArray = [...arr];
              newArray[currentQuizIndex] = index;
              return newArray;
            });
            setCurrentQuizIndex(currentQuizIndex + 1);
          }}
        />
      )}
    </div>
  );
};

export default QuizScreen;
