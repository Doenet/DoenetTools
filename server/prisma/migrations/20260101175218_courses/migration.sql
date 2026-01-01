-- AlterTable
ALTER TABLE `content` ADD COLUMN `courseRootId` BINARY(16) NULL;

-- AddForeignKey
ALTER TABLE `content` ADD CONSTRAINT `content_courseRootId_fkey` FOREIGN KEY (`courseRootId`) REFERENCES `content`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
