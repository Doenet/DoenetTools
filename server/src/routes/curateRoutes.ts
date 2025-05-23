import express from "express";
import {
  queryLoggedIn,
  queryLoggedInNoArguments,
} from "../middleware/queryMiddleware";
import {
  addComment,
  claimOwnershipOfReview,
  createCurationFolder,
  getComments,
  getCurationFolderContent,
  getCurationQueue,
  publishActivityToLibrary,
  rejectActivity,
  searchCurationFolderContent,
  suggestToBeCurated,
  unpublishActivityFromLibrary,
} from "../query/curate";
import {
  addCommentSchema,
  searchCurationFolderContentSchema,
  createCurationFolderSchema,
  curationParentIdSchema,
  getCommentsSchema,
} from "../schemas/curateSchema";
import { contentIdSchema } from "../schemas/contentSchema";

export const curateRouter = express.Router();

curateRouter.get(
  "/getCurationQueue",
  queryLoggedInNoArguments(getCurationQueue),
);

curateRouter.get(
  "/getCurationFolderContent",
  queryLoggedIn(getCurationFolderContent, curationParentIdSchema),
);

curateRouter.get(
  "/getCurationFolderContent/:parentId",
  queryLoggedIn(getCurationFolderContent, curationParentIdSchema),
);

curateRouter.get(
  "/searchCurationFolderContent",
  queryLoggedIn(searchCurationFolderContent, searchCurationFolderContentSchema),
);

curateRouter.get(
  "/searchCurationFolderContent/:parentId",
  queryLoggedIn(searchCurationFolderContent, searchCurationFolderContentSchema),
);

curateRouter.post(
  "/createCurationFolder",
  queryLoggedIn(createCurationFolder, createCurationFolderSchema),
);

curateRouter.post(
  "/suggestToBeCurated",
  queryLoggedIn(suggestToBeCurated, contentIdSchema),
);

curateRouter.post(
  "/claimOwnershipOfReview",
  queryLoggedIn(claimOwnershipOfReview, contentIdSchema),
);

curateRouter.post(
  "/publishActivityToLibrary",
  queryLoggedIn(publishActivityToLibrary, contentIdSchema),
);

curateRouter.post(
  "/unpublishActivityFromLibrary",
  queryLoggedIn(unpublishActivityFromLibrary, contentIdSchema),
);

curateRouter.post(
  "/rejectActivity",
  queryLoggedIn(rejectActivity, contentIdSchema),
);

curateRouter.post("/addComment", queryLoggedIn(addComment, addCommentSchema));

curateRouter.get(
  "/getComments/:contentId",
  queryLoggedIn(getComments, getCommentsSchema),
);
