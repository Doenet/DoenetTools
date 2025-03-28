import { prisma } from "../model";
import { ActivityRemixItem, LicenseCode, RemixContent } from "../types";
import { cidFromText } from "../utils/cid";
import { createFullName } from "../utils/names";
import {
  filterEditableActivity,
  filterViewableActivity,
} from "../utils/permissions";
import { createActivityRevision, getContentSource } from "./activity";
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
      revisionNum: revision.revisionNum,
      cidAtRemix: revision.cid,
      changed: remixCurrentCid != revision.cid,
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
        revisionNum: originRevisionContent.revisionNum,
        timestamp: historyItem.timestampOriginContent,
        name: originRevisionContent.content.name,
        owner: originRevisionContent.content.owner,
        cidAtRemix: originCidAtRemix,
        changed: originCurrentCid !== originCidAtRemix,
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

  // re-sort according to originContent.timestamp, descending,
  // since could have different revision numbers
  remixedFrom.sort(
    (a, b) =>
      b.originContent.timestamp.getTime() - a.originContent.timestamp.getTime(),
  );

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
      revisionNum: revision.revisionNum,
      cidAtRemix: revision.cid,
      changed: originCurrentCid != revision.cid,
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
        revisionNum: remixRevisionContent.revisionNum,
        timestamp: historyItem.timestampRemixContent,
        name: remixRevisionContent.content.name,
        owner: remixRevisionContent.content.owner,
        cidAtRemix: remixCidAtRemix,
        changed: remixCurrentCid !== remixCidAtRemix,
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

  // re-sort according to remixContent.timestamp, descending,
  // since could have different revision numbers
  remixes.sort(
    (a, b) =>
      b.remixContent.timestamp.getTime() - a.remixContent.timestamp.getTime(),
  );

  return { remixes };
}

/**
 * Update `remixContentId` by `loggedInUserId` to match `originRevisionNum` of `originContentId`,
 * where `remixContentId` must have been remixed (possibly indirectly) from `originContentId`.
 * Update contributor history to link the new revision of `remixContentId` to `originRevisionNum`
 * of `originContentId` so the change in both of them is no longer identified.
 *
 * If `onlyMarkUnchanged` is `true`, however, then don't actually update `remixContentId`,
 * but only update contributor history to link the unchanged revision of `remixContentId`
 * to `originRevisionNum` of `originContentId`.
 *
 * If `originRevisionNum` is not specified, then create a new revision of `originContentId`
 * from its current content and use that revision number.
 *
 * In addition look for other content that `remixContentId` was remixed from
 * or that were remixed from `remixContentId`.
 * If any of them have already incorporated that change of `originRevisionNum` of `originContentId`,
 * then also update the contributor history between `remixContentId` and that activity
 * (updating the revision number of `remixContentId` only if `onlyMarkedChange` is `false`.)
 *
 * Note: currently implemented only from Docs.
 */
export async function updateRemixedContentToOrigin({
  originContentId,
  originRevisionNum,
  remixContentId,
  loggedInUserId,
  onlyMarkUnchanged = false,
}: {
  originContentId: Uint8Array;
  originRevisionNum?: number;
  remixContentId: Uint8Array;
  loggedInUserId: Uint8Array;
  onlyMarkUnchanged?: boolean;
}) {
  // verify relation exists and logged in userId has edit access to the remix and view access to the origin
  await prisma.contributorHistory.findUniqueOrThrow({
    where: {
      remixContentId_originContentId: { originContentId, remixContentId },
      originContent: {
        content: {
          ...filterViewableActivity(loggedInUserId),
          type: "singleDoc",
        },
      },
      remixContent: {
        content: {
          ...filterEditableActivity(loggedInUserId),
          type: "singleDoc",
        },
      },
    },
  });

  // if originRevisionNum is not supplied, it means update from the current content,
  // so create (or find) a revision corresponding to the current content
  if (originRevisionNum === undefined) {
    const originActivityRevision = await createActivityRevision({
      contentId: originContentId,
      loggedInUserId,
      revisionName: "Created due to being remixed",
    });
    originRevisionNum = originActivityRevision.revisionNum;
  }

  const revisionToCopy = await prisma.contentRevisions.findUniqueOrThrow({
    where: {
      contentId_revisionNum: {
        contentId: originContentId,
        revisionNum: originRevisionNum,
      },
    },
    select: {
      source: true,
      doenetmlVersionId: true,
      cid: true,
      content: {
        select: {
          name: true,
          owner: true,
        },
      },
    },
  });

  const newSource = revisionToCopy.source;
  const newDoenetmlVersionId = revisionToCopy.doenetmlVersionId;

  const originContent = revisionToCopy.content;

  let remixRevisionNum: number | undefined;

  if (!onlyMarkUnchanged) {
    // if remixed content has changed since it was originally remixed,
    // create a revision as a save point
    await createActivityRevision({
      contentId: remixContentId,
      loggedInUserId,
      revisionName: "Before update",
      note: `Save point before updating to: ${originContent.name} by ${createFullName(originContent.owner)}`,
    });

    // update remixed content (already checked permissions)
    await prisma.content.update({
      where: { id: remixContentId },
      data: { source: newSource, doenetmlVersionId: newDoenetmlVersionId },
    });

    ({ revisionNum: remixRevisionNum } = await createActivityRevision({
      contentId: remixContentId,
      loggedInUserId,
      revisionName: "After update",
      note: `Updated to: ${originContent.name} by ${createFullName(originContent.owner)}`,
    }));
  }

  // Update content history to show that remixed from originRevisionNum to remixRevisionNum,
  // (or, if onlyMarkUnchanged, then remixRevisionNum is undefined, and we're just
  // changing the history so show that we remixed from originRevisionNum).
  // Note: we currently don't update timestamps so they show the original remix time.
  // Should we have another update timestamp?
  await prisma.contributorHistory.update({
    where: {
      remixContentId_originContentId: { remixContentId, originContentId },
    },
    data: {
      remixContentRevisionNum: remixRevisionNum,
      originContentRevisionNum: originRevisionNum,
    },
  });

  await updateOtherMatchingContributorHistory({
    copiedContentId: originContentId,
    updatedContentId: remixContentId,
    updatedRevisionNum: remixRevisionNum,
    newCid: revisionToCopy.cid,
  });
}

/**
 * Update `originContentId` by `loggedInUserId` to match `remixRevisionNum` of `remixContentId`,
 * where `remixContentId` must have been remixed (possibly indirectly) from `originContentId`.
 * Update contributor history to link the new revision of `originContentId` to `remixRevisionNum`
 * of `remixContentId` so the change in both of them is no longer identified.
 *
 * If `onlyMarkUnchanged` is `true`, however, then don't actually update `originContentId`,
 * but only update contributor history to link the unchanged revision of `originContentId`
 * to `remixRevisionNum` of `remixContentId`.
 *
 * If `remixRevisionNum` is not specified, then create a new revision of `remixContentId`
 * from its current content and use that revision number.
 *
 * In addition look for other content that `originContentId` was remixed from
 * or that were remixed from `originContentId`.
 * If any of them have already incorporated that change of `remixRevisionNum` of `remixContentId`,
 * then also update the contributor history between `originContentId` and that activity
 * (updating the revision number of `originContentId` only if `onlyMarkedChange` is `false`.)
 *
 * Note: currently implemented only from Docs.
 */
export async function updateOriginContentToRemix({
  remixRevisionNum,
  remixContentId,
  originContentId,
  loggedInUserId,
  onlyMarkUnchanged = false,
}: {
  remixRevisionNum?: number;
  remixContentId: Uint8Array;
  originContentId: Uint8Array;
  loggedInUserId: Uint8Array;
  onlyMarkUnchanged?: boolean;
}) {
  // verify relation exists and logged in userId has edit access to the origin and view access to the remix
  await prisma.contributorHistory.findUniqueOrThrow({
    where: {
      remixContentId_originContentId: { originContentId, remixContentId },
      originContent: {
        content: {
          ...filterEditableActivity(loggedInUserId),
          type: "singleDoc",
        },
      },
      remixContent: {
        content: {
          ...filterViewableActivity(loggedInUserId),
          type: "singleDoc",
        },
      },
    },
  });

  // if remixRevisionNum is not supplied, it means update from the current content,
  // so create (or find) a revision corresponding to the current content
  if (remixRevisionNum === undefined) {
    const remixActivityRevision = await createActivityRevision({
      contentId: remixContentId,
      loggedInUserId,
      revisionName: "Created due to being remixed",
    });
    remixRevisionNum = remixActivityRevision.revisionNum;
  }

  const revisionToCopy = await prisma.contentRevisions.findUniqueOrThrow({
    where: {
      contentId_revisionNum: {
        contentId: remixContentId,
        revisionNum: remixRevisionNum,
      },
    },
    select: {
      source: true,
      doenetmlVersionId: true,
      cid: true,
      content: {
        select: {
          name: true,
          owner: true,
        },
      },
    },
  });

  const newSource = revisionToCopy.source;
  const newDoenetmlVersionId = revisionToCopy.doenetmlVersionId;

  const remixContent = revisionToCopy.content;

  let originRevisionNum: number | undefined;

  if (!onlyMarkUnchanged) {
    // if origin content has changed since it was originally remixed,
    // create a revision as a save point
    await createActivityRevision({
      contentId: originContentId,
      loggedInUserId,
      revisionName: "Before update",
      note: `Save point before updating to: ${remixContent.name} by ${createFullName(remixContent.owner)}`,
    });

    // update origin content (already checked permissions)
    await prisma.content.update({
      where: { id: originContentId },
      data: { source: newSource, doenetmlVersionId: newDoenetmlVersionId },
    });

    ({ revisionNum: originRevisionNum } = await createActivityRevision({
      contentId: originContentId,
      loggedInUserId,
      revisionName: "After update",
      note: `Updated to: ${remixContent.name} by ${createFullName(remixContent.owner)}`,
    }));
  }

  // Update content history to show that remixed from originRevisionNum to remixRevisionNum,
  // (or, if onlyMarkUnchanged, then originRevisionNum is undefined, and we're just
  // changing the history so show that we remixed to remixRevisionNum).
  // Note: we currently don't update timestamps so they show the original remix time.
  // Should we have another update timestamp?
  await prisma.contributorHistory.update({
    where: {
      remixContentId_originContentId: { remixContentId, originContentId },
    },
    data: {
      remixContentRevisionNum: remixRevisionNum,
      originContentRevisionNum: originRevisionNum,
    },
  });

  await updateOtherMatchingContributorHistory({
    copiedContentId: remixContentId,
    updatedContentId: originContentId,
    updatedRevisionNum: originRevisionNum,
    newCid: revisionToCopy.cid,
  });
}

/**
 * Call this function after either
 * - updating `updatedContentId` to revision `updatedRevisionNum` to match
 *   a revision of `copiedContentId` with cid `newCid`, or
 * - ignoring the change to `copiedContentId` that changed it to the revision with cid `newCid`,
 *   in which case `updatedContentId` was unchanged and `updatedRevisionNum` is undefined.
 *
 * This function looks for other content that `updatedContentId` was remixed from
 * or that was remixed from `updatedContentId`,
 * where that other content has a revision with cid matching `newCid`.
 * If found, updated the contributor history so that it links `updatedContentId`
 * with that found revision of the other content.
 * If `updatedRevisionNum` is defined (meaning `updatedContentId` was actually changed),
 * then also change the link to match `updatedRevisionNum`.
 *
 * Note: we don't worry if logged in user has view access of those activities (or even if they are deleted).
 * We still update the data to keep it current.
 */
async function updateOtherMatchingContributorHistory({
  copiedContentId,
  updatedContentId,
  updatedRevisionNum,
  newCid,
}: {
  copiedContentId: Uint8Array;
  updatedContentId: Uint8Array;
  updatedRevisionNum?: number;
  newCid: string;
}) {
  const originContentAtNewCid = await prisma.content.findMany({
    where: {
      id: { not: copiedContentId },
      contentRevisions: {
        some: {
          contributorHistoryAsOrigin: {
            some: { remixContentId: updatedContentId },
          },
        },
      },
    },
    select: {
      contentRevisions: {
        distinct: ["cid"],
        where: { cid: newCid },
        orderBy: { createdAt: "desc" },
        select: { contentId: true, revisionNum: true },
      },
    },
  });

  for (const originObj of originContentAtNewCid) {
    if (originObj.contentRevisions.length === 1) {
      const originInfo = originObj.contentRevisions[0];
      await prisma.contributorHistory.update({
        where: {
          remixContentId_originContentId: {
            remixContentId: updatedContentId,
            originContentId: originInfo.contentId,
          },
        },
        data: {
          originContentRevisionNum: originInfo.revisionNum,
          remixContentRevisionNum: updatedRevisionNum,
        },
      });
    }
  }

  const remixContentAtNewCid = await prisma.content.findMany({
    where: {
      id: { not: copiedContentId },
      contentRevisions: {
        some: {
          contributorHistoryAsRemix: {
            some: { originContentId: updatedContentId },
          },
        },
      },
    },
    select: {
      contentRevisions: {
        distinct: ["cid"],
        where: { cid: newCid },
        orderBy: { createdAt: "desc" },
        select: { contentId: true, revisionNum: true },
      },
    },
  });

  for (const remixObj of remixContentAtNewCid) {
    if (remixObj.contentRevisions.length === 1) {
      const remixInfo = remixObj.contentRevisions[0];
      await prisma.contributorHistory.update({
        where: {
          remixContentId_originContentId: {
            remixContentId: remixInfo.contentId,
            originContentId: updatedContentId,
          },
        },
        data: {
          originContentRevisionNum: updatedRevisionNum,
          remixContentRevisionNum: remixInfo.revisionNum,
        },
      });
    }
  }
}
