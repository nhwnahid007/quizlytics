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
import { getAuthUser } from "../middleware/auth.middleware.js";
import * as quizService from "../services/quiz.service.js";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const authUserId = (res: Response): string | null => {
  const authUser = getAuthUser(res);
  return authUser.id && uuidPattern.test(authUser.id) ? authUser.id : null;
};

const authScopeHistory = <
  T extends { userId?: string | null; userEmail?: string | null },
>(
  body: T,
  res: Response
): T => {
  const authUser = getAuthUser(res);
  return {
    ...body,
    userId: authUserId(res),
    userEmail: authUser.email,
  };
};

type EmailQueryValidated = ValidatedRequestData & {
  query: { email: string };
};

type QuizKeyQueryValidated = ValidatedRequestData & {
  query: { qKey: string };
};

type HistoryByIdValidated = ValidatedRequestData & {
  query: { id: string };
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
  res: Response
): Promise<void> => {
  const { body } = getValidated<SaveLinkHistoryValidated>(res);
  res
    .status(200)
    .json(await quizService.saveLinkQuiz(authScopeHistory(body, res)));
};

export const getLinkHistoryByUser = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { query } = getValidated<EmailQueryValidated>(res);
  res.status(200).json(await quizService.getLinkHistoryByUser(query.email));
};

export const saveAiQuiz = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { body } = getValidated<SaveAiHistoryValidated>(res);
  res
    .status(200)
    .json(await quizService.saveAiQuiz(authScopeHistory(body, res)));
};

export const getHistoryByUserAi = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { query } = getValidated<HistoryByUserAiValidated>(res);
  res
    .status(200)
    .json(await quizService.getHistoryByUserAi(query.email, query.qTitle));
};

export const saveHistory = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { body } = getValidated<SaveHistoryValidated>(res);
  res
    .status(200)
    .json(await quizService.saveHistory(authScopeHistory(body, res)));
};

export const getLeaderboard = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  res.status(200).json(await quizService.getLeaderboard());
};

export const getAllExaminees = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  res.status(200).json(await quizService.getAllExaminees());
};

export const getHistoryById = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { query } = getValidated<HistoryByIdValidated>(res);
  res
    .status(200)
    .json(await quizService.getHistoryById(query.id, getAuthUser(res)));
};

export const getHistoryByKey = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { query } = getValidated<HistoryByKeyValidated>(res);
  res
    .status(200)
    .json(await quizService.getHistoryByKey(query.qKey, query.email));
};

export const getUserHistory = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { query } = getValidated<EmailQueryValidated>(res);
  res.status(200).json(await quizService.getUserHistory(query.email));
};

export const saveManualQuiz = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { body } = getValidated<SaveManualQuizValidated>(res);
  res.status(200).json(
    await quizService.saveManualQuiz({
      ...body,
      userId: authUserId(res),
      quizCreator: getAuthUser(res).email,
    })
  );
};

export const getAllCustomQuiz = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  res.status(200).json(await quizService.getAllCustomQuiz(getAuthUser(res)));
};

export const getCustomQuizByKey = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { query } = getValidated<QuizKeyQueryValidated>(res);
  res.status(200).json(await quizService.getCustomQuizByKey(query.qKey));
};

export const deleteCustomQuiz = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { query } = getValidated<QuizKeyQueryValidated>(res);
  res
    .status(200)
    .json(await quizService.deleteCustomQuiz(query.qKey, getAuthUser(res)));
};

export const saveFeedback = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { body } = getValidated<SaveFeedbackValidated>(res);
  const authUser = getAuthUser(res);
  res.status(200).json(
    await quizService.saveFeedback({
      ...body,
      userId: authUserId(res),
      email: authUser.email,
    })
  );
};

export const getAllFeedback = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  res.status(200).json(await quizService.getAllFeedback());
};

export const generateQuiz = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { query } = getValidated<GenerateQuizValidated>(res);
  res
    .status(200)
    .json(await quizService.generateQuiz(query.category, query.skill));
};

export const generateQuizByLink = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { query } = getValidated<LinkQuizQueryValidated>(res);
  res.status(200).json(await quizService.generateQuizByLink(query.link));
};
