-- CreateTable
CREATE TABLE "documentSubmittedResponses" (
    "assignmentId" INTEGER NOT NULL,
    "docVersionId" INTEGER NOT NULL,
    "docId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "answerId" TEXT NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "documentSubmittedResponses_pkey" PRIMARY KEY ("assignmentId","docVersionId","docId","userId","answerId")
);

-- CreateIndex
CREATE INDEX "documentSubmittedResponses_assignmentId_docVersionId_docId_idx" ON "documentSubmittedResponses"("assignmentId", "docVersionId", "docId");

-- CreateIndex
CREATE INDEX "documentSubmittedResponses_userId_idx" ON "documentSubmittedResponses"("userId");

-- AddForeignKey
ALTER TABLE "documentSubmittedResponses" ADD CONSTRAINT "documentSubmittedResponses_assignmentId_docVersionId_docId_fkey" FOREIGN KEY ("assignmentId", "docVersionId", "docId") REFERENCES "assignmentDocuments"("assignmentId", "docVersionId", "docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentSubmittedResponses" ADD CONSTRAINT "documentSubmittedResponses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;
