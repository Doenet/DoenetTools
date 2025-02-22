import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { queryLoggedIn } from "../middleware/queryMiddleware";
import {
  getActivityEditorData,
  getSharedEditorData,
} from "../query/activity_edit_view";
import { contentIdSchema } from "../schemas/contentSchema";

export const activityEditViewRouter = express.Router();

activityEditViewRouter.use(requireLoggedIn);

activityEditViewRouter.get(
  "/getActivityEditorData",
  queryLoggedIn(getActivityEditorData, contentIdSchema),
);

activityEditViewRouter.get(
  "/getSharedEditorData",
  queryLoggedIn(getSharedEditorData, contentIdSchema),
);

activityEditViewRouter.get(
  "/getActivityViewerData",
  queryLoggedIn(getSharedEditorData, contentIdSchema),
);
