/*
  Warnings:

  - You are about to drop the column `imagePath` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the `activityItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `activityId` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activityItems" DROP CONSTRAINT "activityItems_activityId_fkey";

-- DropForeignKey
ALTER TABLE "activityItems" DROP CONSTRAINT "activityItems_docId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_ownerId_fkey";

-- DropIndex
DROP INDEX "documents_ownerId_idx";

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "imagePath",
DROP COLUMN "isPublic",
DROP COLUMN "ownerId",
ADD COLUMN     "activityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "activityItems";

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("activityId") ON DELETE NO ACTION ON UPDATE NO ACTION;
