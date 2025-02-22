import { z } from "zod";
import { uuidSchema } from "./uuid";

export const searchPossibleClassificationsSchema = z.object({
  query: z.string().optional(),
  systemId: z.number().optional(),
  categoryId: z.number().optional(),
  subCategoryId: z.number().optional(),
});

export const classificationSchema = z.object({
  contentId: uuidSchema,
  classificationId: z.number(),
});
