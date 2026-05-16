import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@quizlytics/db";
import { payments, users } from "@quizlytics/db/schema";
import { AppError } from "../errors/app-error.js";
import { env } from "../config/env.js";
import type { AuthenticatedUser } from "../middleware/auth.middleware.js";
import {
  toInsertOneResult,
  toUpdateOneResult,
  withMongoId,
  withMongoIds,
} from "../utils/api.js";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const savePaymentHistory = async (
  paymentIntentId: string,
  authUser: AuthenticatedUser
) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    throw new AppError(402, "Payment has not been completed");
  }

  if (paymentIntent.metadata.email !== authUser.email) {
    throw new AppError(403, "Unauthorized payment confirmation");
  }

  const paymentInfo = {
    userId: authUser.id && uuidPattern.test(authUser.id) ? authUser.id : null,
    email: authUser.email,
    userEmail: authUser.email,
    userName: paymentIntent.metadata.userName || null,
    transactionId: paymentIntent.id,
    amount: paymentIntent.amount,
    date: new Date(paymentIntent.created * 1000).toISOString(),
    status: paymentIntent.status,
  };

  const [insertRows, updateRows] = await Promise.all([
    db.insert(payments).values(paymentInfo).returning({ id: payments.id }),
    db
      .update(users)
      .set({ userStatus: "Pro" })
      .where(eq(users.email, authUser.email))
      .returning({ id: users.id }),
  ]);

  return {
    success: true,
    insertResult: toInsertOneResult(insertRows),
    updateResult: toUpdateOneResult(updateRows.length),
  };
};

export const getPaidUser = async (email: string) => {
  const [result] = await db
    .select()
    .from(payments)
    .where(eq(payments.userEmail, email))
    .limit(1);

  if (!result) {
    throw new AppError(404, "User not found in payment database!");
  }

  return withMongoId(result);
};

export const getAllPaidUserInfo = async () => {
  const result = await db.select().from(payments);
  return withMongoIds(result);
};
