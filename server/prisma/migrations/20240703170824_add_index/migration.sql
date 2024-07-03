-- CreateIndex
CREATE INDEX `content_ownerId_parentFolderId_sortIndex_idx` ON `content`(`ownerId`, `parentFolderId`, `sortIndex`);
