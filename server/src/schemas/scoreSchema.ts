import { z } from "zod";
import { uuidSchema } from "./uuid";

export const scoreAndStateSchema = z.object({
  contentId: uuidSchema,
  code: z.string(),
  variant: z
    .number()
    .int()
    .refine((v) => v >= 0 && v <= 16777215, {
      message: "variant must be between 0 and 16777215",
    }),
  attemptNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "attemptNumber must be between 1 and 65535",
    }),
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
        .refine((v) => v >= 1 && v <= 65535, {
          message: "itemNumber must be between 1 and 65535",
        })
        .optional(),
      shuffledItemNumber: z
        .number()
        .int()
        .refine((v) => v >= 1 && v <= 65535, {
          message: "shuffledItemNumber must be between 1 and 65535",
        })
        .optional(),
      itemAttemptNumber: z
        .number()
        .int()
        .refine((v) => v >= 1 && v <= 65535, {
          message: "itemAttemptNumber must be between 1 and 65535",
        }),
      shuffledItemOrder: z.array(
        z.object({
          shuffledItemNumber: z
            .number()
            .int()
            .refine((v) => v >= 1 && v <= 65535, {
              message: "shuffledItemNumber must be between 1 and 65535",
            }),
          docId: uuidSchema,
          variant: z
            .number()
            .int()
            .refine((v) => v >= 0 && v <= 16777215, {
              message: "variant must be between 0 and 16777215",
            }),
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
  variant: z
    .number()
    .int()
    .refine((v) => v >= 0 && v <= 16777215, {
      message: "variant must be between 0 and 16777215",
    }),
  itemNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "itemNumber must be between 1 and 65535",
    })
    .optional(),
  shuffledItemNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "shuffledItemNumber must be between 1 and 65535",
    })
    .optional(),
  shuffledItemOrder: z
    .array(
      z.object({
        shuffledItemNumber: z
          .number()
          .int()
          .refine((v) => v >= 1 && v <= 65535, {
            message: "shuffledItemNumber must be between 1 and 65535",
          }),
        docId: uuidSchema,
        variant: z
          .number()
          .int()
          .refine((v) => v >= 0 && v <= 16777215, {
            message: "variant must be between 0 and 16777215",
          }),
      }),
    )
    .optional(),
  initialAttemptInfo: z
    .object({
      variant: z
        .number()
        .int()
        .refine((v) => v >= 0 && v <= 16777215, {
          message: "variant must be between 0 and 16777215",
        }),

      shuffledItemOrder: z
        .array(
          z.object({
            shuffledItemNumber: z
              .number()
              .int()
              .refine((v) => v >= 1 && v <= 65535, {
                message: "shuffledItemNumber must be between 1 and 65535",
              }),
            docId: uuidSchema,
            variant: z
              .number()
              .int()
              .refine((v) => v >= 0 && v <= 16777215, {
                message: "variant must be between 0 and 16777215",
              }),
          }),
        )
        .optional(),
    })
    .optional(),
});

export const loadStateSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema.optional(),
  attemptNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "attemptNumber must be between 1 and 65535",
    })
    .optional(),
});

export const loadItemStateSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema.optional(),
  contentAttemptNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "contentAttemptNumber must be between 1 and 65535",
    })
    .optional(),
  itemNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "itemNumber must be between 1 and 65535",
    })
    .optional(),
  shuffledItemNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "shuffledItemNumber must be between 1 and 65535",
    })
    .optional(),
  itemAttemptNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "itemAttemptNumber must be between 1 and 65535",
    })
    .optional(),
});

export const getScoreSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema.optional(),
});
