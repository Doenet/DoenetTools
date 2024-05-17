-- CreateTable
CREATE TABLE "promotedContentGroups" (
    "promotedGroupId" SERIAL NOT NULL,
    "groupName" TEXT NOT NULL,
    "currentlyFeatured" BOOLEAN NOT NULL DEFAULT false,
    "homepage" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" TEXT NOT NULL,

    CONSTRAINT "promotedContentGroups_pkey" PRIMARY KEY ("promotedGroupId")
);

-- CreateTable
CREATE TABLE "promotedContent" (
    "activityId" INTEGER NOT NULL,
    "promotedGroupId" INTEGER NOT NULL,
    "sortOrder" TEXT NOT NULL,

    CONSTRAINT "promotedContent_pkey" PRIMARY KEY ("activityId","promotedGroupId")
);

-- AddForeignKey
ALTER TABLE "promotedContent" ADD CONSTRAINT "promotedContent_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("activityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotedContent" ADD CONSTRAINT "promotedContent_promotedGroupId_fkey" FOREIGN KEY ("promotedGroupId") REFERENCES "promotedContentGroups"("promotedGroupId") ON DELETE RESTRICT ON UPDATE CASCADE;
