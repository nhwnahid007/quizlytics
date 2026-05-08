import type { Response } from "express";
import * as healthService from "../services/health.service.js";

export const health = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  res.status(200).json(await healthService.getHealthStatus());
};
