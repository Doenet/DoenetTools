/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `promotedContent` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `promotedContentGroups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `promotedContent` DROP COLUMN `sortOrder`,
    ADD COLUMN `sortIndex` BIGINT NOT NULL DEFAULT 0;
ALTER TABLE `promotedContent` ALTER COLUMN `sortIndex` DROP DEFAULT;
ALTER TABLE `promotedContentGroups` DROP COLUMN `sortOrder`,
    ADD COLUMN `sortIndex` BIGINT NOT NULL DEFAULT 0;
ALTER TABLE `promotedContentGroups` ALTER COLUMN `sortIndex` DROP DEFAULT;
