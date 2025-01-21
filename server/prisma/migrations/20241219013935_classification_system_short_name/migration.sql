/*
  Warnings:

  - A unique constraint covering the columns `[shortName]` on the table `classificationSystems` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortName` to the `classificationSystems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `classificationSystems` ADD COLUMN `shortName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `classificationSystems_shortName_key` ON `classificationSystems`(`shortName`);
