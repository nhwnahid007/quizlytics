"use client";

import useRouterHook from "@/app/hooks/useRouterHook";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "sonner";
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
import UserFeedback from "../Modals/UserFeedback";
import ShareQuizDialog from "./ShareQuizDialog";
import type { QuizQuestion, QuizResultSummary } from "@quizlytics/types";
import type { ManualQuizRecord, MarkedAnswer } from "@/types/client";
import { saveAiQuiz, saveHistory, saveLinkQuiz } from "@/services/quiz.service";
import { exportToPDF } from "@/lib/export-utils";
import {
  CheckCircle2,
  Download,
  Eye,
  Home,
  MinusCircle,
  RefreshCw,
  Save,
  Share2,
  Trophy,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SaveStatus = "idle" | "saving" | "saved" | "error";

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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const { data: session } = useSession();
  const name = session?.user?.name;
  const profile = session?.user?.profile;
  const image = session?.user?.image;
  const email = session?.user?.email;

  const skippedAnswers = markedAnswer.filter(
    answer => answer === null || answer === undefined
  ).length;
  const wrongAnswers = Math.max(
    result.totalQuiz - result.correctAnswers - skippedAnswers,
    0
  );
  const isSaved = saveStatus === "saved";
  const isSaving = saveStatus === "saving";

  const attemptDetails = {
    quizStartKey,
    date: new Date().toISOString(),
    linkId: artLink || "1001",
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
    if (isSaved || isSaving) return;

    setSaveStatus("saving");
    setSaveError(null);
    try {
      const res = quizStartKey
        ? await saveHistory(attemptDetails)
        : searchCategory
          ? await saveAiQuiz(attemptDetails)
          : await saveLinkQuiz(attemptDetails);

      if (typeof res === "object" && res !== null && "insertedId" in res) {
        setSaveStatus("saved");
        toast.success("Result saved.");
        return;
      }

      throw new Error("Save response did not include an id.");
    } catch {
      setSaveStatus("error");
      setSaveError(
        "We could not save this result. Check your connection and try again."
      );
      toast.error("Result save failed.");
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
    if (!isSaved) return;
    setIsNavigating(true);
    router.push(viewSubmission);
  };

  const handleExportPDF = async () => {
    await exportToPDF("quiz-result-card", `quiz-result-${Date.now()}`);
    toast.success("PDF export started.");
  };

  const performance = getPerformanceRemark(result.percentageMark);

  const quizLink = quizStartKey
    ? `/startQuiz?qKey=${quizStartKey}`
    : searchCategory
      ? `/quickExam`
      : `/quizByLink`;

  const saveLabel =
    saveStatus === "saving"
      ? "Saving..."
      : saveStatus === "saved"
        ? "Saved ✓"
        : saveStatus === "error"
          ? "Retry Save"
          : "Save Result";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-6">
      <div className="mx-auto flex min-h-full max-w-3xl items-center justify-center">
        <section
          id="quiz-result-card"
          className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-7"
          aria-labelledby="quiz-result-title"
        >
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-color/10 text-primary-color">
              <Trophy className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="text-sm font-bold uppercase tracking-wide text-primary-color">
              Quiz complete
            </p>
            <h1
              id="quiz-result-title"
              className="mt-2 text-4xl font-black text-gray-950 sm:text-5xl"
            >
              {result?.percentageMark}%
            </h1>
            <p className="mt-2 text-gray-500">
              {result?.correctAnswers} correct out of {result?.totalQuiz}{" "}
              questions
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <BreakdownCard
              icon={CheckCircle2}
              label="Correct"
              value={result.correctAnswers}
              className="border-green-100 bg-green-50 text-green-700"
            />
            <BreakdownCard
              icon={XCircle}
              label="Wrong"
              value={wrongAnswers}
              className="border-red-100 bg-red-50 text-red-700"
            />
            <BreakdownCard
              icon={MinusCircle}
              label="Skipped"
              value={skippedAnswers}
              className="border-gray-200 bg-gray-50 text-gray-700"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-primary-color/10 bg-primary-color/5 p-4">
            <h2 className={cn("text-lg font-bold", performance.color)}>
              {performance.title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {performance.description}
            </p>
          </div>

          {saveError ? (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {saveError}
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              type="button"
              onClick={handleSaveRecord}
              disabled={isSaving || isSaved}
              className={cn(
                "min-h-12 rounded-xl font-bold text-white",
                isSaved
                  ? "bg-emerald-600 hover:bg-emerald-600"
                  : "bg-primary-color hover:bg-primary-color/90"
              )}
            >
              {saveStatus === "error" ? (
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              ) : (
                <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {saveLabel}
            </Button>
            <Button
              type="button"
              onClick={handleViewAnswers}
              disabled={!isSaved || isNavigating}
              variant="outline"
              className={cn(
                "min-h-12 rounded-xl border-gray-200 font-bold",
                isSaved
                  ? "border-primary-color text-primary-color hover:bg-primary-color/10"
                  : "text-gray-400"
              )}
            >
              <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
              {isNavigating ? "Opening..." : "View Submission"}
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <ShareQuizDialog
              quizLink={quizLink}
              quizTitle={attemptDetails.quizTitle}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="min-h-10 rounded-xl border-gray-200 px-4 text-gray-700"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Export PDF
            </Button>
            <Button
              type="button"
              onClick={handleGoToHome}
              variant="outline"
              size="sm"
              className="min-h-10 rounded-xl border-gray-200 px-4 text-gray-700"
            >
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to Dashboard
            </Button>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="mb-3 flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share your score
            </div>
            <div className="flex justify-center gap-3">
              <FacebookShareButton
                url={"https://quizlytics.vercel.app/"}
                quote={`I scored ${result?.percentageMark}% on my quiz. Check it out on Quizlytics.`}
                hashtag={"#Quizlytics"}
                aria-label="Share result on Facebook"
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>

              <PinterestShareButton
                url={"https://quizlytics.vercel.app/"}
                media={`I scored ${result?.percentageMark}% on my quiz. Check it out on Quizlytics.`}
                aria-label="Share result on Pinterest"
              >
                <PinterestIcon size={32} round />
              </PinterestShareButton>

              <TwitterShareButton
                url={"https://quizlytics.vercel.app/"}
                title={`I scored ${result?.percentageMark}% on my quiz. Check it out on Quizlytics.`}
                aria-label="Share result on Twitter"
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>

              <RedditShareButton
                url={"https://quizlytics.vercel.app/"}
                title={`I scored ${result?.percentageMark}% on Quizlytics.`}
                aria-label="Share result on Reddit"
              >
                <RedditIcon size={32} round />
              </RedditShareButton>
            </div>
          </div>

          <div className="mt-6">
            <UserFeedback />
          </div>
        </section>
      </div>
    </div>
  );
};

function BreakdownCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className={cn("rounded-2xl border p-4", className)}>
      <div className="mb-2 flex items-center gap-2 text-sm font-bold">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}

function getPerformanceRemark(score: number) {
  if (score >= 80) {
    return {
      title: "Excellent work",
      description:
        "You have strong command of this quiz. Review the missed items to lock it in.",
      color: "text-emerald-700",
    };
  }

  if (score >= 50) {
    return {
      title: "Good progress",
      description:
        "You are close. Review wrong answers, then retry with a focused topic.",
      color: "text-primary-color",
    };
  }

  return {
    title: "Keep practicing",
    description:
      "Use the answer review to find gaps and try a shorter practice round next.",
    color: "text-red-700",
  };
}

export default QuizResult;
