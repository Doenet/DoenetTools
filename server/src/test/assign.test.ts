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
  getAnswersThatHaveSubmittedResponses,
  getAssignedScores,
  getAssignmentDataFromCode,
  getAssignmentScoreData,
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
import { modifyContentSharedWith, setContentIsPublic } from "../query/share";
import { loadState, saveScoreAndState } from "../query/scores";
import { updateUser } from "../query/user";
import { moveContent } from "../query/copy_move";

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

  await assignActivity(contentId, ownerId);
  const assignment = await getTestAssignment(contentId, ownerId);

  expect(assignment.id).eqls(contentId);
  expect(assignment.name).eq("Activity 1");
  expect(assignment.assignedRevision!.source).eq("Some content");

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
  expect(updatedAssignment.assignedRevision!.source).eq("Some content");
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

  await expect(assignActivity(contentId, ownerId2)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  // still cannot create assignment even if activity is made public
  await setContentIsPublic({
    contentId: contentId,
    isPublic: true,
    loggedInUserId: ownerId1,
  });

  await expect(assignActivity(contentId, ownerId2)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  // still cannot create assignment even if activity is shared
  await modifyContentSharedWith({
    action: "share",
    contentId: contentId,
    loggedInUserId: ownerId1,
    users: [ownerId2],
  });

  await expect(assignActivity(contentId, ownerId2)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
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
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  let assignmentData = await getAssignmentDataFromCode(classCode, fakeId);
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.id).eqls(contentId);
  expect(assignmentData.assignment!.assignedRevision!.source).eq(
    "Some content",
  );

  // close assignment completely unassigns since there is no data
  await closeAssignmentWithCode(contentId, ownerId);
  await expect(getTestAssignment(contentId, ownerId)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  assignmentData = await getAssignmentDataFromCode(classCode, fakeId);
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
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  assignmentData = await getAssignmentDataFromCode(classCode, fakeId);
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.id).eqls(contentId);

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
  assignmentData = await getAssignmentDataFromCode(classCode, fakeId);
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
  expect(classCode3).eq(classCode);
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  // add some data
  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    score: 0.3,
    onSubmission: true,
    state: "document state",
  });

  // closing assignment doesn't close completely due to the data
  await closeAssignmentWithCode(contentId, ownerId);
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(null);
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

  await assignActivity(contentId, ownerId);

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  const assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  let assignmentData = await getAssignmentDataFromCode(classCode, fakeId);
  expect(assignmentData.assignment!.id).eqls(contentId);

  // unassign activity
  await unassignActivity(contentId, ownerId);
  await expect(getTestAssignment(contentId, ownerId)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  // Getting deleted assignment by code fails
  assignmentData = await getAssignmentDataFromCode(classCode, fakeId);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);

  // cannot unassign again
  await expect(unassignActivity(contentId, ownerId)).rejects.toThrow(
    "Record to update not found",
  );
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

  await expect(assignActivity(contentId, userId2)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  await assignActivity(contentId, ownerId);

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
  ).rejects.toThrow(PrismaClientKnownRequestError);

  const { codeValidUntil } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  expect(codeValidUntil).eqls(closeAt.toJSDate());

  const newCloseAt = DateTime.now().plus({ days: 2 });

  await expect(
    updateAssignmentSettings({
      contentId: contentId,
      closeAt: newCloseAt,
      loggedInUserId: userId2,
    }),
  ).rejects.toThrow("Record to update not found");
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  await updateAssignmentSettings({
    contentId: contentId,
    closeAt: newCloseAt,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(contentId, ownerId);
  expect(assignment.codeValidUntil).eqls(newCloseAt.toJSDate());

  await expect(closeAssignmentWithCode(contentId, userId2)).rejects.toThrow(
    "Record to update not found",
  );

  await closeAssignmentWithCode(contentId, ownerId);
});

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

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    userId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });
  const userData1 = {
    userId: newUser1.userId,
    email: newUser1.email,
    firstNames: newUser1.firstNames,
    lastNames: newUser1.lastNames,
  };

  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser1.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  let assignmentWithScores = await getAssignmentScoreData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });

  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.5, user: userData1 }],
  });

  let assignmentStudentData = await getAssignmentStudentData({
    contentId: contentId,
    loggedInUserId: ownerId,
    studentUserId: newUser1.userId,
  });

  expect(assignmentStudentData).eqls({
    score: 0.5,
    activity: {
      id: contentId,
      name: "Activity 1",
      assignedRevision: {
        revisionNum: 1,
        source: "Some content",
        doenetmlVersion: { fullVersion: "0.7.0-alpha31" },
      },
    },
    user: userData1,
    activityScores: [
      {
        activityRevisionNum: 1,
        hasMaxScore: true,
        score: 0.5,
      },
    ],
  });

  // new lower score ignored
  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser1.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });
  assignmentWithScores = await getAssignmentScoreData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.5, user: userData1 }],
  });

  assignmentStudentData = await getAssignmentStudentData({
    contentId: contentId,
    loggedInUserId: ownerId,
    studentUserId: newUser1.userId,
  });

  expect(assignmentStudentData).eqls({
    score: 0.5,
    activity: {
      id: contentId,
      name: "Activity 1",
      assignedRevision: {
        revisionNum: 1,
        source: "Some content",
        doenetmlVersion: { fullVersion: "0.7.0-alpha31" },
      },
    },
    user: userData1,
    activityScores: [
      {
        activityRevisionNum: 1,
        hasMaxScore: false,
        score: 0.2,
      },
      {
        activityRevisionNum: 1,
        hasMaxScore: true,
        score: 0.5,
      },
    ],
  });

  // new higher score used
  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser1.userId,
    score: 0.7,
    onSubmission: true,
    state: "document state 3",
  });
  assignmentWithScores = await getAssignmentScoreData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.7, user: userData1 }],
  });

  assignmentStudentData = await getAssignmentStudentData({
    contentId: contentId,
    loggedInUserId: ownerId,
    studentUserId: newUser1.userId,
  });

  expect(assignmentStudentData).eqls({
    score: 0.7,
    activity: {
      id: contentId,
      name: "Activity 1",
      assignedRevision: {
        revisionNum: 1,
        source: "Some content",
        doenetmlVersion: { fullVersion: "0.7.0-alpha31" },
      },
    },
    user: userData1,
    activityScores: [
      {
        activityRevisionNum: 1,
        hasMaxScore: true,
        score: 0.7,
      },
    ],
  });

  // second user opens assignment
  let newUser2 = await createTestAnonymousUser();
  newUser2 = await updateUser({
    userId: newUser2.userId,
    firstNames: "Arya",
    lastNames: "Abbas",
  });
  const userData2 = {
    userId: newUser2.userId,
    email: newUser2.email,
    firstNames: newUser2.firstNames,
    lastNames: newUser2.lastNames,
  };

  // assignment scores still unchanged
  assignmentWithScores = await getAssignmentScoreData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.7, user: userData1 }],
  });

  // save state for second user
  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser2.userId,
    score: 0.3,
    onSubmission: true,
    state: "document state 4",
  });

  // second user's score shows up first due to alphabetical sorting
  assignmentWithScores = await getAssignmentScoreData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [
      { score: 0.3, user: userData2 },
      { score: 0.7, user: userData1 },
    ],
  });

  assignmentStudentData = await getAssignmentStudentData({
    contentId: contentId,
    loggedInUserId: ownerId,
    studentUserId: newUser2.userId,
  });

  expect(assignmentStudentData).eqls({
    score: 0.3,
    activity: {
      id: contentId,
      name: "Activity 1",
      assignedRevision: {
        revisionNum: 1,
        source: "Some content",
        doenetmlVersion: { fullVersion: "0.7.0-alpha31" },
      },
    },
    user: userData2,
    activityScores: [
      {
        activityRevisionNum: 1,
        hasMaxScore: true,
        score: 0.3,
      },
    ],
  });
});

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
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    userId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });

  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser1.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  // assignment owner can get score data
  await getAssignmentScoreData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });

  // other user cannot get score data
  await expect(
    getAssignmentScoreData({
      contentId: contentId,
      loggedInUserId: otherUserId,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  // student cannot get score data on all of assignment
  await expect(
    getAssignmentScoreData({
      contentId: contentId,
      loggedInUserId: newUser1.userId,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  // assignment owner can get data on student
  const studentData = await getAssignmentStudentData({
    contentId: contentId,
    loggedInUserId: ownerId,
    studentUserId: newUser1.userId,
  });

  // another user cannot get data on student
  await expect(
    getAssignmentStudentData({
      contentId: contentId,
      loggedInUserId: otherUserId,
      studentUserId: newUser1.userId,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  // student can get own data
  expect(
    await getAssignmentStudentData({
      contentId: contentId,
      loggedInUserId: newUser1.userId,
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
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    userId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });

  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser1.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  await getAssignmentScoreData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });

  await getAssignmentStudentData({
    contentId: contentId,
    loggedInUserId: ownerId,
    studentUserId: newUser1.userId,
  });

  await expect(unassignActivity(contentId, ownerId)).rejects.toThrow(
    "Record to update not found",
  );
});

test("list assigned and get assigned scores get student assignments and scores", async () => {
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  let assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).eqls([]);
  expect(assignmentList.user.userId).eqls(user1Id);

  let studentData = await getAssignedScores(user1Id);
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
  await assignActivity(contentId1, user1Id);

  assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).eqls([]);
  studentData = await getAssignedScores(user1Id);
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
  await assignActivity(contentId2, user2Id);

  assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).eqls([]);
  studentData = await getAssignedScores(user1Id);
  expect(studentData.orderedActivityScores).eqls([]);

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  await openAssignmentWithCode({
    contentId: contentId2,
    closeAt: closeAt,
    loggedInUserId: user2Id,
  });

  // recording score for user1 on assignment2 adds it to user1's assignment list
  await saveScoreAndState({
    contentId: contentId2,
    activityRevisionNum: 1,
    loggedInUserId: user1Id,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).toMatchObject([
    {
      id: contentId2,
      ownerId: user2Id,
    },
  ]);
  studentData = await getAssignedScores(user1Id);
  expect(studentData.orderedActivityScores).eqls([
    { contentId: contentId2, activityName: "Activity 2", score: 0.5 },
  ]);

  // cannot unassign
  await expect(unassignActivity(contentId2, user2Id)).rejects.toThrow(
    "Record to update not found",
  );
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
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    userId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });
  const newUser1Info = convertUUID({
    userId: newUser1.userId,
    email: newUser1.email,
    firstNames: newUser1.firstNames,
    lastNames: newUser1.lastNames,
  });

  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser1.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  let userWithScores = convertUUID(
    await getStudentData({
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

  // new lower score ignored
  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser1.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });

  userWithScores = convertUUID(
    await getStudentData({
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

  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser1.userId,
    score: 0.7,
    onSubmission: true,
    state: "document state 3",
  });

  userWithScores = convertUUID(
    await getStudentData({
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
    desiredParentId: baseFolderId,
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
    desiredParentId: baseFolderId,
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
    desiredParentId: folder1Id,
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
    desiredParentId: folder1cId,
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
    desiredParentId: folder1Id,
    desiredPosition: 1,
    loggedInUserId: ownerId,
  });

  // move activity 1e to end of folder 1
  await moveContent({
    contentId: activity1eId,
    desiredParentId: folder1Id,
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
  await deleteContent(activityGoneId, ownerId);
  const { contentId: activity4Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: baseFolderId,
  });
  await deleteContent(activity4Id, ownerId);
  const { contentId: activity3cId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder3Id,
  });
  await deleteContent(activity3cId, ownerId);

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
  await openAssignmentWithCode({
    contentId: activity1aId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  await openAssignmentWithCode({
    contentId: activity1c1Id,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  await openAssignmentWithCode({
    contentId: activity1c2aId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  await openAssignmentWithCode({
    contentId: activity1c2bId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  await openAssignmentWithCode({
    contentId: activity1eId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  await openAssignmentWithCode({
    contentId: activity2Id,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  await openAssignmentWithCode({
    contentId: activity3bId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  await openAssignmentWithCode({
    contentId: activityRootId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let newUser = await createTestAnonymousUser();
  newUser = await updateUser({
    userId: newUser.userId,
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

  await saveScoreAndState({
    contentId: activity1aId,
    activityRevisionNum: 1,
    loggedInUserId: newUserId,
    score: 0.11,
    onSubmission: true,
    state: "document state 1a",
  });
  await saveScoreAndState({
    contentId: activity1c1Id,
    activityRevisionNum: 1,
    loggedInUserId: newUserId,
    score: 0.131,
    onSubmission: true,
    state: "document state 1c1",
  });
  await saveScoreAndState({
    contentId: activity1c2aId,
    activityRevisionNum: 1,
    loggedInUserId: newUserId,
    score: 0.1321,
    onSubmission: true,
    state: "document state 1c2a",
  });
  await saveScoreAndState({
    contentId: activity1c2bId,
    activityRevisionNum: 1,
    loggedInUserId: newUserId,
    score: 0.1322,
    onSubmission: true,
    state: "document state 1c2b",
  });
  await saveScoreAndState({
    contentId: activity1eId,
    activityRevisionNum: 1,
    loggedInUserId: newUserId,
    score: 0.15,
    onSubmission: true,
    state: "document state 1e",
  });
  await saveScoreAndState({
    contentId: activity2Id,
    activityRevisionNum: 1,
    loggedInUserId: newUserId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });
  await saveScoreAndState({
    contentId: activity3bId,
    activityRevisionNum: 1,
    loggedInUserId: newUserId,
    score: 0.32,
    onSubmission: true,
    state: "document state 3b",
  });
  await saveScoreAndState({
    contentId: activityRootId,
    activityRevisionNum: 1,
    loggedInUserId: newUserId,
    score: 1.0,
    onSubmission: true,
    state: "document state Root",
  });

  const desiredFolder3 = [{ id: fromUUID(activity3bId), name: "Activity 3b" }];
  const desiredFolder3Scores = [
    {
      contentId: fromUUID(activity3bId),
      score: 0.32,
      user: userInfo,
    },
  ];
  const desiredFolder1c2 = [
    { id: fromUUID(activity1c2aId), name: "Activity 1c2a" },
    { id: fromUUID(activity1c2bId), name: "Activity 1c2b" },
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
    { id: fromUUID(activity1c1Id), name: "Activity 1c1" },
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
    { id: fromUUID(activity1aId), name: "Activity 1a" },
    ...desiredFolder1c,
    { id: fromUUID(activity1eId), name: "Activity 1e" },
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
    { id: fromUUID(activity2Id), name: "Activity 2" },
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
    { id: fromUUID(activityRootId), name: "Activity root" },
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
    convertUUID(scoreData.assignmentScores.sort((a, b) => a.score - b.score)),
  ).eqls(desiredNullFolderScores);
  expect(scoreData.folder).eqls(null);

  let studentData = await getStudentData({
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
    convertUUID(scoreData.assignmentScores.sort((a, b) => a.score - b.score)),
  ).eqls(desiredBaseFolderScores);
  expect(convertUUID(scoreData.folder?.id)).eqls(fromUUID(baseFolderId));

  studentData = await getStudentData({
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
  expect(convertUUID(studentData.folder?.id)).eqls(fromUUID(baseFolderId));

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder1Id,
  });
  expect(convertUUID(scoreData.orderedActivities)).eqls(desiredFolder1);
  expect(
    convertUUID(scoreData.assignmentScores.sort((a, b) => a.score - b.score)),
  ).eqls(desiredFolder1Scores);
  expect(convertUUID(scoreData.folder?.id)).eqls(fromUUID(folder1Id));

  studentData = await getStudentData({
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
  expect(convertUUID(studentData.folder?.id)).eqls(fromUUID(folder1Id));

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder3Id,
  });
  expect(convertUUID(scoreData.orderedActivities)).eqls(desiredFolder3);
  expect(
    convertUUID(scoreData.assignmentScores.sort((a, b) => a.score - b.score)),
  ).eqls(desiredFolder3Scores);
  expect(convertUUID(scoreData.folder?.id)).eqls(fromUUID(folder3Id));

  studentData = await getStudentData({
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
  expect(convertUUID(studentData.folder?.id)).eqls(fromUUID(folder3Id));

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder1cId,
  });
  expect(convertUUID(scoreData.orderedActivities)).eqls(desiredFolder1c);
  expect(
    convertUUID(scoreData.assignmentScores.sort((a, b) => a.score - b.score)),
  ).eqls(desiredFolder1cScores);
  expect(convertUUID(scoreData.folder?.id)).eqls(fromUUID(folder1cId));

  studentData = await getStudentData({
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
  expect(convertUUID(studentData.folder?.id)).eqls(fromUUID(folder1cId));

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder1dId,
  });
  expect(scoreData.orderedActivities).eqls([]);
  expect(scoreData.assignmentScores).eqls([]);
  expect(convertUUID(scoreData.folder?.id)).eqls(fromUUID(folder1dId));

  studentData = await getStudentData({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: folder1dId,
  });
  expect(studentData.orderedActivityScores).eqls([]);
  expect(convertUUID(studentData.folder?.id)).eqls(fromUUID(folder1dId));
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
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });

  // no one has done the assignment yet
  expect(convertUUID(scoreData.orderedActivities)).eqls([
    {
      id: fromUUID(contentId),
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([]);

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    userId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });
  const newUser1Info = convertUUID({
    userId: newUser1.userId,
    email: newUser1.email,
    firstNames: newUser1.firstNames,
    lastNames: newUser1.lastNames,
  });

  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser1.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });

  expect(convertUUID(scoreData.orderedActivities)).eqls([
    {
      id: fromUUID(contentId),
      name: "Activity 1",
    },
  ]);
  expect(convertUUID(scoreData.assignmentScores)).eqls([
    {
      contentId: fromUUID(contentId),
      score: 0.5,
      user: newUser1Info,
    },
  ]);

  // new lower score ignored
  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser1.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });

  expect(convertUUID(scoreData.orderedActivities)).eqls([
    {
      id: fromUUID(contentId),
      name: "Activity 1",
    },
  ]);
  expect(convertUUID(scoreData.assignmentScores)).eqls([
    {
      contentId: fromUUID(contentId),
      score: 0.5,
      user: newUser1Info,
    },
  ]);

  let newUser2 = await createTestAnonymousUser();
  newUser2 = await updateUser({
    userId: newUser2.userId,
    firstNames: "Arya",
    lastNames: "Abbas",
  });
  const newUser2Info = convertUUID({
    userId: newUser2.userId,
    email: newUser2.email,
    firstNames: newUser2.firstNames,
    lastNames: newUser2.lastNames,
  });

  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser2.userId,
    score: 0.3,
    onSubmission: true,
    state: "document state 3",
  });

  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser1.userId,
    score: 0.7,
    onSubmission: true,
    state: "document state 4",
  });

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });

  expect(convertUUID(scoreData.orderedActivities)).eqls([
    {
      id: fromUUID(contentId),
      name: "Activity 1",
    },
  ]);
  expect(convertUUID(scoreData.assignmentScores)).eqls([
    {
      contentId: fromUUID(contentId),
      score: 0.7,
      user: newUser1Info,
    },
    {
      contentId: fromUUID(contentId),
      score: 0.3,
      user: newUser2Info,
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

  await openAssignmentWithCode({
    contentId: activity2Id,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // identical name to user 2

  let newUser3 = await createTestAnonymousUser();
  newUser3 = await updateUser({
    userId: newUser3.userId,
    firstNames: "Nyla",
    lastNames: "Nyquist",
  });
  const newUser3Info = convertUUID({
    userId: newUser3.userId,
    email: newUser3.email,
    firstNames: newUser3.firstNames,
    lastNames: newUser3.lastNames,
  });

  await saveScoreAndState({
    contentId: activity2Id,
    activityRevisionNum: 1,
    loggedInUserId: newUser3.userId,
    score: 0.9,
    onSubmission: true,
    state: "document state 1",
  });

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });

  expect(convertUUID(scoreData.orderedActivities)).eqls([
    {
      id: fromUUID(contentId),
      name: "Activity 1",
    },
    {
      id: fromUUID(activity2Id),
      name: "Activity 2",
    },
  ]);
  expect(convertUUID(scoreData.assignmentScores)).eqls([
    {
      contentId: fromUUID(contentId),
      score: 0.7,
      user: newUser1Info,
    },
    {
      contentId: fromUUID(contentId),
      score: 0.3,
      user: newUser2Info,
    },
    {
      contentId: fromUUID(activity2Id),
      score: 0.9,
      user: newUser3Info,
    },
  ]);
});

test("record submitted events and get responses", { retry: 5 }, async () => {
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
  const userData = {
    userId: newUser!.userId,
    firstNames: newUser!.firstNames,
    lastNames: newUser!.lastNames,
  };

  const answerId1 = "answer1";
  const answerId2 = "answer2";

  // no submitted responses at first
  let answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    contentId,
    ownerId,
  });
  expect(answerWithResponses).eqls([]);

  // eslint-disable-next-line prefer-const
  let { submittedResponses, activityName } = await getSubmittedResponses({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    answerId: answerId1,
  });
  expect(activityName).eq("My Activity");
  expect(submittedResponses).eqls([]);

  let {
    submittedResponses: submittedResponseHistory,
    // eslint-disable-next-line prefer-const
    activityName: activityName2,
  } = await getSubmittedResponseHistory({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    answerId: answerId1,
    userId: newUser!.userId,
  });
  expect(activityName2).eq("My Activity");
  expect(submittedResponseHistory).eqls([]);

  // record event and retrieve it
  await recordSubmittedEvent({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser!.userId,
    answerId: answerId1,
    response: "Answer result 1",
    answerNumber: 1,
    itemNumber: 2,
    creditAchieved: 0.4,
    itemCreditAchieved: 0.2,
    activityCreditAchieved: 0.1,
  });
  answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    contentId,
    ownerId,
  });
  expect(answerWithResponses).eqls([
    {
      activityRevisionNum: 1,
      answerId: answerId1,
      answerNumber: 1,
      count: 1,
      averageCredit: 0.4,
    },
  ]);
  ({ submittedResponses } = await getSubmittedResponses({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    answerId: answerId1,
  }));
  expect(submittedResponses).toMatchObject([
    {
      user: {
        userId: newUser!.userId,
        email: newUser.email,
        firstNames: newUser!.firstNames,
        lastNames: newUser!.lastNames,
      },
      bestResponse: "Answer result 1",
      bestCreditAchieved: 0.4,
      latestResponse: "Answer result 1",
      latestCreditAchieved: 0.4,
      numResponses: 1,
    },
  ]);
  ({ submittedResponses: submittedResponseHistory } =
    await getSubmittedResponseHistory({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: ownerId,
      answerId: answerId1,
      userId: newUser!.userId,
    }));
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData,
      response: "Answer result 1",
      creditAchieved: 0.4,
    },
  ]);

  // record new event overwrites result
  await recordSubmittedEvent({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser!.userId,
    answerId: answerId1,
    response: "Answer result 2",
    answerNumber: 1,
    itemNumber: 2,
    creditAchieved: 0.8,
    itemCreditAchieved: 0.4,
    activityCreditAchieved: 0.2,
  });
  answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    contentId,
    ownerId,
  });
  expect(answerWithResponses).eqls([
    {
      activityRevisionNum: 1,
      answerId: answerId1,
      answerNumber: 1,
      count: 1,
      averageCredit: 0.8,
    },
  ]);
  ({ submittedResponses } = await getSubmittedResponses({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    answerId: answerId1,
  }));
  expect(submittedResponses).toMatchObject([
    {
      user: {
        userId: newUser!.userId,
        email: newUser.email,
        firstNames: newUser!.firstNames,
        lastNames: newUser!.lastNames,
      },
      bestResponse: "Answer result 2",
      bestCreditAchieved: 0.8,
      latestResponse: "Answer result 2",
      latestCreditAchieved: 0.8,
      numResponses: 2,
    },
  ]);
  ({ submittedResponses: submittedResponseHistory } =
    await getSubmittedResponseHistory({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: ownerId,
      answerId: answerId1,
      userId: newUser!.userId,
    }));
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData,
      response: "Answer result 1",
      creditAchieved: 0.4,
    },
    {
      user: userData,
      response: "Answer result 2",
      creditAchieved: 0.8,
    },
  ]);

  // record event for different answer
  await recordSubmittedEvent({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser!.userId,
    answerId: answerId2,
    response: "Answer result 3",
    answerNumber: 2,
    itemNumber: 2,
    creditAchieved: 0.2,
    itemCreditAchieved: 0.1,
    activityCreditAchieved: 0.05,
  });
  answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    contentId,
    ownerId,
  });
  // Note: use `arrayContaining` as the order of the entries isn't determined
  expect(answerWithResponses).toMatchObject(
    expect.arrayContaining([
      {
        activityRevisionNum: 1,
        answerId: answerId1,
        answerNumber: 1,
        count: 1,
        averageCredit: 0.8,
      },
      {
        activityRevisionNum: 1,
        answerId: answerId2,
        answerNumber: 2,
        count: 1,
        averageCredit: 0.2,
      },
    ]),
  );
  ({ submittedResponses } = await getSubmittedResponses({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    answerId: answerId1,
  }));
  expect(submittedResponses).toMatchObject([
    {
      user: {
        userId: newUser!.userId,
        email: newUser.email,
        firstNames: newUser!.firstNames,
        lastNames: newUser!.lastNames,
      },
      bestResponse: "Answer result 2",
      bestCreditAchieved: 0.8,
      latestResponse: "Answer result 2",
      latestCreditAchieved: 0.8,
      numResponses: 2,
    },
  ]);
  ({ submittedResponses: submittedResponseHistory } =
    await getSubmittedResponseHistory({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: ownerId,
      answerId: answerId1,
      userId: newUser!.userId,
    }));
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData,
      response: "Answer result 1",
      creditAchieved: 0.4,
    },
    {
      user: userData,
      response: "Answer result 2",
      creditAchieved: 0.8,
    },
  ]);

  ({ submittedResponses } = await getSubmittedResponses({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    answerId: answerId2,
  }));
  expect(submittedResponses).toMatchObject([
    {
      user: {
        userId: newUser!.userId,
        email: newUser.email,
        firstNames: newUser!.firstNames,
        lastNames: newUser!.lastNames,
      },
      bestResponse: "Answer result 3",
      bestCreditAchieved: 0.2,
      latestResponse: "Answer result 3",
      latestCreditAchieved: 0.2,
      numResponses: 1,
    },
  ]);
  ({ submittedResponses: submittedResponseHistory } =
    await getSubmittedResponseHistory({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: ownerId,
      answerId: answerId2,
      userId: newUser!.userId,
    }));
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData,
      response: "Answer result 3",
      creditAchieved: 0.2,
    },
  ]);

  // response for a second user
  const newUser2 = await createTestAnonymousUser();
  const userData2 = {
    userId: newUser2.userId,
    firstNames: newUser2.firstNames,
    lastNames: newUser2.lastNames,
  };
  await recordSubmittedEvent({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser2.userId,
    answerId: answerId1,
    response: "Answer result 4",
    answerNumber: 1,
    itemNumber: 2,
    creditAchieved: 1,
    itemCreditAchieved: 0.5,
    activityCreditAchieved: 0.25,
  });
  answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    contentId,
    ownerId,
  });
  expect(answerWithResponses).toMatchObject(
    expect.arrayContaining([
      {
        activityRevisionNum: 1,
        answerId: answerId1,
        answerNumber: 1,
        count: 2,
        averageCredit: 0.9,
      },
      {
        activityRevisionNum: 1,
        answerId: answerId2,
        answerNumber: 2,
        count: 1,
        averageCredit: 0.2,
      },
    ]),
  );
  ({ submittedResponses } = await getSubmittedResponses({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    answerId: answerId1,
  }));

  // For some reason, the result is sometimes missing the "Answer result 4" record.
  // Cannot determine a race condition that would cause it.
  // We retry this test up to 5 times to account for this flakiness.
  expect(submittedResponses).toMatchObject([
    {
      user: {
        userId: newUser!.userId,
        email: newUser.email,
        firstNames: newUser!.firstNames,
        lastNames: newUser!.lastNames,
      },
      bestResponse: "Answer result 2",
      bestCreditAchieved: 0.8,
      latestResponse: "Answer result 2",
      latestCreditAchieved: 0.8,
      numResponses: 2,
    },
    {
      user: {
        userId: newUser2.userId,
        email: newUser2.email,
        firstNames: newUser2.firstNames,
        lastNames: newUser2.lastNames,
      },
      bestResponse: "Answer result 4",
      bestCreditAchieved: 1,
      latestResponse: "Answer result 4",
      latestCreditAchieved: 1,
      numResponses: 1,
    },
  ]);

  ({ submittedResponses: submittedResponseHistory } =
    await getSubmittedResponseHistory({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: ownerId,
      answerId: answerId1,
      userId: newUser!.userId,
    }));
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData,
      response: "Answer result 1",
      creditAchieved: 0.4,
    },
    {
      user: userData,
      response: "Answer result 2",
      creditAchieved: 0.8,
    },
  ]);
  ({ submittedResponses: submittedResponseHistory } =
    await getSubmittedResponseHistory({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: ownerId,
      answerId: answerId1,
      userId: newUser2.userId,
    }));
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData2,
      response: "Answer result 4",
      creditAchieved: 1,
    },
  ]);

  ({ submittedResponses } = await getSubmittedResponses({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    answerId: answerId2,
  }));
  expect(submittedResponses).toMatchObject([
    {
      user: {
        userId: newUser!.userId,
        email: newUser.email,
        firstNames: newUser!.firstNames,
        lastNames: newUser!.lastNames,
      },
      bestResponse: "Answer result 3",
      bestCreditAchieved: 0.2,
      latestResponse: "Answer result 3",
      latestCreditAchieved: 0.2,
      numResponses: 1,
    },
  ]);
  ({ submittedResponses: submittedResponseHistory } =
    await getSubmittedResponseHistory({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: ownerId,
      answerId: answerId2,
      userId: newUser!.userId,
    }));
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData,
      response: "Answer result 3",
      creditAchieved: 0.2,
    },
  ]);
  ({ submittedResponses: submittedResponseHistory } =
    await getSubmittedResponseHistory({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: ownerId,
      answerId: answerId2,
      userId: newUser2.userId,
    }));
  expect(submittedResponseHistory).eqls([]);

  // verify submitted responses changes but average max credit doesn't change if submit a lower credit answer
  await recordSubmittedEvent({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser2.userId,
    answerId: answerId1,
    response: "Answer result 5",
    answerNumber: 1,
    itemNumber: 2,
    creditAchieved: 0.6,
    itemCreditAchieved: 0.3,
    activityCreditAchieved: 0.15,
  });

  ({ submittedResponses: submittedResponseHistory } =
    await getSubmittedResponseHistory({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: ownerId,
      answerId: answerId1,
      userId: newUser2.userId,
    }));
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData2,
      response: "Answer result 4",
      creditAchieved: 1,
    },
    {
      user: userData2,
      response: "Answer result 5",
      creditAchieved: 0.6,
    },
  ]);

  ({ submittedResponses } = await getSubmittedResponses({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    answerId: answerId1,
  }));
  expect(submittedResponses).toMatchObject([
    {
      user: {
        userId: newUser!.userId,
        email: newUser.email,
        firstNames: newUser!.firstNames,
        lastNames: newUser!.lastNames,
      },
      bestResponse: "Answer result 2",
      bestCreditAchieved: 0.8,
      latestResponse: "Answer result 2",
      latestCreditAchieved: 0.8,
      numResponses: 2,
    },
    {
      user: {
        userId: newUser2.userId,
        email: newUser2.email,
        firstNames: newUser2.firstNames,
        lastNames: newUser2.lastNames,
      },
      bestResponse: "Answer result 4",
      bestCreditAchieved: 1,
      latestResponse: "Answer result 5",
      latestCreditAchieved: 0.6,
      numResponses: 2,
    },
  ]);
  answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    contentId,
    ownerId,
  });
  expect(answerWithResponses).toMatchObject(
    expect.arrayContaining([
      {
        activityRevisionNum: 1,
        answerId: answerId1,
        answerNumber: 1,
        count: 2,
        averageCredit: 0.9,
      },
      {
        activityRevisionNum: 1,
        answerId: answerId2,
        answerNumber: 2,
        count: 1,
        averageCredit: 0.2,
      },
    ]),
  );
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
  const userData = {
    userId: newUser!.userId,
    firstNames: newUser!.firstNames,
    lastNames: newUser!.lastNames,
  };

  const answerId1 = "answer1";

  // record event and retrieve it
  await recordSubmittedEvent({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser!.userId,
    answerId: answerId1,
    response: "Answer result 1",
    answerNumber: 1,
    itemNumber: 2,
    creditAchieved: 1,
    itemCreditAchieved: 0.5,
    activityCreditAchieved: 0.25,
  });
  let answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    contentId,
    ownerId,
  });
  expect(answerWithResponses).eqls([
    {
      activityRevisionNum: 1,
      answerId: answerId1,
      answerNumber: 1,
      count: 1,
      averageCredit: 1,
    },
  ]);
  const { submittedResponses } = await getSubmittedResponses({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    answerId: answerId1,
  });
  expect(submittedResponses).toMatchObject([
    {
      user: {
        userId: newUser!.userId,
        email: newUser.email,
        firstNames: newUser!.firstNames,
        lastNames: newUser!.lastNames,
      },
      bestResponse: "Answer result 1",
      bestCreditAchieved: 1,
      latestResponse: "Answer result 1",
      latestCreditAchieved: 1,
      numResponses: 1,
    },
  ]);
  const { submittedResponses: submittedResponseHistory } =
    await getSubmittedResponseHistory({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: ownerId,
      answerId: answerId1,
      userId: newUser!.userId,
    });
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData,
      response: "Answer result 1",
      creditAchieved: 1,
    },
  ]);

  answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    contentId,
    ownerId: userId2,
  });
  expect(answerWithResponses).eqls([]);

  // cannot retrieve responses as other user
  await expect(
    getSubmittedResponses({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: userId2,
      answerId: answerId1,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  await expect(
    getSubmittedResponseHistory({
      contentId: contentId,
      activityRevisionNum: 1,
      loggedInUserId: userId2,
      answerId: answerId1,
      userId: newUser!.userId,
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
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const newUser = await createTestAnonymousUser();

  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  // anonymous user can load state
  const retrievedState = await loadState({
    contentId: contentId,
    requestedUserId: newUser!.userId,
    loggedInUserId: newUser!.userId,
    withMaxScore: false,
  });

  expect(retrievedState).eq("document state 1");

  // assignment owner can load state
  const retrievedState2 = await loadState({
    contentId: contentId,
    requestedUserId: newUser!.userId,
    loggedInUserId: ownerId,
    withMaxScore: false,
  });

  expect(retrievedState2).eq("document state 1");

  // another user cannot load state
  const user2 = await createTestUser();

  await expect(
    loadState({
      contentId: contentId,
      requestedUserId: newUser!.userId,
      loggedInUserId: user2.userId,
      withMaxScore: false,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
});

test("load document state based on withMaxScore", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
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

  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  // since last state is maximum score, withMaxScore doesn't have effect
  let retrievedState = await loadState({
    contentId: contentId,
    requestedUserId: newUser!.userId,
    loggedInUserId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 1");

  retrievedState = await loadState({
    contentId: contentId,
    requestedUserId: newUser!.userId,
    loggedInUserId: ownerId,
    withMaxScore: true,
  });
  expect(retrievedState).eq("document state 1");

  // last state is no longer maximum score
  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser!.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });

  // get last state if withMaxScore is false
  retrievedState = await loadState({
    contentId: contentId,
    requestedUserId: newUser!.userId,
    loggedInUserId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 2");

  // get state with max score
  retrievedState = await loadState({
    contentId: contentId,
    requestedUserId: newUser!.userId,
    loggedInUserId: ownerId,
    withMaxScore: true,
  });
  expect(retrievedState).eq("document state 1");

  // matching maximum score with onSubmission uses latest for maximum
  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 3",
  });

  retrievedState = await loadState({
    contentId: contentId,
    requestedUserId: newUser!.userId,
    loggedInUserId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 3");

  retrievedState = await loadState({
    contentId: contentId,
    requestedUserId: newUser!.userId,
    loggedInUserId: ownerId,
    withMaxScore: true,
  });
  expect(retrievedState).eq("document state 3");

  // matching maximum score without onSubmission does not use latest for maximum
  await saveScoreAndState({
    contentId: contentId,
    activityRevisionNum: 1,
    loggedInUserId: newUser!.userId,
    score: 0.5,
    onSubmission: false,
    state: "document state 4",
  });

  retrievedState = await loadState({
    contentId: contentId,
    requestedUserId: newUser!.userId,
    loggedInUserId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 4");

  retrievedState = await loadState({
    contentId: contentId,
    requestedUserId: newUser!.userId,
    loggedInUserId: ownerId,
    withMaxScore: true,
  });
  expect(retrievedState).eq("document state 3");
});
