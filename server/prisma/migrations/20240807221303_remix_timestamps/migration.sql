/*
  Warnings:

  - You are about to drop the column `timestamp` on the `contributorHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `contributorHistory` DROP COLUMN `timestamp`,
    ADD COLUMN `timestampDoc` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `timestampPrevDoc` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
