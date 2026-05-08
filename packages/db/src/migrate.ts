import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, sql } from "./index.js";

const runMigrations = async (): Promise<void> => {
  await migrate(db, {
    migrationsFolder: "drizzle",
  });

  await sql.end();
};

runMigrations().catch(async () => {
  await sql.end();
  process.exit(1);
});
