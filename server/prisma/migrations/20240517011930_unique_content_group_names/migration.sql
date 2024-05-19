/*
  Warnings:

  - A unique constraint covering the columns `[groupName]` on the table `promotedContentGroups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "promotedContentGroups_groupName_key" ON "promotedContentGroups"("groupName");
