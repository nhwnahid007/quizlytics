"use client";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
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
import { CheckCircle, TimerReset, XCircle, MessageSquare, Share2 } from "lucide-react"; // Import the icons
import { toast } from "react-toastify";
import { SectionTitleMinimal } from "../Shared/SectionTitle";

const Overview = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [chartData, setChartData] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      const res = await axios.get(
        "https://quizlytics.jonomukti.org/allExaminee"
      );
      const data = res.data;

      // Process data to count quizzes per category
      const quizCategoryCounts = data.reduce((acc, item) => {
        acc[item.quizCategory] = (acc[item.quizCategory] || 0) + 1;
        return acc;
      }, {});

      // Format the data for the BarChart
      const formattedData = Object.keys(quizCategoryCounts).map((category) => ({
        quizCategory: category,
        count: quizCategoryCounts[category],
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching examinees:", error);
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
    <div className=" py-8 ">
      <div className="w-[90%]  max-w-6xl mx-auto">
        <SectionTitleMinimal 
          heading={"Overview"} 
          subHeading={"Explore quiz statistics, try demo questions, and discover key features"}
        >
        </SectionTitleMinimal>

        {/* Trending Topics & Question Type */}
        <div className="flex flex-col lg:flex-row gap-8 mt-12">
          <div
            className="w-full lg:w-1/2 bg-gray-100 bg-opacity-90 rounded-2xl p-8"
            style={{ color: "#2C2F33" }}
          >
            <h2 className="text-3xl border-b-2 border-gray-300 font-bold pb-2 mb-4 text-semibold">
              Trending Topics
            </h2>
            <div className="flex justify-center">
              <BarChart width={400} height={300} data={chartData}>
                <XAxis dataKey="quizCategory" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#7A1CAC" />
              </BarChart>
            </div>
          </div>

          <div
            className="w-full lg:w-1/2 bg-gray-100 bg-opacity-90 rounded-2xl p-8"
            style={{ color: "#2C2F33" }}
          >
            <h2 className="text-3xl font-bold border-b-2 border-gray-300 pb-2 mb-8 text-semibold">
              Check Your Knowledge Now!
            </h2>
            <h3 className="text-xl font-semibold text-semibold">
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
                    className={`flex items-center border-2 border-gray-300 py-2 px-4 rounded-xl ${
                      selectedOption === option
                        ? "bg-secondary-color opacity-80 text-white"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id={`option${index}`}
                      name="question"
                      className="mr-2 accent-primary-color"
                      onChange={() => setSelectedOption(option)}
                    />
                    <label htmlFor={`option${index}`} className="text-semibold">
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              onClick={handleCheckAnswer}
              className="mt-4 py-2 px-4 rounded"
            >
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
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="w-full lg:w-1/3 bg-gray-100 rounded-3xl p-8 shadow-md">
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center">
                <TimerReset className="w-7 h-7 text-gray-800" />
              </div>
              <h1 className="text-2xl font-bold text-primary-color">
                Add Time Limits
              </h1>
              <p className="text-gray-600 text-lg">
                Experience the thrill of competitive quizzing with our timed challenges. 
                Race against the clock as you tackle questions of varying difficulty, 
                making every second count!
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/3 bg-gray-100 rounded-3xl p-8 shadow-md">
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-primary-color" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Share Feedback</h1>
              <p className="text-gray-600 text-lg">
                Provide valuable feedback on quizzes and share your scores with others. Help improve the learning experience and celebrate achievements within the quiz community.
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 bg-gray-100 rounded-3xl p-8 shadow-md">
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center">
                <Share2 className="w-7 h-7 text-primary-color" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Share Score</h1>
              <p className="text-gray-600 text-lg">
                Share your quiz scores with friends and colleagues. Compare results, track progress, and motivate each other to achieve higher scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
