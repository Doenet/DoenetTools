import { expect, test, vi } from "vitest";
import {
  copyPublicActivityToPortfolio,
  createActivity,
  createDocumentVersion,
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
  assignActivity,
  getAssignment,
  openAssignmentWithCode,
  closeAssignmentWithCode,
  getAssignmentDataFromCode,
  createAnonymousUser,
  updateUser,
  getUserInfo,
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

test("New document starts out private, then delete it", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId } = await createActivity(userId);
  const activityContent = await getActivityEditorData(activityId);
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
          fullVersion: "0.7.0-alpha1",
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

  await deleteActivity(activityId);

  const docsAfterDelete = await listUserActivities(userId, userId);

  expect(docsAfterDelete.privateActivities.length).toBe(0);
  expect(docsAfterDelete.publicActivities.length).toBe(0);
});

test("listUserActivities returns both public and private documents for a user", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId: publicActivityId } = await createActivity(ownerId);
  const { activityId: privateActivityId } = await createActivity(ownerId);
  // Make one activity public
  await updateActivity({ activityId: publicActivityId, isPublic: true });
  const userDocs = await listUserActivities(ownerId, ownerId);
  expect(userDocs).toMatchObject({
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
});

test("Test updating various activity properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId } = await createActivity(userId);
  const activityName = "Test Name";
  await updateActivity({ activityId, name: activityName });
  const activityContent = await getActivityEditorData(activityId);
  const docId = activityContent.documents[0].docId;
  expect(activityContent.name).toBe(activityName);
  const content = "Here comes some content, I made you some content";
  await updateDoc({ docId, content });
  const activityContent2 = await getActivityEditorData(activityId);
  expect(activityContent2.documents[0].content).toBe(content);

  const activityViewerContent = await getActivityViewerData(activityId);
  expect(activityViewerContent.activity.name).toBe(activityName);
  expect(activityViewerContent.doc.content).toBe(content);
});

test("deleteActivity marks a document as deleted", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId } = await createActivity(userId);
  const deleteResult = await deleteActivity(activityId);
  expect(deleteResult.isDeleted).toBe(true);
});

test("updateDoc updates document properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId, docId } = await createActivity(userId);
  const newName = "Updated Name";
  const newContent = "Updated Content";
  await updateActivity({ activityId, name: newName });
  await updateDoc({
    docId,
    content: newContent,
  });
  const activityViewerContent = await getActivityViewerData(activityId);
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
  await updateActivity({ activityId, isPublic: true });
  const newActivityId = await copyPublicActivityToPortfolio(
    activityId,
    newOwnerId,
  );
  const newActivity = await getActivity(newActivityId);
  expect(newActivity.ownerId).toBe(newOwnerId);
  expect(newActivity.isPublic).toBe(false);

  const activityData = await getActivityViewerData(newActivityId);

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
  const { activityId: activityId1, docId: docId1 } = await createActivity(
    ownerId1,
  );
  const activity1Content = "<p>Hello!</p>";
  await updateActivity({ activityId: activityId1, isPublic: true });
  await updateDoc({ docId: docId1, content: activity1Content });

  // copy activity 1 to owner 2's portfolio
  const activityId2 = await copyPublicActivityToPortfolio(
    activityId1,
    ownerId2,
  );
  const activity2 = await getActivity(activityId2);
  expect(activity2.ownerId).toBe(ownerId2);
  expect(activity2.documents[0].content).eq(activity1Content);

  // history should be version 1 of activity 1
  const activityData2 = await getActivityViewerData(activityId2);
  const contribHist2 = activityData2.doc.contributorHistory;
  expect(contribHist2.length).eq(1);
  expect(contribHist2[0].prevDocId).eq(docId1);
  expect(contribHist2[0].prevDocVersion).eq(1);

  // modify activity 1 so that will have a new version
  const activity1ContentModified = "<p>Bye</p>";
  await updateDoc({ docId: docId1, content: activity1ContentModified });

  // copy activity 1 to owner 3's portfolio
  const activityId3 = await copyPublicActivityToPortfolio(
    activityId1,
    ownerId3,
  );

  const activity3 = await getActivity(activityId3);
  expect(activity3.ownerId).toBe(ownerId3);
  expect(activity3.documents[0].content).eq(activity1ContentModified);

  // history should be version 2 of activity 1
  const activityData3 = await getActivityViewerData(activityId3);
  const contribHist3 = activityData3.doc.contributorHistory;
  expect(contribHist3.length).eq(1);
  expect(contribHist3[0].prevDocId).eq(docId1);
  expect(contribHist3[0].prevDocVersion).eq(2);
});

// TODO:
// create activity
// remix that activity
// remix the remixed activity

test("searchPublicActivities returns activities matching the query", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  // Make the document public and give it a unique name for the test
  const uniqueName = "UniqueNameForSearchTest";
  await updateActivity({ activityId, name: uniqueName, isPublic: true });
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
  await deleteActivity(activityId);
  await expect(getActivity(activityId)).rejects.toThrow("No activities found");
});

test("updateActivity does not update properties when passed undefined values", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  const originalActivity = await getActivity(activityId);
  await updateActivity({ activityId });
  const updatedActivity = await getActivity(activityId);
  expect(updatedActivity).toEqual(originalActivity);
});

test("assign an activity", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId);
  const activity = await getActivity(activityId);
  await updateActivity({ activityId, name: "Activity 1" });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some content",
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
  await updateActivity({ activityId, name: "Activity 1a" });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some amended content",
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
  await updateActivity({ activityId, name: "Activity 1" });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some content",
  });

  await expect(assignActivity(activityId, ownerId2)).rejects.toThrow(
    "Activity not found",
  );

  // can create assignment if activity is made public
  await updateActivity({ activityId, isPublic: true });

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
  await updateActivity({ activityId, name: "Activity 1" });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some content",
  });

  const assignmentId = await assignActivity(activityId, ownerId);
  let assignment = await getAssignment(assignmentId, ownerId);

  expect(assignment.classCode).eq(null);
  expect(assignment.codeValidUntil).eq(null);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(assignmentId, closeAt);
  assignment = await getAssignment(assignmentId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  let assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.assignmentId).eq(assignmentId);
  expect(assignmentData.assignment!.classCode).eq(classCode);
  expect(assignmentData.assignment!.codeValidUntil).eqls(closeAt.toJSDate());

  await closeAssignmentWithCode(assignmentId);
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
  // then this shouldn't throw an error for those students.
  closeAt = DateTime.now().plus({ seconds: -7 });
  await openAssignmentWithCode(assignmentId, closeAt);
  assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);
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
  await updateActivity({ activityId, name: "Activity 1" });
  await updateDoc({
    docId: activity.documents[0].docId,
    content: "Some content",
  });

  const assignmentId = await assignActivity(activityId, ownerId);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(assignmentId, closeAt);

  let assignmentData = await getAssignmentDataFromCode(classCode, false);
  expect(assignmentData.assignmentFound).eq(true);

  // created new anonymous user since weren't logged in
  const newUser1 = assignmentData.newAnonymousUser;
  expect(newUser1!.anonymous).eq(true);

  // don't get new user if assignment is closed
  await closeAssignmentWithCode(assignmentId);
  assignmentData = await getAssignmentDataFromCode(classCode, false);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.newAnonymousUser).eq(null);

  // reopen and get another user if load again when not logged in
  closeAt = DateTime.now().plus({ weeks: 3 });
  await openAssignmentWithCode(assignmentId, closeAt);
  assignmentData = await getAssignmentDataFromCode(classCode, false);
  expect(assignmentData.assignmentFound).eq(true);
  const newUser2 = assignmentData.newAnonymousUser;
  expect(newUser2!.anonymous).eq(true);
  expect(newUser2!.userId).not.eq(newUser1!.userId);
});
