import { z } from "zod";
import { uuidSchema } from "./uuid";

export const getContentSchema = z.object({
  ownerId: uuidSchema,
  parentId: uuidSchema.nullable(),
});

export const searchMyContentSchema = z.object({
  ownerId: uuidSchema,
  parentId: uuidSchema.nullable(),
  isLibrary: z.boolean().optional(),
  query: z.string(),
});

export const getPreferredFolderViewSchema = z.object({});

export const setPreferredFolderViewSchema = z.object({
  cardView: z.boolean(),
});
