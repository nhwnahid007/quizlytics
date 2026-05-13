import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as quizController from "../controllers/quiz.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  emailQuerySchema,
  generateQuizQuerySchema,
  historyByIdQuerySchema,
  historyByKeyQuerySchema,
  historyByUserAiQuerySchema,
  linkQuizQuerySchema,
  quizKeyQuerySchema,
  saveAiQuizHistoryBodySchema,
  saveFeedbackBodySchema,
  saveLinkQuizHistoryBodySchema,
  saveManualQuizBodySchema,
  saveQuizHistoryBodySchema,
} from "../validators/quiz.validator.js";

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export const quizRouter = Router();

quizRouter.post(
  "/linkQuiz",
  validateRequest({ body: saveLinkQuizHistoryBodySchema }),
  asyncHandler(quizController.saveLinkQuiz)
);

quizRouter.get(
  "/linkHistoryByUser",
  validateRequest({ query: emailQuerySchema }),
  asyncHandler(quizController.getLinkHistoryByUser)
);

quizRouter.post(
  "/saveAiQuiz",
  requireAuth,
  validateRequest({ body: saveAiQuizHistoryBodySchema }),
  asyncHandler(quizController.saveAiQuiz)
);

quizRouter.get(
  "/historyByUserAi",
  validateRequest({ query: historyByUserAiQuerySchema }),
  asyncHandler(quizController.getHistoryByUserAi)
);

quizRouter.post(
  "/saveHistory",
  requireAuth,
  validateRequest({ body: saveQuizHistoryBodySchema }),
  asyncHandler(quizController.saveHistory)
);

quizRouter.get("/leaderboard", asyncHandler(quizController.getLeaderboard));
quizRouter.get("/allExaminee", asyncHandler(quizController.getAllExaminees));
quizRouter.get(
  "/historyById",
  validateRequest({ query: historyByIdQuerySchema }),
  asyncHandler(quizController.getHistoryById)
);

quizRouter.get(
  "/historyByKey",
  validateRequest({ query: historyByKeyQuerySchema }),
  asyncHandler(quizController.getHistoryByKey)
);

quizRouter.get(
  "/userHistory",
  validateRequest({ query: emailQuerySchema }),
  asyncHandler(quizController.getUserHistory)
);

quizRouter.post(
  "/saveManualQuiz",
  requireAuth,
  validateRequest({ body: saveManualQuizBodySchema }),
  asyncHandler(quizController.saveManualQuiz)
);

quizRouter.get("/allCustomQuiz", asyncHandler(quizController.getAllCustomQuiz));

quizRouter.get(
  "/getCustomQuizByKey",
  validateRequest({ query: quizKeyQuerySchema }),
  asyncHandler(quizController.getCustomQuizByKey)
);

quizRouter.delete(
  "/deleteCustomQuiz",
  requireAuth,
  validateRequest({ query: quizKeyQuerySchema }),
  asyncHandler(quizController.deleteCustomQuiz)
);

quizRouter.post(
  "/feedback",
  requireAuth,
  validateRequest({ body: saveFeedbackBodySchema }),
  asyncHandler(quizController.saveFeedback)
);

quizRouter.get("/all-feedback", asyncHandler(quizController.getAllFeedback));

quizRouter.get(
  "/quiz",
  aiLimiter,
  validateRequest({ query: generateQuizQuerySchema }),
  asyncHandler(quizController.generateQuiz)
);

quizRouter.get(
  "/testByLink",
  aiLimiter,
  validateRequest({ query: linkQuizQuerySchema }),
  asyncHandler(quizController.generateQuizByLink)
);
