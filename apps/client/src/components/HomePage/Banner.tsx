"use client";

import useRouterHook from "@/app/hooks/useRouterHook";
import React, { useEffect, useState } from "react";
import SectionTitle, { SectionTitleMinimal } from "../Shared/SectionTitle";
import Image from "next/image";
import { Rocket, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";

const Banner = () => {
  const router = useRouterHook();
  const [isMounted, setIsMounted] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGetStarted = () => {
    if (session?.status === "authenticated") {
      router.push("/Dashboard"); // or wherever you want logged-in users to go
    } else {
      router.push("/login"); // redirect to login page for non-authenticated users
    }
  };

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <div className="relative min-h-screen lg:h-[90vh] text-black bg-gradient-to-br from-purple-50 to-white">
      {/* Floating UI Elements Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {/* Left Side Elements */}
        <div className="absolute -left-10 top-20 w-40 h-40 bg-neutral-200 rounded-lg transform rotate-12 animate-float"></div>
        <div className="absolute left-1/4 top-1/3 w-28 h-28 bg-pink-200 rounded-lg transform rotate-24 animate-float"></div>
        <div className="absolute left-10 bottom-1/3 w-16 h-16 bg-green-200 rounded-lg transform -rotate-12 animate-float"></div>
        <div className="absolute left-1/3 bottom-40 w-36 h-36 bg-primary-color bg-opacity-25 rounded-lg transform rotate-45 animate-float"></div>

        {/* Right Side Elements */}
        <div className="absolute right-20 top-40 w-32 h-32 bg-blue-200 rounded-lg transform -rotate-12 animate-float-delayed"></div>
        <div className="absolute right-1/4 top-20 w-24 h-24 bg-purple-200 rounded-full transform animate-float-delayed"></div>
        <div className="absolute right-1/3 bottom-1/4 w-20 h-20 bg-yellow-200 rounded-full transform animate-float-delayed"></div>
        <div className="absolute right-10 bottom-20 w-32 h-32 bg-blue-100 rounded-full transform animate-float-delayed"></div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 pt-7 md:pt-10">
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl text-center  h-full flex flex-col">
            {/* Top Content */}
            <div>
              {/* Intro Section */}
              <div className="md:mb-4 pt-5 sm:mb-8 mt-12">
                <SectionTitleMinimal
                  heading="Master Any Topic Through Interactive Quizzes"
                  subHeading={"Transform Your Learning Journey"}
                />
              </div>

              {/* Description Box */}
              <div className="p-2 max-w-6xl mb-4 2xl:mb-2">
                <p className="text-[#555555] text-base sm:text-lg md:text-xl 2xl:text-2xl leading-relaxed">
                  <span className="inline-flex items-center">
                    <Rocket className="w-6 h-6 text-primary-color mr-2" />
                    <span className="font-bold text-purple-600 2xl:text-3xl">
                      Transform Your Learning Journey
                    </span>
                  </span>{" "}
                  with our
                  <span className="font-bold text-primary-color 2xl:text-3xl">
                    {" "}
                    AI-Powered Quiz Platform!
                  </span>{" "}
                  Whether you&apos;re preparing for exams, upskilling for your
                  career, or simply curious to learn, we&apos;ve got you
                  covered. Create personalized quizzes, generate AI questions,
                  or instantly turn any article into an interactive learning
                  experience.
                  <span className="font-bold mt-2 text-primary-color inline-flex items-center 2xl:text-3xl">
                    Join thousands of learners who&apos;ve already unlocked
                    their potential!
                    <Sparkles className="w-6 h-6 ml-2" />
                  </span>
                </p>
              </div>
            </div>

            {/* Centered Buttons */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-center items-center gap-2 sm:gap-4 lg:gap-6">
                <Button
                  onClick={handleGetStarted}
                  className="w-[250px] md:w-[350px] lg:w-[400px] px-6 sm:px-8 py-3 sm:py-4 lg:py-8 rounded-xl font-bold text-white  text-base sm:text-lg lg:text-xl 2xl:text-2xl"
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Bottom Content */}
            <div>
              {/* Trust Badges Marquee Section */}
              <div className="mb-4 2xl:mb-20 2xl:mt-2">
                {/* Removed Marquee component */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Banner;
