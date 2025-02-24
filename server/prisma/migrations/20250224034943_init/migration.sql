-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sid` VARCHAR(191) NOT NULL,
    `data` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sid_key`(`sid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(),1)),
    `type` ENUM('singleDoc', 'select', 'sequence', 'folder') NOT NULL DEFAULT 'singleDoc',
    `ownerId` BINARY(16) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `parentId` BINARY(16) NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sortIndex` BIGINT NOT NULL,
    `licenseCode` VARCHAR(10) NULL DEFAULT 'CCDUAL',
    `imagePath` VARCHAR(191) NULL,
    `lastEdited` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `source` MEDIUMTEXT NULL,
    `doenetmlVersionId` INTEGER NULL,
    `numVariants` INTEGER NOT NULL DEFAULT 1,
    `baseComponentCounts` TEXT NULL,
    `shuffle` BOOLEAN NOT NULL DEFAULT false,
    `paginate` BOOLEAN NOT NULL DEFAULT false,
    `activityLevelAttempts` BOOLEAN NOT NULL DEFAULT false,
    `itemLevelAttempts` BOOLEAN NOT NULL DEFAULT false,
    `numToSelect` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    `selectByVariant` BOOLEAN NOT NULL DEFAULT false,
    `isAssigned` BOOLEAN NOT NULL DEFAULT false,
    `assignedRevisionNum` INTEGER NULL,
    `classCode` VARCHAR(45) NULL,
    `codeValidUntil` DATETIME(3) NULL,

    INDEX `content_ownerId_parentId_sortIndex_idx`(`ownerId`, `parentId`, `sortIndex`),
    INDEX `content_classCode_idx`(`classCode`),
    INDEX `content_parentId_type_idx`(`parentId`, `type`),
    UNIQUE INDEX `content_id_assignedRevisionNum_key`(`id`, `assignedRevisionNum`),
    FULLTEXT INDEX `content_name_idx`(`name`),
    FULLTEXT INDEX `content_source_idx`(`source`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recentContent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` BINARY(16) NOT NULL,
    `contentId` BINARY(16) NOT NULL,
    `accessed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mode` ENUM('edit', 'view') NOT NULL,

    UNIQUE INDEX `recentContent_userId_mode_contentId_key`(`userId`, `mode`, `contentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activityRevisions` (
    `contentId` BINARY(16) NOT NULL,
    `revisionNum` INTEGER NOT NULL,
    `cid` VARCHAR(191) NOT NULL,
    `source` MEDIUMTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `numVariants` INTEGER NOT NULL DEFAULT 1,
    `baseComponentCounts` TEXT NULL,
    `doenetmlVersionId` INTEGER NULL,

    UNIQUE INDEX `activityRevisions_contentId_cid_key`(`contentId`, `cid`),
    PRIMARY KEY (`contentId`, `revisionNum`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `licenses` (
    `code` VARCHAR(10) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `imageURL` VARCHAR(191) NULL,
    `smallImageURL` VARCHAR(191) NULL,
    `licenseURL` VARCHAR(191) NULL,
    `sortIndex` INTEGER NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `licenseCompositions` (
    `composedOfCode` VARCHAR(10) NOT NULL,
    `includedInCode` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`composedOfCode`, `includedInCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contentFeatures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `term` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `sortIndex` INTEGER NOT NULL,

    UNIQUE INDEX `contentFeatures_code_key`(`code`),
    UNIQUE INDEX `contentFeatures_term_key`(`term`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contributorHistory` (
    `contentId` BINARY(16) NOT NULL,
    `prevContentId` BINARY(16) NOT NULL,
    `prevActivityRevisionNum` INTEGER NOT NULL,
    `withLicenseCode` VARCHAR(10) NULL,
    `timestampActivity` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timestampPrevActivity` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `directCopy` BOOLEAN NOT NULL DEFAULT false,

    INDEX `contributorHistory_prevContentId_prevActivityRevisionNum_idx`(`prevContentId`, `prevActivityRevisionNum`),
    PRIMARY KEY (`contentId`, `prevContentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contentShares` (
    `contentId` BINARY(16) NOT NULL,
    `userId` BINARY(16) NOT NULL,

    INDEX `contentShares_userId_idx`(`userId`),
    PRIMARY KEY (`contentId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doenetmlVersions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `displayedVersion` VARCHAR(191) NOT NULL,
    `fullVersion` VARCHAR(191) NOT NULL,
    `default` BOOLEAN NOT NULL DEFAULT false,
    `deprecated` BOOLEAN NOT NULL DEFAULT false,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `deprecationMessage` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `doenetmlVersions_displayedVersion_key`(`displayedVersion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignmentScores` (
    `contentId` BINARY(16) NOT NULL,
    `userId` BINARY(16) NOT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,

    INDEX `assignmentScores_contentId_idx`(`contentId`),
    INDEX `assignmentScores_userId_idx`(`userId`),
    PRIMARY KEY (`contentId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activityState` (
    `contentId` BINARY(16) NOT NULL,
    `userId` BINARY(16) NOT NULL,
    `isLatest` BOOLEAN NOT NULL DEFAULT true,
    `hasMaxScore` BOOLEAN NOT NULL DEFAULT false,
    `score` DOUBLE NOT NULL DEFAULT 0,
    `activityRevisionNum` INTEGER NOT NULL,
    `state` MEDIUMTEXT NULL,

    INDEX `activityState_userId_idx`(`userId`),
    UNIQUE INDEX `activityState_contentId_userId_hasMaxScore_key`(`contentId`, `userId`, `hasMaxScore`),
    PRIMARY KEY (`contentId`, `userId`, `isLatest`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submittedResponses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contentId` BINARY(16) NOT NULL,
    `activityRevisionNum` INTEGER NOT NULL,
    `userId` BINARY(16) NOT NULL,
    `answerId` VARCHAR(191) NOT NULL,
    `response` TEXT NOT NULL,
    `answerNumber` INTEGER NULL,
    `itemNumber` INTEGER NOT NULL,
    `creditAchieved` DOUBLE NOT NULL,
    `itemCreditAchieved` DOUBLE NOT NULL,
    `activityCreditAchieved` DOUBLE NOT NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `submittedResponses_contentId_activityRevisionNum_answerId_idx`(`contentId`, `activityRevisionNum`, `answerId`),
    INDEX `submittedResponses_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contentViews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contentId` BINARY(16) NOT NULL,
    `date` DATE NOT NULL DEFAULT (curdate()),
    `userId` BINARY(16) NOT NULL,

    UNIQUE INDEX `contentViews_date_contentId_userId_key`(`date`, `contentId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `userId` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(),1)),
    `email` VARCHAR(191) NOT NULL,
    `firstNames` VARCHAR(191) NULL,
    `lastNames` VARCHAR(191) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    `isLibrary` BOOLEAN NOT NULL DEFAULT false,
    `isAnonymous` BOOLEAN NOT NULL DEFAULT false,
    `cardView` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `users_email_key`(`email`),
    FULLTEXT INDEX `users_firstNames_lastNames_idx`(`firstNames`, `lastNames`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotedContentGroups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupName` VARCHAR(191) NOT NULL,
    `currentlyFeatured` BOOLEAN NOT NULL DEFAULT false,
    `homepage` BOOLEAN NOT NULL DEFAULT false,
    `sortIndex` BIGINT NOT NULL,

    UNIQUE INDEX `promotedContentGroups_groupName_key`(`groupName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotedContent` (
    `contentId` BINARY(16) NOT NULL,
    `promotedGroupId` INTEGER NOT NULL,
    `sortIndex` BIGINT NOT NULL,

    PRIMARY KEY (`contentId`, `promotedGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contentClassifications` (
    `contentId` BINARY(16) NOT NULL,
    `classificationId` INTEGER NOT NULL,

    PRIMARY KEY (`contentId`, `classificationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classificationSystems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shortName` VARCHAR(191) NOT NULL,
    `categoryLabel` VARCHAR(191) NOT NULL,
    `subCategoryLabel` VARCHAR(191) NOT NULL,
    `descriptionLabel` VARCHAR(191) NOT NULL,
    `sortIndex` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `categoriesInDescription` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `classificationSystems_name_key`(`name`),
    UNIQUE INDEX `classificationSystems_shortName_key`(`shortName`),
    FULLTEXT INDEX `classificationSystems_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classificationCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL,
    `systemId` INTEGER NOT NULL,
    `sortIndex` INTEGER NOT NULL,

    UNIQUE INDEX `classificationCategories_category_systemId_key`(`category`, `systemId`),
    FULLTEXT INDEX `classificationCategories_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classificationSubCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `subCategory` TEXT NOT NULL,
    `sortIndex` INTEGER NOT NULL,

    UNIQUE INDEX `classificationSubCategories_subCategory_categoryId_key`(`subCategory`(200), `categoryId`),
    FULLTEXT INDEX `classificationSubCategories_subCategory_idx`(`subCategory`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classificationDescriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subCategoryId` INTEGER NOT NULL,
    `classificationId` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `sortIndex` INTEGER NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `classificationDescriptions_classificationId_subCategoryId_key`(`classificationId`, `subCategoryId`),
    UNIQUE INDEX `classificationDescriptions_description_subCategoryId_key`(`description`(200), `subCategoryId`),
    FULLTEXT INDEX `classificationDescriptions_description_idx`(`description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,

    FULLTEXT INDEX `classifications_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `libraryActivityInfos` (
    `sourceId` BINARY(16) NOT NULL,
    `contentId` BINARY(16) NULL,
    `ownerRequested` BOOLEAN NOT NULL,
    `status` ENUM('PENDING_REVIEW', 'REQUEST_REMOVED', 'PUBLISHED', 'NEEDS_REVISION') NOT NULL,
    `comments` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `libraryActivityInfos_contentId_key`(`contentId`),
    PRIMARY KEY (`sourceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `libraryEvents` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(),1)),
    `sourceId` BINARY(16) NOT NULL,
    `contentId` BINARY(16) NULL,
    `eventType` ENUM('SUBMIT_REQUEST', 'CANCEL_REQUEST', 'ADD_DRAFT', 'DELETE_DRAFT', 'PUBLISH', 'UNPUBLISH', 'MARK_NEEDS_REVISION', 'MODIFY_COMMENTS') NOT NULL,
    `dateTime` DATETIME(3) NOT NULL,
    `comments` VARCHAR(191) NOT NULL DEFAULT '',
    `userId` BINARY(16) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_contentTocontentFeatures` (
    `A` BINARY(16) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_contentTocontentFeatures_AB_unique`(`A`, `B`),
    INDEX `_contentTocontentFeatures_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_licenseCode_fkey` FOREIGN KEY (`licenseCode`) REFERENCES `licenses`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_id_assignedRevisionNum_fkey` FOREIGN KEY (`id`, `assignedRevisionNum`) REFERENCES `activityRevisions`(`contentId`, `revisionNum`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_doenetmlVersionId_fkey` FOREIGN KEY (`doenetmlVersionId`) REFERENCES `doenetmlVersions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recentContent` ADD CONSTRAINT `recentContent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recentContent` ADD CONSTRAINT `recentContent_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `activityRevisions` ADD CONSTRAINT `activityRevisions_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `activityRevisions` ADD CONSTRAINT `activityRevisions_doenetmlVersionId_fkey` FOREIGN KEY (`doenetmlVersionId`) REFERENCES `doenetmlVersions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `licenseCompositions` ADD CONSTRAINT `licenseCompositions_composedOfCode_fkey` FOREIGN KEY (`composedOfCode`) REFERENCES `licenses`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `licenseCompositions` ADD CONSTRAINT `licenseCompositions_includedInCode_fkey` FOREIGN KEY (`includedInCode`) REFERENCES `licenses`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contributorHistory` ADD CONSTRAINT `contributorHistory_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contributorHistory` ADD CONSTRAINT `contributorHistory_prevContentId_prevActivityRevisionNum_fkey` FOREIGN KEY (`prevContentId`, `prevActivityRevisionNum`) REFERENCES `activityRevisions`(`contentId`, `revisionNum`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contributorHistory` ADD CONSTRAINT `contributorHistory_withLicenseCode_fkey` FOREIGN KEY (`withLicenseCode`) REFERENCES `licenses`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contentShares` ADD CONSTRAINT `contentShares_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contentShares` ADD CONSTRAINT `contentShares_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `assignmentScores` ADD CONSTRAINT `assignmentScores_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `assignmentScores` ADD CONSTRAINT `assignmentScores_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `activityState` ADD CONSTRAINT `activityState_contentId_userId_fkey` FOREIGN KEY (`contentId`, `userId`) REFERENCES `assignmentScores`(`contentId`, `userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `activityState` ADD CONSTRAINT `activityState_contentId_activityRevisionNum_fkey` FOREIGN KEY (`contentId`, `activityRevisionNum`) REFERENCES `activityRevisions`(`contentId`, `revisionNum`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `activityState` ADD CONSTRAINT `activityState_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `submittedResponses` ADD CONSTRAINT `submittedResponses_contentId_activityRevisionNum_fkey` FOREIGN KEY (`contentId`, `activityRevisionNum`) REFERENCES `activityRevisions`(`contentId`, `revisionNum`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `submittedResponses` ADD CONSTRAINT `submittedResponses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contentViews` ADD CONSTRAINT `contentViews_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotedContent` ADD CONSTRAINT `promotedContent_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotedContent` ADD CONSTRAINT `promotedContent_promotedGroupId_fkey` FOREIGN KEY (`promotedGroupId`) REFERENCES `promotedContentGroups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contentClassifications` ADD CONSTRAINT `contentClassifications_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contentClassifications` ADD CONSTRAINT `contentClassifications_classificationId_fkey` FOREIGN KEY (`classificationId`) REFERENCES `classifications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classificationCategories` ADD CONSTRAINT `classificationCategories_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `classificationSystems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classificationSubCategories` ADD CONSTRAINT `classificationSubCategories_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `classificationCategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classificationDescriptions` ADD CONSTRAINT `classificationDescriptions_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `classificationSubCategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classificationDescriptions` ADD CONSTRAINT `classificationDescriptions_classificationId_fkey` FOREIGN KEY (`classificationId`) REFERENCES `classifications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryActivityInfos` ADD CONSTRAINT `libraryActivityInfos_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryActivityInfos` ADD CONSTRAINT `libraryActivityInfos_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `libraryEvents` ADD CONSTRAINT `libraryEvents_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_contentTocontentFeatures` ADD CONSTRAINT `_contentTocontentFeatures_A_fkey` FOREIGN KEY (`A`) REFERENCES `content`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_contentTocontentFeatures` ADD CONSTRAINT `_contentTocontentFeatures_B_fkey` FOREIGN KEY (`B`) REFERENCES `contentFeatures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
