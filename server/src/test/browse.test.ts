import { expect, test } from "vitest";
import {
  createTestClassifications,
  createTestFeature,
  createTestUser,
} from "./utils";
import { fromUUID, isEqualUUID } from "../utils/uuid";
import {
  addClassification,
  searchPossibleClassifications,
} from "../query/classification";
import {
  createContent,
  deleteContent,
  updateContent,
  updateContentFeatures,
} from "../query/activity";
import { modifyContentSharedWith, setContentIsPublic } from "../query/share";
import {
  browseClassificationCategoriesWithSharedContent,
  browseClassificationCategorySharedContent,
  browseClassificationSharedContent,
  browseClassificationSubCategoriesWithSharedContent,
  browseClassificationSubCategorySharedContent,
  browseClassificationsWithSharedContent,
  browseClassificationSystemsWithSharedContent,
  browseUsersWithSharedContent,
} from "../query/explore";
import { updateUser } from "../query/user";

test("browseUsersWithSharedContent, no filter, filter by unclassified", async () => {
  const { userId } = await createTestUser();

  const classificationId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].id;

  // owner 2 has two activities, one with a classification
  const { userId: owner1Id } = await createTestUser();
  const { contentId: activity1aId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activity1aId,
    loggedInUserId: owner1Id,
    isPublic: true,
  });
  const { contentId: activity1bId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activity1bId,
    loggedInUserId: owner1Id,
    isPublic: true,
  });
  await addClassification(activity1aId, classificationId, owner1Id);

  // owner 2 has three activities that have a classification
  const { userId: owner2Id } = await createTestUser();
  const { contentId: activity2aId } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activity2aId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });
  const { contentId: activity2bId } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activity2bId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });
  const { contentId: activity2cId } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activity2cId,
    loggedInUserId: owner2Id,
    isPublic: true,
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
  const word = "b";
  const feature = await createTestFeature({ word, code });
  const features = { [feature.code]: true };
  const featuresSet = new Set([feature.code]);
  await updateContentFeatures({
    contentId: activity2aId,
    loggedInUserId: owner2Id,
    features,
  });
  await updateContentFeatures({
    contentId: activity2bId,
    loggedInUserId: owner2Id,
    features,
  });
  await updateContentFeatures({
    contentId: activity2cId,
    loggedInUserId: owner2Id,
    features,
  });
  await updateContentFeatures({
    contentId: activity1aId,
    loggedInUserId: owner1Id,
    features,
  });
  await updateContentFeatures({
    contentId: activity1bId,
    loggedInUserId: owner1Id,
    features,
  });

  // when filter by feature, just the two owners, sorted by number of activities
  results = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: featuresSet,
  });

  expect(results.length).eq(2);
  expect(isEqualUUID(results[0].userId, owner2Id)).eq(true);
  expect(results[0].numCommunity).eq(3);
  expect(isEqualUUID(results[1].userId, owner1Id)).eq(true);
  expect(results[1].numCommunity).eq(2);

  // when filter by feature and unclassified, just get owner 1
  results = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: featuresSet,
    isUnclassified: true,
  });

  expect(results.length).eq(1);
  expect(isEqualUUID(results[0].userId, owner1Id)).eq(true);
  expect(results[0].numCommunity).eq(1);
});

test("browseUsersWithSharedContent returns only users with public/shared/non-deleted content", async () => {
  // to filter out just owners from this test, add a test feature to all of the content
  const code = Date.now().toString();
  const word = "b";
  const feature = await createTestFeature({ word, code });
  const features = { [feature.code]: true };
  const featuresSet = new Set([feature.code]);

  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  // owner 1 has only private and deleted content
  const owner1 = await createTestUser();
  const owner1Id = owner1.userId;

  const { contentId: activity1aId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContentFeatures({
    contentId: activity1aId,
    loggedInUserId: owner1Id,
    features,
  });
  const { contentId: activity1bId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContentFeatures({
    contentId: activity1bId,
    loggedInUserId: owner1Id,
    features,
  });
  const { contentId: folder1aId } = await createContent(
    owner1Id,
    "folder",
    null,
  );
  const { contentId: activity1cId } = await createContent(
    owner1Id,
    "singleDoc",
    folder1aId,
  );
  await updateContentFeatures({
    contentId: activity1cId,
    loggedInUserId: owner1Id,
    features,
  });
  const { contentId: activity1dId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activity1dId,
    loggedInUserId: owner1Id,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activity1dId,
    loggedInUserId: owner1Id,
    features,
  });
  await deleteContent(activity1dId, owner1Id);

  // owner 2 has two public activities
  const owner2 = await createTestUser();
  const owner2Id = owner2.userId;

  const { contentId: folder2aId } = await createContent(
    owner2Id,
    "folder",
    null,
  );
  const { contentId: activity2aId } = await createContent(
    owner2Id,
    "singleDoc",
    folder2aId,
  );
  await setContentIsPublic({
    contentId: activity2aId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activity2aId,
    loggedInUserId: owner2Id,
    features,
  });
  const { contentId: activity2bId } = await createContent(
    owner2Id,
    "singleDoc",
    folder2aId,
  );
  await setContentIsPublic({
    contentId: activity2bId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activity2bId,
    loggedInUserId: owner2Id,
    features,
  });

  // owner 3 has a activity shared with user1
  const owner3 = await createTestUser();
  const owner3Id = owner3.userId;

  const { contentId: folder3aId } = await createContent(
    owner3Id,
    "folder",
    null,
  );
  const { contentId: activity3aId } = await createContent(
    owner3Id,
    "singleDoc",
    folder3aId,
  );
  await modifyContentSharedWith({
    action: "share",
    contentId: activity3aId,
    loggedInUserId: owner3Id,
    users: [user1Id],
  });
  await updateContentFeatures({
    contentId: activity3aId,
    loggedInUserId: owner3Id,
    features,
  });

  // owner 4 has three activities shared with user2
  const owner4 = await createTestUser();
  const owner4Id = owner4.userId;

  const { contentId: folder4aId } = await createContent(
    owner4Id,
    "folder",
    null,
  );
  const { contentId: activity4aId } = await createContent(
    owner4Id,
    "singleDoc",
    folder4aId,
  );
  await modifyContentSharedWith({
    contentId: activity4aId,
    loggedInUserId: owner4Id,
    action: "share",
    users: [user2Id],
  });
  await updateContentFeatures({
    contentId: activity4aId,
    loggedInUserId: owner4Id,
    features,
  });

  const { contentId: activity4bId } = await createContent(
    owner4Id,
    "singleDoc",
    folder4aId,
  );
  await modifyContentSharedWith({
    contentId: activity4bId,
    loggedInUserId: owner4Id,
    action: "share",
    users: [user2Id],
  });
  await updateContentFeatures({
    contentId: activity4bId,
    loggedInUserId: owner4Id,
    features,
  });
  const { contentId: activity4cId } = await createContent(
    owner4Id,
    "singleDoc",
    folder4aId,
  );
  await modifyContentSharedWith({
    contentId: activity4cId,
    loggedInUserId: owner4Id,
    action: "share",
    users: [user2Id],
  });
  await updateContentFeatures({
    contentId: activity4cId,
    loggedInUserId: owner4Id,
    features,
  });

  // user1 find only owner2, owner3
  let result = await browseUsersWithSharedContent({
    loggedInUserId: user1Id,
    features: featuresSet,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(2);
  expect(isEqualUUID(result[1].userId, owner3Id)).eq(true);
  expect(result[1].numCommunity).eq(1);

  // user2 can find owner2, owner4
  result = await browseUsersWithSharedContent({
    loggedInUserId: user2Id,
    features: featuresSet,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner4Id)).eq(true);
  expect(result[0].numCommunity).eq(3);
  expect(isEqualUUID(result[1].userId, owner2Id)).eq(true);
  expect(result[1].numCommunity).eq(2);
});

test("browseUsersWithSharedContent, search, returns only users with public/shared/non-deleted content", async () => {
  const code = Date.now().toString();

  const user1 = await createTestUser();
  const user1Id = user1.userId;
  const user2 = await createTestUser();
  const user2Id = user2.userId;

  // owner 1 has only private and deleted content, and public content with different text
  const owner1 = await createTestUser();
  const owner1Id = owner1.userId;

  const { contentId: activity1aId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity1aId,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });
  const { contentId: activity1bId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity1bId,
    source: `banana${code}`,
    loggedInUserId: owner1Id,
  });
  const { contentId: folder1aId } = await createContent(
    owner1Id,
    "folder",
    null,
  );
  const { contentId: activity1cId } = await createContent(
    owner1Id,
    "singleDoc",
    folder1aId,
  );
  await updateContent({
    contentId: activity1cId,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });

  const { contentId: activity1dId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity1dId,
    source: `banana${code}`,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activity1dId,
    loggedInUserId: owner1Id,
    isPublic: true,
  });
  await deleteContent(activity1dId, owner1Id);

  const { contentId: activity1eId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity1eId,
    source: `grape${code}`,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activity1eId,
    loggedInUserId: owner1Id,
    isPublic: true,
  });

  // owner 2 has two public activities, plus third with different text
  const owner2 = await createTestUser();
  const owner2Id = owner2.userId;

  const { contentId: folder2aId } = await createContent(
    owner2Id,
    "folder",
    null,
  );
  const { contentId: activity2aId } = await createContent(
    owner2Id,
    "singleDoc",
    folder2aId,
  );
  await updateContent({
    contentId: activity2aId,
    name: `banana${code}`,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activity2aId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });
  const { contentId: activity2bId } = await createContent(
    owner2Id,
    "singleDoc",
    folder2aId,
  );
  await updateContent({
    contentId: activity2bId,
    source: `banana${code}`,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activity2bId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });

  const { contentId: activity2cId } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity2cId,
    source: `grape${code}`,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activity2cId,
    loggedInUserId: owner2Id,
    isPublic: true,
  });

  // owner 3 has a activity shared with user1, plus public with different text
  const owner3 = await createTestUser();
  const owner3Id = owner3.userId;

  const { contentId: folder3aId } = await createContent(
    owner3Id,
    "folder",
    null,
  );
  const { contentId: activity3aId } = await createContent(
    owner3Id,
    "singleDoc",
    folder3aId,
  );
  await updateContent({
    contentId: activity3aId,
    name: `banana${code}`,
    loggedInUserId: owner3Id,
  });
  await modifyContentSharedWith({
    contentId: activity3aId,
    loggedInUserId: owner3Id,
    action: "share",
    users: [user1Id],
  });

  const { contentId: activity3bId } = await createContent(
    owner3Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity3bId,
    name: `grape${code}`,
    loggedInUserId: owner3Id,
  });
  await setContentIsPublic({
    contentId: activity3bId,
    loggedInUserId: owner3Id,
    isPublic: true,
  });

  // owner 4 has three activities shared with user2, plus public content with different text
  const owner4 = await createTestUser();
  const owner4Id = owner4.userId;

  const { contentId: folder4aId } = await createContent(
    owner4Id,
    "folder",
    null,
  );
  const { contentId: activity4aId } = await createContent(
    owner4Id,
    "singleDoc",
    folder4aId,
  );
  await updateContent({
    contentId: activity4aId,
    name: `banana${code}`,
    loggedInUserId: owner4Id,
  });
  await modifyContentSharedWith({
    contentId: activity4aId,
    loggedInUserId: owner4Id,
    action: "share",
    users: [user2Id],
  });

  const { contentId: activity4bId } = await createContent(
    owner4Id,
    "singleDoc",
    folder4aId,
  );
  await updateContent({
    contentId: activity4bId,
    source: `banana${code}`,
    loggedInUserId: owner4Id,
  });
  await modifyContentSharedWith({
    contentId: activity4bId,
    loggedInUserId: owner4Id,
    action: "share",
    users: [user2Id],
  });
  const { contentId: activity4cId } = await createContent(
    owner4Id,
    "singleDoc",
    folder4aId,
  );
  await updateContent({
    contentId: activity4cId,
    name: `banana${code}`,
    loggedInUserId: owner4Id,
  });
  await modifyContentSharedWith({
    contentId: activity4cId,
    loggedInUserId: owner4Id,
    action: "share",
    users: [user2Id],
  });
  const { contentId: activity4dId } = await createContent(
    owner4Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity4dId,
    name: `grape${code}`,
    loggedInUserId: owner4Id,
  });
  await setContentIsPublic({
    contentId: activity4dId,
    loggedInUserId: owner4Id,
    isPublic: true,
  });

  // user1 find only owner2, owner3
  let result = await browseUsersWithSharedContent({
    loggedInUserId: user1Id,
    query: `banana${code}`,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(2);
  expect(isEqualUUID(result[1].userId, owner3Id)).eq(true);
  expect(result[1].numCommunity).eq(1);

  // user2 can find owner2, owner4
  result = await browseUsersWithSharedContent({
    loggedInUserId: user2Id,
    query: `banana${code}`,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner4Id)).eq(true);
  expect(result[0].numCommunity).eq(3);
  expect(isEqualUUID(result[1].userId, owner2Id)).eq(true);
  expect(result[1].numCommunity).eq(2);
});

test("browseUsersWithSharedContent, filter by system, category, sub category, classification", async () => {
  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

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
  const { contentId: activity1aId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  const { contentId: activity1bId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity1aId,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });
  await updateContent({
    contentId: activity1bId,
    name: `grape${code}`,
    loggedInUserId: owner1Id,
  });
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

  // owner 2 has content in classification A1A
  const { userId: owner2Id } = await createTestUser();
  const { contentId: activity2aId } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  const { contentId: activity2bId } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity2aId,
    name: `grape${code}`,
    loggedInUserId: owner2Id,
  });
  await updateContent({
    contentId: activity2bId,
    name: `grape${code}`,
    loggedInUserId: owner2Id,
  });
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
  await addClassification(activity2aId, classificationIdA1A, owner2Id);
  await addClassification(activity2bId, classificationIdA1A, owner2Id);

  // owner 3 has a content in classification B2B and unclassified content
  const { userId: owner3Id } = await createTestUser();
  const { contentId: activity3aId } = await createContent(
    owner3Id,
    "singleDoc",
    null,
  );
  const { contentId: activity3bId } = await createContent(
    owner3Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity3aId,
    name: `grape${code}`,
    loggedInUserId: owner3Id,
  });
  await updateContent({
    contentId: activity3bId,
    name: `grape${code}`,
    loggedInUserId: owner3Id,
  });
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
  await addClassification(activity3aId, classificationIdB2B, owner3Id);

  // owner 4 has content in classification A1A and A1B
  const { userId: owner4Id } = await createTestUser();
  const { contentId: activity4aId } = await createContent(
    owner4Id,
    "singleDoc",
    null,
  );
  const { contentId: activity4bId } = await createContent(
    owner4Id,
    "singleDoc",
    null,
  );
  const { contentId: activity4cId } = await createContent(
    owner4Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity4aId,
    name: `banana${code}`,
    loggedInUserId: owner4Id,
  });
  await updateContent({
    contentId: activity4bId,
    name: `banana${code}`,
    loggedInUserId: owner4Id,
  });
  await updateContent({
    contentId: activity4cId,
    name: `banana${code}`,
    loggedInUserId: owner4Id,
  });
  await setContentIsPublic({
    contentId: activity4aId,
    loggedInUserId: owner4Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity4bId,
    loggedInUserId: owner4Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity4cId,
    loggedInUserId: owner4Id,
    isPublic: true,
  });
  await addClassification(activity4aId, classificationIdA1A, owner4Id);
  await addClassification(activity4bId, classificationIdA1B, owner4Id);
  await addClassification(activity4cId, classificationIdA1B, owner4Id);

  // owner 5 has content in classification A1B, B2B
  const { userId: owner5Id } = await createTestUser();
  const { contentId: activity5aId } = await createContent(
    owner5Id,
    "singleDoc",
    null,
  );
  const { contentId: activity5bId } = await createContent(
    owner5Id,
    "singleDoc",
    null,
  );
  const { contentId: activity5cId } = await createContent(
    owner5Id,
    "singleDoc",
    null,
  );
  const { contentId: activity5dId } = await createContent(
    owner5Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity5aId,
    name: `grape${code}`,
    loggedInUserId: owner5Id,
  });
  await updateContent({
    contentId: activity5bId,
    name: `grape${code}`,
    loggedInUserId: owner5Id,
  });
  await updateContent({
    contentId: activity5cId,
    name: `banana${code}`,
    loggedInUserId: owner5Id,
  });
  await updateContent({
    contentId: activity5dId,
    name: `grape${code}`,
    loggedInUserId: owner5Id,
  });
  await setContentIsPublic({
    contentId: activity5aId,
    loggedInUserId: owner5Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity5bId,
    loggedInUserId: owner5Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity5cId,
    loggedInUserId: owner5Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity5dId,
    loggedInUserId: owner5Id,
    isPublic: true,
  });
  await addClassification(activity5aId, classificationIdA1B, owner5Id);
  await addClassification(activity5bId, classificationIdB2B, owner5Id);
  await addClassification(activity5cId, classificationIdB2B, owner5Id);
  await addClassification(activity5dId, classificationIdB2B, owner5Id);

  // owner 6 has content in classification A2A, A2B, and B2B
  const { userId: owner6Id } = await createTestUser();
  const { contentId: activity6aId } = await createContent(
    owner6Id,
    "singleDoc",
    null,
  );
  const { contentId: activity6bId } = await createContent(
    owner6Id,
    "singleDoc",
    null,
  );
  const { contentId: activity6cId } = await createContent(
    owner6Id,
    "singleDoc",
    null,
  );
  const { contentId: activity6dId } = await createContent(
    owner6Id,
    "singleDoc",
    null,
  );
  const { contentId: activity6eId } = await createContent(
    owner6Id,
    "singleDoc",
    null,
  );
  const { contentId: activity6fId } = await createContent(
    owner6Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity6aId,
    name: `banana${code}`,
    loggedInUserId: owner6Id,
  });
  await updateContent({
    contentId: activity6bId,
    name: `grape${code}`,
    loggedInUserId: owner6Id,
  });
  await updateContent({
    contentId: activity6cId,
    name: `banana${code}`,
    loggedInUserId: owner6Id,
  });
  await updateContent({
    contentId: activity6dId,
    name: `grape${code}`,
    loggedInUserId: owner6Id,
  });
  await updateContent({
    contentId: activity6eId,
    name: `banana${code}`,
    loggedInUserId: owner6Id,
  });
  await updateContent({
    contentId: activity6fId,
    name: `banana${code}`,
    loggedInUserId: owner6Id,
  });
  await setContentIsPublic({
    contentId: activity6aId,
    loggedInUserId: owner6Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity6bId,
    loggedInUserId: owner6Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity6cId,
    loggedInUserId: owner6Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity6dId,
    loggedInUserId: owner6Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity6eId,
    loggedInUserId: owner6Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity6fId,
    loggedInUserId: owner6Id,
    isPublic: true,
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
  const { contentId: activity7aId } = await createContent(
    owner7Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity7aId,
    name: `banana${code}`,
    loggedInUserId: owner7Id,
  });
  await setContentIsPublic({
    contentId: activity7aId,
    loggedInUserId: owner7Id,
    isPublic: true,
  });
  await addClassification(activity7aId, outsideClassificationId, owner7Id);

  // owners 2, 3, 4, 5, 6 have content classified in systemId
  let result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    systemId,
  });
  expect(result.length).eq(5);
  expect(isEqualUUID(result[0].userId, owner6Id)).eq(true);
  expect(result[0].numCommunity).eq(6);
  expect(isEqualUUID(result[1].userId, owner5Id)).eq(true);
  expect(result[1].numCommunity).eq(4);
  expect(isEqualUUID(result[2].userId, owner4Id)).eq(true);
  expect(result[2].numCommunity).eq(3);
  expect(isEqualUUID(result[3].userId, owner2Id)).eq(true);
  expect(result[3].numCommunity).eq(2);
  expect(isEqualUUID(result[4].userId, owner3Id)).eq(true);
  expect(result[4].numCommunity).eq(1);

  // owners 2, 4, 5, 6 have content classified in category A
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(result.length).eq(4);
  expect(isEqualUUID(result[0].userId, owner6Id)).eq(true);
  expect(result[0].numCommunity).eq(4);
  expect(isEqualUUID(result[1].userId, owner4Id)).eq(true);
  expect(result[1].numCommunity).eq(3);
  expect(isEqualUUID(result[2].userId, owner2Id)).eq(true);
  expect(result[2].numCommunity).eq(2);
  expect(isEqualUUID(result[3].userId, owner5Id)).eq(true);
  expect(result[3].numCommunity).eq(1);

  // owners 3, 5, 6 have content classified in category B
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdB,
  });
  expect(result.length).eq(3);
  expect(isEqualUUID(result[0].userId, owner5Id)).eq(true);
  expect(result[0].numCommunity).eq(3);
  expect(isEqualUUID(result[1].userId, owner6Id)).eq(true);
  expect(result[1].numCommunity).eq(2);
  expect(isEqualUUID(result[2].userId, owner3Id)).eq(true);
  expect(result[2].numCommunity).eq(1);

  // owners 2, 4, 5 have content classified in subcategory A1
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(result.length).eq(3);
  expect(isEqualUUID(result[0].userId, owner4Id)).eq(true);
  expect(result[0].numCommunity).eq(3);
  expect(isEqualUUID(result[1].userId, owner2Id)).eq(true);
  expect(result[1].numCommunity).eq(2);
  expect(isEqualUUID(result[2].userId, owner5Id)).eq(true);
  expect(result[2].numCommunity).eq(1);

  // owners 2, 4 have content classified in classification A1A
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(2);
  expect(isEqualUUID(result[1].userId, owner4Id)).eq(true);
  expect(result[1].numCommunity).eq(1);

  // owners 4, 5 have content classified in classification A1B
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1B,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner4Id)).eq(true);
  expect(result[0].numCommunity).eq(2);
  expect(isEqualUUID(result[1].userId, owner5Id)).eq(true);
  expect(result[1].numCommunity).eq(1);

  // now add search

  // owners 4, 5, 6 have content classified in systemId
  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId,
  });
  expect(result.length).eq(3);
  expect(isEqualUUID(result[0].userId, owner6Id)).eq(true);
  expect(result[0].numCommunity).eq(4);
  expect(isEqualUUID(result[1].userId, owner4Id)).eq(true);
  expect(result[1].numCommunity).eq(3);
  expect(isEqualUUID(result[2].userId, owner5Id)).eq(true);
  expect(result[2].numCommunity).eq(1);

  // owners 4, 6 have content classified in category A
  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner4Id)).eq(true);
  expect(result[0].numCommunity).eq(3);
  expect(isEqualUUID(result[1].userId, owner6Id)).eq(true);
  expect(result[1].numCommunity).eq(2);

  // owners  5, 6 have content classified in category B
  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdB,
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner6Id)).eq(true);
  expect(result[0].numCommunity).eq(2);
  expect(isEqualUUID(result[1].userId, owner5Id)).eq(true);
  expect(result[1].numCommunity).eq(1);

  // owners 4 has content classified in subcategory A1
  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner4Id)).eq(true);
  expect(result[0].numCommunity).eq(3);

  // owners 4 has content classified in classification A1A
  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner4Id)).eq(true);
  expect(result[0].numCommunity).eq(1);

  // owners 4 have content classified in classification A1B
  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    classificationId: classificationIdA1B,
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner4Id)).eq(true);
  expect(result[0].numCommunity).eq(2);
});

test("browseUsersWithSharedContent, filter by activity feature", async () => {
  // add three test features
  const code = Date.now().toString();
  const feature1Code = (await createTestFeature({ word: "a", code })).code;
  const feature2Code = (await createTestFeature({ word: "b", code })).code;
  const feature3Code = (await createTestFeature({ word: "c", code })).code;

  const { userId } = await createTestUser();

  // owner 1 has only content without features and feature1
  const { userId: owner1Id } = await createTestUser();
  const { contentId: activity1aId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  const { contentId: activity1bId } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity1aId,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });
  await updateContent({
    contentId: activity1bId,
    name: `grape${code}`,
    loggedInUserId: owner1Id,
  });
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
    features: { [feature1Code]: true },
  });

  // owner 2 has content combinations of two features
  const { userId: owner2Id } = await createTestUser();
  const { contentId: activity2aId } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  const { contentId: activity2bId } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  const { contentId: activity2cId } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity2aId,
    name: `banana${code}`,
    loggedInUserId: owner2Id,
  });
  await updateContent({
    contentId: activity2bId,
    name: `grape${code}`,
    loggedInUserId: owner2Id,
  });
  await updateContent({
    contentId: activity2cId,
    name: `banana${code}`,
    loggedInUserId: owner2Id,
  });
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
    features: { [feature1Code]: true, [feature2Code]: true },
  });
  await updateContentFeatures({
    contentId: activity2bId,
    loggedInUserId: owner2Id,
    features: { [feature1Code]: true, [feature3Code]: true },
  });
  await updateContentFeatures({
    contentId: activity2cId,
    loggedInUserId: owner2Id,
    features: { [feature3Code]: true, [feature2Code]: true },
  });

  // owner 3 has one content with feature 2 and and three with feature 3
  const { userId: owner3Id } = await createTestUser();

  const { contentId: activity3aId } = await createContent(
    owner3Id,
    "singleDoc",
    null,
  );
  const { contentId: activity3bId } = await createContent(
    owner3Id,
    "singleDoc",
    null,
  );
  const { contentId: activity3cId } = await createContent(
    owner3Id,
    "singleDoc",
    null,
  );
  const { contentId: activity3dId } = await createContent(
    owner3Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activity3aId,
    name: `banana${code}`,
    loggedInUserId: owner3Id,
  });
  await updateContent({
    contentId: activity3bId,
    name: `banana${code}`,
    loggedInUserId: owner3Id,
  });
  await updateContent({
    contentId: activity3cId,
    name: `grape${code}`,
    loggedInUserId: owner3Id,
  });
  await updateContent({
    contentId: activity3dId,
    name: `banana${code}`,
    loggedInUserId: owner3Id,
  });
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
  await setContentIsPublic({
    contentId: activity3cId,
    loggedInUserId: owner3Id,
    isPublic: true,
  });
  await setContentIsPublic({
    contentId: activity3dId,
    loggedInUserId: owner3Id,
    isPublic: true,
  });
  await updateContentFeatures({
    contentId: activity3aId,
    loggedInUserId: owner3Id,
    features: { [feature2Code]: true },
  });
  await updateContentFeatures({
    contentId: activity3bId,
    loggedInUserId: owner3Id,
    features: { [feature3Code]: true },
  });
  await updateContentFeatures({
    contentId: activity3cId,
    loggedInUserId: owner3Id,
    features: { [feature3Code]: true },
  });
  await updateContentFeatures({
    contentId: activity3dId,
    loggedInUserId: owner3Id,
    features: { [feature3Code]: true },
  });

  // owners 1 and 2 have feature1
  let result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: new Set([feature1Code]),
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(2);
  expect(isEqualUUID(result[1].userId, owner1Id)).eq(true);
  expect(result[1].numCommunity).eq(1);

  // owners 2 and 3 have feature2
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: new Set([feature2Code]),
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(2);
  expect(isEqualUUID(result[1].userId, owner3Id)).eq(true);
  expect(result[1].numCommunity).eq(1);

  // owners 2 and 3 have feature3
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: new Set([feature3Code]),
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner3Id)).eq(true);
  expect(result[0].numCommunity).eq(3);
  expect(isEqualUUID(result[1].userId, owner2Id)).eq(true);
  expect(result[1].numCommunity).eq(2);

  // owners 2 has combinations of two features
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: new Set([feature1Code, feature2Code]),
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(1);

  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: new Set([feature1Code, feature3Code]),
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(1);

  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: new Set([feature3Code, feature2Code]),
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(1);

  // no one has all three features
  result = await browseUsersWithSharedContent({
    loggedInUserId: userId,
    features: new Set([feature3Code, feature2Code, feature1Code]),
  });
  expect(result.length).eq(0);

  // now combine with search

  // owner 2 has feature1
  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    features: new Set([feature1Code]),
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(1);

  // owners 2 and 3 have feature2
  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    features: new Set([feature2Code]),
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(2);
  expect(isEqualUUID(result[1].userId, owner3Id)).eq(true);
  expect(result[1].numCommunity).eq(1);

  // owners 2 and 3 have feature3
  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    features: new Set([feature3Code]),
  });
  expect(result.length).eq(2);
  expect(isEqualUUID(result[0].userId, owner3Id)).eq(true);
  expect(result[0].numCommunity).eq(2);
  expect(isEqualUUID(result[1].userId, owner2Id)).eq(true);
  expect(result[1].numCommunity).eq(1);

  // owners 2 has most combinations of two features
  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    features: new Set([feature1Code, feature2Code]),
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(1);

  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    features: new Set([feature1Code, feature3Code]),
  });
  expect(result.length).eq(0);

  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    features: new Set([feature3Code, feature2Code]),
  });
  expect(result.length).eq(1);
  expect(isEqualUUID(result[0].userId, owner2Id)).eq(true);
  expect(result[0].numCommunity).eq(1);

  // no one has all three features
  result = await browseUsersWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    features: new Set([feature3Code, feature2Code, feature1Code]),
  });
  expect(result.length).eq(0);
});

test("browseClassificationSharedContent, returns only public/shared/non-deleted content", async () => {
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();
  const { userId: ownerId } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const systemId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].descriptions[0].subCategory.category.system.id;

  const { classificationIdA1A } = await createTestClassifications({
    systemId,
    word,
    code,
  });

  // add public, shared, private activities to A1A
  const { contentId: activityIdPublic1 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPublic2 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdShared } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPrivate } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdDeleted } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

  const activityIdPublic1String = fromUUID(activityIdPublic1);
  const activityIdPublic2String = fromUUID(activityIdPublic2);
  const activityIdSharedString = fromUUID(activityIdShared);

  await setContentIsPublic({
    contentId: activityIdPublic1,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdPublic2,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdShared,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await setContentIsPublic({
    contentId: activityIdDeleted,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdPublic1, classificationIdA1A, ownerId);
  await addClassification(activityIdPublic2, classificationIdA1A, ownerId);
  await addClassification(activityIdShared, classificationIdA1A, ownerId);
  await addClassification(activityIdPrivate, classificationIdA1A, ownerId);
  await addClassification(activityIdDeleted, classificationIdA1A, ownerId);
  await deleteContent(activityIdDeleted, ownerId);

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

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const systemId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].descriptions[0].subCategory.category.system.id;

  const { classificationIdA1A } = await createTestClassifications({
    systemId,
    word,
    code,
  });

  // add activities to A1A with different combinations of features
  const { contentId: activityIdN } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQ } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdI } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdV } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQI } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQV } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdIV } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQIV } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

  const activityIdNString = fromUUID(activityIdN);
  const activityIdQString = fromUUID(activityIdQ);
  const activityIdIString = fromUUID(activityIdI);
  const activityIdVString = fromUUID(activityIdV);
  const activityIdQIString = fromUUID(activityIdQI);
  const activityIdQVString = fromUUID(activityIdQV);
  const activityIdIVString = fromUUID(activityIdIV);
  const activityIdQIVString = fromUUID(activityIdQIV);

  await setContentIsPublic({
    contentId: activityIdN,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQ,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdI,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdV,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQI,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQV,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdIV,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQIV,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdN, classificationIdA1A, ownerId);
  await addClassification(activityIdQ, classificationIdA1A, ownerId);
  await addClassification(activityIdI, classificationIdA1A, ownerId);
  await addClassification(activityIdV, classificationIdA1A, ownerId);
  await addClassification(activityIdQI, classificationIdA1A, ownerId);
  await addClassification(activityIdQV, classificationIdA1A, ownerId);
  await addClassification(activityIdIV, classificationIdA1A, ownerId);
  await addClassification(activityIdQIV, classificationIdA1A, ownerId);

  await updateContentFeatures({
    contentId: activityIdQ,
    loggedInUserId: ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    contentId: activityIdI,
    loggedInUserId: ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdV,
    loggedInUserId: ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdQI,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdQV,
    loggedInUserId: ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdIV,
    loggedInUserId: ownerId,
    features: { isInteractive: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdQIV,
    loggedInUserId: ownerId,
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
    features: new Set(["isQuestion"]),
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
    features: new Set(["isInteractive"]),
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
    features: new Set(["containsVideo"]),
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
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(results.content.length).eq(2);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [activityIdQIString, activityIdQIVString].sort(),
  );

  results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(results.content.length).eq(2);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [activityIdQVString, activityIdQIVString].sort(),
  );

  results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(results.content.length).eq(2);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [activityIdIVString, activityIdQIVString].sort(),
  );
});

test("browseClassificationSharedContent, filter by owner", async () => {
  const { userId: userId } = await createTestUser();
  const { userId: owner1Id } = await createTestUser();
  const { userId: owner2Id } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const systemId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].descriptions[0].subCategory.category.system.id;

  const { classificationIdA1A } = await createTestClassifications({
    systemId,
    word,
    code,
  });

  // add activities to A1A with both owners
  const { contentId: activityId1a } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  const { contentId: activityId1b } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  const { contentId: activityId2 } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );

  const activityId1aString = fromUUID(activityId1a);
  const activityId1bString = fromUUID(activityId1b);
  const activityId2String = fromUUID(activityId2);

  await setContentIsPublic({
    contentId: activityId1a,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId1b,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId2,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await addClassification(activityId1a, classificationIdA1A, owner1Id);
  await addClassification(activityId1b, classificationIdA1A, owner1Id);
  await addClassification(activityId2, classificationIdA1A, owner2Id);

  // get all with no filter
  let results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
  });
  expect(results.content.length).eq(3);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [activityId1aString, activityId1bString, activityId2String].sort(),
  );

  // filter by owner 1
  results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
    ownerId: owner1Id,
  });
  expect(results.content.length).eq(2);
  expect(results.content.map((c) => fromUUID(c.id)).sort()).eqls(
    [activityId1aString, activityId1bString].sort(),
  );

  // filter by owner 2
  results = await browseClassificationSharedContent({
    loggedInUserId: userId,
    classificationId: classificationIdA1A,
    ownerId: owner2Id,
  });
  expect(results.content.length).eq(1);
  expect(isEqualUUID(results.content[0].id, activityId2)).eq(true);
});

test("browseSubCategorySharedContent, returns only public/shared/non-deleted content and classifications", async () => {
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();
  const { userId: ownerId } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

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
  const { contentId: activityIdPublicA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdSharedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPrivateA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdDeletedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPublicB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdSharedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPrivateB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdDeletedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

  const activityIdPublicAString = fromUUID(activityIdPublicA);
  const activityIdSharedAString = fromUUID(activityIdSharedA);
  const activityIdPublicBString = fromUUID(activityIdPublicB);
  const activityIdSharedBString = fromUUID(activityIdSharedB);

  await setContentIsPublic({
    contentId: activityIdPublicA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdPublicB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedA,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedB,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await setContentIsPublic({
    contentId: activityIdDeletedA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdDeletedB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdPublicA, classificationIdA1A, ownerId);
  await addClassification(activityIdSharedA, classificationIdA1A, ownerId);
  await addClassification(activityIdPrivateA, classificationIdA1A, ownerId);
  await addClassification(activityIdDeletedA, classificationIdA1A, ownerId);
  await addClassification(activityIdPublicB, classificationIdA1B, ownerId);
  await addClassification(activityIdSharedB, classificationIdA1B, ownerId);
  await addClassification(activityIdPrivateB, classificationIdA1B, ownerId);
  await addClassification(activityIdDeletedB, classificationIdA1B, ownerId);
  await deleteContent(activityIdDeletedA, ownerId);
  await deleteContent(activityIdDeletedB, ownerId);

  // user1 gets public and shared content
  let results = await browseClassificationSubCategorySharedContent({
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
  results = await browseClassificationSubCategorySharedContent({
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
  await deleteContent(activityIdPublicA, ownerId);

  // user1 gets public and shared content
  results = await browseClassificationSubCategorySharedContent({
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
  results = await browseClassificationSubCategorySharedContent({
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

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const systemId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].descriptions[0].subCategory.category.system.id;

  const { subCategoryIdA1, classificationIdA1A, classificationIdA1B } =
    await createTestClassifications({
      systemId,
      word,
      code,
    });

  // add activities with different features to A1A and A1B
  const { contentId: activityIdNA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdIA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdVA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQIA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQVA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdIVA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQIVA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdNB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdIB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdVB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQIB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQVB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdIVB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQIVB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

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

  await setContentIsPublic({
    contentId: activityIdNA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdIA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdVA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQIA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQVA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdIVA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQIVA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdNB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdIB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdVB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQIB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQVB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdIVB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQIVB,
    isPublic: true,
    loggedInUserId: ownerId,
  });

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
    contentId: activityIdQA,
    loggedInUserId: ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    contentId: activityIdIA,
    loggedInUserId: ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdVA,
    loggedInUserId: ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdQIA,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdQVA,
    loggedInUserId: ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdIVA,
    loggedInUserId: ownerId,
    features: { isInteractive: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdQIVA,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  await updateContentFeatures({
    contentId: activityIdQB,
    loggedInUserId: ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    contentId: activityIdIB,
    loggedInUserId: ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdVB,
    loggedInUserId: ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdQIB,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdQVB,
    loggedInUserId: ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdIVB,
    loggedInUserId: ownerId,
    features: { isInteractive: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdQIVB,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  // no filter, get everything
  let results = await browseClassificationSubCategorySharedContent({
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
  results = await browseClassificationSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isQuestion"]),
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
  results = await browseClassificationSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isInteractive"]),
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
  results = await browseClassificationSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["containsVideo"]),
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
  results = await browseClassificationSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isQuestion", "isInteractive"]),
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
  results = await browseClassificationSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isQuestion", "containsVideo"]),
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
  results = await browseClassificationSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isInteractive", "containsVideo"]),
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
  results = await browseClassificationSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
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

test("browseSubCategorySharedContent, filter by owner", async () => {
  const { userId } = await createTestUser();
  const { userId: owner1Id } = await createTestUser();
  const { userId: owner2Id } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const { subCategoryIdA1, classificationIdA1A, classificationIdA1B } =
    await createTestClassifications({
      word,
      code,
    });

  // add activities with different owners to A1A and A1B
  const { contentId: activityId1A } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  const { contentId: activityId2A } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  const { contentId: activityId1B } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  const { contentId: activityId2B } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );

  const activityId1AString = fromUUID(activityId1A);
  const activityId2AString = fromUUID(activityId2A);
  const activityId1BString = fromUUID(activityId1B);
  const activityId2BString = fromUUID(activityId2B);

  await setContentIsPublic({
    contentId: activityId1A,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId2A,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityId1B,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId2B,
    isPublic: true,
    loggedInUserId: owner2Id,
  });

  await addClassification(activityId1A, classificationIdA1A, owner1Id);
  await addClassification(activityId2A, classificationIdA1A, owner2Id);
  await addClassification(activityId1B, classificationIdA1B, owner1Id);
  await addClassification(activityId2B, classificationIdA1B, owner2Id);

  // no filter, get everything
  let results = await browseClassificationSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(2);
  expect(
    results.classifications[0].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityId1AString, activityId2AString].sort());
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(2);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityId1BString, activityId2BString].sort());

  // filter by owner 1
  results = await browseClassificationSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    ownerId: owner1Id,
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(1);
  expect(
    results.classifications[0].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityId1AString].sort());
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(1);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityId1BString].sort());

  // filter by owner 2
  results = await browseClassificationSubCategorySharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    ownerId: owner2Id,
  });
  expect(results.classifications.length).eq(2);
  expect(results.classifications[0].classificationId).eq(classificationIdA1A);
  expect(results.classifications[0].content.length).eq(1);
  expect(
    results.classifications[0].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityId2AString].sort());
  expect(results.classifications[1].classificationId).eq(classificationIdA1B);
  expect(results.classifications[1].content.length).eq(1);
  expect(
    results.classifications[1].content.map((c) => fromUUID(c.id)).sort(),
  ).eqls([activityId2BString].sort());
});

test("browseCategorySharedContent, returns only public/shared/non-deleted content and classifications", async () => {
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();
  const { userId: ownerId } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

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
  const { contentId: activityIdPublicA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdSharedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPrivateA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdDeletedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPublicB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdSharedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPrivateB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdDeletedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

  const activityIdPublicAString = fromUUID(activityIdPublicA);
  const activityIdSharedAString = fromUUID(activityIdSharedA);
  const activityIdPublicBString = fromUUID(activityIdPublicB);
  const activityIdSharedBString = fromUUID(activityIdSharedB);

  await setContentIsPublic({
    contentId: activityIdPublicA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdPublicB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedA,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedB,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await setContentIsPublic({
    contentId: activityIdDeletedA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdDeletedB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
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
  await deleteContent(activityIdDeletedA, ownerId);
  await deleteContent(activityIdDeletedB, ownerId);

  // user1 gets public and shared content and their subCategories/classifications
  let results = await browseClassificationCategorySharedContent({
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
  results = await browseClassificationCategorySharedContent({
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

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    subCategoryIdA2,
    classificationIdA2B,
  } = await createTestClassifications({
    word,
    code,
  });

  // add activities with different features to A1A and A2B
  const { contentId: activityIdNA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdIA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdVA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQIA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQVA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdIVA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQIVA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdNB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdIB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdVB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQIB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQVB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdIVB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdQIVB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

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

  await setContentIsPublic({
    contentId: activityIdNA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdIA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdVA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQIA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQVA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdIVA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQIVA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdNB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdIB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdVB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQIB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQVB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdIVB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQIVB,
    isPublic: true,
    loggedInUserId: ownerId,
  });

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
    contentId: activityIdQA,
    loggedInUserId: ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    contentId: activityIdIA,
    loggedInUserId: ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdVA,
    loggedInUserId: ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdQIA,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdQVA,
    loggedInUserId: ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdIVA,
    loggedInUserId: ownerId,
    features: { isInteractive: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdQIVA,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  await updateContentFeatures({
    contentId: activityIdQB,
    loggedInUserId: ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    contentId: activityIdIB,
    loggedInUserId: ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdVB,
    loggedInUserId: ownerId,
    features: { containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdQIB,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdQVB,
    loggedInUserId: ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdIVB,
    loggedInUserId: ownerId,
    features: { isInteractive: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdQIVB,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true, containsVideo: true },
  });

  // no filter, get everything
  let results = await browseClassificationCategorySharedContent({
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
  results = await browseClassificationCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isQuestion"]),
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
  results = await browseClassificationCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isInteractive"]),
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
  results = await browseClassificationCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["containsVideo"]),
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
  results = await browseClassificationCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isQuestion", "isInteractive"]),
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
  results = await browseClassificationCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isQuestion", "containsVideo"]),
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
  results = await browseClassificationCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isInteractive", "containsVideo"]),
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
  results = await browseClassificationCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
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

test("browseCategorySharedContent, filter by owner", async () => {
  const { userId } = await createTestUser();
  const { userId: owner1Id } = await createTestUser();
  const { userId: owner2Id } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    subCategoryIdA2,
    classificationIdA2B,
  } = await createTestClassifications({
    word,
    code,
  });

  // add activities with different owners to A1A and A2B
  const { contentId: activityId1A } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  const { contentId: activityId2A } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  const { contentId: activityId1B } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  const { contentId: activityId2B } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );

  const activityId1AString = fromUUID(activityId1A);
  const activityId2AString = fromUUID(activityId2A);
  const activityId1BString = fromUUID(activityId1B);
  const activityId2BString = fromUUID(activityId2B);

  await setContentIsPublic({
    contentId: activityId1A,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId2A,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityId1B,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId2B,
    isPublic: true,
    loggedInUserId: owner2Id,
  });

  await addClassification(activityId1A, classificationIdA1A, owner1Id);
  await addClassification(activityId2A, classificationIdA1A, owner2Id);
  await addClassification(activityId1B, classificationIdA2B, owner1Id);
  await addClassification(activityId2B, classificationIdA2B, owner2Id);

  // no filter, get everything
  let results = await browseClassificationCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
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
  ).eqls([activityId1AString, activityId2AString].sort());

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
  ).eqls([activityId1BString, activityId2BString].sort());

  // filter by owner 1
  results = await browseClassificationCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    ownerId: owner1Id,
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
  ).eqls([activityId1AString].sort());

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
  ).eqls([activityId1BString].sort());

  // filter by owner 2
  results = await browseClassificationCategorySharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    ownerId: owner2Id,
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
  ).eqls([activityId2AString].sort());

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
  ).eqls([activityId2BString].sort());
});

test("browse classification and subcategories with shared content, returns only classifications with public/shared/non-deleted content and classifications", async () => {
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();
  const { userId: ownerId } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    classificationIdA1B,
    subCategoryIdA2,
    classificationIdA2A,
    classificationIdA2B,
  } = await createTestClassifications({
    word,
    code,
  });

  // add shared, private activities to A1A (one shared in both A1A and A1B)
  // add public, shared, private activities to A1B
  const { contentId: activityIdSharedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPrivateA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdDeletedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPublicB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdSharedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPrivateB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdDeletedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

  await setContentIsPublic({
    contentId: activityIdPublicB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedA,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedB,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await setContentIsPublic({
    contentId: activityIdDeletedA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdDeletedB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdSharedA, classificationIdA1A, ownerId);
  await addClassification(activityIdSharedA, classificationIdA1B, ownerId);
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
  await deleteContent(activityIdDeletedA, ownerId);
  await deleteContent(activityIdDeletedB, ownerId);

  // user 1 gets the classifications with shared and public activities
  // Note: one activity is counted in both A1A and A1B
  // (there are only three activities total)
  let resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId1,
    subCategoryId: subCategoryIdA1,
  });

  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[1].numCommunity).eq(3);

  // user 2 gets the classification with public activities
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId2,
    subCategoryId: subCategoryIdA1,
  });

  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[0].numCommunity).eq(1);

  // user 1 gets the classification with shared activities
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId1,
    subCategoryId: subCategoryIdA2,
  });

  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2B);
  expect(resultsClass[0].numCommunity).eq(1);

  // user 2 doesn't get anything in A2
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId2,
    subCategoryId: subCategoryIdA2,
  });

  expect(resultsClass.length).eq(0);

  // user 1 gets the subcategories with shared and public activities
  // Note: even though an activity counted in both A1A and A1B
  // (leading to a count of 1 in A1A and a count of 3 in A1B)
  // the total in A1 is still 3 (that activity is not counted twice)
  let resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId1,
    categoryId: categoryIdA,
  });

  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(3);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(1);

  // user 2 gets the subcategory with public activities
  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId2,
    categoryId: categoryIdA,
  });

  expect(resultsSubcat.length).eq(1);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(1);
});

test("browse classification and subcategories with shared content, search, returns only classifications with public/shared/non-deleted content and classifications", async () => {
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();
  const { userId: ownerId } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    classificationIdA1B,
    subCategoryIdA2,
    classificationIdA2A,
    classificationIdA2B,
  } = await createTestClassifications({
    word,
    code,
  });

  // add shared, private activities to A1A (one shared in both A1A and A1B)
  // add public, shared, private activities to A1B
  const { contentId: activityIdSharedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdSharedA,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdPrivateA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdPrivateA,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdDeletedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdDeletedA,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdPublicB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdPublicB,
    name: `banana${code}`,
    loggedInUserId: ownerId,
  });

  const { contentId: activityIdSharedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdSharedB,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdPrivateB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdPrivateB,
    name: `banana${code}`,
    loggedInUserId: ownerId,
  });

  const { contentId: activityIdDeletedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdDeletedB,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });

  const { contentId: activityIdPublicC } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdPublicC,
    name: `grape${code}`,
    loggedInUserId: ownerId,
  });

  const { contentId: activityIdPublicD } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdPublicD,
    source: `grape${code}`,
    loggedInUserId: ownerId,
  });

  await setContentIsPublic({
    contentId: activityIdPublicB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedA,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedB,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await setContentIsPublic({
    contentId: activityIdDeletedA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdDeletedB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdPublicC,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdPublicD,
    isPublic: true,
    loggedInUserId: ownerId,
  });

  await addClassification(activityIdSharedA, classificationIdA1A, ownerId);
  await addClassification(activityIdSharedA, classificationIdA1B, ownerId);
  await addClassification(activityIdPrivateA, classificationIdA1A, ownerId);
  await addClassification(activityIdDeletedA, classificationIdA1A, ownerId);
  await addClassification(activityIdPublicC, classificationIdA1A, ownerId);
  await addClassification(activityIdPublicB, classificationIdA1B, ownerId);
  await addClassification(activityIdSharedB, classificationIdA1B, ownerId);
  await addClassification(activityIdPrivateB, classificationIdA1B, ownerId);
  await addClassification(activityIdDeletedB, classificationIdA1B, ownerId);
  await addClassification(activityIdPublicD, classificationIdA1B, ownerId);

  // add the private and deleted activities, and public activities with different text, to A2A and A2B
  await addClassification(activityIdPrivateA, classificationIdA2A, ownerId);
  await addClassification(activityIdDeletedA, classificationIdA2A, ownerId);
  await addClassification(activityIdPublicC, classificationIdA2A, ownerId);
  await addClassification(activityIdPrivateB, classificationIdA2B, ownerId);
  await addClassification(activityIdDeletedB, classificationIdA2B, ownerId);
  await addClassification(activityIdPublicD, classificationIdA2B, ownerId);

  // add a shared activity to A2B
  await addClassification(activityIdSharedB, classificationIdA2B, ownerId);

  // actually delete the deleted activities
  await deleteContent(activityIdDeletedA, ownerId);
  await deleteContent(activityIdDeletedB, ownerId);

  // user 1 gets the classifications with shared and public activities
  // Note: one activity is counted in both A1A and A1B
  // (there are only three activities total)
  let resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId1,
    subCategoryId: subCategoryIdA1,
  });

  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[1].numCommunity).eq(3);

  // user 2 gets the classification with public activities
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId2,
    subCategoryId: subCategoryIdA1,
  });

  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[0].numCommunity).eq(1);

  // user 1 gets the classification with shared activities
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId1,
    subCategoryId: subCategoryIdA2,
  });

  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2B);
  expect(resultsClass[0].numCommunity).eq(1);

  // user 2 doesn't get anything in A2
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId2,
    subCategoryId: subCategoryIdA2,
  });

  expect(resultsClass.length).eq(0);

  // user 1 gets the subcategories with shared and public activities
  // Note: even though an activity counted in both A1A and A1B
  // (leading to a count of 1 in A1A and a count of 3 in A1B)
  // the total in A1 is still 3 (that activity is not counted twice)
  let resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId1,
    categoryId: categoryIdA,
  });

  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(3);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(1);

  // user 2 gets the classification with public activities
  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId2,
    categoryId: categoryIdA,
  });

  expect(resultsSubcat.length).eq(1);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(1);
});

test("browse classification and subcategories with shared content, filter by activity feature", async () => {
  const { userId } = await createTestUser();
  const { userId: ownerId } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    classificationIdA1B,
    subCategoryIdA2,
    classificationIdA2A,
    classificationIdA2B,
  } = await createTestClassifications({
    word,
    code,
  });

  // add isQuestion activity to A1A
  // add isInteractive activity to A1B
  // add video with different text to A1B
  const { contentId: activityIdQ } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdQ,
    name: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdI } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdI,
    name: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdV } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdV,
    name: `grape${code}`,
    loggedInUserId: ownerId,
  });

  await setContentIsPublic({
    contentId: activityIdQ,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdI,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdV,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdQ, classificationIdA1A, ownerId);
  await addClassification(activityIdI, classificationIdA1B, ownerId);
  await addClassification(activityIdV, classificationIdA1B, ownerId);

  await updateContentFeatures({
    contentId: activityIdQ,
    loggedInUserId: ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    contentId: activityIdI,
    loggedInUserId: ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdV,
    loggedInUserId: ownerId,
    features: { containsVideo: true },
  });

  // add activities with multiple features to A2A, A2B
  const { contentId: activityIdQI } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdQI,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdQV } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdQV,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdIV } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdIV,
    source: `grape${code}`,
    loggedInUserId: ownerId,
  });

  await setContentIsPublic({
    contentId: activityIdQI,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQV,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdIV,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdQI, classificationIdA2A, ownerId);
  await addClassification(activityIdQV, classificationIdA2A, ownerId);
  await addClassification(activityIdIV, classificationIdA2B, ownerId);

  await updateContentFeatures({
    contentId: activityIdQI,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdQV,
    loggedInUserId: ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdIV,
    loggedInUserId: ownerId,
    features: { isInteractive: true, containsVideo: true },
  });

  // get all activities with no filter
  let resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[1].numCommunity).eq(2);
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(2);
  expect(resultsClass[1].classification!.id).eq(classificationIdA2B);
  expect(resultsClass[1].numCommunity).eq(1);

  let resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(3);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(3);

  // filter by isQuestion
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isQuestion"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["isQuestion"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(2);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isQuestion"]),
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(1);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(2);

  // filter by isInteractive
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isInteractive"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[0].numCommunity).eq(1);
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["isInteractive"]),
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA2B);
  expect(resultsClass[1].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isInteractive"]),
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(1);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(2);

  // filter by containsVideo
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["containsVideo"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[0].numCommunity).eq(1);
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["containsVideo"]),
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA2B);
  expect(resultsClass[1].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["containsVideo"]),
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(1);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(2);

  // filter by isQuestion, isInteractive
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsClass.length).eq(0);
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsSubcat.length).eq(1);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[0].numCommunity).eq(1);

  // filter by isQuestion, containsVideo
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsClass.length).eq(0);
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsSubcat.length).eq(1);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[0].numCommunity).eq(1);

  // filter by isInteractive, containsVideo
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsClass.length).eq(0);
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2B);
  expect(resultsClass[0].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsSubcat.length).eq(1);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[0].numCommunity).eq(1);

  // filter by isQuestion, isInteractive, containsVideo
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
  });
  expect(resultsClass.length).eq(0);
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
  });
  expect(resultsClass.length).eq(0);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
  });
  expect(resultsSubcat.length).eq(0);

  // now combine with search

  // no filter besides search banana
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[1].numCommunity).eq(1);
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(2);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(2);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(2);

  // filter by isQuestion, search banana
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isQuestion"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["isQuestion"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(2);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isQuestion"]),
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(1);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(2);

  // filter by isInteractive, search banana
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isInteractive"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[0].numCommunity).eq(1);
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["isInteractive"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isInteractive"]),
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(1);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(1);

  // filter by containsVideo, search banana
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["containsVideo"]),
  });
  expect(resultsClass.length).eq(0);
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["containsVideo"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["containsVideo"]),
  });
  expect(resultsSubcat.length).eq(1);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[0].numCommunity).eq(1);

  // filter by isQuestion, isInteractive, search banana
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsClass.length).eq(0);
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsSubcat.length).eq(1);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[0].numCommunity).eq(1);

  // filter by isQuestion, containsVideo, search banana
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsClass.length).eq(0);
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA2A);
  expect(resultsClass[0].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsSubcat.length).eq(1);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[0].numCommunity).eq(1);

  // filter by isInteractive, containsVideo, search banana
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsClass.length).eq(0);
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA2,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsClass.length).eq(0);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsSubcat.length).eq(0);
});

test("browse classification and subcategories with shared content, filter by owner", async () => {
  const { userId } = await createTestUser();
  const { userId: owner1Id } = await createTestUser();
  const { userId: owner2Id } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    classificationIdA1B,
    subCategoryIdA2,
    classificationIdA2A,
    classificationIdA2B,
  } = await createTestClassifications({
    word,
    code,
  });

  // add owner1 activity to A1A
  // add owner1 activity with different text to A1B
  // add owner2 activity to A1B
  // add owner2 activity with different text to A2A
  // add owner1 activity to A2B

  const { contentId: activityId1A1A } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A1A,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });
  const { contentId: activityId1A1B } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A1B,
    name: `grape${code}`,
    loggedInUserId: owner1Id,
  });
  const { contentId: activityId2A1B } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId2A1B,
    name: `banana${code}`,
    loggedInUserId: owner2Id,
  });

  const { contentId: activityId2A2A } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId2A2A,
    name: `grape${code}`,
    loggedInUserId: owner2Id,
  });
  const { contentId: activityId1A2B } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A2B,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });

  await setContentIsPublic({
    contentId: activityId1A1A,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId1A1B,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId2A1B,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityId2A2A,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityId1A2B,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await addClassification(activityId1A1A, classificationIdA1A, owner1Id);
  await addClassification(activityId1A1B, classificationIdA1B, owner1Id);
  await addClassification(activityId2A1B, classificationIdA1B, owner2Id);
  await addClassification(activityId2A2A, classificationIdA2A, owner2Id);
  await addClassification(activityId1A2B, classificationIdA2B, owner1Id);

  // get all activities with no filter
  let resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[1].numCommunity).eq(2);

  let resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(3);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(2);

  // filter by owner 1
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    ownerId: owner1Id,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[1].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    ownerId: owner1Id,
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(2);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(1);

  // filter by owner 2
  resultsClass = await browseClassificationsWithSharedContent({
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    ownerId: owner2Id,
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[0].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    loggedInUserId: userId,
    categoryId: categoryIdA,
    ownerId: owner2Id,
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(1);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(1);

  // now combine with search

  // no filter besides search banana
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[1].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(2);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(1);

  // filter by owner 1, search banana
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    ownerId: owner1Id,
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
    ownerId: owner1Id,
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(1);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(1);

  // filter by owner 2, search banana
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
    ownerId: owner2Id,
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[0].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
    ownerId: owner2Id,
  });
  expect(resultsSubcat.length).eq(1);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(1);
});

test("browse classification and subcategories with shared content, search includes owner name if not filtering by owner", async () => {
  const code = Date.now().toString();

  const { userId } = await createTestUser();
  const { userId: owner1Id } = await createTestUser();
  await updateUser({
    userId: owner1Id,
    firstNames: `Fred${code}`,
    lastNames: `Flintstone${code}`,
  });
  const { userId: owner2Id } = await createTestUser();
  await updateUser({
    userId: owner2Id,
    firstNames: `Wilma${code}`,
    lastNames: `Flintstone${code}`,
  });

  // create a made up classification tree
  const word = "b";

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    classificationIdA1B,
    subCategoryIdA2,
    classificationIdA2A,
    classificationIdA2B,
  } = await createTestClassifications({
    word,
    code,
  });

  // add owner1 activity to A1A
  // add owner1 activity with different text to A1B
  // add owner2 activity to A1B
  // add owner2 activity with different text to A2A
  // add owner1 activity to A2B

  const { contentId: activityId1A1A } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A1A,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });
  const { contentId: activityId1A1B } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A1B,
    name: `grape${code}`,
    loggedInUserId: owner1Id,
  });
  const { contentId: activityId2A1B } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId2A1B,
    name: `banana${code}`,
    loggedInUserId: owner2Id,
  });

  const { contentId: activityId2A2A } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId2A2A,
    name: `grape${code}`,
    loggedInUserId: owner2Id,
  });
  const { contentId: activityId1A2B } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A2B,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });

  await setContentIsPublic({
    contentId: activityId1A1A,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId1A1B,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId2A1B,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityId2A2A,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityId1A2B,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await addClassification(activityId1A1A, classificationIdA1A, owner1Id);
  await addClassification(activityId1A1B, classificationIdA1B, owner1Id);
  await addClassification(activityId2A1B, classificationIdA1B, owner2Id);
  await addClassification(activityId2A2A, classificationIdA2A, owner2Id);
  await addClassification(activityId1A2B, classificationIdA2B, owner1Id);

  // search for owner 1 name
  let resultsClass = await browseClassificationsWithSharedContent({
    query: `Fred${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[1].numCommunity).eq(1);

  let resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `Fred${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(2);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(1);

  // search owner 2 name
  resultsClass = await browseClassificationsWithSharedContent({
    query: `Wilma${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(resultsClass.length).eq(1);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[0].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `Wilma${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(1);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(1);

  // search for banana and owner 1 name
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code} Fred${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[1].numCommunity).eq(2);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code} Fred${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(3);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(1);

  // search for banana and owner 2 name
  resultsClass = await browseClassificationsWithSharedContent({
    query: `banana${code} Wilma${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(resultsClass.length).eq(2);
  expect(resultsClass[0].classification!.id).eq(classificationIdA1A);
  expect(resultsClass[0].numCommunity).eq(1);
  expect(resultsClass[1].classification!.id).eq(classificationIdA1B);
  expect(resultsClass[1].numCommunity).eq(1);

  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `banana${code} Wilma${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(resultsSubcat.length).eq(2);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(2);
  expect(resultsSubcat[1].subCategory!.id).eq(subCategoryIdA2);
  expect(resultsSubcat[1].numCommunity).eq(2);
});

test("browse classification and subcategories with shared content, search hits classifications", async () => {
  const { userId } = await createTestUser();
  const { userId: ownerId } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "orange";

  const {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    classificationIdA1B,
  } = await createTestClassifications({
    word,
    code,
  });

  const { contentId: activityId1 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityId2 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityId3 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

  await setContentIsPublic({
    contentId: activityId1,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityId2,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityId3,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityId1, classificationIdA1A, ownerId);
  await addClassification(activityId2, classificationIdA1A, ownerId);
  await addClassification(activityId3, classificationIdA1B, ownerId);

  // when browsing for classifications, do not get hits on classification itself
  const resultsClass = await browseClassificationsWithSharedContent({
    query: `${word}A1A${code}`,
    loggedInUserId: userId,
    subCategoryId: subCategoryIdA1,
  });
  expect(resultsClass.length).eq(0);

  // when browsing for subcategories, get hits on classifications
  let resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `${word}A1A${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(resultsSubcat.length).eq(1);
  expect(resultsSubcat[0].subCategory!.id).eq(subCategoryIdA1);
  expect(resultsSubcat[0].numCommunity).eq(2);

  // when browsing for subcategories, don't get hits on subcategory itself
  resultsSubcat = await browseClassificationSubCategoriesWithSharedContent({
    query: `${word}A1${code}`,
    loggedInUserId: userId,
    categoryId: categoryIdA,
  });
  expect(resultsSubcat.length).eq(0);
});

test("browse categories and systems with shared content, returns only classifications with public/shared/non-deleted content and classifications", async () => {
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();
  const { userId: ownerId } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const {
    systemId: systemId1,
    categoryIdA: categoryId1A,
    classificationIdA1A: classificationId1A1A,
    classificationIdA1B: classificationId1A1B,
    classificationIdA2A: classificationId1A2A,
    classificationIdA2B: classificationId1A2B,
    categoryIdB: categoryId1B,
    classificationIdB1A: classificationId1B1A,
    classificationIdB1B: classificationId1B1B,
    classificationIdB2A: classificationId1B2A,
    classificationIdB2B: classificationId1B2B,
  } = await createTestClassifications({
    word,
    code,
  });

  const {
    systemId: systemId2,
    classificationIdA1A: classificationId2A1A,
    categoryIdB: categoryId2B,
    classificationIdB2B: classificationId2B2B,
  } = await createTestClassifications({
    word: "b2",
    code,
  });

  // add shared, private activities to 1A1A, 1A1B, 1A2A, and/or 1A2B
  // add public, shared, private activities to 1B1A, 1B1B, 1B2A, and/or 1B2B
  const { contentId: activityIdSharedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPrivateA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdDeletedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPublicB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdSharedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdPrivateB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityIdDeletedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

  await setContentIsPublic({
    contentId: activityIdPublicB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedA,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedB,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await setContentIsPublic({
    contentId: activityIdDeletedA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdDeletedB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdSharedA, classificationId1A1A, ownerId);
  await addClassification(activityIdSharedA, classificationId1A1B, ownerId);
  await addClassification(activityIdSharedA, classificationId1A2A, ownerId);
  await addClassification(activityIdSharedA, classificationId1A2B, ownerId);
  await addClassification(activityIdPrivateA, classificationId1A1A, ownerId);
  await addClassification(activityIdDeletedA, classificationId1A1A, ownerId);
  await addClassification(activityIdPublicB, classificationId1B1B, ownerId);
  await addClassification(activityIdPublicB, classificationId1B2A, ownerId);
  await addClassification(activityIdPublicB, classificationId1B2B, ownerId);
  await addClassification(activityIdSharedB, classificationId1B1A, ownerId);
  await addClassification(activityIdSharedB, classificationId1B2A, ownerId);
  await addClassification(activityIdSharedB, classificationId1B2B, ownerId);
  await addClassification(activityIdPrivateB, classificationId1B2B, ownerId);
  await addClassification(activityIdDeletedB, classificationId1B2B, ownerId);

  // add the private and deleted activities to 2A1A and 2B2B
  await addClassification(activityIdPrivateA, classificationId2A1A, ownerId);
  await addClassification(activityIdDeletedA, classificationId2A1A, ownerId);
  await addClassification(activityIdPrivateB, classificationId2B2B, ownerId);
  await addClassification(activityIdDeletedB, classificationId2B2B, ownerId);

  // add a shared activity to 2B2B
  await addClassification(activityIdSharedB, classificationId2B2B, ownerId);

  // actually delete the deleted activities
  await deleteContent(activityIdDeletedA, ownerId);
  await deleteContent(activityIdDeletedB, ownerId);

  // user 1 gets the categories with shared and public activities
  let resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId1,
    systemId: systemId1,
  });

  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId1B);
  expect(resultsCat[1].numCommunity).eq(2);

  // user 2 gets the category with public activities
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId2,
    systemId: systemId1,
  });

  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1B);
  expect(resultsCat[0].numCommunity).eq(1);

  // user 1 gets the category with shared activities
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId1,
    systemId: systemId2,
  });

  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2B);
  expect(resultsCat[0].numCommunity).eq(1);

  // user 2 doesn't get anything in A2
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId2,
    systemId: systemId2,
  });

  expect(resultsCat.length).eq(0);

  // user 1 gets the systems with shared and public activities
  let resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId1,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );

  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(3);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(1);

  // user 2 gets the system with public activities
  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId2,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );

  expect(resultsSystem.length).eq(1);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
});

test("browse categories and systems with shared content, search, returns only classifications with public/shared/non-deleted content and classifications", async () => {
  const { userId: userId1 } = await createTestUser();
  const { userId: userId2 } = await createTestUser();
  const { userId: ownerId } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const {
    systemId: systemId1,
    categoryIdA: categoryId1A,
    classificationIdA1A: classificationId1A1A,
    classificationIdA1B: classificationId1A1B,
    classificationIdA2A: classificationId1A2A,
    classificationIdA2B: classificationId1A2B,
    categoryIdB: categoryId1B,
    classificationIdB1A: classificationId1B1A,
    classificationIdB1B: classificationId1B1B,
    classificationIdB2A: classificationId1B2A,
    classificationIdB2B: classificationId1B2B,
  } = await createTestClassifications({
    word,
    code,
  });

  const {
    systemId: systemId2,
    classificationIdA1A: classificationId2A1A,
    categoryIdB: categoryId2B,
    classificationIdB2B: classificationId2B2B,
  } = await createTestClassifications({
    word: "b2",
    code,
  });

  // add shared, private activities to 1A1A, 1A1B, 1A2A, and/or 1A2B
  // add public, shared, private activities to 1B1A, 1B1B, 1B2A, and/or 1B2B
  const { contentId: activityIdSharedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdSharedA,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdPrivateA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdPrivateA,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdDeletedA } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdDeletedA,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdPublicB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdPublicB,
    name: `banana${code}`,
    loggedInUserId: ownerId,
  });

  const { contentId: activityIdSharedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdSharedB,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdPrivateB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdPrivateB,
    name: `banana${code}`,
    loggedInUserId: ownerId,
  });

  const { contentId: activityIdDeletedB } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdDeletedB,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });

  const { contentId: activityIdPublicC } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdPublicC,
    name: `grape${code}`,
    loggedInUserId: ownerId,
  });

  const { contentId: activityIdPublicD } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdPublicD,
    source: `grape${code}`,
    loggedInUserId: ownerId,
  });

  await setContentIsPublic({
    contentId: activityIdPublicB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedA,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await modifyContentSharedWith({
    action: "share",
    contentId: activityIdSharedB,
    loggedInUserId: ownerId,
    users: [userId1],
  });
  await setContentIsPublic({
    contentId: activityIdDeletedA,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdDeletedB,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdPublicC,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdPublicD,
    isPublic: true,
    loggedInUserId: ownerId,
  });

  await addClassification(activityIdSharedA, classificationId1A1A, ownerId);
  await addClassification(activityIdSharedA, classificationId1A1B, ownerId);
  await addClassification(activityIdSharedA, classificationId1A2A, ownerId);
  await addClassification(activityIdSharedA, classificationId1A2B, ownerId);
  await addClassification(activityIdPrivateA, classificationId1A1A, ownerId);
  await addClassification(activityIdDeletedA, classificationId1A1A, ownerId);
  await addClassification(activityIdPublicC, classificationId1A1A, ownerId);
  await addClassification(activityIdPublicC, classificationId1A1B, ownerId);
  await addClassification(activityIdPublicC, classificationId1A2A, ownerId);
  await addClassification(activityIdPublicB, classificationId1B1B, ownerId);
  await addClassification(activityIdPublicB, classificationId1B2A, ownerId);
  await addClassification(activityIdPublicB, classificationId1B2B, ownerId);
  await addClassification(activityIdSharedB, classificationId1B1A, ownerId);
  await addClassification(activityIdSharedB, classificationId1B2A, ownerId);
  await addClassification(activityIdSharedB, classificationId1B2B, ownerId);
  await addClassification(activityIdPrivateB, classificationId1B2B, ownerId);
  await addClassification(activityIdDeletedB, classificationId1B2B, ownerId);
  await addClassification(activityIdPublicD, classificationId1B2A, ownerId);
  await addClassification(activityIdPublicD, classificationId1B2B, ownerId);

  // add the private and deleted activities, and public activities with different text, to 2A1A and 2B2B
  await addClassification(activityIdPrivateA, classificationId2A1A, ownerId);
  await addClassification(activityIdDeletedA, classificationId2A1A, ownerId);
  await addClassification(activityIdPublicC, classificationId2A1A, ownerId);
  await addClassification(activityIdPrivateB, classificationId2B2B, ownerId);
  await addClassification(activityIdDeletedB, classificationId2B2B, ownerId);
  await addClassification(activityIdPublicD, classificationId2B2B, ownerId);

  // add a shared activity to 2B2B
  await addClassification(activityIdSharedB, classificationId2B2B, ownerId);

  // actually delete the deleted activities
  await deleteContent(activityIdDeletedA, ownerId);
  await deleteContent(activityIdDeletedB, ownerId);

  // user 1 gets the classifications with shared and public activities
  let resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId1,
    systemId: systemId1,
  });

  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId1B);
  expect(resultsCat[1].numCommunity).eq(2);

  // user 2 gets the classification with public activities
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId2,
    systemId: systemId1,
  });

  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1B);
  expect(resultsCat[0].numCommunity).eq(1);

  // user 1 gets the classification with shared activities
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId1,
    systemId: systemId2,
  });

  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2B);
  expect(resultsCat[0].numCommunity).eq(1);

  // user 2 doesn't get anything in A2
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId2,
    systemId: systemId2,
  });

  expect(resultsCat.length).eq(0);

  // user 1 gets the subcategories with shared and public activities
  let resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId1,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );

  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(3);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(1);

  // user 2 gets the classification with public activities
  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId2,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );

  expect(resultsSystem.length).eq(1);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
});

test("browse categories and systems with shared content, filter by activity feature", async () => {
  const { userId } = await createTestUser();
  const { userId: ownerId } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const {
    systemId: systemId1,
    categoryIdA: categoryId1A,
    classificationIdA1A: classificationId1A1A,
    categoryIdB: categoryId1B,
    classificationIdB2B: classificationId1B2B,
  } = await createTestClassifications({
    word,
    code,
  });

  const {
    systemId: systemId2,
    categoryIdA: categoryId2A,
    classificationIdA1A: classificationId2A1A,
    categoryIdB: categoryId2B,
    classificationIdB2B: classificationId2B2B,
  } = await createTestClassifications({
    word: "b2",
    code,
  });

  // add isQuestion activity to 1A1A
  // add isInteractive activity to 2B2B
  // add video with different text to 1B2B
  const { contentId: activityIdQ } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdQ,
    name: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdI } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdI,
    name: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdV } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdV,
    name: `grape${code}`,
    loggedInUserId: ownerId,
  });

  await setContentIsPublic({
    contentId: activityIdQ,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdI,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdV,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdQ, classificationId1A1A, ownerId);
  await addClassification(activityIdI, classificationId1B2B, ownerId);
  await addClassification(activityIdV, classificationId1B2B, ownerId);

  await updateContentFeatures({
    contentId: activityIdQ,
    loggedInUserId: ownerId,
    features: { isQuestion: true },
  });
  await updateContentFeatures({
    contentId: activityIdI,
    loggedInUserId: ownerId,
    features: { isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdV,
    loggedInUserId: ownerId,
    features: { containsVideo: true },
  });

  // add activities with multiple features to 2A1A, 2B2B
  const { contentId: activityIdQI } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdQI,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdQV } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdQV,
    source: `banana${code}`,
    loggedInUserId: ownerId,
  });
  const { contentId: activityIdIV } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityIdIV,
    source: `grape${code}`,
    loggedInUserId: ownerId,
  });

  await setContentIsPublic({
    contentId: activityIdQI,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdQV,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityIdIV,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityIdQI, classificationId2A1A, ownerId);
  await addClassification(activityIdQV, classificationId2A1A, ownerId);
  await addClassification(activityIdIV, classificationId2B2B, ownerId);

  await updateContentFeatures({
    contentId: activityIdQI,
    loggedInUserId: ownerId,
    features: { isQuestion: true, isInteractive: true },
  });
  await updateContentFeatures({
    contentId: activityIdQV,
    loggedInUserId: ownerId,
    features: { isQuestion: true, containsVideo: true },
  });
  await updateContentFeatures({
    contentId: activityIdIV,
    loggedInUserId: ownerId,
    features: { isInteractive: true, containsVideo: true },
  });

  // get all activities with no filter
  let resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId1B);
  expect(resultsCat[1].numCommunity).eq(2);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId2,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(2);
  expect(resultsCat[1].category!.id).eq(categoryId2B);
  expect(resultsCat[1].numCommunity).eq(1);

  let resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(3);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(3);

  // filter by isQuestion
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["isQuestion"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["isQuestion"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(2);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId,
      features: new Set(["isQuestion"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(2);

  // filter by isInteractive
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["isInteractive"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1B);
  expect(resultsCat[0].numCommunity).eq(1);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["isInteractive"]),
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId2B);
  expect(resultsCat[1].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId,
      features: new Set(["isInteractive"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(2);

  // filter by containsVideo
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["containsVideo"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1B);
  expect(resultsCat[0].numCommunity).eq(1);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["containsVideo"]),
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId2B);
  expect(resultsCat[1].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId,
      features: new Set(["containsVideo"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(2);

  // filter by isQuestion, isInteractive
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsCat.length).eq(0);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId,
      features: new Set(["isQuestion", "isInteractive"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(1);
  expect(resultsSystem[0].system!.id).eq(systemId2);
  expect(resultsSystem[0].numCommunity).eq(1);

  // filter by isQuestion, containsVideo
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsCat.length).eq(0);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId,
      features: new Set(["isQuestion", "containsVideo"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(1);
  expect(resultsSystem[0].system!.id).eq(systemId2);
  expect(resultsSystem[0].numCommunity).eq(1);

  // filter by isInteractive, containsVideo
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsCat.length).eq(0);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2B);
  expect(resultsCat[0].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId,
      features: new Set(["isInteractive", "containsVideo"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(1);
  expect(resultsSystem[0].system!.id).eq(systemId2);
  expect(resultsSystem[0].numCommunity).eq(1);

  // filter by isQuestion, isInteractive, containsVideo
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
  });
  expect(resultsCat.length).eq(0);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
  });
  expect(resultsCat.length).eq(0);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId,
      features: new Set(["isQuestion", "isInteractive", "containsVideo"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(0);

  // now combine with search

  // no filter besides search banana
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId1B);
  expect(resultsCat[1].numCommunity).eq(1);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId2,
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(2);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(2);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(2);

  // filter by isQuestion, search banana
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["isQuestion"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["isQuestion"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(2);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId,
      features: new Set(["isQuestion"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(2);

  // filter by isInteractive, search banana
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["isInteractive"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1B);
  expect(resultsCat[0].numCommunity).eq(1);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["isInteractive"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId,
      features: new Set(["isInteractive"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(1);

  // filter by containsVideo, search banana
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["containsVideo"]),
  });
  expect(resultsCat.length).eq(0);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["containsVideo"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId,
      features: new Set(["containsVideo"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(1);
  expect(resultsSystem[0].system!.id).eq(systemId2);
  expect(resultsSystem[0].numCommunity).eq(1);

  // filter by isQuestion, isInteractive, search banana
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsCat.length).eq(0);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["isQuestion", "isInteractive"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId,
      features: new Set(["isQuestion", "isInteractive"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(1);
  expect(resultsSystem[0].system!.id).eq(systemId2);
  expect(resultsSystem[0].numCommunity).eq(1);

  // filter by isQuestion, containsVideo, search banana
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsCat.length).eq(0);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["isQuestion", "containsVideo"]),
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId2A);
  expect(resultsCat[0].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId,
      features: new Set(["isQuestion", "containsVideo"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(1);
  expect(resultsSystem[0].system!.id).eq(systemId2);
  expect(resultsSystem[0].numCommunity).eq(1);

  // filter by isInteractive, containsVideo, search banana
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsCat.length).eq(0);
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId2,
    features: new Set(["isInteractive", "containsVideo"]),
  });
  expect(resultsCat.length).eq(0);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId,
      features: new Set(["isInteractive", "containsVideo"]),
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(0);
});

test("browse categories and systems with shared content, filter by owner", async () => {
  const { userId } = await createTestUser();
  const { userId: owner1Id } = await createTestUser();
  const { userId: owner2Id } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "b";

  const {
    systemId: systemId1,
    categoryIdA: categoryId1A,
    classificationIdA1A: classificationId1A1A,
    categoryIdB: categoryId1B,
    classificationIdB2B: classificationId1B2B,
  } = await createTestClassifications({
    word,
    code,
  });

  const {
    systemId: systemId2,
    classificationIdA1A: classificationId2A1A,
    classificationIdB2B: classificationId2B2B,
  } = await createTestClassifications({
    word: "b2",
    code,
  });

  // add owner1 activity to 1A1A
  // add owner1 activity with different text to 1B2B
  // add owner2 activity to 1B2B
  // add owner2 activity with different text to 2A1A
  // add owner1 activity to 2B2B

  const { contentId: activityId1A1A } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A1A,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });
  const { contentId: activityId1A1B } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A1B,
    name: `grape${code}`,
    loggedInUserId: owner1Id,
  });
  const { contentId: activityId2A1B } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId2A1B,
    name: `banana${code}`,
    loggedInUserId: owner2Id,
  });

  const { contentId: activityId2A2A } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId2A2A,
    name: `grape${code}`,
    loggedInUserId: owner2Id,
  });
  const { contentId: activityId1A2B } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A2B,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });

  await setContentIsPublic({
    contentId: activityId1A1A,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId1A1B,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId2A1B,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityId2A2A,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityId1A2B,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await addClassification(activityId1A1A, classificationId1A1A, owner1Id);
  await addClassification(activityId1A1B, classificationId1B2B, owner1Id);
  await addClassification(activityId2A1B, classificationId1B2B, owner2Id);
  await addClassification(activityId2A2A, classificationId2A1A, owner2Id);
  await addClassification(activityId1A2B, classificationId2B2B, owner1Id);

  // get all activities with no filter
  let resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId1B);
  expect(resultsCat[1].numCommunity).eq(2);

  let resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(3);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(2);

  // filter by owner 1
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId1,
    ownerId: owner1Id,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId1B);
  expect(resultsCat[1].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId,
      ownerId: owner1Id,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(2);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(1);

  // filter by owner 2
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    loggedInUserId: userId,
    systemId: systemId1,
    ownerId: owner2Id,
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1B);
  expect(resultsCat[0].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      loggedInUserId: userId,
      ownerId: owner2Id,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(1);

  // now combine with search

  // no filter besides search banana
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId1B);
  expect(resultsCat[1].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(2);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(1);

  // filter by owner 1, search banana
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
    ownerId: owner1Id,
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId,
      ownerId: owner1Id,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(1);

  // filter by owner 2, search banana
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
    ownerId: owner2Id,
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1B);
  expect(resultsCat[0].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code}`,
      loggedInUserId: userId,
      ownerId: owner2Id,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(1);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
});

test("browse categories and systems with shared content, search includes owner name if not filtering by owner", async () => {
  const code = Date.now().toString();

  const { userId } = await createTestUser();
  const { userId: owner1Id } = await createTestUser();
  await updateUser({
    userId: owner1Id,
    firstNames: `Fred${code}`,
    lastNames: `Flintstone${code}`,
  });
  const { userId: owner2Id } = await createTestUser();
  await updateUser({
    userId: owner2Id,
    firstNames: `Wilma${code}`,
    lastNames: `Flintstone${code}`,
  });

  // create a made up classification tree
  const word = "b";

  const {
    systemId: systemId1,
    categoryIdA: categoryId1A,
    classificationIdA1A: classificationId1A1A,
    categoryIdB: categoryId1B,
    classificationIdB2B: classificationId1B2B,
  } = await createTestClassifications({
    word,
    code,
  });

  const {
    systemId: systemId2,
    classificationIdA1A: classificationId2A1A,
    classificationIdB2B: classificationId2B2B,
  } = await createTestClassifications({
    word: "b2",
    code,
  });

  // add owner1 activity to 1A1A
  // add owner1 activity with different text to 1B2B
  // add owner2 activity to 1B2B
  // add owner2 activity with different text to 2A1A
  // add owner1 activity to 2B2B

  const { contentId: activityId1A1A } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A1A,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });
  const { contentId: activityId1A1B } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A1B,
    name: `grape${code}`,
    loggedInUserId: owner1Id,
  });
  const { contentId: activityId2A1B } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId2A1B,
    name: `banana${code}`,
    loggedInUserId: owner2Id,
  });

  const { contentId: activityId2A2A } = await createContent(
    owner2Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId2A2A,
    name: `grape${code}`,
    loggedInUserId: owner2Id,
  });
  const { contentId: activityId1A2B } = await createContent(
    owner1Id,
    "singleDoc",
    null,
  );
  await updateContent({
    contentId: activityId1A2B,
    name: `banana${code}`,
    loggedInUserId: owner1Id,
  });

  await setContentIsPublic({
    contentId: activityId1A1A,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId1A1B,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await setContentIsPublic({
    contentId: activityId2A1B,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityId2A2A,
    isPublic: true,
    loggedInUserId: owner2Id,
  });
  await setContentIsPublic({
    contentId: activityId1A2B,
    isPublic: true,
    loggedInUserId: owner1Id,
  });
  await addClassification(activityId1A1A, classificationId1A1A, owner1Id);
  await addClassification(activityId1A1B, classificationId1B2B, owner1Id);
  await addClassification(activityId2A1B, classificationId1B2B, owner2Id);
  await addClassification(activityId2A2A, classificationId2A1A, owner2Id);
  await addClassification(activityId1A2B, classificationId2B2B, owner1Id);

  // search owner 1
  let resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `Fred${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId1B);
  expect(resultsCat[1].numCommunity).eq(1);

  let resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `Fred${code}`,
      loggedInUserId: userId,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(2);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(1);

  // search owner 2
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `Wilma${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1B);
  expect(resultsCat[0].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `Wilma${code}`,
      loggedInUserId: userId,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(1);

  // search banana and owner 1
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code} Fred${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId1B);
  expect(resultsCat[1].numCommunity).eq(2);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code} Fred${code}`,
      loggedInUserId: userId,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(3);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(1);

  // search for banana and owner 2
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `banana${code} Wilma${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(resultsCat.length).eq(2);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(1);
  expect(resultsCat[1].category!.id).eq(categoryId1B);
  expect(resultsCat[1].numCommunity).eq(1);

  resultsSystem = (
    await browseClassificationSystemsWithSharedContent({
      query: `banana${code} Wilma${code}`,
      loggedInUserId: userId,
    })
  ).filter(
    (res) => res.system && [systemId1, systemId2].includes(res.system.id),
  );
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(2);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(2);
});

test("browse categories and systems with shared content, search hits classifications", async () => {
  const { userId } = await createTestUser();
  const { userId: ownerId } = await createTestUser();

  // create a made up classification tree
  const code = Date.now().toString();
  const word = "orange";

  const {
    systemId: systemId1,
    categoryIdA: categoryId1A,
    classificationIdA1A: classificationId1A1A,
    categoryIdB: categoryId1B,
    classificationIdB2B: classificationId1B2B,
  } = await createTestClassifications({
    word,
    code,
  });

  const {
    systemId: systemId2,
    classificationIdA1A: classificationId2A1A,
    classificationIdB2A: classificationId2B2A,
    classificationIdB2B: classificationId2B2B,
  } = await createTestClassifications({
    word,
    code: code + "B",
  });

  const { contentId: activityId1 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityId2 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityId3 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityId4 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityId5 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityId6 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );
  const { contentId: activityId7 } = await createContent(
    ownerId,
    "singleDoc",
    null,
  );

  await setContentIsPublic({
    contentId: activityId1,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityId2,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityId3,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityId4,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityId5,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityId6,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await setContentIsPublic({
    contentId: activityId7,
    isPublic: true,
    loggedInUserId: ownerId,
  });
  await addClassification(activityId1, classificationId1A1A, ownerId);
  await addClassification(activityId2, classificationId1A1A, ownerId);
  await addClassification(activityId3, classificationId1B2B, ownerId);
  await addClassification(activityId4, classificationId2A1A, ownerId);
  await addClassification(activityId5, classificationId2B2A, ownerId);
  await addClassification(activityId6, classificationId2B2B, ownerId);
  await addClassification(activityId7, classificationId2B2B, ownerId);

  // when browsing for categories, get hits on classifications
  let resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `${word}A1A${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1A);
  expect(resultsCat[0].numCommunity).eq(2);

  // when browsing for categories, get hits on subcategory
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `${word}B2${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(resultsCat.length).eq(1);
  expect(resultsCat[0].category!.id).eq(categoryId1B);
  expect(resultsCat[0].numCommunity).eq(1);

  // when browsing for categories, don't get hits on category itself
  resultsCat = await browseClassificationCategoriesWithSharedContent({
    query: `${word}B${code}`,
    loggedInUserId: userId,
    systemId: systemId1,
  });
  expect(resultsCat.length).eq(0);

  // when browsing for systems, get hits on classifications
  let resultsSystem = await browseClassificationSystemsWithSharedContent({
    query: `${word}B2B${code}`,
    loggedInUserId: userId,
  });
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(2);

  // when browsing for systems, get hits on subcategories
  resultsSystem = await browseClassificationSystemsWithSharedContent({
    query: `${word}B2${code}`,
    loggedInUserId: userId,
  });
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(1);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(3);

  // when browsing for systems, get hits on categories
  resultsSystem = await browseClassificationSystemsWithSharedContent({
    query: `${word}A${code}`,
    loggedInUserId: userId,
  });
  expect(resultsSystem.length).eq(2);
  expect(resultsSystem[0].system!.id).eq(systemId1);
  expect(resultsSystem[0].numCommunity).eq(2);
  expect(resultsSystem[1].system!.id).eq(systemId2);
  expect(resultsSystem[1].numCommunity).eq(1);
});
