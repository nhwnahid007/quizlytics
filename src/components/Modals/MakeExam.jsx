"use client";
// import useMakeExam from '@/app/hooks/useMakeExam';
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const MakeExam = ({
  setShowMakeExam,
  setSearchCategory,
  setSearchLavel,
  setLoadData,
}) => {
  const router = useRouter();
  const [searchError, setSearchError] = useState("");
  const [levelError, setLevelError] = useState("");
  const [search, setSearch] = useState();
  const [lavel, setLavel] = useState();

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

    if (!lavel) {
      setLevelError("Must select a level");
      hasError = true;
    } else {
      setLevelError("");
    }

    if (!hasError) {
      setSearchCategory(search);
      setSearchLavel(lavel);
      setShowMakeExam(false);
      setLoadData(true);
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
          Quick Exam
        </h1>
        <div className="w-full md:w-[480px] mx-auto mt-8 flex flex-col md:flex-row text-center md:text-start justify-around">
          <div className="flex flex-col space-y-1">
            <h1 className="font-medium">
              <span className="font-bold">Duration:</span> 300 Seconds
            </h1>
            <h1 className="font-medium">
              <span className="font-bold">Examinee:</span>{" "}
              {name ? name : "Guest"}
            </h1>
          </div>
          <div className="flex flex-col justify-between it  space-y-1">
            <h1 className="font-medium">
              <span className="font-bold">MCQ:</span> 10
            </h1>
            <h1 className="font-medium">
              <span className="font-bold">Total Marks:</span> 1 x 10 = 10
            </h1>
          </div>
        </div>
        <div className="w-full md:w-[480px] mx-auto flex flex-col md:flex-row gap-4 mt-6">
          <div className="w-full md:w-1/2">
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className=" bg-secondary-color bg-opacity-20 text-black w-full py-2 px-4 rounded-lg text-md md:text-lg placeholder-gray-500 h-11"
              placeholder="Write topics"
            />
            {searchError && <p className="text-red-600">{searchError}</p>}
          </div>
          <div className="w-full md:w-1/2">
            <select
              onChange={(e) => setLavel(e.target.value)}
              className="bg-secondary-color bg-opacity-20 w-full py-2 px-4 text-gray-800 rounded-lg text-lg h-11"
            >
              <option value="" disabled selected>
                <span className="text-gray-500 text-md md:text-lg">Level</span>
              </option>
              <option value="beginner">Beginner</option>
              <option value="moderate">Moderate</option>
              <option value="advanced">Advanced</option>
            </select>
            {levelError && <p className="text-red-600">{levelError}</p>}
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

export default MakeExam;
