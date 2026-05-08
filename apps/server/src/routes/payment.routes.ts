import { Router } from "express";
import * as paymentController from "../controllers/payment.controller.js";
import {
  requireAdmin,
  requireAuth,
} from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  paidUserQuerySchema,
  savePaymentBodySchema,
} from "../validators/payment.validator.js";

export const paymentRouter = Router();

paymentRouter.post(
  "/paymentHistory",
  requireAuth,
  validateRequest({ body: savePaymentBodySchema }),
  asyncHandler(paymentController.savePaymentHistory),
);

paymentRouter.get(
  "/paidUser",
  validateRequest({ query: paidUserQuerySchema }),
  asyncHandler(paymentController.getPaidUser),
);

paymentRouter.get(
  "/allPaidUserInfo",
  requireAdmin,
  asyncHandler(paymentController.getAllPaidUserInfo),
);
