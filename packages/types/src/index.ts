import type {
  aiQuizHistory,
  blogs,
  feedback,
  linkQuizHistory,
  manualQuiz,
  payments,
  quizHistory,
  users,
} from "@quizlytics/db/schema";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface QuizQuestion {
  _id?: string;
  id?: string | number;
  question?: string;
  options: string[];
  correct_answer?: string | number | null;
  user_answer?: string | number | null;
  explain?: string;
}

export interface UserExamAnswer extends QuizQuestion {
  examId?: string;
  exam_date?: string;
  user_name?: string | null;
  user_email?: string | null;
  user_profile?: string | null;
}

export interface QuizResultSummary {
  totalQuiz: number;
  correctAnswers: number;
  percentageMark: number;
}

export interface ApiMessageResponse {
  message?: string;
  insertedId?: string;
  modifiedCount?: number;
  deletedCount?: number;
}

export type UserRole = "admin" | "examiner" | "user" | string;
export type UserStatus = "Free" | "Pro" | string;

export type SelectRegisteredUser = typeof users.$inferSelect;
export type InsertRegisteredUser = typeof users.$inferInsert;
export type RegisteredUser = SelectRegisteredUser;

export type SelectQuizHistory = typeof quizHistory.$inferSelect;
export type InsertQuizHistory = typeof quizHistory.$inferInsert;
export type QuizHistory = SelectQuizHistory;

export type SelectAiQuizHistory = typeof aiQuizHistory.$inferSelect;
export type InsertAiQuizHistory = typeof aiQuizHistory.$inferInsert;
export type AiQuizHistory = SelectAiQuizHistory;

export type SelectLinkQuizHistory = typeof linkQuizHistory.$inferSelect;
export type InsertLinkQuizHistory = typeof linkQuizHistory.$inferInsert;
export type LinkQuizHistory = SelectLinkQuizHistory;

export type SelectManualQuiz = typeof manualQuiz.$inferSelect;
export type InsertManualQuiz = typeof manualQuiz.$inferInsert;
export type ManualQuiz = SelectManualQuiz;

export type SelectFeedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;
export type Feedback = SelectFeedback;

export type SelectBlog = typeof blogs.$inferSelect;
export type InsertBlog = typeof blogs.$inferInsert;
export type Blog = SelectBlog;

export type SelectPayment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type Payment = SelectPayment;
