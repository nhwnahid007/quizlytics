import { defineConfig } from "drizzle-kit";
import { dbEnv } from "./src/config/env";

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: dbEnv.DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
