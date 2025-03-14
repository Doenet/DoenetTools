import { z } from "zod";
import { uuidSchema } from "./uuid";

export const scoreAndStateSchema = z.object({
  contentId: uuidSchema,
  code: z.string(),
  attemptNumber: z
    .number()
    .int()
    .refine((v) => v > 0),
  score: z
    .number()
    .nullish()
    .transform((val) => val ?? null),
  state: z.string(),
  item: z
    .object({
      itemNumber: z
        .number()
        .int()
        .refine((v) => v > 0)
        .optional(),
      shuffledItemNumber: z
        .number()
        .int()
        .refine((v) => v > 0)
        .optional(),
      itemAttemptNumber: z
        .number()
        .int()
        .refine((v) => v > 0),
      shuffledItemOrder: z.array(
        z.object({
          shuffledItemNumber: z
            .number()
            .int()
            .refine((v) => v > 0),
          docId: uuidSchema,
        }),
      ),
      score: z.number(),
      state: z.string(),
    })
    .optional(),
});

export const createNewAttemptSchema = z.object({
  contentId: uuidSchema,
  code: z.string(),
  itemNumber: z
    .number()
    .int()
    .refine((v) => v > 0)
    .optional(),
  shuffledItemNumber: z
    .number()
    .int()
    .refine((v) => v > 0)
    .optional(),
  shuffledItemOrder: z
    .array(
      z.object({
        shuffledItemNumber: z
          .number()
          .int()
          .refine((v) => v > 0),
        docId: uuidSchema,
      }),
    )
    .optional(),
});

export const loadStateSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema.optional(),
  attemptNumber: z
    .number()
    .int()
    .refine((v) => v > 0)
    .optional(),
});

export const loadItemStateSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema.optional(),
  contentAttemptNumber: z
    .number()
    .int()
    .refine((v) => v > 0)
    .optional(),
  itemNumber: z
    .number()
    .int()
    .refine((v) => v > 0)
    .optional(),
  shuffledItemNumber: z
    .number()
    .int()
    .refine((v) => v > 0)
    .optional(),
  itemAttemptNumber: z
    .number()
    .int()
    .refine((v) => v > 0)
    .optional(),
});

export const getScoreSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema.optional(),
});
