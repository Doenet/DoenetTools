/*
  Warnings:

  - The primary key for the `libraryActivityInfos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `libraryActivityId` on the `libraryActivityInfos` table. All the data in the column will be lost.
  - You are about to drop the column `sourceActivityId` on the `libraryActivityInfos` table. All the data in the column will be lost.
  - You are about to drop the column `libraryActivityId` on the `libraryEvents` table. All the data in the column will be lost.
  - You are about to drop the column `sourceActivityId` on the `libraryEvents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activityId]` on the table `libraryActivityInfos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceId` to the `libraryActivityInfos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceId` to the `libraryEvents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `libraryActivityInfos` DROP FOREIGN KEY `libraryActivityInfos_libraryActivityId_fkey`;

-- DropForeignKey
ALTER TABLE `libraryActivityInfos` DROP FOREIGN KEY `libraryActivityInfos_sourceActivityId_fkey`;

-- DropForeignKey
ALTER TABLE `libraryEvents` DROP FOREIGN KEY `libraryEvents_libraryActivityId_fkey`;

-- DropForeignKey
ALTER TABLE `libraryEvents` DROP FOREIGN KEY `libraryEvents_sourceActivityId_fkey`;

-- DropIndex
DROP INDEX `libraryActivityInfos_libraryActivityId_key` ON `libraryActivityInfos`;

-- DropIndex
DROP INDEX `libraryEvents_libraryActivityId_fkey` ON `libraryEvents`;

-- DropIndex
DROP INDEX `libraryEvents_sourceActivityId_fkey` ON `libraryEvents`;

-- AlterTable
ALTER TABLE `libraryActivityInfos` DROP PRIMARY KEY,
    DROP COLUMN `libraryActivityId`,
    DROP COLUMN `sourceActivityId`,
    ADD COLUMN `activityId` BINARY(16) NULL,
    ADD COLUMN `sourceId` BINARY(16) NOT NULL,
    ADD PRIMARY KEY (`sourceId`);

-- AlterTable
ALTER TABLE `libraryEvents` DROP COLUMN `libraryActivityId`,
    DROP COLUMN `sourceActivityId`,
    ADD COLUMN `activityId` BINARY(16) NULL,
    ADD COLUMN `sourceId` BINARY(16) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `libraryActivityInfos_activityId_key` ON `libraryActivityInfos`(`activityId`);

-- AddForeignKey
ALTER TABLE `libraryActivityInfos` ADD CONSTRAINT `libraryActivityInfos_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryActivityInfos` ADD CONSTRAINT `libraryActivityInfos_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
