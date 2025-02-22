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
import { setContentIsPublic } from "../query/share";
import { getContent } from "../query/activity_edit_view";

async function expectStatusIs(
  contentId: Uint8Array,
  desiredStatus: LibraryInfo,
  userId: Uint8Array,
) {
  const actualStatus = await getLibraryStatus({
    userId,
    id: contentId,
  });
  expect(actualStatus).eqls(desiredStatus);
}

test("user privileges for library", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: adminId } = await createTestAdminUser();
  const { userId: randomUserId } = await createTestUser();

  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  // No library status for private activity
  const statusNone: LibraryInfo = {
    status: "none",
    sourceId: contentId,
    contentId: null,
  };
  await expectStatusIs(contentId, statusNone, ownerId);
  await expectStatusIs(contentId, statusNone, adminId);
  await expectStatusIs(contentId, statusNone, randomUserId);

  // Cannot request review for private activity
  // owner
  async function expectSubmitRequestFails(userId: Uint8Array) {
    await expect(() =>
      submitLibraryRequest({ contentId, ownerId: userId }),
    ).rejects.toThrowError();
  }
  await expectSubmitRequestFails(ownerId);
  await expectSubmitRequestFails(adminId);
  await expectSubmitRequestFails(randomUserId);
  await expectStatusIs(contentId, statusNone, ownerId);
  await expectStatusIs(contentId, statusNone, adminId);
  await expectStatusIs(contentId, statusNone, randomUserId);

  // await setContentLicense({contentId, loggedInUserId: ownerId, licenseCode: "CCDUAL"});

  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  const statusPending: LibraryInfo = {
    status: "PENDING_REVIEW",
    comments: "",
    sourceId: contentId,
    contentId: null,
  };

  // Only owner can request review
  await expectSubmitRequestFails(adminId);
  await expectStatusIs(contentId, statusNone, adminId);
  await expectSubmitRequestFails(randomUserId);
  await expectStatusIs(contentId, statusNone, randomUserId);

  await submitLibraryRequest({ ownerId, contentId });
  await expectStatusIs(contentId, statusPending, ownerId);

  // Only admin can add draft
  async function expectAddDraftFails(userId: Uint8Array) {
    await expect(() =>
      addDraftToLibrary({
        contentId,
        loggedInUserId: userId,
      }),
    ).rejects.toThrowError();
  }

  await expectAddDraftFails(randomUserId);
  await expectAddDraftFails(ownerId);

  const { draftId } = await addDraftToLibrary({
    contentId,
    loggedInUserId: adminId,
  });
  const statusPendingWithDraft = {
    ...statusPending,
    contentId: draftId,
  };
  await expectStatusIs(contentId, statusNone, randomUserId);
  await expectStatusIs(contentId, statusPending, ownerId);
  await expectStatusIs(contentId, statusPendingWithDraft, adminId);

  // Only owner can cancel review request
  async function expectCancelRequestFails(userId: Uint8Array) {
    await expect(() =>
      cancelLibraryRequest({ contentId, ownerId: userId }),
    ).rejects.toThrowError();
  }

  await expectCancelRequestFails(randomUserId);
  await expectCancelRequestFails(adminId);

  const statusCancelled: LibraryInfo = {
    sourceId: contentId,
    status: "REQUEST_REMOVED",
    comments: "",
    contentId: null,
  };
  const statusCancelledWithDraft = {
    ...statusCancelled,
    contentId: draftId,
  };
  await cancelLibraryRequest({ contentId, ownerId });
  await expectStatusIs(contentId, statusNone, randomUserId);
  await expectStatusIs(contentId, statusCancelled, ownerId);
  await expectStatusIs(contentId, statusCancelledWithDraft, adminId);

  // Add request back
  await submitLibraryRequest({ ownerId, contentId });

  // Only admin can return for revision
  async function expectSendBackFails(userId: Uint8Array) {
    await expect(() =>
      markLibraryRequestNeedsRevision({
        sourceId: contentId,
        userId,
        comments: "Please fix such and such.",
      }),
    ).rejects.toThrowError();
  }
  await expectSendBackFails(randomUserId);
  await expectSendBackFails(ownerId);

  await markLibraryRequestNeedsRevision({
    sourceId: contentId,
    userId: adminId,
    comments: "Please fix such and such.",
  });

  const statusNeedsRev: LibraryInfo = {
    sourceId: contentId,
    status: "NEEDS_REVISION",
    comments: "Please fix such and such.",
    contentId: null,
  };
  const statusNeedsRevWithDraft: LibraryInfo = {
    ...statusNeedsRev,
    contentId: draftId,
  };
  await expectStatusIs(contentId, statusNone, randomUserId);
  await expectStatusIs(contentId, statusNeedsRev, ownerId);
  await expectStatusIs(contentId, statusNeedsRevWithDraft, adminId);

  // Only admin can modify comments
  async function expectModifyCommentsFails(userId: Uint8Array) {
    await expect(() =>
      modifyCommentsOfLibraryRequest({
        sourceId: contentId,
        comments: "I have new comments.",
        userId,
      }),
    ).rejects.toThrowError();
  }

  const statusNewComments: LibraryInfo = {
    sourceId: contentId,
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
    sourceId: contentId,
    comments: "I have new comments.",
    userId: adminId,
  });
  await expectStatusIs(contentId, statusNone, randomUserId);
  await expectStatusIs(contentId, statusNewComments, ownerId);
  await expectStatusIs(contentId, statusNewCommentsWithDraft, adminId);

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
  await expectStatusIs(contentId, statusNone, randomUserId);
  await expectStatusIs(contentId, statusNewComments, ownerId);
  await expectStatusIs(contentId, statusNewCommentsWithDraft, adminId);

  const publicStatusPublished: LibraryInfo = {
    sourceId: contentId,
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
  await expectStatusIs(contentId, publicStatusPublished, randomUserId);
  await expectStatusIs(contentId, privateStatusPublished, ownerId);
  await expectStatusIs(contentId, privateStatusPublished, adminId);

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
  await expectStatusIs(contentId, publicStatusPublished, randomUserId);
  await expectStatusIs(contentId, privateStatusPublished, ownerId);
  await expectStatusIs(contentId, privateStatusPublished, adminId);

  const statusUnpublished: LibraryInfo = {
    sourceId: contentId,
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
  await expectStatusIs(contentId, statusNone, randomUserId);
  await expectStatusIs(contentId, statusUnpublished, ownerId);
  await expectStatusIs(contentId, statusUnpublishedWithDraft, adminId);

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
  await expectStatusIs(contentId, statusNone, randomUserId);
  await expectStatusIs(contentId, statusUnpublished, ownerId);
  await expectStatusIs(contentId, statusUnpublished, adminId);
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
  await submitLibraryRequest({ ownerId, contentId });

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
  await submitLibraryRequest({ ownerId, contentId });
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
  await deleteContent(contentId, ownerId);
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
    draftId,
    contentType: "singleDoc",
    loggedInUserId: adminId,
  });

  // Verify this query does not throw an error
  const original = await getContent({
    contentId,
    loggedInUserId: ownerId,
  });
  expect(original.id).eqls(contentId);
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
