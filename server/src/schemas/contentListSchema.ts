import { z } from "zod";
import { uuidSchema } from "./uuid";

export const getContentSchema = z.object({
  ownerId: uuidSchema,
  parentId: uuidSchema.nullish().transform((val) => val ?? null),
});

export const searchMyContentSchema = z.object({
  ownerId: uuidSchema,
  parentId: uuidSchema.nullish().transform((val) => val ?? null),
  isLibrary: z.boolean().optional(),
  query: z.string(),
});

export const getPreferredFolderViewSchema = z.object({});

export const setPreferredFolderViewSchema = z.object({
  cardView: z.boolean(),
});
