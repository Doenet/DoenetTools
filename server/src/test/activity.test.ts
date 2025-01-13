import { expect, test } from "vitest";
import {
  createActivity,
  deleteActivity,
  getAllDoenetmlVersions,
  getDoc,
  getActivityEditorData,
  getActivityViewerData,
  getMyFolderContent,
  updateDoc,
  updateContent,
  getActivity,
  openAssignmentWithCode,
  closeAssignmentWithCode,
  saveScoreAndState,
  unassignActivity,
  createFolder,
  moveContent,
  getSharedEditorData,
  makeActivityPublic,
  makeActivityPrivate,
  makeFolderPublic,
  makeFolderPrivate,
  shareActivity,
  getDocumentSource,
} from "../model";
import { DateTime } from "luxon";
import { ContentStructure } from "../types";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createTestUser } from "./utils";

// const EMPTY_DOC_CID =
//   "bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

const currentDoenetmlVersion = {
  id: 2,
  displayedVersion: "0.7",
  fullVersion: "0.7.0-alpha18",
  default: true,
  deprecated: false,
  removed: false,
  deprecationMessage: "",
};

test("New activity starts out private, then delete it", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId, docId } = await createActivity(userId, null);
  const { activity: activityContent } = await getActivityEditorData(
    activityId,
    userId,
  );
  const expectedContent: ContentStructure = {
    id: activityId,
    name: "Untitled Activity",
    ownerId: userId,
    imagePath: "/activity_default.jpg",
    isPublic: false,
    isFolder: false,
    isShared: false,
    contentFeatures: [],
    sharedWith: [],
    assignmentStatus: "Unassigned",
    classCode: null,
    codeValidUntil: null,
    license: null,
    classifications: [],
    documents: [
      {
        id: docId,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: false,
    parentFolder: null,
  };
  expect(activityContent.license?.code).eq("CCDUAL");

  // set license to null as it is too long to compare in its entirety.
  activityContent.license = null;

  expect(activityContent).toStrictEqual(expectedContent);

  const data = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: null,
  });

  expect(data.content.length).toBe(1);
  expect(data.content[0].isPublic).eq(false);
  expect(data.content[0].assignmentStatus).eq("Unassigned");

  await deleteActivity(activityId, userId);

  await expect(getActivityEditorData(activityId, userId)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  const dataAfterDelete = await getMyFolderContent({
    loggedInUserId: userId,
    folderId: null,
  });

  expect(dataAfterDelete.content.length).toBe(0);
});

test("Test updating various activity properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId } = await createActivity(userId, null);
  const activityName = "Test Name";
  await updateContent({ id: activityId, name: activityName, ownerId: userId });
  const { activity: activityContent } = await getActivityEditorData(
    activityId,
    userId,
  );
  const docId = activityContent.documents[0].id;
  expect(activityContent.name).toBe(activityName);
  const source = "Here comes some content, I made you some content";
  await updateDoc({ id: docId, source, ownerId: userId });
  const { activity: activityContent2 } = await getActivityEditorData(
    activityId,
    userId,
  );
  expect(activityContent2.documents[0].source).toBe(source);

  const activityViewerContent = await getActivityViewerData(activityId, userId);
  expect(activityViewerContent.activity.name).toBe(activityName);
  expect(activityViewerContent.activity.documents[0].source).toBe(source);
});

test("deleteActivity marks a activity and document as deleted and prevents its retrieval", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId, docId } = await createActivity(userId, null);

  // activity can be retrieved
  await getActivity(activityId);
  await getActivityViewerData(activityId, userId);
  await getActivityEditorData(activityId, userId);
  await getDoc(docId);
  await getDocumentSource(docId, userId);

  const deleteResult = await deleteActivity(activityId, userId);
  expect(deleteResult.isDeleted).toBe(true);

  // cannot retrieve activity
  await expect(getActivity(activityId)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
  await expect(getActivityViewerData(activityId, userId)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
  await expect(getActivityEditorData(activityId, userId)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
  await expect(getDoc(docId)).rejects.toThrow(PrismaClientKnownRequestError);
  await expect(getDocumentSource(docId, userId)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
});

test("only owner can delete an activity", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;
  const { activityId } = await createActivity(ownerId, null);

  await expect(deleteActivity(activityId, user2Id)).rejects.toThrow(
    "Record to update not found",
  );

  const deleteResult = await deleteActivity(activityId, ownerId);
  expect(deleteResult.isDeleted).toBe(true);
});

test("updateDoc updates document properties", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { activityId, docId } = await createActivity(userId, null);
  const newName = "Updated Name";
  const newContent = "Updated Content";
  await updateContent({ id: activityId, name: newName, ownerId: userId });
  await updateDoc({
    id: docId,
    source: newContent,
    ownerId: userId,
  });
  const activityViewerContent = await getActivityViewerData(activityId, userId);
  expect(activityViewerContent.activity.name).toBe(newName);
  expect(activityViewerContent.activity.documents[0].source).toBe(newContent);
});

test("getAllDoenetmlVersions retrieves all non-removed versions", async () => {
  const allVersions = await getAllDoenetmlVersions();
  expect(allVersions).toBeInstanceOf(Array);
  // there should be at least one version
  expect(allVersions.length).toBeGreaterThan(0);
  // Ensure none of the versions are marked as removed
  allVersions.forEach((version) => {
    expect(version.removed).toBe(false);
  });
});

test("deleteActivity prevents a document from being retrieved", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId, null);
  await deleteActivity(activityId, ownerId);
  await expect(getActivity(activityId)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
});

test("updateContent does not update properties when passed undefined values", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId, null);
  const originalActivity = await getActivity(activityId);
  await updateContent({ id: activityId, ownerId });
  const updatedActivity = await getActivity(activityId);
  expect(updatedActivity).toEqual(originalActivity);
});

test("get activity/document data only if owner or limited data for public/shared", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;
  const { activityId, docId } = await createActivity(ownerId, null);

  await getActivityEditorData(activityId, ownerId);
  await getActivityViewerData(activityId, ownerId);
  await getDocumentSource(docId, ownerId);

  await expect(getActivityEditorData(activityId, user1Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
  await expect(getActivityViewerData(activityId, user1Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
  await expect(getDocumentSource(docId, user1Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  await makeActivityPublic({ id: activityId, ownerId, licenseCode: "CCDUAL" });

  const closeAt = DateTime.now().plus({ days: 1 });
  await openAssignmentWithCode(activityId, closeAt, ownerId);

  let data = await getActivityEditorData(activityId, ownerId);
  expect(data.notMe).eq(false);
  expect(data.activity.assignmentStatus).eq("Open");

  data = await getActivityEditorData(activityId, user1Id);
  expect(data.notMe).eq(true);
  expect(data.activity).eqls({
    id: activityId,
    name: "",
    ownerId,
    imagePath: null,
    assignmentStatus: "Unassigned",
    classCode: null,
    codeValidUntil: null,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    license: null,
    classifications: [],
    documents: [],
    hasScoreData: false,
    parentFolder: null,
  });

  await getActivityViewerData(activityId, user1Id);
  await getDocumentSource(docId, user1Id);

  await makeActivityPrivate({ id: activityId, ownerId });
  await expect(getActivityEditorData(activityId, user1Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
  await expect(getActivityViewerData(activityId, user1Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
  await expect(getDocumentSource(docId, user1Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  await shareActivity({
    id: activityId,
    ownerId,
    licenseCode: "CCDUAL",
    users: [user1Id],
  });
  data = await getActivityEditorData(activityId, user1Id);
  expect(data.notMe).eq(true);
  expect(data.activity).eqls({
    id: activityId,
    name: "",
    ownerId,
    imagePath: null,
    assignmentStatus: "Unassigned",
    classCode: null,
    codeValidUntil: null,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    license: null,
    classifications: [],
    documents: [],
    hasScoreData: false,
    parentFolder: null,
  });

  await getActivityViewerData(activityId, user1Id);
  await getDocumentSource(docId, user1Id);

  await expect(getActivityEditorData(activityId, user2Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
  await expect(getActivityViewerData(activityId, user2Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
  await expect(getDocumentSource(docId, user2Id)).rejects.toThrow(
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

  const { activityId, docId } = await createActivity(ownerId, null);
  const doenetML = "hi!";
  await updateDoc({ id: docId, source: doenetML, ownerId });

  await expect(getSharedEditorData(activityId, user1Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  await updateContent({
    id: activityId,
    ownerId,
    name: "Some content",
  });
  await makeActivityPublic({
    id: activityId,
    licenseCode: "CCDUAL",
    ownerId,
  });

  let sharedData = await getSharedEditorData(activityId, user1Id);
  expect(sharedData.name).eq("Some content");
  expect(sharedData.documents[0].source).eq(doenetML);

  await makeActivityPrivate({
    id: activityId,
    ownerId,
  });

  await expect(getSharedEditorData(activityId, user1Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );

  await shareActivity({
    id: activityId,
    licenseCode: "CCDUAL",
    ownerId,
    users: [user1Id],
  });

  sharedData = await getSharedEditorData(activityId, user1Id);
  expect(sharedData.name).eq("Some content");
  expect(sharedData.documents[0].source).eq(doenetML);

  await expect(getSharedEditorData(activityId, user2Id)).rejects.toThrow(
    PrismaClientKnownRequestError,
  );
});

test("activity editor data and my folder contents before and after assigned", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId, null);

  const { activity: preAssignedData } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  let expectedData: ContentStructure = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isFolder: false,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Unassigned",
    classCode: null,
    codeValidUntil: null,
    license: null,
    classifications: [],
    documents: [
      {
        id: docId,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: false,
    parentFolder: null,
  };
  preAssignedData.license = null; // skip trying to check big license object
  expect(preAssignedData).eqls(expectedData);

  // get my folder content returns same data
  let folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // Opening assignment also assigns the activity
  let closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  const { activity: openedData } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expectedData = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isFolder: false,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Open",
    classCode,
    codeValidUntil: closeAt.toJSDate(),
    license: null,
    classifications: [],
    documents: [
      {
        id: docId,
        versionNum: 1,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: false,
    parentFolder: null,
  };

  openedData.license = null; // skip trying to check big license object
  expect(openedData).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.documents[0].versionNum;
  expectedData.isFolder = false;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // closing the assignment without data also unassigns it
  await closeAssignmentWithCode(activityId, ownerId);
  const { activity: closedData } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expectedData = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isFolder: false,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Unassigned",
    classCode,
    codeValidUntil: null,
    license: null,
    classifications: [],
    documents: [
      {
        id: docId,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: false,
    parentFolder: null,
  };

  closedData.license = null; // skip trying to check big license object
  expect(closedData).eqls(expectedData);

  // get my folder content returns same data
  folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // re-opening, re-assigns with same code
  closeAt = DateTime.now().plus({ days: 1 });
  const { classCode: newClassCode } = await openAssignmentWithCode(
    activityId,
    closeAt,
    ownerId,
  );

  expect(newClassCode).eq(classCode);

  const { activity: openedData2 } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expectedData = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isFolder: false,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Open",
    classCode,
    codeValidUntil: closeAt.toJSDate(),
    license: null,
    classifications: [],
    documents: [
      {
        id: docId,
        versionNum: 1,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: false,
    parentFolder: null,
  };

  openedData2.license = null; // skip trying to check big license object
  expect(openedData2).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.documents[0].versionNum;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // just add some data (doesn't matter that it is owner themselves)
  await saveScoreAndState({
    activityId,
    docId,
    docVersionNum: 1,
    userId: ownerId,
    score: 0.5,
    onSubmission: true,
    state: "document state 1",
  });

  const { activity: openedData3 } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expectedData = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isFolder: false,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Open",
    classCode,
    codeValidUntil: closeAt.toJSDate(),
    license: null,
    classifications: [],
    documents: [
      {
        id: docId,
        versionNum: 1,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: true,
    parentFolder: null,
  };

  openedData3.license = null; // skip trying to check big license object
  expect(openedData3).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.documents[0].versionNum;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // now closing does not unassign
  await closeAssignmentWithCode(activityId, ownerId);
  const { activity: closedData2 } = await getActivityEditorData(
    activityId,
    ownerId,
  );
  expectedData = {
    id: activityId,
    name: "Untitled Activity",
    ownerId,
    imagePath: "/activity_default.jpg",
    isFolder: false,
    isPublic: false,
    contentFeatures: [],
    isShared: false,
    sharedWith: [],
    assignmentStatus: "Closed",
    classCode,
    codeValidUntil: null,
    license: null,
    classifications: [],
    documents: [
      {
        id: docId,
        versionNum: 1,
        source: "",
        name: "Untitled Document",
        doenetmlVersion: currentDoenetmlVersion,
      },
    ],
    hasScoreData: true,
    parentFolder: null,
  };

  closedData2.license = null; // skip trying to check big license object
  expect(closedData2).eqls(expectedData);

  // get my folder content returns same data, with differences in some optional fields
  folderData = await getMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
  });
  delete expectedData.documents[0].versionNum;
  folderData.content[0].license = null; // skip trying to check big license object
  expect(folderData.content).eqls([expectedData]);

  // explicitly unassigning fails due to the presence of data
  await expect(unassignActivity(activityId, ownerId)).rejects.toThrow(
    "Record to update not found",
  );
});

test("activity editor data shows its parent folder is public", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { activityId } = await createActivity(ownerId, null);

  let { activity: data } = await getActivityEditorData(activityId, ownerId);
  expect(data.isPublic).eq(false);
  expect(data.parentFolder).eq(null);

  await makeActivityPublic({ id: activityId, ownerId, licenseCode: "CCBYSA" });
  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(true);
  expect(data.license?.code).eq("CCBYSA");
  expect(data.parentFolder).eq(null);

  const { folderId } = await createFolder(ownerId, null);
  await moveContent({
    id: activityId,
    desiredParentFolderId: folderId,
    desiredPosition: 0,
    ownerId,
  });

  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(true);
  expect(data.license?.code).eq("CCBYSA");
  expect(data.parentFolder?.isPublic).eq(false);

  await makeFolderPublic({ id: folderId, ownerId, licenseCode: "CCBYNCSA" });
  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(true);
  expect(data.license?.code).eq("CCBYNCSA");
  expect(data.parentFolder?.isPublic).eq(true);

  await makeFolderPrivate({ id: folderId, ownerId });
  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(false);
  expect(data.parentFolder?.isPublic).eq(false);

  await makeFolderPublic({ id: folderId, ownerId, licenseCode: "CCDUAL" });
  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(true);
  expect(data.license?.code).eq("CCDUAL");
  expect(data.parentFolder?.isPublic).eq(true);

  await makeActivityPrivate({ id: activityId, ownerId });
  ({ activity: data } = await getActivityEditorData(activityId, ownerId));
  expect(data.isPublic).eq(false);
  expect(data.parentFolder?.isPublic).eq(true);
});

test("getDocumentSource gets source", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { docId } = await createActivity(ownerId, null);
  await updateDoc({ id: docId, source: "some content", ownerId });

  const documentSource = await getDocumentSource(docId, ownerId);
  expect(documentSource.source).eq("some content");
});
