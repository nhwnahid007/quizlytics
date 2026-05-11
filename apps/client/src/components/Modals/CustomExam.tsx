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
      <div className="bg-white w-[90%] md:w-145 p-8 rounded-lg shadow-lg relative">
        <button
          onClick={() => router.push("/Dashboard")}
          className="absolute top-4 right-4 text-black"
        >
          <X size={24} />
        </button>
        <h1 className="text-primary-color font-bold text-center text-xl md:text-3xl">
          Enter Quiz Key to Start
        </h1>

        <div className="w-full md:w-120 mx-auto mt-6">
          <div className="w-full">
            <input
              type="text"
              name="quizKey"
              onChange={handleChange}
              className="bg-secondary-color/10 placeholder:text-gray-500 w-full py-3 px-4 text-gray-900 rounded-lg text-md md:text-lg text-center focus:outline-none focus:ring-2 focus:ring-primary-color/20 border border-transparent focus:border-primary-color/30 transition-all"
              placeholder="Enter Quiz Key Here"
            />
            {searchError && <p className="text-red-600 text-sm mt-1 text-center">{searchError}</p>}
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
