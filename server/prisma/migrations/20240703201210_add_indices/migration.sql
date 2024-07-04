-- CreateIndex
CREATE INDEX `content_ownerId_parentFolderId_sortIndex_idx` ON `content`(`ownerId`, `parentFolderId`, `sortIndex`);

-- CreateIndex
CREATE INDEX `content_parentFolderId_isFolder_idx` ON `content`(`parentFolderId`, `isFolder`);
