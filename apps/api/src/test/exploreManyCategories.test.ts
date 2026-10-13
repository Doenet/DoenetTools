import { expect, test } from "vitest";
import { createTestUser, doc, setupTestContent } from "./utils";
import { fromUUID } from "../utils/uuid";
import { setContentIsPublic } from "../query/share";
import { updateCategories } from "../query/activity";
import { browseExplore, searchExplore } from "../query/explore";
import { prisma } from "../model";
import { returnCategoryWhereClauses } from "../utils/classificationsCategories";

test("browseExplore and searchExplore filter by many categories without exceeding the join limit", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: viewerId } = await createTestUser();
  const code = Date.now().toString();

  const [contentId] = await setupTestContent(ownerId, {
    [`many${code}`]: doc(`many${code}`),
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  await updateCategories({
    contentId,
    loggedInUserId: ownerId,
    categories: { isInteractive: true, containsVideo: true },
  });

  // Each category used to add two joins, so 26 or more could exceed MySQL's
  // limit of 61 tables in a join. 30 codes is the most that each get their own
  // subquery; 42 share one grouped subquery.
  const unknownCodes = (n: number) =>
    Array.from({ length: n }, (_, i) => `unknown${i}`);

  for (const categories of [
    new Set(["isInteractive", "containsVideo"]),
    new Set(["isInteractive", "containsVideo", ...unknownCodes(28)]),
    new Set(["isInteractive", "containsVideo", ...unknownCodes(40)]),
  ]) {
    const expected = categories.size === 2 ? [fromUUID(contentId)] : [];

    const browseResults = await browseExplore({
      loggedInUserId: viewerId,
      ownerId,
      categories,
    });
    expect(browseResults.recentContent.map((c) => fromUUID(c.contentId))).eqls(
      expected,
    );

    const searchResults = await searchExplore({
      query: `many${code}`,
      loggedInUserId: viewerId,
      categories,
    });
    expect(searchResults.content.map((c) => fromUUID(c.contentId))).eqls(
      expected,
    );
  }
});

test("the grouped category subquery matches content that has every requested category", async () => {
  const { userId: ownerId } = await createTestUser();
  const code = Date.now().toString();

  const [contentId] = await setupTestContent(ownerId, {
    [`grouped${code}`]: doc(`grouped${code}`),
  });
  await updateCategories({
    contentId,
    loggedInUserId: ownerId,
    categories: { isInteractive: true, containsVideo: true },
  });

  // The seed has 18 categories, so more than 30 codes always include an unknown
  // one. Use the grouped subquery for any number of codes instead.
  const matches = async (categories: Set<string>) => {
    const rows = await prisma.$queryRaw<{ id: Uint8Array }[]>`
      SELECT content.id FROM content
      WHERE content.id = ${contentId}
      ${returnCategoryWhereClauses(categories, 0)}
    `;
    return rows.length > 0;
  };

  expect(await matches(new Set(["isInteractive"]))).eq(true);
  expect(await matches(new Set(["isInteractive", "containsVideo"]))).eq(true);
  expect(await matches(new Set(["isInteractive", "isAnimation"]))).eq(false);
  expect(
    await matches(new Set(["isInteractive", "containsVideo", "unknown0"])),
  ).eq(false);
});
