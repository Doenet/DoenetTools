import { expect, test } from "vitest";
import {
  addClassification,
  checkIfFolderContains,
  copyActivityToFolder,
  createActivity,
  createFolder,
  deleteFolder,
  getActivity,
  getActivityEditorData,
  getActivityViewerData,
  getDoc,
  getMyFolderContent,
  getPreferredFolderView,
  getSharedFolderContent,
  makeActivityPrivate,
  makeActivityPublic,
  makeFolderPrivate,
  makeFolderPublic,
  moveContent,
  searchPossibleClassifications,
  setPreferredFolderView,
  shareActivity,
  shareActivityWithEmail,
  shareFolder,
  shareFolderWithEmail,
  unshareActivity,
  unshareFolder,
  updateContentFeatures,
  updateDoc,
  updateUser,
} from "../model";
import { createTestUser } from "./utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ContentType } from "../types";

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
        parent: null,
      }),
      expect.objectContaining({
        id: privateActivity1Id,
        isPublic: false,
        parent: null,
      }),
      expect.objectContaining({
        id: publicFolder1Id,
        isPublic: true,
        parent: null,
      }),
      expect.objectContaining({
        id: privateFolder1Id,
        isPublic: false,
        parent: null,
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
  expect(ownerContent.folder?.id).eqls(publicFolder1Id);
  expect(ownerContent.folder?.parent).eq(null);
  expect(ownerContent.content.length).eq(4);
  expect(ownerContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity2Id,
        isPublic: true,
        parent: {
          id: publicFolder1Id,
          isPublic: true,
          isShared: false,
          sharedWith: [],
          name: ownerContent.folder?.name,
          type: "folder",
        },
      }),
      expect.objectContaining({
        id: privateActivity2Id,
        isPublic: false,
        parent: {
          id: publicFolder1Id,
          isPublic: true,
          isShared: false,
          sharedWith: [],
          name: ownerContent.folder?.name,
          type: "folder",
        },
      }),
      expect.objectContaining({
        id: publicFolder2Id,
        isPublic: true,
        parent: {
          id: publicFolder1Id,
          isPublic: true,
          isShared: false,
          sharedWith: [],
          name: ownerContent.folder?.name,
          type: "folder",
        },
      }),
      expect.objectContaining({
        id: privateFolder2Id,
        isPublic: false,
        parent: {
          id: publicFolder1Id,
          isPublic: true,
          isShared: false,
          sharedWith: [],
          name: ownerContent.folder?.name,
          type: "folder",
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
  expect(publicContent.folder?.id).eqls(publicFolder1Id);
  expect(publicContent.folder?.parent).eq(null);
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
  ).rejects.toThrow(PrismaClientKnownRequestError);

  ownerContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: privateFolder1Id,
  });
  expect(ownerContent.folder?.id).eqls(privateFolder1Id);
  expect(ownerContent.folder?.parent).eq(null);
  expect(ownerContent.content.length).eq(4);
  expect(ownerContent).toMatchObject({
    content: expect.arrayContaining([
      expect.objectContaining({
        id: publicActivity3Id,
        isPublic: true,
        parent: {
          id: privateFolder1Id,
          isPublic: false,
          isShared: false,
          sharedWith: [],
          name: ownerContent.folder?.name,
          type: "folder",
        },
      }),
      expect.objectContaining({
        id: privateActivity3Id,
        isPublic: false,
        parent: {
          id: privateFolder1Id,
          isPublic: false,
          isShared: false,
          sharedWith: [],
          name: ownerContent.folder?.name,
          type: "folder",
        },
      }),
      expect.objectContaining({
        id: publicFolder3Id,
        isPublic: true,
        parent: {
          id: privateFolder1Id,
          isPublic: false,
          isShared: false,
          sharedWith: [],
          name: ownerContent.folder?.name,
          type: "folder",
        },
      }),
      expect.objectContaining({
        id: privateFolder3Id,
        isPublic: false,
        parent: {
          id: privateFolder1Id,
          isPublic: false,
          isShared: false,
          sharedWith: [],
          name: ownerContent.folder?.name,
          type: "folder",
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
  ).rejects.toThrow(PrismaClientKnownRequestError);

  // If other user tries to access folder, throws error
  await expect(
    getMyFolderContent({
      loggedInUserId: userId,
      folderId: privateFolder1Id,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  ownerContent = await getMyFolderContent({
    loggedInUserId: ownerId,
    folderId: publicFolder3Id,
  });
  expect(ownerContent.folder?.id).eqls(publicFolder3Id);
  expect(ownerContent.folder?.parent?.id).eqls(privateFolder1Id);
  expect(ownerContent.content.length).eq(0);

  publicContent = await getSharedFolderContent({
    ownerId,
    folderId: publicFolder3Id,
    loggedInUserId: userId,
  });
  expect(publicContent.folder?.id).eqls(publicFolder3Id);
  expect(publicContent.folder?.parent).eq(null);
  expect(publicContent.content.length).eq(0);

  // If other user tries to access folder, throws error
  await expect(
    getMyFolderContent({
      loggedInUserId: userId,
      folderId: publicFolder3Id,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
});

test(
  "getMyFolderContent returns both public and private content, getSharedFolderContent returns only shared",
  { timeout: 30000 },
  async () => {
    const owner = await createTestUser();
    const ownerId = owner.userId;

    let user1 = await createTestUser();
    const user1Id = user1.userId;
    user1 = await updateUser({
      userId: user1Id,
      firstNames: "Zoe",
      lastNames: "Zaborowski",
    });
    const {
      isAdmin: _isAdmin1,
      isAnonymous: _isAnonymous1,
      cardView: _cardView1,
      ...userFields1
    } = user1;
    let user2 = await createTestUser();
    const user2Id = user2.userId;
    user2 = await updateUser({
      userId: user2Id,
      firstNames: "Arya",
      lastNames: "Abbas",
    });
    const {
      isAdmin: _isAdmin2,
      isAnonymous: _isAnonymous2,
      cardView: _cardView2,
      ...userFields2
    } = user2;
    const user3 = await createTestUser();
    const user3Id = user3.userId;

    const { activityId: sharedActivity1Id } = await createActivity(
      ownerId,
      null,
    );
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
    await shareActivityWithEmail({
      id: sharedActivity1Id,
      licenseCode: "CCDUAL",
      ownerId,
      email: user1.email,
    });
    await shareActivityWithEmail({
      id: sharedActivity1Id,
      licenseCode: "CCDUAL",
      ownerId,
      email: user2.email,
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
    await shareFolderWithEmail({
      id: sharedFolder3Id,
      licenseCode: "CCDUAL",
      ownerId,
      email: user2.email,
    });
    await shareFolderWithEmail({
      id: sharedFolder3Id,
      licenseCode: "CCDUAL",
      ownerId,
      email: user1.email,
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
          parent: null,
        }),
        expect.objectContaining({
          id: privateActivity1Id,
          isShared: false,
          parent: null,
        }),
        expect.objectContaining({
          id: sharedFolder1Id,
          isShared: true,
          parent: null,
        }),
        expect.objectContaining({
          id: privateFolder1Id,
          isShared: false,
          parent: null,
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
    expect(ownerContent.folder?.id).eqls(sharedFolder1Id);
    expect(ownerContent.folder?.parent).eq(null);
    expect(ownerContent.content.length).eq(4);
    expect(ownerContent).toMatchObject({
      content: expect.arrayContaining([
        expect.objectContaining({
          id: sharedActivity2Id,
          isShared: true,
          sharedWith: [userFields2, userFields1],
          parent: {
            id: sharedFolder1Id,
            isPublic: false,
            isShared: true,
            sharedWith: [userFields2, userFields1],
            name: ownerContent.folder?.name,
            type: "folder",
          },
        }),
        expect.objectContaining({
          id: privateActivity2Id,
          isShared: false,
          sharedWith: [],
          parent: {
            id: sharedFolder1Id,
            isPublic: false,
            isShared: true,
            sharedWith: [userFields2, userFields1],
            name: ownerContent.folder?.name,
            type: "folder",
          },
        }),
        expect.objectContaining({
          id: sharedFolder2Id,
          isShared: true,
          sharedWith: [userFields2, userFields1],
          parent: {
            id: sharedFolder1Id,
            isPublic: false,
            isShared: true,
            sharedWith: [userFields2, userFields1],
            name: ownerContent.folder?.name,
            type: "folder",
          },
        }),
        expect.objectContaining({
          id: privateFolder2Id,
          isShared: false,
          sharedWith: [],
          parent: {
            id: sharedFolder1Id,
            isPublic: false,
            isShared: true,
            sharedWith: [userFields2, userFields1],
            name: ownerContent.folder?.name,
            type: "folder",
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
    expect(sharedContent.folder?.id).eqls(sharedFolder1Id);
    expect(sharedContent.folder?.parent).eq(null);
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
    expect(sharedContent.folder?.id).eqls(sharedFolder1Id);
    expect(sharedContent.folder?.parent).eq(null);
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
    ).rejects.toThrow(PrismaClientKnownRequestError);

    // If other user tries to access folder via my folder, throws error
    await expect(
      getMyFolderContent({
        loggedInUserId: user1Id,
        folderId: sharedFolder1Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    ownerContent = await getMyFolderContent({
      loggedInUserId: ownerId,
      folderId: privateFolder1Id,
    });
    expect(ownerContent.folder?.id).eqls(privateFolder1Id);
    expect(ownerContent.folder?.parent).eq(null);
    expect(ownerContent.content.length).eq(4);
    expect(ownerContent).toMatchObject({
      content: expect.arrayContaining([
        expect.objectContaining({
          id: sharedActivity3Id,
          isShared: true,
          sharedWith: [userFields2, userFields1],
          parent: {
            id: privateFolder1Id,
            isPublic: false,
            isShared: false,
            sharedWith: [],
            name: ownerContent.folder?.name,
            type: "folder",
          },
        }),
        expect.objectContaining({
          id: privateActivity3Id,
          isShared: false,
          sharedWith: [],
          parent: {
            id: privateFolder1Id,
            isPublic: false,
            isShared: false,
            sharedWith: [],
            name: ownerContent.folder?.name,
            type: "folder",
          },
        }),
        expect.objectContaining({
          id: sharedFolder3Id,
          isShared: true,
          sharedWith: [userFields2, userFields1],
          parent: {
            id: privateFolder1Id,
            isPublic: false,
            isShared: false,
            sharedWith: [],
            name: ownerContent.folder?.name,
            type: "folder",
          },
        }),
        expect.objectContaining({
          id: privateFolder3Id,
          isShared: false,
          sharedWith: [],
          parent: {
            id: privateFolder1Id,
            isPublic: false,
            isShared: false,
            sharedWith: [],
            name: ownerContent.folder?.name,
            type: "folder",
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
    ).rejects.toThrow(PrismaClientKnownRequestError);

    // If other user tries to access folder, throws error
    await expect(
      getMyFolderContent({
        loggedInUserId: user1Id,
        folderId: privateFolder1Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    ownerContent = await getMyFolderContent({
      loggedInUserId: ownerId,
      folderId: sharedFolder3Id,
    });
    expect(ownerContent.folder?.id).eqls(sharedFolder3Id);
    expect(ownerContent.folder?.parent?.id).eqls(privateFolder1Id);
    expect(ownerContent.content.length).eq(0);

    sharedContent = await getSharedFolderContent({
      ownerId,
      folderId: sharedFolder3Id,
      loggedInUserId: user1Id,
    });
    expect(sharedContent.folder?.id).eqls(sharedFolder3Id);
    expect(sharedContent.folder?.parent).eq(null);
    expect(sharedContent.content.length).eq(0);

    // If other user tries to access folder, throws error
    await expect(
      getMyFolderContent({
        loggedInUserId: user1Id,
        folderId: sharedFolder3Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
  },
);

test(
  "deleteFolder marks a folder and all its sub content as deleted and prevents its retrieval",
  { timeout: 30000 },
  async () => {
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
    const folder1Content = await getMyFolderContent({
      loggedInUserId: userId,
      folderId: folder1Id,
    });
    expect(folder1Content.content.length).eq(2);
    const folder2Content = await getMyFolderContent({
      loggedInUserId: userId,
      folderId: folder2Id,
    });
    expect(folder2Content.content.length).eq(2);
    const folder3Content = await getMyFolderContent({
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
    ).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(
      getMyFolderContent({
        loggedInUserId: userId,
        folderId: folder2Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(
      getMyFolderContent({
        loggedInUserId: userId,
        folderId: folder3Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
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

    await expect(getActivity(activity1Id)).rejects.toThrow(
      PrismaClientKnownRequestError,
    );
    await expect(getActivity(activity2Id)).rejects.toThrow(
      PrismaClientKnownRequestError,
    );
    await expect(getActivity(activity3Id)).rejects.toThrow(
      PrismaClientKnownRequestError,
    );
    await getActivity(activity4Id);
    await getActivity(activity5Id);
    await getActivity(activity6Id);
    await expect(getDoc(doc1Id)).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(getDoc(doc2Id)).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(getDoc(doc3Id)).rejects.toThrow(PrismaClientKnownRequestError);
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
    ).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(
      getMyFolderContent({
        loggedInUserId: userId,
        folderId: folder6Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    await getActivity(activity4Id);
    await expect(getActivity(activity5Id)).rejects.toThrow(
      PrismaClientKnownRequestError,
    );
    await expect(getActivity(activity6Id)).rejects.toThrow(
      PrismaClientKnownRequestError,
    );
    await getDoc(doc4Id);
    await expect(getDoc(doc5Id)).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(getDoc(doc6Id)).rejects.toThrow(PrismaClientKnownRequestError);
  },
);

test("non-owner cannot delete folder", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user = await createTestUser();
  const userId = user.userId;

  const { folderId } = await createFolder(ownerId, null);
  await expect(deleteFolder(folderId, userId)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  // folder is still around
  getMyFolderContent({
    loggedInUserId: ownerId,
    folderId,
  });
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
    desiredParentId: null,
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
    desiredParentId: null,
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
    desiredParentId: null,
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
    desiredParentId: null,
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
    desiredParentId: folder1Id,
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
    desiredParentId: null,
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
    desiredParentId: folder3Id,
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
    desiredParentId: folder3Id,
    desiredPosition: 0,
    ownerId,
  });
  await moveContent({
    id: activity1Id,
    desiredParentId: folder2Id,
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
      desiredParentId: folder1Id,
      desiredPosition: 0,
      ownerId,
    }),
  ).rejects.toThrow("Cannot move folder into itself");

  await expect(
    moveContent({
      id: folder1Id,
      desiredParentId: folder2Id,
      desiredPosition: 0,
      ownerId,
    }),
  ).rejects.toThrow("Cannot move folder into a subfolder of itself");

  await expect(
    moveContent({
      id: folder1Id,
      desiredParentId: folder3Id,
      desiredPosition: 0,
      ownerId,
    }),
  ).rejects.toThrow("Cannot move folder into a subfolder of itself");

  await expect(
    moveContent({
      id: folder1Id,
      desiredParentId: folder4Id,
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
      desiredParentId: null,
      desiredPosition: 3,
      ownerId,
    });
    await moveContent({
      id: activity2Id,
      desiredParentId: null,
      desiredPosition: 3,
      ownerId,
    });
    await moveContent({
      id: activity3Id,
      desiredParentId: null,
      desiredPosition: 3,
      ownerId,
    });
    await moveContent({
      id: activity4Id,
      desiredParentId: null,
      desiredPosition: 3,
      ownerId,
    });
    await moveContent({
      id: activity6Id,
      desiredParentId: null,
      desiredPosition: 3,
      ownerId,
    });
    if (i === 4) {
      // This is the 33rd insert, so we invoked a shift to the right
      break;
    }
    await moveContent({
      id: activity5Id,
      desiredParentId: null,
      desiredPosition: 3,
      ownerId,
    });
    await moveContent({
      id: activity4Id,
      desiredParentId: null,
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
    desiredParentId: null,
    desiredPosition: 2,
    ownerId,
  });
  await moveContent({
    id: activity4Id,
    desiredParentId: null,
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
  ).rejects.toThrow(PrismaClientKnownRequestError);

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
  expect(newActivity.ownerId).eqls(newOwnerId);
  expect(newActivity.isPublic).toBe(false);

  const activityData = await getActivityViewerData(newActivityId, newOwnerId);

  const contribHist = activityData.docHistories![0].contributorHistory;
  expect(contribHist.length).eq(1);

  expect(contribHist[0].prevDocId).eqls(docId);
  expect(contribHist[0].prevDocVersionNum).eq(1);
});

test("copyActivityToFolder copies a shared document to a new owner", async () => {
  const originalOwnerId = (await createTestUser()).userId;
  const newOwnerId = (await createTestUser()).userId;
  const { activityId, docId } = await createActivity(originalOwnerId, null);
  // cannot copy if not yet shared
  await expect(
    copyActivityToFolder(activityId, newOwnerId, null),
  ).rejects.toThrow(PrismaClientKnownRequestError);

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
  expect(newActivity.ownerId).eqls(newOwnerId);
  expect(newActivity.isPublic).toBe(false);

  const activityData = await getActivityViewerData(newActivityId, newOwnerId);

  expect(activityData.activity.isShared).eq(false);

  const contribHist = activityData.docHistories![0].contributorHistory;
  expect(contribHist.length).eq(1);

  expect(contribHist[0].prevDocId).eqls(docId);
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
  expect(activity2.ownerId).eqls(ownerId2);
  expect(activity2.documents[0].source).eq(activity1Content);

  // history should be version 1 of activity 1
  const activityData2 = await getActivityViewerData(activityId2, ownerId2);
  const contribHist2 = activityData2.docHistories![0].contributorHistory;
  expect(contribHist2.length).eq(1);
  expect(contribHist2[0].prevDocId).eqls(docId1);
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
  expect(activity3.ownerId).eqls(ownerId3);
  expect(activity3.documents[0].source).eq(activity1ContentModified);

  // history should be version 2 of activity 1
  const activityData3 = await getActivityViewerData(activityId3, ownerId3);
  const contribHist3 = activityData3.docHistories![0].contributorHistory;
  expect(contribHist3.length).eq(1);
  expect(contribHist3[0].prevDocId).eqls(docId1);
  expect(contribHist3[0].prevDocVersionNum).eq(2);
});

test("copyActivityToFolder copies content classifications", async () => {
  const originalOwnerId = (await createTestUser()).userId;
  const newOwnerId = (await createTestUser()).userId;
  const { activityId } = await createActivity(originalOwnerId, null);

  const { id: classifyId } = (
    await searchPossibleClassifications({ query: "K.CC.1 common core" })
  ).find((k) => k.code === "K.CC.1")!;

  await addClassification(activityId, classifyId, originalOwnerId);

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

  const activityData = await getActivityEditorData(newActivityId, newOwnerId);

  expect(activityData.activity.classifications).toHaveLength(1);
  expect(activityData.activity.classifications[0].id).eq(classifyId);
});

test("copyActivityToFolder copies content features", async () => {
  const originalOwnerId = (await createTestUser()).userId;
  const newOwnerId = (await createTestUser()).userId;
  const { activityId: activityId1 } = await createActivity(
    originalOwnerId,
    null,
  );
  const { activityId: activityId2 } = await createActivity(
    originalOwnerId,
    null,
  );

  await updateContentFeatures({
    id: activityId1,
    ownerId: originalOwnerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    id: activityId2,
    ownerId: originalOwnerId,
    features: { containsVideo: true, isInteractive: true },
  });

  await makeActivityPublic({
    id: activityId1,
    ownerId: originalOwnerId,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activityId2,
    ownerId: originalOwnerId,
    licenseCode: "CCDUAL",
  });

  const newActivityId1 = await copyActivityToFolder(
    activityId1,
    newOwnerId,
    null,
  );
  const newActivityId2 = await copyActivityToFolder(
    activityId2,
    newOwnerId,
    null,
  );

  const activityData1 = await getActivityEditorData(newActivityId1, newOwnerId);
  expect(activityData1.activity.contentFeatures).toHaveLength(1);
  expect(activityData1.activity.contentFeatures[0].code).eq("isQuestion");

  const activityData2 = await getActivityEditorData(newActivityId2, newOwnerId);
  expect(activityData2.activity.contentFeatures).toHaveLength(2);
  expect(activityData2.activity.contentFeatures[0].code).eq("isInteractive");
  expect(activityData2.activity.contentFeatures[1].code).eq("containsVideo");
});

test("set and get preferred folder view", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  let result = await getPreferredFolderView(userId);
  expect(result).eqls({ cardView: false });

  result = await setPreferredFolderView(userId, true);
  expect(result).eqls({ cardView: true });

  result = await getPreferredFolderView(userId);
  expect(result).eqls({ cardView: true });
});

test("check if folder contains content type", async () => {
  const { userId } = await createTestUser();

  // initially shouldn't have any content types
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(await checkIfFolderContains(null, ct as ContentType, userId)).eq(
      false,
    );
  }

  // add a single document to base folder
  await createActivity(userId, null);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(await checkIfFolderContains(null, ct as ContentType, userId)).eq(
      ct === "singleDoc",
    );
  }

  // add a folder to base folder
  const { folderId: folderId1 } = await createFolder(userId, null);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(await checkIfFolderContains(null, ct as ContentType, userId)).eq(
      ct === "singleDoc" || ct === "folder",
    );
  }

  // add a question bank to base folder
  await createFolder(userId, null, "select");
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(await checkIfFolderContains(null, ct as ContentType, userId)).eq(
      ct !== "sequence",
    );
  }

  // add problem set to base folder
  await createFolder(userId, null, "sequence");
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(await checkIfFolderContains(null, ct as ContentType, userId)).eq(
      true,
    );
  }

  // folder1 starts out with nothing
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfFolderContains(folderId1, ct as ContentType, userId),
    ).eq(false);
  }

  // add a folder to folder 1
  const { folderId: folderId2 } = await createFolder(userId, folderId1);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfFolderContains(folderId1, ct as ContentType, userId),
    ).eq(ct === "folder");
  }

  // add a folder to folder 2, still checking folder 1
  const { folderId: folderId3 } = await createFolder(userId, folderId2);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfFolderContains(folderId1, ct as ContentType, userId),
    ).eq(ct === "folder");
  }

  // add a problem set to folder 3, still checking folder 1
  const { folderId: problemSetId4 } = await createFolder(
    userId,
    folderId3,
    "sequence",
  );
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfFolderContains(folderId1, ct as ContentType, userId),
    ).eq(ct === "folder" || ct === "sequence");
  }

  // add a question bank to problem set 4 still checking folder 1
  const { folderId: questionBank5 } = await createFolder(
    userId,
    problemSetId4,
    "select",
  );
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfFolderContains(folderId1, ct as ContentType, userId),
    ).eq(ct !== "singleDoc");
  }

  // add a document to problem set 5 still checking folder 1
  await createActivity(userId, questionBank5);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfFolderContains(folderId1, ct as ContentType, userId),
    ).eq(true);
  }

  // check chain from folder 1 up
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfFolderContains(folderId2, ct as ContentType, userId),
    ).eq(true);
  }

  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfFolderContains(folderId3, ct as ContentType, userId),
    ).eq(ct !== "folder");
  }

  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfFolderContains(problemSetId4, ct as ContentType, userId),
    ).eq(ct === "select" || ct === "singleDoc");
  }

  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfFolderContains(questionBank5, ct as ContentType, userId),
    ).eq(ct === "singleDoc");
  }
});
