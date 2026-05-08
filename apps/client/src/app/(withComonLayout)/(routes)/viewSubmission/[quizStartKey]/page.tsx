import LatestSubmission from "@/components/QuizPage/LatestSubmission";
import React from "react";

const Page = async ({ params }: { params: Promise<{ quizStartKey: string }> }) => {
  const { quizStartKey } = await params;
  return <LatestSubmission quizKey={quizStartKey} />;
};

export default Page;
