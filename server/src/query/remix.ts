import { prisma } from "../model";
import { ActivityHistory, ActivityRemixes } from "../types";
import { filterViewableActivity } from "../utils/permissions";
import { getIsAdmin } from "./curate";

export async function getContributorHistory({
  contentId,
  loggedInUserId = new Uint8Array(16),
  isAdmin,
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
  isAdmin?: boolean;
}) {
  if (isAdmin === undefined) {
    isAdmin = await getIsAdmin(loggedInUserId);
  }

  const activityHistory: ActivityHistory =
    await prisma.content.findUniqueOrThrow({
      where: {
        id: contentId,
        ...filterViewableActivity(loggedInUserId, isAdmin),
      },
      select: {
        id: true,
        contributorHistory: {
          where: {
            prevActivity: {
              activity: {
                ...filterViewableActivity(loggedInUserId, isAdmin),
              },
            },
          },
          orderBy: { timestampPrevActivity: "desc" },
          include: {
            prevActivity: {
              select: {
                cid: true,
                revisionNum: true,
                source: true,
                activity: {
                  select: {
                    id: true,
                    name: true,
                    owner: {
                      select: {
                        userId: true,
                        email: true,
                        firstNames: true,
                        lastNames: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  return activityHistory;
}

export async function getRemixes({
  contentId,
  loggedInUserId = new Uint8Array(16),
  isAdmin = false,
  directRemixesOnly = false,
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
  isAdmin?: boolean;
  directRemixesOnly?: boolean;
}) {
  const directFilter = directRemixesOnly
    ? {
        directCopy: true,
      }
    : {};

  const activityRemixes = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
    },
    select: {
      id: true,
      activityRevisions: {
        select: {
          revisionNum: true,
          contributorHistory: {
            where: {
              activity: {
                ...filterViewableActivity(loggedInUserId, isAdmin),
              },
              ...directFilter,
            },
            orderBy: { timestampActivity: "desc" },
            select: {
              contentId: true,
              withLicenseCode: true,
              timestampActivity: true,
              timestampPrevActivity: true,
              directCopy: true,
              activity: {
                select: {
                  name: true,
                  owner: {
                    select: {
                      userId: true,
                      email: true,
                      firstNames: true,
                      lastNames: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const activityRemixes2: ActivityRemixes = {
    id: activityRemixes.id,
    activityRevisions: activityRemixes.activityRevisions.map(
      (activityRevision) => ({
        revisionNum: activityRevision.revisionNum,
        remixes: activityRevision.contributorHistory.map((contribHist) => ({
          withLicenseCode: contribHist.withLicenseCode,
          contentId: contribHist.contentId,
          activityName: contribHist.activity.name,
          activityOwner: contribHist.activity.owner,
          timestampActivity: contribHist.timestampActivity,
          timestampPrevActivity: contribHist.timestampPrevActivity,
          directCopy: contribHist.directCopy,
        })),
      }),
    ),
  };

  return activityRemixes2;
}
