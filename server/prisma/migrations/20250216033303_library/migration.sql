-- AlterTable
ALTER TABLE `users` ADD COLUMN `isLibrary` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `libraryActivityInfos` (
    `sourceId` BINARY(16) NOT NULL,
    `activityId` BINARY(16) NULL,
    `ownerRequested` BOOLEAN NOT NULL,
    `status` ENUM('PENDING_REVIEW', 'REQUEST_REMOVED', 'PUBLISHED', 'NEEDS_REVISION') NOT NULL,
    `comments` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `libraryActivityInfos_activityId_key`(`activityId`),
    PRIMARY KEY (`sourceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `libraryEvents` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(),1)),
    `sourceId` BINARY(16) NOT NULL,
    `activityId` BINARY(16) NULL,
    `eventType` ENUM('SUBMIT_REQUEST', 'CANCEL_REQUEST', 'ADD_DRAFT', 'DELETE_DRAFT', 'PUBLISH', 'UNPUBLISH', 'MARK_NEEDS_REVISION', 'MODIFY_COMMENTS') NOT NULL,
    `dateTime` DATETIME(3) NOT NULL,
    `comments` VARCHAR(191) NOT NULL DEFAULT '',
    `userId` BINARY(16) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `libraryActivityInfos` ADD CONSTRAINT `libraryActivityInfos_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryActivityInfos` ADD CONSTRAINT `libraryActivityInfos_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
