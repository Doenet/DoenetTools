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
} from "../query/curate";
import { createContent, deleteContent } from "../query/activity";
import { setContentIsPublic, setContentLicense } from "../query/share";
import { getContent } from "../query/activity_edit_view";

async function expectStatusIs(
  activityId: Uint8Array,
  desiredStatus: LibraryInfo,
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

  const { contentId: activityId } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

  // No library status for private activity
  const statusNone: LibraryInfo = {
    status: "none",
    sourceId: activityId,
    activityId: null,
  };
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

  // await setContentLicense({contentId: activityId, loggedInUserId: ownerId, licenseCode: "CCDUAL"});

  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  const statusPending: LibraryInfo = {
    status: "PENDING_REVIEW",
    comments: "",
    sourceId: activityId,
    activityId: null,
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
      addDraftToLibrary({
        id: activityId,
        loggedInUserId: userId,
      }),
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

  const statusCancelled: LibraryInfo = {
    sourceId: activityId,
    status: "REQUEST_REMOVED",
    comments: "",
    activityId: null,
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

  const statusNeedsRev: LibraryInfo = {
    sourceId: activityId,
    status: "NEEDS_REVISION",
    comments: "Please fix such and such.",
    activityId: null,
  };
  const statusNeedsRevWithDraft: LibraryInfo = {
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

  const statusNewComments: LibraryInfo = {
    sourceId: activityId,
    status: "NEEDS_REVISION",
    comments: "I have new comments.",
    activityId: null,
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

  const publicStatusPublished: LibraryInfo = {
    sourceId: activityId,
    status: "PUBLISHED",
    activityId: draftId,
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

  const statusUnpublished: LibraryInfo = {
    sourceId: activityId,
    status: "PENDING_REVIEW",
    comments: "Awesome problem set!",
    activityId: null,
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
      deleteDraftFromLibrary({
        draftId,
        contentType: "singleDoc",
        loggedInUserId: userId,
      }),
    ).rejects.toThrowError();
  }
  await expectDeleteDraftFails(ownerId);
  await expectDeleteDraftFails(randomUserId);
  await deleteDraftFromLibrary({
    draftId,
    contentType: "singleDoc",
    loggedInUserId: adminId,
  });
  await expectStatusIs(activityId, statusNone, randomUserId);
  await expectStatusIs(activityId, statusUnpublished, ownerId);
  await expectStatusIs(activityId, statusUnpublished, adminId);
});

test("activity must be draft to be published in library", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: activityId } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
    // licenseCode: "CCDUAL",
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

  const { contentId: activityId } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  const status: LibraryInfo = {
    sourceId: activityId,
    status: "PENDING_REVIEW",
    comments: "",
    activityId: null,
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
  const statusPublished: LibraryInfo = {
    sourceId: activityId,
    status: "PUBLISHED",
    comments: "some feedback",
    activityId: draftId,
  };
  expectStatusIs(activityId, statusPublished, ownerId);
});

test("admin publishes to library without owner request", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();

  const { contentId: activityId } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  const { draftId } = await addDraftToLibrary({
    id: activityId,
    loggedInUserId: adminId,
  });

  const status: LibraryInfo = {
    sourceId: activityId,
    status: "PENDING_REVIEW",
    comments: "",
    activityId: null,
  };
  const statusWithDraft: LibraryInfo = {
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
  const statusPublished: LibraryInfo = {
    sourceId: activityId,
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
  const { contentId: activityId } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
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

  const status: LibraryInfo = {
    sourceId: activityId,
    status: "PUBLISHED",
    comments: "some feedback",
    activityId: draftId,
  };

  // Owner makes their activity private, library remix still published
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: false,
  });
  await expectStatusIs(activityId, status, adminId);
  await expectStatusIs(activityId, status, ownerId);

  // Owner deletes activity, remix still published
  await deleteContent(activityId, ownerId);
  await expectStatusIs(activityId, status, adminId);
  await expectStatusIs(activityId, status, ownerId);
});

test("deleting draft does not delete owner's original", async () => {
  // Setup
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();
  const { contentId: activityId } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  const { draftId } = await addDraftToLibrary({
    id: activityId,
    loggedInUserId: adminId,
  });

  await deleteDraftFromLibrary({
    draftId,
    contentType: "singleDoc",
    loggedInUserId: adminId,
  });

  // Verify this query does not throw an error
  const original = await getContent({
    contentId: activityId,
    loggedInUserId: ownerId,
  });
  expect(original.id).eqls(activityId);
});

test("Cannot add draft of curated activity", async () => {
  // Setup
  const { userId: adminId } = await createTestAdminUser();
  const { contentId: activityId } = await createContent(
    adminId,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: adminId,
    isPublic: true,
  });
  const { draftId: curatedId } = await addDraftToLibrary({
    id: activityId,
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
      id: curatedId,
      loggedInUserId: adminId,
    }),
  ).rejects.toThrowError();
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
