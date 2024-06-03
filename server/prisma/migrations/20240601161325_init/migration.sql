-- CreateTable
CREATE TABLE "activities" (
    "activityId" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEdited" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imagePath" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("activityId")
);

-- CreateTable
CREATE TABLE "assignmentDocuments" (
    "assignmentId" INTEGER NOT NULL,
    "docId" INTEGER NOT NULL,
    "docVersionId" INTEGER NOT NULL,

    CONSTRAINT "assignmentDocuments_pkey" PRIMARY KEY ("assignmentId","docId","docVersionId")
);

-- CreateTable
CREATE TABLE "assignments" (
    "assignmentId" SERIAL NOT NULL,
    "classCode" VARCHAR(45),
    "codeValidUntil" TIMESTAMP(3),
    "activityId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "imagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("assignmentId")
);

-- CreateTable
CREATE TABLE "documentVersions" (
    "docId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "cid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "activityName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "doenetmlVersionId" INTEGER NOT NULL,

    CONSTRAINT "documentVersions_pkey" PRIMARY KEY ("docId","version")
);

-- CreateTable
CREATE TABLE "documents" (
    "docId" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEdited" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "doenetmlVersionId" INTEGER NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("docId")
);

-- CreateTable
CREATE TABLE "contributorHistory" (
    "docId" INTEGER NOT NULL,
    "prevDocId" INTEGER NOT NULL,
    "prevDocVersion" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contributorHistory_pkey" PRIMARY KEY ("docId","prevDocId")
);

-- CreateTable
CREATE TABLE "doenetmlVersions" (
    "versionId" SERIAL NOT NULL,
    "displayedVersion" TEXT NOT NULL,
    "fullVersion" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "deprecated" BOOLEAN NOT NULL DEFAULT false,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "deprecationMessage" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "doenetmlVersions_pkey" PRIMARY KEY ("versionId")
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
    "docId" INTEGER NOT NULL,
    "docVersionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isLatest" BOOLEAN NOT NULL DEFAULT true,
    "hasMaxScore" BOOLEAN NOT NULL DEFAULT false,
    "state" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "documentState_pkey" PRIMARY KEY ("assignmentId","docId","docVersionId","userId","isLatest")
);

-- CreateTable
CREATE TABLE "documentSubmittedResponses" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "docId" INTEGER NOT NULL,
    "docVersionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "answerId" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "answerNumber" INTEGER,
    "itemNumber" INTEGER NOT NULL,
    "creditAchieved" DOUBLE PRECISION NOT NULL,
    "itemCreditAchieved" DOUBLE PRECISION NOT NULL,
    "documentCreditAchieved" DOUBLE PRECISION NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentSubmittedResponses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "userId" SERIAL NOT NULL,
    "email" VARCHAR(45) NOT NULL,
    "name" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "activities_activityId_key" ON "activities"("activityId");

-- CreateIndex
CREATE INDEX "activities_ownerId_idx" ON "activities"("ownerId");

-- CreateIndex
CREATE INDEX "assignmentDocuments_assignmentId_idx" ON "assignmentDocuments"("assignmentId");

-- CreateIndex
CREATE INDEX "assignmentDocuments_docId_docVersionId_idx" ON "assignmentDocuments"("docId", "docVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_assignmentId_key" ON "assignments"("assignmentId");

-- CreateIndex
CREATE INDEX "assignments_activityId_idx" ON "assignments"("activityId");

-- CreateIndex
CREATE INDEX "assignments_ownerId_idx" ON "assignments"("ownerId");

-- CreateIndex
CREATE INDEX "assignments_classCode_idx" ON "assignments"("classCode");

-- CreateIndex
CREATE INDEX "documentVersions_docId_idx" ON "documentVersions"("docId");

-- CreateIndex
CREATE UNIQUE INDEX "documentVersions_docId_cid_key" ON "documentVersions"("docId", "cid");

-- CreateIndex
CREATE UNIQUE INDEX "documents_docId_key" ON "documents"("docId");

-- CreateIndex
CREATE INDEX "contributorHistory_prevDocId_prevDocVersion_idx" ON "contributorHistory"("prevDocId", "prevDocVersion");

-- CreateIndex
CREATE UNIQUE INDEX "doenetmlVersions_versionId_key" ON "doenetmlVersions"("versionId");

-- CreateIndex
CREATE UNIQUE INDEX "doenetmlVersions_displayedVersion_key" ON "doenetmlVersions"("displayedVersion");

-- CreateIndex
CREATE INDEX "assignmentScores_assignmentId_idx" ON "assignmentScores"("assignmentId");

-- CreateIndex
CREATE INDEX "assignmentScores_userId_idx" ON "assignmentScores"("userId");

-- CreateIndex
CREATE INDEX "documentState_assignmentId_docId_docVersionId_idx" ON "documentState"("assignmentId", "docId", "docVersionId");

-- CreateIndex
CREATE INDEX "documentState_userId_idx" ON "documentState"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "documentState_assignmentId_docId_docVersionId_userId_hasMax_key" ON "documentState"("assignmentId", "docId", "docVersionId", "userId", "hasMaxScore");

-- CreateIndex
CREATE INDEX "documentSubmittedResponses_assignmentId_docId_docVersionId__idx" ON "documentSubmittedResponses"("assignmentId", "docId", "docVersionId", "answerId");

-- CreateIndex
CREATE INDEX "documentSubmittedResponses_userId_idx" ON "documentSubmittedResponses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignmentDocuments" ADD CONSTRAINT "assignmentDocuments_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("assignmentId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignmentDocuments" ADD CONSTRAINT "assignmentDocuments_docId_docVersionId_fkey" FOREIGN KEY ("docId", "docVersionId") REFERENCES "documentVersions"("docId", "version") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("activityId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentVersions" ADD CONSTRAINT "documentVersions_docId_fkey" FOREIGN KEY ("docId") REFERENCES "documents"("docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentVersions" ADD CONSTRAINT "documentVersions_doenetmlVersionId_fkey" FOREIGN KEY ("doenetmlVersionId") REFERENCES "doenetmlVersions"("versionId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("activityId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_doenetmlVersionId_fkey" FOREIGN KEY ("doenetmlVersionId") REFERENCES "doenetmlVersions"("versionId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contributorHistory" ADD CONSTRAINT "contributorHistory_docId_fkey" FOREIGN KEY ("docId") REFERENCES "documents"("docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contributorHistory" ADD CONSTRAINT "contributorHistory_prevDocId_prevDocVersion_fkey" FOREIGN KEY ("prevDocId", "prevDocVersion") REFERENCES "documentVersions"("docId", "version") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignmentScores" ADD CONSTRAINT "assignmentScores_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("assignmentId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignmentScores" ADD CONSTRAINT "assignmentScores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentState" ADD CONSTRAINT "documentState_assignmentId_userId_fkey" FOREIGN KEY ("assignmentId", "userId") REFERENCES "assignmentScores"("assignmentId", "userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentState" ADD CONSTRAINT "documentState_assignmentId_docId_docVersionId_fkey" FOREIGN KEY ("assignmentId", "docId", "docVersionId") REFERENCES "assignmentDocuments"("assignmentId", "docId", "docVersionId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentState" ADD CONSTRAINT "documentState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentSubmittedResponses" ADD CONSTRAINT "documentSubmittedResponses_assignmentId_docId_docVersionId_fkey" FOREIGN KEY ("assignmentId", "docId", "docVersionId") REFERENCES "assignmentDocuments"("assignmentId", "docId", "docVersionId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentSubmittedResponses" ADD CONSTRAINT "documentSubmittedResponses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;
