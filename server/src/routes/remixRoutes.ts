import express from "express";
import { queryOptionalLoggedIn } from "../middleware/queryMiddleware";
import { getContributorHistory, getRemixes } from "../query/remix";
import { contentIdSchema } from "../schemas/contentSchema";

export const remixRouter = express.Router();

remixRouter.get(
  "/getContributorHistory",
  queryOptionalLoggedIn(getContributorHistory, contentIdSchema),
);

remixRouter.get(
  "/getRemixes",
  queryOptionalLoggedIn(getRemixes, contentIdSchema),
);
