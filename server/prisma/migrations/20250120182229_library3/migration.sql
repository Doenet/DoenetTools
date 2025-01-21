/*
  Warnings:

  - The values [REQUEST_REMOVED_BY_OWNER] on the enum `libraryActivityInfos_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `content` MODIFY `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- AlterTable
ALTER TABLE `documentSubmittedResponses` MODIFY `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- AlterTable
ALTER TABLE `documents` MODIFY `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- AlterTable
ALTER TABLE `libraryActivityInfos` MODIFY `status` ENUM('PENDING_REVIEW', 'REQUEST_REMOVED', 'PUBLISHED', 'NEEDS_REVISION') NOT NULL;

-- AlterTable
ALTER TABLE `libraryEvents` MODIFY `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- AlterTable
ALTER TABLE `users` MODIFY `userId` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));
