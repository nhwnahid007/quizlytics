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

const CustomExam = ({
  setCustomExam,
  setQuizKey,
  quizKey,
}: CustomExamProps) => {
  const [searchError, setSearchError] = useState("");
  const router = useRouterHook();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuizKey(e.target.value);
  };
  const handleStart = () => {
    let hasError = false;
    const trimmedKey = quizKey?.trim() ?? "";

    if (!trimmedKey) {
      setSearchError("Enter a quiz key to continue.");
      hasError = true;
    } else {
      setSearchError("");
    }

    if (!hasError) {
      setQuizKey(trimmedKey);
      setCustomExam(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={() => router.push("/Dashboard")}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40"
          aria-label="Close custom quiz setup"
        >
          <X size={22} aria-hidden="true" />
        </button>
        <h1 className="pr-10 text-center text-2xl font-black text-gray-950 md:text-3xl">
          Join Quiz with Key
        </h1>
        <p className="mx-auto mt-2 max-w-md text-center text-sm leading-6 text-gray-500">
          Enter the key shared by your teacher or admin to open an assigned
          quiz.
        </p>

        <div className="mx-auto mt-6 w-full max-w-md">
          <div>
            <label
              htmlFor="quiz-key"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Quiz key
            </label>
            <input
              id="quiz-key"
              type="text"
              name="quizKey"
              onChange={handleChange}
              className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-center text-gray-900 placeholder:text-gray-400 focus:border-primary-color/40 focus:outline-none focus:ring-2 focus:ring-primary-color/20"
              placeholder="Enter quiz key"
              aria-describedby={searchError ? "quiz-key-error" : undefined}
            />
            {searchError && (
              <p
                id="quiz-key-error"
                className="mt-2 text-center text-sm text-red-600"
              >
                {searchError}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleStart}
            type="button"
            className="min-h-12 w-full max-w-xs rounded-xl bg-primary-color px-8 text-base font-bold text-white hover:bg-primary-color/90"
            variant="default"
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomExam;
