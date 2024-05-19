
-- AlterTable
ALTER TABLE "documentVersions" RENAME COLUMN "contentLocation" TO "content";

-- AlterTable
ALTER TABLE "documents" RENAME COLUMN "contentLocation" TO "content";

-- CreateIndex
CREATE INDEX "assignments_classCode_idx" ON "assignments"("classCode");
