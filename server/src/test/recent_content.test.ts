import { expect, test } from "vitest";
import { createTestUser } from "./utils";
import { ContentType } from "@prisma/client";
import { createContent } from "../apis/activity";
import {
  getRecentContent,
  purgeOldRecentContent,
  recordRecentContent,
} from "../apis/explore";
import { prisma } from "../model";

test("add and check recent content", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  const activityIds: Uint8Array[] = [];

  // add 5 activities
  for (let i = 0; i < 5; i++) {
    const { id: activityId } = await createContent(userId, "singleDoc", null);
    await recordRecentContent(userId, "edit", activityId);
    activityIds.push(activityId);
  }

  // get recent should get all five
  let recent = await getRecentContent(userId, "edit", []);
  expect(recent.map((r) => r.id)).eqls([...activityIds].reverse());

  // add a couple more activities
  for (let i = 0; i < 2; i++) {
    const { id: activityId } = await createContent(userId, "singleDoc", null);
    await recordRecentContent(userId, "edit", activityId);
    activityIds.push(activityId);
  }

  // get the most recent 10
  recent = await getRecentContent(userId, "edit", []);
  expect(recent.map((r) => r.id)).eqls([...activityIds].reverse().slice(0, 5));
});

test("add and check recent content, different types", async () => {
  const user = await createTestUser();
  const userId = user.userId;

  const contents: { id: Uint8Array; type: ContentType }[] = [];

  // add five items of each content type
  for (let i = 0; i < 5; i++) {
    const { id: activityId } = await createContent(userId, "singleDoc", null);
    await recordRecentContent(userId, "edit", activityId);
    contents.push({ id: activityId, type: "singleDoc" });

    const { id: folderId } = await createContent(userId, "folder", null);
    await recordRecentContent(userId, "edit", folderId);
    contents.push({ id: folderId, type: "folder" });

    const { id: sequenceId } = await createContent(userId, "sequence", null);
    await recordRecentContent(userId, "edit", sequenceId);
    contents.push({ id: sequenceId, type: "sequence" });

    const { id: selectId } = await createContent(userId, "select", null);
    await recordRecentContent(userId, "edit", selectId);
    contents.push({ id: selectId, type: "select" });
  }

  // get recent with no arguments should get the most recent 5
  let recent = await getRecentContent(userId, "edit", []);
  expect(recent.map((r) => r.id)).eqls(
    contents
      .map((c) => c.id)
      .reverse()
      .slice(0, 5),
  );

  // get just the 5 from each type
  for (const type of ["singleDoc", "folder", "sequence", "select"]) {
    recent = await getRecentContent(userId, "edit", [type as ContentType]);
    expect(recent.map((r) => r.id)).eqls(
      contents
        .filter((c) => c.type === type)
        .map((c) => c.id)
        .reverse(),
    );
  }

  // add a couple more activities of each type
  for (let i = 0; i < 2; i++) {
    const { id: activityId } = await createContent(userId, "singleDoc", null);
    await recordRecentContent(userId, "edit", activityId);
    contents.push({ id: activityId, type: "singleDoc" });

    const { id: folderId } = await createContent(userId, "folder", null);
    await recordRecentContent(userId, "edit", folderId);
    contents.push({ id: folderId, type: "folder" });

    const { id: sequenceId } = await createContent(userId, "sequence", null);
    await recordRecentContent(userId, "edit", sequenceId);
    contents.push({ id: sequenceId, type: "sequence" });

    const { id: selectId } = await createContent(userId, "select", null);
    await recordRecentContent(userId, "edit", selectId);
    contents.push({ id: selectId, type: "select" });
  }

  // get recent with no arguments should get the most recent 10
  recent = await getRecentContent(userId, "edit", []);
  expect(recent.map((r) => r.id)).eqls(
    contents
      .map((c) => c.id)
      .reverse()
      .slice(0, 5),
  );

  // get just the most recent 5 from each type
  for (const type of ["singleDoc", "folder", "sequence", "select"]) {
    recent = await getRecentContent(userId, "edit", [type as ContentType]);
    expect(recent.map((r) => r.id)).eqls(
      contents
        .filter((c) => c.type === type)
        .map((c) => c.id)
        .reverse()
        .slice(0, 5),
    );
  }
});

test("purge recent content", async () => {
  const { userId: user1Id } = await createTestUser();
  const { userId: user2Id } = await createTestUser();

  // add 150 activities for each user
  for (let i = 0; i < 150; i++) {
    const { id: activity1Id } = await createContent(user1Id, "singleDoc", null);
    await recordRecentContent(user1Id, "edit", activity1Id);
    const { id: activity2Id } = await createContent(user2Id, "singleDoc", null);
    await recordRecentContent(user2Id, "edit", activity2Id);
  }

  expect(
    await prisma.recentContent.count({
      where: { userId: user1Id },
    }),
  ).eq(150);
  expect(
    await prisma.recentContent.count({
      where: { userId: user2Id },
    }),
  ).eq(150);

  await purgeOldRecentContent();
  expect(
    await prisma.recentContent.count({
      where: { userId: user1Id },
    }),
  ).eq(100);
  expect(
    await prisma.recentContent.count({
      where: { userId: user2Id },
    }),
  ).eq(100);
});
