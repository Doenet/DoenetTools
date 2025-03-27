import express from "express";
import { queryOptionalLoggedIn } from "../middleware/queryMiddleware";
import { getRemixedFrom, getRemixes } from "../query/remix";
import { contentIdSchema } from "../schemas/contentSchema";

export const remixRouter = express.Router();

remixRouter.get(
  "/getRemixedFrom/:contentId",
  queryOptionalLoggedIn(getRemixedFrom, contentIdSchema),
);

remixRouter.get(
  "/getRemixes/:contentId",
  queryOptionalLoggedIn(getRemixes, contentIdSchema),
);
