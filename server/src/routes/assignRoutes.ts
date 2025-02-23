import express, { Request, Response } from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { handleErrors } from "../errors/routeErrorHandler";
import { convertUUID, fromUUID } from "../utils/uuid";
import {
  assignActivity,
  closeAssignmentWithCode,
  getAllAssignmentScores,
  getAssignedScores,
  getAssignmentData,
  getAssignmentStudentData,
  getStudentData,
  getSubmittedResponseHistory,
  getSubmittedResponses,
  listUserAssigned,
  openAssignmentWithCode,
  recordSubmittedEvent,
  unassignActivity,
  updateAssignmentSettings,
} from "../query/assign";
import { contentIdSchema } from "../schemas/contentSchema";
import {
  assignmentParentSchema,
  assignmentSettingsSchema,
  assignmentStudentSchema,
  getStudentDataSchema,
  getSubmittedResponseHistorySchema,
  getSubmittedResponsesSchema,
  recordSubmittedEventSchema,
} from "../schemas/assignSchema";
import { queryLoggedIn } from "../middleware/queryMiddleware";

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
        contentId: fromUUID(scores.contentId),
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

assignRouter.get(
  "/getAssignmentStudentData",
  queryLoggedIn(getAssignmentStudentData, assignmentStudentSchema),
);

assignRouter.get(
  "/getAllAssignmentScores",
  queryLoggedIn(getAllAssignmentScores, assignmentParentSchema),
);

assignRouter.get(
  "/getStudentData",
  queryLoggedIn(getStudentData, getStudentDataSchema),
);

assignRouter.get(
  "/getSubmittedResponses",
  queryLoggedIn(getSubmittedResponses, getSubmittedResponsesSchema),
);

assignRouter.get(
  "/getSubmittedResponseHistory",
  queryLoggedIn(getSubmittedResponseHistory, getSubmittedResponseHistorySchema),
);

assignRouter.post(
  "/recordSubmittedEvent",
  queryLoggedIn(recordSubmittedEvent, recordSubmittedEventSchema),
);

assignRouter.get(
  "/getAssignmentData",
  queryLoggedIn(getAssignmentData, contentIdSchema),
);
