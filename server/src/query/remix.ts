import { prisma } from "../model";
import { ActivityRemixItem, LicenseCode, RemixContent } from "../types";
import { cidFromText } from "../utils/cid";
import { filterViewableActivity } from "../utils/permissions";
import { getContentSource } from "./activity";
import { getIsAdmin } from "./curate";

export async function getRemixedFrom({
  contentId,
  loggedInUserId = new Uint8Array(16),
  isAdmin,
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
  isAdmin?: boolean;
}): Promise<{ remixedFrom: ActivityRemixItem[] }> {
  if (isAdmin === undefined) {
    isAdmin = await getIsAdmin(loggedInUserId);
  }

  const prelimRemixedFrom = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
    },
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
      contentRevisions: {
        select: {
          revisionNum: true,
          cid: true,
          contributorHistoryAsRemix: {
            where: {
              originContent: {
                content: {
                  ...filterViewableActivity(loggedInUserId, isAdmin),
                },
              },
            },
            orderBy: { timestampOriginContent: "desc" },
            select: {
              withLicenseCode: true,
              timestampRemixContent: true,
              timestampOriginContent: true,
              directCopy: true,
              originContent: {
                select: {
                  revisionNum: true,
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
      },
    },
  });

  const remixedFrom: ActivityRemixItem[] = [];

  const remixBaseInfo = {
    contentId: prelimRemixedFrom.id,
    name: prelimRemixedFrom.name,
    owner: prelimRemixedFrom.owner,
  };

  const remixCurrentSource = await getContentSource({
    contentId: prelimRemixedFrom.id,
    loggedInUserId,
    useVersionIds: true,
  });

  let remixCurrentCid;
  if (remixCurrentSource.doenetMLVersion) {
    remixCurrentCid = await cidFromText(
      remixCurrentSource.doenetMLVersion + "|" + remixCurrentSource.source,
    );
  } else {
    remixCurrentCid = await cidFromText(remixCurrentSource.source);
  }

  for (const revision of prelimRemixedFrom.contentRevisions) {
    const remixRevisionInfo = {
      ...remixBaseInfo,
      revisionNumber: revision.revisionNum,
      cidAtRemix: revision.cid,
      changedSinceRemix: remixCurrentCid != revision.cid,
    };
    for (const historyItem of revision.contributorHistoryAsRemix) {
      const remixContent: RemixContent = {
        ...remixRevisionInfo,
        timestamp: historyItem.timestampRemixContent,
      };

      const originRevisionContent = historyItem.originContent;

      const originCidAtRemix = originRevisionContent.cid;

      const originCurrentSource = await getContentSource({
        contentId: originRevisionContent.content.id,
        loggedInUserId,
        useVersionIds: true,
      });

      let originCurrentCid;
      if (originCurrentSource.doenetMLVersion) {
        originCurrentCid = await cidFromText(
          originCurrentSource.doenetMLVersion +
            "|" +
            originCurrentSource.source,
        );
      } else {
        originCurrentCid = await cidFromText(originCurrentSource.source);
      }

      const originContent: RemixContent = {
        contentId: originRevisionContent.content.id,
        revisionNumber: originRevisionContent.revisionNum,
        timestamp: historyItem.timestampRemixContent,
        name: originRevisionContent.content.name,
        owner: originRevisionContent.content.owner,
        cidAtRemix: originCidAtRemix,
        changedSinceRemix: originCurrentCid !== originCidAtRemix,
      };

      remixedFrom.push({
        originContent,
        remixContent,
        withLicenseCode: historyItem.withLicenseCode
          ? (historyItem.withLicenseCode as LicenseCode)
          : null,
        directCopy: historyItem.directCopy,
      });
    }
  }

  return { remixedFrom };
}

export async function getRemixes({
  contentId,
  loggedInUserId = new Uint8Array(16),
  // directRemixesOnly = false,
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
  // directRemixesOnly?: boolean;
}): Promise<{ remixes: ActivityRemixItem[] }> {
  const isAdmin = await getIsAdmin(loggedInUserId);

  // const directFilter = directRemixesOnly
  //   ? {
  //       directCopy: true,
  //     }
  //   : {};

  const prelimRemixes = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
    },
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
      contentRevisions: {
        select: {
          revisionNum: true,
          cid: true,
          contributorHistoryAsOrigin: {
            where: {
              remixContent: {
                content: {
                  ...filterViewableActivity(loggedInUserId, isAdmin),
                },
              },
              // ...directFilter,
            },
            orderBy: { timestampRemixContent: "desc" },
            select: {
              withLicenseCode: true,
              timestampRemixContent: true,
              timestampOriginContent: true,
              directCopy: true,
              remixContent: {
                select: {
                  revisionNum: true,
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
      },
    },
  });

  const remixes: ActivityRemixItem[] = [];

  const originBaseInfo = {
    contentId: prelimRemixes.id,
    name: prelimRemixes.name,
    owner: prelimRemixes.owner,
  };

  const originCurrentSource = await getContentSource({
    contentId: prelimRemixes.id,
    loggedInUserId,
    useVersionIds: true,
  });

  let originCurrentCid;
  if (originCurrentSource.doenetMLVersion) {
    originCurrentCid = await cidFromText(
      originCurrentSource.doenetMLVersion + "|" + originCurrentSource.source,
    );
  } else {
    originCurrentCid = await cidFromText(originCurrentSource.source);
  }

  for (const revision of prelimRemixes.contentRevisions) {
    const originRevisionInfo = {
      ...originBaseInfo,
      revisionNumber: revision.revisionNum,
      cidAtRemix: revision.cid,
      changedSinceRemix: originCurrentCid != revision.cid,
    };
    for (const historyItem of revision.contributorHistoryAsOrigin) {
      const originContent: RemixContent = {
        ...originRevisionInfo,
        timestamp: historyItem.timestampOriginContent,
      };

      const remixRevisionContent = historyItem.remixContent;

      const remixCidAtRemix = remixRevisionContent.cid;

      const remixCurrentSource = await getContentSource({
        contentId: remixRevisionContent.content.id,
        loggedInUserId,
        useVersionIds: true,
      });

      let remixCurrentCid;
      if (remixCurrentSource.doenetMLVersion) {
        remixCurrentCid = await cidFromText(
          remixCurrentSource.doenetMLVersion + "|" + remixCurrentSource.source,
        );
      } else {
        remixCurrentCid = await cidFromText(remixCurrentSource.source);
      }

      const remixContent: RemixContent = {
        contentId: remixRevisionContent.content.id,
        revisionNumber: remixRevisionContent.revisionNum,
        timestamp: historyItem.timestampRemixContent,
        name: remixRevisionContent.content.name,
        owner: remixRevisionContent.content.owner,
        cidAtRemix: remixCidAtRemix,
        changedSinceRemix: remixCurrentCid !== remixCidAtRemix,
      };

      remixes.push({
        originContent,
        remixContent,
        withLicenseCode: historyItem.withLicenseCode
          ? (historyItem.withLicenseCode as LicenseCode)
          : null,
        directCopy: historyItem.directCopy,
      });
    }
  }

  return { remixes };
}
