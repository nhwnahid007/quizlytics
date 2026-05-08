import { Router } from "express";
import * as blogController from "../controllers/blog.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  blogIdParamsSchema,
  saveBlogBodySchema,
} from "../validators/blog.validator.js";

export const blogRouter = Router();

blogRouter.post(
  "/blog",
  validateRequest({ body: saveBlogBodySchema }),
  asyncHandler(blogController.saveBlog),
);

blogRouter.get("/allBlogs", asyncHandler(blogController.getAllBlogs));

blogRouter.get(
  "/blog/:id",
  validateRequest({ params: blogIdParamsSchema }),
  asyncHandler(blogController.getBlogByIdOrSlug),
);
