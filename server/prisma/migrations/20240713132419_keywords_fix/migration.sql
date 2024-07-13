/*
  Warnings:

  - You are about to drop the column `categoryId` on the `keywordInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `keywordInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `keywordInfo` DROP COLUMN `categoryId`;

-- CreateIndex
CREATE UNIQUE INDEX `keywordInfo_name_key` ON `keywordInfo`(`name`);
