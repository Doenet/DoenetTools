import { z } from "zod";
import { uuidSchema } from "./uuid";

export const scoreAndStateSchema = z.object({
  activityId: uuidSchema,
  activityRevisionNum: z.number(),
  score: z.number(),
  onSubmission: z.boolean(),
  state: z.string(),
});

export const loadStateSchema = z.object({
  activityId: uuidSchema,
  requestedUserId: uuidSchema,
  withMaxScore: z.boolean(),
});
