import express from "express";
import { queryLoggedIn } from "../middleware/queryMiddleware";
import {
  addDraftToLibrary,
  createCurationFolder,
  deleteDraftFromLibrary,
  getCurationFolderContent,
  getLibraryStatus,
  markLibraryRequestNeedsRevision,
  modifyCommentsOfLibraryRequest,
  publishActivityToLibrary,
  searchCurationFolderContent,
  unpublishActivityFromLibrary,
} from "../query/curate";
import {
  updateLibraryInfoSchema,
  publishSchema,
  searchCurationFolderContentSchema,
  sourceIdSchema,
  createCurationFolderSchema,
  curationParentIdSchema,
} from "../schemas/curateSchema";
import { contentIdSchema } from "../schemas/contentSchema";

export const curateRouter = express.Router();

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

curateRouter.get(
  "/getLibraryStatus",
  queryLoggedIn(getLibraryStatus, sourceIdSchema),
);

curateRouter.post(
  "/addDraftToLibrary",
  queryLoggedIn(addDraftToLibrary, contentIdSchema),
);

curateRouter.post(
  "/deleteDraftFromLibrary",
  queryLoggedIn(deleteDraftFromLibrary, contentIdSchema),
);

curateRouter.post(
  "/createCurationFolder",
  queryLoggedIn(createCurationFolder, createCurationFolderSchema),
);

curateRouter.post(
  "/publishActivityToLibrary",
  queryLoggedIn(publishActivityToLibrary, publishSchema),
);

curateRouter.post(
  "/unpublishActivityFromLibrary",
  queryLoggedIn(unpublishActivityFromLibrary, contentIdSchema),
);

curateRouter.post(
  "/modifyCommentsOfLibraryRequest",
  queryLoggedIn(modifyCommentsOfLibraryRequest, updateLibraryInfoSchema),
);

curateRouter.post(
  "/markLibraryRequestNeedsRevision",
  queryLoggedIn(markLibraryRequestNeedsRevision, updateLibraryInfoSchema),
);
