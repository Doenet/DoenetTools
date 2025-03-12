/*
  Warnings:

  - You are about to drop the column `attemptNumber` on the `submittedResponses` table. All the data in the column will be lost.
  - Added the required column `contentAttemptNumber` to the `submittedResponses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `submittedResponses` DROP COLUMN `attemptNumber`,
    ADD COLUMN `contentAttemptNumber` SMALLINT UNSIGNED NOT NULL,
    ADD COLUMN `itemAttemptNumber` SMALLINT UNSIGNED NULL;
