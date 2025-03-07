import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import {
  contentCreateSchema,
  contentIdSchema,
  updateContentDoenetMLSchema,
  updateContentFeaturesSchema,
  updateContentSettingsSchema,
} from "../schemas/contentSchema";
import {
  createContent,
  deleteContent,
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
