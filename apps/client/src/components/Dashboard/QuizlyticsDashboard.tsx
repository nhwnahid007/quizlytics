"use client";

import { getMarks } from "@/requests/get";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { FiCheckCircle, FiZap } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useRouterHook from "@/app/hooks/useRouterHook";
import type { HistoryWithMongoId } from "@/requests/get";
import {
  ArrowRight,
  Activity,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Clock,
  FileText,
  Link2,
  Sparkles,
  Trophy,
} from "lucide-react";
import moment from "moment";
import {
  DashboardSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/Shared/StateBlocks";

type QuizMode = {
  title: string;
  description: string;
  bullets: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bg: string;
  route: string;
  btnText: string;
};

const scoreValue = (value: number | null | undefined) => value ?? 0;

const QuizlyticsDashboard = () => {
  const { data: session, status } = useSession();
  const [marks, setMarks] = useState<HistoryWithMongoId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouterHook();
  const email = session?.user?.email;

  const fetchMarks = useCallback(async () => {
    if (status === "loading") return;

    if (!email) {
      setMarks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getMarks(email);
      setMarks(Array.isArray(data) ? data : []);
    } catch {
      setError("We could not load your dashboard data.");
      toast.error("Dashboard data failed to load.");
    } finally {
      setLoading(false);
    }
  }, [email, status]);

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  const statistics = useMemo(() => {
    const totalExams = marks.length;
    const highestMarks =
      totalExams > 0
        ? Math.max(...marks.map(item => scoreValue(item.marks)))
        : 0;
    const averageMarks =
      totalExams > 0
        ? Math.round(
            marks.reduce((sum, item) => sum + scoreValue(item.marks), 0) /
              totalExams
          )
        : 0;
    const latestAttempt =
      totalExams > 0
        ? [...marks].sort(
            (a, b) =>
              new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
          )[0]
        : null;

    return { totalExams, highestMarks, averageMarks, latestAttempt };
  }, [marks]);

  const { totalExams, highestMarks, averageMarks, latestAttempt } = statistics;

  const quizModes: QuizMode[] = [
    {
      title: "AI Generated Quiz",
      description: "Generate focused practice from a topic in seconds.",
      bullets: [
        "Generate questions from any topic",
        "Choose difficulty and question count",
        "Best for self-practice",
      ],
      icon: BrainCircuit,
      color: "text-purple-600",
      bg: "bg-purple-50",
      route: "/quickExam",
      btnText: "Start AI Quiz",
    },
    {
      title: "Custom Quiz",
      description: "Use a quiz key to join a teacher or admin assignment.",
      bullets: [
        "Enter a quiz key from teacher/admin",
        "Join assigned quizzes quickly",
        "Best for classroom use",
      ],
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
      route: "/customQuiz",
      btnText: "Join with Key",
    },
    {
      title: "Link to Quiz",
      description: "Paste a reading link and get comprehension questions.",
      bullets: [
        "Paste an article or resource link",
        "Generate quiz from the content",
        "Best for reading comprehension",
      ],
      icon: Link2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      route: "/quizByLink",
      btnText: "Use Article Link",
    },
  ];

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <ErrorState
          title="Dashboard unavailable"
          description="Your stats and activity could not load. Check your connection and try again."
          onRetry={fetchMarks}
          retryLabel="Retry"
        />
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl p-4 md:p-8">
      <header className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-color/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-color">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Learning dashboard
          </p>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
            Hello, {session?.user?.name?.split(" ")[0] || "Explorer"}
          </h1>
          <p className="mt-2 max-w-2xl text-gray-500">
            Pick a quiz mode, practice, then review saved submissions from one
            place.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => router.push("/quickExam")}
          className="min-h-11 rounded-xl bg-primary-color px-5 font-bold text-white hover:bg-primary-color/90"
        >
          Start a Quiz
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </header>

      <section
        className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3"
        aria-label="Quiz stats"
      >
        <StatCard
          icon={Trophy}
          label="Highest Score"
          value={`${highestMarks}%`}
          helper={totalExams ? "Best saved attempt" : "No attempts yet"}
          color="text-primary-color"
          bg="bg-primary-color/10"
        />
        <StatCard
          icon={Clock}
          label="Quizzes Taken"
          value={String(totalExams)}
          helper="Saved submissions"
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={BarChart3}
          label="Average Score"
          value={totalExams ? `${averageMarks}%` : "Coming soon"}
          helper={
            totalExams ? "Across saved results" : "Save a result to unlock"
          }
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
      </section>

      <section className="mb-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <FiZap className="text-yellow-500" aria-hidden="true" />
            Choose Quiz Mode
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {quizModes.map(mode => (
            <QuizModeCard
              key={mode.title}
              mode={mode}
              onStart={() => router.push(mode.route)}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2 md:p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-500">
                Your latest saved quiz result appears here.
              </p>
            </div>
            <Link
              href="/Dashboard/quizHistory"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold text-primary-color hover:bg-primary-color/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-color/40"
            >
              View All History
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {latestAttempt ? (
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary-color shadow-sm">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-950">
                    {latestAttempt.quizTitle ||
                      latestAttempt.quizCategory ||
                      "Quiz attempt"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {latestAttempt.date
                      ? moment(latestAttempt.date).fromNow()
                      : "Recently saved"}
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-white px-4 py-3 text-left shadow-sm sm:text-right">
                <span className="block text-2xl font-black text-primary-color">
                  {latestAttempt.marks ?? 0}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Score
                </span>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Activity}
              title="No quiz activity yet"
              description="Start your first quiz to see progress here."
              action={
                <Button
                  type="button"
                  onClick={() => router.push("/quickExam")}
                  className="min-h-11 rounded-xl bg-primary-color px-5 font-bold text-white hover:bg-primary-color/90"
                >
                  Start a Quiz
                </Button>
              }
            />
          )}
        </div>

        <div className="flex flex-col justify-between rounded-2xl bg-gray-950 p-6 text-white shadow-sm">
          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold">Progress insights</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Personalized streaks, rankings, and topic trends need backend
              metrics.
            </p>
          </div>
          <div className="mt-8 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white/80">
            Coming soon
          </div>
        </div>
      </section>
    </main>
  );
};

function StatCard({
  icon: Icon,
  label,
  value,
  helper,
  color,
  bg,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  helper: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}
      >
        <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <h3 className="mt-1 text-3xl font-black text-gray-950">{value}</h3>
      <p className="mt-1 text-xs text-gray-400">{helper}</p>
    </div>
  );
}

function QuizModeCard({
  mode,
  onStart,
}: {
  mode: QuizMode;
  onStart: () => void;
}) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary-color/20 hover:shadow-md">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${mode.bg}`}
      >
        <mode.icon className={`h-6 w-6 ${mode.color}`} aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-gray-950">{mode.title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
        {mode.description}
      </p>

      <ul className="mt-5 flex-1 space-y-3">
        {mode.bullets.map(bullet => (
          <li
            key={bullet}
            className="flex items-start gap-2 text-sm text-gray-600"
          >
            <FiCheckCircle
              className="mt-0.5 shrink-0 text-emerald-500"
              aria-hidden="true"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        onClick={onStart}
        className="mt-6 min-h-11 w-full rounded-xl bg-gray-950 font-bold text-white hover:bg-primary-color"
      >
        {mode.btnText}
        <ArrowRight
          className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Button>
    </article>
  );
}

export default QuizlyticsDashboard;
