/*
  Warnings:

  - Added the required column `cachedBestAttemptNumber` to the `assignmentScores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assignmentScores` ADD COLUMN `cachedBestAttemptNumber` SMALLINT UNSIGNED NOT NULL;
