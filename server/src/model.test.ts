import { expect, test, vi } from "vitest";
import {
  // copyPublicDocumentToPortfolio,
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
  searchPublicDocs,
  updateActivity,
  getActivity,
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
    fullName: "vitest user",
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

test.only("copyPublicDocumentToPortfolio copies a public document to a new owner", async () => {
  const originalOwnerId = await createTestUser();
  const newOwnerId = await createTestUser();
  const docId = await createActivity(originalOwnerId);
  // Make the document public before copying
  await updateDoc({ docId, isPublic: true });
  const newDocId = await copyPublicDocumentToPortfolio(docId, newOwnerId);
  const newDoc = await getDoc(newDocId);
  expect(newDoc.ownerId).toBe(newOwnerId);
  expect(newDoc.isPublic).toBe(false);
});

test("createDocumentVersion creates a new version for a document", async () => {
  const ownerId = await createTestUser();
  const docId = await createActivity(ownerId);
  const docVersion = await createDocumentVersion(docId, ownerId);
  expect(docVersion).toMatchObject({
    version: 1,
    docId: docId,
    cid: EMPTY_DOC_CID,
    contentLocation: "",
    createdAt: expect.any(Date),
    doenetmlVersionId: 2,
  });

  const docVersionUnchangedContent = await createDocumentVersion(
    docId,
    ownerId,
  );
  expect(docVersionUnchangedContent.version).toBe(1);

  const content = "Here comes some content, I made you some content";
  await updateDoc({ docId, content });
  const docVersionNewContent = await createDocumentVersion(docId, ownerId);
  expect(docVersionNewContent.version).toBe(2);
});

test("searchPublicDocs returns documents matching the query", async () => {
  const ownerId = await createTestUser();
  const docId = await createActivity(ownerId);
  // Make the document public and give it a unique name for the test
  const uniqueName = "UniqueNameForSearchTest";
  await updateDoc({ docId, name: uniqueName, isPublic: true });
  const searchResults = await searchPublicDocs(uniqueName);
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
  const userId = await findOrCreateUser(email);
  expect(userId).toBeTypeOf("number");
  // Attempt to find the same user again
  const sameUserId = await findOrCreateUser(email);
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
