export const connectDB = (): never => {
  throw new Error(
    "Direct database access was removed. Use server API routes or @quizlytics/db from server-only code.",
  );
};
