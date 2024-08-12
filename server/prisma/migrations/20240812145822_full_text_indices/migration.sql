-- CreateIndex
CREATE FULLTEXT INDEX `classifications_code_category_description_idx` ON `classifications`(`code`, `category`, `description`);

-- CreateIndex
CREATE FULLTEXT INDEX `content_name_idx` ON `content`(`name`);

-- CreateIndex
CREATE FULLTEXT INDEX `documents_source_idx` ON `documents`(`source`);

-- CreateIndex
CREATE FULLTEXT INDEX `users_firstNames_lastNames_email_idx` ON `users`(`firstNames`, `lastNames`, `email`);
