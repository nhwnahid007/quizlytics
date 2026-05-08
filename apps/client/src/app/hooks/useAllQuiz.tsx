import { useQuery } from "@tanstack/react-query";
import { allCustomQuiz } from "@/services/quiz.service";
import type { ManualQuizWithQuestions } from "@/services/quiz.service";
import { queryKeys } from "@/lib/query-keys";

const useAllQuiz = () => {
  const { data: AllQuiz = [], refetch } = useQuery({
    queryKey: queryKeys.customQuiz,
    queryFn: allCustomQuiz,
  });
  return [AllQuiz, refetch] as const;
};

export default useAllQuiz;
