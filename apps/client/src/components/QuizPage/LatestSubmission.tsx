"use client";
import {
  getLinkHistoryByUser,
  getSubmissionById,
  getSubmissionByKey,
  getSubmissionByQuizTitle,
} from "@/requests/get";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import SubmitCard from "./SubmitCard";
import moment from "moment";
import type { HistoryRecord, MarkedAnswer } from "@/types/client";
import type { QuizQuestion } from "@quizlytics/types";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Share2,
  RotateCcw,
  Trophy,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  EmptyState,
  ErrorState,
  SkeletonBlock,
} from "@/components/Shared/StateBlocks";

const isQuizQuestion = (value: unknown): value is QuizQuestion => {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return Array.isArray(record.options);
};

const LatestSubmission = ({
  quizKey,
  searchCategory,
  quizId,
  linkUser,
}: {
  quizKey?: string;
  searchCategory?: string;
  quizId?: string;
  linkUser?: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [latestSubmission, setLatestSubmission] =
    useState<HistoryRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    const getLatestSubmission = async () => {
      try {
        setError(null);
        const sessionEmail = email ?? undefined;

        setIsLoading(true);
        if (quizKey) {
          if (!sessionEmail) return;
          setLatestSubmission(null);
          const data = await getSubmissionByKey(quizKey, sessionEmail);
          setLatestSubmission(data.at(-1) ?? null);
        } else if (searchCategory) {
          if (!sessionEmail) return;
          setLatestSubmission(null);
          const data = await getSubmissionByQuizTitle(
            searchCategory,
            sessionEmail
          );
          setLatestSubmission(data.at(-1) ?? null);
        } else if (quizId) {
          setLatestSubmission(null);
          const data = await getSubmissionById(quizId);
          setLatestSubmission(data);
        } else {
          const linkHistoryEmail = linkUser ?? sessionEmail;
          if (!linkHistoryEmail) return;
          setLatestSubmission(null);
          const data = await getLinkHistoryByUser(linkHistoryEmail);
          setLatestSubmission(data?.at(-1) ?? null);
        }
      } catch {
        setError("We could not load this submission.");
        toast.error("Submission failed to load.");
      } finally {
        setIsLoading(false);
      }
    };
    getLatestSubmission();
  }, [quizKey, email, searchCategory, quizId, linkUser]);

  const router = useRouter();

  const rawQuestions: unknown[] = Array.isArray(latestSubmission?.questions)
    ? latestSubmission.questions.filter(isQuizQuestion)
    : [];
  const submissionQuestions = rawQuestions.filter(isQuizQuestion);
  const submissionAnswers: unknown[] = Array.isArray(latestSubmission?.answers)
    ? latestSubmission.answers
    : [];

  const score = submissionQuestions.reduce((acc, q, idx) => {
    return acc + (q.correct_answer == submissionAnswers[idx] ? 1 : 0);
  }, 0);

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Quizlytics Quiz Result",
          text: `I scored ${score}/${submissionQuestions.length} on Quizlytics!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Submission link copied.");
      } catch {
        toast.error("Could not copy submission link.");
      }
    }
  };

  const handleRetake = () => {
    if (searchCategory) {
      router.push("/quickExam");
    } else if (quizKey) {
      router.push("/Dashboard"); // Or specific quiz page if known
    } else {
      router.push("/Dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-24">
        {/* Top Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Submission Date
            </p>
            <p className="text-sm font-semibold">
              {latestSubmission?.date
                ? moment(latestSubmission.date).format("MMM Do, YYYY")
                : "Not available"}
            </p>
          </div>
        </div>

        {/* Title and Summary Card */}
        <div className="bg-card rounded-3xl p-8 shadow-sm border border-border mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Trophy size={120} />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              {quizId ? "Exam Results" : "Your Latest Submission"}
            </h1>

            {!isLoading && submissionQuestions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary-color/5 dark:bg-primary-color/10 rounded-2xl p-4 border border-primary-color/10 dark:border-primary-color/20">
                  <div className="flex items-center gap-3 text-primary-color dark:text-purple-400 mb-1">
                    <Trophy className="h-5 w-5" />
                    <span className="text-sm font-semibold">Score</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {score}{" "}
                    <span className="text-sm text-muted-foreground font-medium">
                      / {submissionQuestions.length}
                    </span>
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 rounded-2xl p-4 border border-green-100 dark:border-green-900/50">
                  <div className="flex items-center gap-3 text-green-600 dark:text-green-400 mb-1">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">Correct</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {score}
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-4 border border-red-100 dark:border-red-900/50">
                  <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-1">
                    <XCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">Incorrect</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {submissionQuestions.length - score}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-5">
            {[0, 1, 2].map(item => (
              <div
                key={item}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <SkeletonBlock className="mb-4 h-5 w-32" />
                <SkeletonBlock className="mb-5 h-7 w-full" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SkeletonBlock className="h-14 w-full rounded-2xl" />
                  <SkeletonBlock className="h-14 w-full rounded-2xl" />
                  <SkeletonBlock className="h-14 w-full rounded-2xl" />
                  <SkeletonBlock className="h-14 w-full rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-16">
            <ErrorState
              title="Submission unavailable"
              description="We could not fetch the saved answers. Check your connection and retry."
              onRetry={() => window.location.reload()}
              retryLabel="Retry"
            />
          </div>
        ) : submissionQuestions.length > 0 ? (
          <div className="space-y-8">
            {submissionQuestions.map((item, idx) => (
              <SubmitCard
                key={item._id ?? item.id ?? idx}
                item={item}
                idx={idx}
                markedAnswer={submissionAnswers[idx] as MarkedAnswer}
              />
            ))}

            {/* Bottom Actions */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 pt-12 border-t border-border">
              <Button
                variant="outline"
                onClick={handleRetake}
                className="w-full sm:w-auto gap-2 border-border hover:bg-muted px-8 h-12 rounded-xl"
              >
                <RotateCcw className="h-5 w-5" />
                Take Quiz Again
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="w-full sm:w-auto gap-2 border-border hover:bg-muted px-8 h-12 rounded-xl"
              >
                <Download className="h-5 w-5" />
                Download Results
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="w-full sm:w-auto gap-2 border-border hover:bg-muted px-8 h-12 rounded-xl"
              >
                <Share2 className="h-5 w-5" />
                Share
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-16">
            <EmptyState
              icon={XCircle}
              title="No submissions yet"
              description="Save a quiz result first, then your answer review will appear here."
              action={
                <Button
                  type="button"
                  onClick={handleRetake}
                  className="min-h-11 rounded-xl bg-primary-color px-5 font-bold text-white"
                >
                  Start a Quiz
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestSubmission;
