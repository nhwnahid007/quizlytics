import { GoogleGenerativeAI } from "@google/generative-ai";
import { and, desc, eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { db } from "@quizlytics/db";
import {
  aiQuizHistory,
  blogs,
  feedback,
  linkQuizHistory,
  manualQuiz,
  payments,
  quizHistory,
  users,
} from "@quizlytics/db/schema";
import type {
  AiQuizHistory,
  Blog,
  Feedback,
  InsertAiQuizHistory,
  InsertBlog,
  InsertFeedback,
  InsertLinkQuizHistory,
  InsertManualQuiz,
  InsertPayment,
  InsertQuizHistory,
  InsertRegisteredUser,
  LinkQuizHistory,
  ManualQuiz,
  Payment,
  QuizHistory,
  RegisteredUser,
} from "@quizlytics/types";

dotenv.config();

type ApiDocument<T extends { id: string }> = T & {
  _id: string;
};

type InsertOneResult = {
  acknowledged: true;
  insertedId: string;
};

type DeleteOneResult = {
  acknowledged: true;
  deletedCount: number;
};

type UpdateOneResult = {
  acknowledged: true;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: 0;
  upsertedId: null;
};

type EmptyParams = Record<string, never>;

type ApiMessageResponse = {
  message: string;
  error?: unknown;
};

type RegisterUserBody = Omit<
  InsertRegisteredUser,
  "id" | "email" | "password" | "emailVerified" | "createdAt" | "updatedAt"
> & {
  email: string;
  password: string;
};
type ProviderAuthBody = Omit<
  InsertRegisteredUser,
  "id" | "email" | "password" | "emailVerified" | "createdAt" | "updatedAt"
> & {
  email: string;
};
type UpdateUserRoleBody = {
  email?: string;
  role?: RegisteredUser["role"];
};
type SaveQuizHistoryBody = InsertQuizHistory;
type SaveAiQuizHistoryBody = InsertAiQuizHistory;
type SaveLinkQuizHistoryBody = InsertLinkQuizHistory;
type SaveManualQuizBody = InsertManualQuiz;
type SaveFeedbackBody = InsertFeedback;
type SaveBlogBody = InsertBlog;
type SavePaymentBody = InsertPayment;

type EmailQuery = {
  email?: string;
};

type QuizKeyQuery = {
  qKey?: string;
};

type HistoryByUserAiQuery = EmailQuery & {
  qTitle?: string;
};

type QuizGenerateQuery = {
  category?: string;
  skill?: string;
};

type LinkGenerateQuery = {
  link?: string;
};

const app = express();
const port = process.env.PORT || 4000;
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY ?? "");

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
};

const queryText = (value: string | undefined): string => value ?? "";

const withMongoId = <T extends { id: string }>(row: T): ApiDocument<T> => ({
  ...row,
  _id: row.id,
});

const withMongoIds = <T extends { id: string }>(
  rows: T[],
): ApiDocument<T>[] => rows.map(withMongoId);

const toInsertOneResult = (rows: { id: string }[]): InsertOneResult => {
  const inserted = rows[0];
  if (!inserted) {
    throw new Error("Insert did not return an id");
  }

  return {
    acknowledged: true,
    insertedId: inserted.id,
  };
};

const toDeleteOneResult = (deletedCount: number): DeleteOneResult => ({
  acknowledged: true,
  deletedCount,
});

const toUpdateOneResult = (updatedCount: number): UpdateOneResult => ({
  acknowledged: true,
  matchedCount: updatedCount,
  modifiedCount: updatedCount,
  upsertedCount: 0,
  upsertedId: null,
});

app.use(
  cors({
    origin: ["http://localhost:3000", "https://quizlytics.vercel.app"],
  }),
);
app.use(express.json());

// API route for registering users with register form
app.post(
  "/registered_users",
  async (
    req: Request<EmptyParams, ApiMessageResponse, RegisterUserBody>,
    res: Response<ApiMessageResponse>,
  ): Promise<void> => {
    try {
      const newUser = req.body;
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, newUser.email))
        .limit(1);

      if (existingUsers[0]) {
        res.status(409).json({ message: "User already exists!" });
        return;
      }

      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      await db.insert(users).values({
        ...newUser,
        password: hashedPassword,
      });
      res.status(200).json({ message: "New user successfully created" });
    } catch (error: unknown) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },
);

// API route for authenticating user with social provider
app.post(
  "/authenticating_with_providers",
  async (
    req: Request<EmptyParams, ApiMessageResponse, ProviderAuthBody>,
    res: Response<ApiMessageResponse>,
  ): Promise<void> => {
    try {
      const newUser = req.body;
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, newUser.email))
        .limit(1);

      if (existingUsers[0]) {
        res.status(409).json({ message: "User already exist!" });
        return;
      }

      await db.insert(users).values(newUser);
      res.status(200).json({ message: "New user successfully created!" });
    } catch (error: unknown) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  },
);

// Get all user
app.get(
  "/allUsers",
  async (
    _req: Request<EmptyParams, ApiDocument<RegisteredUser>[]>,
    res: Response<ApiDocument<RegisteredUser>[]>,
  ): Promise<void> => {
    const result = await db.select().from(users);
    res.send(withMongoIds(result));
  },
);

// Get user role by email
app.get(
  "/user/role",
  async (
    req: Request<
      EmptyParams,
      ApiDocument<RegisteredUser> | null,
      unknown,
      EmailQuery
    >,
    res: Response<ApiDocument<RegisteredUser> | null>,
  ): Promise<void> => {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, queryText(req.query.email)))
      .limit(1);
    res.send(result[0] ? withMongoId(result[0]) : null);
  },
);

// Delete a user
app.delete(
  "/deleteUser",
  async (
    req: Request<EmptyParams, DeleteOneResult, unknown, EmailQuery>,
    res: Response<DeleteOneResult>,
  ): Promise<void> => {
    const result = await db
      .delete(users)
      .where(eq(users.email, queryText(req.query.email)))
      .returning({ id: users.id });
    res.send(toDeleteOneResult(result.length));
  },
);

// Change user role by email
app.patch(
  "/updateUserRole",
  async (
    req: Request<EmptyParams, UpdateOneResult | { message: string }, UpdateUserRoleBody>,
    res: Response<UpdateOneResult | { message: string }>,
  ): Promise<void> => {
    const { email, role } = req.body;

    try {
      const result = await db
        .update(users)
        .set({ role: role ?? null })
        .where(eq(users.email, queryText(email)))
        .returning({ id: users.id });
      res.send(toUpdateOneResult(result.length));
    } catch (error: unknown) {
      console.error("Error updating user:", error);
      res.status(500).send({ message: "Failed to update user role" });
    }
  },
);

// Link Quiz History
app.post(
  "/linkQuiz",
  async (
    req: Request<EmptyParams, InsertOneResult, SaveLinkQuizHistoryBody>,
    res: Response<InsertOneResult>,
  ): Promise<void> => {
    const result = await db
      .insert(linkQuizHistory)
      .values(req.body)
      .returning({ id: linkQuizHistory.id });
    res.send(toInsertOneResult(result));
  },
);

app.get(
  "/linkHistoryByUser",
  async (
    req: Request<
      EmptyParams,
      ApiDocument<LinkQuizHistory>[],
      unknown,
      EmailQuery
    >,
    res: Response<ApiDocument<LinkQuizHistory>[]>,
  ): Promise<void> => {
    const result = await db
      .select()
      .from(linkQuizHistory)
      .where(eq(linkQuizHistory.userEmail, queryText(req.query.email)));
    res.send(withMongoIds(result));
  },
);

// Ai Quiz History
app.post(
  "/saveAiQuiz",
  async (
    req: Request<EmptyParams, InsertOneResult, SaveAiQuizHistoryBody>,
    res: Response<InsertOneResult>,
  ): Promise<void> => {
    const result = await db
      .insert(aiQuizHistory)
      .values(req.body)
      .returning({ id: aiQuizHistory.id });
    res.send(toInsertOneResult(result));
  },
);

app.get(
  "/historyByUserAi",
  async (
    req: Request<
      EmptyParams,
      ApiDocument<AiQuizHistory>[],
      unknown,
      HistoryByUserAiQuery
    >,
    res: Response<ApiDocument<AiQuizHistory>[]>,
  ): Promise<void> => {
    const result = await db
      .select()
      .from(aiQuizHistory)
      .where(
        and(
          eq(aiQuizHistory.userEmail, queryText(req.query.email)),
          eq(aiQuizHistory.quizTitle, queryText(req.query.qTitle)),
        ),
      );
    res.send(withMongoIds(result));
  },
);

// Custom Quiz History
app.post(
  "/saveHistory",
  async (
    req: Request<EmptyParams, InsertOneResult, SaveQuizHistoryBody>,
    res: Response<InsertOneResult>,
  ): Promise<void> => {
    const result = await db
      .insert(quizHistory)
      .values(req.body)
      .returning({ id: quizHistory.id });
    res.send(toInsertOneResult(result));
  },
);

app.get(
  "/leaderboard",
  async (
    _req: Request<EmptyParams, ApiDocument<Partial<QuizHistory> & { id: string }>[]>,
    res: Response<ApiDocument<Partial<QuizHistory> & { id: string }>[]>,
  ): Promise<void> => {
    const result = await db
      .select({
        id: quizHistory.id,
        quizStartKey: quizHistory.quizStartKey,
        quizTitle: quizHistory.quizTitle,
        quizCategory: quizHistory.quizCategory,
        quizCreator: quizHistory.quizCreator,
        userName: quizHistory.userName,
        userEmail: quizHistory.userEmail,
        userImg: quizHistory.userImg,
        marks: quizHistory.marks,
      })
      .from(quizHistory)
      .orderBy(desc(quizHistory.marks))
      .limit(5);
    res.send(withMongoIds(result));
  },
);

app.get(
  "/allExaminee",
  async (
    _req: Request<EmptyParams, ApiDocument<Partial<QuizHistory> & { id: string }>[]>,
    res: Response<ApiDocument<Partial<QuizHistory> & { id: string }>[]>,
  ): Promise<void> => {
    const result = await db
      .select({
        id: quizHistory.id,
        quizStartKey: quizHistory.quizStartKey,
        quizTitle: quizHistory.quizTitle,
        quizCategory: quizHistory.quizCategory,
        quizCreator: quizHistory.quizCreator,
        userName: quizHistory.userName,
        userEmail: quizHistory.userEmail,
        userImg: quizHistory.userImg,
        marks: quizHistory.marks,
      })
      .from(quizHistory)
      .orderBy(desc(quizHistory.marks));
    res.send(withMongoIds(result));
  },
);

app.get(
  "/historyByKey",
  async (
    req: Request<
      EmptyParams,
      ApiDocument<QuizHistory>[],
      unknown,
      EmailQuery & QuizKeyQuery
    >,
    res: Response<ApiDocument<QuizHistory>[]>,
  ): Promise<void> => {
    const result = await db
      .select()
      .from(quizHistory)
      .where(
        and(
          eq(quizHistory.quizStartKey, queryText(req.query.qKey)),
          eq(quizHistory.userEmail, queryText(req.query.email)),
        ),
      );
    res.send(withMongoIds(result));
  },
);

app.get(
  "/userHistory",
  async (
    req: Request<EmptyParams, ApiDocument<QuizHistory>[], unknown, EmailQuery>,
    res: Response<ApiDocument<QuizHistory>[]>,
  ): Promise<void> => {
    const result = await db
      .select()
      .from(quizHistory)
      .where(eq(quizHistory.userEmail, queryText(req.query.email)));
    res.send(withMongoIds(result));
  },
);

// Custom Quiz
app.post(
  "/saveManualQuiz",
  async (
    req: Request<EmptyParams, InsertOneResult, SaveManualQuizBody>,
    res: Response<InsertOneResult>,
  ): Promise<void> => {
    const result = await db
      .insert(manualQuiz)
      .values(req.body)
      .returning({ id: manualQuiz.id });
    res.send(toInsertOneResult(result));
  },
);

app.get(
  "/allCustomQuiz",
  async (
    _req: Request<EmptyParams, ApiDocument<ManualQuiz>[]>,
    res: Response<ApiDocument<ManualQuiz>[]>,
  ): Promise<void> => {
    const result = await db.select().from(manualQuiz);
    res.send(withMongoIds(result));
  },
);

app.get(
  "/getCustomQuizByKey",
  async (
    req: Request<EmptyParams, ApiDocument<ManualQuiz>[], unknown, QuizKeyQuery>,
    res: Response<ApiDocument<ManualQuiz>[]>,
  ): Promise<void> => {
    const result = await db
      .select()
      .from(manualQuiz)
      .where(eq(manualQuiz.quizStartKey, queryText(req.query.qKey)));
    res.send(withMongoIds(result));
  },
);

app.delete(
  "/deleteCustomQuiz",
  async (
    req: Request<EmptyParams, DeleteOneResult, unknown, QuizKeyQuery>,
    res: Response<DeleteOneResult>,
  ): Promise<void> => {
    const result = await db
      .delete(manualQuiz)
      .where(eq(manualQuiz.quizStartKey, queryText(req.query.qKey)))
      .returning({ id: manualQuiz.id });
    res.send(toDeleteOneResult(result.length));
  },
);

// Feedback
app.post(
  "/feedback",
  async (
    req: Request<EmptyParams, InsertOneResult, SaveFeedbackBody>,
    res: Response<InsertOneResult>,
  ): Promise<void> => {
    const result = await db
      .insert(feedback)
      .values(req.body)
      .returning({ id: feedback.id });
    res.send(toInsertOneResult(result));
  },
);

app.get(
  "/all-feedback",
  async (
    _req: Request<EmptyParams, ApiDocument<Feedback>[]>,
    res: Response<ApiDocument<Feedback>[]>,
  ): Promise<void> => {
    const allFeedback = await db.select().from(feedback);
    res.send(withMongoIds(allFeedback));
  },
);

// Blogs
app.post(
  "/blog",
  async (
    req: Request<EmptyParams, InsertOneResult, SaveBlogBody>,
    res: Response<InsertOneResult>,
  ): Promise<void> => {
    const result = await db
      .insert(blogs)
      .values(req.body)
      .returning({ id: blogs.id });
    res.send(toInsertOneResult(result));
  },
);

app.get(
  "/allBlogs",
  async (
    _req: Request<EmptyParams, ApiDocument<Blog>[]>,
    res: Response<ApiDocument<Blog>[]>,
  ): Promise<void> => {
    const result = await db.select().from(blogs);
    res.send(withMongoIds(result));
  },
);

// Payment
app.post(
  "/paymentHistory",
  async (
    req: Request<
      EmptyParams,
      { insertResult: InsertOneResult; updateResult: UpdateOneResult } | { error: string },
      SavePaymentBody
    >,
    res: Response<
      { insertResult: InsertOneResult; updateResult: UpdateOneResult } | { error: string }
    >,
  ): Promise<void> => {
    const paymentInfo = req.body;
    const email = paymentInfo.email ?? "";

    try {
      const [insertRows, updateRows] = await Promise.all([
        db.insert(payments).values(paymentInfo).returning({ id: payments.id }),
        db
          .update(users)
          .set({ userStatus: "Pro" })
          .where(eq(users.userEmail, email))
          .returning({ id: users.id }),
      ]);

      res.send({
        insertResult: toInsertOneResult(insertRows),
        updateResult: toUpdateOneResult(updateRows.length),
      });
    } catch (error: unknown) {
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

app.get(
  "/paidUser",
  async (
    req: Request<
      EmptyParams,
      ApiDocument<Payment> | { message: string },
      unknown,
      EmailQuery
    >,
    res: Response<ApiDocument<Payment> | { message: string }>,
  ): Promise<void> => {
    const userEmail = req.query.email;

    if (!userEmail) {
      res.status(400).send({ message: "Email query parameter is required" });
      return;
    }

    try {
      const result = await db
        .select()
        .from(payments)
        .where(eq(payments.userEmail, userEmail))
        .limit(1);

      if (result[0]) {
        res.send(withMongoId(result[0]));
      } else {
        res.status(404).send({ message: "User not found in payment database!" });
      }
    } catch (error: unknown) {
      console.error("Error getting paid user:", error);
      res
        .status(500)
        .send({ message: "An error occurred while retrieving the user" });
    }
  },
);

app.get(
  "/allPaidUserInfo",
  async (
    _req: Request<EmptyParams, ApiDocument<Payment>[] | { message: string }>,
    res: Response<ApiDocument<Payment>[] | { message: string }>,
  ): Promise<void> => {
    try {
      const result = await db.select().from(payments);
      res.status(200).send(withMongoIds(result));
    } catch (error: unknown) {
      console.error("Error retrieving all paid user information:", error);
      res.status(500).send({
        message: "An error occurred while retrieving paid user information",
      });
    }
  },
);

app.get(
  "/quiz",
  async (
    req: Request<EmptyParams, unknown, unknown, QuizGenerateQuery>,
    res: Response,
  ): Promise<void> => {
    const category = req.query?.category;
    const skill = req.query?.skill;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
Generate a JSON array of exactly 10 unique multiple-choice questions based on the topic "${category}". Each question should be designed for a learner at the "${skill}" level and can feature formats like "fill in the blanks", "find the true statement", or similar types.

Each question object must meet the following criteria:
1. The question is labeled as "question" and is a string.
2. There are exactly four answer options stored in an array labeled as "options". Only one option should be correct.
3. The index of the correct answer (from the options array) is labeled as "correct_answer", stored as a string representing the index position (0, 1, 2, or 3).
4. Each question must have a unique identifier, labeled as "id", which is a string containing the index number (e.g., "1", "2", "3").
5. Include an explanation for the correct answer, labeled as "explain", stored as a string.

The output should be only the JSON array without any additional commentary or headings.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const cleanedText = text
      .replace(/\\"/g, '"')
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/`/g, "")
      .trim();
    const jsonResult: unknown = JSON.parse(cleanedText);
    res.json(jsonResult);
  },
);

app.get(
  "/testByLink",
  async (
    req: Request<EmptyParams, unknown, unknown, LinkGenerateQuery>,
    res: Response,
  ): Promise<void> => {
    const link = req.query.link;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
Generate a JSON array of maximum unique multiple-choice questions possible based on the article of provided "${link}". Each question should feature formats like "fill in the blanks", "find the true statement", or similar types.

Each question object must meet the following criteria:
1. The question is labeled as "question" and is a string.
2. There are exactly four answer options stored in an array labeled as "options". Only one option should be correct.
3. The index of the correct answer (from the options array) is labeled as "correct_answer", stored as a string representing the index position (0, 1, 2, or 3).
4. Each question must have a unique identifier, labeled as "id", which is a string containing the index number (e.g., "1", "2", "3").
5. Include an explanation for the correct answer, labeled as "explain", stored as a string.

The output should be only the JSON array without any additional commentary or headings.
`;

    // console.log(prompt);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const cleanedText = text
      .replace(/\\"/g, '"')
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/`/g, "")
      .trim();
    const jsonResult: unknown = JSON.parse(cleanedText);
    res.json(jsonResult);
  },
);

app.get("/", (_req: Request, res: Response<string>): void => {
  res.send("Updated Quiz server is running");
});

app.use(
  (
    error: unknown,
    _req: Request,
    res: Response<{ message: string }>,
    _next: NextFunction,
  ): void => {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  },
);

app.listen(port, (error?: Error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening to the port: ${port}`);
});
