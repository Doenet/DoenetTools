import { expect, test } from "vitest";
import {
  addClassification,
  createActivity,
  createFolder,
  deleteActivity,
  makeActivityPublic,
  makeFolderPublic,
  searchClassificationsWithSharedContent,
  searchMyFolderContent,
  searchPossibleClassifications,
  searchSharedContent,
  searchUsersWithSharedContent,
  shareActivity,
  shareActivityWithEmail,
  shareFolder,
  updateContent,
  updateDoc,
  updateUser,
} from "../model";
import { createTestUser } from "./utils";
import { compareUUID, fromUUID, isEqualUUID } from "../utils/uuid";

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

  const { activityId: publicActivityId } = await createActivity(ownerId, null);
  await updateContent({
    id: publicActivityId,
    name: publicActivityName,
    ownerId,
  });
  await makeActivityPublic({
    id: publicActivityId,
    licenseCode: "CCDUAL",
    ownerId,
  });

  const { activityId: privateActivityId } = await createActivity(ownerId, null);
  await updateContent({
    id: privateActivityId,
    name: privateActivityName,
    ownerId,
  });

  const { activityId: sharedActivityId } = await createActivity(ownerId, null);
  await updateContent({
    id: sharedActivityId,
    name: sharedActivityName,
    ownerId,
  });
  await shareActivityWithEmail({
    id: sharedActivityId,
    licenseCode: "CCDUAL",
    ownerId,
    email: user.email,
  });

  const { folderId: publicFolderId } = await createFolder(ownerId, null);
  await updateContent({
    id: publicFolderId,
    name: publicFolderName,
    ownerId,
  });
  await makeFolderPublic({
    id: publicFolderId,
    licenseCode: "CCDUAL",
    ownerId,
  });

  const { folderId: privateFolderId } = await createFolder(ownerId, null);
  await updateContent({
    id: privateFolderId,
    name: privateFolderName,
    ownerId,
  });

  const { folderId: sharedFolderId } = await createFolder(ownerId, null);
  await updateContent({
    id: sharedFolderId,
    name: sharedFolderName,
    ownerId,
  });
  await shareFolder({
    id: sharedFolderId,
    licenseCode: "CCDUAL",
    ownerId,
    users: [userId],
  });

  const searchResults = await searchSharedContent({
    query: sessionNumber,
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

  const { folderId: parentFolderId } = await createFolder(ownerId, null);

  const publicActivityName = `public activity ${sessionNumber}`;
  const privateActivityName = `private activity ${sessionNumber}`;
  const sharedActivityName = `shared activity ${sessionNumber}`;
  const publicFolderName = `public folder ${sessionNumber}`;
  const privateFolderName = `private folder ${sessionNumber}`;
  const sharedFolderName = `shared folder ${sessionNumber}`;

  const { activityId: publicActivityId } = await createActivity(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: publicActivityId,
    name: publicActivityName,
    ownerId,
  });
  await makeActivityPublic({
    id: publicActivityId,
    licenseCode: "CCDUAL",
    ownerId,
  });

  const { activityId: privateActivityId } = await createActivity(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: privateActivityId,
    name: privateActivityName,
    ownerId,
  });

  const { activityId: sharedActivityId } = await createActivity(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: sharedActivityId,
    name: sharedActivityName,
    ownerId,
  });
  await shareActivity({
    id: sharedActivityId,
    licenseCode: "CCDUAL",
    ownerId,
    users: [userId],
  });

  const { folderId: publicFolderId } = await createFolder(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: publicFolderId,
    name: publicFolderName,
    ownerId,
  });
  await makeFolderPublic({
    id: publicFolderId,
    licenseCode: "CCDUAL",
    ownerId,
  });

  const { folderId: privateFolderId } = await createFolder(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: privateFolderId,
    name: privateFolderName,
    ownerId,
  });

  const { folderId: sharedFolderId } = await createFolder(
    ownerId,
    parentFolderId,
  );
  await updateContent({
    id: sharedFolderId,
    name: sharedFolderName,
    ownerId,
  });
  await shareFolder({
    id: sharedFolderId,
    licenseCode: "CCDUAL",
    ownerId,
    users: [userId],
  });

  const searchResults = await searchSharedContent({
    query: sessionNumber,
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
  const { activityId, docId } = await createActivity(ownerId, null);
  await updateDoc({ id: docId, source: `b${code}ananas`, ownerId });
  await makeActivityPublic({
    id: activityId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });

  // apple doesn't hit
  let results = await searchSharedContent({
    query: "apple",
    loggedInUserId: userId,
  });
  expect(results.filter((r) => isEqualUUID(r.id, activityId))).toHaveLength(0);

  // first part of a word hits
  results = await searchSharedContent({
    query: `b${code}ana`,
    loggedInUserId: userId,
  });
  expect(results.filter((r) => isEqualUUID(r.id, activityId))).toHaveLength(1);

  // full word hits
  results = await searchSharedContent({
    query: `b${code}ananas`,
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
  const { activityId } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });

  let results = await searchSharedContent({
    query: `Arya${code}`,
    loggedInUserId: userId,
  });
  expect(results.filter((r) => isEqualUUID(r.id, activityId))).toHaveLength(1);

  results = await searchSharedContent({
    query: `Arya${code} Abbas`,
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
  const { activityId: activity1Id, docId: doc1Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc1Id,
    source: `banana${code} muffin${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity1Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });

  const { activityId: activity2Id, docId: doc2Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc2Id,
    source: `apple${code} muffin${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity2Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });

  // create a third activity, in case this is the first test run on a reset database,
  // just to make sure `banana${code}` is a relevant search term,
  // i.e., it appears in fewer than half the records
  await createActivity(ownerId, null);

  const { id: classify1Id } = (
    await searchPossibleClassifications({ query: "K.CC.1 common core" })
  ).find((k) => k.code === "K.CC.1")!;
  await addClassification(activity2Id, classify1Id, ownerId);

  const { id: classify2Id } = (
    await searchPossibleClassifications({ query: "K.OA.1 common core" })
  ).find((k) => k.code === "K.OA.1")!;
  await addClassification(activity2Id, classify2Id, ownerId);

  const { id: classify3Id } = (
    await searchPossibleClassifications({ query: "A.SSE.3" })
  ).find((k) => k.code === "A.SSE.3 c.")!;
  await addClassification(activity2Id, classify3Id, ownerId);

  // First make sure irrelevant classifications don't help relevance
  // (as they did when summed over records rather than taking average)
  let results = await searchSharedContent({
    query: `banana${code} muffin${code}`,
    loggedInUserId: userId,
  });

  expect(results[0].id).eqls(activity1Id);
  expect(results[1].id).eqls(activity2Id);

  // Even adding in two matching classifications doesn't put the match in first
  results = await searchSharedContent({
    query: `K.CC.1 K.OA.1 A.SSE.3 banana${code} muffin${code}`,
    loggedInUserId: userId,
  });

  expect(results[0].id).eqls(activity1Id);
  expect(results[1].id).eqls(activity2Id);
});

test("searchSharedContent, classification increases relevance", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  const owner = await createTestUser();
  const ownerId = owner.userId;

  const classifyId = (
    await searchPossibleClassifications({ query: "K.CC.3 common core" })
  )[0].id;

  // unique code to distinguish content added in this test
  const code = `${Date.now()}`;
  const { activityId: activity1Id, docId: doc1Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc1Id,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity1Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });

  const { activityId: activity2Id, docId: doc2Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc2Id,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity2Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity2Id, classifyId, ownerId);

  let results = await searchSharedContent({
    query: `K.CC.3 banana${code}`,
    loggedInUserId: userId,
  });
  expect(results[0].id).eqls(activity2Id);
  expect(results[1].id).eqls(activity1Id);

  results = await searchSharedContent({
    query: `Kindergarten banana${code}`,
    loggedInUserId: userId,
  });
  expect(results[0].id).eqls(activity2Id);
  expect(results[1].id).eqls(activity1Id);

  results = await searchSharedContent({
    query: `cardiNALITY banana${code}`,
    loggedInUserId: userId,
  });
  expect(results[0].id).eqls(activity2Id);
  expect(results[1].id).eqls(activity1Id);

  results = await searchSharedContent({
    query: `numeral banana${code}`,
    loggedInUserId: userId,
  });
  expect(results[0].id).eqls(activity2Id);
  expect(results[1].id).eqls(activity1Id);
});

test("searchSharedContent, handle tags in search", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { activityId, docId } = await createActivity(ownerId, null);
  await updateDoc({ id: docId, source: "point", ownerId });
  await makeActivityPublic({
    id: activityId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });

  const results = await searchSharedContent({
    query: `<point>`,
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
  const { activityId: activity1Id, docId: doc1Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc1Id,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity1Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity1Id, classifyId1, ownerId);

  // classifyId2
  const { activityId: activity2Id, docId: doc2Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc2Id,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity2Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity2Id, classifyId2, ownerId);

  // classifyId3
  const { activityId: activity3Id, docId: doc3Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc3Id,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity3Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity3Id, classifyId3, ownerId);

  // classifyId4
  const { activityId: activity4Id, docId: doc4Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc4Id,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity4Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity4Id, classifyId4, ownerId);

  // classifyId5
  const { activityId: activity5Id, docId: doc5Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc5Id,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity5Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity5Id, classifyId5, ownerId);

  // Create one more distractor activity with classification 1 but different text
  const { activityId: activity6Id, docId: doc6Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc6Id,
    source: `grape${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity6Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity6Id, classifyId1, ownerId);

  // get all five activities with no filtering
  let results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
  });
  expect(results.length).eq(5);

  // filtering by system reduces it to four activities
  results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(results.length).eq(4);

  // filtering by category reduces it to three activities
  results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryId1,
  });
  expect(results.length).eq(3);

  // filtering by subCategory reduces it to two activities
  results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryId1,
  });
  expect(results.length).eq(2);

  // filtering by classification reduces it to one activity
  results = await searchSharedContent({
    query: `banana${code}`,
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
  const { activityId: activityNId, docId: docNId } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: docNId,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activityNId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });

  // is question
  const { activityId: activityQId, docId: docQId } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: docQId,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activityQId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await updateContent({ id: activityQId, ownerId, isQuestion: true });

  // is interactive
  const { activityId: activityIId, docId: docIId } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: docIId,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activityIId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await updateContent({ id: activityIId, ownerId, isInteractive: true });

  // contains video
  const { activityId: activityVId, docId: docVId } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: docVId,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activityVId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await updateContent({ id: activityVId, ownerId, containsVideo: true });

  // is question and interactive
  const { activityId: activityQIId, docId: docQIId } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: docQIId,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activityQIId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await updateContent({
    id: activityQIId,
    ownerId,
    isQuestion: true,
    isInteractive: true,
  });

  // is question and contains video
  const { activityId: activityQVId, docId: docQVId } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: docQVId,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activityQVId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await updateContent({
    id: activityQVId,
    ownerId,
    isQuestion: true,
    containsVideo: true,
  });

  // is interactive and contains video
  const { activityId: activityIVId, docId: docIVId } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: docIVId,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activityIVId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await updateContent({
    id: activityIVId,
    ownerId,
    isInteractive: true,
    containsVideo: true,
  });

  // is question, is interactive, and contains video
  const { activityId: activityQIVId, docId: docQIVId } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: docQIVId,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activityQIVId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await updateContent({
    id: activityQIVId,
    ownerId,
    isQuestion: true,
    isInteractive: true,
    containsVideo: true,
  });

  // Create one more distractor activity with all features but different text
  const { activityId: activityDId, docId: docDId } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: docDId,
    source: `grape${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activityDId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await updateContent({
    id: activityDId,
    ownerId,
    isQuestion: true,
    isInteractive: true,
    containsVideo: true,
  });

  // get all eight activities with no filtering
  let results = await searchSharedContent({
    query: `banana${code}`,
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
    loggedInUserId: userId,
    isQuestion: true,
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
    loggedInUserId: userId,
    isInteractive: true,
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
    loggedInUserId: userId,
    containsVideo: true,
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
    loggedInUserId: userId,
    isQuestion: true,
    isInteractive: true,
  });
  expect(results.map((c) => c.id)).eqls([activityQIId, activityQIVId]);

  // filter to the two have are a question and contain a video
  results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    isQuestion: true,
    containsVideo: true,
  });
  expect(results.map((c) => c.id)).eqls([activityQVId, activityQIVId]);

  // filter to the two have are interactive and contain a video
  results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    isInteractive: true,
    containsVideo: true,
  });
  expect(results.map((c) => c.id)).eqls([activityIVId, activityQIVId]);

  // filter to the one that has all three features
  results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    isQuestion: true,
    isInteractive: true,
    containsVideo: true,
  });
  expect(results.map((c) => c.id)).eqls([activityQIVId]);
});

test("searchUsersWithSharedContent returns only users with public/shared content", async () => {
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  // owner 1 has only private content
  const owner1 = await createTestUser();
  const owner1Id = owner1.userId;

  await createActivity(owner1Id, null);
  await createActivity(owner1Id, null);
  const { folderId: folder1aId } = await createFolder(owner1Id, null);
  await createActivity(owner1Id, folder1aId);

  // owner 2 has a public activity
  const owner2 = await createTestUser();
  const owner2Id = owner2.userId;

  const { folderId: folder2aId } = await createFolder(owner2Id, null);
  const { activityId: activity2aId } = await createActivity(
    owner2Id,
    folder2aId,
  );
  await makeActivityPublic({
    id: activity2aId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });

  // owner 3 has a public folder
  const owner3 = await createTestUser();
  const owner3Id = owner3.userId;

  const { folderId: folder3aId } = await createFolder(owner3Id, null);
  await makeFolderPublic({
    id: folder3aId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
  });

  // owner 4 has a activity shared with user1
  const owner4 = await createTestUser();
  const owner4Id = owner4.userId;

  const { folderId: folder4aId } = await createFolder(owner4Id, null);
  const { activityId: activity4aId } = await createActivity(
    owner4Id,
    folder4aId,
  );
  await shareActivity({
    id: activity4aId,
    ownerId: owner4Id,
    licenseCode: "CCDUAL",
    users: [user1Id],
  });

  // owner 5 has a folder shared with user 1
  const owner5 = await createTestUser();
  const owner5Id = owner5.userId;

  const { folderId: folder5aId } = await createFolder(owner5Id, null);
  await shareFolder({
    id: folder5aId,
    ownerId: owner5Id,
    licenseCode: "CCDUAL",
    users: [user1Id],
  });

  // owner 6 has a activity shared with user2
  const owner6 = await createTestUser();
  const owner6Id = owner6.userId;

  const { folderId: folder6aId } = await createFolder(owner6Id, null);
  const { activityId: activity6aId } = await createActivity(
    owner6Id,
    folder6aId,
  );
  await shareActivity({
    id: activity6aId,
    ownerId: owner6Id,
    licenseCode: "CCDUAL",
    users: [user2Id],
  });

  // owner 7 has a folder shared with user 2
  const owner7 = await createTestUser();
  const owner7Id = owner7.userId;

  const { folderId: folder7aId } = await createFolder(owner7Id, null);
  await shareFolder({
    id: folder7aId,
    ownerId: owner7Id,
    licenseCode: "CCDUAL",
    users: [user2Id],
  });

  // user1 cannot find owner1
  let searchResults = await searchUsersWithSharedContent(
    owner1.lastNames,
    user1Id,
  );
  expect(searchResults.length).eq(0);

  // user1 can find owner2
  searchResults = await searchUsersWithSharedContent(owner2.lastNames, user1Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner2.firstNames);
  expect(searchResults[0].lastNames).eq(owner2.lastNames);

  // user1 can find owner3
  searchResults = await searchUsersWithSharedContent(owner3.lastNames, user1Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner3.firstNames);
  expect(searchResults[0].lastNames).eq(owner3.lastNames);

  // user1 can find owner4
  searchResults = await searchUsersWithSharedContent(owner4.lastNames, user1Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner4.firstNames);
  expect(searchResults[0].lastNames).eq(owner4.lastNames);

  // user1 can find owner5
  searchResults = await searchUsersWithSharedContent(owner5.lastNames, user1Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner5.firstNames);
  expect(searchResults[0].lastNames).eq(owner5.lastNames);

  // user1 cannot find owner6
  searchResults = await searchUsersWithSharedContent(owner6.lastNames, user1Id);
  expect(searchResults.length).eq(0);

  // user1 cannot find owner7
  searchResults = await searchUsersWithSharedContent(owner7.lastNames, user1Id);
  expect(searchResults.length).eq(0);

  // user2 can find owner6
  searchResults = await searchUsersWithSharedContent(owner6.lastNames, user2Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner6.firstNames);
  expect(searchResults[0].lastNames).eq(owner6.lastNames);

  // user2 can find owner7
  searchResults = await searchUsersWithSharedContent(owner7.lastNames, user2Id);
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq(owner7.firstNames);
  expect(searchResults[0].lastNames).eq(owner7.lastNames);

  // user2 cannot find owner4
  searchResults = await searchUsersWithSharedContent(owner4.lastNames, user2Id);
  expect(searchResults.length).eq(0);

  // user2 cannot find owner5
  searchResults = await searchUsersWithSharedContent(owner5.lastNames, user2Id);
  expect(searchResults.length).eq(0);
});

test("searchClassificationsWithSharedContent", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const owner = await createTestUser();
  const ownerId = owner.userId;

  // create a made up classification tree in High
  const code = Date.now().toString();

  const classification = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0];

  const classifyId = classification.id;
  const subCategoryId = classification.descriptions[0].subCategory.id;
  const categoryId = classification.descriptions[0].subCategory.category.id;
  const systemId =
    classification.descriptions[0].subCategory.category.system.id;

  const { activityId } = await createActivity(ownerId, null);
  await addClassification(activityId, categoryId, ownerId);

  let results = await searchClassificationsWithSharedContent({
    query: "annuities",
    loggedInUserId: userId,
  });
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

    const { folderId: baseFolderId } = await createFolder(ownerId, null);
    await updateContent({ id: baseFolderId, ownerId, name: "The Base Folder" });
    const { folderId: folder1Id } = await createFolder(ownerId, baseFolderId);
    await updateContent({ id: folder1Id, ownerId, name: "The first topic" });

    const { activityId: activity1aId } = await createActivity(
      ownerId,
      folder1Id,
    );
    await updateContent({
      id: activity1aId,
      ownerId,
      name: "First activity",
    });

    const { activityId: activity1bId } = await createActivity(
      ownerId,
      folder1Id,
    );
    await updateContent({
      id: activity1bId,
      ownerId,
      name: "Deleted activity",
    });
    await deleteActivity(activity1bId, ownerId);

    const { folderId: folder1cId } = await createFolder(ownerId, folder1Id);
    await updateContent({ id: folder1cId, ownerId, name: "Subtopic " });

    const { activityId: activity1c1Id } = await createActivity(
      ownerId,
      folder1cId,
    );
    await updateContent({ id: activity1c1Id, ownerId, name: "First piece" });
    await deleteActivity(activity1c1Id, ownerId);

    const { activityId: activity1c2Id } = await createActivity(
      ownerId,
      folder1cId,
    );
    await updateContent({ id: activity1c2Id, ownerId, name: "Second piece" });

    const { activityId: activity2Id } = await createActivity(
      ownerId,
      baseFolderId,
    );
    await updateContent({ id: activity2Id, ownerId, name: "Activity 2" });
    const { activityId: activity3Id } = await createActivity(
      ownerId,
      baseFolderId,
    );
    await updateContent({ id: activity3Id, ownerId, name: "Activity 3" });
    await deleteActivity(activity3Id, ownerId);

    const { activityId: activityGoneId } = await createActivity(ownerId, null);
    await updateContent({ id: activityGoneId, ownerId, name: "Activity gone" });
    await deleteActivity(activityGoneId, ownerId);
    const { activityId: activityRootId } = await createActivity(ownerId, null);
    await updateContent({
      id: activityRootId,
      ownerId,
      name: "Activity root, first",
    });

    let searchResults = await searchMyFolderContent({
      folderId: null,
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
          parentFolderId: c.parentFolder ? fromUUID(c.parentFolder.id) : null,
        })),
    ).eqls([
      { id: fromUUID(folder1Id), parentFolderId: fromUUID(baseFolderId) },
      { id: fromUUID(activity1aId), parentFolderId: fromUUID(folder1Id) },
      { id: fromUUID(activityRootId), parentFolderId: null },
    ]);

    searchResults = await searchMyFolderContent({
      folderId: baseFolderId,
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
          parentFolderId: c.parentFolder ? fromUUID(c.parentFolder.id) : null,
        })),
    ).eqls([
      { id: fromUUID(folder1Id), parentFolderId: fromUUID(baseFolderId) },
      { id: fromUUID(activity1aId), parentFolderId: fromUUID(folder1Id) },
    ]);

    searchResults = await searchMyFolderContent({
      folderId: folder1Id,
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
          parentFolderId: c.parentFolder ? fromUUID(c.parentFolder.id) : null,
        })),
    ).eqls([
      { id: fromUUID(activity1aId), parentFolderId: fromUUID(folder1Id) },
    ]);

    searchResults = await searchMyFolderContent({
      folderId: folder1cId,
      loggedInUserId: ownerId,
      query: "first",
    });
    expect(fromUUID(searchResults.folder!.id)).eq(fromUUID(folder1cId));
    content = searchResults.content;
    expect(content.length).eq(0);

    searchResults = await searchMyFolderContent({
      folderId: null,
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
          parentFolderId: c.parentFolder ? fromUUID(c.parentFolder.id) : null,
        })),
    ).eqls([
      { id: fromUUID(activity1aId), parentFolderId: fromUUID(folder1Id) },
      { id: fromUUID(activity2Id), parentFolderId: fromUUID(baseFolderId) },
      { id: fromUUID(activityRootId), parentFolderId: null },
    ]);

    searchResults = await searchMyFolderContent({
      folderId: baseFolderId,
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
          parentFolderId: c.parentFolder ? fromUUID(c.parentFolder.id) : null,
        })),
    ).eqls([
      { id: fromUUID(activity1aId), parentFolderId: fromUUID(folder1Id) },
      { id: fromUUID(activity2Id), parentFolderId: fromUUID(baseFolderId) },
    ]);

    searchResults = await searchMyFolderContent({
      folderId: folder1Id,
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
          parentFolderId: c.parentFolder ? fromUUID(c.parentFolder.id) : null,
        })),
    ).eqls([
      { id: fromUUID(activity1aId), parentFolderId: fromUUID(folder1Id) },
    ]);

    searchResults = await searchMyFolderContent({
      folderId: folder1cId,
      loggedInUserId: ownerId,
      query: "activity",
    });
    expect(fromUUID(searchResults.folder!.id)).eq(fromUUID(folder1cId));
    content = searchResults.content;
    expect(content.length).eq(0);
  },
);

test("searchMyFolderContent, document source matches", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId, docId } = await createActivity(ownerId, null);
  await updateDoc({ id: docId, source: "bananas", ownerId });
  await makeActivityPublic({
    id: activityId,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });

  // apple doesn't hit
  let searchResults = await searchMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
    query: "apple",
  });
  let content = searchResults.content;
  expect(content.length).eq(0);

  // first part of a word hits
  searchResults = await searchMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
    query: "bana",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // full word hits
  searchResults = await searchMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
    query: "bananas",
  });
  content = searchResults.content;
  expect(content.length).eq(1);
});

test("searchMyFolderContent, classification matches", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId, null);

  let searchResults = await searchMyFolderContent({
    folderId: null,
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
  searchResults = await searchMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
    query: "K.C",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With both
  searchResults = await searchMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
    query: "common C.1",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With category
  searchResults = await searchMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
    query: "kinder",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With subcategory
  searchResults = await searchMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
    query: "cardinality",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With description
  searchResults = await searchMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
    query: "tens",
  });
  content = searchResults.content;
  expect(content.length).eq(1);
});

test("searchMyFolderContent in folder, classification matches", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

  const { folderId } = await createFolder(ownerId, null);
  const { activityId } = await createActivity(ownerId, folderId);

  let searchResults = await searchMyFolderContent({
    folderId,
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
  searchResults = await searchMyFolderContent({
    folderId,
    loggedInUserId: ownerId,
    query: "K.C",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With both
  searchResults = await searchMyFolderContent({
    folderId,
    loggedInUserId: ownerId,
    query: "common C.1",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With category
  searchResults = await searchMyFolderContent({
    folderId,
    loggedInUserId: ownerId,
    query: "kinder",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With subcategory
  searchResults = await searchMyFolderContent({
    folderId,
    loggedInUserId: ownerId,
    query: "cardinality",
  });
  content = searchResults.content;
  expect(content.length).eq(1);

  // With description
  searchResults = await searchMyFolderContent({
    folderId,
    loggedInUserId: ownerId,
    query: "tens",
  });
  content = searchResults.content;
  expect(content.length).eq(1);
});

test("searchMyFolderContent, handle tags in search", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { docId } = await createActivity(ownerId, null);

  await updateDoc({ id: docId, source: "point", ownerId });

  const searchResults = await searchMyFolderContent({
    folderId: null,
    loggedInUserId: ownerId,
    query: "<point>",
  });
  const content = searchResults.content;
  expect(content.length).eq(1);
});
