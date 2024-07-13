-- CreateTable
CREATE TABLE `contentKeyword` (
    `contentId` INTEGER NOT NULL,
    `keywordId` INTEGER NOT NULL,

    PRIMARY KEY (`contentId`, `keywordId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `keywordInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contentKeyword` ADD CONSTRAINT `contentKeyword_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contentKeyword` ADD CONSTRAINT `contentKeyword_keywordId_fkey` FOREIGN KEY (`keywordId`) REFERENCES `keywordInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
