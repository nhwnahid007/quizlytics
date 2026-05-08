import LatestSubmission from "@/components/QuizPage/LatestSubmission";
import React from "react";

const viewHistory = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <LatestSubmission quizId={id} />;
};

export default viewHistory;
