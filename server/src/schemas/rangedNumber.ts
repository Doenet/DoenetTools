import { z } from "zod";

export const rangedNumber = z.number().int().gte(1).lte(65535);
export const stringAsRangedNumber = z.coerce.number().int().gte(1).lte(65535);
