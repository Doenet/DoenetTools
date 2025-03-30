import express from "express";
import {
  queryLoggedIn,
  queryOptionalLoggedIn,
} from "../middleware/queryMiddleware";
import {
  getRemixedFrom,
  getRemixes,
  updateOriginContentToRemix,
  updateRemixedContentToOrigin,
} from "../query/remix";
import {
  remixSchema,
  updateOriginContentToRemixSchema,
  updateRemixedContentToOriginSchema,
} from "../schemas/remixSchema";

export const remixRouter = express.Router();

remixRouter.get(
  "/getRemixedFrom/:contentId",
  queryOptionalLoggedIn(getRemixedFrom, remixSchema),
);

remixRouter.get(
  "/getRemixes/:contentId",
  queryOptionalLoggedIn(getRemixes, remixSchema),
);

remixRouter.post(
  "/updateRemixedContentToOrigin",
  queryLoggedIn(
    updateRemixedContentToOrigin,
    updateRemixedContentToOriginSchema,
  ),
);

remixRouter.post(
  "/updateOriginContentToRemix",
  queryLoggedIn(updateOriginContentToRemix, updateOriginContentToRemixSchema),
);
