"use client";

import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { SkeletonBlock } from "@/components/Shared/StateBlocks";

const Loading = ({
  setShowLoading: _setShowLoading,
}: {
  setShowLoading?: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl">
        <SkeletonBlock className="mx-auto mb-4 h-12 w-12 rounded-xl" />
        <h1 className="text-xl font-black text-gray-950">
          Generating questions
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Please wait while Quizlytics prepares your quiz.
        </p>
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map(item => (
            <SkeletonBlock key={item} className="h-11 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
