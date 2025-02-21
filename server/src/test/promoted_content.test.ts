import { expect, test } from "vitest";
import { createTestAdminUser, createTestUser } from "./utils";
import { newUUID } from "../utils/uuid";
import {
  addPromotedContent,
  addPromotedContentGroup,
  deletePromotedContentGroup,
  loadPromotedContent,
  movePromotedContent,
  movePromotedContentGroup,
  removePromotedContent,
  updatePromotedContentGroup,
} from "../query/promoted";
import { createContent } from "../query/activity";
import { setContentIsPublic } from "../query/share";

test("add and remove promoted content", async () => {
  const { userId } = await createTestAdminUser();

  // Can create new promoted content group
  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  await addPromotedContentGroup(groupName, userId);
  const groups = await loadPromotedContent(userId);
  const groupId = groups.find(
    (group) => group.groupName === groupName,
  )!.promotedGroupId;
  expect(groups.find((group) => group.groupName === groupName)).toBeDefined();

  // Creating the same group again should fail
  await expect(addPromotedContentGroup(groupName, userId)).rejects.toThrowError(
    "Unique constraint failed",
  );

  // Cannot promote private activity to that group
  const { contentId: activityId } = await createContent(
    userId,
    "singleDoc",
    null,
  );
  await expect(
    addPromotedContent(groupId, activityId, userId),
  ).rejects.toThrowError("not public");
  {
    const promotedContent = await loadPromotedContent(userId);
    const myGroup = promotedContent.find(
      (content) => content.groupName === groupName,
    );
    expect(myGroup).toBeDefined();
    expect(myGroup?.promotedContent).toEqual([]);
  }

  // Can promote public activity to that group
  await setContentIsPublic({
    contentId: activityId,
    loggedInUserId: userId,
    isPublic: true,
  });
  await addPromotedContent(groupId, activityId, userId);
  {
    const promotedContent = await loadPromotedContent(userId);
    const myContent = promotedContent.find(
      (content) => content.promotedGroupId === groupId,
    );
    expect(myContent).toBeDefined();
    expect(myContent?.promotedContent[0].id).toEqual(activityId);
  }

  // Cannot add to same group twice
  await expect(
    addPromotedContent(groupId, activityId, userId),
  ).rejects.toThrowError("Unique constraint failed");
  {
    const promotedContent = await loadPromotedContent(userId);
    const myContent = promotedContent.find(
      (content) => content.promotedGroupId === groupId,
    );
    expect(myContent).toBeDefined();
    expect(myContent?.promotedContent.length).toEqual(1);
  }

  // Cannot promote non-existent activity
  const fakeActivityId = newUUID();
  await expect(
    addPromotedContent(groupId, fakeActivityId, userId),
  ).rejects.toThrowError("does not exist");
  {
    const promotedContent = await loadPromotedContent(userId);
    const myContent = promotedContent.find(
      (content) => content.promotedGroupId === groupId,
    );
    expect(myContent).toBeDefined();
    expect(myContent?.promotedContent.length).toEqual(1);
  }

  // Cannot promote to non-existent group
  const fakeGroupId = Math.random() * 1e8;
  await expect(
    addPromotedContent(fakeGroupId, activityId, userId),
  ).rejects.toThrowError("Foreign key constraint violated");
  {
    const promotedContent = await loadPromotedContent(userId);
    const myContent = promotedContent.find(
      (content) => content.promotedGroupId === groupId,
    );
    expect(myContent).toBeDefined();
    expect(myContent?.promotedContent.length).toEqual(1);
  }

  // Remove content from group
  await removePromotedContent(groupId, activityId, userId);
  {
    const promotedContent = await loadPromotedContent(userId);
    const myContent = promotedContent.find(
      (content) => content.promotedGroupId === groupId,
    );
    expect(myContent).toBeDefined();
    expect(myContent?.promotedContent.length).toEqual(0);
  }

  // Cannot remove non-existent activity
  await expect(
    removePromotedContent(fakeGroupId, activityId, userId),
  ).rejects.toThrowError("does not exist");
});

test("delete promoted content group", async () => {
  const { userId } = await createTestAdminUser();
  const { contentId: activity1 } = await createContent(
    userId,
    "singleDoc",
    null,
  );
  const { contentId: activity2 } = await createContent(
    userId,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activity1,
    isPublic: true,
    loggedInUserId: userId,
  });
  await setContentIsPublic({
    contentId: activity2,
    isPublic: true,
    loggedInUserId: userId,
  });

  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  await addPromotedContentGroup(groupName, userId);
  const groups = await loadPromotedContent(userId);
  const groupId = groups.find(
    (group) => group.groupName === groupName,
  )!.promotedGroupId;
  await addPromotedContent(groupId, activity1, userId);
  await addPromotedContent(groupId, activity2, userId);

  await deletePromotedContentGroup(groupId, userId);
  const groupsAfterRemove = await loadPromotedContent(userId);
  expect(
    groupsAfterRemove.find((group) => group.groupName === groupName),
  ).toBeUndefined();
});

test("update promoted content group", async () => {
  const { userId } = await createTestAdminUser();

  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const groupId = await addPromotedContentGroup(groupName, userId);

  const secondGroupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  await addPromotedContentGroup(secondGroupName, userId);

  const groups = await loadPromotedContent(userId);
  expect(groups.find((group) => group.groupName === groupName)).toBeDefined();
  expect(
    groups.find((group) => group.groupName === secondGroupName),
  ).toBeDefined();

  // Cannot update group name to different existing name
  await expect(
    updatePromotedContentGroup(groupId, secondGroupName, false, false, userId),
  ).rejects.toThrowError();

  const newGroupName =
    "vitest-unique-NEW-promoted-group-" + new Date().toJSON();
  await updatePromotedContentGroup(groupId, newGroupName, false, false, userId);

  const groups3 = await loadPromotedContent(userId);
  expect(
    groups3.find((group) => group.groupName === newGroupName),
  ).toBeDefined();
});

test("move promoted content groups", async () => {
  const { userId } = await createTestAdminUser();

  const group1Name = "vitest-unique-promoted-group-" + new Date().toJSON();
  const group1Id = await addPromotedContentGroup(group1Name, userId);

  const group2Name = "vitest-unique-promoted-group-" + new Date().toJSON();
  await addPromotedContentGroup(group2Name, userId);

  let groups = await loadPromotedContent(userId);
  let groupNames = groups.map((g) => g.groupName);
  const group1PositionA = groupNames.indexOf(group1Name);
  const group2PositionA = groupNames.indexOf(group2Name);
  expect(group2PositionA).eq(group1PositionA + 1);

  await movePromotedContentGroup(group1Id, userId, group2PositionA);
  groups = await loadPromotedContent(userId);
  groupNames = groups.map((g) => g.groupName);
  const group1PositionB = groupNames.indexOf(group1Name);
  const group2PositionB = groupNames.indexOf(group2Name);
  expect(group1PositionB).eq(group2PositionA);
  expect(group2PositionB).eq(group1PositionA);

  const group3Name = "vitest-unique-promoted-group-" + new Date().toJSON();
  const group3Id = await addPromotedContentGroup(group3Name, userId);
  groups = await loadPromotedContent(userId);
  groupNames = groups.map((g) => g.groupName);
  const group1PositionC = groupNames.indexOf(group1Name);
  const group2PositionC = groupNames.indexOf(group2Name);
  const group3PositionC = groupNames.indexOf(group3Name);
  expect(group2PositionC).eq(group2PositionB);
  expect(group1PositionC).eq(group2PositionC + 1);
  expect(group3PositionC).eq(group2PositionC + 2);

  await movePromotedContentGroup(group3Id, userId, group1PositionC);
  groups = await loadPromotedContent(userId);
  groupNames = groups.map((g) => g.groupName);
  const group1PositionD = groupNames.indexOf(group1Name);
  const group2PositionD = groupNames.indexOf(group2Name);
  const group3PositionD = groupNames.indexOf(group3Name);
  expect(group2PositionD).eq(group2PositionC);
  expect(group3PositionD).eq(group2PositionD + 1);
  expect(group1PositionD).eq(group2PositionD + 2);
});

test("move promoted content", async () => {
  const { userId } = await createTestAdminUser();

  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const groupId = await addPromotedContentGroup(groupName, userId);

  // add first activity
  const { contentId: activity1Id } = await createContent(
    userId,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activity1Id,
    isPublic: true,
    loggedInUserId: userId,
  });
  await addPromotedContent(groupId, activity1Id, userId);
  let promotedContent = await loadPromotedContent(userId);
  let myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].id).toEqual(activity1Id);

  // add second activity
  const { contentId: activity2Id } = await createContent(
    userId,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activity2Id,
    isPublic: true,
    loggedInUserId: userId,
  });
  await addPromotedContent(groupId, activity2Id, userId);
  promotedContent = await loadPromotedContent(userId);
  myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].id).toEqual(activity1Id);
  expect(myContent!.promotedContent[1].id).toEqual(activity2Id);

  // move second activity to first spot
  await movePromotedContent(groupId, activity2Id, userId, 0);
  promotedContent = await loadPromotedContent(userId);
  myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].id).toEqual(activity2Id);
  expect(myContent!.promotedContent[1].id).toEqual(activity1Id);

  // add third activity
  const { contentId: activity3Id } = await createContent(
    userId,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: activity3Id,
    isPublic: true,
    loggedInUserId: userId,
  });
  await addPromotedContent(groupId, activity3Id, userId);
  promotedContent = await loadPromotedContent(userId);
  myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].id).toEqual(activity2Id);
  expect(myContent!.promotedContent[1].id).toEqual(activity1Id);
  expect(myContent!.promotedContent[2].id).toEqual(activity3Id);

  // move first activity to last spot
  await movePromotedContent(groupId, activity1Id, userId, 10);
  promotedContent = await loadPromotedContent(userId);
  myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].id).toEqual(activity2Id);
  expect(myContent!.promotedContent[1].id).toEqual(activity3Id);
  expect(myContent!.promotedContent[2].id).toEqual(activity1Id);

  // move second activity to middle spot
  await movePromotedContent(groupId, activity2Id, userId, 1);
  promotedContent = await loadPromotedContent(userId);
  myContent = promotedContent.find(
    (content) => content.promotedGroupId === groupId,
  );
  expect(myContent!.promotedContent[0].id).toEqual(activity3Id);
  expect(myContent!.promotedContent[1].id).toEqual(activity2Id);
  expect(myContent!.promotedContent[2].id).toEqual(activity1Id);
});

test("promoted content access control", async () => {
  // Setup
  const { userId } = await createTestUser();
  const { contentId: activityId } = await createContent(
    userId,
    "singleDoc",
    null,
  );
  const groupName = "vitest-unique-promoted-group-" + new Date().toJSON();
  const { contentId: promotedActivityId } = await createContent(
    userId,
    "singleDoc",
    null,
  );
  await setContentIsPublic({
    contentId: promotedActivityId,
    isPublic: true,
    loggedInUserId: userId,
  });
  const { userId: adminId } = await createTestAdminUser();
  const groupId = await addPromotedContentGroup(groupName, adminId);
  await addPromotedContent(groupId, promotedActivityId, adminId);

  // add group fails
  await expect(
    addPromotedContentGroup("some group name", userId),
  ).rejects.toThrowError("admin");

  // update group fails
  await expect(
    updatePromotedContentGroup(groupId, "some new name", true, true, userId),
  ).rejects.toThrowError("admin");

  // delete group fails
  await expect(
    deletePromotedContentGroup(groupId, userId),
  ).rejects.toThrowError("admin");

  // add content fails
  await expect(
    addPromotedContent(groupId, activityId, userId),
  ).rejects.toThrowError("admin");

  // remove content fails
  await expect(
    removePromotedContent(groupId, promotedActivityId, userId),
  ).rejects.toThrowError("admin");
});
