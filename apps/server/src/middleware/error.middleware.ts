import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import { logger } from "../lib/logger.js";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const appError =
    error instanceof AppError
      ? error
      : new AppError(500, "Internal Server Error", false);

  logger.error(
    {
      err: error,
      stack: error instanceof Error ? error.stack : undefined,
      isOperational: appError.isOperational,
    },
    appError.message,
  );

  res.status(appError.statusCode).json({
    success: false,
    message: appError.message,
    ...(env.NODE_ENV === "development" && { stack: appError.stack }),
  });
};
