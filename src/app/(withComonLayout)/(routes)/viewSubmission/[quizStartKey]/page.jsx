import LatestSubmission from "@/components/QuizPage/LatestSubmission";
import React from "react";

const Page = ({ params }) => {
  return <LatestSubmission quizKey={params.quizStartKey} />;
};

export default Page;
