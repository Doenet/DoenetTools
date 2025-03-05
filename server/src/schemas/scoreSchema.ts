import { z } from "zod";
import { uuidSchema } from "./uuid";

export const scoreAndStateSchema = z.object({
  contentId: uuidSchema,
  attemptNumber: z
    .number()
    .int()
    .refine((v) => v > 0),
  score: z.number(),
  scoreByItem: z
    .array(z.number())
    .nullish()
    .transform((val) => val ?? undefined),
  state: z.string(),
});

export const createNewAttemptSchema = z.object({
  contentId: uuidSchema,
  itemNumber: z
    .number()
    .int()
    .refine((v) => v > 0)
    .optional(),
  numItems: z
    .number()
    .int()
    .refine((v) => v > 0)
    .optional(),
  score: z.number(),
  scoreByItem: z
    .array(z.number())
    .nullish()
    .transform((val) => val ?? undefined),
  state: z.string().nullable(),
});

export const loadStateSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema.optional(),
  attemptNumber: z.number().int().optional(),
});

export const getScoreSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema.optional(),
});
