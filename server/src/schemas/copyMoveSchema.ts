import { z } from "zod";
import { optionalUuidSchema, uuidOrNullSchema, uuidSchema } from "./uuid";
import { contentTypeSchema } from "./contentSchema";

export const moveContentSchema = z.object({
  contentId: uuidSchema,
  parentId: uuidOrNullSchema,
  desiredPosition: z.number().int(),
});

export const copyContentSchema = z.object({
  contentIds: z.array(uuidSchema),
  parentId: uuidOrNullSchema,
  prependCopy: z.boolean().default(false),
});

export const createContentCopyInChildrenSchema = z.object({
  contentType: contentTypeSchema,
  childSourceContentIds: z.array(uuidSchema),
  parentId: uuidOrNullSchema,
});

export const checkIfContentContainsSchema = z.object({
  contentId: optionalUuidSchema,
  contentType: contentTypeSchema,
});
