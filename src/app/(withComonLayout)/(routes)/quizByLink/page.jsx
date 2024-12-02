"use client";
import useRouterHook from "@/app/hooks/useRouterHook";
import QuizLink from "@/components/Modals/QuizLink";
import QuizScreen from "@/components/QuizPage/QuizScreen";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
// import Spinner from "@/components/Shared/spinner";
import { Button } from "@/components/ui/button";
import { getQuizByLink } from "@/requests/get";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Page = () => {
  const [artLink, setArtLink] = useState("");
  const [allQuestions, setAllQuestion] = useState([]); // Initialize as an empty array
  const [quizByLink, setQuizByLink] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  console.log("artlink", artLink);
  console.log("allQuestion", allQuestions);

  const router = useRouterHook();

  const handleReturn = () => {
    router.push("/Dashboard");
  };

  useEffect(() => {
    const getLinkQuiz = async () => {
      if (!artLink) return;
      setIsLoading(true);
      try {
        const data = await getQuizByLink(artLink);
        console.log(data);
        setAllQuestion(data || []); // Ensure allQuestions is always an array
        setIsLoading(false);
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
    getLinkQuiz();
  }, [artLink]);
  return (
    <div className="h-screen">
      {quizByLink ? (
        <QuizLink
          setQuizByLink={setQuizByLink}
          setArtLink={setArtLink}
          setIsLoading={setIsLoading}
        />
      ) : isLoading ? (
        <div className="h-screen flex justify-center items-center">
          {/* <Spinner /> */}
          <LoadingSpinner />
        </div>
      ) : !allQuestions.length ? (
        <div className="h-screen flex flex-col justify-center items-center px-12 text-center">
          <h1 className="text-red-500 font-bold">
            No question loaded due to AI is Busy. Try again...
          </h1>
          <Button onClick={handleReturn} className="mt-4 bg-primary-color">
            Back to Dashboard
          </Button>
        </div>
      ) : (
        <QuizScreen
          allQuestions={allQuestions}
          isLoading={isLoading}
          artLink={artLink}
        />
      )}
    </div>
  );
};

export default Page;
