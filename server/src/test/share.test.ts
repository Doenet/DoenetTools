import { expect, test } from "vitest";
import { createContent } from "../apis/activity";
import {
  getAllLicenses,
  getLicense,
  modifyContentSharedWith,
  setContentIsPublic,
  setContentLicense,
  shareContentWithEmail,
} from "../apis/share";
import { getContent, getActivityEditorData } from "../apis/activity_edit_view";
import { getMyContent } from "../apis/content_list";
import { moveContent } from "../apis/copy_move";
import { getDocumentRemixes, getDocumentDirectRemixes } from "../apis/remix";
import { updateUser } from "../apis/user";
import { createTestUser } from "./utils";

test.only("content in public folder is created as public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { id: publicFolderId } = await createContent(ownerId, "folder", null);

  await setContentLicense({
    contentId: publicFolderId,
    loggedInUserId: ownerId,
    licenseCode: "CCBYSA",
  });
  await setContentIsPublic({
    contentId: publicFolderId,
    isPublic: true,
    loggedInUserId: ownerId,
  });

  // create a folder and activity in public folder
  const { id: activityId } = await createContent(
    ownerId,
    "singleDoc",
    publicFolderId,
  );
  const { id: folderId } = await createContent(
    ownerId,
    "folder",
    publicFolderId,
  );

  const { content } = await getMyContent({
    parentId: publicFolderId,
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

test.only("content in shared folder is created shared", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user = await createTestUser();
  const userId = user.userId;
  const { isAdmin, isAnonymous, cardView, ...userFields } = user;

  const { id: publicFolderId } = await createContent(ownerId, "folder", null);

  await setContentLicense({
    contentId: publicFolderId,
    loggedInUserId: ownerId,
    licenseCode: "CCBYSA",
  });
  await modifyContentSharedWith({
    action: "share",
    loggedInUserId: ownerId,
    id: publicFolderId,
    users: [userId],
  });

  // create a folder and activity in public folder
  const { id: activityId } = await createContent(
    ownerId,
    "singleDoc",
    publicFolderId,
  );
  const { id: folderId } = await createContent(
    ownerId,
    "folder",
    publicFolderId,
  );

  const { content } = await getMyContent({
    parentId: publicFolderId,
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

test.only("if content has a public parent, cannot make it private", async () => {
  const { userId: ownerId } = await createTestUser();

  const { id: folderId } = await createContent(ownerId, "folder", null);
  await setContentLicense({
    contentId: folderId,
    loggedInUserId: ownerId,
    licenseCode: "CCBYNCSA",
  });
  await setContentIsPublic({
    contentId: folderId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // creating content inside a public folder make it public with same license
  const { id: activityId } = await createContent(
    ownerId,
    "singleDoc",
    folderId,
  );
  let activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
  });
  expect(activity.isPublic).eq(true);
  expect(activity.license!.code).eq("CCBYNCSA");

  // change license of content is OK
  await setContentLicense({
    contentId: activityId,
    loggedInUserId: ownerId,
    licenseCode: "CCDUAL",
  });
  activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
  });
  expect(activity.isPublic).eq(true);
  expect(activity.license!.code).eq("CCDUAL");

  // since have public parent, cannot make child private
  await expect(
    setContentIsPublic({
      contentId: activityId,
      loggedInUserId: ownerId,
      isPublic: false,
    }),
  ).rejects.toThrow("cannot make it private");

  // make parent private, activity becomes private

  await setContentIsPublic({
    contentId: folderId,
    loggedInUserId: ownerId,
    isPublic: false,
  });

  activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
  });
  expect(activity.isPublic).eq(false);

  // make the content public
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
  });
  expect(activity.isPublic).eq(true);

  // can make it private now
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: false,
  });
  activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
  });
  expect(activity.isPublic).eq(false);
});

// TODO: make test, if content has a parent that is shared with a user, cannot unshare with that user

test.only("making folder public/private also makes its content public/private", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { id: publicFolderId } = await createContent(ownerId, "folder", null);

  // create content in folder that will become public
  const { id: activity1Id } = await createContent(
    ownerId,
    "singleDoc",
    publicFolderId,
  );
  const { id: folder1Id } = await createContent(
    ownerId,
    "folder",
    publicFolderId,
  );
  const { id: folder2Id } = await createContent(ownerId, "folder", folder1Id);
  const { id: activity2Id } = await createContent(
    ownerId,
    "singleDoc",
    folder2Id,
  );

  let results = await getMyContent({
    parentId: publicFolderId,
    loggedInUserId: ownerId,
  });
  let content = results.content;

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isPublic).eqls(false);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(false);
  expect(content[1].license?.code).eqls("CCDUAL");

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  await setContentLicense({
    contentId: publicFolderId,
    loggedInUserId: ownerId,
    licenseCode: "CCBYSA",
  });
  await setContentIsPublic({
    contentId: publicFolderId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  results = await getMyContent({
    parentId: publicFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyContent({
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  await setContentIsPublic({
    contentId: publicFolderId,
    loggedInUserId: ownerId,
    isPublic: false,
  });

  results = await getMyContent({
    parentId: publicFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCBYSA");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(false);
  expect(content[1].license?.code).eq("CCBYSA");

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCBYSA");

  results = await getMyContent({
    parentId: folder2Id,
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

    const { id: sharedFolderId } = await createContent(ownerId, "folder", null);

    // create content in folder that will become shared
    const { id: activity1Id } = await createContent(
      ownerId,
      "folder",
      sharedFolderId,
    );
    const { id: folder1Id } = await createContent(
      ownerId,
      "folder",
      sharedFolderId,
    );
    const { id: folder2Id } = await createContent(ownerId, "folder", folder1Id);
    const { id: activity2Id } = await createContent(
      ownerId,
      "singleDoc",
      folder2Id,
    );

    let results = await getMyContent({
      parentId: sharedFolderId,
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

    results = await getMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);
    expect(content[0].license?.code).eq("CCDUAL");

    results = await getMyContent({
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);
    expect(content[0].license?.code).eq("CCDUAL");

    await shareContentWithEmail({
      id: sharedFolderId,
      loggedInUserId: ownerId,
      email: user2.email,
    });
    await shareContentWithEmail({
      id: sharedFolderId,
      loggedInUserId: ownerId,
      email: user1.email,
    });

    results = await getMyContent({
      parentId: sharedFolderId,
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

    results = await getMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields);
    expect(content[0].license?.code).eq("CCBYSA");

    results = await getMyContent({
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields);
    expect(content[0].license?.code).eq("CCBYSA");

    // unshare with user 1
    await modifyContentSharedWith({
      action: "unshare",
      id: sharedFolderId,
      loggedInUserId: ownerId,
      users: [user1Id],
    });

    results = await getMyContent({
      parentId: sharedFolderId,
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

    results = await getMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields2]);
    expect(content[0].license?.code).eq("CCBYSA");

    results = await getMyContent({
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields2]);
    expect(content[0].license?.code).eq("CCBYSA");

    // share middle folder with user3
    await modifyContentSharedWith({
      action: "share",
      id: folder2Id,
      loggedInUserId: ownerId,
      users: [user3Id],
    });

    results = await getMyContent({
      parentId: sharedFolderId,
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

    results = await getMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields23);
    expect(content[0].license?.code).eq("CCBYNCSA");

    results = await getMyContent({
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields23);
    expect(content[0].license?.code).eq("CCBYNCSA");

    // unshare with user 2
    await modifyContentSharedWith({
      action: "unshare",
      id: sharedFolderId,
      loggedInUserId: ownerId,
      users: [user2Id],
    });

    results = await getMyContent({
      parentId: sharedFolderId,
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

    results = await getMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields3]);
    expect(content[0].license?.code).eq("CCBYNCSA");

    results = await getMyContent({
      parentId: folder2Id,
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

  const { id: publicFolderId } = await createContent(ownerId, "folder", null);
  await setContentIsPublic({
    contentId: publicFolderId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // create to move into that folder
  const { id: activity1Id } = await createContent(ownerId, "singleDoc", null);
  const { id: folder1Id } = await createContent(ownerId, "folder", null);
  const { id: folder2Id } = await createContent(ownerId, "folder", folder1Id);
  const { id: activity2Id } = await createContent(
    ownerId,
    "singleDoc",
    folder2Id,
  );

  let results = await getMyContent({
    parentId: null,
    loggedInUserId: ownerId,
  });
  let content = results.content;

  expect(content[1].id).eqls(activity1Id);
  expect(content[1].isPublic).eq(false);
  expect(content[1].license?.code).eq("CCDUAL");
  expect(content[2].id).eqls(folder1Id);
  expect(content[2].isPublic).eq(false);
  expect(content[2].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  // move content into public folder
  await moveContent({
    id: activity1Id,
    desiredParentId: publicFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    id: folder1Id,
    desiredParentId: publicFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 1,
  });

  results = await getMyContent({
    parentId: publicFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCDUAL");

  // Create a private folder and move content into that folder.
  // The content stays public.

  const { id: privateFolderId } = await createContent(ownerId, "folder", null);

  await moveContent({
    id: activity1Id,
    desiredParentId: privateFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    id: folder1Id,
    desiredParentId: privateFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 1,
  });

  results = await getMyContent({
    parentId: privateFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCDUAL");
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

  const { id: sharedFolderId } = await createContent(ownerId, "folder", null);
  await modifyContentSharedWith({
    action: "share",
    id: sharedFolderId,
    loggedInUserId: ownerId,
    users: [userId],
  });

  // create to move into that folder
  const { id: activity1Id } = await createContent(ownerId, "singleDoc", null);
  const { id: folder1Id } = await createContent(ownerId, "folder", null);
  const { id: folder2Id } = await createContent(ownerId, "folder", folder1Id);
  const { id: activity2Id } = await createContent(
    ownerId,
    "singleDoc",
    folder2Id,
  );

  let results = await getMyContent({
    parentId: null,
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

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isShared).eq(false);
  expect(content[0].sharedWith).eqls([]);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder2Id,
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
    desiredParentId: sharedFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    id: folder1Id,
    desiredParentId: sharedFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 1,
  });

  results = await getMyContent({
    parentId: sharedFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields]);
  expect(content[1].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");

  // Create a private folder and move content into that folder.
  // The content stays shared.

  const { id: privateFolderId } = await createContent(ownerId, "folder", null);

  await moveContent({
    id: activity1Id,
    desiredParentId: privateFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    id: folder1Id,
    desiredParentId: privateFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 1,
  });

  results = await getMyContent({
    parentId: privateFolderId,
    loggedInUserId: ownerId,
  });
  content = results.content;

  expect(content[0].id).eqls(activity1Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields]);
  expect(content[1].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");
});

test("share with email throws error when no match", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user = await createTestUser();

  const otherEmail = `unique-${Date.now()}@example.com`;

  const { id: folderId } = await createContent(ownerId, "folder", null);
  const { id: activityId } = await createContent(ownerId, "singleDoc", null);

  await expect(
    shareContentWithEmail({
      id: activityId,
      loggedInUserId: ownerId,
      email: otherEmail,
    }),
  ).rejects.toThrow("User with email not found");

  await shareContentWithEmail({
    id: activityId,
    loggedInUserId: ownerId,
    email: user.email,
  });

  const { activity } = await getActivityEditorData(activityId, ownerId);
  expect(activity).toBeDefined();
  expect(activity!.sharedWith.map((obj) => obj.email)).eqls([user.email]);

  await expect(
    shareContentWithEmail({
      id: folderId,
      loggedInUserId: ownerId,
      email: otherEmail,
    }),
  ).rejects.toThrow("User with email not found");

  await shareContentWithEmail({
    id: folderId,
    loggedInUserId: ownerId,
    email: user.email,
  });

  expect(
    (
      await getMyContent({ parentId: folderId, loggedInUserId: ownerId })
    ).folder!.sharedWith.map((obj) => obj.email),
  ).eqls([user.email]);
});

test("share with email throws error when share with self", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user = await createTestUser();

  const { id: folderId } = await createContent(ownerId, "folder", null);
  const { id: activityId } = await createContent(ownerId, "singleDoc", null);

  await expect(
    shareContentWithEmail({
      id: activityId,
      loggedInUserId: ownerId,
      email: owner.email,
    }),
  ).rejects.toThrow("Cannot share with self");

  await shareContentWithEmail({
    id: activityId,
    loggedInUserId: ownerId,
    email: user.email,
  });
  const { activity } = await getActivityEditorData(activityId, ownerId);
  expect(activity).toBeDefined();
  expect(activity!.sharedWith.map((obj) => obj.email)).eqls([user.email]);

  await expect(
    shareContentWithEmail({
      id: folderId,
      loggedInUserId: ownerId,
      email: owner.email,
    }),
  ).rejects.toThrow("Cannot share with self");

  await shareContentWithEmail({
    id: folderId,
    loggedInUserId: ownerId,
    email: user.email,
  });

  expect(
    (
      await getMyContent({ parentId: folderId, loggedInUserId: ownerId })
    ).folder!.sharedWith.map((obj) => obj.email),
  ).eqls([user.email]);
});

test("contributor history shows only documents user can view", async () => {
  const ownerId1 = (await createTestUser()).userId;
  const ownerId2 = (await createTestUser()).userId;
  const ownerId3 = (await createTestUser()).userId;

  // create public activity 1 by owner 1
  const { activityId: activityId1, docId: docId1 } = await createContent(
    ownerId1,
    "singleDoc",
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
  expect(cc_by_sa.smallImageURL).eq("/by-sa-sm.png");
  expect(cc_by_sa.licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );

  const cc_by_nc_sa = await getLicense("CCBYNCSA");
  expect(cc_by_nc_sa.name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
  );
  expect(cc_by_nc_sa.imageURL).eq("/creative_commons_by_nc_sa.png");
  expect(cc_by_nc_sa.smallImageURL).eq("/by-nc-sa-sm.png");
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
  expect(cc_dual.composedOf[0].smallImageURL).eq("/by-sa-sm.png");
  expect(cc_dual.composedOf[0].licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );
  expect(cc_dual.composedOf[1].name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
  );
  expect(cc_dual.composedOf[1].imageURL).eq("/creative_commons_by_nc_sa.png");
  expect(cc_dual.composedOf[1].smallImageURL).eq("/by-nc-sa-sm.png");
  expect(cc_dual.composedOf[1].licenseURL).eq(
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  );

  const all = await getAllLicenses();
  expect(all.map((x) => x.code)).eqls(["CCDUAL", "CCBYSA", "CCBYNCSA"]);
});

test("set license to make public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { id: activityId } = await createContent(ownerId, "singleDoc", null);

  // make public with CCBYSA license
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  let { activity: activityData } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expect(activityData).toBeDefined();
  expect(activityData!.isPublic).eq(true);

  expect(activityData!.license?.code).eq("CCBYSA");
  expect(activityData!.license?.name).eq(
    "Creative Commons Attribution-ShareAlike 4.0",
  );
  expect(activityData!.license?.licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );
  expect(activityData!.license?.imageURL).eq("/creative_commons_by_sa.png");

  // make private
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: false,
  });
  ({ activity: activityData } = await getActivityEditorData(
    activityId,
    ownerId,
  ));
  expect(activityData).toBeDefined();
  expect(activityData!.isPublic).eq(false);

  // make public with CCBYNCSA license
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
    // licenseCode: "CCBYNCSA",
  });
  ({ activity: activityData } = await getActivityEditorData(
    activityId,
    ownerId,
  ));
  expect(activityData).toBeDefined();
  expect(activityData!.isPublic).eq(true);

  expect(activityData!.license?.code).eq("CCBYNCSA");
  expect(activityData!.license?.name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
  );
  expect(activityData!.license?.licenseURL).eq(
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  );
  expect(activityData!.license?.imageURL).eq("/creative_commons_by_nc_sa.png");

  // switch license to dual
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: false,
    // licenseCode: "CCDUAL",
  });

  ({ activity: activityData } = await getActivityEditorData(
    activityId,
    ownerId,
  ));
  expect(activityData!.isPublic).eq(true);

  expect(activityData!.license?.code).eq("CCDUAL");
  expect(activityData!.license?.name).eq(
    "Dual license Creative Commons Attribution-ShareAlike 4.0 OR Attribution-NonCommercial-ShareAlike 4.0",
  );

  expect(activityData!.license?.composedOf[0].code).eq("CCBYSA");
  expect(activityData!.license?.composedOf[0].name).eq(
    "Creative Commons Attribution-ShareAlike 4.0",
  );
  expect(activityData!.license?.composedOf[0].licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );
  expect(activityData!.license?.composedOf[0].imageURL).eq(
    "/creative_commons_by_sa.png",
  );

  expect(activityData!.license?.composedOf[1].code).eq("CCBYNCSA");
  expect(activityData!.license?.composedOf[1].name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
  );
  expect(activityData!.license?.composedOf[1].licenseURL).eq(
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  );
  expect(activityData!.license?.composedOf[1].imageURL).eq(
    "/creative_commons_by_nc_sa.png",
  );
});
