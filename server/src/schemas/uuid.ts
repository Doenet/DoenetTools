import { z } from "zod";

import short from "short-uuid";
import { toUUID } from "../utils/uuid";

const translator = short();

export const uuidSchema = z
  .custom<"uuid">((val) => {
    return typeof val === "string" && translator.validate(val);
  })
  .transform((val) => toUUID(val));
