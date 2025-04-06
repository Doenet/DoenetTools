import { expect, test } from "vitest";
import { createTestAdminUser, createTestUser } from "./utils";
import { Content, LibraryRelations } from "../types";
import {
  submitLibraryRequest,
  addDraftToLibrary,
  cancelLibraryRequest,
  markLibraryRequestNeedsRevision,
  modifyCommentsOfLibraryRequest,
  publishActivityToLibrary,
  unpublishActivityFromLibrary,
  deleteDraftFromLibrary,
  getPendingCurationRequests,
  getMultipleLibraryRelations,
  getSingleLibraryRelations,
} from "../query/curate";
import { createContent, deleteContent } from "../query/activity";
import { setContentIsPublic } from "../query/share";
import { getContent } from "../query/activity_edit_view";
import { isEqualUUID } from "../utils/uuid";

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

  if (actualMe && actualMe.reviewRequestDate) {
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

  expect(actualSource).eqls(desiredStatus.source);
}

test("user privileges for library", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();
  const { userId: randomUserId } = await createTestUser();

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

  // Cannot request review for private activity
  // owner
  async function expectSubmitRequestFails(userId: Uint8Array) {
    await expect(() =>
      submitLibraryRequest({ contentId: sourceId, loggedInUserId: userId }),
    ).rejects.toThrowError();
  }
  await expectSubmitRequestFails(ownerId);
  await expectSubmitRequestFails(adminId);
  await expectSubmitRequestFails(randomUserId);
  await expectStatusIs(sourceId, statusNone, ownerId);
  await expectStatusIs(sourceId, statusNone, adminId);
  await expectStatusIs(sourceId, statusNone, randomUserId);

  await setContentIsPublic({
    contentId: sourceId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  const approximateReviewRequestDate = new Date();

  const statusPending: LibraryRelations = {
    activity: {
      status: "PENDING_REVIEW",
      comments: "",
      activityContentId: null,
      reviewRequestDate: approximateReviewRequestDate,
    },
  };

  // Only owner can request review
  await expectSubmitRequestFails(adminId);
  await expectStatusIs(sourceId, statusNone, adminId);
  await expectSubmitRequestFails(randomUserId);
  await expectStatusIs(sourceId, statusNone, randomUserId);

  await submitLibraryRequest({ loggedInUserId: ownerId, contentId: sourceId });
  await expectStatusIs(sourceId, statusPending, ownerId);

  // Only admin can add draft
  async function expectAddDraftFails(userId: Uint8Array) {
    await expect(() =>
      addDraftToLibrary({
        contentId: sourceId,
        loggedInUserId: userId,
      }),
    ).rejects.toThrowError();
  }

  await expectAddDraftFails(randomUserId);
  await expectAddDraftFails(ownerId);

  const { draftId } = await addDraftToLibrary({
    contentId: sourceId,
    loggedInUserId: adminId,
  });
  const statusPendingWithDraft: LibraryRelations = {
    activity: {
      ...statusPending.activity!,
      activityContentId: draftId,
    },
  };

  const draftStatusPending: LibraryRelations = {
    source: {
      status: "PENDING_REVIEW",
      comments: "",
      sourceContentId: sourceId,
      ownerRequested: true,
    },
  };

  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusPending, ownerId);
  await expectStatusIs(sourceId, statusPendingWithDraft, adminId);

  await expectStatusIs(draftId, statusNone, randomUserId);
  await expectStatusIs(draftId, statusNone, ownerId);
  await expectStatusIs(draftId, draftStatusPending, adminId);

  // Only owner can cancel review request
  async function expectCancelRequestFails(userId: Uint8Array) {
    await expect(() =>
      cancelLibraryRequest({ contentId: sourceId, loggedInUserId: userId }),
    ).rejects.toThrowError();
  }

  await expectCancelRequestFails(randomUserId);
  await expectCancelRequestFails(adminId);

  await cancelLibraryRequest({ contentId: sourceId, loggedInUserId: ownerId });

  const statusCancelled: LibraryRelations = {
    activity: {
      status: "REQUEST_REMOVED",
      comments: "",
      activityContentId: null,
      reviewRequestDate: approximateReviewRequestDate,
    },
  };
  const statusCancelledWithDraft: LibraryRelations = {
    activity: {
      ...statusCancelled.activity!,
      activityContentId: draftId,
    },
  };
  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusCancelled, ownerId);
  await expectStatusIs(sourceId, statusCancelledWithDraft, adminId);

  // Add request back
  await submitLibraryRequest({ loggedInUserId: ownerId, contentId: sourceId });

  // Only admin can return for revision
  async function expectSendBackFails(userId: Uint8Array) {
    await expect(() =>
      markLibraryRequestNeedsRevision({
        sourceId: sourceId,
        loggedInUserId: userId,
        comments: "Please fix such and such.",
      }),
    ).rejects.toThrowError();
  }
  await expectSendBackFails(randomUserId);
  await expectSendBackFails(ownerId);

  await markLibraryRequestNeedsRevision({
    sourceId: sourceId,
    loggedInUserId: adminId,
    comments: "Please fix such and such.",
  });

  const statusNeedsRev: LibraryRelations = {
    activity: {
      status: "NEEDS_REVISION",
      comments: "Please fix such and such.",
      activityContentId: null,
      reviewRequestDate: approximateReviewRequestDate,
    },
  };
  const statusNeedsRevWithDraft: LibraryRelations = {
    activity: {
      ...statusNeedsRev.activity!,
      activityContentId: draftId,
    },
  };
  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusNeedsRev, ownerId);
  await expectStatusIs(sourceId, statusNeedsRevWithDraft, adminId);

  // Only admin can modify comments
  async function expectModifyCommentsFails(userId: Uint8Array) {
    await expect(() =>
      modifyCommentsOfLibraryRequest({
        sourceId: sourceId,
        comments: "I have new comments.",
        loggedInUserId: userId,
      }),
    ).rejects.toThrowError();
  }

  const statusNewComments: LibraryRelations = {
    activity: {
      status: "NEEDS_REVISION",
      comments: "I have new comments.",
      activityContentId: null,
      reviewRequestDate: approximateReviewRequestDate,
    },
  };
  const statusNewCommentsWithDraft: LibraryRelations = {
    activity: {
      ...statusNewComments.activity!,
      activityContentId: draftId,
    },
  };

  await expectModifyCommentsFails(randomUserId);
  await expectModifyCommentsFails(ownerId);
  await modifyCommentsOfLibraryRequest({
    sourceId: sourceId,
    comments: "I have new comments.",
    loggedInUserId: adminId,
  });
  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusNewComments, ownerId);
  await expectStatusIs(sourceId, statusNewCommentsWithDraft, adminId);

  // Only admin can publish
  async function expectPublishFails(userId: Uint8Array) {
    await expect(() =>
      publishActivityToLibrary({
        draftId,
        loggedInUserId: userId,
        comments: "Awesome problem set!",
      }),
    ).rejects.toThrowError();
  }

  await expectPublishFails(randomUserId);
  await expectPublishFails(ownerId);
  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusNewComments, ownerId);
  await expectStatusIs(sourceId, statusNewCommentsWithDraft, adminId);

  const publicStatusPublished: LibraryRelations = {
    activity: {
      status: "PUBLISHED",
      activityContentId: draftId,
    },
  };
  const privateStatusPublished: LibraryRelations = {
    activity: {
      status: "PUBLISHED",
      comments: "Awesome problem set!",
      activityContentId: draftId,
      reviewRequestDate: approximateReviewRequestDate,
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
      ...draftPublishedPublic.source!,
      comments: "Awesome problem set!",
      ownerRequested: true,
    },
  };

  await publishActivityToLibrary({
    draftId,
    loggedInUserId: adminId,
    comments: "Awesome problem set!",
  });
  await expectStatusIs(sourceId, publicStatusPublished, randomUserId);
  await expectStatusIs(sourceId, privateStatusPublished, ownerId);
  await expectStatusIs(sourceId, privateStatusPublished, adminId);

  await expectStatusIs(draftId, draftPublishedPublic, randomUserId);
  await expectStatusIs(draftId, draftPublishedPublic, ownerId);
  await expectStatusIs(draftId, draftPublishedAdmin, adminId);

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
  await expectUnpublishFails(ownerId);
  await expectStatusIs(sourceId, publicStatusPublished, randomUserId);
  await expectStatusIs(sourceId, privateStatusPublished, ownerId);
  await expectStatusIs(sourceId, privateStatusPublished, adminId);

  const statusUnpublished: LibraryRelations = {
    activity: {
      status: "PENDING_REVIEW",
      comments: "Awesome problem set!",
      activityContentId: null,
      reviewRequestDate: approximateReviewRequestDate,
    },
  };
  const statusUnpublishedWithDraft: LibraryRelations = {
    activity: {
      ...statusUnpublished.activity!,
      activityContentId: draftId,
    },
  };
  await unpublishActivityFromLibrary({
    contentId: draftId,
    loggedInUserId: adminId,
  });
  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusUnpublished, ownerId);
  await expectStatusIs(sourceId, statusUnpublishedWithDraft, adminId);

  // Only admin can delete draft
  async function expectDeleteDraftFails(userId: Uint8Array) {
    await expect(() =>
      deleteDraftFromLibrary({
        contentId: draftId,
        loggedInUserId: userId,
      }),
    ).rejects.toThrowError();
  }
  await expectDeleteDraftFails(ownerId);
  await expectDeleteDraftFails(randomUserId);
  await deleteDraftFromLibrary({
    contentId: draftId,
    loggedInUserId: adminId,
  });
  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusUnpublished, ownerId);
  await expectStatusIs(sourceId, statusUnpublished, adminId);
});

test("activity must be draft to be published in library", async () => {
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
  await submitLibraryRequest({ loggedInUserId: ownerId, contentId });

  const admin = await createTestAdminUser();
  const adminId = admin.userId;
  // Immediately trying to publish fails
  await expect(() =>
    publishActivityToLibrary({
      draftId: contentId,
      loggedInUserId: adminId,
      comments: "aa",
    }),
  ).rejects.toThrowError();
});

test("owner requests library review, admin publishes", async () => {
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

  const approximateReviewRequestDate = new Date();

  const statusPending: LibraryRelations = {
    activity: {
      status: "PENDING_REVIEW",
      comments: "",
      activityContentId: null,
      reviewRequestDate: approximateReviewRequestDate,
    },
  };

  await submitLibraryRequest({ loggedInUserId: ownerId, contentId });
  await expectStatusIs(contentId, statusPending, ownerId);

  const { draftId } = await addDraftToLibrary({
    contentId,
    loggedInUserId: adminId,
  });
  await expectStatusIs(contentId, statusPending, ownerId);

  // Admin can see that activity was owner requested
  const sourceStatusPending: LibraryRelations = {
    source: {
      sourceContentId: contentId,
      status: "PENDING_REVIEW",
      comments: "",
      ownerRequested: true,
    },
  };
  await expectStatusIs(draftId, sourceStatusPending, adminId);

  await publishActivityToLibrary({
    draftId,
    loggedInUserId: adminId,
    comments: "some feedback",
  });
  const statusPublished: LibraryRelations = {
    activity: {
      status: "PUBLISHED",
      activityContentId: draftId,
      comments: "some feedback",
      reviewRequestDate: approximateReviewRequestDate,
    },
  };
  expectStatusIs(contentId, statusPublished, ownerId);
});

test("admin publishes to library without owner request", async () => {
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
  const { draftId } = await addDraftToLibrary({
    contentId,
    loggedInUserId: adminId,
  });

  const statusPending: LibraryRelations = {
    activity: {
      status: "PENDING_REVIEW",
      comments: "",
      activityContentId: null,
    },
  };
  const statusWithDraft: LibraryRelations = {
    activity: {
      ...statusPending.activity!,
      activityContentId: draftId,
    },
  };
  await expectStatusIs(contentId, statusWithDraft, adminId);
  await expectStatusIs(contentId, statusPending, ownerId);

  const draftStatusPending: LibraryRelations = {
    source: {
      status: "PENDING_REVIEW",
      comments: "",
      sourceContentId: contentId,
      ownerRequested: false,
    },
  };

  await expectStatusIs(draftId, draftStatusPending, adminId);
  await expectStatusIs(draftId, {}, ownerId);

  await publishActivityToLibrary({
    draftId,
    loggedInUserId: adminId,
    comments: "some feedback",
  });
  const statusPublished: LibraryRelations = {
    activity: {
      status: "PUBLISHED",
      comments: "some feedback",
      activityContentId: draftId,
    },
  };
  await expectStatusIs(contentId, statusPublished, adminId);
  await expectStatusIs(contentId, statusPublished, ownerId);

  const draftStatusPublished: LibraryRelations = {
    source: {
      status: "PUBLISHED",
      sourceContentId: contentId,
    },
  };
  const draftStatusPublishedAdmin: LibraryRelations = {
    source: {
      ...draftStatusPublished.source!,
      comments: "some feedback",
      ownerRequested: false,
    },
  };

  await expectStatusIs(draftId, draftStatusPublishedAdmin, adminId);
  await expectStatusIs(draftId, draftStatusPublished, ownerId);
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
  const { draftId } = await addDraftToLibrary({
    contentId,
    loggedInUserId: adminId,
  });
  await publishActivityToLibrary({
    draftId,
    loggedInUserId: adminId,
    comments: "some feedback",
  });

  let statusMeOwner: LibraryRelations = {
    activity: {
      status: "PUBLISHED",
      comments: "some feedback",
      activityContentId: draftId,
    },
  };
  let statusMeAdmin = statusMeOwner;
  let statusSourceOwner: LibraryRelations = {
    source: {
      status: "PUBLISHED",
      sourceContentId: contentId,
    },
  };
  let statusSourceAdmin: LibraryRelations = {
    source: {
      ...statusSourceOwner.source!,
      comments: "some feedback",
      ownerRequested: false,
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
      status: "PUBLISHED",
      comments: "some feedback",
      sourceContentId: null,
      ownerRequested: false,
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

test("deleting draft does not delete owner's original", async () => {
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
  const { draftId } = await addDraftToLibrary({
    contentId,
    loggedInUserId: adminId,
  });

  await deleteDraftFromLibrary({
    contentId: draftId,
    loggedInUserId: adminId,
  });

  // Verify this query does not throw an error
  const original = await getContent({
    contentId,
    loggedInUserId: ownerId,
  });
  expect(original.contentId).eqls(contentId);
});

test("Cannot add draft of curated activity", async () => {
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
  const { draftId: curatedId } = await addDraftToLibrary({
    contentId,
    loggedInUserId: adminId,
  });
  await publishActivityToLibrary({
    draftId: curatedId,
    loggedInUserId: adminId,
    comments: "",
  });

  // Throws error
  await expect(() =>
    addDraftToLibrary({
      contentId: curatedId,
      loggedInUserId: adminId,
    }),
  ).rejects.toThrowError();
});

test("List of pending requests updates", async () => {
  // We will test that the submit date is within 5 minutes after test start
  // aka a ~generally~ reasonable time
  const startTestTimestamp = Date.now();
  const generousUpperBoundTime = startTestTimestamp + 1000 * 60 * 5;

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

  function onlyRelevant({
    content,
    libraryRelations,
  }: {
    content: Content[];
    libraryRelations: LibraryRelations[];
  }) {
    const all = content.map((c, i) => ({
      content: c,
      libraryRelations: libraryRelations[i],
    }));
    const relevant = all.filter(
      ({ content, libraryRelations: _ }) =>
        isEqualUUID(content.contentId, sourceIds[0]) ||
        isEqualUUID(content.contentId, sourceIds[1]) ||
        isEqualUUID(content.contentId, sourceIds[2]),
    );
    return {
      content: relevant.map(({ content }) => content),
      libraryRelations: relevant.map(
        ({ libraryRelations }) => libraryRelations,
      ),
    };
  }

  // Non-admin cannot access pending requests
  await expect(() =>
    getPendingCurationRequests({ loggedInUserId: ownerId }),
  ).rejects.toThrowError();

  // No pending requests
  let requests = await getPendingCurationRequests({ loggedInUserId: adminId });
  requests = onlyRelevant(requests);
  expect(requests).eqls({ content: [], libraryRelations: [] });

  // Owner requests review for activity #1
  await submitLibraryRequest({
    loggedInUserId: ownerId,
    contentId: sourceIds[0],
  });
  requests = await getPendingCurationRequests({ loggedInUserId: adminId });
  requests = onlyRelevant(requests);

  function expectAtItemNum(
    itemNum: number,
    sourceId: Uint8Array,
    revisedId: Uint8Array | null,
  ) {
    expect(requests.content[itemNum].contentId).eqls(sourceId);
    expect(
      requests.libraryRelations[itemNum].activity!.activityContentId!,
    ).eqls(revisedId);
    expect(
      requests.libraryRelations[itemNum].activity!.reviewRequestDate!.getTime(),
    ).toBeGreaterThanOrEqual(startTestTimestamp);
    expect(
      requests.libraryRelations[itemNum].activity!.reviewRequestDate!.getTime(),
    ).toBeLessThan(generousUpperBoundTime);
  }

  function expectRequestsOldestToNewest() {
    let newestSeen = 0;
    for (const libRelations of requests.libraryRelations) {
      const date = libRelations.activity!.reviewRequestDate!.getTime();
      expect(date).toBeGreaterThanOrEqual(newestSeen);
      newestSeen = date;
    }
  }

  expect(requests.content.length).eqls(1);
  expect(requests.libraryRelations.length).eqls(1);
  expectRequestsOldestToNewest();
  expectAtItemNum(0, sourceIds[0], null);

  // Owner requests review for 3rd activity and then 2nd
  await submitLibraryRequest({
    loggedInUserId: ownerId,
    contentId: sourceIds[2],
  });
  await submitLibraryRequest({
    loggedInUserId: ownerId,
    contentId: sourceIds[1],
  });

  requests = await getPendingCurationRequests({ loggedInUserId: adminId });
  requests = onlyRelevant(requests);

  // The order should be the one in which they were requested, not the order they were made
  expect(requests.content.length).eqls(3);
  expect(requests.libraryRelations.length).eqls(3);
  expectRequestsOldestToNewest();
  expectAtItemNum(0, sourceIds[0], null);
  expectAtItemNum(1, sourceIds[2], null);
  expectAtItemNum(2, sourceIds[1], null);

  // Add draft of activity #3 and return #1 for revision
  const { draftId: draft3Id } = await addDraftToLibrary({
    contentId: sourceIds[2],
    loggedInUserId: adminId,
  });
  await markLibraryRequestNeedsRevision({
    sourceId: sourceIds[0],
    loggedInUserId: adminId,
    comments: "No, 1+1 does not equal 3.",
  });

  requests = await getPendingCurationRequests({ loggedInUserId: adminId });
  requests = onlyRelevant(requests);

  expect(requests.content.length).eqls(2);
  expect(requests.libraryRelations.length).eqls(2);
  expectRequestsOldestToNewest();
  expectAtItemNum(0, sourceIds[2], draft3Id);
  expectAtItemNum(1, sourceIds[1], null);

  // Publish activity #3, user removes request for #2
  await publishActivityToLibrary({
    draftId: draft3Id,
    loggedInUserId: adminId,
    comments: "Looks good.",
  });
  await cancelLibraryRequest({
    contentId: sourceIds[1],
    loggedInUserId: ownerId,
  });

  requests = await getPendingCurationRequests({ loggedInUserId: adminId });
  requests = onlyRelevant(requests);
  expect(requests).eqls({ content: [], libraryRelations: [] });

  // Unpublish activity #3, it reappears in the pending list
  await unpublishActivityFromLibrary({
    contentId: draft3Id,
    loggedInUserId: adminId,
  });

  requests = await getPendingCurationRequests({ loggedInUserId: adminId });
  requests = onlyRelevant(requests);

  expect(requests.content.length).eqls(1);
  expect(requests.libraryRelations.length).eqls(1);
  expectRequestsOldestToNewest();
  expectAtItemNum(0, sourceIds[2], draft3Id);

  // Owner re-requests review for #2 (cancelled) and #1 (needs revision)
  await submitLibraryRequest({
    loggedInUserId: ownerId,
    contentId: sourceIds[1],
  });
  await submitLibraryRequest({
    loggedInUserId: ownerId,
    contentId: sourceIds[0],
  });

  requests = await getPendingCurationRequests({ loggedInUserId: adminId });
  requests = onlyRelevant(requests);

  // New order: #3, #2, #1
  expect(requests.content.length).eqls(3);
  expect(requests.libraryRelations.length).eqls(3);
  expectRequestsOldestToNewest();
  expectAtItemNum(0, sourceIds[2], draft3Id);
  expectAtItemNum(1, sourceIds[1], null);
  expectAtItemNum(2, sourceIds[0], null);

  // Owner makes #2 private and deletes #3, they are not visible in list anymore
  await setContentIsPublic({
    contentId: sourceIds[1],
    loggedInUserId: ownerId,
    isPublic: false,
  });
  await deleteContent({ contentId: sourceIds[2], loggedInUserId: ownerId });

  requests = await getPendingCurationRequests({ loggedInUserId: adminId });
  requests = onlyRelevant(requests);
  expect(requests.content.length).eqls(1);
  expect(requests.libraryRelations.length).eqls(1);
  expectRequestsOldestToNewest();
  expectAtItemNum(0, sourceIds[0], null);
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
  const results = await getSingleLibraryRelations({contentId});
  expect(results).toEqual({});

  // curate activity
  const { userId : adminId } = await createTestAdminUser();
  const { draftId } = await addDraftToLibrary({
    contentId,
    loggedInUserId: adminId,
  });
  await publishActivityToLibrary({draftId, loggedInUserId: adminId, comments: ""});

  // No `loggedInUserId` provided
  const results2 = await getSingleLibraryRelations({contentId});
  const published: LibraryRelations = {
    activity: {
      status: "PUBLISHED",
      activityContentId: draftId,
    }
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

  // make public
  await setContentIsPublic({
    contentId,
    loggedInUserId: userId,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: contentId2,
    loggedInUserId: userId,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: contentId3,
    loggedInUserId: userId,
    isPublic: true,
  });
  
  // curate activity
  const { userId : adminId } = await createTestAdminUser();
  const { draftId } = await addDraftToLibrary({
    contentId,
    loggedInUserId: adminId,
  });
  const { draftId: draftId2 } = await addDraftToLibrary({
    contentId: contentId2,
    loggedInUserId: adminId,
  });
  const { draftId: draftId3 } = await addDraftToLibrary({
    contentId: contentId3,
    loggedInUserId: adminId,
  });
  await publishActivityToLibrary({draftId, loggedInUserId: adminId, comments: ""});
  await publishActivityToLibrary({draftId: draftId2, loggedInUserId: adminId, comments: ""});
  await publishActivityToLibrary({draftId: draftId3, loggedInUserId: adminId, comments: ""});

  // No `loggedInUserId` provided
  const results = await getMultipleLibraryRelations({contentIds: [contentId, contentId2, contentId3]});

  const expectedResults: LibraryRelations[] = [{
    activity: {
      status: "PUBLISHED",
      activityContentId: draftId,
    }
  },
  {
    activity: {
      status: "PUBLISHED",
      activityContentId: draftId2,
    }
  },
  {
    activity: {
      status: "PUBLISHED",
      activityContentId: draftId3,
    }
  }];
  expect(results).toEqual(expectedResults);
});

test.todo("getCurationContent and all its variations (and search!)");

test.todo("Admin can add folder in library");

test.todo("Add classification in library");

test.todo("Remove classification in library");

test.todo("Edit DoenetML in library");

test.todo("Rename activity in library");

test.todo("Move activity in library");

test.todo("Move activity to new folder in library");

test.todo("Cannot use normal sharing endpoints for library activities");

test.todo("Cannot add new non-remixed activity to library");

test.todo("Can view remix history of library activity");

test.todo("Library draft not visible to non-admin");

test.todo("Cannot remix folder into library");

test.todo("Admin cannot move content between library and their folders");
