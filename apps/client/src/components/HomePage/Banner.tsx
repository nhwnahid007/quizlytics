"use client";

import useRouterHook from "@/app/hooks/useRouterHook";
import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  FileText,
  KeyRound,
  Link2,
  Sparkles,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";

const Banner = () => {
  const router = useRouterHook();
  const [isMounted, setIsMounted] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavigate = (path: string) => {
    if (session?.status === "authenticated") {
      router.push(path);
    } else {
      router.push("/login");
    }
  };

  if (!isMounted) {
    return (
      <section className="min-h-[82vh] bg-background px-4 py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="mb-5 h-6 w-36 animate-pulse rounded-full bg-muted" />
          <div className="mb-4 h-12 w-full max-w-2xl animate-pulse rounded-xl bg-muted" />
          <div className="mb-8 h-5 w-full max-w-xl animate-pulse rounded-full bg-muted" />
          <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {[0, 1, 2].map(item => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-xl bg-card shadow-sm"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const features = [
    {
      title: "AI Quiz",
      description: "Generate practice questions from any topic.",
      icon: BrainCircuit,
      className: "text-primary-color bg-primary-color/10",
    },
    {
      title: "Custom Quiz",
      description: "Join teacher or admin quizzes with a key.",
      icon: KeyRound,
      className:
        "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40",
    },
    {
      title: "Link Quiz",
      description: "Turn article links into reading checks.",
      icon: Link2,
      className:
        "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary-color/10 to-transparent" />
        <div className="absolute left-10 top-36 h-40 w-40 rotate-12 rounded-[2rem] border border-border bg-card/70 shadow-sm" />
        <div className="absolute right-16 top-32 h-36 w-36 -rotate-12 rounded-[2rem] border border-border bg-card/70 shadow-sm" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-sm font-semibold text-primary-color shadow-sm backdrop-blur">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Smart quiz practice
        </div>

        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Learn faster with smarter quizzes.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Generate quizzes with AI, custom keys, or article links.
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Button
            type="button"
            onClick={() => handleNavigate("/quickExam")}
            className="min-h-12 w-full max-w-xs px-6 text-base font-bold sm:w-auto"
            aria-label="Start AI Quiz"
          >
            Start AI Quiz
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleNavigate("/customQuiz")}
            className="min-h-12 w-full max-w-xs px-6 text-base font-bold sm:w-auto"
            aria-label="Join Quiz with Key"
          >
            Join Quiz with Key
            <KeyRound className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-12 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {features.map(feature => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-card/90 p-5 text-left shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-primary-color/30 hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.className}`}
              >
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FileText className="h-4 w-4 text-primary-color" aria-hidden="true" />
          Built for self-practice, classrooms, and reading comprehension.
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Banner;
