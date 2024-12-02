import LatestSubmission from "@/components/QuizPage/LatestSubmission";
import React from "react";

const viewHistory = ({ params }) => {
  console.log(params.id);
  return <LatestSubmission quizId={params.id} showBackButton={false} />;
};

export default viewHistory;
