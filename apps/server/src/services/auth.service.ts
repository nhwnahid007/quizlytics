import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "@quizlytics/db";
import { users } from "@quizlytics/db/schema";
import type { InsertRegisteredUser } from "@quizlytics/types";
import { AppError } from "../errors/app-error.js";

export type LoginCredentials = {
  email: string;
  password: string;
};

export const isBcryptPasswordHash = (passwordHash: string): boolean =>
  /^\$2[aby]\$\d{2}\$/.test(passwordHash);

export const verifyPassword = async (
  password: string,
  storedPassword: string
): Promise<boolean> => {
  if (!isBcryptPasswordHash(storedPassword)) {
    return false;
  }

  return bcrypt.compare(password, storedPassword);
};

export const login = async ({ email, password }: LoginCredentials) => {
  const [currentUser] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      password: users.password,
      profile: users.profile,
      role: users.role,
      userStatus: users.userStatus,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!currentUser?.password) {
    throw new AppError(401, "Invalid user credentials");
  }

  const passwordMatched = await verifyPassword(password, currentUser.password);

  if (!passwordMatched) {
    throw new AppError(401, "Invalid user credentials");
  }

  return {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    image: currentUser.image ?? currentUser.profile,
    profile: currentUser.profile,
    role: currentUser.role,
    userStatus: currentUser.userStatus,
  };
};

export const registerUser = async (
  newUser: InsertRegisteredUser & { email: string; password: string }
) => {
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, newUser.email))
    .limit(1);

  if (existingUser) {
    throw new AppError(409, "User already exists!");
  }

  const hashedPassword = await bcrypt.hash(newUser.password, 10);
  await db.insert(users).values({
    name: newUser.name,
    email: newUser.email,
    userEmail: newUser.email,
    profile: newUser.profile,
    image: newUser.image,
    password: hashedPassword,
    role: "user",
    userStatus: "Free",
  });

  return { message: "New user successfully created" };
};

export const authenticateProviderUser = async (
  newUser: InsertRegisteredUser & { email: string }
) => {
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, newUser.email))
    .limit(1);

  if (existingUser) {
    throw new AppError(409, "User already exist!");
  }

  await db.insert(users).values({
    name: newUser.name,
    email: newUser.email,
    userEmail: newUser.email,
    profile: newUser.profile,
    image: newUser.image,
    role: "user",
    userStatus: "Free",
  });
  return { message: "New user successfully created!" };
};
