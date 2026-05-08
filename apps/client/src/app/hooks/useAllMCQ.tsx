import { useState } from "react";
import type { QuizQuestion } from "@quizlytics/types";

const useAllMCQ = (initialState: QuizQuestion[] = []) => {
  const [allMCQ, setAllMCQ] = useState<QuizQuestion[]>(initialState);
  return [allMCQ, setAllMCQ] as const;
};

export default useAllMCQ;
