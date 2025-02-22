import { z } from "zod";
import { uuidSchema } from "./uuid";
import { contentTypeSchema } from "./contentSchema";

export const moveContentSchema = z.object({
  contentId: uuidSchema,
  desiredParentId: uuidSchema.nullable(),
  desiredPosition: z.number().int(),
});

export const copyContentSchema = z.object({
  contentIds: z.array(uuidSchema),
  desiredParentId: uuidSchema.nullable(),
  prependCopy: z.boolean().default(false),
});

export const createContentCopyInChildrenSchema = z.object({
  contentIds: z.array(uuidSchema),
  desiredParentId: uuidSchema.nullable(),
  contentType: contentTypeSchema,
});

export const checkIfContentContainsSchema = z.object({
  contentId: uuidSchema.nullable(),
  contentType: contentTypeSchema,
});
