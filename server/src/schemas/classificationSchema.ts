import { z } from "zod";
import { uuidSchema } from "./uuid";

export const searchPossibleClassificationsSchema = z.object({
  query: z.string().optional(),
  systemId: z
    .string()
    .transform((v) => Number(v))
    .optional(),
  categoryId: z
    .string()
    .transform((v) => Number(v))
    .optional(),
  subCategoryId: z
    .string()
    .transform((v) => Number(v))
    .optional(),
});

export const classificationSchema = z.object({
  contentId: uuidSchema,
  classificationId: z.number(),
});
