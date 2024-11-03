import { Clock, X } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { flushSync } from "react-dom";
import { GrRadialSelected } from "react-icons/gr";
import { useRouter } from "next/navigation";

const Quiz = ({ question, currentQuestion, totalQuestion, setAnswer }) => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
  const [remainingTime, setRemainingTime] = useState(30); // Changed from 15 to 30
  const selectedOptionRef = useRef(null);
  const timer = useRef(null);
  const progressBar = useRef(null);

  const radius = 30; // Radius for the circle
  const circumference = 2 * Math.PI * radius;
  const offset = (1 - remainingTime / 30) * circumference; // Update calculation for 30 seconds

  useEffect(() => {
    selectedOptionRef.current = selectedOption;
  }, [selectedOption]);

  const handleGoToNextQuiz = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    flushSync(() => {
      setAnswer(selectedOptionRef.current);
    });

    setSelectedOption(null);
  }, [setAnswer]);

  useEffect(() => {
    if (progressBar.current) {
      progressBar.current.value = 100;
      progressBar.current.classList.add("progress-success");
    }

    const duration = 30 * 1000; // Changed from 15 to 30
    const stepTime = 1000; // Update every second
    const steps = duration / stepTime;
    const decrement = 100 / steps;

    let stepCount = 0;

    const updateProgressBar = () => {
      stepCount++;
      if (progressBar.current) {
        progressBar.current.value = Math.max(100 - stepCount * decrement, 0);

        if (stepCount === 5) {
          progressBar.current.classList.remove("progress-success");
          progressBar.current.classList.add("progress-error");
        }
      }
      setRemainingTime(Math.max(30 - stepCount, 0)); // Update for 30 seconds
      if (stepCount < steps) {
        timer.current = setTimeout(updateProgressBar, stepTime);
      } else {
        handleGoToNextQuiz();
      }
    };

    timer.current = setTimeout(updateProgressBar, stepTime);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [question, handleGoToNextQuiz]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="w-full max-w-4xl h-full md:h-[600px] overflow-y-auto bg-white p-3 sm:p-4 md:p-6 pt-2 shadow-2xl rounded-lg flex flex-col min-h-[400px] max-h-[90vh] overflow-auto relative">
        <button
          onClick={() => router.push("/Dashboard")}
          className="absolute top-4 right-4 text-black"
        >
          <X size={24} />
        </button>
        <div className="text-center flex justify-center items-center text-sm sm:text-base">
          <svg width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#d6d6d6"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              className="stroke-primary-color"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="fill-primary-color font-bold"
              fontSize="18px"
            >
              {remainingTime} S
            </text>
          </svg>
        </div>

        <div className="flex flex-col flex-grow">
          <h1 className="text-center text-sm sm:text-base md:text-lg font-light mb-2 sm:mb-4">
            Question <span className="font-medium">{currentQuestion}</span> of{" "}
            <span className="font-medium">{totalQuestion}</span>
          </h1>

          <div className="mb-3 sm:mb-4">
            <h2 className="text-justify font-semibold text-base sm:text-lg md:text-xl text-black">
              {question?.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4">
            {question?.options.map((item, index) => (
              <div
                key={index}
                className={`flex items-center p-3 sm:p-4 rounded-lg cursor-pointer transition duration-200 ${
                  index === selectedOption
                    ? "bg-gray-300 text-black border-2 border-primary-color"
                    : "bg-white text-black border-2 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => handleOptionClick(index)}
              >
                <GrRadialSelected className="mr-2 text-lg sm:text-xl md:text-2xl flex-shrink-0" />
                <span className="text-sm sm:text-base md:text-lg leading-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-3 sm:pt-4 flex justify-end">
          <button
            className={`btn flex-1 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition duration-200 bg-primary-color text-white ${
              selectedOption === null
                ? "cursor-not-allowed"
                : "hover:opacity-60"
            }`}
            onClick={handleGoToNextQuiz}
            disabled={selectedOption === null}
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
