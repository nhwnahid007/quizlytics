export {};
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";
import { dbEnv } from "./config/env.js";

export const sql = postgres(dbEnv.DATABASE_URL, {
  max: 1,
});

export const db = drizzle(sql, { schema });

export { schema };
export type DbClient = typeof db;
