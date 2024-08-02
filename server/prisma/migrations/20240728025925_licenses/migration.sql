-- AlterTable
ALTER TABLE `content` ADD COLUMN `licenseCode` VARCHAR(10) NULL;

-- CreateTable
CREATE TABLE `licenses` (
    `code` VARCHAR(10) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `imageURL` VARCHAR(191) NULL,
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

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_licenseCode_fkey` FOREIGN KEY (`licenseCode`) REFERENCES `licenses`(`code`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `licenseCompositions` ADD CONSTRAINT `licenseCompositions_composedOfCode_fkey` FOREIGN KEY (`composedOfCode`) REFERENCES `licenses`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `licenseCompositions` ADD CONSTRAINT `licenseCompositions_includedInCode_fkey` FOREIGN KEY (`includedInCode`) REFERENCES `licenses`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
