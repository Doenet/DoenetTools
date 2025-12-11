/*
  Warnings:

  - You are about to drop the column `classCode` on the `assignments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classCode]` on the table `content` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `assignments_classCode_idx` ON `assignments`;

-- AlterTable
ALTER TABLE `assignments` DROP COLUMN `classCode`;

-- AlterTable
ALTER TABLE `content` ADD COLUMN `classCode` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `passwordHash` CHAR(60) NULL,
    ADD COLUMN `scopedToClassId` BINARY(16) NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `content_classCode_key` ON `content`(`classCode`);

-- CreateIndex
CREATE INDEX `content_classCode_idx` ON `content`(`classCode`);

-- CreateIndex
CREATE UNIQUE INDEX `users_username_key` ON `users`(`username`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_scopedToClassId_fkey` FOREIGN KEY (`scopedToClassId`) REFERENCES `content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
