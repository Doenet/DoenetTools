/*
  Warnings:

  - Added the required column `docId` to the `contentItemState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contentItemState` ADD COLUMN `docId` BINARY(16) NOT NULL;
