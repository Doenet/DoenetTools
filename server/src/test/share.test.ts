import { expect, test } from "vitest";
import {
  copyActivityToFolder,
  createActivity,
  createFolder,
  getActivity,
  getActivityEditorData,
  getAllLicenses,
  getDocumentContributorHistories,
  getDocumentDirectRemixes,
  getDocumentRemixes,
  getLicense,
  getMyFolderContent,
  makeActivityPrivate,
  makeActivityPublic,
  makeFolderPrivate,
  makeFolderPublic,
  moveContent,
  shareActivity,
  shareActivityWithEmail,
  shareFolder,
  shareFolderWithEmail,
  unshareFolder,
  updateUser,
} from "../model";
import { createTestUser } from "./utils";

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

  expect(content[0].id).eqls(activityId);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  expect(content[1].id).eqls(folderId);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCBYSA");
});

test("content in shared folder is created shared", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user = await createTestUser();
  const userId = user.userId;
  const { isAdmin, isAnonymous, cardView, ...userFields } = user;

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

  expect(content[0].id).eqls(activityId);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");

  expect(content[1].id).eqls(folderId);
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

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isPublic).eqls(false);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(false);
  expect(content[1].license?.code).eqls("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
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

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
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

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(false);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCBYSA");
});

test(
  "making sharing/unsharing a folder also shares/unshares its content",
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
    let user3 = await createTestUser();
    const user3Id = user3.userId;
    user3 = await updateUser({
      userId: user3Id,
      firstNames: "Nyla",
      lastNames: "Nyquist",
    });
    const {
      isAdmin: _isAdmin3,
      isAnonymous: _isAnonymous3,
      cardView: _cardView3,
      ...userFields3
    } = user3;

    const sharedUserFields = [userFields2, userFields1];
    const sharedUserFields23 = [userFields2, userFields3];

    const { folderId: sharedFolderId } = await createFolder(ownerId, null);

    // create content in folder that will become shared
    const { activityId: activity1Id } = await createActivity(
      ownerId,
      sharedFolderId,
    );
    const { folderId: folder1Id } = await createFolder(ownerId, sharedFolderId);
    const { folderId: folder2Id } = await createFolder(ownerId, folder1Id);
    const { activityId: activity2Id } = await createActivity(
      ownerId,
      folder2Id,
    );

    let results = await getMyFolderContent({
      folderId: sharedFolderId,
      loggedInUserId: ownerId,
    });
    let content = results.content;

    expect(content[0].id).eqls(activity1Id);
    expect(content[0].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);
    expect(content[0].license?.code).eq("CCDUAL");
    expect(content[1].id).eqls(folder1Id);
    expect(content[1].isShared).eq(false);
    expect(content[1].sharedWith).eqls([]);
    expect(content[1].license?.code).eq("CCDUAL");

    results = await getMyFolderContent({
      folderId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);
    expect(content[0].license?.code).eq("CCDUAL");

    results = await getMyFolderContent({
      folderId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);
    expect(content[0].license?.code).eq("CCDUAL");

    await shareFolderWithEmail({
      id: sharedFolderId,
      licenseCode: "CCBYSA",
      ownerId,
      email: user2.email,
    });
    await shareFolderWithEmail({
      id: sharedFolderId,
      licenseCode: "CCBYSA",
      ownerId,
      email: user1.email,
    });

    results = await getMyFolderContent({
      folderId: sharedFolderId,
      loggedInUserId: ownerId,
    });
    content = results.content;

    expect(content[0].id).eqls(activity1Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields);
    expect(content[0].license?.code).eq("CCBYSA");
    expect(content[1].id).eqls(folder1Id);
    expect(content[1].isShared).eq(true);
    expect(content[1].sharedWith).eqls(sharedUserFields);
    expect(content[1].license?.code).eq("CCBYSA");

    results = await getMyFolderContent({
      folderId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields);
    expect(content[0].license?.code).eq("CCBYSA");

    results = await getMyFolderContent({
      folderId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields);
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

    expect(content[0].id).eqls(activity1Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields2]);
    expect(content[0].license?.code).eq("CCBYSA");
    expect(content[1].id).eqls(folder1Id);
    expect(content[1].isShared).eq(true);
    expect(content[1].sharedWith).eqls([userFields2]);
    expect(content[1].license?.code).eq("CCBYSA");

    results = await getMyFolderContent({
      folderId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields2]);
    expect(content[0].license?.code).eq("CCBYSA");

    results = await getMyFolderContent({
      folderId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
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

    expect(content[0].id).eqls(activity1Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields2]);
    expect(content[0].license?.code).eq("CCBYSA");
    expect(content[1].id).eqls(folder1Id);
    expect(content[1].isShared).eq(true);
    expect(content[1].sharedWith).eqls([userFields2]);
    expect(content[1].license?.code).eq("CCBYSA");

    results = await getMyFolderContent({
      folderId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields23);
    expect(content[0].license?.code).eq("CCBYNCSA");

    results = await getMyFolderContent({
      folderId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields23);
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

    expect(content[0].id).eqls(activity1Id);
    expect(content[0].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);
    expect(content[0].license?.code).eq("CCBYSA");
    expect(content[1].id).eqls(folder1Id);
    expect(content[1].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);
    expect(content[1].license?.code).eq("CCBYSA");

    results = await getMyFolderContent({
      folderId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields3]);
    expect(content[0].license?.code).eq("CCBYNCSA");

    results = await getMyFolderContent({
      folderId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields3]);
    expect(content[0].license?.code).eq("CCBYNCSA");
  },
);

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

  expect(content[1].id).eqls(activity1Id);
  expect(content[1].isPublic).eq(false);
  expect(content[1].license?.code).eq("CCDUAL");
  expect(content[2].id).eqls(folder1Id);
  expect(content[2].isPublic).eq(false);
  expect(content[2].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
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

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
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

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");
});

test("moving content into shared folder shares it", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user = await createTestUser();
  const userId = user.userId;
  const {
    isAdmin: _isAdmin,
    isAnonymous: _isAnonymous,
    cardView: _cardView,
    ...userFields
  } = user;

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

  expect(content[1].id).eqls(activity1Id);
  expect(content[1].isShared).eq(false);
  expect(content[1].sharedWith).eqls([]);
  expect(content[1].license?.code).eq("CCDUAL");
  expect(content[2].id).eqls(folder1Id);
  expect(content[2].isShared).eq(false);
  expect(content[2].sharedWith).eqls([]);
  expect(content[2].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isShared).eq(false);
  expect(content[0].sharedWith).eqls([]);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
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

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields]);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
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

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields]);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyFolderContent({
    folderId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");
});

test("share with email throws error when no match", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user = await createTestUser();

  const otherEmail = `unique-${Date.now()}@example.com`;

  const { folderId } = await createFolder(ownerId, null);
  const { activityId } = await createActivity(ownerId, null);

  await expect(
    shareActivityWithEmail({
      id: activityId,
      ownerId,
      licenseCode: "CCBYSA",
      email: otherEmail,
    }),
  ).rejects.toThrow("User with email not found");

  await shareActivityWithEmail({
    id: activityId,
    ownerId,
    licenseCode: "CCBYSA",
    email: user.email,
  });

  expect(
    (await getActivityEditorData(activityId, ownerId)).activity.sharedWith.map(
      (obj) => obj.email,
    ),
  ).eqls([user.email]);

  await expect(
    shareFolderWithEmail({
      id: folderId,
      ownerId,
      licenseCode: "CCBYSA",
      email: otherEmail,
    }),
  ).rejects.toThrow("User with email not found");

  await shareFolderWithEmail({
    id: folderId,
    ownerId,
    licenseCode: "CCBYSA",
    email: user.email,
  });

  expect(
    (
      await getMyFolderContent({ folderId, loggedInUserId: ownerId })
    ).folder!.sharedWith.map((obj) => obj.email),
  ).eqls([user.email]);
});

test("share with email throws error when share with self", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user = await createTestUser();

  const { folderId } = await createFolder(ownerId, null);
  const { activityId } = await createActivity(ownerId, null);

  await expect(
    shareActivityWithEmail({
      id: activityId,
      ownerId,
      licenseCode: "CCBYSA",
      email: owner.email,
    }),
  ).rejects.toThrow("Cannot share with self");

  await shareActivityWithEmail({
    id: activityId,
    ownerId,
    licenseCode: "CCBYSA",
    email: user.email,
  });
  expect(
    (await getActivityEditorData(activityId, ownerId)).activity.sharedWith.map(
      (obj) => obj.email,
    ),
  ).eqls([user.email]);

  await expect(
    shareFolderWithEmail({
      id: folderId,
      ownerId,
      licenseCode: "CCBYSA",
      email: owner.email,
    }),
  ).rejects.toThrow("Cannot share with self");

  await shareFolderWithEmail({
    id: folderId,
    ownerId,
    licenseCode: "CCBYSA",
    email: user.email,
  });

  expect(
    (
      await getMyFolderContent({ folderId, loggedInUserId: ownerId })
    ).folder!.sharedWith.map((obj) => obj.email),
  ).eqls([user.email]);
});

test("contributor history shows only documents user can view", async () => {
  const ownerId1 = (await createTestUser()).userId;
  const ownerId2 = (await createTestUser()).userId;
  const ownerId3 = (await createTestUser()).userId;

  // create public activity 1 by owner 1
  const { activityId: activityId1, docId: docId1 } = await createActivity(
    ownerId1,
    null,
  );
  await makeActivityPublic({
    id: activityId1,
    ownerId: ownerId1,
    licenseCode: "CCDUAL",
  });

  // owner 2 copies activity 1 to activity 2 and shares it with owner 3
  const activityId2 = await copyActivityToFolder(activityId1, ownerId2, null);
  const docId2 = (await getActivity(activityId2)).documents[0].id;
  await shareActivity({
    id: activityId2,
    ownerId: ownerId2,
    licenseCode: "CCBYSA",
    users: [ownerId3],
  });

  // owner 3 copies activity 2 to activity 3, and then copies that to public activity 4
  const activityId3 = await copyActivityToFolder(activityId2, ownerId3, null);
  const docId3 = (await getActivity(activityId3)).documents[0].id;
  const activityId4 = await copyActivityToFolder(activityId3, ownerId3, null);
  const docId4 = (await getActivity(activityId4)).documents[0].id;
  await makeActivityPublic({
    id: activityId4,
    ownerId: ownerId3,
    licenseCode: "CCBYSA",
  });

  // owner 3 copies activity 1 to activity 5 and shares it with owner 1
  const activityId5 = await copyActivityToFolder(activityId1, ownerId3, null);
  const docId5 = (await getActivity(activityId5)).documents[0].id;
  await shareActivity({
    id: activityId5,
    ownerId: ownerId3,
    licenseCode: "CCBYNCSA",
    users: [ownerId1],
  });

  // owner1 just sees activity 1 in history of activity 4
  let docHistory = (
    await getDocumentContributorHistories({
      docIds: [docId4],
      loggedInUserId: ownerId1,
    })
  )[0].contributorHistory;
  expect(docHistory.length).eq(1);
  expect(docHistory[0].prevDocId).eqls(docId1);
  expect(docHistory[0].prevDoc.document.activity.id).eqls(activityId1);
  expect(docHistory[0].withLicenseCode).eq("CCDUAL");

  // owner 1 just sees activity 4 and 5 in remixes of activity 1
  let docRemixes = (
    await getDocumentRemixes({
      docIds: [docId1],
      loggedInUserId: ownerId1,
    })
  )[0].documentVersions.flatMap((v) => v.remixes);
  expect(docRemixes.length).eq(2);
  expect(docRemixes[0].docId).eqls(docId5);
  expect(docRemixes[0].activity.id).eqls(activityId5);
  expect(docRemixes[0].withLicenseCode).eq("CCDUAL");
  expect(docRemixes[1].docId).eqls(docId4);
  expect(docRemixes[1].activity.id).eqls(activityId4);
  expect(docRemixes[1].withLicenseCode).eq("CCDUAL");

  // owner 1 just sees direct remix from activity 1 into activity 5
  docRemixes = (
    await getDocumentDirectRemixes({
      docIds: [docId1],
      loggedInUserId: ownerId1,
    })
  )[0].documentVersions.flatMap((v) => v.remixes);
  expect(docRemixes.length).eq(1);
  expect(docRemixes[0].docId).eqls(docId5);
  expect(docRemixes[0].activity.id).eqls(activityId5);
  expect(docRemixes[0].withLicenseCode).eq("CCDUAL");

  // owner2 just sees activity 1 and 2 in history of activity 4
  docHistory = (
    await getDocumentContributorHistories({
      docIds: [docId4],
      loggedInUserId: ownerId2,
    })
  )[0].contributorHistory;
  expect(docHistory.length).eq(2);
  expect(docHistory[0].prevDocId).eqls(docId2);
  expect(docHistory[0].prevDoc.document.activity.id).eqls(activityId2);
  expect(docHistory[0].withLicenseCode).eq("CCBYSA");
  expect(docHistory[1].prevDocId).eqls(docId1);
  expect(docHistory[1].prevDoc.document.activity.id).eqls(activityId1);
  expect(docHistory[1].withLicenseCode).eq("CCDUAL");

  // owner 2 just sees activity 4 and 2 in remixes of activity 1
  docRemixes = (
    await getDocumentRemixes({
      docIds: [docId1],
      loggedInUserId: ownerId2,
    })
  )[0].documentVersions.flatMap((v) => v.remixes);
  expect(docRemixes.length).eq(2);
  expect(docRemixes[0].docId).eqls(docId4);
  expect(docRemixes[0].activity.id).eqls(activityId4);
  expect(docRemixes[0].withLicenseCode).eq("CCDUAL");
  expect(docRemixes[1].docId).eqls(docId2);
  expect(docRemixes[1].activity.id).eqls(activityId2);
  expect(docRemixes[1].withLicenseCode).eq("CCDUAL");

  // owner 2 sees direct remix of activity 1 into 2
  docRemixes = (
    await getDocumentDirectRemixes({
      docIds: [docId1],
      loggedInUserId: ownerId2,
    })
  )[0].documentVersions.flatMap((v) => v.remixes);
  expect(docRemixes.length).eq(1);
  expect(docRemixes[0].docId).eqls(docId2);
  expect(docRemixes[0].activity.id).eqls(activityId2);
  expect(docRemixes[0].withLicenseCode).eq("CCDUAL");

  // owner3 sees activity 1, 2 and 3 in history of activity 4
  docHistory = (
    await getDocumentContributorHistories({
      docIds: [docId4],
      loggedInUserId: ownerId3,
    })
  )[0].contributorHistory;
  expect(docHistory.length).eq(3);
  expect(docHistory[0].prevDocId).eqls(docId3);
  expect(docHistory[0].prevDoc.document.activity.id).eqls(activityId3);
  expect(docHistory[0].withLicenseCode).eq("CCBYSA");
  expect(docHistory[1].prevDocId).eqls(docId2);
  expect(docHistory[1].prevDoc.document.activity.id).eqls(activityId2);
  expect(docHistory[1].withLicenseCode).eq("CCBYSA");
  expect(docHistory[2].prevDocId).eqls(docId1);
  expect(docHistory[2].prevDoc.document.activity.id).eqls(activityId1);
  expect(docHistory[2].withLicenseCode).eq("CCDUAL");

  // owner 3 sees activity 5, 4, 3 and 2 in remixes of activity 1
  docRemixes = (
    await getDocumentRemixes({
      docIds: [docId1],
      loggedInUserId: ownerId3,
    })
  )[0].documentVersions.flatMap((v) => v.remixes);
  expect(docRemixes.length).eq(4);
  expect(docRemixes[0].docId).eqls(docId5);
  expect(docRemixes[0].activity.id).eqls(activityId5);
  expect(docRemixes[0].withLicenseCode).eq("CCDUAL");
  expect(docRemixes[1].docId).eqls(docId4);
  expect(docRemixes[1].activity.id).eqls(activityId4);
  expect(docRemixes[1].withLicenseCode).eq("CCDUAL");
  expect(docRemixes[2].docId).eqls(docId3);
  expect(docRemixes[2].activity.id).eqls(activityId3);
  expect(docRemixes[2].withLicenseCode).eq("CCDUAL");
  expect(docRemixes[3].docId).eqls(docId2);
  expect(docRemixes[3].activity.id).eqls(activityId2);
  expect(docRemixes[3].withLicenseCode).eq("CCDUAL");

  // owner 3 sees direct remixes of activity 1 into 2 and 5
  docRemixes = (
    await getDocumentDirectRemixes({
      docIds: [docId1],
      loggedInUserId: ownerId3,
    })
  )[0].documentVersions.flatMap((v) => v.remixes);
  expect(docRemixes.length).eq(2);
  expect(docRemixes[0].docId).eqls(docId5);
  expect(docRemixes[0].activity.id).eqls(activityId5);
  expect(docRemixes[0].withLicenseCode).eq("CCDUAL");
  expect(docRemixes[1].docId).eqls(docId2);
  expect(docRemixes[1].activity.id).eqls(activityId2);
  expect(docRemixes[1].withLicenseCode).eq("CCDUAL");
});

test("get licenses", async () => {
  const cc_by_sa = await getLicense("CCBYSA");
  expect(cc_by_sa.name).eq("Creative Commons Attribution-ShareAlike 4.0");
  expect(cc_by_sa.imageURL).eq("/creative_commons_by_sa.png");
  expect(cc_by_sa.smallImageURL).eq("/creative_commons_by_sa_small.png");
  expect(cc_by_sa.licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );

  const cc_by_nc_sa = await getLicense("CCBYNCSA");
  expect(cc_by_nc_sa.name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
  );
  expect(cc_by_nc_sa.imageURL).eq("/creative_commons_by_nc_sa.png");
  expect(cc_by_nc_sa.smallImageURL).eq("/creative_commons_by_nc_sa_small.png");
  expect(cc_by_nc_sa.licenseURL).eq(
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  );

  const cc_dual = await getLicense("CCDUAL");
  expect(cc_dual.name).eq(
    "Dual license Creative Commons Attribution-ShareAlike 4.0 OR Attribution-NonCommercial-ShareAlike 4.0",
  );

  expect(cc_dual.composedOf[0].name).eq(
    "Creative Commons Attribution-ShareAlike 4.0",
  );
  expect(cc_dual.composedOf[0].imageURL).eq("/creative_commons_by_sa.png");
  expect(cc_dual.composedOf[0].smallImageURL).eq(
    "/creative_commons_by_sa_small.png",
  );
  expect(cc_dual.composedOf[0].licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );
  expect(cc_dual.composedOf[1].name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
  );
  expect(cc_dual.composedOf[1].imageURL).eq("/creative_commons_by_nc_sa.png");
  expect(cc_dual.composedOf[1].smallImageURL).eq(
    "/creative_commons_by_nc_sa_small.png",
  );
  expect(cc_dual.composedOf[1].licenseURL).eq(
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  );

  const all = await getAllLicenses();
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
    "Creative Commons Attribution-ShareAlike 4.0",
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
    "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
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
    "Dual license Creative Commons Attribution-ShareAlike 4.0 OR Attribution-NonCommercial-ShareAlike 4.0",
  );

  expect(activityData.license?.composedOf[0].code).eq("CCBYSA");
  expect(activityData.license?.composedOf[0].name).eq(
    "Creative Commons Attribution-ShareAlike 4.0",
  );
  expect(activityData.license?.composedOf[0].licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );
  expect(activityData.license?.composedOf[0].imageURL).eq(
    "/creative_commons_by_sa.png",
  );

  expect(activityData.license?.composedOf[1].code).eq("CCBYNCSA");
  expect(activityData.license?.composedOf[1].name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
  );
  expect(activityData.license?.composedOf[1].licenseURL).eq(
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  );
  expect(activityData.license?.composedOf[1].imageURL).eq(
    "/creative_commons_by_nc_sa.png",
  );
});
