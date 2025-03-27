import { expect, test } from "vitest";
import {
  createTestAnonymousUser,
  createTestUser,
  getTestAssignment,
} from "./utils";
import { DateTime } from "luxon";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { convertUUID, fromUUID } from "../utils/uuid";
import { createContent, deleteContent, updateContent } from "../query/activity";
import {
  assignActivity,
  closeAssignmentWithCode,
  getAllAssignmentScores,
  getAssignedScores,
  getAssignmentResponseOverview,
  getAssignmentResponseStudent,
  getAssignmentViewerDataFromCode,
  getStudentAssignmentScores,
  getStudentSubmittedResponses,
  listUserAssigned,
  openAssignmentWithCode,
  recordSubmittedEvent,
  unassignActivity,
  updateAssignmentCloseAt,
  updateAssignmentMaxAttempts,
  updateAssignmentSettings,
} from "../query/assign";
import { modifyContentSharedWith, setContentIsPublic } from "../query/share";
import {
  createNewAttempt,
  getScoresOfAllStudents,
  ItemScores,
  loadState,
  saveScoreAndState,
} from "../query/scores";
import { updateUser } from "../query/user";
import { moveContent } from "../query/copy_move";
import { getContent } from "../query/activity_edit_view";
import { AssignmentMode } from "@prisma/client";
import { UserInfo } from "../types";

test("assign an activity", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId,
    name: "Activity 1",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  await assignActivity({ contentId, loggedInUserId: ownerId });
  const assignment = await getTestAssignment(contentId, ownerId);

  expect(assignment.id).eqls(contentId);
  expect(assignment.name).eq("Activity 1");
  expect(assignment.source).eq("Some content");

  // changing name of activity does change assignment name
  await updateContent({
    contentId: contentId,
    name: "Activity 1a",
    loggedInUserId: ownerId,
  });

  let updatedAssignment = await getTestAssignment(contentId, ownerId);
  expect(updatedAssignment.name).eq("Activity 1a");

  // cannot change content of activity
  await expect(
    updateContent({
      contentId: contentId,
      source: "Some amended content",
      loggedInUserId: ownerId,
    }),
  ).rejects.toThrow("Cannot change assigned content");

  updatedAssignment = await getTestAssignment(contentId, ownerId);
  expect(updatedAssignment.source).eq("Some content");
});

test("cannot assign other user's activity", async () => {
  const ownerId1 = (await createTestUser()).userId;
  const ownerId2 = (await createTestUser()).userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId1,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId,
    name: "Activity 1",
    source: "Some content",
    loggedInUserId: ownerId1,
  });

  await expect(
    assignActivity({ contentId: contentId, loggedInUserId: ownerId2 }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  // still cannot create assignment even if activity is made public
  await setContentIsPublic({
    contentId: contentId,
    isPublic: true,
    loggedInUserId: ownerId1,
  });

  await expect(
    assignActivity({ contentId: contentId, loggedInUserId: ownerId2 }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  // still cannot create assignment even if activity is shared
  await modifyContentSharedWith({
    action: "share",
    contentId: contentId,
    loggedInUserId: ownerId1,
    users: [ownerId2],
  });

  await expect(
    assignActivity({ contentId: contentId, loggedInUserId: ownerId2 }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
});

test("open and close assignment with code", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const fakeId = new Uint8Array(16);

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId,
    name: "Activity 1",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  // open assignment assigns activity and generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  let assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.rootAssignment!.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  let assignmentData = await getAssignmentViewerDataFromCode({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignmentFound).eq(true);
  if (assignmentData.assignment?.type !== "singleDoc") {
    throw Error("Shouldn't happen");
  }
  expect(assignmentData.assignment.contentId).eqls(contentId);
  expect(assignmentData.assignment.doenetML).eq("Some content");

  // close assignment completely unassigns since there is no data
  await closeAssignmentWithCode({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.rootAssignment?.assigned).eq(false);

  assignmentData = await getAssignmentViewerDataFromCode({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);

  // get same code back if reopen
  closeAt = DateTime.now().plus({ weeks: 3 });
  const { classCode: classCode2 } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  expect(classCode2).eq(classCode);
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.rootAssignment!.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  assignmentData = await getAssignmentViewerDataFromCode({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.contentId).eqls(contentId);

  // Open with past date.
  // Currently, says assignment is not found
  // TODO: if we want students who have previously joined the assignment to be able to reload the page,
  // then this should still retrieve data for those students.
  closeAt = DateTime.now().plus({ seconds: -7 });
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  assignmentData = await getAssignmentViewerDataFromCode({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);

  // reopen with future date
  closeAt = DateTime.now().plus({ years: 1 });
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  const { classCode: classCode3 } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  expect(classCode3).eq(classCode2);
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.rootAssignment!.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  await createNewAttempt({
    contentId: contentId,
    loggedInUserId: ownerId,
    variant: 1,
    code: classCode,
    state: null,
  });

  // add some data
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: ownerId,
    attemptNumber: 1,
    score: 0.3,
    state: "document state",
  });

  // closing assignment doesn't close completely due to the data
  await closeAssignmentWithCode({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.rootAssignment!.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(null);
});

test("open and unassign assignment with code", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const fakeId = new Uint8Array(16);

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId,
    name: "Activity 1",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  await assignActivity({ contentId: contentId, loggedInUserId: ownerId });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  let assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.rootAssignment!.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  let assignmentData = await getAssignmentViewerDataFromCode({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignment!.contentId).eqls(contentId);

  // unassign activity
  await unassignActivity({ contentId: contentId, loggedInUserId: ownerId });
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.rootAssignment?.assigned).eq(false);

  // Getting deleted assignment by code fails
  assignmentData = await getAssignmentViewerDataFromCode({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);

  // unassign again does nothing
  expect(
    await unassignActivity({ contentId: contentId, loggedInUserId: ownerId }),
  ).eqls({ success: true });
});

test("open compound assignment with code", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const fakeId = new Uint8Array(16);

  const { contentId: sequenceId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });
  await updateContent({
    contentId: sequenceId,
    name: "A problem set",
    loggedInUserId: ownerId,
  });

  const { contentId: doc1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: sequenceId,
  });
  await updateContent({
    contentId: doc1Id,
    name: "Question 1",
    source: "Some content 1",
    loggedInUserId: ownerId,
  });

  const { contentId: deleteSelectId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: sequenceId,
  });

  await deleteContent({ contentId: deleteSelectId, loggedInUserId: ownerId });

  const { contentId: selectId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: sequenceId,
  });
  await updateContent({
    contentId: selectId,
    name: "Question Bank",
    loggedInUserId: ownerId,
  });

  const { contentId: doc2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: selectId,
  });
  await updateContent({
    contentId: doc2Id,
    name: "Question 2",
    source: "Some content 2",
    loggedInUserId: ownerId,
  });

  const { contentId: doc3Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: selectId,
  });
  await updateContent({
    contentId: doc3Id,
    name: "Question 3",
    source: "Some content 3",
    loggedInUserId: ownerId,
  });

  // check content structure beforehand
  let content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo).eq(undefined);

  // open assignment assigns activity and generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: sequenceId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  const assignment = await getTestAssignment(sequenceId, ownerId);
  expect(assignment.rootAssignment!.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  const assignmentData = await getAssignmentViewerDataFromCode({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignmentFound).eq(true);
  if (assignmentData.assignment?.type !== "sequence") {
    throw Error("Shouldn't happen");
  }

  expect(assignmentData.assignment.contentId).eqls(sequenceId);

  expect(assignmentData.assignment.name).eq("A problem set");
  expect(assignmentData.assignment.children.length).eq(2);
  const question1 = assignmentData.assignment.children[0];
  if (question1.type !== "singleDoc") {
    throw Error("Shouldn't happen");
  }
  expect(question1.doenetML).eq("Some content 1");

  const questionBank = assignmentData.assignment.children[1];
  if (questionBank.type !== "select") {
    throw Error("Shouldn't happen");
  }
  expect(questionBank.children.length).eq(2);
  for (let i = 0; i < 2; i++) {
    const question = questionBank.children[i];
    if (question.type !== "singleDoc") {
      throw Error("Shouldn't happen");
    }
    expect(question.doenetML).eq(`Some content ${i + 2}`);
  }

  // check content info from root and a descendant
  content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Open");
  expect(content.assignmentInfo?.codeValidUntil).eqls(closeAt.toJSDate());
  expect(content.assignmentInfo?.classCode).eq(classCode);
  expect(content.assignmentInfo?.maxAttempts).eq(1);
  expect(content.assignmentInfo?.mode).eq("formative");
  expect(content.assignmentInfo?.otherRoot).eq(undefined);

  content = await getContent({
    contentId: doc3Id,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Open");
  expect(content.assignmentInfo?.codeValidUntil).eqls(closeAt.toJSDate());
  expect(content.assignmentInfo?.classCode).eq(classCode);
  expect(content.assignmentInfo?.maxAttempts).eq(1);
  expect(content.assignmentInfo?.mode).eq("formative");
  expect(content.assignmentInfo?.otherRoot).eqls({
    rootName: "A problem set",
    rootType: "sequence",
    rootContentId: sequenceId,
  });
});

test("only owner can open, close, modify, or unassign assignment", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user2 = await createTestUser();
  const userId2 = user2.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  await expect(
    updateContent({
      contentId: contentId,
      name: "Activity 1",
      source: "Some content",
      loggedInUserId: userId2,
    }),
  ).rejects.toThrow("not found");

  await updateContent({
    contentId: contentId,
    name: "Activity 1",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  await expect(
    assignActivity({ contentId: contentId, loggedInUserId: userId2 }),
  ).rejects.toThrow("not found");

  await assignActivity({ contentId: contentId, loggedInUserId: ownerId });

  await expect(getTestAssignment(contentId, userId2)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  let assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.name).eq("Activity 1");

  await expect(
    updateContent({
      contentId: contentId,
      name: "New Activity",
      loggedInUserId: userId2,
    }),
  ).rejects.toThrow("not found");

  await updateContent({
    contentId: contentId,
    name: "New Activity",
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.name).eq("New Activity");

  const closeAt = DateTime.now().plus({ days: 1 });

  await expect(
    openAssignmentWithCode({
      contentId: contentId,
      closeAt: closeAt,
      loggedInUserId: userId2,
    }),
  ).rejects.toThrow("not found");

  const { codeValidUntil } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  expect(codeValidUntil).eqls(closeAt.toJSDate());

  const newCloseAt = DateTime.now().plus({ days: 2 });

  await expect(
    updateAssignmentCloseAt({
      contentId: contentId,
      closeAt: newCloseAt,
      loggedInUserId: userId2,
    }),
  ).rejects.toThrow("Record to update not found");
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  await updateAssignmentCloseAt({
    contentId: contentId,
    closeAt: newCloseAt,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(newCloseAt.toJSDate());

  await expect(
    closeAssignmentWithCode({ contentId: contentId, loggedInUserId: userId2 }),
  ).rejects.toThrow("Record to update not found");

  await closeAssignmentWithCode({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
});

test("cannot assign a descendant of an assignment", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { contentId: sequenceId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });
  await updateContent({
    contentId: sequenceId,
    name: "A problem set",
    loggedInUserId: ownerId,
  });

  const { contentId: selectId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: sequenceId,
  });
  await updateContent({
    contentId: selectId,
    name: "A question bank",
    loggedInUserId: ownerId,
  });

  const { contentId: docId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: selectId,
  });
  await updateContent({
    contentId: docId,
    name: "Question",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  await assignActivity({ contentId: sequenceId, loggedInUserId: ownerId });

  // cannot assign the descendants of the assignment sequenceId
  await expect(
    assignActivity({ contentId: docId, loggedInUserId: ownerId }),
  ).rejects.toThrow(
    "Activity is already assigned as a part of another activity",
  );

  await expect(
    assignActivity({ contentId: selectId, loggedInUserId: ownerId }),
  ).rejects.toThrow(
    "Activity is already assigned as a part of another activity",
  );

  let content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");

  // if unassign sequence, then can assign select
  await unassignActivity({ contentId: sequenceId, loggedInUserId: ownerId });

  content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Unassigned");

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Unassigned");

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Unassigned");

  await assignActivity({ contentId: selectId, loggedInUserId: ownerId });

  content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Unassigned");

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");
});

test("cannot assign an ancestor of an assignment", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { contentId: sequenceId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });
  await updateContent({
    contentId: sequenceId,
    name: "A problem set",
    loggedInUserId: ownerId,
  });

  const { contentId: selectId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: sequenceId,
  });
  await updateContent({
    contentId: selectId,
    name: "A question bank",
    loggedInUserId: ownerId,
  });

  const { contentId: docId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: selectId,
  });
  await updateContent({
    contentId: docId,
    name: "Question",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  await assignActivity({ contentId: docId, loggedInUserId: ownerId });

  // cannot assign the descendants of the assignment sequenceId
  await expect(
    assignActivity({ contentId: sequenceId, loggedInUserId: ownerId }),
  ).rejects.toThrow(
    "Cannot assign content with a descendant that is already assigned",
  );

  await expect(
    assignActivity({ contentId: selectId, loggedInUserId: ownerId }),
  ).rejects.toThrow(
    "Cannot assign content with a descendant that is already assigned",
  );

  // if unassign document, then can assign sequence

  await unassignActivity({ contentId: docId, loggedInUserId: ownerId });

  await assignActivity({ contentId: sequenceId, loggedInUserId: ownerId });
});

test("cannot change closeAt, maxAttempts, mode, individualizeByStudent of a non-root assignment activity", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { contentId: sequenceId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });
  await updateContent({
    contentId: sequenceId,
    name: "A problem set",
    loggedInUserId: ownerId,
  });

  const { contentId: selectId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: sequenceId,
  });
  await updateContent({
    contentId: selectId,
    name: "A question bank",
    loggedInUserId: ownerId,
  });

  const { contentId: docId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: selectId,
  });
  await updateContent({
    contentId: docId,
    name: "Question",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  await assignActivity({ contentId: sequenceId, loggedInUserId: ownerId });

  let content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");
  expect(content.assignmentInfo?.codeValidUntil).eq(null);

  const closeAt = DateTime.now().plus({ days: 1 });
  const maxAttempts = 2;
  const mode: AssignmentMode = "summative";
  const individualizeByStudent = true;

  await expect(
    updateAssignmentCloseAt({
      contentId: docId,
      loggedInUserId: ownerId,
      closeAt,
    }),
  ).rejects.toThrow("not found");

  await expect(
    updateAssignmentMaxAttempts({
      contentId: docId,
      loggedInUserId: ownerId,
      maxAttempts,
    }),
  ).rejects.toThrow(
    "Activity is already assigned as a part of another activity",
  );

  await expect(
    updateAssignmentSettings({
      contentId: docId,
      loggedInUserId: ownerId,
      mode,
    }),
  ).rejects.toThrow(
    "Activity is already assigned as a part of another activity",
  );

  await expect(
    updateAssignmentSettings({
      contentId: docId,
      loggedInUserId: ownerId,
      individualizeByStudent,
    }),
  ).rejects.toThrow(
    "Activity is already assigned as a part of another activity",
  );

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");
  expect(content.assignmentInfo?.codeValidUntil).eq(null);
  expect(content.assignmentInfo?.maxAttempts).eq(1);
  expect(content.assignmentInfo?.mode).eq("formative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(false);

  await expect(
    updateAssignmentCloseAt({
      contentId: selectId,
      loggedInUserId: ownerId,
      closeAt,
    }),
  ).rejects.toThrow("not found");

  await expect(
    updateAssignmentMaxAttempts({
      contentId: selectId,
      loggedInUserId: ownerId,
      maxAttempts,
    }),
  ).rejects.toThrow(
    "Activity is already assigned as a part of another activity",
  );

  await expect(
    updateAssignmentSettings({
      contentId: selectId,
      loggedInUserId: ownerId,
      mode,
    }),
  ).rejects.toThrow(
    "Activity is already assigned as a part of another activity",
  );

  await expect(
    updateAssignmentSettings({
      contentId: selectId,
      loggedInUserId: ownerId,
      individualizeByStudent,
    }),
  ).rejects.toThrow(
    "Activity is already assigned as a part of another activity",
  );

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");
  expect(content.assignmentInfo?.codeValidUntil).eq(null);
  expect(content.assignmentInfo?.maxAttempts).eq(1);
  expect(content.assignmentInfo?.mode).eq("formative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(false);

  await expect(
    updateAssignmentSettings({
      contentId: sequenceId,
      loggedInUserId: ownerId,
      mode,
    }),
  ).rejects.toThrow(
    "Cannot update assignment mode or individualizeByStudent of assigned content",
  );

  await expect(
    updateAssignmentSettings({
      contentId: sequenceId,
      loggedInUserId: ownerId,
      individualizeByStudent,
    }),
  ).rejects.toThrow(
    "Cannot update assignment mode or individualizeByStudent of assigned content",
  );

  await updateAssignmentCloseAt({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    closeAt,
  });

  await updateAssignmentMaxAttempts({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    maxAttempts,
  });

  content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Open");
  expect(content.assignmentInfo?.codeValidUntil).eqls(closeAt.toJSDate());
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.mode).eq("formative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(false);

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Open");
  expect(content.assignmentInfo?.codeValidUntil).eqls(closeAt.toJSDate());
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.mode).eq("formative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(false);

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Open");
  expect(content.assignmentInfo?.codeValidUntil).eqls(closeAt.toJSDate());
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.mode).eq("formative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(false);

  // When unassign assignment, then can change mode and individualize by student
  await unassignActivity({ contentId: sequenceId, loggedInUserId: ownerId });

  await updateAssignmentSettings({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    mode,
  });
  await updateAssignmentSettings({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    individualizeByStudent,
  });

  content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.mode).eq("summative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(true);

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.mode).eq("summative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(true);
  expect(content.assignmentInfo?.otherRoot?.rootContentId).eqls(sequenceId);

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.mode).eq("summative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(true);
  expect(content.assignmentInfo?.otherRoot?.rootContentId).eqls(sequenceId);

  // can now change maxAttempt, mode, and individualizeByStudent of descendants, and they get independent values
  await updateAssignmentSettings({
    contentId: selectId,
    loggedInUserId: ownerId,
    mode: "formative",
  });
  await updateAssignmentSettings({
    contentId: selectId,
    loggedInUserId: ownerId,
    individualizeByStudent: false,
  });

  content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.mode).eq("summative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(true);
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.otherRoot?.rootContentId).eq(undefined);

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.mode).eq("formative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(false);
  expect(content.assignmentInfo?.maxAttempts).eq(1); // max attempts reverted to default since disconnected
  expect(content.assignmentInfo?.otherRoot?.rootContentId).eq(undefined);

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.mode).eq("summative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(true);
  expect(content.assignmentInfo?.otherRoot?.rootContentId).eqls(sequenceId);

  await updateAssignmentMaxAttempts({
    contentId: docId,
    loggedInUserId: ownerId,
    maxAttempts: 5,
  });

  content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.mode).eq("summative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(true);
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.otherRoot?.rootContentId).eq(undefined);

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.mode).eq("formative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(false);
  expect(content.assignmentInfo?.otherRoot?.rootContentId).eq(undefined);
  expect(content.assignmentInfo?.maxAttempts).eq(1);

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.mode).eq("formative"); // mode reverted to default since disconnected
  expect(content.assignmentInfo?.individualizeByStudent).eq(false); // individualizeByStudent reverted to default since disconnected
  expect(content.assignmentInfo?.maxAttempts).eq(5);
  expect(content.assignmentInfo?.otherRoot?.rootContentId).eq(undefined);
});

test("assignment settings of descendants synchronize when ancestor assigned", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { contentId: sequenceId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });
  await updateContent({
    contentId: sequenceId,
    name: "A problem set",
    loggedInUserId: ownerId,
  });

  const { contentId: selectId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: sequenceId,
  });
  await updateContent({
    contentId: selectId,
    name: "A question bank",
    loggedInUserId: ownerId,
  });

  const { contentId: docId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: selectId,
  });
  await updateContent({
    contentId: docId,
    name: "Question",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  let content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo).eq(undefined);
  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo).eq(undefined);
  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo).eq(undefined);

  await updateAssignmentMaxAttempts({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    maxAttempts: 2,
  });
  await updateAssignmentSettings({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    mode: "summative",
  });

  // update in reverse order for select to make sure can change mode when start with no assignment record
  await updateAssignmentSettings({
    contentId: selectId,
    loggedInUserId: ownerId,
    mode: "summative",
  });
  await updateAssignmentMaxAttempts({
    contentId: selectId,
    loggedInUserId: ownerId,
    maxAttempts: 3,
  });

  await updateAssignmentMaxAttempts({
    contentId: docId,
    loggedInUserId: ownerId,
    maxAttempts: 4,
  });
  await updateAssignmentSettings({
    contentId: docId,
    loggedInUserId: ownerId,
    mode: "formative",
  });

  content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Unassigned");
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.mode).eq("summative");
  expect(content.assignmentInfo?.otherRoot).eq(undefined);

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Unassigned");
  expect(content.assignmentInfo?.maxAttempts).eq(3);
  expect(content.assignmentInfo?.mode).eq("summative");
  expect(content.assignmentInfo?.otherRoot).eq(undefined);

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Unassigned");
  expect(content.assignmentInfo?.maxAttempts).eq(4);
  expect(content.assignmentInfo?.mode).eq("formative");
  expect(content.assignmentInfo?.otherRoot).eq(undefined);

  // when assign sequence, all settings synchronize
  await assignActivity({ contentId: sequenceId, loggedInUserId: ownerId });

  content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.mode).eq("summative");
  expect(content.assignmentInfo?.otherRoot).eq(undefined);

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.mode).eq("summative");
  expect(content.assignmentInfo?.otherRoot?.rootContentId).eqls(sequenceId);

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.mode).eq("summative");
  expect(content.assignmentInfo?.otherRoot?.rootContentId).eqls(sequenceId);
});

function scoreFromStudentAttempts(
  attempts: {
    attemptNumber: number;
    score: number;
    itemScores: ItemScores[];
  }[],
) {
  const topScore = attempts.reduce((a, c) => Math.max(a, c.score), 0);
  const maxIdx = attempts.map((a) => a.score).lastIndexOf(topScore);
  const lastIdx = attempts.length - 1;
  return {
    score: topScore,
    bestAttemptNumber: maxIdx + 1,
    itemScores: attempts[maxIdx].itemScores,
    latestAttempt: attempts[lastIdx],
  };
}

async function testSingleDocResponses({
  contentId,
  ownerId,
  dataByStudent,
  classCode,
  source,
}: {
  contentId: Uint8Array;
  ownerId: Uint8Array;
  dataByStudent: {
    user: UserInfo;
    attempts: {
      attemptNumber: number;
      score: number;
      itemScores: ItemScores[];
    }[];
    lastState: {
      state: string;
      variant: number;
    };
  }[];
  classCode: string;
  source: {
    doenetML: string;
    name: string;
    doenetmlVersion: { fullVersion: string };
  };
}) {
  const assignmentScores = await getScoresOfAllStudents({
    contentId: contentId,
    loggedInUserId: ownerId,
  });

  const expectedScoreSummary = dataByStudent.map((data) => {
    return {
      ...scoreFromStudentAttempts(data.attempts),
      user: data.user,
    };
  });

  expect(assignmentScores.scores).eqls(expectedScoreSummary);

  const overviewData = await getAssignmentResponseOverview({
    contentId,
    loggedInUserId: ownerId,
  });

  expect(overviewData.scoreSummary.scores).eqls(expectedScoreSummary);

  for (const studentData of dataByStudent) {
    const scoreFromAttempts = scoreFromStudentAttempts(studentData.attempts);

    const dataFromCode = await getAssignmentViewerDataFromCode({
      code: classCode,
      loggedInUserId: studentData.user.userId,
    });
    expect(dataFromCode.assignmentFound).eq(true);
    expect(dataFromCode.scoreData).eqls({
      calculatedScore: true,
      ...scoreFromAttempts,
    });

    const assignmentResponseStudentData = await getAssignmentResponseStudent({
      contentId,
      loggedInUserId: ownerId,
      studentUserId: studentData.user.userId,
      shuffledOrder: false,
    });

    expect(assignmentResponseStudentData.overallScores).eqls({
      calculatedScore: true,
      ...scoreFromAttempts,
    });

    if (assignmentResponseStudentData.singleItemAttempt) {
      throw Error("Shouldn't happen");
    }

    if (assignmentResponseStudentData.allAttemptScores.byItem) {
      throw Error("Shouldn't happen");
    }

    expect(assignmentResponseStudentData.allAttemptScores.attemptScores).eqls(
      studentData.attempts.map((attempt) => ({
        attemptNumber: attempt.attemptNumber,
        score: attempt.score,
        items: attempt.itemScores,
      })),
    );

    const assignmentItemResponseStudentData =
      await getAssignmentResponseStudent({
        contentId,
        loggedInUserId: ownerId,
        studentUserId: studentData.user.userId,
        shuffledOrder: false,
        attemptNumber: studentData.attempts.length,
      });

    if (!assignmentItemResponseStudentData.singleItemAttempt) {
      throw Error("Shouldn't happen");
    }

    expect(assignmentItemResponseStudentData.itemAttemptState).eqls({
      docId: contentId,
      score: scoreFromAttempts.score,
      state: studentData.lastState.state,
      variant: studentData.lastState.variant,
    });

    expect(assignmentItemResponseStudentData.content).toMatchObject({
      contentId,
      name: source.name,
      doenetML: source.doenetML,
      doenetmlVersion: source.doenetmlVersion,
    });
  }
}

test("get assignment data from anonymous users", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId,
    name: "Activity 1",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  await updateAssignmentSettings({
    contentId,
    loggedInUserId: ownerId,
    mode: "summative",
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    loggedInUserId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });
  const userData1 = {
    userId: newUser1.userId,
    email: newUser1.email,
    firstNames: newUser1.firstNames,
    lastNames: newUser1.lastNames,
  };

  await createNewAttempt({
    contentId: contentId,
    loggedInUserId: newUser1.userId,
    variant: 1,
    code: classCode,
    state: null,
  });

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  await testSingleDocResponses({
    contentId,
    ownerId,
    dataByStudent: [
      {
        user: userData1,
        attempts: [
          {
            attemptNumber: 1,
            score: 0.5,
            itemScores: [],
          },
        ],
        lastState: {
          state: "document state 1",
          variant: 1,
        },
      },
    ],
    classCode,
    source: {
      name: "Activity 1",
      doenetML: "Some content",
      doenetmlVersion: { fullVersion: "0.7.0-alpha37" },
    },
  });

  // new lower score decreases score
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.2,
    state: "document state 2",
  });

  await testSingleDocResponses({
    contentId,
    ownerId,
    dataByStudent: [
      {
        user: userData1,
        attempts: [
          {
            attemptNumber: 1,
            score: 0.2,
            itemScores: [],
          },
        ],
        lastState: {
          state: "document state 2",
          variant: 1,
        },
      },
    ],
    classCode,
    source: {
      name: "Activity 1",
      doenetML: "Some content",
      doenetmlVersion: { fullVersion: "0.7.0-alpha37" },
    },
  });

  // new higher score used
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.7,
    state: "document state 3",
  });

  await testSingleDocResponses({
    contentId,
    ownerId,
    dataByStudent: [
      {
        user: userData1,
        attempts: [
          {
            attemptNumber: 1,
            score: 0.7,
            itemScores: [],
          },
        ],
        lastState: {
          state: "document state 3",
          variant: 1,
        },
      },
    ],
    classCode,
    source: {
      name: "Activity 1",
      doenetML: "Some content",
      doenetmlVersion: { fullVersion: "0.7.0-alpha37" },
    },
  });

  // second user opens assignment
  let newUser2 = await createTestAnonymousUser();
  newUser2 = await updateUser({
    loggedInUserId: newUser2.userId,
    firstNames: "Arya",
    lastNames: "Abbas",
  });
  const userData2 = {
    userId: newUser2.userId,
    email: newUser2.email,
    firstNames: newUser2.firstNames,
    lastNames: newUser2.lastNames,
  };

  // save state for second user
  await createNewAttempt({
    contentId: contentId,
    loggedInUserId: newUser2.userId,
    variant: 1,
    code: classCode,
    state: null,
  });

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser2.userId,
    attemptNumber: 1,
    score: 0.3,
    state: "document state 4",
  });

  // second user's score shows up first due to alphabetical sorting

  await testSingleDocResponses({
    contentId,
    ownerId,
    dataByStudent: [
      {
        user: userData2,
        attempts: [
          {
            attemptNumber: 1,
            score: 0.3,
            itemScores: [],
          },
        ],
        lastState: {
          state: "document state 4",
          variant: 1,
        },
      },
      {
        user: userData1,
        attempts: [
          {
            attemptNumber: 1,
            score: 0.7,
            itemScores: [],
          },
        ],
        lastState: {
          state: "document state 3",
          variant: 1,
        },
      },
    ],
    classCode,
    source: {
      name: "Activity 1",
      doenetML: "Some content",
      doenetmlVersion: { fullVersion: "0.7.0-alpha37" },
    },
  });
});

test.todo("get assignment data from anonymous users, problem set");

test("can't get assignment data if other user, but student can get their own data", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const otherUser = await createTestUser();
  const otherUserId = otherUser.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    loggedInUserId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });

  await createNewAttempt({
    contentId: contentId,
    loggedInUserId: newUser1.userId,
    variant: 1,
    code: classCode,
    state: null,
  });

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  // assignment owner can get score data
  expect(
    (
      await getScoresOfAllStudents({
        contentId: contentId,
        loggedInUserId: ownerId,
      })
    ).scores.length,
  ).eq(1);

  // other user cannot get score data
  await expect(
    getScoresOfAllStudents({
      contentId: contentId,
      loggedInUserId: otherUserId,
    }),
  ).rejects.toThrow("not found");

  // student cannot get score data on all of assignment
  await expect(
    getScoresOfAllStudents({
      contentId: contentId,
      loggedInUserId: newUser1.userId,
    }),
  ).rejects.toThrow("not found");

  // assignment owner can get data on student
  const studentData = await getAssignmentResponseStudent({
    contentId: contentId,
    loggedInUserId: ownerId,
    studentUserId: newUser1.userId,
    shuffledOrder: false,
  });

  // another user cannot get data on student
  await expect(
    getAssignmentResponseStudent({
      contentId: contentId,
      loggedInUserId: otherUserId,
      studentUserId: newUser1.userId,
      shuffledOrder: false,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  // student can get own data, except don't get allStudents
  studentData.allStudents = [];
  expect(
    await getAssignmentResponseStudent({
      contentId: contentId,
      loggedInUserId: newUser1.userId,
      shuffledOrder: false,
    }),
  ).eqls(studentData);
});

test("can't unassign if have data", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    loggedInUserId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });

  await createNewAttempt({
    contentId: contentId,
    loggedInUserId: newUser1.userId,
    variant: 1,
    code: classCode,
    state: null,
  });

  await getScoresOfAllStudents({
    contentId: contentId,
    loggedInUserId: ownerId,
  });

  await getAssignmentResponseStudent({
    contentId: contentId,
    loggedInUserId: ownerId,
    studentUserId: newUser1.userId,
    shuffledOrder: false,
  });

  expect(
    await unassignActivity({ contentId: contentId, loggedInUserId: ownerId }),
  ).eqls({ success: false });
});

test("list assigned and get assigned scores get student assignments and scores", async () => {
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  let assignmentList = await listUserAssigned({ loggedInUserId: user1Id });
  expect(assignmentList.assignments).eqls([]);
  expect(assignmentList.user.userId).eqls(user1Id);

  let studentData = await getAssignedScores({ loggedInUserId: user1Id });
  expect(studentData.orderedActivityScores).eqls([]);
  expect(studentData.userData.userId).eqls(user1Id);

  const { contentId: contentId1 } = await createContent({
    loggedInUserId: user1Id,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId1,
    name: "Activity 1",
    loggedInUserId: user1Id,
  });
  await assignActivity({ contentId: contentId1, loggedInUserId: user1Id });

  assignmentList = await listUserAssigned({ loggedInUserId: user1Id });
  expect(assignmentList.assignments).eqls([]);
  studentData = await getAssignedScores({ loggedInUserId: user1Id });
  expect(studentData.orderedActivityScores).eqls([]);

  const { contentId: contentId2 } = await createContent({
    loggedInUserId: user2Id,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId2,
    name: "Activity 2",
    loggedInUserId: user2Id,
  });
  await assignActivity({ contentId: contentId2, loggedInUserId: user2Id });

  assignmentList = await listUserAssigned({ loggedInUserId: user1Id });
  expect(assignmentList.assignments).eqls([]);
  studentData = await getAssignedScores({ loggedInUserId: user1Id });
  expect(studentData.orderedActivityScores).eqls([]);

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId2,
    closeAt: closeAt,
    loggedInUserId: user2Id,
  });

  await createNewAttempt({
    contentId: contentId2,
    code: classCode,
    variant: 1,
    state: "document state 1",
    loggedInUserId: user1Id,
  });

  // recording score for user1 on assignment2 adds it to user1's assignment list
  await saveScoreAndState({
    contentId: contentId2,
    code: classCode,
    loggedInUserId: user1Id,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  assignmentList = await listUserAssigned({ loggedInUserId: user1Id });
  expect(assignmentList.assignments).toMatchObject([
    {
      contentId: contentId2,
      ownerId: user2Id,
    },
  ]);
  studentData = await getAssignedScores({ loggedInUserId: user1Id });
  expect(studentData.orderedActivityScores).eqls([
    { contentId: contentId2, activityName: "Activity 2", score: 0.5 },
  ]);

  // cannot unassign
  expect(
    await unassignActivity({ contentId: contentId2, loggedInUserId: user2Id }),
  ).eqls({ success: false });
});

test("get all assignment data from anonymous user", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId,
    name: "Activity 1",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    loggedInUserId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });
  const newUser1Info = convertUUID({
    userId: newUser1.userId,
    email: newUser1.email,
    firstNames: newUser1.firstNames,
    lastNames: newUser1.lastNames,
  });

  await createNewAttempt({
    contentId,
    code: classCode,
    variant: 1,
    state: "document state 1",
    loggedInUserId: newUser1.userId,
  });

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  let userWithScores = convertUUID(
    await getStudentAssignmentScores({
      studentUserId: newUser1.userId,
      loggedInUserId: ownerId,
      parentId: null,
    }),
  );

  expect(userWithScores).eqls({
    studentData: newUser1Info,
    orderedActivityScores: [
      {
        contentId: fromUUID(contentId),
        score: 0.5,
        activityName: "Activity 1",
      },
    ],
    folder: null,
  });

  // new lower score used
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.2,
    state: "document state 2",
  });

  userWithScores = convertUUID(
    await getStudentAssignmentScores({
      studentUserId: newUser1.userId,
      loggedInUserId: ownerId,
      parentId: null,
    }),
  );

  expect(userWithScores).eqls({
    studentData: newUser1Info,
    orderedActivityScores: [
      {
        contentId: fromUUID(contentId),
        score: 0.2,
        activityName: "Activity 1",
      },
    ],
    folder: null,
  });

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.7,
    state: "document state 3",
  });

  userWithScores = convertUUID(
    await getStudentAssignmentScores({
      studentUserId: newUser1.userId,
      loggedInUserId: ownerId,
      parentId: null,
    }),
  );

  expect(userWithScores).eqls({
    studentData: newUser1Info,
    orderedActivityScores: [
      {
        contentId: fromUUID(contentId),
        score: 0.7,
        activityName: "Activity 1",
      },
    ],
    folder: null,
  });
});

test("get assignments folder structure", { timeout: 100000 }, async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  // Folder structure
  // Base folder
  // - Folder 1
  //   - Activity 1a
  //   - Activity 1b (unassigned)
  //   - Folder 1c
  //     - Activity 1c1
  //     - Folder 1c2
  //       - Activity 1c2a
  //       - Activity 1c2b
  //     - Activity 1c3 (unassigned)
  //   - Folder 1d
  //   - Activity 1e
  // - Activity 2
  // - Folder 3
  //   - Activity 3a (unassigned)
  //   - Activity 3b
  //   - Activity 3c (deleted)
  // - Activity 4 (deleted)
  // Activity null (unassigned)
  // Activity gone (deleted)
  // Activity root

  const { contentId: baseFolderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  const { contentId: folder3Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: baseFolderId,
  });

  // create folder 1 after folder 3 and move to make sure it is using sortIndex
  // and not the order content was created
  const { contentId: folder1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: baseFolderId,
  });
  await moveContent({
    contentId: folder1Id,
    parentId: baseFolderId,
    desiredPosition: 0,
    loggedInUserId: ownerId,
  });

  const { contentId: folder1cId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: folder1Id,
  });
  const { contentId: folder1dId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: folder1Id,
  });

  const { contentId: activity2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: baseFolderId,
  });
  await updateContent({
    contentId: activity2Id,
    name: "Activity 2",
    loggedInUserId: ownerId,
  });
  await moveContent({
    contentId: activity2Id,
    parentId: baseFolderId,
    desiredPosition: 1,
    loggedInUserId: ownerId,
  });

  // create activity 1a in wrong folder initially
  const { contentId: activity1aId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder3Id,
  });
  await updateContent({
    contentId: activity1aId,
    name: "Activity 1a",
    loggedInUserId: ownerId,
  });
  const { contentId: activity1eId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder1Id,
  });
  await updateContent({
    contentId: activity1eId,
    name: "Activity 1e",
    loggedInUserId: ownerId,
  });
  // move activity 1a to right places
  await moveContent({
    contentId: activity1aId,
    parentId: folder1Id,
    desiredPosition: 0,
    loggedInUserId: ownerId,
  });

  const { contentId: activity1c1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder1cId,
  });
  await updateContent({
    contentId: activity1c1Id,
    name: "Activity 1c1",
    loggedInUserId: ownerId,
  });
  await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder1cId,
  });

  // create folder 1c2 in wrong folder initially
  const { contentId: folder1c2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: baseFolderId,
  });
  const { contentId: activity1c2aId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder1c2Id,
  });
  await updateContent({
    contentId: activity1c2aId,
    name: "Activity 1c2a",
    loggedInUserId: ownerId,
  });
  const { contentId: activity1c2bId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder1c2Id,
  });
  await updateContent({
    contentId: activity1c2bId,
    name: "Activity 1c2b",
    loggedInUserId: ownerId,
  });

  // after creating its content move folder 1c2 into the right place
  await moveContent({
    contentId: folder1c2Id,
    parentId: folder1cId,
    desiredPosition: 1,
    loggedInUserId: ownerId,
  });

  // create activity 1b in wrong place then move it
  const { contentId: activity1b } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder1c2Id,
  });
  await updateContent({
    contentId: activity1b,
    name: "Activity 1b",
    loggedInUserId: ownerId,
  });
  await moveContent({
    contentId: activity1b,
    parentId: folder1Id,
    desiredPosition: 1,
    loggedInUserId: ownerId,
  });

  // move activity 1e to end of folder 1
  await moveContent({
    contentId: activity1eId,
    parentId: folder1Id,
    desiredPosition: 100,
    loggedInUserId: ownerId,
  });

  await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder3Id,
  });
  const { contentId: activity3bId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder3Id,
  });
  await updateContent({
    contentId: activity3bId,
    name: "Activity 3b",
    loggedInUserId: ownerId,
  });

  await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  // add some deleted activities
  const { contentId: activityGoneId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await deleteContent({ contentId: activityGoneId, loggedInUserId: ownerId });
  const { contentId: activity4Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: baseFolderId,
  });
  await deleteContent({ contentId: activity4Id, loggedInUserId: ownerId });
  const { contentId: activity3cId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder3Id,
  });
  await deleteContent({ contentId: activity3cId, loggedInUserId: ownerId });

  // one activity at root level
  const { contentId: activityRootId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: activityRootId,
    name: "Activity root",
    loggedInUserId: ownerId,
  });

  const closeAt = DateTime.now().plus({ day: 1 });
  const { classCode: classCode1a } = await openAssignmentWithCode({
    contentId: activity1aId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  const { classCode: classCode1c1 } = await openAssignmentWithCode({
    contentId: activity1c1Id,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  const { classCode: classCode1c2a } = await openAssignmentWithCode({
    contentId: activity1c2aId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  const { classCode: classCode1c2b } = await openAssignmentWithCode({
    contentId: activity1c2bId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  const { classCode: classCode1e } = await openAssignmentWithCode({
    contentId: activity1eId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  const { classCode: classCode2 } = await openAssignmentWithCode({
    contentId: activity2Id,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  const { classCode: classCode3b } = await openAssignmentWithCode({
    contentId: activity3bId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  const { classCode: classCodeRoot } = await openAssignmentWithCode({
    contentId: activityRootId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let newUser = await createTestAnonymousUser();
  newUser = await updateUser({
    loggedInUserId: newUser.userId,
    firstNames: "Arya",
    lastNames: "Abbas",
  });
  const newUserId = newUser.userId;
  const userInfo = convertUUID({
    userId: newUserId,
    email: newUser.email,
    firstNames: newUser.firstNames,
    lastNames: newUser.lastNames,
  });

  await createNewAttempt({
    contentId: activity1aId,
    code: classCode1a,
    loggedInUserId: newUserId,
    state: "document state 1a",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: activity1aId,
    code: classCode1a,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.11,
    state: "document state 1a",
  });
  await createNewAttempt({
    contentId: activity1c1Id,
    code: classCode1c1,
    loggedInUserId: newUserId,
    state: "document state 1c1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: activity1c1Id,
    code: classCode1c1,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.131,
    state: "document state 1c1",
  });
  await createNewAttempt({
    contentId: activity1c2aId,
    code: classCode1c2a,
    loggedInUserId: newUserId,
    state: "document state 1c2a",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: activity1c2aId,
    code: classCode1c2a,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.1321,
    state: "document state 1c2a",
  });
  await createNewAttempt({
    contentId: activity1c2bId,
    code: classCode1c2b,
    loggedInUserId: newUserId,
    state: "document state 1c2b",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: activity1c2bId,
    code: classCode1c2b,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.1322,
    state: "document state 1c2b",
  });
  await createNewAttempt({
    contentId: activity1eId,
    code: classCode1e,
    loggedInUserId: newUserId,
    state: "document state 1e",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: activity1eId,
    code: classCode1e,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.15,
    state: "document state 1e",
  });
  await createNewAttempt({
    contentId: activity2Id,
    code: classCode2,
    loggedInUserId: newUserId,
    state: "document state 2",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: activity2Id,
    code: classCode2,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.2,
    state: "document state 2",
  });
  await createNewAttempt({
    contentId: activity3bId,
    code: classCode3b,
    loggedInUserId: newUserId,
    state: "document state 3b",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: activity3bId,
    code: classCode3b,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.32,
    state: "document state 3b",
  });
  await createNewAttempt({
    contentId: activityRootId,
    code: classCodeRoot,
    loggedInUserId: newUserId,
    state: "document state Root",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: activityRootId,
    code: classCodeRoot,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 1.0,
    state: "document state Root",
  });

  const desiredFolder3 = [
    { contentId: fromUUID(activity3bId), name: "Activity 3b" },
  ];
  const desiredFolder3Scores = [
    {
      contentId: fromUUID(activity3bId),
      score: 0.32,
      user: userInfo,
    },
  ];
  const desiredFolder1c2 = [
    { contentId: fromUUID(activity1c2aId), name: "Activity 1c2a" },
    { contentId: fromUUID(activity1c2bId), name: "Activity 1c2b" },
  ];
  const desiredFolder1c2Scores = [
    {
      contentId: fromUUID(activity1c2aId),
      score: 0.1321,
      user: userInfo,
    },
    {
      contentId: fromUUID(activity1c2bId),
      score: 0.1322,
      user: userInfo,
    },
  ];

  const desiredFolder1c = [
    { contentId: fromUUID(activity1c1Id), name: "Activity 1c1" },
    ...desiredFolder1c2,
  ];
  const desiredFolder1cScores = [
    {
      contentId: fromUUID(activity1c1Id),
      score: 0.131,
      user: userInfo,
    },
    ...desiredFolder1c2Scores,
  ];

  const desiredFolder1 = [
    { contentId: fromUUID(activity1aId), name: "Activity 1a" },
    ...desiredFolder1c,
    { contentId: fromUUID(activity1eId), name: "Activity 1e" },
  ];
  const desiredFolder1Scores = [
    {
      contentId: fromUUID(activity1aId),
      score: 0.11,
      user: userInfo,
    },
    ...desiredFolder1cScores,
    {
      contentId: fromUUID(activity1eId),
      score: 0.15,
      user: userInfo,
    },
  ];

  const desiredBaseFolder = [
    ...desiredFolder1,
    { contentId: fromUUID(activity2Id), name: "Activity 2" },
    ...desiredFolder3,
  ];
  const desiredBaseFolderScores = [
    ...desiredFolder1Scores,
    {
      contentId: fromUUID(activity2Id),
      score: 0.2,
      user: userInfo,
    },
    ...desiredFolder3Scores,
  ];

  const desiredNullFolder = [
    ...desiredBaseFolder,
    { contentId: fromUUID(activityRootId), name: "Activity root" },
  ];
  const desiredNullFolderScores = [
    ...desiredBaseFolderScores,
    {
      contentId: fromUUID(activityRootId),
      score: 1.0,
      user: userInfo,
    },
  ];

  let scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });
  expect(convertUUID(scoreData.orderedActivities)).eqls(desiredNullFolder);
  expect(
    convertUUID(
      scoreData.assignmentScores
        .flatMap((a) =>
          a.userScores.map((us) => ({
            contentId: a.contentId,
            score: us.score,
            user: us.user,
          })),
        )
        .sort((a, b) => a.score - b.score),
    ),
  ).eqls(desiredNullFolderScores);
  expect(scoreData.folder).eqls(null);

  let studentData = await getStudentAssignmentScores({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: null,
  });
  expect(
    convertUUID(
      studentData.orderedActivityScores.map((a) => ({
        contentId: a.contentId,
        score: a.score,
        user: userInfo,
      })),
    ),
  ).eqls(desiredNullFolderScores);
  expect(studentData.folder).eqls(null);

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: baseFolderId,
  });
  expect(convertUUID(scoreData.orderedActivities)).eqls(desiredBaseFolder);
  expect(
    convertUUID(
      scoreData.assignmentScores
        .flatMap((a) =>
          a.userScores.map((us) => ({
            contentId: a.contentId,
            score: us.score,
            user: us.user,
          })),
        )
        .sort((a, b) => a.score - b.score),
    ),
  ).eqls(desiredBaseFolderScores);
  expect(convertUUID(scoreData.folder?.contentId)).eqls(fromUUID(baseFolderId));

  studentData = await getStudentAssignmentScores({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: baseFolderId,
  });
  expect(
    convertUUID(
      studentData.orderedActivityScores.map((a) => ({
        contentId: a.contentId,
        score: a.score,
        user: userInfo,
      })),
    ),
  ).eqls(desiredBaseFolderScores);
  expect(convertUUID(studentData.folder?.contentId)).eqls(
    fromUUID(baseFolderId),
  );

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder1Id,
  });
  expect(convertUUID(scoreData.orderedActivities)).eqls(desiredFolder1);
  expect(
    convertUUID(
      scoreData.assignmentScores
        .flatMap((a) =>
          a.userScores.map((us) => ({
            contentId: a.contentId,
            score: us.score,
            user: us.user,
          })),
        )
        .sort((a, b) => a.score - b.score),
    ),
  ).eqls(desiredFolder1Scores);
  expect(convertUUID(scoreData.folder?.contentId)).eqls(fromUUID(folder1Id));

  studentData = await getStudentAssignmentScores({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: folder1Id,
  });
  expect(
    convertUUID(
      studentData.orderedActivityScores.map((a) => ({
        contentId: a.contentId,
        score: a.score,
        user: userInfo,
      })),
    ),
  ).eqls(desiredFolder1Scores);
  expect(convertUUID(studentData.folder?.contentId)).eqls(fromUUID(folder1Id));

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder3Id,
  });
  expect(convertUUID(scoreData.orderedActivities)).eqls(desiredFolder3);
  expect(
    convertUUID(
      scoreData.assignmentScores
        .flatMap((a) =>
          a.userScores.map((us) => ({
            contentId: a.contentId,
            score: us.score,
            user: us.user,
          })),
        )
        .sort((a, b) => a.score - b.score),
    ),
  ).eqls(desiredFolder3Scores);
  expect(convertUUID(scoreData.folder?.contentId)).eqls(fromUUID(folder3Id));

  studentData = await getStudentAssignmentScores({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: folder3Id,
  });
  expect(
    convertUUID(
      studentData.orderedActivityScores.map((a) => ({
        contentId: a.contentId,
        score: a.score,
        user: userInfo,
      })),
    ),
  ).eqls(desiredFolder3Scores);
  expect(convertUUID(studentData.folder?.contentId)).eqls(fromUUID(folder3Id));

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder1cId,
  });
  expect(convertUUID(scoreData.orderedActivities)).eqls(desiredFolder1c);
  expect(
    convertUUID(
      scoreData.assignmentScores
        .flatMap((a) =>
          a.userScores.map((us) => ({
            contentId: a.contentId,
            score: us.score,
            user: us.user,
          })),
        )
        .sort((a, b) => a.score - b.score),
    ),
  ).eqls(desiredFolder1cScores);
  expect(convertUUID(scoreData.folder?.contentId)).eqls(fromUUID(folder1cId));

  studentData = await getStudentAssignmentScores({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: folder1cId,
  });
  expect(
    convertUUID(
      studentData.orderedActivityScores.map((a) => ({
        contentId: a.contentId,
        score: a.score,
        user: userInfo,
      })),
    ),
  ).eqls(desiredFolder1cScores);
  expect(convertUUID(studentData.folder?.contentId)).eqls(fromUUID(folder1cId));

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder1dId,
  });
  expect(scoreData.orderedActivities).eqls([]);
  expect(scoreData.assignmentScores).eqls([]);
  expect(convertUUID(scoreData.folder?.contentId)).eqls(fromUUID(folder1dId));

  studentData = await getStudentAssignmentScores({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: folder1dId,
  });
  expect(studentData.orderedActivityScores).eqls([]);
  expect(convertUUID(studentData.folder?.contentId)).eqls(fromUUID(folder1dId));
});

test("get data for user's assignments", { timeout: 30000 }, async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId,
    name: "Activity 1",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });

  // no one has done the assignment yet
  expect(scoreData.orderedActivities).eqls([
    {
      contentId: contentId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([{ contentId, userScores: [] }]);

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    loggedInUserId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });
  const newUser1Info = {
    userId: newUser1.userId,
    email: newUser1.email,
    firstNames: newUser1.firstNames,
    lastNames: newUser1.lastNames,
  };

  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    state: "document state 1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });

  expect(scoreData.orderedActivities).eqls([
    {
      contentId: contentId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
    {
      contentId: contentId,
      userScores: [
        {
          score: 0.5,
          user: newUser1Info,
        },
      ],
    },
  ]);

  // new lower score does lower the resulting score
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.2,
    state: "document state 2",
  });

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });

  expect(scoreData.orderedActivities).eqls([
    {
      contentId: contentId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
    {
      contentId: contentId,
      userScores: [
        {
          score: 0.2,
          user: newUser1Info,
        },
      ],
    },
  ]);

  let newUser2 = await createTestAnonymousUser();
  newUser2 = await updateUser({
    loggedInUserId: newUser2.userId,
    firstNames: "Arya",
    lastNames: "Abbas",
  });
  const newUser2Info = {
    userId: newUser2.userId,
    email: newUser2.email,
    firstNames: newUser2.firstNames,
    lastNames: newUser2.lastNames,
  };

  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser2.userId,
    state: "document state 3",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser2.userId,
    attemptNumber: 1,
    score: 0.3,
    state: "document state 3",
  });

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.7,
    state: "document state 4",
  });

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });

  expect(scoreData.orderedActivities).eqls([
    {
      contentId: contentId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
    {
      contentId: contentId,
      userScores: [
        {
          score: 0.3,
          user: newUser2Info,
        },
        {
          score: 0.7,
          user: newUser1Info,
        },
      ],
    },
  ]);

  const { contentId: activity2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: activity2Id,
    name: "Activity 2",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  const { classCode: classCode2 } = await openAssignmentWithCode({
    contentId: activity2Id,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // identical name to user 2

  let newUser3 = await createTestAnonymousUser();
  newUser3 = await updateUser({
    loggedInUserId: newUser3.userId,
    firstNames: "Nyla",
    lastNames: "Nyquist",
  });
  const newUser3Info = {
    userId: newUser3.userId,
    email: newUser3.email,
    firstNames: newUser3.firstNames,
    lastNames: newUser3.lastNames,
  };

  await createNewAttempt({
    contentId: activity2Id,
    code: classCode2,
    loggedInUserId: newUser3.userId,
    state: "document state 1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: activity2Id,
    code: classCode2,
    loggedInUserId: newUser3.userId,
    attemptNumber: 1,
    score: 0.9,
    state: "document state 1",
  });

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });

  expect(scoreData.orderedActivities).eqls([
    {
      contentId: contentId,
      name: "Activity 1",
    },
    {
      contentId: activity2Id,
      name: "Activity 2",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
    {
      contentId: contentId,
      userScores: [
        {
          score: 0.3,
          user: newUser2Info,
        },
        {
          score: 0.7,
          user: newUser1Info,
        },
      ],
    },
    {
      contentId: activity2Id,
      userScores: [
        {
          score: 0.9,
          user: newUser3Info,
        },
      ],
    },
  ]);
});

test("record submitted events and get responses", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId,
    name: "My Activity",
    loggedInUserId: ownerId,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const newUser = await createTestAnonymousUser();

  const answerId1 = "answer1";
  const answerId2 = "answer2";

  // no submitted responses at first

  let submittedResponses = await getStudentSubmittedResponses({
    contentId,
    studentUserId: newUser.userId,
    loggedInUserId: ownerId,
    answerId: answerId1,
    contentAttemptNumber: 1,
    shuffledOrder: false,
  });
  expect(submittedResponses.responses.length).eq(0);
  submittedResponses = await getStudentSubmittedResponses({
    contentId,
    studentUserId: newUser.userId,
    loggedInUserId: ownerId,
    answerId: answerId2,
    contentAttemptNumber: 1,
    shuffledOrder: false,
  });
  expect(submittedResponses.responses.length).eq(0);

  // record event and retrieve it
  await recordSubmittedEvent({
    contentId: contentId,
    loggedInUserId: newUser.userId,
    contentAttemptNumber: 1,
    itemAttemptNumber: null,
    answerId: answerId1,
    response: "Answer result 1",
    answerNumber: 1,
    componentNumber: 2,
    itemNumber: 3,
    shuffledItemNumber: 3,
    answerCreditAchieved: 0.4,
    componentCreditAchieved: 0.2,
    itemCreditAchieved: 0.1,
  });

  submittedResponses = await getStudentSubmittedResponses({
    contentId,
    studentUserId: newUser.userId,
    loggedInUserId: ownerId,
    answerId: answerId1,
    contentAttemptNumber: 1,
    shuffledOrder: false,
  });
  expect(submittedResponses.responses).toMatchObject([
    {
      response: "Answer result 1",
      answerCreditAchieved: 0.4,
    },
  ]);

  // record new event
  await recordSubmittedEvent({
    contentId: contentId,
    loggedInUserId: newUser.userId,
    contentAttemptNumber: 1,
    itemAttemptNumber: null,
    answerId: answerId1,
    response: "Answer result 2",
    answerNumber: 1,
    componentNumber: 2,
    itemNumber: 3,
    shuffledItemNumber: 3,
    answerCreditAchieved: 0.8,
    componentCreditAchieved: 0.4,
    itemCreditAchieved: 0.2,
  });

  submittedResponses = await getStudentSubmittedResponses({
    contentId,
    studentUserId: newUser.userId,
    loggedInUserId: ownerId,
    answerId: answerId1,
    contentAttemptNumber: 1,
    shuffledOrder: false,
  });
  expect(submittedResponses.responses).toMatchObject([
    {
      response: "Answer result 1",
      answerCreditAchieved: 0.4,
    },
    {
      response: "Answer result 2",
      answerCreditAchieved: 0.8,
    },
  ]);

  // record event for different answer
  await recordSubmittedEvent({
    contentId: contentId,
    loggedInUserId: newUser.userId,
    contentAttemptNumber: 1,
    itemAttemptNumber: null,
    answerId: answerId2,
    response: "Answer result 3",
    answerNumber: 2,
    componentNumber: 2,
    itemNumber: 3,
    shuffledItemNumber: 3,
    answerCreditAchieved: 0.2,
    componentCreditAchieved: 0.1,
    itemCreditAchieved: 0.05,
  });

  submittedResponses = await getStudentSubmittedResponses({
    contentId,
    studentUserId: newUser.userId,
    loggedInUserId: ownerId,
    answerId: answerId2,
    contentAttemptNumber: 1,
    shuffledOrder: false,
  });
  expect(submittedResponses.responses).toMatchObject([
    {
      response: "Answer result 3",
      answerCreditAchieved: 0.2,
    },
  ]);
  submittedResponses = await getStudentSubmittedResponses({
    contentId,
    studentUserId: newUser.userId,
    loggedInUserId: ownerId,
    answerId: answerId1,
    contentAttemptNumber: 1,
    shuffledOrder: false,
  });
  expect(submittedResponses.responses).toMatchObject([
    {
      response: "Answer result 1",
      answerCreditAchieved: 0.4,
    },
    {
      response: "Answer result 2",
      answerCreditAchieved: 0.8,
    },
  ]);

  // response for a second user
  const newUser2 = await createTestAnonymousUser();

  await recordSubmittedEvent({
    contentId: contentId,
    loggedInUserId: newUser2.userId,
    contentAttemptNumber: 1,
    itemAttemptNumber: null,
    answerId: answerId1,
    response: "Answer result 4",
    answerNumber: 1,
    componentNumber: 2,
    itemNumber: 3,
    shuffledItemNumber: 3,
    answerCreditAchieved: 1,
    componentCreditAchieved: 0.5,
    itemCreditAchieved: 0.25,
  });

  submittedResponses = await getStudentSubmittedResponses({
    contentId,
    studentUserId: newUser2.userId,
    loggedInUserId: ownerId,
    answerId: answerId1,
    contentAttemptNumber: 1,
    shuffledOrder: false,
  });
  expect(submittedResponses.responses).toMatchObject([
    {
      response: "Answer result 4",
      answerCreditAchieved: 1,
    },
  ]);

  submittedResponses = await getStudentSubmittedResponses({
    contentId,
    studentUserId: newUser.userId,
    loggedInUserId: ownerId,
    answerId: answerId2,
    contentAttemptNumber: 1,
    shuffledOrder: false,
  });
  expect(submittedResponses.responses).toMatchObject([
    {
      response: "Answer result 3",
      answerCreditAchieved: 0.2,
    },
  ]);
});

test("only owner can get submitted responses", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  const user2 = await createTestUser();
  const userId2 = user2.userId;

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const newUser = await createTestAnonymousUser();
  const answerId1 = "answer1";

  // record event and retrieve it
  await recordSubmittedEvent({
    contentId: contentId,
    loggedInUserId: newUser.userId,
    contentAttemptNumber: 1,
    itemAttemptNumber: null,
    answerId: answerId1,
    response: "Answer result 1",
    answerNumber: 1,
    componentNumber: 2,
    itemNumber: 1,
    shuffledItemNumber: 1,
    answerCreditAchieved: 1,
    componentCreditAchieved: 0.5,
    itemCreditAchieved: 0.25,
  });
  const submittedResponses = await getStudentSubmittedResponses({
    contentId,
    studentUserId: newUser.userId,
    loggedInUserId: ownerId,
    answerId: answerId1,
    contentAttemptNumber: 1,
    shuffledOrder: false,
  });
  expect(submittedResponses.responses).toMatchObject([
    {
      response: "Answer result 1",
      answerCreditAchieved: 1,
    },
  ]);

  // cannot retrieve responses as other user
  await expect(
    getStudentSubmittedResponses({
      contentId,
      studentUserId: newUser.userId,
      loggedInUserId: userId2,
      answerId: answerId1,
      contentAttemptNumber: 1,
      shuffledOrder: false,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
});

test("only user and assignment owner can load document state", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const newUser = await createTestAnonymousUser();

  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser.userId,
    state: "document state 1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: newUser.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  // anonymous user can load state
  const retrievedState = await loadState({
    contentId: contentId,
    requestedUserId: newUser.userId,
    loggedInUserId: newUser.userId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state 1",
    score: 0.5,
    items: [],
    attemptNumber: 1,
    variant: 1,
  });

  // assignment owner can load state
  const retrievedState2 = await loadState({
    contentId: contentId,
    requestedUserId: newUser.userId,
    loggedInUserId: ownerId,
    attemptNumber: 1,
  });

  expect(retrievedState2).eqls({
    loadedState: true,
    state: "document state 1",
    score: 0.5,
    items: [],
    attemptNumber: 1,
    variant: 1,
  });

  // another user cannot load state
  const user2 = await createTestUser();

  const retrievedState3 = await loadState({
    contentId: contentId,
    requestedUserId: newUser.userId,
    loggedInUserId: user2.userId,
    attemptNumber: 1,
  });

  expect(retrievedState3).eqls({ loadedState: false });
});
