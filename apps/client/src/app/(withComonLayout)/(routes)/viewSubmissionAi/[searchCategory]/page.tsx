import LatestSubmission from "@/components/QuizPage/LatestSubmission";
import React from "react";

const Page = async ({ params }: { params: Promise<{ searchCategory: string }> }) => {
  const { searchCategory } = await params;
  return <LatestSubmission searchCategory={searchCategory} />;
};

export default Page;
