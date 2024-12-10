-- AlterTable
ALTER TABLE `users` ADD COLUMN `isLibrary` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `libraryActivityStatuses` (
    `sourceActivityId` BINARY(16) NOT NULL,
    `libraryActivityId` BINARY(16) NULL,
    `status` ENUM('PENDING_REVIEW', 'NEEDS_REVISION', 'ADDED', 'REVIEW_REQUEST_REMOVED') NOT NULL,
    `comments` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `libraryActivityStatuses_libraryActivityId_key`(`libraryActivityId`),
    PRIMARY KEY (`sourceActivityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `libraryEvents` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1)),
    `eventType` ENUM('SUBMIT_REQUEST', 'CANCEL_REQUEST', 'ADD_DRAFT', 'DELETE_DRAFT', 'PUBLISH', 'MARK_NEEDS_REVISION', 'MODIFY_COMMENTS') NOT NULL,
    `comments` VARCHAR(191) NOT NULL,
    `dateTime` DATETIME(3) NOT NULL,
    `statusId` BINARY(16) NOT NULL,
    `userId` BINARY(16) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `libraryActivityStatuses` ADD CONSTRAINT `libraryActivityStatuses_sourceActivityId_fkey` FOREIGN KEY (`sourceActivityId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryActivityStatuses` ADD CONSTRAINT `libraryActivityStatuses_libraryActivityId_fkey` FOREIGN KEY (`libraryActivityId`) REFERENCES `content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `libraryActivityStatuses`(`sourceActivityId`) ON DELETE RESTRICT ON UPDATE CASCADE;
