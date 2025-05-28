import express from "express";
import { queryOptionalLoggedIn } from "../middleware/queryMiddleware";
import {
  getMyContent,
  getSharedContent,
  searchMyContent,
} from "../query/content_list";
import {
  getContentSchema,
  searchMyContentSchema,
} from "../schemas/contentListSchema";

export const contentListRouter = express.Router();

contentListRouter.get(
  "/getMyContent/:ownerId",
  queryOptionalLoggedIn(getMyContent, getContentSchema),
);

contentListRouter.get(
  "/getMyContent/:ownerId/:parentId",
  queryOptionalLoggedIn(getMyContent, getContentSchema),
);

contentListRouter.get(
  "/searchMyContent/:ownerId",
  queryOptionalLoggedIn(searchMyContent, searchMyContentSchema),
);

contentListRouter.get(
  "/searchMyContent/:ownerId/:parentId",
  queryOptionalLoggedIn(searchMyContent, searchMyContentSchema),
);

contentListRouter.get(
  "/getSharedContent/:ownerId",
  queryOptionalLoggedIn(getSharedContent, getContentSchema),
);

contentListRouter.get(
  "/getSharedContent/:ownerId/:parentId",
  queryOptionalLoggedIn(getSharedContent, getContentSchema),
);
