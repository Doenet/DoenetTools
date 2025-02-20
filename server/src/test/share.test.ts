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
import { copyContent, moveContent } from "../apis/copy_move";
import { updateUser } from "../apis/user";
import { createTestUser } from "./utils";
import {
  getActivityContributorHistory,
  getActivityRemixes,
} from "../apis/remix";

test("content in public folder is created as public", async () => {
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

test("content in shared folder is created shared", async () => {
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
    contentId: publicFolderId,
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

test("if content has a public parent, cannot make it private", async () => {
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
test("if content has a parent that is shared with a user, cannot unshare with that user", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();

  const { id: folderId } = await createContent(ownerId, "folder", null);
  await setContentLicense({
    contentId: folderId,
    loggedInUserId: ownerId,
    licenseCode: "CCBYNCSA",
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: folderId,
    loggedInUserId: ownerId,
    users: [userId1],
  });

  // creating content inside a shared folder make it shared with same people and with same license
  const { id: activityId } = await createContent(
    ownerId,
    "singleDoc",
    folderId,
  );
  let activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
    includeShareDetails: true,
  });
  expect(activity.isShared).eq(true);
  expect(activity.license!.code).eq("CCBYNCSA");
  expect(activity.sharedWith.map((s) => s.userId)).eqls([userId1]);

  // change license of content is OK
  await setContentLicense({
    contentId: activityId,
    loggedInUserId: ownerId,
    licenseCode: "CCDUAL",
  });
  activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
    includeShareDetails: true,
  });
  expect(activity.isShared).eq(true);
  expect(activity.license!.code).eq("CCDUAL");
  expect(activity.sharedWith.map((s) => s.userId)).eqls([userId1]);

  // since have parent is shared with userId1, cannot unshare it with userId1
  await expect(
    modifyContentSharedWith({
      action: "unshare",
      contentId: activityId,
      loggedInUserId: ownerId,
      users: [userId1],
    }),
  ).rejects.toThrow("cannot stop sharing with that user");

  // can share and unshare with userId2
  await modifyContentSharedWith({
    action: "share",
    contentId: activityId,
    loggedInUserId: ownerId,
    users: [userId2],
  });
  activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
    includeShareDetails: true,
  });
  expect(activity.isShared).eq(true);
  expect(activity.license!.code).eq("CCDUAL");
  expect(activity.sharedWith.map((s) => s.userId)).eqls([userId1, userId2]);

  await modifyContentSharedWith({
    action: "unshare",
    contentId: activityId,
    loggedInUserId: ownerId,
    users: [userId2],
  });
  activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
    includeShareDetails: true,
  });
  expect(activity.isShared).eq(true);
  expect(activity.license!.code).eq("CCDUAL");
  expect(activity.sharedWith.map((s) => s.userId)).eqls([userId1]);

  // unshare parent with userId1, activity is unshared with userId1
  await modifyContentSharedWith({
    action: "unshare",
    contentId: folderId,
    loggedInUserId: ownerId,
    users: [userId1],
  });

  activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
  });
  expect(activity.isShared).eq(false);
  expect(activity.license!.code).eq("CCDUAL");
  expect(activity.sharedWith).eqls([]);

  // share the content with userId1
  await modifyContentSharedWith({
    action: "share",
    contentId: activityId,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
    includeShareDetails: true,
  });
  expect(activity.isShared).eq(true);
  expect(activity.license!.code).eq("CCDUAL");
  expect(activity.sharedWith.map((s) => s.userId)).eqls([userId1]);

  // can now unshare it with userId1
  await modifyContentSharedWith({
    action: "unshare",
    contentId: activityId,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  activity = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
    includeShareDetails: true,
  });
  expect(activity.isShared).eq(false);
  expect(activity.license!.code).eq("CCDUAL");
  expect(activity.sharedWith).eqls([]);
});

test("making folder public/private also makes its content public/private", async () => {
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
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(false);

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(false);

  results = await getMyContent({
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isPublic).eq(false);

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
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(true);

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(true);

  results = await getMyContent({
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isPublic).eq(true);

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
  expect(content[1].id).eqls(folder1Id);
  expect(content[1].isPublic).eq(false);

  results = await getMyContent({
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(folder2Id);
  expect(content[0].isPublic).eq(false);

  results = await getMyContent({
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  content = results.content;
  expect(content[0].id).eqls(activity2Id);
  expect(content[0].isPublic).eq(false);
});

test(
  "sharing/unsharing a folder also shares/unshares its content",
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
    expect(content[1].id).eqls(folder1Id);
    expect(content[1].isShared).eq(false);
    expect(content[1].sharedWith).eqls([]);

    results = await getMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);

    results = await getMyContent({
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);

    await shareContentWithEmail({
      contentId: sharedFolderId,
      loggedInUserId: ownerId,
      email: user2.email,
    });
    await shareContentWithEmail({
      contentId: sharedFolderId,
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
    expect(content[1].id).eqls(folder1Id);
    expect(content[1].isShared).eq(true);
    expect(content[1].sharedWith).eqls(sharedUserFields);

    results = await getMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields);

    results = await getMyContent({
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields);

    // unshare with user 1
    await modifyContentSharedWith({
      action: "unshare",
      contentId: sharedFolderId,
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
    expect(content[1].id).eqls(folder1Id);
    expect(content[1].isShared).eq(true);
    expect(content[1].sharedWith).eqls([userFields2]);

    results = await getMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields2]);

    results = await getMyContent({
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields2]);

    // share middle folder with user3
    await modifyContentSharedWith({
      action: "share",
      contentId: folder2Id,
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
    expect(content[1].id).eqls(folder1Id);
    expect(content[1].isShared).eq(true);
    expect(content[1].sharedWith).eqls([userFields2]);

    results = await getMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields23);

    results = await getMyContent({
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields23);

    // unshare with user 2
    await modifyContentSharedWith({
      action: "unshare",
      contentId: sharedFolderId,
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
    expect(content[1].id).eqls(folder1Id);
    expect(content[1].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);

    results = await getMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields3]);

    results = await getMyContent({
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    content = results.content;
    expect(content[0].id).eqls(activity2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields3]);
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
    contentId: sharedFolderId,
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
      contentId: activityId,
      loggedInUserId: ownerId,
      email: otherEmail,
    }),
  ).rejects.toThrow("User with email not found");

  await shareContentWithEmail({
    contentId: activityId,
    loggedInUserId: ownerId,
    email: user.email,
  });

  const { activity } = await getActivityEditorData(activityId, ownerId);
  expect(activity).toBeDefined();
  expect(activity!.sharedWith.map((obj) => obj.email)).eqls([user.email]);

  await expect(
    shareContentWithEmail({
      contentId: folderId,
      loggedInUserId: ownerId,
      email: otherEmail,
    }),
  ).rejects.toThrow("User with email not found");

  await shareContentWithEmail({
    contentId: folderId,
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
      contentId: activityId,
      loggedInUserId: ownerId,
      email: owner.email,
    }),
  ).rejects.toThrow("Cannot share with self");

  await shareContentWithEmail({
    contentId: activityId,
    loggedInUserId: ownerId,
    email: user.email,
  });
  const { activity } = await getActivityEditorData(activityId, ownerId);
  expect(activity).toBeDefined();
  expect(activity!.sharedWith.map((obj) => obj.email)).eqls([user.email]);

  await expect(
    shareContentWithEmail({
      contentId: folderId,
      loggedInUserId: ownerId,
      email: owner.email,
    }),
  ).rejects.toThrow("Cannot share with self");

  await shareContentWithEmail({
    contentId: folderId,
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
  const { id: activityId1 } = await createContent(ownerId1, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityId1,
    loggedInUserId: ownerId1,
    isPublic: true,
  });

  // owner 2 copies activity 1 to activity 2 and shares it with owner 3
  const [activityId2] = await copyContent(activityId1, ownerId2, null);
  await setContentLicense({
    contentId: activityId2,
    loggedInUserId: ownerId2,
    licenseCode: "CCBYSA",
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityId2,
    loggedInUserId: ownerId2,
    users: [ownerId3],
  });

  // owner 3 copies activity 2 to activity 3, and then copies that to public activity 4
  const [activityId3] = await copyContent(activityId2, ownerId3, null);
  const [activityId4] = await copyContent(activityId3, ownerId3, null);
  await setContentIsPublic({
    contentId: activityId4,
    loggedInUserId: ownerId3,
    isPublic: true,
  });

  // owner 3 copies activity 1 to activity 5 and shares it with owner 1
  const [activityId5] = await copyContent(activityId1, ownerId3, null);
  await setContentLicense({
    contentId: activityId5,
    loggedInUserId: ownerId3,
    licenseCode: "CCBYNCSA",
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityId5,
    loggedInUserId: ownerId3,
    users: [ownerId1],
  });

  // owner1 just sees activity 1 in history of activity 4
  let activityHistory = (
    await getActivityContributorHistory({
      activityId: activityId4,
      loggedInUserId: ownerId1,
    })
  ).contributorHistory;
  expect(activityHistory.length).eq(1);
  expect(activityHistory[0].prevActivityId).eqls(activityId1);
  expect(activityHistory[0].withLicenseCode).eq("CCDUAL");

  // owner 1 just sees activity 4 and 5 in remixes of activity 1
  let activityRemixes = (
    await getActivityRemixes({
      activityId: activityId1,
      loggedInUserId: ownerId1,
    })
  ).activityRevisions.flatMap((v) => v.remixes);
  expect(activityRemixes.length).eq(2);
  expect(activityRemixes[0].activityId).eqls(activityId5);
  expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");
  expect(activityRemixes[1].activityId).eqls(activityId4);
  expect(activityRemixes[1].withLicenseCode).eq("CCDUAL");

  // owner 1 just sees direct remix from activity 1 into activity 5
  activityRemixes = (
    await getActivityRemixes({
      activityId: activityId1,
      loggedInUserId: ownerId1,
      directRemixesOnly: true,
    })
  ).activityRevisions.flatMap((v) => v.remixes);
  expect(activityRemixes.length).eq(1);
  expect(activityRemixes[0].activityId).eqls(activityId5);
  expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");

  // owner2 just sees activity 1 and 2 in history of activity 4
  activityHistory = (
    await getActivityContributorHistory({
      activityId: activityId4,
      loggedInUserId: ownerId2,
    })
  ).contributorHistory;
  expect(activityHistory.length).eq(2);
  expect(activityHistory[0].prevActivityId).eqls(activityId2);
  expect(activityHistory[0].withLicenseCode).eq("CCBYSA");
  expect(activityHistory[1].prevActivityId).eqls(activityId1);
  expect(activityHistory[1].withLicenseCode).eq("CCDUAL");

  // owner 2 just sees activity 4 and 2 in remixes of activity 1
  activityRemixes = (
    await getActivityRemixes({
      activityId: activityId1,
      loggedInUserId: ownerId2,
    })
  ).activityRevisions.flatMap((v) => v.remixes);
  expect(activityRemixes.length).eq(2);
  expect(activityRemixes[0].activityId).eqls(activityId4);
  expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");
  expect(activityRemixes[1].activityId).eqls(activityId2);
  expect(activityRemixes[1].withLicenseCode).eq("CCDUAL");

  // owner 2 sees direct remix of activity 1 into 2
  activityRemixes = (
    await getActivityRemixes({
      activityId: activityId1,
      loggedInUserId: ownerId2,
      directRemixesOnly: true,
    })
  ).activityRevisions.flatMap((v) => v.remixes);
  expect(activityRemixes.length).eq(1);
  expect(activityRemixes[0].activityId).eqls(activityId2);
  expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");

  // owner3 sees activity 1, 2 and 3 in history of activity 4
  activityHistory = (
    await getActivityContributorHistory({
      activityId: activityId4,
      loggedInUserId: ownerId3,
    })
  ).contributorHistory;
  expect(activityHistory.length).eq(3);
  expect(activityHistory[0].prevActivityId).eqls(activityId3);
  expect(activityHistory[0].withLicenseCode).eq("CCBYSA");
  expect(activityHistory[1].prevActivityId).eqls(activityId2);
  expect(activityHistory[1].withLicenseCode).eq("CCBYSA");
  expect(activityHistory[2].prevActivityId).eqls(activityId1);
  expect(activityHistory[2].withLicenseCode).eq("CCDUAL");

  // owner 3 sees activity 5, 4, 3 and 2 in remixes of activity 1
  activityRemixes = (
    await getActivityRemixes({
      activityId: activityId1,
      loggedInUserId: ownerId3,
    })
  ).activityRevisions.flatMap((v) => v.remixes);
  expect(activityRemixes.length).eq(4);
  expect(activityRemixes[0].activityId).eqls(activityId5);
  expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");
  expect(activityRemixes[1].activityId).eqls(activityId4);
  expect(activityRemixes[1].withLicenseCode).eq("CCDUAL");
  expect(activityRemixes[2].activityId).eqls(activityId3);
  expect(activityRemixes[2].withLicenseCode).eq("CCDUAL");
  expect(activityRemixes[3].activityId).eqls(activityId2);
  expect(activityRemixes[3].withLicenseCode).eq("CCDUAL");

  // owner 3 sees direct remixes of activity 1 into 2 and 5
  activityRemixes = (
    await getActivityRemixes({
      activityId: activityId1,
      loggedInUserId: ownerId3,
      directRemixesOnly: true,
    })
  ).activityRevisions.flatMap((v) => v.remixes);
  expect(activityRemixes.length).eq(2);
  expect(activityRemixes[0].activityId).eqls(activityId5);
  expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");
  expect(activityRemixes[1].activityId).eqls(activityId2);
  expect(activityRemixes[1].withLicenseCode).eq("CCDUAL");
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
  await setContentLicense({
    contentId: activityId,
    loggedInUserId: ownerId,
    licenseCode: "CCBYSA",
  });
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
  await setContentLicense({
    contentId: activityId,
    loggedInUserId: ownerId,
    licenseCode: "CCBYNCSA",
  });
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
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
  await setContentLicense({
    contentId: activityId,
    loggedInUserId: ownerId,
    licenseCode: "CCDUAL",
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
