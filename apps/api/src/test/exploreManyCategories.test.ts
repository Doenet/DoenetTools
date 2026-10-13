import { expect, test } from "vitest";
import { createTestUser, doc, setupTestContent } from "./utils";
import { fromUUID } from "../utils/uuid";
import { setContentIsPublic } from "../query/share";
import { updateCategories } from "../query/activity";
import { browseExplore, searchExplore } from "../query/explore";

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
