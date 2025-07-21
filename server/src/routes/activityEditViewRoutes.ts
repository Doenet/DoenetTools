import express from "express";
import { queryOptionalLoggedIn } from "../middleware/queryMiddleware";
import {
  getActivityViewerData,
  getSharedEditorData,
} from "../query/activity_edit_view";
import { contentIdSchema } from "../schemas/contentSchema";

export const activityEditViewRouter = express.Router();

activityEditViewRouter.get(
  "/getSharedEditorData/:contentId",
  queryOptionalLoggedIn(getSharedEditorData, contentIdSchema),
);

activityEditViewRouter.get(
  "/getActivityViewerData/:contentId",
  queryOptionalLoggedIn(getActivityViewerData, contentIdSchema),
);
