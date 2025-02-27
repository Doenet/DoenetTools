import express, { NextFunction, Request, Response } from "express";
import { getAvailableContentFeatures } from "../query/classification";
import {
  getAllDoenetmlVersions,
  getContentDescription,
} from "../query/activity";
import { getAllLicenses } from "../query/share";
import { getAssignmentDataFromCode } from "../query/assign";
import {
  queryLoggedIn,
  queryOptionalLoggedIn,
  queryOptionalLoggedInNoArguments,
} from "../middleware/queryMiddleware";
import { codeSchema } from "../schemas/assignSchema";
import { contentIdSchema } from "../schemas/contentSchema";
import { getRecentContent } from "../query/stats";
import { requireLoggedIn } from "../middleware/validationMiddleware";
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
  "/getAssignmentDataFromCode/:code",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      // If not logged in, then redirect to log in anonymously,
      // which will redirect back here with the anonymous user
      // logged in.
      return res.redirect(`/api/login/anonymId/${req.params.code}`);
    }
    next();
  },
  queryLoggedIn(getAssignmentDataFromCode, codeSchema),
);

infoRouter.get(
  "/getContentDescription/:contentId",
  queryOptionalLoggedIn(getContentDescription, contentIdSchema),
);

infoRouter.get(
  "/getRecentContent",
  requireLoggedIn,
  queryLoggedIn(getRecentContent, getRecentContentSchema),
);
