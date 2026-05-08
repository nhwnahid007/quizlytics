export const queryKeys = {
  allUsers: ["users", "all"] as const,
  role: (email: string | null | undefined) => ["users", "role", email] as const,
  customQuiz: ["quiz", "custom", "all"] as const,
  allFeedback: ["feedback", "all"] as const,
  allBlogs: ["blogs", "all"] as const,
  allExaminees: ["quiz", "examinees", "all"] as const,
  userHistory: (email: string | null | undefined) =>
    ["quiz", "history", "user", email] as const,
};
