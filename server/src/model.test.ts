import { expect, test, vi } from "vitest";
import {
  copyActivityToFolder,
  createActivity,
  deleteActivity,
  findOrCreateUser,
  getAllDoenetmlVersions,
  getDoc,
  getActivityEditorData,
  getActivityViewerData,
  getMyFolderContent,
  updateDoc,
  searchSharedContent,
  updateContent,
  getActivity,
  assignActivity,
  getAssignment,
  openAssignmentWithCode,
  closeAssignmentWithCode,
  getAssignmentDataFromCode,
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
  addPromotedContentGroup,
  addPromotedContent,
  updatePromotedContentGroup,
  removePromotedContent,
  movePromotedContentGroup,
  movePromotedContent,
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
  getSharedFolderContent,
  getSharedEditorData,
  searchUsersWithSharedContent,
  ContentStructure,
  updateAssignmentSettings,
  getLicense,
  getAllLicenses,
  makeActivityPublic,
  makeActivityPrivate,
  makeFolderPublic,
  makeFolderPrivate,
  searchMyFolderContent,
  upgradeAnonymousUser,
  shareActivity,
  shareFolder,
  unshareActivity,
  unshareFolder,
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
async function createTestUser(isAdmin = false, isAnonymous = false) {
  const id = Date.now().toString();
  const email = `vitest${id}@vitest.test`;
  const firstNames = `vitest`;
  const lastNames = `user${id}`;
  const user = await findOrCreateUser({
    email,
    firstNames,
    lastNames,
    isAdmin,
    isAnonymous,
  });
  return user;
}

async function createTestAdminUser() {
  return await createTestUser(true);
}

async function createTestAnonymousUser() {
  return await createTestUser(false, true);
}

test("New user has no content", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const docs = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: null,
  });
  expect(docs).toStrictEqual({
    content: [],
    folder: null,
  });
});

test("Update user name", async () => {
  let user = await createTestUser();
  const userId = user.userId;
  expect(user.firstNames).eq("vitest");
  expect(user.lastNames.startsWith("user")).eq(true);

  user = await updateUser({ userId, firstNames: "New", lastNames: "Name" });
  expect(user.firstNames).eq("New");
  expect(user.lastNames).eq("Name");

  const userInfo = await getUserInfo(user.email);
  expect(userInfo.firstNames).eq("New");
  expect(userInfo.lastNames).eq("Name");
});

test("New activity starts out private, then delete it", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId, docId } = await createActivity(userId, null);
  const { activity: activityContent } = await getActivityEditorData(
    activityId,
    userId,
  );
  const expectedContent: ContentStructure = {
    id: activityId,
    name: "Untitled Activity",
    ownerId: userId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Unassigned",
    classCode: null,
    codeValidUntil: null,
    license: null,
    documents: [
      {
        id: docId,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: false,
    parentFolder: null,
  };
  expect(activityContent.license?.code).eq("CCDUAL");

  // set license to null as it is too long to compare in its entirety.
  activityContent.license = null;

  expect(activityContent).toStrictEqual(expectedContent);

  const data = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: null,
  });

  expect(data.content.length).toBe(1);
  expect(data.content[0].isPublic).eq(false);
  expect(data.content[0].assignmentStatus).eq("Unassigned");

  await deleteActivity(activityId, userId);

  await expect(getActivityEditorData(activityId, userId)).rejects.toThrow(
    "No content found",
  );

  const dataAfterDelete = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: null,
  });

  expect(dataAfterDelete.content.length).toBe(0);
});

test("getMyFolderContent returns both public and private content, getSharedFolderContent returns only public", async () => {
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

  // make public activity 1 public
  await makeActivityPublic({
    id: publicActivity1Id,
    licenseCode: "CCDUAL",
    ownerId,
  });

  // make public folder 1 and all items in folder 1 public
  await makeFolderPublic({
    id: publicFolder1Id,
    licenseCode: "CCDUAL",
    ownerId,
  });

  // private activity 2 is in public folder 1,
  // so we need to undo the fact that it was made public
  await makeActivityPrivate({
    id: privateActivity2Id,
    ownerId,
  });

  // private folder 2 is in public folder 1,
  // so we need to undo the fact that it was made public
  await makeFolderPrivate({
    id: privateFolder2Id,
    ownerId,
  });

  // public content inside private folder 1
  // has to be made public explicitly
  await makeActivityPublic({
    id: publicActivity3Id,
    licenseCode: "CCDUAL",
    ownerId,
  });
  await makeFolderPublic({
    id: publicFolder3Id,
    licenseCode: "CCDUAL",
    ownerId,
  });

  let ownerContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: null,
  });
  expect(ownerContent.folder).eq(null);
  expect(ownerContent.content.length).eq(4);
  expect(ownerContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity1Id,
        isPublic: true,
        parentFolder: null,
      }),
      expect.objectContaining({
        id: privateActivity1Id,
        isPublic: false,
        parentFolder: null,
      }),
      expect.objectContaining({
        id: publicFolder1Id,
        isPublic: true,
        parentFolder: null,
      }),
      expect.objectContaining({
        id: privateFolder1Id,
        isPublic: false,
        parentFolder: null,
      }),
    ]),
  });

  // public folder content of base directory
  // also includes orphaned public content,
  // i.e., public content inside a private folder
  let publicContent = await getSharedFolderContent({
    ownerId,
    folderId: null,
    loggedInUserId: userId,
  });
  expect(publicContent.folder).eq(null);
  expect(publicContent.content.length).eq(4);

  expect(publicContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity1Id,
      }),
      expect.objectContaining({
        id: publicFolder1Id,
      }),
      expect.objectContaining({
        id: publicActivity3Id,
      }),
      expect.objectContaining({
        id: publicFolder3Id,
      }),
    ]),
  });

  ownerContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: publicFolder1Id,
  });
  expect(ownerContent.folder?.id).eq(publicFolder1Id);
  expect(ownerContent.folder?.parentFolder).eq(null);
  expect(ownerContent.content.length).eq(4);
  expect(ownerContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity2Id,
        isPublic: true,
        parentFolder: {
          id: publicFolder1Id,
          isPublic: true,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: privateActivity2Id,
        isPublic: false,
        parentFolder: {
          id: publicFolder1Id,
          isPublic: true,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: publicFolder2Id,
        isPublic: true,
        parentFolder: {
          id: publicFolder1Id,
          isPublic: true,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: privateFolder2Id,
        isPublic: false,
        parentFolder: {
          id: publicFolder1Id,
          isPublic: true,
          name: ownerContent.folder?.name,
        },
      }),
    ]),
  });

  publicContent = await getSharedFolderContent({
    ownerId,
    folderId: publicFolder1Id,
    loggedInUserId: userId,
  });
  expect(publicContent.content.length).eq(2);
  expect(publicContent.folder?.id).eq(publicFolder1Id);
  expect(publicContent.folder?.parentFolder).eq(null);
  expect(publicContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity2Id,
      }),
      expect.objectContaining({
        id: publicFolder2Id,
      }),
    ]),
  });

  // If other user tries to access folder, throws error
  await expect(
    getMyFolderContent({
      loggedInUserId: userId,
      folderId: publicFolder1Id,
    }),
  ).rejects.toThrow("No content found");

  ownerContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: privateFolder1Id,
  });
  expect(ownerContent.folder?.id).eq(privateFolder1Id);
  expect(ownerContent.folder?.parentFolder).eq(null);
  expect(ownerContent.content.length).eq(4);
  expect(ownerContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity3Id,
        isPublic: true,
        parentFolder: {
          id: privateFolder1Id,
          isPublic: false,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: privateActivity3Id,
        isPublic: false,
        parentFolder: {
          id: privateFolder1Id,
          isPublic: false,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: publicFolder3Id,
        isPublic: true,
        parentFolder: {
          id: privateFolder1Id,
          isPublic: false,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: privateFolder3Id,
        isPublic: false,
        parentFolder: {
          id: privateFolder1Id,
          isPublic: false,
          name: ownerContent.folder?.name,
        },
      }),
    ]),
  });

  await expect(
    getSharedFolderContent({
      ownerId,
      folderId: privateFolder1Id,
      loggedInUserId: userId,
    }),
  ).rejects.toThrow("No content found");

  // If other user tries to access folder, throws error
  await expect(
    getMyFolderContent({
      loggedInUserId: userId,
      folderId: privateFolder1Id,
    }),
  ).rejects.toThrow("No content found");

  ownerContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: publicFolder3Id,
  });
  expect(ownerContent.folder?.id).eq(publicFolder3Id);
  expect(ownerContent.folder?.parentFolder?.id).eq(privateFolder1Id);
  expect(ownerContent.content.length).eq(0);

  publicContent = await getSharedFolderContent({
    ownerId,
    folderId: publicFolder3Id,
    loggedInUserId: userId,
  });
  expect(publicContent.folder?.id).eq(publicFolder3Id);
  expect(publicContent.folder?.parentFolder).eq(null);
  expect(publicContent.content.length).eq(0);

  // If other user tries to access folder, throws error
  await expect(
    getMyFolderContent({
      loggedInUserId: userId,
      folderId: publicFolder3Id,
    }),
  ).rejects.toThrow("No content found");
});

test("getMyFolderContent returns both public and private content, getSharedFolderContent returns only shared", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;
  const user3 = await createTestUser();
  const user3Id = user3.userId;

  const { activityId: sharedActivity1Id } = await createActivity(ownerId, null);
  const { activityId: privateActivity1Id } = await createActivity(
    ownerId,
    null,
  );

  const { folderId: sharedFolder1Id } = await createFolder(ownerId, null);
  const { folderId: privateFolder1Id } = await createFolder(ownerId, null);

  const { activityId: sharedActivity2Id } = await createActivity(
    ownerId,
    sharedFolder1Id,
  );
  const { activityId: privateActivity2Id } = await createActivity(
    ownerId,
    sharedFolder1Id,
  );
  const { folderId: sharedFolder2Id } = await createFolder(
    ownerId,
    sharedFolder1Id,
  );
  const { folderId: privateFolder2Id } = await createFolder(
    ownerId,
    sharedFolder1Id,
  );

  const { activityId: sharedActivity3Id } = await createActivity(
    ownerId,
    privateFolder1Id,
  );
  const { activityId: privateActivity3Id } = await createActivity(
    ownerId,
    privateFolder1Id,
  );
  const { folderId: sharedFolder3Id } = await createFolder(
    ownerId,
    privateFolder1Id,
  );
  const { folderId: privateFolder3Id } = await createFolder(
    ownerId,
    privateFolder1Id,
  );

  // Share

  // share activity 1
  await shareActivity({
    id: sharedActivity1Id,
    licenseCode: "CCDUAL",
    ownerId,
    users: [user1Id, user2Id],
  });

  // sure folder 1 and all items in folder 1
  await shareFolder({
    id: sharedFolder1Id,
    licenseCode: "CCDUAL",
    ownerId,
    users: [user1Id, user2Id],
  });

  // private activity 2 is in shared folder 1,
  // so we need to undo the fact that it was shared
  await unshareActivity({
    id: privateActivity2Id,
    ownerId,
    users: [user1Id, user2Id],
  });

  // private folder 2 is in shared folder 1,
  // so we need to undo the fact that it was shared
  await unshareFolder({
    id: privateFolder2Id,
    ownerId,
    users: [user1Id, user2Id],
  });

  // shared content inside private folder 1
  // has to be shared explicitly
  await shareActivity({
    id: sharedActivity3Id,
    licenseCode: "CCDUAL",
    ownerId,
    users: [user1Id, user2Id],
  });
  await shareFolder({
    id: sharedFolder3Id,
    licenseCode: "CCDUAL",
    ownerId,
    users: [user1Id, user2Id],
  });

  let ownerContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: null,
  });
  expect(ownerContent.folder).eq(null);
  expect(ownerContent.content.length).eq(4);
  expect(ownerContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: sharedActivity1Id,
        isShared: true,
        parentFolder: null,
      }),
      expect.objectContaining({
        id: privateActivity1Id,
        isShared: false,
        parentFolder: null,
      }),
      expect.objectContaining({
        id: sharedFolder1Id,
        isShared: true,
        parentFolder: null,
      }),
      expect.objectContaining({
        id: privateFolder1Id,
        isShared: false,
        parentFolder: null,
      }),
    ]),
  });

  // shared folder content of base directory
  // also includes orphaned shared content,
  // i.e., shared content inside a private folder
  let sharedContent = await getSharedFolderContent({
    ownerId,
    folderId: null,
    loggedInUserId: user1Id,
  });
  expect(sharedContent.folder).eq(null);
  expect(sharedContent.content.length).eq(4);

  expect(sharedContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: sharedActivity1Id,
      }),
      expect.objectContaining({
        id: sharedFolder1Id,
      }),
      expect.objectContaining({
        id: sharedActivity3Id,
      }),
      expect.objectContaining({
        id: sharedFolder3Id,
      }),
    ]),
  });

  // also shared with user 2
  sharedContent = await getSharedFolderContent({
    ownerId,
    folderId: null,
    loggedInUserId: user2Id,
  });
  expect(sharedContent.folder).eq(null);
  expect(sharedContent.content.length).eq(4);

  expect(sharedContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: sharedActivity1Id,
      }),
      expect.objectContaining({
        id: sharedFolder1Id,
      }),
      expect.objectContaining({
        id: sharedActivity3Id,
      }),
      expect.objectContaining({
        id: sharedFolder3Id,
      }),
    ]),
  });

  // not shared with user 3
  sharedContent = await getSharedFolderContent({
    ownerId,
    folderId: null,
    loggedInUserId: user3Id,
  });
  expect(sharedContent.folder).eq(null);
  expect(sharedContent.content.length).eq(0);

  ownerContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: sharedFolder1Id,
  });
  expect(ownerContent.folder?.id).eq(sharedFolder1Id);
  expect(ownerContent.folder?.parentFolder).eq(null);
  expect(ownerContent.content.length).eq(4);
  expect(ownerContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: sharedActivity2Id,
        isShared: true,
        parentFolder: {
          id: sharedFolder1Id,
          isPublic: false,
          // isShared: true,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: privateActivity2Id,
        isShared: false,
        parentFolder: {
          id: sharedFolder1Id,
          isPublic: false,
          // isShared: true,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: sharedFolder2Id,
        isShared: true,
        parentFolder: {
          id: sharedFolder1Id,
          isPublic: false,
          // isShared: true,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: privateFolder2Id,
        isShared: false,
        parentFolder: {
          id: sharedFolder1Id,
          isPublic: false,
          // isShared: true,
          name: ownerContent.folder?.name,
        },
      }),
    ]),
  });

  sharedContent = await getSharedFolderContent({
    ownerId,
    folderId: sharedFolder1Id,
    loggedInUserId: user1Id,
  });
  expect(sharedContent.content.length).eq(2);
  expect(sharedContent.folder?.id).eq(sharedFolder1Id);
  expect(sharedContent.folder?.parentFolder).eq(null);
  expect(sharedContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: sharedActivity2Id,
      }),
      expect.objectContaining({
        id: sharedFolder2Id,
      }),
    ]),
  });

  sharedContent = await getSharedFolderContent({
    ownerId,
    folderId: sharedFolder1Id,
    loggedInUserId: user2Id,
  });
  expect(sharedContent.content.length).eq(2);
  expect(sharedContent.folder?.id).eq(sharedFolder1Id);
  expect(sharedContent.folder?.parentFolder).eq(null);
  expect(sharedContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: sharedActivity2Id,
      }),
      expect.objectContaining({
        id: sharedFolder2Id,
      }),
    ]),
  });

  // not shared with user 3
  await expect(
    getSharedFolderContent({
      ownerId,
      folderId: sharedFolder1Id,
      loggedInUserId: user3Id,
    }),
  ).rejects.toThrow("No content found");

  // If other user tries to access folder via my folder, throws error
  await expect(
    getMyFolderContent({
      loggedInUserId: user1Id,
      folderId: sharedFolder1Id,
    }),
  ).rejects.toThrow("No content found");

  ownerContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: privateFolder1Id,
  });
  expect(ownerContent.folder?.id).eq(privateFolder1Id);
  expect(ownerContent.folder?.parentFolder).eq(null);
  expect(ownerContent.content.length).eq(4);
  expect(ownerContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: sharedActivity3Id,
        isShared: true,
        parentFolder: {
          id: privateFolder1Id,
          isPublic: false,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: privateActivity3Id,
        isShared: false,
        parentFolder: {
          id: privateFolder1Id,
          isPublic: false,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: sharedFolder3Id,
        isShared: true,
        parentFolder: {
          id: privateFolder1Id,
          isPublic: false,
          name: ownerContent.folder?.name,
        },
      }),
      expect.objectContaining({
        id: privateFolder3Id,
        isShared: false,
        parentFolder: {
          id: privateFolder1Id,
          isPublic: false,
          name: ownerContent.folder?.name,
        },
      }),
    ]),
  });

  await expect(
    getSharedFolderContent({
      ownerId,
      folderId: privateFolder1Id,
      loggedInUserId: user1Id,
    }),
  ).rejects.toThrow("No content found");

  // If other user tries to access folder, throws error
  await expect(
    getMyFolderContent({
      loggedInUserId: user1Id,
      folderId: privateFolder1Id,
    }),
  ).rejects.toThrow("No content found");

  ownerContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: sharedFolder3Id,
  });
  expect(ownerContent.folder?.id).eq(sharedFolder3Id);
  expect(ownerContent.folder?.parentFolder?.id).eq(privateFolder1Id);
  expect(ownerContent.content.length).eq(0);

  sharedContent = await getSharedFolderContent({
    ownerId,
    folderId: sharedFolder3Id,
    loggedInUserId: user1Id,
  });
  expect(sharedContent.folder?.id).eq(sharedFolder3Id);
  expect(sharedContent.folder?.parentFolder).eq(null);
  expect(sharedContent.content.length).eq(0);

  // If other user tries to access folder, throws error
  await expect(
    getMyFolderContent({
      loggedInUserId: user1Id,
      folderId: sharedFolder3Id,
    }),
  ).rejects.toThrow("No content found");
});

test("content in public folder is created as public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { folderId: publicFolderId } = await createFolder(ownerId, null);

  await makeFolderPublic({
    id: publicFolderId,
    licenseCode: "CCBYSA",
    ownerId,
  });

  // create a folder and activity in public folder
  const { activityId } = await createActivity(ownerId, publicFolderId);
  const { folderId } = await createFolder(ownerId, publicFolderId);

  const { content } = await getMyFolderContent({
    folderId: publicFolderId,
    loggedInUserId: ownerId,
  });
  expect(content.length).eq(2);

  expect(content[0].id).eq(activityId);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  expect(content[1].id).eq(folderId);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCBYSA");
});

test("content in shared folder is created shared", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user = await createTestUser();
  const userId = user.userId;
  const { isAdmin, isAnonymous, ...userFields } = user;

  const { folderId: publicFolderId } = await createFolder(ownerId, null);

  await shareFolder({
    id: publicFolderId,
    licenseCode: "CCBYSA",
    ownerId,
    users: [userId],
  });

  // create a folder and activity in public folder
  const { activityId } = await createActivity(ownerId, publicFolderId);
  const { folderId } = await createFolder(ownerId, publicFolderId);

  const { content } = await getMyFolderContent({
    folderId: publicFolderId,
    loggedInUserId: ownerId,
  });
  expect(content.length).eq(2);

  expect(content[0].id).eq(activityId);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");

  expect(content[1].id).eq(folderId);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields]);
  expect(content[1].license?.code).eq("CCBYSA");
});

test("making folder public/private also makes its content public/private", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { folderId: publicFolderId } = await createFolder(ownerId, null);

  // create content in folder that will become public
  const { activityId: activity1Id } = await createActivity(
    ownerId,
    publicFolderId,
  );
  const { folderId: folder1Id } = await createFolder(ownerId, publicFolderId);
  const { folderId: folder2Id } = await createFolder(ownerId, folder1Id);
  const { activityId: activity2Id } = await createActivity(ownerId, folder2Id);

  let results = await getMyFolderContent({
    folderId: publicFolderId,
    loggedInUserId: ownerId,
  });
  let content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isPublic).eq(false);
  expect(content[1].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  await makeFolderPublic({
    id: publicFolderId,
    licenseCode: "CCBYSA",
    ownerId,
  });

  results = await getMyFolderContent({
    folderId: publicFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  await makeFolderPrivate({
    id: publicFolderId,
    ownerId,
  });

  results = await getMyFolderContent({
    folderId: publicFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isPublic).eq(false);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCBYSA");
});

test("making sharing/unsharing a folder also shares/unshares its content", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const {
    isAdmin: _isAdmin1,
    isAnonymous: _isAnonymous1,
    ...userFields1
  } = user1;
  const user2 = await createTestUser();
  const user2Id = user2.userId;
  const {
    isAdmin: _isAdmin2,
    isAnonymous: _isAnonymous2,
    ...userFields2
  } = user2;
  const user3 = await createTestUser();
  const user3Id = user3.userId;
  const {
    isAdmin: _isAdmin3,
    isAnonymous: _isAnonymous3,
    ...userFields3
  } = user3;

  const sharedUserFields = [userFields1, userFields2].sort(
    (a, b) => a.userId - b.userId,
  );
  const sharedUserFields23 = [userFields2, userFields3].sort(
    (a, b) => a.userId - b.userId,
  );

  const { folderId: sharedFolderId } = await createFolder(ownerId, null);

  // create content in folder that will become shared
  const { activityId: activity1Id } = await createActivity(
    ownerId,
    sharedFolderId,
  );
  const { folderId: folder1Id } = await createFolder(ownerId, sharedFolderId);
  const { folderId: folder2Id } = await createFolder(ownerId, folder1Id);
  const { activityId: activity2Id } = await createActivity(ownerId, folder2Id);

  let results = await getMyFolderContent({
    folderId: sharedFolderId,
    loggedInUserId: ownerId,
  });
  let content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isShared).eq(false);
  expect(content[0].sharedWith).eqls([]);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isShared).eq(false);
  expect(content[1].sharedWith).eqls([]);
  expect(content[1].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isShared).eq(false);
  expect(content[0].sharedWith).eqls([]);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isShared).eq(false);
  expect(content[0].sharedWith).eqls([]);
  expect(content[0].license?.code).eq("CCDUAL");

  await shareFolder({
    id: sharedFolderId,
    licenseCode: "CCBYSA",
    ownerId,
    users: [user1Id, user2Id],
  });

  results = await getMyFolderContent({
    folderId: sharedFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith.sort((a, b) => a.userId - b.userId)).eqls(
    sharedUserFields,
  );
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith.sort((a, b) => a.userId - b.userId)).eqls(
    sharedUserFields,
  );
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith.sort((a, b) => a.userId - b.userId)).eqls(
    sharedUserFields,
  );
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith.sort((a, b) => a.userId - b.userId)).eqls(
    sharedUserFields,
  );
  expect(content[0].license?.code).eq("CCBYSA");

  // unshare with user 1
  await unshareFolder({
    id: sharedFolderId,
    ownerId,
    users: [user1Id],
  });

  results = await getMyFolderContent({
    folderId: sharedFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields2]);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields2]);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields2]);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields2]);
  expect(content[0].license?.code).eq("CCBYSA");

  // share middle folder with user3
  await shareFolder({
    id: folder2Id,
    ownerId,
    licenseCode: "CCBYNCSA",
    users: [user3Id],
  });

  results = await getMyFolderContent({
    folderId: sharedFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields2]);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields2]);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith.sort((a, b) => a.userId - b.userId)).eqls(
    sharedUserFields23,
  );
  expect(content[0].license?.code).eq("CCBYNCSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith.sort((a, b) => a.userId - b.userId)).eqls(
    sharedUserFields23,
  );
  expect(content[0].license?.code).eq("CCBYNCSA");

  // unshare with user 2
  await unshareFolder({
    id: sharedFolderId,
    ownerId,
    users: [user2Id],
  });

  results = await getMyFolderContent({
    folderId: sharedFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isShared).eq(false);
  expect(content[0].sharedWith).eqls([]);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isShared).eq(false);
  expect(content[0].sharedWith).eqls([]);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields3]);
  expect(content[0].license?.code).eq("CCBYNCSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields3]);
  expect(content[0].license?.code).eq("CCBYNCSA");
});

test("moving content into public folder makes it public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { folderId: publicFolderId } = await createFolder(ownerId, null);
  await makeFolderPublic({
    id: publicFolderId,
    licenseCode: "CCBYSA",
    ownerId,
  });

  // create to move into that folder
  const { activityId: activity1Id } = await createActivity(ownerId, null);
  const { folderId: folder1Id } = await createFolder(ownerId, null);
  const { folderId: folder2Id } = await createFolder(ownerId, folder1Id);
  const { activityId: activity2Id } = await createActivity(ownerId, folder2Id);

  let results = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  let content = results.content;

  expect(content[1].id).eq(activity1Id);
  expect(content[1].isPublic).eq(false);
  expect(content[1].license?.code).eq("CCDUAL");
  expect(content[2].id).eq(folder1Id);
  expect(content[2].isPublic).eq(false);
  expect(content[2].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  // move content into public folder
  await moveContent({
    id: activity1Id,
    desiredParentFolderId: publicFolderId,
    ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    id: folder1Id,
    desiredParentFolderId: publicFolderId,
    ownerId,
    desiredPosition: 1,
  });

  results = await getMyFolderContent({
    folderId: publicFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  // Create a private folder and move content into that folder.
  // The content stays public.

  const { folderId: privateFolderId } = await createFolder(ownerId, null);

  await moveContent({
    id: activity1Id,
    desiredParentFolderId: privateFolderId,
    ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    id: folder1Id,
    desiredParentFolderId: privateFolderId,
    ownerId,
    desiredPosition: 1,
  });

  results = await getMyFolderContent({
    folderId: privateFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");
});

test("moving content into shared folder shares it", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user = await createTestUser();
  const userId = user.userId;
  const { isAdmin: _isAdmin, isAnonymous: _isAnonymous, ...userFields } = user;

  const { folderId: sharedFolderId } = await createFolder(ownerId, null);
  await shareFolder({
    id: sharedFolderId,
    licenseCode: "CCBYSA",
    ownerId,
    users: [userId],
  });

  // create to move into that folder
  const { activityId: activity1Id } = await createActivity(ownerId, null);
  const { folderId: folder1Id } = await createFolder(ownerId, null);
  const { folderId: folder2Id } = await createFolder(ownerId, folder1Id);
  const { activityId: activity2Id } = await createActivity(ownerId, folder2Id);

  let results = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  let content = results.content;

  expect(content[1].id).eq(activity1Id);
  expect(content[1].isShared).eq(false);
  expect(content[1].sharedWith).eqls([]);
  expect(content[1].license?.code).eq("CCDUAL");
  expect(content[2].id).eq(folder1Id);
  expect(content[2].isShared).eq(false);
  expect(content[2].sharedWith).eqls([]);
  expect(content[2].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isShared).eq(false);
  expect(content[0].sharedWith).eqls([]);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isShared).eq(false);
  expect(content[0].sharedWith).eqls([]);
  expect(content[0].license?.code).eq("CCDUAL");

  // move content into shared folder
  await moveContent({
    id: activity1Id,
    desiredParentFolderId: sharedFolderId,
    ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    id: folder1Id,
    desiredParentFolderId: sharedFolderId,
    ownerId,
    desiredPosition: 1,
  });

  results = await getMyFolderContent({
    folderId: sharedFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields]);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");

  // Create a private folder and move content into that folder.
  // The content stays shared.

  const { folderId: privateFolderId } = await createFolder(ownerId, null);

  await moveContent({
    id: activity1Id,
    desiredParentFolderId: privateFolderId,
    ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    id: folder1Id,
    desiredParentFolderId: privateFolderId,
    ownerId,
    desiredPosition: 1,
  });

  results = await getMyFolderContent({
    folderId: privateFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eq(activity1Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eq(folder1Id);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields]);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eq(activity2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");
});

test("Test updating various activity properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId } = await createActivity(userId, null);
  const activityName = "Test Name";
  await updateContent({ id: activityId, name: activityName, ownerId: userId });
  const { activity: activityContent } = await getActivityEditorData(
    activityId,
    userId,
  );
  const docId = activityContent.documents[0].id;
  expect(activityContent.name).toBe(activityName);
  const source = "Here comes some content, I made you some content";
  await updateDoc({ id: docId, source, ownerId: userId });
  const { activity: activityContent2 } = await getActivityEditorData(
    activityId,
    userId,
  );
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
  let baseContent = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: null,
  });
  expect(baseContent.content.length).eq(2);
  let folder1Content = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: folder1Id,
  });
  expect(folder1Content.content.length).eq(2);
  let folder2Content = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: folder2Id,
  });
  expect(folder2Content.content.length).eq(2);
  let folder3Content = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: folder3Id,
  });
  expect(folder3Content.content.length).eq(1);
  let folder4Content = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: folder4Id,
  });
  expect(folder4Content.content.length).eq(2);
  let folder5Content = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: folder5Id,
  });
  expect(folder5Content.content.length).eq(2);
  let folder6Content = await getMyFolderContent({
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
  await deleteFolder(folder1Id, userId);

  baseContent = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: null,
  });
  expect(baseContent.content.length).eq(1);
  await expect(
    getMyFolderContent({
      loggedInUserId: userId,
      folderId: folder1Id,
    }),
  ).rejects.toThrow("No content found");
  await expect(
    getMyFolderContent({
      loggedInUserId: userId,
      folderId: folder2Id,
    }),
  ).rejects.toThrow("No content found");
  await expect(
    getMyFolderContent({
      loggedInUserId: userId,
      folderId: folder3Id,
    }),
  ).rejects.toThrow("No content found");
  folder4Content = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: folder4Id,
  });
  expect(folder4Content.content.length).eq(2);
  folder5Content = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: folder5Id,
  });
  expect(folder5Content.content.length).eq(2);
  folder6Content = await getMyFolderContent({
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
  await deleteFolder(folder5Id, userId);

  baseContent = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: null,
  });
  expect(baseContent.content.length).eq(1);
  folder4Content = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: folder4Id,
  });
  expect(folder4Content.content.length).eq(1);
  await expect(
    getMyFolderContent({
      loggedInUserId: userId,
      folderId: folder5Id,
    }),
  ).rejects.toThrow("No content found");
  await expect(
    getMyFolderContent({
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
  getMyFolderContent({
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

  let baseContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: null,
  });
  let folder1Content = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: folder1Id,
  });
  let folder2Content = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: folder2Id,
  });
  let folder3Content = await getMyFolderContent({
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
  baseContent = await getMyFolderContent({
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
  baseContent = await getMyFolderContent({
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
  baseContent = await getMyFolderContent({
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
  baseContent = await getMyFolderContent({
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
  baseContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: null,
  });
  folder1Content = await getMyFolderContent({
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
  baseContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: null,
  });
  folder1Content = await getMyFolderContent({
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
  folder1Content = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: folder1Id,
  });
  folder3Content = await getMyFolderContent({
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
  baseContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: null,
  });
  folder2Content = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: folder2Id,
  });
  folder3Content = await getMyFolderContent({
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

  let contentList = await getMyFolderContent({
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

  contentList = await getMyFolderContent({
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
  await makeActivityPublic({
    id: activityId,
    ownerId: originalOwnerId,
    licenseCode: "CCDUAL",
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

test("copyActivityToFolder copies a shared document to a new owner", async () => {
  const originalOwnerId = (await createTestUser()).userId;
  const newOwnerId = (await createTestUser()).userId;
  const { activityId, docId } = await createActivity(originalOwnerId, null);
  // cannot copy if not yet shared
  await expect(
    copyActivityToFolder(activityId, newOwnerId, null),
  ).rejects.toThrow("No content found");

  // Make the activity public before copying
  await shareActivity({
    id: activityId,
    ownerId: originalOwnerId,
    licenseCode: "CCDUAL",
    users: [newOwnerId],
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

  expect(activityData.activity.isShared).eq(false);

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
  await makeActivityPublic({
    id: activityId1,
    ownerId: ownerId1,
    licenseCode: "CCDUAL",
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

test("searchSharedContent returns public/shared activities and folders matching the query", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user = await createTestUser();
  const userId = user.userId;

  // Create unique session number for names in this test
  const sessionNumber = Date.now().toString();

  const publicActivityName = `public activity ${sessionNumber}`;
  const privateActivityName = `private activity ${sessionNumber}`;
  const sharedActivityName = `shared activity ${sessionNumber}`;
  const publicFolderName = `public folder ${sessionNumber}`;
  const privateFolderName = `private folder ${sessionNumber}`;
  const sharedFolderName = `shared folder ${sessionNumber}`;

  const { activityId: publicActivityId } = await createActivity(ownerId, null);
  await updateContent({
    id: publicActivityId,
    name: publicActivityName,
    ownerId,
  });
  await makeActivityPublic({
    id: publicActivityId,
    licenseCode: "CCDUAL",
    ownerId,
  });

  const { activityId: privateActivityId } = await createActivity(ownerId, null);
  await updateContent({
    id: privateActivityId,
    name: privateActivityName,
    ownerId,
  });

  const { activityId: sharedActivityId } = await createActivity(ownerId, null);
  await updateContent({
    id: sharedActivityId,
    name: sharedActivityName,
    ownerId,
  });
  await shareActivity({
    id: sharedActivityId,
    licenseCode: "CCDUAL",
    ownerId,
    users: [userId],
  });

  const { folderId: publicFolderId } = await createFolder(ownerId, null);
  await updateContent({
    id: publicFolderId,
    name: publicFolderName,
    ownerId,
  });
  await makeFolderPublic({
    id: publicFolderId,
    licenseCode: "CCDUAL",
    ownerId,
  });

  const { folderId: privateFolderId } = await createFolder(ownerId, null);
  await updateContent({
    id: privateFolderId,
    name: privateFolderName,
    ownerId,
  });

  const { folderId: sharedFolderId } = await createFolder(ownerId, null);
  await updateContent({
    id: sharedFolderId,
    name: sharedFolderName,
    ownerId,
  });
  await shareFolder({
    id: sharedFolderId,
    licenseCode: "CCDUAL",
    ownerId,
    users: [userId],
  });

  const searchResults = await searchSharedContent(sessionNumber, userId);
  expect(searchResults.length).eq(4);

  const namesInOrder = searchResults
    .sort((a, b) => a.id - b.id)
    .map((c) => c.name);

  expect(namesInOrder).eqls([
    publicActivityName,
    sharedActivityName,
    publicFolderName,
    sharedFolderName,
  ]);
});

test("searchSharedContent returns public/shared activities and folders even in a private folder", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user = await createTestUser();
  const userId = user.userId;

  // Create unique session number for names in this test
  const sessionNumber = Date.now().toString();

  const { folderId: parentFolderId } = await createFolder(ownerId, null);

  const publicActivityName = `public activity ${sessionNumber}`;
  const privateActivityName = `private activity ${sessionNumber}`;
  const sharedActivityName = `shared activity ${sessionNumber}`;
  const publicFolderName = `public folder ${sessionNumber}`;
  const privateFolderName = `private folder ${sessionNumber}`;
  const sharedFolderName = `shared folder ${sessionNumber}`;

  const { activityId: publicActivityId } = await createActivity(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: publicActivityId,
    name: publicActivityName,
    ownerId,
  });
  await makeActivityPublic({
    id: publicActivityId,
    licenseCode: "CCDUAL",
    ownerId,
  });

  const { activityId: privateActivityId } = await createActivity(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: privateActivityId,
    name: privateActivityName,
    ownerId,
  });

  const { activityId: sharedActivityId } = await createActivity(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: sharedActivityId,
    name: sharedActivityName,
    ownerId,
  });
  await shareActivity({
    id: sharedActivityId,
    licenseCode: "CCDUAL",
    ownerId,
    users: [userId],
  });

  const { folderId: publicFolderId } = await createFolder(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: publicFolderId,
    name: publicFolderName,
    ownerId,
  });
  await makeFolderPublic({
    id: publicFolderId,
    licenseCode: "CCDUAL",
    ownerId,
  });

  const { folderId: privateFolderId } = await createFolder(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: privateFolderId,
    name: privateFolderName,
    ownerId,
  });

  const { folderId: sharedFolderId } = await createFolder(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: sharedFolderId,
    name: sharedFolderName,
    ownerId,
  });
  await shareFolder({
    id: sharedFolderId,
    licenseCode: "CCDUAL",
    ownerId,
    users: [userId],
  });

  const searchResults = await searchSharedContent(sessionNumber, userId);
  expect(searchResults.length).eq(4);

  const namesInOrder = searchResults
    .sort((a, b) => a.id - b.id)
    .map((c) => c.name);

  expect(namesInOrder).eqls([
    publicActivityName,
    sharedActivityName,
    publicFolderName,
    sharedFolderName,
  ]);
});

test("searchUsersWithSharedContent returns only users with public/shared content", async () => {
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  // owner 1 has only private content
  const owner1 = await createTestUser();
  const owner1Id = owner1.userId;

  await createActivity(owner1Id, null);
  await createActivity(owner1Id, null);
  const { folderId: folder1aId } = await createFolder(owner1Id, null);
  await createActivity(owner1Id, folder1aId);

  // owner 2 has a public activity
  const owner2 = await createTestUser();
  const owner2Id = owner2.userId;

  const { folderId: folder2aId } = await createFolder(owner2Id, null);
  const { activityId: activity2aId } = await createActivity(
    owner2Id,
    folder2aId,
  );
  await makeActivityPublic({
    id: activity2aId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });

  // owner 3 has a public folder
  const owner3 = await createTestUser();
  const owner3Id = owner3.userId;

  const { folderId: folder3aId } = await createFolder(owner3Id, null);
  await makeFolderPublic({
    id: folder3aId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
  });

  // owner 4 has a activity shared with user1
  const owner4 = await createTestUser();
  const owner4Id = owner4.userId;

  const { folderId: folder4aId } = await createFolder(owner4Id, null);
  const { activityId: activity4aId } = await createActivity(
    owner4Id,
    folder4aId,
  );
  await shareActivity({
    id: activity4aId,
    ownerId: owner4Id,
    licenseCode: "CCDUAL",
    users: [user1Id],
  });

  // owner 5 has a folder shared with user 1
  const owner5 = await createTestUser();
  const owner5Id = owner5.userId;

  const { folderId: folder5aId } = await createFolder(owner5Id, null);
  await shareFolder({
    id: folder5aId,
    ownerId: owner5Id,
    licenseCode: "CCDUAL",
    users: [user1Id],
  });

  // owner 6 has a activity shared with user2
  const owner6 = await createTestUser();
  const owner6Id = owner6.userId;

  const { folderId: folder6aId } = await createFolder(owner6Id, null);
  const { activityId: activity6aId } = await createActivity(
    owner6Id,
    folder6aId,
  );
  await shareActivity({
    id: activity6aId,
    ownerId: owner6Id,
    licenseCode: "CCDUAL",
    users: [user2Id],
  });

  // owner 7 has a folder shared with user 2
  const owner7 = await createTestUser();
  const owner7Id = owner7.userId;

  const { folderId: folder7aId } = await createFolder(owner7Id, null);
  await shareFolder({
    id: folder7aId,
    ownerId: owner7Id,
    licenseCode: "CCDUAL",
    users: [user2Id],
  });

  // user1 cannot find owner1
  let searchResults = await searchUsersWithSharedContent(
    owner1.lastNames,
    user1Id,
  );
  expect(searchResults.length).eq(0);

  // user1 can find owner2
  searchResults = await searchUsersWithSharedContent(owner2.lastNames, user1Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner2.firstNames);
  expect(searchResults[0].lastNames).eq(owner2.lastNames);

  // user1 can find owner3
  searchResults = await searchUsersWithSharedContent(owner3.lastNames, user1Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner3.firstNames);
  expect(searchResults[0].lastNames).eq(owner3.lastNames);

  // user1 can find owner4
  searchResults = await searchUsersWithSharedContent(owner4.lastNames, user1Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner4.firstNames);
  expect(searchResults[0].lastNames).eq(owner4.lastNames);

  // user1 can find owner5
  searchResults = await searchUsersWithSharedContent(owner5.lastNames, user1Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner5.firstNames);
  expect(searchResults[0].lastNames).eq(owner5.lastNames);

  // user1 cannot find owner6
  searchResults = await searchUsersWithSharedContent(owner6.lastNames, user1Id);
  expect(searchResults.length).eq(0);

  // user1 cannot find owner7
  searchResults = await searchUsersWithSharedContent(owner7.lastNames, user1Id);
  expect(searchResults.length).eq(0);

  // user2 can find owner6
  searchResults = await searchUsersWithSharedContent(owner6.lastNames, user2Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner6.firstNames);
  expect(searchResults[0].lastNames).eq(owner6.lastNames);

  // user2 can find owner7
  searchResults = await searchUsersWithSharedContent(owner7.lastNames, user2Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner7.firstNames);
  expect(searchResults[0].lastNames).eq(owner7.lastNames);

  // user2 cannot find owner4
  searchResults = await searchUsersWithSharedContent(owner4.lastNames, user2Id);
  expect(searchResults.length).eq(0);

  // user2 cannot find owner5
  searchResults = await searchUsersWithSharedContent(owner5.lastNames, user2Id);
  expect(searchResults.length).eq(0);
});

test("findOrCreateUser finds an existing user or creates a new one", async () => {
  const email = `unique-${Date.now()}@example.com`;
  const firstNames = "vitest";
  const lastNames = "user";
  const user = await findOrCreateUser({ email, firstNames, lastNames });
  expect(user.userId).toBeTypeOf("number");
  // Attempt to find the same user again
  const sameUser = await findOrCreateUser({ email, firstNames, lastNames });
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
  const { userId, firstNames, lastNames } = await createTestAdminUser();

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
  await makeActivityPublic({
    id: activityId,
    licenseCode: "CCDUAL",
    ownerId: userId,
  });
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
  await makeActivityPublic({
    id: activity1,
    licenseCode: "CCDUAL",
    ownerId: userId,
  });
  await makeActivityPublic({
    id: activity2,
    licenseCode: "CCDUAL",
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

test("move promoted content groups", async () => {
  const { userId } = await createTestAdminUser();

  const group1Name = "vitest-unique-promoted-group-" + new Date().toJSON();
  const group1Id = await addPromotedContentGroup(group1Name, userId);

  const group2Name = "vitest-unique-promoted-group-" + new Date().toJSON();
  const group2Id = await addPromotedContentGroup(group2Name, userId);

  let groups = await loadPromotedContent(userId);
  let groupNames = groups.map((g) => g.groupName);
  let group1PositionA = groupNames.indexOf(group1Name);
  let group2PositionA = groupNames.indexOf(group2Name);
  expect(group2PositionA).eq(group1PositionA + 1);

  await movePromotedContentGroup(group1Id, userId, group2PositionA);
  groups = await loadPromotedContent(userId);
  groupNames = groups.map((g) => g.groupName);
  let group1PositionB = groupNames.indexOf(group1Name);
  let group2PositionB = groupNames.indexOf(group2Name);
  expect(group1PositionB).eq(group2PositionA);
  expect(group2PositionB).eq(group1PositionA);

  const group3Name = "vitest-unique-promoted-group-" + new Date().toJSON();
  const group3Id = await addPromotedContentGroup(group3Name, userId);
  groups = await loadPromotedContent(userId);
  groupNames = groups.map((g) => g.groupName);
  let group1PositionC = groupNames.indexOf(group1Name);
  let group2PositionC = groupNames.indexOf(group2Name);
  let group3PositionC = groupNames.indexOf(group3Name);
  expect(group2PositionC).eq(group2PositionB);
  expect(group1PositionC).eq(group2PositionC + 1);
  expect(group3PositionC).eq(group2PositionC + 2);

  await movePromotedContentGroup(group3Id, userId, group1PositionC);
  groups = await loadPromotedContent(userId);
  groupNames = groups.map((g) => g.groupName);
  let group1PositionD = groupNames.indexOf(group1Name);
  let group2PositionD = groupNames.indexOf(group2Name);
  let group3PositionD = groupNames.indexOf(group3Name);
  expect(group2PositionD).eq(group2PositionC);
  expect(group3PositionD).eq(group2PositionD + 1);
  expect(group1PositionD).eq(group2PositionD + 2);
});

test("move promoted content", async () => {
  const { userId } = await createTestAdminUser();

  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const groupId = await addPromotedContentGroup(groupName, userId);

  // add first activity
  const { activityId: activity1Id } = await createActivity(userId, null);
  await makeActivityPublic({
    id: activity1Id,
    licenseCode: "CCDUAL",
    ownerId: userId,
  });
  await addPromotedContent(groupId, activity1Id, userId);
  let promotedContent = await loadPromotedContent(userId);
  let myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].activityId).toEqual(activity1Id);

  // add second activity
  const { activityId: activity2Id } = await createActivity(userId, null);
  await makeActivityPublic({
    id: activity2Id,
    licenseCode: "CCDUAL",
    ownerId: userId,
  });
  await addPromotedContent(groupId, activity2Id, userId);
  promotedContent = await loadPromotedContent(userId);
  myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].activityId).toEqual(activity1Id);
  expect(myContent!.promotedContent[1].activityId).toEqual(activity2Id);

  // move second activity to first spot
  await movePromotedContent(groupId, activity2Id, userId, 0);
  promotedContent = await loadPromotedContent(userId);
  myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].activityId).toEqual(activity2Id);
  expect(myContent!.promotedContent[1].activityId).toEqual(activity1Id);

  // add third activity
  const { activityId: activity3Id } = await createActivity(userId, null);
  await makeActivityPublic({
    id: activity3Id,
    licenseCode: "CCDUAL",
    ownerId: userId,
  });
  await addPromotedContent(groupId, activity3Id, userId);
  promotedContent = await loadPromotedContent(userId);
  myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].activityId).toEqual(activity2Id);
  expect(myContent!.promotedContent[1].activityId).toEqual(activity1Id);
  expect(myContent!.promotedContent[2].activityId).toEqual(activity3Id);

  // move first activity to last spot
  await movePromotedContent(groupId, activity1Id, userId, 10);
  promotedContent = await loadPromotedContent(userId);
  myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].activityId).toEqual(activity2Id);
  expect(myContent!.promotedContent[1].activityId).toEqual(activity3Id);
  expect(myContent!.promotedContent[2].activityId).toEqual(activity1Id);

  // move second activity to middle spot
  await movePromotedContent(groupId, activity2Id, userId, 1);
  promotedContent = await loadPromotedContent(userId);
  myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].activityId).toEqual(activity3Id);
  expect(myContent!.promotedContent[1].activityId).toEqual(activity2Id);
  expect(myContent!.promotedContent[2].activityId).toEqual(activity1Id);
});

test("promoted content access control", async () => {
  // Setup
  const { userId } = await createTestUser();
  const { activityId } = await createActivity(userId, null);
  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const { activityId: promotedActivityId } = await createActivity(userId, null);
  await makeActivityPublic({
    id: promotedActivityId,
    licenseCode: "CCDUAL",
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
  await makeActivityPublic({
    id: activityId,
    licenseCode: "CCDUAL",
    ownerId: ownerId1,
  });

  await expect(assignActivity(activityId, ownerId2)).rejects.toThrow(
    "No content found",
  );

  // still cannot create assignment even if activity is shared
  await shareActivity({
    id: activityId,
    licenseCode: "CCDUAL",
    ownerId: ownerId1,
    users: [ownerId2],
  });

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

  // open assignment assigns activity and generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );
  let assignment = await getAssignment(activityId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  let assignmentData = await getAssignmentDataFromCode(classCode);
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.id).eq(activityId);
  expect(assignmentData.assignment!.documents[0].assignedVersion!.source).eq(
    "Some content",
  );

  // close assignment completely unassigns since there is no data
  await closeAssignmentWithCode(activityId, ownerId);
  await expect(getAssignment(activityId, ownerId)).rejects.toThrow(
    "No content found",
  );

  assignmentData = await getAssignmentDataFromCode(classCode);
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

  assignmentData = await getAssignmentDataFromCode(classCode);
  expect(assignmentData.assignmentFound).eq(true);
  expect(assignmentData.assignment!.id).eq(activityId);

  // Open with past date.
  // Currently, says assignment is not found
  // TODO: if we want students who have previously joined the assignment to be able to reload the page,
  // then this should still retrieve data for those students.
  closeAt = DateTime.now().plus({ seconds: -7 });
  await openAssignmentWithCode(activityId, closeAt, ownerId);
  assignmentData = await getAssignmentDataFromCode(classCode);
  expect(assignmentData.assignmentFound).eq(false);
  expect(assignmentData.assignment).eq(null);

  // reopen with future date
  closeAt = DateTime.now().plus({ years: 1 });
  await openAssignmentWithCode(activityId, closeAt, ownerId);
  const { classCode: classCode3 } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );
  expect(classCode3).eq(classCode);
  assignment = await getAssignment(activityId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  // add some data
  await saveScoreAndState({
    activityId,
    docId: activity.documents[0].id,
    docVersionNum: 1,
    userId: ownerId,
    score: 0.3,
    onSubmission: true,
    state: "document state",
  });

  // closing assignment doesn't close completely due to the data
  await closeAssignmentWithCode(activityId, ownerId);
  assignment = await getAssignment(activityId, ownerId);
  expect(assignment.classCode).eq(classCode);
  expect(assignment.codeValidUntil).eqls(null);
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

  let assignmentData = await getAssignmentDataFromCode(classCode);
  expect(assignmentData.assignment!.id).eq(activityId);

  // unassign activity
  await unassignActivity(activityId, ownerId);
  await expect(getAssignment(activityId, ownerId)).rejects.toThrow(
    "No content found",
  );

  // Getting deleted assignment by code fails
  assignmentData = await getAssignmentDataFromCode(classCode);
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
  ).rejects.toThrow("No content found");

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

  const { codeValidUntil } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  expect(codeValidUntil).eqls(closeAt.toJSDate());

  let newCloseAt = DateTime.now().plus({ days: 2 });

  await expect(
    updateAssignmentSettings(activityId, newCloseAt, userId2),
  ).rejects.toThrow("Record to update not found");
  assignment = await getAssignment(activityId, ownerId);
  expect(assignment.codeValidUntil).eqls(closeAt.toJSDate());

  await updateAssignmentSettings(activityId, newCloseAt, ownerId);
  assignment = await getAssignment(activityId, ownerId);
  expect(assignment.codeValidUntil).eqls(newCloseAt.toJSDate());

  await expect(closeAssignmentWithCode(activityId, userId2)).rejects.toThrow(
    "Record to update not found",
  );

  await closeAssignmentWithCode(activityId, ownerId);
});

test("upgrade anonymous user", async () => {
  let anonUser = await createTestAnonymousUser();
  anonUser = await updateUser({
    userId: anonUser.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });

  expect(anonUser.isAnonymous).eq(true);

  const id = Date.now().toString();
  const realEmail = `real${id}@vitest.test`;

  const upgraded = await upgradeAnonymousUser({
    userId: anonUser.userId,
    email: realEmail,
  });

  expect(upgraded.isAnonymous).eq(false);
  expect(upgraded.email).eq(realEmail);
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

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    userId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });
  const userData1 = {
    userId: newUser1.userId,
    firstNames: newUser1.firstNames,
    lastNames: newUser1.lastNames,
  };

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1.userId,
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
    loggedInUserId: ownerId,
    studentId: newUser1.userId,
  });

  expect(assignmentStudentData).eqls({
    activityId,
    userId: newUser1.userId,
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
    user: { firstNames: "Zoe", lastNames: "Zaborowski" },
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
    userId: newUser1.userId,
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
    loggedInUserId: ownerId,
    studentId: newUser1.userId,
  });

  expect(assignmentStudentData).eqls({
    activityId,
    userId: newUser1.userId,
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
    user: { firstNames: "Zoe", lastNames: "Zaborowski" },
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
    userId: newUser1.userId,
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
    loggedInUserId: ownerId,
    studentId: newUser1.userId,
  });

  expect(assignmentStudentData).eqls({
    activityId,
    userId: newUser1.userId,
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
    user: { firstNames: "Zoe", lastNames: "Zaborowski" },
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
  let newUser2 = await createTestAnonymousUser();
  newUser2 = await updateUser({
    userId: newUser2.userId,
    firstNames: "Arya",
    lastNames: "Abbas",
  });
  const userData2 = {
    userId: newUser2.userId,
    firstNames: newUser2.firstNames,
    lastNames: newUser2.lastNames,
  };

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
    userId: newUser2.userId,
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
    loggedInUserId: ownerId,
    studentId: newUser2.userId,
  });

  expect(assignmentStudentData).eqls({
    activityId,
    userId: newUser2.userId,
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
    user: { firstNames: "Arya", lastNames: "Abbas" },
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

test("can't get assignment data if other user, but student can get their own data", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const otherUser = await createTestUser();
  const otherUserId = otherUser.userId;
  const { activityId, docId } = await createActivity(ownerId, null);

  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    userId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  // assignment owner can get score data
  await getAssignmentScoreData({
    activityId,
    ownerId,
  });

  // other user cannot get score data
  await expect(
    getAssignmentScoreData({
      activityId,
      ownerId: otherUserId,
    }),
  ).rejects.toThrow("No content found");

  // student cannot get score data on all of assignment
  await expect(
    getAssignmentScoreData({
      activityId,
      ownerId: newUser1.userId,
    }),
  ).rejects.toThrow("No content found");

  // assignment owner can get data on student
  const studentData = await getAssignmentStudentData({
    activityId,
    loggedInUserId: ownerId,
    studentId: newUser1.userId,
  });

  // another user cannot get data on student
  await expect(
    getAssignmentStudentData({
      activityId,
      loggedInUserId: otherUserId,
      studentId: newUser1.userId,
    }),
  ).rejects.toThrow("No assignmentScores found");

  // student can get own data
  expect(
    await getAssignmentStudentData({
      activityId,
      loggedInUserId: newUser1.userId,
      studentId: newUser1.userId,
    }),
  ).eqls(studentData);
});

test("can't unassign if have data", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId, null);

  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    userId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1.userId,
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
    loggedInUserId: ownerId,
    studentId: newUser1.userId,
  });

  await expect(unassignActivity(activityId, ownerId)).rejects.toThrow(
    "Record to update not found",
  );
});

test("get activity editor data only if owner or limited data for public/shared", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;
  const { activityId } = await createActivity(ownerId, null);

  await getActivityEditorData(activityId, ownerId);

  await expect(getActivityEditorData(activityId, user1Id)).rejects.toThrow(
    "No content found",
  );

  await makeActivityPublic({ id: activityId, ownerId, licenseCode: "CCDUAL" });

  let closeAt = DateTime.now().plus({ days: 1 });
  await openAssignmentWithCode(activityId, closeAt, ownerId);

  let data = await getActivityEditorData(activityId, ownerId);
  expect(data.notMe).eq(false);
  expect(data.activity.assignmentStatus).eq("Open");

  data = await getActivityEditorData(activityId, user1Id);
  expect(data.notMe).eq(true);
  expect(data.activity).eqls({
    id: activityId,
    name: "",
    ownerId,
    imagePath: null,
    assignmentStatus: "Unassigned",
    classCode: null,
    codeValidUntil: null,
    isPublic: false,
    isShared: false,
    sharedWith: [],
    license: null,
    documents: [],
    hasScoreData: false,
    parentFolder: null,
  });

  await makeActivityPrivate({ id: activityId, ownerId });
  await expect(getActivityEditorData(activityId, user1Id)).rejects.toThrow(
    "No content found",
  );

  await shareActivity({
    id: activityId,
    ownerId,
    licenseCode: "CCDUAL",
    users: [user1Id],
  });
  data = await getActivityEditorData(activityId, user1Id);
  expect(data.notMe).eq(true);
  expect(data.activity).eqls({
    id: activityId,
    name: "",
    ownerId,
    imagePath: null,
    assignmentStatus: "Unassigned",
    classCode: null,
    codeValidUntil: null,
    isPublic: false,
    isShared: false,
    sharedWith: [],
    license: null,
    documents: [],
    hasScoreData: false,
    parentFolder: null,
  });

  await expect(getActivityEditorData(activityId, user2Id)).rejects.toThrow(
    "No content found",
  );
});

test("get public activity editor data only if public or shared", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  const { activityId, docId } = await createActivity(ownerId, null);
  const doenetML = "hi!";
  await updateDoc({ id: docId, source: doenetML, ownerId });

  await expect(getSharedEditorData(activityId, user1Id)).rejects.toThrow(
    "No content found",
  );

  await updateContent({
    id: activityId,
    ownerId,
    name: "Some content",
  });
  await makeActivityPublic({
    id: activityId,
    licenseCode: "CCDUAL",
    ownerId,
  });

  let sharedData = await getSharedEditorData(activityId, user1Id);
  expect(sharedData.name).eq("Some content");
  expect(sharedData.documents[0].source).eq(doenetML);

  await makeActivityPrivate({
    id: activityId,
    ownerId,
  });

  await expect(getSharedEditorData(activityId, user1Id)).rejects.toThrow(
    "No content found",
  );

  await shareActivity({
    id: activityId,
    licenseCode: "CCDUAL",
    ownerId,
    users: [user1Id],
  });

  sharedData = await getSharedEditorData(activityId, user1Id);
  expect(sharedData.name).eq("Some content");
  expect(sharedData.documents[0].source).eq(doenetML);

  await expect(getSharedEditorData(activityId, user2Id)).rejects.toThrow(
    "No content found",
  );
});

test("activity editor data and my folder contents before and after assigned", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId, null);

  const { activity: preAssignedData } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  let expectedData: ContentStructure = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Unassigned",
    classCode: null,
    codeValidUntil: null,
    license: null,
    documents: [
      {
        id: docId,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: false,
    parentFolder: null,
  };
  preAssignedData.license = null; // skip trying to check big license object
  expect(preAssignedData).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  let folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.documents[0].name;
  delete expectedData.documents[0].source;
  expectedData.isFolder = false;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // Opening assignment also assigns the activity
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  const { activity: openedData } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expectedData = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Open",
    classCode,
    codeValidUntil: closeAt.toJSDate(),
    license: null,
    documents: [
      {
        id: docId,
        versionNum: 1,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: false,
    parentFolder: null,
  };

  openedData.license = null; // skip trying to check big license object
  expect(openedData).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.documents[0].name;
  delete expectedData.documents[0].source;
  delete expectedData.documents[0].versionNum;
  expectedData.isFolder = false;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // closing the assignment without data also unassigns it
  await closeAssignmentWithCode(activityId, ownerId);
  const { activity: closedData } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expectedData = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Unassigned",
    classCode,
    codeValidUntil: null,
    license: null,
    documents: [
      {
        id: docId,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: false,
    parentFolder: null,
  };

  closedData.license = null; // skip trying to check big license object
  expect(closedData).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.documents[0].name;
  delete expectedData.documents[0].source;
  expectedData.isFolder = false;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // re-opening, re-assigns with same code
  closeAt = DateTime.now().plus({ days: 1 });
  let { classCode: newClassCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  expect(newClassCode).eq(classCode);

  const { activity: openedData2 } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expectedData = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Open",
    classCode,
    codeValidUntil: closeAt.toJSDate(),
    license: null,
    documents: [
      {
        id: docId,
        versionNum: 1,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: false,
    parentFolder: null,
  };

  openedData2.license = null; // skip trying to check big license object
  expect(openedData2).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.documents[0].name;
  delete expectedData.documents[0].source;
  delete expectedData.documents[0].versionNum;
  expectedData.isFolder = false;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // just add some data (doesn't matter that it is owner themselves)
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: ownerId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  const { activity: openedData3 } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expectedData = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Open",
    classCode,
    codeValidUntil: closeAt.toJSDate(),
    license: null,
    documents: [
      {
        id: docId,
        versionNum: 1,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: true,
    parentFolder: null,
  };

  openedData3.license = null; // skip trying to check big license object
  expect(openedData3).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.documents[0].name;
  delete expectedData.documents[0].source;
  delete expectedData.documents[0].versionNum;
  expectedData.isFolder = false;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // now closing does not unassign
  await closeAssignmentWithCode(activityId, ownerId);
  const { activity: closedData2 } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expectedData = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Closed",
    classCode,
    codeValidUntil: null,
    license: null,
    documents: [
      {
        id: docId,
        versionNum: 1,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: true,
    parentFolder: null,
  };

  closedData2.license = null; // skip trying to check big license object
  expect(closedData2).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.documents[0].name;
  delete expectedData.documents[0].source;
  delete expectedData.documents[0].versionNum;
  expectedData.isFolder = false;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // explicitly unassigning fails due to the presence of data
  await expect(unassignActivity(activityId, ownerId)).rejects.toThrow(
    "Record to update not found",
  );
});

test("activity editor data shows its parent folder is public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { activityId } = await createActivity(ownerId, null);

  let { activity: data } = await getActivityEditorData(activityId, ownerId);
  expect(data.isPublic).eq(false);
  expect(data.parentFolder).eq(null);

  await makeActivityPublic({ id: activityId, ownerId, licenseCode: "CCBYSA" });
  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(true);
  expect(data.license?.code).eq("CCBYSA");
  expect(data.parentFolder).eq(null);

  let { folderId } = await createFolder(ownerId, null);
  await moveContent({
    id: activityId,
    desiredParentFolderId: folderId,
    desiredPosition: 0,
    ownerId,
  });

  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(true);
  expect(data.license?.code).eq("CCBYSA");
  expect(data.parentFolder?.isPublic).eq(false);

  await makeFolderPublic({ id: folderId, ownerId, licenseCode: "CCBYNCSA" });
  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(true);
  expect(data.license?.code).eq("CCBYNCSA");
  expect(data.parentFolder?.isPublic).eq(true);

  await makeFolderPrivate({ id: folderId, ownerId });
  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(false);
  expect(data.parentFolder?.isPublic).eq(false);

  await makeFolderPublic({ id: folderId, ownerId, licenseCode: "CCDUAL" });
  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(true);
  expect(data.license?.code).eq("CCDUAL");
  expect(data.parentFolder?.isPublic).eq(true);

  await makeActivityPrivate({ id: activityId, ownerId });
  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(false);
  expect(data.parentFolder?.isPublic).eq(true);
});

test("only user and assignment owner can load document state", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId, null);

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  // create new anonymous user
  let newUser = await createTestAnonymousUser();

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

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  // create new anonymous user
  let newUser = await createTestAnonymousUser();

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

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  // create new anonymous user
  let newUser = await createTestAnonymousUser();
  let userData = {
    userId: newUser!.userId,
    firstNames: newUser!.firstNames,
    lastNames: newUser!.lastNames,
  };

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
      firstNames: newUser!.firstNames,
      lastNames: newUser!.lastNames,
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
      firstNames: newUser!.firstNames,
      lastNames: newUser!.lastNames,
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
      firstNames: newUser!.firstNames,
      lastNames: newUser!.lastNames,
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
      firstNames: newUser!.firstNames,
      lastNames: newUser!.lastNames,
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
  let newUser2 = await createTestAnonymousUser();
  let userData2 = {
    userId: newUser2.userId,
    firstNames: newUser2.firstNames,
    lastNames: newUser2.lastNames,
  };
  await recordSubmittedEvent({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser2.userId,
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
      firstNames: newUser!.firstNames,
      lastNames: newUser!.lastNames,
      bestResponse: "Answer result 2",
      bestCreditAchieved: 0.8,
      latestResponse: "Answer result 2",
      latestCreditAchieved: 0.8,
      numResponses: 2,
    },
    {
      userId: newUser2.userId,
      firstNames: newUser2.firstNames,
      lastNames: newUser2.lastNames,
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
      userId: newUser2.userId,
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
      firstNames: newUser!.firstNames,
      lastNames: newUser!.lastNames,
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
      userId: newUser2.userId,
    }));
  expect(submittedResponseHistory).eqls([]);

  // verify submitted responses changes but average max credit doesn't change if submit a lower credit answer
  await recordSubmittedEvent({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser2.userId,
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
      userId: newUser2.userId,
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
      firstNames: newUser!.firstNames,
      lastNames: newUser!.lastNames,
      bestResponse: "Answer result 2",
      bestCreditAchieved: 0.8,
      latestResponse: "Answer result 2",
      latestCreditAchieved: 0.8,
      numResponses: 2,
    },
    {
      userId: newUser2.userId,
      firstNames: newUser2.firstNames,
      lastNames: newUser2.lastNames,
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
  let newUser = await createTestAnonymousUser();
  let userData = {
    userId: newUser!.userId,
    firstNames: newUser!.firstNames,
    lastNames: newUser!.lastNames,
  };

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
      firstNames: newUser!.firstNames,
      lastNames: newUser!.lastNames,
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

  // cannot unassign
  await expect(unassignActivity(activityId2, user2Id)).rejects.toThrow(
    "Record to update not found",
  );
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

  // open assignment generates code
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    userId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1.userId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  let userWithScores = await getStudentData({
    userId: newUser1.userId,
    ownerId,
    parentFolderId: null,
  });

  expect(userWithScores).eqls({
    userData: {
      userId: newUser1.userId,
      firstNames: newUser1.firstNames,
      lastNames: newUser1.lastNames,
    },
    orderedActivityScores: [
      {
        activityId: activityId,
        score: 0.5,
        activityName: "Activity 1",
      },
    ],
    folder: null,
  });

  // new lower score ignored
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1.userId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });

  userWithScores = await getStudentData({
    userId: newUser1.userId,
    ownerId,
    parentFolderId: null,
  });

  expect(userWithScores).eqls({
    userData: {
      userId: newUser1.userId,
      firstNames: newUser1.firstNames,
      lastNames: newUser1.lastNames,
    },
    orderedActivityScores: [
      {
        activityId: activityId,
        score: 0.5,
        activityName: "Activity 1",
      },
    ],
    folder: null,
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1.userId,
    score: 0.7,
    onSubmission: true,
    state: "document state 3",
  });

  userWithScores = await getStudentData({
    userId: newUser1.userId,
    ownerId,
    parentFolderId: null,
  });

  expect(userWithScores).eqls({
    userData: {
      userId: newUser1.userId,
      firstNames: newUser1.firstNames,
      lastNames: newUser1.lastNames,
    },
    orderedActivityScores: [
      {
        activityId: activityId,
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

  const { activityId: activity2Id, docId: doc2Id } = await createActivity(
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
  const { activityId: activity1aId, docId: doc1aId } = await createActivity(
    ownerId,
    folder3Id,
  );
  await updateContent({ id: activity1aId, name: "Activity 1a", ownerId });
  const { activityId: activity1eId, docId: doc1eId } = await createActivity(
    ownerId,
    folder1Id,
  );
  await updateContent({ id: activity1eId, name: "Activity 1e", ownerId });
  // move activity 1a to right places
  await moveContent({
    id: activity1aId,
    desiredParentFolderId: folder1Id,
    desiredPosition: 0,
    ownerId,
  });

  const { activityId: activity1c1Id, docId: doc1c1Id } = await createActivity(
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
  const { activityId: activity1c2aId, docId: doc1c2aId } = await createActivity(
    ownerId,
    folder1c2Id,
  );
  await updateContent({ id: activity1c2aId, name: "Activity 1c2a", ownerId });
  const { activityId: activity1c2bId, docId: doc1c2bId } = await createActivity(
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
  const { activityId: activity3bId, docId: doc3bId } = await createActivity(
    ownerId,
    folder3Id,
  );
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
  const { activityId: activityRootId, docId: docRootId } = await createActivity(
    ownerId,
    null,
  );
  await updateContent({ id: activityRootId, name: "Activity root", ownerId });

  const closeAt = DateTime.now().plus({ day: 1 });
  const { classCode: classCode1a } = await openAssignmentWithCode(
    activity1aId,
    closeAt,
    ownerId,
  );
  const { classCode: classCode1c1 } = await openAssignmentWithCode(
    activity1c1Id,
    closeAt,
    ownerId,
  );
  const { classCode: classCode1c2a } = await openAssignmentWithCode(
    activity1c2aId,
    closeAt,
    ownerId,
  );
  const { classCode: classCode1c2b } = await openAssignmentWithCode(
    activity1c2bId,
    closeAt,
    ownerId,
  );
  const { classCode: classCode1e } = await openAssignmentWithCode(
    activity1eId,
    closeAt,
    ownerId,
  );
  const { classCode: classCode2 } = await openAssignmentWithCode(
    activity2Id,
    closeAt,
    ownerId,
  );
  const { classCode: classCode3b } = await openAssignmentWithCode(
    activity3bId,
    closeAt,
    ownerId,
  );
  const { classCode: classCode1Root } = await openAssignmentWithCode(
    activityRootId,
    closeAt,
    ownerId,
  );

  let newUser = await createTestAnonymousUser();
  newUser = await updateUser({
    userId: newUser!.userId,
    firstNames: "Arya",
    lastNames: "Abbas",
  });
  let newUserId = newUser!.userId;
  let userNames = {
    firstNames: newUser.firstNames,
    lastNames: newUser.lastNames,
  };

  await saveScoreAndState({
    activityId: activity1aId,
    docId: doc1aId,
    docVersionNum: 1,
    userId: newUserId,
    score: 0.11,
    onSubmission: true,
    state: "document state 1a",
  });
  await saveScoreAndState({
    activityId: activity1c1Id,
    docId: doc1c1Id,
    docVersionNum: 1,
    userId: newUserId,
    score: 0.131,
    onSubmission: true,
    state: "document state 1c1",
  });
  await saveScoreAndState({
    activityId: activity1c2aId,
    docId: doc1c2aId,
    docVersionNum: 1,
    userId: newUserId,
    score: 0.1321,
    onSubmission: true,
    state: "document state 1c2a",
  });
  await saveScoreAndState({
    activityId: activity1c2bId,
    docId: doc1c2bId,
    docVersionNum: 1,
    userId: newUserId,
    score: 0.1322,
    onSubmission: true,
    state: "document state 1c2b",
  });
  await saveScoreAndState({
    activityId: activity1eId,
    docId: doc1eId,
    docVersionNum: 1,
    userId: newUserId,
    score: 0.15,
    onSubmission: true,
    state: "document state 1e",
  });
  await saveScoreAndState({
    activityId: activity2Id,
    docId: doc2Id,
    docVersionNum: 1,
    userId: newUserId,
    score: 0.2,
    onSubmission: true,
    state: "document state 2",
  });
  await saveScoreAndState({
    activityId: activity3bId,
    docId: doc3bId,
    docVersionNum: 1,
    userId: newUserId,
    score: 0.32,
    onSubmission: true,
    state: "document state 3b",
  });
  await saveScoreAndState({
    activityId: activityRootId,
    docId: docRootId,
    docVersionNum: 1,
    userId: newUserId,
    score: 1.0,
    onSubmission: true,
    state: "document state Root",
  });

  const desiredFolder3 = [{ id: activity3bId, name: "Activity 3b" }];
  const desiredFolder3Scores = [
    {
      activityId: activity3bId,
      userId: newUserId,
      score: 0.32,
      user: userNames,
    },
  ];
  const desiredFolder1c2 = [
    { id: activity1c2aId, name: "Activity 1c2a" },
    { id: activity1c2bId, name: "Activity 1c2b" },
  ];
  const desiredFolder1c2Scores = [
    {
      activityId: activity1c2aId,
      userId: newUserId,
      score: 0.1321,
      user: userNames,
    },
    {
      activityId: activity1c2bId,
      userId: newUserId,
      score: 0.1322,
      user: userNames,
    },
  ];

  const desiredFolder1c = [
    { id: activity1c1Id, name: "Activity 1c1" },
    ...desiredFolder1c2,
  ];
  const desiredFolder1cScores = [
    {
      activityId: activity1c1Id,
      userId: newUserId,
      score: 0.131,
      user: userNames,
    },
    ...desiredFolder1c2Scores,
  ];

  const desiredFolder1 = [
    { id: activity1aId, name: "Activity 1a" },
    ...desiredFolder1c,
    { id: activity1eId, name: "Activity 1e" },
  ];
  const desiredFolder1Scores = [
    {
      activityId: activity1aId,
      userId: newUserId,
      score: 0.11,
      user: userNames,
    },
    ...desiredFolder1cScores,
    {
      activityId: activity1eId,
      userId: newUserId,
      score: 0.15,
      user: userNames,
    },
  ];

  const desiredBaseFolder = [
    ...desiredFolder1,
    { id: activity2Id, name: "Activity 2" },
    ...desiredFolder3,
  ];
  const desiredBaseFolderScores = [
    ...desiredFolder1Scores,
    {
      activityId: activity2Id,
      userId: newUserId,
      score: 0.2,
      user: userNames,
    },
    ...desiredFolder3Scores,
  ];

  const desiredNullFolder = [
    ...desiredBaseFolder,
    { id: activityRootId, name: "Activity root" },
  ];
  const desiredNullFolderScores = [
    ...desiredBaseFolderScores,
    {
      activityId: activityRootId,
      userId: newUserId,
      score: 1.0,
      user: userNames,
    },
  ];

  let scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: null,
  });
  expect(scoreData.orderedActivities).eqls(desiredNullFolder);
  expect(scoreData.assignmentScores.sort((a, b) => a.score - b.score)).eqls(
    desiredNullFolderScores,
  );
  expect(scoreData.folder).eqls(null);

  let studentData = await getStudentData({
    userId: newUserId,
    ownerId,
    parentFolderId: null,
  });
  expect(
    studentData.orderedActivityScores.map((a) => ({
      activityId: a.activityId,
      score: a.score,
      userId: newUserId,
      user: userNames,
    })),
  ).eqls(desiredNullFolderScores);
  expect(studentData.folder).eqls(null);

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: baseFolderId,
  });
  expect(scoreData.orderedActivities).eqls(desiredBaseFolder);
  expect(scoreData.assignmentScores.sort((a, b) => a.score - b.score)).eqls(
    desiredBaseFolderScores,
  );
  expect(scoreData.folder?.id).eqls(baseFolderId);

  studentData = await getStudentData({
    userId: newUserId,
    ownerId,
    parentFolderId: baseFolderId,
  });
  expect(
    studentData.orderedActivityScores.map((a) => ({
      activityId: a.activityId,
      score: a.score,
      userId: newUserId,
      user: userNames,
    })),
  ).eqls(desiredBaseFolderScores);
  expect(studentData.folder?.id).eqls(baseFolderId);

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: folder1Id,
  });
  expect(scoreData.orderedActivities).eqls(desiredFolder1);
  expect(scoreData.assignmentScores.sort((a, b) => a.score - b.score)).eqls(
    desiredFolder1Scores,
  );
  expect(scoreData.folder?.id).eqls(folder1Id);

  studentData = await getStudentData({
    userId: newUserId,
    ownerId,
    parentFolderId: folder1Id,
  });
  expect(
    studentData.orderedActivityScores.map((a) => ({
      activityId: a.activityId,
      score: a.score,
      userId: newUserId,
      user: userNames,
    })),
  ).eqls(desiredFolder1Scores);
  expect(studentData.folder?.id).eqls(folder1Id);

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: folder3Id,
  });
  expect(scoreData.orderedActivities).eqls(desiredFolder3);
  expect(scoreData.assignmentScores.sort((a, b) => a.score - b.score)).eqls(
    desiredFolder3Scores,
  );
  expect(scoreData.folder?.id).eqls(folder3Id);

  studentData = await getStudentData({
    userId: newUserId,
    ownerId,
    parentFolderId: folder3Id,
  });
  expect(
    studentData.orderedActivityScores.map((a) => ({
      activityId: a.activityId,
      score: a.score,
      userId: newUserId,
      user: userNames,
    })),
  ).eqls(desiredFolder3Scores);
  expect(studentData.folder?.id).eqls(folder3Id);

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: folder1cId,
  });
  expect(scoreData.orderedActivities).eqls(desiredFolder1c);
  expect(scoreData.assignmentScores.sort((a, b) => a.score - b.score)).eqls(
    desiredFolder1cScores,
  );
  expect(scoreData.folder?.id).eqls(folder1cId);

  studentData = await getStudentData({
    userId: newUserId,
    ownerId,
    parentFolderId: folder1cId,
  });
  expect(
    studentData.orderedActivityScores.map((a) => ({
      activityId: a.activityId,
      score: a.score,
      userId: newUserId,
      user: userNames,
    })),
  ).eqls(desiredFolder1cScores);
  expect(studentData.folder?.id).eqls(folder1cId);

  scoreData = await getAllAssignmentScores({
    ownerId,
    parentFolderId: folder1dId,
  });
  expect(scoreData.orderedActivities).eqls([]);
  expect(scoreData.assignmentScores).eqls([]);
  expect(scoreData.folder?.id).eqls(folder1dId);

  studentData = await getStudentData({
    userId: newUserId,
    ownerId,
    parentFolderId: folder1dId,
  });
  expect(studentData.orderedActivityScores).eqls([]);
  expect(studentData.folder?.id).eqls(folder1dId);
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

  let newUser1 = await createTestAnonymousUser();
  newUser1 = await updateUser({
    userId: newUser1.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1.userId,
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
      userId: newUser1.userId,
      score: 0.5,
      user: {
        firstNames: newUser1.firstNames,
        lastNames: newUser1.lastNames,
      },
    },
  ]);

  // new lower score ignored
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1.userId,
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
      userId: newUser1.userId,
      score: 0.5,
      user: {
        firstNames: newUser1.firstNames,
        lastNames: newUser1.lastNames,
      },
    },
  ]);

  let newUser2 = await createTestAnonymousUser();
  newUser2 = await updateUser({
    userId: newUser2.userId,
    firstNames: "Arya",
    lastNames: "Abbas",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser2.userId,
    score: 0.3,
    onSubmission: true,
    state: "document state 3",
  });

  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: newUser1.userId,
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
      userId: newUser1.userId,
      score: 0.7,
      user: {
        firstNames: newUser1.firstNames,
        lastNames: newUser1.lastNames,
      },
    },
    {
      activityId: activityId,
      userId: newUser2.userId,
      score: 0.3,
      user: {
        firstNames: newUser2.firstNames,
        lastNames: newUser2.lastNames,
      },
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

  const { classCode: classCode2 } = await openAssignmentWithCode(
    activity2Id,
    closeAt,
    ownerId,
  );

  // identical name to user 2

  let newUser3 = await createTestAnonymousUser();
  newUser3 = await updateUser({
    userId: newUser3.userId,
    firstNames: "Nyla",
    lastNames: "Nyquist",
  });

  await saveScoreAndState({
    activityId: activity2Id,
    docId: doc2Id,
    docVersionNum: 1,
    userId: newUser3.userId,
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
      userId: newUser1.userId,
      score: 0.7,
      user: {
        firstNames: newUser1.firstNames,
        lastNames: newUser1.lastNames,
      },
    },
    {
      activityId: activityId,
      userId: newUser2.userId,
      score: 0.3,
      user: {
        firstNames: newUser2.firstNames,
        lastNames: newUser2.lastNames,
      },
    },
    {
      activityId: activity2Id,
      userId: newUser3.userId,
      score: 0.9,
      user: {
        firstNames: newUser3.firstNames,
        lastNames: newUser3.lastNames,
      },
    },
  ]);
});

test("search my folder content searches all subfolders", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  // Folder structure
  // The Base folder
  // - The first topic
  //   - First activity
  //   - Deleted activity (deleted)
  //   - Subtopic
  //     - First piece (deleted)
  //     - Second piece
  // - Activity 2
  // - Activity 3 (deleted)
  // Activity gone (deleted)
  // Activity root, first

  const { folderId: baseFolderId } = await createFolder(ownerId, null);
  await updateContent({ id: baseFolderId, ownerId, name: "The Base Folder" });
  const { folderId: folder1Id } = await createFolder(ownerId, baseFolderId);
  await updateContent({ id: folder1Id, ownerId, name: "The first topic" });

  const { activityId: activity1aId } = await createActivity(ownerId, folder1Id);
  await updateContent({
    id: activity1aId,
    ownerId,
    name: "First activity",
  });

  const { activityId: activity1bId } = await createActivity(ownerId, folder1Id);
  await updateContent({ id: activity1bId, ownerId, name: "Deleted activity" });
  await deleteActivity(activity1bId, ownerId);

  const { folderId: folder1cId } = await createFolder(ownerId, folder1Id);
  await updateContent({ id: folder1cId, ownerId, name: "Subtopic " });

  const { activityId: activity1c1Id } = await createActivity(
    ownerId,
    folder1cId,
  );
  await updateContent({ id: activity1c1Id, ownerId, name: "First piece" });
  await deleteActivity(activity1c1Id, ownerId);

  const { activityId: activity1c2Id } = await createActivity(
    ownerId,
    folder1cId,
  );
  await updateContent({ id: activity1c2Id, ownerId, name: "Second piece" });

  const { activityId: activity2Id } = await createActivity(
    ownerId,
    baseFolderId,
  );
  await updateContent({ id: activity2Id, ownerId, name: "Activity 2" });
  const { activityId: activity3Id } = await createActivity(
    ownerId,
    baseFolderId,
  );
  await updateContent({ id: activity3Id, ownerId, name: "Activity 3" });
  await deleteActivity(activity3Id, ownerId);

  const { activityId: activityGoneId } = await createActivity(ownerId, null);
  await updateContent({ id: activityGoneId, ownerId, name: "Activity gone" });
  await deleteActivity(activityGoneId, ownerId);
  const { activityId: activityRootId } = await createActivity(ownerId, null);
  await updateContent({
    id: activityRootId,
    ownerId,
    name: "Activity root, first",
  });

  let searchResults = await searchMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
    query: "first",
  });
  expect(searchResults.folder).eq(null);
  let content = searchResults.content;
  expect(content.length).eq(3);
  expect(
    content
      .sort((a, b) => a.id - b.id)
      .map((c) => ({ id: c.id, parentFolderId: c.parentFolder?.id ?? null })),
  ).eqls([
    { id: folder1Id, parentFolderId: baseFolderId },
    { id: activity1aId, parentFolderId: folder1Id },
    { id: activityRootId, parentFolderId: null },
  ]);

  searchResults = await searchMyFolderContent({
    folderId: baseFolderId,
    loggedInUserId: ownerId,
    query: "first",
  });
  expect(searchResults.folder?.id).eq(baseFolderId);
  content = searchResults.content;
  expect(content.length).eq(2);
  expect(
    content
      .sort((a, b) => a.id - b.id)
      .map((c) => ({ id: c.id, parentFolderId: c.parentFolder?.id ?? null })),
  ).eqls([
    { id: folder1Id, parentFolderId: baseFolderId },
    { id: activity1aId, parentFolderId: folder1Id },
  ]);

  searchResults = await searchMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
    query: "first",
  });
  expect(searchResults.folder?.id).eq(folder1Id);
  content = searchResults.content;
  expect(content.length).eq(1);
  expect(
    content
      .sort((a, b) => a.id - b.id)
      .map((c) => ({ id: c.id, parentFolderId: c.parentFolder?.id ?? null })),
  ).eqls([{ id: activity1aId, parentFolderId: folder1Id }]);

  searchResults = await searchMyFolderContent({
    folderId: folder1cId,
    loggedInUserId: ownerId,
    query: "first",
  });
  expect(searchResults.folder?.id).eq(folder1cId);
  content = searchResults.content;
  expect(content.length).eq(0);

  searchResults = await searchMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
    query: "activity",
  });
  expect(searchResults.folder).eq(null);
  content = searchResults.content;
  expect(content.length).eq(3);
  expect(
    content
      .sort((a, b) => a.id - b.id)
      .map((c) => ({ id: c.id, parentFolderId: c.parentFolder?.id ?? null })),
  ).eqls([
    { id: activity1aId, parentFolderId: folder1Id },
    { id: activity2Id, parentFolderId: baseFolderId },
    { id: activityRootId, parentFolderId: null },
  ]);

  searchResults = await searchMyFolderContent({
    folderId: baseFolderId,
    loggedInUserId: ownerId,
    query: "activity",
  });
  expect(searchResults.folder?.id).eq(baseFolderId);
  content = searchResults.content;
  expect(content.length).eq(2);
  expect(
    content
      .sort((a, b) => a.id - b.id)
      .map((c) => ({ id: c.id, parentFolderId: c.parentFolder?.id ?? null })),
  ).eqls([
    { id: activity1aId, parentFolderId: folder1Id },
    { id: activity2Id, parentFolderId: baseFolderId },
  ]);

  searchResults = await searchMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
    query: "activity",
  });
  expect(searchResults.folder?.id).eq(folder1Id);
  content = searchResults.content;
  expect(content.length).eq(1);
  expect(
    content
      .sort((a, b) => a.id - b.id)
      .map((c) => ({ id: c.id, parentFolderId: c.parentFolder?.id ?? null })),
  ).eqls([{ id: activity1aId, parentFolderId: folder1Id }]);

  searchResults = await searchMyFolderContent({
    folderId: folder1cId,
    loggedInUserId: ownerId,
    query: "activity",
  });
  expect(searchResults.folder?.id).eq(folder1cId);
  content = searchResults.content;
  expect(content.length).eq(0);
});

test("get licenses", async () => {
  let cc_by_sa = await getLicense("CCBYSA");
  expect(cc_by_sa.name).eq("Creative Commons Attribution-ShareAlike");
  expect(cc_by_sa.imageURL).eq("/creative_commons_by_sa.png");
  expect(cc_by_sa.smallImageURL).eq("/creative_commons_by_sa_small.png");
  expect(cc_by_sa.licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );

  let cc_by_nc_sa = await getLicense("CCBYNCSA");
  expect(cc_by_nc_sa.name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike",
  );
  expect(cc_by_nc_sa.imageURL).eq("/creative_commons_by_nc_sa.png");
  expect(cc_by_nc_sa.smallImageURL).eq("/creative_commons_by_nc_sa_small.png");
  expect(cc_by_nc_sa.licenseURL).eq(
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  );

  let cc_dual = await getLicense("CCDUAL");
  expect(cc_dual.name).eq(
    "Dual license Creative Commons Attribution-ShareAlike OR Attribution-NonCommercial-ShareAlike",
  );

  expect(cc_dual.composedOf[0].name).eq(
    "Creative Commons Attribution-ShareAlike",
  );
  expect(cc_dual.composedOf[0].imageURL).eq("/creative_commons_by_sa.png");
  expect(cc_dual.composedOf[0].smallImageURL).eq(
    "/creative_commons_by_sa_small.png",
  );
  expect(cc_dual.composedOf[0].licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );
  expect(cc_dual.composedOf[1].name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike",
  );
  expect(cc_dual.composedOf[1].imageURL).eq("/creative_commons_by_nc_sa.png");
  expect(cc_dual.composedOf[1].smallImageURL).eq(
    "/creative_commons_by_nc_sa_small.png",
  );
  expect(cc_dual.composedOf[1].licenseURL).eq(
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  );

  let all = await getAllLicenses();
  expect(all.map((x) => x.code)).eqls(["CCDUAL", "CCBYSA", "CCBYNCSA"]);
});

test("set license to make public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId, null);

  // make public with CCBYSA license
  await makeActivityPublic({
    id: activityId,
    ownerId,
    licenseCode: "CCBYSA",
  });
  let { activity: activityData } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expect(activityData.isPublic).eq(true);

  expect(activityData.license?.code).eq("CCBYSA");
  expect(activityData.license?.name).eq(
    "Creative Commons Attribution-ShareAlike",
  );
  expect(activityData.license?.licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );
  expect(activityData.license?.imageURL).eq("/creative_commons_by_sa.png");

  // make private
  await makeActivityPrivate({ id: activityId, ownerId });
  ({ activity: activityData } = await getActivityEditorData(
    activityId,
    ownerId,
  ));
  expect(activityData.isPublic).eq(false);

  // make public with CCBYNCSA license
  await makeActivityPublic({
    id: activityId,
    ownerId,
    licenseCode: "CCBYNCSA",
  });
  ({ activity: activityData } = await getActivityEditorData(
    activityId,
    ownerId,
  ));
  expect(activityData.isPublic).eq(true);

  expect(activityData.license?.code).eq("CCBYNCSA");
  expect(activityData.license?.name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike",
  );
  expect(activityData.license?.licenseURL).eq(
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  );
  expect(activityData.license?.imageURL).eq("/creative_commons_by_nc_sa.png");

  // switch license to dual
  await makeActivityPublic({
    id: activityId,
    ownerId,
    licenseCode: "CCDUAL",
  });

  ({ activity: activityData } = await getActivityEditorData(
    activityId,
    ownerId,
  ));
  expect(activityData.isPublic).eq(true);

  expect(activityData.license?.code).eq("CCDUAL");
  expect(activityData.license?.name).eq(
    "Dual license Creative Commons Attribution-ShareAlike OR Attribution-NonCommercial-ShareAlike",
  );

  expect(activityData.license?.composedOf[0].code).eq("CCBYSA");
  expect(activityData.license?.composedOf[0].name).eq(
    "Creative Commons Attribution-ShareAlike",
  );
  expect(activityData.license?.composedOf[0].licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );
  expect(activityData.license?.composedOf[0].imageURL).eq(
    "/creative_commons_by_sa.png",
  );

  expect(activityData.license?.composedOf[1].code).eq("CCBYNCSA");
  expect(activityData.license?.composedOf[1].name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike",
  );
  expect(activityData.license?.composedOf[1].licenseURL).eq(
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  );
  expect(activityData.license?.composedOf[1].imageURL).eq(
    "/creative_commons_by_nc_sa.png",
  );
});
