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
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1)),
    `ownerId` BINARY(16) NOT NULL,
    `isFolder` BOOLEAN NOT NULL,
    `parentId` BINARY(16) NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastEdited` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imagePath` VARCHAR(191) NULL,
    `isAssigned` BOOLEAN NOT NULL DEFAULT false,
    `classCode` VARCHAR(45) NULL,
    `codeValidUntil` DATETIME(3) NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `sortIndex` BIGINT NOT NULL,
    `licenseCode` VARCHAR(10) NULL DEFAULT 'CCDUAL',

    INDEX `content_ownerId_parentId_sortIndex_idx`(`ownerId`, `parentId`, `sortIndex`),
    INDEX `content_classCode_idx`(`classCode`),
    INDEX `content_parentId_isFolder_idx`(`parentId`, `isFolder`),
    FULLTEXT INDEX `content_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1)),
    `activityId` BINARY(16) NOT NULL,
    `source` MEDIUMTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastEdited` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `assignedVersionNum` INTEGER NULL,
    `doenetmlVersionId` INTEGER NOT NULL,

    UNIQUE INDEX `documents_id_assignedVersionNum_key`(`id`, `assignedVersionNum`),
    FULLTEXT INDEX `documents_source_idx`(`source`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentVersions` (
    `docId` BINARY(16) NOT NULL,
    `versionNum` INTEGER NOT NULL,
    `cid` VARCHAR(191) NOT NULL,
    `source` MEDIUMTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `doenetmlVersionId` INTEGER NOT NULL,

    INDEX `documentVersions_docId_idx`(`docId`),
    UNIQUE INDEX `documentVersions_docId_cid_key`(`docId`, `cid`),
    PRIMARY KEY (`docId`, `versionNum`)
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
CREATE TABLE `contributorHistory` (
    `docId` BINARY(16) NOT NULL,
    `prevDocId` BINARY(16) NOT NULL,
    `prevDocVersionNum` INTEGER NOT NULL,
    `withLicenseCode` VARCHAR(10) NULL,
    `timestampDoc` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timestampPrevDoc` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `contributorHistory_prevDocId_prevDocVersionNum_idx`(`prevDocId`, `prevDocVersionNum`),
    PRIMARY KEY (`docId`, `prevDocId`)
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

    UNIQUE INDEX `doenetmlVersions_id_key`(`id`),
    UNIQUE INDEX `doenetmlVersions_displayedVersion_key`(`displayedVersion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignmentScores` (
    `activityId` BINARY(16) NOT NULL,
    `userId` BINARY(16) NOT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,

    INDEX `assignmentScores_activityId_idx`(`activityId`),
    INDEX `assignmentScores_userId_idx`(`userId`),
    PRIMARY KEY (`activityId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentState` (
    `activityId` BINARY(16) NOT NULL,
    `docId` BINARY(16) NOT NULL,
    `docVersionNum` INTEGER NOT NULL,
    `userId` BINARY(16) NOT NULL,
    `isLatest` BOOLEAN NOT NULL DEFAULT true,
    `hasMaxScore` BOOLEAN NOT NULL DEFAULT false,
    `state` MEDIUMTEXT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,

    INDEX `documentState_activityId_docId_docVersionNum_idx`(`activityId`, `docId`, `docVersionNum`),
    INDEX `documentState_userId_idx`(`userId`),
    UNIQUE INDEX `documentState_activityId_docId_docVersionNum_userId_hasMaxSc_key`(`activityId`, `docId`, `docVersionNum`, `userId`, `hasMaxScore`),
    PRIMARY KEY (`activityId`, `docId`, `docVersionNum`, `userId`, `isLatest`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentSubmittedResponses` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1)),
    `activityId` BINARY(16) NOT NULL,
    `docId` BINARY(16) NOT NULL,
    `docVersionNum` INTEGER NOT NULL,
    `userId` BINARY(16) NOT NULL,
    `answerId` VARCHAR(191) NOT NULL,
    `response` TEXT NOT NULL,
    `answerNumber` INTEGER NULL,
    `itemNumber` INTEGER NOT NULL,
    `creditAchieved` DOUBLE NOT NULL,
    `itemCreditAchieved` DOUBLE NOT NULL,
    `documentCreditAchieved` DOUBLE NOT NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `documentSubmittedResponses_activityId_docId_docVersionNum_an_idx`(`activityId`, `docId`, `docVersionNum`, `answerId`),
    INDEX `documentSubmittedResponses_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `userId` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1)),
    `email` VARCHAR(191) NOT NULL,
    `firstNames` VARCHAR(191) NULL,
    `lastNames` VARCHAR(191) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    `isAnonymous` BOOLEAN NOT NULL DEFAULT false,
    `cardView` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `users_email_key`(`email`),
    FULLTEXT INDEX `users_firstNames_lastNames_idx`(`firstNames`, `lastNames`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotedContentGroups` (
    `promotedGroupId` INTEGER NOT NULL AUTO_INCREMENT,
    `groupName` VARCHAR(191) NOT NULL,
    `currentlyFeatured` BOOLEAN NOT NULL DEFAULT false,
    `homepage` BOOLEAN NOT NULL DEFAULT false,
    `sortIndex` BIGINT NOT NULL,

    UNIQUE INDEX `promotedContentGroups_groupName_key`(`groupName`),
    PRIMARY KEY (`promotedGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotedContent` (
    `activityId` BINARY(16) NOT NULL,
    `promotedGroupId` INTEGER NOT NULL,
    `sortIndex` BIGINT NOT NULL,

    PRIMARY KEY (`activityId`, `promotedGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contentClassifications` (
    `contentId` BINARY(16) NOT NULL,
    `classificationId` INTEGER NOT NULL,

    PRIMARY KEY (`contentId`, `classificationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `systemId` INTEGER NOT NULL,
    `category` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `grade` VARCHAR(191) NULL,

    UNIQUE INDEX `classifications_code_systemId_key`(`code`, `systemId`),
    FULLTEXT INDEX `classifications_code_category_description_idx`(`code`, `category`, `description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classificationSystems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `classificationSystems_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_licenseCode_fkey` FOREIGN KEY (`licenseCode`) REFERENCES `licenses`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_id_assignedVersionNum_fkey` FOREIGN KEY (`id`, `assignedVersionNum`) REFERENCES `documentVersions`(`docId`, `versionNum`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_doenetmlVersionId_fkey` FOREIGN KEY (`doenetmlVersionId`) REFERENCES `doenetmlVersions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentVersions` ADD CONSTRAINT `documentVersions_docId_fkey` FOREIGN KEY (`docId`) REFERENCES `documents`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentVersions` ADD CONSTRAINT `documentVersions_doenetmlVersionId_fkey` FOREIGN KEY (`doenetmlVersionId`) REFERENCES `doenetmlVersions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `licenseCompositions` ADD CONSTRAINT `licenseCompositions_composedOfCode_fkey` FOREIGN KEY (`composedOfCode`) REFERENCES `licenses`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `licenseCompositions` ADD CONSTRAINT `licenseCompositions_includedInCode_fkey` FOREIGN KEY (`includedInCode`) REFERENCES `licenses`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contributorHistory` ADD CONSTRAINT `contributorHistory_docId_fkey` FOREIGN KEY (`docId`) REFERENCES `documents`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contributorHistory` ADD CONSTRAINT `contributorHistory_prevDocId_prevDocVersionNum_fkey` FOREIGN KEY (`prevDocId`, `prevDocVersionNum`) REFERENCES `documentVersions`(`docId`, `versionNum`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contributorHistory` ADD CONSTRAINT `contributorHistory_withLicenseCode_fkey` FOREIGN KEY (`withLicenseCode`) REFERENCES `licenses`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contentShares` ADD CONSTRAINT `contentShares_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contentShares` ADD CONSTRAINT `contentShares_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `assignmentScores` ADD CONSTRAINT `assignmentScores_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `content`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `assignmentScores` ADD CONSTRAINT `assignmentScores_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentState` ADD CONSTRAINT `documentState_activityId_userId_fkey` FOREIGN KEY (`activityId`, `userId`) REFERENCES `assignmentScores`(`activityId`, `userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentState` ADD CONSTRAINT `documentState_docId_docVersionNum_fkey` FOREIGN KEY (`docId`, `docVersionNum`) REFERENCES `documentVersions`(`docId`, `versionNum`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentState` ADD CONSTRAINT `documentState_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentSubmittedResponses` ADD CONSTRAINT `documentSubmittedResponses_docId_docVersionNum_fkey` FOREIGN KEY (`docId`, `docVersionNum`) REFERENCES `documentVersions`(`docId`, `versionNum`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentSubmittedResponses` ADD CONSTRAINT `documentSubmittedResponses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `promotedContent` ADD CONSTRAINT `promotedContent_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotedContent` ADD CONSTRAINT `promotedContent_promotedGroupId_fkey` FOREIGN KEY (`promotedGroupId`) REFERENCES `promotedContentGroups`(`promotedGroupId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contentClassifications` ADD CONSTRAINT `contentClassifications_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contentClassifications` ADD CONSTRAINT `contentClassifications_classificationId_fkey` FOREIGN KEY (`classificationId`) REFERENCES `classifications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classifications` ADD CONSTRAINT `classifications_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `classificationSystems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
