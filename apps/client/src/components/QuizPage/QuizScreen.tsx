"use client";
import getMCQ, { getCustomQuiz } from "@/requests/get";
import React, { useEffect, useState } from "react";
import QuizResult from "./QuizResult";
import Quiz from "./Quiz";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import type { QuizQuestion } from "@quizlytics/types";
import type { ManualQuizRecord, MarkedAnswer } from "@/types/client";

const QuizScreen = ({
  quizKey,
  allQuestions = [], // Default to an empty array
  quizSet,
  isLoading = false,
  searchCategory,
  searchLavel,
  artLink,
}: {
  quizKey?: string | null;
  allQuestions?: QuizQuestion[];
  quizSet?: ManualQuizRecord[];
  isLoading?: boolean;
  searchCategory?: string;
  searchLavel?: string;
  artLink?: string;
}) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);

  const [markedAnswer, setMarkedAnswer] = useState<MarkedAnswer[]>(
    new Array(allQuestions?.length)
  );

  const isQuizEnded = currentQuizIndex === allQuestions?.length;

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

  // Check if allQuestions is an array
  if (!Array.isArray(allQuestions)) {
    return null;
    return <div>Error: Questions data is not available.</div>;
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto text-center  py-30">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen">
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
              let newArray = [...arr];
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
