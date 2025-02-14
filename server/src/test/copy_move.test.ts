import { expect, test } from "vitest";
import { createTestUser } from "./utils";
import {
  copyContent,
  createActivity,
  createFolder,
  getMyFolderContent,
  updateContent,
} from "../model";

test("copy folder", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;

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

  const { folderId: folderNewId } = await createFolder(ownerId, null);

  const origContent = [{ contentId: folder0Id, type: "folder" as const }];
  const result = await copyContent(origContent, ownerId, folderNewId);

  expect(result.length).eq(1);
  const folderNew0Id = result[0];

  let folderResults = await getMyFolderContent({
    folderId: folderNew0Id,
    loggedInUserId: ownerId,
  });

  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Activity 1");
  expect(folderResults.content[1].name).eq("Folder 1");

  const folderNew1Id = folderResults.content[1].id;
  folderResults = await getMyFolderContent({
    folderId: folderNew1Id,
    loggedInUserId: ownerId,
  });

  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Activity 2");
  expect(folderResults.content[1].name).eq("Folder 2");

  const folderNew2Id = folderResults.content[1].id;
  folderResults = await getMyFolderContent({
    folderId: folderNew2Id,
    loggedInUserId: ownerId,
  });

  expect(folderResults.content.length).eq(2);
  expect(folderResults.content[0].name).eq("Activity 3");
  expect(folderResults.content[1].name).eq("Folder 3");
});
