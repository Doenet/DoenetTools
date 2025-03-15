/*
  Warnings:

  - The primary key for the `contentItemState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `itemNumber` on the `contentItemState` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `shuffledItemNumber` on the `contentItemState` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `itemAttemptNumber` on the `contentItemState` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `answerNumber` on the `submittedResponses` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `componentNumber` on the `submittedResponses` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `itemNumber` on the `submittedResponses` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.
  - You are about to alter the column `shuffledItemNumber` on the `submittedResponses` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedSmallInt`.

*/
-- AlterTable
ALTER TABLE `contentItemState` DROP PRIMARY KEY,
    MODIFY `itemNumber` SMALLINT UNSIGNED NOT NULL,
    MODIFY `shuffledItemNumber` SMALLINT UNSIGNED NOT NULL,
    MODIFY `itemAttemptNumber` SMALLINT UNSIGNED NOT NULL,
    ADD PRIMARY KEY (`contentId`, `userId`, `contentAttemptNumber`, `itemNumber`, `itemAttemptNumber`);

-- AlterTable
ALTER TABLE `submittedResponses` MODIFY `answerNumber` SMALLINT UNSIGNED NULL,
    MODIFY `componentNumber` SMALLINT UNSIGNED NOT NULL,
    MODIFY `itemNumber` SMALLINT UNSIGNED NOT NULL,
    MODIFY `shuffledItemNumber` SMALLINT UNSIGNED NOT NULL;
