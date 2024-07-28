/*
  Warnings:

  - You are about to drop the `contentKeyword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `keywordInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `contentKeyword` DROP FOREIGN KEY `contentKeyword_contentId_fkey`;

-- DropForeignKey
ALTER TABLE `contentKeyword` DROP FOREIGN KEY `contentKeyword_keywordId_fkey`;

-- DropTable
DROP TABLE `contentKeyword`;

-- DropTable
DROP TABLE `keywordInfo`;

-- CreateTable
CREATE TABLE `contentClassifications` (
    `contentId` INTEGER NOT NULL,
    `classificationId` INTEGER NOT NULL,

    PRIMARY KEY (`contentId`, `classificationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `systemId` INTEGER NOT NULL,
    `category` TINYTEXT NOT NULL,
    `description` TEXT NOT NULL,

    UNIQUE INDEX `classifications_code_systemId_key`(`code`, `systemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classificationSystems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contentClassifications` ADD CONSTRAINT `contentClassifications_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contentClassifications` ADD CONSTRAINT `contentClassifications_classificationId_fkey` FOREIGN KEY (`classificationId`) REFERENCES `classifications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classifications` ADD CONSTRAINT `classifications_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `classificationSystems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
