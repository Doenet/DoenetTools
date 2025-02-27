import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
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
  curationParentIdSchema,
  updateLibraryInfoSchema,
  publishSchema,
  searchCurationFolderContentSchema,
  sourceIdSchema,
} from "../schemas/curateSchema";
import { contentIdSchema } from "../schemas/contentSchema";

export const curateRouter = express.Router();

curateRouter.use(requireLoggedIn);

curateRouter.get(
  "/getCurationFolderContent",
  queryLoggedIn(getCurationFolderContent, curationParentIdSchema),
);

curateRouter.get(
  "/searchCurationFolderContent",
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
  queryLoggedIn(createCurationFolder, curationParentIdSchema),
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
