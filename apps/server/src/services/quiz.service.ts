import { GoogleGenAI } from "@google/genai";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@quizlytics/db";
import {
  aiQuizHistory,
  feedback,
  linkQuizHistory,
  manualQuiz,
  quizHistory,
} from "@quizlytics/db/schema";
import type {
  InsertAiQuizHistory,
  InsertFeedback,
  InsertLinkQuizHistory,
  InsertManualQuiz,
  InsertQuizHistory,
} from "@quizlytics/types";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import type { AuthUser } from "../middleware/auth.middleware.js";
import { logger } from "../lib/logger.js";
import {
  getErrorMessage,
  toDeleteOneResult,
  toInsertOneResult,
  withMongoId,
  withMongoIds,
} from "../utils/api.js";

const ai = new GoogleGenAI({ apiKey: env.AI_API_KEY });

const generatedQuizSchema = z
  .array(
    z
      .object({
        id: z.union([z.string(), z.number()]).optional(),
        question: z.string().min(1).max(2000),
        options: z.array(z.string().min(1).max(1000)).length(4),
        correct_answer: z.union([z.string(), z.number()]),
        explain: z.string().max(3000).optional(),
      })
      .strict()
  )
  .min(1)
  .max(25);

const promptValue = (value: string): string => JSON.stringify(value);

const parseGeneratedQuizPayload = (text: string): unknown => {
  try {
    // 1. Clean common AI wrapping
    let cleanedText = text
      .replace(/\\"/g, '"')
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 2. Try to extract JSON array if there's surrounding text
    const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      cleanedText = arrayMatch[0];
    }

    // 3. Remove trailing commas in arrays/objects (common AI error)
    cleanedText = cleanedText.replace(/,\s*([\]}])/g, "$1");

    return JSON.parse(cleanedText) as unknown;
  } catch (error) {
    logger.warn({ err: error }, "failed to parse AI quiz JSON");
    throw new Error(`JSON Parse Error: ${getErrorMessage(error)}`);
  }
};

const generateContent = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: env.AI_MODEL,
      contents: prompt,
    });
    const text = response.text;
    if (!text) {
      throw new Error("AI provider returned empty response");
    }
    const parsed = parseGeneratedQuizPayload(text);
    const validated = generatedQuizSchema.safeParse(parsed);
    if (!validated.success) {
      logger.warn(
        { issues: validated.error.issues.map(issue => issue.path.join(".")) },
        "AI quiz response failed validation"
      );
      throw new Error("AI provider returned invalid quiz data");
    }
    return validated.data;
  } catch (error) {
    logger.warn({ err: error }, "AI quiz generation failed");
    throw new AppError(502, "Failed to generate quiz from AI provider");
  }
};

const isAdmin = (authUser: AuthUser): boolean => authUser.role === "admin";

export const saveLinkQuiz = async (body: InsertLinkQuizHistory) => {
  const result = await db
    .insert(linkQuizHistory)
    .values(body)
    .returning({ id: linkQuizHistory.id });
  return toInsertOneResult(result);
};

export const getLinkHistoryByUser = async (email: string) => {
  const result = await db
    .select()
    .from(linkQuizHistory)
    .where(eq(linkQuizHistory.userEmail, email));
  return withMongoIds(result);
};

export const saveAiQuiz = async (body: InsertAiQuizHistory) => {
  const result = await db
    .insert(aiQuizHistory)
    .values(body)
    .returning({ id: aiQuizHistory.id });
  return toInsertOneResult(result);
};

export const getHistoryByUserAi = async (email: string, qTitle: string) => {
  const result = await db
    .select()
    .from(aiQuizHistory)
    .where(
      and(
        eq(aiQuizHistory.userEmail, email),
        eq(aiQuizHistory.quizTitle, qTitle)
      )
    );
  return withMongoIds(result);
};

export const saveHistory = async (body: InsertQuizHistory) => {
  const result = await db
    .insert(quizHistory)
    .values(body)
    .returning({ id: quizHistory.id });
  return toInsertOneResult(result);
};

export const getLeaderboard = async () => {
  const [standard, ai, link] = await Promise.all([
    db.select().from(quizHistory),
    db.select().from(aiQuizHistory),
    db.select().from(linkQuizHistory),
  ]);

  const combined = [...standard, ...ai, ...link]
    .sort((a, b) => (b.marks ?? 0) - (a.marks ?? 0))
    .slice(0, 5);

  return combined.map(row => ({
    id: row.id,
    _id: row.id,
    userName: row.userName,
    userImg: row.userImg,
    marks: row.marks,
    quizTitle: row.quizTitle,
    quizCategory: row.quizCategory,
  }));
};

export const getAllExaminees = async () => {
  const [standard, ai, link] = await Promise.all([
    db.select().from(quizHistory),
    db.select().from(aiQuizHistory),
    db.select().from(linkQuizHistory),
  ]);

  const combined = [...standard, ...ai, ...link].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return withMongoIds(combined);
};

export const getHistoryById = async (id: string, authUser: AuthUser) => {
  const [standard, ai, link] = await Promise.all([
    db.select().from(quizHistory).where(eq(quizHistory.id, id)),
    db.select().from(aiQuizHistory).where(eq(aiQuizHistory.id, id)),
    db.select().from(linkQuizHistory).where(eq(linkQuizHistory.id, id)),
  ]);

  const found = [...standard, ...ai, ...link];
  if (found.length === 0) return null;
  const result = found[0] ?? null;
  if (!result) return null;
  if (!isAdmin(authUser) && result.userEmail !== authUser.email) {
    throw new AppError(403, "Unauthorized");
  }
  return withMongoId(result);
};

export const getHistoryByKey = async (qKey: string, email: string) => {
  const result = await db
    .select()
    .from(quizHistory)
    .where(
      and(eq(quizHistory.quizStartKey, qKey), eq(quizHistory.userEmail, email))
    );
  return withMongoIds(result);
};

export const getUserHistory = async (email: string) => {
  const [standard, ai, link] = await Promise.all([
    db.select().from(quizHistory).where(eq(quizHistory.userEmail, email)),
    db.select().from(aiQuizHistory).where(eq(aiQuizHistory.userEmail, email)),
    db
      .select()
      .from(linkQuizHistory)
      .where(eq(linkQuizHistory.userEmail, email)),
  ]);

  const combined = [...standard, ...ai, ...link].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return withMongoIds(combined);
};

export const saveManualQuiz = async (body: InsertManualQuiz) => {
  const result = await db
    .insert(manualQuiz)
    .values(body)
    .returning({ id: manualQuiz.id });
  return toInsertOneResult(result);
};

export const getAllCustomQuiz = async (authUser: AuthUser) => {
  const result = isAdmin(authUser)
    ? await db.select().from(manualQuiz)
    : await db
        .select()
        .from(manualQuiz)
        .where(eq(manualQuiz.quizCreator, authUser.email ?? ""));
  return withMongoIds(result);
};

export const getCustomQuizByKey = async (qKey: string) => {
  const result = await db
    .select()
    .from(manualQuiz)
    .where(eq(manualQuiz.quizStartKey, qKey));
  return withMongoIds(result);
};

export const deleteCustomQuiz = async (qKey: string, authUser: AuthUser) => {
  const ownerFilter = isAdmin(authUser)
    ? eq(manualQuiz.quizStartKey, qKey)
    : and(
        eq(manualQuiz.quizStartKey, qKey),
        eq(manualQuiz.quizCreator, authUser.email ?? "")
      );
  const result = await db
    .delete(manualQuiz)
    .where(ownerFilter)
    .returning({ id: manualQuiz.id });
  return toDeleteOneResult(result.length);
};

export const saveFeedback = async (body: InsertFeedback) => {
  const result = await db
    .insert(feedback)
    .values(body)
    .returning({ id: feedback.id });
  return toInsertOneResult(result);
};

export const getAllFeedback = async () => {
  const result = await db.select().from(feedback);
  return result.map(row => ({
    id: row.id,
    _id: row.id,
    message: row.message,
    rating: row.rating,
    name: row.name,
    profile: row.profile,
    image: row.image,
    createdAt: row.createdAt,
  }));
};

export const generateQuiz = async (category: string, skill: string) =>
  generateContent(`
Generate a JSON array of exactly 10 unique multiple-choice questions based on the topic ${promptValue(category)}. Each question should be designed for a learner at the ${promptValue(skill)} level and can feature formats like "fill in the blanks", "find the true statement", or similar types.

Each question object must meet the following criteria:
1. The question is labeled as "question" and is a string.
2. There are exactly four answer options stored in an array labeled as "options". Only one option should be correct.
3. The index of the correct answer (from the options array) is labeled as "correct_answer", stored as a string representing the index position (0, 1, 2, or 3).
4. Each question must have a unique identifier, labeled as "id", which is a string containing the index number (e.g., "1", "2", "3").
5. Include an explanation for the correct answer, labeled as "explain", stored as a string.

The output should be only the JSON array without any additional commentary or headings.
`);

export const generateQuizByLink = async (link: string) =>
  generateContent(`
Generate a JSON array of maximum unique multiple-choice questions possible based on the article at ${promptValue(link)}. Each question should feature formats like "fill in the blanks", "find the true statement", or similar types.

Each question object must meet the following criteria:
1. The question is labeled as "question" and is a string.
2. There are exactly four answer options stored in an array labeled as "options". Only one option should be correct.
3. The index of the correct answer (from the options array) is labeled as "correct_answer", stored as a string representing the index position (0, 1, 2, or 3).
4. Each question must have a unique identifier, labeled as "id", which is a string containing the index number (e.g., "1", "2", "3").
5. Include an explanation for the correct answer, labeled as "explain", stored as a string.

The output should be only the JSON array without any additional commentary or headings.
`);
