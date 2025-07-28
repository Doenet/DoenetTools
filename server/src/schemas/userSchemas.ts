import { z } from "zod";
import { uuidSchema } from "./uuid";

export const userNamesSchema = z.object({
  firstNames: z.string(),
  lastNames: z.string(),
});

export const setIsAuthorSchema = z.object({
  isAuthor: z.boolean(),
});

export const userIdSchema = z.object({
  userId: uuidSchema,
});
