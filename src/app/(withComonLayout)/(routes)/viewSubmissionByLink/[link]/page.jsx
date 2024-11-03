import LatestSubmission from "@/components/QuizPage/LatestSubmission";
import React from "react";

const Page = ({ params }) => {
  return <LatestSubmission linkUser={params.email} />;
};

export default Page;
