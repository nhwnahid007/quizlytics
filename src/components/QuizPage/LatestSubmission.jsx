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
import { Button } from "../ui/button";
import Link from "next/link";

const LatestSubmission = ({ quizKey, searchCategory, quizId, showBackButton = true }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [latestSubmission, setLatestSubmission] = useState([]);

  const { data: session } = useSession();
  const email = session?.user?.email;
  const name = session?.user?.name;

  console.log("id", quizId);

  useEffect(() => {
    const getLatestSubmission = async () => {
      // setIsLoading(true);
      try {
        if (quizKey) {
          setLatestSubmission([]);
          const data = await getSubmissionByKey(quizKey, email);
          setLatestSubmission(data.at(-1));
          setIsLoading(false);
        } else if (searchCategory) {
          setLatestSubmission([]);
          const data = await getSubmissionByQuizTitle(searchCategory, email);
          console.log("quick data", data);
          setLatestSubmission(data.at(-1));
          setIsLoading(false);
        } else if (quizId) {
          setLatestSubmission([]);
          const data = await getSubmissionById(quizId);
          console.log("quick data", data);
          setLatestSubmission(data);
          setIsLoading(false);
        } else {
          setLatestSubmission([]);
          const data = await getLinkHistoryByUser(email);
          console.log("quick data", data);
          setLatestSubmission(data?.at(-1));
          setIsLoading(false);
        }
      } catch (error) {
        console.log("data fetching error", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!!!",
          toast: true,
        });
      }
    };
    getLatestSubmission();
  }, [quizKey, email, searchCategory, quizId]);

  return (
    <div className="h-auto max-w-6xl pt-20 mx-5 lg:mx-10 2xl:mx-auto">
     {quizId ? (
        <h2 className="text-center text-xl md:text-3xl  font-extrabold  mb-8">
          Quiz taken on {moment(latestSubmission.date).format("MMMM Do YYYY")}
        </h2>
      ) : (
        <h2 className="text-center text-xl md:text-3xl  font-extrabold  mb-8">
          YOUR LATEST SUBMISSION
        </h2>
      )}

      {isLoading ? (
        <div className="text-center">
          <LoadingSpinner></LoadingSpinner>{" "}
        </div>
      ) : latestSubmission?.questions?.length > 0 ? (
        latestSubmission.questions.map((item, idx) => (
          <SubmitCard
            key={item._id}
            item={item}
            idx={idx}
            markedAnswer={latestSubmission.answers[idx]}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">No submissions found.</div>
      )}

      {showBackButton && (
        <div className="flex justify-center my-8">
          <Link href="/Dashboard" className="mx-auto">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LatestSubmission;
