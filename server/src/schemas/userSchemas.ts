import { z } from "zod";
import { uuidSchema } from "./uuid";

export const userNamesSchema = z.object({
  firstNames: z.string(),
  lastNames: z.string(),
});

export const userIdSchema = z.object({
  userId: uuidSchema,
});
