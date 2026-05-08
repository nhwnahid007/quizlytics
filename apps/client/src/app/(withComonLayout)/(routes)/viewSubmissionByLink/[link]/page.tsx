import LatestSubmission from "@/components/QuizPage/LatestSubmission";
import React from "react";

const Page = async ({ params }: { params: Promise<{ link: string }> }) => {
  const { link } = await params;
  return <LatestSubmission linkUser={link} />;
};

export default Page;
