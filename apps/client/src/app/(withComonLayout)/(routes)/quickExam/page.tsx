"use client";
import useAllMCQ from "@/app/hooks/useAllMCQ";
import useSearchCategory from "@/app/hooks/useSearchCategory";
import useSearchLevel from "@/app/hooks/useSearchLevel";
import MakeExam from "@/components/Modals/MakeExam";
import QuizScreen from "@/components/QuizPage/QuizScreen";
import { getMCQ } from "@/requests/get";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [searchCategory, setSearchCategory] = useSearchCategory();
  const [searchLavel, setSearchLavel] = useSearchLevel();
  const [loadData, setLoadData] = useState<boolean>(false);
  const [allMCQ, setAllMCQ] = useAllMCQ();
  const [showMakeExam, setShowMakeExam] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getAllMCQ = async () => {
      try {
        const data = await getMCQ(searchCategory, searchLavel);
        setAllMCQ(data);
        setIsLoading(false);
      } catch {
        setAllMCQ([]);
        setIsLoading(false);
      }
    };

    if (loadData) {
      getAllMCQ();
    }
  }, [loadData, searchCategory, searchLavel, setAllMCQ]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {showMakeExam ? (
          <MakeExam
            setShowMakeExam={setShowMakeExam}
            setSearchLavel={setSearchLavel}
            setSearchCategory={setSearchCategory}
            setLoadData={setLoadData}
          />
        ) : (
          <QuizScreen
            allQuestions={allMCQ}
            isLoading={isLoading}
            searchLavel={searchLavel}
            searchCategory={searchCategory}
          />
        )}
      </div>

    </div>
  );
};

export default Page;
