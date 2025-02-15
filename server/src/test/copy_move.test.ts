import { expect, test } from "vitest";
import { createTestUser } from "./utils";
import {
  copyContent,
  createActivity,
  createFolder,
  getMyFolderContent,
  makeFolderPublic,
  updateContent,
} from "../model";

test("copy folder", async () => {
  const { userId: ownerId } = await createTestUser();
  const { userId: otherUserId } = await createTestUser();

  const { folderId: folder0Id } = await createFolder(ownerId, null);
  await updateContent({ id: folder0Id, ownerId, name: "Base folder" });

  const { activityId: activity1Id } = await createActivity(ownerId, folder0Id);
  await updateContent({ id: activity1Id, ownerId, name: "Activity 1" });
  const { folderId: folder1Id } = await createFolder(ownerId, folder0Id);
  await updateContent({ id: folder1Id, ownerId, name: "Folder 1" });

  const { activityId: activity2Id } = await createActivity(ownerId, folder1Id);
  await updateContent({ id: activity2Id, ownerId, name: "Activity 2" });
  const { folderId: folder2Id } = await createFolder(ownerId, folder1Id);
  await updateContent({ id: folder2Id, ownerId, name: "Folder 2" });

  const { activityId: activity3Id } = await createActivity(ownerId, folder2Id);
  await updateContent({ id: activity3Id, ownerId, name: "Activity 3" });
  const { folderId: folder3Id } = await createFolder(ownerId, folder2Id);
  await updateContent({ id: folder3Id, ownerId, name: "Folder 3" });

  const origContent = [{ contentId: folder0Id, type: "folder" as const }];

  // other user cannot copy before it is shared
  const { folderId: folderOther } = await createFolder(otherUserId, null);
  await expect(
    copyContent(origContent, otherUserId, folderOther),
  ).rejects.toThrow("not found");

  await makeFolderPublic({ id: folder0Id, ownerId, licenseCode: "CCDUAL" });

  // owner and other user can copy
  for (const userId of [ownerId, otherUserId]) {
    const { folderId: folderNewId } = await createFolder(userId, null);

    const result = await copyContent(origContent, userId, folderNewId);

    expect(result.length).eq(1);

    let folderResults = await getMyFolderContent({
      folderId: folderNewId,
      loggedInUserId: userId,
    });
    expect(folderResults.content.length).eq(1);
    expect(folderResults.content[0].name).eq("Base folder");

    const folderNew0Id = folderResults.content[0].id;

    folderResults = await getMyFolderContent({
      folderId: folderNew0Id,
      loggedInUserId: userId,
    });

    expect(folderResults.content.length).eq(2);
    expect(folderResults.content[0].name).eq("Activity 1");
    expect(folderResults.content[1].name).eq("Folder 1");

    const folderNew1Id = folderResults.content[1].id;
    folderResults = await getMyFolderContent({
      folderId: folderNew1Id,
      loggedInUserId: userId,
    });

    expect(folderResults.content.length).eq(2);
    expect(folderResults.content[0].name).eq("Activity 2");
    expect(folderResults.content[1].name).eq("Folder 2");

    const folderNew2Id = folderResults.content[1].id;
    folderResults = await getMyFolderContent({
      folderId: folderNew2Id,
      loggedInUserId: userId,
    });

    expect(folderResults.content.length).eq(2);
    expect(folderResults.content[0].name).eq("Activity 3");
    expect(folderResults.content[1].name).eq("Folder 3");
  }
});

test("copy problem set", async () => {
  const { userId: ownerId } = await createTestUser();

  const { folderId: folder0Id } = await createFolder(ownerId, null, "sequence");
  await updateContent({ id: folder0Id, ownerId, name: "Problem set" });

  const { activityId: activity1Id } = await createActivity(ownerId, folder0Id);
  await updateContent({ id: activity1Id, ownerId, name: "Question 1" });

  const { folderId: folder1Id } = await createFolder(
    ownerId,
    folder0Id,
    "select",
  );
  await updateContent({ id: folder1Id, ownerId, name: "Question bank 2" });

  const { activityId: activity2AId } = await createActivity(ownerId, folder1Id);
  await updateContent({ id: activity2AId, ownerId, name: "Question 2A" });
  const { activityId: activity2BId } = await createActivity(ownerId, folder1Id);
  await updateContent({ id: activity2BId, ownerId, name: "Question 2B" });

  const { folderId: folder2Id } = await createFolder(
    ownerId,
    folder0Id,
    "select",
  );
  await updateContent({ id: folder2Id, ownerId, name: "Question bank 3" });

  const { activityId: activity3AId } = await createActivity(ownerId, folder2Id);
  await updateContent({ id: activity3AId, ownerId, name: "Question 3A" });
  const { activityId: activity3BId } = await createActivity(ownerId, folder2Id);
  await updateContent({ id: activity3BId, ownerId, name: "Question 3B" });

  const origContent = [{ contentId: folder0Id, type: "folder" as const }];

  // copy problem set into a new folder
  const { folderId: folderNewBaseId } = await createFolder(ownerId, null);

  const result = await copyContent(origContent, ownerId, folderNewBaseId);

  expect(result.length).eq(1);

  let folderResults = await getMyFolderContent({
    folderId: folderNewBaseId,
    loggedInUserId: ownerId,
  });
  expect(folderResults.content.length).eq(1);
  expect(folderResults.content[0].name).eq("Problem set");

  const folderNew0Id = folderResults.content[0].id;

  folderResults = await getMyFolderContent({
    folderId: folderNew0Id,
    loggedInUserId: ownerId,
  });

  expect(folderResults.content.length).eq(3);
  expect(folderResults.content[0].name).eq("Question 1");
  expect(folderResults.content[1].name).eq("Question bank 2");
  expect(folderResults.content[2].name).eq("Question bank 3");

  let folderNewQB2Id = folderResults.content[1].id;
  let folderNewQB3Id = folderResults.content[2].id;

  folderResults = await getMyFolderContent({
    folderId: folderNewQB2Id,
    loggedInUserId: ownerId,
  });

  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Question 2A");
  expect(folderResults.content[1].name).eq("Question 2B");

  folderResults = await getMyFolderContent({
    folderId: folderNewQB3Id,
    loggedInUserId: ownerId,
  });

  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Question 3A");
  expect(folderResults.content[1].name).eq("Question 3B");

  // Copy problem set into a new problem set
  // Don't get problem set copied, its children Question 1 and the two Question bank3
  const { folderId: folderNewProblemSetId } = await createFolder(
    ownerId,
    null,
    "sequence",
  );

  const result2 = await copyContent(
    origContent,
    ownerId,
    folderNewProblemSetId,
  );
  expect(result2.length).eq(3);

  folderResults = await getMyFolderContent({
    folderId: folderNewProblemSetId,
    loggedInUserId: ownerId,
  });
  expect(folderResults.content.length).eq(3);
  expect(folderResults.content[0].name).eq("Question 1");
  expect(folderResults.content[1].name).eq("Question bank 2");
  expect(folderResults.content[2].name).eq("Question bank 3");

  folderNewQB2Id = folderResults.content[1].id;
  folderNewQB3Id = folderResults.content[2].id;

  folderResults = await getMyFolderContent({
    folderId: folderNewQB2Id,
    loggedInUserId: ownerId,
  });

  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Question 2A");
  expect(folderResults.content[1].name).eq("Question 2B");

  folderResults = await getMyFolderContent({
    folderId: folderNewQB3Id,
    loggedInUserId: ownerId,
  });

  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Question 3A");
  expect(folderResults.content[1].name).eq("Question 3B");

  // Copy problem set into a new question bank
  // Don't get problem set or question bank copied, its descendants Question 3
  const { folderId: folderNewQuestionBankId } = await createFolder(
    ownerId,
    null,
    "select",
  );

  const result3 = await copyContent(
    origContent,
    ownerId,
    folderNewQuestionBankId,
  );
  expect(result3.length).eq(5);

  folderResults = await getMyFolderContent({
    folderId: folderNewQuestionBankId,
    loggedInUserId: ownerId,
  });
  expect(folderResults.content.length).eq(5);
  expect(folderResults.content[0].name).eq("Question 1");
  expect(folderResults.content[1].name).eq("Question 2A");
  expect(folderResults.content[2].name).eq("Question 2B");
  expect(folderResults.content[3].name).eq("Question 3A");
  expect(folderResults.content[4].name).eq("Question 3B");
});
