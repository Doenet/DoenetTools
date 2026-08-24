-- CreateTable
CREATE TABLE `featureFlags` (
    `name` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL,
    `note` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
