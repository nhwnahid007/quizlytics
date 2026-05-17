"use client";
// import useMakeExam from '@/app/hooks/useMakeExam';
import { Info, X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import type { Dispatch, SetStateAction } from "react";

interface MakeExamProps {
  setShowMakeExam: Dispatch<SetStateAction<boolean>>;
  setSearchCategory: Dispatch<SetStateAction<string>>;
  setSearchLavel: Dispatch<SetStateAction<string>>;
  setLoadData: Dispatch<SetStateAction<boolean>>;
  questionCount?: number;
  setQuestionCount?: Dispatch<SetStateAction<number>>;
  includeExplanations?: boolean;
  setIncludeExplanations?: Dispatch<SetStateAction<boolean>>;
}

const MakeExam = ({
  setShowMakeExam,
  setSearchCategory,
  setSearchLavel,
  setLoadData,
  questionCount = 10,
  setQuestionCount,
  includeExplanations = false,
  setIncludeExplanations,
}: MakeExamProps) => {
  const router = useRouter();
  const [searchError, setSearchError] = useState("");
  const [levelError, setLevelError] = useState("");
  const [search, setSearch] = useState<string>("");
  const [lavel, setLavel] = useState<string>("");

  // user session
  const { data: session } = useSession();
  const name = session?.user?.name;

  const handleStart = () => {
    let hasError = false;
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      setSearchError("Enter a topic to continue.");
      hasError = true;
    } else {
      setSearchError("");
    }

    if (!lavel) {
      setLevelError("Must select a level");
      hasError = true;
    } else {
      setLevelError("");
    }

    if (!hasError) {
      setSearchCategory(trimmedSearch);
      setSearchLavel(lavel);
      setShowMakeExam(false);
      setLoadData(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={() => router.push("/Dashboard")}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40"
          aria-label="Close AI quiz setup"
        >
          <X size={22} aria-hidden="true" />
        </button>
        <h1 className="pr-10 text-center text-2xl font-black text-gray-950 md:text-3xl">
          Start AI Quiz
        </h1>
        <p className="mx-auto mt-2 max-w-md text-center text-sm leading-6 text-gray-500">
          Generate questions from any topic. Pick a difficulty and question
          count before starting.
        </p>

        <div className="mx-auto mt-6 grid max-w-xl grid-cols-1 gap-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 sm:grid-cols-3">
          <div>
            <span className="block font-bold text-gray-950">Duration</span>
            30 seconds/question
          </div>
          <div>
            <span className="block font-bold text-gray-950">Examinee</span>
            {name ? name : "Guest"}
          </div>
          <div>
            <span className="block font-bold text-gray-950">Marks</span>1 per
            question
          </div>
        </div>

        <div className="mx-auto mt-6 grid w-full max-w-xl grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-3">
            <label
              htmlFor="quiz-topic"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Topic
            </label>
            <input
              id="quiz-topic"
              onChange={e => setSearch(e.target.value)}
              type="text"
              className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder:text-gray-400 focus:border-primary-color/40 focus:outline-none focus:ring-2 focus:ring-primary-color/20"
              placeholder="Example: Photosynthesis, JavaScript arrays"
              aria-describedby={searchError ? "quiz-topic-error" : undefined}
            />
            {searchError && (
              <p id="quiz-topic-error" className="mt-1 text-sm text-red-600">
                {searchError}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="quiz-level"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Difficulty
            </label>
            <select
              id="quiz-level"
              value={lavel}
              onChange={e => setLavel(e.target.value)}
              className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 focus:border-primary-color/40 focus:outline-none focus:ring-2 focus:ring-primary-color/20"
              aria-describedby={levelError ? "quiz-level-error" : undefined}
            >
              <option value="" disabled>
                Level
              </option>
              <option value="beginner">Beginner</option>
              <option value="moderate">Moderate</option>
              <option value="advanced">Advanced</option>
            </select>
            {levelError && (
              <p id="quiz-level-error" className="mt-1 text-sm text-red-600">
                {levelError}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="question-count"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Questions
            </label>
            <select
              id="question-count"
              value={questionCount}
              onChange={e => setQuestionCount?.(Number(e.target.value))}
              className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 focus:border-primary-color/40 focus:outline-none focus:ring-2 focus:ring-primary-color/20"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 md:col-span-3">
            <label className="flex min-h-6 items-center gap-3 text-sm font-bold text-gray-700">
              <input
                type="checkbox"
                checked={includeExplanations}
                onChange={e => setIncludeExplanations?.(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-primary-color"
              />
              Add answer explanations
            </label>
            <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-gray-500">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-color" />
              This can take longer because AI writes reasoning for each answer.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            onClick={handleStart}
            className="min-h-12 w-full max-w-xs rounded-xl bg-primary-color px-8 text-base font-bold text-white hover:bg-primary-color/90"
          >
            Generate Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MakeExam;
