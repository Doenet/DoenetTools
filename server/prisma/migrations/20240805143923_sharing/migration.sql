-- AlterTable
ALTER TABLE `contributorHistory` ADD COLUMN `withLicenseCode` VARCHAR(10) NULL;

-- CreateTable
CREATE TABLE `contentShares` (
    `contentId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `contentShares_userId_idx`(`userId`),
    PRIMARY KEY (`contentId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contributorHistory` ADD CONSTRAINT `contributorHistory_withLicenseCode_fkey` FOREIGN KEY (`withLicenseCode`) REFERENCES `licenses`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contentShares` ADD CONSTRAINT `contentShares_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contentShares` ADD CONSTRAINT `contentShares_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
