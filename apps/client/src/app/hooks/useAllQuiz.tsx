import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ManualQuiz, QuizQuestion } from "@quizlytics/types";

export type ManualQuizWithQuestions = Omit<ManualQuiz, "quizArr"> & {
  _id?: string;
  quizArr?: QuizQuestion[];
};

const useAllQuiz = () => {
  const { data: AllQuiz = [], refetch } = useQuery({
    queryKey: ["customQuiz"],
    queryFn: async () => {
      const res = await axios.get<ManualQuizWithQuestions[]>(
        "https://quizlytics.jonomukti.org/allCustomQuiz"
      );
      return res.data;
    },
  });
  return [AllQuiz, refetch] as const;
};

export default useAllQuiz;
