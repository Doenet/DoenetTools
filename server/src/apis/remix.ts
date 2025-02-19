import { prisma } from "../model";
import { ActivityHistory } from "../types";
import { filterViewableActivity } from "../utils/permissions";
import { getIsAdmin } from "./curate";

export async function getActivityContributorHistory({
  activityId,
  loggedInUserId,
  isAdmin,
}: {
  activityId: Uint8Array;
  loggedInUserId: Uint8Array;
  isAdmin?: boolean;
}) {
  if (isAdmin === undefined) {
    isAdmin = await getIsAdmin(loggedInUserId);
  }

  const activityHistory: ActivityHistory =
    await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
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

export async function getActivityRemixes({
  activityId,
  loggedInUserId,
}: {
  activityId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  const activity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
    },
    select: { documents: { select: { id: true } } },
  });

  const docRemixes = await getDocumentRemixes({
    docIds: activity.documents.map((doc) => doc.id),
    loggedInUserId,
    isAdmin,
  });

  // const docDirectRemixes = await getDocumentDirectRemixes({
  //   docIds: activity.documents.map((doc) => doc.id),
  //   loggedInUserId,
  // });

  return { docRemixes };
}

export async function getDocumentDirectRemixes({
  docIds,
  loggedInUserId,
  isAdmin = false,
}: {
  docIds: Uint8Array[];
  loggedInUserId: Uint8Array;
  isAdmin?: boolean;
}) {
  const docRemixes = await prisma.documents.findMany({
    where: {
      id: { in: docIds },
      activity: {
        ...filterViewableActivity(loggedInUserId, isAdmin),
      },
    },
    select: {
      id: true,
      documentVersions: {
        select: {
          versionNum: true,
          contributorHistory: {
            where: {
              document: {
                isDeleted: false,
                activity: {
                  ...filterViewableActivity(loggedInUserId, isAdmin),
                },
              },
              timestampDoc: {
                equals: prisma.contributorHistory.fields.timestampPrevDoc,
              },
            },
            orderBy: { timestampDoc: "desc" },
            select: {
              docId: true,
              withLicenseCode: true,
              timestampDoc: true,
              timestampPrevDoc: true,
              document: {
                select: {
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
      },
    },
  });

  const docRemixes2: DocRemixes[] = docRemixes.map((remixes) => ({
    id: remixes.id,
    documentVersions: remixes.documentVersions.map((docVersion) => ({
      versionNumber: docVersion.versionNum,
      remixes: docVersion.contributorHistory.map((contribHist) => ({
        docId: contribHist.docId,
        withLicenseCode: contribHist.withLicenseCode,
        timestampDoc: contribHist.timestampDoc,
        timestampPrevDoc: contribHist.timestampPrevDoc,
        activity: contribHist.document.activity,
      })),
    })),
  }));

  return docRemixes2;
}

export async function getDocumentRemixes({
  docIds,
  loggedInUserId,
  isAdmin = false,
}: {
  docIds: Uint8Array[];
  loggedInUserId: Uint8Array;
  isAdmin?: boolean;
}) {
  const docRemixes = await prisma.documents.findMany({
    where: {
      id: { in: docIds },
      isDeleted: false,
      activity: {
        ...filterViewableActivity(loggedInUserId, isAdmin),
      },
    },
    select: {
      id: true,
      documentVersions: {
        select: {
          versionNum: true,
          contributorHistory: {
            where: {
              document: {
                isDeleted: false,
                activity: {
                  ...filterViewableActivity(loggedInUserId, isAdmin),
                },
              },
            },
            orderBy: { timestampDoc: "desc" },
            select: {
              docId: true,
              withLicenseCode: true,
              timestampDoc: true,
              timestampPrevDoc: true,
              document: {
                select: {
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
      },
    },
  });

  const docRemixes2: DocRemixes[] = docRemixes.map((remixes) => ({
    id: remixes.id,
    documentVersions: remixes.documentVersions.map((docVersion) => ({
      versionNumber: docVersion.versionNum,
      remixes: docVersion.contributorHistory.map((contribHist) => ({
        docId: contribHist.docId,
        withLicenseCode: contribHist.withLicenseCode,
        timestampDoc: contribHist.timestampDoc,
        timestampPrevDoc: contribHist.timestampPrevDoc,
        activity: contribHist.document.activity,
      })),
    })),
  }));

  return docRemixes2;
}
