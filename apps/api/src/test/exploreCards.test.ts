import { expect, test } from "vitest";
import { createTestEditorUser, createTestUser } from "./utils";
import { isEqualUUID } from "../utils/uuid";
import {
  addClassification,
  searchPossibleClassifications,
} from "../query/classification";
import { createContent } from "../query/activity";
import { setContentIsPublic } from "../query/share";
import {
  browseExplore,
  searchExplore,
  searchUsersWithSharedContent,
} from "../query/explore";
import {
  claimOwnershipOfReview,
  getLibraryAccountId,
  publishActivityToLibrary,
  suggestToBeCurated,
} from "../query/curate";
import { getActivityIdFromSourceId } from "./testQueries";

test("Explore cards omit DoenetML and classifications, and show the source owner of curated content", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: editorId } = await createTestEditorUser();
  const { userId: viewerId } = await createTestUser();

  const code = Date.now().toString();
  const { contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
    name: `card${code}`,
    doenetml: `<p>card${code}</p>`,
  });
  await setContentIsPublic({
    contentId,
    loggedInUserId: ownerId,
    isPublic: true,
  });
  const classificationId = (
    await searchPossibleClassifications({ query: "FinM.A.3" })
  )[0].id;
  await addClassification({
    contentId,
    classificationId,
    loggedInUserId: ownerId,
  });

  // Curate it into the library
  await suggestToBeCurated({ contentId, loggedInUserId: ownerId });
  const curatedId = await getActivityIdFromSourceId(contentId);
  await claimOwnershipOfReview({
    contentId: curatedId,
    loggedInUserId: editorId,
  });
  await publishActivityToLibrary({
    contentId: curatedId,
    loggedInUserId: editorId,
  });

  const expectIsCard = (
    card: { contentId: Uint8Array; classifications: unknown[] } | undefined,
    expectedContentId: Uint8Array,
  ) => {
    expect(card).toBeDefined();
    expect(isEqualUUID(card!.contentId, expectedContentId)).eq(true);
    expect(card).not.toHaveProperty("doenetML");
    expect(card!.classifications).eqls([]);
  };

  const searchResults = await searchExplore({
    query: `card${code}`,
    loggedInUserId: viewerId,
  });
  expect(searchResults.content.length).eq(1);
  expectIsCard(searchResults.content[0], contentId);
  expect(isEqualUUID(searchResults.content[0].owner!.userId, ownerId)).eq(true);

  expect(searchResults.curatedContent.length).eq(1);
  expectIsCard(searchResults.curatedContent[0], curatedId);
  const curatedOwner = searchResults.curatedContent[0].owner!;
  expect(isEqualUUID(curatedOwner.userId, ownerId)).eq(true);
  expect(curatedOwner.isMaskForLibrary).eq(true);

  const browseResults = await browseExplore({
    loggedInUserId: viewerId,
    ownerId,
  });
  expect(browseResults.recentContent.length).eq(1);
  expectIsCard(browseResults.recentContent[0], contentId);
  expect(browseResults.recentContent[0].owner!.isMaskForLibrary).toBeFalsy();
  expect(browseResults.trendingContent.length).eq(1);
  expectIsCard(browseResults.trendingContent[0], contentId);

  // The library's curated copy is public, yet the library account itself is
  // never a trending owner or a matched author
  const libraryId = await getLibraryAccountId();
  const libraryBrowse = await browseExplore({
    loggedInUserId: viewerId,
    ownerId: libraryId,
  });
  expect(libraryBrowse.trendingContent).eqls([]);

  const matchedAuthors = await searchUsersWithSharedContent({
    query: "Library",
    loggedInUserId: viewerId,
  });
  expect(
    matchedAuthors.some((author) => isEqualUUID(author.userId, libraryId)),
  ).eq(false);
});
