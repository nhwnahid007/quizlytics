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
import type { QuizQuestion } from "@quizlytics/types";
import type { MarkedAnswer } from "@/types/client";

const SubmitCard = ({
  item,
  markedAnswer,
  idx,
}: {
  item: QuizQuestion;
  markedAnswer: MarkedAnswer;
  idx: number;
}) => {
  const isCorrect = item.correct_answer == markedAnswer;

  return (
    <div className="relative group">
      <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary-color/20 group-hover:bg-primary-color transition-colors" />

        <CardHeader className="pb-4 pt-6 px-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-color bg-primary-color/10 px-3 py-1 rounded-full">
              Question {idx + 1}
            </span>
          </div>
          <CardTitle className="text-xl font-bold leading-tight text-foreground">
            {item.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-8 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {item.options.map((option: string, index: number) => {
              const isSelected = markedAnswer === index;
              const isCorrectOption = Number(item.correct_answer) === index;

              let variantClasses =
                "bg-muted/30 border-transparent text-muted-foreground dark:bg-muted/20 dark:border-border/50";
              if (isSelected) {
                variantClasses = isCorrect
                  ? "bg-green-50 border-green-200 text-green-700 font-semibold ring-1 ring-green-200 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400 dark:ring-green-800"
                  : "bg-red-50 border-red-200 text-red-700 font-semibold ring-1 ring-red-200 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400 dark:ring-red-800";
              } else if (isCorrectOption && !isCorrect) {
                // Highlight the correct answer if the user got it wrong
                variantClasses =
                  "bg-green-50/50 border-green-100 text-green-600 font-medium dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-500";
              }

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${variantClasses}`}
                >
                  <span className="text-sm">{option}</span>
                  {isSelected && (
                    <div className="shrink-0">
                      {isCorrect ? (
                        <AiOutlineCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                      ) : (
                        <AiOutlineCloseCircle className="text-red-600 dark:text-red-400 text-xl" />
                      )}
                    </div>
                  )}
                  {isCorrectOption && !isCorrect && (
                    <AiOutlineCheckCircle
                      className="text-green-500/50 dark:text-green-400/50 text-lg shrink-0"
                      title="Correct Answer"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>

        <CardFooter className="px-8 py-6 bg-muted/20 border-t border-border/50">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`h-2 w-2 rounded-full ${isCorrect ? "bg-green-500" : "bg-red-500"}`}
              />
              <p className="text-sm font-bold text-foreground">
                {isCorrect ? "Correctly Answered" : "Incorrectly Answered"}
              </p>
            </div>

            {item.explain && (
              <div className="mt-3 p-4 rounded-2xl bg-background border border-border/50">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Explanation
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.explain}
                </p>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubmitCard;
