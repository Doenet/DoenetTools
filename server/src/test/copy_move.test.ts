import { expect, test } from "vitest";
import { createTestUser } from "./utils";
import { createContent, updateContent } from "../apis/activity";
import { copyContent } from "../apis/copy_move";
import { setContentIsPublic } from "../apis/share";
import { getMyContent } from "../apis/content_list";

test("copy folder", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: otherUserId } = await createTestUser();

  const { id: folder0Id } = await createContent(ownerId, "folder", null);
  await updateContent({
    id: folder0Id,
    loggedInUserId: ownerId,
    name: "Base folder",
  });

  const { id: activity1Id } = await createContent(
    ownerId,
    "singleDoc",
    folder0Id,
  );
  await updateContent({
    id: activity1Id,
    loggedInUserId: ownerId,
    name: "Activity 1",
  });
  const { id: folder1Id } = await createContent(ownerId, "folder", folder0Id);
  await updateContent({
    id: folder1Id,
    loggedInUserId: ownerId,
    name: "Folder 1",
  });

  const { id: activity2Id } = await createContent(
    ownerId,
    "singleDoc",
    folder1Id,
  );
  await updateContent({
    id: activity2Id,
    loggedInUserId: ownerId,
    name: "Activity 2",
  });
  const { id: folder2Id } = await createContent(ownerId, "folder", folder1Id);
  await updateContent({
    id: folder2Id,
    loggedInUserId: ownerId,
    name: "Folder 2",
  });

  const { id: activity3Id } = await createContent(
    ownerId,
    "singleDoc",
    folder2Id,
  );
  await updateContent({
    id: activity3Id,
    loggedInUserId: ownerId,
    name: "Activity 3",
  });
  const { id: folder3Id } = await createContent(ownerId, "folder", folder2Id);
  await updateContent({
    id: folder3Id,
    loggedInUserId: ownerId,
    name: "Folder 3",
  });

  // other user cannot copy before it is shared
  const { id: folderOther } = await createContent(otherUserId, "folder", null);
  await expect(
    copyContent(folder0Id, otherUserId, folderOther),
  ).rejects.toThrow("not found");

  await setContentIsPublic({
    id: folder0Id,
    loggedInUserId: ownerId,
    isPublic: true,
  });

  // owner and other user can copy
  for (const userId of [ownerId, otherUserId]) {
    const { id: folderNewId } = await createContent(userId, "folder", null);

    const result = await copyContent(folder0Id, userId, folderNewId);

    expect(result.length).eq(1);

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

  const { id: folder0Id } = await createContent(ownerId, "sequence", null);
  await updateContent({
    id: folder0Id,
    loggedInUserId: ownerId,
    name: "Problem set",
  });

  const { id: activity1Id } = await createContent(
    ownerId,
    "singleDoc",
    folder0Id,
  );
  await updateContent({
    id: activity1Id,
    loggedInUserId: ownerId,
    name: "Question 1",
  });

  const { id: folder1Id } = await createContent(ownerId, "select", folder0Id);
  await updateContent({
    id: folder1Id,
    loggedInUserId: ownerId,
    name: "Question bank 2",
  });

  const { id: activity2AId } = await createContent(
    ownerId,
    "singleDoc",
    folder1Id,
  );
  await updateContent({
    id: activity2AId,
    loggedInUserId: ownerId,
    name: "Question 2A",
  });
  const { id: activity2BId } = await createContent(
    ownerId,
    "singleDoc",
    folder1Id,
  );
  await updateContent({
    id: activity2BId,
    loggedInUserId: ownerId,
    name: "Question 2B",
  });

  const { id: folder2Id } = await createContent(ownerId, "select", folder0Id);
  await updateContent({
    id: folder2Id,
    loggedInUserId: ownerId,
    name: "Question bank 3",
  });

  const { id: activity3AId } = await createContent(
    ownerId,
    "singleDoc",
    folder2Id,
  );
  await updateContent({
    id: activity3AId,
    loggedInUserId: ownerId,
    name: "Question 3A",
  });
  const { id: activity3BId } = await createContent(
    ownerId,
    "singleDoc",
    folder2Id,
  );
  await updateContent({
    id: activity3BId,
    loggedInUserId: ownerId,
    name: "Question 3B",
  });

  // copy problem set into a new folder
  const { id: folderNewBaseId } = await createContent(ownerId, "folder", null);

  const result = await copyContent(folder0Id, ownerId, folderNewBaseId);

  expect(result.length).eq(1);

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
  const { id: folderNewProblemSetId } = await createContent(
    ownerId,
    "sequence",
    null,
  );

  const result2 = await copyContent(folder0Id, ownerId, folderNewProblemSetId);
  expect(result2.length).eq(3);

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
  const { id: folderNewQuestionBankId } = await createContent(
    ownerId,
    "select",
    null,
  );

  const result3 = await copyContent(
    folder0Id,
    ownerId,
    folderNewQuestionBankId,
  );
  expect(result3.length).eq(5);

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
