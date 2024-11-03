import LatestSubmission from "@/components/QuizPage/LatestSubmission";
import React from "react";

const Page = ({ params }) => {
  return <LatestSubmission searchCategory={params.searchCategory} />;
};

export default Page;
