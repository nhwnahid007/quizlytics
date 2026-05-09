import { z } from "zod";

export const emailQuerySchema = z.object({
  email: z.string().email(),
});

export const updateUserRoleBodySchema = z.object({
  email: z.string().email(),
  role: z.string().min(1),
});

export const updateDisplayNameBodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});
