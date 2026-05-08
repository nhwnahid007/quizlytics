import { eq } from "drizzle-orm";
import { db } from "@quizlytics/db";
import { users } from "@quizlytics/db/schema";
import type { RegisteredUser } from "@quizlytics/types";
import {
  toDeleteOneResult,
  toUpdateOneResult,
  withMongoId,
  withMongoIds,
} from "../utils/api.js";

export const getAllUsers = async () => {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      profile: users.profile,
      role: users.role,
      userStatus: users.userStatus,
      provider: users.provider,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users);

  return withMongoIds(result);
};

export const getUserRoleByEmail = async (email: string) => {
  const [result] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      profile: users.profile,
      role: users.role,
      userStatus: users.userStatus,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result ? withMongoId(result) : null;
};

export const deleteUser = async (email: string) => {
  const result = await db
    .delete(users)
    .where(eq(users.email, email))
    .returning({ id: users.id });

  return toDeleteOneResult(result.length);
};

export const updateUserRole = async (
  email: string,
  role: RegisteredUser["role"],
) => {
  const result = await db
    .update(users)
    .set({ role: role ?? null })
    .where(eq(users.email, email))
    .returning({ id: users.id });

  return toUpdateOneResult(result.length);
};
