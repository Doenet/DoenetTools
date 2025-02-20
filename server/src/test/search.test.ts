import { expect, test } from "vitest";
import { createTestClassifications, createTestUser } from "./utils";
import { compareUUID, fromUUID, isEqualUUID } from "../utils/uuid";
import {
  createContent,
  deleteContent,
  updateContent,
  updateContentFeatures,
} from "../apis/activity";
import {
  modifyContentSharedWith,
  setContentIsPublic,
  shareContentWithEmail,
} from "../apis/share";
import {
  addClassification,
  searchPossibleClassifications,
} from "../apis/classification";
import {
  searchClassificationCategoriesWithSharedContent,
  searchClassificationSubCategoriesWithSharedContent,
  searchClassificationsWithSharedContent,
  searchSharedContent,
  searchUsersWithSharedContent,
} from "../apis/explore";
import { searchMyContent } from "../apis/content_list";
import { updateUser } from "../apis/user";

test("searchSharedContent returns public/shared activities and folders matching the query", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user = await createTestUser();
  const userId = user.userId;

  // Create unique session number for names in this test
  const sessionNumber = Date.now().toString();

  const publicActivityName = `public activity ${sessionNumber}`;
  const privateActivityName = `private activity ${sessionNumber}`;
  const sharedActivityName = `shared activity ${sessionNumber}`;
  const publicFolderName = `public folder ${sessionNumber}`;
  const privateFolderName = `private folder ${sessionNumber}`;
  const sharedFolderName = `shared folder ${sessionNumber}`;

  const { id: publicActivityId } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: publicActivityId,
    name: publicActivityName,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: publicActivityId,
    isPublic: true,
    loggedInUserId: ownerId,
  });

  const { id: privateActivityId } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: privateActivityId,
    name: privateActivityName,
    loggedInUserId: ownerId,
  });

  const { id: sharedActivityId } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: sharedActivityId,
    name: sharedActivityName,
    loggedInUserId: ownerId,
  });
  await shareContentWithEmail({
    contentId: sharedActivityId,
    loggedInUserId: ownerId,
    email: user.email,
  });

  const { id: publicFolderId } = await createContent(ownerId, "folder", null);
  await updateContent({
    contentId: publicFolderId,
    name: publicFolderName,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: publicFolderId,
    isPublic: true,
    loggedInUserId: ownerId,
  });

  const { id: privateFolderId } = await createContent(ownerId, "folder", null);
  await updateContent({
    contentId: privateFolderId,
    name: privateFolderName,
    loggedInUserId: ownerId,
  });

  const { id: sharedFolderId } = await createContent(ownerId, "folder", null);
  await updateContent({
    contentId: sharedFolderId,
    name: sharedFolderName,
    loggedInUserId: ownerId,
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: sharedFolderId,
    loggedInUserId: ownerId,
    users: [userId],
  });

  const searchResults = await searchSharedContent({
    query: sessionNumber,
    isCurated: false,
    loggedInUserId: userId,
  });
  expect(searchResults.length).eq(4);

  const namesInOrder = searchResults
    .sort((a, b) => compareUUID(a.id, b.id))
    .map((c) => c.name);

  expect(namesInOrder).eqls([
    publicActivityName,
    sharedActivityName,
    publicFolderName,
    sharedFolderName,
  ]);
});

test("searchSharedContent returns public/shared activities and folders even in a private folder", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const user = await createTestUser();
  const userId = user.userId;

  // Create unique session number for names in this test
  const sessionNumber = Date.now().toString();

  const { id: parentId } = await createContent(ownerId, "folder", null);

  const publicActivityName = `public activity ${sessionNumber}`;
  const privateActivityName = `private activity ${sessionNumber}`;
  const sharedActivityName = `shared activity ${sessionNumber}`;
  const publicFolderName = `public folder ${sessionNumber}`;
  const privateFolderName = `private folder ${sessionNumber}`;
  const sharedFolderName = `shared folder ${sessionNumber}`;

  const { id: publicActivityId } = await createContent(
    ownerId,
    "singleDoc",
    parentId,
  );
  await updateContent({
    contentId: publicActivityId,
    name: publicActivityName,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: publicActivityId,
    isPublic: true,
    loggedInUserId: ownerId,
  });

  const { id: privateActivityId } = await createContent(
    ownerId,
    "singleDoc",
    parentId,
  );
  await updateContent({
    contentId: privateActivityId,
    name: privateActivityName,
    loggedInUserId: ownerId,
  });

  const { id: sharedActivityId } = await createContent(
    ownerId,
    "singleDoc",
    parentId,
  );
  await updateContent({
    contentId: sharedActivityId,
    name: sharedActivityName,
    loggedInUserId: ownerId,
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: sharedActivityId,
    loggedInUserId: ownerId,
    users: [userId],
  });

  const { id: publicFolderId } = await createContent(
    ownerId,
    "folder",
    parentId,
  );
  await updateContent({
    contentId: publicFolderId,
    name: publicFolderName,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: publicFolderId,
    isPublic: true,
    loggedInUserId: ownerId,
  });

  const { id: privateFolderId } = await createContent(
    ownerId,
    "folder",
    parentId,
  );
  await updateContent({
    contentId: privateFolderId,
    name: privateFolderName,
    loggedInUserId: ownerId,
  });

  const { id: sharedFolderId } = await createContent(
    ownerId,
    "folder",
    parentId,
  );
  await updateContent({
    contentId: sharedFolderId,
    name: sharedFolderName,
    loggedInUserId: ownerId,
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: sharedFolderId,
    loggedInUserId: ownerId,
    users: [userId],
  });

  const searchResults = await searchSharedContent({
    query: sessionNumber,
    isCurated: false,
    loggedInUserId: userId,
  });
  expect(searchResults.length).eq(4);

  const namesInOrder = searchResults
    .sort((a, b) => compareUUID(a.id, b.id))
    .map((c) => c.name);

  expect(namesInOrder).eqls([
    publicActivityName,
    sharedActivityName,
    publicFolderName,
    sharedFolderName,
  ]);
});

test("searchSharedContent, document source matches", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  const owner = await createTestUser();
  const ownerId = owner.userId;
  const code = Date.now().toString();
  const { id: activityId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityId,
    source: `b${code}ananas`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // apple doesn't hit
  let results = await searchSharedContent({
    query: "apple",
    isCurated: false,
    loggedInUserId: userId,
  });
  expect(results.filter((r) => isEqualUUID(r.id, activityId))).toHaveLength(0);

  // first part of a word hits
  results = await searchSharedContent({
    query: `b${code}ana`,
    isCurated: false,
    loggedInUserId: userId,
  });
  expect(results.filter((r) => isEqualUUID(r.id, activityId))).toHaveLength(1);

  // full word hits
  results = await searchSharedContent({
    query: `b${code}ananas`,
    isCurated: false,
    loggedInUserId: userId,
  });
  expect(results.filter((r) => isEqualUUID(r.id, activityId))).toHaveLength(1);
});

test("searchSharedContent, owner name matches", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  // unique code to distinguish content added in this test
  const code = `${Date.now()}`;

  const owner = await createTestUser();
  const ownerId = owner.userId;
  await updateUser({
    userId: ownerId,
    firstNames: `Arya${code}`,
    lastNames: "Abbas",
  });
  const { id: activityId } = await createContent(ownerId, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  let results = await searchSharedContent({
    query: `Arya${code}`,
    isCurated: false,
    loggedInUserId: userId,
  });
  expect(results.filter((r) => isEqualUUID(r.id, activityId))).toHaveLength(1);

  results = await searchSharedContent({
    query: `Arya${code} Abbas`,
    isCurated: false,
    loggedInUserId: userId,
  });
  expect(results.filter((r) => isEqualUUID(r.id, activityId))).toHaveLength(1);
});

test("searchSharedContent, document source is more relevant than classification", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  const owner = await createTestUser();
  const ownerId = owner.userId;

  // unique code to distinguish content added in this test
  const code = `${Date.now()}`;
  const { id: activity1Id } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activity1Id,
    source: `banana${code} muffin${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activity1Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  const { id: activity2Id } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activity2Id,
    source: `apple${code} muffin${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activity2Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // create a bunch more activities, in case this is the first test run on a reset database,
  // to make sure `banana${code}` is a sufficiently relevant search term
  await createContent(ownerId, "singleDoc", null);
  await createContent(ownerId, "singleDoc", null);
  await createContent(ownerId, "singleDoc", null);
  await createContent(ownerId, "singleDoc", null);

  const {
    classificationIdA1A,
    classificationIdA1B,
    classificationIdA2A,
    classificationIdA2B,
    classificationIdB1A,
    classificationIdB1B,
    classificationIdB2A,
    classificationIdB2B,
  } = await createTestClassifications({
    word: "grape",
    code,
  });

  await addClassification(activity2Id, classificationIdA1A, ownerId);
  await addClassification(activity2Id, classificationIdA1B, ownerId);
  await addClassification(activity2Id, classificationIdA2A, ownerId);
  await addClassification(activity2Id, classificationIdA2B, ownerId);
  await addClassification(activity2Id, classificationIdB1A, ownerId);
  await addClassification(activity2Id, classificationIdB1B, ownerId);
  await addClassification(activity2Id, classificationIdB2A, ownerId);
  await addClassification(activity2Id, classificationIdB2B, ownerId);

  let results = await searchSharedContent({
    query: `banana${code} muffin${code}`,
    isCurated: false,
    loggedInUserId: userId,
  });

  expect(results[0].id).eqls(activity1Id);
  expect(results[1].id).eqls(activity2Id);

  // Even adding in three matching classifications doesn't put the match in first
  results = await searchSharedContent({
    query: `grapeA1A${code} banana${code} muffin${code}`,
    loggedInUserId: userId,
    isCurated: false,
  });

  expect(results[0].id).eqls(activity1Id);
  expect(results[1].id).eqls(activity2Id);

  // the classifications do put second activity in first place if don't include
  // document content from the first document
  results = await searchSharedContent({
    query: `grapeA1A${code} muffin${code}`,
    loggedInUserId: userId,
    isCurated: false,
  });

  expect(results[0].id).eqls(activity2Id);
  expect(results[1].id).eqls(activity1Id);
});

test("searchSharedContent, classification increases relevance", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  const owner = await createTestUser();
  const ownerId = owner.userId;

  // unique code to distinguish content added in this test
  const code = `${Date.now()}`;

  const { classificationIdA1A } = await createTestClassifications({
    word: "grape",
    code,
  });

  const { id: activity1Id } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activity1Id,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activity1Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  const { id: activity2Id } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activity2Id,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activity2Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await addClassification(activity2Id, classificationIdA1A, ownerId);

  let results = await searchSharedContent({
    query: `grapeA1A${code} banana${code}`,
    loggedInUserId: userId,
    isCurated: false,
  });

  expect(results[0].id).eqls(activity2Id);
  expect(results[1].id).eqls(activity1Id);

  results = await searchSharedContent({
    query: `grape${code} banana${code}`,
    loggedInUserId: userId,
    isCurated: false,
  });
  expect(results[0].id).eqls(activity2Id);
  expect(results[1].id).eqls(activity1Id);

  results = await searchSharedContent({
    query: `GrapeA1${code} banana${code}`,
    loggedInUserId: userId,
    isCurated: false,
  });
  expect(results[0].id).eqls(activity2Id);
  expect(results[1].id).eqls(activity1Id);

  results = await searchSharedContent({
    query: `GrapeA${code} banana${code}`,
    loggedInUserId: userId,
    isCurated: false,
  });
  expect(results[0].id).eqls(activity2Id);
  expect(results[1].id).eqls(activity1Id);
});

test("searchSharedContent, handle tags in search", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { id: activityId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityId,
    source: "point",
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  const results = await searchSharedContent({
    query: `<point>`,
    isCurated: false,
    loggedInUserId: userId,
  });
  expect(results.length).gte(1);
});

test("searchSharedContent, filter by classification", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  const owner = await createTestUser();
  const ownerId = owner.userId;

  const classification1 = (
    await searchPossibleClassifications({ query: "Trig.TT.3" })
  )[0];
  const classifyId1 = classification1.id;
  const subCategoryId1 = classification1.descriptions[0].subCategory.id;
  const categoryId1 = classification1.descriptions[0].subCategory.category.id;
  const systemId1 =
    classification1.descriptions[0].subCategory.category.system.id;

  const classifyId2 = (
    await searchPossibleClassifications({ query: "Trig.TT.5" })
  )[0].id;
  const classifyId3 = (
    await searchPossibleClassifications({ query: "Trig.PC.2" })
  )[0].id;
  const classifyId4 = (
    await searchPossibleClassifications({ query: "AbsAlg.R.3" })
  )[0].id;
  const classifyId5 = (
    await searchPossibleClassifications({ query: "7.SP.3" })
  )[0].id;

  // unique code to distinguish content added in this test
  const code = `${Date.now()}`;

  // Create identical activities, with only difference being which classification is used
  // classifyId1
  const { id: activity1Id } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activity1Id,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activity1Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await addClassification(activity1Id, classifyId1, ownerId);

  // classifyId2
  const { id: activity2Id } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activity2Id,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activity2Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await addClassification(activity2Id, classifyId2, ownerId);

  // classifyId3
  const { id: activity3Id } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activity3Id,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activity3Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await addClassification(activity3Id, classifyId3, ownerId);

  // classifyId4
  const { id: activity4Id } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activity4Id,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activity4Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await addClassification(activity4Id, classifyId4, ownerId);

  // classifyId5
  const { id: activity5Id } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activity5Id,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activity5Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await addClassification(activity5Id, classifyId5, ownerId);

  // unclassified
  const { id: activity6Id } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activity6Id,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activity6Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // Create one more distractor activity with classification 1 but different text
  const { id: activity7Id } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activity7Id,
    source: `grape${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activity7Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await addClassification(activity7Id, classifyId1, ownerId);

  // get all six activities with no filtering
  let results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
  });
  expect(results.length).eq(6);

  // filtering by unclassified reduces it to one activity
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    isUnclassified: true,
  });
  expect(results.length).eq(1);

  // filtering by system reduces it to four activities
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(results.length).eq(4);

  // filtering by category reduces it to three activities
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    categoryId: categoryId1,
  });
  expect(results.length).eq(3);

  // filtering by subCategory reduces it to two activities
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    subCategoryId: subCategoryId1,
  });
  expect(results.length).eq(2);

  // filtering by classification reduces it to one activity
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    classificationId: classifyId1,
  });
  expect(results.length).eq(1);
});

test("searchSharedContent, filter by activity feature", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  const owner = await createTestUser();
  const ownerId = owner.userId;

  // unique code to distinguish content added in this test
  const code = `${Date.now()}`;

  // Create identical activities, with only difference being the activity features
  // no features
  const { id: activityNId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityNId,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityNId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // is question
  const { id: activityQId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityQId,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityQId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activityQId,
    loggedInUserId: ownerId,
    features: { isQuestion: true },
  });

  // is interactive
  const { id: activityIId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityIId,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activityIId,
    loggedInUserId: ownerId,
    features: { isInteractive: true },
  });

  // contains video
  const { id: activityVId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityVId,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityVId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activityVId,
    loggedInUserId: ownerId,
    features: { containsVideo: true },
  });

  // is question and interactive
  const { id: activityQIId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityQIId,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityQIId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activityQIId,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true },
  });

  // is question and contains video
  const { id: activityQVId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityQVId,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityQVId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activityQVId,
    loggedInUserId: ownerId,
    features: { isQuestion: true, containsVideo: true },
  });

  // is interactive and contains video
  const { id: activityIVId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityIVId,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIVId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activityIVId,
    loggedInUserId: ownerId,
    features: { isInteractive: true, containsVideo: true },
  });

  // is question, is interactive, and contains video
  const { id: activityQIVId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityQIVId,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityQIVId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activityQIVId,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  // Create one more distractor activity with all features but different text
  const { id: activityDId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityDId,
    source: `grape${code}`,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityDId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activityDId,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  // get all eight activities with no filtering
  let results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
  });
  expect(results.map((c) => c.id)).eqls([
    activityNId,
    activityQId,
    activityIId,
    activityVId,
    activityQIId,
    activityQVId,
    activityIVId,
    activityQIVId,
  ]);

  // filter to the four that are questions
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    features: new Set(["isQuestion"]),
  });
  expect(results.map((c) => c.id)).eqls([
    activityQId,
    activityQIId,
    activityQVId,
    activityQIVId,
  ]);

  // filter to the four that are interactive
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    features: new Set(["isInteractive"]),
  });
  expect(results.map((c) => c.id)).eqls([
    activityIId,
    activityQIId,
    activityIVId,
    activityQIVId,
  ]);

  // filter to the four that are contain videos
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    features: new Set(["containsVideo"]),
  });
  expect(results.map((c) => c.id)).eqls([
    activityVId,
    activityQVId,
    activityIVId,
    activityQIVId,
  ]);

  // filter to the two have are a question and interactive
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(results.map((c) => c.id)).eqls([activityQIId, activityQIVId]);

  // filter to the two have are a question and contain a video
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(results.map((c) => c.id)).eqls([activityQVId, activityQIVId]);

  // filter to the two have are interactive and contain a video
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(results.map((c) => c.id)).eqls([activityIVId, activityQIVId]);

  // filter to the one that has all three features
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
  });
  expect(results.map((c) => c.id)).eqls([activityQIVId]);
});

test("searchSharedContent, filter by owner", async () => {
  const { userId } = await createTestUser();

  const { userId: owner1Id } = await createTestUser();
  const { userId: owner2Id } = await createTestUser();

  // unique code to distinguish content added in this test
  const code = `${Date.now()}`;

  // Create identical activities, with only difference being the owner
  const { id: activity1Id } = await createContent(owner1Id, "singleDoc", null);
  await updateContent({
    contentId: activity1Id,
    source: `banana${code}`,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activity1Id,
    loggedInUserId: owner1Id,
    isPublic: true,
  });

  const { id: activity2Id } = await createContent(owner2Id, "singleDoc", null);
  await updateContent({
    contentId: activity2Id,
    source: `banana${code}`,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activity2Id,
    loggedInUserId: owner2Id,
    isPublic: true,
  });

  // get both activities with no filtering
  let results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
  });
  expect(results.map((c) => c.id)).eqls([activity1Id, activity2Id]);

  // filter for owner 1
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    ownerId: owner1Id,
  });
  expect(results.map((c) => c.id)).eqls([activity1Id]);

  // filter for owner 2
  results = await searchSharedContent({
    query: `banana${code}`,
    isCurated: false,
    loggedInUserId: userId,
    ownerId: owner2Id,
  });
  expect(results.map((c) => c.id)).eqls([activity2Id]);
});

test("searchUsersWithSharedContent returns only users with public/shared/non-deleted content", async () => {
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  // owner 1 has only private and deleted content
  const owner1 = await createTestUser();
  const owner1Id = owner1.userId;

  await createContent(owner1Id, "singleDoc", null);
  await createContent(owner1Id, "singleDoc", null);
  const { id: folder1aId } = await createContent(owner1Id, "folder", null);
  await createContent(owner1Id, "singleDoc", folder1aId);
  const { id: activity1dId } = await createContent(owner1Id, "singleDoc", null);
  await setContentIsPublic({
    contentId: activity1dId,
    loggedInUserId: owner1Id,
    isPublic: true,
  });
  await deleteContent(activity1dId, owner1Id);

  // owner 2 has a public activity
  const owner2 = await createTestUser();
  const owner2Id = owner2.userId;

  const { id: folder2aId } = await createContent(owner2Id, "folder", null);
  const { id: activity2aId } = await createContent(
    owner2Id,
    "singleDoc",
    folder2aId,
  );
  await setContentIsPublic({
    contentId: activity2aId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });

  // owner 3 has a public folder
  const owner3 = await createTestUser();
  const owner3Id = owner3.userId;

  const { id: folder3aId } = await createContent(owner3Id, "folder", null);
  await setContentIsPublic({
    contentId: folder3aId,
    loggedInUserId: owner3Id,
    isPublic: true,
  });

  // owner 4 has a activity shared with user1
  const owner4 = await createTestUser();
  const owner4Id = owner4.userId;

  const { id: folder4aId } = await createContent(owner4Id, "folder", null);
  const { id: activity4aId } = await createContent(
    owner4Id,
    "singleDoc",
    folder4aId,
  );
  await modifyContentSharedWith({
    contentId: activity4aId,
    loggedInUserId: owner4Id,
    action: "share",
    users: [user1Id],
  });

  // owner 5 has a folder shared with user 1
  const owner5 = await createTestUser();
  const owner5Id = owner5.userId;

  const { id: folder5aId } = await createContent(owner5Id, "folder", null);
  await modifyContentSharedWith({
    contentId: folder5aId,
    loggedInUserId: owner5Id,
    action: "share",
    users: [user1Id],
  });

  // owner 6 has a activity shared with user2
  const owner6 = await createTestUser();
  const owner6Id = owner6.userId;

  const { id: folder6aId } = await createContent(owner6Id, "folder", null);
  const { id: activity6aId } = await createContent(
    owner6Id,
    "singleDoc",
    folder6aId,
  );
  await modifyContentSharedWith({
    contentId: activity6aId,
    loggedInUserId: owner6Id,
    action: "share",
    users: [user2Id],
  });

  // owner 7 has a folder shared with user 2
  const owner7 = await createTestUser();
  const owner7Id = owner7.userId;

  const { id: folder7aId } = await createContent(owner7Id, "folder", null);
  await modifyContentSharedWith({
    contentId: folder7aId,
    loggedInUserId: owner7Id,
    action: "share",
    users: [user2Id],
  });

  // user1 cannot find owner1
  let searchResults = await searchUsersWithSharedContent({
    query: owner1.lastNames,
    loggedInUserId: user1Id,
  });
  expect(searchResults.length).eq(0);

  // user1 can find owner2
  searchResults = await searchUsersWithSharedContent({
    query: owner2.lastNames,
    loggedInUserId: user1Id,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner2.firstNames);
  expect(searchResults[0].lastNames).eq(owner2.lastNames);

  // user1 can find owner3
  searchResults = await searchUsersWithSharedContent({
    query: owner3.lastNames,
    loggedInUserId: user1Id,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner3.firstNames);
  expect(searchResults[0].lastNames).eq(owner3.lastNames);

  // user1 can find owner4
  searchResults = await searchUsersWithSharedContent({
    query: owner4.lastNames,
    loggedInUserId: user1Id,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner4.firstNames);
  expect(searchResults[0].lastNames).eq(owner4.lastNames);

  // user1 can find owner5
  searchResults = await searchUsersWithSharedContent({
    query: owner5.lastNames,
    loggedInUserId: user1Id,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner5.firstNames);
  expect(searchResults[0].lastNames).eq(owner5.lastNames);

  // user1 cannot find owner6
  searchResults = await searchUsersWithSharedContent({
    query: owner6.lastNames,
    loggedInUserId: user1Id,
  });
  expect(searchResults.length).eq(0);

  // user1 cannot find owner7
  searchResults = await searchUsersWithSharedContent({
    query: owner7.lastNames,
    loggedInUserId: user1Id,
  });
  expect(searchResults.length).eq(0);

  // user2 can find owner6
  searchResults = await searchUsersWithSharedContent({
    query: owner6.lastNames,
    loggedInUserId: user2Id,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner6.firstNames);
  expect(searchResults[0].lastNames).eq(owner6.lastNames);

  // user2 can find owner7
  searchResults = await searchUsersWithSharedContent({
    query: owner7.lastNames,
    loggedInUserId: user2Id,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner7.firstNames);
  expect(searchResults[0].lastNames).eq(owner7.lastNames);

  // user2 cannot find owner4
  searchResults = await searchUsersWithSharedContent({
    query: owner4.lastNames,
    loggedInUserId: user2Id,
  });
  expect(searchResults.length).eq(0);

  // user2 cannot find owner5
  searchResults = await searchUsersWithSharedContent({
    query: owner5.lastNames,
    loggedInUserId: user2Id,
  });
  expect(searchResults.length).eq(0);
});

test("searchUsersWithSharedContent, filter by system, category, sub category, classification", async () => {
  const classificationFA1 = (
    await searchPossibleClassifications({ query: "FinM.A.1" })
  )[0];
  const classificationIdFA1 = classificationFA1.id;
  const subCategoryIdFA = classificationFA1.descriptions[0].subCategory.id;
  const categoryIdF = classificationFA1.descriptions[0].subCategory.category.id;
  const systemId =
    classificationFA1.descriptions[0].subCategory.category.system.id;

  const classificationSD2 = (
    await searchPossibleClassifications({ query: "Stats.DA.2" })
  )[0];
  const classificationIdSD2 = classificationSD2.id;
  const subCategoryIdSD = classificationSD2.descriptions[0].subCategory.id;
  const categoryIdS = classificationSD2.descriptions[0].subCategory.category.id;

  const { userId } = await createTestUser();

  const code = Date.now().toString();
  const ownerLastNames = `Flintstone${code}`;

  // owner 1 has only unclassified content
  const { userId: owner1Id } = await createTestUser();
  await updateUser({
    userId: owner1Id,
    firstNames: "Fred",
    lastNames: ownerLastNames,
  });
  const { id: activity1aId } = await createContent(owner1Id, "singleDoc", null);
  const { id: activity1bId } = await createContent(owner1Id, "singleDoc", null);
  await setContentIsPublic({
    contentId: activity1aId,
    loggedInUserId: owner1Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity1bId,
    loggedInUserId: owner1Id,
    isPublic: true,
  });

  // owner 2 has content in classification FA1
  const { userId: owner2Id } = await createTestUser();
  await updateUser({
    userId: owner2Id,
    firstNames: "Wilma",
    lastNames: ownerLastNames,
  });
  const { id: activity2aId } = await createContent(owner2Id, "singleDoc", null);
  const { id: activity2bId } = await createContent(owner2Id, "singleDoc", null);
  await setContentIsPublic({
    contentId: activity2aId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity2bId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });
  await addClassification(activity2aId, classificationIdFA1, owner2Id);
  await addClassification(activity2bId, classificationIdFA1, owner2Id);

  // owner 3 has a content in classification SD2 and unclassified content
  const { userId: owner3Id } = await createTestUser();
  await updateUser({
    userId: owner3Id,
    firstNames: "Pebbles",
    lastNames: ownerLastNames,
  });

  const { id: activity3aId } = await createContent(owner3Id, "singleDoc", null);
  const { id: activity3bId } = await createContent(owner3Id, "singleDoc", null);
  await setContentIsPublic({
    contentId: activity3aId,
    loggedInUserId: owner3Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity3bId,
    loggedInUserId: owner3Id,
    isPublic: true,
  });
  await addClassification(activity3aId, classificationIdSD2, owner3Id);

  // all three owners found with no filters
  let searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
  });
  expect(searchResults.length).eq(3);
  expect(searchResults.map((u) => u.firstNames).sort()).eqls([
    "Fred",
    "Pebbles",
    "Wilma",
  ]);

  // owners 1 and 3 have unclassified content
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    isUnclassified: true,
  });
  expect(searchResults.length).eq(2);
  expect(searchResults.map((u) => u.firstNames).sort()).eqls([
    "Fred",
    "Pebbles",
  ]);

  // owners 2 and 3 have content classified in systemId
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    systemId,
  });
  expect(searchResults.length).eq(2);
  expect(searchResults.map((u) => u.firstNames).sort()).eqls([
    "Pebbles",
    "Wilma",
  ]);

  // owners 2 has content in classification FA1
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    classificationId: classificationIdFA1,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Wilma");
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdFA,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Wilma");
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    categoryId: categoryIdF,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Wilma");

  // owners 3 has content in classification SD2
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    classificationId: classificationIdSD2,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Pebbles");
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdSD,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Pebbles");
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    categoryId: categoryIdS,
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Pebbles");
});

test("searchUsersWithSharedContent, filter by activity feature", async () => {
  const { userId } = await createTestUser();

  const code = Date.now().toString();
  const ownerLastNames = `Flintstone${code}`;

  // owner 1 has only content without features and isQuestion
  const { userId: owner1Id } = await createTestUser();
  await updateUser({
    userId: owner1Id,
    firstNames: "Fred",
    lastNames: ownerLastNames,
  });
  const { id: activity1aId } = await createContent(owner1Id, "singleDoc", null);
  const { id: activity1bId } = await createContent(owner1Id, "singleDoc", null);
  await setContentIsPublic({
    contentId: activity1aId,
    loggedInUserId: owner1Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity1bId,
    loggedInUserId: owner1Id,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activity1bId,
    loggedInUserId: owner1Id,
    features: { isQuestion: true },
  });

  // owner 2 has content combinations of two features
  const { userId: owner2Id } = await createTestUser();
  await updateUser({
    userId: owner2Id,
    firstNames: "Wilma",
    lastNames: ownerLastNames,
  });
  const { id: activity2aId } = await createContent(owner2Id, "singleDoc", null);
  const { id: activity2bId } = await createContent(owner2Id, "singleDoc", null);
  const { id: activity2cId } = await createContent(owner2Id, "singleDoc", null);
  await setContentIsPublic({
    contentId: activity2aId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity2bId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity2cId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activity2aId,
    loggedInUserId: owner2Id,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activity2bId,
    loggedInUserId: owner2Id,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activity2cId,
    loggedInUserId: owner2Id,
    features: { containsVideo: true, isInteractive: true },
  });

  // owner 3 has a content with isInteractive and containsVideo
  const { userId: owner3Id } = await createTestUser();
  await updateUser({
    userId: owner3Id,
    firstNames: "Pebbles",
    lastNames: ownerLastNames,
  });

  const { id: activity3aId } = await createContent(owner3Id, "singleDoc", null);
  const { id: activity3bId } = await createContent(owner3Id, "singleDoc", null);
  await setContentIsPublic({
    contentId: activity3aId,
    loggedInUserId: owner3Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity3bId,
    loggedInUserId: owner3Id,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activity3aId,
    loggedInUserId: owner3Id,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activity3bId,
    loggedInUserId: owner3Id,
    features: { containsVideo: true },
  });

  // all three owners found with no filters
  let searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
  });
  expect(searchResults.length).eq(3);
  expect(searchResults.map((u) => u.firstNames).sort()).eqls([
    "Fred",
    "Pebbles",
    "Wilma",
  ]);

  // owners 1 and 2 have isQuestion
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    features: new Set(["isQuestion"]),
  });
  expect(searchResults.length).eq(2);
  expect(searchResults.map((u) => u.firstNames).sort()).eqls(["Fred", "Wilma"]);

  // owners 2 and 3 have isInteractive
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    features: new Set(["isInteractive"]),
  });
  expect(searchResults.length).eq(2);
  expect(searchResults.map((u) => u.firstNames).sort()).eqls([
    "Pebbles",
    "Wilma",
  ]);

  // owners 2 and 3 have containsVideo
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    features: new Set(["containsVideo"]),
  });
  expect(searchResults.length).eq(2);
  expect(searchResults.map((u) => u.firstNames).sort()).eqls([
    "Pebbles",
    "Wilma",
  ]);

  // owners 2 has combinations of two features
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Wilma");
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Wilma");
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    features: new Set(["containsVideo", "isInteractive"]),
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Wilma");

  // no one has all three features
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    features: new Set(["containsVideo", "isInteractive", "isQuestion"]),
  });
  expect(searchResults.length).eq(0);
});

test("searchClassificationsWithSharedContent, returns only classifications with public/shared/non-deleted content", async () => {
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;
  const owner = await createTestUser();
  const ownerId = owner.userId;

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "banana";

  const systemId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].descriptions[0].subCategory.category.system.id;

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    categoryIdB,
    subCategoryIdB2,
    classificationIdB2B,
  } = await createTestClassifications({ systemId, word, code });

  const { id: activityIdPrivate } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { id: activityIdPublic } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { id: activityIdShared } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { id: activityIdDeleted } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

  await setContentIsPublic({
    contentId: activityIdPublic,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await modifyContentSharedWith({
    contentId: activityIdShared,
    loggedInUserId: ownerId,
    action: "share",
    users: [user1Id],
  });
  await setContentIsPublic({
    contentId: activityIdDeleted,
    isPublic: true,
    loggedInUserId: ownerId,
  });

  // add private, shared, deleted content to classificationIdA1A
  await addClassification(activityIdPrivate, classificationIdA1A, ownerId);
  await addClassification(activityIdShared, classificationIdA1A, ownerId);
  await addClassification(activityIdDeleted, classificationIdA1A, ownerId);

  // add public, private, shared, deleted content to classificationIdB2B
  await addClassification(activityIdPublic, classificationIdB2B, ownerId);
  await addClassification(activityIdPrivate, classificationIdB2B, ownerId);
  await addClassification(activityIdShared, classificationIdB2B, ownerId);
  await addClassification(activityIdDeleted, classificationIdB2B, ownerId);

  // actually delete the deleted activity
  await deleteContent(activityIdDeleted, ownerId);

  // user1 gets classifications with shared and public content
  let resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}B2B${code}`,
    loggedInUserId: user1Id,
  });
  expect(resultsClass.length).eq(2); // order determined by second query word
  expect(resultsClass[0].classification!.id).eq(classificationIdB2B);
  expect(resultsClass[1].classification!.id).eq(classificationIdA1A);
  let resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code} ${word}A1${code}`,
    loggedInUserId: user1Id,
  });
  expect(resultsSubCat.length).eq(2); // ordered determined by second query word
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubCat[1].subCategory!.id).eq(subCategoryIdB2);
  let resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code} ${word}B${code}`,
    loggedInUserId: user1Id,
  });
  expect(resultsCat.length).eq(2); // ordered determined by second query word
  expect(resultsCat[0].category!.id).eq(categoryIdB);
  expect(resultsCat[1].category!.id).eq(categoryIdA);

  // user2 just gets classifications with public
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: user2Id,
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdB2B);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: user2Id,
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdB2);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: user2Id,
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryIdB);
});

test("searchClassificationsWithSharedContent, filter by system, category, sub category", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const owner = await createTestUser();
  const ownerId = owner.userId;

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "banana";

  const systemId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].descriptions[0].subCategory.category.system.id;

  const systemIdOther = (
    await searchPossibleClassifications({ query: "K.CC.1" })
  )[0].descriptions[0].subCategory.category.system.id;

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    classificationIdA1B,
    subCategoryIdA2,
    classificationIdA2A,
    classificationIdA2B,
    categoryIdB,
    subCategoryIdB1,
    classificationIdB1A,
    classificationIdB1B,
    subCategoryIdB2,
    classificationIdB2A,
    classificationIdB2B,
  } = await createTestClassifications({ systemId, word, code });

  // add activity 1A to classificationIdA1A, classificationIdB1A
  const { id: activityId1A } = await createContent(ownerId, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityId1A,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityId1A, classificationIdA1A, ownerId);
  await addClassification(activityId1A, classificationIdB1A, ownerId);

  // add activity 2A to classificationIdA2A, classificationIdB2A
  const { id: activityId2A } = await createContent(ownerId, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityId2A,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityId2A, classificationIdA2A, ownerId);
  await addClassification(activityId2A, classificationIdB2A, ownerId);

  // add activity 1B to classificationIdA1B, classificationIdB1B
  const { id: activityId1B } = await createContent(ownerId, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityId1B,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityId1B, classificationIdA1B, ownerId);
  await addClassification(activityId1B, classificationIdB1B, ownerId);

  // add activity 2B to classificationIdA2B, classificationIdB2B
  const { id: activityId2B } = await createContent(ownerId, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityId2B,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityId2B, classificationIdA2B, ownerId);
  await addClassification(activityId2B, classificationIdB2B, ownerId);

  // add activity A1 to classificationIdA1A, classificationIdA1A
  const { id: activityId1 } = await createContent(ownerId, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityId1,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityId1, classificationIdA1A, ownerId);
  await addClassification(activityId1, classificationIdA1B, ownerId);

  // add activity A2 to classificationIdA2A, classificationIdA2A
  const { id: activityIdA2 } = await createContent(ownerId, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityIdA2,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdA2, classificationIdA2A, ownerId);
  await addClassification(activityIdA2, classificationIdA2B, ownerId);

  // add activity B1 to classificationIdB1A, classificationIdB1A
  const { id: activityIdB1 } = await createContent(ownerId, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityIdB1,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdB1, classificationIdB1A, ownerId);
  await addClassification(activityIdB1, classificationIdB1B, ownerId);

  // add activity B2 to classificationIdB2A, classificationIdB2A
  const { id: activityIdB2 } = await createContent(ownerId, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityIdB2,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdB2, classificationIdB2A, ownerId);
  await addClassification(activityIdB2, classificationIdB2B, ownerId);

  // without filter get all eight classifications, with first determined by second query word
  let resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A2B${code}`,
    loggedInUserId: userId,
  });
  expect(resultsClass.length).eq(8);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2B);

  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}B1A${code}`,
    loggedInUserId: userId,
  });
  expect(resultsClass.length).eq(8);
  expect(resultsClass[0].classification!.id).eq(classificationIdB1A);

  // without filter get all four sub categories, with first determined by second query word
  let resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code} ${word}B1${code}`,
    loggedInUserId: userId,
  });
  expect(resultsSubCat.length).eq(4);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdB1);

  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code} ${word}A2${code}`,
    loggedInUserId: userId,
  });
  expect(resultsSubCat.length).eq(4);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdA2);

  // without filter get all both categories, with order determined by second query word
  let resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code} ${word}B${code}`,
    loggedInUserId: userId,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryIdB);
  expect(resultsCat[1].category!.id).eq(categoryIdA);

  // filtering by systemId doesn't change the results
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A2A${code}`,
    loggedInUserId: userId,
    systemId,
  });
  expect(resultsClass.length).eq(8);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);

  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code} ${word}A1${code}`,
    loggedInUserId: userId,
    systemId,
  });
  expect(resultsSubCat.length).eq(4);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdA1);

  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code} ${word}A${code}`,
    loggedInUserId: userId,
    systemId,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryIdA);
  expect(resultsCat[1].category!.id).eq(categoryIdB);

  // filtering by systemIdOther filters out all results
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A2A${code}`,
    loggedInUserId: userId,
    systemId: systemIdOther,
  });
  expect(resultsClass.length).eq(0);

  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code} ${word}A1${code}`,
    loggedInUserId: userId,
    systemId: systemIdOther,
  });
  expect(resultsSubCat.length).eq(0);

  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code} ${word}A${code}`,
    loggedInUserId: userId,
    systemId: systemIdOther,
  });
  expect(resultsCat.length).eq(0);

  // filter by category B
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}B2B${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdB,
  });
  expect(resultsClass.length).eq(4);
  expect(resultsClass[0].classification!.id).eq(classificationIdB2B);
  expect(
    resultsClass
      .slice(1)
      .map((c) => c.classification!.id)
      .sort(),
  ).eqls(
    [classificationIdB1A, classificationIdB1B, classificationIdB2A].sort(),
  );

  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code} ${word}B2${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdB,
  });
  expect(resultsSubCat.length).eq(2);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdB2);
  expect(resultsSubCat[1].subCategory!.id).eq(subCategoryIdB1);

  // filter by sub category A2
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A2B${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2B);
  expect(resultsClass[1].classification!.id).eq(classificationIdA2A);
});

test("searchClassificationsWithSharedContent, filter by activity feature", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const owner = await createTestUser();
  const ownerId = owner.userId;

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "banana";

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    categoryIdB,
    subCategoryIdB2,
    classificationIdB2B,
  } = await createTestClassifications({ word, code });

  // add two activities to A1A and B2B
  const { id: activityIdA1 } = await createContent(ownerId, "singleDoc", null);
  const { id: activityIdA2 } = await createContent(ownerId, "singleDoc", null);
  const { id: activityIdB1 } = await createContent(ownerId, "singleDoc", null);
  const { id: activityIdB2 } = await createContent(ownerId, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityIdA1,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdA2,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdB1,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdB2,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdA1, classificationIdA1A, ownerId);
  await addClassification(activityIdA2, classificationIdA1A, ownerId);
  await addClassification(activityIdB1, classificationIdB2B, ownerId);
  await addClassification(activityIdB2, classificationIdB2B, ownerId);

  // add single activity feature to three of the activities
  await updateContentFeatures({
    contentId: activityIdA1,
    loggedInUserId: ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    contentId: activityIdA2,
    loggedInUserId: ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdB1,
    loggedInUserId: ownerId,
    features: { containsVideo: true },
  });

  // without filter, get two classifications, sub categories, and categories
  let resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}B2B${code}`,
    loggedInUserId: userId,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.code).eq(`${word}B2B${code}`);
  let resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
  });
  expect(resultsSubCat.length).eq(2);
  let resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
  });
  expect(resultsCat.length).eq(2);

  // filter by isQuestion
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}B2B${code}`, // make sure filter out match hitting code
    loggedInUserId: userId,
    features: new Set(["isQuestion"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isQuestion"]),
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdA1);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isQuestion"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryIdA);

  // filter by isInteractive
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}B2B${code}`, // make sure filter out match hitting code
    loggedInUserId: userId,
    features: new Set(["isInteractive"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isInteractive"]),
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdA1);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isInteractive"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryIdA);

  // filter by containsVideo
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A1A${code}`, // make sure filter out match hitting code
    loggedInUserId: userId,
    features: new Set(["containsVideo"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdB2B);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["containsVideo"]),
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdB2);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["containsVideo"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryIdB);

  // nothing if filter by pairs of features
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A1A${code}`, // make sure filter out match hitting code
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsClass.length).eq(0);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsSubCat.length).eq(0);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsCat.length).eq(0);

  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A1A${code}`, // make sure filter out match hitting code
    loggedInUserId: userId,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsClass.length).eq(0);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsSubCat.length).eq(0);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsCat.length).eq(0);

  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A1A${code}`, // make sure filter out match hitting code
    loggedInUserId: userId,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsClass.length).eq(0);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsSubCat.length).eq(0);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsCat.length).eq(0);

  // add second feature to the three activities
  await updateContentFeatures({
    contentId: activityIdA1,
    loggedInUserId: ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdA2,
    loggedInUserId: ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdB1,
    loggedInUserId: ownerId,
    features: { isQuestion: true },
  });

  // filter by pairs of features again
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}B2B${code}`, // make sure filter out match hitting code
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdA1);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryIdA);

  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}B2B${code}`, // make sure filter out match hitting code
    loggedInUserId: userId,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdA1);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryIdA);

  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A1A${code}`, // make sure filter out match hitting code
    loggedInUserId: userId,
    features: new Set(["containsVideo", "isQuestion"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdB2B);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["containsVideo", "isQuestion"]),
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdB2);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["containsVideo", "isQuestion"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryIdB);

  // filter by all three features
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A1A${code}`, // make sure filter out match hitting code
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
  });
  expect(resultsClass.length).eq(0);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
  });
  expect(resultsSubCat.length).eq(0);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
  });
  expect(resultsCat.length).eq(0);
});

test("searchClassificationsWithSharedContent, filter by owner", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const { userId: owner1Id } = await createTestUser();
  const { userId: owner2Id } = await createTestUser();
  const { userId: owner3Id } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "banana";

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    categoryIdB,
    subCategoryIdB2,
    classificationIdB2B,
  } = await createTestClassifications({ word, code });

  // add two activities to A1A and B2B
  const { id: activityIdA1 } = await createContent(owner1Id, "singleDoc", null);
  const { id: activityIdA2 } = await createContent(owner2Id, "singleDoc", null);
  const { id: activityIdB1 } = await createContent(owner2Id, "singleDoc", null);
  const { id: activityIdB2 } = await createContent(owner3Id, "singleDoc", null);
  await setContentIsPublic({
    contentId: activityIdA1,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityIdA2,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityIdB1,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityIdB2,
    isPublic: true,
    loggedInUserId: owner3Id,
  });
  await addClassification(activityIdA1, classificationIdA1A, owner1Id);
  await addClassification(activityIdA2, classificationIdA1A, owner2Id);
  await addClassification(activityIdB1, classificationIdB2B, owner2Id);
  await addClassification(activityIdB2, classificationIdB2B, owner3Id);

  // without filter, get two classifications, sub categories, and categories
  let resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
  });
  expect(resultsClass.length).eq(2);
  let resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
  });
  expect(resultsSubCat.length).eq(2);
  let resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
  });
  expect(resultsCat.length).eq(2);

  // filter by owner 1
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    ownerId: owner1Id,
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    ownerId: owner1Id,
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdA1);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    ownerId: owner1Id,
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryIdA);

  // filter by owner 2
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    ownerId: owner2Id,
  });
  expect(resultsClass.length).eq(2);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    ownerId: owner2Id,
  });
  expect(resultsSubCat.length).eq(2);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    ownerId: owner2Id,
  });
  expect(resultsCat.length).eq(2);

  // filter by owner 3
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    ownerId: owner3Id,
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdB2B);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    ownerId: owner3Id,
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategory!.id).eq(subCategoryIdB2);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    ownerId: owner3Id,
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryIdB);
});

test(
  "search my folder content searches all subfolders",
  { timeout: 30000 },
  async () => {
    const owner = await createTestUser();
    const ownerId = owner.userId;

    // Folder structure
    // The Base folder
    // - The first topic
    //   - First activity
    //   - Deleted activity (deleted)
    //   - Subtopic
    //     - First piece (deleted)
    //     - Second piece
    // - Activity 2
    // - Activity 3 (deleted)
    // Activity gone (deleted)
    // Activity root, first

    const { id: baseFolderId } = await createContent(ownerId, "folder", null);
    await updateContent({
      contentId: baseFolderId,
      loggedInUserId: ownerId,
      name: "The Base Folder",
    });
    const { id: folder1Id } = await createContent(
      ownerId,
      "folder",
      baseFolderId,
    );
    await updateContent({
      contentId: folder1Id,
      loggedInUserId: ownerId,
      name: "The first topic",
    });

    const { id: activity1aId } = await createContent(
      ownerId,
      "singleDoc",
      folder1Id,
    );
    await updateContent({
      contentId: activity1aId,
      loggedInUserId: ownerId,
      name: "First activity",
    });

    const { id: activity1bId } = await createContent(
      ownerId,
      "singleDoc",
      folder1Id,
    );
    await updateContent({
      contentId: activity1bId,
      loggedInUserId: ownerId,
      name: "Deleted activity",
    });
    await deleteContent(activity1bId, ownerId);

    const { id: folder1cId } = await createContent(
      ownerId,
      "folder",
      folder1Id,
    );
    await updateContent({
      contentId: folder1cId,
      loggedInUserId: ownerId,
      name: "Subtopic ",
    });

    const { id: activity1c1Id } = await createContent(
      ownerId,
      "singleDoc",
      folder1cId,
    );
    await updateContent({
      contentId: activity1c1Id,
      loggedInUserId: ownerId,
      name: "First piece",
    });
    await deleteContent(activity1c1Id, ownerId);

    const { id: activity1c2Id } = await createContent(
      ownerId,
      "singleDoc",
      folder1cId,
    );
    await updateContent({
      contentId: activity1c2Id,
      loggedInUserId: ownerId,
      name: "Second piece",
    });

    const { id: activity2Id } = await createContent(
      ownerId,
      "singleDoc",
      baseFolderId,
    );
    await updateContent({
      contentId: activity2Id,
      loggedInUserId: ownerId,
      name: "Activity 2",
    });
    const { id: activity3Id } = await createContent(
      ownerId,
      "singleDoc",
      baseFolderId,
    );
    await updateContent({
      contentId: activity3Id,
      loggedInUserId: ownerId,
      name: "Activity 3",
    });
    await deleteContent(activity3Id, ownerId);

    const { id: activityGoneId } = await createContent(
      ownerId,
      "singleDoc",
      null,
    );
    await updateContent({
      contentId: activityGoneId,
      loggedInUserId: ownerId,
      name: "Activity gone",
    });
    await deleteContent(activityGoneId, ownerId);
    const { id: activityRootId } = await createContent(
      ownerId,
      "singleDoc",
      null,
    );
    await updateContent({
      contentId: activityRootId,
      loggedInUserId: ownerId,
      name: "Activity root, first",
    });

    let searchResults = await searchMyContent({
      parentId: null,
      loggedInUserId: ownerId,
      query: "first",
    });
    expect(searchResults.folder).eq(null);
    let content = searchResults.content;
    expect(content.length).eq(3);
    expect(
      content
        .sort((a, b) => compareUUID(a.id, b.id))
        .map((c) => ({
          id: fromUUID(c.id),
          parentId: c.parent ? fromUUID(c.parent.id) : null,
        })),
    ).eqls([
      { id: fromUUID(folder1Id), parentId: fromUUID(baseFolderId) },
      { id: fromUUID(activity1aId), parentId: fromUUID(folder1Id) },
      { id: fromUUID(activityRootId), parentId: null },
    ]);

    searchResults = await searchMyContent({
      parentId: baseFolderId,
      loggedInUserId: ownerId,
      query: "first",
    });
    expect(fromUUID(searchResults.folder!.id)).eq(fromUUID(baseFolderId));
    content = searchResults.content;
    expect(content.length).eq(2);
    expect(
      content
        .sort((a, b) => compareUUID(a.id, b.id))
        .map((c) => ({
          id: fromUUID(c.id),
          parentId: c.parent ? fromUUID(c.parent.id) : null,
        })),
    ).eqls([
      { id: fromUUID(folder1Id), parentId: fromUUID(baseFolderId) },
      { id: fromUUID(activity1aId), parentId: fromUUID(folder1Id) },
    ]);

    searchResults = await searchMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
      query: "first",
    });
    expect(fromUUID(searchResults.folder!.id)).eq(fromUUID(folder1Id));
    content = searchResults.content;
    expect(content.length).eq(1);
    expect(
      content
        .sort((a, b) => compareUUID(a.id, b.id))
        .map((c) => ({
          id: fromUUID(c.id),
          parentId: c.parent ? fromUUID(c.parent.id) : null,
        })),
    ).eqls([{ id: fromUUID(activity1aId), parentId: fromUUID(folder1Id) }]);

    searchResults = await searchMyContent({
      parentId: folder1cId,
      loggedInUserId: ownerId,
      query: "first",
    });
    expect(fromUUID(searchResults.folder!.id)).eq(fromUUID(folder1cId));
    content = searchResults.content;
    expect(content.length).eq(0);

    searchResults = await searchMyContent({
      parentId: null,
      loggedInUserId: ownerId,
      query: "activity",
    });
    expect(searchResults.folder).eq(null);
    content = searchResults.content;
    expect(content.length).eq(3);
    expect(
      content
        .sort((a, b) => compareUUID(a.id, b.id))
        .map((c) => ({
          id: fromUUID(c.id),
          parentId: c.parent ? fromUUID(c.parent.id) : null,
        })),
    ).eqls([
      { id: fromUUID(activity1aId), parentId: fromUUID(folder1Id) },
      { id: fromUUID(activity2Id), parentId: fromUUID(baseFolderId) },
      { id: fromUUID(activityRootId), parentId: null },
    ]);

    searchResults = await searchMyContent({
      parentId: baseFolderId,
      loggedInUserId: ownerId,
      query: "activity",
    });
    expect(fromUUID(searchResults.folder!.id)).eq(fromUUID(baseFolderId));
    content = searchResults.content;
    expect(content.length).eq(2);
    expect(
      content
        .sort((a, b) => compareUUID(a.id, b.id))
        .map((c) => ({
          id: fromUUID(c.id),
          parentId: c.parent ? fromUUID(c.parent.id) : null,
        })),
    ).eqls([
      { id: fromUUID(activity1aId), parentId: fromUUID(folder1Id) },
      { id: fromUUID(activity2Id), parentId: fromUUID(baseFolderId) },
    ]);

    searchResults = await searchMyContent({
      parentId: folder1Id,
      loggedInUserId: ownerId,
      query: "activity",
    });
    expect(fromUUID(searchResults.folder!.id)).eq(fromUUID(folder1Id));
    content = searchResults.content;
    expect(content.length).eq(1);
    expect(
      content
        .sort((a, b) => compareUUID(a.id, b.id))
        .map((c) => ({
          id: fromUUID(c.id),
          parentId: c.parent ? fromUUID(c.parent.id) : null,
        })),
    ).eqls([{ id: fromUUID(activity1aId), parentId: fromUUID(folder1Id) }]);

    searchResults = await searchMyContent({
      parentId: folder1cId,
      loggedInUserId: ownerId,
      query: "activity",
    });
    expect(fromUUID(searchResults.folder!.id)).eq(fromUUID(folder1cId));
    content = searchResults.content;
    expect(content.length).eq(0);
  },
);

test("searchMyContent, document source matches", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { id: activityId } = await createContent(ownerId, "singleDoc", null);
  await updateContent({
    contentId: activityId,
    source: "bananas",
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // apple doesn't hit
  let searchResults = await searchMyContent({
    parentId: null,
    loggedInUserId: ownerId,
    query: "apple",
  });
  let content = searchResults.content;
  expect(content.length).eq(0);

  // first part of a word hits
  searchResults = await searchMyContent({
    parentId: null,
    loggedInUserId: ownerId,
    query: "bana",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // full word hits
  searchResults = await searchMyContent({
    parentId: null,
    loggedInUserId: ownerId,
    query: "bananas",
  });
  content = searchResults.content;
  expect(content.length).eq(1);
});

test("searchMyContent, classification matches", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { id: activityId } = await createContent(ownerId, "singleDoc", null);

  let searchResults = await searchMyContent({
    parentId: null,
    loggedInUserId: ownerId,
    query: "K.CC.1 comMMon cOREe",
  });
  let content = searchResults.content;
  expect(content.length).eq(0);

  const classifyId = (
    await searchPossibleClassifications({ query: "K.CC.1 common core" })
  )[0].id;

  await addClassification(activityId, classifyId, ownerId);
  // With code
  searchResults = await searchMyContent({
    parentId: null,
    loggedInUserId: ownerId,
    query: "K.C",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With both
  searchResults = await searchMyContent({
    parentId: null,
    loggedInUserId: ownerId,
    query: "common C.1",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With category
  searchResults = await searchMyContent({
    parentId: null,
    loggedInUserId: ownerId,
    query: "kinder",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With subcategory
  searchResults = await searchMyContent({
    parentId: null,
    loggedInUserId: ownerId,
    query: "cardinality",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With description
  searchResults = await searchMyContent({
    parentId: null,
    loggedInUserId: ownerId,
    query: "tens",
  });
  content = searchResults.content;
  expect(content.length).eq(1);
});

test("searchMyContent in folder, classification matches", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { id: folderId } = await createContent(ownerId, "folder", null);
  const { id: activityId } = await createContent(
    ownerId,
    "singleDoc",
    folderId,
  );

  let searchResults = await searchMyContent({
    parentId: folderId,
    loggedInUserId: ownerId,
    query: "K.CC.1 comMMon cOREe",
  });
  let content = searchResults.content;
  expect(content.length).eq(0);

  const classifyId = (
    await searchPossibleClassifications({ query: "K.CC.1 common core" })
  )[0].id;

  await addClassification(activityId, classifyId, ownerId);
  // With code
  searchResults = await searchMyContent({
    parentId: folderId,
    loggedInUserId: ownerId,
    query: "K.C",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With both
  searchResults = await searchMyContent({
    parentId: folderId,
    loggedInUserId: ownerId,
    query: "common C.1",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With category
  searchResults = await searchMyContent({
    parentId: folderId,
    loggedInUserId: ownerId,
    query: "kinder",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With subcategory
  searchResults = await searchMyContent({
    parentId: folderId,
    loggedInUserId: ownerId,
    query: "cardinality",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With description
  searchResults = await searchMyContent({
    parentId: folderId,
    loggedInUserId: ownerId,
    query: "tens",
  });
  content = searchResults.content;
  expect(content.length).eq(1);
});

test("searchMyContent, handle tags in search", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { id: activityId } = await createContent(ownerId, "singleDoc", null);

  await updateContent({
    contentId: activityId,
    source: "point",
    loggedInUserId: ownerId,
  });

  const searchResults = await searchMyContent({
    parentId: null,
    loggedInUserId: ownerId,
    query: "<point>",
  });
  const content = searchResults.content;
  expect(content.length).eq(1);
});
