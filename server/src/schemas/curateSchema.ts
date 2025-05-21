import { z } from "zod";
import { uuidSchema } from "./uuid";

export const curationParentIdSchema = z.object({
  parentId: uuidSchema.nullish().transform((val) => val ?? null),
});

export const searchCurationFolderContentSchema = z.object({
  parentId: uuidSchema.nullish().transform((val) => val ?? null),
  query: z.string(),
});

export const sourceIdSchema = z.object({
  sourceId: uuidSchema,
});

export const addCommentSchema = z.object({
  contentId: uuidSchema,
  comment: z.string(),
});

export const createCurationFolderSchema = z.object({
  name: z.string(),
  parentId: uuidSchema.nullish().transform((val) => val ?? null),
});
