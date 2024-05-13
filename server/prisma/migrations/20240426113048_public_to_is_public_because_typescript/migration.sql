/*
  Warnings:

  - You are about to drop the column `public` on the `documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "public",
ADD COLUMN     "isPublic" BOOLEAN;
