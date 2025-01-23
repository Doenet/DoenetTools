import { expect, test } from "vitest";
import {
  addDraftToLibrary,
  cancelLibraryRequest,
  createActivity,
  deleteActivity,
  deleteDraftFromLibrary,
  getActivity,
  getLibraryStatus,
  makeActivityPrivate,
  makeActivityPublic,
  markLibraryRequestNeedsRevision,
  modifyCommentsOfLibraryRequest,
  publishActivityToLibrary,
  submitLibraryRequest,
  unpublishActivityFromLibrary,
} from "../model";
import { createTestAdminUser, createTestUser } from "./utils";

async function expectStatusIs(
  activityId: Uint8Array,
  desiredStatus: any,
  userId: Uint8Array,
) {
  const actualStatus = await getLibraryStatus({
    userId,
    id: activityId,
  });
  expect(actualStatus).eqls(desiredStatus);
}

test("user privileges for library", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();
  const { userId: randomUserId } = await createTestUser();

  const { activityId } = await createActivity(ownerId, null);

  // No library status for private activity
  const statusNone = { status: "none" };
  await expectStatusIs(activityId, statusNone, ownerId);
  await expectStatusIs(activityId, statusNone, adminId);
  await expectStatusIs(activityId, statusNone, randomUserId);

  // Cannot request review for private activity
  // owner
  async function expectSubmitRequestFails(userId: Uint8Array) {
    await expect(() =>
      submitLibraryRequest({ activityId, ownerId: userId }),
    ).rejects.toThrowError();
  }
  await expectSubmitRequestFails(ownerId);
  await expectSubmitRequestFails(adminId);
  await expectSubmitRequestFails(randomUserId);
  await expectStatusIs(activityId, statusNone, ownerId);
  await expectStatusIs(activityId, statusNone, adminId);
  await expectStatusIs(activityId, statusNone, randomUserId);

  await makeActivityPublic({
    id: activityId,
    ownerId,
    licenseCode: "CCDUAL",
  });

  const statusPending = {
    status: "PENDING_REVIEW",
    comments: "",
  };

  // Only owner can request review
  await expectSubmitRequestFails(adminId);
  await expectStatusIs(activityId, statusNone, adminId);
  await expectSubmitRequestFails(randomUserId);
  await expectStatusIs(activityId, statusNone, randomUserId);

  await submitLibraryRequest({ ownerId, activityId });
  await expectStatusIs(activityId, statusPending, ownerId);

  // Only admin can add draft
  async function expectAddDraftFails(userId: Uint8Array) {
    await expect(() =>
      addDraftToLibrary({ id: activityId, loggedInUserId: userId }),
    ).rejects.toThrowError();
  }

  await expectAddDraftFails(randomUserId);
  await expectAddDraftFails(ownerId);

  const { draftId } = await addDraftToLibrary({
    id: activityId,
    loggedInUserId: adminId,
  });
  const statusPendingWithDraft = {
    ...statusPending,
    activityId: draftId,
  };
  await expectStatusIs(activityId, statusNone, randomUserId);
  await expectStatusIs(activityId, statusPending, ownerId);
  await expectStatusIs(activityId, statusPendingWithDraft, adminId);

  // Only owner can cancel review request
  async function expectCancelRequestFails(userId: Uint8Array) {
    await expect(() =>
      cancelLibraryRequest({ activityId, ownerId: userId }),
    ).rejects.toThrowError();
  }

  await expectCancelRequestFails(randomUserId);
  await expectCancelRequestFails(adminId);

  const statusCancelled = {
    status: "REQUEST_REMOVED",
    comments: "",
  };
  const statusCancelledWithDraft = {
    ...statusCancelled,
    activityId: draftId,
  };
  await cancelLibraryRequest({ activityId, ownerId });
  await expectStatusIs(activityId, statusNone, randomUserId);
  await expectStatusIs(activityId, statusCancelled, ownerId);
  await expectStatusIs(activityId, statusCancelledWithDraft, adminId);

  // Add request back
  await submitLibraryRequest({ ownerId, activityId });

  // Only admin can return for revision
  async function expectSendBackFails(userId: Uint8Array) {
    await expect(() =>
      markLibraryRequestNeedsRevision({
        sourceId: activityId,
        userId,
        comments: "Please fix such and such.",
      }),
    ).rejects.toThrowError();
  }
  await expectSendBackFails(randomUserId);
  await expectSendBackFails(ownerId);

  await markLibraryRequestNeedsRevision({
    sourceId: activityId,
    userId: adminId,
    comments: "Please fix such and such.",
  });

  const statusNeedsRev = {
    status: "NEEDS_REVISION",
    comments: "Please fix such and such.",
  };
  const statusNeedsRevWithDraft = {
    ...statusNeedsRev,
    activityId: draftId,
  };
  await expectStatusIs(activityId, statusNone, randomUserId);
  await expectStatusIs(activityId, statusNeedsRev, ownerId);
  await expectStatusIs(activityId, statusNeedsRevWithDraft, adminId);

  // Only admin can modify comments
  async function expectModifyCommentsFails(userId: Uint8Array) {
    await expect(() =>
      modifyCommentsOfLibraryRequest({
        sourceId: activityId,
        comments: "I have new comments.",
        userId,
      }),
    ).rejects.toThrowError();
  }

  const statusNewComments = {
    status: "NEEDS_REVISION",
    comments: "I have new comments.",
  };
  const statusNewCommentsWithDraft = {
    ...statusNewComments,
    activityId: draftId,
  };
  await expectModifyCommentsFails(randomUserId);
  await expectModifyCommentsFails(ownerId);
  await modifyCommentsOfLibraryRequest({
    sourceId: activityId,
    comments: "I have new comments.",
    userId: adminId,
  });
  await expectStatusIs(activityId, statusNone, randomUserId);
  await expectStatusIs(activityId, statusNewComments, ownerId);
  await expectStatusIs(activityId, statusNewCommentsWithDraft, adminId);

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
  await expectStatusIs(activityId, statusNone, randomUserId);
  await expectStatusIs(activityId, statusNewComments, ownerId);
  await expectStatusIs(activityId, statusNewCommentsWithDraft, adminId);

  const publicStatusPublished = {
    status: "PUBLISHED",
    activityId: draftId,
  };
  const privateStatusPublished = {
    ...publicStatusPublished,
    comments: "Awesome problem set!",
  };
  await publishActivityToLibrary({
    draftId,
    loggedInUserId: adminId,
    comments: "Awesome problem set!",
  });
  await expectStatusIs(activityId, publicStatusPublished, randomUserId);
  await expectStatusIs(activityId, privateStatusPublished, ownerId);
  await expectStatusIs(activityId, privateStatusPublished, adminId);

  // Only admin can unpublish
  async function expectUnpublishFails(userId: Uint8Array) {
    await expect(() =>
      unpublishActivityFromLibrary({
        activityId: draftId,
        loggedInUserId: userId,
      }),
    ).rejects.toThrowError();
  }
  await expectUnpublishFails(randomUserId);
  await expectUnpublishFails(ownerId);
  await expectStatusIs(activityId, publicStatusPublished, randomUserId);
  await expectStatusIs(activityId, privateStatusPublished, ownerId);
  await expectStatusIs(activityId, privateStatusPublished, adminId);

  const statusUnpublished = {
    status: "PENDING_REVIEW",
    comments: "Awesome problem set!",
  };
  const statusUnpublishedWithDraft = {
    ...statusUnpublished,
    activityId: draftId,
  };
  await unpublishActivityFromLibrary({
    activityId: draftId,
    loggedInUserId: adminId,
  });
  await expectStatusIs(activityId, statusNone, randomUserId);
  await expectStatusIs(activityId, statusUnpublished, ownerId);
  await expectStatusIs(activityId, statusUnpublishedWithDraft, adminId);

  // Only admin can delete draft
  async function expectDeleteDraftFails(userId: Uint8Array) {
    await expect(() =>
      deleteDraftFromLibrary({ draftId, loggedInUserId: userId }),
    ).rejects.toThrowError();
  }
  await expectDeleteDraftFails(ownerId);
  await expectDeleteDraftFails(randomUserId);
  await deleteDraftFromLibrary({ draftId, loggedInUserId: adminId });
  await expectStatusIs(activityId, statusNone, randomUserId);
  await expectStatusIs(activityId, statusUnpublished, ownerId);
  await expectStatusIs(activityId, statusUnpublished, adminId);
});

test("activity must be draft to be published in library", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId,
    ownerId,
    licenseCode: "CCDUAL",
  });
  await submitLibraryRequest({ ownerId, activityId });

  const admin = await createTestAdminUser();
  const adminId = admin.userId;
  // Immediately trying to publish fails
  await expect(() =>
    publishActivityToLibrary({
      draftId: activityId,
      loggedInUserId: adminId,
      comments: "aa",
    }),
  ).rejects.toThrowError();
});

test("owner requests library review, admin publishes", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();

  const { activityId } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId,
    ownerId,
    licenseCode: "CCDUAL",
  });

  let status = {
    status: "PENDING_REVIEW",
    comments: "",
  };
  await submitLibraryRequest({ ownerId, activityId });
  await expectStatusIs(activityId, status, ownerId);

  const { draftId } = await addDraftToLibrary({
    id: activityId,
    loggedInUserId: adminId,
  });
  await expectStatusIs(activityId, status, ownerId);

  await publishActivityToLibrary({
    draftId,
    loggedInUserId: adminId,
    comments: "some feedback",
  });
  const statusPublished = {
    status: "PUBLISHED",
    comments: "some feedback",
    activityId: draftId,
  };
  expectStatusIs(activityId, statusPublished, ownerId);
});

test("admin publishes to library without owner request", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();

  const { activityId } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId,
    ownerId,
    licenseCode: "CCDUAL",
  });
  const { draftId } = await addDraftToLibrary({
    id: activityId,
    loggedInUserId: adminId,
  });

  const status = {
    status: "PENDING_REVIEW",
    comments: "",
  };
  const statusWithDraft = {
    ...status,
    activityId: draftId,
  };
  await expectStatusIs(activityId, statusWithDraft, adminId);
  await expectStatusIs(activityId, status, ownerId);

  await publishActivityToLibrary({
    draftId,
    loggedInUserId: adminId,
    comments: "some feedback",
  });
  const statusPublished = {
    status: "PUBLISHED",
    comments: "some feedback",
    activityId: draftId,
  };
  await expectStatusIs(activityId, statusPublished, adminId);
  await expectStatusIs(activityId, statusPublished, ownerId);
});

test("published activity in library with unavailable source activity", async () => {
  // Setup
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();
  const { activityId } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId,
    ownerId,
    licenseCode: "CCDUAL",
  });

  // Publish
  const { draftId } = await addDraftToLibrary({
    id: activityId,
    loggedInUserId: adminId,
  });
  await publishActivityToLibrary({
    draftId,
    loggedInUserId: adminId,
    comments: "some feedback",
  });

  const status = {
    status: "PUBLISHED",
    comments: "some feedback",
    activityId: draftId,
  };

  // Owner makes their activity private, library remix still published
  await makeActivityPrivate({ id: activityId, ownerId });
  await expectStatusIs(activityId, status, adminId);
  await expectStatusIs(activityId, status, ownerId);

  // Onwer deletes activity, remix still published
  await deleteActivity(activityId, ownerId);
  await expectStatusIs(activityId, status, adminId);
  await expectStatusIs(activityId, status, ownerId);
});

test("deleting draft does not delete owner's original", async () => {
  // Setup
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();
  const { activityId } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId,
    ownerId,
    licenseCode: "CCDUAL",
  });
  const { draftId } = await addDraftToLibrary({
    id: activityId,
    loggedInUserId: adminId,
  });

  await deleteDraftFromLibrary({ draftId, loggedInUserId: adminId });
  const original = await getActivity(activityId);
  expect(original.id).eqls(activityId);
  expect(original.isDeleted).eqls(false);
});
