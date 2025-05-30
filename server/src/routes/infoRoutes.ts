import express, { NextFunction, Request, Response } from "express";
import { getAvailableContentFeatures } from "../query/classification";
import {
  getAllDoenetmlVersions,
  getContentDescription,
  getContentHistory,
} from "../query/activity";
import { getAllLicenses } from "../query/share";
import { getAssignmentViewerDataFromCode } from "../query/assign";
import {
  queryLoggedIn,
  queryOptionalLoggedIn,
  queryOptionalLoggedInNoArguments,
} from "../middleware/queryMiddleware";
import { codeSchema } from "../schemas/assignSchema";
import { contentIdSchema } from "../schemas/contentSchema";
import { getRecentContent } from "../query/stats";
import { getRecentContentSchema } from "../schemas/infoSchemas";

export const infoRouter = express.Router();

infoRouter.get(
  "/getAvailableContentFeatures",
  queryOptionalLoggedInNoArguments(getAvailableContentFeatures),
);

infoRouter.get(
  "/getAllDoenetmlVersions",
  queryOptionalLoggedInNoArguments(getAllDoenetmlVersions),
);

infoRouter.get(
  "/getAllLicenses",
  queryOptionalLoggedInNoArguments(getAllLicenses),
);

// Putting this in `info` for now, as it doesn't require log in.
// TODO: how to organize this?
infoRouter.get(
  "/getAssignmentViewerDataFromCode/:code",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      // If not logged in, then redirect to log in anonymously,
      // which will redirect back here with the anonymous user
      // logged in.
      return res.redirect(`/api/login/anonymId/${req.params.code}`);
    }
    next();
  },
  queryLoggedIn(getAssignmentViewerDataFromCode, codeSchema),
);

infoRouter.get(
  "/getContentDescription/:contentId",
  queryOptionalLoggedIn(getContentDescription, contentIdSchema),
);

infoRouter.get(
  "/getRecentContent",
  queryLoggedIn(getRecentContent, getRecentContentSchema),
);

infoRouter.get(
  "/getContentHistory/:contentId",
  queryLoggedIn(getContentHistory, contentIdSchema),
);
