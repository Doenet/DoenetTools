import { z } from "zod";
import { uuidSchema } from "./uuid";
import { contentTypeSchema } from "./contentSchema";

export const moveContentSchema = z.object({
  contentId: uuidSchema,
  parentId: uuidSchema.nullish().transform((val) => val ?? null),
  desiredPosition: z.number().int(),
});

export const copyContentSchema = z.object({
  contentIds: z.array(uuidSchema),
  parentId: uuidSchema.nullish().transform((val) => val ?? null),
  prependCopy: z.boolean().default(false),
});

export const createContentCopyInChildrenSchema = z.object({
  contentType: contentTypeSchema,
  childSourceContentIds: z.array(uuidSchema),
  parentId: uuidSchema.nullish().transform((val) => val ?? null),
});

export const checkIfContentContainsSchema = z.object({
  contentId: uuidSchema.nullish().transform((val) => val ?? null),
  contentType: contentTypeSchema,
});
