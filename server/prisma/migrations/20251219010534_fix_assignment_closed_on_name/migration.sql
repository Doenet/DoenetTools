/*
  Warnings:

  - You are about to drop the column `assignedClosedOn` on the `content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `content` DROP COLUMN `assignedClosedOn`,
    ADD COLUMN `assignmentClosedOn` DATETIME(3) NULL;
