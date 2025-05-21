/*
  Warnings:

  - Made the column `contentId` on table `libraryactivityinfos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `libraryactivityinfos` DROP FOREIGN KEY `libraryActivityInfos_contentId_fkey`;

-- AlterTable
ALTER TABLE `libraryactivityinfos` ADD COLUMN `primaryEditorId` BINARY(16) NULL,
    MODIFY `contentId` BINARY(16) NOT NULL;

-- AddForeignKey
ALTER TABLE `libraryActivityInfos` ADD CONSTRAINT `libraryActivityInfos_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryActivityInfos` ADD CONSTRAINT `libraryActivityInfos_primaryEditorId_fkey` FOREIGN KEY (`primaryEditorId`) REFERENCES `users`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;
