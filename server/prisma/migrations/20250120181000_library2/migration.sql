/*
  Warnings:

  - You are about to drop the column `activityId` on the `libraryEvents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[libraryActivityId]` on the table `libraryActivityInfos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceActivityId` to the `libraryEvents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `libraryEvents` DROP FOREIGN KEY `libraryEvents_activityId_fkey`;

-- AlterTable
ALTER TABLE `libraryActivityInfos` ADD COLUMN `libraryActivityId` BINARY(16) NULL;

-- AlterTable
ALTER TABLE `libraryEvents` DROP COLUMN `activityId`,
    ADD COLUMN `sourceActivityId` BINARY(16) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `userId` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- CreateIndex
CREATE UNIQUE INDEX `libraryActivityInfos_libraryActivityId_key` ON `libraryActivityInfos`(`libraryActivityId`);

-- AddForeignKey
ALTER TABLE `libraryActivityInfos` ADD CONSTRAINT `libraryActivityInfos_libraryActivityId_fkey` FOREIGN KEY (`libraryActivityId`) REFERENCES `content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_sourceActivityId_fkey` FOREIGN KEY (`sourceActivityId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
