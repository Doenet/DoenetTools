import { z } from "zod";
import { uuidSchema } from "./uuid";

export const licenseCodeSchema = z.enum(["CCDUAL", "CCBYSA", "CCBYNCSA"], {
  required_error: "License code is required",
  invalid_type_error: "Invalid license code",
});

export const setLicenseCodeSchema = z.object({
  contentId: uuidSchema,
  licenseCode: licenseCodeSchema,
});

export const contentIdEmailSchema = z.object({
  contentId: uuidSchema,
  email: z.string().email(),
});

export const contentIdUserIdSchema = z.object({
  contentId: uuidSchema,
  userId: uuidSchema,
});
