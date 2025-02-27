import { z } from "zod";
import { uuidSchema } from "./uuid";

export const curationParentIdSchema = z.object({
  parentId: uuidSchema.nullable(),
});

export const searchCurationFolderContentSchema = z.object({
  parentId: uuidSchema.nullable(),
  query: z.string(),
});

export const sourceIdSchema = z.object({
  sourceId: uuidSchema,
});

export const publishSchema = z.object({
  draftId: uuidSchema,
  comments: z.string(),
});

export const updateLibraryInfoSchema = z.object({
  sourceId: uuidSchema,
  comments: z.string(),
});
