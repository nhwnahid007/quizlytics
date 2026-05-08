import type { Response } from "express";
import type { RegisteredUser } from "@quizlytics/types";
import { getValidated } from "../middleware/validate.middleware.js";
import type { ValidatedRequestData } from "../middleware/validate.middleware.js";
import * as userService from "../services/user.service.js";

type EmailQueryValidated = ValidatedRequestData & {
  query: { email: string };
};

type UpdateRoleValidated = ValidatedRequestData & {
  body: { email: string; role: RegisteredUser["role"] };
};

export const getAllUsers = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  res.status(200).json(await userService.getAllUsers());
};

export const getUserRoleByEmail = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { query } = getValidated<EmailQueryValidated>(res);
  res.status(200).json(await userService.getUserRoleByEmail(query.email));
};

export const deleteUser = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { query } = getValidated<EmailQueryValidated>(res);
  res.status(200).json(await userService.deleteUser(query.email));
};

export const updateUserRole = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { body } = getValidated<UpdateRoleValidated>(res);
  res
    .status(200)
    .json(await userService.updateUserRole(body.email, body.role));
};
