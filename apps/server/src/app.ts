import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import * as healthController from "./controllers/health.controller.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/request-logger.middleware.js";
import { asyncHandler } from "./utils/async-handler.js";
import { apiRouter } from "./routes/index.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const app = express();

app.use(helmet());
app.use(requestLogger);
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(globalLimiter);

app.use(["/api/v1/auth/login", "/auth/login"], authLimiter);

app.get("/health", asyncHandler(healthController.health));
app.get("/", (_req, res) => {
  res.send("Updated Quiz server is running");
});

app.use("/api/v1", apiRouter);
app.use("/", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
