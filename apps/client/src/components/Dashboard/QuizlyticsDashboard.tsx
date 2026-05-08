"use client";
import { getMarks } from "@/requests/get";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import {
  FiCheckCircle,
  FiZap,
  FiFileText,
} from "react-icons/fi";
import Spinner from "../Shared/Spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useRouterHook from "@/app/hooks/useRouterHook";
import type { HistoryWithMongoId } from "@/requests/get";
import { ArrowRight, Sparkles, BookOpen, Link2, Clock, Trophy, Activity } from "lucide-react";
import moment from "moment";

const QuizlyticsDashboard = () => {
  const { data: session } = useSession();
  const [marks, setMarks] = useState<HistoryWithMongoId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouterHook();

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        if (session?.user?.email) {
          const data = await getMarks(session.user.email);
          setMarks(data);
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          toast: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [session]);

  const getStatistics = () => {
    const totalExams = marks.length;
    const highestMarks =
      totalExams > 0 ? Math.max(...marks.map((item) => item.marks ?? 0)) : 0;
    const latestAttempt = totalExams > 0 ? marks[0] : null;

    return { totalExams, highestMarks, latestAttempt };
  };

  const { totalExams, highestMarks, latestAttempt } = getStatistics();

  const quizModes = [
    {
      title: "AI Generated",
      description: "Custom quizzes on any topic created instantly by our AI.",
      icon: Sparkles,
      color: "text-purple-600",
      bg: "bg-purple-50",
      route: "/quickExam",
      btnText: "Start AI Quiz",
    },
    {
      title: "Custom Quiz",
      description: "Take exams prepared by your teachers with unique keys.",
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
      route: "/customQuiz",
      btnText: "Join Custom Quiz",
    },
    {
      title: "Link to Quiz",
      description: "Paste an article URL and generate a quiz from its content.",
      icon: Link2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      route: "/quizByLink",
      btnText: "Generate from Link",
    },
  ];

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Hello, {session?.user?.name?.split(' ')[0] || 'Explorer'}! 👋
        </h1>
        <p className="text-gray-500 mt-2">Ready to test your knowledge today?</p>
      </header>

      {/* Stats Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-primary-color/10 p-3 rounded-2xl">
            <Trophy className="text-primary-color" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Highest Score</p>
            <h3 className="text-2xl font-bold text-gray-900">{highestMarks}%</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-2xl">
            <Clock className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Quizzes Taken</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalExams}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-2xl">
            <Activity className="text-emerald-600" size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Global Rank</p>
            <h3 className="text-2xl font-bold text-gray-900">#42</h3>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FiZap className="text-yellow-500" />
        Choose Quiz Mode
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {quizModes.map((mode, i) => (
          <Card key={i} className="group overflow-hidden border-none shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300 rounded-3xl">
            <CardHeader className={`${mode.bg} pb-8`}>
              <div className={`${mode.color} mb-4`}>
                <mode.icon size={32} />
              </div>
              <CardTitle className="text-xl font-bold">{mode.title}</CardTitle>
              <CardDescription className="text-gray-600 line-clamp-2">
                {mode.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                 <li className="flex items-center gap-2 text-sm text-gray-500">
                   <FiCheckCircle className="text-emerald-500" /> Instant results
                 </li>
                 <li className="flex items-center gap-2 text-sm text-gray-500">
                   <FiCheckCircle className="text-emerald-500" /> Detailed analysis
                 </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => router.push(mode.route)}
                className="w-full bg-gray-900 hover:bg-primary-color text-white rounded-2xl py-6 font-bold group-hover:gap-4 transition-all"
              >
                {mode.btnText}
                <ArrowRight size={18} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Latest Attempt & Call to Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Latest Activity</h3>
          {latestAttempt ? (
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <FiFileText className="text-primary-color" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{latestAttempt.quizTitle || latestAttempt.quizCategory}</h4>
                  <p className="text-sm text-gray-500">{moment(latestAttempt.date).fromNow()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-black text-primary-color">{latestAttempt.marks}%</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Score</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 italic">
              No recent activity. Start a quiz to see your progress!
            </div>
          )}
          <Link href="/Dashboard/quizHistory" className="inline-flex items-center gap-2 text-primary-color font-bold mt-6 hover:underline">
             View All History <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-primary-color p-8 rounded-3xl text-white shadow-xl shadow-primary-color/30 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Ready for a challenge?</h3>
            <p className="text-primary-color-foreground/80 text-sm">
              Take a randomized expert-level quiz and boost your global ranking!
            </p>
          </div>
          <Button 
            variant="secondary"
            className="mt-8 bg-white text-primary-color hover:bg-gray-100 rounded-xl font-bold"
            onClick={() => router.push('/quickExam')}
          >
            Surprise Me!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizlyticsDashboard;
