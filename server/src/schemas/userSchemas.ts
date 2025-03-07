import { z } from "zod";

export const userNamesSchema = z.object({
  firstNames: z.string(),
  lastNames: z.string(),
});
