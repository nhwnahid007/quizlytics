"use client";
// import useMakeExam from '@/app/hooks/useMakeExam';
import { X } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import type { Dispatch, SetStateAction } from "react";

interface QuizLinkProps {
  setQuizByLink: Dispatch<SetStateAction<boolean>>;
  setArtLink: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const QuizLink = ({
  setQuizByLink,
  setArtLink,
  setIsLoading,
}: QuizLinkProps) => {
  const router = useRouter();
  const [searchError, setSearchError] = useState("");
  const [search, setSearch] = useState<string>("");

  const handleStart = () => {
    let hasError = false;
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      setSearchError("Paste an article or resource link.");
      hasError = true;
    } else {
      try {
        new URL(trimmedSearch);
        setSearchError("");
      } catch {
        setSearchError("Enter a valid URL, including https://");
        hasError = true;
      }
    }

    if (!hasError) {
      setArtLink(trimmedSearch);
      setQuizByLink(false);
      setIsLoading(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={() => router.push("/Dashboard")}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40"
          aria-label="Close link quiz setup"
        >
          <X size={22} aria-hidden="true" />
        </button>
        <h1 className="pr-10 text-center text-2xl font-black text-gray-950 md:text-3xl">
          Generate Quiz from Link
        </h1>
        <p className="mx-auto mt-2 max-w-md text-center text-sm leading-6 text-gray-500">
          Paste an article or resource link. Quizlytics will turn the content
          into practice questions.
        </p>

        <div className="mx-auto mt-6 w-full max-w-md">
          <div>
            <label
              htmlFor="article-link"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Article link
            </label>
            <input
              id="article-link"
              onChange={e => setSearch(e.target.value)}
              type="url"
              className="min-h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder:text-gray-400 focus:border-primary-color/40 focus:outline-none focus:ring-2 focus:ring-primary-color/20"
              placeholder="https://example.com/article"
              aria-describedby={searchError ? "article-link-error" : undefined}
            />
            {searchError && (
              <p
                id="article-link-error"
                className="mt-2 text-center text-sm text-red-600"
              >
                {searchError}
              </p>
            )}
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

export default QuizLink;
