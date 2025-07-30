import express from "express";
import {
  closeAssignmentWithCode,
  getAllAssignmentScores,
  getAssignedScores,
  getAssignmentResponseOverview,
  getAssignmentResponseStudent,
  getStudentAssignmentScores,
  getStudentSubmittedResponses,
  listUserAssigned,
  createAssignment,
  recordSubmittedEvent,
  updateAssignmentCloseAt,
  updateAssignmentMaxAttempts,
  updateAssignmentSettings,
} from "../query/assign";
import { contentIdSchema } from "../schemas/contentSchema";
import {
  assignmentParentSchema,
  assignmentCloseAtSchema,
  getStudentAssignmentScoresSchema,
  recordSubmittedEventSchema,
  assignmentMaxAttemptsSchema,
  assignmentSettingsSchema,
  getAssignmentResponseStudentSchema,
  getStudentSubmittedResponsesSchema,
  createAssignmentSchema,
} from "../schemas/assignSchema";
import {
  queryLoggedIn,
  queryLoggedInNoArguments,
} from "../middleware/queryMiddleware";

export const assignRouter = express.Router();

assignRouter.post(
  "/createAssignment",
  queryLoggedIn(createAssignment, createAssignmentSchema),
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
  "/getAllAssignmentScores/:parentId",
  queryLoggedIn(getAllAssignmentScores, assignmentParentSchema),
);

assignRouter.get(
  "/getStudentAssignmentScores/:studentUserId",
  queryLoggedIn(getStudentAssignmentScores, getStudentAssignmentScoresSchema),
);

assignRouter.get(
  "/getStudentAssignmentScores/:studentUserId/:parentId",
  queryLoggedIn(getStudentAssignmentScores, getStudentAssignmentScoresSchema),
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
  "/getAssignmentResponseStudent/:contentId",
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
