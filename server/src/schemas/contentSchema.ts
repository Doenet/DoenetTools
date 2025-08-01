import { z } from "zod";
import { uuidOrNullSchema, uuidSchema } from "./uuid";

export const contentIdSchema = z.object({
  contentId: uuidSchema,
});

export const contentTypeSchema = z.enum([
  "singleDoc",
  "sequence",
  "select",
  "folder",
]);

export const createContentSchema = z.object({
  contentType: contentTypeSchema.prefault("singleDoc"),
  name: z.string().optional(),
  parentId: uuidOrNullSchema,
});

export const updateContentSettingsSchema = z.object({
  contentId: uuidSchema,
  name: z.string().optional(),
  doenetmlVersionId: z.int().optional(),
  shuffle: z.boolean().optional(),
  numToSelect: z.int().optional(),
  selectByVariant: z.boolean().optional(),
  paginate: z.boolean().optional(),
  activityLevelAttempts: z.boolean().optional(),
  itemLevelAttempts: z.boolean().optional(),
});

export const updateCategoriesSchema = z.object({
  contentId: uuidSchema,
  categories: z.record(z.string(), z.boolean()),
});

export const updateContentDoenetMLSchema = z
  .object({
    contentId: uuidSchema,
    doenetML: z.string(),
    numVariants: z.int(),
  })
  .transform(({ contentId, doenetML, numVariants }) => ({
    contentId,
    source: doenetML,
    numVariants,
  }));

export const createContentRevisionScheme = z.object({
  contentId: uuidSchema,
  revisionName: z.string(),
  note: z.string(),
});

export const updateContentRevisionScheme = z.object({
  contentId: uuidSchema,
  revisionNum: z.int(),
  revisionName: z.string(),
  note: z.string(),
});

export const revertToRevisionScheme = z.object({
  contentId: uuidSchema,
  revisionNum: z.int(),
});
