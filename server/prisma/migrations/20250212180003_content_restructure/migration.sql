/*
  Warnings:

  - Added the required column `baseComponentCounts` to the `documentVersions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseComponentCounts` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `content` ADD COLUMN `activityLevelAttempts` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `itemLevelAttempts` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `numToSelect` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    ADD COLUMN `paginate` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `selectByVariant` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `shuffle` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `type` ENUM('singleDoc', 'select', 'sequence', 'folder') NOT NULL DEFAULT 'singleDoc';

-- AlterTable
ALTER TABLE `documentVersions` ADD COLUMN `baseComponentCounts` TEXT NOT NULL,
    ADD COLUMN `numVariants` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `documents` ADD COLUMN `baseComponentCounts` TEXT NOT NULL,
    ADD COLUMN `numVariants` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `recentContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` BINARY(16) NOT NULL,
    `contentId` BINARY(16) NOT NULL,
    `accessed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mode` ENUM('edit', 'view') NOT NULL,

    UNIQUE INDEX `recentContent_userId_mode_contentId_key`(`userId`, `mode`, `contentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recentContent` ADD CONSTRAINT `recentContent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recentContent` ADD CONSTRAINT `recentContent_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
