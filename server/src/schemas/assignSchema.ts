import { z } from "zod";
import { uuidSchema } from "./uuid";
import { DateTime } from "luxon";

export const assignmentSettingsSchema = z.object({
  contentId: uuidSchema,
  closeAt: z
    .string()
    .datetime()
    .transform((val) => DateTime.fromISO(val)),
});

export const assignmentStudentSchema = z.object({
  contentId: uuidSchema,
  studentUserId: uuidSchema,
});

export const assignmentParentSchema = z.object({
  parentId: uuidSchema.nullable(),
});

export const getStudentDataSchema = z.object({
  studentUserId: uuidSchema,
  parentId: uuidSchema.nullable(),
});

export const getSubmittedResponsesSchema = z.object({
  contentId: uuidSchema,
  activityRevisionNum: z.number(),
  answerId: z.string(),
});

export const getSubmittedResponseHistorySchema = z.object({
  contentId: uuidSchema,
  activityRevisionNum: z.number(),
  answerId: z.string(),
  userId: uuidSchema,
});

export const recordSubmittedEventSchema = z.object({
  contentId: uuidSchema,
  activityRevisionNum: z.number(),
  answerId: z.string(),
  response: z.string(),
  answerNumber: z.number().optional(),
  itemNumber: z.number(),
  creditAchieved: z.number(),
  itemCreditAchieved: z.number(),
  activityCreditAchieved: z.number(),
});

export const codeSchema = z.object({ code: z.string() });
