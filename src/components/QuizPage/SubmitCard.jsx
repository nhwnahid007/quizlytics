"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const SubmitCard = ({ item, markedAnswer, idx }) => {
  const isCorrect = item.correct_answer == markedAnswer;

  return (
    <div className="mb-6 mx-2 lg:mx-auto max-w-4xl ">
      <Card className="shadow-xl border border-gray-200 rounded-lg">
        <CardHeader className="bg-primary-color p-4 rounded-t-lg">
          <CardTitle className="text-white text-lg font-bold">
            Question {idx + 1} : {item.question}
          </CardTitle>
          <CardDescription className="text-white mt-1">
            Options:
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <ul className="grid grid-cols-2 gap-8">
            {item.options.map((option, index) => (
              <li
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  markedAnswer === index
                    ? isCorrect
                      ? "bg-green-500 text-white font-semibold"
                      : "bg-red-500 text-white font-semibold"
                    : "bg-gray-100"
                }`}
              >
                {option}
                {markedAnswer === index && (
                  <>
                    {isCorrect ? (
                      <AiOutlineCheckCircle className="text-white text-xl ml-2" />
                    ) : (
                      <AiOutlineCloseCircle className="text-white text-xl ml-2" />
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex flex-col space-y-2">
            <p className=" text-gray-700">
              <span className="font-semibold">Correct Answer:</span>{" "}
              {item.options[item.correct_answer]}
            </p>

            {item.explain && (
              <p className=" text-gray-600">
                <span className="font-semibold">Explanation:</span>{" "}
                {item.explain}
              </p>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubmitCard;
