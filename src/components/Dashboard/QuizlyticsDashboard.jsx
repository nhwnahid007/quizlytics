"use client";
import { getMarks } from "@/requests/get";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FiUsers, FiCheckCircle, FiBarChart, FiClock } from "react-icons/fi";
import Spinner from "../Shared/Spinner";
import Link from "next/link";
import { SectionTitleMinimal } from "../Shared/SectionTitle";

import { BellIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
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

const quickExamFeatures = [
  {
    title: "AI-Generated Quiz",
    description: "Generate questions instantly on any topic of your choice!",
  },
  {
    title: "Choose Your Knowledge Level",
    description: "Select difficulty level to your skill.",
  },
  {
    title: "Subscription Expiring Soon",
    description: "Renew your subscription to keep accessing premium features.",
  },
];

const customExamFeatures = [
  // {
  //   title: "Upload Custom Questions",
  //   description: "Create unique questions for a personalized exam.",
  // },
  {
    title: "Unique Exam Key",
    description: "Get secure access from your teacher with a unique exam key.",
  },
  {
    title: "Review Correct Answers",
    description: "Allow examinees to view correct answers post-exam.",
  },
  {
    title: "Leaderboard",
    description: "Track and evaluate performance on the leaderboard.",
  },
];

const quizByLinkFeatures = [
  {
    title: "Generate Quiz from URL",
    description:
      "Paste any article link to generate a quiz based on its content instantly.",
  },
  {
    title: "AI-Generated Questions",
    description: "AI analyzes the article and creates relevant MCQ.",
  },
  {
    title: "Test Your Understanding",
    description: "Quickly assess your comprehension of the article's content.",
  },
  // {
  //   title: "Review Correct Answers",
  //   description:
  //     "After completing the quiz, see the correct answers to learn and improve.",
  // },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
const PRIMARY_COLOR = "#8e49b6"; // Use your primary color here
const GRAY_COLOR = "#9ca3af"; // Gray color for other sections
const QuizlyticsDashboard = () => {
  const { data: session } = useSession();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const router = useRouterHook();

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        if (session?.user?.email) {
          const data = await getMarks(session.user.email);
          setMarks(data);
        }
      } catch (error) {
        console.error("Data fetching error", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while fetching leaderboard data!",
          toast: true,
        });
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchMarks();
  }, [session]);

  const getStatistics = () => {
    const totalExams = marks.length;
    const totalMarks = marks.reduce((acc, item) => acc + item.marks, 0);
    const averageMarks = (totalMarks / totalExams).toFixed(2);
    const highestMarks =
      totalExams > 0 ? Math.max(...marks.map((item) => item.marks)) : 0;
    const lowestMarks =
      totalExams > 0 ? Math.min(...marks.map((item) => item.marks)) : 0;

    return { totalExams, averageMarks, highestMarks, lowestMarks };
  };

  const categorizeMarks = () => {
    const ranges = { low: 0, mid: 0, high: 0 };
    marks.forEach((quiz) => {
      if (quiz.marks <= 50) ranges.low += 1;
      else if (quiz.marks <= 70) ranges.mid += 1;
      else ranges.high += 1;
    });
    return [
      { name: "0-50%", value: ranges.low },
      { name: "51-70%", value: ranges.mid },
      { name: "71-100%", value: ranges.high },
    ];
  };

  const getRecentQuizzes = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    return marks.filter((quiz) => new Date(quiz.date) >= thirtyDaysAgo).length;
  };

  const { totalExams, averageMarks, highestMarks, lowestMarks } =
    getStatistics();

  // Prepare data for charts
  const barChartData = marks.map((quiz) => ({
    quizTitle: quiz.quizTitle,
    marks: quiz.marks,
  }));

  const lineChartData = marks.map((quiz, index) => ({
    attempt: index + 1,
    marks: quiz.marks,
  }));

  const pieChartData = categorizeMarks();

  const handleQuickExam = () => {
    router.push("/quickExam");
  };

  const handleCustomQuiz = () => {
    router.push("/customQuiz");
  };

  const handleQuizByLink = () => {
    router.push("/quizByLink");
  };

  return (
    <div className="min-h-screen lg:mx-10 2xl:mx-20 mx-auto overflow-hidden">
      <SectionTitleMinimal
        heading={"Welcome to your Dashboard!"}
        subHeading={"Take your quizzes and improve your skills here!"}
      ></SectionTitleMinimal>

      {/* Quiz Cards here */}
      <div className="grid grid-cols-1 mt-5 lg:grid-cols-3 gap-10 my-12 mb-2 mx-5 md:mx-0">
        {/* QuickExam */}
        <Card className="h-auto w-full lg:space-y-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-primary-color text-xl">
              AI Generated Quiz
            </CardTitle>
            <CardDescription>
              Instant AI-generated quizzes on any topic and difficulty level!
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div>
              {quickExamFeatures.map((notification, index) => (
                <div
                  key={index}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start  last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary-color" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleQuickExam} className="w-full h-10 lg:h-12 font-semibold">
              Start Quiz by AI 
            </Button>
          </CardFooter>
        </Card>

        {/* CustomExam */}
        <Card className="h-auto w-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-primary-color text-xl">
              Quiz on Custom Quiz
            </CardTitle>
            <CardDescription>
              Unique Quizzes with personalized questions and a secure access key
              given by your teacher.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div>
              {customExamFeatures.map((notification, index) => (
                <div
                  key={index}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start  last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary-color " />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCustomQuiz} className="w-full h-10 lg:h-12 font-semibold">
              Start Custom Quiz
            </Button>
          </CardFooter>
        </Card>

        {/* QuizByLink */}
        <Card className="h-auto w-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-primary-color text-xl">
              Quiz from any Article Link
            </CardTitle>
            <CardDescription>
              Generate quizzes from any article link to test your understanding
              of the content.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div>
              {quizByLinkFeatures.map((notification, index) => (
                <div
                  key={index}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start  last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary-color" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleQuizByLink} className="w-full h-10 lg:h-12 font-semibold">
            Start Quiz by Link
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 pt-8 lg:grid-cols-3 gap-6 mb-5 px-5 2xl:mt-3">
        <div className="bg-primary-color bg-opacity-35 py-4 lg:py-8 px-2 2xl:px-4 rounded-lg shadow-md flex items-center justify-center">
          <div className="w-8 lg:w-12 h-8 lg:h-12 bg-gray-100 rounded-full flex justify-center items-center mr-2 lg:mr-4">
            <FiBarChart className="text-lg lg:text-xl" />
          </div>
          <div>
            <p className="text-lg lg:text-xl font-semibold">Total Attempted</p>
            <p className="text-xl lg:text-2xl font-bold">{totalExams}</p>
          </div>
        </div>

        <div className="bg-primary-color bg-opacity-35 py-4 lg:py-8 px-2 2xl:px-4 rounded-lg shadow-md flex items-center justify-center">
          <div className="w-8 lg:w-12 h-8 lg:h-12 bg-gray-100 rounded-full flex justify-center items-center mr-2 lg:mr-4">
            <FiCheckCircle className="text-lg lg:text-xl" />
          </div>
          <div>
            <p className="text-lg lg:text-xl font-semibold">Best Performance</p>
            <p className="text-xl lg:text-2xl font-bold">
              {highestMarks <= 100 ? highestMarks : 0}%
            </p>
          </div>
        </div>

        <div className="bg-primary-color bg-opacity-35 py-4 lg:py-8 px-2 2xl:px-4 rounded-lg shadow-md flex items-center justify-center">
          <div className="w-8 lg:w-12 h-8 lg:h-12 bg-gray-100 rounded-full flex justify-center items-center mr-2 lg:mr-4">
            <FiClock className="text-lg lg:text-xl" />
          </div>
          <div>
            <p className="text-lg lg:text-xl font-semibold">Quiz History</p>
            <p className="text-xl lg:text-2xl font-bold">
              {getRecentQuizzes()} days
            </p>
          </div>
        </div>
      </div>

      {/* Charts and Statistics section */}
      {marks.length === 0 ? (
        <div className="text-center my-12">
          <h2 className="text-2xl font-semibold mb-4">
            No Quizzes Attempted Yet
          </h2>
          <p className="text-gray-600 mb-6">
            It seems like you haven&apos;t taken any quizzes yet. Start your
            learning journey by taking your first quiz now!
          </p>
          <Link href="/Dashboard">
            <button className="bg-primary-color font-semibold text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
              Attempt Your First Quiz
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart for individual topic marks */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Marks by Quiz Topic
            </h3>
            <div className="flex justify-center">
              <BarChart width={500} height={300} data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quizTitle" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="marks" fill="#8e49b6" />
              </BarChart>
            </div>
          </div>

          {/* Pie Chart for marks distribution */}
          <div className="bg-white  rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Marks Distribution
            </h3>
            <div className="flex justify-center">
              <PieChart width={450} height={450}>
                <Pie
                  data={pieChartData}
                  cx={200}
                  cy={200}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={180}
                  fill={"#374151"}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? PRIMARY_COLOR : GRAY_COLOR}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizlyticsDashboard;
