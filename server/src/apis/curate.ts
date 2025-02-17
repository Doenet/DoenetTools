import { InvalidRequestError, prisma } from "../model";

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
 *
 * Depending on user's access privileges, this function will hide some information.
 * - Admins see everything
 * - Owner of original activity does not see unpublished drafts
 * - All other users do not see admin comments, pending requests, or unpublished drafts
 * @param id - must be existing public activity
 */
export async function getLibraryStatus({
  id,
  userId,
}: {
  id: Uint8Array;
  userId: Uint8Array;
}): Promise<LibraryInfo> {
  const info = await prisma.libraryActivityInfos.findUnique({
    where: {
      sourceId: id,
    },
    select: {
      status: true,
      comments: true,
      sourceId: true,
      activityId: true,
    },
  });

  // No info in database
  if (!info) {
    return blankLibraryInfo(id);
  }

  const { activityId, comments, ...basicInfo } = info;
  const isPublished = info.status === LibraryStatus.PUBLISHED;

  // Admin
  const isAdmin = await getIsAdmin(userId);
  if (isAdmin) {
    return info;
  }

  //Owner
  const isOwner = await prisma.content.findUnique({
    where: { id, ownerId: userId },
    select: { ownerId: true },
  });
  if (isOwner) {
    return {
      activityId: isPublished ? activityId : null,
      comments,
      ...basicInfo,
    };
  }

  // All other users
  if (isPublished) {
    return {
      activityId,
      ...basicInfo,
    };
  }

  return blankLibraryInfo(id);
}

/**
 * Set library status to `PENDING_REVIEW`. Also logs event in library history.
 * @param activityId - must be existing public activity
 * @param ownerId - must be owner of activityId
 */
export async function submitLibraryRequest({
  activityId,
  ownerId,
}: {
  activityId: Uint8Array;
  ownerId: Uint8Array;
}) {
  const isOwner = await prisma.content.findUnique({
    where: {
      id: activityId,
      isPublic: true,
      ownerId,
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
      sourceId: activityId,
      source: {
        isPublic: true,
        isFolder: false,
        isDeleted: false,
        ownerId,
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
      sourceId: activityId,
      status: LibraryStatus.PENDING_REVIEW,
      comments: "",
      ownerRequested: true,
    },
  });

  const newEvent = prisma.libraryEvents.create({
    data: {
      sourceId: activityId,
      eventType: LibraryEventType.SUBMIT_REQUEST,
      dateTime: new Date(),
      comments: "",
      userId: ownerId,
    },
  });

  await prisma.$transaction([updateLibInfo, newEvent]);
}
/**
 * Set library status to `REQUEST_REMOVED`. Also logs event in library history.
 * @param activityId - must be existing public activity
 * @param ownerId - must be owner of activityId
 *
 */
export async function cancelLibraryRequest({
  activityId,
  ownerId,
}: {
  activityId: Uint8Array;
  ownerId: Uint8Array;
}) {
  const updateLibInfo = prisma.libraryActivityInfos.update({
    where: {
      sourceId: activityId,
      source: {
        isPublic: true,
        isFolder: false,
        isDeleted: false,
        ownerId,
      },
      status: LibraryStatus.PENDING_REVIEW,
    },
    data: {
      status: LibraryStatus.REQUEST_REMOVED,
    },
  });

  const newEvent = prisma.libraryEvents.create({
    data: {
      sourceId: activityId,
      eventType: LibraryEventType.CANCEL_REQUEST,
      dateTime: new Date(),
      comments: "",
      userId: ownerId,
    },
  });

  await prisma.$transaction([updateLibInfo, newEvent]);
}

async function getLibraryAccountId() {
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
 * @param id - must be existing public activity not owned by library
 * @param loggedInUserId - must be admin
 */
export async function addDraftToLibrary({
  id,
  contentType,
  loggedInUserId,
}: {
  id: Uint8Array;
  contentType: ContentType;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);

  const sourceIsLibOrDraftExists = await prisma.libraryActivityInfos.findFirst({
    where: {
      OR: [
        {
          sourceId: id,
          NOT: { activityId: null },
        },
        {
          activityId: id,
          activity: {
            owner: {
              isLibrary: true,
            },
          },
        },
      ],
    },
    select: {
      activityId: true,
    },
  });

  if (sourceIsLibOrDraftExists) {
    if (sourceIsLibOrDraftExists.activityId !== null) {
      throw new InvalidRequestError(
        `Already included in library, see activity ${fromUUID(sourceIsLibOrDraftExists.activityId!)}`,
      );
    } else {
      throw new InvalidRequestError(`Cannot add draft of curated activity`);
    }
  }

  const libraryId = await getLibraryAccountId();

  let draftId;

  if (contentType === "singleDoc") {
    draftId = await copyActivityToFolder(id, libraryId, null);
  } else {
    draftId = (await copyFolderToFolder(id, libraryId, null))[0];
  }

  await prisma.libraryActivityInfos.upsert({
    where: {
      sourceId: id,
    },
    update: {
      activityId: draftId,
    },
    create: {
      sourceId: id,
      activityId: draftId,
      ownerRequested: false,
      status: LibraryStatus.PENDING_REVIEW,
    },
  });

  await prisma.libraryEvents.create({
    data: {
      sourceId: id,
      activityId: draftId,
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
  draftId,
  loggedInUserId,
  contentType,
}: {
  draftId: Uint8Array;
  loggedInUserId: Uint8Array;
  contentType: ContentType;
}) {
  await mustBeAdmin(loggedInUserId);
  const libraryId = await getLibraryAccountId();
  const { sourceId } = await prisma.libraryActivityInfos.findUniqueOrThrow({
    where: {
      activityId: draftId,
    },
    select: {
      sourceId: true,
    },
  });

  if (contentType === "folder") {
    throw new InvalidRequestError(
      "Cannot delete a folder as a draft library content",
    );
  }

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: {
      id: draftId,
      isPublic: false, // This is key! We're only deleting unpublished drafts here
      ownerId: libraryId,
      type: contentType,
      isDeleted: false,
    },
    select: { id: true },
  });

  let deleteDraft;

  if (contentType === "singleDoc") {
    deleteDraft = prisma.content.update({
      where: {
        id: draftId,
        isPublic: false,
        isDeleted: false,
        isFolder: false,
        ownerId: libraryId,
      },
      data: {
        // soft delete activity
        isDeleted: true,
        documents: {
          updateMany: {
            where: {},
            data: {
              // soft delete documents
              isDeleted: true,
            },
          },
        },
      },
    });
  } else {
    deleteDraft = prisma.$queryRaw(Prisma.sql`
      WITH RECURSIVE content_tree(id) AS (
        SELECT id FROM content
        WHERE id = ${draftId} AND ownerId = ${libraryId} AND isPublic = FALSE
        UNION ALL
        SELECT content.id FROM content
        INNER JOIN content_tree AS ft
        ON content.parentId = ft.id
      )
  
      UPDATE content LEFT JOIN documents ON documents.activityId  = content.id
        SET content.isDeleted = TRUE, documents.isDeleted = TRUE
        WHERE content.id IN (SELECT id from content_tree);
      `);
  }

  const removeLibraryIdRef = prisma.libraryActivityInfos.update({
    where: {
      activityId: draftId,
    },
    data: {
      activityId: null,
    },
  });

  const logDeletion = prisma.libraryEvents.create({
    data: {
      sourceId,
      activityId: draftId,
      eventType: LibraryEventType.DELETE_DRAFT,
      dateTime: new Date(),
      userId: loggedInUserId,
    },
  });

  await prisma.$transaction([deleteDraft, removeLibraryIdRef, logDeletion]);
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
      activityId: draftId,
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
      isFolder: false,
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
 * @param activityId - must be existing published (public) activity in library account
 * @param loggedInUserId - must be admin
 */
export async function unpublishActivityFromLibrary({
  activityId,
  loggedInUserId,
}: {
  activityId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);
  const libraryId = await getLibraryAccountId();
  const { sourceId } = await prisma.libraryActivityInfos.findUniqueOrThrow({
    where: {
      activityId: activityId,
    },
    select: {
      sourceId: true,
    },
  });

  await prisma.content.update({
    where: {
      id: activityId,
      isPublic: true,
      isFolder: false,
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
  userId,
}: {
  sourceId: Uint8Array;
  comments: string;
  userId: Uint8Array;
}) {
  await mustBeAdmin(userId);

  await prisma.content.update({
    where: {
      id: sourceId,
      isPublic: true,
      isFolder: false,
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
          userId,
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
  userId,
}: {
  sourceId: Uint8Array;
  comments: string;
  userId: Uint8Array;
}) {
  await mustBeAdmin(userId);

  const { activityId } = await prisma.libraryActivityInfos.findUniqueOrThrow({
    where: {
      sourceId,
    },
    select: {
      activityId: true,
    },
  });

  await prisma.content.update({
    where: {
      id: sourceId,
      isPublic: true,
      isFolder: false,
      isDeleted: false,
      NOT: {
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
          activityId,
          eventType: LibraryEventType.MODIFY_COMMENTS,
          dateTime: new Date(),
          comments,
          userId,
        },
      },
    },
  });
}
