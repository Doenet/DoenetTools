import { z } from "zod";
import { uuidSchema } from "./uuid";

export const scoreAndStateSchema = z.object({
  contentId: uuidSchema,
  activityRevisionNum: z.number(),
  score: z.number(),
  onSubmission: z.boolean(),
  state: z.string(),
});

export const loadStateSchema = z.object({
  contentId: uuidSchema,
  requestedUserId: uuidSchema,
  withMaxScore: z.boolean().default(false),
});
