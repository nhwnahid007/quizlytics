import { useState } from "react";
import type { UserExamAnswer } from "@quizlytics/types";

const useUserExamData = () => {
  const [userExamData, setUserExamData] = useState<UserExamAnswer[]>([]);
  return [userExamData, setUserExamData] as const;
};

export default useUserExamData;
