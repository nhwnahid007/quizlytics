"use client";
import { useState, useEffect } from "react";
import Banner from "@/components/HomePage/Banner";
import Overview from "@/components/HomePage/Overview";
import Footer from "@/components/Shared/Footer";
import Feedback from "@/components/HomePage/Feedback";
import Partnership from "@/components/HomePage/Partnership";
import Faq from "@/components/HomePage/Faq";
import HelloTeacher from "@/components/HomePage/HelloTeacher";
import HowItWorks from "@/components/HomePage/HowItWorks";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative overflow-hidden min-h-screen text-black bg-gradient-to-br from-purple-50 to-white">
      {/* Floating UI Elements Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {/* Left Side Elements */}
        <div className="absolute -left-10 top-20 w-40 h-40 bg-neutral-200 rounded-lg transform rotate-12 animate-float"></div>
        <div className="absolute left-1/4 top-1/3 w-28 h-28 bg-pink-200 rounded-lg transform rotate-24 animate-float"></div>
        <div className="absolute left-10 bottom-1/3 w-16 h-16 bg-green-200 rounded-lg transform -rotate-12 animate-float"></div>
        <div className="absolute left-1/3 bottom-40 w-36 h-36 bg-primary-color bg-opacity-25 rounded-lg transform rotate-45 animate-float"></div>

        {/* Additional Purple Elements */}
        <div className="absolute left-1/2 top-1/4 w-20 h-20 bg-purple-300 rounded-lg transform rotate-45 animate-float"></div>
        <div className="absolute left-1/3 top-1/2 w-24 h-24 bg-purple-400 rounded-full transform -rotate-30 animate-float"></div>
        <div className="absolute left-1/4 bottom-1/4 w-28 h-28 bg-purple-500 rounded-lg transform rotate-60 animate-float"></div>

        {/* Right Side Elements */}
        <div className="absolute right-20 top-40 w-32 h-32 bg-blue-200 rounded-lg transform -rotate-12 animate-float-delayed"></div>
        <div className="absolute right-1/4 top-20 w-24 h-24 bg-purple-200 rounded-full transform animate-float-delayed"></div>
        <div className="absolute right-1/3 bottom-1/4 w-20 h-20 bg-yellow-200 rounded-full transform animate-float-delayed"></div>
        <div className="absolute right-10 bottom-20 w-32 h-32 bg-blue-100 rounded-full transform animate-float-delayed"></div>

        {/* Additional Purple Elements */}
        <div className="absolute right-1/2 bottom-1/3 w-16 h-16 bg-purple-600 rounded-full transform rotate-15 animate-float-delayed"></div>
        <div className="absolute right-1/4 bottom-1/2 w-32 h-32 bg-purple-700 rounded-lg transform -rotate-45 animate-float-delayed"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Banner />
        <HowItWorks />
        <HelloTeacher />
        <Overview />
        <Partnership />
        <Feedback />
        <Faq />
      </div>
    </div>
  );
}
