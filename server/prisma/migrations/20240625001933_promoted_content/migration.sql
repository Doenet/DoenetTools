-- CreateTable
CREATE TABLE `promotedContentGroups` (
    `promotedGroupId` INTEGER NOT NULL AUTO_INCREMENT,
    `groupName` VARCHAR(191) NOT NULL,
    `currentlyFeatured` BOOLEAN NOT NULL DEFAULT false,
    `homepage` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `promotedContentGroups_groupName_key`(`groupName`),
    PRIMARY KEY (`promotedGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotedContent` (
    `activityId` INTEGER NOT NULL,
    `promotedGroupId` INTEGER NOT NULL,
    `sortOrder` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`activityId`, `promotedGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `promotedContent` ADD CONSTRAINT `promotedContent_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `activities`(`activityId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotedContent` ADD CONSTRAINT `promotedContent_promotedGroupId_fkey` FOREIGN KEY (`promotedGroupId`) REFERENCES `promotedContentGroups`(`promotedGroupId`) ON DELETE RESTRICT ON UPDATE CASCADE;
