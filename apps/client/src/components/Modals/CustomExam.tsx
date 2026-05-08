"use client";
import useRouterHook from "@/app/hooks/useRouterHook";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

interface CustomExamProps {
  setCustomExam: Dispatch<SetStateAction<boolean>>;
  setQuizKey: Dispatch<SetStateAction<string | null>>;
  quizKey: string | null;
}

const CustomExam = ({ setCustomExam, setQuizKey, quizKey }: CustomExamProps) => {
  const [searchError, setSearchError] = useState("");
  const router = useRouterHook();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuizKey(e.target.value);
  };
  const handleStart = () => {

    let hasError = false;

    if (!quizKey) {
      setSearchError("Field is required!");
      hasError = true;
    } else {
      setSearchError("");
    }

    if (!hasError) {
      setCustomExam(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] md:w-[580px] p-8 rounded-lg shadow-lg relative">
        <button
          onClick={() => router.push("/Dashboard")}
          className="absolute top-4 right-4 text-black"
        >
          <X size={24} />
        </button>
        <h1 className="text-primary-color font-bold text-center text-xl md:text-3xl">
          Enter Quiz Key to Start
        </h1>

        <div className="w-full md:w-[480px] mx-auto mt-6">
          <div className="w-full">
            <input
              type="text"
              name="quizKey"
              onChange={handleChange}
              className="bg-secondary-color bg-opacity-20 placeholder-gray-500 w-full py-2 px-4 text-gray-800 rounded-lg text-md md:text-lg text-center"
              placeholder="Enter Quiz Key Here"
            />
            {searchError && <p className="text-red-600">{searchError}</p>}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleStart}
            type="submit"
            className="mt-4 bg-primary-color text-white"
            variant="default"
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomExam;
