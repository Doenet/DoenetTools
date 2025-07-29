import { expect, test } from "vitest";
import {
  createTestAnonymousUser,
  createTestUser,
  doc,
  fold,
  getTestAssignment,
  pset,
  qbank,
  setupTestContent,
} from "./utils";
import { DateTime } from "luxon";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { convertUUID, fromUUID } from "../utils/uuid";
import { createContent, deleteContent, updateContent } from "../query/activity";
import {
  closeAssignmentWithCode,
  getAllAssignmentScores,
  getAssignedScores,
  getAssignmentResponseOverview,
  getAssignmentResponseStudent,
  getAssignmentViewerDataFromCode,
  getStudentAssignmentScores,
  getStudentSubmittedResponses,
  listUserAssigned,
  createAssignment,
  recordSubmittedEvent,
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
import { getAssignmentNonRootIds } from "./testQueries";

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

  const { assignmentId } = await createAssignment({
    contentId,
    loggedInUserId: ownerId,
    closeAt: DateTime.now().plus({ days: 1 }),
    destinationParentId: null,
  });
  const assignment = await getTestAssignment(assignmentId, ownerId);

  expect(assignment.name).eq("Activity 1");
  expect(assignment.source).eq("Some content");

  // changing name of activity does change assignment name
  await updateContent({
    contentId: assignmentId,
    name: "Activity 1a",
    loggedInUserId: ownerId,
  });

  let updatedAssignment = await getTestAssignment(assignmentId, ownerId);
  expect(updatedAssignment.name).eq("Activity 1a");

  // cannot change content of activity
  await expect(
    updateContent({
      contentId: assignmentId,
      source: "Some amended content",
      loggedInUserId: ownerId,
    }),
  ).rejects.toThrow("Cannot change assigned content");

  updatedAssignment = await getTestAssignment(assignmentId, ownerId);
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
    createAssignment({
      contentId: contentId,
      loggedInUserId: ownerId2,
      closeAt: DateTime.now().plus({ days: 1 }),
      destinationParentId: null,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  // still cannot create assignment even if activity is made public
  await setContentIsPublic({
    contentId: contentId,
    isPublic: true,
    loggedInUserId: ownerId1,
  });

  await expect(
    createAssignment({
      contentId: contentId,
      loggedInUserId: ownerId2,
      closeAt: DateTime.now().plus({ days: 1 }),
      destinationParentId: null,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  // still cannot create assignment even if activity is shared
  await modifyContentSharedWith({
    action: "share",
    contentId: contentId,
    loggedInUserId: ownerId1,
    users: [ownerId2],
  });

  await expect(
    createAssignment({
      contentId: contentId,
      loggedInUserId: ownerId2,
      closeAt: DateTime.now().plus({ days: 1 }),
      destinationParentId: null,
    }),
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
  const { assignmentId, classCode } = await createAssignment({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: null,
  });
  let assignment = await getTestAssignment(assignmentId, ownerId);
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
  expect(assignmentData.assignment.contentId).eqls(assignmentId);
  expect(assignmentData.assignment.doenetML).eq("Some content");

  let closeDate = new Date();
  await closeAssignmentWithCode({
    contentId: assignmentId,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.rootAssignment?.codeValidUntil.getTime()).gte(
    closeDate.getTime(),
  );
  expect(assignment.rootAssignment?.codeValidUntil.getTime()).lte(
    closeDate.getTime() + 30 * 1000,
  );

  assignmentData = await getAssignmentViewerDataFromCode({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignmentOpen).eq(false);
  // expect(assignmentData.assignment).eq(null);

  // get same code back if reopen
  closeAt = DateTime.now().plus({ weeks: 3 });
  await updateAssignmentCloseAt({
    contentId: assignmentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.rootAssignment!.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  assignmentData = await getAssignmentViewerDataFromCode({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.contentId).eqls(assignmentId);

  // Change opening date to the past.
  // Currently, says assignment is not found
  // TODO: if we want students who have previously joined the assignment to be able to reload the page,
  // then this should still retrieve data for those students.
  closeAt = DateTime.now().plus({ seconds: -7 });
  await updateAssignmentCloseAt({
    contentId: assignmentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  assignmentData = await getAssignmentViewerDataFromCode({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignmentFound).eq(true);

  // reopen with future date
  closeAt = DateTime.now().plus({ years: 1 });
  await updateAssignmentCloseAt({
    contentId: assignmentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.rootAssignment!.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  await createNewAttempt({
    contentId: assignmentId,
    loggedInUserId: ownerId,
    variant: 1,
    code: classCode,
    state: null,
  });

  // add some data
  await saveScoreAndState({
    contentId: assignmentId,
    code: classCode,
    loggedInUserId: ownerId,
    attemptNumber: 1,
    score: 0.3,
    state: "document state",
  });

  // closing assignment doesn't close completely due to the data
  closeDate = new Date();
  await closeAssignmentWithCode({
    contentId: assignmentId,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.rootAssignment!.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil.getTime()).gte(
    closeDate.getTime(),
  );
  expect(assignment.rootAssignment!.codeValidUntil.getTime()).lte(
    closeDate.getTime() + 30 * 1000,
  );
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
  const { assignmentId: sequenceAssignmentId, classCode } =
    await createAssignment({
      contentId: sequenceId,
      closeAt: closeAt,
      loggedInUserId: ownerId,
      destinationParentId: null,
    });
  const assignment = await getTestAssignment(sequenceAssignmentId, ownerId);
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

  expect(assignmentData.assignment.contentId).eqls(sequenceAssignmentId);

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
    contentId: sequenceAssignmentId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Open");
  expect(content.assignmentInfo?.codeValidUntil).eqls(closeAt.toJSDate());
  expect(content.assignmentInfo?.classCode).eq(classCode);
  expect(content.assignmentInfo?.maxAttempts).eq(1);
  expect(content.assignmentInfo?.mode).eq("formative");

  const nonRootIds = await getAssignmentNonRootIds(sequenceAssignmentId);
  expect(nonRootIds.length).eqls(4);

  content = await getContent({
    contentId: nonRootIds[0],
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Open");
  expect(content.assignmentInfo?.codeValidUntil).eqls(closeAt.toJSDate());
  expect(content.assignmentInfo?.classCode).eq(classCode);
  expect(content.assignmentInfo?.maxAttempts).eq(1);
  expect(content.assignmentInfo?.mode).eq("formative");
});

test("only owner can open, close, modify, or unassign assignment", async () => {
  // Setup
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user2 = await createTestUser();
  const userId2 = user2.userId;
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

  await expect(
    updateContent({
      contentId: contentId,
      name: "Activity 1",
      source: "Some content",
      loggedInUserId: userId2,
    }),
  ).rejects.toThrow("not found");

  const closeAt = DateTime.now().plus({ days: 1 });

  // Only owner can create assignment
  await expect(
    createAssignment({
      contentId: contentId,
      loggedInUserId: userId2,
      closeAt,
      destinationParentId: null,
    }),
  ).rejects.toThrow("not found");

  const { assignmentId } = await createAssignment({
    contentId: contentId,
    loggedInUserId: ownerId,
    closeAt,
    destinationParentId: null,
  });

  await expect(getTestAssignment(assignmentId, userId2)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
  let assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.name).eq("Activity 1");

  // Only owner can rename assignment
  await expect(
    updateContent({
      contentId: assignmentId,
      name: "New Activity",
      loggedInUserId: userId2,
    }),
  ).rejects.toThrow("not found");

  await updateContent({
    contentId: assignmentId,
    name: "New Activity",
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.name).eq("New Activity");

  // Only owner can edit close datetime
  const newCloseAt = DateTime.now().plus({ days: 2 });

  await expect(
    updateAssignmentCloseAt({
      contentId: assignmentId,
      closeAt: newCloseAt,
      loggedInUserId: userId2,
    }),
  ).rejects.toThrow("Record to update not found");
  assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  await updateAssignmentCloseAt({
    contentId: assignmentId,
    closeAt: newCloseAt,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(newCloseAt.toJSDate());

  // Only owner can manually close the assignment
  await expect(
    closeAssignmentWithCode({
      contentId: assignmentId,
      loggedInUserId: userId2,
    }),
  ).rejects.toThrow("Record to update not found");

  await closeAssignmentWithCode({
    contentId: assignmentId,
    loggedInUserId: ownerId,
  });
});

test("cannot assign a descendant of an assignment", async () => {
  const { userId: ownerId } = await createTestUser();

  const [sequenceId, ..._] = await setupTestContent(ownerId, {
    "A problem set": pset({
      "A question bank": qbank({
        "A question": doc("Some content"),
      }),
    }),
  });

  const { assignmentId } = await createAssignment({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    closeAt: DateTime.now().plus({ days: 1 }),
    destinationParentId: null,
  });

  const nonRootIds = await getAssignmentNonRootIds(assignmentId);
  expect(nonRootIds.length).eqls(2);

  // cannot assign the descendants of the assignment sequenceId
  await expect(
    createAssignment({
      contentId: nonRootIds[0],
      loggedInUserId: ownerId,
      closeAt: DateTime.now().plus({ days: 1 }),
      destinationParentId: null,
    }),
  ).rejects.toThrow();

  await expect(
    createAssignment({
      contentId: nonRootIds[1],
      loggedInUserId: ownerId,
      closeAt: DateTime.now().plus({ days: 1 }),
      destinationParentId: null,
    }),
  ).rejects.toThrow();
});

test("cannot assign an ancestor of an assignment", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const [sequenceId, selectId, docId] = await setupTestContent(ownerId, {
    "A problem set": pset({
      "A question bank": qbank({
        "Some question": doc("some content"),
      }),
    }),
  });

  // Create an assignment and put it next to the document
  await createAssignment({
    contentId: docId,
    loggedInUserId: ownerId,
    closeAt: DateTime.now().plus({ days: 1 }),
    destinationParentId: selectId,
  });

  // cannot assign the descendants of the assignment sequenceId
  await expect(
    createAssignment({
      contentId: sequenceId,
      loggedInUserId: ownerId,
      closeAt: DateTime.now().plus({ days: 1 }),
      destinationParentId: null,
    }),
  ).rejects.toThrow();

  await expect(
    createAssignment({
      contentId: selectId,
      loggedInUserId: ownerId,
      closeAt: DateTime.now().plus({ days: 1 }),
      destinationParentId: null,
    }),
  ).rejects.toThrow();
});

test("cannot change closeAt, maxAttempts, mode, individualizeByStudent of a non-root assignment activity", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const [sequenceId, ..._] = await setupTestContent(ownerId, {
    "A problem set": pset({
      "A question bank": qbank({
        "Some question": doc("some content"),
      }),
    }),
  });

  const { assignmentId } = await createAssignment({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    closeAt: DateTime.now().plus({ days: 1 }),
    destinationParentId: null,
  });

  const nonRootIds = await getAssignmentNonRootIds(assignmentId);
  expect(nonRootIds.length).eqls(2);

  const closeAt = DateTime.now().plus({ days: 1 });
  const maxAttempts = 2;
  const mode: AssignmentMode = "summative";
  const individualizeByStudent = true;

  for (const nonRootId of nonRootIds) {
    await expect(
      updateAssignmentCloseAt({
        contentId: nonRootId,
        loggedInUserId: ownerId,
        closeAt,
      }),
    ).rejects.toThrow("not found");

    await expect(
      updateAssignmentMaxAttempts({
        contentId: nonRootId,
        loggedInUserId: ownerId,
        maxAttempts,
      }),
    ).rejects.toThrow();

    await expect(
      updateAssignmentSettings({
        contentId: nonRootId,
        loggedInUserId: ownerId,
        mode,
      }),
    ).rejects.toThrow();

    await expect(
      updateAssignmentSettings({
        contentId: nonRootId,
        loggedInUserId: ownerId,
        individualizeByStudent,
      }),
    ).rejects.toThrow();
  }

  await updateAssignmentCloseAt({
    contentId: assignmentId,
    loggedInUserId: ownerId,
    closeAt,
  });

  await updateAssignmentMaxAttempts({
    contentId: assignmentId,
    loggedInUserId: ownerId,
    maxAttempts,
  });

  const content = await getContent({
    contentId: assignmentId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });

  expect(content.assignmentInfo?.assignmentStatus).eq("Open");
  expect(content.assignmentInfo?.codeValidUntil).eqls(closeAt.toJSDate());
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.mode).eq("formative");
  expect(content.assignmentInfo?.individualizeByStudent).eq(false);
});

// TODO: Is this test still relevant?
test.skip("assignment settings of descendants synchronize when ancestor assigned", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const [sequenceId, selectId, docId] = await setupTestContent(ownerId, {
    "A problem set": pset({
      "A question bank": qbank({
        "Some question": doc("some content"),
      }),
    }),
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

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Unassigned");
  expect(content.assignmentInfo?.maxAttempts).eq(3);
  expect(content.assignmentInfo?.mode).eq("summative");

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Unassigned");
  expect(content.assignmentInfo?.maxAttempts).eq(4);
  expect(content.assignmentInfo?.mode).eq("formative");

  // when assign sequence, all settings synchronize
  await createAssignment({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    closeAt: DateTime.now().plus({ days: 1 }),
    destinationParentId: null,
  });

  content = await getContent({
    contentId: sequenceId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.mode).eq("summative");

  content = await getContent({
    contentId: selectId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.mode).eq("summative");

  content = await getContent({
    contentId: docId,
    loggedInUserId: ownerId,
    includeAssignInfo: true,
  });
  expect(content.assignmentInfo?.assignmentStatus).eq("Closed");
  expect(content.assignmentInfo?.maxAttempts).eq(2);
  expect(content.assignmentInfo?.mode).eq("summative");
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

  const [contentId] = await setupTestContent(ownerId, {
    "Activity 1": doc("Some content"),
  });

  await updateAssignmentSettings({
    contentId,
    loggedInUserId: ownerId,
    mode: "summative",
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { assignmentId, classCode } = await createAssignment({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: null,
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
    contentId: assignmentId,
    loggedInUserId: newUser1.userId,
    variant: 1,
    code: classCode,
    state: null,
  });

  await saveScoreAndState({
    contentId: assignmentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  await testSingleDocResponses({
    contentId: assignmentId,
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
      doenetmlVersion: { fullVersion: "0.7.0-alpha39" },
    },
  });

  // new lower score decreases score
  await saveScoreAndState({
    contentId: assignmentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.2,
    state: "document state 2",
  });

  await testSingleDocResponses({
    contentId: assignmentId,
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
      doenetmlVersion: { fullVersion: "0.7.0-alpha39" },
    },
  });

  // new higher score used
  await saveScoreAndState({
    contentId: assignmentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.7,
    state: "document state 3",
  });

  await testSingleDocResponses({
    contentId: assignmentId,
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
      doenetmlVersion: { fullVersion: "0.7.0-alpha39" },
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
    contentId: assignmentId,
    loggedInUserId: newUser2.userId,
    variant: 1,
    code: classCode,
    state: null,
  });

  await saveScoreAndState({
    contentId: assignmentId,
    code: classCode,
    loggedInUserId: newUser2.userId,
    attemptNumber: 1,
    score: 0.3,
    state: "document state 4",
  });

  // second user's score shows up first due to alphabetical sorting

  await testSingleDocResponses({
    contentId: assignmentId,
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
      doenetmlVersion: { fullVersion: "0.7.0-alpha39" },
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
  const { assignmentId, classCode } = await createAssignment({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: null,
  });

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    loggedInUserId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });

  await createNewAttempt({
    contentId: assignmentId,
    loggedInUserId: newUser1.userId,
    variant: 1,
    code: classCode,
    state: null,
  });

  await saveScoreAndState({
    contentId: assignmentId,
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
        contentId: assignmentId,
        loggedInUserId: ownerId,
      })
    ).scores.length,
  ).eq(1);

  // other user cannot get score data
  await expect(
    getScoresOfAllStudents({
      contentId: assignmentId,
      loggedInUserId: otherUserId,
    }),
  ).rejects.toThrow("not found");

  // student cannot get score data on all of assignment
  await expect(
    getScoresOfAllStudents({
      contentId: assignmentId,
      loggedInUserId: newUser1.userId,
    }),
  ).rejects.toThrow("not found");

  // assignment owner can get data on student
  const studentData = await getAssignmentResponseStudent({
    contentId: assignmentId,
    loggedInUserId: ownerId,
    studentUserId: newUser1.userId,
    shuffledOrder: false,
  });

  // another user cannot get data on student
  await expect(
    getAssignmentResponseStudent({
      contentId: assignmentId,
      loggedInUserId: otherUserId,
      studentUserId: newUser1.userId,
      shuffledOrder: false,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  // student can get own data, except don't get allStudents
  studentData.allStudents = [];
  expect(
    await getAssignmentResponseStudent({
      contentId: assignmentId,
      loggedInUserId: newUser1.userId,
      shuffledOrder: false,
    }),
  ).eqls(studentData);
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
  await createAssignment({
    contentId: contentId1,
    loggedInUserId: user1Id,
    closeAt: DateTime.now().plus({ days: 1 }),
    destinationParentId: null,
  });

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
  const { assignmentId: assignmentId2, classCode: classCode2 } =
    await createAssignment({
      contentId: contentId2,
      loggedInUserId: user2Id,
      closeAt: DateTime.now().plus({ days: 1 }),
      destinationParentId: null,
    });

  assignmentList = await listUserAssigned({ loggedInUserId: user1Id });
  expect(assignmentList.assignments).eqls([]);
  studentData = await getAssignedScores({ loggedInUserId: user1Id });
  expect(studentData.orderedActivityScores).eqls([]);

  await createNewAttempt({
    contentId: assignmentId2,
    code: classCode2,
    variant: 1,
    state: "document state 1",
    loggedInUserId: user1Id,
  });

  // recording score for user1 on assignment2 adds it to user1's assignment list
  await saveScoreAndState({
    contentId: assignmentId2,
    code: classCode2,
    loggedInUserId: user1Id,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  assignmentList = await listUserAssigned({ loggedInUserId: user1Id });
  expect(assignmentList.assignments).toMatchObject([
    {
      contentId: assignmentId2,
      ownerId: user2Id,
    },
  ]);
  studentData = await getAssignedScores({ loggedInUserId: user1Id });
  expect(studentData.orderedActivityScores).eqls([
    { contentId: assignmentId2, activityName: "Activity 2", score: 0.5 },
  ]);
});

test("get all assignment data from anonymous user", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const [contentId] = await setupTestContent(ownerId, {
    "Activity 1": doc("Some content"),
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { assignmentId, classCode } = await createAssignment({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: null,
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
    contentId: assignmentId,
    code: classCode,
    variant: 1,
    state: "document state 1",
    loggedInUserId: newUser1.userId,
  });

  await saveScoreAndState({
    contentId: assignmentId,
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
        contentId: fromUUID(assignmentId),
        score: 0.5,
        activityName: "Activity 1",
      },
    ],
    folder: null,
  });

  // new lower score used
  await saveScoreAndState({
    contentId: assignmentId,
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
        contentId: fromUUID(assignmentId),
        score: 0.2,
        activityName: "Activity 1",
      },
    ],
    folder: null,
  });

  await saveScoreAndState({
    contentId: assignmentId,
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
        contentId: fromUUID(assignmentId),
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

  const [
    baseFolder,
    folder3,
    activity1a,
    _activity3a,
    activity3b,
    activity3c,
    folder1,
    folder1c,
    activity1c1,
    _activity1c3,
    folder1d,
    activity1e,
    activity2,
    activity4,
    _activityNull,
    activityGone,
    activityRoot,
    folder1c2,
    activity1c2a,
    activity1c2b,
    activity1b,
  ] = await setupTestContent(ownerId, {
    "Base folder": fold({
      // Moved to be in order
      "Folder 3": fold({
        // Will move to Folder 1
        "Activity 1a": doc(""),

        "Activity 3a": doc("unassigned"),
        "Activity 3b": doc(""),
        "Activity 3c": doc("deleted"),
      }),
      // Moved to be in order
      "Folder 1": fold({
        "Folder 1c": fold({
          "Activity 1c1": doc(""),
          "Activity 1c3": doc("unassigned"),
        }),
        "Folder 1d": fold({}),
        "Activity 1e": doc(""),
      }),
      "Activity 2": doc(""),
      "Activity 4": doc("deleted"),
    }),
    "Activity null": doc("unassigned"),
    "Activity gone": doc("deleted"),
    "Activity root": doc(""),

    // Will be moved inside folder 1c
    "Folder 1c2": fold({
      "Activity 1c2a": doc(""),
      "Activity 1c2b": doc(""),

      // Will be moved inside folder 1
      "Activity 1b": doc("unassigned"),
    }),
  });

  // create folder 1 after folder 3 and move to make sure it is using sortIndex
  // and not the order content was created
  await moveContent({
    contentId: folder1,
    parentId: baseFolder,
    desiredPosition: 0,
    loggedInUserId: ownerId,
  });
  await moveContent({
    contentId: activity2,
    parentId: baseFolder,
    desiredPosition: 1,
    loggedInUserId: ownerId,
  });

  // move activity 1a to right places
  await moveContent({
    contentId: activity1a,
    parentId: folder1,
    desiredPosition: 0,
    loggedInUserId: ownerId,
  });

  // create folder 1c2 in wrong folder initially
  // after creating its content move folder 1c2 into the right place
  await moveContent({
    contentId: folder1c2,
    parentId: folder1c,
    desiredPosition: 1,
    loggedInUserId: ownerId,
  });

  // create activity 1b in wrong place then move it
  await moveContent({
    contentId: activity1b,
    parentId: folder1,
    desiredPosition: 1,
    loggedInUserId: ownerId,
  });

  // move activity 1e to end of folder 1
  await moveContent({
    contentId: activity1e,
    parentId: folder1,
    desiredPosition: 100,
    loggedInUserId: ownerId,
  });

  await deleteContent({ contentId: activityGone, loggedInUserId: ownerId });
  await deleteContent({ contentId: activity4, loggedInUserId: ownerId });
  await deleteContent({ contentId: activity3c, loggedInUserId: ownerId });

  const closeAt = DateTime.now().plus({ day: 1 });

  async function create(
    contentId: Uint8Array,
    parentId: Uint8Array | null,
  ): Promise<[Uint8Array, string]> {
    const { assignmentId, classCode } = await createAssignment({
      contentId,
      closeAt: closeAt,
      loggedInUserId: ownerId,
      destinationParentId: parentId,
    });
    return [assignmentId, classCode];
  }

  const [assign1aId, classCode1a] = await create(activity1a, folder1);
  const [assign1c1Id, classCode1c1] = await create(activity1c1, folder1c);
  const [assign1c2aId, classCode1c2a] = await create(activity1c2a, folder1c2);
  const [assign1c2bId, classCode1c2b] = await create(activity1c2b, folder1c2);
  const [assign1eId, classCode1e] = await create(activity1e, folder1);
  const [assign2Id, classCode2] = await create(activity2, baseFolder);
  const [assign3bId, classCode3b] = await create(activity3b, folder3);
  const [assignRootId, classCodeRoot] = await create(activityRoot, null);

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
    contentId: assign1aId,
    code: classCode1a,
    loggedInUserId: newUserId,
    state: "document state 1a",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assign1aId,
    code: classCode1a,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.11,
    state: "document state 1a",
  });
  await createNewAttempt({
    contentId: assign1c1Id,
    code: classCode1c1,
    loggedInUserId: newUserId,
    state: "document state 1c1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assign1c1Id,
    code: classCode1c1,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.131,
    state: "document state 1c1",
  });
  await createNewAttempt({
    contentId: assign1c2aId,
    code: classCode1c2a,
    loggedInUserId: newUserId,
    state: "document state 1c2a",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assign1c2aId,
    code: classCode1c2a,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.1321,
    state: "document state 1c2a",
  });
  await createNewAttempt({
    contentId: assign1c2bId,
    code: classCode1c2b,
    loggedInUserId: newUserId,
    state: "document state 1c2b",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assign1c2bId,
    code: classCode1c2b,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.1322,
    state: "document state 1c2b",
  });
  await createNewAttempt({
    contentId: assign1eId,
    code: classCode1e,
    loggedInUserId: newUserId,
    state: "document state 1e",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assign1eId,
    code: classCode1e,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.15,
    state: "document state 1e",
  });
  await createNewAttempt({
    contentId: assign2Id,
    code: classCode2,
    loggedInUserId: newUserId,
    state: "document state 2",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assign2Id,
    code: classCode2,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.2,
    state: "document state 2",
  });
  await createNewAttempt({
    contentId: assign3bId,
    code: classCode3b,
    loggedInUserId: newUserId,
    state: "document state 3b",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assign3bId,
    code: classCode3b,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 0.32,
    state: "document state 3b",
  });
  await createNewAttempt({
    contentId: assignRootId,
    code: classCodeRoot,
    loggedInUserId: newUserId,
    state: "document state Root",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assignRootId,
    code: classCodeRoot,
    loggedInUserId: newUserId,
    attemptNumber: 1,
    score: 1.0,
    state: "document state Root",
  });

  const desiredFolder3 = [
    { contentId: fromUUID(assign3bId), name: "Activity 3b" },
  ];
  const desiredFolder3Scores = [
    {
      contentId: fromUUID(assign3bId),
      score: 0.32,
      user: userInfo,
    },
  ];
  const desiredFolder1c2 = [
    { contentId: fromUUID(assign1c2aId), name: "Activity 1c2a" },
    { contentId: fromUUID(assign1c2bId), name: "Activity 1c2b" },
  ];
  const desiredFolder1c2Scores = [
    {
      contentId: fromUUID(assign1c2aId),
      score: 0.1321,
      user: userInfo,
    },
    {
      contentId: fromUUID(assign1c2bId),
      score: 0.1322,
      user: userInfo,
    },
  ];

  const desiredFolder1c = [
    ...desiredFolder1c2,
    { contentId: fromUUID(assign1c1Id), name: "Activity 1c1" },
  ];
  const desiredFolder1cScores = [
    ...desiredFolder1c2Scores,
    {
      contentId: fromUUID(assign1c1Id),
      score: 0.131,
      user: userInfo,
    },
  ];

  const desiredFolder1 = [
    ...desiredFolder1c,
    { contentId: fromUUID(assign1aId), name: "Activity 1a" },
    { contentId: fromUUID(assign1eId), name: "Activity 1e" },
  ];
  const desiredFolder1Scores = [
    ...desiredFolder1cScores,
    {
      contentId: fromUUID(assign1aId),
      score: 0.11,
      user: userInfo,
    },
    {
      contentId: fromUUID(assign1eId),
      score: 0.15,
      user: userInfo,
    },
  ];

  const desiredBaseFolder = [
    ...desiredFolder1,
    ...desiredFolder3,
    { contentId: fromUUID(assign2Id), name: "Activity 2" },
  ];
  const desiredBaseFolderScores = [
    ...desiredFolder1Scores,
    ...desiredFolder3Scores,
    {
      contentId: fromUUID(assign2Id),
      score: 0.2,
      user: userInfo,
    },
  ];

  const desiredNullFolder = [
    ...desiredBaseFolder,
    { contentId: fromUUID(assignRootId), name: "Activity root" },
  ];
  const desiredNullFolderScores = [
    ...desiredBaseFolderScores,
    {
      contentId: fromUUID(assignRootId),
      score: 1.0,
      user: userInfo,
    },
  ];

  function sortedByScore(array: { score: number }[]) {
    const copy = array.slice();
    copy.sort((a, b) => a.score - b.score);
    return copy;
  }

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
  ).eqls(sortedByScore(desiredNullFolderScores));
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
    parentId: baseFolder,
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
  ).eqls(sortedByScore(desiredBaseFolderScores));
  expect(convertUUID(scoreData.folder?.contentId)).eqls(fromUUID(baseFolder));

  studentData = await getStudentAssignmentScores({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: baseFolder,
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
  expect(convertUUID(studentData.folder?.contentId)).eqls(fromUUID(baseFolder));

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder1,
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
  ).eqls(sortedByScore(desiredFolder1Scores));
  expect(convertUUID(scoreData.folder?.contentId)).eqls(fromUUID(folder1));

  studentData = await getStudentAssignmentScores({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: folder1,
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
  expect(convertUUID(studentData.folder?.contentId)).eqls(fromUUID(folder1));

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder3,
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
  expect(convertUUID(scoreData.folder?.contentId)).eqls(fromUUID(folder3));

  studentData = await getStudentAssignmentScores({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: folder3,
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
  expect(convertUUID(studentData.folder?.contentId)).eqls(fromUUID(folder3));

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder1c,
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
  ).eqls(sortedByScore(desiredFolder1cScores));
  expect(convertUUID(scoreData.folder?.contentId)).eqls(fromUUID(folder1c));

  studentData = await getStudentAssignmentScores({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: folder1c,
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
  expect(convertUUID(studentData.folder?.contentId)).eqls(fromUUID(folder1c));

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folder1d,
  });
  expect(scoreData.orderedActivities).eqls([]);
  expect(scoreData.assignmentScores).eqls([]);
  expect(convertUUID(scoreData.folder?.contentId)).eqls(fromUUID(folder1d));

  studentData = await getStudentAssignmentScores({
    studentUserId: newUserId,
    loggedInUserId: ownerId,
    parentId: folder1d,
  });
  expect(studentData.orderedActivityScores).eqls([]);
  expect(convertUUID(studentData.folder?.contentId)).eqls(fromUUID(folder1d));
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
  const { assignmentId, classCode } = await createAssignment({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: null,
  });

  let scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: null,
  });

  // no one has done the assignment yet
  expect(scoreData.orderedActivities).eqls([
    {
      contentId: assignmentId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
    { contentId: assignmentId, userScores: [] },
  ]);

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
    contentId: assignmentId,
    code: classCode,
    loggedInUserId: newUser1.userId,
    state: "document state 1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assignmentId,
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
      contentId: assignmentId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
    {
      contentId: assignmentId,
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
    contentId: assignmentId,
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
      contentId: assignmentId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
    {
      contentId: assignmentId,
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
    contentId: assignmentId,
    code: classCode,
    loggedInUserId: newUser2.userId,
    state: "document state 3",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assignmentId,
    code: classCode,
    loggedInUserId: newUser2.userId,
    attemptNumber: 1,
    score: 0.3,
    state: "document state 3",
  });

  await saveScoreAndState({
    contentId: assignmentId,
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
      contentId: assignmentId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
    {
      contentId: assignmentId,
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

  const { assignmentId: assignmentId2, classCode: classCode2 } =
    await createAssignment({
      contentId: activity2Id,
      closeAt: closeAt,
      loggedInUserId: ownerId,
      destinationParentId: null,
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
    contentId: assignmentId2,
    code: classCode2,
    loggedInUserId: newUser3.userId,
    state: "document state 1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assignmentId2,
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
      contentId: assignmentId,
      name: "Activity 1",
    },
    {
      contentId: assignmentId2,
      name: "Activity 2",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
    {
      contentId: assignmentId,
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
      contentId: assignmentId2,
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
  await createAssignment({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: null,
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
  await createAssignment({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: null,
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
  const { assignmentId, classCode } = await createAssignment({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: null,
  });

  // create new anonymous user
  const newUser = await createTestAnonymousUser();

  await createNewAttempt({
    contentId: assignmentId,
    code: classCode,
    loggedInUserId: newUser.userId,
    state: "document state 1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assignmentId,
    code: classCode,
    loggedInUserId: newUser.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  // anonymous user can load state
  const retrievedState = await loadState({
    contentId: assignmentId,
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
    contentId: assignmentId,
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
    contentId: assignmentId,
    requestedUserId: newUser.userId,
    loggedInUserId: user2.userId,
    attemptNumber: 1,
  });

  expect(retrievedState3).eqls({ loadedState: false });
});
