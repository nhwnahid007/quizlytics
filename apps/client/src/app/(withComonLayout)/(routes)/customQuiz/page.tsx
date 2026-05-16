"use client";

import useRouterHook from "@/app/hooks/useRouterHook";
import CustomExam from "@/components/Modals/CustomExam";
import QuizScreen from "@/components/QuizPage/QuizScreen";
import { ErrorState, SkeletonBlock } from "@/components/Shared/StateBlocks";
import { Button } from "@/components/ui/button";
import { getCustomQuiz } from "@/requests/get";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { QuizQuestion } from "@quizlytics/types";
import type { ManualQuizWithQuestions } from "@/requests/get";

const Page = () => {
  const [quizKey, setQuizKey] = useState<string | null>(null);
  const [customExam, setCustomExam] = useState<boolean>(true);
  const [allQuestions, setAllQuestion] = useState<QuizQuestion[]>([]);
  const [quizSet, setQuizSet] = useState<ManualQuizWithQuestions[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouterHook();

  const fetchCustomQuiz = useCallback(async () => {
    if (!quizKey) return;

    try {
      setIsLoading(true);
      setError(null);
      setAllQuestion([]);
      const data = await getCustomQuiz(quizKey);
      setQuizSet(data);
      setAllQuestion(data[0]?.quizArr ?? []);
    } catch {
      setError("We could not load this quiz key.");
      toast.error("Quiz key lookup failed.");
    } finally {
      setIsLoading(false);
    }
  }, [quizKey]);

  useEffect(() => {
    if (!customExam) {
      fetchCustomQuiz();
    }
  }, [customExam, fetchCustomQuiz]);

  const handleReturn = () => {
    router.push("/Dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {customExam ? (
        <CustomExam
          setCustomExam={setCustomExam}
          setQuizKey={setQuizKey}
          quizKey={quizKey}
        />
      ) : isLoading ? (
        <QuizLookupSkeleton />
      ) : error ? (
        <div className="flex min-h-screen items-center justify-center p-4">
          <ErrorState
            title="Quiz key unavailable"
            description="The quiz could not be loaded right now. Check the key or retry."
            onRetry={fetchCustomQuiz}
            retryLabel="Retry"
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() => setCustomExam(true)}
                className="min-h-11 rounded-xl border-gray-200 px-5 font-bold"
              >
                Enter Another Key
              </Button>
            }
          />
        </div>
      ) : !allQuestions?.length ? (
        <div className="flex min-h-screen items-center justify-center p-4">
          <ErrorState
            title="Invalid quiz key"
            description="No questions were found for this key. Check the code and try again."
            action={
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={() => setCustomExam(true)}
                  className="min-h-11 rounded-xl bg-primary-color px-5 font-bold text-white"
                >
                  Try Another Key
                </Button>
                <Button
                  type="button"
                  onClick={handleReturn}
                  variant="outline"
                  className="min-h-11 rounded-xl border-gray-200 px-5 font-bold"
                >
                  Back to Dashboard
                </Button>
              </div>
            }
          />
        </div>
      ) : (
        <QuizScreen
          quizKey={quizKey}
          allQuestions={allQuestions}
          quizSet={quizSet}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

function QuizLookupSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <SkeletonBlock className="mx-auto mb-4 h-12 w-12 rounded-xl" />
        <SkeletonBlock className="mx-auto mb-3 h-6 w-56" />
        <SkeletonBlock className="mx-auto h-4 w-72 max-w-full" />
      </div>
    </div>
  );
}

export default Page;
