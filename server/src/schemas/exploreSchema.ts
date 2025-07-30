import { z } from "zod";
import { uuidSchema } from "./uuid";

export const browseExploreSchema = z.object({
  systemId: z.number().int().optional(),
  categoryId: z.number().int().optional(),
  subCategoryId: z.number().int().optional(),
  classificationId: z.number().int().optional(),
  isUnclassified: z.boolean().optional(),
  categories: z.array(z.string()).transform((val) => new Set(val)),
  ownerId: uuidSchema.optional(),
});

export const searchExploreSchema = browseExploreSchema.extend({
  query: z.string(),
});
