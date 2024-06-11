-- CreateTable
CREATE TABLE `activities` (
    `activityId` INTEGER NOT NULL AUTO_INCREMENT,
    `ownerId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastEdited` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imagePath` VARCHAR(191) NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `activities_activityId_key`(`activityId`),
    INDEX `activities_ownerId_idx`(`ownerId`),
    PRIMARY KEY (`activityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignmentDocuments` (
    `assignmentId` INTEGER NOT NULL,
    `docId` INTEGER NOT NULL,
    `docVersionId` INTEGER NOT NULL,

    INDEX `assignmentDocuments_assignmentId_idx`(`assignmentId`),
    INDEX `assignmentDocuments_docId_docVersionId_idx`(`docId`, `docVersionId`),
    PRIMARY KEY (`assignmentId`, `docId`, `docVersionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignments` (
    `assignmentId` INTEGER NOT NULL AUTO_INCREMENT,
    `classCode` VARCHAR(45) NULL,
    `codeValidUntil` DATETIME(3) NULL,
    `activityId` INTEGER NOT NULL,
    `ownerId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `imagePath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `assignments_assignmentId_key`(`assignmentId`),
    INDEX `assignments_activityId_idx`(`activityId`),
    INDEX `assignments_ownerId_idx`(`ownerId`),
    INDEX `assignments_classCode_idx`(`classCode`),
    PRIMARY KEY (`assignmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentVersions` (
    `docId` INTEGER NOT NULL,
    `version` INTEGER NOT NULL,
    `cid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `activityName` VARCHAR(191) NOT NULL,
    `content` MEDIUMTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `doenetmlVersionId` INTEGER NOT NULL,

    INDEX `documentVersions_docId_idx`(`docId`),
    UNIQUE INDEX `documentVersions_docId_cid_key`(`docId`, `cid`),
    PRIMARY KEY (`docId`, `version`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `docId` INTEGER NOT NULL AUTO_INCREMENT,
    `activityId` INTEGER NOT NULL,
    `content` MEDIUMTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastEdited` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `doenetmlVersionId` INTEGER NOT NULL,

    UNIQUE INDEX `documents_docId_key`(`docId`),
    PRIMARY KEY (`docId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contributorHistory` (
    `docId` INTEGER NOT NULL,
    `prevDocId` INTEGER NOT NULL,
    `prevDocVersion` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `contributorHistory_prevDocId_prevDocVersion_idx`(`prevDocId`, `prevDocVersion`),
    PRIMARY KEY (`docId`, `prevDocId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doenetmlVersions` (
    `versionId` INTEGER NOT NULL AUTO_INCREMENT,
    `displayedVersion` VARCHAR(191) NOT NULL,
    `fullVersion` VARCHAR(191) NOT NULL,
    `default` BOOLEAN NOT NULL DEFAULT false,
    `deprecated` BOOLEAN NOT NULL DEFAULT false,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `deprecationMessage` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `doenetmlVersions_versionId_key`(`versionId`),
    UNIQUE INDEX `doenetmlVersions_displayedVersion_key`(`displayedVersion`),
    PRIMARY KEY (`versionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignmentScores` (
    `assignmentId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,

    INDEX `assignmentScores_assignmentId_idx`(`assignmentId`),
    INDEX `assignmentScores_userId_idx`(`userId`),
    PRIMARY KEY (`assignmentId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentState` (
    `assignmentId` INTEGER NOT NULL,
    `docId` INTEGER NOT NULL,
    `docVersionId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `isLatest` BOOLEAN NOT NULL DEFAULT true,
    `hasMaxScore` BOOLEAN NOT NULL DEFAULT false,
    `state` MEDIUMTEXT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,

    INDEX `documentState_assignmentId_docId_docVersionId_idx`(`assignmentId`, `docId`, `docVersionId`),
    INDEX `documentState_userId_idx`(`userId`),
    UNIQUE INDEX `documentState_assignmentId_docId_docVersionId_userId_hasMaxS_key`(`assignmentId`, `docId`, `docVersionId`, `userId`, `hasMaxScore`),
    PRIMARY KEY (`assignmentId`, `docId`, `docVersionId`, `userId`, `isLatest`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentSubmittedResponses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assignmentId` INTEGER NOT NULL,
    `docId` INTEGER NOT NULL,
    `docVersionId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `answerId` VARCHAR(191) NOT NULL,
    `response` TEXT NOT NULL,
    `answerNumber` INTEGER NULL,
    `itemNumber` INTEGER NOT NULL,
    `creditAchieved` DOUBLE NOT NULL,
    `itemCreditAchieved` DOUBLE NOT NULL,
    `documentCreditAchieved` DOUBLE NOT NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `documentSubmittedResponses_assignmentId_docId_docVersionId_a_idx`(`assignmentId`, `docId`, `docVersionId`, `answerId`),
    INDEX `documentSubmittedResponses_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(45) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    `anonymous` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `assignmentDocuments` ADD CONSTRAINT `assignmentDocuments_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `assignments`(`assignmentId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `assignmentDocuments` ADD CONSTRAINT `assignmentDocuments_docId_docVersionId_fkey` FOREIGN KEY (`docId`, `docVersionId`) REFERENCES `documentVersions`(`docId`, `version`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `activities`(`activityId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentVersions` ADD CONSTRAINT `documentVersions_docId_fkey` FOREIGN KEY (`docId`) REFERENCES `documents`(`docId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentVersions` ADD CONSTRAINT `documentVersions_doenetmlVersionId_fkey` FOREIGN KEY (`doenetmlVersionId`) REFERENCES `doenetmlVersions`(`versionId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `activities`(`activityId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_doenetmlVersionId_fkey` FOREIGN KEY (`doenetmlVersionId`) REFERENCES `doenetmlVersions`(`versionId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contributorHistory` ADD CONSTRAINT `contributorHistory_docId_fkey` FOREIGN KEY (`docId`) REFERENCES `documents`(`docId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `contributorHistory` ADD CONSTRAINT `contributorHistory_prevDocId_prevDocVersion_fkey` FOREIGN KEY (`prevDocId`, `prevDocVersion`) REFERENCES `documentVersions`(`docId`, `version`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `assignmentScores` ADD CONSTRAINT `assignmentScores_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `assignments`(`assignmentId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `assignmentScores` ADD CONSTRAINT `assignmentScores_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentState` ADD CONSTRAINT `documentState_assignmentId_userId_fkey` FOREIGN KEY (`assignmentId`, `userId`) REFERENCES `assignmentScores`(`assignmentId`, `userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentState` ADD CONSTRAINT `documentState_assignmentId_docId_docVersionId_fkey` FOREIGN KEY (`assignmentId`, `docId`, `docVersionId`) REFERENCES `assignmentDocuments`(`assignmentId`, `docId`, `docVersionId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentState` ADD CONSTRAINT `documentState_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentSubmittedResponses` ADD CONSTRAINT `documentSubmittedResponses_assignmentId_docId_docVersionId_fkey` FOREIGN KEY (`assignmentId`, `docId`, `docVersionId`) REFERENCES `assignmentDocuments`(`assignmentId`, `docId`, `docVersionId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `documentSubmittedResponses` ADD CONSTRAINT `documentSubmittedResponses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;
