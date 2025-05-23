/*
  Warnings:

  - You are about to drop the column `comments` on the `libraryactivityinfos` table. All the data in the column will be lost.
  - The values [PENDING_REVIEW,REQUEST_REMOVED,NEEDS_REVISION] on the enum `libraryActivityInfos_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `comments` on the `libraryevents` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `libraryevents` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `libraryevents` table. All the data in the column will be lost.
  - The values [SUBMIT_REQUEST,CANCEL_REQUEST,ADD_DRAFT,DELETE_DRAFT,MARK_NEEDS_REVISION,MODIFY_COMMENTS] on the enum `libraryEvents_eventType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `requestedOn` to the `libraryActivityInfos` table without a default value. This is not possible if the table is not empty.
  - Made the column `contentId` on table `libraryactivityinfos` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `infoId` to the `libraryEvents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `libraryactivityinfos` DROP FOREIGN KEY `libraryActivityInfos_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `libraryevents` DROP FOREIGN KEY `libraryEvents_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `libraryevents` DROP FOREIGN KEY `libraryEvents_sourceId_fkey`;

-- DropIndex
DROP INDEX `libraryEvents_contentId_fkey` ON `libraryevents`;

-- DropIndex
DROP INDEX `libraryEvents_sourceId_fkey` ON `libraryevents`;

-- AlterTable
ALTER TABLE `libraryactivityinfos` DROP COLUMN `comments`,
    ADD COLUMN `primaryEditorId` BINARY(16) NULL,
    ADD COLUMN `requestedOn` DATETIME(3) NOT NULL,
    MODIFY `contentId` BINARY(16) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'UNDER_REVIEW', 'PUBLISHED', 'REJECTED') NOT NULL;

-- AlterTable
ALTER TABLE `libraryevents` DROP COLUMN `comments`,
    DROP COLUMN `contentId`,
    DROP COLUMN `sourceId`,
    ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `infoId` BINARY(16) NOT NULL,
    MODIFY `eventType` ENUM('SUGGEST_REVIEW', 'TAKE_OWNERSHIP', 'PUBLISH', 'UNPUBLISH', 'REJECT', 'ADD_COMMENT') NOT NULL;

-- AddForeignKey
ALTER TABLE `libraryActivityInfos` ADD CONSTRAINT `libraryActivityInfos_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryActivityInfos` ADD CONSTRAINT `libraryActivityInfos_primaryEditorId_fkey` FOREIGN KEY (`primaryEditorId`) REFERENCES `users`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_infoId_fkey` FOREIGN KEY (`infoId`) REFERENCES `libraryActivityInfos`(`sourceId`) ON DELETE RESTRICT ON UPDATE CASCADE;
