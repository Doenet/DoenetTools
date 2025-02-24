import express from "express";
import { queryOptionalLoggedIn } from "../middleware/queryMiddleware";
import {
  getMyContent,
  getPreferredFolderView,
  getSharedContent,
  searchMyContent,
  setPreferredFolderView,
} from "../query/content_list";
import {
  getContentSchema,
  getPreferredFolderViewSchema,
  searchMyContentSchema,
  setPreferredFolderViewSchema,
} from "../schemas/contentListSchema";

export const contentListRouter = express.Router();

// contentListRouter.use(requireLoggedIn);

contentListRouter.get(
  "/getMyContent/:ownerId",
  queryOptionalLoggedIn(getMyContent, getContentSchema),
);

contentListRouter.get(
  "/searchMyContent",
  queryOptionalLoggedIn(searchMyContent, searchMyContentSchema),
);

contentListRouter.get(
  "/getSharedContent",
  queryOptionalLoggedIn(getSharedContent, getContentSchema),
);

contentListRouter.get(
  "/getPreferredFolderView",
  queryOptionalLoggedIn(getPreferredFolderView, getPreferredFolderViewSchema),
);

contentListRouter.post(
  "/setPreferredFolderView",
  queryOptionalLoggedIn(setPreferredFolderView, setPreferredFolderViewSchema),
);
