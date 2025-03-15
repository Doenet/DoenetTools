import { z } from "zod";
import { uuidSchema } from "./uuid";
import { DateTime } from "luxon";

export const assignmentCloseAtSchema = z.object({
  contentId: uuidSchema,
  closeAt: z
    .string()
    .datetime({ offset: true })
    .transform((val) => DateTime.fromISO(val)),
});

export const assignmentMaxAttemptsSchema = z.object({
  contentId: uuidSchema,
  maxAttempts: z
    .number()
    .int()
    .refine((v) => v >= 0 && v <= 65535, {
      message: "maxAttempts must be between 0 and 65535",
    }),
});

export const assignmentModeSchema = z.object({
  contentId: uuidSchema,
  mode: z.enum(["formative", "summative"]),
});

export const assignmentParentSchema = z.object({
  parentId: uuidSchema.nullable(),
});

export const getStudentDataSchema = z.object({
  studentUserId: uuidSchema,
  parentId: uuidSchema.nullish().transform((val) => val ?? null),
});

export const recordSubmittedEventSchema = z.object({
  contentId: uuidSchema,
  contentAttemptNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "contentAttemptNumber must be between 1 and 65535",
    }),
  itemAttemptNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "itemAttemptNumber must be between 1 and 65535",
    })
    .nullish()
    .transform((val) => val ?? null),
  answerId: z.string(),
  response: z.string(),
  answerNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "answerNumber must be between 1 and 65535",
    })
    .optional(),
  componentNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "componentNumber must be between 1 and 65535",
    }),
  itemNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "itemNumber must be between 1 and 65535",
    }),
  shuffledItemNumber: z
    .number()
    .int()
    .refine((v) => v >= 1 && v <= 65535, {
      message: "shuffledItemNumber must be between 1 and 65535",
    }),
  answerCreditAchieved: z.number(),
  componentCreditAchieved: z.number(),
  itemCreditAchieved: z.number(),
});

export const codeSchema = z.object({ code: z.string() });

export const getAssignmentResponseStudentSchema = z.object({
  contentId: uuidSchema,
  studentUserId: uuidSchema,
  itemNumber: z
    .string()
    .transform((val) => parseInt(val))
    .refine((v) => v >= 1 && v <= 65535, {
      message: "itemNumber must be between 1 and 65535",
    })
    .optional(),
  attemptNumber: z
    .string()
    .transform((val) => parseInt(val))
    .refine((v) => v >= 1 && v <= 65535, {
      message: "attemptNumber must be between 1 and 65535",
    })
    .optional(),
});

export const getStudentSubmittedResponsesSchema = z.object({
  contentId: uuidSchema,
  studentUserId: uuidSchema.optional(),
  answerId: z.string(),
  itemNumber: z
    .string()
    .transform((val) => parseInt(val))
    .refine((v) => v >= 1 && v <= 65535, {
      message: "itemNumber must be between 1 and 65535",
    }),
  contentAttemptNumber: z
    .string()
    .transform((val) => parseInt(val))
    .refine((v) => v >= 1 && v <= 65535, {
      message: "contentAttemptNumber must be between 1 and 65535",
    }),
  itemAttemptNumber: z
    .string()
    .transform((val) => parseInt(val))
    .refine((v) => v >= 1 && v <= 65535, {
      message: "itemAttemptNumber must be between 1 and 65535",
    })
    .optional(),
});
