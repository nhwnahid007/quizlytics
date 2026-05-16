import { z } from "zod";

export const saveBlogBodySchema = z
  .object({
    userId: z.string().uuid().optional().nullable(),
    title: z.string().min(1),
    slug: z.string().min(1).optional().nullable(),
    summary: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    photo: z.string().optional().nullable(),
    releaseDate: z.string().optional().nullable(),
    postOwner: z.string().optional().nullable(),
    postOwnerPic: z.string().optional().nullable(),
  })
  .strict();

export const blogIdParamsSchema = z
  .object({
    id: z.string().min(1),
  })
  .strict();
