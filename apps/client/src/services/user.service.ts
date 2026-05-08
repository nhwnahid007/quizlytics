import type { RegisteredUser } from "@quizlytics/types";
import { apiClient } from "@/lib/api-client";

export type UserRow = RegisteredUser & { _id?: string };

export const getUserRole = async (email: string) => {
  const { data } = await apiClient.get<UserRow | null>("/user/role", {
    params: { email },
  });
  return data;
};

export const getAllUsers = async (): Promise<UserRow[]> => {
  const { data } = await apiClient.get<UserRow[]>("/allUsers");
  return data;
};

export const deleteUser = async (email: string) => {
  const { data } = await apiClient.delete("/deleteUser", { params: { email } });
  return data as unknown;
};

export const updateUserRole = async (email: string, role: string) => {
  const { data } = await apiClient.patch("/updateUserRole", { email, role });
  return data as unknown;
};
