import { eq } from "drizzle-orm";
import { db } from "@quizlytics/db";
import { payments, users } from "@quizlytics/db/schema";
import type { InsertPayment } from "@quizlytics/types";
import { AppError } from "../errors/app-error.js";
import { toInsertOneResult, toUpdateOneResult, withMongoId, withMongoIds } from "../utils/api.js";

export const savePaymentHistory = async (paymentInfo: InsertPayment) => {
  const email = paymentInfo.userEmail ?? paymentInfo.email;

  const [insertRows, updateRows] = await Promise.all([
    db.insert(payments).values(paymentInfo).returning({ id: payments.id }),
    db
      .update(users)
      .set({ userStatus: "Pro" })
      .where(eq(users.userEmail, email ?? ""))
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
