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
