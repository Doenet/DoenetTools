import { expect, test } from "vitest";
import { createContent } from "../query/activity";
import {
  getAllLicenses,
  getLicense,
  modifyContentSharedWith,
  setContentIsPublic,
  setContentLicense,
  shareContentWithEmail,
} from "../query/share";
import { getContent, getActivityEditorData } from "../query/activity_edit_view";
import { getMyContent } from "../query/content_list";
import { copyContent, moveContent } from "../query/copy_move";
import { updateUser } from "../query/user";
import { createTestUser } from "./utils";
import { getRemixedFrom, getRemixes } from "../query/remix";

test("content in public folder is created as public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { contentId: publicFolderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });

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
  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: publicFolderId,
  });
  const { contentId: folderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: publicFolderId,
  });

  const result = await getMyContent({
    ownerId,
    parentId: publicFolderId,
    loggedInUserId: ownerId,
  });

  if (result.notMe) {
    throw Error("shouldn't happen");
  }
  const content = result.content;
  expect(content.length).eq(2);

  expect(content[0].contentId).eqls(contentId);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCBYSA");

  expect(content[1].contentId).eqls(folderId);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCBYSA");
});

test("content in shared folder is created shared", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user = await createTestUser();
  const userId = user.userId;
  const { isAdmin, isAnonymous, cardView, ...userFields } = user;

  const { contentId: publicFolderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });

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
  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: publicFolderId,
  });
  const { contentId: folderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: publicFolderId,
  });

  const result = await getMyContent({
    ownerId,
    parentId: publicFolderId,
    loggedInUserId: ownerId,
  });
  if (result.notMe) {
    throw Error("shouldn't happen");
  }
  const content = result.content;
  expect(content.length).eq(2);

  expect(content[0].contentId).eqls(contentId);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCBYSA");

  expect(content[1].contentId).eqls(folderId);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields]);
  expect(content[1].license?.code).eq("CCBYSA");
});

test("if content has a public parent, cannot make it private", async () => {
  const { userId: ownerId } = await createTestUser();

  const { contentId: folderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
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
  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folderId,
  });
  let activity = await getContent({
    contentId,
    loggedInUserId: ownerId,
  });
  expect(activity.isPublic).eq(true);
  expect(activity.license!.code).eq("CCBYNCSA");

  // change license of content is OK
  await setContentLicense({
    contentId,
    loggedInUserId: ownerId,
    licenseCode: "CCDUAL",
  });
  activity = await getContent({
    contentId,
    loggedInUserId: ownerId,
  });
  expect(activity.isPublic).eq(true);
  expect(activity.license!.code).eq("CCDUAL");

  // since have public parent, cannot make child private
  await expect(
    setContentIsPublic({
      contentId,
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
    contentId,
    loggedInUserId: ownerId,
  });
  expect(activity.isPublic).eq(false);

  // make the content public
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  activity = await getContent({
    contentId,
    loggedInUserId: ownerId,
  });
  expect(activity.isPublic).eq(true);

  // can make it private now
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: false,
  });
  activity = await getContent({
    contentId,
    loggedInUserId: ownerId,
  });
  expect(activity.isPublic).eq(false);
});

// TODO: make test, if content has a parent that is shared with a user, cannot unshare with that user
test("if content has a parent that is shared with a user, cannot unshare with that user", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();

  const { contentId: folderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
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
  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folderId,
  });
  let activity = await getContent({
    contentId,
    loggedInUserId: ownerId,
    includeShareDetails: true,
  });
  expect(activity.isShared).eq(true);
  expect(activity.license!.code).eq("CCBYNCSA");
  expect(activity.sharedWith.map((s) => s.userId)).eqls([userId1]);

  // change license of content is OK
  await setContentLicense({
    contentId,
    loggedInUserId: ownerId,
    licenseCode: "CCDUAL",
  });
  activity = await getContent({
    contentId,
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
      contentId,
      loggedInUserId: ownerId,
      users: [userId1],
    }),
  ).rejects.toThrow("cannot stop sharing with that user");

  // can share and unshare with userId2
  await modifyContentSharedWith({
    action: "share",
    contentId,
    loggedInUserId: ownerId,
    users: [userId2],
  });
  activity = await getContent({
    contentId,
    loggedInUserId: ownerId,
    includeShareDetails: true,
  });
  expect(activity.isShared).eq(true);
  expect(activity.license!.code).eq("CCDUAL");
  expect(activity.sharedWith.map((s) => s.userId)).eqls([userId1, userId2]);

  await modifyContentSharedWith({
    action: "unshare",
    contentId,
    loggedInUserId: ownerId,
    users: [userId2],
  });
  activity = await getContent({
    contentId,
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
    contentId,
    loggedInUserId: ownerId,
  });
  expect(activity.isShared).eq(false);
  expect(activity.license!.code).eq("CCDUAL");
  expect(activity.sharedWith).eqls([]);

  // share the content with userId1
  await modifyContentSharedWith({
    action: "share",
    contentId,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  activity = await getContent({
    contentId,
    loggedInUserId: ownerId,
    includeShareDetails: true,
  });
  expect(activity.isShared).eq(true);
  expect(activity.license!.code).eq("CCDUAL");
  expect(activity.sharedWith.map((s) => s.userId)).eqls([userId1]);

  // can now unshare it with userId1
  await modifyContentSharedWith({
    action: "unshare",
    contentId,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  activity = await getContent({
    contentId,
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

  const { contentId: publicFolderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });

  // create content in folder that will become public
  const { contentId: activity1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: publicFolderId,
  });
  const { contentId: folder1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: publicFolderId,
  });
  const { contentId: folder2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: folder1Id,
  });
  const { contentId: activity2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder2Id,
  });

  let results = await getMyContent({
    ownerId,
    parentId: publicFolderId,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  let content = results.content;

  expect(content[0].contentId).eqls(activity1Id);
  expect(content[0].isPublic).eqls(false);
  expect(content[1].contentId).eqls(folder1Id);
  expect(content[1].isPublic).eq(false);

  results = await getMyContent({
    ownerId,
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(folder2Id);
  expect(content[0].isPublic).eq(false);

  results = await getMyContent({
    ownerId,
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(activity2Id);
  expect(content[0].isPublic).eq(false);

  await setContentIsPublic({
    contentId: publicFolderId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  results = await getMyContent({
    ownerId,
    parentId: publicFolderId,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;

  expect(content[0].contentId).eqls(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[1].contentId).eqls(folder1Id);
  expect(content[1].isPublic).eq(true);

  results = await getMyContent({
    ownerId,
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(folder2Id);
  expect(content[0].isPublic).eq(true);

  results = await getMyContent({
    ownerId,
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(activity2Id);
  expect(content[0].isPublic).eq(true);

  await setContentIsPublic({
    contentId: publicFolderId,
    loggedInUserId: ownerId,
    isPublic: false,
  });

  results = await getMyContent({
    ownerId,
    parentId: publicFolderId,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;

  expect(content[0].contentId).eqls(activity1Id);
  expect(content[0].isPublic).eq(false);
  expect(content[1].contentId).eqls(folder1Id);
  expect(content[1].isPublic).eq(false);

  results = await getMyContent({
    ownerId,
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(folder2Id);
  expect(content[0].isPublic).eq(false);

  results = await getMyContent({
    ownerId,
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(activity2Id);
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
      loggedInUserId: user1Id,
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
      loggedInUserId: user2Id,
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
      loggedInUserId: user3Id,
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

    const { contentId: sharedFolderId } = await createContent({
      loggedInUserId: ownerId,
      contentType: "folder",
      parentId: null,
    });

    // create content in folder that will become shared
    const { contentId: activity1Id } = await createContent({
      loggedInUserId: ownerId,
      contentType: "folder",
      parentId: sharedFolderId,
    });
    const { contentId: folder1Id } = await createContent({
      loggedInUserId: ownerId,
      contentType: "folder",
      parentId: sharedFolderId,
    });
    const { contentId: folder2Id } = await createContent({
      loggedInUserId: ownerId,
      contentType: "folder",
      parentId: folder1Id,
    });
    const { contentId: activity2Id } = await createContent({
      loggedInUserId: ownerId,
      contentType: "singleDoc",
      parentId: folder2Id,
    });

    let results = await getMyContent({
      ownerId,
      parentId: sharedFolderId,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    let content = results.content;

    expect(content[0].contentId).eqls(activity1Id);
    expect(content[0].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);
    expect(content[1].contentId).eqls(folder1Id);
    expect(content[1].isShared).eq(false);
    expect(content[1].sharedWith).eqls([]);

    results = await getMyContent({
      ownerId,
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;
    expect(content[0].contentId).eqls(folder2Id);
    expect(content[0].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);

    results = await getMyContent({
      ownerId,
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;
    expect(content[0].contentId).eqls(activity2Id);
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
      ownerId,
      parentId: sharedFolderId,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;

    expect(content[0].contentId).eqls(activity1Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields);
    expect(content[1].contentId).eqls(folder1Id);
    expect(content[1].isShared).eq(true);
    expect(content[1].sharedWith).eqls(sharedUserFields);

    results = await getMyContent({
      ownerId,
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;
    expect(content[0].contentId).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields);

    results = await getMyContent({
      ownerId,
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;
    expect(content[0].contentId).eqls(activity2Id);
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
      ownerId,
      parentId: sharedFolderId,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;

    expect(content[0].contentId).eqls(activity1Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields2]);
    expect(content[1].contentId).eqls(folder1Id);
    expect(content[1].isShared).eq(true);
    expect(content[1].sharedWith).eqls([userFields2]);

    results = await getMyContent({
      ownerId,
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;
    expect(content[0].contentId).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields2]);

    results = await getMyContent({
      ownerId,
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;
    expect(content[0].contentId).eqls(activity2Id);
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
      ownerId,
      parentId: sharedFolderId,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;

    expect(content[0].contentId).eqls(activity1Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields2]);
    expect(content[1].contentId).eqls(folder1Id);
    expect(content[1].isShared).eq(true);
    expect(content[1].sharedWith).eqls([userFields2]);

    results = await getMyContent({
      ownerId,
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;
    expect(content[0].contentId).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls(sharedUserFields23);

    results = await getMyContent({
      ownerId,
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;
    expect(content[0].contentId).eqls(activity2Id);
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
      ownerId,
      parentId: sharedFolderId,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;

    expect(content[0].contentId).eqls(activity1Id);
    expect(content[0].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);
    expect(content[1].contentId).eqls(folder1Id);
    expect(content[1].isShared).eq(false);
    expect(content[0].sharedWith).eqls([]);

    results = await getMyContent({
      ownerId,
      parentId: folder1Id,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;
    expect(content[0].contentId).eqls(folder2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields3]);

    results = await getMyContent({
      ownerId,
      parentId: folder2Id,
      loggedInUserId: ownerId,
    });
    if (results.notMe) {
      throw Error("shouldn't happen");
    }
    content = results.content;
    expect(content[0].contentId).eqls(activity2Id);
    expect(content[0].isShared).eq(true);
    expect(content[0].sharedWith).eqls([userFields3]);
  },
);

test("moving content into public folder makes it public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { contentId: publicFolderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  await setContentIsPublic({
    contentId: publicFolderId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // create to move into that folder
  const { contentId: activity1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  const { contentId: folder1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  const { contentId: folder2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: folder1Id,
  });
  const { contentId: activity2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder2Id,
  });

  let results = await getMyContent({
    ownerId,
    parentId: null,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  let content = results.content;

  expect(content[1].contentId).eqls(activity1Id);
  expect(content[1].isPublic).eq(false);
  expect(content[1].license?.code).eq("CCDUAL");
  expect(content[2].contentId).eqls(folder1Id);
  expect(content[2].isPublic).eq(false);
  expect(content[2].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(folder2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(activity2Id);
  expect(content[0].isPublic).eq(false);
  expect(content[0].license?.code).eq("CCDUAL");

  // move content into public folder
  await moveContent({
    contentId: activity1Id,
    parentId: publicFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    contentId: folder1Id,
    parentId: publicFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 1,
  });

  results = await getMyContent({
    ownerId,
    parentId: publicFolderId,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;

  expect(content[0].contentId).eqls(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].contentId).eqls(folder1Id);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(folder2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(activity2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCDUAL");

  // Create a private folder and move content into that folder.
  // The content stays public.

  const { contentId: privateFolderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });

  await moveContent({
    contentId: activity1Id,
    parentId: privateFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    contentId: folder1Id,
    parentId: privateFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 1,
  });

  results = await getMyContent({
    ownerId,
    parentId: privateFolderId,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;

  expect(content[0].contentId).eqls(activity1Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].contentId).eqls(folder1Id);
  expect(content[1].isPublic).eq(true);
  expect(content[1].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(folder2Id);
  expect(content[0].isPublic).eq(true);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(activity2Id);
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

  const { contentId: sharedFolderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: sharedFolderId,
    loggedInUserId: ownerId,
    users: [userId],
  });

  // create to move into that folder
  const { contentId: activity1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  const { contentId: folder1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  const { contentId: folder2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: folder1Id,
  });
  const { contentId: activity2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder2Id,
  });

  let results = await getMyContent({
    ownerId,
    parentId: null,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  let content = results.content;

  expect(content[1].contentId).eqls(activity1Id);
  expect(content[1].isShared).eq(false);
  expect(content[1].sharedWith).eqls([]);
  expect(content[1].license?.code).eq("CCDUAL");
  expect(content[2].contentId).eqls(folder1Id);
  expect(content[2].isShared).eq(false);
  expect(content[2].sharedWith).eqls([]);
  expect(content[2].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(folder2Id);
  expect(content[0].isShared).eq(false);
  expect(content[0].sharedWith).eqls([]);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(activity2Id);
  expect(content[0].isShared).eq(false);
  expect(content[0].sharedWith).eqls([]);
  expect(content[0].license?.code).eq("CCDUAL");

  // move content into shared folder
  await moveContent({
    contentId: activity1Id,
    parentId: sharedFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    contentId: folder1Id,
    parentId: sharedFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 1,
  });

  results = await getMyContent({
    ownerId,
    parentId: sharedFolderId,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;

  expect(content[0].contentId).eqls(activity1Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].contentId).eqls(folder1Id);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields]);
  expect(content[1].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(activity2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");

  // Create a private folder and move content into that folder.
  // The content stays shared.

  const { contentId: privateFolderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });

  await moveContent({
    contentId: activity1Id,
    parentId: privateFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 0,
  });
  await moveContent({
    contentId: folder1Id,
    parentId: privateFolderId,
    loggedInUserId: ownerId,
    desiredPosition: 1,
  });

  results = await getMyContent({
    ownerId,
    parentId: privateFolderId,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;

  expect(content[0].contentId).eqls(activity1Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");
  expect(content[1].contentId).eqls(folder1Id);
  expect(content[1].isShared).eq(true);
  expect(content[1].sharedWith).eqls([userFields]);
  expect(content[1].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder1Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(folder2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");

  results = await getMyContent({
    ownerId,
    parentId: folder2Id,
    loggedInUserId: ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  content = results.content;
  expect(content[0].contentId).eqls(activity2Id);
  expect(content[0].isShared).eq(true);
  expect(content[0].sharedWith).eqls([userFields]);
  expect(content[0].license?.code).eq("CCDUAL");
});

test("share with email throws error when no match", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user = await createTestUser();

  const otherEmail = `unique-${Date.now()}@example.com`;

  const { contentId: folderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  await expect(
    shareContentWithEmail({
      contentId,
      loggedInUserId: ownerId,
      email: otherEmail,
    }),
  ).rejects.toThrow("User with email not found");

  await shareContentWithEmail({
    contentId,
    loggedInUserId: ownerId,
    email: user.email,
  });

  const { activity } = await getActivityEditorData({
    contentId,
    loggedInUserId: ownerId,
  });
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

  const results = await getMyContent({
    parentId: folderId,
    loggedInUserId: ownerId,
    ownerId,
  });
  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  expect(results.parent!.sharedWith.map((obj) => obj.email)).eqls([user.email]);
});

test("share with email throws error when share with self", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user = await createTestUser();

  const { contentId: folderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  await expect(
    shareContentWithEmail({
      contentId,
      loggedInUserId: ownerId,
      email: owner.email,
    }),
  ).rejects.toThrow("Cannot share with self");

  await shareContentWithEmail({
    contentId,
    loggedInUserId: ownerId,
    email: user.email,
  });
  const { activity } = await getActivityEditorData({
    contentId,
    loggedInUserId: ownerId,
  });
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

  const results = await getMyContent({
    parentId: folderId,
    loggedInUserId: ownerId,
    ownerId,
  });

  if (results.notMe) {
    throw Error("shouldn't happen");
  }
  expect(results.parent!.sharedWith.map((obj) => obj.email)).eqls([user.email]);
});

test("remixed from and remixes show only activities user can view", async () => {
  const ownerId1 = (await createTestUser()).userId;
  const ownerId2 = (await createTestUser()).userId;
  const ownerId3 = (await createTestUser()).userId;

  // create public activity 1 by owner 1
  const { contentId: contentId1 } = await createContent({
    loggedInUserId: ownerId1,
    contentType: "singleDoc",
    parentId: null,
  });
  await setContentIsPublic({
    contentId: contentId1,
    loggedInUserId: ownerId1,
    isPublic: true,
  });

  // owner 2 copies activity 1 to activity 2 and shares it with owner 3
  const {
    newContentIds: [contentId2],
  } = await copyContent({
    contentIds: [contentId1],
    loggedInUserId: ownerId2,
    parentId: null,
  });
  await setContentLicense({
    contentId: contentId2,
    loggedInUserId: ownerId2,
    licenseCode: "CCBYSA",
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: contentId2,
    loggedInUserId: ownerId2,
    users: [ownerId3],
  });

  // owner 3 copies activity 2 to activity 3, and then copies that to public activity 4
  const {
    newContentIds: [contentId3],
  } = await copyContent({
    contentIds: [contentId2],
    loggedInUserId: ownerId3,
    parentId: null,
  });
  const {
    newContentIds: [contentId4],
  } = await copyContent({
    contentIds: [contentId3],
    loggedInUserId: ownerId3,
    parentId: null,
  });
  await setContentIsPublic({
    contentId: contentId4,
    loggedInUserId: ownerId3,
    isPublic: true,
  });

  // owner 3 copies activity 1 to activity 5 and shares it with owner 1
  const {
    newContentIds: [contentId5],
  } = await copyContent({
    contentIds: [contentId1],
    loggedInUserId: ownerId3,
    parentId: null,
  });
  await setContentLicense({
    contentId: contentId5,
    loggedInUserId: ownerId3,
    licenseCode: "CCBYNCSA",
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: contentId5,
    loggedInUserId: ownerId3,
    users: [ownerId1],
  });

  // owner1 just sees activity 1 in remixed from of activity 4
  let remixedFrom = (
    await getRemixedFrom({
      contentId: contentId4,
      loggedInUserId: ownerId1,
    })
  ).remixedFrom;
  expect(remixedFrom.length).eq(1);
  expect(remixedFrom[0].originContent.contentId).eqls(contentId1);
  expect(remixedFrom[0].withLicenseCode).eq("CCDUAL");

  // owner 1 just sees activity 4 and 5 in remixes of activity 1
  let activityRemixes = (
    await getRemixes({
      contentId: contentId1,
      loggedInUserId: ownerId1,
    })
  ).remixes;
  expect(activityRemixes.length).eq(2);
  expect(activityRemixes[0].remixContent.contentId).eqls(contentId5);
  expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");
  expect(activityRemixes[1].remixContent.contentId).eqls(contentId4);
  expect(activityRemixes[1].withLicenseCode).eq("CCDUAL");

  // // owner 1 just sees direct remix from activity 1 into activity 5
  // activityRemixes = (
  //   await getRemixes({
  //     contentId: contentId1,
  //     loggedInUserId: ownerId1,
  //     directRemixesOnly: true,
  //   })
  // ).remixes;
  // expect(activityRemixes.length).eq(1);
  // expect(activityRemixes[0].remixContent.contentId).eqls(contentId5);
  // expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");

  // owner2 just sees activity 1 and 2 in remixed from of activity 4
  remixedFrom = (
    await getRemixedFrom({
      contentId: contentId4,
      loggedInUserId: ownerId2,
    })
  ).remixedFrom;
  expect(remixedFrom.length).eq(2);
  expect(remixedFrom[0].originContent.contentId).eqls(contentId2);
  expect(remixedFrom[0].withLicenseCode).eq("CCBYSA");
  expect(remixedFrom[1].originContent.contentId).eqls(contentId1);
  expect(remixedFrom[1].withLicenseCode).eq("CCDUAL");

  // owner 2 just sees activity 4 and 2 in remixes of activity 1
  activityRemixes = (
    await getRemixes({
      contentId: contentId1,
      loggedInUserId: ownerId2,
    })
  ).remixes;
  expect(activityRemixes.length).eq(2);
  expect(activityRemixes[0].remixContent.contentId).eqls(contentId4);
  expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");
  expect(activityRemixes[1].remixContent.contentId).eqls(contentId2);
  expect(activityRemixes[1].withLicenseCode).eq("CCDUAL");

  // // owner 2 sees direct remix of activity 1 into 2
  // activityRemixes = (
  //   await getRemixes({
  //     contentId: contentId1,
  //     loggedInUserId: ownerId2,
  //     directRemixesOnly: true,
  //   })
  // ).remixes;
  // expect(activityRemixes.length).eq(1);
  // expect(activityRemixes[0].contentId).eqls(contentId2);
  // expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");

  // owner3 sees activity 1, 2 and 3 in remixed from of activity 4
  remixedFrom = (
    await getRemixedFrom({
      contentId: contentId4,
      loggedInUserId: ownerId3,
    })
  ).remixedFrom;
  expect(remixedFrom.length).eq(3);
  expect(remixedFrom[0].originContent.contentId).eqls(contentId3);
  expect(remixedFrom[0].withLicenseCode).eq("CCBYSA");
  expect(remixedFrom[1].originContent.contentId).eqls(contentId2);
  expect(remixedFrom[1].withLicenseCode).eq("CCBYSA");
  expect(remixedFrom[2].originContent.contentId).eqls(contentId1);
  expect(remixedFrom[2].withLicenseCode).eq("CCDUAL");

  // owner 3 sees activity 5, 4, 3 and 2 in remixes of activity 1
  activityRemixes = (
    await getRemixes({
      contentId: contentId1,
      loggedInUserId: ownerId3,
    })
  ).remixes;
  expect(activityRemixes.length).eq(4);
  expect(activityRemixes[0].remixContent.contentId).eqls(contentId5);
  expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");
  expect(activityRemixes[1].remixContent.contentId).eqls(contentId4);
  expect(activityRemixes[1].withLicenseCode).eq("CCDUAL");
  expect(activityRemixes[2].remixContent.contentId).eqls(contentId3);
  expect(activityRemixes[2].withLicenseCode).eq("CCDUAL");
  expect(activityRemixes[3].remixContent.contentId).eqls(contentId2);
  expect(activityRemixes[3].withLicenseCode).eq("CCDUAL");

  // // owner 3 sees direct remixes of activity 1 into 2 and 5
  // activityRemixes = (
  //   await getRemixes({
  //     contentId: contentId1,
  //     loggedInUserId: ownerId3,
  //     directRemixesOnly: true,
  //   })
  // ).remixes;
  // expect(activityRemixes.length).eq(2);
  // expect(activityRemixes[0].contentId).eqls(contentId5);
  // expect(activityRemixes[0].withLicenseCode).eq("CCDUAL");
  // expect(activityRemixes[1].contentId).eqls(contentId2);
  // expect(activityRemixes[1].withLicenseCode).eq("CCDUAL");
});

test("remixing a compound activity also adds contributor history to sub activities", async () => {
  const ownerId1 = (await createTestUser()).userId;
  const ownerId2 = (await createTestUser()).userId;
  const ownerId3 = (await createTestUser()).userId;
  const ownerId4 = (await createTestUser()).userId;

  // create public problem set by owner 1
  const { contentId: sequenceId1 } = await createContent({
    loggedInUserId: ownerId1,
    contentType: "sequence",
    parentId: null,
  });
  const { contentId: docId1 } = await createContent({
    loggedInUserId: ownerId1,
    contentType: "singleDoc",
    parentId: sequenceId1,
  });
  await setContentIsPublic({
    contentId: sequenceId1,
    loggedInUserId: ownerId1,
    isPublic: true,
  });

  // add more after already public
  const { contentId: selectId1 } = await createContent({
    loggedInUserId: ownerId1,
    contentType: "select",
    parentId: sequenceId1,
  });
  const { contentId: docId2 } = await createContent({
    loggedInUserId: ownerId1,
    contentType: "singleDoc",
    parentId: selectId1,
  });
  const { contentId: docId3 } = await createContent({
    loggedInUserId: ownerId1,
    contentType: "singleDoc",
    parentId: selectId1,
  });

  // owner 2 copies problem set 1 to problem set 2 and makes it public
  const {
    newContentIds: [sequenceId2],
  } = await copyContent({
    contentIds: [sequenceId1],
    loggedInUserId: ownerId2,
    parentId: null,
  });
  await setContentIsPublic({
    contentId: sequenceId2,
    loggedInUserId: ownerId2,
    isPublic: true,
  });

  // owner 3 copies question bank 2 to question bank 3 and makes it public

  const sequence2 = await getContent({
    contentId: sequenceId2,
    loggedInUserId: ownerId3,
  });
  if (sequence2.type !== "sequence") {
    throw Error("Shouldn't happen");
  }

  const selectId2 = sequence2.children[1].contentId;

  const {
    newContentIds: [selectId3],
  } = await copyContent({
    contentIds: [selectId2],
    loggedInUserId: ownerId3,
    parentId: null,
  });

  await setContentIsPublic({
    contentId: selectId3,
    loggedInUserId: ownerId3,
    isPublic: true,
  });

  // owner 4 copies first problem of question bank 3 (call it document 4) to document 5

  const select3 = await getContent({
    contentId: selectId3,
    loggedInUserId: ownerId4,
  });
  if (select3.type !== "select") {
    throw Error("Shouldn't happen");
  }

  const docId4 = select3.children[0].contentId;

  const {
    newContentIds: [docId5],
  } = await copyContent({
    contentIds: [docId4],
    loggedInUserId: ownerId4,
    parentId: null,
  });
  await setContentIsPublic({
    contentId: docId5,
    loggedInUserId: ownerId4,
    isPublic: true,
  });

  // problem set 2 is only remix of problem set 1
  let remixes = (await getRemixes({ contentId: sequenceId1 })).remixes;
  expect(remixes.length).eq(1);
  expect(remixes[0].remixContent.contentId).eqls(sequenceId2);

  // question bank 2 and 3 are remixes of question bank 1
  remixes = (await getRemixes({ contentId: selectId1 })).remixes;
  expect(remixes.length).eq(2);
  expect(remixes[0].remixContent.contentId).eqls(selectId3);
  expect(remixes[1].remixContent.contentId).eqls(selectId2);

  // document 1 has one remix
  remixes = (
    await getRemixes({
      contentId: docId1,
    })
  ).remixes;
  expect(remixes.length).eq(1);

  // document 2 has three remixes, the most recent being doc 5 and doc 4
  remixes = (await getRemixes({ contentId: docId2 })).remixes;
  expect(remixes.length).eq(3);
  expect(remixes[0].remixContent.contentId).eqls(docId5);
  expect(remixes[1].remixContent.contentId).eqls(docId4);

  // document 3 has two remixes
  remixes = (
    await getRemixes({
      contentId: docId3,
    })
  ).remixes;
  expect(remixes.length).eq(2);

  // doc5 is remixed from 3, including doc 4 and doc 2
  let remixedFrom = (
    await getRemixedFrom({
      contentId: docId5,
    })
  ).remixedFrom;
  expect(remixedFrom.length).eq(3);
  expect(remixedFrom[0].originContent.contentId).eqls(docId4);
  expect(remixedFrom[2].originContent.contentId).eqls(docId2);

  // question bank 3 is remixed from question banks 2 and 1
  remixedFrom = (
    await getRemixedFrom({
      contentId: selectId3,
    })
  ).remixedFrom;
  expect(remixedFrom.length).eq(2);
  expect(remixedFrom[0].originContent.contentId).eqls(selectId2);
  expect(remixedFrom[1].originContent.contentId).eqls(selectId1);
});

test("get licenses", async () => {
  const { license: cc_by_sa } = await getLicense("CCBYSA");
  expect(cc_by_sa.name).eq("Creative Commons Attribution-ShareAlike 4.0");
  expect(cc_by_sa.imageURL).eq("/creative_commons_by_sa.png");
  expect(cc_by_sa.smallImageURL).eq("/by-sa-sm.png");
  expect(cc_by_sa.licenseURL).eq(
    "https://creativecommons.org/licenses/by-sa/4.0/",
  );

  const { license: cc_by_nc_sa } = await getLicense("CCBYNCSA");
  expect(cc_by_nc_sa.name).eq(
    "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
  );
  expect(cc_by_nc_sa.imageURL).eq("/creative_commons_by_nc_sa.png");
  expect(cc_by_nc_sa.smallImageURL).eq("/by-nc-sa-sm.png");
  expect(cc_by_nc_sa.licenseURL).eq(
    "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  );

  const { license: cc_dual } = await getLicense("CCDUAL");
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

  const { allLicenses: all } = await getAllLicenses();
  expect(all.map((x) => x.code)).eqls(["CCDUAL", "CCBYSA", "CCBYNCSA"]);
});

test("set license to make public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  // make public with CCBYSA license
  await setContentLicense({
    contentId,
    loggedInUserId: ownerId,
    licenseCode: "CCBYSA",
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  let { activity: activityData } = await getActivityEditorData({
    contentId,
    loggedInUserId: ownerId,
  });
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
    contentId,
    loggedInUserId: ownerId,
    isPublic: false,
  });
  ({ activity: activityData } = await getActivityEditorData({
    contentId,
    loggedInUserId: ownerId,
  }));
  expect(activityData).toBeDefined();
  expect(activityData!.isPublic).eq(false);

  // make public with CCBYNCSA license
  await setContentLicense({
    contentId,
    loggedInUserId: ownerId,
    licenseCode: "CCBYNCSA",
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  ({ activity: activityData } = await getActivityEditorData({
    contentId,
    loggedInUserId: ownerId,
  }));
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
    contentId,
    loggedInUserId: ownerId,
    licenseCode: "CCDUAL",
  });

  ({ activity: activityData } = await getActivityEditorData({
    contentId,
    loggedInUserId: ownerId,
  }));
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
