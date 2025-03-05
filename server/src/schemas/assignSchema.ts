import { z } from "zod";
import { uuidSchema } from "./uuid";
import { DateTime } from "luxon";

export const assignmentSettingsSchema = z.object({
  contentId: uuidSchema,
  closeAt: z
    .string()
    .datetime({ offset: true })
    .transform((val) => DateTime.fromISO(val)),
});

export const assignmentStudentSchema = z.object({
  contentId: uuidSchema,
  studentUserId: uuidSchema.optional(),
});

export const assignmentParentSchema = z.object({
  parentId: uuidSchema.nullable(),
});

export const getStudentDataSchema = z.object({
  studentUserId: uuidSchema,
  parentId: uuidSchema.nullish().transform((val) => val ?? null),
});

export const getSubmittedResponsesSchema = z.object({
  contentId: uuidSchema,
  answerId: z.string(),
});

export const getSubmittedResponseHistorySchema = z.object({
  contentId: uuidSchema,
  answerId: z.string(),
  userId: uuidSchema,
});

export const recordSubmittedEventSchema = z.object({
  contentId: uuidSchema,
  attemptNumber: z.number().int(),
  answerId: z.string(),
  response: z.string(),
  answerNumber: z.number().int().optional(),
  itemNumber: z.number().int(),
  questionNumber: z.number().int(),
  creditAchieved: z.number(),
  itemCreditAchieved: z.number(),
  docCreditAchieved: z.number(),
});

export const codeSchema = z.object({ code: z.string() });
