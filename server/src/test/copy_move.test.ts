import { expect, test } from "vitest";
import { createTestUser } from "./utils";
import { createContent, updateContent } from "../query/activity";
import { copyContent, createContentCopyInChildren } from "../query/copy_move";
import { setContentIsPublic } from "../query/share";
import { getMyContent } from "../query/content_list";
import { getContent } from "../query/activity_edit_view";
import { isEqualUUID } from "../utils/uuid";

test("copy folder", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: otherUserId } = await createTestUser();

  const { contentId: folder0Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  await updateContent({
    contentId: folder0Id,
    loggedInUserId: ownerId,
    name: "Base folder",
  });

  const { contentId: activity1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: activity1Id,
    loggedInUserId: ownerId,
    name: "Activity 1",
  });
  const { contentId: folder1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: folder1Id,
    loggedInUserId: ownerId,
    name: "Folder 1",
  });

  const { contentId: activity2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder1Id,
  });
  await updateContent({
    contentId: activity2Id,
    loggedInUserId: ownerId,
    name: "Activity 2",
  });
  const { contentId: folder2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: folder1Id,
  });
  await updateContent({
    contentId: folder2Id,
    loggedInUserId: ownerId,
    name: "Folder 2",
  });

  const { contentId: activity3Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder2Id,
  });
  await updateContent({
    contentId: activity3Id,
    loggedInUserId: ownerId,
    name: "Activity 3",
  });
  const { contentId: folder3Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: folder2Id,
  });
  await updateContent({
    contentId: folder3Id,
    loggedInUserId: ownerId,
    name: "Folder 3",
  });

  // other user cannot copy before it is shared
  const { contentId: folderOther } = await createContent({
    loggedInUserId: otherUserId,
    contentType: "folder",
    parentId: null,
  });
  await expect(
    copyContent({
      contentIds: [folder0Id],
      loggedInUserId: otherUserId,
      parentId: folderOther,
    }),
  ).rejects.toThrow("not found");

  await setContentIsPublic({
    contentId: folder0Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // owner and other user can copy
  for (const userId of [ownerId, otherUserId]) {
    const { contentId: folderNewId } = await createContent({
      loggedInUserId: userId,
      contentType: "folder",
      parentId: null,
    });

    const result = await copyContent({
      contentIds: [folder0Id],
      loggedInUserId: userId,
      parentId: folderNewId,
    });

    expect(result.newContentIds.length).eq(1);

    let folderResults = await getMyContent({
      parentId: folderNewId,
      ownerId: userId,
      loggedInUserId: userId,
    });
    if (folderResults.notMe) {
      throw Error("shouldn't happen");
    }
    expect(folderResults.content.length).eq(1);
    expect(folderResults.content[0].name).eq("Base folder");

    const folderNew0Id = folderResults.content[0].contentId;

    folderResults = await getMyContent({
      parentId: folderNew0Id,
      ownerId: userId,
      loggedInUserId: userId,
    });
    if (folderResults.notMe) {
      throw Error("shouldn't happen");
    }
    expect(folderResults.content.length).eq(2);
    expect(folderResults.content[0].name).eq("Activity 1");
    expect(folderResults.content[1].name).eq("Folder 1");

    const folderNew1Id = folderResults.content[1].contentId;
    folderResults = await getMyContent({
      parentId: folderNew1Id,
      ownerId: userId,
      loggedInUserId: userId,
    });
    if (folderResults.notMe) {
      throw Error("shouldn't happen");
    }
    expect(folderResults.content.length).eq(2);
    expect(folderResults.content[0].name).eq("Activity 2");
    expect(folderResults.content[1].name).eq("Folder 2");

    const folderNew2Id = folderResults.content[1].contentId;
    folderResults = await getMyContent({
      parentId: folderNew2Id,
      ownerId: userId,
      loggedInUserId: userId,
    });
    if (folderResults.notMe) {
      throw Error("shouldn't happen");
    }
    expect(folderResults.content.length).eq(2);
    expect(folderResults.content[0].name).eq("Activity 3");
    expect(folderResults.content[1].name).eq("Folder 3");
  }
});

test("copy folder 2", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: otherUserId } = await createTestUser();

  const { contentId: folder0Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });
  await updateContent({
    contentId: folder0Id,
    loggedInUserId: ownerId,
    name: "Base folder",
  });

  const { contentId: activity1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: activity1Id,
    loggedInUserId: ownerId,
    name: "Activity 1",
  });
  const { contentId: sequence1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: sequence1Id,
    loggedInUserId: ownerId,
    name: "Problem Set 1",
  });

  const { contentId: activity2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: sequence1Id,
  });
  await updateContent({
    contentId: activity2Id,
    loggedInUserId: ownerId,
    name: "Activity 2",
  });
  const { contentId: select1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: sequence1Id,
  });
  await updateContent({
    contentId: select1Id,
    loggedInUserId: ownerId,
    name: "Question Bank 1",
  });

  const { contentId: activity3Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: select1Id,
  });
  await updateContent({
    contentId: activity3Id,
    loggedInUserId: ownerId,
    name: "Activity 3",
  });
  const { contentId: activity4Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: activity4Id,
    loggedInUserId: ownerId,
    name: "Activity 4",
  });
  const { contentId: select2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: select2Id,
    loggedInUserId: ownerId,
    name: "Question Bank 2",
  });
  const { contentId: activity5Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: select2Id,
  });
  await updateContent({
    contentId: activity5Id,
    loggedInUserId: ownerId,
    name: "Activity 5",
  });

  // other user cannot copy before it is shared
  const { contentId: folderOther } = await createContent({
    loggedInUserId: otherUserId,
    contentType: "folder",
    parentId: null,
  });
  await updateContent({
    contentId: folderOther,
    loggedInUserId: otherUserId,
    name: "Placeholder folder",
  });
  await expect(
    copyContent({
      contentIds: [folder0Id],
      loggedInUserId: otherUserId,
      parentId: null,
      prependCopy: true,
    }),
  ).rejects.toThrow("not found");

  await setContentIsPublic({
    contentId: folder0Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // owner and other user can copy
  for (const userId of [ownerId, otherUserId]) {
    const result = await copyContent({
      contentIds: [folder0Id],
      loggedInUserId: userId,
      parentId: null,
      prependCopy: true,
    });

    expect(result.newContentIds.length).eq(1);

    let folderResults = await getMyContent({
      parentId: null,
      ownerId: userId,
      loggedInUserId: userId,
    });
    if (folderResults.notMe) {
      throw Error("shouldn't happen");
    }
    expect(folderResults.content.length).eq(2);

    expect(folderResults.content[0].name).eq(
      isEqualUUID(userId, ownerId) ? "Base folder" : "Placeholder folder",
    );
    expect(folderResults.content[1].name).eq("Copy of Base folder");

    const folderNew0Id = folderResults.content[1].contentId;

    folderResults = await getMyContent({
      parentId: folderNew0Id,
      ownerId: userId,
      loggedInUserId: userId,
    });
    if (folderResults.notMe) {
      throw Error("shouldn't happen");
    }
    expect(folderResults.content.length).eq(4);
    expect(folderResults.content[0].name).eq("Activity 1");
    expect(folderResults.content[1].name).eq("Problem Set 1");
    expect(folderResults.content[2].name).eq("Activity 4");
    expect(folderResults.content[3].name).eq("Question Bank 2");

    const sequenceNewId = folderResults.content[1].contentId;
    const selectNew2Id = folderResults.content[3].contentId;

    folderResults = await getMyContent({
      parentId: sequenceNewId,
      ownerId: userId,
      loggedInUserId: userId,
    });
    if (folderResults.notMe) {
      throw Error("shouldn't happen");
    }
    expect(folderResults.content.length).eq(2);
    expect(folderResults.content[0].name).eq("Activity 2");
    expect(folderResults.content[1].name).eq("Question Bank 1");

    const selectNew1Id = folderResults.content[1].contentId;
    folderResults = await getMyContent({
      parentId: selectNew1Id,
      ownerId: userId,
      loggedInUserId: userId,
    });
    if (folderResults.notMe) {
      throw Error("shouldn't happen");
    }
    expect(folderResults.content.length).eq(1);
    expect(folderResults.content[0].name).eq("Activity 3");

    folderResults = await getMyContent({
      parentId: selectNew2Id,
      ownerId: userId,
      loggedInUserId: userId,
    });
    if (folderResults.notMe) {
      throw Error("shouldn't happen");
    }
    expect(folderResults.content.length).eq(1);
    expect(folderResults.content[0].name).eq("Activity 5");
  }
});

test("copy problem set", async () => {
  const { userId: ownerId } = await createTestUser();

  const { contentId: folder0Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });
  await updateContent({
    contentId: folder0Id,
    loggedInUserId: ownerId,
    name: "Problem set",
  });

  const { contentId: activity1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: activity1Id,
    loggedInUserId: ownerId,
    name: "Question 1",
  });

  const { contentId: folder1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: folder1Id,
    loggedInUserId: ownerId,
    name: "Question bank 2",
  });

  const { contentId: activity2AId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder1Id,
  });
  await updateContent({
    contentId: activity2AId,
    loggedInUserId: ownerId,
    name: "Question 2A",
  });
  const { contentId: activity2BId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder1Id,
  });
  await updateContent({
    contentId: activity2BId,
    loggedInUserId: ownerId,
    name: "Question 2B",
  });

  const { contentId: folder2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: folder2Id,
    loggedInUserId: ownerId,
    name: "Question bank 3",
  });

  const { contentId: activity3AId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder2Id,
  });
  await updateContent({
    contentId: activity3AId,
    loggedInUserId: ownerId,
    name: "Question 3A",
  });
  const { contentId: activity3BId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder2Id,
  });
  await updateContent({
    contentId: activity3BId,
    loggedInUserId: ownerId,
    name: "Question 3B",
  });

  // copy problem set into a new folder
  const { contentId: folderNewBaseId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "folder",
    parentId: null,
  });

  const result = await copyContent({
    contentIds: [folder0Id],
    loggedInUserId: ownerId,
    parentId: folderNewBaseId,
  });

  expect(result.newContentIds.length).eq(1);

  let folderResults = await getMyContent({
    ownerId,
    parentId: folderNewBaseId,
    loggedInUserId: ownerId,
  });
  if (folderResults.notMe) {
    throw Error("shouldn't happen");
  }
  expect(folderResults.content.length).eq(1);
  expect(folderResults.content[0].name).eq("Problem set");

  const folderNew0Id = folderResults.content[0].contentId;

  folderResults = await getMyContent({
    ownerId,
    parentId: folderNew0Id,
    loggedInUserId: ownerId,
  });
  if (folderResults.notMe) {
    throw Error("shouldn't happen");
  }
  expect(folderResults.content.length).eq(3);
  expect(folderResults.content[0].name).eq("Question 1");
  expect(folderResults.content[1].name).eq("Question bank 2");
  expect(folderResults.content[2].name).eq("Question bank 3");

  let folderNewQB2Id = folderResults.content[1].contentId;
  let folderNewQB3Id = folderResults.content[2].contentId;

  folderResults = await getMyContent({
    ownerId,
    parentId: folderNewQB2Id,
    loggedInUserId: ownerId,
  });
  if (folderResults.notMe) {
    throw Error("shouldn't happen");
  }
  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Question 2A");
  expect(folderResults.content[1].name).eq("Question 2B");

  folderResults = await getMyContent({
    ownerId,
    parentId: folderNewQB3Id,
    loggedInUserId: ownerId,
  });
  if (folderResults.notMe) {
    throw Error("shouldn't happen");
  }
  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Question 3A");
  expect(folderResults.content[1].name).eq("Question 3B");

  // Copy problem set into a new problem set
  // Don't get problem set copied, just its children Question 1 and the two Question banks
  const { contentId: folderNewProblemSetId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });

  const result2 = await copyContent({
    contentIds: [folder0Id],
    loggedInUserId: ownerId,
    parentId: folderNewProblemSetId,
  });
  expect(result2.newContentIds.length).eq(3);

  folderResults = await getMyContent({
    ownerId,
    parentId: folderNewProblemSetId,
    loggedInUserId: ownerId,
  });
  if (folderResults.notMe) {
    throw Error("shouldn't happen");
  }
  expect(folderResults.content.length).eq(3);
  expect(folderResults.content[0].name).eq("Question 1");
  expect(folderResults.content[1].name).eq("Question bank 2");
  expect(folderResults.content[2].name).eq("Question bank 3");

  folderNewQB2Id = folderResults.content[1].contentId;
  folderNewQB3Id = folderResults.content[2].contentId;

  folderResults = await getMyContent({
    ownerId,
    parentId: folderNewQB2Id,
    loggedInUserId: ownerId,
  });
  if (folderResults.notMe) {
    throw Error("shouldn't happen");
  }
  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Question 2A");
  expect(folderResults.content[1].name).eq("Question 2B");

  folderResults = await getMyContent({
    ownerId,
    parentId: folderNewQB3Id,
    loggedInUserId: ownerId,
  });
  if (folderResults.notMe) {
    throw Error("shouldn't happen");
  }
  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Question 3A");
  expect(folderResults.content[1].name).eq("Question 3B");

  // Copy problem set into a new question bank
  // Don't get problem set or question bank copied, just its descendants, the questions
  const { contentId: folderNewQuestionBankId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: null,
  });

  const result3 = await copyContent({
    contentIds: [folder0Id],
    loggedInUserId: ownerId,
    parentId: folderNewQuestionBankId,
  });
  expect(result3.newContentIds.length).eq(5);

  folderResults = await getMyContent({
    ownerId,
    parentId: folderNewQuestionBankId,
    loggedInUserId: ownerId,
  });
  if (folderResults.notMe) {
    throw Error("shouldn't happen");
  }
  expect(folderResults.content.length).eq(5);
  expect(folderResults.content[0].name).eq("Question 1");
  expect(folderResults.content[1].name).eq("Question 2A");
  expect(folderResults.content[2].name).eq("Question 2B");
  expect(folderResults.content[3].name).eq("Question 3A");
  expect(folderResults.content[4].name).eq("Question 3B");
});

test("create content copy in children", async () => {
  const { userId: ownerId } = await createTestUser();

  const { contentId: folder0Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });
  await updateContent({
    contentId: folder0Id,
    loggedInUserId: ownerId,
    name: "Problem set",
  });

  const { contentId: activity1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: activity1Id,
    loggedInUserId: ownerId,
    name: "Question 1",
  });

  const { contentId: folder1Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: folder1Id,
    loggedInUserId: ownerId,
    name: "Question bank 2",
  });

  const { contentId: activity2AId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder1Id,
  });
  await updateContent({
    contentId: activity2AId,
    loggedInUserId: ownerId,
    name: "Question 2A",
  });
  const { contentId: activity2BId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder1Id,
  });
  await updateContent({
    contentId: activity2BId,
    loggedInUserId: ownerId,
    name: "Question 2B",
  });

  const { contentId: folder2Id } = await createContent({
    loggedInUserId: ownerId,
    contentType: "select",
    parentId: folder0Id,
  });
  await updateContent({
    contentId: folder2Id,
    loggedInUserId: ownerId,
    name: "Question bank 3",
  });

  const { contentId: activity3AId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder2Id,
  });
  await updateContent({
    contentId: activity3AId,
    loggedInUserId: ownerId,
    name: "Question 3A",
  });
  const { contentId: activity3BId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: folder2Id,
  });
  await updateContent({
    contentId: activity3BId,
    loggedInUserId: ownerId,
    name: "Question 3B",
  });

  // copy children of problem set into a new problem set
  let results = await createContentCopyInChildren({
    loggedInUserId: ownerId,
    childSourceContentIds: [activity1Id, folder1Id, folder2Id],
    contentType: "sequence",
    parentId: null,
  });

  let newActivity = await getContent({
    contentId: results.newContentId,
    loggedInUserId: ownerId,
  });
  expect(newActivity.parent).eqls(null);
  expect(results.newContentName).eq("Untitled Problem Set");
  expect(results.newChildContentIds.length).eq(3);

  if (newActivity.type !== "sequence") {
    throw Error("shouldn't happen");
  }

  expect(newActivity.children.length).eq(3);
  expect(newActivity.children[0].name).eq("Question 1");
  expect(newActivity.children[1].name).eq("Question bank 2");
  expect(newActivity.children[2].name).eq("Question bank 3");

  // copy children of problem set into a new question bank
  // only the documents are copied
  results = await createContentCopyInChildren({
    loggedInUserId: ownerId,
    childSourceContentIds: [activity1Id, folder1Id, folder2Id],
    contentType: "select",
    parentId: null,
  });

  newActivity = await getContent({
    contentId: results.newContentId,
    loggedInUserId: ownerId,
  });
  expect(newActivity.parent).eqls(null);
  expect(results.newContentName).eq("Untitled Question Bank");
  expect(results.newChildContentIds.length).eq(5);

  if (newActivity.type !== "select") {
    throw Error("shouldn't happen");
  }

  expect(newActivity.children.length).eq(5);
  expect(newActivity.children[0].name).eq("Question 1");
  expect(newActivity.children[1].name).eq("Question 2A");
  expect(newActivity.children[2].name).eq("Question 2B");
  expect(newActivity.children[3].name).eq("Question 3A");
  expect(newActivity.children[4].name).eq("Question 3B");
});
