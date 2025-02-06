-- AlterTable
ALTER TABLE `content` ADD COLUMN `activityLevelAttempts` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `itemLevelAttempts` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `numToSelect` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    ADD COLUMN `paginate` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `selectByVariant` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `shuffle` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `type` ENUM('singleDoc', 'select', 'sequence', 'folder') NOT NULL DEFAULT 'singleDoc';
