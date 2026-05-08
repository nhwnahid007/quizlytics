import { z } from "zod";

export const emailQuerySchema = z.object({
  email: z.string().email(),
});

export const updateUserRoleBodySchema = z.object({
  email: z.string().email(),
  role: z.string().min(1),
});
