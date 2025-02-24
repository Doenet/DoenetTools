import { prisma } from "../model";
import { ActivityHistoryItem, ActivityRemixItem, LicenseCode } from "../types";
import { cidFromText } from "../utils/cid";
import { filterViewableActivity } from "../utils/permissions";
import { getContentSource } from "./activity";
import { getIsAdmin } from "./curate";

export async function getContributorHistory({
  contentId,
  loggedInUserId = new Uint8Array(16),
  isAdmin,
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
  isAdmin?: boolean;
}): Promise<{ history: ActivityHistoryItem[] }> {
  if (isAdmin === undefined) {
    isAdmin = await getIsAdmin(loggedInUserId);
  }

  const prelimActivityHistory = await prisma.content.findUniqueOrThrow({
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

  const history: ActivityHistoryItem[] = [];

  for (const historyItem of prelimActivityHistory.contributorHistory) {
    const prevActivity = historyItem.prevActivity;

    const prevCidAtRemix = prevActivity.cid;

    const prevCurrentSource = (
      await getContentSource({
        contentId: prevActivity.activity.id,
        loggedInUserId,
      })
    ).source;

    const currentCid = await cidFromText(prevCurrentSource);
    const prevChanged = currentCid !== prevCidAtRemix;

    history.push({
      contentId,
      prevContentId: prevActivity.activity.id,
      prevRevisionNum: historyItem.prevActivityRevisionNum,
      withLicenseCode: historyItem.withLicenseCode
        ? (historyItem.withLicenseCode as LicenseCode)
        : null,
      timestampActivity: historyItem.timestampActivity,
      timestampPrevActivity: historyItem.timestampPrevActivity,
      prevName: prevActivity.activity.name,
      prevOwner: prevActivity.activity.owner,
      prevCidAtRemix,
      prevChanged,
    });
  }

  return { history };
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
}): Promise<{ remixes: ActivityRemixItem[] }> {
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

  const remixes: ActivityRemixItem[] = [];

  for (const revision of activityRemixes.activityRevisions) {
    for (const historyItem of revision.contributorHistory) {
      remixes.push({
        prevContentId: contentId,
        prevRevisionNum: revision.revisionNum,
        withLicenseCode: historyItem.withLicenseCode
          ? (historyItem.withLicenseCode as LicenseCode)
          : null,
        contentId: historyItem.contentId,
        name: historyItem.activity.name,
        owner: historyItem.activity.owner,
        timestampActivity: historyItem.timestampActivity,
        timestampPrevActivity: historyItem.timestampPrevActivity,
        directCopy: historyItem.directCopy,
      });
    }
  }

  return { remixes };
}
