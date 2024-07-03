import { expect, test, vi } from "vitest";
import {
  copyActivityToFolder,
  createActivity,
  createUser,
  deleteActivity,
  findOrCreateUser,
  getAllDoenetmlVersions,
  getDoc,
  getActivityEditorData,
  getActivityViewerData,
  listUserContent,
  updateDoc,
  searchPublicContent,
  updateContent,
  getActivity,
  assignActivity,
  getAssignment,
  openAssignmentWithCode,
  closeAssignmentWithCode,
  getAssignmentDataFromCode,
  createAnonymousUser,
  updateUser,
  getUserInfo,
  saveScoreAndState,
  getAssignmentScoreData,
  loadState,
  getAssignmentStudentData,
  recordSubmittedEvent,
  getDocumentSubmittedResponses,
  getAnswersThatHaveSubmittedResponses,
  getDocumentSubmittedResponseHistory,
  getStudentData,
  getAllAssignmentScores,
  unassignActivity,
  listUserAssigned,
} from "./model";
import { DateTime } from "luxon";

const EMPTY_DOC_CID =
  "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

// create an isolated user for each test, will allow tests to be run in parallel
async function createTestUser() {
  const username = "vitest-" + new Date().toJSON() + "@vitest.test";
  const user = await findOrCreateUser(username, "vitest user");
  return user;
}

test("New user has no content", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const docs = await listUserContent(userId, userId);
  expect(docs).toStrictEqual({
    content: [],
    name: "vitest user",
    notMe: false,
  });
});

test("Update user name", async () => {
  let user = await createTestUser();
  const userId = user.userId;
  expect(user.name).eq("vitest user");

  user = await updateUser({ userId, name: "New name" });
  expect(user.name).eq("New name");

  const userInfo = await getUserInfo(user.email);
  expect(userInfo.name).eq("New name");
});

test("New activity starts out private, then delete it", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId } = await createActivity(userId);
  const activityContent = await getActivityEditorData(activityId, userId);
  expect(activityContent).toStrictEqual({
    name: "Untitled Activity",
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isAssigned: false,
    stillOpen: false,
    classCode: null,
    codeValidUntil: null,
    documents: [
      {
        source: "",
        name: "Untitled Document",
        doenetmlVersion: {
          id: 2,
          displayedVersion: "0.7",
          fullVersion: "0.7.0-alpha17",
          default: true,
          deprecated: false,
          removed: false,
          deprecationMessage: "",
        },
      },
    ],
  });

  const data = await listUserContent(userId, userId);

  expect(data.content.length).toBe(1);
  expect(data.content[0].isPublic).eq(false);
  expect(data.content[0].isAssigned).eq(false);

  await deleteActivity(activityId, userId);

  await expect(getActivityEditorData(activityId, userId)).rejects.toThrow(
    "No content found",
  );

  const dataAfterDelete = await listUserContent(userId, userId);

  expect(dataAfterDelete.content.length).toBe(0);
});

test("listUserContent returns both public and private activities for a user", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  // User is not the owner
  const user = await createTestUser();
  const userId = user.userId;

  const { activityId: publicActivityId } = await createActivity(ownerId);
  const { activityId: privateActivityId } = await createActivity(ownerId);

  // Make one activity public
  await updateContent({
    id: publicActivityId,
    isPublic: true,
    ownerId,
  });

  const ownerDocs = await listUserContent(ownerId, ownerId);
  expect(ownerDocs.content.length).eq(2);
  expect(ownerDocs).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivityId,
        isPublic: true,
      }),
      expect.objectContaining({
        id: privateActivityId,
        isPublic: false,
      }),
    ]),
  });

  const userDocs = await listUserContent(ownerId, userId);
  expect(userDocs.content.length).eq(1);
  expect(userDocs).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivityId,
        isPublic: true,
      }),
    ]),
  });
});

test("Test updating various activity properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId } = await createActivity(userId);
  const activityName = "Test Name";
  await updateContent({ id: activityId, name: activityName, ownerId: userId });
  const activityContent = await getActivityEditorData(activityId, userId);
  const docId = activityContent.documents[0].id;
  expect(activityContent.name).toBe(activityName);
  const source = "Here comes some content, I made you some content";
  await updateDoc({ id: docId, source, ownerId: userId });
  const activityContent2 = await getActivityEditorData(activityId, userId);
  expect(activityContent2.documents[0].source).toBe(source);

  const activityViewerContent = await getActivityViewerData(activityId, userId);
  expect(activityViewerContent.activity.name).toBe(activityName);
  expect(activityViewerContent.doc.source).toBe(source);
});

test("deleteActivity marks a activity and document as deleted and prevents its retrieval", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId, docId } = await createActivity(userId);

  // activity can be retrieved
  await getActivity(activityId);
  await getActivityViewerData(activityId, userId);
  await getActivityEditorData(activityId, userId);
  await getDoc(docId);

  const deleteResult = await deleteActivity(activityId, userId);
  expect(deleteResult.isDeleted).toBe(true);

  // cannot retrieve activity
  await expect(getActivity(activityId)).rejects.toThrow("No content found");
  await expect(getActivityViewerData(activityId, userId)).rejects.toThrow(
    "No content found",
  );
  await expect(getActivityEditorData(activityId, userId)).rejects.toThrow(
    "No content found",
  );
  await expect(getDoc(docId)).rejects.toThrow("No documents found");
});

test("only owner can delete an activity", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;
  const { activityId, docId } = await createActivity(ownerId);

  await expect(deleteActivity(activityId, user2Id)).rejects.toThrow(
    "Record to update not found",
  );

  const deleteResult = await deleteActivity(activityId, ownerId);
  expect(deleteResult.isDeleted).toBe(true);
});

test("updateDoc updates document properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId, docId } = await createActivity(userId);
  const newName = "Updated Name";
  const newContent = "Updated Content";
  await updateContent({ id: activityId, name: newName, ownerId: userId });
  await updateDoc({
    id: docId,
    source: newContent,
    ownerId: userId,
  });
  const activityViewerContent = await getActivityViewerData(activityId, userId);
  expect(activityViewerContent.activity.name).toBe(newName);
  expect(activityViewerContent.doc.source).toBe(newContent);
});

test("copyActivityToFolder copies a public document to a new owner", async () => {
  const originalOwnerId = (await createTestUser()).userId;
  const newOwnerId = (await createTestUser()).userId;
  const { activityId, docId } = await createActivity(originalOwnerId);
  // cannot copy if not yet public
  await expect(copyActivityToFolder(activityId, newOwnerId)).rejects.toThrow(
    "No content found",
  );

  // Make the activity public before copying
  await updateContent({
    id: activityId,
    isPublic: true,
    ownerId: originalOwnerId,
  });
  const newActivityId = await copyActivityToFolder(activityId, newOwnerId);
  const newActivity = await getActivity(newActivityId);
  expect(newActivity.ownerId).toBe(newOwnerId);
  expect(newActivity.isPublic).toBe(false);

  const activityData = await getActivityViewerData(newActivityId, newOwnerId);

  const contribHist = activityData.doc.contributorHistory;
  expect(contribHist.length).eq(1);

  expect(contribHist[0].prevDocId).eq(docId);
  expect(contribHist[0].prevDocVersionNum).eq(1);
});

test("copyActivityToFolder remixes correct versions", async () => {
  const ownerId1 = (await createTestUser()).userId;
  const ownerId2 = (await createTestUser()).userId;
  const ownerId3 = (await createTestUser()).userId;

  // create activity 1 by owner 1
  const { activityId: activityId1, docId: docId1 } =
    await createActivity(ownerId1);
  const activity1Content = "<p>Hello!</p>";
  await updateContent({
    id: activityId1,
    isPublic: true,
    ownerId: ownerId1,
  });
  await updateDoc({
    id: docId1,
    source: activity1Content,
    ownerId: ownerId1,
  });

  // copy activity 1 to owner 2's portfolio
  const activityId2 = await copyActivityToFolder(activityId1, ownerId2);
  const activity2 = await getActivity(activityId2);
  expect(activity2.ownerId).toBe(ownerId2);
  expect(activity2.documents[0].source).eq(activity1Content);

  // history should be version 1 of activity 1
  const activityData2 = await getActivityViewerData(activityId2, ownerId2);
  const contribHist2 = activityData2.doc.contributorHistory;
  expect(contribHist2.length).eq(1);
  expect(contribHist2[0].prevDocId).eq(docId1);
  expect(contribHist2[0].prevDocVersionNum).eq(1);

  // modify activity 1 so that will have a new version
  const activity1ContentModified = "<p>Bye</p>";
  await updateDoc({
    id: docId1,
    source: activity1ContentModified,
    ownerId: ownerId1,
  });

  // copy activity 1 to owner 3's portfolio
  const activityId3 = await copyActivityToFolder(activityId1, ownerId3);

  const activity3 = await getActivity(activityId3);
  expect(activity3.ownerId).toBe(ownerId3);
  expect(activity3.documents[0].source).eq(activity1ContentModified);

  // history should be version 2 of activity 1
  const activityData3 = await getActivityViewerData(activityId3, ownerId3);
  const contribHist3 = activityData3.doc.contributorHistory;
  expect(contribHist3.length).eq(1);
  expect(contribHist3[0].prevDocId).eq(docId1);
  expect(contribHist3[0].prevDocVersionNum).eq(2);
});

// TODO: add folders
test("searchPublicContent returns activities matching the query", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  // Make the document public and give it a unique name for the test
  const uniqueName = "UniqueNameForSearchTest";
  await updateContent({
    id: activityId,
    name: uniqueName,
    isPublic: true,
    ownerId,
  });
  const searchResults = await searchPublicContent(uniqueName);
  expect(searchResults).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: uniqueName,
      }),
    ]),
  );
});

test("findOrCreateUser finds an existing user or creates a new one", async () => {
  const email = `unique-${Date.now()}@example.com`;
  const name = "vitest user";
  const user = await findOrCreateUser(email, name);
  expect(user.userId).toBeTypeOf("number");
  // Attempt to find the same user again
  const sameUser = await findOrCreateUser(email, name);
  expect(sameUser).toStrictEqual(user);
});

test("getAllDoenetmlVersions retrieves all non-removed versions", async () => {
  const allVersions = await getAllDoenetmlVersions();
  expect(allVersions).toBeInstanceOf(Array);
  // there should be at least one version
  expect(allVersions.length).toBeGreaterThan(0);
  // Ensure none of the versions are marked as removed
  allVersions.forEach((version) => {
    expect(version.removed).toBe(false);
  });
});

test("deleteActivity prevents a document from being retrieved", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  await deleteActivity(activityId, ownerId);
  await expect(getActivity(activityId)).rejects.toThrow("No content found");
});

test("updateContent does not update properties when passed undefined values", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  const originalActivity = await getActivity(activityId);
  await updateContent({ id: activityId, ownerId });
  const updatedActivity = await getActivity(activityId);
  expect(updatedActivity).toEqual(originalActivity);
});

test("assign an activity", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  const activity = await getActivity(activityId);
  await updateContent({ id: activityId, name: "Activity 1", ownerId });
  await updateDoc({
    id: activity.documents[0].id,
    source: "Some content",
    ownerId,
  });

  await assignActivity(activityId, ownerId);
  const assignment = await getAssignment(activityId, ownerId);

  expect(assignment.id).eq(activityId);
  expect(assignment.name).eq("Activity 1");
  expect(assignment.documents.length).eq(1);
  expect(assignment.documents[0].assignedVersion!.source).eq("Some content");

  // changing name of activity does change assignment name
  await updateContent({ id: activityId, name: "Activity 1a", ownerId });
  let updatedActivity = await getActivity(activityId);
  expect(updatedActivity.name).eq("Activity 1a");

  let updatedAssignment = await getAssignment(activityId, ownerId);
  expect(updatedAssignment.name).eq("Activity 1a");

  // cannot change content of activity
  await expect(
    updateDoc({
      id: activity.documents[0].id,
      source: "Some amended content",
      ownerId,
    }),
  ).rejects.toThrow("Cannot change source of assigned document");

  updatedActivity = await getActivity(activityId);
  expect(updatedActivity.documents[0].source).eq("Some content");

  updatedAssignment = await getAssignment(activityId, ownerId);
  expect(updatedAssignment.documents[0].assignedVersion!.source).eq(
    "Some content",
  );
});

test("cannot assign other user's activity", async () => {
  const ownerId1 = (await createTestUser()).userId;
  const ownerId2 = (await createTestUser()).userId;
  const { activityId } = await createActivity(ownerId1);
  const activity = await getActivity(activityId);
  await updateContent({
    id: activityId,
    name: "Activity 1",
    ownerId: ownerId1,
  });
  await updateDoc({
    id: activity.documents[0].id,
    source: "Some content",
    ownerId: ownerId1,
  });

  await expect(assignActivity(activityId, ownerId2)).rejects.toThrow(
    "No content found",
  );

  // still cannot create assignment even if activity is made public
  await updateContent({ id: activityId, isPublic: true, ownerId: ownerId1 });

  await expect(assignActivity(activityId, ownerId2)).rejects.toThrow(
    "No content found",
  );
});

test("open and close assignment with code", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  const activity = await getActivity(activityId);
  await updateContent({ id: activityId, name: "Activity 1", ownerId });
  await updateDoc({
    id: activity.documents[0].id,
    source: "Some content",
    ownerId,
  });

  await assignActivity(activityId, ownerId);
  let assignment = await getAssignment(activityId, ownerId);

  expect(assignment.classCode).eq(null);
  expect(assignment.codeValidUntil).eq(null);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );
  assignment = await getAssignment(activityId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  let assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.id).eq(activityId);
  expect(assignmentData.assignment!.classCode).eq(classCode);
  expect(assignmentData.assignment!.codeValidUntil).eqls(closeAt.toJSDate());
  expect(assignmentData.assignment!.documents[0].assignedVersion!.source).eq(
    "Some content",
  );

  await closeAssignmentWithCode(activityId, ownerId);
  assignment = await getAssignment(activityId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(null);

  assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);

  // get same code back if reopen
  closeAt = DateTime.now().plus({ weeks: 3 });
  const { classCode: classCode2 } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );
  expect(classCode2).eq(classCode);
  assignment = await getAssignment(activityId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.id).eq(activityId);
  expect(assignmentData.assignment!.classCode).eq(classCode);
  expect(assignmentData.assignment!.codeValidUntil).eqls(closeAt.toJSDate());

  // Open with past date.
  // Currently, says assignment is not found
  // TODO: if we want students who have previously joined the assignment to be able to reload the page,
  // then this should still retrieve data for those students.
  closeAt = DateTime.now().plus({ seconds: -7 });
  await openAssignmentWithCode(activityId, closeAt, ownerId);
  assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);
});

test("open and unassign assignment with code", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  const activity = await getActivity(activityId);
  await updateContent({ id: activityId, name: "Activity 1", ownerId });
  await updateDoc({
    id: activity.documents[0].id,
    source: "Some content",
    ownerId,
  });

  await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  let assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.id).eq(activityId);
  expect(assignmentData.assignment!.classCode).eq(classCode);
  expect(assignmentData.assignment!.codeValidUntil).eqls(closeAt.toJSDate());

  // unassign activity
  await unassignActivity(activityId, ownerId);
  await expect(getAssignment(activityId, ownerId)).rejects.toThrow(
    "No content found",
  );

  // Getting deleted assignment by code fails
  assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);

  // cannot unassign again
  await expect(unassignActivity(activityId, ownerId)).rejects.toThrow(
    "Record to update not found",
  );
});

test("only owner can open, close, modify, or unassign assignment", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user2 = await createTestUser();
  const userId2 = user2.userId;
  const { activityId } = await createActivity(ownerId);
  const activity = await getActivity(activityId);

  await expect(
    updateContent({ id: activityId, name: "Activity 1", ownerId: userId2 }),
  ).rejects.toThrow("Record to update not found");
  await expect(
    updateDoc({
      id: activity.documents[0].id,
      source: "Some content",
      ownerId: userId2,
    }),
  ).rejects.toThrow("Record to update not found");

  await updateContent({ id: activityId, name: "Activity 1", ownerId });
  await updateDoc({
    id: activity.documents[0].id,
    source: "Some content",
    ownerId,
  });

  await expect(assignActivity(activityId, userId2)).rejects.toThrow(
    "No content found",
  );

  await assignActivity(activityId, ownerId);

  await expect(getAssignment(activityId, userId2)).rejects.toThrow(
    "No content found",
  );

  let assignment = await getAssignment(activityId, ownerId);
  expect(assignment.name).eq("Activity 1");

  await expect(
    updateContent({ id: activityId, name: "New Activity", ownerId: userId2 }),
  ).rejects.toThrow("Record to update not found");

  await updateContent({ id: activityId, name: "New Activity", ownerId });
  assignment = await getAssignment(activityId, ownerId);
  expect(assignment.name).eq("New Activity");

  let closeAt = DateTime.now().plus({ days: 1 });

  await expect(
    openAssignmentWithCode(activityId, closeAt, userId2),
  ).rejects.toThrow("No content found");

  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  await expect(closeAssignmentWithCode(activityId, userId2)).rejects.toThrow(
    "Record to update not found",
  );

  await closeAssignmentWithCode(activityId, ownerId);

  await expect(unassignActivity(activityId, userId2)).rejects.toThrow(
    "Record to update not found",
  );
  await unassignActivity(activityId, ownerId);
});

test("create anonymous users", async () => {
  // create an anonymous user
  const user1 = await createAnonymousUser();
  expect(user1.anonymous).eq(true);

  // create another anonymous user
  const user2 = await createAnonymousUser();
  expect(user2.anonymous).eq(true);
  expect(user1.userId).not.eq(user2.userId);
});

test("assignment data with code create anonymous user when not signed in", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  const activity = await getActivity(activityId);
  await updateContent({ id: activityId, name: "Activity 1", ownerId });
  await updateDoc({
    id: activity.documents[0].id,
    source: "Some content",
    ownerId,
  });

  await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  expect(assignmentData.assignmentFound).eq(true);

  // created new anonymous user since weren't logged in
  const newUser1 = assignmentData.newAnonymousUser;
  expect(newUser1!.anonymous).eq(true);

  // don't get new user if assignment is closed
  await closeAssignmentWithCode(activityId, ownerId);
  assignmentData = await getAssignmentDataFromCode(classCode, false);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.newAnonymousUser).eq(null);

  // reopen and get another user if load again when not logged in
  closeAt = DateTime.now().plus({ weeks: 3 });
  await openAssignmentWithCode(activityId, closeAt, ownerId);
  assignmentData = await getAssignmentDataFromCode(classCode, false);
  expect(assignmentData.assignmentFound).eq(true);
  const newUser2 = assignmentData.newAnonymousUser;
  expect(newUser2!.anonymous).eq(true);
  expect(newUser2!.userId).not.eq(newUser1!.userId);
});

test("get assignment data from anonymous users", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId);
  await updateContent({ id: activityId, name: "Activity 1", ownerId });
  await updateDoc({
    id: docId,
    source: "Some content",
    ownerId,
  });

  await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  let newUser1 = assignmentData.newAnonymousUser;
  newUser1 = await updateUser({
    userId: newUser1!.userId,
    name: "Zoe Zaborowski",
  });
  const userData1 = { userId: newUser1!.userId, name: newUser1!.name };

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  let assignmentWithScores = await getAssignmentScoreData({
    activityId,
    ownerId,
  });

  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.5, user: userData1 }],
  });

  let assignmentStudentData = await getAssignmentStudentData({
    activityId,
    ownerId,
    userId: newUser1!.userId,
  });

  expect(assignmentStudentData).eqls({
    activityId,
    userId: newUser1!.userId,
    score: 0.5,
    activity: {
      name: "Activity 1",
      documents: [
        {
          assignedVersion: {
            docId,
            versionNum: 1,
            source: "Some content",
            doenetmlVersion: { fullVersion: "0.7.0-alpha17" },
          },
        },
      ],
    },
    user: { name: "Zoe Zaborowski" },
    documentScores: [
      {
        docId,
        docVersionNum: 1,
        hasMaxScore: true,
        score: 0.5,
      },
    ],
  });

  // new lower score ignored
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1!.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });
  assignmentWithScores = await getAssignmentScoreData({
    activityId,
    ownerId,
  });
  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.5, user: userData1 }],
  });

  assignmentStudentData = await getAssignmentStudentData({
    activityId,
    ownerId,
    userId: newUser1!.userId,
  });

  expect(assignmentStudentData).eqls({
    activityId,
    userId: newUser1!.userId,
    score: 0.5,
    activity: {
      name: "Activity 1",
      documents: [
        {
          assignedVersion: {
            docId,
            versionNum: 1,
            source: "Some content",
            doenetmlVersion: { fullVersion: "0.7.0-alpha17" },
          },
        },
      ],
    },
    user: { name: "Zoe Zaborowski" },
    documentScores: [
      {
        docId,
        docVersionNum: 1,
        hasMaxScore: false,
        score: 0.2,
      },
      {
        docId,
        docVersionNum: 1,
        hasMaxScore: true,
        score: 0.5,
      },
    ],
  });

  // new higher score used
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1!.userId,
    score: 0.7,
    onSubmission: true,
    state: "document state 3",
  });
  assignmentWithScores = await getAssignmentScoreData({
    activityId,
    ownerId,
  });
  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.7, user: userData1 }],
  });

  assignmentStudentData = await getAssignmentStudentData({
    activityId,
    ownerId,
    userId: newUser1!.userId,
  });

  expect(assignmentStudentData).eqls({
    activityId,
    userId: newUser1!.userId,
    score: 0.7,
    activity: {
      name: "Activity 1",
      documents: [
        {
          assignedVersion: {
            docId,
            versionNum: 1,
            source: "Some content",
            doenetmlVersion: { fullVersion: "0.7.0-alpha17" },
          },
        },
      ],
    },
    user: { name: "Zoe Zaborowski" },
    documentScores: [
      {
        docId,
        docVersionNum: 1,
        hasMaxScore: true,
        score: 0.7,
      },
    ],
  });

  // second user opens assignment
  assignmentData = await getAssignmentDataFromCode(classCode, false);

  let newUser2 = assignmentData.newAnonymousUser;
  newUser2 = await updateUser({
    userId: newUser2!.userId,
    name: "Arya Abbas",
  });
  const userData2 = { userId: newUser2!.userId, name: newUser2!.name };

  // assignment scores still unchanged
  assignmentWithScores = await getAssignmentScoreData({
    activityId,
    ownerId,
  });
  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.7, user: userData1 }],
  });

  // save state for second user
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser2!.userId,
    score: 0.3,
    onSubmission: true,
    state: "document state 4",
  });

  // second user's score shows up first due to alphabetical sorting
  assignmentWithScores = await getAssignmentScoreData({
    activityId,
    ownerId,
  });
  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [
      { score: 0.3, user: userData2 },
      { score: 0.7, user: userData1 },
    ],
  });

  assignmentStudentData = await getAssignmentStudentData({
    activityId,
    ownerId,
    userId: newUser2!.userId,
  });

  expect(assignmentStudentData).eqls({
    activityId,
    userId: newUser2!.userId,
    score: 0.3,
    activity: {
      name: "Activity 1",
      documents: [
        {
          assignedVersion: {
            docId,
            versionNum: 1,
            source: "Some content",
            doenetmlVersion: { fullVersion: "0.7.0-alpha17" },
          },
        },
      ],
    },
    user: { name: "Arya Abbas" },
    documentScores: [
      {
        docId,
        docVersionNum: 1,
        hasMaxScore: true,
        score: 0.3,
      },
    ],
  });
});

test("can't get assignment data if other user", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const otherUser = await createTestUser();
  const otherUserId = otherUser.userId;
  const { activityId, docId } = await createActivity(ownerId);
  await assignActivity(activityId, ownerId);

  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  let newUser1 = assignmentData.newAnonymousUser;
  newUser1 = await updateUser({
    userId: newUser1!.userId,
    name: "Zoe Zaborowski",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  await getAssignmentScoreData({
    activityId,
    ownerId,
  });

  await expect(
    getAssignmentScoreData({
      activityId,
      ownerId: otherUserId,
    }),
  ).rejects.toThrow("No content found");

  await getAssignmentStudentData({
    activityId,
    ownerId,
    userId: newUser1!.userId,
  });

  await expect(
    getAssignmentStudentData({
      activityId,
      ownerId: otherUserId,
      userId: newUser1!.userId,
    }),
  ).rejects.toThrow("No assignmentScores found");
});

test("can't get assignment data if unassigned", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId);
  await assignActivity(activityId, ownerId);

  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  let newUser1 = assignmentData.newAnonymousUser;
  newUser1 = await updateUser({
    userId: newUser1!.userId,
    name: "Zoe Zaborowski",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  await getAssignmentScoreData({
    activityId,
    ownerId,
  });

  await getAssignmentStudentData({
    activityId,
    ownerId,
    userId: newUser1!.userId,
  });

  await unassignActivity(activityId, ownerId);

  await expect(
    getAssignmentScoreData({
      activityId,
      ownerId,
    }),
  ).rejects.toThrow("No content found");

  await expect(
    getAssignmentStudentData({
      activityId,
      ownerId,
      userId: newUser1!.userId,
    }),
  ).rejects.toThrow("No assignmentScores found");
});

test("get activity editor data only if owner", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const otherUser = await createTestUser();
  const otherUserId = otherUser.userId;
  const { activityId } = await createActivity(ownerId);

  await getActivityEditorData(activityId, ownerId);

  await expect(getActivityEditorData(activityId, otherUserId)).rejects.toThrow(
    "No content found",
  );
});

test("only user and assignment owner can load document state", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId);
  await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  // create new anonymous user
  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  let newUser = assignmentData.newAnonymousUser;

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  // anonymous user can load state
  let retrievedState = await loadState({
    activityId,
    docId,
    docVersionNum: 1,
    requestedUserId: newUser!.userId,
    userId: newUser!.userId,
    withMaxScore: false,
  });

  expect(retrievedState).eq("document state 1");

  // assignment owner can load state
  let retrievedState2 = await loadState({
    activityId,
    docId,
    docVersionNum: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: false,
  });

  expect(retrievedState2).eq("document state 1");

  // another user cannot load state
  const user2 = await createTestUser();

  await expect(
    loadState({
      activityId,
      docId,
      docVersionNum: 1,
      requestedUserId: newUser!.userId,
      userId: user2.userId,
      withMaxScore: false,
    }),
  ).rejects.toThrow("No content found");
});

test("load document state based on withMaxScore", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId);
  await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  // create new anonymous user
  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  let newUser = assignmentData.newAnonymousUser;

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  // since last state is maximum score, withMaxScore doesn't have effect
  let retrievedState = await loadState({
    activityId,
    docId,
    docVersionNum: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 1");

  retrievedState = await loadState({
    activityId,
    docId,
    docVersionNum: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: true,
  });
  expect(retrievedState).eq("document state 1");

  // last state is no longer maximum score
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser!.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });

  // get last state if withMaxScore is false
  retrievedState = await loadState({
    activityId,
    docId,
    docVersionNum: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 2");

  // get state with max score
  retrievedState = await loadState({
    activityId,
    docId,
    docVersionNum: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: true,
  });
  expect(retrievedState).eq("document state 1");

  // matching maximum score with onSubmission uses latest for maximum
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 3",
  });

  retrievedState = await loadState({
    activityId,
    docId,
    docVersionNum: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 3");

  retrievedState = await loadState({
    activityId,
    docId,
    docVersionNum: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: true,
  });
  expect(retrievedState).eq("document state 3");

  // matching maximum score without onSubmission does not use latest for maximum
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser!.userId,
    score: 0.5,
    onSubmission: false,
    state: "document state 4",
  });

  retrievedState = await loadState({
    activityId,
    docId,
    docVersionNum: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 4");

  retrievedState = await loadState({
    activityId,
    docId,
    docVersionNum: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: true,
  });
  expect(retrievedState).eq("document state 3");
});

test("record submitted events and get responses", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId);
  await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  // create new anonymous user
  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  let newUser = assignmentData.newAnonymousUser;
  let userData = { userId: newUser!.userId, name: newUser!.name };

  let answerId1 = "answer1";
  let answerId2 = "answer2";

  // no submitted responses at first
  let answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    activityId,
    ownerId,
  });
  expect(answerWithResponses).eqls([]);

  let submittedResponses = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  });
  expect(submittedResponses).eqls([]);

  let submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
    userId: newUser!.userId,
  });
  expect(submittedResponseHistory).eqls([]);

  // record event and retrieve it
  await recordSubmittedEvent({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser!.userId,
    answerId: answerId1,
    response: "Answer result 1",
    answerNumber: 1,
    itemNumber: 2,
    creditAchieved: 0.4,
    itemCreditAchieved: 0.2,
    documentCreditAchieved: 0.1,
  });
  answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    activityId,
    ownerId,
  });
  expect(answerWithResponses).eqls([
    {
      docId,
      docVersionNum: 1,
      answerId: answerId1,
      answerNumber: 1,
      count: 1,
      averageCredit: 0.4,
    },
  ]);
  submittedResponses = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  });
  expect(submittedResponses).toMatchObject([
    {
      userId: newUser!.userId,
      userName: newUser!.name,
      bestResponse: "Answer result 1",
      bestCreditAchieved: 0.4,
      latestResponse: "Answer result 1",
      latestCreditAchieved: 0.4,
      numResponses: 1,
    },
  ]);
  submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
    userId: newUser!.userId,
  });
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData,
      response: "Answer result 1",
      creditAchieved: 0.4,
    },
  ]);

  // record new event overwrites result
  await recordSubmittedEvent({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser!.userId,
    answerId: answerId1,
    response: "Answer result 2",
    answerNumber: 1,
    itemNumber: 2,
    creditAchieved: 0.8,
    itemCreditAchieved: 0.4,
    documentCreditAchieved: 0.2,
  });
  answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    activityId,
    ownerId,
  });
  expect(answerWithResponses).eqls([
    {
      docId,
      docVersionNum: 1,
      answerId: answerId1,
      answerNumber: 1,
      count: 1,
      averageCredit: 0.8,
    },
  ]);
  submittedResponses = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  });
  expect(submittedResponses).toMatchObject([
    {
      userId: newUser!.userId,
      userName: newUser!.name,
      bestResponse: "Answer result 2",
      bestCreditAchieved: 0.8,
      latestResponse: "Answer result 2",
      latestCreditAchieved: 0.8,
      numResponses: 2,
    },
  ]);
  submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
    userId: newUser!.userId,
  });
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
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser!.userId,
    answerId: answerId2,
    response: "Answer result 3",
    answerNumber: 2,
    itemNumber: 2,
    creditAchieved: 0.2,
    itemCreditAchieved: 0.1,
    documentCreditAchieved: 0.05,
  });
  answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    activityId,
    ownerId,
  });
  // Note: use `arrayContaining` as the order of the entries isn't determined
  expect(answerWithResponses).toMatchObject(
    expect.arrayContaining([
      {
        docId,
        docVersionNum: 1,
        answerId: answerId1,
        answerNumber: 1,
        count: 1,
        averageCredit: 0.8,
      },
      {
        docId,
        docVersionNum: 1,
        answerId: answerId2,
        answerNumber: 2,
        count: 1,
        averageCredit: 0.2,
      },
    ]),
  );
  submittedResponses = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  });
  expect(submittedResponses).toMatchObject([
    {
      userId: newUser!.userId,
      userName: newUser!.name,
      bestResponse: "Answer result 2",
      bestCreditAchieved: 0.8,
      latestResponse: "Answer result 2",
      latestCreditAchieved: 0.8,
      numResponses: 2,
    },
  ]);
  submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
    userId: newUser!.userId,
  });
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

  submittedResponses = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId2,
  });
  expect(submittedResponses).toMatchObject([
    {
      userId: newUser!.userId,
      userName: newUser!.name,
      bestResponse: "Answer result 3",
      bestCreditAchieved: 0.2,
      latestResponse: "Answer result 3",
      latestCreditAchieved: 0.2,
      numResponses: 1,
    },
  ]);
  submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId2,
    userId: newUser!.userId,
  });
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData,
      response: "Answer result 3",
      creditAchieved: 0.2,
    },
  ]);

  // response for a second user
  assignmentData = await getAssignmentDataFromCode(classCode, false);
  let newUser2 = assignmentData.newAnonymousUser;
  let userData2 = { userId: newUser2!.userId, name: newUser2!.name };
  await recordSubmittedEvent({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser2!.userId,
    answerId: answerId1,
    response: "Answer result 4",
    answerNumber: 1,
    itemNumber: 2,
    creditAchieved: 1,
    itemCreditAchieved: 0.5,
    documentCreditAchieved: 0.25,
  });
  answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    activityId,
    ownerId,
  });
  expect(answerWithResponses).toMatchObject(
    expect.arrayContaining([
      {
        docId,
        docVersionNum: 1,
        answerId: answerId1,
        answerNumber: 1,
        count: 2,
        averageCredit: 0.9,
      },
      {
        docId,
        docVersionNum: 1,
        answerId: answerId2,
        answerNumber: 2,
        count: 1,
        averageCredit: 0.2,
      },
    ]),
  );
  submittedResponses = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  });
  expect(submittedResponses).toMatchObject([
    {
      userId: newUser!.userId,
      userName: newUser!.name,
      bestResponse: "Answer result 2",
      bestCreditAchieved: 0.8,
      latestResponse: "Answer result 2",
      latestCreditAchieved: 0.8,
      numResponses: 2,
    },
    {
      userId: newUser2!.userId,
      userName: newUser2!.name,
      bestResponse: "Answer result 4",
      bestCreditAchieved: 1,
      latestResponse: "Answer result 4",
      latestCreditAchieved: 1,
      numResponses: 1,
    },
  ]);

  submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
    userId: newUser!.userId,
  });
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
  submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
    userId: newUser2!.userId,
  });
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData2,
      response: "Answer result 4",
      creditAchieved: 1,
    },
  ]);

  submittedResponses = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId2,
  });
  expect(submittedResponses).toMatchObject([
    {
      userId: newUser!.userId,
      userName: newUser!.name,
      bestResponse: "Answer result 3",
      bestCreditAchieved: 0.2,
      latestResponse: "Answer result 3",
      latestCreditAchieved: 0.2,
      numResponses: 1,
    },
  ]);
  submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId2,
    userId: newUser!.userId,
  });
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData,
      response: "Answer result 3",
      creditAchieved: 0.2,
    },
  ]);
  submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId2,
    userId: newUser2!.userId,
  });
  expect(submittedResponseHistory).eqls([]);

  // verify submitted responses changes but average max credit doesn't change if submit a lower credit answer
  await recordSubmittedEvent({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser2!.userId,
    answerId: answerId1,
    response: "Answer result 5",
    answerNumber: 1,
    itemNumber: 2,
    creditAchieved: 0.6,
    itemCreditAchieved: 0.3,
    documentCreditAchieved: 0.15,
  });

  submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
    userId: newUser2!.userId,
  });
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

  submittedResponses = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  });
  expect(submittedResponses).toMatchObject([
    {
      userId: newUser!.userId,
      userName: newUser!.name,
      bestResponse: "Answer result 2",
      bestCreditAchieved: 0.8,
      latestResponse: "Answer result 2",
      latestCreditAchieved: 0.8,
      numResponses: 2,
    },
    {
      userId: newUser2!.userId,
      userName: newUser2!.name,
      bestResponse: "Answer result 4",
      bestCreditAchieved: 1,
      latestResponse: "Answer result 5",
      latestCreditAchieved: 0.6,
      numResponses: 2,
    },
  ]);
  answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    activityId,
    ownerId,
  });
  expect(answerWithResponses).toMatchObject(
    expect.arrayContaining([
      {
        docId,
        docVersionNum: 1,
        answerId: answerId1,
        answerNumber: 1,
        count: 2,
        averageCredit: 0.9,
      },
      {
        docId,
        docVersionNum: 1,
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
  const { activityId, docId } = await createActivity(ownerId);
  await assignActivity(activityId, ownerId);

  const user2 = await createTestUser();
  const userId2 = user2.userId;

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  // create new anonymous user
  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  let newUser = assignmentData.newAnonymousUser;
  let userData = { userId: newUser!.userId, name: newUser!.name };

  let answerId1 = "answer1";

  // record event and retrieve it
  await recordSubmittedEvent({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser!.userId,
    answerId: answerId1,
    response: "Answer result 1",
    answerNumber: 1,
    itemNumber: 2,
    creditAchieved: 1,
    itemCreditAchieved: 0.5,
    documentCreditAchieved: 0.25,
  });
  let answerWithResponses = await getAnswersThatHaveSubmittedResponses({
    activityId,
    ownerId,
  });
  expect(answerWithResponses).eqls([
    {
      docId,
      docVersionNum: 1,
      answerId: answerId1,
      answerNumber: 1,
      count: 1,
      averageCredit: 1,
    },
  ]);
  let submittedResponses = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  });
  expect(submittedResponses).toMatchObject([
    {
      userId: newUser!.userId,
      userName: newUser!.name,
      bestResponse: "Answer result 1",
      bestCreditAchieved: 1,
      latestResponse: "Answer result 1",
      latestCreditAchieved: 1,
      numResponses: 1,
    },
  ]);
  let submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
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
    activityId,
    ownerId: userId2,
  });
  expect(answerWithResponses).eqls([]);

  // cannot retrieve responses as other user
  submittedResponses = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId: userId2,
    answerId: answerId1,
  });
  expect(submittedResponses).eqls([]);
  submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId: userId2,
    answerId: answerId1,
    userId: newUser!.userId,
  });
  expect(submittedResponseHistory).eqls([]);
});

test("list assigned gets student assignments", async () => {
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  let assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).eqls([]);
  expect(assignmentList.user.userId).eq(user1Id);

  const { activityId: activityId1 } = await createActivity(user1Id);
  await assignActivity(activityId1, user1Id);

  assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).eqls([]);

  const { activityId: activityId2, docId: docId2 } =
    await createActivity(user2Id);
  await assignActivity(activityId2, user2Id);

  assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).eqls([]);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId2,
    closeAt,
    user2Id,
  );

  // recording score for user1 on assignment2 adds it to user1's assignment list
  await saveScoreAndState({
    activityId: activityId2,
    docId: docId2,
    docVersionNum: 1,
    userId: user1Id,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).toMatchObject([
    {
      id: activityId2,
      ownerId: user2Id,
    },
  ]);

  // unassigning activity removes them from list
  await unassignActivity(activityId2, user2Id);
  assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).eqls([]);
});

test("get all assignment data from anonymous user", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { activityId, docId } = await createActivity(ownerId);
  await updateContent({ id: activityId, name: "Activity 1", ownerId });
  await updateDoc({
    id: docId,
    source: "Some content",
    ownerId,
  });

  await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  let assignmentData = await getAssignmentDataFromCode(classCode, false);

  let newUser1 = assignmentData.newAnonymousUser;
  newUser1 = await updateUser({
    userId: newUser1!.userId,
    name: "Zoe Zaborowski",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  let userWithScores = await getStudentData({
    userId: newUser1!.userId,
  });

  expect(userWithScores).eqls({
    userId: newUser1!.userId,
    name: newUser1!.name,
    assignmentScores: [
      {
        activityId: activityId,
        score: 0.5,
        activity: { name: "Activity 1" },
      },
    ],
  });

  // new lower score ignored
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1!.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });

  userWithScores = await getStudentData({
    userId: newUser1!.userId,
  });

  expect(userWithScores).eqls({
    userId: newUser1!.userId,
    name: newUser1!.name,
    assignmentScores: [
      {
        activityId: activityId,
        score: 0.5,
        activity: { name: "Activity 1" },
      },
    ],
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1!.userId,
    score: 0.7,
    onSubmission: true,
    state: "document state 3",
  });

  userWithScores = await getStudentData({
    userId: newUser1!.userId,
  });

  expect(userWithScores).eqls({
    userId: newUser1!.userId,
    name: newUser1!.name,
    assignmentScores: [
      {
        activityId: activityId,
        score: 0.7,
        activity: { name: "Activity 1" },
      },
    ],
  });
});

test.only("get data for user's assignments", { timeout: 30000 }, async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { activityId, docId } = await createActivity(ownerId);
  await updateContent({ id: activityId, name: "Activity 1", ownerId });
  await updateDoc({
    id: docId,
    source: "Some content",
    ownerId,
  });

  await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  let assignmentScores = await getAllAssignmentScores({ ownerId });

  // no one has done the assignment yet
  expect(assignmentScores).eqls([
    {
      id: activityId,
      name: "Activity 1",
      assignmentScores: [],
    },
  ]);

  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  let newUser1 = assignmentData.newAnonymousUser;
  newUser1 = await updateUser({
    userId: newUser1!.userId,
    name: "Zoe Zaborowski",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  assignmentScores = await getAllAssignmentScores({ ownerId });

  expect(assignmentScores).eqls([
    {
      id: activityId,
      name: "Activity 1",
      assignmentScores: [
        {
          activityId: activityId,
          userId: newUser1!.userId,
          score: 0.5,
          user: { name: newUser1!.name },
        },
      ],
    },
  ]);

  // new lower score ignored
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1!.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });

  assignmentScores = await getAllAssignmentScores({ ownerId });

  expect(assignmentScores).eqls([
    {
      id: activityId,
      name: "Activity 1",
      assignmentScores: [
        {
          activityId: activityId,
          userId: newUser1!.userId,
          score: 0.5,
          user: { name: newUser1!.name },
        },
      ],
    },
  ]);

  assignmentData = await getAssignmentDataFromCode(classCode, false);

  let newUser2 = assignmentData.newAnonymousUser;
  newUser2 = await updateUser({
    userId: newUser2!.userId,
    name: "Arya Abbas",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser2!.userId,
    score: 0.3,
    onSubmission: true,
    state: "document state 3",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1!.userId,
    score: 0.7,
    onSubmission: true,
    state: "document state 4",
  });

  assignmentScores = await getAllAssignmentScores({ ownerId });

  expect(assignmentScores).eqls([
    {
      id: activityId,
      name: "Activity 1",
      assignmentScores: [
        {
          activityId: activityId,
          userId: newUser1!.userId,
          score: 0.7,
          user: { name: newUser1!.name },
        },
        {
          activityId: activityId,
          userId: newUser2!.userId,
          score: 0.3,
          user: { name: newUser2!.name },
        },
      ],
    },
  ]);

  const { activityId: activity2Id, docId: doc2Id } =
    await createActivity(ownerId);
  await updateContent({
    id: activity2Id,
    name: "Activity 2",
    ownerId,
  });
  await updateDoc({
    id: doc2Id,
    source: "Some content",
    ownerId,
  });

  await assignActivity(activity2Id, ownerId);

  const { classCode: classCode2 } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  // identical name to user 2
  assignmentData = await getAssignmentDataFromCode(classCode2, false);

  let newUser3 = assignmentData.newAnonymousUser;
  newUser3 = await updateUser({
    userId: newUser3!.userId,
    name: "Arya Abbas",
  });

  await saveScoreAndState({
    activityId: activity2Id,
    docId: doc2Id,
    docVersionNum: 1,
    userId: newUser3!.userId,
    score: 0.9,
    onSubmission: true,
    state: "document state 1",
  });

  assignmentScores = await getAllAssignmentScores({ ownerId });

  expect(assignmentScores).eqls([
    {
      id: activityId,
      name: "Activity 1",
      assignmentScores: [
        {
          activityId: activityId,
          userId: newUser1!.userId,
          score: 0.7,
          user: { name: newUser1!.name },
        },
        {
          activityId: activityId,
          userId: newUser2!.userId,
          score: 0.3,
          user: { name: newUser2!.name },
        },
      ],
    },
    {
      id: activity2Id,
      name: "Activity 2",
      assignmentScores: [
        {
          activityId: activity2Id,
          userId: newUser3!.userId,
          score: 0.9,
          user: { name: newUser3!.name },
        },
      ],
    },
  ]);
});
