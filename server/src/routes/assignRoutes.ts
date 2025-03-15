import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import {
  assignActivity,
  closeAssignmentWithCode,
  getAllAssignmentScores,
  getAssignedScores,
  getAssignmentResponseOverview,
  getAssignmentResponseStudent,
  getStudentData,
  getStudentSubmittedResponses,
  listUserAssigned,
  openAssignmentWithCode,
  recordSubmittedEvent,
  unassignActivity,
  updateAssignmentCloseAt,
  updateAssignmentMaxAttempts,
  updateAssignmentSettings,
} from "../query/assign";
import { contentIdSchema } from "../schemas/contentSchema";
import {
  assignmentParentSchema,
  assignmentCloseAtSchema,
  getStudentDataSchema,
  recordSubmittedEventSchema,
  assignmentMaxAttemptsSchema,
  assignmentSettingsSchema,
  getAssignmentResponseStudentSchema,
  getStudentSubmittedResponsesSchema,
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

assignRouter.get("/getAssigned", queryLoggedInNoArguments(listUserAssigned));

assignRouter.get(
  "/getAssignedScores",
  queryLoggedInNoArguments(getAssignedScores),
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

assignRouter.post(
  "/recordSubmittedEvent",
  queryLoggedIn(recordSubmittedEvent, recordSubmittedEventSchema),
);

assignRouter.get(
  "/getAssignmentResponseOverview/:contentId",
  queryLoggedIn(getAssignmentResponseOverview, contentIdSchema),
);

assignRouter.get(
  "/getAssignmentResponseStudent/:contentId/:studentUserId",
  queryLoggedIn(
    getAssignmentResponseStudent,
    getAssignmentResponseStudentSchema,
  ),
);

assignRouter.get(
  "/getStudentSubmittedResponses/:contentId/:studentUserId",
  queryLoggedIn(
    getStudentSubmittedResponses,
    getStudentSubmittedResponsesSchema,
  ),
);
