/*
  Warnings:

  - You are about to drop the column `nonRootAssignmentId` on the `content` table. All the data in the column will be lost.
  - You are about to drop the `assignments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `assignmentScores` DROP FOREIGN KEY `assignmentScores_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `assignments` DROP FOREIGN KEY `assignments_rootContentId_fkey`;

-- DropForeignKey
ALTER TABLE `content` DROP FOREIGN KEY `content_nonRootAssignmentId_fkey`;

-- DropForeignKey
ALTER TABLE `contentState` DROP FOREIGN KEY `contentState_contentId_fkey`;

-- DropIndex
DROP INDEX `content_nonRootAssignmentId_fkey` ON `content`;

-- AlterTable
ALTER TABLE `content` DROP COLUMN `nonRootAssignmentId`,
    ADD COLUMN `assignedClosedOn` DATETIME(3) NULL,
    ADD COLUMN `assignmentOpenOn` DATETIME(3) NULL,
    ADD COLUMN `isAssignmentRoot` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `assignments`;

-- AddForeignKey
ALTER TABLE `assignmentScores` ADD CONSTRAINT `assignmentScores_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contentState` ADD CONSTRAINT `contentState_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
