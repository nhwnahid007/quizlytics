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

  const rawQuestions: unknown[] = Array.isArray(latestSubmission?.questions)
    ? latestSubmission.questions.filter(isQuizQuestion)
    : [];
  const submissionQuestions = rawQuestions.filter(isQuizQuestion);
  const submissionAnswers: unknown[] = Array.isArray(latestSubmission?.answers)
    ? latestSubmission.answers
    : [];

  return (
    <div className="h-auto max-w-6xl pt-20 mx-auto">
      {quizId ? (
        <h2 className="text-center text-3xl  font-extrabold  mb-8">
          Exam of {moment(latestSubmission?.date).format("MMMM Do YYYY")}
        </h2>
      ) : (
        <h2 className="text-center text-3xl  font-extrabold  mb-8">
          YOUR LATEST SUBMISSION
        </h2>
      )}

      {isLoading ? (
        <div className="text-center">
          <LoadingSpinner></LoadingSpinner>{" "}
        </div>
      ) : submissionQuestions.length > 0 ? (
        submissionQuestions.map((item, idx) => (
          <SubmitCard
            key={item._id ?? item.id ?? idx}
            item={item}
            idx={idx}
            markedAnswer={
              submissionAnswers[idx] as MarkedAnswer
            }
          />
        ))
      ) : (
        <div className="text-center text-gray-500">No submissions found.</div>
      )}
    </div>
  );
};

export default LatestSubmission;
