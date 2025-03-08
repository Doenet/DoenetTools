import { expect, test } from "vitest";
import { createTestAdminUser, createTestUser } from "./utils";
import { LibraryInfo } from "../types";
import {
  getLibraryStatus,
  submitLibraryRequest,
  addDraftToLibrary,
  cancelLibraryRequest,
  markLibraryRequestNeedsRevision,
  modifyCommentsOfLibraryRequest,
  publishActivityToLibrary,
  unpublishActivityFromLibrary,
  deleteDraftFromLibrary,
  getPendingCurationRequests,
} from "../query/curate";
import { createContent, deleteContent } from "../query/activity";
import { setContentIsPublic } from "../query/share";
import { getContent } from "../query/activity_edit_view";
import { isEqualUUID } from "../utils/uuid";

async function expectStatusIs(
  sourceId: Uint8Array,
  desiredStatus: LibraryInfo,
  loggedInUserId: Uint8Array,
) {
  const actualStatus = await getLibraryStatus({
    loggedInUserId,
    sourceId,
  });
  expect(actualStatus).eqls(desiredStatus);
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
  const statusNone: LibraryInfo = {
    status: "none",
    sourceId: sourceId,
    contentId: null,
  };
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

  // await setContentLicense({contentId, loggedInUserId: ownerId, licenseCode: "CCDUAL"});

  await setContentIsPublic({
    contentId: sourceId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  const statusPending: LibraryInfo = {
    status: "PENDING_REVIEW",
    comments: "",
    sourceId: sourceId,
    contentId: null,
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
  const statusPendingWithDraft = {
    ...statusPending,
    contentId: draftId,
  };
  await expectStatusIs(sourceId, statusNone, randomUserId);
  await expectStatusIs(sourceId, statusPending, ownerId);
  await expectStatusIs(sourceId, statusPendingWithDraft, adminId);

  // Only owner can cancel review request
  async function expectCancelRequestFails(userId: Uint8Array) {
    await expect(() =>
      cancelLibraryRequest({ contentId: sourceId, loggedInUserId: userId }),
    ).rejects.toThrowError();
  }

  await expectCancelRequestFails(randomUserId);
  await expectCancelRequestFails(adminId);

  const statusCancelled: LibraryInfo = {
    sourceId: sourceId,
    status: "REQUEST_REMOVED",
    comments: "",
    contentId: null,
  };
  const statusCancelledWithDraft = {
    ...statusCancelled,
    contentId: draftId,
  };
  await cancelLibraryRequest({ contentId: sourceId, loggedInUserId: ownerId });
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

  const statusNeedsRev: LibraryInfo = {
    sourceId: sourceId,
    status: "NEEDS_REVISION",
    comments: "Please fix such and such.",
    contentId: null,
  };
  const statusNeedsRevWithDraft: LibraryInfo = {
    ...statusNeedsRev,
    contentId: draftId,
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

  const statusNewComments: LibraryInfo = {
    sourceId: sourceId,
    status: "NEEDS_REVISION",
    comments: "I have new comments.",
    contentId: null,
  };
  const statusNewCommentsWithDraft = {
    ...statusNewComments,
    contentId: draftId,
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

  const publicStatusPublished: LibraryInfo = {
    sourceId: sourceId,
    status: "PUBLISHED",
    contentId: draftId,
  };
  const privateStatusPublished: LibraryInfo = {
    ...publicStatusPublished,
    comments: "Awesome problem set!",
  };
  await publishActivityToLibrary({
    draftId,
    loggedInUserId: adminId,
    comments: "Awesome problem set!",
  });
  await expectStatusIs(sourceId, publicStatusPublished, randomUserId);
  await expectStatusIs(sourceId, privateStatusPublished, ownerId);
  await expectStatusIs(sourceId, privateStatusPublished, adminId);

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

  const statusUnpublished: LibraryInfo = {
    sourceId: sourceId,
    status: "PENDING_REVIEW",
    comments: "Awesome problem set!",
    contentId: null,
  };
  const statusUnpublishedWithDraft = {
    ...statusUnpublished,
    contentId: draftId,
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

  const status: LibraryInfo = {
    sourceId: contentId,
    status: "PENDING_REVIEW",
    comments: "",
    contentId: null,
  };
  await submitLibraryRequest({ loggedInUserId: ownerId, contentId });
  await expectStatusIs(contentId, status, ownerId);

  const { draftId } = await addDraftToLibrary({
    contentId,
    loggedInUserId: adminId,
  });
  await expectStatusIs(contentId, status, ownerId);

  await publishActivityToLibrary({
    draftId,
    loggedInUserId: adminId,
    comments: "some feedback",
  });
  const statusPublished: LibraryInfo = {
    sourceId: contentId,
    status: "PUBLISHED",
    comments: "some feedback",
    contentId: draftId,
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

  const status: LibraryInfo = {
    sourceId: contentId,
    status: "PENDING_REVIEW",
    comments: "",
    contentId: null,
  };
  const statusWithDraft: LibraryInfo = {
    ...status,
    contentId: draftId,
  };
  await expectStatusIs(contentId, statusWithDraft, adminId);
  await expectStatusIs(contentId, status, ownerId);

  await publishActivityToLibrary({
    draftId,
    loggedInUserId: adminId,
    comments: "some feedback",
  });
  const statusPublished: LibraryInfo = {
    sourceId: contentId,
    status: "PUBLISHED",
    comments: "some feedback",
    contentId: draftId,
  };
  await expectStatusIs(contentId, statusPublished, adminId);
  await expectStatusIs(contentId, statusPublished, ownerId);
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

  const status: LibraryInfo = {
    sourceId: contentId,
    status: "PUBLISHED",
    comments: "some feedback",
    contentId: draftId,
  };

  // Owner makes their activity private, library remix still published
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: false,
  });
  await expectStatusIs(contentId, status, adminId);
  await expectStatusIs(contentId, status, ownerId);

  // Owner deletes activity, remix still published
  await deleteContent({ contentId: contentId, loggedInUserId: ownerId });
  await expectStatusIs(contentId, status, adminId);
  await expectStatusIs(contentId, status, ownerId);
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

  let sourceIds: Uint8Array[] = [];
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

  // Non-admin cannot access all pending requests
  await expect(() =>
    getPendingCurationRequests({ loggedInUserId: ownerId }),
  ).rejects.toThrowError();

  // No pending requests
  let requests = await getPendingCurationRequests({ loggedInUserId: adminId });

  function onlyRelevant(
    requests: {
      sourceId: Uint8Array;
      contentId: Uint8Array | null;
      submitDate: Date;
    }[],
  ) {
    return requests.filter(
      ({ sourceId: source }) =>
        isEqualUUID(source, sourceIds[0]) ||
        isEqualUUID(source, sourceIds[1]) ||
        isEqualUUID(source, sourceIds[2]),
    );
  }

  requests = requests.filter((r) => sourceIds.includes(r.sourceId));
  requests = onlyRelevant(requests);
  expect(requests).eqls([]);

  // Owner requests review for activity #1
  await submitLibraryRequest({
    loggedInUserId: ownerId,
    contentId: sourceIds[0],
  });
  requests = await getPendingCurationRequests({ loggedInUserId: adminId });

  requests = onlyRelevant(requests);

  expect(requests.length).eqls(1);
  expect(requests[0].sourceId).eqls(sourceIds[0]);
  expect(requests[0].contentId).eqls(null);
  expect(requests[0].submitDate.getTime()).toBeGreaterThanOrEqual(
    startTestTimestamp,
  );
  expect(requests[0].submitDate.getTime()).toBeLessThan(generousUpperBoundTime);

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

  console.log(requests.map((r) => r.submitDate.getTime() % 10000000));

  // The order should be the one in which they were requested, not the order they were made
  expect(requests.length).eqls(3);
  expect(requests[0].sourceId).eqls(sourceIds[0]);
  expect(requests[0].contentId).eqls(null);
  expect(requests[0].submitDate.getTime()).toBeGreaterThanOrEqual(
    startTestTimestamp,
  );
  expect(requests[0].submitDate.getTime()).toBeLessThan(generousUpperBoundTime);

  expect(requests[1].sourceId).eqls(sourceIds[2]);
  expect(requests[1].contentId).eqls(null);
  expect(requests[1].submitDate.getTime()).toBeGreaterThanOrEqual(
    startTestTimestamp,
  );
  expect(requests[1].submitDate.getTime()).toBeLessThan(generousUpperBoundTime);

  expect(requests[2].sourceId).eqls(sourceIds[1]);
  expect(requests[2].contentId).eqls(null);
  expect(requests[2].submitDate.getTime()).toBeGreaterThanOrEqual(
    startTestTimestamp,
  );
  expect(requests[2].submitDate.getTime()).toBeLessThan(generousUpperBoundTime);

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

  expect(requests.length).eqls(2);
  expect(requests[0].sourceId).eqls(sourceIds[2]);
  expect(requests[0].contentId).eqls(draft3Id);
  expect(requests[0].submitDate.getTime()).toBeGreaterThanOrEqual(
    startTestTimestamp,
  );
  expect(requests[0].submitDate.getTime()).toBeLessThan(generousUpperBoundTime);

  expect(requests[1].sourceId).eqls(sourceIds[1]);
  expect(requests[1].contentId).eqls(null);
  expect(requests[1].submitDate.getTime()).toBeGreaterThanOrEqual(
    startTestTimestamp,
  );
  expect(requests[1].submitDate.getTime()).toBeLessThan(generousUpperBoundTime);

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

  expect(requests).eqls([]);

  // Unpublish activity #3, it reappears in the pending list
  await unpublishActivityFromLibrary({
    contentId: draft3Id,
    loggedInUserId: adminId,
  });

  requests = await getPendingCurationRequests({ loggedInUserId: adminId });
  requests = onlyRelevant(requests);

  expect(requests.length).eqls(1);
  expect(requests[0].sourceId).eqls(sourceIds[2]);
  expect(requests[0].contentId).eqls(draft3Id);
  expect(requests[0].submitDate.getTime()).toBeGreaterThanOrEqual(
    startTestTimestamp,
  );
  expect(requests[0].submitDate.getTime()).toBeLessThan(generousUpperBoundTime);

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
  expect(requests.length).eqls(3);
  expect(requests[0].sourceId).eqls(sourceIds[2]);
  expect(requests[0].contentId).eqls(draft3Id);
  expect(requests[0].submitDate.getTime()).toBeGreaterThanOrEqual(
    startTestTimestamp,
  );
  expect(requests[0].submitDate.getTime()).toBeLessThan(generousUpperBoundTime);

  expect(requests[1].sourceId).eqls(sourceIds[1]);
  expect(requests[1].contentId).eqls(null);
  expect(requests[1].submitDate.getTime()).toBeGreaterThanOrEqual(
    startTestTimestamp,
  );
  expect(requests[1].submitDate.getTime()).toBeLessThan(generousUpperBoundTime);

  expect(requests[2].sourceId).eqls(sourceIds[0]);
  expect(requests[2].contentId).eqls(null);
  expect(requests[2].submitDate.getTime()).toBeGreaterThanOrEqual(
    startTestTimestamp,
  );
  expect(requests[2].submitDate.getTime()).toBeLessThan(generousUpperBoundTime);
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
