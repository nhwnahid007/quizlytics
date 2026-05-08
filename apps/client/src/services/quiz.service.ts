import type {
  AiQuizHistory,
  LinkQuizHistory,
  ManualQuiz,
  QuizHistory,
  QuizQuestion,
  UserExamAnswer,
} from "@quizlytics/types";
import { apiClient } from "@/lib/api-client";

export type ManualQuizWithQuestions = Omit<ManualQuiz, "quizArr"> & {
  _id?: string;
  quizArr?: QuizQuestion[];
};

export type HistoryWithMongoId = QuizHistory & { _id?: string };
export type AiHistoryWithMongoId = AiQuizHistory & { _id?: string };
export type LinkHistoryWithMongoId = LinkQuizHistory & { _id?: string };

export const getMCQ = async (
  category: string,
  level: string,
): Promise<QuizQuestion[]> => {
  const { data } = await apiClient.get<QuizQuestion[]>("/quiz", {
    params: { category, skill: level },
  });
  return data;
};

export const getQuizByLink = async (
  artLink: string,
): Promise<QuizQuestion[]> => {
  const { data } = await apiClient.get<QuizQuestion[]>("/testByLink", {
    params: { link: artLink },
  });
  return data;
};

export const getMark = async (_examId: string): Promise<UserExamAnswer[]> => [];

export const getCustomQuiz = async (
  quizKey: string | null | undefined,
): Promise<ManualQuizWithQuestions[]> => {
  const { data } = await apiClient.get<ManualQuizWithQuestions[]>(
    "/getCustomQuizByKey",
    { params: { qKey: quizKey ?? "" } },
  );
  return data;
};

export const allCustomQuiz = async (): Promise<ManualQuizWithQuestions[]> => {
  const { data } =
    await apiClient.get<ManualQuizWithQuestions[]>("/allCustomQuiz");
  return data;
};

export const getSubmissionByKey = async (
  key: string,
  email: string,
): Promise<HistoryWithMongoId[]> => {
  const { data } = await apiClient.get<HistoryWithMongoId[]>("/historyByKey", {
    params: { qKey: key, email },
  });
  return data;
};

export const getSubmissionByQuizTitle = async (
  searchCategory: string,
  email: string,
): Promise<AiHistoryWithMongoId[]> => {
  const { data } = await apiClient.get<AiHistoryWithMongoId[]>(
    "/historyByUserAi",
    { params: { qTitle: searchCategory, email } },
  );
  return data;
};

export const getLinkHistoryByUser = async (
  email: string,
): Promise<LinkHistoryWithMongoId[]> => {
  const { data } = await apiClient.get<LinkHistoryWithMongoId[]>(
    "/linkHistoryByUser",
    { params: { email } },
  );
  return data;
};

export const getExaminees = async (): Promise<HistoryWithMongoId[]> => {
  const { data } = await apiClient.get<HistoryWithMongoId[]>("/allExaminee");
  return data;
};

export const getMarks = async (
  email: string,
): Promise<HistoryWithMongoId[]> => {
  const { data } = await apiClient.get<HistoryWithMongoId[]>("/userHistory", {
    params: { email },
  });
  return data;
};

export const getSubmissionById = async (
  _id: string,
): Promise<HistoryWithMongoId | null> => null;

export const saveHistory = async (body: unknown) => {
  const { data } = await apiClient.post("/saveHistory", body);
  return data as unknown;
};

export const saveAiQuiz = async (body: unknown) => {
  const { data } = await apiClient.post("/saveAiQuiz", body);
  return data as unknown;
};

export const saveLinkQuiz = async (body: unknown) => {
  const { data } = await apiClient.post("/linkQuiz", body);
  return data as unknown;
};

export const saveManualQuiz = async (body: unknown) => {
  const { data } = await apiClient.post("/saveManualQuiz", body);
  return data as unknown;
};

export const deleteCustomQuiz = async (qKey: string) => {
  const { data } = await apiClient.delete("/deleteCustomQuiz", {
    params: { qKey },
  });
  return data as unknown;
};

export const saveFeedback = async (body: unknown) => {
  const { data } = await apiClient.post("/feedback", body);
  return data as unknown;
};

export const getAllFeedback = async () => {
  const { data } = await apiClient.get("/all-feedback");
  return data as unknown[];
};
