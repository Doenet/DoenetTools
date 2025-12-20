import { describe, expect, test } from "vitest";
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
  getAssignmentData,
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
  loadState,
  saveScoreAndState,
} from "../query/scores";
import { getContent } from "../query/activity_edit_view";
import { AssignmentMode } from "@prisma/client";
import { ItemScores, UserInfo } from "../types";
import { getAssignmentNonRootIds } from "./testQueries";
import { createStudentHandleAccounts } from "../query/user";

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
  if (classCode === null) {
    throw new Error("Class code shouldn't be null");
  }
  let assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  let assignmentData = await getAssignmentData({
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

  assignmentData = await getAssignmentData({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignmentOpen).eq(false);
  expect(assignmentData.assignment).eq(null);

  // get same code back if reopen
  closeAt = DateTime.now().plus({ weeks: 3 });
  await updateAssignmentCloseAt({
    contentId: assignmentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  assignmentData = await getAssignmentData({
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
  assignmentData = await getAssignmentData({
    code: classCode,
    loggedInUserId: fakeId,
  });
  expect(assignmentData.assignmentFound).eq(false);

  // reopen with future date
  closeAt = DateTime.now().plus({ years: 1 });
  await updateAssignmentCloseAt({
    contentId: assignmentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  await createNewAttempt({
    contentId: assignmentId,
    loggedInUserId: ownerId,
    variant: 1,
    state: null,
  });

  // add some data
  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: ownerId,
    attemptNumber: 1,
    score: 0.3,
    state: "document state",
    variant: 1,
  });

  // closing assignment doesn't close completely due to the data
  closeDate = new Date();
  await closeAssignmentWithCode({
    contentId: assignmentId,
    loggedInUserId: ownerId,
  });
  assignment = await getTestAssignment(assignmentId, ownerId);
  expect(assignment.classCode).eq(classCode);
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
  if (classCode === null) {
    throw new Error("Class code shouldn't be null");
  }
  const assignment = await getTestAssignment(sequenceAssignmentId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.rootAssignment!.codeValidUntil).eqls(closeAt.toJSDate());

  const assignmentData = await getAssignmentData({
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

test("cannot assign sub-part of problem set", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const [_, docId] = await setupTestContent(ownerId, {
    "A problem set": pset({
      "Some question": doc("some content"),
    }),
  });

  // cannot assign the inner document
  await expect(
    createAssignment({
      contentId: docId,
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
  classCode: number;
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

    const dataFromCode = await getAssignmentData({
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
  if (classCode === null) {
    throw new Error("Class code shouldn't be null");
  }

  const newUser1 = await createTestAnonymousUser();
  const userData1 = {
    userId: newUser1.userId,
    firstNames: newUser1.firstNames,
    lastNames: newUser1.lastNames,
    username: newUser1.username,
  };

  await createNewAttempt({
    contentId: assignmentId,
    loggedInUserId: newUser1.userId,
    variant: 1,
    state: null,
  });

  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
    variant: 1,
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
      doenetmlVersion: { fullVersion: "0.7.0-rc-5" },
    },
  });

  // new lower score decreases score
  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.2,
    state: "document state 2",
    variant: 1,
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
      doenetmlVersion: { fullVersion: "0.7.0-rc-5" },
    },
  });

  // new higher score used
  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.7,
    state: "document state 3",
    variant: 1,
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
      doenetmlVersion: { fullVersion: "0.7.0-rc-5" },
    },
  });

  // second user opens assignment
  const newUser2 = await createTestAnonymousUser();
  const userData2 = {
    userId: newUser2.userId,
    firstNames: newUser2.firstNames,
    lastNames: newUser2.lastNames,
    username: newUser2.username,
  };

  // save state for second user
  await createNewAttempt({
    contentId: assignmentId,
    loggedInUserId: newUser2.userId,
    variant: 1,
    state: null,
  });

  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: newUser2.userId,
    attemptNumber: 1,
    score: 0.3,
    state: "document state 4",
    variant: 1,
  });

  const dataByStudent2 = {
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
  };

  const dataByStudent1 = {
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
  };

  // User data is sorted alphabetically by last name, then first name
  const dataByStudent = [dataByStudent1, dataByStudent2].sort((a, b) => {
    return a.user.lastNames.localeCompare(b.user.lastNames);
  });

  await testSingleDocResponses({
    contentId: assignmentId,
    ownerId,
    dataByStudent,
    classCode,
    source: {
      name: "Activity 1",
      doenetML: "Some content",
      doenetmlVersion: { fullVersion: "0.7.0-rc-5" },
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
  const { assignmentId } = await createAssignment({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: null,
  });

  const newUser1 = await createTestAnonymousUser();

  await createNewAttempt({
    contentId: assignmentId,
    loggedInUserId: newUser1.userId,
    variant: 1,
    state: null,
  });

  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
    variant: 1,
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
  const { assignmentId: assignmentId2 } = await createAssignment({
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
    variant: 1,
    state: "document state 1",
    loggedInUserId: user1Id,
  });

  // recording score for user1 on assignment2 adds it to user1's assignment list
  await saveScoreAndState({
    contentId: assignmentId2,
    loggedInUserId: user1Id,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
    variant: 1,
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
  const { assignmentId } = await createAssignment({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: null,
  });

  const newUser1 = await createTestAnonymousUser();
  const newUser1Info = convertUUID({
    userId: newUser1.userId,
    email: newUser1.email,
    firstNames: newUser1.firstNames,
    lastNames: newUser1.lastNames,
  });

  await createNewAttempt({
    contentId: assignmentId,
    variant: 1,
    state: "document state 1",
    loggedInUserId: newUser1.userId,
  });

  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
    variant: 1,
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
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.2,
    state: "document state 2",
    variant: 1,
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
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.7,
    state: "document state 3",
    variant: 1,
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

test(
  "assignment list is correctly ordered depth-first and by sortIndex",
  { timeout: 100000 },
  async () => {
    const owner = await createTestUser();
    const ownerId = owner.userId;

    const [docId, folder1] = await setupTestContent(ownerId, {
      "my doc": doc("<answer>1</answer>"),
      "Folder 1": fold({
        // These folders and assignments will be created:
        // beforeFolder 2 (assignment)
        // Folder 2
        //  |--> beforeFolder 3 (assignment)
        //  |--> Folder 3
        //  |--> afterFolder 3 (assignment)
        // afterFolder 2 (assignment)
      }),
      // Created on the root level and should NOT be listed:
      // Root assignment
    });

    const closeAt = DateTime.now().plus({ days: 1 });

    async function setupAssignment(
      parentId: Uint8Array | null,
    ): Promise<Uint8Array> {
      const { assignmentId } = await createAssignment({
        contentId: docId,
        closeAt: closeAt,
        loggedInUserId: ownerId,
        destinationParentId: parentId,
      });
      return assignmentId;
    }

    // Root assignment, not listed
    await setupAssignment(null);

    // Inside Folder 1
    const beforeFolder2 = await setupAssignment(folder1);
    const { contentId: folder2 } = await createContent({
      loggedInUserId: ownerId,
      contentType: "folder",
      parentId: folder1,
    });
    const afterFolder2 = await setupAssignment(folder1);

    // Inside Folder 2
    const beforeFolder3 = await setupAssignment(folder2);
    const { contentId: _folder3 } = await createContent({
      loggedInUserId: ownerId,
      contentType: "folder",
      parentId: folder2,
    });
    const afterFolder3 = await setupAssignment(folder2);

    const expectedOrderedAssignments = [
      { contentId: beforeFolder2, name: "my doc" },
      { contentId: beforeFolder3, name: "my doc" },
      { contentId: afterFolder3, name: "my doc" },
      { contentId: afterFolder2, name: "my doc" },
    ];

    const scoreData = await getAllAssignmentScores({
      loggedInUserId: ownerId,
      parentId: folder1,
    });
    expect(scoreData.orderedAssignments).eqls(expectedOrderedAssignments);
  },
);

test("getAllAssignmentScores retrieves ordered assignments, ordered students, and scores", async () => {
  // --- Setup ---
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const [folderId, contentId] = await setupTestContent(ownerId, {
    "Folder 1": fold({
      "Activity 1": doc("Some content"),
    }),
  });
  const closeAt = DateTime.now().plus({ days: 1 });
  const { assignmentId } = await createAssignment({
    contentId,
    closeAt,
    loggedInUserId: ownerId,
    destinationParentId: folderId,
  });

  // --- Test: one assignment, no scores ---
  let scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folderId,
  });
  const expectedScoreData: {
    orderedAssignments: { contentId: Uint8Array; name: string }[];
    scores: (number | null)[][];
    orderedStudents: UserInfo[];
    folder: { contentId: Uint8Array; name: string };
  } = {
    orderedAssignments: [
      {
        contentId: assignmentId,
        name: "Activity 1",
      },
    ],
    scores: [],
    orderedStudents: [],
    folder: {
      contentId: folderId,
      name: "Folder 1",
    },
  };

  expect(scoreData).eqls(expectedScoreData);

  // --- Test: one assignment, one student, one score ---
  const newUser1 = await createTestAnonymousUser("B is after A");
  const newUser1Info = {
    userId: newUser1.userId,
    firstNames: newUser1.firstNames,
    lastNames: newUser1.lastNames,
    username: newUser1.username,
  };
  await createNewAttempt({
    contentId: assignmentId,
    loggedInUserId: newUser1.userId,
    state: "document state 1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
    variant: 1,
  });

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folderId,
  });

  expectedScoreData.orderedStudents = [newUser1Info];
  expectedScoreData.scores = [[0.5]];
  expect(scoreData).eqls(expectedScoreData);

  // --- Test: one assignment, two students, two scores ---
  const newUser2 = await createTestAnonymousUser("A is before B");
  const newUser2Info = {
    userId: newUser2.userId,
    firstNames: newUser2.firstNames,
    lastNames: newUser2.lastNames,
    username: newUser2.username,
  };

  await createNewAttempt({
    contentId: assignmentId,
    loggedInUserId: newUser2.userId,
    state: "document state 3",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: newUser2.userId,
    attemptNumber: 1,
    score: 0.3,
    state: "document state 3",
    variant: 1,
  });

  expectedScoreData.orderedStudents = [newUser2Info, newUser1Info];
  // New student comes first alphabetically
  // New student (user 2) scored 0.3
  // Old student (user 1) scored 0.5 previously
  expectedScoreData.scores = [[0.3], [0.5]];

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folderId,
  });

  expect(scoreData).eqls(expectedScoreData);

  // --- Test: two assignments, two students, 2nd assignment score mssing for first student ---
  const { contentId: activity2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folderId,
  });
  await updateContent({
    contentId: activity2Id,
    name: "Activity 2",
    source: "Some content",
    loggedInUserId: ownerId,
  });

  const { assignmentId: assignmentId2 } = await createAssignment({
    contentId: activity2Id,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: folderId,
  });

  await createNewAttempt({
    contentId: assignmentId2,
    loggedInUserId: newUser1.userId,
    state: "document state 1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assignmentId2,
    loggedInUserId: newUser1.userId,
    attemptNumber: 1,
    score: 0.9,
    state: "document state 1",
    variant: 1,
  });

  expectedScoreData.orderedAssignments.push({
    contentId: assignmentId2,
    name: "Activity 2",
  });
  expectedScoreData.scores = [
    [0.3, null],
    [0.5, 0.9],
  ];

  scoreData = await getAllAssignmentScores({
    loggedInUserId: ownerId,
    parentId: folderId,
  });

  expect(scoreData).eqls(expectedScoreData);
});

test("score for one attempt uses most recent save", async () => {
  const { userId } = await createTestUser();
  const [folderId, contentId] = await setupTestContent(userId, {
    "Folder 1": fold({
      "Activity 1": doc("Some content"),
    }),
  });
  const { assignmentId } = await createAssignment({
    contentId,
    closeAt: DateTime.now().plus({ days: 1 }),
    loggedInUserId: userId,
    destinationParentId: folderId,
  });

  await createNewAttempt({
    contentId: assignmentId,
    loggedInUserId: userId,
    state: "document state 1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: userId,
    attemptNumber: 1,
    score: 0.8,
    state: "document state 2",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: userId,
    attemptNumber: 1,
    score: 0.2,
    state: "document state 3",
    variant: 1,
  });

  const scoreData = await getAllAssignmentScores({
    loggedInUserId: userId,
    parentId: folderId,
  });
  expect(scoreData.scores).eqls([[0.2]]);
});

// Are we allowing this?
test.todo("get student data where two students share the same name");

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
  const { assignmentId } = await createAssignment({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
    destinationParentId: null,
  });

  // create new anonymous user
  const newUser = await createTestAnonymousUser();

  await createNewAttempt({
    contentId: assignmentId,
    loggedInUserId: newUser.userId,
    state: "document state 1",
    variant: 1,
  });
  await saveScoreAndState({
    contentId: assignmentId,
    loggedInUserId: newUser.userId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
    variant: 1,
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

describe("student handles", () => {
  test("outside account cannot be used to take course assignment", async () => {
    const { userId: instructorId } = await createTestUser();

    const [folderId, docId] = await setupTestContent(instructorId, {
      "folder 1": fold({
        "doc 1": doc("hi"),
      }),
    });
    const { assignmentId } = await createAssignment({
      contentId: docId,
      closeAt: DateTime.now().plus({ days: 1 }),
      loggedInUserId: instructorId,
      destinationParentId: folderId,
    });

    // This marks the folder as a class
    await createStudentHandleAccounts({
      loggedInUserId: instructorId,
      folderId,
      numAccounts: 1,
    });

    const { userId: outsideUserId } = await createTestUser();

    await expect(
      createNewAttempt({
        contentId: assignmentId,
        loggedInUserId: outsideUserId,
        variant: 1,
        state: null,
      }),
    ).rejects.toThrow("");
  });

  test("outside account cannot be used to take course assignment, in sub folder", async () => {
    const { userId: instructorId } = await createTestUser();

    const [folderId, subFolderId, docId] = await setupTestContent(
      instructorId,
      {
        "folder 1": fold({
          "folder 2": fold({
            "doc 1": doc("hi"),
          }),
        }),
      },
    );
    const { assignmentId } = await createAssignment({
      contentId: docId,
      closeAt: DateTime.now().plus({ days: 1 }),
      loggedInUserId: instructorId,
      destinationParentId: subFolderId,
    });

    // This marks the folder as a class
    await createStudentHandleAccounts({
      loggedInUserId: instructorId,
      folderId,
      numAccounts: 1,
    });

    const { userId: outsideUserId } = await createTestUser();

    await expect(
      createNewAttempt({
        contentId: assignmentId,
        loggedInUserId: outsideUserId,
        variant: 1,
        state: null,
      }),
    ).rejects.toThrow("");
  });

  test("anonymous account cannot be used to take course assignment", async () => {
    const { userId: instructorId } = await createTestUser();

    const [folderId, docId] = await setupTestContent(instructorId, {
      "folder 1": fold({
        "doc 1": doc("hi"),
      }),
    });
    const { assignmentId } = await createAssignment({
      contentId: docId,
      closeAt: DateTime.now().plus({ days: 1 }),
      loggedInUserId: instructorId,
      destinationParentId: folderId,
    });

    // This marks the folder as a class
    await createStudentHandleAccounts({
      loggedInUserId: instructorId,
      folderId,
      numAccounts: 1,
    });

    const { userId: anonUserId } = await createTestAnonymousUser();

    await expect(
      createNewAttempt({
        contentId: assignmentId,
        loggedInUserId: anonUserId,
        variant: 1,
        state: null,
      }),
    ).rejects.toThrow("");
  });
});
