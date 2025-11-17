/*
  Warnings:

  - You are about to drop the column `rootSharedId` on the `contentShares` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `contentShares` DROP COLUMN `rootSharedId`,
    ADD COLUMN `isRootShare` BOOLEAN NOT NULL DEFAULT false;
