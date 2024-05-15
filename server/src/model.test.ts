import { expect, test, vi } from 'vitest'
import { copyPublicDocumentToPortfolio, createDocument, createDocumentVersion, createUser, deleteDocument, findOrCreateUser, getAllDoenetmlVersions, getDoc, getDocEditorData, getDocViewerData, listUserDocs, saveDoc, searchPublicDocs } from './model'

const EMPTY_DOC_CID = "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

// create an isolated user for each test, will allow tests to be run in parallel
async function createTestUser() {
  const username = "vitest-" + new Date().toJSON() + "@vitest.test"
  return await findOrCreateUser(username);
}

test('New user has an empty portfolio', async () => {
  const userId = await createTestUser();
  const docs = await listUserDocs(userId);
  expect(docs).toStrictEqual(
  {
    success: true,
    publicActivities: [],
    privateActivities: [],
    fullName: "stand-in name",
    notMe: false,
  });
});

test('New document starts out private, then delete it', async () => {
  const userId = await createTestUser();
  const docId = await createDocument(userId);
  const docContent = await getDocEditorData(docId);
  expect(docContent).toStrictEqual(
  {
         "activity": {
           "content": "",
           "doenetmlVersion": {
             "default": true,
             "deprecated": false,
             "deprecationMessage": "",
             "displayedVersion": "0.7",
             "fullVersion": "0.7.0-alpha1",
             "removed": false,
             "versionId": 2,
           },
           "imagePath": "/activity_default.jpg",
           "isPublic": false,
           "isSinglePage": true,
           "label": "untitled doc",
           "learningOutcomes": [],
           "type": "activity",
           "version": "",
         },
         "courseId": null,
          "success": true,
  });

  const docs = await listUserDocs(userId);

  expect(docs.privateActivities.length).toBe(1);
  expect(docs.publicActivities.length).toBe(0);

  await deleteDocument(docId);

  const docsAfterDelete = await listUserDocs(userId);

  expect(docsAfterDelete.privateActivities.length).toBe(0);
  expect(docsAfterDelete.publicActivities.length).toBe(0);
});

test('listUserDocs returns both public and private documents for a user', async () => {
  const ownerId = await createTestUser();
  const publicDocId = await createDocument(ownerId);
  const privateDocId = await createDocument(ownerId);
  // Make one document public
  await saveDoc({ docId: publicDocId, isPublic: true });
  const userDocs = await listUserDocs(ownerId);
  expect(userDocs).toMatchObject({
    success: true,
    publicActivities: expect.arrayContaining([
      expect.objectContaining({
        doenetId: publicDocId,
      }),
    ]),
    privateActivities: expect.arrayContaining([
      expect.objectContaining({
        doenetId: privateDocId,
      }),
    ]),
  });
});

test('Test updating various doc properties', async () => {
  const userId = await createTestUser();
  const docId = await createDocument(userId);
  const docName = "Test Name";
  await saveDoc({docId, name: docName});
  const docContent = await getDocEditorData(docId);
  expect(docContent.activity.label).toBe(docName);
  const content = "Here comes some content, I made you some content";
  await saveDoc({docId, content});
  const docContent2 = await getDocEditorData(docId);
  expect(docContent2.activity.content).toBe(content);

  const docViewerContent = await getDocViewerData(docId);
  expect(docViewerContent.label).toBe(docName);
  expect(docViewerContent.content).toBe(content);
});

test('deleteDocument marks a document as deleted', async () => {
  const userId = await createTestUser();
  const docId = await createDocument(userId);
  const deleteResult = await deleteDocument(docId);
  expect(deleteResult.isDeleted).toBe(true);
});

test('saveDoc updates document properties', async () => {
  const userId = await createTestUser();
  const docId = await createDocument(userId);
  const newName = 'Updated Name';
  const newContent = 'Updated Content';
  await saveDoc({ docId, name: newName, content: newContent });
  const updatedDoc = await getDoc(docId);
  expect(updatedDoc.name).toBe(newName);
  expect(updatedDoc.contentLocation).toBe(newContent);
});

test('copyPublicDocumentToPortfolio copies a public document to a new owner', async () => {
  const originalOwnerId = await createTestUser();
  const newOwnerId = await createTestUser();
  const docId = await createDocument(originalOwnerId);
  // Make the document public before copying
  await saveDoc({ docId, isPublic: true });
  const newDocId = await copyPublicDocumentToPortfolio(docId, newOwnerId);
  const newDoc = await getDoc(newDocId);
  expect(newDoc.ownerId).toBe(newOwnerId);
  expect(newDoc.isPublic).toBe(false);
});

test('createDocumentVersion creates a new version for a document', async () => {
  const ownerId = await createTestUser();
  const docId = await createDocument(ownerId);
  const docVersion = await createDocumentVersion(docId, ownerId);
  expect(docVersion).toMatchObject({
    version: 1,
    docId: docId,
    cid: EMPTY_DOC_CID,
    contentLocation: '',
    createdAt: expect.any(Date),
    doenetmlVersionId: 2
  });

  const docVersionUnchangedContent = await createDocumentVersion(docId, ownerId);
  expect(docVersionUnchangedContent.version).toBe(1);

  const content = "Here comes some content, I made you some content";
  await saveDoc({docId, content});
  const docVersionNewContent = await createDocumentVersion(docId, ownerId);
  expect(docVersionNewContent.version).toBe(2);
});

test('searchPublicDocs returns documents matching the query', async () => {
  const ownerId = await createTestUser();
  const docId = await createDocument(ownerId);
  // Make the document public and give it a unique name for the test
  const uniqueName = 'UniqueNameForSearchTest';
  await saveDoc({ docId, name: uniqueName, isPublic: true });
  const searchResults = await searchPublicDocs(uniqueName);
  expect(searchResults).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: uniqueName,
      }),
    ])
  );
});

test('findOrCreateUser finds an existing user or creates a new one', async () => {
  const email = `unique-${Date.now()}@example.com`;
  const userId = await findOrCreateUser(email);
  expect(userId).toBeTypeOf('number');
  // Attempt to find the same user again
  const sameUserId = await findOrCreateUser(email);
  expect(sameUserId).toBe(userId);
});

test('getAllDoenetmlVersions retrieves all non-removed versions', async () => {
  const allVersions = await getAllDoenetmlVersions();
  expect(allVersions).toBeInstanceOf(Array);
  // there should be at least one version
  expect(allVersions.length).toBeGreaterThan(0);
  // Ensure none of the versions are marked as removed
  allVersions.forEach(version => {
    expect(version.removed).toBe(false);
  });
});

test('deleteDocument prevents a document from being retrieved', async () => {
  const ownerId = await createTestUser();
  const docId = await createDocument(ownerId);
  await deleteDocument(docId);
  await expect(getDoc(docId)).rejects.toThrow('No documents found');
});

test('saveDoc does not update properties when passed undefined values', async () => {
  const ownerId = await createTestUser();
  const docId = await createDocument(ownerId);
  const originalDoc = await getDoc(docId);
  await saveDoc({ docId });
  const updatedDoc = await getDoc(docId);
  expect(updatedDoc).toEqual(originalDoc);
});