import { z } from "zod";

export const emptyParamsSchema = z.object({}).strict();

export const emailQuerySchema = z.object({
  email: z.string().email(),
});

export const looseJsonSchema: z.ZodType<unknown> = z.unknown();

export const optionalString = z.string().optional().nullable();

export const optionalNumber = z.number().optional().nullable();
