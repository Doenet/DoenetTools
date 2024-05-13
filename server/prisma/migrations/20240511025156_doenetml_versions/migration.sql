/*
  Warnings:

  - Added the required column `doenetmlVersion` to the `documentVersions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doenetmlVersion` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documentVersions" ADD COLUMN     "doenetmlVersion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "doenetmlVersion" INTEGER NOT NULL;

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

-- CreateIndex
CREATE UNIQUE INDEX "versionId_UNIQUE" ON "doenetmlVersions"("versionId");

-- CreateIndex
CREATE UNIQUE INDEX "displayedVersion_UNIQUE" ON "doenetmlVersions"("displayedVersion");

-- AddForeignKey
ALTER TABLE "documentVersions" ADD CONSTRAINT "fk_documentVersions_doenetmlVersions" FOREIGN KEY ("doenetmlVersion") REFERENCES "doenetmlVersions"("versionId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "fk_documents_doenetmlVersions" FOREIGN KEY ("doenetmlVersion") REFERENCES "doenetmlVersions"("versionId") ON DELETE NO ACTION ON UPDATE NO ACTION;
