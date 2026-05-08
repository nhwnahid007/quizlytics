import type { Response } from "express";
import type { InsertRegisteredUser } from "@quizlytics/types";
import * as authService from "../services/auth.service.js";
import { getValidated } from "../middleware/validate.middleware.js";
import type { ValidatedRequestData } from "../middleware/validate.middleware.js";
import type { LoginCredentials } from "../services/auth.service.js";

type LoginValidated = ValidatedRequestData & {
  body: LoginCredentials;
};

type RegisterValidated = ValidatedRequestData & {
  body: InsertRegisteredUser & { email: string; password: string };
};

type ProviderValidated = ValidatedRequestData & {
  body: InsertRegisteredUser & { email: string };
};

export const login = async (_req: unknown, res: Response): Promise<void> => {
  const { body } = getValidated<LoginValidated>(res);
  res.status(200).json(await authService.login(body));
};

export const registerUser = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { body } = getValidated<RegisterValidated>(res);
  res.status(200).json(await authService.registerUser(body));
};

export const authenticateProviderUser = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { body } = getValidated<ProviderValidated>(res);
  res
    .status(200)
    .json(await authService.authenticateProviderUser(body));
};
