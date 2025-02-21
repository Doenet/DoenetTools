import express, { Request, Response } from "express";
import { handleErrors } from "../errors/routeErrorHandler";
import { getAvailableContentFeatures } from "../query/classification";
import { getAllDoenetmlVersions } from "../query/activity";
import { getAllLicenses } from "../query/share";
import { getAssignmentDataFromCode } from "../query/assign";
import { convertUUID } from "../utils/uuid";

export const infoRouter = express.Router();

infoRouter.get(
  "/getAvailableContentFeatures",
  async (_req: Request, res: Response) => {
    try {
      const availableFeatures = await getAvailableContentFeatures();
      res.send(availableFeatures);
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

infoRouter.get(
  "/getAllDoenetmlVersions",
  async (_req: Request, res: Response) => {
    try {
      const allDoenetmlVersions = await getAllDoenetmlVersions();
      res.send(allDoenetmlVersions);
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

infoRouter.get("/getAllLicenses", async (_req: Request, res: Response) => {
  try {
    const allLicenses = await getAllLicenses();
    res.send(allLicenses);
  } catch (e) {
    handleErrors(res, e);
  }
});

// Putting this in `info` for now, as it doesn't require log in.
// TODO: how to organize this?
infoRouter.get(
  "/getAssignmentDataFromCode/:code",
  async (req: Request, res: Response) => {
    try {
      const code = req.params.code;

      if (!req.user) {
        // If not logged in, then redirect to log in anonymously,
        // which will redirect back here with the anonymous user
        // logged in.
        return res.redirect(`/api/login/anonymId/${code}`);
      }

      const loggedInUserId = req.user.userId;
      const { assignmentFound, assignment } = await getAssignmentDataFromCode(
        code,
        loggedInUserId,
      );

      res.send({
        assignmentFound,
        assignment: assignment ? convertUUID(assignment) : null,
      });
    } catch (e) {
      handleErrors(res, e);
    }
  },
);
