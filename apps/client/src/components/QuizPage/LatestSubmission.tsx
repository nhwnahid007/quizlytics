"use client";
import {
  getLinkHistoryByUser,
  getSubmissionById,
  getSubmissionByKey,
  getSubmissionByQuizTitle,
} from "@/requests/get";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import SubmitCard from "./SubmitCard";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import moment from "moment";
import type { HistoryRecord, MarkedAnswer } from "@/types/client";
import type { QuizQuestion } from "@quizlytics/types";

import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Share2, RotateCcw, Trophy, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";

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

  const [latestSubmission, setLatestSubmission] = useState<HistoryRecord | null>(null);

  const { data: session } = useSession();
  const email = session?.user?.email;
  const name = session?.user?.name;

  useEffect(() => {
    const getLatestSubmission = async () => {
      try {
        if (quizKey) {
          setLatestSubmission(null);
          const data = await getSubmissionByKey(quizKey, email ?? "");
          setLatestSubmission(data.at(-1) ?? null);
          setIsLoading(false);
        } else if (searchCategory) {
          setLatestSubmission(null);
          const data = await getSubmissionByQuizTitle(searchCategory, email ?? "");
          setLatestSubmission(data.at(-1) ?? null);
          setIsLoading(false);
        } else if (quizId) {
          setLatestSubmission(null);
          const data = await getSubmissionById(quizId);
          setLatestSubmission(data);
          setIsLoading(false);
        } else {
          setLatestSubmission(null);
          const data = await getLinkHistoryByUser(linkUser ?? email ?? "");
          setLatestSubmission(data?.at(-1) ?? null);
          setIsLoading(false);
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!!!",
          toast: true,
        });
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
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "Quiz link copied to clipboard.",
        timer: 1500,
        showConfirmButton: false,
      });
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
    <div className="min-h-screen bg-gray-50/50 pb-20">
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
              {moment(latestSubmission?.date).format("MMM Do, YYYY")}
            </p>
          </div>
        </div>

        {/* Title and Summary Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-border mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Trophy size={120} />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              {quizId ? "Exam Results" : "Your Latest Submission"}
            </h1>

            {!isLoading && submissionQuestions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary-color/5 rounded-2xl p-4 border border-primary-color/10">
                  <div className="flex items-center gap-3 text-primary-color mb-1">
                    <Trophy className="h-5 w-5" />
                    <span className="text-sm font-semibold">Score</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {score} <span className="text-sm text-muted-foreground font-medium">/ {submissionQuestions.length}</span>
                  </p>
                </div>

                <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                  <div className="flex items-center gap-3 text-green-600 mb-1">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">Correct</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{score}</p>
                </div>

                <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                  <div className="flex items-center gap-3 text-red-600 mb-1">
                    <XCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">Incorrect</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700">
                    {submissionQuestions.length - score}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <LoadingSpinner />
            <p className="text-muted-foreground animate-pulse font-medium">
              Loading your submission...
            </p>
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
          <div className="text-center py-20">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="text-muted-foreground h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Submissions Found</h3>
            <p className="text-muted-foreground">It seems you haven't taken this quiz yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestSubmission;
