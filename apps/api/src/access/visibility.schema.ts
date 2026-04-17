import { z } from "zod";
import { uuidSchema } from "../schemas/uuid";
import type { AccessPolicy } from "./types";

export const updateVisibilitySchema = z.object({
  contentId: uuidSchema,
  visibility: z.enum(["public", "private", "unlisted"]),
});

export type UpdateVisibilityParams = z.infer<typeof updateVisibilitySchema>;
export type UpdateVisibilityResponse = AccessPolicy;
