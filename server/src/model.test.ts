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
  addPromotedContentGroup,
} from "./model";

const EMPTY_DOC_CID =
  "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

// create an isolated user for each test, will allow tests to be run in parallel
async function createTestUser() {
  const username = "vitest-" + new Date().toJSON() + "@vitest.test";
  return await findOrCreateUser(username, "vitest user");
}

test("New user has an empty portfolio", async () => {
  const userId = await createTestUser();
  const docs = await listUserActivities(userId, userId);
  expect(docs).toStrictEqual({
    publicActivities: [],
    privateActivities: [],
    name: "vitest user",
    notMe: false,
  });
});

test("New document starts out private, then delete it", async () => {
  const userId = await createTestUser();
  const { activityId } = await createActivity(userId);
  const activityContent = await getActivityEditorData(activityId);
  console.log(JSON.stringify(activityContent));
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
        contentLocation: "",
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
  const ownerId = await createTestUser();
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
  const userId = await createTestUser();
  const { activityId } = await createActivity(userId);
  const activityName = "Test Name";
  await updateActivity({ activityId, name: activityName });
  const activityContent = await getActivityEditorData(activityId);
  const docId = activityContent.documents[0].docId;
  expect(activityContent.name).toBe(activityName);
  const content = "Here comes some content, I made you some content";
  await updateDoc({ docId, content });
  const activityContent2 = await getActivityEditorData(activityId);
  expect(activityContent2.documents[0].contentLocation).toBe(content);

  const activityViewerContent = await getActivityViewerData(activityId);
  expect(activityViewerContent.activity.name).toBe(activityName);
  expect(activityViewerContent.doc.contentLocation).toBe(content);
});

test("deleteActivity marks a document as deleted", async () => {
  const userId = await createTestUser();
  const { activityId } = await createActivity(userId);
  const deleteResult = await deleteActivity(activityId);
  expect(deleteResult.isDeleted).toBe(true);
});

test("updateDoc updates document properties", async () => {
  const userId = await createTestUser();
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
  expect(activityViewerContent.doc.contentLocation).toBe(newContent);
});

test("copyPublicActivityToPortfolio copies a public document to a new owner", async () => {
  const originalOwnerId = await createTestUser();
  const newOwnerId = await createTestUser();
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
  const ownerId1 = await createTestUser();
  const ownerId2 = await createTestUser();
  const ownerId3 = await createTestUser();

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
  expect(activity2.documents[0].contentLocation).eq(activity1Content);

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
  expect(activity3.documents[0].contentLocation).eq(activity1ContentModified);

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
  const ownerId = await createTestUser();
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
  const userId = await findOrCreateUser(email, name);
  expect(userId).toBeTypeOf("number");
  // Attempt to find the same user again
  const sameUserId = await findOrCreateUser(email, name);
  expect(sameUserId).toBe(userId);
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
  const ownerId = await createTestUser();
  const { activityId } = await createActivity(ownerId);
  await deleteActivity(activityId);
  await expect(getActivity(activityId)).rejects.toThrow("No activities found");
});

test("updateActivity does not update properties when passed undefined values", async () => {
  const ownerId = await createTestUser();
  const { activityId } = await createActivity(ownerId);
  const originalActivity = await getActivity(activityId);
  await updateActivity({ activityId });
  const updatedActivity = await getActivity(activityId);
  expect(updatedActivity).toEqual(originalActivity);
});

test("addPromotedContentGroup does not allow duplicates", async () => {
  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const firstGroup = await addPromotedContentGroup(groupName);
  expect(firstGroup).toEqual({success: true});
  const duplicateGroup = await addPromotedContentGroup(groupName);
  expect(duplicateGroup).toEqual({success: false, message: "A group with that name already exists."});
});