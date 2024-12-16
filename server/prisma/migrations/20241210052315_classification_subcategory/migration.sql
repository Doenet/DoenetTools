/*
  Warnings:

  - Added the required column `sortIndex` to the `classificationCategories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sortIndex` to the `classificationSubCategories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sortIndex` to the `classificationSystems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `classificationCategories` ADD COLUMN `sortIndex` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `classificationSubCategories` ADD COLUMN `sortIndex` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `classificationSystems` ADD COLUMN `sortIndex` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `classificationSubCategories` MODIFY `subCategory` VARCHAR(400) NOT NULL;

-- CreateIndex
CREATE FULLTEXT INDEX `classificationSystems_name_idx` ON `classificationSystems`(`name`);
