import { expect, test, vi } from "vitest";
import {
  copyPublicActivityToPortfolio,
  createActivity,
  createUser,
  deleteActivity,
  findOrCreateUser,
  getAllDoenetmlVersions,
  getDoc,
  getActivityEditorData,
  getActivityViewerData,
  listUserActivities,
  updateDoc,
  searchPublicActivities,
  updateActivity,
  getActivity,
  addPromotedContentGroup,
  assignActivity,
  getAssignment,
  openAssignmentWithCode,
  closeAssignmentWithCode,
  getAssignmentDataFromCode,
  createAnonymousUser,
  updateUser,
  getUserInfo,
  addPromotedContent,
  loadPromotedContentGroups,
  deleteAssignment,
  saveScoreAndState,
  getAssignmentScoreData,
  loadState,
  getAssignmentStudentData,
  recordSubmittedEvent,
  getDocumentSubmittedResponses,
  getAnswersThatHaveSubmittedResponses,
  getDocumentSubmittedResponseHistory,
  updateAssignment,
  getAssignmentEditorData,
  listUserAssignments,
  updatePromotedContentGroup,
  getStudentData,
  getAllAssignmentScores,
  removePromotedContent,
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

test("New user has an empty portfolio", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const docs = await listUserActivities(userId, userId);
  expect(docs).toStrictEqual({
    publicActivities: [],
    privateActivities: [],
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
    activityId: expect.any(Number),
    ownerId: expect.any(Number),
    name: "Untitled Activity",
    createdAt: expect.any(Date),
    lastEdited: expect.any(Date),
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isDeleted: false,
    documents: [
      {
        docId: expect.any(Number),
        activityId: expect.any(Number),
        content: "",
        createdAt: expect.any(Date),
        lastEdited: expect.any(Date),
        name: "Untitled Document",
        isDeleted: false,
        doenetmlVersionId: 2,
        doenetmlVersion: {
          versionId: 2,
          displayedVersion: "0.7",
          fullVersion: "0.7.0-alpha16",
          default: true,
          deprecated: false,
          removed: false,
          deprecationMessage: "",
        },
      },
    ],
  });

  const docs = await listUserActivities(userId, userId);

  expect(docs.privateActivities.length).toBe(1);
  expect(docs.publicActivities.length).toBe(0);

  await deleteActivity(activityId, userId);

  await expect(getActivityEditorData(activityId, userId)).rejects.toThrow(
    "No activities found",
  );

  const docsAfterDelete = await listUserActivities(userId, userId);

  expect(docsAfterDelete.privateActivities.length).toBe(0);
  expect(docsAfterDelete.publicActivities.length).toBe(0);
});

test("listUserActivities returns both public and private documents for a user", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  // User is not the owner
  const user = await createTestUser();
  const userId = user.userId;

  const { activityId: publicActivityId } = await createActivity(ownerId);
  const { activityId: privateActivityId } = await createActivity(ownerId);

  // Make one activity public
  await updateActivity({
    activityId: publicActivityId,
    isPublic: true,
    ownerId,
  });

  const ownerDocs = await listUserActivities(ownerId, ownerId);
  expect(ownerDocs).toMatchObject({
    publicActivities: expect.arrayContaining([
      expect.objectContaining({
        activityId: publicActivityId,
      }),
    ]),
    privateActivities: expect.arrayContaining([
      expect.objectContaining({
        activityId: privateActivityId,
      }),
    ]),
  });

  const userDocs = await listUserActivities(ownerId, userId);

  expect(userDocs.privateActivities).toStrictEqual([]);
});

test("Test updating various activity properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId } = await createActivity(userId);
  const activityName = "Test Name";
  await updateActivity({ activityId, name: activityName, ownerId: userId });
  const activityContent = await getActivityEditorData(activityId, userId);
  const docId = activityContent.documents[0].docId;
  expect(activityContent.name).toBe(activityName);
  const content = "Here comes some content, I made you some content";
  await updateDoc({ docId, content, ownerId: userId });
  const activityContent2 = await getActivityEditorData(activityId, userId);
  expect(activityContent2.documents[0].content).toBe(content);

  const activityViewerContent = await getActivityViewerData(activityId, userId);
  expect(activityViewerContent.activity.name).toBe(activityName);
  expect(activityViewerContent.doc.content).toBe(content);
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
  await expect(getActivity(activityId)).rejects.toThrow("No activities found");
  await expect(getActivityViewerData(activityId, userId)).rejects.toThrow(
    "No activities found",
  );
  await expect(getActivityEditorData(activityId, userId)).rejects.toThrow(
    "No activities found",
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
  await updateActivity({ activityId, name: newName, ownerId: userId });
  await updateDoc({
    docId,
    content: newContent,
    ownerId: userId,
  });
  const activityViewerContent = await getActivityViewerData(activityId, userId);
  expect(activityViewerContent.activity.name).toBe(newName);
  expect(activityViewerContent.doc.content).toBe(newContent);
});

test("copyPublicActivityToPortfolio copies a public document to a new owner", async () => {
  const originalOwnerId = (await createTestUser()).userId;
  const newOwnerId = (await createTestUser()).userId;
  const { activityId, docId } = await createActivity(originalOwnerId);
  // cannot copy if not yet public
  await expect(
    copyPublicActivityToPortfolio(activityId, newOwnerId),
  ).rejects.toThrow("Cannot copy a non-public activity to portfolio");

  // Make the activity public before copying
  await updateActivity({
    activityId,
    isPublic: true,
    ownerId: originalOwnerId,
  });
  const newActivityId = await copyPublicActivityToPortfolio(
    activityId,
    newOwnerId,
  );
  const newActivity = await getActivity(newActivityId);
  expect(newActivity.ownerId).toBe(newOwnerId);
  expect(newActivity.isPublic).toBe(false);

  const activityData = await getActivityViewerData(newActivityId, newOwnerId);

  const contribHist = activityData.doc.contributorHistory;
  expect(contribHist.length).eq(1);

  expect(contribHist[0].prevDocId).eq(docId);
  expect(contribHist[0].prevDocVersion).eq(1);
});

test("copyPublicActivityToPortfolio remixes correct versions", async () => {
  const ownerId1 = (await createTestUser()).userId;
  const ownerId2 = (await createTestUser()).userId;
  const ownerId3 = (await createTestUser()).userId;

  // create activity 1 by owner 1
  const { activityId: activityId1, docId: docId1 } =
    await createActivity(ownerId1);
  const activity1Content = "<p>Hello!</p>";
  await updateActivity({
    activityId: activityId1,
    isPublic: true,
    ownerId: ownerId1,
  });
  await updateDoc({
    docId: docId1,
    content: activity1Content,
    ownerId: ownerId1,
  });

  // copy activity 1 to owner 2's portfolio
  const activityId2 = await copyPublicActivityToPortfolio(
    activityId1,
    ownerId2,
  );
  const activity2 = await getActivity(activityId2);
  expect(activity2.ownerId).toBe(ownerId2);
  expect(activity2.documents[0].content).eq(activity1Content);

  // history should be version 1 of activity 1
  const activityData2 = await getActivityViewerData(activityId2, ownerId2);
  const contribHist2 = activityData2.doc.contributorHistory;
  expect(contribHist2.length).eq(1);
  expect(contribHist2[0].prevDocId).eq(docId1);
  expect(contribHist2[0].prevDocVersion).eq(1);

  // modify activity 1 so that will have a new version
  const activity1ContentModified = "<p>Bye</p>";
  await updateDoc({
    docId: docId1,
    content: activity1ContentModified,
    ownerId: ownerId1,
  });

  // copy activity 1 to owner 3's portfolio
  const activityId3 = await copyPublicActivityToPortfolio(
    activityId1,
    ownerId3,
  );

  const activity3 = await getActivity(activityId3);
  expect(activity3.ownerId).toBe(ownerId3);
  expect(activity3.documents[0].content).eq(activity1ContentModified);

  // history should be version 2 of activity 1
  const activityData3 = await getActivityViewerData(activityId3, ownerId3);
  const contribHist3 = activityData3.doc.contributorHistory;
  expect(contribHist3.length).eq(1);
  expect(contribHist3[0].prevDocId).eq(docId1);
  expect(contribHist3[0].prevDocVersion).eq(2);
});

test("searchPublicActivities returns activities matching the query", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  // Make the document public and give it a unique name for the test
  const uniqueName = "UniqueNameForSearchTest";
  await updateActivity({
    activityId,
    name: uniqueName,
    isPublic: true,
    ownerId,
  });
  const searchResults = await searchPublicActivities(uniqueName);
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
  await expect(getActivity(activityId)).rejects.toThrow("No activities found");
});

test("updateActivity does not update properties when passed undefined values", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  const originalActivity = await getActivity(activityId);
  await updateActivity({ activityId, ownerId });
  const updatedActivity = await getActivity(activityId);
  expect(updatedActivity).toEqual(originalActivity);
});

test("Add and remove promoted content", async () => {
  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const groupResponse = await addPromotedContentGroup(groupName);
  expect(groupResponse).toEqual({ success: true });
  const groups = await loadPromotedContentGroups();
  const groupId = groups.find(
    (group) => group.groupName === groupName,
  )!.promotedGroupId;

  // Creating the same group again should fail
  const duplicateGroupResponse = await addPromotedContentGroup(groupName);
  expect(duplicateGroupResponse).toEqual({
    success: false,
    message: "A group with that name already exists.",
  });

  const { userId: ownerId } = await createTestUser();
  const { activityId } = await createActivity(ownerId);
  // Cannot promote private activity
  const responsePrivate = await addPromotedContent(groupId, activityId);
  expect(responsePrivate).toEqual({
    success: false,
    message: "This activity does not exist or is not public.",
  });
  // Can promote public activity
  await updateActivity({ activityId, isPublic: true, ownerId });
  const responseSuccess = await addPromotedContent(groupId, activityId);
  expect(responseSuccess).toEqual({ success: true });

  // Cannot add to same group twice
  const twice = await addPromotedContent(groupId, activityId);
  expect(twice).toEqual({
    success: false,
    message: "This activity is already in that group.",
  });
  // Cannot promote non-existent activity
  const fakeActivityId = Math.random() * 1e8;
  const responseFakeActivity = await addPromotedContent(
    groupId,
    fakeActivityId,
  );
  expect(responseFakeActivity).toEqual({
    success: false,
    message: "This activity does not exist or is not public.",
  });
  // Cannot promote to non-existent group
  const fakeGroupId = Math.random() * 1e8;
  const responseFakeGroup = await addPromotedContent(fakeGroupId, activityId);
  console.log({ responseFakeGroup });
  expect(responseFakeGroup).toEqual({
    success: false,
    message: "That group does not exist.",
  });

  const fakeGroupRemoveResponse = await removePromotedContent(
    fakeGroupId,
    activityId,
  );
  expect(fakeGroupRemoveResponse).toEqual({
    success: false,
    message: "That group does not exist.",
  });

  const removeResponse = await removePromotedContent(groupId, activityId);
  expect(removeResponse).toEqual({ sucess: true });
});

test("Update promoted content group", async () => {
  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const groupResponse = await addPromotedContentGroup(groupName);
  expect(groupResponse).toEqual({ success: true });

  const secondGroupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const secondGroupResponse = await addPromotedContentGroup(secondGroupName);
  expect(secondGroupResponse).toEqual({ success: true });

  const updateResponseExistingName = await updatePromotedContentGroup(
    groupName,
    secondGroupName,
    false,
    false,
  );
  expect(updateResponseExistingName).toEqual({
    success: false,
    message: "A group with that name already exists.",
  });

  const newGroupName =
    "vitest-unique-NEW-promoted-group-" + new Date().toJSON();
  const updateResponse = await updatePromotedContentGroup(
    groupName,
    newGroupName,
    false,
    false,
  );
  expect(updateResponse).toEqual({
    success: true,
  });
});

test("assign an activity", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  const activity = await getActivity(activityId);
  await updateActivity({ activityId, name: "Activity 1", ownerId });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some content",
    ownerId,
  });

  const assignmentId = await assignActivity(activityId, ownerId);
  const assignment = await getAssignment(assignmentId, ownerId);

  expect(assignment.activityId).eq(activityId);
  expect(assignment.name).eq("Activity 1");
  expect(assignment.assignmentDocuments.length).eq(1);
  expect(assignment.assignmentDocuments[0].documentVersion.content).eq(
    "Some content",
  );

  // changing name and content of activity does not change assignment
  await updateActivity({ activityId, name: "Activity 1a", ownerId });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some amended content",
    ownerId,
  });

  const updatedActivity = await getActivity(activityId);
  expect(updatedActivity.name).eq("Activity 1a");
  expect(updatedActivity.documents[0].content).eq("Some amended content");

  const unchangedAssignment = await getAssignment(assignmentId, ownerId);
  expect(unchangedAssignment.name).eq("Activity 1");
  expect(unchangedAssignment.assignmentDocuments[0].documentVersion.content).eq(
    "Some content",
  );
});

test("cannot assign other user's private activity", async () => {
  const ownerId1 = (await createTestUser()).userId;
  const ownerId2 = (await createTestUser()).userId;
  const { activityId } = await createActivity(ownerId1);
  const activity = await getActivity(activityId);
  await updateActivity({ activityId, name: "Activity 1", ownerId: ownerId1 });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some content",
    ownerId: ownerId1,
  });

  await expect(assignActivity(activityId, ownerId2)).rejects.toThrow(
    "Activity not found",
  );

  // can create assignment if activity is made public
  await updateActivity({ activityId, isPublic: true, ownerId: ownerId1 });

  const assignmentId = await assignActivity(activityId, ownerId2);
  const assignment = await getAssignment(assignmentId, ownerId2);

  expect(assignment.activityId).eq(activityId);
  expect(assignment.name).eq("Activity 1");
  expect(assignment.assignmentDocuments.length).eq(1);
  expect(assignment.assignmentDocuments[0].documentVersion.content).eq(
    "Some content",
  );
});

test("open and close assignment with code", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  const activity = await getActivity(activityId);
  await updateActivity({ activityId, name: "Activity 1", ownerId });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some content",
    ownerId,
  });

  const assignmentId = await assignActivity(activityId, ownerId);
  let assignment = await getAssignment(assignmentId, ownerId);

  expect(assignment.classCode).eq(null);
  expect(assignment.codeValidUntil).eq(null);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId,
    closeAt,
    ownerId,
  );
  assignment = await getAssignment(assignmentId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  let assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.assignmentId).eq(assignmentId);
  expect(assignmentData.assignment!.classCode).eq(classCode);
  expect(assignmentData.assignment!.codeValidUntil).eqls(closeAt.toJSDate());
  expect(
    assignmentData.assignment!.assignmentDocuments[0].documentVersion.content,
  ).eq("Some content");

  await closeAssignmentWithCode(assignmentId, ownerId);
  assignment = await getAssignment(assignmentId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(null);

  assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);

  // get same code back if reopen
  closeAt = DateTime.now().plus({ weeks: 3 });
  const { classCode: classCode2 } = await openAssignmentWithCode(
    assignmentId,
    closeAt,
    ownerId,
  );
  expect(classCode2).eq(classCode);
  assignment = await getAssignment(assignmentId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.assignmentId).eq(assignmentId);
  expect(assignmentData.assignment!.classCode).eq(classCode);
  expect(assignmentData.assignment!.codeValidUntil).eqls(closeAt.toJSDate());

  // Open with past date.
  // Currently, says assignment is not found
  // TODO: if we want students who have previously joined the assignment to be able to reload the page,
  // then this should still retrieve data for those students.
  closeAt = DateTime.now().plus({ seconds: -7 });
  await openAssignmentWithCode(assignmentId, closeAt, ownerId);
  assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);
});

test("open and delete assignment with code", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  const activity = await getActivity(activityId);
  await updateActivity({ activityId, name: "Activity 1", ownerId });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some content",
    ownerId,
  });

  const assignmentId = await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId,
    closeAt,
    ownerId,
  );

  let assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.assignmentId).eq(assignmentId);
  expect(assignmentData.assignment!.classCode).eq(classCode);
  expect(assignmentData.assignment!.codeValidUntil).eqls(closeAt.toJSDate());

  // Delete assignment.
  await deleteAssignment(assignmentId, ownerId);
  await expect(getAssignment(assignmentId, ownerId)).rejects.toThrow(
    "No assignments found",
  );

  // Getting deleted assignment by code fails
  assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);
});

test("only owner can open, close, modify, or delete assignment", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user2 = await createTestUser();
  const userId2 = user2.userId;
  const { activityId } = await createActivity(ownerId);
  const activity = await getActivity(activityId);

  await expect(
    updateActivity({ activityId, name: "Activity 1", ownerId: userId2 }),
  ).rejects.toThrow("Record to update not found");
  await expect(
    updateDoc({
      docId: activity.documents[0].docId,
      content: "Some content",
      ownerId: userId2,
    }),
  ).rejects.toThrow("Record to update not found");

  await updateActivity({ activityId, name: "Activity 1", ownerId });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some content",
    ownerId,
  });

  await expect(assignActivity(activityId, userId2)).rejects.toThrow(
    "Activity not found",
  );

  const assignmentId = await assignActivity(activityId, ownerId);

  await expect(getAssignment(assignmentId, userId2)).rejects.toThrow(
    "No assignments found",
  );

  let assignment = await getAssignment(assignmentId, ownerId);
  expect(assignment.name).eq("Activity 1");

  await expect(
    updateAssignment({ assignmentId, name: "New Activity", ownerId: userId2 }),
  ).rejects.toThrow("Record to update not found");

  await updateAssignment({ assignmentId, name: "New Activity", ownerId });
  assignment = await getAssignment(assignmentId, ownerId);
  expect(assignment.name).eq("New Activity");

  let closeAt = DateTime.now().plus({ days: 1 });

  await expect(
    openAssignmentWithCode(assignmentId, closeAt, userId2),
  ).rejects.toThrow("No assignments found");

  const { classCode } = await openAssignmentWithCode(
    assignmentId,
    closeAt,
    ownerId,
  );

  await expect(closeAssignmentWithCode(assignmentId, userId2)).rejects.toThrow(
    "Record to update not found",
  );

  await closeAssignmentWithCode(assignmentId, ownerId);

  await expect(deleteAssignment(assignmentId, userId2)).rejects.toThrow(
    "Record to update not found",
  );
  await deleteAssignment(assignmentId, ownerId);
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
  await updateActivity({ activityId, name: "Activity 1", ownerId });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some content",
    ownerId,
  });

  const assignmentId = await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId,
    closeAt,
    ownerId,
  );

  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  expect(assignmentData.assignmentFound).eq(true);

  // created new anonymous user since weren't logged in
  const newUser1 = assignmentData.newAnonymousUser;
  expect(newUser1!.anonymous).eq(true);

  // don't get new user if assignment is closed
  await closeAssignmentWithCode(assignmentId, ownerId);
  assignmentData = await getAssignmentDataFromCode(classCode, false);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.newAnonymousUser).eq(null);

  // reopen and get another user if load again when not logged in
  closeAt = DateTime.now().plus({ weeks: 3 });
  await openAssignmentWithCode(assignmentId, closeAt, ownerId);
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
  await updateActivity({ activityId, name: "Activity 1", ownerId });
  await updateDoc({
    docId,
    content: "Some content",
    ownerId,
  });

  const assignmentId = await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId,
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
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser1!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  let assignmentWithScores = await getAssignmentScoreData({
    assignmentId,
    ownerId,
  });

  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.5, user: userData1 }],
  });

  let assignmentStudentData = await getAssignmentStudentData({
    assignmentId,
    ownerId,
    userId: newUser1!.userId,
  });

  expect(assignmentStudentData).eqls({
    assignmentId,
    userId: newUser1!.userId,
    score: 0.5,
    assignment: {
      name: "Activity 1",
      assignmentDocuments: [
        {
          docId,
          docVersionId: 1,
          documentVersion: {
            content: "Some content",
            doenetmlVersion: { fullVersion: "0.7.0-alpha16" },
          },
        },
      ],
    },
    user: { name: "Zoe Zaborowski" },
    documentScores: [
      {
        docId,
        docVersionId: 1,
        hasMaxScore: true,
        score: 0.5,
      },
    ],
  });

  // new lower score ignored
  await saveScoreAndState({
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser1!.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });
  assignmentWithScores = await getAssignmentScoreData({
    assignmentId,
    ownerId,
  });
  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.5, user: userData1 }],
  });

  assignmentStudentData = await getAssignmentStudentData({
    assignmentId,
    ownerId,
    userId: newUser1!.userId,
  });

  expect(assignmentStudentData).eqls({
    assignmentId,
    userId: newUser1!.userId,
    score: 0.5,
    assignment: {
      name: "Activity 1",
      assignmentDocuments: [
        {
          docId,
          docVersionId: 1,
          documentVersion: {
            content: "Some content",
            doenetmlVersion: { fullVersion: "0.7.0-alpha16" },
          },
        },
      ],
    },
    user: { name: "Zoe Zaborowski" },
    documentScores: [
      {
        docId,
        docVersionId: 1,
        hasMaxScore: false,
        score: 0.2,
      },
      {
        docId,
        docVersionId: 1,
        hasMaxScore: true,
        score: 0.5,
      },
    ],
  });

  // new higher score used
  await saveScoreAndState({
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser1!.userId,
    score: 0.7,
    onSubmission: true,
    state: "document state 3",
  });
  assignmentWithScores = await getAssignmentScoreData({
    assignmentId,
    ownerId,
  });
  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.7, user: userData1 }],
  });

  assignmentStudentData = await getAssignmentStudentData({
    assignmentId,
    ownerId,
    userId: newUser1!.userId,
  });

  expect(assignmentStudentData).eqls({
    assignmentId,
    userId: newUser1!.userId,
    score: 0.7,
    assignment: {
      name: "Activity 1",
      assignmentDocuments: [
        {
          docId,
          docVersionId: 1,
          documentVersion: {
            content: "Some content",
            doenetmlVersion: { fullVersion: "0.7.0-alpha16" },
          },
        },
      ],
    },
    user: { name: "Zoe Zaborowski" },
    documentScores: [
      {
        docId,
        docVersionId: 1,
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
    assignmentId,
    ownerId,
  });
  expect(assignmentWithScores).eqls({
    name: "Activity 1",
    assignmentScores: [{ score: 0.7, user: userData1 }],
  });

  // save state for second user
  await saveScoreAndState({
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser2!.userId,
    score: 0.3,
    onSubmission: true,
    state: "document state 4",
  });

  // second user's score shows up first due to alphabetical sorting
  assignmentWithScores = await getAssignmentScoreData({
    assignmentId,
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
    assignmentId,
    ownerId,
    userId: newUser2!.userId,
  });

  expect(assignmentStudentData).eqls({
    assignmentId,
    userId: newUser2!.userId,
    score: 0.3,
    assignment: {
      name: "Activity 1",
      assignmentDocuments: [
        {
          docId,
          docVersionId: 1,
          documentVersion: {
            content: "Some content",
            doenetmlVersion: { fullVersion: "0.7.0-alpha16" },
          },
        },
      ],
    },
    user: { name: "Arya Abbas" },
    documentScores: [
      {
        docId,
        docVersionId: 1,
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
  const assignmentId = await assignActivity(activityId, ownerId);

  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId,
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
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser1!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  await getAssignmentScoreData({
    assignmentId,
    ownerId,
  });

  await expect(
    getAssignmentScoreData({
      assignmentId,
      ownerId: otherUserId,
    }),
  ).rejects.toThrow("No assignments found");

  await getAssignmentStudentData({
    assignmentId,
    ownerId,
    userId: newUser1!.userId,
  });

  await expect(
    getAssignmentStudentData({
      assignmentId,
      ownerId: otherUserId,
      userId: newUser1!.userId,
    }),
  ).rejects.toThrow("No assignmentScores found");
});

test("can't get assignment data if deleted", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId);
  const assignmentId = await assignActivity(activityId, ownerId);

  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId,
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
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser1!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  await getAssignmentScoreData({
    assignmentId,
    ownerId,
  });

  await getAssignmentStudentData({
    assignmentId,
    ownerId,
    userId: newUser1!.userId,
  });

  await deleteAssignment(assignmentId, ownerId);

  await expect(
    getAssignmentScoreData({
      assignmentId,
      ownerId,
    }),
  ).rejects.toThrow("No assignments found");

  await expect(
    getAssignmentStudentData({
      assignmentId,
      ownerId,
      userId: newUser1!.userId,
    }),
  ).rejects.toThrow("No assignmentScores found");
});

test("get assignment editor data only if owner", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const otherUser = await createTestUser();
  const otherUserId = otherUser.userId;
  const { activityId, docId } = await createActivity(ownerId);
  const assignmentId = await assignActivity(activityId, ownerId);

  const assignmentData = await getAssignmentEditorData(assignmentId, ownerId);
  expect(assignmentData.activityId).eq(activityId);

  await expect(
    getAssignmentEditorData(assignmentId, otherUserId),
  ).rejects.toThrow("No assignments found");
});

test("only user and assignment owner can load document state", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId);
  const assignmentId = await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId,
    closeAt,
    ownerId,
  );

  // create new anonymous user
  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  let newUser = assignmentData.newAnonymousUser;

  await saveScoreAndState({
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  // anonymous user can load state
  let retrievedState = await loadState({
    assignmentId,
    docId,
    docVersionId: 1,
    requestedUserId: newUser!.userId,
    userId: newUser!.userId,
    withMaxScore: false,
  });

  expect(retrievedState).eq("document state 1");

  // assignment owner can load state
  let retrievedState2 = await loadState({
    assignmentId,
    docId,
    docVersionId: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: false,
  });

  expect(retrievedState2).eq("document state 1");

  // another user cannot load state
  const user2 = await createTestUser();

  await expect(
    loadState({
      assignmentId,
      docId,
      docVersionId: 1,
      requestedUserId: newUser!.userId,
      userId: user2.userId,
      withMaxScore: false,
    }),
  ).rejects.toThrow("No assignments found");
});

test("load document state based on withMaxScore", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId);
  const assignmentId = await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId,
    closeAt,
    ownerId,
  );

  // create new anonymous user
  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  let newUser = assignmentData.newAnonymousUser;

  await saveScoreAndState({
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  // since last state is maximum score, withMaxScore doesn't have effect
  let retrievedState = await loadState({
    assignmentId,
    docId,
    docVersionId: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 1");

  retrievedState = await loadState({
    assignmentId,
    docId,
    docVersionId: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: true,
  });
  expect(retrievedState).eq("document state 1");

  // last state is no longer maximum score
  await saveScoreAndState({
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser!.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });

  // get last state if withMaxScore is false
  retrievedState = await loadState({
    assignmentId,
    docId,
    docVersionId: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 2");

  // get state with max score
  retrievedState = await loadState({
    assignmentId,
    docId,
    docVersionId: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: true,
  });
  expect(retrievedState).eq("document state 1");

  // matching maximum score with onSubmission uses latest for maximum
  await saveScoreAndState({
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 3",
  });

  retrievedState = await loadState({
    assignmentId,
    docId,
    docVersionId: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 3");

  retrievedState = await loadState({
    assignmentId,
    docId,
    docVersionId: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: true,
  });
  expect(retrievedState).eq("document state 3");

  // matching maximum score without onSubmission does not use latest for maximum
  await saveScoreAndState({
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser!.userId,
    score: 0.5,
    onSubmission: false,
    state: "document state 4",
  });

  retrievedState = await loadState({
    assignmentId,
    docId,
    docVersionId: 1,
    requestedUserId: newUser!.userId,
    userId: ownerId,
    withMaxScore: false,
  });
  expect(retrievedState).eq("document state 4");

  retrievedState = await loadState({
    assignmentId,
    docId,
    docVersionId: 1,
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
  const assignmentId = await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId,
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
    assignmentId,
    ownerId,
  });
  expect(answerWithResponses).eqls([]);

  let submittedResponses = await getDocumentSubmittedResponses({
    assignmentId,
    docId,
    docVersionId: 1,
    ownerId,
    answerId: answerId1,
  });
  expect(submittedResponses).eqls([]);

  let submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    assignmentId,
    docId,
    docVersionId: 1,
    ownerId,
    answerId: answerId1,
    userId: newUser!.userId,
  });
  expect(submittedResponseHistory).eqls([]);

  // record event and retrieve it
  await recordSubmittedEvent({
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    ownerId,
  });
  expect(answerWithResponses).eqls([
    {
      docId,
      docVersionId: 1,
      answerId: answerId1,
      answerNumber: 1,
      count: 1,
      averageCredit: 0.4,
    },
  ]);
  submittedResponses = await getDocumentSubmittedResponses({
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    ownerId,
  });
  expect(answerWithResponses).eqls([
    {
      docId,
      docVersionId: 1,
      answerId: answerId1,
      answerNumber: 1,
      count: 1,
      averageCredit: 0.8,
    },
  ]);
  submittedResponses = await getDocumentSubmittedResponses({
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    ownerId,
  });
  // Note: use `arrayContaining` as the order of the entries isn't determined
  expect(answerWithResponses).toMatchObject(
    expect.arrayContaining([
      {
        docId,
        docVersionId: 1,
        answerId: answerId1,
        answerNumber: 1,
        count: 1,
        averageCredit: 0.8,
      },
      {
        docId,
        docVersionId: 1,
        answerId: answerId2,
        answerNumber: 2,
        count: 1,
        averageCredit: 0.2,
      },
    ]),
  );
  submittedResponses = await getDocumentSubmittedResponses({
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    ownerId,
  });
  expect(answerWithResponses).toMatchObject(
    expect.arrayContaining([
      {
        docId,
        docVersionId: 1,
        answerId: answerId1,
        answerNumber: 1,
        count: 2,
        averageCredit: 0.9,
      },
      {
        docId,
        docVersionId: 1,
        answerId: answerId2,
        answerNumber: 2,
        count: 1,
        averageCredit: 0.2,
      },
    ]),
  );
  submittedResponses = await getDocumentSubmittedResponses({
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
    ownerId,
    answerId: answerId2,
    userId: newUser2!.userId,
  });
  expect(submittedResponseHistory).eqls([]);

  // verify submitted responses changes but average max credit doesn't change if submit a lower credit answer
  await recordSubmittedEvent({
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    ownerId,
  });
  expect(answerWithResponses).toMatchObject(
    expect.arrayContaining([
      {
        docId,
        docVersionId: 1,
        answerId: answerId1,
        answerNumber: 1,
        count: 2,
        averageCredit: 0.9,
      },
      {
        docId,
        docVersionId: 1,
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
  const assignmentId = await assignActivity(activityId, ownerId);

  const user2 = await createTestUser();
  const userId2 = user2.userId;

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    ownerId,
  });
  expect(answerWithResponses).eqls([
    {
      docId,
      docVersionId: 1,
      answerId: answerId1,
      answerNumber: 1,
      count: 1,
      averageCredit: 1,
    },
  ]);
  let submittedResponses = await getDocumentSubmittedResponses({
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    docId,
    docVersionId: 1,
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
    assignmentId,
    ownerId: userId2,
  });
  expect(answerWithResponses).eqls([]);

  // cannot retrieve responses as other user
  submittedResponses = await getDocumentSubmittedResponses({
    assignmentId,
    docId,
    docVersionId: 1,
    ownerId: userId2,
    answerId: answerId1,
  });
  expect(submittedResponses).eqls([]);
  submittedResponseHistory = await getDocumentSubmittedResponseHistory({
    assignmentId,
    docId,
    docVersionId: 1,
    ownerId: userId2,
    answerId: answerId1,
    userId: newUser!.userId,
  });
  expect(submittedResponseHistory).eqls([]);
});

test("list assignments gets instructor and student activities", async () => {
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  let assignmentList = await listUserAssignments(user1Id);
  expect(assignmentList.assignments).eqls([]);
  expect(assignmentList.user.userId).eq(user1Id);

  const { activityId: activityId1 } = await createActivity(user1Id);
  const assignmentId1 = await assignActivity(activityId1, user1Id);

  assignmentList = await listUserAssignments(user1Id);
  expect(assignmentList.assignments).toMatchObject([
    {
      activityId: activityId1,
      assignmentId: assignmentId1,
      classCode: null,
      codeValidUntil: null,
      ownerId: user1Id,
    },
  ]);

  const { activityId: activityId2, docId: docId2 } =
    await createActivity(user2Id);
  const assignmentId2 = await assignActivity(activityId2, user2Id);

  assignmentList = await listUserAssignments(user1Id);
  expect(assignmentList.assignments).toMatchObject([
    {
      activityId: activityId1,
      assignmentId: assignmentId1,
      classCode: null,
      codeValidUntil: null,
      ownerId: user1Id,
    },
  ]);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId2,
    closeAt,
    user2Id,
  );

  // recording score for user1 on assignment2 adds it to user1's assignment list
  await saveScoreAndState({
    assignmentId: assignmentId2,
    docId: docId2,
    docVersionId: 1,
    userId: user1Id,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  assignmentList = await listUserAssignments(user1Id);
  expect(assignmentList.assignments).toMatchObject([
    {
      activityId: activityId1,
      assignmentId: assignmentId1,
      classCode: null,
      codeValidUntil: null,
      ownerId: user1Id,
    },
    {
      activityId: activityId2,
      assignmentId: assignmentId2,
      ownerId: user2Id,
    },
  ]);

  // deleting assignments removes them from list
  await deleteAssignment(assignmentId1, user1Id);
  assignmentList = await listUserAssignments(user1Id);
  expect(assignmentList.assignments).toMatchObject([
    {
      activityId: activityId2,
      assignmentId: assignmentId2,
      ownerId: user2Id,
    },
  ]);

  await deleteAssignment(assignmentId2, user2Id);
  assignmentList = await listUserAssignments(user1Id);
  expect(assignmentList.assignments).eqls([]);
});

test(
  "get all assignment data from anonymous user",
  { timeout: 10000 },
  async () => {
    const owner = await createTestUser();
    const ownerId = owner.userId;

    const { activityId, docId } = await createActivity(ownerId);
    await updateActivity({ activityId, name: "Activity 1", ownerId });
    await updateDoc({
      docId,
      content: "Some content",
      ownerId,
    });

    const assignmentId = await assignActivity(activityId, ownerId);

    // open assignment generates code
    let closeAt = DateTime.now().plus({ days: 1 });
    const { classCode } = await openAssignmentWithCode(
      assignmentId,
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
      assignmentId,
      docId,
      docVersionId: 1,
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
          assignmentId: assignmentId,
          score: 0.5,
          assignment: { name: "Activity 1" },
        },
      ],
    });

    // new lower score ignored
    await saveScoreAndState({
      assignmentId,
      docId,
      docVersionId: 1,
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
          assignmentId: assignmentId,
          score: 0.5,
          assignment: { name: "Activity 1" },
        },
      ],
    });

    await saveScoreAndState({
      assignmentId,
      docId,
      docVersionId: 1,
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
          assignmentId: assignmentId,
          score: 0.7,
          assignment: { name: "Activity 1" },
        },
      ],
    });
  },
);

test("get data for user's assignments", { timeout: 30000 }, async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { activityId, docId } = await createActivity(ownerId);
  await updateActivity({ activityId, name: "Activity 1", ownerId });
  await updateDoc({
    docId,
    content: "Some content",
    ownerId,
  });

  const assignmentId = await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    assignmentId,
    closeAt,
    ownerId,
  );

  let assignmentScores = await getAllAssignmentScores({ ownerId });

  // no one has done the assignment yet
  expect(assignmentScores).eqls([
    {
      assignmentId: assignmentId,
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
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser1!.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  assignmentScores = await getAllAssignmentScores({ ownerId });

  expect(assignmentScores).eqls([
    {
      assignmentId: assignmentId,
      name: "Activity 1",
      assignmentScores: [
        {
          assignmentId: assignmentId,
          userId: newUser1!.userId,
          score: 0.5,
          user: { name: newUser1!.name },
        },
      ],
    },
  ]);

  // new lower score ignored
  await saveScoreAndState({
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser1!.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });

  assignmentScores = await getAllAssignmentScores({ ownerId });

  expect(assignmentScores).eqls([
    {
      assignmentId: assignmentId,
      name: "Activity 1",
      assignmentScores: [
        {
          assignmentId: assignmentId,
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
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser2!.userId,
    score: 0.3,
    onSubmission: true,
    state: "document state 3",
  });

  await saveScoreAndState({
    assignmentId,
    docId,
    docVersionId: 1,
    userId: newUser1!.userId,
    score: 0.7,
    onSubmission: true,
    state: "document state 4",
  });

  assignmentScores = await getAllAssignmentScores({ ownerId });

  expect(assignmentScores).eqls([
    {
      assignmentId: assignmentId,
      name: "Activity 1",
      assignmentScores: [
        {
          assignmentId: assignmentId,
          userId: newUser1!.userId,
          score: 0.7,
          user: { name: newUser1!.name },
        },
        {
          assignmentId: assignmentId,
          userId: newUser2!.userId,
          score: 0.3,
          user: { name: newUser2!.name },
        },
      ],
    },
  ]);

  const { activityId: activity2Id, docId: doc2Id } =
    await createActivity(ownerId);
  await updateActivity({
    activityId: activity2Id,
    name: "Activity 2",
    ownerId,
  });
  await updateDoc({
    docId,
    content: "Some content",
    ownerId,
  });

  const assignment2Id = await assignActivity(activity2Id, ownerId);

  const { classCode: classCode2 } = await openAssignmentWithCode(
    assignmentId,
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
    assignmentId: assignment2Id,
    docId: doc2Id,
    docVersionId: 1,
    userId: newUser3!.userId,
    score: 0.9,
    onSubmission: true,
    state: "document state 1",
  });

  assignmentScores = await getAllAssignmentScores({ ownerId });

  expect(assignmentScores).eqls([
    {
      assignmentId: assignmentId,
      name: "Activity 1",
      assignmentScores: [
        {
          assignmentId: assignmentId,
          userId: newUser1!.userId,
          score: 0.7,
          user: { name: newUser1!.name },
        },
        {
          assignmentId: assignmentId,
          userId: newUser2!.userId,
          score: 0.3,
          user: { name: newUser2!.name },
        },
      ],
    },
    {
      assignmentId: assignment2Id,
      name: "Activity 2",
      assignmentScores: [
        {
          assignmentId: assignment2Id,
          userId: newUser3!.userId,
          score: 0.9,
          user: { name: newUser3!.name },
        },
      ],
    },
  ]);
});
