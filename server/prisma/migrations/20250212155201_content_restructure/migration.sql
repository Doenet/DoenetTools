/*
  Warnings:

  - Added the required column `baseComponentCounts` to the `documentVersions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseComponentCounts` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `content` ADD COLUMN `activityLevelAttempts` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `itemLevelAttempts` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `numToSelect` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    ADD COLUMN `paginate` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `selectByVariant` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `shuffle` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `type` ENUM('singleDoc', 'select', 'sequence', 'folder') NOT NULL DEFAULT 'singleDoc';

-- AlterTable
ALTER TABLE `documentVersions` ADD COLUMN `baseComponentCounts` TEXT NOT NULL,
    ADD COLUMN `numVariants` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `documents` ADD COLUMN `baseComponentCounts` TEXT NOT NULL,
    ADD COLUMN `numVariants` INTEGER NOT NULL DEFAULT 1;
