import type { Response } from "express";
import type {
  InsertAiQuizHistory,
  InsertFeedback,
  InsertLinkQuizHistory,
  InsertManualQuiz,
  InsertQuizHistory,
} from "@quizlytics/types";
import { getValidated } from "../middleware/validate.middleware.js";
import type { ValidatedRequestData } from "../middleware/validate.middleware.js";
import * as quizService from "../services/quiz.service.js";

type EmailQueryValidated = ValidatedRequestData & {
  query: { email: string };
};

type QuizKeyQueryValidated = ValidatedRequestData & {
  query: { qKey: string };
};

type HistoryByKeyValidated = ValidatedRequestData & {
  query: { email: string; qKey: string };
};

type HistoryByUserAiValidated = ValidatedRequestData & {
  query: { email: string; qTitle: string };
};

type GenerateQuizValidated = ValidatedRequestData & {
  query: { category: string; skill: string };
};

type LinkQuizQueryValidated = ValidatedRequestData & {
  query: { link: string };
};

type SaveHistoryValidated = ValidatedRequestData & {
  body: InsertQuizHistory;
};

type SaveAiHistoryValidated = ValidatedRequestData & {
  body: InsertAiQuizHistory;
};

type SaveLinkHistoryValidated = ValidatedRequestData & {
  body: InsertLinkQuizHistory;
};

type SaveManualQuizValidated = ValidatedRequestData & {
  body: InsertManualQuiz;
};

type SaveFeedbackValidated = ValidatedRequestData & {
  body: InsertFeedback;
};

export const saveLinkQuiz = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { body } = getValidated<SaveLinkHistoryValidated>(res);
  res.status(200).json(await quizService.saveLinkQuiz(body));
};

export const getLinkHistoryByUser = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { query } = getValidated<EmailQueryValidated>(res);
  res.status(200).json(await quizService.getLinkHistoryByUser(query.email));
};

export const saveAiQuiz = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { body } = getValidated<SaveAiHistoryValidated>(res);
  res.status(200).json(await quizService.saveAiQuiz(body));
};

export const getHistoryByUserAi = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { query } = getValidated<HistoryByUserAiValidated>(res);
  res
    .status(200)
    .json(await quizService.getHistoryByUserAi(query.email, query.qTitle));
};

export const saveHistory = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { body } = getValidated<SaveHistoryValidated>(res);
  res.status(200).json(await quizService.saveHistory(body));
};

export const getLeaderboard = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  res.status(200).json(await quizService.getLeaderboard());
};

export const getAllExaminees = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  res.status(200).json(await quizService.getAllExaminees());
};

export const getHistoryByKey = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { query } = getValidated<HistoryByKeyValidated>(res);
  res
    .status(200)
    .json(await quizService.getHistoryByKey(query.qKey, query.email));
};

export const getUserHistory = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { query } = getValidated<EmailQueryValidated>(res);
  res.status(200).json(await quizService.getUserHistory(query.email));
};

export const saveManualQuiz = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { body } = getValidated<SaveManualQuizValidated>(res);
  res.status(200).json(await quizService.saveManualQuiz(body));
};

export const getAllCustomQuiz = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  res.status(200).json(await quizService.getAllCustomQuiz());
};

export const getCustomQuizByKey = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { query } = getValidated<QuizKeyQueryValidated>(res);
  res.status(200).json(await quizService.getCustomQuizByKey(query.qKey));
};

export const deleteCustomQuiz = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { query } = getValidated<QuizKeyQueryValidated>(res);
  res.status(200).json(await quizService.deleteCustomQuiz(query.qKey));
};

export const saveFeedback = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { body } = getValidated<SaveFeedbackValidated>(res);
  res.status(200).json(await quizService.saveFeedback(body));
};

export const getAllFeedback = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  res.status(200).json(await quizService.getAllFeedback());
};

export const generateQuiz = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { query } = getValidated<GenerateQuizValidated>(res);
  res.status(200).json(await quizService.generateQuiz(query.category, query.skill));
};

export const generateQuizByLink = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { query } = getValidated<LinkQuizQueryValidated>(res);
  res.status(200).json(await quizService.generateQuizByLink(query.link));
};
