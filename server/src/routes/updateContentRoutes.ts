import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import {
  contentCreateSchema,
  contentIdSchema,
  createContentRevisionScheme,
  revertToRevisionScheme,
  updateContentDoenetMLSchema,
  updateContentFeaturesSchema,
  updateContentSettingsSchema,
} from "../schemas/contentSchema";
import {
  createContent,
  createContentRevision,
  deleteContent,
  revertToRevision,
  updateContent,
  updateContentFeatures,
} from "../query/activity";
import { queryLoggedIn } from "../middleware/queryMiddleware";

export const updateContentRouter = express.Router();

updateContentRouter.use(requireLoggedIn);

updateContentRouter.post(
  "/deleteContent",
  queryLoggedIn(deleteContent, contentIdSchema),
);

updateContentRouter.post(
  "/createContent/",
  queryLoggedIn(createContent, contentCreateSchema),
);

updateContentRouter.post(
  "/updateContentSettings",
  queryLoggedIn(updateContent, updateContentSettingsSchema),
);

updateContentRouter.post(
  "/updateContentFeatures",
  queryLoggedIn(updateContentFeatures, updateContentFeaturesSchema),
);

updateContentRouter.post(
  "/saveDoenetML",
  queryLoggedIn(updateContent, updateContentDoenetMLSchema),
);

updateContentRouter.post(
  "/createContentRevision",
  queryLoggedIn(createContentRevision, createContentRevisionScheme),
);

updateContentRouter.post(
  "/revertToRevision",
  queryLoggedIn(revertToRevision, revertToRevisionScheme),
);
