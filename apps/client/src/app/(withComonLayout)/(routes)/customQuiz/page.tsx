"use client";
import useRouterHook from "@/app/hooks/useRouterHook";
import CustomExam from "@/components/Modals/CustomExam";
import QuizScreen from "@/components/QuizPage/QuizScreen";
import { Button } from "@/components/ui/button";
import { getCustomQuiz } from "@/requests/get";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { QuizQuestion } from "@quizlytics/types";
import type { ManualQuizWithQuestions } from "@/requests/get";

const Page = () => {
  const [quizKey, setQuizKey] = useState<string | null>(null);
  const [customExam, setCustomExam] = useState<boolean>(true);
  const [allQuestions, setAllQuestion] = useState<QuizQuestion[]>([]);
  const [quizSet, setQuizSet] = useState<ManualQuizWithQuestions[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouterHook();

  useEffect(() => {
    const getAllMCQ = async () => {
      try {
        setAllQuestion([]);
        const data = await getCustomQuiz(quizKey);
        // console.log("data", data);
        setQuizSet(data);
        setAllQuestion(data[0]?.quizArr ?? []);
        setIsLoading(false);
        // console.log(allQuestions);
      } catch (error) {
        console.log("data fetching error", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!!!",
          toast: true,
        });
      }
    };
    getAllMCQ();
  }, [quizKey]);

  const handleReturn = () => {
    router.push("/Dashboard");
  };

  return (
    <div>
      {customExam ? (
        <CustomExam
          setCustomExam={setCustomExam}
          setQuizKey={setQuizKey}
          quizKey={quizKey}
        />
      ) : !allQuestions?.length ? (
        <div className="h-screen flex flex-col justify-center items-center">
          <h1 className="text-red-500 font-bold">
            No question loaded as the Quiz Key is invalid! Try again...
          </h1>
          <Button onClick={handleReturn} className="mt-4 bg-primary-color">
            Back to Dashboard
          </Button>
        </div>
      ) : (
        <QuizScreen
          quizKey={quizKey}
          allQuestions={allQuestions}
          quizSet={quizSet}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Page;
