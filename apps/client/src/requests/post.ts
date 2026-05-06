import axios from 'axios';
import type { AxiosResponse } from "axios";
import type { ApiMessageResponse, InsertRegisteredUser, UserExamAnswer } from "@quizlytics/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type NewRegisteredUser = InsertRegisteredUser;
type LegacyMarkPayload = {
  id?: string;
  examId?: string;
  exam_date?: string;
  my_mark?: number;
  name?: string | null;
  email?: string | null;
  profile?: string | null;
};

export const postNewUser = async (newUser: NewRegisteredUser): Promise<AxiosResponse<ApiMessageResponse>> => {
  try {
    const response = await axios.post<ApiMessageResponse>(`${BASE_URL}/registered_users`, newUser);
    return response;
  } catch (error) {
    console.error("Error posting new user:", error);
    throw error; 
  }
}

export const postUserWithProvider = async (newUser: NewRegisteredUser): Promise<AxiosResponse<ApiMessageResponse>> => {
  try {
    const response = await axios.post<ApiMessageResponse>(`${BASE_URL}/authenticating_with_providers`, newUser);
    return response;
  } catch (error) {
    console.error("Error posting user with provider:", error);
    throw error; // 
  }
}

export const postUserExamData = async (userExamData: UserExamAnswer[]): Promise<AxiosResponse<ApiMessageResponse>> => {
  try {
    const response = await axios.post<ApiMessageResponse>(`${BASE_URL}/user_exam_data`, userExamData);
    return response;
  } catch (error) {
    console.error("Error posting user exam data:", error);
    throw error; // Rethrow the error after logging it
  }
}

export const postOnlyMark = async (userMark: LegacyMarkPayload): Promise<AxiosResponse<ApiMessageResponse>> => {
  try {
    const response = await axios.post<ApiMessageResponse>(`${BASE_URL}/only_user_mark`, userMark);
    return response;
  } catch (error) {
    console.error("Error posting only mark:", error);
    throw error; // Rethrow the error after logging it
  }
}
