"use client";
import useRouterHook from "@/app/hooks/useRouterHook";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";

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
import LoadingSpinner from "../Spinner/LoadingSpinner";
import UserFeedback from "../Modals/UserFeedback";
import type { ApiMessageResponse, QuizQuestion, QuizResultSummary } from "@quizlytics/types";
import type { ManualQuizRecord, MarkedAnswer } from "@/types/client";

const QuizResult = ({
  result,
  markedAnswer,
  allQuestions,
  quizStartKey,
  quizSet,
  searchCategory,
  searchLavel,
  artLink,
}: {
  result: QuizResultSummary;
  markedAnswer: MarkedAnswer[];
  allQuestions: QuizQuestion[];
  quizStartKey?: string | null;
  quizSet?: ManualQuizRecord[];
  searchCategory?: string;
  searchLavel?: string;
  artLink?: string;
  isQuizEnded?: boolean;
}) => {
  console.log("quizSet:", quizSet);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  console.log("markedAnswers", markedAnswer);
  console.log("allQuestions", allQuestions);
  console.log("quizStartKey", quizStartKey);
  // access next auth session
  const { data: session } = useSession();
  const name = session?.user?.name;
  const profile = session?.user?.profile;
  const image = session?.user?.image;
  const email = session?.user?.email;
  console.log(session);

  const attemptDetails = {
    quizStartKey,
    date: new Date().toISOString(),
    linkId: "1001",
    quizTitle:
      quizSet && quizSet.length > 0 && quizSet[0].quizTitle
        ? quizSet[0].quizTitle
        : searchCategory || "Untitled Quiz",
    quizCategory:
      quizSet && quizSet.length > 0 && quizSet[0].quizCategory
        ? quizSet[0].quizCategory
        : searchLavel || "General",
    quizCreator:
      quizSet && quizSet.length > 0 && quizSet[0].quizCreator
        ? quizSet[0].quizCreator
        : "AI",
    questions: allQuestions,
    answers: markedAnswer,
    userName: name,
    userEmail: email,
    userProfile: profile,
    userImg: image,
    marks: result?.percentageMark,
  };

  console.log(attemptDetails);

  let postUrl = "";
  if (quizStartKey) {
    postUrl = `${process.env.NEXT_PUBLIC_API_URL}/saveHistory`;
  } else if (searchCategory) {
    postUrl = `${process.env.NEXT_PUBLIC_API_URL}/saveAiQuiz`;
  } else {
    postUrl = `${process.env.NEXT_PUBLIC_API_URL}/linkQuiz`;
  }

  const handleSaveRecord = async () => {
    setLoading(true);
    try {
      const res = await axios.post<ApiMessageResponse>(postUrl, attemptDetails);
      if (res.data.insertedId) {
        setLoading(false);
        setIsDisabled(false);
        Swal.fire({
          title: "Success",
          text: "Recorded successfully!",
          icon: "success",
          toast: true,
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: "Failed to save record. Please try again.",
        icon: "error",
        toast: true,
      });
    }
  };

  const router = useRouterHook();

  const handleGoToHome = () => {
    router.push("/Dashboard");
  };

  let viewSubmission = "";

  if (quizStartKey) {
    viewSubmission = `/viewSubmission/${quizStartKey}`;
  } else if (searchCategory) {
    viewSubmission = `/viewSubmissionAi/${searchCategory}`;
  } else {
    viewSubmission = `/viewSubmissionByLink/${email}`;
  }

  const handleViewAnswers = () => {
    setLoading(true);
    router.push(viewSubmission);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Determine the remark based on the score
  let remark = "";
  let remarkColor = "";

  if (result?.percentageMark > 70) {
    remark = "Excellent!";
    remarkColor = "text-green-600";
  } else if (result?.percentageMark >= 50) {
    remark = "Good!";
    remarkColor = "text-primary-color";
  } else {
    remark = "Needs Improvement";
    remarkColor = "text-red-600";
  }

  return (
    <div className="fixed h-screen inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] md:w-[580px] p-8 rounded-lg shadow-lg">
        <div
          className={`w-[200px] h-[200px] mx-auto my-4 md:my-8 border-8 p-8 rounded-full flex justify-center items-center border-primary-color border-opacity-70`}
        >
          <h1 className={`text-4xl font-bold  text-primary-color`}>
            {result?.correctAnswers} / {result?.totalQuiz}
          </h1>
        </div>
        <h1 className={`mb-5 text-center text-4xl ${remarkColor}`}>
          {/* {result?.percentageMark}% */}
        </h1>
        <div className="my-4 flex flex-col md:flex-row gap-4 justify-center items-center">
          <Button className="lg:px-10 " onClick={handleSaveRecord}>
            Submit
          </Button>
          <Button onClick={handleViewAnswers} disabled={isDisabled}>
            View Submission
          </Button>
          <Button onClick={handleGoToHome}>Back to Dashboard</Button>
        </div>
        <h1 className="text-secondary-color text-center text-xl lg:text-4xl mb-2 md:mb-10">
          You achieved {result?.percentageMark}% mark!
        </h1>
        <div>
          <UserFeedback />
        </div>
        <div className="mt-4 flex justify-center gap-4 w-full">
          <div className="font-medium py-1 px-8 border border-secondary-color rounded-md">
            <h2 className="text-xl mb-5 text-center">Share Social Media:</h2>
            <FacebookShareButton
              url={"https://quizlytics.vercel.app/"}
              quote={`I scored ${result?.percentageMark}% on my exam! Check it out on Quizlytics.`}
              hashtag={"#Quizlytics"}
            >
              <FacebookIcon className="animate-bounce" size={32} round />
            </FacebookShareButton>

            <PinterestShareButton
              url={"https://quizlytics.vercel.app/"}
              media={`I scored ${result?.percentageMark}% on my exam! Check it out on Quizlytics.`}
            >
              <PinterestIcon className="mx-5 animate-bounce" size={32} round />
            </PinterestShareButton>

            <TwitterShareButton
              url={"https://quizlytics.vercel.app/"}
              title={`I scored ${result?.percentageMark}% on my exam! Check it out on Quizlytics.`}
            >
              <TwitterIcon className="animate-bounce" size={32} round />
            </TwitterShareButton>

            <RedditShareButton
              url={"https://github.com/next-share"}
              title={
                "next-share is a social share buttons for your next React apps."
              }
            >
              <RedditIcon className="animate-bounce ml-5" size={32} round />
            </RedditShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
