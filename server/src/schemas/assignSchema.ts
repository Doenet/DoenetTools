import { z } from "zod";
import { optionalUuidSchema, uuidOrNullSchema, uuidSchema } from "./uuid";
import { DateTime } from "luxon";
import { stringAsBoolSchema } from "./boolean";
import {
  rangedNumber,
  stringAsRangedNumber,
  stringAsRangedNumberIncludingZero,
} from "./rangedNumber";

export const assignmentCloseAtSchema = z.object({
  contentId: uuidSchema,
  closeAt: z.iso
    .datetime({ offset: true })
    .transform((val) => DateTime.fromISO(val)),
});

export const createAssignmentSchema = assignmentCloseAtSchema.extend({
  destinationParentId: uuidOrNullSchema,
});

export const assignmentMaxAttemptsSchema = z.object({
  contentId: uuidSchema,
  maxAttempts: stringAsRangedNumberIncludingZero,
});

export const assignmentSettingsSchema = z.object({
  contentId: uuidSchema,
  mode: z.enum(["formative", "summative"]).optional(),
  individualizeByStudent: z.boolean().optional(),
});

export const assignmentParentSchema = z.object({
  parentId: uuidSchema,
});

export const getStudentAssignmentScoresSchema = z.object({
  studentUserId: uuidSchema,
  parentId: optionalUuidSchema,
});

export const recordSubmittedEventSchema = z.object({
  contentId: uuidSchema,
  contentAttemptNumber: rangedNumber,
  itemAttemptNumber: rangedNumber.nullable(),
  answerId: z.string(),
  response: z.string(),
  answerNumber: rangedNumber.optional(),
  componentNumber: rangedNumber,
  itemNumber: rangedNumber,
  shuffledItemNumber: rangedNumber,
  answerCreditAchieved: z.number(),
  componentCreditAchieved: z.number(),
  itemCreditAchieved: z.number(),
});

export const codeSchema = z.object({ code: z.number() });

export const getAssignmentResponseStudentSchema = z.object({
  contentId: uuidSchema,
  studentUserId: uuidSchema.optional(),
  shuffledOrder: stringAsBoolSchema,
  itemNumber: stringAsRangedNumber.optional(),
  attemptNumber: stringAsRangedNumber.optional(),
});

export const getStudentSubmittedResponsesSchema = z.object({
  contentId: uuidSchema,
  studentUserId: uuidSchema.optional(),
  answerId: z.string(),
  shuffledOrder: stringAsBoolSchema,
  requestedItemNumber: stringAsRangedNumber.optional(),
  contentAttemptNumber: stringAsRangedNumber,
  itemAttemptNumber: stringAsRangedNumber.optional(),
});
