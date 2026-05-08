import type { Blog, Feedback, ManualQuiz, QuizHistory, QuizQuestion } from "@quizlytics/types";

export type WithMongoId<T> = T & { _id?: string };

export type BlogRecord = WithMongoId<Blog>;

export type FeedbackRecord = WithMongoId<
  Feedback & {
    designation?: string;
  }
>;

export type HistoryRecord = WithMongoId<QuizHistory>;

export type ManualQuizRecord = WithMongoId<
  Omit<ManualQuiz, "quizArr"> & {
    quizArr?: QuizQuestion[];
  }
>;

export type MarkedAnswer = string | number | null | undefined;
