import { z } from "zod";
import { uuidSchema } from "./uuid";

export const contentIdSchema = z.object({
  contentId: uuidSchema,
});

export const contentTypeSchema = z.enum([
  "singleDoc",
  "sequence",
  "select",
  "folder",
]);

export const contentCreateSchema = z.object({
  contentType: contentTypeSchema.default("singleDoc"),
  name: z.string().optional(),
  parentId: uuidSchema.nullish().transform((val) => val ?? null),
});

export const updateContentSettingsSchema = z.object({
  contentId: uuidSchema,
  name: z.string().optional(),
  doenetmlVersionId: z.number().int().optional(),
  shuffle: z.boolean().optional(),
  numToSelect: z.number().int().optional(),
  selectByVariant: z.boolean().optional(),
  paginate: z.boolean().optional(),
  activityLevelAttempts: z.boolean().optional(),
  itemLevelAttempts: z.boolean().optional(),
});

export const updateContentFeaturesSchema = z.object({
  contentId: uuidSchema,
  features: z.record(z.string(), z.boolean()),
});

export const updateContentDoenetMLSchema = z
  .object({
    contentId: uuidSchema,
    doenetML: z.string(),
    numVariants: z.number().int(),
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
  revisionNum: z.number().int(),
  revisionName: z.string(),
  note: z.string(),
});

export const revertToRevisionScheme = z.object({
  contentId: uuidSchema,
  revisionNum: z.number().int(),
});
