import { expect, test, vi } from 'vitest'
import { createDocument, deleteDocument, findOrCreateUser, getDocEditorData, listUserDocs } from './model'

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

test('New document starts out private', async () => {
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

