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
    .refine((v) => v >= 0),
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
  contentAttemptNumber: z.number().int(),
  itemAttemptNumber: z
    .number()
    .int()
    .nullish()
    .transform((val) => val ?? null),
  answerId: z.string(),
  response: z.string(),
  answerNumber: z.number().int().optional(),
  componentNumber: z.number().int(),
  itemNumber: z.number().int(),
  shuffledItemNumber: z.number().int(),
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
    .refine((v) => v > 0)
    .optional(),
  attemptNumber: z
    .string()
    .transform((val) => parseInt(val))
    .refine((v) => v > 0)
    .optional(),
});

export const getStudentSubmittedResponsesSchema = z.object({
  contentId: uuidSchema,
  studentUserId: uuidSchema.optional(),
  answerId: z.string(),
  itemNumber: z.string().transform((val) => parseInt(val)),
  contentAttemptNumber: z.string().transform((val) => parseInt(val)),
  itemAttemptNumber: z.string().transform((val) => parseInt(val)),
});
