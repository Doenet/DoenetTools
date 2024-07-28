/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `classificationSystems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `classificationSystems_name_key` ON `classificationSystems`(`name`);
