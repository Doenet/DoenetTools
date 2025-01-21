/*
  Warnings:

  - The primary key for the `documentSubmittedResponses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `documentSubmittedResponses` table. The data in that column could be lost. The data in that column will be cast from `Binary(16)` to `Int`.

*/
-- AlterTable
ALTER TABLE `documentSubmittedResponses` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `contentViews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activityId` BINARY(16) NOT NULL,
    `date` DATE NOT NULL DEFAULT (curdate()),
    `userId` BINARY(16) NOT NULL,

    UNIQUE INDEX `contentViews_date_activityId_userId_key`(`date`, `activityId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contentViews` ADD CONSTRAINT `contentViews_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
