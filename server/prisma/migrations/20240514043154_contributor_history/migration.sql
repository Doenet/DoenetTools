/*
  Warnings:

  - A unique constraint covering the columns `[docId,cid]` on the table `documentVersions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentLocation` to the `documentVersions` table without a default value. This is not possible if the table is not empty.
  - Made the column `cid` on table `documentVersions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `documentVersions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contentLocation` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isPublic` on table `documents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isDeleted` on table `documents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "documentVersions" ADD COLUMN     "contentLocation" TEXT NOT NULL,
ALTER COLUMN "cid" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "contentLocation" SET NOT NULL,
ALTER COLUMN "isPublic" SET NOT NULL,
ALTER COLUMN "isPublic" SET DEFAULT false,
ALTER COLUMN "isDeleted" SET NOT NULL,
ALTER COLUMN "isDeleted" SET DEFAULT false;

-- CreateTable
CREATE TABLE "contributorHistory" (
    "docId" INTEGER NOT NULL,
    "prevDocId" INTEGER NOT NULL,
    "prevDocVersion" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contributorHistory_pkey" PRIMARY KEY ("docId","prevDocId")
);

-- CreateIndex
CREATE INDEX "contributorHistory_prevDocId_prevDocVersion_idx" ON "contributorHistory"("prevDocId", "prevDocVersion");

-- CreateIndex
CREATE UNIQUE INDEX "documentVersions_docId_cid_key" ON "documentVersions"("docId", "cid");

-- AddForeignKey
ALTER TABLE "contributorHistory" ADD CONSTRAINT "contributorHistory_docId_fkey" FOREIGN KEY ("docId") REFERENCES "documents"("docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contributorHistory" ADD CONSTRAINT "contributorHistory_prevDocId_prevDocVersion_fkey" FOREIGN KEY ("prevDocId", "prevDocVersion") REFERENCES "documentVersions"("docId", "version") ON DELETE NO ACTION ON UPDATE NO ACTION;
