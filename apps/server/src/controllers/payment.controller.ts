import type { Response } from "express";
import { getValidated } from "../middleware/validate.middleware.js";
import type { ValidatedRequestData } from "../middleware/validate.middleware.js";
import { getAuthUser } from "../middleware/auth.middleware.js";
import * as paymentService from "../services/payment.service.js";

type PaymentValidated = ValidatedRequestData & {
  body: { transactionId: string };
};

type PaidUserValidated = ValidatedRequestData & {
  query: { email: string };
};

export const savePaymentHistory = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { body } = getValidated<PaymentValidated>(res);
  res
    .status(200)
    .json(
      await paymentService.savePaymentHistory(
        body.transactionId,
        getAuthUser(res)
      )
    );
};

export const getPaidUser = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  const { query } = getValidated<PaidUserValidated>(res);
  res.status(200).json(await paymentService.getPaidUser(query.email));
};

export const getAllPaidUserInfo = async (
  _req: unknown,
  res: Response
): Promise<void> => {
  res.status(200).json(await paymentService.getAllPaidUserInfo());
};
