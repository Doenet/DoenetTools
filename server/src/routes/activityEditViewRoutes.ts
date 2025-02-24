import express from "express";
import { queryOptionalLoggedIn } from "../middleware/queryMiddleware";
import {
  getActivityEditorData,
  getActivityViewerData,
  getSharedEditorData,
} from "../query/activity_edit_view";
import { contentIdSchema } from "../schemas/contentSchema";
import { getContentSource } from "../query/activity";

export const activityEditViewRouter = express.Router();

activityEditViewRouter.get(
  "/getActivityEditorData",
  queryOptionalLoggedIn(getActivityEditorData, contentIdSchema),
);

activityEditViewRouter.get(
  "/getSharedEditorData",
  queryOptionalLoggedIn(getSharedEditorData, contentIdSchema),
);

activityEditViewRouter.get(
  "/getActivityViewerData",
  queryOptionalLoggedIn(getActivityViewerData, contentIdSchema),
);

activityEditViewRouter.get(
  "/getContentSource",
  queryOptionalLoggedIn(getContentSource, contentIdSchema),
);
