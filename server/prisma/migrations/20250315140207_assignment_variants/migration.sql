/*
  Warnings:

  - Added the required column `variant` to the `contentItemState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant` to the `contentState` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assignments` ADD COLUMN `individualizeByStudent` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `contentItemState` ADD COLUMN `variant` MEDIUMINT UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `contentState` ADD COLUMN `variant` MEDIUMINT UNSIGNED NOT NULL;
