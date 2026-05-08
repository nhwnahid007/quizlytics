import { eq, or } from "drizzle-orm";
import { db } from "@quizlytics/db";
import { blogs } from "@quizlytics/db/schema";
import type { InsertBlog } from "@quizlytics/types";
import { toInsertOneResult, withMongoId, withMongoIds } from "../utils/api.js";

export const saveBlog = async (body: InsertBlog) => {
  const result = await db.insert(blogs).values(body).returning({ id: blogs.id });
  return toInsertOneResult(result);
};

export const getAllBlogs = async () => {
  const result = await db.select().from(blogs);
  return withMongoIds(result);
};

export const getBlogByIdOrSlug = async (idOrSlug: string) => {
  const [result] = await db
    .select()
    .from(blogs)
    .where(or(eq(blogs.id, idOrSlug), eq(blogs.slug, idOrSlug)))
    .limit(1);
  return result ? withMongoId(result) : null;
};
