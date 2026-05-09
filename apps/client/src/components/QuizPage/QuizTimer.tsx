"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Timer } from "lucide-react";

interface QuizTimerProps {
  durationMinutes: number;
  quizKey?: string | null;
  onTimeUp: () => void;
}

const STORAGE_PREFIX = "quiz_timer_";

export default function QuizTimer({
  durationMinutes,
  quizKey,
  onTimeUp,
}: QuizTimerProps) {
  const storageKey = `${STORAGE_PREFIX}${quizKey ?? "default"}`;
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  const getInitialSeconds = useCallback((): number => {
    if (typeof window === "undefined") return durationMinutes * 60;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return durationMinutes * 60;
  }, [durationMinutes, storageKey]);

  const [secondsLeft, setSecondsLeft] = useState<number>(getInitialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      localStorage.removeItem(storageKey);
      onTimeUpRef.current();
      return;
    }

    localStorage.setItem(storageKey, String(secondsLeft));

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          localStorage.removeItem(storageKey);
          onTimeUpRef.current();
          return 0;
        }
        localStorage.setItem(storageKey, String(next));
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, storageKey]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isWarning = secondsLeft <= 60;
  const isCritical = secondsLeft <= 30;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-2xl
        shadow-lg backdrop-blur-md border font-mono text-lg font-bold
        transition-all duration-300
        ${
          isCritical
            ? "bg-red-500/90 text-white border-red-400 animate-pulse"
            : isWarning
              ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
              : "bg-background/80 text-foreground border-border"
        }
      `}
    >
      <Timer
        className={`h-5 w-5 ${isCritical ? "text-white" : isWarning ? "text-red-600 dark:text-red-400" : "text-primary-color"}`}
      />
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
