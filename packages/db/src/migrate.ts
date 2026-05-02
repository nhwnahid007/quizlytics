import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, sql } from "./index.js";

const runMigrations = async (): Promise<void> => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  await migrate(db, {
    migrationsFolder: "drizzle",
  });

  await sql.end();
};

runMigrations().catch(async (error: unknown) => {
  console.error(error);
  await sql.end();
  process.exit(1);
});
