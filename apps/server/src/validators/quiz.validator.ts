import { z } from "zod";

const quizHistoryBodySchema = z
  .object({
    userId: z.string().uuid().optional().nullable(),
    quizStartKey: z.string().optional().nullable(),
    date: z.string().optional().nullable(),
    linkId: z.string().optional().nullable(),
    quizTitle: z.string().optional().nullable(),
    quizCategory: z.string().optional().nullable(),
    quizCreator: z.string().optional().nullable(),
    questions: z.unknown().optional().nullable(),
    answers: z.unknown().optional().nullable(),
    userName: z.string().optional().nullable(),
    userEmail: z.string().email().optional().nullable(),
    userProfile: z.string().optional().nullable(),
    userImg: z.string().optional().nullable(),
    marks: z.number().int().optional().nullable(),
  })
  .strict();

export const saveQuizHistoryBodySchema = quizHistoryBodySchema;

export const saveAiQuizHistoryBodySchema = quizHistoryBodySchema;

export const saveLinkQuizHistoryBodySchema = quizHistoryBodySchema;

export const saveManualQuizBodySchema = z
  .object({
    userId: z.string().uuid().optional().nullable(),
    quizTitle: z.string().optional().nullable(),
    quizCategory: z.string().optional().nullable(),
    quizStartKey: z.string().min(1),
    quizCreator: z.string().optional().nullable(),
    quizArr: z.unknown().optional().nullable(),
  })
  .strict();

export const saveFeedbackBodySchema = z
  .object({
    userId: z.string().uuid().optional().nullable(),
    message: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    name: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    profile: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
  })
  .strict();

export const quizKeyQuerySchema = z
  .object({
    qKey: z.string().min(1),
  })
  .strict();

export const emailQuerySchema = z
  .object({
    email: z.string().email(),
  })
  .strict();

export const historyByKeyQuerySchema = emailQuerySchema.extend({
  qKey: z.string().min(1),
});

export const historyByUserAiQuerySchema = emailQuerySchema.extend({
  qTitle: z.string().min(1),
});

export const historyByIdQuerySchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

export const generateQuizQuerySchema = z
  .object({
    category: z.string().trim().min(1).max(120),
    skill: z.string().trim().min(1).max(60),
  })
  .strict();

export const linkQuizQuerySchema = z
  .object({
    link: z
      .string()
      .trim()
      .url()
      .max(2048)
      .refine(
        value => ["http:", "https:"].includes(new URL(value).protocol),
        "Only http(s) links are supported"
      ),
  })
  .strict();
