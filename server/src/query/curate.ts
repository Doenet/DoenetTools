import {
  ContentType,
  LibraryEventType,
  LibraryStatus,
  Prisma,
} from "@prisma/client";
import { prisma } from "../model";
import { Content, LibraryRelations, UserInfo } from "../types";
import { InvalidRequestError } from "../utils/error";
import { compareUUID, fromUUID, isEqualUUID } from "../utils/uuid";
import {
  createContent,
  getAllDoenetmlVersions,
  getDescendantIds,
} from "./activity";
import { copyContent } from "./copy_move";
import {
  filterEditableActivity,
  filterViewableActivity,
  filterViewableContent,
} from "../utils/permissions";
import {
  getMyContentOrLibraryContent,
  searchMyContentOrLibraryContent,
} from "./content_list";
import { processContent, returnContentSelect } from "../utils/contentStructure";
import { getAvailableContentFeatures } from "./classification";
import { getAllLicenses } from "./share";
import { H } from "vitest/dist/chunks/reporters.DTtkbAtP";

export async function mustBeAdmin(
  userId: Uint8Array,
  message = "You must be an community admin to take this action",
) {
  const isAdmin = await getIsAdmin(userId);
  if (!isAdmin) {
    throw new InvalidRequestError(message);
  }
}

export async function getIsAdmin(userId: Uint8Array) {
  const user = await prisma.users.findUnique({ where: { userId } });
  let isAdmin = false;
  if (user) {
    isAdmin = user.isAdmin;
  }
  return isAdmin;
}

export async function getLibraryAccountId() {
  const library = await prisma.users.findFirstOrThrow({
    where: {
      isLibrary: true,
    },
    select: {
      userId: true,
    },
  });
  const libraryId = library!.userId;
  return libraryId;
}

/**
 * Convert content ids that the given user cannot see into `null`. Does not affect visible ids.
 *
 * Three cases:
 * 1. `contentId` is null --> return id is null
 * 2. `contentId` is non-null but invisible --> return id is null
 * 3. `contentId` is non-null and visible --> return id equals `contentId`
 */
async function redactInvisibleContentIds({
  contentIds: contentIds,
  loggedInUserId,
  isAdmin,
}: {
  contentIds: (Uint8Array | null)[];
  loggedInUserId: Uint8Array;
  isAdmin: boolean;
}) {
  const nonnullContentIds = contentIds.filter((id) => id !== null);

  const visibleIdsList = (
    await prisma.content.findMany({
      where: {
        id: { in: nonnullContentIds },
        ...filterViewableActivity(loggedInUserId, isAdmin),
      },
      select: { id: true },
    })
  ).map((v) => fromUUID(v.id));
  const visibleIds = new Set(visibleIdsList);

  return contentIds.map((id) =>
    id !== null && visibleIds.has(fromUUID(id)) ? id : null,
  );
}

export async function maskLibraryUserInfo({
  contentId,
  owner,
}: {
  contentId: Uint8Array;
  owner: UserInfo;
}) {
  const libraryId = await getLibraryAccountId();
  if (isEqualUUID(owner.userId, libraryId)) {
    const user = await prisma.content.findUniqueOrThrow({
      where: {
        id: contentId,
      },
      select: {
        libraryActivityInfo: {
          select: {
            source: {
              select: {
                owner: {
                  select: {
                    userId: true,
                    firstNames: true,
                    lastNames: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const maskInfo = user.libraryActivityInfo!.source.owner;
    const newOwner = {
      ...owner,
      // Mask info replaces original user info
      ...maskInfo,
      isMaskForLibrary: true,
    };
    return newOwner;
  } else {
    return owner;
  }
}

/**
 * Depending on user's access privileges, this function will hide some information. See type `LibraryRelations` for details.
 */
export async function getMultipleLibraryRelations({
  contentIds,
  loggedInUserId = new Uint8Array(16),
}: {
  contentIds: Uint8Array[];
  loggedInUserId?: Uint8Array;
}): Promise<LibraryRelations[]> {
  const isAdmin = await getIsAdmin(loggedInUserId);

  // ======== Relation: Me to Revised =========

  const meRelations: {
    [index: string]: {
      status: LibraryStatus;
      activityContentId: Uint8Array | null;
      reviewRequestDate?: Date;
      primaryEditor?: UserInfo;
      iAmPrimaryEditor?: boolean;
    };
  } = {};

  const infos = await prisma.libraryActivityInfos.findMany({
    where: {
      sourceId: { in: contentIds },
      source: {
        ...filterViewableActivity(loggedInUserId, isAdmin),
      },
    },
    select: {
      status: true,
      contentId: true,
      ownerRequested: true,
      requestedOn: true,
      primaryEditor: {
        select: {
          userId: true,
          firstNames: true,
          lastNames: true,
        },
      },
    },
  });

  if (infos) {
    const revisedIds = await redactInvisibleContentIds({
      contentIds: infos.map((v) => v.contentId),
      loggedInUserId,
      isAdmin,
    });

    const isOwnerList = await prisma.content.findMany({
      where: {
        id: { in: contentIds },
        ownerId: loggedInUserId,
      },
      select: { id: true },
    });
    const isOwnerOf = new Set(isOwnerList.map((v) => fromUUID(v.id)));

    for (let i = 0; i < infos.length; i++) {
      const isPublished = infos[i].status === LibraryStatus.PUBLISHED;
      const isOwner = isOwnerOf.has(fromUUID(contentIds[i]));

      // Three possible conditions for this relation to be visible.
      // 1. Curated activity is published
      // 2. You are admin
      // 3. You are owner and you suggested the review
      if (isPublished || isAdmin || (isOwner && infos[i].ownerRequested)) {
        meRelations[fromUUID(contentIds[i])] = {
          activityContentId: revisedIds[i],
          status: infos[i].status,
        };

        if (isAdmin || (isOwner && infos[i].ownerRequested)) {
          meRelations[fromUUID(contentIds[i])].reviewRequestDate =
            infos[i].requestedOn;
        }

        // if (isAdmin || isOwner) {
        //   const sourceEvents = infos[i].events;
        //   if (sourceEvents.length > 0) {
        //     meRelations[fromUUID(contentIds[i])].reviewRequestDate =
        //       sourceEvents[0].dateTime;
        //   }
        // }
      }
    }
  }

  // ======== Relation: Source to Me =========

  const sourceRelations: {
    [index: string]: {
      status: LibraryStatus;
      sourceContentId: Uint8Array | null;
      ownerRequested?: boolean;
      reviewRequestDate?: Date;
      primaryEditor?: UserInfo;
      iAmPrimaryEditor?: boolean;
    };
  } = {};

  const sourceInfos = await prisma.libraryActivityInfos.findMany({
    where: {
      contentId: { in: contentIds },
      activity: {
        ...filterViewableActivity(loggedInUserId, isAdmin),
      },
    },
    select: {
      status: true,
      sourceId: true,
      ownerRequested: true,
      requestedOn: true,
      primaryEditor: {
        select: {
          userId: true,
          firstNames: true,
          lastNames: true,
        },
      },
    },
  });

  if (sourceInfos) {
    const sourceIds = await redactInvisibleContentIds({
      contentIds: sourceInfos.map((v) => v.sourceId),
      loggedInUserId,
      isAdmin,
    });

    for (let i = 0; i < sourceInfos.length; i++) {
      sourceRelations[fromUUID(contentIds[i])] = {
        sourceContentId: sourceIds[i],
        status: sourceInfos[i].status,
      };
      if (isAdmin) {
        // Only admins see comments. Owners of original activity must look up comments using their own source id
        // sourceRelations[fromUUID(contentIds[i])].comments =
        //   sourceInfos[i].comments;

        // Only admins can see if owner requested review and the date requested on
        sourceRelations[fromUUID(contentIds[i])].ownerRequested =
          sourceInfos[i].ownerRequested;
        sourceRelations[fromUUID(contentIds[i])].reviewRequestDate =
          sourceInfos[i].requestedOn;

        const primaryEditor = sourceInfos[i].primaryEditor;
        if (primaryEditor) {
          sourceRelations[fromUUID(contentIds[i])].primaryEditor = {
            email: "",
            ...primaryEditor,
          };
          sourceRelations[fromUUID(contentIds[i])].iAmPrimaryEditor =
            isEqualUUID(loggedInUserId, primaryEditor.userId);
        } else {
          sourceRelations[fromUUID(contentIds[i])].iAmPrimaryEditor = false;
        }
      }
    }
  }

  const libraryRelations: LibraryRelations[] = contentIds.map((id) => {
    const source = sourceRelations[fromUUID(id)];
    const me = meRelations[fromUUID(id)];

    const thisRelation: LibraryRelations = {};
    if (source) {
      thisRelation.source = source;
    }
    if (me) {
      thisRelation.activity = me;
    }
    return thisRelation;
  });

  return libraryRelations;
}

export async function getSingleLibraryRelations({
  contentId,
  loggedInUserId = new Uint8Array(16),
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
}) {
  return (
    await getMultipleLibraryRelations({
      contentIds: [contentId],
      loggedInUserId,
    })
  )[0];
}

/**
 * Add activity with id `contentId` to the list of `pending` activities.
 * If the activity has not been suggested before, this function creates a private remix inside the library account.
 * If suggesting this activity is meaningless (already `pending`, `under_review`, or `published`), this function does nothing.
 * @param contentId - must be existing public activity
 * @param loggedInUserId
 */
export async function suggestToBeCurated({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const content = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      isPublic: true,
      ...filterViewableActivity(loggedInUserId, false),
    },
    select: {
      ownerId: true,
      librarySourceInfo: {
        select: {
          status: true,
        },
      },
    },
  });
  const ownerRequested = content
    ? isEqualUUID(loggedInUserId, content.ownerId)
    : false;

  // If this activity is already pending or under review, we will silently do nothing. No need to update the database.

  if (content.librarySourceInfo?.status === LibraryStatus.REJECTED) {
    await prisma.libraryActivityInfos.update({
      where: {
        sourceId: contentId,
      },
      data: {
        ownerRequested,
        requestedOn: new Date(),
        status: LibraryStatus.PENDING,
        events: {
          create: {
            eventType: LibraryEventType.SUGGEST_REVIEW,
            dateTime: new Date(),
            userId: loggedInUserId,
          },
        },
      },
    });
  } else if (!content.librarySourceInfo) {
    const libraryId = await getLibraryAccountId();

    const {
      newContentIds: [remixedId],
    } = await copyContent({
      contentIds: [contentId],
      loggedInUserId: libraryId,
      parentId: null,
    });

    await prisma.libraryActivityInfos.create({
      data: {
        sourceId: contentId,
        contentId: remixedId,
        status: LibraryStatus.PENDING,
        ownerRequested,
        requestedOn: new Date(),
        events: {
          create: {
            dateTime: new Date(),
            eventType: LibraryEventType.SUGGEST_REVIEW,
            userId: loggedInUserId,
          },
        },
      },
    });
  }
}

/**
 * Claim ownership of a `pending` activity in the library. This marks you as the primary editor for this activity and changes status to `under_review`.
 * You can also claim ownership of an activity that's already `under_review`, in which case you replace the existing editor.
 * @param contentId - id of the library-owned remix, not the source content id
 * @param loggedInUserId - must be admin
 */
export async function claimOwnershipOfReview({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);
  await prisma.libraryActivityInfos.update({
    where: {
      contentId,
      OR: [
        {
          status: LibraryStatus.PENDING,
        },
        {
          status: LibraryStatus.UNDER_REVIEW,
        },
      ],
    },
    data: {
      primaryEditorId: loggedInUserId,
      status: LibraryStatus.UNDER_REVIEW,
      events: {
        create: {
          eventType: LibraryEventType.TAKE_OWNERSHIP,
          userId: loggedInUserId,
          dateTime: new Date(),
        },
      },
    },
  });
}

/**
 * Make library activity public and log event.
 * @param contentId - activity in library account with status `under_review`
 * @param loggedInUserId - must be admin
 * @todo notify owner
 */
export async function publishActivityToLibrary({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);
  await prisma.content.update({
    where: {
      id: contentId,
      ...filterEditableActivity(loggedInUserId, true),
      libraryActivityInfo: {
        status: LibraryStatus.UNDER_REVIEW,
      },
      license: {
        isNot: null,
      },
    },
    data: {
      // Publish
      isPublic: true,
      libraryActivityInfo: {
        update: {
          // Update status
          status: LibraryStatus.PUBLISHED,
          // Log publication
          events: {
            create: {
              eventType: LibraryEventType.PUBLISH,
              dateTime: new Date(),
              userId: loggedInUserId,
            },
          },
        },
      },
    },
  });
}

/**
 * Return library activity to `under_review` category and log event.
 * @param contentId - must be existing published (public) activity in library account
 * @param loggedInUserId - must be admin
 */
export async function unpublishActivityFromLibrary({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);
  await prisma.content.update({
    where: {
      id: contentId,
      isPublic: true,
      ...filterEditableActivity(loggedInUserId, true),
      libraryActivityInfo: {
        status: LibraryStatus.PUBLISHED,
      },
    },
    data: {
      isPublic: false,
      libraryActivityInfo: {
        update: {
          status: LibraryStatus.UNDER_REVIEW,
          events: {
            create: {
              eventType: LibraryEventType.UNPUBLISH,
              dateTime: new Date(),
              userId: loggedInUserId,
            },
          },
        },
      },
    },
  });
}

/**
 * Reject activity's request for curation and log event.
 * @param contentId - activity in library account with status `under_review`
 * @param loggedInUserId - must be admin
 */
export async function rejectActivity({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);
  await prisma.libraryActivityInfos.update({
    where: {
      contentId,
      status: LibraryStatus.UNDER_REVIEW,
    },
    data: {
      status: LibraryStatus.REJECTED,
      events: {
        create: {
          eventType: LibraryEventType.REJECT,
          userId: loggedInUserId,
          dateTime: new Date(),
        },
      },
    },
  });
}

/**
 * Post a comment to chat between activity author and editors.
 * @param contentId - source id for author, revised id for editor
 * @param loggedInUserId - must be author or an editor
 */
export async function addComment({
  contentId,
  loggedInUserId,
  comment,
  asEditor = false,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  comment: string;
  asEditor?: boolean;
}) {
  if (asEditor) {
    await mustBeAdmin(loggedInUserId);
  }
  await prisma.libraryActivityInfos.update({
    where: {
      sourceId: contentId,
      source: {
        ownerId: asEditor ? undefined : loggedInUserId,
      },
      OR: [
        {
          ownerRequested: true,
        },
        {
          status: LibraryStatus.PUBLISHED,
        },
      ],
    },
    data: {
      events: {
        create: {
          eventType: LibraryEventType.ADD_COMMENT,
          userId: loggedInUserId,
          dateTime: new Date(),
          comment,
        },
      },
    },
  });
}

/**
 * Get a list of all comments about this library review
 * @param contentId - source id for author, revised id for editor
 * @param loggedInUserId - must be author or an editor
 */
export async function getComments({
  contentId,
  loggedInUserId,
  asEditor = false,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  asEditor?: boolean;
}) {
  if (asEditor) {
    await mustBeAdmin(loggedInUserId);
  } else {
    // Must be owner
    await prisma.content.findUniqueOrThrow({
      where: { id: contentId, ownerId: loggedInUserId },
      select: { id: true },
    });
  }

  return await prisma.libraryEvents.findMany({
    where: {
      eventType: LibraryEventType.ADD_COMMENT,
      info: {
        contentId: asEditor ? contentId : undefined,
        sourceId: asEditor ? undefined : contentId,
      },
    },
    select: {
      comment: true,
      dateTime: true,
      userId: true,
      user: {
        select: {
          firstNames: true,
          lastNames: true,
        },
      },
    },
  });
}

export async function getCurationFolderContent({
  parentId,
  loggedInUserId,
}: {
  parentId: Uint8Array | null;
  loggedInUserId: Uint8Array;
}) {
  return await getMyContentOrLibraryContent({
    parentId,
    loggedInUserId,
    isLibrary: true,
  });
}

export async function searchCurationFolderContent({
  parentId,
  loggedInUserId,
  query,
}: {
  parentId: Uint8Array | null;
  loggedInUserId: Uint8Array;
  query: string;
}) {
  return await searchMyContentOrLibraryContent({
    parentId,
    loggedInUserId,
    query,
    inLibrary: true,
  });
}

export async function createCurationFolder({
  loggedInUserId,
  name,
  parentId,
}: {
  name: string;
  loggedInUserId: Uint8Array;
  parentId: Uint8Array | null;
}) {
  await createContent({
    loggedInUserId,
    name,
    contentType: "folder",
    parentId,
    inLibrary: true,
  });
}

/**
 * Get all pending curation requests, sorted by submission date oldest to newest.
 * Must be admin to call function.
 */
export async function getCurationQueue({
  loggedInUserId,
}: {
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);

  async function getLibraryContentWithStatus({
    status,
    cap,
  }: {
    status: LibraryStatus;
    cap?: number;
  }): Promise<[Content[], LibraryRelations[]]> {
    const results = await prisma.libraryEvents.findMany({
      where: {
        info: {
          status,
          activity: {
            ...filterViewableContent(loggedInUserId, true),
          },
        },
      },
      orderBy: {
        dateTime: "desc",
      },
      select: {
        info: {
          select: {
            activity: {
              select: returnContentSelect({
                includeOwnerDetails: true,
                includeClassifications: true,
              }),
            },
          },
        },
      },
      distinct: "infoId",
      take: cap ?? undefined,
    });

    const content: Content[] = results
      .map((result) => result.info.activity)
      //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
      .map(processContent);
    const library = await getMultipleLibraryRelations({
      contentIds: content.map((c) => c.contentId),
      loggedInUserId,
    });

    // Replace library owner info with source owner info
    const curatedUsers = await Promise.all(
      content.map(
        async (c) =>
          await maskLibraryUserInfo({
            contentId: c.contentId,
            owner: c.owner!,
          }),
      ),
    );
    for (let i = 0; i < content.length; i++) {
      content[i].owner = curatedUsers[i];
    }

    console.assert(
      content.length === library.length,
      "Content length %i should be equal to library relations length %i",
      content.length,
      library.length,
    );

    return [content, library];
  }

  const [pendingContent, pendingLibraryRelations] =
    await getLibraryContentWithStatus({ status: LibraryStatus.PENDING });

  const [underReviewContent, underReviewLibraryRelations] =
    await getLibraryContentWithStatus({ status: LibraryStatus.UNDER_REVIEW });

  const [rejectedContent, rejectedLibraryRelations] =
    await getLibraryContentWithStatus({
      status: LibraryStatus.REJECTED,
      cap: 100,
    });

  const [publishedContent, publishedLibraryRelations] =
    await getLibraryContentWithStatus({
      status: LibraryStatus.PUBLISHED,
      cap: 100,
    });

  const { availableFeatures } = await getAvailableContentFeatures();
  const { allDoenetmlVersions } = await getAllDoenetmlVersions();
  const { allLicenses } = await getAllLicenses();

  return {
    pendingContent,
    pendingLibraryRelations,
    underReviewContent,
    underReviewLibraryRelations,
    rejectedContent,
    rejectedLibraryRelations,
    publishedContent,
    publishedLibraryRelations,
    availableFeatures,
    allDoenetmlVersions,
    allLicenses,
  };
}
