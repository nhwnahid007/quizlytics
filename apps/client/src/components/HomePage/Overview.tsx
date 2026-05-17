"use client";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  TimerReset,
  XCircle,
  MessageSquare,
  Share2,
} from "lucide-react"; // Import the icons
import { toast } from "sonner";
import { SectionTitleMinimal } from "../Shared/SectionTitle";
import { getExaminees } from "@/services/quiz.service";

interface CategoryCount {
  quizCategory: string;
  count: number;
}

const Overview = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [chartData, setChartData] = useState<CategoryCount[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const correctAnswer = "B) Building scalable server-side applications"; // Update the correct answer

  const handleCheckAnswer = () => {
    if (selectedOption) {
      const isAnswerCorrect = selectedOption === correctAnswer;
      setIsCorrect(isAnswerCorrect);
      setIsDialogOpen(true);
    } else {
      toast.error("Please select an option first.");
    }
  };

  // Fetch examinee data
  const fetchExaminees = async () => {
    try {
      const data = await getExaminees();

      // Process data to count quizzes per category
      const quizCategoryCounts = data.reduce<Record<string, number>>(
        (acc, item) => {
          const category = item.quizCategory ?? "Unknown";
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        },
        {}
      );

      // Format the data for the BarChart
      const formattedData = Object.keys(quizCategoryCounts).map(category => ({
        quizCategory: category,
        count: quizCategoryCounts[category] ?? 0,
      }));

      setChartData(formattedData);
    } catch {
      setChartData([]);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    // Call the function to fetch examinee data when the component mounts
    fetchExaminees();
  }, []);

  return (
    <section className="py-8">
      <div className="mx-auto w-[92%] max-w-6xl">
        <SectionTitleMinimal
          heading={"Overview"}
          subHeading={
            "Explore quiz statistics, try demo questions, and discover key features"
          }
        ></SectionTitleMinimal>

        {/* Trending Topics & Question Type */}
        <div className="mt-12 flex flex-col gap-6 lg:flex-row">
          <div className="w-full rounded-lg border border-border bg-card p-5 shadow-sm md:p-8 lg:w-1/2">
            <h2 className="mb-4 border-b border-border pb-2 text-2xl font-bold text-foreground">
              Trending Topics
            </h2>
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="quizCategory"
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted))" }}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Legend
                      formatter={value => (
                        <span className="text-muted-foreground">{value}</span>
                      )}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--brand))"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background/60 p-6 text-center">
                  <p className="text-sm font-semibold text-foreground">
                    No topic data yet
                  </p>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                    Quiz activity will appear here once learners start saving
                    submissions.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full rounded-lg border border-border bg-card p-5 shadow-sm md:p-8 lg:w-1/2">
            <h2 className="mb-8 border-b border-border pb-2 text-2xl font-bold text-foreground">
              Check Your Knowledge Now!
            </h2>
            <h3 className="text-lg font-semibold text-foreground md:text-xl">
              What is the primary use of Node.js in the MERN stack?
            </h3>
            <div>
              <ul className="mt-3 space-y-2">
                {[
                  "A) Handling client-side rendering",
                  "B) Building scalable server-side applications",
                  "C) Managing the application's state",
                  "D) Optimizing network performance",
                ].map((option, index) => (
                  <li
                    key={index}
                    className={`flex items-center rounded-lg border px-4 py-3 transition ${
                      selectedOption === option
                        ? "border-primary-color bg-primary-color/10 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary-color/40 hover:text-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      id={`option${index}`}
                      name="question"
                      className="mr-2 accent-primary-color"
                      onChange={() => setSelectedOption(option)}
                    />
                    <label htmlFor={`option${index}`} className="font-medium">
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={handleCheckAnswer} className="mt-4 px-5">
              Check
            </Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center">
                  {isCorrect ? (
                    <>
                      <CheckCircle color="green" size={24} className="mr-2" />
                      <span>Correct Answer!</span>
                    </>
                  ) : (
                    <>
                      <XCircle color="red" size={24} className="mr-2" />
                      <span>Incorrect Answer</span>
                    </>
                  )}
                </div>
              </DialogTitle>
              <DialogDescription>
                {isCorrect ? (
                  <p>Your answer is correct!</p>
                ) : (
                  <p>
                    Your answer is incorrect. <br /> The correct answer is:{" "}
                    {correctAnswer}
                  </p>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Achievement */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <div className="w-full rounded-lg border border-border bg-card p-6 shadow-sm lg:w-1/3">
            <div className="flex flex-col gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-color/10">
                <TimerReset className="h-7 w-7 text-primary-color" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Add Time Limits
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                Experience the thrill of competitive quizzing with our timed
                challenges. Race against the clock as you tackle questions of
                varying difficulty, making every second count!
              </p>
            </div>
          </div>

          <div className="w-full rounded-lg border border-border bg-card p-6 shadow-sm lg:w-1/3">
            <div className="flex flex-col gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                <MessageSquare className="w-7 h-7 text-primary-color" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Share Feedback
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                Provide valuable feedback on quizzes and share your scores with
                others. Help improve the learning experience and celebrate
                achievements within the quiz community.
              </p>
            </div>
          </div>

          <div className="w-full rounded-lg border border-border bg-card p-6 shadow-sm lg:w-1/3">
            <div className="flex flex-col gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                <Share2 className="w-7 h-7 text-primary-color" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Share Score
              </h1>
              <p className="text-base leading-7 text-muted-foreground">
                Share your quiz scores with friends and colleagues. Compare
                results, track progress, and motivate each other to achieve
                higher scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
