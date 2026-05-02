"use client";
// import useMakeExam from '@/app/hooks/useMakeExam';
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import type { Dispatch, SetStateAction } from "react";

interface QuizLinkProps {
  setQuizByLink: Dispatch<SetStateAction<boolean>>;
  setArtLink: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const QuizLink = ({ setQuizByLink, setArtLink, setIsLoading }: QuizLinkProps) => {
  const router = useRouter();
  const [searchError, setSearchError] = useState("");
  const [search, setSearch] = useState<string>("");

  // user session
  const { data: session } = useSession();
  const name = session?.user?.name;

  const handleStart = () => {
    let hasError = false;

    if (!search) {
      setSearchError("Field is required!");
      hasError = true;
    } else {
      setSearchError("");
    }

    if (!hasError) {
      setArtLink(search);
      setQuizByLink(false);
      setIsLoading(true);
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
          Generate Quiz From Link
        </h1>

        <div className="w-full md:w-[480px] mx-auto mt-6">
          <div className="w-full">
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="bg-secondary-color bg-opacity-20 placeholder-gray-500 w-full py-2 px-4 text-gray-800 rounded-lg text-md md:text-lg text-center"
              placeholder="Paste Any Article URL Here"
            />
            {searchError && <p className="text-red-600">{searchError}</p>}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleStart}
            className="btn bg-primary-color text-white text-lg px-12"
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizLink;
