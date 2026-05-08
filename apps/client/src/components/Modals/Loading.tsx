"use client"
import React from 'react';
import type { Dispatch, SetStateAction } from "react";

const Loading = ({ setShowLoading }: { setShowLoading?: Dispatch<SetStateAction<boolean>> }) => {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md z-50 flex flex-col items-center justify-center">
          {/* Animated spinner */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="rounded-full border-8 border-t-transparent border-[#ffefd3] animate-spin h-24 w-24"></div>
          </div>
    
          {/* Stylish loading text */}
          <div className="flex flex-col items-center">
            <h1 className="md:text-6xl text-xl text-red font-semibold bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text animate-pulse">
              Question in processing...
            </h1>
            <p className="mt-2 text-[#ffefd3] text-lg opacity-80">Please wait a moment</p>
          </div>
        </div>
      );
};

export default Loading;
