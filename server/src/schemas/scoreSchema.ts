import { z } from "zod";
import { uuidSchema } from "./uuid";
import { rangedNumber } from "./rangedNumber";

export const scoreAndStateSchema = z.object({
  contentId: uuidSchema,
  code: z.string(),
  attemptNumber: rangedNumber,
  score: z.number().nullable(),
  state: z.string(),
  item: z
    .object({
      itemNumber: rangedNumber.optional(),
      shuffledItemNumber: rangedNumber.optional(),
      itemAttemptNumber: rangedNumber,
      shuffledItemOrder: z.array(
        z.object({
          shuffledItemNumber: rangedNumber,
          docId: uuidSchema,
        }),
      ),
      score: z.number(),
      state: z.string(),
    })
    .optional(),
});

const variantSchema = z.number().int().gte(0).lte(16777215);

export const createNewAttemptSchema = z.object({
  contentId: uuidSchema,
  code: z.string(),
  variant: variantSchema,
  state: z.string().nullable(),
  itemNumber: rangedNumber.optional(),
  shuffledItemNumber: rangedNumber.optional(),
  shuffledItemOrder: z
    .array(
      z.object({
        shuffledItemNumber: rangedNumber,
        docId: uuidSchema,
        variant: variantSchema,
      }),
    )
    .optional(),
  initialAttemptInfo: z
    .object({
      variant: variantSchema,
      shuffledItemOrder: z
        .array(
          z.object({
            shuffledItemNumber: rangedNumber,
            docId: uuidSchema,
            variant: variantSchema,
          }),
        )
        .optional(),
    })
    .optional(),
});

export const loadStateSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema.optional(),
  attemptNumber: rangedNumber.optional(),
});

export const loadItemStateSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema.optional(),
  contentAttemptNumber: rangedNumber.optional(),
  itemNumber: rangedNumber.optional(),
  shuffledItemNumber: rangedNumber.optional(),
  itemAttemptNumber: rangedNumber.optional(),
});

export const getScoreSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema.optional(),
});
