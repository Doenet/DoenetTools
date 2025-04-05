import { ContentType, LibraryEventType, LibraryStatus } from "@prisma/client";
import { prisma } from "../model";
import { Content, LibraryRelations } from "../types";
import { InvalidRequestError } from "../utils/error";
import { fromUUID } from "../utils/uuid";
import { createContent, getDescendantIds } from "./activity";
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

/**
 *
 * Depending on user's access privileges, this function will hide some information.
 * - Admins see everything
 * - Owner of original activity does not see unpublished drafts
 * - All other users do not see admin comments, pending requests, or unpublished drafts
 * @param id - must be existing public activity
 */
export async function getLibraryRelations({
  contentIds,
  loggedInUserId,
}: {
  contentIds: Uint8Array[];
  loggedInUserId: Uint8Array;
}): Promise<LibraryRelations[]> {
  const isAdmin = await getIsAdmin(loggedInUserId);

  // ======== Relation: Me to Revised =========

  const meRelations: {
    [index: string]: {
      status: LibraryStatus;
      activityContentId: Uint8Array | null;
      comments?: string;
      reviewRequestDate?: Date;
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
      comments: true,
      contentId: true,
      source: {
        select: {
          librarySourceEvents: {
            // Date of most recent submission
            take: 1,
            orderBy: { dateTime: "desc" as const },
            where: {
              eventType: LibraryEventType.SUBMIT_REQUEST,
            },
            select: {
              dateTime: true,
            },
          },
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
    const isOwner = new Set(isOwnerList.map((v) => fromUUID(v.id)));

    for (let i = 0; i < infos.length; i++) {
      const isAdminOrOwner = isAdmin || isOwner.has(fromUUID(contentIds[i]));
      const sourceEvents = infos[i].source.librarySourceEvents;

      if (isAdminOrOwner || infos[i].status === LibraryStatus.PUBLISHED) {
        meRelations[fromUUID(contentIds[i])] = {
          activityContentId: revisedIds[i],
          status: infos[i].status,
        };
        if (isAdminOrOwner) {
          meRelations[fromUUID(contentIds[i])].comments = infos[i].comments;
          if (sourceEvents.length > 0) {
            meRelations[fromUUID(contentIds[i])].reviewRequestDate =
              sourceEvents[0].dateTime;
          }
        }
      }
    }
  }

  // ======== Relation: Source to Me =========

  const sourceRelations: {
    [index: string]: {
      status: LibraryStatus;
      sourceContentId: Uint8Array | null;
      comments?: string;
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
      comments: true,
      sourceId: true,
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
        sourceRelations[fromUUID(contentIds[i])].comments =
          sourceInfos[i].comments;
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
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  return (
    await getLibraryRelations({ contentIds: [contentId], loggedInUserId })
  )[0];
}

/**
 * Set library status to `PENDING_REVIEW`. Also logs event in library history.
 * @param contentId - must be existing public activity
 * @param loggedInUserId - must be owner of contentId
 */
export async function submitLibraryRequest({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const isOwner = await prisma.content.findUnique({
    where: {
      id: contentId,
      isPublic: true,
      ownerId: loggedInUserId,
    },
    select: { id: true },
  });
  if (!isOwner) {
    throw new InvalidRequestError(
      "Activity does not exist, is not public, or is not owned by you.",
    );
  }

  const updateLibInfo = prisma.libraryActivityInfos.upsert({
    where: {
      sourceId: contentId,
      source: {
        isPublic: true,
        NOT: {
          type: ContentType.folder,
        },
        isDeleted: false,
        ownerId: loggedInUserId,
      },
      OR: [
        {
          status: LibraryStatus.NEEDS_REVISION,
        },
        {
          status: LibraryStatus.REQUEST_REMOVED,
        },
      ],
    },
    update: {
      status: LibraryStatus.PENDING_REVIEW,
      ownerRequested: true,
    },
    create: {
      sourceId: contentId,
      status: LibraryStatus.PENDING_REVIEW,
      comments: "",
      ownerRequested: true,
    },
  });

  const newEvent = prisma.libraryEvents.create({
    data: {
      sourceId: contentId,
      eventType: LibraryEventType.SUBMIT_REQUEST,
      dateTime: new Date(),
      comments: "",
      userId: loggedInUserId,
    },
  });

  await prisma.$transaction([updateLibInfo, newEvent]);
}
/**
 * Set library status to `REQUEST_REMOVED`. Also logs event in library history.
 * @param contentId - must be existing public activity
 * @param loggedInUserId - must be owner of contentId
 *
 */
export async function cancelLibraryRequest({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const updateLibInfo = prisma.libraryActivityInfos.update({
    where: {
      sourceId: contentId,
      source: {
        isPublic: true,
        NOT: {
          type: ContentType.folder,
        },
        isDeleted: false,
        ownerId: loggedInUserId,
      },
      status: LibraryStatus.PENDING_REVIEW,
    },
    data: {
      status: LibraryStatus.REQUEST_REMOVED,
    },
  });

  const newEvent = prisma.libraryEvents.create({
    data: {
      sourceId: contentId,
      eventType: LibraryEventType.CANCEL_REQUEST,
      dateTime: new Date(),
      comments: "",
      userId: loggedInUserId,
    },
  });

  await prisma.$transaction([updateLibInfo, newEvent]);
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
 * Remix activity into library account.
 * Error if a draft already exists in the library
 * @param contentId - must be existing public activity not owned by library
 * @param loggedInUserId - must be admin
 */
export async function addDraftToLibrary({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);

  const sourceIsInvalid = await prisma.libraryActivityInfos.findFirst({
    where: {
      OR: [
        {
          // Source activity already has remixed version in library
          sourceId: contentId,
          NOT: { contentId: null },
        },
        {
          // Source activity is library activity
          contentId: contentId,
          activity: {
            owner: {
              isLibrary: true,
            },
          },
        },
        {
          // Source id is folder
          sourceId: contentId,
          activity: {
            type: "folder",
          },
        },
      ],
    },
    select: {
      contentId: true,
      activity: {
        select: {
          type: true,
        },
      },
    },
  });

  if (sourceIsInvalid) {
    if (sourceIsInvalid.contentId !== null) {
      throw new InvalidRequestError(
        `Already included in library, see activity ${fromUUID(sourceIsInvalid.contentId!)}`,
      );
    } else if (sourceIsInvalid.activity?.type === "folder") {
      throw new InvalidRequestError(`Cannot add folder to library`);
    } else {
      throw new InvalidRequestError(`Cannot add draft of curated activity`);
    }
  }

  const libraryId = await getLibraryAccountId();

  const {
    newContentIds: [draftId],
  } = await copyContent({
    contentIds: [contentId],
    loggedInUserId: libraryId,
    parentId: null,
  });

  await prisma.libraryActivityInfos.upsert({
    where: {
      sourceId: contentId,
    },
    update: {
      contentId: draftId,
    },
    create: {
      sourceId: contentId,
      contentId: draftId,
      ownerRequested: false,
      status: LibraryStatus.PENDING_REVIEW,
    },
  });

  await prisma.libraryEvents.create({
    data: {
      sourceId: contentId,
      contentId: draftId,
      dateTime: new Date(),
      eventType: LibraryEventType.ADD_DRAFT,
      userId: loggedInUserId,
      comments: "",
    },
  });

  return { draftId };
}
/**
 * Soft delete draft and log event.
 * @param draftId - must be existing draft (private activity) in library account
 * @param loggedInUserId - must be admin
 */
export async function deleteDraftFromLibrary({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);
  const { sourceId } = await prisma.libraryActivityInfos.findUniqueOrThrow({
    where: {
      contentId,
    },
    select: {
      sourceId: true,
    },
  });

  const ensureDraftExists = prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      isPublic: false,
      owner: {
        isLibrary: true,
      },
      ...filterEditableActivity(loggedInUserId, true),
    },
    select: { id: true },
  });

  const draftDescendants = await getDescendantIds(contentId);

  const deleteDraft = prisma.content.updateMany({
    where: { id: { in: [contentId, ...draftDescendants] } },
    data: { isDeleted: true },
  });

  const removeLibraryIdRef = prisma.libraryActivityInfos.update({
    where: { contentId },
    data: { contentId: null },
  });

  const logDeletion = prisma.libraryEvents.create({
    data: {
      sourceId,
      contentId,
      eventType: LibraryEventType.DELETE_DRAFT,
      dateTime: new Date(),
      userId: loggedInUserId,
    },
  });

  await prisma.$transaction([
    ensureDraftExists,
    deleteDraft,
    removeLibraryIdRef,
    logDeletion,
  ]);
}

/**
 * Make library activity public and log event.
 * @param draftId - must be existing draft (private activity) in library account
 * @param loggedInUserId - must be admin
 * @todo notify owner
 */
export async function publishActivityToLibrary({
  draftId,
  loggedInUserId,
  comments,
}: {
  draftId: Uint8Array;
  loggedInUserId: Uint8Array;
  comments: string;
}) {
  await mustBeAdmin(loggedInUserId);
  const libraryId = await getLibraryAccountId();
  const { sourceId } = await prisma.libraryActivityInfos.findUniqueOrThrow({
    where: {
      contentId: draftId,
    },
    select: {
      sourceId: true,
    },
  });

  await prisma.content.update({
    where: {
      id: draftId,
      isPublic: false,
      isDeleted: false,
      NOT: {
        type: ContentType.folder,
      },
      ownerId: libraryId,
      license: {
        isNot: null,
      },
    },
    data: {
      // Publish
      isPublic: true,
      // Update status
      libraryActivityInfo: {
        update: {
          status: LibraryStatus.PUBLISHED,
          comments,
        },
      },
      // Log publication
      libraryActivityEvents: {
        create: {
          sourceId,
          eventType: LibraryEventType.PUBLISH,
          dateTime: new Date(),
          userId: loggedInUserId,
          comments,
        },
      },
    },
  });
}

/**
 * Make library activity private and log event.
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
  const libraryId = await getLibraryAccountId();
  const { sourceId } = await prisma.libraryActivityInfos.findUniqueOrThrow({
    where: {
      contentId: contentId,
    },
    select: {
      sourceId: true,
    },
  });

  await prisma.content.update({
    where: {
      id: contentId,
      isPublic: true,
      NOT: {
        type: ContentType.folder,
      },
      isDeleted: false,
      ownerId: libraryId,
      libraryActivityInfo: {
        status: LibraryStatus.PUBLISHED,
      },
    },
    data: {
      isPublic: false,
      libraryActivityInfo: {
        update: {
          // TODO: should we use the pending review status here or another status?
          status: LibraryStatus.PENDING_REVIEW,
        },
      },
      libraryActivityEvents: {
        create: {
          sourceId,
          eventType: LibraryEventType.UNPUBLISH,
          dateTime: new Date(),
          userId: loggedInUserId,
        },
      },
    },
  });
}

/**
 * Set library status to `NEEDS_REVISION` and log event.
 * @param sourceId - original activity, must exist and be public, must have status `PENDING REVIEW`
 * @param comments - will be displayed to original owner
 * @param userId - must be admin
 * @todo notify owner
 */
export async function markLibraryRequestNeedsRevision({
  sourceId,
  comments,
  loggedInUserId,
}: {
  sourceId: Uint8Array;
  comments: string;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);

  await prisma.content.update({
    where: {
      id: sourceId,
      isPublic: true,
      NOT: {
        type: ContentType.folder,
      },
      isDeleted: false,
      librarySourceInfo: {
        status: LibraryStatus.PENDING_REVIEW,
        ownerRequested: true,
      },
    },
    data: {
      librarySourceInfo: {
        update: {
          status: LibraryStatus.NEEDS_REVISION,
          comments,
        },
      },
      librarySourceEvents: {
        create: {
          eventType: LibraryEventType.MARK_NEEDS_REVISION,
          dateTime: new Date(),
          userId: loggedInUserId,
          comments,
        },
      },
    },
  });
}

/**
 * Change comments to owner and log event.
 * @param sourceId - original activity, must be public and have library status
 * @param comments - updated comments sent to owner
 * @param userId - must be admin
 * @todo notify owner
 */
export async function modifyCommentsOfLibraryRequest({
  sourceId,
  comments,
  loggedInUserId,
}: {
  sourceId: Uint8Array;
  comments: string;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);

  const { contentId } = await prisma.libraryActivityInfos.findUniqueOrThrow({
    where: {
      sourceId,
    },
    select: {
      contentId: true,
    },
  });

  await prisma.content.update({
    where: {
      id: sourceId,
      isPublic: true,
      isDeleted: false,
      NOT: {
        type: ContentType.folder,
        librarySourceInfo: null,
      },
    },
    data: {
      librarySourceInfo: {
        update: {
          comments,
        },
      },
      librarySourceEvents: {
        create: {
          contentId,
          eventType: LibraryEventType.MODIFY_COMMENTS,
          dateTime: new Date(),
          comments,
          userId: loggedInUserId,
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
export async function getPendingCurationRequests({
  loggedInUserId,
}: {
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);

  const preliminaryContent = await prisma.content.findMany({
    where: {
      ...filterViewableContent(loggedInUserId, true),
      librarySourceInfo: {
        ownerRequested: true,
        status: LibraryStatus.PENDING_REVIEW,
      },
    },
    select: returnContentSelect({
      includeOwnerDetails: true,
      includeClassifications: true,
    }),
  });

  //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
  const unsortedContent: Content[] = preliminaryContent.map(processContent);

  const unsortedLibraryRelations = await getLibraryRelations({
    contentIds: unsortedContent.map((c) => c.contentId),
    loggedInUserId,
  });

  if (unsortedContent.length !== unsortedLibraryRelations.length) {
    throw new Error("Content and library relations do not match in length.");
  }

  // Zip and sort in ascending order by submit date
  const contentAndLibrary = unsortedContent.map((c, i) => {
    return { content: c, library: unsortedLibraryRelations[i] };
  });
  contentAndLibrary.sort(
    (a, b) =>
      a.library.activity!.reviewRequestDate!.getTime() -
      b.library.activity!.reviewRequestDate!.getTime(),
  );

  // Unzip
  const content = contentAndLibrary.map((v) => v.content);
  const libraryRelations = contentAndLibrary.map((v) => v.library);

  return {
    content,
    libraryRelations,
  };
}
