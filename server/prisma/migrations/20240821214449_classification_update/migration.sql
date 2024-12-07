/*
  Warnings:

  - You are about to drop the column `grade` on the `classifications` table. All the data in the column will be lost.
  - Added the required column `categoryLabel` to the `classificationSystems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryLabel` to the `classificationSystems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategory` to the `classifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `classificationSystems` ADD COLUMN `categoryLabel` VARCHAR(191) NOT NULL,
    ADD COLUMN `subCategoryLabel` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `classifications` DROP COLUMN `grade`,
    ADD COLUMN `subCategory` TEXT NOT NULL;
