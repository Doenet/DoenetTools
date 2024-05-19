/*
  Warnings:

  - You are about to drop the `assignmentItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `studentAssignmentResponses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `studentItemResponses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assignmentItems" DROP CONSTRAINT "assignmentItems_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "assignmentItems" DROP CONSTRAINT "assignmentItems_docVersionId_docId_fkey";

-- DropForeignKey
ALTER TABLE "studentAssignmentResponses" DROP CONSTRAINT "studentAssignmentResponses_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "studentAssignmentResponses" DROP CONSTRAINT "studentAssignmentResponses_userId_fkey";

-- DropForeignKey
ALTER TABLE "studentItemResponses" DROP CONSTRAINT "studentItemResponses_assignmentId_docVersionId_docId_fkey";

-- DropForeignKey
ALTER TABLE "studentItemResponses" DROP CONSTRAINT "studentItemResponses_userId_fkey";

-- DropTable
DROP TABLE "assignmentItems";

-- DropTable
DROP TABLE "studentAssignmentResponses";

-- DropTable
DROP TABLE "studentItemResponses";

-- CreateTable
CREATE TABLE "assignmentDocuments" (
    "assignmentId" INTEGER NOT NULL,
    "docVersionId" INTEGER NOT NULL,
    "docId" INTEGER NOT NULL,

    CONSTRAINT "assignmentDocuments_pkey" PRIMARY KEY ("assignmentId","docVersionId","docId")
);

-- CreateTable
CREATE TABLE "assignmentScores" (
    "assignmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "assignmentScores_pkey" PRIMARY KEY ("assignmentId","userId")
);

-- CreateTable
CREATE TABLE "documentState" (
    "assignmentId" INTEGER NOT NULL,
    "docVersionId" INTEGER NOT NULL,
    "docId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "state" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "documentState_pkey" PRIMARY KEY ("assignmentId","docVersionId","docId","userId")
);

-- CreateIndex
CREATE INDEX "assignmentDocuments_assignmentId_idx" ON "assignmentDocuments"("assignmentId");

-- CreateIndex
CREATE INDEX "assignmentDocuments_docVersionId_docId_idx" ON "assignmentDocuments"("docVersionId", "docId");

-- CreateIndex
CREATE INDEX "assignmentScores_assignmentId_idx" ON "assignmentScores"("assignmentId");

-- CreateIndex
CREATE INDEX "assignmentScores_userId_idx" ON "assignmentScores"("userId");

-- CreateIndex
CREATE INDEX "documentState_assignmentId_docVersionId_docId_idx" ON "documentState"("assignmentId", "docVersionId", "docId");

-- CreateIndex
CREATE INDEX "documentState_userId_idx" ON "documentState"("userId");

-- AddForeignKey
ALTER TABLE "assignmentDocuments" ADD CONSTRAINT "assignmentDocuments_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("assignmentId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignmentDocuments" ADD CONSTRAINT "assignmentDocuments_docVersionId_docId_fkey" FOREIGN KEY ("docVersionId", "docId") REFERENCES "documentVersions"("version", "docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignmentScores" ADD CONSTRAINT "assignmentScores_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("assignmentId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignmentScores" ADD CONSTRAINT "assignmentScores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentState" ADD CONSTRAINT "documentState_assignmentId_docVersionId_docId_fkey" FOREIGN KEY ("assignmentId", "docVersionId", "docId") REFERENCES "assignmentDocuments"("assignmentId", "docVersionId", "docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentState" ADD CONSTRAINT "documentState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;
