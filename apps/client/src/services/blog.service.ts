import type { Blog, InsertBlog } from "@quizlytics/types";
import { apiClient } from "@/lib/api-client";

export type BlogRecord = Blog & { _id?: string };

export const getAllBlogs = async (): Promise<BlogRecord[]> => {
  const { data } = await apiClient.get<BlogRecord[]>("/allBlogs");
  return data;
};

export const getBlog = async (id: string): Promise<BlogRecord | null> => {
  const { data } = await apiClient.get<BlogRecord | null>(`/blog/${id}`);
  return data;
};

export const saveBlog = async (body: InsertBlog) => {
  const { data } = await apiClient.post("/blog", body);
  return data as unknown;
};
