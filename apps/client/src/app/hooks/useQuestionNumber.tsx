import { useState } from "react";

const useQuestionNumber = () => {
  const [currentMCQ, setCurrentMCQ] = useState<number>(1);
  return [currentMCQ, setCurrentMCQ] as const;
};

export default useQuestionNumber;
