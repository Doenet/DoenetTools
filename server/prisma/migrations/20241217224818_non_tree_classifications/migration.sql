/*
  Warnings:

  - You are about to drop the column `subCategoryId` on the `classifications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `classifications` DROP FOREIGN KEY `classifications_subCategoryId_fkey`;

-- DropIndex
DROP INDEX `classifications_code_subCategoryId_key` ON `classifications`;

-- AlterTable
ALTER TABLE `classifications` DROP COLUMN `subCategoryId`;

-- CreateTable
CREATE TABLE `_classificationSubCategoriesToclassifications` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_classificationSubCategoriesToclassifications_AB_unique`(`A`, `B`),
    INDEX `_classificationSubCategoriesToclassifications_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_classificationSubCategoriesToclassifications` ADD CONSTRAINT `_classificationSubCategoriesToclassifications_A_fkey` FOREIGN KEY (`A`) REFERENCES `classificationSubCategories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_classificationSubCategoriesToclassifications` ADD CONSTRAINT `_classificationSubCategoriesToclassifications_B_fkey` FOREIGN KEY (`B`) REFERENCES `classifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
