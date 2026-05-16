import { z } from "zod";

export const emailQuerySchema = z
  .object({
    email: z.string().email(),
  })
  .strict();

export const updateUserRoleBodySchema = z
  .object({
    email: z.string().email(),
    role: z.string().min(1),
  })
  .strict();

export const updateDisplayNameBodySchema = z
  .object({
    name: z.string().min(1).max(100),
  })
  .strict();
