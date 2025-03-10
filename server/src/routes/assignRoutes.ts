import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import {
  assignActivity,
  closeAssignmentWithCode,
  getAllAssignmentScores,
  getAssignedScores,
  getAssignmentResponseOverview,
  getAssignmentStudentData,
  getStudentData,
  getSubmittedResponseHistory,
  getSubmittedResponses,
  listUserAssigned,
  openAssignmentWithCode,
  recordSubmittedEvent,
  unassignActivity,
  updateAssignmentCloseAt,
  updateAssignmentMaxAttempts,
  updateAssignmentMode,
} from "../query/assign";
import { contentIdSchema } from "../schemas/contentSchema";
import {
  assignmentParentSchema,
  assignmentCloseAtSchema,
  assignmentStudentSchema,
  getStudentDataSchema,
  getSubmittedResponseHistorySchema,
  getSubmittedResponsesSchema,
  recordSubmittedEventSchema,
  assignmentMaxAttemptsSchema,
  assignmentModeSchema,
} from "../schemas/assignSchema";
import {
  queryLoggedIn,
  queryLoggedInNoArguments,
} from "../middleware/queryMiddleware";

export const assignRouter = express.Router();

assignRouter.use(requireLoggedIn);

assignRouter.post(
  "/assignActivity",
  queryLoggedIn(assignActivity, contentIdSchema),
);

assignRouter.post(
  "/openAssignmentWithCode",
  queryLoggedIn(openAssignmentWithCode, assignmentCloseAtSchema),
);

assignRouter.post(
  "/updateAssignmentCloseAt",
  queryLoggedIn(updateAssignmentCloseAt, assignmentCloseAtSchema),
);

assignRouter.post(
  "/updateAssignmentMaxAttempts",
  queryLoggedIn(updateAssignmentMaxAttempts, assignmentMaxAttemptsSchema),
);

assignRouter.post(
  "/updateAssignmentMode",
  queryLoggedIn(updateAssignmentMode, assignmentModeSchema),
);

assignRouter.post(
  "/closeAssignmentWithCode",
  queryLoggedIn(closeAssignmentWithCode, contentIdSchema),
);

assignRouter.post(
  "/unassignActivity",
  queryLoggedIn(unassignActivity, contentIdSchema),
);

assignRouter.get("/getAssigned", queryLoggedInNoArguments(listUserAssigned));

assignRouter.get(
  "/getAssignedScores",
  queryLoggedInNoArguments(getAssignedScores),
);

assignRouter.get(
  "/getAssignmentStudentData/:contentId",
  queryLoggedIn(getAssignmentStudentData, assignmentStudentSchema),
);

assignRouter.get(
  "/getAssignmentStudentData/:contentId/:studentUserId",
  queryLoggedIn(getAssignmentStudentData, assignmentStudentSchema),
);

assignRouter.get(
  "/getAllAssignmentScores",
  queryLoggedIn(getAllAssignmentScores, assignmentParentSchema),
);

assignRouter.get(
  "/getStudentData/:studentUserId",
  queryLoggedIn(getStudentData, getStudentDataSchema),
);

assignRouter.get(
  "/getStudentData/:studentUserId/:parentId",
  queryLoggedIn(getStudentData, getStudentDataSchema),
);

assignRouter.get(
  "/getSubmittedResponses/:contentId",
  queryLoggedIn(getSubmittedResponses, getSubmittedResponsesSchema),
);

assignRouter.get(
  "/getSubmittedResponseHistory/:contentId/:userId",
  queryLoggedIn(getSubmittedResponseHistory, getSubmittedResponseHistorySchema),
);

assignRouter.post(
  "/recordSubmittedEvent",
  queryLoggedIn(recordSubmittedEvent, recordSubmittedEventSchema),
);

assignRouter.get(
  "/getAssignmentResponseOverview/:contentId",
  queryLoggedIn(getAssignmentResponseOverview, contentIdSchema),
);
