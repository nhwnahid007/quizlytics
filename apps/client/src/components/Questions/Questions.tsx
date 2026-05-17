"use client";
import React, { useEffect, useState } from "react";
import MCQ from "../Shared/MCQ";
import type { Dispatch, SetStateAction } from "react";
import type { QuizQuestion, UserExamAnswer } from "@quizlytics/types";

interface QuestionsProps {
  currentMCQ: number;
  setCurrentMCQ: Dispatch<SetStateAction<number>>;
  userExamData: UserExamAnswer[];
  setUserExamData: Dispatch<SetStateAction<UserExamAnswer[]>>;
  examId: string;
  setExamId: Dispatch<SetStateAction<string>>;
  allMCQ: QuizQuestion[];
  setAllMCQ?: Dispatch<SetStateAction<QuizQuestion[]>>;
  setShowResult: Dispatch<SetStateAction<boolean>>;
}

const Questions = ({
  currentMCQ,
  setCurrentMCQ,
  userExamData,
  setUserExamData,
  examId,
  setExamId,
  allMCQ,
  setShowResult,
}: QuestionsProps) => {
  const [exactMCQ, setExactMCQ] = useState<QuizQuestion | null>(null);

  useEffect(() => {
    const getOneExpected = () => {
      const expectedOne = allMCQ.find(
        question => Number(question.id) === currentMCQ
      );
      setExactMCQ(expectedOne ?? null);
    };
    getOneExpected();
  }, [allMCQ, currentMCQ]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <MCQ
        currentMCQ={currentMCQ}
        setCurrentMCQ={setCurrentMCQ}
        exactMCQ={exactMCQ}
        userExamData={userExamData}
        setUserExamData={setUserExamData}
        examId={examId}
        setExamId={setExamId}
        setShowResult={setShowResult}
      />
    </div>
  );
};

export default Questions;
