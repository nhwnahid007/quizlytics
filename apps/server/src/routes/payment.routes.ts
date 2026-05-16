import { Router } from "express";
import * as paymentController from "../controllers/payment.controller.js";
import {
  requireAdmin,
  requireAuth,
  requireSelfOrAdmin,
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
  asyncHandler(paymentController.savePaymentHistory)
);

paymentRouter.get(
  "/paidUser",
  requireAuth,
  validateRequest({ query: paidUserQuerySchema }),
  requireSelfOrAdmin((_req, res) => res.locals.validated.query.email),
  asyncHandler(paymentController.getPaidUser)
);

paymentRouter.get(
  "/allPaidUserInfo",
  requireAdmin,
  asyncHandler(paymentController.getAllPaidUserInfo)
);
