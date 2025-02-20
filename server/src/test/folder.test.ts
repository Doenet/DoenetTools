import { expect, test } from "vitest";
import { createTestUser } from "./utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  getMyContent,
  getPreferredFolderView,
  getSharedContent,
  setPreferredFolderView,
} from "../apis/content_list";
import {
  createContent,
  deleteContent,
  updateContent,
  updateContentFeatures,
} from "../apis/activity";
import {
  modifyContentSharedWith,
  setContentIsPublic,
  shareContentWithEmail,
} from "../apis/share";
import { updateUser } from "../apis/user";
import {
  getActivityEditorData,
  getActivityViewerData,
  getContent,
} from "../apis/activity_edit_view";
import {
  checkIfContentContains,
  copyContent,
  moveContent,
} from "../apis/copy_move";
import {
  addClassification,
  searchPossibleClassifications,
} from "../apis/classification";
import { ContentType } from "@prisma/client";

test("getMyContent returns both public and private content, getSharedFolderContent returns only public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  // User is not the owner
  const user = await createTestUser();
  const userId = user.userId;

  const { id: publicActivity1Id } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { id: privateActivity1Id } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

  const { id: publicFolder1Id } = await createContent(ownerId, "folder", null);
  const { id: privateFolder1Id } = await createContent(ownerId, "folder", null);

  const { id: publicActivity2Id } = await createContent(
    ownerId,
    "singleDoc",
    publicFolder1Id,
  );
  const { id: publicFolder2Id } = await createContent(
    ownerId,
    "folder",
    publicFolder1Id,
  );

  const { id: publicActivity3Id } = await createContent(
    ownerId,
    "singleDoc",
    privateFolder1Id,
  );
  const { id: privateActivity3Id } = await createContent(
    ownerId,
    "singleDoc",
    privateFolder1Id,
  );
  const { id: publicFolder3Id } = await createContent(
    ownerId,
    "folder",
    privateFolder1Id,
  );
  const { id: privateFolder3Id } = await createContent(
    ownerId,
    "folder",
    privateFolder1Id,
  );

  // Make items public

  // make public activity 1 public
  await setContentIsPublic({
    contentId: publicActivity1Id,
    isPublic: true,
    loggedInUserId: ownerId,
  });

  // make public folder 1 and all items in folder 1 public
  await setContentIsPublic({
    contentId: publicFolder1Id,
    isPublic: true,
    loggedInUserId: ownerId,
  });

  // public content inside private folder 1
  // has to be made public explicitly
  await setContentIsPublic({
    contentId: publicActivity3Id,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: publicFolder3Id,
    isPublic: true,
    loggedInUserId: ownerId,
  });

  let ownerContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: null,
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
  let publicContent = await getSharedContent({
    ownerId,
    parentId: null,
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

  ownerContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: publicFolder1Id,
  });
  expect(ownerContent.folder?.id).eqls(publicFolder1Id);
  expect(ownerContent.folder?.parent).eq(null);
  expect(ownerContent.content.length).eq(2);
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
    ]),
  });

  publicContent = await getSharedContent({
    ownerId,
    parentId: publicFolder1Id,
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
    getMyContent({
      loggedInUserId: userId,
      parentId: publicFolder1Id,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  ownerContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: privateFolder1Id,
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
    getSharedContent({
      ownerId,
      parentId: privateFolder1Id,
      loggedInUserId: userId,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  // If other user tries to access folder, throws error
  await expect(
    getMyContent({
      loggedInUserId: userId,
      parentId: privateFolder1Id,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  ownerContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: publicFolder3Id,
  });
  expect(ownerContent.folder?.id).eqls(publicFolder3Id);
  expect(ownerContent.folder?.parent?.id).eqls(privateFolder1Id);
  expect(ownerContent.content.length).eq(0);

  publicContent = await getSharedContent({
    ownerId,
    parentId: publicFolder3Id,
    loggedInUserId: userId,
  });
  expect(publicContent.folder?.id).eqls(publicFolder3Id);
  expect(publicContent.folder?.parent).eq(null);
  expect(publicContent.content.length).eq(0);

  // If other user tries to access folder, throws error
  await expect(
    getMyContent({
      loggedInUserId: userId,
      parentId: publicFolder3Id,
    }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
});

test(
  "getMyContent returns both public and private content, getSharedFolderContent returns only shared",
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

    const { id: sharedActivity1Id } = await createContent(
      ownerId,
      "singleDoc",
      null,
    );
    const { id: privateActivity1Id } = await createContent(
      ownerId,
      "singleDoc",
      null,
    );

    const { id: sharedFolder1Id } = await createContent(
      ownerId,
      "folder",
      null,
    );
    const { id: privateFolder1Id } = await createContent(
      ownerId,
      "folder",
      null,
    );

    const { id: sharedActivity2Id } = await createContent(
      ownerId,
      "singleDoc",
      sharedFolder1Id,
    );
    const { id: sharedFolder2Id } = await createContent(
      ownerId,
      "folder",
      sharedFolder1Id,
    );

    const { id: sharedActivity3Id } = await createContent(
      ownerId,
      "singleDoc",
      privateFolder1Id,
    );
    const { id: privateActivity3Id } = await createContent(
      ownerId,
      "singleDoc",
      privateFolder1Id,
    );
    const { id: sharedFolder3Id } = await createContent(
      ownerId,
      "folder",
      privateFolder1Id,
    );
    const { id: privateFolder3Id } = await createContent(
      ownerId,
      "folder",
      privateFolder1Id,
    );

    // Share

    // share activity 1
    await shareContentWithEmail({
      contentId: sharedActivity1Id,
      loggedInUserId: ownerId,
      email: user1.email,
    });
    await shareContentWithEmail({
      contentId: sharedActivity1Id,
      loggedInUserId: ownerId,
      email: user2.email,
    });

    // sure folder 1 and all items in folder 1
    await modifyContentSharedWith({
      action: "share",
      contentId: sharedFolder1Id,
      loggedInUserId: ownerId,
      users: [user1Id, user2Id],
    });

    // shared content inside private folder 1
    // has to be shared explicitly
    await modifyContentSharedWith({
      action: "share",
      contentId: sharedActivity3Id,
      loggedInUserId: ownerId,
      users: [user1Id, user2Id],
    });
    await shareContentWithEmail({
      contentId: sharedFolder3Id,
      loggedInUserId: ownerId,
      email: user2.email,
    });
    await shareContentWithEmail({
      contentId: sharedFolder3Id,
      loggedInUserId: ownerId,
      email: user1.email,
    });

    let ownerContent = await getMyContent({
      loggedInUserId: ownerId,
      parentId: null,
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
    let sharedContent = await getSharedContent({
      ownerId,
      parentId: null,
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
    sharedContent = await getSharedContent({
      ownerId,
      parentId: null,
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
    sharedContent = await getSharedContent({
      ownerId,
      parentId: null,
      loggedInUserId: user3Id,
    });
    expect(sharedContent.folder).eq(null);
    expect(sharedContent.content.length).eq(0);

    ownerContent = await getMyContent({
      loggedInUserId: ownerId,
      parentId: sharedFolder1Id,
    });
    expect(ownerContent.folder?.id).eqls(sharedFolder1Id);
    expect(ownerContent.folder?.parent).eq(null);
    expect(ownerContent.content.length).eq(2);
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
      ]),
    });

    sharedContent = await getSharedContent({
      ownerId,
      parentId: sharedFolder1Id,
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

    sharedContent = await getSharedContent({
      ownerId,
      parentId: sharedFolder1Id,
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
      getSharedContent({
        ownerId,
        parentId: sharedFolder1Id,
        loggedInUserId: user3Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    // If other user tries to access folder via my folder, throws error
    await expect(
      getMyContent({
        loggedInUserId: user1Id,
        parentId: sharedFolder1Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    ownerContent = await getMyContent({
      loggedInUserId: ownerId,
      parentId: privateFolder1Id,
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
      getSharedContent({
        ownerId,
        parentId: privateFolder1Id,
        loggedInUserId: user1Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    // If other user tries to access folder, throws error
    await expect(
      getMyContent({
        loggedInUserId: user1Id,
        parentId: privateFolder1Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    ownerContent = await getMyContent({
      loggedInUserId: ownerId,
      parentId: sharedFolder3Id,
    });
    expect(ownerContent.folder?.id).eqls(sharedFolder3Id);
    expect(ownerContent.folder?.parent?.id).eqls(privateFolder1Id);
    expect(ownerContent.content.length).eq(0);

    sharedContent = await getSharedContent({
      ownerId,
      parentId: sharedFolder3Id,
      loggedInUserId: user1Id,
    });
    expect(sharedContent.folder?.id).eqls(sharedFolder3Id);
    expect(sharedContent.folder?.parent).eq(null);
    expect(sharedContent.content.length).eq(0);

    // If other user tries to access folder, throws error
    await expect(
      getMyContent({
        loggedInUserId: user1Id,
        parentId: sharedFolder3Id,
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

    const { id: folder1Id } = await createContent(userId, "folder", null);

    const { id: activity1Id } = await createContent(
      userId,
      "singleDoc",
      folder1Id,
    );
    const { id: folder2Id } = await createContent(userId, "folder", folder1Id);
    const { id: activity2Id } = await createContent(
      userId,
      "singleDoc",
      folder2Id,
    );
    const { id: folder3Id } = await createContent(userId, "folder", folder2Id);
    const { id: activity3Id } = await createContent(
      userId,
      "singleDoc",
      folder3Id,
    );

    const { id: folder4Id } = await createContent(userId, "folder", null);
    const { id: activity4Id } = await createContent(
      userId,
      "singleDoc",
      folder4Id,
    );
    const { id: folder5Id } = await createContent(userId, "folder", folder4Id);
    const { id: activity5Id } = await createContent(
      userId,
      "singleDoc",
      folder5Id,
    );
    const { id: folder6Id } = await createContent(userId, "folder", folder5Id);
    const { id: activity6Id } = await createContent(
      userId,
      "singleDoc",
      folder6Id,
    );

    // items can be retrieved
    let baseContent = await getMyContent({
      loggedInUserId: userId,
      parentId: null,
    });
    expect(baseContent.content.length).eq(2);
    const folder1Content = await getMyContent({
      loggedInUserId: userId,
      parentId: folder1Id,
    });
    expect(folder1Content.content.length).eq(2);
    const folder2Content = await getMyContent({
      loggedInUserId: userId,
      parentId: folder2Id,
    });
    expect(folder2Content.content.length).eq(2);
    const folder3Content = await getMyContent({
      loggedInUserId: userId,
      parentId: folder3Id,
    });
    expect(folder3Content.content.length).eq(1);
    let folder4Content = await getMyContent({
      loggedInUserId: userId,
      parentId: folder4Id,
    });
    expect(folder4Content.content.length).eq(2);
    let folder5Content = await getMyContent({
      loggedInUserId: userId,
      parentId: folder5Id,
    });
    expect(folder5Content.content.length).eq(2);
    let folder6Content = await getMyContent({
      loggedInUserId: userId,
      parentId: folder6Id,
    });
    expect(folder6Content.content.length).eq(1);

    await getContent({ contentId: activity1Id, loggedInUserId: userId });
    await getContent({ contentId: activity2Id, loggedInUserId: userId });
    await getContent({ contentId: activity3Id, loggedInUserId: userId });
    await getContent({ contentId: activity4Id, loggedInUserId: userId });
    await getContent({ contentId: activity5Id, loggedInUserId: userId });
    await getContent({ contentId: activity6Id, loggedInUserId: userId });

    // delete the entire folder 1 and all its content
    await deleteContent(folder1Id, userId);

    baseContent = await getMyContent({
      loggedInUserId: userId,
      parentId: null,
    });
    expect(baseContent.content.length).eq(1);
    await expect(
      getMyContent({
        loggedInUserId: userId,
        parentId: folder1Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(
      getMyContent({
        loggedInUserId: userId,
        parentId: folder2Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(
      getMyContent({
        loggedInUserId: userId,
        parentId: folder3Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
    folder4Content = await getMyContent({
      loggedInUserId: userId,
      parentId: folder4Id,
    });
    expect(folder4Content.content.length).eq(2);
    folder5Content = await getMyContent({
      loggedInUserId: userId,
      parentId: folder5Id,
    });
    expect(folder5Content.content.length).eq(2);
    folder6Content = await getMyContent({
      loggedInUserId: userId,
      parentId: folder6Id,
    });
    expect(folder6Content.content.length).eq(1);

    await expect(
      getContent({ contentId: activity1Id, loggedInUserId: userId }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(
      getContent({ contentId: activity2Id, loggedInUserId: userId }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(
      getContent({ contentId: activity3Id, loggedInUserId: userId }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
    await getContent({ contentId: activity4Id, loggedInUserId: userId });
    await getContent({ contentId: activity5Id, loggedInUserId: userId });
    await getContent({ contentId: activity6Id, loggedInUserId: userId });

    // delete folder 5 and its content
    await deleteContent(folder5Id, userId);

    baseContent = await getMyContent({
      loggedInUserId: userId,
      parentId: null,
    });
    expect(baseContent.content.length).eq(1);
    folder4Content = await getMyContent({
      loggedInUserId: userId,
      parentId: folder4Id,
    });
    expect(folder4Content.content.length).eq(1);
    await expect(
      getMyContent({
        loggedInUserId: userId,
        parentId: folder5Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(
      getMyContent({
        loggedInUserId: userId,
        parentId: folder6Id,
      }),
    ).rejects.toThrow(PrismaClientKnownRequestError);

    await getContent({ contentId: activity4Id, loggedInUserId: userId });
    await expect(
      getContent({ contentId: activity5Id, loggedInUserId: userId }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
    await expect(
      getContent({ contentId: activity6Id, loggedInUserId: userId }),
    ).rejects.toThrow(PrismaClientKnownRequestError);
  },
);

test("non-owner cannot delete folder", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user = await createTestUser();
  const userId = user.userId;

  const { id: folderId } = await createContent(ownerId, "folder", null);
  await expect(deleteContent(folderId, userId)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  // folder is still around
  getMyContent({
    loggedInUserId: ownerId,
    parentId: folderId,
  });
});

test("move content to different locations", async () => {
  const ownerId = (await createTestUser()).userId;

  const { id: activity1Id } = await createContent(ownerId, "singleDoc", null);
  const { id: activity2Id } = await createContent(ownerId, "singleDoc", null);
  const { id: folder1Id } = await createContent(ownerId, "folder", null);
  const { id: activity3Id } = await createContent(
    ownerId,
    "singleDoc",
    folder1Id,
  );
  const { id: folder2Id } = await createContent(ownerId, "folder", folder1Id);
  const { id: folder3Id } = await createContent(ownerId, "folder", null);

  let baseContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: null,
  });
  let folder1Content = await getMyContent({
    loggedInUserId: ownerId,
    parentId: folder1Id,
  });
  let folder2Content = await getMyContent({
    loggedInUserId: ownerId,
    parentId: folder2Id,
  });
  let folder3Content = await getMyContent({
    loggedInUserId: ownerId,
    parentId: folder3Id,
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
    loggedInUserId: ownerId,
  });
  baseContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: null,
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
    loggedInUserId: ownerId,
  });
  baseContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: null,
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
    loggedInUserId: ownerId,
  });
  baseContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: null,
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
    loggedInUserId: ownerId,
  });
  baseContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: null,
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
    loggedInUserId: ownerId,
  });
  baseContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: null,
  });
  folder1Content = await getMyContent({
    loggedInUserId: ownerId,
    parentId: folder1Id,
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
    loggedInUserId: ownerId,
  });
  baseContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: null,
  });
  folder1Content = await getMyContent({
    loggedInUserId: ownerId,
    parentId: folder1Id,
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
    loggedInUserId: ownerId,
  });
  folder1Content = await getMyContent({
    loggedInUserId: ownerId,
    parentId: folder1Id,
  });
  folder3Content = await getMyContent({
    loggedInUserId: ownerId,
    parentId: folder3Id,
  });
  expect(folder1Content.content.map((item) => item.id)).eqls([folder3Id]);
  expect(folder3Content.content.map((item) => item.id)).eqls([folder2Id]);

  await moveContent({
    id: activity3Id,
    desiredParentId: folder3Id,
    desiredPosition: 0,
    loggedInUserId: ownerId,
  });
  await moveContent({
    id: activity1Id,
    desiredParentId: folder2Id,
    desiredPosition: 1,
    loggedInUserId: ownerId,
  });
  baseContent = await getMyContent({
    loggedInUserId: ownerId,
    parentId: null,
  });
  folder2Content = await getMyContent({
    loggedInUserId: ownerId,
    parentId: folder2Id,
  });
  folder3Content = await getMyContent({
    loggedInUserId: ownerId,
    parentId: folder3Id,
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

test("cannot move content into itself or a descendant of itself", async () => {
  const ownerId = (await createTestUser()).userId;

  const { id: folder1Id } = await createContent(ownerId, "folder", null);
  const { id: folder2Id } = await createContent(ownerId, "folder", folder1Id);
  const { id: folder3Id } = await createContent(ownerId, "folder", folder2Id);
  const { id: folder4Id } = await createContent(ownerId, "folder", folder3Id);

  await expect(
    moveContent({
      id: folder1Id,
      desiredParentId: folder1Id,
      desiredPosition: 0,
      loggedInUserId: ownerId,
    }),
  ).rejects.toThrow("Cannot move content into itself");

  await expect(
    moveContent({
      id: folder1Id,
      desiredParentId: folder2Id,
      desiredPosition: 0,
      loggedInUserId: ownerId,
    }),
  ).rejects.toThrow("Cannot move content into a descendant of itself");

  await expect(
    moveContent({
      id: folder1Id,
      desiredParentId: folder3Id,
      desiredPosition: 0,
      loggedInUserId: ownerId,
    }),
  ).rejects.toThrow("Cannot move content into a descendant of itself");

  await expect(
    moveContent({
      id: folder1Id,
      desiredParentId: folder4Id,
      desiredPosition: 0,
      loggedInUserId: ownerId,
    }),
  ).rejects.toThrow("Cannot move content into a descendant of itself");
});

test("insert many items into sort order", { timeout: 30000 }, async () => {
  // This test is designed to test the parts of the moveContent
  // where the gap between successive sort indices reaches 1,
  // so that sort indices need to be shifted left or right.
  // As long as SORT_INCREMENT is 2**32, this happens after 33 inserts into the same gap.
  // (The test takes a long time to run; it could be made shorter if we could initialize
  // sort indices to desired values rather than performing so many moves.)

  const ownerId = (await createTestUser()).userId;

  const { id: activity1Id } = await createContent(ownerId, "singleDoc", null);
  const { id: activity2Id } = await createContent(ownerId, "singleDoc", null);
  const { id: activity3Id } = await createContent(ownerId, "singleDoc", null);
  const { id: activity4Id } = await createContent(ownerId, "singleDoc", null);
  const { id: activity5Id } = await createContent(ownerId, "singleDoc", null);
  const { id: activity6Id } = await createContent(ownerId, "singleDoc", null);

  // With the current algorithm and parameters,
  // the sort indices will need to be shifted after 32 inserts in between a pair of items.
  // Repeatedly moving items to position 3 will eventually cause a shift to the right.
  for (let i = 0; i < 5; i++) {
    await moveContent({
      id: activity1Id,
      desiredParentId: null,
      desiredPosition: 3,
      loggedInUserId: ownerId,
    });
    await moveContent({
      id: activity2Id,
      desiredParentId: null,
      desiredPosition: 3,
      loggedInUserId: ownerId,
    });
    await moveContent({
      id: activity3Id,
      desiredParentId: null,
      desiredPosition: 3,
      loggedInUserId: ownerId,
    });
    await moveContent({
      id: activity4Id,
      desiredParentId: null,
      desiredPosition: 3,
      loggedInUserId: ownerId,
    });
    await moveContent({
      id: activity6Id,
      desiredParentId: null,
      desiredPosition: 3,
      loggedInUserId: ownerId,
    });
    if (i === 4) {
      // This is the 33rd insert, so we invoked a shift to the right
      break;
    }
    await moveContent({
      id: activity5Id,
      desiredParentId: null,
      desiredPosition: 3,
      loggedInUserId: ownerId,
    });
    await moveContent({
      id: activity4Id,
      desiredParentId: null,
      desiredPosition: 3,
      loggedInUserId: ownerId,
    });
  }

  let contentList = await getMyContent({
    loggedInUserId: ownerId,
    parentId: null,
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
    loggedInUserId: ownerId,
  });
  await moveContent({
    id: activity4Id,
    desiredParentId: null,
    desiredPosition: 2,
    loggedInUserId: ownerId,
  });

  contentList = await getMyContent({
    loggedInUserId: ownerId,
    parentId: null,
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

test("copyContent copies a public document to a new owner", async () => {
  const originalOwnerId = (await createTestUser()).userId;
  const newOwnerId = (await createTestUser()).userId;
  const { id: activityId } = await createContent(
    originalOwnerId,
    "singleDoc",
    null,
  );
  // cannot copy if not yet public
  await expect(copyContent(activityId, newOwnerId, null)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  // Make the activity public before copying
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: originalOwnerId,
    isPublic: true,
  });
  const [newActivityId] = await copyContent(activityId, newOwnerId, null);
  const newActivity = await getContent({
    contentId: newActivityId,
    loggedInUserId: newOwnerId,
  });
  expect(newActivity.ownerId).eqls(newOwnerId);
  expect(newActivity.isPublic).toBe(false);

  const activityData = await getActivityViewerData(newActivityId, newOwnerId);

  const contribHist = activityData.activityHistory.contributorHistory;
  expect(contribHist.length).eq(1);

  expect(contribHist[0].prevActivityId).eqls(activityId);
  expect(contribHist[0].prevActivityRevisionNum).eq(1);
});

test("copyContent copies a shared document to a new owner", async () => {
  const originalOwnerId = (await createTestUser()).userId;
  const newOwnerId = (await createTestUser()).userId;
  const { id: activityId } = await createContent(
    originalOwnerId,
    "singleDoc",
    null,
  );
  // cannot copy if not yet shared
  await expect(copyContent(activityId, newOwnerId, null)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  // Make the activity public before copying
  await modifyContentSharedWith({
    action: "share",
    contentId: activityId,
    loggedInUserId: originalOwnerId,
    users: [newOwnerId],
  });
  const [newActivityId] = await copyContent(activityId, newOwnerId, null);
  const newActivity = await getContent({
    contentId: newActivityId,
    loggedInUserId: newOwnerId,
  });
  expect(newActivity.ownerId).eqls(newOwnerId);
  expect(newActivity.isPublic).toBe(false);

  const activityData = await getActivityViewerData(newActivityId, newOwnerId);

  expect(activityData.activity.isShared).eq(false);

  const contribHist = activityData.activityHistory.contributorHistory;
  expect(contribHist.length).eq(1);

  expect(contribHist[0].prevActivityId).eqls(activityId);
  expect(contribHist[0].prevActivityRevisionNum).eq(1);
});

test("copyContent remixes correct versions", async () => {
  const ownerId1 = (await createTestUser()).userId;
  const ownerId2 = (await createTestUser()).userId;
  const ownerId3 = (await createTestUser()).userId;

  // create activity 1 by owner 1
  const { id: activityId1 } = await createContent(ownerId1, "singleDoc", null);
  const activity1Content = "<p>Hello!</p>";
  await setContentIsPublic({
    contentId: activityId1,
    loggedInUserId: ownerId1,
    isPublic: true,
  });
  await updateContent({
    contentId: activityId1,
    source: activity1Content,
    loggedInUserId: ownerId1,
  });

  // copy activity 1 to owner 2's root folder
  const [activityId2] = await copyContent(activityId1, ownerId2, null);
  const activity2 = await getContent({
    contentId: activityId2,
    loggedInUserId: ownerId2,
  });
  if (activity2.type !== "singleDoc") {
    throw Error("shouldn't happen");
  }
  expect(activity2.ownerId).eqls(ownerId2);
  expect(activity2.source).eq(activity1Content);

  // history should be version 1 of activity 1
  const activityData2 = await getActivityViewerData(activityId2, ownerId2);
  const contribHist2 = activityData2.activityHistory.contributorHistory;
  expect(contribHist2.length).eq(1);
  expect(contribHist2[0].prevActivityId).eqls(activityId1);
  expect(contribHist2[0].prevActivityRevisionNum).eq(1);

  // modify activity 1 so that will have a new version
  const activity1ContentModified = "<p>Bye</p>";
  await updateContent({
    contentId: activityId1,
    source: activity1ContentModified,
    loggedInUserId: ownerId1,
  });

  // copy activity 1 to owner 3's Activities page
  const [activityId3] = await copyContent(activityId1, ownerId3, null);

  const activity3 = await getContent({
    contentId: activityId3,
    loggedInUserId: ownerId3,
  });
  if (activity3.type !== "singleDoc") {
    throw Error("shouldn't happen");
  }
  expect(activity3.ownerId).eqls(ownerId3);
  expect(activity3.source).eq(activity1ContentModified);

  // history should be version 2 of activity 1
  const activityData3 = await getActivityViewerData(activityId3, ownerId3);
  const contribHist3 = activityData3.activityHistory.contributorHistory;
  expect(contribHist3.length).eq(1);
  expect(contribHist3[0].prevActivityId).eqls(activityId1);
  expect(contribHist3[0].prevActivityRevisionNum).eq(2);
});

test("copyContent copies content classifications", async () => {
  const originalOwnerId = (await createTestUser()).userId;
  const newOwnerId = (await createTestUser()).userId;
  const { id: activityId } = await createContent(
    originalOwnerId,
    "singleDoc",
    null,
  );

  const { id: classifyId } = (
    await searchPossibleClassifications({ query: "K.CC.1 common core" })
  ).find((k) => k.code === "K.CC.1")!;

  await addClassification(activityId, classifyId, originalOwnerId);

  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: originalOwnerId,
    isPublic: true,
  });
  const [newActivityId] = await copyContent(activityId, newOwnerId, null);

  const activityData = await getActivityEditorData(newActivityId, newOwnerId);

  expect(activityData.activity!.classifications).toHaveLength(1);
  expect(activityData.activity!.classifications[0].id).eq(classifyId);
});

test("copyContent copies content features", async () => {
  const originalOwnerId = (await createTestUser()).userId;
  const newOwnerId = (await createTestUser()).userId;
  const { id: activityId1 } = await createContent(
    originalOwnerId,
    "singleDoc",
    null,
  );
  const { id: activityId2 } = await createContent(
    originalOwnerId,
    "singleDoc",
    null,
  );

  await updateContentFeatures({
    contentId: activityId1,
    loggedInUserId: originalOwnerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    contentId: activityId2,
    loggedInUserId: originalOwnerId,
    features: { containsVideo: true, isInteractive: true },
  });

  await setContentIsPublic({
    contentId: activityId1,
    loggedInUserId: originalOwnerId,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activityId2,
    loggedInUserId: originalOwnerId,
    isPublic: true,
  });

  const [newActivityId1] = await copyContent(activityId1, newOwnerId, null);
  const [newActivityId2] = await copyContent(activityId2, newOwnerId, null);

  const activityData1 = await getActivityEditorData(newActivityId1, newOwnerId);
  expect(activityData1.activity!.contentFeatures).toHaveLength(1);
  expect(activityData1.activity!.contentFeatures[0].code).eq("isQuestion");

  const activityData2 = await getActivityEditorData(newActivityId2, newOwnerId);
  expect(activityData2.activity!.contentFeatures).toHaveLength(2);
  expect(activityData2.activity!.contentFeatures[0].code).eq("isInteractive");
  expect(activityData2.activity!.contentFeatures[1].code).eq("containsVideo");
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

test("check if content contains content type", async () => {
  const { userId } = await createTestUser();

  // initially shouldn't have any content types
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(await checkIfContentContains(null, ct as ContentType, userId)).eq(
      false,
    );
  }

  // add a single document to base folder
  await createContent(userId, "singleDoc", null);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(await checkIfContentContains(null, ct as ContentType, userId)).eq(
      ct === "singleDoc",
    );
  }

  // add a folder to base folder
  const { id: folderId1 } = await createContent(userId, "folder", null);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(await checkIfContentContains(null, ct as ContentType, userId)).eq(
      ct === "singleDoc" || ct === "folder",
    );
  }

  // add a question bank to base folder
  await createContent(userId, "select", null);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(await checkIfContentContains(null, ct as ContentType, userId)).eq(
      ct !== "sequence",
    );
  }

  // add problem set to base folder
  await createContent(userId, "sequence", null);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(await checkIfContentContains(null, ct as ContentType, userId)).eq(
      true,
    );
  }

  // folder1 starts out with nothing
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfContentContains(folderId1, ct as ContentType, userId),
    ).eq(false);
  }

  // add a folder to folder 1
  const { id: folderId2 } = await createContent(userId, "folder", folderId1);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfContentContains(folderId1, ct as ContentType, userId),
    ).eq(ct === "folder");
  }

  // add a folder to folder 2, still checking folder 1
  const { id: folderId3 } = await createContent(userId, "folder", folderId2);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfContentContains(folderId1, ct as ContentType, userId),
    ).eq(ct === "folder");
  }

  // add a problem set to folder 3, still checking folder 1
  const { id: problemSetId4 } = await createContent(
    userId,
    "sequence",
    folderId3,
  );
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfContentContains(folderId1, ct as ContentType, userId),
    ).eq(ct === "folder" || ct === "sequence");
  }

  // add a question bank to problem set 4 still checking folder 1
  const { id: questionBank5 } = await createContent(
    userId,
    "select",
    problemSetId4,
  );
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfContentContains(folderId1, ct as ContentType, userId),
    ).eq(ct !== "singleDoc");
  }

  // add a document to problem set 5 still checking folder 1
  await createContent(userId, "singleDoc", questionBank5);
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfContentContains(folderId1, ct as ContentType, userId),
    ).eq(true);
  }

  // check chain from folder 1 up
  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfContentContains(folderId2, ct as ContentType, userId),
    ).eq(true);
  }

  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfContentContains(folderId3, ct as ContentType, userId),
    ).eq(ct !== "folder");
  }

  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfContentContains(problemSetId4, ct as ContentType, userId),
    ).eq(ct === "select" || ct === "singleDoc");
  }

  for (const ct of ["singleDoc", "sequence", "select", "folder"]) {
    expect(
      await checkIfContentContains(questionBank5, ct as ContentType, userId),
    ).eq(ct === "singleDoc");
  }
});
