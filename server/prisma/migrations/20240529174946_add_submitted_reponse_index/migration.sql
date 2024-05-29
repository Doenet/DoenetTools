-- DropIndex
DROP INDEX "documentSubmittedResponses_assignmentId_docVersionId_docId_idx";

-- CreateIndex
CREATE INDEX "documentSubmittedResponses_assignmentId_docVersionId_docId__idx" ON "documentSubmittedResponses"("assignmentId", "docVersionId", "docId", "answerId");
