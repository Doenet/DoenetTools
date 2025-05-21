import { expect, test } from "vitest";
import {
  createTestAdminUser,
  createTestAnonymousUser,
  createTestUser,
} from "./utils";
import { Content, LibraryRelations, UserInfo } from "../types";
import {
  suggestToBeCurated,
  publishActivityToLibrary,
  unpublishActivityFromLibrary,
  getCurationQueue,
  getMultipleLibraryRelations,
  getSingleLibraryRelations,
  claimOwnershipOfReview,
  rejectActivity,
  addComment,
  getComments,
} from "../query/curate";
import {
  createContent,
  deleteContent,
  getContentSource,
  updateContent,
} from "../query/activity";
import {
  makeContentPrivate,
  makeContentPublic,
  modifyContentSharedWith,
  setContentIsPublic,
} from "../query/share";
import { getContent } from "../query/activity_edit_view";
import { fromUUID } from "../utils/uuid";
import { getActivityIdFromSourceId } from "./testQueries";
import { getUserInfo } from "../query/user";
import { moveContent } from "../query/copy_move";

async function expectStatusIs(
  sourceId: Uint8Array,
  desiredStatus: LibraryRelations,
  loggedInUserId: Uint8Array,
) {
  const actualStatus = await getMultipleLibraryRelations({
    contentIds: [sourceId],
    loggedInUserId,
  });
  expect(actualStatus.length).eqls(1);
  const { activity: actualMe, source: actualSource } = actualStatus[0];

  if (actualMe?.reviewRequestDate) {
    // Strip the date and test it separately
    const { reviewRequestDate: actualRequestDate, ...actualMeWithoutDate } =
      actualMe;
    const { reviewRequestDate: desiredRequestDate, ...desiredMeWithoutDate } =
      desiredStatus.activity!;

    expect(desiredRequestDate).toBeDefined();
    const timeDiff = Math.abs(
      actualRequestDate.getTime() - desiredRequestDate!.getTime(),
    );
    expect(timeDiff).toBeLessThan(1000 * 60 * 5); // 5 minutes

    expect(actualMeWithoutDate).eqls(desiredMeWithoutDate);
  } else {
    // No date to worry about
    expect(actualMe).eqls(desiredStatus.activity);
  }

  if (actualSource?.reviewRequestDate) {
    // Strip the date and test it separately
    const { reviewRequestDate: actualRequestDate, ...actualSourceWithoutDate } =
      actualSource;
    const {
      reviewRequestDate: desiredRequestDate,
      ...desiredSourceWithoutDate
    } = desiredStatus.source!;

    expect(desiredRequestDate).toBeDefined();
    const timeDiff = Math.abs(
      actualRequestDate.getTime() - desiredRequestDate!.getTime(),
    );
    expect(timeDiff).toBeLessThan(1000 * 60 * 5); // 5 minutes

    expect(actualSourceWithoutDate).eqls(desiredSourceWithoutDate);
  } else {
    // No date to worry about
    expect(actualSource).eqls(desiredStatus.source);
  }
}

test("user privileges for library", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();
  const { userId: randomUserId } = await createTestUser();
  const { userId: anonymousId } = await createTestAnonymousUser();

  const { contentId: sourceId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  // No library status for private activity
  const statusNone: LibraryRelations = {};

  await expectStatusIs(sourceId, statusNone, ownerId);
  await expectStatusIs(sourceId, statusNone, adminId);
  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusNone, anonymousId);

  // Cannot suggest curation for private activity
  async function expectSubmitRequestFails(userId: Uint8Array) {
    await expect(() =>
      suggestToBeCurated({ contentId: sourceId, loggedInUserId: userId }),
    ).rejects.toThrowError();
  }
  await expectSubmitRequestFails(ownerId);
  await expectSubmitRequestFails(adminId);
  await expectSubmitRequestFails(randomUserId);
  await expectSubmitRequestFails(anonymousId);
  await expectStatusIs(sourceId, statusNone, ownerId);
  await expectStatusIs(sourceId, statusNone, adminId);
  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusNone, anonymousId);

  await setContentIsPublic({
    contentId: sourceId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  const approximateReviewRequestDate = new Date();

  const statusPendingRequestedByOwner: LibraryRelations = {
    activity: {
      status: "PENDING",
      activityContentId: null,
      reviewRequestDate: approximateReviewRequestDate,
    },
  };

  // Anyone logged in can suggest curation

  // Setup some more content
  const someContentIds: Uint8Array[] = [];
  for (let i = 0; i < 3; i++) {
    const { contentId: someContentId } = await createContent({
      loggedInUserId: ownerId,
      contentType: "singleDoc",
      parentId: null,
    });
    await setContentIsPublic({
      contentId: someContentId,
      loggedInUserId: ownerId,
      isPublic: true,
    });
    someContentIds.push(someContentId);
  }

  // Anonymouse user fails
  await expect(() =>
    suggestToBeCurated({
      contentId: someContentIds[0],
      loggedInUserId: anonymousId,
    }),
  ).rejects.toThrowError();
  await expectStatusIs(someContentIds[0], statusNone, anonymousId);
  // Owner
  await suggestToBeCurated({
    loggedInUserId: ownerId,
    contentId: someContentIds[1],
  });
  await expectStatusIs(
    someContentIds[1],
    statusPendingRequestedByOwner,
    ownerId,
  );

  // Random user
  await suggestToBeCurated({
    loggedInUserId: randomUserId,
    contentId: someContentIds[2],
  });
  await expectStatusIs(someContentIds[2], statusNone, randomUserId);

  // Admin
  await suggestToBeCurated({
    loggedInUserId: adminId,
    contentId: sourceId,
  });

  const draftId = await getActivityIdFromSourceId(sourceId);
  const statusPendingAdmin: LibraryRelations = {
    activity: {
      status: "PENDING",
      reviewRequestDate: approximateReviewRequestDate,
      activityContentId: draftId,
    },
  };

  await expectStatusIs(sourceId, statusPendingAdmin, adminId);
  await expectStatusIs(sourceId, statusNone, ownerId);

  // Only admin can take ownership

  async function expectClaimFails(userId: Uint8Array) {
    await expect(() =>
      claimOwnershipOfReview({ contentId: sourceId, loggedInUserId: userId }),
    ).rejects.toThrowError();
  }

  await expectClaimFails(ownerId);
  await expectClaimFails(randomUserId);
  await expectClaimFails(anonymousId);

  await expectStatusIs(sourceId, statusPendingAdmin, adminId);

  await claimOwnershipOfReview({ contentId: draftId, loggedInUserId: adminId });

  const statusClaimedAdmin: LibraryRelations = {
    activity: {
      ...statusPendingAdmin.activity!,
      status: "UNDER_REVIEW",
    },
  };

  await expectStatusIs(sourceId, statusClaimedAdmin, adminId);
  await expectStatusIs(sourceId, statusNone, ownerId);

  const { user: adminUserInfoAll } = await getUserInfo({
    loggedInUserId: adminId,
  });
  const adminUserInfo: UserInfo = {
    userId: adminUserInfoAll.userId,
    email: adminUserInfoAll.email,
    firstNames: adminUserInfoAll.firstNames,
    lastNames: adminUserInfoAll.lastNames,
  };

  const draftClaimedAdmin: LibraryRelations = {
    source: {
      status: "UNDER_REVIEW",
      sourceContentId: sourceId,
      iAmPrimaryEditor: true,
      primaryEditor: adminUserInfo,
      reviewRequestDate: approximateReviewRequestDate,
      ownerRequested: false,
    },
  };

  await expectStatusIs(draftId, draftClaimedAdmin, adminId);

  // Only admin can publish
  async function expectPublishFails(userId: Uint8Array) {
    await expect(() =>
      publishActivityToLibrary({
        contentId: draftId,
        loggedInUserId: userId,
      }),
    ).rejects.toThrowError();
  }

  await expectPublishFails(randomUserId);
  await expectPublishFails(ownerId);

  const statusPublishedAdmin: LibraryRelations = {
    activity: {
      ...statusClaimedAdmin.activity!,
      status: "PUBLISHED",
    },
  };
  const statusPublishedPublic: LibraryRelations = {
    activity: {
      status: "PUBLISHED",
      activityContentId: draftId,
    },
  };

  const draftPublishedPublic: LibraryRelations = {
    source: {
      status: "PUBLISHED",
      sourceContentId: sourceId,
    },
  };

  const draftPublishedAdmin: LibraryRelations = {
    source: {
      ...draftClaimedAdmin.source!,
      status: "PUBLISHED",
    },
  };

  await publishActivityToLibrary({
    contentId: draftId,
    loggedInUserId: adminId,
  });

  await expectStatusIs(sourceId, statusPublishedPublic, randomUserId);
  await expectStatusIs(sourceId, statusPublishedPublic, anonymousId);
  await expectStatusIs(sourceId, statusPublishedPublic, ownerId);
  await expectStatusIs(sourceId, statusPublishedAdmin, adminId);

  await expectStatusIs(draftId, draftPublishedPublic, randomUserId);
  await expectStatusIs(draftId, draftPublishedPublic, anonymousId);
  await expectStatusIs(draftId, draftPublishedPublic, ownerId);
  await expectStatusIs(draftId, draftPublishedAdmin, adminId);

  // Random user cannot comment
  async function expectAddCommentFails(userId: Uint8Array) {
    await expect(() =>
      addComment({
        contentId: sourceId,
        comment: "I have new comments.",
        loggedInUserId: userId,
      }),
    ).rejects.toThrowError();
  }

  await expectAddCommentFails(randomUserId);
  await expectAddCommentFails(anonymousId);

  // Only admin can unpublish
  async function expectUnpublishFails(userId: Uint8Array) {
    await expect(() =>
      unpublishActivityFromLibrary({
        contentId: draftId,
        loggedInUserId: userId,
      }),
    ).rejects.toThrowError();
  }
  await expectUnpublishFails(randomUserId);
  await expectUnpublishFails(anonymousId);
  await expectUnpublishFails(ownerId);

  await unpublishActivityFromLibrary({
    contentId: draftId,
    loggedInUserId: adminId,
  });
  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusNone, ownerId);
  await expectStatusIs(sourceId, statusClaimedAdmin, adminId);

  // Only admin can reject
  async function expectRejectFails(userId: Uint8Array) {
    await expect(() =>
      rejectActivity({
        contentId: draftId,
        loggedInUserId: userId,
      }),
    ).rejects.toThrowError();
  }
  await expectRejectFails(randomUserId);
  await expectRejectFails(ownerId);
  await expectRejectFails(anonymousId);

  await rejectActivity({
    contentId: draftId,
    loggedInUserId: adminId,
  });

  const statusRejectedAdmin: LibraryRelations = {
    activity: {
      ...statusClaimedAdmin.activity!,
      status: "REJECTED",
    },
  };
  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusNone, anonymousId);
  await expectStatusIs(sourceId, statusNone, ownerId);
  await expectStatusIs(sourceId, statusRejectedAdmin, adminId);
});

test("Admin cannot publish before claiming", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
    // licenseCode: "CCDUAL",
  });
  await suggestToBeCurated({ loggedInUserId: ownerId, contentId });

  const admin = await createTestAdminUser();
  const adminId = admin.userId;
  // Immediately trying to publish fails
  await expect(() =>
    publishActivityToLibrary({
      contentId: contentId,
      loggedInUserId: adminId,
    }),
  ).rejects.toThrowError();
});

test("owner requests library review, has conversation, admin publishes", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();

  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // Owner suggests
  await suggestToBeCurated({ loggedInUserId: ownerId, contentId });

  const approximateReviewRequestDate = new Date();
  const statusPending: LibraryRelations = {
    activity: {
      status: "PENDING",
      activityContentId: null,
      reviewRequestDate: approximateReviewRequestDate,
    },
  };
  await expectStatusIs(contentId, statusPending, ownerId);

  // Owner comments
  await addComment({
    contentId,
    comment: "Notes about my project...",
    loggedInUserId: ownerId,
  });

  let comments = await getComments({ contentId, loggedInUserId: ownerId });
  expect(comments.length).eqls(1);
  expect(comments[0].userId).eqls(ownerId);
  expect(comments[0].comment).eqls("Notes about my project...");

  const draftId = await getActivityIdFromSourceId(contentId);
  comments = await getComments({
    contentId: draftId,
    loggedInUserId: adminId,
    asEditor: true,
  });
  expect(comments.length).eqls(1);
  expect(comments[0].userId).eqls(ownerId);
  expect(comments[0].comment).eqls("Notes about my project...");

  // Admin comments
  await addComment({
    contentId: draftId,
    comment: "Nice job",
    loggedInUserId: adminId,
    asEditor: true,
  });

  comments = await getComments({ contentId, loggedInUserId: ownerId });
  expect(comments.length).eqls(2);
  expect(comments[0].userId).eqls(ownerId);
  expect(comments[0].comment).eqls("Notes about my project...");
  expect(comments[1].userId).eqls(adminId);
  expect(comments[1].comment).eqls("Nice job");

  comments = await getComments({
    contentId: draftId,
    loggedInUserId: adminId,
    asEditor: true,
  });
  expect(comments.length).eqls(2);
  expect(comments[0].userId).eqls(ownerId);
  expect(comments[0].comment).eqls("Notes about my project...");
  expect(comments[1].userId).eqls(adminId);
  expect(comments[1].comment).eqls("Nice job");

  // Admin claims, edits, and publishes
  await claimOwnershipOfReview({
    contentId: draftId,
    loggedInUserId: adminId,
  });

  await updateContent({
    contentId: draftId,
    source: "<graph>(3,2)</graph>",
    loggedInUserId: adminId,
  });

  await publishActivityToLibrary({
    contentId: draftId,
    loggedInUserId: adminId,
  });

  const status = await getSingleLibraryRelations({
    contentId,
    loggedInUserId: ownerId,
  });
  expect(status.activity?.activityContentId).eqls(draftId);

  const curatedActivity = await getContentSource({
    contentId: draftId,
    loggedInUserId: ownerId,
  });
  expect(curatedActivity.source).eqls("<graph>(3,2)</graph>");

  // Owner comments one more time
  await addComment({
    contentId,
    comment: "I have new comments.",
    loggedInUserId: ownerId,
  });

  comments = await getComments({
    contentId: draftId,
    loggedInUserId: adminId,
    asEditor: true,
  });
  expect(comments.length).eqls(3);
  expect(comments[0].userId).eqls(ownerId);
  expect(comments[0].comment).eqls("Notes about my project...");
  expect(comments[1].userId).eqls(adminId);
  expect(comments[1].comment).eqls("Nice job");
  expect(comments[2].userId).eqls(ownerId);
  expect(comments[2].comment).eqls("I have new comments.");
});

test("random user requests, admin publishes", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: randomId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();

  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  await suggestToBeCurated({ contentId, loggedInUserId: randomId });
  await expectStatusIs(contentId, {}, ownerId);

  // Admin can't comment yet
  const draftId = await getActivityIdFromSourceId(contentId);
  await expect(() =>
    addComment({
      contentId: draftId,
      comment: "You can't see this yet",
      loggedInUserId: adminId,
      asEditor: true,
    }),
  ).rejects.toThrowError();

  let comments = await getComments({ contentId, loggedInUserId: ownerId });
  expect(comments.length).eqls(0);

  // Admin curates and publishes
  await claimOwnershipOfReview({
    contentId: draftId,
    loggedInUserId: adminId,
  });
  await updateContent({
    contentId: draftId,
    name: "My curated activity",
    loggedInUserId: adminId,
  });
  await publishActivityToLibrary({
    contentId: draftId,
    loggedInUserId: adminId,
  });
  const statusPublished: LibraryRelations = {
    activity: {
      status: "PUBLISHED",
      activityContentId: draftId,
    },
  };
  await expectStatusIs(contentId, statusPublished, ownerId);
  const curatedActivity = await getContent({
    contentId: draftId,
    loggedInUserId: ownerId,
  });
  expect(curatedActivity.name).eqls("My curated activity");

  // Owner comments
  await addComment({
    contentId,
    comment: "Wow, you curated my project!",
    loggedInUserId: ownerId,
  });

  comments = await getComments({
    contentId: draftId,
    loggedInUserId: adminId,
    asEditor: true,
  });
  expect(comments.length).eqls(1);
  expect(comments[0].userId).eqls(ownerId);
  expect(comments[0].comment).eqls("Wow, you curated my project!");
});

test("published activity in library with unavailable source activity", async () => {
  // Setup
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();
  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // Publish
  const approximateReviewRequestDate = new Date();
  await suggestToBeCurated({
    contentId,
    loggedInUserId: adminId,
  });
  const draftId = await getActivityIdFromSourceId(contentId);
  await claimOwnershipOfReview({
    contentId: draftId,
    loggedInUserId: adminId,
  });
  await publishActivityToLibrary({
    contentId: draftId,
    loggedInUserId: adminId,
  });

  let statusMeOwner: LibraryRelations = {
    activity: {
      status: "PUBLISHED",
      activityContentId: draftId,
    },
  };
  let statusMeAdmin: LibraryRelations = {
    activity: {
      status: "PUBLISHED",
      activityContentId: draftId,
      reviewRequestDate: approximateReviewRequestDate,
    },
  };

  let statusSourceOwner: LibraryRelations = {
    source: {
      status: "PUBLISHED",
      sourceContentId: contentId,
    },
  };
  const { user: adminUserAll } = await getUserInfo({ loggedInUserId: adminId });
  const adminUser: UserInfo = {
    userId: adminUserAll.userId,
    email: adminUserAll.email,
    firstNames: adminUserAll.firstNames,
    lastNames: adminUserAll.lastNames,
  };

  let statusSourceAdmin: LibraryRelations = {
    source: {
      ...statusSourceOwner.source!,
      ownerRequested: false,
      primaryEditor: adminUser,
      iAmPrimaryEditor: true,
      reviewRequestDate: approximateReviewRequestDate,
    },
  };

  await expectStatusIs(contentId, statusMeOwner, ownerId);
  await expectStatusIs(contentId, statusMeAdmin, adminId);
  await expectStatusIs(draftId, statusSourceOwner, ownerId);
  await expectStatusIs(draftId, statusSourceAdmin, adminId);

  // Owner makes their activity private, library remix still published
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: false,
  });

  statusMeAdmin = {};
  statusSourceAdmin = {
    source: {
      ...statusSourceAdmin.source!,
      sourceContentId: null,
    },
  };

  await expectStatusIs(contentId, statusMeOwner, ownerId);
  await expectStatusIs(contentId, statusMeAdmin, adminId);
  await expectStatusIs(draftId, statusSourceOwner, ownerId);
  await expectStatusIs(draftId, statusSourceAdmin, adminId);

  // Owner deletes activity, remix still published
  await deleteContent({ contentId: contentId, loggedInUserId: ownerId });

  statusMeOwner = {};
  statusSourceOwner = {
    source: {
      status: "PUBLISHED",
      sourceContentId: null,
    },
  };

  await expectStatusIs(contentId, statusMeOwner, ownerId);
  await expectStatusIs(contentId, statusMeAdmin, adminId);
  await expectStatusIs(draftId, statusSourceOwner, ownerId);
  await expectStatusIs(draftId, statusSourceAdmin, adminId);
});

async function getRelevantQueue(
  adminId: Uint8Array,
  allowedIds: Uint8Array[],
): Promise<
  [
    Content[],
    LibraryRelations[],
    Content[],
    LibraryRelations[],
    Content[],
    LibraryRelations[],
    Content[],
    LibraryRelations[],
  ]
> {
  let {
    pendingContent,
    pendingLibraryRelations,
    underReviewContent,
    underReviewLibraryRelations,
    publishedContent,
    publishedLibraryRelations,
    rejectedContent,
    rejectedLibraryRelations,
  } = await getCurationQueue({ loggedInUserId: adminId });

  const allowedIdsSet = new Set(allowedIds.map((v) => fromUUID(v)));

  function onlyRelevant(
    content: Content[],
    libraryRelations: LibraryRelations[],
  ): [Content[], LibraryRelations[]] {
    const all = content.map((c, i) => ({
      content: c,
      libraryRelations: libraryRelations[i],
    }));
    const relevant = all.filter(
      ({ content: _, libraryRelations }) =>
        libraryRelations.source?.sourceContentId &&
        allowedIdsSet.has(fromUUID(libraryRelations.source!.sourceContentId!)),
    );
    return [
      relevant.map(({ content }) => content),
      relevant.map(({ libraryRelations }) => libraryRelations),
    ];
  }
  [pendingContent, pendingLibraryRelations] = onlyRelevant(
    pendingContent,
    pendingLibraryRelations,
  );
  [underReviewContent, underReviewLibraryRelations] = onlyRelevant(
    underReviewContent,
    underReviewLibraryRelations,
  );
  [publishedContent, publishedLibraryRelations] = onlyRelevant(
    publishedContent,
    publishedLibraryRelations,
  );
  [rejectedContent, rejectedLibraryRelations] = onlyRelevant(
    rejectedContent,
    rejectedLibraryRelations,
  );

  return [
    pendingContent,
    pendingLibraryRelations,
    underReviewContent,
    underReviewLibraryRelations,
    publishedContent,
    publishedLibraryRelations,
    rejectedContent,
    rejectedLibraryRelations,
  ];
}

function expectAtItemNum(
  itemNum: number,
  sourceId: Uint8Array,
  revisedId: Uint8Array,
  content: Content[],
  libraryRelations: LibraryRelations[],
  startTestTimestamp: number,
) {
  const generousUpperBoundTime = startTestTimestamp + 1000 * 60 * 5;

  expect(content[itemNum].contentId).eqls(revisedId);
  expect(libraryRelations[itemNum].source!.sourceContentId!).eqls(sourceId);
  expect(
    libraryRelations[itemNum].source!.reviewRequestDate!.getTime(),
  ).toBeGreaterThanOrEqual(startTestTimestamp);
  expect(
    libraryRelations[itemNum].source!.reviewRequestDate!.getTime(),
  ).toBeLessThan(generousUpperBoundTime);
}

function expectRequestsNewestToOldest(libraryRelations: LibraryRelations[]) {
  let oldestSeen = Date.now() + 1000 * 60 * 5; // 5 minutes in the future
  for (const libRelations of libraryRelations) {
    const date = libRelations.source!.reviewRequestDate!.getTime();
    expect(date).toBeLessThanOrEqual(oldestSeen);
    oldestSeen = date;
  }
}

test("List of pending requests updates", { timeout: 30000 }, async () => {
  // We will test that the submit date is within 5 minutes after test start
  // aka a ~generally~ reasonable time
  const startTime = Date.now();

  // Setup
  const { userId: adminId } = await createTestAdminUser();
  const { userId: ownerId } = await createTestUser();

  const sourceIds: Uint8Array[] = [];
  for (let i = 0; i < 3; i++) {
    const { contentId } = await createContent({
      loggedInUserId: ownerId,
      contentType: "singleDoc",
      parentId: null,
    });
    await setContentIsPublic({
      contentId,
      loggedInUserId: ownerId,
      isPublic: true,
    });
    sourceIds.push(contentId);
  }

  // Non-admin cannot access pending requests
  await expect(() =>
    getCurationQueue({ loggedInUserId: ownerId }),
  ).rejects.toThrowError();

  // No pending requests
  let [pendCon, pendLib, underCon, underLib, pubCon, pubLib, rejCon, rejLib] =
    await getRelevantQueue(adminId, sourceIds);

  function expectLengths({
    pend,
    under,
    pub,
    rej,
  }: {
    pend: number;
    under: number;
    pub: number;
    rej: number;
  }) {
    expect(pendCon.length).eqls(pend);
    expect(pendLib.length).eqls(pend);
    expect(underCon.length).eqls(under);
    expect(underLib.length).eqls(under);
    expect(pubCon.length).eqls(pub);
    expect(pubLib.length).eqls(pub);
    expect(rejCon.length).eqls(rej);
    expect(rejLib.length).eqls(rej);
    expectRequestsNewestToOldest(pendLib);
    expectRequestsNewestToOldest(underLib);
    expectRequestsNewestToOldest(pubLib);
    expectRequestsNewestToOldest(rejLib);
  }

  expectLengths({ pend: 0, under: 0, pub: 0, rej: 0 });

  // Owner requests review for activity #1
  await suggestToBeCurated({
    loggedInUserId: ownerId,
    contentId: sourceIds[0],
  });
  [pendCon, pendLib, underCon, underLib, pubCon, pubLib, rejCon, rejLib] =
    await getRelevantQueue(adminId, sourceIds);

  const curatedIds: Uint8Array[] = [];
  curatedIds.push(await getActivityIdFromSourceId(sourceIds[0]));

  expectLengths({ pend: 1, under: 0, pub: 0, rej: 0 });
  expectAtItemNum(0, sourceIds[0], curatedIds[0], pendCon, pendLib, startTime);

  // Owner requests review for 3rd activity and then 2nd
  await suggestToBeCurated({
    loggedInUserId: ownerId,
    contentId: sourceIds[2],
  });
  await suggestToBeCurated({
    loggedInUserId: ownerId,
    contentId: sourceIds[1],
  });

  curatedIds.push(await getActivityIdFromSourceId(sourceIds[1]));
  curatedIds.push(await getActivityIdFromSourceId(sourceIds[2]));

  [pendCon, pendLib, underCon, underLib, pubCon, pubLib, rejCon, rejLib] =
    await getRelevantQueue(adminId, sourceIds);

  // The order should be the one in which they were requested reversed, not the order they were made
  expectLengths({ pend: 3, under: 0, pub: 0, rej: 0 });
  expectAtItemNum(0, sourceIds[1], curatedIds[1], pendCon, pendLib, startTime);
  expectAtItemNum(1, sourceIds[2], curatedIds[2], pendCon, pendLib, startTime);
  expectAtItemNum(2, sourceIds[0], curatedIds[0], pendCon, pendLib, startTime);

  // Admin claims activity #3, #2, and rejects #1
  await claimOwnershipOfReview({
    contentId: curatedIds[2],
    loggedInUserId: adminId,
  });
  await claimOwnershipOfReview({
    contentId: curatedIds[1],
    loggedInUserId: adminId,
  });

  await claimOwnershipOfReview({
    contentId: curatedIds[0],
    loggedInUserId: adminId,
  });
  await rejectActivity({
    contentId: curatedIds[0],
    loggedInUserId: adminId,
  });

  [pendCon, pendLib, underCon, underLib, pubCon, pubLib, rejCon, rejLib] =
    await getRelevantQueue(adminId, sourceIds);

  expectLengths({ pend: 0, under: 2, pub: 0, rej: 1 });
  expectAtItemNum(0, sourceIds[0], curatedIds[0], rejCon, rejLib, startTime);
  expectAtItemNum(
    0,
    sourceIds[1],
    curatedIds[1],
    underCon,
    underLib,
    startTime,
  );
  expectAtItemNum(
    1,
    sourceIds[2],
    curatedIds[2],
    underCon,
    underLib,
    startTime,
  );

  // Publish activity #3
  await publishActivityToLibrary({
    contentId: curatedIds[2],
    loggedInUserId: adminId,
  });

  [pendCon, pendLib, underCon, underLib, pubCon, pubLib, rejCon, rejLib] =
    await getRelevantQueue(adminId, sourceIds);

  expectLengths({ pend: 0, under: 1, pub: 1, rej: 1 });
  expectAtItemNum(0, sourceIds[0], curatedIds[0], rejCon, rejLib, startTime);
  expectAtItemNum(
    0,
    sourceIds[1],
    curatedIds[1],
    underCon,
    underLib,
    startTime,
  );
  expectAtItemNum(0, sourceIds[2], curatedIds[2], pubCon, pubLib, startTime);

  // Unpublish activity #3, reject #2
  await unpublishActivityFromLibrary({
    contentId: curatedIds[2],
    loggedInUserId: adminId,
  });
  await rejectActivity({
    contentId: curatedIds[1],
    loggedInUserId: adminId,
  });

  [pendCon, pendLib, underCon, underLib, pubCon, pubLib, rejCon, rejLib] =
    await getRelevantQueue(adminId, sourceIds);

  expectLengths({ pend: 0, under: 1, pub: 0, rej: 2 });
  expectAtItemNum(1, sourceIds[0], curatedIds[0], rejCon, rejLib, startTime);
  expectAtItemNum(0, sourceIds[1], curatedIds[1], rejCon, rejLib, startTime);
  expectAtItemNum(
    0,
    sourceIds[2],
    curatedIds[2],
    underCon,
    underLib,
    startTime,
  );

  // Owner re-requests review for #2 and then #1, admin claims them
  await suggestToBeCurated({
    loggedInUserId: ownerId,
    contentId: sourceIds[1],
  });
  await suggestToBeCurated({
    loggedInUserId: ownerId,
    contentId: sourceIds[0],
  });

  await claimOwnershipOfReview({
    contentId: curatedIds[1],
    loggedInUserId: adminId,
  });
  await claimOwnershipOfReview({
    contentId: curatedIds[0],
    loggedInUserId: adminId,
  });

  [pendCon, pendLib, underCon, underLib, pubCon, pubLib, rejCon, rejLib] =
    await getRelevantQueue(adminId, sourceIds);

  expectLengths({ pend: 0, under: 3, pub: 0, rej: 0 });
  // New order: #1, #2, #3
  expectAtItemNum(
    0,
    sourceIds[0],
    curatedIds[0],
    underCon,
    underLib,
    startTime,
  );
  expectAtItemNum(
    1,
    sourceIds[1],
    curatedIds[1],
    underCon,
    underLib,
    startTime,
  );
  expectAtItemNum(
    2,
    sourceIds[2],
    curatedIds[2],
    underCon,
    underLib,
    startTime,
  );
});

test("getSingleLibraryRelations works with visitor not signed in", async () => {
  const { userId } = await createTestUser();
  const { contentId } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: null,
  });
  // make public
  await setContentIsPublic({
    contentId,
    loggedInUserId: userId,
    isPublic: true,
  });

  // No `loggedInUserId` provided
  const results = await getSingleLibraryRelations({ contentId });
  expect(results).toEqual({});

  // curate activity
  const { userId: adminId } = await createTestAdminUser();
  await suggestToBeCurated({
    loggedInUserId: adminId,
    contentId,
  });
  const draftId = await getActivityIdFromSourceId(contentId);
  await claimOwnershipOfReview({
    contentId: draftId,
    loggedInUserId: adminId,
  });
  await publishActivityToLibrary({
    contentId: draftId,
    loggedInUserId: adminId,
  });

  // No `loggedInUserId` provided
  const results2 = await getSingleLibraryRelations({ contentId });
  const published: LibraryRelations = {
    activity: {
      status: "PUBLISHED",
      activityContentId: draftId,
    },
  };
  expect(results2).toEqual(published);
});

test("getMultipleLibraryRelations works with visitor not signed in", async () => {
  const { userId } = await createTestUser();
  const { contentId } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: null,
  });
  const { contentId: contentId2 } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: null,
  });
  const { contentId: contentId3 } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: null,
  });

  const { userId: adminId } = await createTestAdminUser();
  const draftIds: Uint8Array[] = [];

  const contentIds = [contentId, contentId2, contentId3];
  for (const contentId of contentIds) {
    // make public
    await setContentIsPublic({
      contentId,
      loggedInUserId: userId,
      isPublic: true,
    });
    // curate activity
    await suggestToBeCurated({
      loggedInUserId: adminId,
      contentId,
    });
    const draftId = await getActivityIdFromSourceId(contentId);
    draftIds.push(draftId);
    await claimOwnershipOfReview({
      contentId: draftId,
      loggedInUserId: adminId,
    });
    await publishActivityToLibrary({
      contentId: draftId,
      loggedInUserId: adminId,
    });
  }
  // No `loggedInUserId` provided
  const results = await getMultipleLibraryRelations({
    contentIds,
  });

  const expectedResults: LibraryRelations[] = [
    {
      activity: {
        status: "PUBLISHED",
        activityContentId: draftIds[0],
      },
    },
    {
      activity: {
        status: "PUBLISHED",
        activityContentId: draftIds[1],
      },
    },
    {
      activity: {
        status: "PUBLISHED",
        activityContentId: draftIds[2],
      },
    },
  ];
  expect(results).toEqual(expectedResults);
});

test("Owner does not see pending review status if they did not submit request", async () => {
  const { userId: adminId } = await createTestAdminUser();
  const { userId: ownerId } = await createTestUser();

  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  await suggestToBeCurated({
    contentId,
    loggedInUserId: adminId,
  });
  await expectStatusIs(contentId, {}, ownerId);
});

test("Library relations match up with activities with folders in front", async () => {
  const { userId: ownerId } = await createTestUser();

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

  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  await suggestToBeCurated({
    contentId,
    loggedInUserId: ownerId,
  });

  const expectedSecondNoDate = {
    status: "PENDING",
    activityContentId: null,
  };
  const expectedSecondDate = new Date();

  const actualResults = await getMultipleLibraryRelations({
    contentIds: [folderId, contentId],
    loggedInUserId: ownerId,
  });

  expect(actualResults.length).toEqual(2);
  expect(actualResults[0]).toEqual({});

  const { reviewRequestDate: actualSecondDate, ...actualSecondNoDate } =
    actualResults[1].activity!;

  expect(expectedSecondNoDate).toEqual(actualSecondNoDate);

  const timeDiff = Math.abs(
    actualSecondDate!.getTime() - expectedSecondDate.getTime(),
  );
  expect(timeDiff).toBeLessThan(1000 * 60 * 5); // 5 minutes
});

test("Cannot use normal sharing endpoints for library activities", async () => {
  // Setup
  const { userId: adminId } = await createTestAdminUser();
  const { contentId } = await createContent({
    loggedInUserId: adminId,
    contentType: "singleDoc",
    parentId: null,
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: adminId,
    isPublic: true,
  });
  await suggestToBeCurated({
    contentId,
    loggedInUserId: adminId,
  });
  const draftId = await getActivityIdFromSourceId(contentId);
  await claimOwnershipOfReview({
    contentId: draftId,
    loggedInUserId: adminId,
  });

  // Test

  const { userId: randomId } = await createTestUser();

  await expect(() =>
    modifyContentSharedWith({
      action: "share",
      contentId: draftId,
      loggedInUserId: adminId,
      users: [randomId],
    }),
  ).rejects.toThrowError();

  await expect(() =>
    makeContentPublic({
      contentId: draftId,
      loggedInUserId: adminId,
    }),
  ).rejects.toThrowError();

  await publishActivityToLibrary({
    contentId: draftId,
    loggedInUserId: adminId,
  });

  await expect(() =>
    makeContentPrivate({
      contentId: draftId,
      loggedInUserId: adminId,
    }),
  ).rejects.toThrowError();
});

test("Library draft not visible to non-admin", async () => {
  // Setup
  const { userId: ownerId } = await createTestUser();
  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await suggestToBeCurated({
    contentId,
    loggedInUserId: ownerId,
  });
  const draftId = await getActivityIdFromSourceId(contentId);

  await expect(() =>
    getContent({
      contentId: draftId,
      loggedInUserId: ownerId,
    }),
  ).rejects.toThrowError();
});

test("Admin cannot move content between library and their folders", async () => {
  const { userId: adminId } = await createTestAdminUser();

  const { contentId: libraryFolderId } = await createContent({
    loggedInUserId: adminId,
    contentType: "folder",
    parentId: null,
    inLibrary: true,
  });

  const { contentId: folderId } = await createContent({
    loggedInUserId: adminId,
    contentType: "folder",
    parentId: null,
  });
  const { contentId } = await createContent({
    loggedInUserId: adminId,
    contentType: "singleDoc",
    parentId: folderId,
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: adminId,
    isPublic: true,
  });
  await suggestToBeCurated({
    contentId,
    loggedInUserId: adminId,
  });

  const draftId = await getActivityIdFromSourceId(contentId);
  await claimOwnershipOfReview({
    contentId: draftId,
    loggedInUserId: adminId,
  });
  await publishActivityToLibrary({
    contentId: draftId,
    loggedInUserId: adminId,
  });

  // Cannot move library activity to personal folder

  await expect(() =>
    moveContent({
      contentId: draftId,
      parentId: folderId,
      desiredPosition: 0,
      loggedInUserId: adminId,
    }),
  ).rejects.toThrowError();

  // Cannot move personal activity to library folder

  await expect(() =>
    moveContent({
      contentId,
      parentId: libraryFolderId,
      desiredPosition: 0,
      loggedInUserId: adminId,
    }),
  ).rejects.toThrowError();
});
