import { expect, test, vi } from "vitest";

import { DateTime } from "luxon";
import { Content, Doc } from "../types";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createTestUser } from "./utils";
import {
  createContent,
  deleteContent,
  getAllDoenetmlVersions,
  getContentSource,
  updateContent,
  getContentDescription,
  createContentRevision,
  revertToRevision,
  restoreDeletedContent,
} from "../query/activity";
import {
  getActivityEditorData,
  getActivityViewerData,
  getSharedEditorData,
} from "../query/activity_edit_view";
import { getMyContent, getMyTrash } from "../query/content_list";
import { InvalidRequestError } from "../utils/error";
import {
  modifyContentSharedWith,
  setContentIsPublic,
  setContentLicense,
} from "../query/share";
import {
  assignActivity,
  closeAssignmentWithCode,
  openAssignmentWithCode,
  unassignActivity,
} from "../query/assign";
import { createNewAttempt, saveScoreAndState } from "../query/scores";
import { moveContent } from "../query/copy_move";
import { prisma } from "../model";

// const EMPTY_DOC_CID =
//   "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

const currentDoenetmlVersion = {
  id: 2,
  displayedVersion: "0.7",
  fullVersion: "0.7.0-alpha39",
  default: true,
  deprecated: false,
  removed: false,
  deprecationMessage: "",
};

test("New activity starts out private, then delete it", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: null,
  });
  const { activity: activityContent } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: userId,
  });

  if (!activityContent) {
    throw Error("Shouldn't happen");
  }

  const expectedContent: Doc = {
    contentId: contentId,
    name: "Untitled Document",
    ownerId: userId,
    isPublic: false,
    isShared: false,
    contentFeatures: [],
    sharedWith: [],
    numVariants: 1,
    licenseCode: null,
    type: "singleDoc",
    classifications: [],
    doenetML: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
  };

  expect(activityContent.licenseCode).eq("CCDUAL");

  // set license to null as it is too long to compare in its entirety.
  activityContent.licenseCode = null;

  expect(activityContent).toStrictEqual(expectedContent);

  const data = await getMyContent({
    ownerId: userId,
    loggedInUserId: userId,
    parentId: null,
  });

  if (data.notMe) {
    throw Error("shouldn't happen");
  }
  expect(data.content).toBeDefined();
  expect(data.content.length).toBe(1);
  expect(data.content[0].isPublic).eq(false);
  expect(data.content[0].assignmentInfo).eq(undefined);

  await deleteContent({ contentId: contentId, loggedInUserId: userId });

  await expect(
    getActivityEditorData({ contentId: contentId, loggedInUserId: userId }),
  ).rejects.toThrow(InvalidRequestError);

  const dataAfterDelete = await getMyContent({
    ownerId: userId,
    loggedInUserId: userId,
    parentId: null,
  });

  if (dataAfterDelete.notMe) {
    throw Error("shouldn't happen");
  }
  expect(dataAfterDelete.content.length).toBe(0);
});

test("Cannot create new content inside assigned content", async () => {
  const { userId } = await createTestUser();
  const { contentId: sequenceId } = await createContent({
    loggedInUserId: userId,
    contentType: "sequence",
    parentId: null,
  });

  await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: sequenceId,
  });

  await assignActivity({ contentId: sequenceId, loggedInUserId: userId });

  await expect(
    createContent({
      loggedInUserId: userId,
      contentType: "singleDoc",
      parentId: sequenceId,
    }),
  ).rejects.toThrow("Cannot add content to an assigned activity");
});

test("Test updating various activity properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: null,
  });
  const activityName = "Test Name";
  const source = "Here comes some content, I made you some content";
  await updateContent({
    contentId: contentId,
    name: activityName,
    loggedInUserId: userId,
    source,
  });
  const { activity: activityContent } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: userId,
  });
  if (activityContent === undefined || activityContent.type !== "singleDoc") {
    throw Error("shouldn't happen");
  }
  expect(activityContent.name).toBe(activityName);
  expect(activityContent.doenetML).toBe(source);

  const activityViewerContent = await getActivityViewerData({
    contentId: contentId,
    loggedInUserId: userId,
  });
  if (activityViewerContent.activity.type !== "singleDoc") {
    throw Error("shouldn't happen");
  }
  expect(activityViewerContent.activity.name).toBe(activityName);
  expect(activityViewerContent.activity.doenetML).toBe(source);
});

test("deleteContent marks a activity and document as deleted and prevents its retrieval", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: null,
  });

  // activity can be retrieved
  await getActivityViewerData({
    contentId: contentId,
    loggedInUserId: userId,
  });
  await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: userId,
  });
  await getContentSource({ contentId: contentId, loggedInUserId: userId });

  await deleteContent({ contentId: contentId, loggedInUserId: userId });

  // cannot retrieve activity
  await expect(
    getActivityViewerData({ contentId: contentId, loggedInUserId: userId }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
  await expect(
    getActivityEditorData({ contentId: contentId, loggedInUserId: userId }),
  ).rejects.toThrow(InvalidRequestError);
  await expect(
    getContentSource({ contentId: contentId, loggedInUserId: userId }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
});

test("only owner can delete and restore an activity", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  await expect(
    deleteContent({ contentId: contentId, loggedInUserId: user2Id }),
  ).rejects.toThrow("not found");

  await deleteContent({ contentId: contentId, loggedInUserId: ownerId });

  await expect(
    restoreDeletedContent({ contentId: contentId, loggedInUserId: user2Id }),
  ).rejects.toThrowError();

  await restoreDeletedContent({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
});

test("Cannot delete content from inside assigned content", async () => {
  const { userId } = await createTestUser();
  const { contentId: sequenceId } = await createContent({
    loggedInUserId: userId,
    contentType: "sequence",
    parentId: null,
  });

  const { contentId: doc1Id } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: sequenceId,
  });

  const { contentId: doc2Id } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: sequenceId,
  });

  await deleteContent({ contentId: doc1Id, loggedInUserId: userId });

  await assignActivity({ contentId: sequenceId, loggedInUserId: userId });

  await expect(
    deleteContent({ contentId: doc2Id, loggedInUserId: userId }),
  ).rejects.toThrow("Cannot delete content from an assigned activity");
});

test("Can restore deleted content", async () => {
  const { userId } = await createTestUser();
  const { contentId: sequenceId } = await createContent({
    loggedInUserId: userId,
    contentType: "sequence",
    parentId: null,
  });

  const { contentId: doc1Id } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: sequenceId,
  });

  const { contentId: doc2Id } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: sequenceId,
  });

  // Delete doc1 then sequence
  await deleteContent({ contentId: doc1Id, loggedInUserId: userId });
  await deleteContent({ contentId: sequenceId, loggedInUserId: userId });

  // Can't restore doc2, it's not deletion root
  await expect(
    restoreDeletedContent({ contentId: doc2Id, loggedInUserId: userId }),
  ).rejects.toThrowError();

  // Restore sequence, doc1 not restored
  await restoreDeletedContent({
    contentId: sequenceId,
    loggedInUserId: userId,
  });
  await getActivityViewerData({
    contentId: sequenceId,
    loggedInUserId: userId,
  });
  await getActivityViewerData({ contentId: doc2Id, loggedInUserId: userId });
  await expect(
    getActivityViewerData({ contentId: doc1Id, loggedInUserId: userId }),
  ).rejects.toThrowError();

  // Re-delete sequence, restore doc1, doc1 ends up in base folder
  await deleteContent({ contentId: sequenceId, loggedInUserId: userId });
  await restoreDeletedContent({ contentId: doc1Id, loggedInUserId: userId });

  const { activity: doc1Activity } = await getActivityViewerData({
    contentId: doc1Id,
    loggedInUserId: userId,
  });
  expect(doc1Activity.parent).toBeNull();
});

test("Can restore deleted content up to 30 days after deletion", async () => {
  const { userId } = await createTestUser();
  const { contentId: doc1 } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: null,
  });
  const { contentId: doc2 } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: null,
  });

  // Delete the content
  const deleteDate = DateTime.fromISO("2025-06-21");
  vi.setSystemTime(deleteDate.toJSDate());
  await deleteContent({ contentId: doc1, loggedInUserId: userId });
  await deleteContent({ contentId: doc2, loggedInUserId: userId });

  // Can restore content after almost 30 days
  vi.setSystemTime(
    deleteDate.plus({ days: 29, hours: 23, minutes: 58 }).toJSDate(),
  );
  await restoreDeletedContent({ contentId: doc1, loggedInUserId: userId });

  // but not after 30 days
  vi.setSystemTime(deleteDate.plus({ days: 30, minutes: 1 }).toJSDate());
  await expect(
    restoreDeletedContent({ contentId: doc2, loggedInUserId: userId }),
  ).rejects.toThrowError();
});

test("Deleted content shows up in trash, ordered by most recent first", async () => {
  const { userId } = await createTestUser();
  const { contentId: sequenceId } = await createContent({
    loggedInUserId: userId,
    contentType: "sequence",
    parentId: null,
  });
  const { contentId: doc1Id } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: sequenceId,
  });
  await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: sequenceId,
  });

  await deleteContent({ contentId: doc1Id, loggedInUserId: userId });
  await deleteContent({ contentId: sequenceId, loggedInUserId: userId });

  const trash = await getMyTrash({ loggedInUserId: userId });
  expect(trash.content.length).eqls(2);
  expect(trash.content[0].contentId).eqls(sequenceId);
  expect(trash.content[1].contentId).eqls(doc1Id);
});

test("updateContent updates document properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: null,
  });
  const newName = "Updated Name";
  const newContent = "Updated Content";
  await updateContent({
    contentId: contentId,
    name: newName,
    source: newContent,
    loggedInUserId: userId,
  });
  const { activity } = await getActivityViewerData({
    contentId: contentId,
    loggedInUserId: userId,
  });
  if (activity.type !== "singleDoc") {
    throw Error("shouldn't happen");
  }
  expect(activity.name).toBe(newName);
  expect(activity.doenetML).toBe(newContent);
});

test("getAllDoenetmlVersions retrieves all non-removed versions", async () => {
  const { allDoenetmlVersions: allVersions } = await getAllDoenetmlVersions();
  expect(allVersions).toBeInstanceOf(Array);
  // there should be at least one version
  expect(allVersions.length).toBeGreaterThan(0);
  // Ensure none of the versions are marked as removed
  allVersions.forEach((version) => {
    expect(version.removed).toBe(false);
  });
});

test("updateContent does not update properties when passed undefined values", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  const originalActivity = await prisma.content.findUniqueOrThrow({
    where: { id: contentId },
  });
  await updateContent({ contentId: contentId, loggedInUserId: ownerId });
  const updatedActivity = await prisma.content.findUniqueOrThrow({
    where: { id: contentId },
  });
  expect(updatedActivity).toEqual(originalActivity);
});

test("Cannot update most content settings when assigned", async () => {
  const { userId } = await createTestUser();
  const { contentId: sequenceId } = await createContent({
    loggedInUserId: userId,
    contentType: "sequence",
    parentId: null,
  });

  const { contentId: selectId } = await createContent({
    loggedInUserId: userId,
    contentType: "select",
    parentId: sequenceId,
  });

  const { contentId: docId } = await createContent({
    loggedInUserId: userId,
    contentType: "singleDoc",
    parentId: selectId,
  });

  const { allDoenetmlVersions: allVersions } = await getAllDoenetmlVersions();
  const oldVersion = allVersions.find((v) => v.displayedVersion === "0.6")!.id;

  await updateContent({
    contentId: docId,
    loggedInUserId: userId,
    name: "Doc 1",
    source: "Doc source",
    doenetmlVersionId: oldVersion,
    numVariants: 3,
  });

  await updateContent({
    contentId: selectId,
    loggedInUserId: userId,
    name: "Select 1",
    numToSelect: 2,
    selectByVariant: true,
  });

  await updateContent({
    contentId: sequenceId,
    loggedInUserId: userId,
    name: "Sequence 1",
    shuffle: true,
    paginate: true,
  });

  await assignActivity({ contentId: sequenceId, loggedInUserId: userId });

  // can change name
  await updateContent({
    contentId: docId,
    loggedInUserId: userId,
    name: "Doc 2",
  });

  // cannot change source
  await expect(
    updateContent({
      contentId: docId,
      loggedInUserId: userId,
      source: "Doc source 2",
    }),
  ).rejects.toThrow("Cannot change assigned content");

  // cannot change doenetMLVersion
  await expect(
    updateContent({
      contentId: docId,
      loggedInUserId: userId,
      doenetmlVersionId: currentDoenetmlVersion.id,
    }),
  ).rejects.toThrow("Cannot change assigned content");

  // cannot change number of variants
  await expect(
    updateContent({
      contentId: docId,
      loggedInUserId: userId,
      numVariants: 5,
    }),
  ).rejects.toThrow("Cannot change assigned content");

  // cannot change number to select
  await expect(
    updateContent({
      contentId: selectId,
      loggedInUserId: userId,
      numToSelect: 3,
    }),
  ).rejects.toThrow("Cannot change assigned content");

  // cannot change select by variant
  await expect(
    updateContent({
      contentId: selectId,
      loggedInUserId: userId,
      name: "Select 1",
      numToSelect: 2,
      selectByVariant: false,
    }),
  ).rejects.toThrow("Cannot change assigned content");

  // can change paginate
  await updateContent({
    contentId: sequenceId,
    loggedInUserId: userId,
    paginate: false,
  });

  // cannot change shuffle
  await expect(
    updateContent({
      contentId: sequenceId,
      loggedInUserId: userId,
      shuffle: false,
    }),
  ).rejects.toThrow("Cannot change assigned content");
});

test("get activity/document data only if owner or limited data for public/shared", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  await getActivityViewerData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  await getContentSource({ contentId: contentId, loggedInUserId: ownerId });

  await expect(
    getActivityEditorData({ contentId: contentId, loggedInUserId: user1Id }),
  ).rejects.toThrow(InvalidRequestError);
  await expect(
    getActivityViewerData({ contentId: contentId, loggedInUserId: user1Id }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
  await expect(
    getContentSource({ contentId: contentId, loggedInUserId: user1Id }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  await setContentIsPublic({
    contentId: contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  const closeAt = DateTime.now().plus({ days: 1 });
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  let data = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expect(data.editableByMe).eq(true);
  if (data.activity === undefined) {
    throw Error("Shouldn't happen");
  }
  expect(data.activity.assignmentInfo?.assignmentStatus).eq("Open");

  data = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: user1Id,
  });
  expect(data.editableByMe).eq(false);
  expect(data.activity).eq(undefined);
  expect(data.contentId).eq(contentId);

  await getActivityViewerData({
    contentId: contentId,
    loggedInUserId: user1Id,
  });
  await getContentSource({ contentId: contentId, loggedInUserId: user1Id });

  await setContentIsPublic({
    contentId: contentId,
    loggedInUserId: ownerId,
    isPublic: false,
  });
  await expect(
    getActivityEditorData({ contentId: contentId, loggedInUserId: user1Id }),
  ).rejects.toThrow(InvalidRequestError);
  await expect(
    getActivityViewerData({ contentId: contentId, loggedInUserId: user1Id }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
  await expect(
    getContentSource({ contentId: contentId, loggedInUserId: user1Id }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  await modifyContentSharedWith({
    action: "share",
    contentId: contentId,
    loggedInUserId: ownerId,
    users: [user1Id],
  });
  data = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: user1Id,
  });
  expect(data.editableByMe).eq(false);
  expect(data.activity).eq(undefined);
  expect(data.contentId).eq(contentId);

  await getActivityViewerData({
    contentId: contentId,
    loggedInUserId: user1Id,
  });
  await getContentSource({ contentId: contentId, loggedInUserId: user1Id });

  await expect(
    getActivityEditorData({ contentId: contentId, loggedInUserId: user2Id }),
  ).rejects.toThrow(InvalidRequestError);
  await expect(
    getActivityViewerData({ contentId: contentId, loggedInUserId: user2Id }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
  await expect(
    getContentSource({ contentId: contentId, loggedInUserId: user2Id }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
});

test("get public activity editor data only if public or shared", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  const doenetML = "hi!";
  await updateContent({
    contentId: contentId,
    source: doenetML,
    loggedInUserId: ownerId,
  });

  await expect(
    getSharedEditorData({ contentId: contentId, loggedInUserId: user1Id }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  await updateContent({
    contentId: contentId,
    loggedInUserId: ownerId,
    name: "Some content",
  });
  await setContentIsPublic({
    contentId: contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  let sharedData = await getSharedEditorData({
    contentId: contentId,
    loggedInUserId: user1Id,
  });
  if (sharedData.type !== "singleDoc") {
    throw Error("shouldn't happen");
  }
  expect(sharedData.name).eq("Some content");
  expect(sharedData.doenetML).eq(doenetML);

  await setContentIsPublic({
    contentId: contentId,
    loggedInUserId: ownerId,
    isPublic: false,
  });

  await expect(
    getSharedEditorData({ contentId: contentId, loggedInUserId: user1Id }),
  ).rejects.toThrow(PrismaClientKnownRequestError);

  await modifyContentSharedWith({
    action: "share",
    contentId: contentId,
    loggedInUserId: ownerId,
    users: [user1Id],
  });

  sharedData = await getSharedEditorData({
    contentId: contentId,
    loggedInUserId: user1Id,
  });
  if (sharedData.type !== "singleDoc") {
    throw Error("shouldn't happen");
  }
  expect(sharedData.name).eq("Some content");
  expect(sharedData.doenetML).eq(doenetML);

  await expect(
    getSharedEditorData({ contentId: contentId, loggedInUserId: user2Id }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
});

test("activity editor data and my folder contents before and after assigned", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  const { activity: preAssignedData } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  let expectedData: Content = {
    contentId: contentId,
    name: "Untitled Document",
    ownerId,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    numVariants: 1,
    licenseCode: null,
    type: "singleDoc",
    classifications: [],
    doenetML: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
  };
  if (preAssignedData === undefined) {
    throw Error("shouldn't happen");
  }
  preAssignedData.licenseCode = null; // skip trying to check big license object
  expect(preAssignedData).eqls(expectedData);

  // get my folder content returns same data
  let folderData = await getMyContent({
    parentId: null,
    loggedInUserId: ownerId,
    ownerId,
  });
  if (folderData.notMe) {
    throw Error("shouldn't happen");
  }
  folderData.content[0].licenseCode = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // Opening assignment also assigns the activity
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  const { activity: openedData } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expectedData = {
    contentId: contentId,
    name: "Untitled Document",
    ownerId,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    numVariants: 1,
    licenseCode: null,
    type: "singleDoc",
    classifications: [],
    doenetML: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
    assignmentInfo: {
      assignmentStatus: "Open",
      classCode,
      codeValidUntil: closeAt.toJSDate(),
      hasScoreData: false,
      maxAttempts: 1,
      mode: "formative",
      individualizeByStudent: false,
    },
  };

  if (openedData === undefined) {
    throw Error("shouldn't happen");
  }
  openedData.licenseCode = null; // skip trying to check big license object
  expect(openedData).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyContent({
    ownerId,
    parentId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.revisionNum;
  if (folderData.notMe) {
    throw Error("shouldn't happen");
  }
  folderData.content[0].licenseCode = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // closing the assignment without data also unassigns it
  await closeAssignmentWithCode({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  const { activity: closedData } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expectedData = {
    contentId: contentId,
    name: "Untitled Document",
    ownerId,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    numVariants: 1,
    licenseCode: null,
    type: "singleDoc",
    classifications: [],
    doenetML: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
    assignmentInfo: {
      assignmentStatus: "Unassigned",
      classCode,
      codeValidUntil: null,
      hasScoreData: false,
      maxAttempts: 1,
      mode: "formative",
      individualizeByStudent: false,
    },
  };
  if (closedData === undefined) {
    throw Error("shouldn't happen");
  }
  closedData.licenseCode = null; // skip trying to check big license object
  expect(closedData).eqls(expectedData);

  // get my folder content returns same data
  folderData = await getMyContent({
    ownerId,
    parentId: null,
    loggedInUserId: ownerId,
  });
  if (folderData.notMe) {
    throw Error("shouldn't happen");
  }
  folderData.content[0].licenseCode = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // re-opening, re-assigns with same code
  closeAt = DateTime.now().plus({ days: 1 });
  const { classCode: newClassCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  expect(newClassCode).eq(classCode);

  const { activity: openedData2 } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expectedData = {
    contentId: contentId,
    name: "Untitled Document",
    ownerId,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    numVariants: 1,
    licenseCode: null,
    type: "singleDoc",
    classifications: [],
    doenetML: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
    assignmentInfo: {
      assignmentStatus: "Open",
      classCode,
      codeValidUntil: closeAt.toJSDate(),
      hasScoreData: false,
      maxAttempts: 1,
      mode: "formative",
      individualizeByStudent: false,
    },
  };

  if (openedData2 === undefined) {
    throw Error("shouldn't happen");
  }
  openedData2.licenseCode = null; // skip trying to check big license object
  expect(openedData2).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyContent({
    ownerId,
    parentId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.revisionNum;
  if (folderData.notMe) {
    throw Error("shouldn't happen");
  }
  folderData.content[0].licenseCode = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // create initial attempt
  await createNewAttempt({
    contentId: contentId,
    loggedInUserId: ownerId,
    code: classCode,
    variant: 1,
    state: null,
  });

  // just add some data (doesn't matter that it is owner themselves)
  await saveScoreAndState({
    contentId,
    loggedInUserId: ownerId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
    code: classCode,
  });

  const { activity: openedData3 } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expectedData = {
    contentId: contentId,
    name: "Untitled Document",
    ownerId,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    numVariants: 1,
    licenseCode: null,
    type: "singleDoc",
    classifications: [],
    doenetML: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
    assignmentInfo: {
      assignmentStatus: "Open",
      classCode,
      codeValidUntil: closeAt.toJSDate(),
      hasScoreData: true,
      maxAttempts: 1,
      mode: "formative",
      individualizeByStudent: false,
    },
  };
  if (openedData3 === undefined) {
    throw Error("shouldn't happen");
  }
  openedData3.licenseCode = null; // skip trying to check big license object
  expect(openedData3).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyContent({
    ownerId,
    parentId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.revisionNum;
  if (folderData.notMe) {
    throw Error("shouldn't happen");
  }
  folderData.content[0].licenseCode = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // now closing does not unassign
  await closeAssignmentWithCode({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  const { activity: closedData2 } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expectedData = {
    contentId: contentId,
    name: "Untitled Document",
    ownerId,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    numVariants: 1,
    licenseCode: null,
    type: "singleDoc",
    classifications: [],
    doenetML: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
    assignmentInfo: {
      assignmentStatus: "Closed",
      classCode,
      codeValidUntil: null,
      hasScoreData: true,
      maxAttempts: 1,
      mode: "formative",
      individualizeByStudent: false,
    },
  };

  if (closedData2 === undefined) {
    throw Error("shouldn't happen");
  }
  closedData2.licenseCode = null; // skip trying to check big license object
  expect(closedData2).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyContent({
    ownerId,
    parentId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.revisionNum;
  if (folderData.notMe) {
    throw Error("shouldn't happen");
  }
  folderData.content[0].licenseCode = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // explicitly unassigning fails due to the presence of data
  expect(
    await unassignActivity({ contentId: contentId, loggedInUserId: ownerId }),
  ).eqls({ success: false });
});

test("activity editor data shows its parent folder is public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  let { activity: data } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  if (data === undefined) {
    throw Error("shouldn't happen");
  }
  expect(data.isPublic).eq(false);
  expect(data.parent).eq(null);

  await setContentLicense({
    contentId: contentId,
    loggedInUserId: ownerId,
    licenseCode: "CCBYSA",
  });
  await setContentIsPublic({
    contentId: contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  ({ activity: data } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  }));
  if (data === undefined) {
    throw Error("shouldn't happen");
  }
  expect(data.isPublic).eq(true);
  expect(data.licenseCode).eq("CCBYSA");
  expect(data.parent).eq(null);

  const { contentId: folderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  await moveContent({
    contentId: contentId,
    parentId: folderId,
    desiredPosition: 0,
    loggedInUserId: ownerId,
  });

  ({ activity: data } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  }));
  if (data === undefined) {
    throw Error("shouldn't happen");
  }
  expect(data.isPublic).eq(true);
  expect(data.licenseCode).eq("CCBYSA");
  expect(data.parent?.isPublic).eq(false);

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
  ({ activity: data } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  }));
  if (data === undefined) {
    throw Error("shouldn't happen");
  }
  // setting folder public also sets children to be public
  expect(data.isPublic).eq(true);
  // changing license of folder does not change license of content
  expect(data.licenseCode).eq("CCBYSA");
  expect(data.parent?.isPublic).eq(true);

  await setContentIsPublic({
    contentId: folderId,
    loggedInUserId: ownerId,
    isPublic: false,
  });
  ({ activity: data } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  }));
  if (data === undefined) {
    throw Error("shouldn't happen");
  }
  // setting folder private also sets children to be private
  expect(data.isPublic).eq(false);
  expect(data.parent?.isPublic).eq(false);

  await setContentLicense({
    contentId: folderId,
    loggedInUserId: ownerId,
    licenseCode: "CCDUAL",
  });
  await setContentIsPublic({
    contentId: folderId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  ({ activity: data } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  }));
  if (data === undefined) {
    throw Error("shouldn't happen");
  }
  expect(data.isPublic).eq(true);
  // changing license of folder does not change license of content
  expect(data.licenseCode).eq("CCBYSA");
  expect(data.parent?.isPublic).eq(true);
});

test("getActivitySource gets source", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId,
    source: "some content",
    loggedInUserId: ownerId,
  });

  const activitySource = await getContentSource({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expect(activitySource.source).eq("some content");
});

test("getContentDescription gets name, type, and parent type", async () => {
  const { userId: ownerId } = await createTestUser();

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });
  await updateContent({
    contentId: contentId,
    name: "Activity 1",
    loggedInUserId: ownerId,
  });
  expect(
    await getContentDescription({
      contentId: contentId,
      loggedInUserId: ownerId,
    }),
  ).eqls({
    contentId: contentId,
    name: "Activity 1",
    type: "singleDoc",
    parent: null,
  });

  const { contentId: folderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  await updateContent({
    contentId: folderId,
    name: "Folder 2",
    loggedInUserId: ownerId,
  });
  expect(
    await getContentDescription({
      contentId: folderId,
      loggedInUserId: ownerId,
    }),
  ).eqls({
    contentId: folderId,
    name: "Folder 2",
    type: "folder",
    parent: null,
  });

  const { contentId: sequenceId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: folderId,
  });
  await updateContent({
    contentId: sequenceId,
    name: "Sequence 3",
    loggedInUserId: ownerId,
  });
  expect(
    await getContentDescription({
      contentId: sequenceId,
      loggedInUserId: ownerId,
    }),
  ).eqls({
    contentId: sequenceId,
    name: "Sequence 3",
    type: "sequence",
    parent: { type: "folder", contentId: folderId },
  });

  const { contentId: selectId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: sequenceId,
  });
  await updateContent({
    contentId: selectId,
    name: "Select 4",
    loggedInUserId: ownerId,
  });
  expect(
    await getContentDescription({
      contentId: selectId,
      loggedInUserId: ownerId,
    }),
  ).eqls({
    contentId: selectId,
    name: "Select 4",
    type: "select",
    parent: { type: "sequence", contentId: sequenceId },
  });

  const { userId: userId } = await createTestUser();
  await expect(
    getContentDescription({ contentId: selectId, loggedInUserId: userId }),
  ).rejects.toThrow("not found");

  await modifyContentSharedWith({
    action: "share",
    contentId: selectId,
    loggedInUserId: ownerId,
    users: [userId],
  });

  expect(
    await getContentDescription({
      contentId: selectId,
      loggedInUserId: userId,
    }),
  ).eqls({
    contentId: selectId,
    name: "Select 4",
    type: "select",
    parent: { type: "sequence", contentId: sequenceId },
  });
});

test("get compound activity", async () => {
  const { userId: ownerId } = await createTestUser();

  const { contentId: sequenceId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });

  const { contentId: selectIdDelete } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: sequenceId,
  });

  const { contentId: _contentIdDelete1 } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: selectIdDelete,
  });

  const { contentId: selectId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: sequenceId,
  });

  const { contentId: contentId1 } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: selectId,
  });
  const { contentId: contentId2 } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: selectId,
  });
  const { contentId: contentIdDelete2 } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: selectId,
  });
  const { contentId: contentId3 } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: sequenceId,
  });

  await deleteContent({ contentId: contentIdDelete2, loggedInUserId: ownerId });
  await deleteContent({ contentId: selectIdDelete, loggedInUserId: ownerId });

  const { activity: sequence } = await getActivityViewerData({
    contentId: sequenceId,
    loggedInUserId: ownerId,
  });

  if (sequence.type !== "sequence") {
    throw Error("shouldn't happen");
  }

  expect(sequence.contentId).eqls(sequenceId);
  expect(sequence.type).eq("sequence");

  expect(sequence.children.map((c) => c.contentId)).eqls([
    selectId,
    contentId3,
  ]);

  const select = sequence.children[0];
  if (select.type !== "select") {
    throw Error("shouldn't happen");
  }
  expect(select.type).eq("select");
  expect(select.children.map((c) => c.contentId)).eqls([
    contentId1,
    contentId2,
  ]);
});

test("manual createContentRevision overwrites autoGenerated, but not vice-versa", async () => {
  const { userId: ownerId } = await createTestUser();

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  await updateContent({
    contentId,
    source: "Content",
    loggedInUserId: ownerId,
  });

  const { allDoenetmlVersions: allVersions } = await getAllDoenetmlVersions();
  const currentVersion = allVersions.find((v) => v.default)!.fullVersion;

  // create autoGenerated revision
  await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Auto generated 1",
    note: "The first autogenerated revision",
    autoGenerated: true,
  });

  let revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 1,
  });

  expect(revision).eqls({
    source: "Content",
    revisionNum: 1,
    revisionName: "Auto generated 1",
    note: "The first autogenerated revision",
    doenetMLVersion: currentVersion,
  });

  // manual revision overwrites
  await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Manual name",
    note: "Manual note",
  });

  revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 1,
  });

  expect(revision).eqls({
    source: "Content",
    revisionNum: 1,
    revisionName: "Manual name",
    note: "Manual note",
    doenetMLVersion: currentVersion,
  });

  // auto generated revision does not overwrite
  await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Auto generated 2",
    note: "The second, ignored, autogenerated revision",
    autoGenerated: true,
  });

  revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 1,
  });

  expect(revision).eqls({
    source: "Content",
    revisionNum: 1,
    revisionName: "Manual name",
    note: "Manual note",
    doenetMLVersion: currentVersion,
  });
});

test("manual createContentRevision updates if no later manual revisions, else creates new", async () => {
  const { userId: ownerId } = await createTestUser();

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  await updateContent({
    contentId,
    source: "Initial content",
    loggedInUserId: ownerId,
  });

  const { allDoenetmlVersions: allVersions } = await getAllDoenetmlVersions();
  const currentVersion = allVersions.find((v) => v.default)!.fullVersion;

  // create autoGenerated revision
  let createResult = await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Auto generated 1",
    note: "The first autogenerated revision",
    autoGenerated: true,
  });

  expect(createResult.createdNew).eq(true);
  expect(createResult.revisionNum).eq(1);

  let revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 1,
  });

  expect(revision).eqls({
    source: "Initial content",
    revisionNum: 1,
    revisionName: "Auto generated 1",
    note: "The first autogenerated revision",
    doenetMLVersion: currentVersion,
  });

  // change content and make auto generated revision
  await updateContent({
    contentId,
    source: "Updated content",
    loggedInUserId: ownerId,
  });

  createResult = await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Auto generated 2",
    note: "The second autogenerated revision",
    autoGenerated: true,
  });

  expect(createResult.createdNew).eq(true);
  expect(createResult.revisionNum).eq(2);

  // change content back to original
  await updateContent({
    contentId,
    source: "Initial content",
    loggedInUserId: ownerId,
  });

  // manual revision overwrites the first content revision
  createResult = await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Manual name",
    note: "Manual note",
  });
  expect(createResult.createdNew).eq(false);
  expect(createResult.revisionNum).eq(1);

  revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 1,
  });

  expect(revision).eqls({
    source: "Initial content",
    revisionNum: 1,
    revisionName: "Manual name",
    note: "Manual note",
    doenetMLVersion: currentVersion,
  });

  // the second auto generated one is still revision 2
  revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 2,
  });
  expect(revision).eqls({
    source: "Updated content",
    revisionNum: 2,
    revisionName: "Auto generated 2",
    note: "The second autogenerated revision",
    doenetMLVersion: currentVersion,
  });

  // change content back to updated and make a manual revision
  await updateContent({
    contentId,
    source: "Updated content",
    loggedInUserId: ownerId,
  });

  createResult = await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Manual name 2",
    note: "Manual note 2",
  });
  expect(createResult.createdNew).eq(false);
  expect(createResult.revisionNum).eq(2);

  // now a manual revision revision of original content creates a new revision
  await updateContent({
    contentId,
    source: "Initial content",
    loggedInUserId: ownerId,
  });

  // manual revision overwrites the first content revision
  createResult = await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Manual name 3",
    note: "Manual note 3",
  });
  expect(createResult.createdNew).eq(true);
  expect(createResult.revisionNum).eq(3);

  // can get all three manual revision
  revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 1,
  });
  expect(revision).eqls({
    source: "Initial content",
    revisionNum: 1,
    revisionName: "Manual name",
    note: "Manual note",
    doenetMLVersion: currentVersion,
  });

  revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 2,
  });
  expect(revision).eqls({
    source: "Updated content",
    revisionNum: 2,
    revisionName: "Manual name 2",
    note: "Manual note 2",
    doenetMLVersion: currentVersion,
  });

  revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 3,
  });
  expect(revision).eqls({
    source: "Initial content",
    revisionNum: 3,
    revisionName: "Manual name 3",
    note: "Manual note 3",
    doenetMLVersion: currentVersion,
  });
});

test("manual createContentRevision with `renameMatching` only renames autoGenerated", async () => {
  const { userId: ownerId } = await createTestUser();

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  await updateContent({
    contentId,
    source: "Initial content",
    loggedInUserId: ownerId,
  });

  const { allDoenetmlVersions: allVersions } = await getAllDoenetmlVersions();
  const currentVersion = allVersions.find((v) => v.default)!.fullVersion;

  // create autoGenerated revision
  let createResult = await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Auto generated 1",
    note: "The first autogenerated revision",
    autoGenerated: true,
  });

  expect(createResult.createdNew).eq(true);
  expect(createResult.revisionNum).eq(1);

  let revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 1,
  });

  expect(revision).eqls({
    source: "Initial content",
    revisionNum: 1,
    revisionName: "Auto generated 1",
    note: "The first autogenerated revision",
    doenetMLVersion: currentVersion,
  });

  // manual revision overwrites the first content revision even if renameMatching is `false`
  createResult = await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Manual name",
    note: "Manual note",
    renameMatching: false,
  });
  expect(createResult.createdNew).eq(false);
  expect(createResult.revisionNum).eq(1);

  revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 1,
  });

  expect(revision).eqls({
    source: "Initial content",
    revisionNum: 1,
    revisionName: "Manual name",
    note: "Manual note",
    doenetMLVersion: currentVersion,
  });

  // manual revision with renameMatching `false` won't overwrite the name and note of the manual revision
  createResult = await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "New manual name",
    note: "New manual note",
    renameMatching: false,
  });
  expect(createResult.createdNew).eq(false);
  expect(createResult.revisionNum).eq(1);

  revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 1,
  });

  expect(revision).eqls({
    source: "Initial content",
    revisionNum: 1,
    revisionName: "Manual name",
    note: "Manual note",
    doenetMLVersion: currentVersion,
  });

  // manual revision with renameMatching `true` will overwrite the name and note of the manual revision
  createResult = await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Even newer manual name",
    note: "Even newer manual note",
  });
  expect(createResult.createdNew).eq(false);
  expect(createResult.revisionNum).eq(1);

  revision = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 1,
  });

  expect(revision).eqls({
    source: "Initial content",
    revisionNum: 1,
    revisionName: "Even newer manual name",
    note: "Even newer manual note",
    doenetMLVersion: currentVersion,
  });
});

test("revert to revision", async () => {
  const { userId: ownerId } = await createTestUser();

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  await updateContent({
    contentId,
    source: "Initial content",
    loggedInUserId: ownerId,
  });

  const { allDoenetmlVersions: allVersions } = await getAllDoenetmlVersions();
  const currentVersion = allVersions.find((v) => v.default)!.fullVersion;

  // create first revision
  const createResult = await createContentRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionName: "Initial save point",
    note: "Got to start somewhere",
  });

  expect(createResult.createdNew).eq(true);
  expect(createResult.revisionNum).eq(1);

  // update content
  await updateContent({
    contentId,
    source: "Updated content",
    loggedInUserId: ownerId,
  });
  let contentSource = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
  });
  expect(contentSource).eqls({
    source: "Updated content",
    doenetMLVersion: currentVersion,
  });

  // revert back to initial content
  await revertToRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionNum: 1,
  });
  contentSource = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
  });
  expect(contentSource).eqls({
    source: "Initial content",
    doenetMLVersion: currentVersion,
  });

  // Created two new revisions
  contentSource = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 2,
  });
  expect(contentSource).eqls({
    source: "Updated content",
    doenetMLVersion: currentVersion,
    revisionNum: 2,
    revisionName: "Before changing to save point",
    note: "Before using the save point: Initial save point",
  });
  contentSource = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 3,
  });
  expect(contentSource).eqls({
    source: "Initial content",
    doenetMLVersion: currentVersion,
    revisionNum: 3,
    revisionName: "Changed to save point",
    note: "Used the save point: Initial save point",
  });

  // revert back to updated content
  await revertToRevision({
    contentId,
    loggedInUserId: ownerId,
    revisionNum: 2,
  });
  contentSource = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
  });
  expect(contentSource).eqls({
    source: "Updated content",
    doenetMLVersion: currentVersion,
  });

  // Created only one more revision
  contentSource = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 3,
  });
  expect(contentSource).eqls({
    source: "Initial content",
    doenetMLVersion: currentVersion,
    revisionNum: 3,
    revisionName: "Changed to save point",
    note: "Used the save point: Initial save point",
  });
  contentSource = await getContentSource({
    contentId,
    loggedInUserId: ownerId,
    fromRevisionNum: 4,
  });
  expect(contentSource).eqls({
    source: "Updated content",
    doenetMLVersion: currentVersion,
    revisionNum: 4,
    revisionName: "Changed to save point",
    note: "Used the save point: Before changing to save point",
  });
});
