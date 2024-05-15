/*
  Warnings:

  - Made the column `name` on table `activities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `activities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastEdited` on table `activities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastEdited` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `documents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "activities" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "lastEdited" SET NOT NULL,
ALTER COLUMN "lastEdited" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "lastEdited" SET NOT NULL,
ALTER COLUMN "lastEdited" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" SET NOT NULL;
