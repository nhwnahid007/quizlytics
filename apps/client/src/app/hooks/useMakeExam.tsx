import { useState } from "react";

const useMakeExam = () => {
  const [showMakeExam, setShowMakeExam] = useState<boolean>(true);
  return [showMakeExam, setShowMakeExam] as const;
};

export default useMakeExam;
