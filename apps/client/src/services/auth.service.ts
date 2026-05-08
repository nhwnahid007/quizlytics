import type { AxiosResponse } from "axios";
import type {
  ApiMessageResponse,
  InsertRegisteredUser,
} from "@quizlytics/types";
import { apiClient } from "@/lib/api-client";

export const postNewUser = async (
  newUser: InsertRegisteredUser & { email: string; password: string },
): Promise<AxiosResponse<ApiMessageResponse>> =>
  apiClient.post<ApiMessageResponse>("/registered_users", newUser);

export const postProviderUser = async (
  newUser: InsertRegisteredUser & { email: string },
): Promise<AxiosResponse<ApiMessageResponse>> =>
  apiClient.post<ApiMessageResponse>("/authenticating_with_providers", newUser);
