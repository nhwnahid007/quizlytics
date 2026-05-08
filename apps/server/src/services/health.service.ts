import { sql } from "@quizlytics/db";

export const getHealthStatus = async () => {
  let dbStatus: "connected" | "error" = "connected";

  try {
    await sql`select 1`;
  } catch {
    dbStatus = "error";
  }

  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    db: dbStatus,
  };
};
