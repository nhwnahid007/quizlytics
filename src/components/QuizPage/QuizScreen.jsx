"use client";
import getMCQ, { getCustomQuiz } from "@/requests/get";
import React, { useEffect, useState } from "react";
import QuizResult from "./QuizResult";
import Quiz from "./Quiz";
import LoadingSpinner from "../Spinner/LoadingSpinner";

const QuizScreen = ({
  quizKey,
  allQuestions = [], // Default to an empty array
  quizSet,
  isLoading,
  searchCategory,
  searchLavel,
  artLink,
}) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const [markedAnswer, setMarkedAnswer] = useState(
    new Array(allQuestions?.length)
  );

  // console.log("all questions", allQuestions);
  // console.log(quizKey);

  const isQuizEnded = currentQuizIndex === allQuestions?.length;

  // console.log(allQuestions);

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
    console.error("allQuestions is not an array:", allQuestions);
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
          setAnswer={(index) => {
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
