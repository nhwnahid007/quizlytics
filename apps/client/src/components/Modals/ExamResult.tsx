"use client";
import useRouterHook from "@/app/hooks/useRouterHook";
import {
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  TwitterIcon,
  TwitterShareButton,
  RedditShareButton,
  RedditIcon,
} from "next-share";
import React from "react";
import UserFeedback from "./UserFeedback";
import { CornerDownLeft } from "lucide-react";

const ExamResult = ({ myMark }: { myMark: number | null }) => {
  const router = useRouterHook();

  const handleGoHome = () => {
    router.push("/");
  };

  // Determine the remark based on the score
  let remark = "";
  let remarkColor = "";

  if ((myMark ?? 0) > 7) {
    remark = "Excellent!";
    remarkColor = "text-green-600";
  } else if ((myMark ?? 0) >= 5) {
    remark = "Good!";
    remarkColor = "text-orange-600";
  } else {
    remark = "Needs Improvement!";
    remarkColor = "text-red-600";
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-primary-color bg-opacity-60 w-[90%] max-w-md p-4 md:p-6 rounded-md shadow-lg">
        <div
          className={`w-[150px] h-[150px] md:w-[180px] md:h-[180px] mx-auto my-4 md:my-6 border-8 p-3 md:p-5 rounded-full flex justify-center items-center ${remarkColor}`}
        >
          <h1
            className={`text-3xl md:text-4xl font-bold ${remarkColor}`}
          >{`${myMark} / 10`}</h1>
        </div>
        <h1 className={`mb-3 md:mb-4 text-center text-3xl md:text-4xl ${remarkColor}`}>{remark}</h1>
        
        <div className="flex flex-1 mx-auto items-center justify-center">
          <UserFeedback />
        </div>

        <div className="my-2 flex justify-center gap-2 md:gap-3">
          <button
            onClick={handleGoHome}
            className="bg-red-600 text-[#ffefd3] hover:bg-red-700 font-medium py-1 px-6 md:px-8 text-lg md:text-xl border border-red-600 rounded-sm"
          >
            Exit
          </button>
        </div>

        <div className=" flex justify-center gap-2 md:gap-3 w-full">
          <div className="text-red-600 hover:bg-secondary-color hover:text-[#ffefd3] font-medium py-1 px-6 md:px-8 text-lg md:text-xl rounded-sm hover:border-none">
            <div className="flex justify-center text-gray-300 gap-1"><h2 className="text-lg  md:text-xl mb-3 md:mb-4 text-center">Share Result In Social Media </h2> <CornerDownLeft className="text-gray-300" /></div>
            <div className="mx-auto flex justify-center">
              <FacebookShareButton
                url={"https://quizlytics.vercel.app/"}
                quote={`I scored ${myMark} / 10 on my exam! Check it out on Quizlytics.`}
                hashtag={"#Quizlytics"}
              >
                <FacebookIcon className="animate-bounce" size={32} round />
              </FacebookShareButton>
  
              <PinterestShareButton
                url={"https://quizlytics.vercel.app/"}
                media={`I scored ${myMark} / 10 on my exam! Check it out on Quizlytics.`}
              >
                <PinterestIcon className="mx-2 md:mx-4 animate-bounce" size={32} round />
              </PinterestShareButton>
  
              <TwitterShareButton
                url={"https://quizlytics.vercel.app/"}
                title={`I scored ${myMark} / 10 on my exam! Check it out on Quizlytics.`}
              >
                <TwitterIcon className="animate-bounce" size={32} round />
              </TwitterShareButton>
  
              <RedditShareButton
                url={"https://github.com/next-share"}
                title={
                  "next-share is a social share buttons for your next React apps."
                }
              >
                <RedditIcon className="animate-bounce ml-2 md:ml-4" size={32} round />
              </RedditShareButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
