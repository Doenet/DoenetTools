-- AlterTable
ALTER TABLE `content` ADD COLUMN `containsVideo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isInteractive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isQuestion` BOOLEAN NOT NULL DEFAULT false;
