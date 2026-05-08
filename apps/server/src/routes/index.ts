import { Router } from "express";
import * as healthController from "../controllers/health.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import { authRouter } from "./auth.routes.js";
import { blogRouter } from "./blog.routes.js";
import { paymentRouter } from "./payment.routes.js";
import { quizRouter } from "./quiz.routes.js";
import { userRouter } from "./user.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", asyncHandler(healthController.health));
apiRouter.use(authRouter);
apiRouter.use(userRouter);
apiRouter.use(quizRouter);
apiRouter.use(blogRouter);
apiRouter.use(paymentRouter);
