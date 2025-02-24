import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
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
import {
  queryLoggedIn,
  queryLoggedInNoArguments,
} from "../middleware/queryMiddleware";

export const assignRouter = express.Router();

assignRouter.use(requireLoggedIn);

assignRouter.get("/getAssigned", queryLoggedInNoArguments(listUserAssigned));

assignRouter.get(
  "/getAssignedScores",
  queryLoggedInNoArguments(getAssignedScores),
);

assignRouter.post(
  "/assignActivity",
  queryLoggedIn(assignActivity, contentIdSchema),
);

assignRouter.post(
  "/openAssignmentWithCode",
  queryLoggedIn(openAssignmentWithCode, assignmentSettingsSchema),
);

assignRouter.post(
  "/updateAssignmentSettings",
  queryLoggedIn(updateAssignmentSettings, assignmentSettingsSchema),
);

assignRouter.post(
  "/closeAssignmentWithCode",
  queryLoggedIn(closeAssignmentWithCode, contentIdSchema),
);

assignRouter.post(
  "/unassignActivity",
  queryLoggedIn(unassignActivity, contentIdSchema),
);

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
