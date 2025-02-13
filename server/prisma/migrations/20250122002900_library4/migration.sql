/*
  Warnings:

  - The primary key for the `documentSubmittedResponses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `documentSubmittedResponses` table. The data in that column could be lost. The data in that column will be cast from `Binary(16)` to `Int`.

*/
-- AlterTable
ALTER TABLE `documentSubmittedResponses` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `libraryEvents` ADD COLUMN `libraryActivityId` BINARY(16) NULL;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_libraryActivityId_fkey` FOREIGN KEY (`libraryActivityId`) REFERENCES `content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
