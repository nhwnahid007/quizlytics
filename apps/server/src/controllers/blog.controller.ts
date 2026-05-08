import type { Response } from "express";
import type { InsertBlog } from "@quizlytics/types";
import { getValidated } from "../middleware/validate.middleware.js";
import type { ValidatedRequestData } from "../middleware/validate.middleware.js";
import * as blogService from "../services/blog.service.js";

type SaveBlogValidated = ValidatedRequestData & {
  body: InsertBlog;
};

type BlogIdValidated = ValidatedRequestData & {
  params: { id: string };
};

export const saveBlog = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { body } = getValidated<SaveBlogValidated>(res);
  res.status(200).json(await blogService.saveBlog(body));
};

export const getAllBlogs = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  res.status(200).json(await blogService.getAllBlogs());
};

export const getBlogByIdOrSlug = async (
  _req: unknown,
  res: Response,
): Promise<void> => {
  const { params } = getValidated<BlogIdValidated>(res);
  res.status(200).json(await blogService.getBlogByIdOrSlug(params.id));
};
