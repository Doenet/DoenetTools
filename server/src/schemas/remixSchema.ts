import { z } from "zod";
import { uuidSchema } from "./uuid";

export const remixSchema = z.object({
  contentId: uuidSchema,
  includeSource: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

export const updateRemixedContentToOriginSchema = z.object({
  originContentId: uuidSchema,
  originRevisionNum: z.number().int().optional(),
  remixContentId: uuidSchema,
  onlyMarkUnchanged: z.boolean().optional(),
});

export const updateOriginContentToRemixSchema = z.object({
  remixContentId: uuidSchema,
  remixRevisionNum: z.number().int().optional(),
  originContentId: uuidSchema,
  onlyMarkUnchanged: z.boolean().optional(),
});
