/*
  Warnings:

  - Added the required column `randomInt` to the `libraryActivityInfos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `libraryactivityinfos` ADD COLUMN `randomInt` INTEGER NOT NULL;
