-- AlterTable
ALTER TABLE `content` MODIFY `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- AlterTable
ALTER TABLE `documentSubmittedResponses` MODIFY `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- AlterTable
ALTER TABLE `documents` MODIFY `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));

-- AlterTable
ALTER TABLE `users` MODIFY `userId` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid(), 1));
