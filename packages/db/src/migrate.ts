import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, sql } from "./index.js";

const runMigrations = async (): Promise<void> => {
  console.log("⏳ Running migrations...");
  await migrate(db, {
    migrationsFolder: "drizzle",
  });
  console.log("✅ Migration completed successfully!");

  await sql.end();
};

runMigrations().catch(async err => {
  console.error("❌ Migration failed:", err);
  await sql.end();
  process.exit(1);
});
