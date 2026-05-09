"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Check, RotateCcw, Play } from "lucide-react";
import type { QuizQuestion } from "@quizlytics/types";

interface QuizEditorProps {
  questions: QuizQuestion[];
  onConfirm: (edited: QuizQuestion[]) => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export default function QuizEditor({
  questions,
  onConfirm,
  onRegenerate,
  isRegenerating,
}: QuizEditorProps) {
  const [editedQuestions, setEditedQuestions] = useState<QuizQuestion[]>(
    () => questions.map((q) => ({ ...q, options: [...q.options] })),
  );

  const updateQuestion = (idx: number, field: keyof QuizQuestion, value: unknown) => {
    setEditedQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const updateOption = (qIdx: number, optIdx: number, value: string) => {
    setEditedQuestions((prev) => {
      const copy = [...prev];
      const opts = [...copy[qIdx].options];
      opts[optIdx] = value;
      copy[qIdx] = { ...copy[qIdx], options: opts };
      return copy;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Review & Edit Questions
          </h2>
          <p className="text-muted-foreground mt-1">
            Edit questions before starting the quiz
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="gap-2 rounded-xl"
          >
            <RotateCcw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
          <Button
            onClick={() => onConfirm(editedQuestions)}
            className="gap-2 rounded-xl bg-primary-color hover:bg-primary-color/90 text-white"
          >
            <Play className="h-4 w-4" />
            Start Quiz
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {editedQuestions.map((q, qIdx) => (
          <div
            key={q.id ?? qIdx}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="bg-primary-color text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                {qIdx + 1}
              </span>
              <input
                type="text"
                value={q.question ?? ""}
                onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                className="flex-1 bg-transparent border-b border-border focus:border-primary-color outline-none text-foreground font-medium text-lg pb-1 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
              {q.options.map((opt, optIdx) => {
                const isCorrect =
                  String(q.correct_answer) === String(optIdx);
                return (
                  <div
                    key={optIdx}
                    className={`flex items-center gap-2 rounded-xl border p-3 transition-colors ${
                      isCorrect
                        ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                        : "border-border"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        updateQuestion(qIdx, "correct_answer", String(optIdx))
                      }
                      className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isCorrect
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-muted-foreground/40 hover:border-primary-color"
                      }`}
                    >
                      {isCorrect && <Check className="h-3 w-3" />}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        updateOption(qIdx, optIdx, e.target.value)
                      }
                      className="flex-1 bg-transparent outline-none text-foreground text-sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
