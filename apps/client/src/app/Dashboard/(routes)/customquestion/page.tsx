"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import useRole from "@/app/hooks/useRole";
import NotFound from "@/app/not-found";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";
import { SectionTitleMinimal } from "@/components/Shared/SectionTitle";
import type { ChangeEvent } from "react";
import type { QuizQuestion } from "@quizlytics/types";
import { saveManualQuiz } from "@/services/quiz.service";

const Page = () => {
  const [role, roleLoading, roleError] = useRole();
  const [quizKey, setQuizKey] = useState<string>("1234");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const { data: session } = useSession();
  const email = session?.user?.email;
  // Function to generate random key
  function generateRandomKey() {
    const numbers = "0123456789";
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let key = "";

    // Generate 4 random numbers
    for (let i = 0; i < 4; i++) {
      key += numbers[Math.floor(Math.random() * numbers.length)];
    }

    // Generate 2 random alphabets
    for (let i = 0; i < 2; i++) {
      key += alphabets[Math.floor(Math.random() * alphabets.length)];
    }

    return key;
  }

  const newKey = generateRandomKey();

  useEffect(() => {
    setQuizKey(newKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [questionData, setQuestionData] = useState<QuizQuestion>({
    question: "",
    options: ["", "", "", ""],
    correct_answer: "",
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeCategory = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuestionData({
      ...questionData,
      [name]: value,
    });
  };

  if (roleLoading) {
    return <div><LoadingSpinner/></div>;
  }



  if (role == "user") {
    return <NotFound />;
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({
      ...questionData,
      options: newOptions,
    });
  };

  const addQuestion = () => {
    if (
      questionData.question &&
      questionData.options.every((option) => option !== "") &&
      questionData.correct_answer !== ""
    ) {
      const newQuestion = {
        id: questions.length + 1,
        question: questionData.question,
        options: questionData.options,
        correct_answer: questionData.correct_answer,
      };

      setQuestions([...questions, newQuestion]);

      // Reset form
      setQuestionData({
        question: "",
        options: ["", "", "", ""],
        correct_answer: "",
      });
    } else {
      alert("Please fill in all fields before adding the question.");
    }
  };

  const quizSet = {
    quizTitle: title,
    quizCategory: category,
    quizStartKey: quizKey,
    quizArr: questions,
    quizCreator: email,
  };



  const submitQuestions = async () => {
    try {
      await saveManualQuiz(quizSet);
      Swal.fire({
        title: "Success!",
        toast: true,
        text: "Quiz saved successfully",
        icon: "success",
        timer: 2000,
      });

      // Clear the questions array after submission
      setQuestions([]);
      setQuizKey(newKey);
    } catch {
      Swal.fire({
        title: "Error",
        toast: true,
        text: "Failed to save quiz",
        icon: "error",
      });
    }
  };

  return (
    <div className="h-screen px-5  lg:mx-20  mx-auto">
      <main className="max-w-6xl mx-auto ">
        <div className="">
        
          <SectionTitleMinimal heading={" Create Custom Questions"} subHeading={"Create custom questions for your quiz"}></SectionTitleMinimal>

          <div className="grid gap-6 md:grid-cols-2 mb-3">
            <div className="relative">
              <label className="block  font-bold text-gray-700">
                Quiz Start Key
              </label>
              <Input
                type="text"
                value={quizKey}
                readOnly
                className="w-full p-6 border border-transparent rounded-md shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200 ease-in-out bg-gray-100 hover:bg-gray-50 mb-4"
              />
            </div>
            <div className="relative">
              <label className="block  font-bold text-gray-700">
                Quiz Title
              </label>
              <Input
                type="text"
                name="quizTitle"
                onChange={handleChangeTitle}
                className="w-full p-6 border border-transparent rounded-md shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200 ease-in-out bg-white hover:bg-gray-50 mb-4"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-3">
            <div className="relative">
              <label className="block font-bold text-gray-700">
                Category
              </label>
              <Input
                type="text"
                onChange={handleChangeCategory}
                className="w-full p-6 border border-transparent rounded-md shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200 ease-in-out bg-white hover:bg-gray-50 mb-4"
              />
            </div>
            <div className="relative">
              <label className="block font-bold text-gray-700">
                Question
              </label>
              <Input
                type="text"
                name="question"
                value={questionData.question}
                onChange={handleChange}
                className="w-full p-6 border border-transparent rounded-md shadow-md focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-200 ease-in-out bg-white hover:bg-gray-50 mb-4"
              />
            </div>
          </div>

          <div className="relative mb-3">
            <label className="block font-bold text-gray-700">
              Options
            </label>
            {questionData.options.map((option: string, index: number) => (
              <Input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full p-6 border border-transparent rounded-md shadow-md focus:ring-2 focus:ring-purple-400 focus:outline-none transition duration-200 ease-in-out bg-white hover:bg-gray-50 mb-4"
              />
            ))}
          </div>

          <div className="relative mb-4">
            <label className="block font-bold text-gray-700">
              Correct Answer (0-3)
            </label>
            <Input
              type="number"
              name="correct_answer"
              value={questionData.correct_answer ?? ""}
              onChange={handleChange}
              min="0"
              max="3"
              className="w-full p-6 border border-transparent rounded-md shadow-md focus:ring-2 focus:ring-red-400 focus:outline-none transition duration-200 ease-in-out bg-white hover:bg-gray-50 mb-4"
            />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={addQuestion}
              className="w-full md:w-2/5 h-12 mt-5 px-4"
            >
              Add Question
            </Button>
          </div>

          <div className="mt-3">
            {questions.length > 0 && (
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Questions Preview
              </h2>
            )}
            {questions.map((q) => (
              <div
                key={q.id}
                className="mb-4 p-6 border border-gray-300 rounded-md shadow-md"
              >
                <h3 className="font-semibold text-lg">{q.question}</h3>
                <ul className="list-disc list-inside ">
                  {q.options.map((option: string, index: number) => (
                    <li key={index}>
                      {index}: {option}
                    </li>
                  ))}
                </ul>
                <p>
                  Correct Answer: {q.correct_answer}
                </p>
              </div>
            ))}

            {questions.length > 0 && (
              <Button
                variant="secondary"
                onClick={submitQuestions}
                className="w-full bg-secondary-color text-white py-3 px-4 rounded-md shadow-md hover:bg-secondary-color transition duration-200 mt-4"
              >
                Submit Questions
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
