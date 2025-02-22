import express, { Request, Response } from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { handleErrors } from "../errors/routeErrorHandler";
import { convertUUID, fromUUID } from "../utils/uuid";
import {
  assignActivity,
  closeAssignmentWithCode,
  getAssignedScores,
  listUserAssigned,
  openAssignmentWithCode,
  unassignActivity,
  updateAssignmentSettings,
} from "../query/assign";
import { contentIdSchema } from "../schemas/contentSchema";
import { assignmentSettingsSchema } from "../schemas/assignSchema";

export const assignRouter = express.Router();

assignRouter.use(requireLoggedIn);

assignRouter.get("/getAssigned", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.userId;
    const assignedData = await listUserAssigned(loggedInUserId);
    res.send({
      user: convertUUID(assignedData.user),
      assignments: assignedData.assignments.map(convertUUID),
    });
  } catch (e) {
    handleErrors(res, e);
  }
});

assignRouter.get("/getAssignedScores", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.userId;
    const scoreData = await getAssignedScores(loggedInUserId);
    res.send({
      userData: convertUUID(scoreData.userData),
      orderedActivityScores: scoreData.orderedActivityScores.map((scores) => ({
        ...scores,
        activityId: fromUUID(scores.activityId),
      })),
      folder: null,
    });
  } catch (e) {
    handleErrors(res, e);
  }
});

assignRouter.post("/assignActivity", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.userId;
    const contentId = contentIdSchema.parse(req.body).contentId;
    await assignActivity(contentId, loggedInUserId);

    res.send({ userId: fromUUID(loggedInUserId) });
  } catch (e) {
    handleErrors(res, e);
  }
});

assignRouter.post(
  "/openAssignmentWithCode",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const openAssignmentArgs = assignmentSettingsSchema.parse(req.body);

      const { classCode, codeValidUntil } = await openAssignmentWithCode({
        loggedInUserId,
        ...openAssignmentArgs,
      });
      res.send({ classCode, codeValidUntil });
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

assignRouter.post(
  "/updateAssignmentSettings",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const updateAssignmentArgs = assignmentSettingsSchema.parse(req.body);

      await updateAssignmentSettings({
        loggedInUserId,
        ...updateAssignmentArgs,
      });
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

assignRouter.post(
  "/closeAssignmentWithCode",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const contentId = contentIdSchema.parse(req.body).contentId;
      await closeAssignmentWithCode(contentId, loggedInUserId);
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

assignRouter.post("/unassignActivity", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.userId;
    const contentId = contentIdSchema.parse(req.body).contentId;
    await unassignActivity(contentId, loggedInUserId);
    res.send({});
  } catch (e) {
    handleErrors(res, e);
  }
});
