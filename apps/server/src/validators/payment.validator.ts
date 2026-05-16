import { z } from "zod";

export const savePaymentBodySchema = z
  .object({
    transactionId: z.string().min(1),
  })
  .strict();

export const paidUserQuerySchema = z
  .object({
    email: z.string().email(),
  })
  .strict();
