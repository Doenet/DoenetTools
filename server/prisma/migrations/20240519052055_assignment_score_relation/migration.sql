-- AddForeignKey
ALTER TABLE "documentState" ADD CONSTRAINT "documentState_assignmentId_userId_fkey" FOREIGN KEY ("assignmentId", "userId") REFERENCES "assignmentScores"("assignmentId", "userId") ON DELETE NO ACTION ON UPDATE NO ACTION;
