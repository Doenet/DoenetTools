import { z } from "zod";
import { uuidSchema } from "./uuid";

export const searchPossibleClassificationsSchema = z.object({
  query: z.string().optional(),
  systemId: z.int().optional(),
  categoryId: z.int().optional(),
  subCategoryId: z.int().optional(),
});

export const classificationSchema = z.object({
  contentId: uuidSchema,
  classificationId: z.int(),
});
