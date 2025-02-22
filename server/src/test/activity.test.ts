import { expect, test } from "vitest";

import { DateTime } from "luxon";
import { Content, Doc } from "../types";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createTestUser } from "./utils";
import {
  createContent,
  deleteContent,
  getAllDoenetmlVersions,
  getActivitySource,
  updateContent,
  getContentDescription,
} from "../query/activity";
import {
  getActivityEditorData,
  getActivityViewerData,
  getSharedEditorData,
} from "../query/activity_edit_view";
import { getMyContent } from "../query/content_list";
import { InvalidRequestError } from "../utils/error";
import {
  modifyContentSharedWith,
  setContentIsPublic,
  setContentLicense,
} from "../query/share";
import {
  closeAssignmentWithCode,
  openAssignmentWithCode,
  unassignActivity,
} from "../query/assign";
import { saveScoreAndState } from "../query/scores";
import { moveContent } from "../query/copy_move";
import { prisma } from "../model";

// const EMPTY_DOC_CID =
//   "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

const currentDoenetmlVersion = {
  id: 2,
  displayedVersion: "0.7",
  fullVersion: "0.7.0-alpha31",
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
    id: contentId,
    name: "Untitled Document",
    ownerId: userId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isShared: false,
    contentFeatures: [],
    sharedWith: [],
    baseComponentCounts: "{}",
    numVariants: 1,
    license: null,
    type: "singleDoc",
    classifications: [],
    source: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
  };

  expect(activityContent.license?.code).eq("CCDUAL");

  // set license to null as it is too long to compare in its entirety.
  activityContent.license = null;

  expect(activityContent).toStrictEqual(expectedContent);

  const data = await getMyContent({
    loggedInUserId: userId,
    parentId: null,
  });

  expect(data.content.length).toBe(1);
  expect(data.content[0].isPublic).eq(false);
  expect(data.content[0].assignmentInfo).eq(undefined);

  await deleteContent(contentId, userId);

  await expect(
    getActivityEditorData({ contentId: contentId, loggedInUserId: userId }),
  ).rejects.toThrow(InvalidRequestError);

  const dataAfterDelete = await getMyContent({
    loggedInUserId: userId,
    parentId: null,
  });

  expect(dataAfterDelete.content.length).toBe(0);
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
  expect(activityContent.source).toBe(source);

  const activityViewerContent = await getActivityViewerData({
    contentId: contentId,
    loggedInUserId: userId,
  });
  if (activityViewerContent.activity.type !== "singleDoc") {
    throw Error("shouldn't happen");
  }
  expect(activityViewerContent.activity.name).toBe(activityName);
  expect(activityViewerContent.activity.source).toBe(source);
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
  await getActivitySource(contentId, userId);

  await deleteContent(contentId, userId);

  // cannot retrieve activity
  await expect(
    getActivityViewerData({ contentId: contentId, loggedInUserId: userId }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
  await expect(
    getActivityEditorData({ contentId: contentId, loggedInUserId: userId }),
  ).rejects.toThrow(InvalidRequestError);
  await expect(getActivitySource(contentId, userId)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
});

test("only owner can delete an activity", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  await expect(deleteContent(contentId, user2Id)).rejects.toThrow("not found");

  await deleteContent(contentId, ownerId);
});

test("updateDoc updates document properties", async () => {
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
  expect(activity.source).toBe(newContent);
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
  await getActivitySource(contentId, ownerId);

  await expect(
    getActivityEditorData({ contentId: contentId, loggedInUserId: user1Id }),
  ).rejects.toThrow(InvalidRequestError);
  await expect(
    getActivityViewerData({ contentId: contentId, loggedInUserId: user1Id }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
  await expect(getActivitySource(contentId, user1Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

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
  await getActivitySource(contentId, user1Id);

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
  await expect(getActivitySource(contentId, user1Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

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
  await getActivitySource(contentId, user1Id);

  await expect(
    getActivityEditorData({ contentId: contentId, loggedInUserId: user2Id }),
  ).rejects.toThrow(InvalidRequestError);
  await expect(
    getActivityViewerData({ contentId: contentId, loggedInUserId: user2Id }),
  ).rejects.toThrow(PrismaClientKnownRequestError);
  await expect(getActivitySource(contentId, user2Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
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
  expect(sharedData.source).eq(doenetML);

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
  expect(sharedData.source).eq(doenetML);

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
    id: contentId,
    name: "Untitled Document",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    baseComponentCounts: "{}",
    numVariants: 1,
    license: null,
    type: "singleDoc",
    classifications: [],
    source: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
  };
  if (preAssignedData === undefined) {
    throw Error("shouldn't happen");
  }
  preAssignedData.license = null; // skip trying to check big license object
  expect(preAssignedData).eqls(expectedData);

  // get my folder content returns same data
  let folderData = await getMyContent({
    parentId: null,
    loggedInUserId: ownerId,
  });
  folderData.content[0].license = null; // skip trying to check big license object
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
    id: contentId,
    name: "Untitled Document",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    baseComponentCounts: "{}",
    numVariants: 1,
    license: null,
    type: "singleDoc",
    classifications: [],
    revisionNum: 1,
    source: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
    assignmentInfo: {
      assignmentStatus: "Open",
      classCode,
      codeValidUntil: closeAt.toJSDate(),
      hasScoreData: false,
    },
  };

  if (openedData === undefined) {
    throw Error("shouldn't happen");
  }
  openedData.license = null; // skip trying to check big license object
  expect(openedData).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyContent({
    parentId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.revisionNum;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // closing the assignment without data also unassigns it
  await closeAssignmentWithCode(contentId, ownerId);
  const { activity: closedData } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expectedData = {
    id: contentId,
    name: "Untitled Document",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    baseComponentCounts: "{}",
    numVariants: 1,
    license: null,
    type: "singleDoc",
    classifications: [],
    source: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
  };
  if (closedData === undefined) {
    throw Error("shouldn't happen");
  }
  closedData.license = null; // skip trying to check big license object
  expect(closedData).eqls(expectedData);

  // get my folder content returns same data
  folderData = await getMyContent({
    parentId: null,
    loggedInUserId: ownerId,
  });
  folderData.content[0].license = null; // skip trying to check big license object
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
    id: contentId,
    name: "Untitled Document",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    baseComponentCounts: "{}",
    numVariants: 1,
    license: null,
    type: "singleDoc",
    classifications: [],
    revisionNum: 1,
    source: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
    assignmentInfo: {
      assignmentStatus: "Open",
      classCode,
      codeValidUntil: closeAt.toJSDate(),
      hasScoreData: false,
    },
  };

  if (openedData2 === undefined) {
    throw Error("shouldn't happen");
  }
  openedData2.license = null; // skip trying to check big license object
  expect(openedData2).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyContent({
    parentId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.revisionNum;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // just add some data (doesn't matter that it is owner themselves)
  await saveScoreAndState({
    contentId,
    activityRevisionNum: 1,
    loggedInUserId: ownerId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  const { activity: openedData3 } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expectedData = {
    id: contentId,
    name: "Untitled Document",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    baseComponentCounts: "{}",
    numVariants: 1,
    license: null,
    type: "singleDoc",
    classifications: [],
    revisionNum: 1,
    source: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
    assignmentInfo: {
      assignmentStatus: "Open",
      classCode,
      codeValidUntil: closeAt.toJSDate(),
      hasScoreData: true,
    },
  };
  if (openedData3 === undefined) {
    throw Error("shouldn't happen");
  }
  openedData3.license = null; // skip trying to check big license object
  expect(openedData3).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyContent({
    parentId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.revisionNum;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // now closing does not unassign
  await closeAssignmentWithCode(contentId, ownerId);
  const { activity: closedData2 } = await getActivityEditorData({
    contentId: contentId,
    loggedInUserId: ownerId,
  });
  expectedData = {
    id: contentId,
    name: "Untitled Document",
    ownerId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    baseComponentCounts: "{}",
    numVariants: 1,
    license: null,
    type: "singleDoc",
    classifications: [],
    revisionNum: 1,
    source: "",
    doenetmlVersion: currentDoenetmlVersion,
    parent: null,
    assignmentInfo: {
      assignmentStatus: "Closed",
      classCode,
      codeValidUntil: null,
      hasScoreData: true,
    },
  };

  if (closedData2 === undefined) {
    throw Error("shouldn't happen");
  }
  closedData2.license = null; // skip trying to check big license object
  expect(closedData2).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyContent({
    parentId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.revisionNum;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // explicitly unassigning fails due to the presence of data
  await expect(unassignActivity(contentId, ownerId)).rejects.toThrow(
    "Record to update not found",
  );
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
  expect(data.license?.code).eq("CCBYSA");
  expect(data.parent).eq(null);

  const { contentId: folderId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  await moveContent({
    contentId: contentId,
    desiredParentId: folderId,
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
  expect(data.license?.code).eq("CCBYSA");
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
  expect(data.license?.code).eq("CCBYSA");
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
  expect(data.license?.code).eq("CCBYSA");
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

  const activitySource = await getActivitySource(contentId, ownerId);
  expect(activitySource.source).eq("some content");
});

test("getContentDescription gets name and type", async () => {
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
  expect(await getContentDescription(contentId, ownerId)).eqls({
    id: contentId,
    name: "Activity 1",
    type: "singleDoc",
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
  expect(await getContentDescription(folderId, ownerId)).eqls({
    id: folderId,
    name: "Folder 2",
    type: "folder",
  });

  const { contentId: sequenceId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });
  await updateContent({
    contentId: sequenceId,
    name: "Sequence 3",
    loggedInUserId: ownerId,
  });
  expect(await getContentDescription(sequenceId, ownerId)).eqls({
    id: sequenceId,
    name: "Sequence 3",
    type: "sequence",
  });

  const { contentId: selectId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: null,
  });
  await updateContent({
    contentId: selectId,
    name: "Select 4",
    loggedInUserId: ownerId,
  });
  expect(await getContentDescription(selectId, ownerId)).eqls({
    id: selectId,
    name: "Select 4",
    type: "select",
  });

  const { userId: userId } = await createTestUser();
  await expect(getContentDescription(selectId, userId)).rejects.toThrow(
    "not found",
  );

  await modifyContentSharedWith({
    action: "share",
    contentId: selectId,
    loggedInUserId: ownerId,
    users: [userId],
  });

  expect(await getContentDescription(selectId, userId)).eqls({
    id: selectId,
    name: "Select 4",
    type: "select",
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

  await deleteContent(contentIdDelete2, ownerId);
  await deleteContent(selectIdDelete, ownerId);

  const { activity: sequence } = await getActivityViewerData({
    contentId: sequenceId,
    loggedInUserId: ownerId,
  });

  if (sequence.type !== "sequence") {
    throw Error("shouldn't happen");
  }

  expect(sequence.id).eqls(sequenceId);
  expect(sequence.type).eq("sequence");

  expect(sequence.children.map((c) => c.id)).eqls([selectId, contentId3]);

  const select = sequence.children[0];
  if (select.type !== "select") {
    throw Error("shouldn't happen");
  }
  expect(select.type).eq("select");
  expect(select.children.map((c) => c.id)).eqls([contentId1, contentId2]);
});
