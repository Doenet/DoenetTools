-- CreateTable
CREATE TABLE "activities" (
    "activityId" SERIAL NOT NULL,
    "owner" INTEGER NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3),
    "lastEdited" TIMESTAMP(3),

    CONSTRAINT "activities_pkey" PRIMARY KEY ("activityId")
);

-- CreateTable
CREATE TABLE "activityItems" (
    "activityId" INTEGER NOT NULL,
    "docId" INTEGER NOT NULL,

    CONSTRAINT "activityItems_pkey" PRIMARY KEY ("activityId","docId")
);

-- CreateTable
CREATE TABLE "assignmentItems" (
    "assignmentId" INTEGER NOT NULL,
    "docVersion" INTEGER NOT NULL,
    "docId" INTEGER NOT NULL,

    CONSTRAINT "assignmentItems_pkey" PRIMARY KEY ("assignmentId","docVersion","docId")
);

-- CreateTable
CREATE TABLE "assignments" (
    "assignmentId" SERIAL NOT NULL,
    "classCode" VARCHAR(45),
    "activityId" INTEGER NOT NULL,
    "owner" INTEGER NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("assignmentId")
);

-- CreateTable
CREATE TABLE "documentVersions" (
    "version" INTEGER NOT NULL,
    "docId" INTEGER NOT NULL,
    "cid" TEXT,
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "documentVersions_pkey" PRIMARY KEY ("version","docId")
);

-- CreateTable
CREATE TABLE "documents" (
    "docId" SERIAL NOT NULL,
    "owner" INTEGER NOT NULL,
    "contentLocation" TEXT,
    "lastEdited" TIMESTAMP(3),
    "name" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("docId")
);

-- CreateTable
CREATE TABLE "studentAssignmentResponses" (
    "assignmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,

    CONSTRAINT "studentAssignmentResponses_pkey" PRIMARY KEY ("assignmentId","userId")
);

-- CreateTable
CREATE TABLE "studentItemResponses" (
    "assignmentId" INTEGER NOT NULL,
    "docVersion" INTEGER NOT NULL,
    "docId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "response" TEXT,

    CONSTRAINT "studentItemResponses_pkey" PRIMARY KEY ("assignmentId","docVersion","docId","userId")
);

-- CreateTable
CREATE TABLE "users" (
    "userId" SERIAL NOT NULL,
    "email" VARCHAR(45) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "activityId_UNIQUE" ON "activities"("activityId");

-- CreateIndex
CREATE INDEX "fk_assignments_users1_idx" ON "activities"("owner");

-- CreateIndex
CREATE INDEX "fk_activities_has_documents_activities1_idx" ON "activityItems"("activityId");

-- CreateIndex
CREATE INDEX "fk_activities_has_documents_documents1_idx" ON "activityItems"("docId");

-- CreateIndex
CREATE INDEX "fk_assignments_has_documentVersions_assignments1_idx" ON "assignmentItems"("assignmentId");

-- CreateIndex
CREATE INDEX "fk_assignments_has_documentVersions_documentVersions1_idx" ON "assignmentItems"("docVersion", "docId");

-- CreateIndex
CREATE UNIQUE INDEX "assignmentId_UNIQUE" ON "assignments"("assignmentId");

-- CreateIndex
CREATE INDEX "fk_assignments_activities1_idx" ON "assignments"("activityId");

-- CreateIndex
CREATE INDEX "fk_assignments_users2_idx" ON "assignments"("owner");

-- CreateIndex
CREATE INDEX "fk_documents_activities1_idx" ON "documentVersions"("docId");

-- CreateIndex
CREATE UNIQUE INDEX "docId_UNIQUE" ON "documents"("docId");

-- CreateIndex
CREATE INDEX "fk_activities_users_idx" ON "documents"("owner");

-- CreateIndex
CREATE INDEX "fk_assignments_has_users_assignments1_idx" ON "studentAssignmentResponses"("assignmentId");

-- CreateIndex
CREATE INDEX "fk_assignments_has_users_users1_idx" ON "studentAssignmentResponses"("userId");

-- CreateIndex
CREATE INDEX "fk_assignmentItems_has_users_assignmentItems1_idx" ON "studentItemResponses"("assignmentId", "docVersion", "docId");

-- CreateIndex
CREATE INDEX "fk_assignmentItems_has_users_users1_idx" ON "studentItemResponses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "email_UNIQUE" ON "users"("email");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "fk_assignments_users1" FOREIGN KEY ("owner") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activityItems" ADD CONSTRAINT "fk_activities_has_documents_activities1" FOREIGN KEY ("activityId") REFERENCES "activities"("activityId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activityItems" ADD CONSTRAINT "fk_activities_has_documents_documents1" FOREIGN KEY ("docId") REFERENCES "documents"("docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignmentItems" ADD CONSTRAINT "fk_assignments_has_documentVersions_assignments1" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("assignmentId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignmentItems" ADD CONSTRAINT "fk_assignments_has_documentVersions_documentVersions1" FOREIGN KEY ("docVersion", "docId") REFERENCES "documentVersions"("version", "docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "fk_assignments_activities1" FOREIGN KEY ("activityId") REFERENCES "activities"("activityId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "fk_assignments_users2" FOREIGN KEY ("owner") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documentVersions" ADD CONSTRAINT "fk_documents_activities1" FOREIGN KEY ("docId") REFERENCES "documents"("docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "fk_activities_users" FOREIGN KEY ("owner") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "studentAssignmentResponses" ADD CONSTRAINT "fk_assignments_has_users_assignments1" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("assignmentId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "studentAssignmentResponses" ADD CONSTRAINT "fk_assignments_has_users_users1" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "studentItemResponses" ADD CONSTRAINT "fk_assignmentItems_has_users_assignmentItems1" FOREIGN KEY ("assignmentId", "docVersion", "docId") REFERENCES "assignmentItems"("assignmentId", "docVersion", "docId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "studentItemResponses" ADD CONSTRAINT "fk_assignmentItems_has_users_users1" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;
