import express from "express";
import {
  createContentSchema,
  contentIdSchema,
  createContentRevisionScheme,
  revertToRevisionScheme,
  updateContentDoenetMLSchema,
  updateCategoriesSchema,
  updateContentRevisionScheme,
  updateContentSettingsSchema,
} from "../schemas/contentSchema";
import {
  createContent,
  createContentRevision,
  deleteContent,
  restoreDeletedContent,
  revertToRevision,
  updateCategories,
  updateContent,
  updateContentRevision,
} from "../query/activity";
import { queryLoggedIn } from "../middleware/queryMiddleware";

export const updateContentRouter = express.Router();

updateContentRouter.post(
  "/deleteContent",
  queryLoggedIn(deleteContent, contentIdSchema),
);

updateContentRouter.post(
  "/restoreDeletedContent",
  queryLoggedIn(restoreDeletedContent, contentIdSchema),
);

updateContentRouter.post(
  "/createContent/",
  queryLoggedIn(createContent, createContentSchema),
);

updateContentRouter.post(
  "/updateContentSettings",
  queryLoggedIn(updateContent, updateContentSettingsSchema),
);

updateContentRouter.post(
  "/updateCategories",
  queryLoggedIn(updateCategories, updateCategoriesSchema),
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
  "/updateContentRevision",
  queryLoggedIn(updateContentRevision, updateContentRevisionScheme),
);

updateContentRouter.post(
  "/revertToRevision",
  queryLoggedIn(revertToRevision, revertToRevisionScheme),
);
