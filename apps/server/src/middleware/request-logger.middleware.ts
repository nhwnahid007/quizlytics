import type { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger.js";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const responseTimeMs =
      Number(process.hrtime.bigint() - start) / 1_000_000;
    logger.info(
      {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        responseTimeMs: Number(responseTimeMs.toFixed(2)),
      },
      "request completed",
    );
  });

  next();
};
