export {};
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/quizlytics";

export const sql = postgres(databaseUrl, {
  max: 1,
});

export const db = drizzle(sql, { schema });

export { schema };
export type DbClient = typeof db;
