/*
  Warnings:

  - You are about to drop the column `description` on the `classifications` table. All the data in the column will be lost.
  - The primary key for the `promotedContentGroups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `promotedGroupId` on the `promotedContentGroups` table. All the data in the column will be lost.
  - You are about to drop the `_classificationSubCategoriesToclassifications` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[subCategory,categoryId]` on the table `classificationSubCategories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `classificationSystems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `promotedContentGroups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_classificationSubCategoriesToclassifications` DROP FOREIGN KEY `_classificationSubCategoriesToclassifications_A_fkey`;

-- DropForeignKey
ALTER TABLE `_classificationSubCategoriesToclassifications` DROP FOREIGN KEY `_classificationSubCategoriesToclassifications_B_fkey`;

-- DropForeignKey
ALTER TABLE `promotedContent` DROP FOREIGN KEY `promotedContent_promotedGroupId_fkey`;

-- DropIndex
DROP INDEX `classificationSubCategories_subCategory_categoryId_key` ON `classificationSubCategories`;

-- DropIndex
DROP INDEX `classifications_code_description_idx` ON `classifications`;

-- DropIndex
DROP INDEX `promotedContent_promotedGroupId_fkey` ON `promotedContent`;

-- AlterTable
ALTER TABLE `classificationSubCategories` MODIFY `subCategory` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `classificationSystems` ADD COLUMN `categoriesInDescription` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `classifications` DROP COLUMN `description`;

-- AlterTable
ALTER TABLE `promotedContentGroups` DROP PRIMARY KEY,
    DROP COLUMN `promotedGroupId`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `_classificationSubCategoriesToclassifications`;

-- CreateTable
CREATE TABLE `classificationDescriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subCategoryId` INTEGER NOT NULL,
    `description` TEXT NOT NULL,

    UNIQUE INDEX `classificationDescriptions_description_subCategoryId_key`(`description`(200), `subCategoryId`),
    FULLTEXT INDEX `classificationDescriptions_description_idx`(`description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_classificationDescriptionsToclassifications` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_classificationDescriptionsToclassifications_AB_unique`(`A`, `B`),
    INDEX `_classificationDescriptionsToclassifications_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `classificationSubCategories_subCategory_categoryId_key` ON `classificationSubCategories`(`subCategory`(200), `categoryId`);

-- CreateIndex
CREATE FULLTEXT INDEX `classifications_code_idx` ON `classifications`(`code`);

-- AddForeignKey
ALTER TABLE `promotedContent` ADD CONSTRAINT `promotedContent_promotedGroupId_fkey` FOREIGN KEY (`promotedGroupId`) REFERENCES `promotedContentGroups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classificationDescriptions` ADD CONSTRAINT `classificationDescriptions_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `classificationSubCategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_classificationDescriptionsToclassifications` ADD CONSTRAINT `_classificationDescriptionsToclassifications_A_fkey` FOREIGN KEY (`A`) REFERENCES `classificationDescriptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_classificationDescriptionsToclassifications` ADD CONSTRAINT `_classificationDescriptionsToclassifications_B_fkey` FOREIGN KEY (`B`) REFERENCES `classifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
