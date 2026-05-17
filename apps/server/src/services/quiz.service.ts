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
        question: z.string().min(1).max(2000),
        options: z.array(z.string().min(1).max(1000)).length(4),
        correct_answer: z.union([
          z.enum(["0", "1", "2", "3"]),
          z.number().int().min(0).max(3),
        ]),
        explain: z.string().min(1).max(3000).optional(),
      })
      .strict()
  )
  .min(1)
  .max(20);

type GeneratedQuizQuestion = Omit<
  z.infer<typeof generatedQuizSchema>[number],
  "correct_answer"
> & {
  id: string;
  correct_answer: string;
  explain?: string;
};

type QuizCacheEntry = {
  expiresAt: number;
  quiz: GeneratedQuizQuestion[];
};

const AI_TIMEOUT_MS = 30_000;
const QUIZ_CACHE_TTL_MS = 60 * 60 * 1000;
const quizCache = new Map<string, QuizCacheEntry>();

const promptValue = (value: string): string => JSON.stringify(value);

export const normalizeQuizCacheKey = (
  category: string,
  skill: string,
  count: number,
  includeExplanations = false
): string =>
  `${category.trim().toLowerCase()}::${skill.trim().toLowerCase()}::${count}::${includeExplanations ? "explain" : "answer"}`;

const cloneQuiz = (quiz: GeneratedQuizQuestion[]): GeneratedQuizQuestion[] =>
  quiz.map(question => ({
    ...question,
    options: [...question.options],
  }));

export const addGeneratedQuizDefaults = (
  quiz: z.infer<typeof generatedQuizSchema>,
  includeExplanations = false
): GeneratedQuizQuestion[] =>
  quiz.map((question, index) => {
    const correctAnswer = String(question.correct_answer);
    const correctOption = question.options[Number(correctAnswer)];
    const nextQuestion: GeneratedQuizQuestion = {
      ...question,
      id: String(index + 1),
      correct_answer: correctAnswer,
    };

    if (includeExplanations) {
      nextQuestion.explain =
        question.explain ??
        (correctOption
          ? `Correct answer is option ${Number(correctAnswer) + 1}: ${correctOption}.`
          : `Correct answer is option ${Number(correctAnswer) + 1}.`);
    }

    return nextQuestion;
  });

const getCachedQuiz = (key: string): GeneratedQuizQuestion[] | null => {
  const entry = quizCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    quizCache.delete(key);
    return null;
  }
  return cloneQuiz(entry.quiz);
};

const setCachedQuiz = (
  key: string,
  quiz: GeneratedQuizQuestion[]
): GeneratedQuizQuestion[] => {
  quizCache.set(key, {
    expiresAt: Date.now() + QUIZ_CACHE_TTL_MS,
    quiz: cloneQuiz(quiz),
  });
  return cloneQuiz(quiz);
};

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> => {
  let timeout: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error(`AI request timed out after ${timeoutMs}ms`)),
          timeoutMs
        );
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};

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

const requestGeneratedQuiz = async (
  prompt: string,
  expectedCount?: number,
  includeExplanations = false
) => {
  const response = await withTimeout(
    ai.models.generateContent({
      model: env.AI_MODEL,
      contents: prompt,
    }),
    AI_TIMEOUT_MS
  );
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
  if (expectedCount && validated.data.length !== expectedCount) {
    throw new Error(
      `AI provider returned ${validated.data.length} questions instead of ${expectedCount}`
    );
  }
  return addGeneratedQuizDefaults(validated.data, includeExplanations);
};

const generateContent = async (
  prompt: string,
  expectedCount?: number,
  includeExplanations = false
) => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      return await requestGeneratedQuiz(
        prompt,
        expectedCount,
        includeExplanations
      );
    } catch (error) {
      lastError = error;
      logger.warn({ err: error, attempt }, "AI quiz generation attempt failed");
    }
  }
  logger.warn({ err: lastError }, "AI quiz generation failed after retry");
  throw new AppError(
    502,
    "Quiz generation is taking too long right now. Please try again."
  );
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

export const generateQuiz = async (
  category: string,
  skill: string,
  count = 10,
  includeExplanations = false
) => {
  const cacheKey = normalizeQuizCacheKey(
    category,
    skill,
    count,
    includeExplanations
  );
  const cachedQuiz = getCachedQuiz(cacheKey);
  if (cachedQuiz) return cachedQuiz;

  const quiz = await generateContent(
    `
Return ONLY valid JSON array. No markdown. No explanation outside JSON.

Create exactly ${count} MCQ questions.

Topic: ${promptValue(category)}
Level: ${promptValue(skill)}

Schema:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correct_answer": "0"${includeExplanations ? ',\n    "explain": ""' : ""}
  }
]

Rules:
- options must contain exactly 4 strings
- correct_answer must be "0", "1", "2", or "3"
- no duplicate questions
${includeExplanations ? "- explain must briefly describe why the correct answer is right" : "- do not include explain"}
`,
    count,
    includeExplanations
  );

  return setCachedQuiz(cacheKey, quiz);
};

export const generateQuizByLink = async (link: string) =>
  generateContent(`
Return ONLY valid JSON array. No markdown. No explanation outside JSON.

Create up to 10 MCQ questions from article URL: ${promptValue(link)}

Schema:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correct_answer": "0"
  }
]

Rules:
- options must contain exactly 4 strings
- correct_answer must be "0", "1", "2", or "3"
- no duplicate questions
`);
