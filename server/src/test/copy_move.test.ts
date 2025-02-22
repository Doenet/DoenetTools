import { expect, test } from "vitest";
import { createTestUser } from "./utils";
import { createContent, updateContent } from "../query/activity";
import { copyContent } from "../query/copy_move";
import { setContentIsPublic } from "../query/share";
import { getMyContent } from "../query/content_list";

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
      desiredParentId: folderOther,
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
      desiredParentId: folderNewId,
    });

    expect(result.newContentIds.length).eq(1);

    let folderResults = await getMyContent({
      parentId: folderNewId,
      loggedInUserId: userId,
    });
    expect(folderResults.content.length).eq(1);
    expect(folderResults.content[0].name).eq("Base folder");

    const folderNew0Id = folderResults.content[0].id;

    folderResults = await getMyContent({
      parentId: folderNew0Id,
      loggedInUserId: userId,
    });

    expect(folderResults.content.length).eq(2);
    expect(folderResults.content[0].name).eq("Activity 1");
    expect(folderResults.content[1].name).eq("Folder 1");

    const folderNew1Id = folderResults.content[1].id;
    folderResults = await getMyContent({
      parentId: folderNew1Id,
      loggedInUserId: userId,
    });

    expect(folderResults.content.length).eq(2);
    expect(folderResults.content[0].name).eq("Activity 2");
    expect(folderResults.content[1].name).eq("Folder 2");

    const folderNew2Id = folderResults.content[1].id;
    folderResults = await getMyContent({
      parentId: folderNew2Id,
      loggedInUserId: userId,
    });

    expect(folderResults.content.length).eq(2);
    expect(folderResults.content[0].name).eq("Activity 3");
    expect(folderResults.content[1].name).eq("Folder 3");
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
    desiredParentId: folderNewBaseId,
  });

  expect(result.newContentIds.length).eq(1);

  let folderResults = await getMyContent({
    parentId: folderNewBaseId,
    loggedInUserId: ownerId,
  });
  expect(folderResults.content.length).eq(1);
  expect(folderResults.content[0].name).eq("Problem set");

  const folderNew0Id = folderResults.content[0].id;

  folderResults = await getMyContent({
    parentId: folderNew0Id,
    loggedInUserId: ownerId,
  });

  expect(folderResults.content.length).eq(3);
  expect(folderResults.content[0].name).eq("Question 1");
  expect(folderResults.content[1].name).eq("Question bank 2");
  expect(folderResults.content[2].name).eq("Question bank 3");

  let folderNewQB2Id = folderResults.content[1].id;
  let folderNewQB3Id = folderResults.content[2].id;

  folderResults = await getMyContent({
    parentId: folderNewQB2Id,
    loggedInUserId: ownerId,
  });

  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Question 2A");
  expect(folderResults.content[1].name).eq("Question 2B");

  folderResults = await getMyContent({
    parentId: folderNewQB3Id,
    loggedInUserId: ownerId,
  });

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
    desiredParentId: folderNewProblemSetId,
  });
  expect(result2.newContentIds.length).eq(3);

  folderResults = await getMyContent({
    parentId: folderNewProblemSetId,
    loggedInUserId: ownerId,
  });
  expect(folderResults.content.length).eq(3);
  expect(folderResults.content[0].name).eq("Question 1");
  expect(folderResults.content[1].name).eq("Question bank 2");
  expect(folderResults.content[2].name).eq("Question bank 3");

  folderNewQB2Id = folderResults.content[1].id;
  folderNewQB3Id = folderResults.content[2].id;

  folderResults = await getMyContent({
    parentId: folderNewQB2Id,
    loggedInUserId: ownerId,
  });

  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Question 2A");
  expect(folderResults.content[1].name).eq("Question 2B");

  folderResults = await getMyContent({
    parentId: folderNewQB3Id,
    loggedInUserId: ownerId,
  });

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
    desiredParentId: folderNewQuestionBankId,
  });
  expect(result3.newContentIds.length).eq(5);

  folderResults = await getMyContent({
    parentId: folderNewQuestionBankId,
    loggedInUserId: ownerId,
  });
  expect(folderResults.content.length).eq(5);
  expect(folderResults.content[0].name).eq("Question 1");
  expect(folderResults.content[1].name).eq("Question 2A");
  expect(folderResults.content[2].name).eq("Question 2B");
  expect(folderResults.content[3].name).eq("Question 3A");
  expect(folderResults.content[4].name).eq("Question 3B");
});
