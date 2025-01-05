import { expect, test } from "vitest";
import {
  addClassification,
  browseCategorySharedContent,
  browseClassificationSharedContent,
  browseSubCategorySharedContent,
  browseUsersWithSharedContent,
  createActivity,
  createFolder,
  deleteActivity,
  makeActivityPublic,
  makeFolderPublic,
  searchClassificationCategoriesWithSharedContent,
  searchClassificationSubCategoriesWithSharedContent,
  searchClassificationsWithSharedContent,
  searchMyFolderContent,
  searchPossibleClassifications,
  searchSharedContent,
  searchUsersWithSharedContent,
  shareActivity,
  shareActivityWithEmail,
  shareFolder,
  updateContent,
  updateContentFeatures,
  updateDoc,
  updateUser,
} from "../model";
import {
  createTestClassifications,
  createTestFeature,
  createTestUser,
} from "./utils";
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

  // unclassified
  const { activityId: activity6Id, docId: doc6Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc6Id,
    source: `banana${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity6Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });

  // Create one more distractor activity with classification 1 but different text
  const { activityId: activity7Id, docId: doc7Id } = await createActivity(
    ownerId,
    null,
  );
  await updateDoc({
    id: doc7Id,
    source: `grape${code}`,
    ownerId,
  });
  await makeActivityPublic({
    id: activity7Id,
    ownerId: ownerId,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity7Id, classifyId1, ownerId);

  // get all six activities with no filtering
  let results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
  });
  expect(results.length).eq(6);

  // filtering by unclassified reduces it to one activity
  results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    isUnclassified: true,
  });
  expect(results.length).eq(1);

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
  await updateContentFeatures({
    id: activityQId,
    ownerId,
    features: { isQuestion: true },
  });

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
  await updateContentFeatures({
    id: activityIId,
    ownerId,
    features: { isInteractive: true },
  });

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
  await updateContentFeatures({
    id: activityVId,
    ownerId,
    features: { containsVideo: true },
  });

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
  await updateContentFeatures({
    id: activityQIId,
    ownerId,
    features: { isQuestion: true, isInteractive: true },
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
  await updateContentFeatures({
    id: activityQVId,
    ownerId,
    features: { isQuestion: true, containsVideo: true },
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
  await updateContentFeatures({
    id: activityIVId,
    ownerId,
    features: { isInteractive: true, containsVideo: true },
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
  await updateContentFeatures({
    id: activityQIVId,
    ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
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
  await updateContentFeatures({
    id: activityDId,
    ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
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
    features: { isQuestion: true },
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
    features: { isInteractive: true },
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
    features: { containsVideo: true },
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
    features: { isQuestion: true, isInteractive: true },
  });
  expect(results.map((c) => c.id)).eqls([activityQIId, activityQIVId]);

  // filter to the two have are a question and contain a video
  results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, containsVideo: true },
  });
  expect(results.map((c) => c.id)).eqls([activityQVId, activityQIVId]);

  // filter to the two have are interactive and contain a video
  results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    features: { isInteractive: true, containsVideo: true },
  });
  expect(results.map((c) => c.id)).eqls([activityIVId, activityQIVId]);

  // filter to the one that has all three features
  results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });
  expect(results.map((c) => c.id)).eqls([activityQIVId]);
});

test("searchSharedContent, filter by owner name", async () => {
  const { userId } = await createTestUser();

  const { userId: owner1Id } = await createTestUser();
  const { userId: owner2Id } = await createTestUser();

  // unique code to distinguish content added in this test
  const code = `${Date.now()}`;

  // Create identical activities, with only difference being the owner
  const { activityId: activity1Id, docId: doc1Id } = await createActivity(
    owner1Id,
    null,
  );
  await updateDoc({
    id: doc1Id,
    source: `banana${code}`,
    ownerId: owner1Id,
  });
  await makeActivityPublic({
    id: activity1Id,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });

  const { activityId: activity2Id, docId: doc2Id } = await createActivity(
    owner2Id,
    null,
  );
  await updateDoc({
    id: doc2Id,
    source: `banana${code}`,
    ownerId: owner2Id,
  });
  await makeActivityPublic({
    id: activity2Id,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });

  // get both activities with no filtering
  let results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
  });
  expect(results.map((c) => c.id)).eqls([activity1Id, activity2Id]);

  // filter for owner 1
  results = await searchSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    ownerId: owner1Id,
  });
  expect(results.map((c) => c.id)).eqls([activity1Id]);

  // filter for owner 2
  results = await searchSharedContent({
    query: `banana${code}`,
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

  await createActivity(owner1Id, null);
  await createActivity(owner1Id, null);
  const { folderId: folder1aId } = await createFolder(owner1Id, null);
  await createActivity(owner1Id, folder1aId);
  const { activityId: activity1dId } = await createActivity(owner1Id, null);
  await makeActivityPublic({
    id: activity1dId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });
  await deleteActivity(activity1dId, owner1Id);

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
  const { activityId: activity1aId } = await createActivity(owner1Id, null);
  const { activityId: activity1bId } = await createActivity(owner1Id, null);
  await makeActivityPublic({
    id: activity1aId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity1bId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });

  // owner 2 has content in classification FA1
  const { userId: owner2Id } = await createTestUser();
  await updateUser({
    userId: owner2Id,
    firstNames: "Wilma",
    lastNames: ownerLastNames,
  });
  const { activityId: activity2aId } = await createActivity(owner2Id, null);
  const { activityId: activity2bId } = await createActivity(owner2Id, null);
  await makeActivityPublic({
    id: activity2aId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity2bId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
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

  const { activityId: activity3aId } = await createActivity(owner3Id, null);
  const { activityId: activity3bId } = await createActivity(owner3Id, null);
  await makeActivityPublic({
    id: activity3aId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity3bId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
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
  const { activityId: activity1aId } = await createActivity(owner1Id, null);
  const { activityId: activity1bId } = await createActivity(owner1Id, null);
  await makeActivityPublic({
    id: activity1aId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity1bId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });
  await updateContentFeatures({
    id: activity1bId,
    ownerId: owner1Id,
    features: { isQuestion: true },
  });

  // owner 2 has content combinations of two features
  const { userId: owner2Id } = await createTestUser();
  await updateUser({
    userId: owner2Id,
    firstNames: "Wilma",
    lastNames: ownerLastNames,
  });
  const { activityId: activity2aId } = await createActivity(owner2Id, null);
  const { activityId: activity2bId } = await createActivity(owner2Id, null);
  const { activityId: activity2cId } = await createActivity(owner2Id, null);
  await makeActivityPublic({
    id: activity2aId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity2bId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity2cId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  await updateContentFeatures({
    id: activity2aId,
    ownerId: owner2Id,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    id: activity2bId,
    ownerId: owner2Id,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    id: activity2cId,
    ownerId: owner2Id,
    features: { containsVideo: true, isInteractive: true },
  });

  // owner 3 has a content with isInteractive and containsVideo
  const { userId: owner3Id } = await createTestUser();
  await updateUser({
    userId: owner3Id,
    firstNames: "Pebbles",
    lastNames: ownerLastNames,
  });

  const { activityId: activity3aId } = await createActivity(owner3Id, null);
  const { activityId: activity3bId } = await createActivity(owner3Id, null);
  await makeActivityPublic({
    id: activity3aId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity3bId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
  });
  await updateContentFeatures({
    id: activity3aId,
    ownerId: owner3Id,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    id: activity3bId,
    ownerId: owner3Id,
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
    features: { isQuestion: true },
  });
  expect(searchResults.length).eq(2);
  expect(searchResults.map((u) => u.firstNames).sort()).eqls(["Fred", "Wilma"]);

  // owners 2 and 3 have isInteractive
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    features: { isInteractive: true },
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
    features: { containsVideo: true },
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
    features: { isQuestion: true, isInteractive: true },
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Wilma");
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    features: { isQuestion: true, containsVideo: true },
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Wilma");
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    features: { containsVideo: true, isInteractive: true },
  });
  expect(searchResults.length).eq(1);
  expect(searchResults[0].firstNames).eq("Wilma");

  // no one has all three features
  searchResults = await searchUsersWithSharedContent({
    query: ownerLastNames,
    loggedInUserId: userId,
    features: { containsVideo: true, isInteractive: true, isQuestion: true },
  });
  expect(searchResults.length).eq(0);
});

test("browseUsersWithSharedContent, no filter, filter by unclassified", async () => {
  const { userId } = await createTestUser();

  const classificationId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].id;

  // owner 2 has two activities, one with a classification
  const { userId: owner1Id } = await createTestUser();
  const { activityId: activity1aId } = await createActivity(owner1Id, null);
  await makeActivityPublic({
    id: activity1aId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });
  const { activityId: activity1bId } = await createActivity(owner1Id, null);
  await makeActivityPublic({
    id: activity1bId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity1aId, classificationId, owner1Id);

  // owner 2 has three activities that have a classification
  const { userId: owner2Id } = await createTestUser();
  const { activityId: activity2aId } = await createActivity(owner2Id, null);
  await makeActivityPublic({
    id: activity2aId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  const { activityId: activity2bId } = await createActivity(owner2Id, null);
  await makeActivityPublic({
    id: activity2bId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  const { activityId: activity2cId } = await createActivity(owner2Id, null);
  await makeActivityPublic({
    id: activity2cId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });

  await addClassification(activity2aId, classificationId, owner2Id);
  await addClassification(activity2bId, classificationId, owner2Id);
  await addClassification(activity2cId, classificationId, owner2Id);

  // if don't have any filter or filter just by unclassified,
  // then there is no way to include only users from this test,
  // so just make sure one gets at least the number of results from this test

  let results = await browseUsersWithSharedContent({
    loggedInUserId: userId,
  });

  expect(results.length).greaterThanOrEqual(2);

  results = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    isUnclassified: true,
  });

  expect(results.length).greaterThanOrEqual(1);

  // to filter out just owners from this test, add a test feature
  const code = Date.now().toString();
  const word = "banana";
  const feature = await createTestFeature({ word, code });
  const features = { [feature.code]: true };
  await updateContentFeatures({
    id: activity2aId,
    ownerId: owner2Id,
    features,
  });
  await updateContentFeatures({
    id: activity2bId,
    ownerId: owner2Id,
    features,
  });
  await updateContentFeatures({
    id: activity2cId,
    ownerId: owner2Id,
    features,
  });
  await updateContentFeatures({
    id: activity1aId,
    ownerId: owner1Id,
    features,
  });
  await updateContentFeatures({
    id: activity1bId,
    ownerId: owner1Id,
    features,
  });

  // when filter by feature, just the two owners, sorted by number of activities
  results = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features,
  });

  expect(results.length).eq(2);
  expect(isEqualUUID(results[0].userId, owner2Id)).eq(true);
  expect(results[0].numContent).eq(3);
  expect(isEqualUUID(results[1].userId, owner1Id)).eq(true);
  expect(results[1].numContent).eq(2);

  // when filter by feature and unclassified, just get owner 1
  results = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features,
    isUnclassified: true,
  });

  expect(results.length).eq(1);
  expect(isEqualUUID(results[0].userId, owner1Id)).eq(true);
  expect(results[0].numContent).eq(1);
});

test("browseUsersWithSharedContent returns only users with public/shared/non-deleted content", async () => {
  // to filter out just owners from this test, add a test feature to all of the content
  const code = Date.now().toString();
  const word = "banana";
  const feature = await createTestFeature({ word, code });
  const features = { [feature.code]: true };

  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  // owner 1 has only private and deleted content
  const owner1 = await createTestUser();
  const owner1Id = owner1.userId;

  const { activityId: activity1aId } = await createActivity(owner1Id, null);
  await updateContentFeatures({
    id: activity1aId,
    ownerId: owner1Id,
    features,
  });
  const { activityId: activity1bId } = await createActivity(owner1Id, null);
  await updateContentFeatures({
    id: activity1bId,
    ownerId: owner1Id,
    features,
  });
  const { folderId: folder1aId } = await createFolder(owner1Id, null);
  const { activityId: activity1cId } = await createActivity(
    owner1Id,
    folder1aId,
  );
  await updateContentFeatures({
    id: activity1cId,
    ownerId: owner1Id,
    features,
  });
  const { activityId: activity1dId } = await createActivity(owner1Id, null);
  await makeActivityPublic({
    id: activity1dId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });
  await updateContentFeatures({
    id: activity1dId,
    ownerId: owner1Id,
    features,
  });
  await deleteActivity(activity1dId, owner1Id);

  // owner 2 has two public activities
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
  await updateContentFeatures({
    id: activity2aId,
    ownerId: owner2Id,
    features,
  });
  const { activityId: activity2bId } = await createActivity(
    owner2Id,
    folder2aId,
  );
  await makeActivityPublic({
    id: activity2bId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  await updateContentFeatures({
    id: activity2bId,
    ownerId: owner2Id,
    features,
  });

  // owner 3 has a activity shared with user1
  const owner3 = await createTestUser();
  const owner3Id = owner3.userId;

  const { folderId: folder3aId } = await createFolder(owner3Id, null);
  const { activityId: activity3aId } = await createActivity(
    owner3Id,
    folder3aId,
  );
  await shareActivity({
    id: activity3aId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
    users: [user1Id],
  });
  await updateContentFeatures({
    id: activity3aId,
    ownerId: owner3Id,
    features,
  });

  // owner 4 has three activities shared with user2
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
    users: [user2Id],
  });
  await updateContentFeatures({
    id: activity4aId,
    ownerId: owner4Id,
    features,
  });

  const { activityId: activity4bId } = await createActivity(
    owner4Id,
    folder4aId,
  );
  await shareActivity({
    id: activity4bId,
    ownerId: owner4Id,
    licenseCode: "CCDUAL",
    users: [user2Id],
  });
  await updateContentFeatures({
    id: activity4bId,
    ownerId: owner4Id,
    features,
  });
  const { activityId: activity4cId } = await createActivity(
    owner4Id,
    folder4aId,
  );
  await shareActivity({
    id: activity4cId,
    ownerId: owner4Id,
    licenseCode: "CCDUAL",
    users: [user2Id],
  });
  await updateContentFeatures({
    id: activity4cId,
    ownerId: owner4Id,
    features,
  });

  // user1 find only owner2, owner3
  let result = await browseUsersWithSharedContent({
    loggedInUserId: user1Id,
    features,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numContent).eq(2);
  expect(isEqualUUID(result[1].userId, owner3Id)).eq(true);
  expect(result[1].numContent).eq(1);

  // user2 can find owner2, owner4
  result = await browseUsersWithSharedContent({
    loggedInUserId: user2Id,
    features,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner4Id)).eq(true);
  expect(result[0].numContent).eq(3);
  expect(isEqualUUID(result[1].userId, owner2Id)).eq(true);
  expect(result[1].numContent).eq(2);
});

test("browseUsersWithSharedContent, filter by system, category, sub category, classification", async () => {
  // create a made up classification tree
  const code = Date.now().toString();
  const word = "banana";

  const {
    systemId,
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    classificationIdA1B,
    classificationIdA2A,
    classificationIdA2B,
    categoryIdB,
    classificationIdB2B,
  } = await createTestClassifications({ word, code });

  const { userId } = await createTestUser();

  // owner 1 has only unclassified content
  const { userId: owner1Id } = await createTestUser();
  const { activityId: activity1aId } = await createActivity(owner1Id, null);
  const { activityId: activity1bId } = await createActivity(owner1Id, null);
  await makeActivityPublic({
    id: activity1aId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity1bId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });

  // owner 2 has content in classification A1A
  const { userId: owner2Id } = await createTestUser();
  const { activityId: activity2aId } = await createActivity(owner2Id, null);
  const { activityId: activity2bId } = await createActivity(owner2Id, null);
  await makeActivityPublic({
    id: activity2aId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity2bId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity2aId, classificationIdA1A, owner2Id);
  await addClassification(activity2bId, classificationIdA1A, owner2Id);

  // owner 3 has a content in classification B2B and unclassified content
  const { userId: owner3Id } = await createTestUser();
  const { activityId: activity3aId } = await createActivity(owner3Id, null);
  const { activityId: activity3bId } = await createActivity(owner3Id, null);
  await makeActivityPublic({
    id: activity3aId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity3bId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity3aId, classificationIdB2B, owner3Id);

  // owner 4 has content in classification A1A and A1B
  const { userId: owner4Id } = await createTestUser();
  const { activityId: activity4aId } = await createActivity(owner4Id, null);
  const { activityId: activity4bId } = await createActivity(owner4Id, null);
  const { activityId: activity4cId } = await createActivity(owner4Id, null);
  await makeActivityPublic({
    id: activity4aId,
    ownerId: owner4Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity4bId,
    ownerId: owner4Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity4cId,
    ownerId: owner4Id,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity4aId, classificationIdA1A, owner4Id);
  await addClassification(activity4bId, classificationIdA1B, owner4Id);
  await addClassification(activity4cId, classificationIdA1B, owner4Id);

  // owner 5 has content in classification A1B, B2B
  const { userId: owner5Id } = await createTestUser();
  const { activityId: activity5aId } = await createActivity(owner5Id, null);
  const { activityId: activity5bId } = await createActivity(owner5Id, null);
  const { activityId: activity5cId } = await createActivity(owner5Id, null);
  const { activityId: activity5dId } = await createActivity(owner5Id, null);
  await makeActivityPublic({
    id: activity5aId,
    ownerId: owner5Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity5bId,
    ownerId: owner5Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity5cId,
    ownerId: owner5Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity5dId,
    ownerId: owner5Id,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity5aId, classificationIdA1B, owner5Id);
  await addClassification(activity5bId, classificationIdB2B, owner5Id);
  await addClassification(activity5cId, classificationIdB2B, owner5Id);
  await addClassification(activity5dId, classificationIdB2B, owner5Id);

  // owner 6 has content in classification A2A, A2B, and B2B
  const { userId: owner6Id } = await createTestUser();
  const { activityId: activity6aId } = await createActivity(owner6Id, null);
  const { activityId: activity6bId } = await createActivity(owner6Id, null);
  const { activityId: activity6cId } = await createActivity(owner6Id, null);
  const { activityId: activity6dId } = await createActivity(owner6Id, null);
  const { activityId: activity6eId } = await createActivity(owner6Id, null);
  const { activityId: activity6fId } = await createActivity(owner6Id, null);
  await makeActivityPublic({
    id: activity6aId,
    ownerId: owner6Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity6bId,
    ownerId: owner6Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity6cId,
    ownerId: owner6Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity6dId,
    ownerId: owner6Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity6eId,
    ownerId: owner6Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity6fId,
    ownerId: owner6Id,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity6aId, classificationIdA2A, owner6Id);
  await addClassification(activity6bId, classificationIdA2A, owner6Id);
  await addClassification(activity6cId, classificationIdA2B, owner6Id);
  await addClassification(activity6dId, classificationIdA2B, owner6Id);
  await addClassification(activity6eId, classificationIdB2B, owner6Id);
  await addClassification(activity6fId, classificationIdB2B, owner6Id);

  // owner 7 has a content in another system
  const outsideClassificationId = (
    await searchPossibleClassifications({ query: "K.CC.1" })
  )[0].id;

  const { userId: owner7Id } = await createTestUser();
  const { activityId: activity7aId } = await createActivity(owner7Id, null);
  await makeActivityPublic({
    id: activity7aId,
    ownerId: owner7Id,
    licenseCode: "CCDUAL",
  });
  await addClassification(activity7aId, outsideClassificationId, owner7Id);

  // owners 2, 3, 4, 5, 6 have content classified in systemId
  let result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    systemId,
  });
  expect(result.length).eq(5);
  expect(isEqualUUID(result[0].userId, owner6Id)).eq(true);
  expect(result[0].numContent).eq(6);
  expect(isEqualUUID(result[1].userId, owner5Id)).eq(true);
  expect(result[1].numContent).eq(4);
  expect(isEqualUUID(result[2].userId, owner4Id)).eq(true);
  expect(result[2].numContent).eq(3);
  expect(isEqualUUID(result[3].userId, owner2Id)).eq(true);
  expect(result[3].numContent).eq(2);
  expect(isEqualUUID(result[4].userId, owner3Id)).eq(true);
  expect(result[4].numContent).eq(1);

  // owners 2, 4, 5, 6 have content classified in category A
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(result.length).eq(4);
  expect(isEqualUUID(result[0].userId, owner6Id)).eq(true);
  expect(result[0].numContent).eq(4);
  expect(isEqualUUID(result[1].userId, owner4Id)).eq(true);
  expect(result[1].numContent).eq(3);
  expect(isEqualUUID(result[2].userId, owner2Id)).eq(true);
  expect(result[2].numContent).eq(2);
  expect(isEqualUUID(result[3].userId, owner5Id)).eq(true);
  expect(result[3].numContent).eq(1);

  // owners 3, 5, 6 have content classified in category B
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdB,
  });
  expect(result.length).eq(3);
  expect(isEqualUUID(result[0].userId, owner5Id)).eq(true);
  expect(result[0].numContent).eq(3);
  expect(isEqualUUID(result[1].userId, owner6Id)).eq(true);
  expect(result[1].numContent).eq(2);
  expect(isEqualUUID(result[2].userId, owner3Id)).eq(true);
  expect(result[2].numContent).eq(1);

  // owners 2, 4, 5 have content classified in subcategory A1
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(result.length).eq(3);
  expect(isEqualUUID(result[0].userId, owner4Id)).eq(true);
  expect(result[0].numContent).eq(3);
  expect(isEqualUUID(result[1].userId, owner2Id)).eq(true);
  expect(result[1].numContent).eq(2);
  expect(isEqualUUID(result[2].userId, owner5Id)).eq(true);
  expect(result[2].numContent).eq(1);

  // owners 2, 4 have content classified in classification A1A
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numContent).eq(2);
  expect(isEqualUUID(result[1].userId, owner4Id)).eq(true);
  expect(result[1].numContent).eq(1);

  // owners 4, 5 have content classified in classification A1B
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1B,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner4Id)).eq(true);
  expect(result[0].numContent).eq(2);
  expect(isEqualUUID(result[1].userId, owner5Id)).eq(true);
  expect(result[1].numContent).eq(1);
});

test("browseUsersWithSharedContent, filter by activity feature", async () => {
  // add two test features
  const code = Date.now().toString();
  const feature1Code = (await createTestFeature({ word: "banana", code })).code;
  const feature2Code = (await createTestFeature({ word: "grape", code })).code;
  const feature3Code = (await createTestFeature({ word: "orange", code })).code;

  const { userId } = await createTestUser();

  // owner 1 has only content without features and feature1
  const { userId: owner1Id } = await createTestUser();
  const { activityId: activity1aId } = await createActivity(owner1Id, null);
  const { activityId: activity1bId } = await createActivity(owner1Id, null);
  await makeActivityPublic({
    id: activity1aId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity1bId,
    ownerId: owner1Id,
    licenseCode: "CCDUAL",
  });
  await updateContentFeatures({
    id: activity1bId,
    ownerId: owner1Id,
    features: { [feature1Code]: true },
  });

  // owner 2 has content combinations of two features
  const { userId: owner2Id } = await createTestUser();
  const { activityId: activity2aId } = await createActivity(owner2Id, null);
  const { activityId: activity2bId } = await createActivity(owner2Id, null);
  const { activityId: activity2cId } = await createActivity(owner2Id, null);
  await makeActivityPublic({
    id: activity2aId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity2bId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity2cId,
    ownerId: owner2Id,
    licenseCode: "CCDUAL",
  });
  await updateContentFeatures({
    id: activity2aId,
    ownerId: owner2Id,
    features: { [feature1Code]: true, [feature2Code]: true },
  });
  await updateContentFeatures({
    id: activity2bId,
    ownerId: owner2Id,
    features: { [feature1Code]: true, [feature3Code]: true },
  });
  await updateContentFeatures({
    id: activity2cId,
    ownerId: owner2Id,
    features: { [feature3Code]: true, [feature2Code]: true },
  });

  // owner 3 has one content with feature 2 and and three with feature 3
  const { userId: owner3Id } = await createTestUser();

  const { activityId: activity3aId } = await createActivity(owner3Id, null);
  const { activityId: activity3bId } = await createActivity(owner3Id, null);
  const { activityId: activity3cId } = await createActivity(owner3Id, null);
  const { activityId: activity3dId } = await createActivity(owner3Id, null);
  await makeActivityPublic({
    id: activity3aId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity3bId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity3cId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
  });
  await makeActivityPublic({
    id: activity3dId,
    ownerId: owner3Id,
    licenseCode: "CCDUAL",
  });
  await updateContentFeatures({
    id: activity3aId,
    ownerId: owner3Id,
    features: { [feature2Code]: true },
  });
  await updateContentFeatures({
    id: activity3bId,
    ownerId: owner3Id,
    features: { [feature3Code]: true },
  });
  await updateContentFeatures({
    id: activity3cId,
    ownerId: owner3Id,
    features: { [feature3Code]: true },
  });
  await updateContentFeatures({
    id: activity3dId,
    ownerId: owner3Id,
    features: { [feature3Code]: true },
  });

  // owners 1 and 2 have feature1
  let result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: { [feature1Code]: true },
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numContent).eq(2);
  expect(isEqualUUID(result[1].userId, owner1Id)).eq(true);
  expect(result[1].numContent).eq(1);

  // owners 2 and 3 have feature2
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: { [feature2Code]: true },
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numContent).eq(2);
  expect(isEqualUUID(result[1].userId, owner3Id)).eq(true);
  expect(result[1].numContent).eq(1);

  // owners 2 and 3 have feature3
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: { [feature3Code]: true },
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner3Id)).eq(true);
  expect(result[0].numContent).eq(3);
  expect(isEqualUUID(result[1].userId, owner2Id)).eq(true);
  expect(result[1].numContent).eq(2);

  // owners 2 has combinations of two features
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: { [feature1Code]: true, [feature2Code]: true },
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numContent).eq(1);

  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: { [feature1Code]: true, [feature3Code]: true },
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numContent).eq(1);

  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: { [feature3Code]: true, [feature2Code]: true },
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numContent).eq(1);

  // no one has all three features
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: {
      [feature3Code]: true,
      [feature2Code]: true,
      [feature1Code]: true,
    },
  });
  expect(result.length).eq(0);
});

test("searchClassificationsWithSharedContent, returns only classifications with public/shared/non-deleted content", async () => {
  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const licenseCode = "CCDUAL";

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

  const { activityId: activityIdPrivate } = await createActivity(ownerId, null);
  const { activityId: activityIdPublic } = await createActivity(ownerId, null);
  const { activityId: activityIdShared } = await createActivity(ownerId, null);
  const { activityId: activityIdDeleted } = await createActivity(ownerId, null);

  await makeActivityPublic({ id: activityIdPublic, licenseCode, ownerId });
  await shareActivity({
    id: activityIdShared,
    ownerId,
    licenseCode,
    users: [user1Id],
  });
  await makeActivityPublic({ id: activityIdDeleted, licenseCode, ownerId });

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
  await deleteActivity(activityIdDeleted, ownerId);

  // user1 gets classifications with shared and public content
  let resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}B2B${code}`,
    loggedInUserId: user1Id,
  });
  expect(resultsClass.length).eq(2); // order determined by second query word
  expect(resultsClass[0].id).eq(classificationIdB2B);
  expect(resultsClass[1].id).eq(classificationIdA1A);
  let resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code} ${word}A1${code}`,
    loggedInUserId: user1Id,
  });
  expect(resultsSubCat.length).eq(2); // ordered determined by second query word
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdA1);
  expect(resultsSubCat[1].subCategoryId).eq(subCategoryIdB2);
  let resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code} ${word}B${code}`,
    loggedInUserId: user1Id,
  });
  expect(resultsCat.length).eq(2); // ordered determined by second query word
  expect(resultsCat[0].categoryId).eq(categoryIdB);
  expect(resultsCat[1].categoryId).eq(categoryIdA);

  // user2 just gets classifications with public
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: user2Id,
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].id).eq(classificationIdB2B);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: user2Id,
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdB2);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: user2Id,
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].categoryId).eq(categoryIdB);
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
  const { activityId: activityId1A } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId1A,
    licenseCode: "CCDUAL",
    ownerId,
  });
  await addClassification(activityId1A, classificationIdA1A, ownerId);
  await addClassification(activityId1A, classificationIdB1A, ownerId);

  // add activity 2A to classificationIdA2A, classificationIdB2A
  const { activityId: activityId2A } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId2A,
    licenseCode: "CCDUAL",
    ownerId,
  });
  await addClassification(activityId2A, classificationIdA2A, ownerId);
  await addClassification(activityId2A, classificationIdB2A, ownerId);

  // add activity 1B to classificationIdA1B, classificationIdB1B
  const { activityId: activityId1B } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId1B,
    licenseCode: "CCDUAL",
    ownerId,
  });
  await addClassification(activityId1B, classificationIdA1B, ownerId);
  await addClassification(activityId1B, classificationIdB1B, ownerId);

  // add activity 2B to classificationIdA2B, classificationIdB2B
  const { activityId: activityId2B } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId2B,
    licenseCode: "CCDUAL",
    ownerId,
  });
  await addClassification(activityId2B, classificationIdA2B, ownerId);
  await addClassification(activityId2B, classificationIdB2B, ownerId);

  // add activity A1 to classificationIdA1A, classificationIdA1A
  const { activityId: activityId1 } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId1,
    licenseCode: "CCDUAL",
    ownerId,
  });
  await addClassification(activityId1, classificationIdA1A, ownerId);
  await addClassification(activityId1, classificationIdA1B, ownerId);

  // add activity A2 to classificationIdA2A, classificationIdA2A
  const { activityId: activityIdA2 } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityIdA2,
    licenseCode: "CCDUAL",
    ownerId,
  });
  await addClassification(activityIdA2, classificationIdA2A, ownerId);
  await addClassification(activityIdA2, classificationIdA2B, ownerId);

  // add activity B1 to classificationIdB1A, classificationIdB1A
  const { activityId: activityIdB1 } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityIdB1,
    licenseCode: "CCDUAL",
    ownerId,
  });
  await addClassification(activityIdB1, classificationIdB1A, ownerId);
  await addClassification(activityIdB1, classificationIdB1B, ownerId);

  // add activity B2 to classificationIdB2A, classificationIdB2A
  const { activityId: activityIdB2 } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityIdB2,
    licenseCode: "CCDUAL",
    ownerId,
  });
  await addClassification(activityIdB2, classificationIdB2A, ownerId);
  await addClassification(activityIdB2, classificationIdB2B, ownerId);

  // without filter get all eight classifications, with first determined by second query word
  let resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A2B${code}`,
    loggedInUserId: userId,
  });
  expect(resultsClass.length).eq(8);
  expect(resultsClass[0].id).eq(classificationIdA2B);

  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}B1A${code}`,
    loggedInUserId: userId,
  });
  expect(resultsClass.length).eq(8);
  expect(resultsClass[0].id).eq(classificationIdB1A);

  // without filter get all four sub categories, with first determined by second query word
  let resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code} ${word}B1${code}`,
    loggedInUserId: userId,
  });
  expect(resultsSubCat.length).eq(4);
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdB1);

  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code} ${word}A2${code}`,
    loggedInUserId: userId,
  });
  expect(resultsSubCat.length).eq(4);
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdA2);

  // without filter get all both categories, with order determined by second query word
  let resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code} ${word}B${code}`,
    loggedInUserId: userId,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].categoryId).eq(categoryIdB);
  expect(resultsCat[1].categoryId).eq(categoryIdA);

  // filtering by systemId doesn't change the results
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A2A${code}`,
    loggedInUserId: userId,
    systemId,
  });
  expect(resultsClass.length).eq(8);
  expect(resultsClass[0].id).eq(classificationIdA2A);

  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code} ${word}A1${code}`,
    loggedInUserId: userId,
    systemId,
  });
  expect(resultsSubCat.length).eq(4);
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdA1);

  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code} ${word}A${code}`,
    loggedInUserId: userId,
    systemId,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].categoryId).eq(categoryIdA);
  expect(resultsCat[1].categoryId).eq(categoryIdB);

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
  expect(resultsClass[0].id).eq(classificationIdB2B);
  expect(
    resultsClass
      .slice(1)
      .map((c) => c.id)
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
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdB2);
  expect(resultsSubCat[1].subCategoryId).eq(subCategoryIdB1);

  // filter by sub category A2
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code} ${word}A2B${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].id).eq(classificationIdA2B);
  expect(resultsClass[1].id).eq(classificationIdA2A);
});

test("searchClassificationsWithSharedContent, filter by activity feature", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const licenseCode = "CCDUAL";

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

  // add two activities to A1A and B2B
  const { activityId: activityIdA1 } = await createActivity(ownerId, null);
  const { activityId: activityIdA2 } = await createActivity(ownerId, null);
  const { activityId: activityIdB1 } = await createActivity(ownerId, null);
  const { activityId: activityIdB2 } = await createActivity(ownerId, null);
  await makeActivityPublic({ id: activityIdA1, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdA2, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdB1, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdB2, licenseCode, ownerId });
  await addClassification(activityIdA1, classificationIdA1A, ownerId);
  await addClassification(activityIdA2, classificationIdA1A, ownerId);
  await addClassification(activityIdB1, classificationIdB2B, ownerId);
  await addClassification(activityIdB2, classificationIdB2B, ownerId);

  // add single activity feature to three of the activities
  await updateContentFeatures({
    id: activityIdA1,
    ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    id: activityIdA2,
    ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdB1,
    ownerId,
    features: { containsVideo: true },
  });

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

  // filter by isQuestion
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true },
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].id).eq(classificationIdA1A);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true },
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdA1);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true },
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].categoryId).eq(categoryIdA);

  // filter by isInteractive
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isInteractive: true },
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].id).eq(classificationIdA1A);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isInteractive: true },
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdA1);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isInteractive: true },
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].categoryId).eq(categoryIdA);

  // filter by containsVideo
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { containsVideo: true },
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].id).eq(classificationIdB2B);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { containsVideo: true },
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdB2);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { containsVideo: true },
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].categoryId).eq(categoryIdB);

  // nothing if filter by pairs of features
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, isInteractive: true },
  });
  expect(resultsClass.length).eq(0);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, isInteractive: true },
  });
  expect(resultsSubCat.length).eq(0);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, isInteractive: true },
  });
  expect(resultsCat.length).eq(0);

  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, containsVideo: true },
  });
  expect(resultsClass.length).eq(0);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, containsVideo: true },
  });
  expect(resultsSubCat.length).eq(0);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, containsVideo: true },
  });
  expect(resultsCat.length).eq(0);

  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isInteractive: true, containsVideo: true },
  });
  expect(resultsClass.length).eq(0);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isInteractive: true, containsVideo: true },
  });
  expect(resultsSubCat.length).eq(0);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isInteractive: true, containsVideo: true },
  });
  expect(resultsCat.length).eq(0);

  // add second feature to the three activities
  await updateContentFeatures({
    id: activityIdA1,
    ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdA2,
    ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdB1,
    ownerId,
    features: { isQuestion: true },
  });

  // filter by pairs of features again
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, isInteractive: true },
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].id).eq(classificationIdA1A);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, isInteractive: true },
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdA1);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, isInteractive: true },
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].categoryId).eq(categoryIdA);

  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isInteractive: true, containsVideo: true },
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].id).eq(classificationIdA1A);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isInteractive: true, containsVideo: true },
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdA1);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isInteractive: true, containsVideo: true },
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].categoryId).eq(categoryIdA);

  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { containsVideo: true, isQuestion: true },
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].id).eq(classificationIdB2B);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { containsVideo: true, isQuestion: true },
  });
  expect(resultsSubCat.length).eq(1);
  expect(resultsSubCat[0].subCategoryId).eq(subCategoryIdB2);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { containsVideo: true, isQuestion: true },
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].categoryId).eq(categoryIdB);

  // filter by all three features
  resultsClass = await searchClassificationsWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });
  expect(resultsClass.length).eq(0);
  resultsSubCat = await searchClassificationSubCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });
  expect(resultsSubCat.length).eq(0);
  resultsCat = await searchClassificationCategoriesWithSharedContent({
    query: `${word}${code}`,
    loggedInUserId: userId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });
  expect(resultsCat.length).eq(0);
});

test("browseClassificationSharedContent, returns only public/shared/non-deleted content", async () => {
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();
  const { userId: ownerId } = await createTestUser();
  const licenseCode = "CCDUAL";

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "banana";

  const systemId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].descriptions[0].subCategory.category.system.id;

  const { classificationIdA1A } = await createTestClassifications({
    systemId,
    word,
    code,
  });

  // add public, shared, private activities to A1A
  const { activityId: activityIdPublic1 } = await createActivity(ownerId, null);
  const { activityId: activityIdPublic2 } = await createActivity(ownerId, null);
  const { activityId: activityIdShared } = await createActivity(ownerId, null);
  const { activityId: activityIdPrivate } = await createActivity(ownerId, null);
  const { activityId: activityIdDeleted } = await createActivity(ownerId, null);

  const activityIdPublic1String = fromUUID(activityIdPublic1);
  const activityIdPublic2String = fromUUID(activityIdPublic2);
  const activityIdSharedString = fromUUID(activityIdShared);

  await makeActivityPublic({ id: activityIdPublic1, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdPublic2, licenseCode, ownerId });
  await shareActivity({
    id: activityIdShared,
    ownerId,
    licenseCode,
    users: [userId1],
  });
  await makeActivityPublic({ id: activityIdDeleted, licenseCode, ownerId });
  await addClassification(activityIdPublic1, classificationIdA1A, ownerId);
  await addClassification(activityIdPublic2, classificationIdA1A, ownerId);
  await addClassification(activityIdShared, classificationIdA1A, ownerId);
  await addClassification(activityIdPrivate, classificationIdA1A, ownerId);
  await addClassification(activityIdDeleted, classificationIdA1A, ownerId);
  await deleteActivity(activityIdDeleted, ownerId);

  // user1 gets public and shared content
  let results = await browseClassificationSharedContent({
    loggedInUserId: userId1,
    classificationId: classificationIdA1A,
  });
  expect(results.content.length).eq(3);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [
      activityIdPublic1String,
      activityIdPublic2String,
      activityIdSharedString,
    ].sort(),
  );

  // user2 gets only public content
  results = await browseClassificationSharedContent({
    loggedInUserId: userId2,
    classificationId: classificationIdA1A,
  });
  expect(results.content.length).eq(2);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [activityIdPublic1String, activityIdPublic2String].sort(),
  );
});

test("browseClassificationSharedContent, filter by activity feature", async () => {
  const { userId: userId } = await createTestUser();
  const { userId: ownerId } = await createTestUser();
  const licenseCode = "CCDUAL";

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "banana";

  const systemId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].descriptions[0].subCategory.category.system.id;

  const { classificationIdA1A } = await createTestClassifications({
    systemId,
    word,
    code,
  });

  // add activities to A1A with different combinations of features
  const { activityId: activityIdN } = await createActivity(ownerId, null);
  const { activityId: activityIdQ } = await createActivity(ownerId, null);
  const { activityId: activityIdI } = await createActivity(ownerId, null);
  const { activityId: activityIdV } = await createActivity(ownerId, null);
  const { activityId: activityIdQI } = await createActivity(ownerId, null);
  const { activityId: activityIdQV } = await createActivity(ownerId, null);
  const { activityId: activityIdIV } = await createActivity(ownerId, null);
  const { activityId: activityIdQIV } = await createActivity(ownerId, null);

  const activityIdNString = fromUUID(activityIdN);
  const activityIdQString = fromUUID(activityIdQ);
  const activityIdIString = fromUUID(activityIdI);
  const activityIdVString = fromUUID(activityIdV);
  const activityIdQIString = fromUUID(activityIdQI);
  const activityIdQVString = fromUUID(activityIdQV);
  const activityIdIVString = fromUUID(activityIdIV);
  const activityIdQIVString = fromUUID(activityIdQIV);

  await makeActivityPublic({ id: activityIdN, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQ, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdI, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdV, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQI, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQV, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdIV, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQIV, licenseCode, ownerId });
  await addClassification(activityIdN, classificationIdA1A, ownerId);
  await addClassification(activityIdQ, classificationIdA1A, ownerId);
  await addClassification(activityIdI, classificationIdA1A, ownerId);
  await addClassification(activityIdV, classificationIdA1A, ownerId);
  await addClassification(activityIdQI, classificationIdA1A, ownerId);
  await addClassification(activityIdQV, classificationIdA1A, ownerId);
  await addClassification(activityIdIV, classificationIdA1A, ownerId);
  await addClassification(activityIdQIV, classificationIdA1A, ownerId);

  await updateContentFeatures({
    id: activityIdQ,
    ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    id: activityIdI,
    ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdV,
    ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdQI,
    ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdQV,
    ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdIV,
    ownerId,
    features: { isInteractive: true, containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdQIV,
    ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  // get all with no filter
  let results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
  });
  expect(results.content.length).eq(8);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [
      activityIdNString,
      activityIdQString,
      activityIdIString,
      activityIdVString,
      activityIdQIString,
      activityIdQVString,
      activityIdIVString,
      activityIdQIVString,
    ].sort(),
  );

  // filter for single feature
  results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
    features: { isQuestion: true },
  });
  expect(results.content.length).eq(4);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [
      activityIdQString,
      activityIdQIString,
      activityIdQVString,
      activityIdQIVString,
    ].sort(),
  );

  results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
    features: { isInteractive: true },
  });
  expect(results.content.length).eq(4);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [
      activityIdIString,
      activityIdQIString,
      activityIdIVString,
      activityIdQIVString,
    ].sort(),
  );

  results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
    features: { containsVideo: true },
  });
  expect(results.content.length).eq(4);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [
      activityIdVString,
      activityIdQVString,
      activityIdIVString,
      activityIdQIVString,
    ].sort(),
  );

  // filter for pairs of features
  results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
    features: { isQuestion: true, isInteractive: true },
  });
  expect(results.content.length).eq(2);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [activityIdQIString, activityIdQIVString].sort(),
  );

  results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
    features: { isQuestion: true, containsVideo: true },
  });
  expect(results.content.length).eq(2);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [activityIdQVString, activityIdQIVString].sort(),
  );

  results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
    features: { isInteractive: true, containsVideo: true },
  });
  expect(results.content.length).eq(2);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [activityIdIVString, activityIdQIVString].sort(),
  );
});

test("browseSubCategorySharedContent, returns only public/shared/non-deleted content and classifications", async () => {
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();
  const { userId: ownerId } = await createTestUser();
  const licenseCode = "CCDUAL";

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "banana";

  const systemId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].descriptions[0].subCategory.category.system.id;

  const { subCategoryIdA1, classificationIdA1A, classificationIdA1B } =
    await createTestClassifications({
      systemId,
      word,
      code,
    });

  // add public, shared, private activities to A1A and A1B
  const { activityId: activityIdPublicA } = await createActivity(ownerId, null);
  const { activityId: activityIdSharedA } = await createActivity(ownerId, null);
  const { activityId: activityIdPrivateA } = await createActivity(
    ownerId,
    null,
  );
  const { activityId: activityIdDeletedA } = await createActivity(
    ownerId,
    null,
  );
  const { activityId: activityIdPublicB } = await createActivity(ownerId, null);
  const { activityId: activityIdSharedB } = await createActivity(ownerId, null);
  const { activityId: activityIdPrivateB } = await createActivity(
    ownerId,
    null,
  );
  const { activityId: activityIdDeletedB } = await createActivity(
    ownerId,
    null,
  );

  const activityIdPublicAString = fromUUID(activityIdPublicA);
  const activityIdSharedAString = fromUUID(activityIdSharedA);
  const activityIdPublicBString = fromUUID(activityIdPublicB);
  const activityIdSharedBString = fromUUID(activityIdSharedB);

  await makeActivityPublic({ id: activityIdPublicA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdPublicB, licenseCode, ownerId });
  await shareActivity({
    id: activityIdSharedA,
    ownerId,
    licenseCode,
    users: [userId1],
  });
  await shareActivity({
    id: activityIdSharedB,
    ownerId,
    licenseCode,
    users: [userId1],
  });
  await makeActivityPublic({ id: activityIdDeletedA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdDeletedB, licenseCode, ownerId });
  await addClassification(activityIdPublicA, classificationIdA1A, ownerId);
  await addClassification(activityIdSharedA, classificationIdA1A, ownerId);
  await addClassification(activityIdPrivateA, classificationIdA1A, ownerId);
  await addClassification(activityIdDeletedA, classificationIdA1A, ownerId);
  await addClassification(activityIdPublicB, classificationIdA1B, ownerId);
  await addClassification(activityIdSharedB, classificationIdA1B, ownerId);
  await addClassification(activityIdPrivateB, classificationIdA1B, ownerId);
  await addClassification(activityIdDeletedB, classificationIdA1B, ownerId);
  await deleteActivity(activityIdDeletedA, ownerId);
  await deleteActivity(activityIdDeletedB, ownerId);

  // user1 gets public and shared content
  let results = await browseSubCategorySharedContent({
    loggedInUserId: userId1,
    subCategoryId: subCategoryIdA1,
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(2);
  expect(
    results.classifications[0].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityIdPublicAString, activityIdSharedAString].sort());
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(2);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityIdPublicBString, activityIdSharedBString].sort());

  // user2 gets only public content
  results = await browseSubCategorySharedContent({
    loggedInUserId: userId2,
    subCategoryId: subCategoryIdA1,
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(1);
  expect(
    isEqualUUID(results.classifications[0].content[0].id, activityIdPublicA),
  ).eq(true);
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(1);
  expect(
    isEqualUUID(results.classifications[1].content[0].id, activityIdPublicB),
  ).eq(true);

  // if delete activity public A, then user 2 no longer sees classification A1A
  await deleteActivity(activityIdPublicA, ownerId);

  // user1 gets public and shared content
  results = await browseSubCategorySharedContent({
    loggedInUserId: userId1,
    subCategoryId: subCategoryIdA1,
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(1);
  expect(
    isEqualUUID(results.classifications[0].content[0].id, activityIdSharedA),
  );
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(2);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityIdPublicBString, activityIdSharedBString].sort());

  // user2 gets only public content
  results = await browseSubCategorySharedContent({
    loggedInUserId: userId2,
    subCategoryId: subCategoryIdA1,
  });
  expect(results.classifications.length).eq(1);
  expect(results.classifications[0].classificationId).eq(classificationIdA1B);
  expect(results.classifications[0].content.length).eq(1);
  expect(
    isEqualUUID(results.classifications[0].content[0].id, activityIdPublicB),
  ).eq(true);
});

test("browseSubCategorySharedContent, filter by activity feature", async () => {
  const { userId } = await createTestUser();
  const { userId: ownerId } = await createTestUser();
  const licenseCode = "CCDUAL";

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "banana";

  const systemId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].descriptions[0].subCategory.category.system.id;

  const { subCategoryIdA1, classificationIdA1A, classificationIdA1B } =
    await createTestClassifications({
      systemId,
      word,
      code,
    });

  // add activities with different features to to A1A and A1B
  const { activityId: activityIdNA } = await createActivity(ownerId, null);
  const { activityId: activityIdQA } = await createActivity(ownerId, null);
  const { activityId: activityIdIA } = await createActivity(ownerId, null);
  const { activityId: activityIdVA } = await createActivity(ownerId, null);
  const { activityId: activityIdQIA } = await createActivity(ownerId, null);
  const { activityId: activityIdQVA } = await createActivity(ownerId, null);
  const { activityId: activityIdIVA } = await createActivity(ownerId, null);
  const { activityId: activityIdQIVA } = await createActivity(ownerId, null);
  const { activityId: activityIdNB } = await createActivity(ownerId, null);
  const { activityId: activityIdQB } = await createActivity(ownerId, null);
  const { activityId: activityIdIB } = await createActivity(ownerId, null);
  const { activityId: activityIdVB } = await createActivity(ownerId, null);
  const { activityId: activityIdQIB } = await createActivity(ownerId, null);
  const { activityId: activityIdQVB } = await createActivity(ownerId, null);
  const { activityId: activityIdIVB } = await createActivity(ownerId, null);
  const { activityId: activityIdQIVB } = await createActivity(ownerId, null);

  const activityIdNAString = fromUUID(activityIdNA);
  const activityIdQAString = fromUUID(activityIdQA);
  const activityIdIAString = fromUUID(activityIdIA);
  const activityIdVAString = fromUUID(activityIdVA);
  const activityIdQIAString = fromUUID(activityIdQIA);
  const activityIdQVAString = fromUUID(activityIdQVA);
  const activityIdIVAString = fromUUID(activityIdIVA);
  const activityIdQIVAString = fromUUID(activityIdQIVA);
  const activityIdNBString = fromUUID(activityIdNB);
  const activityIdQBString = fromUUID(activityIdQB);
  const activityIdIBString = fromUUID(activityIdIB);
  const activityIdVBString = fromUUID(activityIdVB);
  const activityIdQIBString = fromUUID(activityIdQIB);
  const activityIdQVBString = fromUUID(activityIdQVB);
  const activityIdIVBString = fromUUID(activityIdIVB);
  const activityIdQIVBString = fromUUID(activityIdQIVB);

  await makeActivityPublic({ id: activityIdNA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdIA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdVA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQIA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQVA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdIVA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQIVA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdNB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdIB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdVB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQIB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQVB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdIVB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQIVB, licenseCode, ownerId });

  await addClassification(activityIdNA, classificationIdA1A, ownerId);
  await addClassification(activityIdQA, classificationIdA1A, ownerId);
  await addClassification(activityIdIA, classificationIdA1A, ownerId);
  await addClassification(activityIdVA, classificationIdA1A, ownerId);
  await addClassification(activityIdQIA, classificationIdA1A, ownerId);
  await addClassification(activityIdQVA, classificationIdA1A, ownerId);
  await addClassification(activityIdIVA, classificationIdA1A, ownerId);
  await addClassification(activityIdQIVA, classificationIdA1A, ownerId);
  await addClassification(activityIdNB, classificationIdA1B, ownerId);
  await addClassification(activityIdQB, classificationIdA1B, ownerId);
  await addClassification(activityIdIB, classificationIdA1B, ownerId);
  await addClassification(activityIdVB, classificationIdA1B, ownerId);
  await addClassification(activityIdQIB, classificationIdA1B, ownerId);
  await addClassification(activityIdQVB, classificationIdA1B, ownerId);
  await addClassification(activityIdIVB, classificationIdA1B, ownerId);
  await addClassification(activityIdQIVB, classificationIdA1B, ownerId);

  await updateContentFeatures({
    id: activityIdQA,
    ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    id: activityIdIA,
    ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdVA,
    ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdQIA,
    ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdQVA,
    ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdIVA,
    ownerId,
    features: { isInteractive: true, containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdQIVA,
    ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  await updateContentFeatures({
    id: activityIdQB,
    ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    id: activityIdIB,
    ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdVB,
    ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdQIB,
    ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdQVB,
    ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdIVB,
    ownerId,
    features: { isInteractive: true, containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdQIVB,
    ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  // no filter, get everything
  let results = await browseSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(8);
  expect(
    results.classifications[0].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls(
    [
      activityIdNAString,
      activityIdQAString,
      activityIdIAString,
      activityIdVAString,
      activityIdQIAString,
      activityIdQVAString,
      activityIdIVAString,
      activityIdQIVAString,
    ].sort(),
  );
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(8);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls(
    [
      activityIdNBString,
      activityIdQBString,
      activityIdIBString,
      activityIdVBString,
      activityIdQIBString,
      activityIdQVBString,
      activityIdIVBString,
      activityIdQIVBString,
    ].sort(),
  );

  // filter by isQuestion
  results = await browseSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: { isQuestion: true },
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(4);
  expect(
    results.classifications[0].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls(
    [
      activityIdQAString,
      activityIdQIAString,
      activityIdQVAString,
      activityIdQIVAString,
    ].sort(),
  );
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(4);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls(
    [
      activityIdQBString,
      activityIdQIBString,
      activityIdQVBString,
      activityIdQIVBString,
    ].sort(),
  );

  // filter by isInteractive
  results = await browseSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: { isInteractive: true },
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(4);
  expect(
    results.classifications[0].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls(
    [
      activityIdIAString,
      activityIdQIAString,
      activityIdIVAString,
      activityIdQIVAString,
    ].sort(),
  );
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(4);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls(
    [
      activityIdIBString,
      activityIdQIBString,
      activityIdIVBString,
      activityIdQIVBString,
    ].sort(),
  );

  // filter by containsVideo
  results = await browseSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: { containsVideo: true },
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(4);
  expect(
    results.classifications[0].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls(
    [
      activityIdVAString,
      activityIdQVAString,
      activityIdIVAString,
      activityIdQIVAString,
    ].sort(),
  );
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(4);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls(
    [
      activityIdVBString,
      activityIdQVBString,
      activityIdIVBString,
      activityIdQIVBString,
    ].sort(),
  );

  // filter by isQuestion, isInteractive
  results = await browseSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: { isQuestion: true, isInteractive: true },
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(2);
  expect(
    results.classifications[0].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityIdQIAString, activityIdQIVAString].sort());
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(2);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityIdQIBString, activityIdQIVBString].sort());

  // filter by isQuestion, containsVideo
  results = await browseSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: { isQuestion: true, containsVideo: true },
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(2);
  expect(
    results.classifications[0].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityIdQVAString, activityIdQIVAString].sort());
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(2);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityIdQVBString, activityIdQIVBString].sort());

  // filter by isInteractive, containsVideo
  results = await browseSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: { isInteractive: true, containsVideo: true },
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(2);
  expect(
    results.classifications[0].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityIdIVAString, activityIdQIVAString].sort());
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(2);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityIdIVBString, activityIdQIVBString].sort());

  // filter by isQuestion, isInteractive, containsVideo
  results = await browseSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(1);
  expect(
    isEqualUUID(results.classifications[0].content[0].id, activityIdQIVA),
  ).eq(true);
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(1);
  expect(
    isEqualUUID(results.classifications[1].content[0].id, activityIdQIVB),
  ).eq(true);
});

test("browseCategorySharedContent, returns only public/shared/non-deleted content and classifications", async () => {
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();
  const { userId: ownerId } = await createTestUser();
  const licenseCode = "CCDUAL";

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
    classificationIdA1B,
    subCategoryIdA2,
    classificationIdA2A,
    classificationIdA2B,
  } = await createTestClassifications({
    systemId,
    word,
    code,
  });

  // add public, shared, private activities to A1A and A1B
  const { activityId: activityIdPublicA } = await createActivity(ownerId, null);
  const { activityId: activityIdSharedA } = await createActivity(ownerId, null);
  const { activityId: activityIdPrivateA } = await createActivity(
    ownerId,
    null,
  );
  const { activityId: activityIdDeletedA } = await createActivity(
    ownerId,
    null,
  );
  const { activityId: activityIdPublicB } = await createActivity(ownerId, null);
  const { activityId: activityIdSharedB } = await createActivity(ownerId, null);
  const { activityId: activityIdPrivateB } = await createActivity(
    ownerId,
    null,
  );
  const { activityId: activityIdDeletedB } = await createActivity(
    ownerId,
    null,
  );

  const activityIdPublicAString = fromUUID(activityIdPublicA);
  const activityIdSharedAString = fromUUID(activityIdSharedA);
  const activityIdPublicBString = fromUUID(activityIdPublicB);
  const activityIdSharedBString = fromUUID(activityIdSharedB);

  await makeActivityPublic({ id: activityIdPublicA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdPublicB, licenseCode, ownerId });
  await shareActivity({
    id: activityIdSharedA,
    ownerId,
    licenseCode,
    users: [userId1],
  });
  await shareActivity({
    id: activityIdSharedB,
    ownerId,
    licenseCode,
    users: [userId1],
  });
  await makeActivityPublic({ id: activityIdDeletedA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdDeletedB, licenseCode, ownerId });
  await addClassification(activityIdPublicA, classificationIdA1A, ownerId);
  await addClassification(activityIdSharedA, classificationIdA1A, ownerId);
  await addClassification(activityIdPrivateA, classificationIdA1A, ownerId);
  await addClassification(activityIdDeletedA, classificationIdA1A, ownerId);
  await addClassification(activityIdPublicB, classificationIdA1B, ownerId);
  await addClassification(activityIdSharedB, classificationIdA1B, ownerId);
  await addClassification(activityIdPrivateB, classificationIdA1B, ownerId);
  await addClassification(activityIdDeletedB, classificationIdA1B, ownerId);

  // add the private and deleted activities to A2A and A2B
  await addClassification(activityIdPrivateA, classificationIdA2A, ownerId);
  await addClassification(activityIdDeletedA, classificationIdA2A, ownerId);
  await addClassification(activityIdPrivateB, classificationIdA2B, ownerId);
  await addClassification(activityIdDeletedB, classificationIdA2B, ownerId);

  // add a shared activity to A2B
  await addClassification(activityIdSharedB, classificationIdA2B, ownerId);

  // actually delete the deleted activities
  await deleteActivity(activityIdDeletedA, ownerId);
  await deleteActivity(activityIdDeletedB, ownerId);

  // user1 gets public and shared content and their subCategories/classifications
  let results = await browseCategorySharedContent({
    loggedInUserId: userId1,
    categoryId: categoryIdA,
  });
  expect(results.subCategories.length).eq(2);
  expect(results.subCategories[0].subCategoryId).eq(subCategoryIdA1);
  expect(results.subCategories[0].classifications.length).eq(2);
  expect(results.subCategories[0].classifications[0].classificationId).eq(
    classificationIdA1A,
  );
  expect(results.subCategories[0].classifications[0].content.length).eq(2);
  expect(
    results.subCategories[0].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls([activityIdPublicAString, activityIdSharedAString].sort());
  expect(results.subCategories[0].classifications[1].classificationId).eq(
    classificationIdA1B,
  );
  expect(results.subCategories[0].classifications[1].content.length).eq(2);
  expect(
    results.subCategories[0].classifications[1].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls([activityIdPublicBString, activityIdSharedBString].sort());

  expect(results.subCategories[1].subCategoryId).eq(subCategoryIdA2);
  expect(results.subCategories[1].classifications.length).eq(1);
  expect(results.subCategories[1].classifications[0].classificationId).eq(
    classificationIdA2B,
  );
  expect(results.subCategories[1].classifications[0].content.length).eq(1);
  expect(
    isEqualUUID(
      results.subCategories[1].classifications[0].content[0].id,
      activityIdSharedB,
    ),
  );

  // user2 gets only public content and their subCategories/classifications
  results = await browseCategorySharedContent({
    loggedInUserId: userId2,
    categoryId: categoryIdA,
  });
  expect(results.subCategories.length).eq(1);
  expect(results.subCategories[0].subCategoryId).eq(subCategoryIdA1);
  expect(results.subCategories[0].classifications.length).eq(2);
  expect(results.subCategories[0].classifications[0].classificationId).eq(
    classificationIdA1A,
  );
  expect(results.subCategories[0].classifications[0].content.length).eq(1);
  expect(
    isEqualUUID(
      results.subCategories[0].classifications[0].content[0].id,
      activityIdPublicA,
    ),
  ).eq(true);
  expect(results.subCategories[0].classifications[1].classificationId).eq(
    classificationIdA1B,
  );
  expect(results.subCategories[0].classifications[1].content.length).eq(1);
  expect(
    isEqualUUID(
      results.subCategories[0].classifications[1].content[0].id,
      activityIdPublicB,
    ),
  ).eq(true);
});

test("browseCategorySharedContent, filter by activity feature", async () => {
  const { userId } = await createTestUser();
  const { userId: ownerId } = await createTestUser();
  const licenseCode = "CCDUAL";

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
    subCategoryIdA2,
    classificationIdA2B,
  } = await createTestClassifications({
    systemId,
    word,
    code,
  });

  // add activities with different features to to A1A and A2B
  const { activityId: activityIdNA } = await createActivity(ownerId, null);
  const { activityId: activityIdQA } = await createActivity(ownerId, null);
  const { activityId: activityIdIA } = await createActivity(ownerId, null);
  const { activityId: activityIdVA } = await createActivity(ownerId, null);
  const { activityId: activityIdQIA } = await createActivity(ownerId, null);
  const { activityId: activityIdQVA } = await createActivity(ownerId, null);
  const { activityId: activityIdIVA } = await createActivity(ownerId, null);
  const { activityId: activityIdQIVA } = await createActivity(ownerId, null);
  const { activityId: activityIdNB } = await createActivity(ownerId, null);
  const { activityId: activityIdQB } = await createActivity(ownerId, null);
  const { activityId: activityIdIB } = await createActivity(ownerId, null);
  const { activityId: activityIdVB } = await createActivity(ownerId, null);
  const { activityId: activityIdQIB } = await createActivity(ownerId, null);
  const { activityId: activityIdQVB } = await createActivity(ownerId, null);
  const { activityId: activityIdIVB } = await createActivity(ownerId, null);
  const { activityId: activityIdQIVB } = await createActivity(ownerId, null);

  const activityIdNAString = fromUUID(activityIdNA);
  const activityIdQAString = fromUUID(activityIdQA);
  const activityIdIAString = fromUUID(activityIdIA);
  const activityIdVAString = fromUUID(activityIdVA);
  const activityIdQIAString = fromUUID(activityIdQIA);
  const activityIdQVAString = fromUUID(activityIdQVA);
  const activityIdIVAString = fromUUID(activityIdIVA);
  const activityIdQIVAString = fromUUID(activityIdQIVA);
  const activityIdNBString = fromUUID(activityIdNB);
  const activityIdQBString = fromUUID(activityIdQB);
  const activityIdIBString = fromUUID(activityIdIB);
  const activityIdVBString = fromUUID(activityIdVB);
  const activityIdQIBString = fromUUID(activityIdQIB);
  const activityIdQVBString = fromUUID(activityIdQVB);
  const activityIdIVBString = fromUUID(activityIdIVB);
  const activityIdQIVBString = fromUUID(activityIdQIVB);

  await makeActivityPublic({ id: activityIdNA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdIA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdVA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQIA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQVA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdIVA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQIVA, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdNB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdIB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdVB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQIB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQVB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdIVB, licenseCode, ownerId });
  await makeActivityPublic({ id: activityIdQIVB, licenseCode, ownerId });

  await addClassification(activityIdNA, classificationIdA1A, ownerId);
  await addClassification(activityIdQA, classificationIdA1A, ownerId);
  await addClassification(activityIdIA, classificationIdA1A, ownerId);
  await addClassification(activityIdVA, classificationIdA1A, ownerId);
  await addClassification(activityIdQIA, classificationIdA1A, ownerId);
  await addClassification(activityIdQVA, classificationIdA1A, ownerId);
  await addClassification(activityIdIVA, classificationIdA1A, ownerId);
  await addClassification(activityIdQIVA, classificationIdA1A, ownerId);
  await addClassification(activityIdNB, classificationIdA2B, ownerId);
  await addClassification(activityIdQB, classificationIdA2B, ownerId);
  await addClassification(activityIdIB, classificationIdA2B, ownerId);
  await addClassification(activityIdVB, classificationIdA2B, ownerId);
  await addClassification(activityIdQIB, classificationIdA2B, ownerId);
  await addClassification(activityIdQVB, classificationIdA2B, ownerId);
  await addClassification(activityIdIVB, classificationIdA2B, ownerId);
  await addClassification(activityIdQIVB, classificationIdA2B, ownerId);

  await updateContentFeatures({
    id: activityIdQA,
    ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    id: activityIdIA,
    ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdVA,
    ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdQIA,
    ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdQVA,
    ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdIVA,
    ownerId,
    features: { isInteractive: true, containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdQIVA,
    ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  await updateContentFeatures({
    id: activityIdQB,
    ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    id: activityIdIB,
    ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdVB,
    ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdQIB,
    ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    id: activityIdQVB,
    ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdIVB,
    ownerId,
    features: { isInteractive: true, containsVideo: true },
  });
  await updateContentFeatures({
    id: activityIdQIVB,
    ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  // no filter, get everything
  let results = await browseCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });

  expect(results.subCategories.length).eq(2);
  expect(results.subCategories[0].subCategoryId).eq(subCategoryIdA1);
  expect(results.subCategories[0].classifications.length).eq(1);
  expect(results.subCategories[0].classifications[0].classificationId).eq(
    classificationIdA1A,
  );
  expect(results.subCategories[0].classifications[0].content.length).eq(8);
  expect(
    results.subCategories[0].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls(
    [
      activityIdNAString,
      activityIdQAString,
      activityIdIAString,
      activityIdVAString,
      activityIdQIAString,
      activityIdQVAString,
      activityIdIVAString,
      activityIdQIVAString,
    ].sort(),
  );

  expect(results.subCategories[1].subCategoryId).eq(subCategoryIdA2);
  expect(results.subCategories[1].classifications.length).eq(1);
  expect(results.subCategories[1].classifications[0].classificationId).eq(
    classificationIdA2B,
  );
  expect(results.subCategories[1].classifications[0].content.length).eq(8);
  expect(
    results.subCategories[1].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls(
    [
      activityIdNBString,
      activityIdQBString,
      activityIdIBString,
      activityIdVBString,
      activityIdQIBString,
      activityIdQVBString,
      activityIdIVBString,
      activityIdQIVBString,
    ].sort(),
  );

  // filter by isQuestion
  results = await browseCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: { isQuestion: true },
  });

  expect(results.subCategories.length).eq(2);
  expect(results.subCategories[0].subCategoryId).eq(subCategoryIdA1);
  expect(results.subCategories[0].classifications.length).eq(1);
  expect(results.subCategories[0].classifications[0].classificationId).eq(
    classificationIdA1A,
  );
  expect(results.subCategories[0].classifications[0].content.length).eq(4);
  expect(
    results.subCategories[0].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls(
    [
      activityIdQAString,
      activityIdQIAString,
      activityIdQVAString,
      activityIdQIVAString,
    ].sort(),
  );

  expect(results.subCategories[1].subCategoryId).eq(subCategoryIdA2);
  expect(results.subCategories[1].classifications.length).eq(1);
  expect(results.subCategories[1].classifications[0].classificationId).eq(
    classificationIdA2B,
  );
  expect(results.subCategories[1].classifications[0].content.length).eq(4);
  expect(
    results.subCategories[1].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls(
    [
      activityIdQBString,
      activityIdQIBString,
      activityIdQVBString,
      activityIdQIVBString,
    ].sort(),
  );

  // filter by isInteractive
  results = await browseCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: { isInteractive: true },
  });

  expect(results.subCategories.length).eq(2);
  expect(results.subCategories[0].subCategoryId).eq(subCategoryIdA1);
  expect(results.subCategories[0].classifications.length).eq(1);
  expect(results.subCategories[0].classifications[0].classificationId).eq(
    classificationIdA1A,
  );
  expect(results.subCategories[0].classifications[0].content.length).eq(4);
  expect(
    results.subCategories[0].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls(
    [
      activityIdIAString,
      activityIdQIAString,
      activityIdIVAString,
      activityIdQIVAString,
    ].sort(),
  );

  expect(results.subCategories[1].subCategoryId).eq(subCategoryIdA2);
  expect(results.subCategories[1].classifications.length).eq(1);
  expect(results.subCategories[1].classifications[0].classificationId).eq(
    classificationIdA2B,
  );
  expect(results.subCategories[1].classifications[0].content.length).eq(4);
  expect(
    results.subCategories[1].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls(
    [
      activityIdIBString,
      activityIdQIBString,
      activityIdIVBString,
      activityIdQIVBString,
    ].sort(),
  );

  // filter by containsVideo
  results = await browseCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: { containsVideo: true },
  });

  expect(results.subCategories.length).eq(2);
  expect(results.subCategories[0].subCategoryId).eq(subCategoryIdA1);
  expect(results.subCategories[0].classifications.length).eq(1);
  expect(results.subCategories[0].classifications[0].classificationId).eq(
    classificationIdA1A,
  );
  expect(results.subCategories[0].classifications[0].content.length).eq(4);
  expect(
    results.subCategories[0].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls(
    [
      activityIdVAString,
      activityIdQVAString,
      activityIdIVAString,
      activityIdQIVAString,
    ].sort(),
  );

  expect(results.subCategories[1].subCategoryId).eq(subCategoryIdA2);
  expect(results.subCategories[1].classifications.length).eq(1);
  expect(results.subCategories[1].classifications[0].classificationId).eq(
    classificationIdA2B,
  );
  expect(results.subCategories[1].classifications[0].content.length).eq(4);
  expect(
    results.subCategories[1].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls(
    [
      activityIdVBString,
      activityIdQVBString,
      activityIdIVBString,
      activityIdQIVBString,
    ].sort(),
  );

  // filter by isQuestion, isInteractive
  results = await browseCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: { isQuestion: true, isInteractive: true },
  });

  expect(results.subCategories.length).eq(2);
  expect(results.subCategories[0].subCategoryId).eq(subCategoryIdA1);
  expect(results.subCategories[0].classifications.length).eq(1);
  expect(results.subCategories[0].classifications[0].classificationId).eq(
    classificationIdA1A,
  );
  expect(results.subCategories[0].classifications[0].content.length).eq(2);
  expect(
    results.subCategories[0].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls([activityIdQIAString, activityIdQIVAString].sort());

  expect(results.subCategories[1].subCategoryId).eq(subCategoryIdA2);
  expect(results.subCategories[1].classifications.length).eq(1);
  expect(results.subCategories[1].classifications[0].classificationId).eq(
    classificationIdA2B,
  );
  expect(results.subCategories[1].classifications[0].content.length).eq(2);
  expect(
    results.subCategories[1].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls([activityIdQIBString, activityIdQIVBString].sort());

  // filter by isQuestion, containsVideo
  results = await browseCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: { isQuestion: true, containsVideo: true },
  });

  expect(results.subCategories.length).eq(2);
  expect(results.subCategories[0].subCategoryId).eq(subCategoryIdA1);
  expect(results.subCategories[0].classifications.length).eq(1);
  expect(results.subCategories[0].classifications[0].classificationId).eq(
    classificationIdA1A,
  );
  expect(results.subCategories[0].classifications[0].content.length).eq(2);
  expect(
    results.subCategories[0].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls([activityIdQVAString, activityIdQIVAString].sort());

  expect(results.subCategories[1].subCategoryId).eq(subCategoryIdA2);
  expect(results.subCategories[1].classifications.length).eq(1);
  expect(results.subCategories[1].classifications[0].classificationId).eq(
    classificationIdA2B,
  );
  expect(results.subCategories[1].classifications[0].content.length).eq(2);
  expect(
    results.subCategories[1].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls([activityIdQVBString, activityIdQIVBString].sort());

  // filter by isInteractive, containsVideo
  results = await browseCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: { isInteractive: true, containsVideo: true },
  });

  expect(results.subCategories.length).eq(2);
  expect(results.subCategories[0].subCategoryId).eq(subCategoryIdA1);
  expect(results.subCategories[0].classifications.length).eq(1);
  expect(results.subCategories[0].classifications[0].classificationId).eq(
    classificationIdA1A,
  );
  expect(results.subCategories[0].classifications[0].content.length).eq(2);
  expect(
    results.subCategories[0].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls([activityIdIVAString, activityIdQIVAString].sort());

  expect(results.subCategories[1].subCategoryId).eq(subCategoryIdA2);
  expect(results.subCategories[1].classifications.length).eq(1);
  expect(results.subCategories[1].classifications[0].classificationId).eq(
    classificationIdA2B,
  );
  expect(results.subCategories[1].classifications[0].content.length).eq(2);
  expect(
    results.subCategories[1].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls([activityIdIVBString, activityIdQIVBString].sort());

  // filter by isQuestion, isInteractive, containsVideo
  results = await browseCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  expect(results.subCategories.length).eq(2);
  expect(results.subCategories[0].subCategoryId).eq(subCategoryIdA1);
  expect(results.subCategories[0].classifications.length).eq(1);
  expect(results.subCategories[0].classifications[0].classificationId).eq(
    classificationIdA1A,
  );
  expect(results.subCategories[0].classifications[0].content.length).eq(1);
  expect(
    results.subCategories[0].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls([activityIdQIVAString].sort());

  expect(results.subCategories[1].subCategoryId).eq(subCategoryIdA2);
  expect(results.subCategories[1].classifications.length).eq(1);
  expect(results.subCategories[1].classifications[0].classificationId).eq(
    classificationIdA2B,
  );
  expect(results.subCategories[1].classifications[0].content.length).eq(1);
  expect(
    results.subCategories[1].classifications[0].content
      .map((c) => fromUUID(c.id))
      .sort(),
  ).eqls([activityIdQIVBString].sort());
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
