import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export type RequestValidationSchema = {
  body: z.ZodType<unknown>;
  params: z.ZodType<unknown>;
  query: z.ZodType<unknown>;
};

export type ValidatedRequestData = {
  body: unknown;
  params: unknown;
  query: unknown;
};

export const validateRequest =
  (schema: Partial<RequestValidationSchema>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const parsed = z
      .object({
        body: schema.body ?? z.unknown(),
        params: schema.params ?? z.unknown(),
        query: schema.query ?? z.unknown(),
      })
      .safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    res.locals.validated = parsed.data;
    next();
  };

export const getValidated = <T extends ValidatedRequestData>(
  res: Response,
): T => res.locals.validated as T;
