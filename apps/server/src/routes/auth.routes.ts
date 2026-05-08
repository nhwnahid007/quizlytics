import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import {
  loginBodySchema,
  providerAuthBodySchema,
  registerUserBodySchema,
} from "../validators/auth.validator.js";

export const authRouter = Router();

authRouter.post(
  "/auth/login",
  validateRequest({ body: loginBodySchema }),
  asyncHandler(authController.login),
);

authRouter.post(
  "/registered_users",
  validateRequest({ body: registerUserBodySchema }),
  asyncHandler(authController.registerUser),
);

authRouter.post(
  "/authenticating_with_providers",
  validateRequest({ body: providerAuthBodySchema }),
  asyncHandler(authController.authenticateProviderUser),
);
