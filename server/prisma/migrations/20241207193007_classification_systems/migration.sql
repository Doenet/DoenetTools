/*
  Warnings:

  - You are about to drop the column `category` on the `classifications` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `classifications` table. All the data in the column will be lost.
  - You are about to drop the column `systemId` on the `classifications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code,subCategoryId]` on the table `classifications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryLabel` to the `classificationSystems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryLabel` to the `classificationSystems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryId` to the `classifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `classifications` DROP FOREIGN KEY `classifications_systemId_fkey`;

-- DropIndex
DROP INDEX `classifications_code_category_description_idx` ON `classifications`;

-- DropIndex
DROP INDEX `classifications_code_systemId_key` ON `classifications`;

-- AlterTable
ALTER TABLE `classificationSystems` ADD COLUMN `categoryLabel` VARCHAR(191) NOT NULL,
    ADD COLUMN `subCategoryLabel` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `classifications` DROP COLUMN `category`,
    DROP COLUMN `grade`,
    DROP COLUMN `systemId`,
    ADD COLUMN `subCategoryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `content` MODIFY `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- AlterTable
ALTER TABLE `documentSubmittedResponses` MODIFY `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- AlterTable
ALTER TABLE `documents` MODIFY `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- AlterTable
ALTER TABLE `users` MODIFY `userId` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- CreateTable
CREATE TABLE `classificationCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL,
    `systemId` INTEGER NOT NULL,

    UNIQUE INDEX `classificationCategories_category_systemId_key`(`category`, `systemId`),
    FULLTEXT INDEX `classificationCategories_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classificationSubCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `subCategory` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `classificationSubCategories_subCategory_categoryId_key`(`subCategory`, `categoryId`),
    FULLTEXT INDEX `classificationSubCategories_subCategory_idx`(`subCategory`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `classifications_code_subCategoryId_key` ON `classifications`(`code`, `subCategoryId`);

-- CreateIndex
CREATE FULLTEXT INDEX `classifications_code_description_idx` ON `classifications`(`code`, `description`);

-- AddForeignKey
ALTER TABLE `classificationCategories` ADD CONSTRAINT `classificationCategories_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `classificationSystems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classificationSubCategories` ADD CONSTRAINT `classificationSubCategories_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `classificationCategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classifications` ADD CONSTRAINT `classifications_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `classificationSubCategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
