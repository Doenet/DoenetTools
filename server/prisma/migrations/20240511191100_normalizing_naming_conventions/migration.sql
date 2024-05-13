/*
  Warnings:

  - You are about to drop the column `owner` on the `activities` table. All the data in the column will be lost.
  - The primary key for the `assignmentItems` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `docVersion` on the `assignmentItems` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `doenetmlVersion` on the `documentVersions` table. All the data in the column will be lost.
  - You are about to drop the column `doenetmlVersion` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `documents` table. All the data in the column will be lost.
  - The primary key for the `studentItemResponses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `docVersion` on the `studentItemResponses` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docVersionId` to the `assignmentItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doenetmlVersionId` to the `documentVersions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doenetmlVersionId` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docVersionId` to the `studentItemResponses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "fk_assignments_users1";

-- DropForeignKey
ALTER TABLE "assignmentItems" DROP CONSTRAINT "fk_assignments_has_documentVersions_documentVersions1";

-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "fk_assignments_users2";

-- DropForeignKey
ALTER TABLE "documentVersions" DROP CONSTRAINT "fk_documentVersions_doenetmlVersions";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "fk_activities_users";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "fk_documents_doenetmlVersions";

-- DropForeignKey
ALTER TABLE "studentItemResponses" DROP CONSTRAINT "fk_assignmentItems_has_users_assignmentItems1";

-- DropIndex
DROP INDEX "fk_assignments_users1_idx";

-- DropIndex
DROP INDEX "fk_assignments_has_documentVersions_documentVersions1_idx";

-- DropIndex
DROP INDEX "fk_assignments_users2_idx";

-- DropIndex
DROP INDEX "fk_activities_users_idx";

-- DropIndex
DROP INDEX "fk_assignmentItems_has_users_assignmentItems1_idx";

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "owner",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "assignmentItems" DROP CONSTRAINT "assignmentItems_pkey",
DROP COLUMN "docVersion",
ADD COLUMN     "docVersionId" INTEGER NOT NULL,
ADD CONSTRAINT "assignmentItems_pkey" PRIMARY KEY ("assignmentId", "docVersionId", "docId");

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "owner",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "documentVersions" DROP COLUMN "doenetmlVersion",
ADD COLUMN     "doenetmlVersionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "doenetmlVersion",
DROP COLUMN "owner",
ADD COLUMN     "doenetmlVersionId" INTEGER NOT NULL,
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "studentItemResponses" DROP CONSTRAINT "studentItemResponses_pkey",
DROP COLUMN "docVersion",
ADD COLUMN     "docVersionId" INTEGER NOT NULL,
ADD CONSTRAINT "studentItemResponses_pkey" PRIMARY KEY ("assignmentId", "docVersionId", "docId", "userId");

-- CreateIndex
CREATE INDEX "activities_ownerId_idx" ON "activities"("ownerId");

-- CreateIndex
CREATE INDEX "assignmentItems_docVersionId_docId_idx" ON "assignmentItems"("docVersionId", "docId");

-- CreateIndex
CREATE INDEX "assignments_ownerId_idx" ON "assignments"("ownerId");

-- CreateIndex
CREATE INDEX "documents_ownerId_idx" ON "documents"("ownerId");

-- CreateIndex
CREATE INDEX "studentItemResponses_assignmentId_docVersionId_docId_idx" ON "studentItemResponses"("assignmentId", "docVersionId", "docId");

-- RenameForeignKey
ALTER TABLE "activityItems" RENAME CONSTRAINT "fk_activities_has_documents_activities1" TO "activityItems_activityId_fkey";

-- RenameForeignKey
ALTER TABLE "activityItems" RENAME CONSTRAINT "fk_activities_has_documents_documents1" TO "activityItems_docId_fkey";

-- RenameForeignKey
ALTER TABLE "assignmentItems" RENAME CONSTRAINT "fk_assignments_has_documentVersions_assignments1" TO "assignmentItems_assignmentId_fkey";

-- RenameForeignKey
ALTER TABLE "assignments" RENAME CONSTRAINT "fk_assignments_activities1" TO "assignments_activityId_fkey";

-- RenameForeignKey
ALTER TABLE "documentVersions" RENAME CONSTRAINT "fk_documents_activities1" TO "documentVersions_docId_fkey";

-- RenameForeignKey
ALTER TABLE "studentAssignmentResponses" RENAME CONSTRAINT "fk_assignments_has_users_assignments1" TO "studentAssignmentResponses_assignmentId_fkey";

-- RenameForeignKey
ALTER TABLE "studentAssignmentResponses" RENAME CONSTRAINT "fk_assignments_has_users_users1" TO "studentAssignmentResponses_userId_fkey";

-- RenameForeignKey
ALTER TABLE "studentItemResponses" RENAME CONSTRAINT "fk_assignmentItems_has_users_users1" TO "studentItemResponses_userId_fkey";

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignmentItems" ADD CONSTRAINT "assignmentItems_docVersionId_docId_fkey" FOREIGN KEY ("docVersionId", "docId") REFERENCES "documentVersions"("version", "docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentVersions" ADD CONSTRAINT "documentVersions_doenetmlVersionId_fkey" FOREIGN KEY ("doenetmlVersionId") REFERENCES "doenetmlVersions"("versionId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_doenetmlVersionId_fkey" FOREIGN KEY ("doenetmlVersionId") REFERENCES "doenetmlVersions"("versionId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "studentItemResponses" ADD CONSTRAINT "studentItemResponses_assignmentId_docVersionId_docId_fkey" FOREIGN KEY ("assignmentId", "docVersionId", "docId") REFERENCES "assignmentItems"("assignmentId", "docVersionId", "docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- RenameIndex
ALTER INDEX "activityId_UNIQUE" RENAME TO "activities_activityId_key";

-- RenameIndex
ALTER INDEX "fk_activities_has_documents_activities1_idx" RENAME TO "activityItems_activityId_idx";

-- RenameIndex
ALTER INDEX "fk_activities_has_documents_documents1_idx" RENAME TO "activityItems_docId_idx";

-- RenameIndex
ALTER INDEX "fk_assignments_has_documentVersions_assignments1_idx" RENAME TO "assignmentItems_assignmentId_idx";

-- RenameIndex
ALTER INDEX "assignmentId_UNIQUE" RENAME TO "assignments_assignmentId_key";

-- RenameIndex
ALTER INDEX "fk_assignments_activities1_idx" RENAME TO "assignments_activityId_idx";

-- RenameIndex
ALTER INDEX "fk_documents_activities1_idx" RENAME TO "documentVersions_docId_idx";

-- RenameIndex
ALTER INDEX "docId_UNIQUE" RENAME TO "documents_docId_key";

-- RenameIndex
ALTER INDEX "displayedVersion_UNIQUE" RENAME TO "doenetmlVersions_displayedVersion_key";

-- RenameIndex
ALTER INDEX "versionId_UNIQUE" RENAME TO "doenetmlVersions_versionId_key";

-- RenameIndex
ALTER INDEX "fk_assignments_has_users_assignments1_idx" RENAME TO "studentAssignmentResponses_assignmentId_idx";

-- RenameIndex
ALTER INDEX "fk_assignments_has_users_users1_idx" RENAME TO "studentAssignmentResponses_userId_idx";

-- RenameIndex
ALTER INDEX "fk_assignmentItems_has_users_users1_idx" RENAME TO "studentItemResponses_userId_idx";

-- RenameIndex
ALTER INDEX "email_UNIQUE" RENAME TO "users_email_key";
