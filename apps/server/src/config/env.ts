import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid database URL"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  AI_API_KEY: z.string().min(1, "AI_API_KEY is required"),
  AI_MODEL: z.string().min(1).default("gemini-2.5-flash"),
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  ALLOWED_ORIGINS: z
    .string()
    .min(1, "ALLOWED_ORIGINS must include at least one origin")
    .default("http://localhost:3000"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const message = parsedEnv.error.issues
    .map(issue => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid server environment: ${message}`);
}

export const env = {
  ...parsedEnv.data,
  ALLOWED_ORIGINS: parsedEnv.data.ALLOWED_ORIGINS.split(",")
    .map(origin => origin.trim())
    .filter(Boolean),
};
