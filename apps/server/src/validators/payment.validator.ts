import { z } from "zod";

export const savePaymentBodySchema = z
  .object({
    userId: z.string().uuid().optional().nullable(),
    userName: z.string().optional().nullable(),
    email: z.string().email(),
    userEmail: z.string().email().optional().nullable(),
    transactionId: z.string().min(1),
    amount: z.number().int().nonnegative(),
    date: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
  })
  .passthrough();

export const paidUserQuerySchema = z.object({
  email: z.string().email(),
});
