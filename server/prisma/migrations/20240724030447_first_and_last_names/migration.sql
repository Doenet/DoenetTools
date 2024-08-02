/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `lastNames` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users`
    ADD COLUMN `firstNames` VARCHAR(191) NULL,
    RENAME COLUMN `name` TO `lastNames`;
