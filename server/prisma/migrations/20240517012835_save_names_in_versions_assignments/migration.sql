/*
  Warnings:

  - Added the required column `name` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activityName` to the `documentVersions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `documentVersions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "documentVersions" ADD COLUMN     "activityName" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
