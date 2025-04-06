import express from "express";
import {
  queryLoggedIn,
  queryLoggedInNoArguments,
} from "../middleware/queryMiddleware";
import {
  addDraftToLibrary,
  cancelLibraryRequest,
  createCurationFolder,
  deleteDraftFromLibrary,
  getCurationFolderContent,
  getMultipleLibraryRelations,
  getPendingCurationRequests,
  getSingleLibraryRelations,
  markLibraryRequestNeedsRevision,
  modifyCommentsOfLibraryRequest,
  publishActivityToLibrary,
  searchCurationFolderContent,
  submitLibraryRequest,
  unpublishActivityFromLibrary,
} from "../query/curate";
import {
  updateLibraryInfoSchema,
  publishSchema,
  searchCurationFolderContentSchema,
  createCurationFolderSchema,
  curationParentIdSchema,
  contentIdArraySchema,
} from "../schemas/curateSchema";
import { contentIdSchema } from "../schemas/contentSchema";

export const curateRouter = express.Router();

curateRouter.get(
  "/getCurationPendingRequests",
  queryLoggedInNoArguments(getPendingCurationRequests),
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

curateRouter.get(
  "/getLibraryRelations/:contentId",
  queryLoggedIn(getSingleLibraryRelations, contentIdSchema),
);

curateRouter.get(
  "/getMultipleLibraryRelations",
  queryLoggedIn(getMultipleLibraryRelations, contentIdArraySchema),
);

curateRouter.post(
  "/submitLibraryRequest",
  queryLoggedIn(submitLibraryRequest, contentIdSchema),
);

curateRouter.post(
  "/cancelLibraryRequest",
  queryLoggedIn(cancelLibraryRequest, contentIdSchema),
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
