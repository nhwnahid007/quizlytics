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
      <section className="min-h-[82vh] bg-gradient-to-br from-purple-50 via-white to-white px-4 py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="mb-5 h-6 w-36 animate-pulse rounded-full bg-purple-100" />
          <div className="mb-4 h-12 w-full max-w-2xl animate-pulse rounded-2xl bg-gray-200" />
          <div className="mb-8 h-5 w-full max-w-xl animate-pulse rounded-full bg-gray-100" />
          <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {[0, 1, 2].map(item => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
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
      className: "text-purple-600 bg-purple-50",
    },
    {
      title: "Custom Quiz",
      description: "Join teacher or admin quizzes with a key.",
      icon: KeyRound,
      className: "text-blue-600 bg-blue-50",
    },
    {
      title: "Link Quiz",
      description: "Turn article links into reading checks.",
      icon: Link2,
      className: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-white text-black">
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden opacity-20 md:block">
        <div className="absolute -left-10 top-20 h-36 w-36 rotate-12 animate-float rounded-2xl bg-neutral-200" />
        <div className="absolute left-1/4 top-1/3 h-24 w-24 rotate-24 animate-float rounded-2xl bg-pink-200" />
        <div className="absolute right-20 top-36 h-28 w-28 -rotate-12 animate-float-delayed rounded-2xl bg-blue-200" />
        <div className="absolute right-1/3 bottom-1/4 h-20 w-20 animate-float-delayed rounded-full bg-yellow-200" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-color/15 bg-white/80 px-4 py-2 text-sm font-semibold text-primary-color shadow-sm">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Smart quiz practice
        </div>

        <h1 className="max-w-3xl text-4xl font-black tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
          Learn faster with smarter quizzes.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
          Generate quizzes with AI, custom keys, or article links.
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Button
            type="button"
            onClick={() => handleNavigate("/quickExam")}
            className="min-h-12 w-full max-w-xs rounded-xl bg-primary-color px-6 text-base font-bold text-white hover:bg-primary-color/90 sm:w-auto"
            aria-label="Start AI Quiz"
          >
            Start AI Quiz
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleNavigate("/customQuiz")}
            className="min-h-12 w-full max-w-xs rounded-xl border-primary-color px-6 text-base font-bold text-primary-color hover:bg-primary-color/10 sm:w-auto"
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
              className="rounded-2xl border border-gray-100 bg-white/90 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.className}`}
              >
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-gray-950">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm font-medium text-gray-500">
          <FileText className="h-4 w-4 text-primary-color" aria-hidden="true" />
          Built for self-practice, classrooms, and reading comprehension.
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

export default Banner;
