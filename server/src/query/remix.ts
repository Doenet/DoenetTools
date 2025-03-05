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
          prevContent: {
            content: {
              ...filterViewableActivity(loggedInUserId, isAdmin),
            },
          },
        },
        orderBy: { timestampPrevContent: "desc" },
        include: {
          prevContent: {
            select: {
              cid: true,
              content: {
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
    const prevContent = historyItem.prevContent;

    const prevCidAtRemix = prevContent.cid;

    const prevCurrent = await getContentSource({
      contentId: prevContent.content.id,
      loggedInUserId,
    });

    let currentCid;
    if (prevCurrent.doenetMLVersion) {
      currentCid = await cidFromText(
        prevCurrent.doenetMLVersion + "|" + prevCurrent.source,
      );
    } else {
      currentCid = await cidFromText(prevCurrent.source);
    }

    const prevChanged = currentCid !== prevCidAtRemix;

    history.push({
      contentId,
      prevContentId: prevContent.content.id,
      prevRevisionNum: historyItem.prevContentRevisionNum,
      withLicenseCode: historyItem.withLicenseCode
        ? (historyItem.withLicenseCode as LicenseCode)
        : null,
      timestampContent: historyItem.timestampContent,
      timestampPrevContent: historyItem.timestampPrevContent,
      prevName: prevContent.content.name,
      prevOwner: prevContent.content.owner,
      prevCidAtRemix,
      prevChanged,
    });
  }

  return { history };
}

export async function getRemixes({
  contentId,
  loggedInUserId = new Uint8Array(16),
  directRemixesOnly = false,
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
  directRemixesOnly?: boolean;
}): Promise<{ remixes: ActivityRemixItem[] }> {
  const isAdmin = await getIsAdmin(loggedInUserId);

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
      contentRevisions: {
        select: {
          revisionNum: true,
          contributorHistory: {
            where: {
              content: {
                ...filterViewableActivity(loggedInUserId, isAdmin),
              },
              ...directFilter,
            },
            orderBy: { timestampContent: "desc" },
            select: {
              contentId: true,
              withLicenseCode: true,
              timestampContent: true,
              timestampPrevContent: true,
              directCopy: true,
              content: {
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

  for (const revision of activityRemixes.contentRevisions) {
    for (const historyItem of revision.contributorHistory) {
      remixes.push({
        prevContentId: contentId,
        prevRevisionNum: revision.revisionNum,
        withLicenseCode: historyItem.withLicenseCode
          ? (historyItem.withLicenseCode as LicenseCode)
          : null,
        contentId: historyItem.contentId,
        name: historyItem.content.name,
        owner: historyItem.content.owner,
        timestampContent: historyItem.timestampContent,
        timestampPrevContent: historyItem.timestampPrevContent,
        directCopy: historyItem.directCopy,
      });
    }
  }

  return { remixes };
}
