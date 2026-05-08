import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerUserBodySchema = z
  .object({
    name: z.string().min(1).optional().nullable(),
    email: z.string().email(),
    password: z.string().min(6),
    profile: z.string().url().optional().nullable(),
    image: z.string().url().optional().nullable(),
    role: z.string().optional().nullable(),
    userStatus: z.string().optional().nullable(),
    provider: z.string().optional().nullable(),
  })
  .passthrough();

export const providerAuthBodySchema = registerUserBodySchema.omit({
  password: true,
});
