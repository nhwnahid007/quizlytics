"use client";
import useAllMCQ from "@/app/hooks/useAllMCQ";
import useRouterHook from "@/app/hooks/useRouterHook";
import useSearchCategory from "@/app/hooks/useSearchCategory";
import useSearchLevel from "@/app/hooks/useSearchLevel";
import MakeExam from "@/components/Modals/MakeExam";
import QuizScreen from "@/components/QuizPage/QuizScreen";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { getMCQ } from "@/requests/get";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [searchCategory, setSearchCategory] = useSearchCategory();
  const [searchLavel, setSearchLavel] = useSearchLevel();
  const [loadData, setLoadData] = useState(false);
  const [allMCQ, setAllMCQ] = useAllMCQ();
  const [showMakeExam, setShowMakeExam] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllMCQ = async () => {
      try {
        const data = await getMCQ(searchCategory, searchLavel);
        console.log(data);
        setAllMCQ(data); // Set fetched MCQs
        setIsLoading(false);
      } catch (error) {
        console.error("Data fetching error:", error);
      }
    };

    if (loadData) {
      getAllMCQ(); // Fetch only if category and level are set
    }
  }, [loadData, searchCategory, searchLavel, setAllMCQ]);

  const router = useRouterHook();

  const handleReturn = () => {
    router.push("/Dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Content section */}
      <div className="flex-grow">
        {showMakeExam ? (
          <MakeExam
            setShowMakeExam={setShowMakeExam}
            setSearchLavel={setSearchLavel}
            setSearchCategory={setSearchCategory}
            setLoadData={setLoadData}
          />
        ) : isLoading ? (
          <div className="h-screen flex justify-center items-center">
            {/* <Spinner /> */}
            <LoadingSpinner />
          </div>
        ) : !allMCQ.length ? (
          <div className="h-screen flex flex-col justify-center items-center px-12 text-center">
            <h1 className="text-red-500 font-bold">
              No question loaded due to AI is Busy. Try again...
            </h1>
            <Button onClick={handleReturn} className="mt-4 bg-primary-color">
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <QuizScreen
            allQuestions={allMCQ}
            isLoading={isLoading}
            searchLavel={searchLavel}
            searchCategory={searchCategory}
          />
        )}
      </div>

      {/* Footer */}
    </div>
  );
};

export default Page;
