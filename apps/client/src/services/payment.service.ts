import { apiClient } from "@/lib/api-client";

export interface PaymentHistoryResponse {
  success?: boolean;
  error?: string;
}

export const savePaymentHistory = async (body: { transactionId: string }) => {
  const { data } = await apiClient.post<PaymentHistoryResponse>(
    "/paymentHistory",
    body
  );
  return data;
};
