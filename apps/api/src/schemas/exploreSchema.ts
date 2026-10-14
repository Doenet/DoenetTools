import { z } from "zod";
import { uuidSchema } from "./uuid";

export const browseExploreSchema = z.object({
  systemId: z.int().optional(),
  categoryId: z.int().optional(),
  subCategoryId: z.int().optional(),
  classificationId: z.int().optional(),
  isUnclassified: z.boolean().optional(),
  // Each code becomes a parameter of the category filter's IN list, so cap how
  // many a request can send. Clients only send codes of existing categories.
  categories: z
    .array(z.string())
    .max(100)
    .transform((val) => new Set(val)),
  ownerId: uuidSchema.optional(),
});

export const searchExploreSchema = browseExploreSchema.extend({
  query: z.string(),
});
