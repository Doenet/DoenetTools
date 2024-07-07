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
  getFolderContent,
  updateDoc,
  searchPublicContent,
  updateContent,
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
  saveScoreAndState,
  getAssignmentScoreData,
  loadState,
  getAssignmentStudentData,
  recordSubmittedEvent,
  getDocumentSubmittedResponses,
  getAnswersThatHaveSubmittedResponses,
  getDocumentSubmittedResponseHistory,
  updatePromotedContentGroup,
  removePromotedContent,
  loadPromotedContent,
  deletePromotedContentGroup,
  getStudentData,
  getAllAssignmentScores,
  unassignActivity,
  listUserAssigned,
  createFolder,
  moveContent,
  deleteFolder,
  getAssignedScores,
} from "./model";
import { DateTime } from "luxon";

const EMPTY_DOC_CID =
  "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

const currentDoenetmlVersion = {
  id: 2,
  displayedVersion: "0.7",
  fullVersion: "0.7.0-alpha18",
  default: true,
  deprecated: false,
  removed: false,
  deprecationMessage: "",
};

// create an isolated user for each test, will allow tests to be run in parallel
async function createTestUser(isAdmin = false) {
  const username = "vitest-" + new Date().toJSON() + "@vitest.test";
  const user = await findOrCreateUser(username, "vitest user", isAdmin);
  return user;
}

async function createTestAdminUser() {
  return await createTestUser(true);
}

test("New user has no content", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const docs = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: null,
  });
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
  const { activityId, docId } = await createActivity(userId, null);
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
        id: docId,
        versionNum: null,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
  });

  const data = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: null,
  });

  expect(data.content.length).toBe(1);
  expect(data.content[0].isPublic).eq(false);
  expect(data.content[0].isAssigned).eq(false);

  await deleteActivity(activityId, userId);

  await expect(getActivityEditorData(activityId, userId)).rejects.toThrow(
    "No content found",
  );

  const dataAfterDelete = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: null,
  });

  expect(dataAfterDelete.content.length).toBe(0);
});

test("getFolderContent returns both public and private content only for owner", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  // User is not the owner
  const user = await createTestUser();
  const userId = user.userId;

  const { activityId: publicActivity1Id } = await createActivity(ownerId, null);
  const { activityId: privateActivity1Id } = await createActivity(
    ownerId,
    null,
  );

  const { folderId: publicFolder1Id } = await createFolder(ownerId, null);
  const { folderId: privateFolder1Id } = await createFolder(ownerId, null);

  const { activityId: publicActivity2Id } = await createActivity(
    ownerId,
    publicFolder1Id,
  );
  const { activityId: privateActivity2Id } = await createActivity(
    ownerId,
    publicFolder1Id,
  );
  const { folderId: publicFolder2Id } = await createFolder(
    ownerId,
    publicFolder1Id,
  );
  const { folderId: privateFolder2Id } = await createFolder(
    ownerId,
    publicFolder1Id,
  );

  const { activityId: publicActivity3Id } = await createActivity(
    ownerId,
    privateFolder1Id,
  );
  const { activityId: privateActivity3Id } = await createActivity(
    ownerId,
    privateFolder1Id,
  );
  const { folderId: publicFolder3Id } = await createFolder(
    ownerId,
    privateFolder1Id,
  );
  const { folderId: privateFolder3Id } = await createFolder(
    ownerId,
    privateFolder1Id,
  );

  // Make items public
  await updateContent({
    id: publicActivity1Id,
    isPublic: true,
    ownerId,
  });
  await updateContent({
    id: publicActivity2Id,
    isPublic: true,
    ownerId,
  });
  await updateContent({
    id: publicActivity3Id,
    isPublic: true,
    ownerId,
  });
  await updateContent({
    id: publicFolder1Id,
    isPublic: true,
    ownerId,
  });
  await updateContent({
    id: publicFolder2Id,
    isPublic: true,
    ownerId,
  });
  await updateContent({
    id: publicFolder3Id,
    isPublic: true,
    ownerId,
  });

  let ownerContent = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: null,
  });
  expect(ownerContent.content.length).eq(4);
  expect(ownerContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity1Id,
        isPublic: true,
      }),
      expect.objectContaining({
        id: privateActivity1Id,
        isPublic: false,
      }),
      expect.objectContaining({
        id: publicFolder1Id,
        isPublic: true,
      }),
      expect.objectContaining({
        id: privateFolder1Id,
        isPublic: false,
      }),
    ]),
  });

  let userContent = await getFolderContent({
    ownerId,
    loggedInUserId: userId,
    folderId: null,
  });
  expect(userContent.content.length).eq(2);
  expect(userContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity1Id,
        isPublic: true,
      }),
      expect.objectContaining({
        id: publicFolder1Id,
        isPublic: true,
      }),
    ]),
  });

  ownerContent = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: publicFolder1Id,
  });
  expect(ownerContent.content.length).eq(4);
  expect(ownerContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity2Id,
        isPublic: true,
      }),
      expect.objectContaining({
        id: privateActivity2Id,
        isPublic: false,
      }),
      expect.objectContaining({
        id: publicFolder2Id,
        isPublic: true,
      }),
      expect.objectContaining({
        id: privateFolder2Id,
        isPublic: false,
      }),
    ]),
  });

  userContent = await getFolderContent({
    ownerId,
    loggedInUserId: userId,
    folderId: publicFolder1Id,
  });
  expect(userContent.content.length).eq(2);
  expect(userContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity2Id,
        isPublic: true,
      }),
      expect.objectContaining({
        id: publicFolder2Id,
        isPublic: true,
      }),
    ]),
  });

  ownerContent = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: privateFolder1Id,
  });
  expect(ownerContent.content.length).eq(4);
  expect(ownerContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity3Id,
        isPublic: true,
      }),
      expect.objectContaining({
        id: privateActivity3Id,
        isPublic: false,
      }),
      expect.objectContaining({
        id: publicFolder3Id,
        isPublic: true,
      }),
      expect.objectContaining({
        id: privateFolder3Id,
        isPublic: false,
      }),
    ]),
  });

  await expect(
    getFolderContent({
      ownerId,
      loggedInUserId: userId,
      folderId: privateFolder1Id,
    }),
  ).rejects.toThrow("No content found");
});

test("Test updating various activity properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId } = await createActivity(userId, null);
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
  const { activityId, docId } = await createActivity(userId, null);

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
  const { activityId, docId } = await createActivity(ownerId, null);

  await expect(deleteActivity(activityId, user2Id)).rejects.toThrow(
    "Record to update not found",
  );

  const deleteResult = await deleteActivity(activityId, ownerId);
  expect(deleteResult.isDeleted).toBe(true);
});

test("deleteFolder marks a folder and all its sub content as deleted and prevents its retrieval", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  const { folderId: folder1Id } = await createFolder(userId, null);

  const { activityId: activity1Id, docId: doc1Id } = await createActivity(
    userId,
    folder1Id,
  );
  const { folderId: folder2Id } = await createFolder(userId, folder1Id);
  const { activityId: activity2Id, docId: doc2Id } = await createActivity(
    userId,
    folder2Id,
  );
  const { folderId: folder3Id } = await createFolder(userId, folder2Id);
  const { activityId: activity3Id, docId: doc3Id } = await createActivity(
    userId,
    folder3Id,
  );

  const { folderId: folder4Id } = await createFolder(userId, null);
  const { activityId: activity4Id, docId: doc4Id } = await createActivity(
    userId,
    folder4Id,
  );
  const { folderId: folder5Id } = await createFolder(userId, folder4Id);
  const { activityId: activity5Id, docId: doc5Id } = await createActivity(
    userId,
    folder5Id,
  );
  const { folderId: folder6Id } = await createFolder(userId, folder5Id);
  const { activityId: activity6Id, docId: doc6Id } = await createActivity(
    userId,
    folder6Id,
  );

  // items can be retrieved
  let baseContent = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: null,
  });
  expect(baseContent.content.length).eq(2);
  let folder1Content = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: folder1Id,
  });
  expect(folder1Content.content.length).eq(2);
  let folder2Content = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: folder2Id,
  });
  expect(folder2Content.content.length).eq(2);
  let folder3Content = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: folder3Id,
  });
  expect(folder3Content.content.length).eq(1);
  let folder4Content = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: folder4Id,
  });
  expect(folder4Content.content.length).eq(2);
  let folder5Content = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: folder5Id,
  });
  expect(folder5Content.content.length).eq(2);
  let folder6Content = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: folder6Id,
  });
  expect(folder6Content.content.length).eq(1);

  await getActivity(activity1Id);
  await getActivity(activity2Id);
  await getActivity(activity3Id);
  await getActivity(activity4Id);
  await getActivity(activity5Id);
  await getActivity(activity6Id);
  await getDoc(doc1Id);
  await getDoc(doc2Id);
  await getDoc(doc3Id);
  await getDoc(doc4Id);
  await getDoc(doc5Id);
  await getDoc(doc6Id);

  // delete the entire folder 1 and all its content
  let deleteResult = await deleteFolder(folder1Id, userId);
  expect(deleteResult.isDeleted).eq(true);

  baseContent = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: null,
  });
  expect(baseContent.content.length).eq(1);
  await expect(
    getFolderContent({
      ownerId: userId,
      loggedInUserId: userId,
      folderId: folder1Id,
    }),
  ).rejects.toThrow("No content found");
  await expect(
    getFolderContent({
      ownerId: userId,
      loggedInUserId: userId,
      folderId: folder2Id,
    }),
  ).rejects.toThrow("No content found");
  await expect(
    getFolderContent({
      ownerId: userId,
      loggedInUserId: userId,
      folderId: folder3Id,
    }),
  ).rejects.toThrow("No content found");
  folder4Content = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: folder4Id,
  });
  expect(folder4Content.content.length).eq(2);
  folder5Content = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: folder5Id,
  });
  expect(folder5Content.content.length).eq(2);
  folder6Content = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: folder6Id,
  });
  expect(folder6Content.content.length).eq(1);

  await expect(getActivity(activity1Id)).rejects.toThrow("No content found");
  await expect(getActivity(activity2Id)).rejects.toThrow("No content found");
  await expect(getActivity(activity3Id)).rejects.toThrow("No content found");
  await getActivity(activity4Id);
  await getActivity(activity5Id);
  await getActivity(activity6Id);
  await expect(getDoc(doc1Id)).rejects.toThrow("No documents found");
  await expect(getDoc(doc2Id)).rejects.toThrow("No documents found");
  await expect(getDoc(doc3Id)).rejects.toThrow("No documents found");
  await getDoc(doc4Id);
  await getDoc(doc5Id);
  await getDoc(doc6Id);

  // delete folder 5 and its content
  deleteResult = await deleteFolder(folder5Id, userId);
  expect(deleteResult.isDeleted).eq(true);

  baseContent = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: null,
  });
  expect(baseContent.content.length).eq(1);
  folder4Content = await getFolderContent({
    ownerId: userId,
    loggedInUserId: userId,
    folderId: folder4Id,
  });
  expect(folder4Content.content.length).eq(1);
  await expect(
    getFolderContent({
      ownerId: userId,
      loggedInUserId: userId,
      folderId: folder5Id,
    }),
  ).rejects.toThrow("No content found");
  await expect(
    getFolderContent({
      ownerId: userId,
      loggedInUserId: userId,
      folderId: folder6Id,
    }),
  ).rejects.toThrow("No content found");

  await getActivity(activity4Id);
  await expect(getActivity(activity5Id)).rejects.toThrow("No content found");
  await expect(getActivity(activity6Id)).rejects.toThrow("No content found");
  await getDoc(doc4Id);
  await expect(getDoc(doc5Id)).rejects.toThrow("No documents found");
  await expect(getDoc(doc6Id)).rejects.toThrow("No documents found");
});

test("non-owner cannot delete folder", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user = await createTestUser();
  const userId = user.userId;

  const { folderId } = await createFolder(ownerId, null);
  await expect(deleteFolder(folderId, userId)).rejects.toThrow(
    "No content found",
  );

  // folder is still around
  getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId,
  });
});

test("updateDoc updates document properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId, docId } = await createActivity(userId, null);
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

test("move content to different locations", async () => {
  const ownerId = (await createTestUser()).userId;

  const { activityId: activity1Id } = await createActivity(ownerId, null);
  const { activityId: activity2Id } = await createActivity(ownerId, null);
  const { folderId: folder1Id } = await createFolder(ownerId, null);
  const { activityId: activity3Id } = await createActivity(ownerId, folder1Id);
  const { folderId: folder2Id } = await createFolder(ownerId, folder1Id);
  const { folderId: folder3Id } = await createFolder(ownerId, null);

  let baseContent = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: null,
  });
  let folder1Content = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: folder1Id,
  });
  let folder2Content = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: folder2Id,
  });
  let folder3Content = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: folder3Id,
  });

  expect(baseContent.content.map((item) => item.id)).eqls([
    activity1Id,
    activity2Id,
    folder1Id,
    folder3Id,
  ]);

  expect(folder1Content.content.map((item) => item.id)).eqls([
    activity3Id,
    folder2Id,
  ]);
  expect(folder2Content.content.map((item) => item.id)).eqls([]);
  expect(folder3Content.content.map((item) => item.id)).eqls([]);

  await moveContent({
    id: activity1Id,
    desiredParentFolderId: null,
    desiredPosition: 1,
    ownerId,
  });
  baseContent = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: null,
  });
  expect(baseContent.content.map((item) => item.id)).eqls([
    activity2Id,
    activity1Id,
    folder1Id,
    folder3Id,
  ]);

  await moveContent({
    id: folder1Id,
    desiredParentFolderId: null,
    desiredPosition: 0,
    ownerId,
  });
  baseContent = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: null,
  });
  expect(baseContent.content.map((item) => item.id)).eqls([
    folder1Id,
    activity2Id,
    activity1Id,
    folder3Id,
  ]);

  await moveContent({
    id: activity2Id,
    desiredParentFolderId: null,
    desiredPosition: 10,
    ownerId,
  });
  baseContent = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: null,
  });
  expect(baseContent.content.map((item) => item.id)).eqls([
    folder1Id,
    activity1Id,
    folder3Id,
    activity2Id,
  ]);

  await moveContent({
    id: folder3Id,
    desiredParentFolderId: null,
    desiredPosition: -10,
    ownerId,
  });
  baseContent = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: null,
  });
  expect(baseContent.content.map((item) => item.id)).eqls([
    folder3Id,
    folder1Id,
    activity1Id,
    activity2Id,
  ]);

  await moveContent({
    id: folder3Id,
    desiredParentFolderId: folder1Id,
    desiredPosition: 0,
    ownerId,
  });
  baseContent = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: null,
  });
  folder1Content = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: folder1Id,
  });
  expect(baseContent.content.map((item) => item.id)).eqls([
    folder1Id,
    activity1Id,
    activity2Id,
  ]);
  expect(folder1Content.content.map((item) => item.id)).eqls([
    folder3Id,
    activity3Id,
    folder2Id,
  ]);

  await moveContent({
    id: activity3Id,
    desiredParentFolderId: null,
    desiredPosition: 2,
    ownerId,
  });
  baseContent = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: null,
  });
  folder1Content = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: folder1Id,
  });
  expect(baseContent.content.map((item) => item.id)).eqls([
    folder1Id,
    activity1Id,
    activity3Id,
    activity2Id,
  ]);
  expect(folder1Content.content.map((item) => item.id)).eqls([
    folder3Id,
    folder2Id,
  ]);

  await moveContent({
    id: folder2Id,
    desiredParentFolderId: folder3Id,
    desiredPosition: 2,
    ownerId,
  });
  folder1Content = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: folder1Id,
  });
  folder3Content = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: folder3Id,
  });
  expect(folder1Content.content.map((item) => item.id)).eqls([folder3Id]);
  expect(folder3Content.content.map((item) => item.id)).eqls([folder2Id]);

  await moveContent({
    id: activity3Id,
    desiredParentFolderId: folder3Id,
    desiredPosition: 0,
    ownerId,
  });
  await moveContent({
    id: activity1Id,
    desiredParentFolderId: folder2Id,
    desiredPosition: 1,
    ownerId,
  });
  baseContent = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: null,
  });
  folder2Content = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: folder2Id,
  });
  folder3Content = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: folder3Id,
  });
  expect(baseContent.content.map((item) => item.id)).eqls([
    folder1Id,
    activity2Id,
  ]);
  expect(folder2Content.content.map((item) => item.id)).eqls([activity1Id]);
  expect(folder3Content.content.map((item) => item.id)).eqls([
    activity3Id,
    folder2Id,
  ]);
});

test("cannot move folder into itself or a subfolder of itself", async () => {
  const ownerId = (await createTestUser()).userId;

  const { folderId: folder1Id } = await createFolder(ownerId, null);
  const { folderId: folder2Id } = await createFolder(ownerId, folder1Id);
  const { folderId: folder3Id } = await createFolder(ownerId, folder2Id);
  const { folderId: folder4Id } = await createFolder(ownerId, folder3Id);

  await expect(
    moveContent({
      id: folder1Id,
      desiredParentFolderId: folder1Id,
      desiredPosition: 0,
      ownerId,
    }),
  ).rejects.toThrow("Cannot move folder into itself");

  await expect(
    moveContent({
      id: folder1Id,
      desiredParentFolderId: folder2Id,
      desiredPosition: 0,
      ownerId,
    }),
  ).rejects.toThrow("Cannot move folder into a subfolder of itself");

  await expect(
    moveContent({
      id: folder1Id,
      desiredParentFolderId: folder3Id,
      desiredPosition: 0,
      ownerId,
    }),
  ).rejects.toThrow("Cannot move folder into a subfolder of itself");

  await expect(
    moveContent({
      id: folder1Id,
      desiredParentFolderId: folder4Id,
      desiredPosition: 0,
      ownerId,
    }),
  ).rejects.toThrow("Cannot move folder into a subfolder of itself");
});

test("insert many items into sort order", { timeout: 30000 }, async () => {
  // This test is designed to test the parts of the moveContent
  // where the gap between successive sort indices reaches 1,
  // so that sort indices need to be shifted left or right.
  // As long as SORT_INCREMENT is 2**32, this happens after 33 inserts into the same gap.
  // (The test takes a long time to run; it could be made shorter if we could initialize
  // sort indices to desired values rather than performing so many moves.)

  const ownerId = (await createTestUser()).userId;

  const { activityId: activity1Id } = await createActivity(ownerId, null);
  const { activityId: activity2Id } = await createActivity(ownerId, null);
  const { activityId: activity3Id } = await createActivity(ownerId, null);
  const { activityId: activity4Id } = await createActivity(ownerId, null);
  const { activityId: activity5Id } = await createActivity(ownerId, null);
  const { activityId: activity6Id } = await createActivity(ownerId, null);

  // With the current algorithm and parameters,
  // the sort indices will need to be shifted after 32 inserts in between a pair of items.
  // Repeatedly moving items to position 3 will eventually cause a shift to the right.
  for (let i = 0; i < 5; i++) {
    await moveContent({
      id: activity1Id,
      desiredParentFolderId: null,
      desiredPosition: 3,
      ownerId,
    });
    await moveContent({
      id: activity2Id,
      desiredParentFolderId: null,
      desiredPosition: 3,
      ownerId,
    });
    await moveContent({
      id: activity3Id,
      desiredParentFolderId: null,
      desiredPosition: 3,
      ownerId,
    });
    await moveContent({
      id: activity4Id,
      desiredParentFolderId: null,
      desiredPosition: 3,
      ownerId,
    });
    await moveContent({
      id: activity6Id,
      desiredParentFolderId: null,
      desiredPosition: 3,
      ownerId,
    });
    if (i === 4) {
      // This is the 33rd insert, so we invoked a shift to the right
      break;
    }
    await moveContent({
      id: activity5Id,
      desiredParentFolderId: null,
      desiredPosition: 3,
      ownerId,
    });
    await moveContent({
      id: activity4Id,
      desiredParentFolderId: null,
      desiredPosition: 3,
      ownerId,
    });
  }

  let contentList = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: null,
  });
  expect(contentList.content.map((item) => item.id)).eqls([
    activity1Id,
    activity2Id,
    activity3Id,
    activity6Id,
    activity4Id,
    activity5Id,
  ]);

  // Activities 4 and 5 were shifted right to make room for activity 6.
  // There is still a small gap between activities 2 and 3.
  // Moving activities 5 and 4 into position 2 will place them into that gap will trigger a shift,
  // this time to the left since fewer items are to the left.
  await moveContent({
    id: activity5Id,
    desiredParentFolderId: null,
    desiredPosition: 2,
    ownerId,
  });
  await moveContent({
    id: activity4Id,
    desiredParentFolderId: null,
    desiredPosition: 2,
    ownerId,
  });

  contentList = await getFolderContent({
    ownerId,
    loggedInUserId: ownerId,
    folderId: null,
  });
  expect(contentList.content.map((item) => item.id)).eqls([
    activity1Id,
    activity2Id,
    activity4Id,
    activity5Id,
    activity3Id,
    activity6Id,
  ]);
});

test("copyActivityToFolder copies a public document to a new owner", async () => {
  const originalOwnerId = (await createTestUser()).userId;
  const newOwnerId = (await createTestUser()).userId;
  const { activityId, docId } = await createActivity(originalOwnerId, null);
  // cannot copy if not yet public
  await expect(
    copyActivityToFolder(activityId, newOwnerId, null),
  ).rejects.toThrow("No content found");

  // Make the activity public before copying
  await updateContent({
    id: activityId,
    isPublic: true,
    ownerId: originalOwnerId,
  });
  const newActivityId = await copyActivityToFolder(
    activityId,
    newOwnerId,
    null,
  );
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
  const { activityId: activityId1, docId: docId1 } = await createActivity(
    ownerId1,
    null,
  );
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

  // copy activity 1 to owner 2's root folder
  const activityId2 = await copyActivityToFolder(activityId1, ownerId2, null);
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

  // copy activity 1 to owner 3's Activities page
  const activityId3 = await copyActivityToFolder(activityId1, ownerId3, null);

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
  const { activityId } = await createActivity(ownerId, null);
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
  const { activityId } = await createActivity(ownerId, null);
  await deleteActivity(activityId, ownerId);
  await expect(getActivity(activityId)).rejects.toThrow("No content found");
});

test("updateContent does not update properties when passed undefined values", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId, null);
  const originalActivity = await getActivity(activityId);
  await updateContent({ id: activityId, ownerId });
  const updatedActivity = await getActivity(activityId);
  expect(updatedActivity).toEqual(originalActivity);
});

test("add and remove promoted content", async () => {
  const { userId, name: userName } = await createTestAdminUser();

  // Can create new promoted content group
  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  await addPromotedContentGroup(groupName, userId);
  const groups = await loadPromotedContent(userId);
  const groupId = groups.find(
    (group) => group.groupName === groupName,
  )!.promotedGroupId;
  expect(groups.find((group) => group.groupName === groupName)).toBeDefined();

  // Creating the same group again should fail
  await expect(addPromotedContentGroup(groupName, userId)).rejects.toThrowError(
    "Unique constraint failed",
  );

  // Cannot promote private activity to that group
  const { activityId } = await createActivity(userId, null);
  await expect(
    addPromotedContent(groupId, activityId, userId),
  ).rejects.toThrowError("not public");
  {
    const promotedContent = await loadPromotedContent(userId);
    const myGroup = promotedContent.find(
      (content) => content.groupName === groupName,
    );
    expect(myGroup).toBeDefined();
    expect(myGroup?.promotedContent).toEqual([]);
  }

  // Can promote public activity to that group
  await updateContent({ id: activityId, isPublic: true, ownerId: userId });
  await addPromotedContent(groupId, activityId, userId);
  {
    const promotedContent = await loadPromotedContent(userId);
    const myContent = promotedContent.find(
      (content) => content.promotedGroupId === groupId,
    );
    expect(myContent).toBeDefined();
    expect(myContent?.promotedContent[0].activityId).toEqual(activityId);
  }

  // Cannot add to same group twice
  await expect(
    addPromotedContent(groupId, activityId, userId),
  ).rejects.toThrowError("Unique constraint failed");
  {
    const promotedContent = await loadPromotedContent(userId);
    const myContent = promotedContent.find(
      (content) => content.promotedGroupId === groupId,
    );
    expect(myContent).toBeDefined();
    expect(myContent?.promotedContent.length).toEqual(1);
  }

  // Cannot promote non-existent activity
  const fakeActivityId = Math.random() * 1e8;
  await expect(
    addPromotedContent(groupId, fakeActivityId, userId),
  ).rejects.toThrowError("does not exist");
  {
    const promotedContent = await loadPromotedContent(userId);
    const myContent = promotedContent.find(
      (content) => content.promotedGroupId === groupId,
    );
    expect(myContent).toBeDefined();
    expect(myContent?.promotedContent.length).toEqual(1);
  }

  // Cannot promote to non-existent group
  const fakeGroupId = Math.random() * 1e8;
  await expect(
    addPromotedContent(fakeGroupId, activityId, userId),
  ).rejects.toThrowError("Foreign key constraint failed");
  {
    const promotedContent = await loadPromotedContent(userId);
    const myContent = promotedContent.find(
      (content) => content.promotedGroupId === groupId,
    );
    expect(myContent).toBeDefined();
    expect(myContent?.promotedContent.length).toEqual(1);
  }

  // Remove content from group
  await removePromotedContent(groupId, activityId, userId);
  {
    const promotedContent = await loadPromotedContent(userId);
    const myContent = promotedContent.find(
      (content) => content.promotedGroupId === groupId,
    );
    expect(myContent).toBeDefined();
    expect(myContent?.promotedContent.length).toEqual(0);
  }

  // Cannot remove non-existent activity
  await expect(
    removePromotedContent(fakeGroupId, activityId, userId),
  ).rejects.toThrowError("does not exist");
});

test("delete promoted content group", async () => {
  const { userId } = await createTestAdminUser();
  const { activityId: activity1 } = await createActivity(userId, null);
  const { activityId: activity2 } = await createActivity(userId, null);
  await updateContent({
    id: activity1,
    isPublic: true,
    ownerId: userId,
  });
  await updateContent({
    id: activity2,
    isPublic: true,
    ownerId: userId,
  });

  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  await addPromotedContentGroup(groupName, userId);
  const groups = await loadPromotedContent(userId);
  const groupId = groups.find(
    (group) => group.groupName === groupName,
  )!.promotedGroupId;
  await addPromotedContent(groupId, activity1, userId);
  await addPromotedContent(groupId, activity2, userId);

  await deletePromotedContentGroup(groupId, userId);
  const groupsAfterRemove = await loadPromotedContent(userId);
  expect(
    groupsAfterRemove.find((group) => group.groupName === groupName),
  ).toBeUndefined();
});

test("update promoted content group", async () => {
  const { userId } = await createTestAdminUser();

  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const groupId = await addPromotedContentGroup(groupName, userId);

  const secondGroupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const secondGroupId = await addPromotedContentGroup(secondGroupName, userId);

  const groups = await loadPromotedContent(userId);
  expect(groups.find((group) => group.groupName === groupName)).toBeDefined();
  expect(
    groups.find((group) => group.groupName === secondGroupName),
  ).toBeDefined();

  // Cannot update group name to different existing name
  await expect(
    updatePromotedContentGroup(groupId, secondGroupName, false, false, userId),
  ).rejects.toThrowError();

  const newGroupName =
    "vitest-unique-NEW-promoted-group-" + new Date().toJSON();
  await updatePromotedContentGroup(groupId, newGroupName, false, false, userId);

  const groups3 = await loadPromotedContent(userId);
  expect(
    groups3.find((group) => group.groupName === newGroupName),
  ).toBeDefined();
});

test("promoted content access control", async () => {
  // Setup
  const { userId } = await createTestUser();
  const { activityId } = await createActivity(userId, null);
  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const { activityId: promotedActivityId } = await createActivity(userId, null);
  await updateContent({
    id: promotedActivityId,
    isPublic: true,
    ownerId: userId,
  });
  const { userId: adminId } = await createTestAdminUser();
  const groupId = await addPromotedContentGroup(groupName, adminId);
  await addPromotedContent(groupId, promotedActivityId, adminId);

  // add group fails
  await expect(
    addPromotedContentGroup("some group name", userId),
  ).rejects.toThrowError("admin");

  // update group fails
  await expect(
    updatePromotedContentGroup(groupId, "some new name", true, true, userId),
  ).rejects.toThrowError("admin");

  // delete group fails
  await expect(
    deletePromotedContentGroup(groupId, userId),
  ).rejects.toThrowError("admin");

  // add content fails
  await expect(
    addPromotedContent(groupId, activityId, userId),
  ).rejects.toThrowError("admin");

  // remove content fails
  await expect(
    removePromotedContent(groupId, promotedActivityId, userId),
  ).rejects.toThrowError("admin");
});

test("assign an activity", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId, null);
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
  const { activityId } = await createActivity(ownerId1, null);
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
  const { activityId } = await createActivity(ownerId, null);
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
  const { activityId } = await createActivity(ownerId, null);
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
  const assignment = await getAssignment(activityId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  let assignmentData = await getAssignmentDataFromCode(classCode, true);
  expect(assignmentData.assignment!.id).eq(activityId);

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
  const { activityId } = await createActivity(ownerId, null);
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
  const { activityId } = await createActivity(ownerId, null);
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
  const { activityId, docId } = await createActivity(ownerId, null);
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
            doenetmlVersion: { fullVersion: "0.7.0-alpha18" },
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
            doenetmlVersion: { fullVersion: "0.7.0-alpha18" },
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
            doenetmlVersion: { fullVersion: "0.7.0-alpha18" },
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
            doenetmlVersion: { fullVersion: "0.7.0-alpha18" },
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
  const { activityId, docId } = await createActivity(ownerId, null);
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
  const { activityId, docId } = await createActivity(ownerId, null);
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
  const { activityId } = await createActivity(ownerId, null);

  await getActivityEditorData(activityId, ownerId);

  await expect(getActivityEditorData(activityId, otherUserId)).rejects.toThrow(
    "No content found",
  );
});

test("activity editor data before and after assigned", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId, null);

  const preAssignedData = await getActivityEditorData(activityId, ownerId);

  expect(preAssignedData).eqls({
    name: "Untitled Activity",
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isAssigned: false,
    stillOpen: false,
    classCode: null,
    codeValidUntil: null,
    documents: [
      {
        id: docId,
        versionNum: null,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
  });

  await assignActivity(activityId, ownerId);

  const assignedData = await getActivityEditorData(activityId, ownerId);

  expect(assignedData).eqls({
    name: "Untitled Activity",
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isAssigned: true,
    stillOpen: false,
    classCode: null,
    codeValidUntil: null,
    documents: [
      {
        id: docId,
        versionNum: 1,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
  });

  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  const openedData = await getActivityEditorData(activityId, ownerId);

  expect(openedData).eqls({
    name: "Untitled Activity",
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isAssigned: true,
    stillOpen: true,
    classCode,
    codeValidUntil: closeAt.toJSDate(),
    documents: [
      {
        id: docId,
        versionNum: 1,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
  });

  await closeAssignmentWithCode(activityId, ownerId);

  const closedData = await getActivityEditorData(activityId, ownerId);

  expect(closedData).eqls({
    name: "Untitled Activity",
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isAssigned: true,
    stillOpen: false,
    classCode,
    codeValidUntil: null,
    documents: [
      {
        id: docId,
        versionNum: 1,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
  });

  await unassignActivity(activityId, ownerId);

  const unAssignedData = await getActivityEditorData(activityId, ownerId);

  expect(unAssignedData).eqls({
    name: "Untitled Activity",
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isAssigned: false,
    stillOpen: false,
    classCode,
    codeValidUntil: null,
    documents: [
      {
        id: docId,
        versionNum: null,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
  });
});

test("only user and assignment owner can load document state", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId, null);
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
  const { activityId, docId } = await createActivity(ownerId, null);
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
  const { activityId, docId } = await createActivity(ownerId, null);
  await updateContent({ id: activityId, name: "My Activity", ownerId });
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

  let { submittedResponses, activityName } =
    await getDocumentSubmittedResponses({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId,
      answerId: answerId1,
    });
  expect(activityName).eq("My Activity");
  expect(submittedResponses).eqls([]);

  let {
    submittedResponses: submittedResponseHistory,
    activityName: activityName2,
  } = await getDocumentSubmittedResponseHistory({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
    userId: newUser!.userId,
  });
  expect(activityName2).eq("My Activity");
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
  ({ submittedResponses } = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  }));
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
  ({ submittedResponses: submittedResponseHistory } =
    await getDocumentSubmittedResponseHistory({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId,
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
  ({ submittedResponses } = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  }));
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
  ({ submittedResponses: submittedResponseHistory } =
    await getDocumentSubmittedResponseHistory({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId,
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
  ({ submittedResponses } = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  }));
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
  ({ submittedResponses: submittedResponseHistory } =
    await getDocumentSubmittedResponseHistory({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId,
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

  ({ submittedResponses } = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId2,
  }));
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
  ({ submittedResponses: submittedResponseHistory } =
    await getDocumentSubmittedResponseHistory({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId,
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
  ({ submittedResponses } = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  }));
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

  ({ submittedResponses: submittedResponseHistory } =
    await getDocumentSubmittedResponseHistory({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId,
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
    await getDocumentSubmittedResponseHistory({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId,
      answerId: answerId1,
      userId: newUser2!.userId,
    }));
  expect(submittedResponseHistory).toMatchObject([
    {
      user: userData2,
      response: "Answer result 4",
      creditAchieved: 1,
    },
  ]);

  ({ submittedResponses } = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId2,
  }));
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
  ({ submittedResponses: submittedResponseHistory } =
    await getDocumentSubmittedResponseHistory({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId,
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
    await getDocumentSubmittedResponseHistory({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId,
      answerId: answerId2,
      userId: newUser2!.userId,
    }));
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

  ({ submittedResponses: submittedResponseHistory } =
    await getDocumentSubmittedResponseHistory({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId,
      answerId: answerId1,
      userId: newUser2!.userId,
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

  ({ submittedResponses } = await getDocumentSubmittedResponses({
    activityId,
    docId,
    docVersionNum: 1,
    ownerId,
    answerId: answerId1,
  }));
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
  const { activityId, docId } = await createActivity(ownerId, null);
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
  let { submittedResponses } = await getDocumentSubmittedResponses({
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
  let { submittedResponses: submittedResponseHistory } =
    await getDocumentSubmittedResponseHistory({
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
  await expect(
    getDocumentSubmittedResponses({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId: userId2,
      answerId: answerId1,
    }),
  ).rejects.toThrow("No content found");

  await expect(
    getDocumentSubmittedResponseHistory({
      activityId,
      docId,
      docVersionNum: 1,
      ownerId: userId2,
      answerId: answerId1,
      userId: newUser!.userId,
    }),
  ).rejects.toThrow("No content found");
});

test("list assigned and get assigned scores get student assignments and scores", async () => {
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  let assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).eqls([]);
  expect(assignmentList.user.userId).eq(user1Id);

  let studentData = await getAssignedScores(user1Id);
  expect(studentData.orderedActivityScores).eqls([]);
  expect(studentData.userData.userId).eq(user1Id);

  const { activityId: activityId1 } = await createActivity(user1Id, null);
  await updateContent({
    id: activityId1,
    name: "Activity 1",
    ownerId: user1Id,
  });
  await assignActivity(activityId1, user1Id);

  assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).eqls([]);
  studentData = await getAssignedScores(user1Id);
  expect(studentData.orderedActivityScores).eqls([]);

  const { activityId: activityId2, docId: docId2 } = await createActivity(
    user2Id,
    null,
  );
  await updateContent({
    id: activityId2,
    name: "Activity 2",
    ownerId: user2Id,
  });
  await assignActivity(activityId2, user2Id);

  assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).eqls([]);
  studentData = await getAssignedScores(user1Id);
  expect(studentData.orderedActivityScores).eqls([]);

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
  studentData = await getAssignedScores(user1Id);
  expect(studentData.orderedActivityScores).eqls([
    { activityId: activityId2, activityName: "Activity 2", score: 0.5 },
  ]);

  // unassigning activity removes them from list
  await unassignActivity(activityId2, user2Id);
  assignmentList = await listUserAssigned(user1Id);
  expect(assignmentList.assignments).eqls([]);
  studentData = await getAssignedScores(user1Id);
  expect(studentData.orderedActivityScores).eqls([]);
});

test("get all assignment data from anonymous user", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { activityId, docId } = await createActivity(ownerId, null);
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
    ownerId,
    parentFolderId: null,
  });

  expect(userWithScores).eqls({
    userData: {
      userId: newUser1!.userId,
      name: newUser1!.name,
    },
    orderedActivityScores: [
      {
        activityId: activityId,
        score: 0.5,
        activityName: "Activity 1",
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
    ownerId,
    parentFolderId: null,
  });

  expect(userWithScores).eqls({
    userData: {
      userId: newUser1!.userId,
      name: newUser1!.name,
    },
    orderedActivityScores: [
      {
        activityId: activityId,
        score: 0.5,
        activityName: "Activity 1",
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
    ownerId,
    parentFolderId: null,
  });

  expect(userWithScores).eqls({
    userData: {
      userId: newUser1!.userId,
      name: newUser1!.name,
    },
    orderedActivityScores: [
      {
        activityId: activityId,
        score: 0.7,
        activityName: "Activity 1",
      },
    ],
  });
});

test("get assignments folder structure", { timeout: 30000 }, async () => {
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

  const { folderId: baseFolderId } = await createFolder(ownerId, null);
  const { folderId: folder3Id } = await createFolder(ownerId, baseFolderId);

  // create folder 1 after folder 3 and move to make sure it is using sortIndex
  // and not the order content was created
  const { folderId: folder1Id } = await createFolder(ownerId, baseFolderId);
  await moveContent({
    id: folder1Id,
    desiredParentFolderId: baseFolderId,
    desiredPosition: 0,
    ownerId,
  });

  const { folderId: folder1cId } = await createFolder(ownerId, folder1Id);
  const { folderId: folder1dId } = await createFolder(ownerId, folder1Id);

  const { activityId: activity2Id } = await createActivity(
    ownerId,
    baseFolderId,
  );
  await updateContent({ id: activity2Id, name: "Activity 2", ownerId });
  await moveContent({
    id: activity2Id,
    desiredParentFolderId: baseFolderId,
    desiredPosition: 1,
    ownerId,
  });

  // create activity 1a in wrong folder initially
  const { activityId: activity1aId } = await createActivity(ownerId, folder3Id);
  await updateContent({ id: activity1aId, name: "Activity 1a", ownerId });
  const { activityId: activity1eId } = await createActivity(ownerId, folder1Id);
  await updateContent({ id: activity1eId, name: "Activity 1e", ownerId });
  // move activity 1a to right places
  await moveContent({
    id: activity1aId,
    desiredParentFolderId: folder1Id,
    desiredPosition: 0,
    ownerId,
  });

  const { activityId: activity1c1Id } = await createActivity(
    ownerId,
    folder1cId,
  );
  await updateContent({ id: activity1c1Id, name: "Activity 1c1", ownerId });
  const { activityId: _activity1c3Id } = await createActivity(
    ownerId,
    folder1cId,
  );

  // create folder 1c2 in wrong folder initially
  const { folderId: folder1c2Id } = await createFolder(ownerId, baseFolderId);
  const { activityId: activity1c2aId } = await createActivity(
    ownerId,
    folder1c2Id,
  );
  await updateContent({ id: activity1c2aId, name: "Activity 1c2a", ownerId });
  const { activityId: activity1c2bId } = await createActivity(
    ownerId,
    folder1c2Id,
  );
  await updateContent({ id: activity1c2bId, name: "Activity 1c2b", ownerId });

  // after creating its content move folder 1c2 into the right place
  await moveContent({
    id: folder1c2Id,
    desiredParentFolderId: folder1cId,
    desiredPosition: 1,
    ownerId,
  });

  // create activity 1b in wrong place then move it
  const { activityId: activity1b } = await createActivity(ownerId, folder1c2Id);
  await updateContent({ id: activity1b, name: "Activity 1b", ownerId });
  await moveContent({
    id: activity1b,
    desiredParentFolderId: folder1Id,
    desiredPosition: 1,
    ownerId,
  });

  // move activity 1e to end of folder 1
  await moveContent({
    id: activity1eId,
    desiredParentFolderId: folder1Id,
    desiredPosition: 100,
    ownerId,
  });

  const { activityId: _activity3aId } = await createActivity(
    ownerId,
    folder3Id,
  );
  const { activityId: activity3bId } = await createActivity(ownerId, folder3Id);
  await updateContent({ id: activity3bId, name: "Activity 3b", ownerId });

  const { activityId: _activityNullId } = await createActivity(ownerId, null);

  // add some deleted activities
  const { activityId: activityGoneId } = await createActivity(ownerId, null);
  await deleteActivity(activityGoneId, ownerId);
  const { activityId: activity4Id } = await createActivity(
    ownerId,
    baseFolderId,
  );
  await deleteActivity(activity4Id, ownerId);
  const { activityId: activity3cId } = await createActivity(ownerId, folder3Id);
  await deleteActivity(activity3cId, ownerId);

  // one activity at root level
  const { activityId: activityRootId } = await createActivity(ownerId, null);
  await updateContent({ id: activityRootId, name: "Activity root", ownerId });

  await assignActivity(activity1aId, ownerId);
  await assignActivity(activity1c1Id, ownerId);
  await assignActivity(activity1c2aId, ownerId);
  await assignActivity(activity1c2bId, ownerId);
  await assignActivity(activity1eId, ownerId);
  await assignActivity(activity2Id, ownerId);
  await assignActivity(activity3bId, ownerId);
  await assignActivity(activityRootId, ownerId);

  const desiredFolder3 = [{ id: activity3bId, name: "Activity 3b" }];
  const desiredFolder1c2 = [
    { id: activity1c2aId, name: "Activity 1c2a" },
    { id: activity1c2bId, name: "Activity 1c2b" },
  ];
  const desiredFolder1c = [
    { id: activity1c1Id, name: "Activity 1c1" },
    ...desiredFolder1c2,
  ];
  const desiredFolder1 = [
    { id: activity1aId, name: "Activity 1a" },
    ...desiredFolder1c,
    { id: activity1eId, name: "Activity 1e" },
  ];
  const desiredBaseFolder = [
    ...desiredFolder1,
    { id: activity2Id, name: "Activity 2" },
    ...desiredFolder3,
  ];

  const desiredNullFolder = [
    ...desiredBaseFolder,
    { id: activityRootId, name: "Activity root" },
  ];

  let scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: null,
  });
  expect(scoreData.orderedActivities).eqls(desiredNullFolder);

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: baseFolderId,
  });
  expect(scoreData.orderedActivities).eqls(desiredBaseFolder);

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: folder1Id,
  });
  expect(scoreData.orderedActivities).eqls(desiredFolder1);

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: folder3Id,
  });
  expect(scoreData.orderedActivities).eqls(desiredFolder3);

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: folder1cId,
  });
  expect(scoreData.orderedActivities).eqls(desiredFolder1c);

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: folder1dId,
  });
  expect(scoreData.orderedActivities).eqls([]);
});

test("get data for user's assignments", { timeout: 30000 }, async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { activityId, docId } = await createActivity(ownerId, null);
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

  let scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: null,
  });

  // no one has done the assignment yet
  expect(scoreData.orderedActivities).eqls([
    {
      id: activityId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([]);

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

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: null,
  });

  expect(scoreData.orderedActivities).eqls([
    {
      id: activityId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
    {
      activityId: activityId,
      userId: newUser1!.userId,
      score: 0.5,
      user: { name: newUser1!.name },
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

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: null,
  });

  expect(scoreData.orderedActivities).eqls([
    {
      id: activityId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
    {
      activityId: activityId,
      userId: newUser1!.userId,
      score: 0.5,
      user: { name: newUser1!.name },
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

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: null,
  });

  expect(scoreData.orderedActivities).eqls([
    {
      id: activityId,
      name: "Activity 1",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
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
  ]);

  const { activityId: activity2Id, docId: doc2Id } = await createActivity(
    ownerId,
    null,
  );
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

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: null,
  });

  expect(scoreData.orderedActivities).eqls([
    {
      id: activityId,
      name: "Activity 1",
    },
    {
      id: activity2Id,
      name: "Activity 2",
    },
  ]);
  expect(scoreData.assignmentScores).eqls([
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
    {
      activityId: activity2Id,
      userId: newUser3!.userId,
      score: 0.9,
      user: { name: newUser3!.name },
    },
  ]);
});
