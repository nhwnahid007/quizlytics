"use client";
import useRouterHook from "@/app/hooks/useRouterHook";
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
import ShareQuizDialog from "./ShareQuizDialog";
import type { QuizQuestion, QuizResultSummary } from "@quizlytics/types";
import type { ManualQuizRecord, MarkedAnswer } from "@/types/client";
import { saveAiQuiz, saveHistory, saveLinkQuiz } from "@/services/quiz.service";
import { exportToPDF } from "@/lib/export-utils";
import { Download } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const { data: session } = useSession();
  const name = session?.user?.name;
  const profile = session?.user?.profile;
  const image = session?.user?.image;
  const email = session?.user?.email;
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

  const handleSaveRecord = async () => {
    setLoading(true);
    try {
      const res = quizStartKey
        ? await saveHistory(attemptDetails)
        : searchCategory
          ? await saveAiQuiz(attemptDetails)
          : await saveLinkQuiz(attemptDetails);
      if (
        typeof res === "object" &&
        res !== null &&
        "insertedId" in res
      ) {
        setLoading(false);
        setIsDisabled(false);
        Swal.fire({
          title: "Success",
          text: "Recorded successfully!",
          icon: "success",
          toast: true,
        });
      }
    } catch {
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

  const handleExportPDF = async () => {
    await exportToPDF("quiz-result-card", `quiz-result-${Date.now()}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Determine the remark based on the score
  let remarkColor = "";

  if (result?.percentageMark > 70) {
    remarkColor = "text-green-600";
  } else if (result?.percentageMark >= 50) {
    remarkColor = "text-primary-color";
  } else {
    remarkColor = "text-red-600";
  }

  const quizLink = quizStartKey
    ? `/startQuiz?qKey=${quizStartKey}`
    : searchCategory
      ? `/quickExam`
      : `/quizByLink`;

  return (
    <div className="fixed h-screen inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div id="quiz-result-card" className="bg-card w-[90%] md:w-145 p-8 rounded-2xl shadow-lg border border-border">
        <div
          className="w-50 h-50 mx-auto my-4 md:my-8 border-8 p-8 rounded-full flex justify-center items-center border-primary-color border-opacity-70"
        >
          <h1 className="text-4xl font-bold text-primary-color">
            {result?.correctAnswers} / {result?.totalQuiz}
          </h1>
        </div>
        <h1 className={`mb-5 text-center text-4xl ${remarkColor}`}>
        </h1>
        <div className="my-4 flex flex-col md:flex-row gap-3 justify-center items-center flex-wrap">
          <Button className="lg:px-10" onClick={handleSaveRecord}>
            Submit
          </Button>
          <Button onClick={handleViewAnswers} disabled={isDisabled}>
            View Submission
          </Button>
          <ShareQuizDialog
            quizLink={quizLink}
            quizTitle={attemptDetails.quizTitle}
          />
          <Button onClick={handleGoToHome} variant="outline">
            Back to Dashboard
          </Button>
        </div>
        <h1 className="text-foreground text-center text-xl lg:text-4xl mb-2 md:mb-6">
          You achieved {result?.percentageMark}% mark!
        </h1>
        
        {/* Export PDF */}
        <div className="flex justify-center mb-4">
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2 rounded-xl">
            <Download className="h-4 w-4" />
            Export as PDF
          </Button>
        </div>

        <div>
          <UserFeedback />
        </div>
        <div className="mt-4 flex justify-center gap-4 w-full">
          <div className="font-medium py-1 px-8 border border-border rounded-md">
            <h2 className="text-xl mb-5 text-center text-foreground">Share Social Media:</h2>
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
