import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  emailQuerySchema,
  updateUserRoleBodySchema,
} from "../validators/user.validator.js";

export const userRouter = Router();

userRouter.get(
  "/allUsers",
  requireAdmin,
  asyncHandler(userController.getAllUsers),
);

userRouter.get(
  "/user/role",
  validateRequest({ query: emailQuerySchema }),
  asyncHandler(userController.getUserRoleByEmail),
);

userRouter.delete(
  "/deleteUser",
  requireAdmin,
  validateRequest({ query: emailQuerySchema }),
  asyncHandler(userController.deleteUser),
);

userRouter.patch(
  "/updateUserRole",
  requireAdmin,
  validateRequest({ body: updateUserRoleBodySchema }),
  asyncHandler(userController.updateUserRole),
);
