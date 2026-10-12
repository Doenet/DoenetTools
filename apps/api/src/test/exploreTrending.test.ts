import { expect, test } from "vitest";
import { createTestUser, doc, setupTestContent } from "./utils";
import { fromUUID } from "../utils/uuid";
import { setContentIsPublic } from "../query/share";
import { browseTrendingContent } from "../query/explore";
import { recordContentView } from "../query/popularity";
import { prisma } from "../model";

test("browseTrendingContent ranks by views in the last 30 days", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: viewerId } = await createTestUser();
  const code = Date.now().toString();

  const [oldFavoriteId, newFavoriteId, unviewedId] = await setupTestContent(
    ownerId,
    {
      [`old${code}`]: doc(""),
      [`new${code}`]: doc(""),
      [`unviewed${code}`]: doc(""),
    },
  );
  for (const contentId of [oldFavoriteId, newFavoriteId, unviewedId]) {
    await setContentIsPublic({
      contentId,
      loggedInUserId: ownerId,
      isPublic: true,
    });
  }

  // The unviewed activity is newer, so it ranks above `oldFavoriteId`
  // only if views from before the window count for nothing
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - 1);
  await prisma.content.update({
    where: { id: oldFavoriteId },
    data: { createdAt },
  });

  // Three views, all before the window
  const longAgo = new Date();
  longAgo.setDate(longAgo.getDate() - 40);
  for (let i = 0; i < 3; i++) {
    const { userId } = await createTestUser();
    await prisma.contentViews.create({
      data: { contentId: oldFavoriteId, userId, date: longAgo },
    });
  }

  // One view today
  await recordContentView(newFavoriteId, viewerId);

  // A view a few days ago, by a different user, also counts
  const recently = new Date();
  recently.setDate(recently.getDate() - 3);
  await prisma.contentViews.create({
    data: { contentId: newFavoriteId, userId: ownerId, date: recently },
  });

  const results = await browseTrendingContent({
    loggedInUserId: viewerId,
    ownerId,
  });

  // `newFavoriteId` has two recent views; the others have none, so they
  // fall back to newest first
  expect(results.map((c) => fromUUID(c.contentId))).toEqual(
    [newFavoriteId, unviewedId, oldFavoriteId].map(fromUUID),
  );
});
