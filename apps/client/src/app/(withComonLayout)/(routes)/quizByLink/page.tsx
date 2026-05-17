"use client";

import useRouterHook from "@/app/hooks/useRouterHook";
import QuizLink from "@/components/Modals/QuizLink";
import QuizScreen from "@/components/QuizPage/QuizScreen";
import { ErrorState, SkeletonBlock } from "@/components/Shared/StateBlocks";
import { Button } from "@/components/ui/button";
import { getQuizByLink } from "@/requests/get";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { QuizQuestion } from "@quizlytics/types";

const Page = () => {
  const [artLink, setArtLink] = useState<string>("");
  const [allQuestions, setAllQuestion] = useState<QuizQuestion[]>([]);
  const [quizByLink, setQuizByLink] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouterHook();

  const handleReturn = () => {
    router.push("/Dashboard");
  };

  const fetchLinkQuiz = useCallback(async () => {
    if (!artLink) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getQuizByLink(artLink);
      setAllQuestion(data || []);
    } catch {
      setError("The link quiz could not be generated.");
      toast.error("Link quiz generation failed.");
    } finally {
      setIsLoading(false);
    }
  }, [artLink]);

  useEffect(() => {
    if (!quizByLink) {
      fetchLinkQuiz();
    }
  }, [fetchLinkQuiz, quizByLink]);

  return (
    <div className="min-h-screen bg-gray-50">
      {quizByLink ? (
        <QuizLink
          setQuizByLink={setQuizByLink}
          setArtLink={setArtLink}
          setIsLoading={setIsLoading}
        />
      ) : isLoading ? (
        <LinkQuizLoading />
      ) : error ? (
        <div className="flex min-h-screen items-center justify-center p-4">
          <ErrorState
            title="Could not generate quiz"
            description="We could not read this link or the AI service is busy. Retry or use another article."
            onRetry={fetchLinkQuiz}
            retryLabel="Retry"
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuizByLink(true)}
                className="min-h-11 rounded-xl border-gray-200 px-5 font-bold"
              >
                Try Another Link
              </Button>
            }
          />
        </div>
      ) : !allQuestions.length ? (
        <div className="flex min-h-screen items-center justify-center p-4">
          <ErrorState
            title="No questions generated"
            description="This link did not return quiz questions. Try a text-heavy article or another resource."
            action={
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={() => setQuizByLink(true)}
                  className="min-h-11 rounded-xl bg-primary-color px-5 font-bold text-white"
                >
                  Try Another Link
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
          allQuestions={allQuestions}
          isLoading={isLoading}
          artLink={artLink}
        />
      )}
    </div>
  );
};

function LinkQuizLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <SkeletonBlock className="mx-auto mb-4 h-12 w-12 rounded-xl" />
        <SkeletonBlock className="mx-auto mb-3 h-6 w-60" />
        <SkeletonBlock className="mx-auto mb-6 h-4 w-72 max-w-full" />
        <div className="space-y-3">
          {[0, 1, 2].map(item => (
            <SkeletonBlock key={item} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
