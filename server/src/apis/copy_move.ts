const SORT_INCREMENT = 2 ** 32;

type ShiftIndicesCallbackFunction = ({
  shift,
  sortIndices,
}: {
  shift: { increment: number } | { decrement: number };
  sortIndices: { gte: number } | { lte: number };
}) => Promise<void>;

/**
 * Move the content with `id` to position `desiredPosition` in the folder `desiredParentId`
 * (where an undefined `desiredParentId` indicates the root folder of `ownerId`).
 *
 * `desiredPosition` is the 0-based index in the array of content with parent folder `desiredParentId`
 * and owner `ownerId` sorted by `sortIndex`.
 *
 * If the content is in the library account, set `inLibrary` to `true`. This will allows admins to make changes.
 */
export async function moveContent({
  id,
  desiredParentId,
  desiredPosition,
  ownerId: loggedInUserId,
  inLibrary = false,
}: {
  id: Uint8Array;
  desiredParentId: Uint8Array | null;
  desiredPosition: number;
  ownerId: Uint8Array;
  inLibrary?: boolean;
}) {
  if (!Number.isInteger(desiredPosition)) {
    throw Error("desiredPosition must be an integer");
  }

  let ownerId = loggedInUserId;
  if (inLibrary) {
    await mustBeAdmin(loggedInUserId);
    ownerId = await getLibraryAccountId();
  }

  // make sure content exists and is owned by `ownerId`
  const content = (await prisma.content.findUniqueOrThrow({
    where: {
      id,
      ownerId,
      isDeleted: false,
    },
    select: { id: true, isFolder: true, licenseCode: true },
  })) as {
    id: Uint8Array;
    isFolder: boolean;
    licenseCode: LicenseCode | null;
  };

  let desiredFolderIsPublic = false;
  let desiredFolderLicenseCode: LicenseCode = "CCDUAL";
  let desiredFolderShares: Uint8Array[] = [];

  if (desiredParentId !== null) {
    // if desired parent folder is specified, make sure it exists and is owned by `ownerId`
    const parent = await prisma.content.findUniqueOrThrow({
      where: {
        id: desiredParentId,
        ownerId,
        isDeleted: false,
        isFolder: true,
      },
      select: {
        isPublic: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
      },
    });

    // If the parent folder is shared, then we'll need to share the resulting content, as well.
    if (parent.isPublic) {
      desiredFolderIsPublic = true;
      if (parent.licenseCode) {
        desiredFolderLicenseCode = parent.licenseCode as LicenseCode;
      }
    }
    if (parent.sharedWith.length > 0) {
      desiredFolderShares = parent.sharedWith.map((cs) => cs.userId);
      if (parent.licenseCode) {
        desiredFolderLicenseCode = parent.licenseCode as LicenseCode;
      }
    }

    if (content.isFolder) {
      // if content is a folder and moving it to another folder,
      // make sure that folder is not itself or a subfolder of itself

      if (isEqualUUID(desiredParentId, content.id)) {
        throw Error("Cannot move folder into itself");
      }

      const subfolders = await prisma.$queryRaw<
        {
          id: Uint8Array;
        }[]
      >(Prisma.sql`
        WITH RECURSIVE folder_tree(id) AS (
          SELECT id FROM content
          WHERE parentId = ${content.id} AND isFolder = TRUE 
          UNION ALL
          SELECT c.id FROM content AS c
          INNER JOIN folder_tree AS ft
          ON c.parentId = ft.id
          WHERE c.isFolder = TRUE 
        )

        SELECT * FROM folder_tree
        `);

      if (
        subfolders.findIndex((sf) => isEqualUUID(sf.id, desiredParentId)) !== -1
      ) {
        throw Error("Cannot move folder into a subfolder of itself");
      }
    }
  }

  // find the sort indices of all content in folder other than moved content
  const currentSortIndices = (
    await prisma.content.findMany({
      where: {
        ownerId,
        parentId: desiredParentId,
        id: { not: id },
        isDeleted: false,
      },
      select: {
        sortIndex: true,
      },
      orderBy: { sortIndex: "asc" },
    })
  ).map((obj) => obj.sortIndex);

  // the shift callback will shift all sort indices up or down, if needed to make room
  // for a sort index at the desired position
  const shiftCallback: ShiftIndicesCallbackFunction = async function ({
    shift,
    sortIndices,
  }: {
    shift: { increment: number } | { decrement: number };
    sortIndices: { gte: number } | { lte: number };
  }) {
    await prisma.content.updateMany({
      where: {
        ownerId,
        parentId: desiredParentId,
        id: { not: id },
        sortIndex: sortIndices,
        isDeleted: false,
      },
      data: {
        sortIndex: shift,
      },
    });
  };

  const newSortIndex = await calculateNewSortIndex(
    currentSortIndices,
    desiredPosition,
    shiftCallback,
  );

  // Move the item!
  await prisma.content.update({
    where: { id },
    data: {
      sortIndex: newSortIndex,
      parentId: desiredParentId,
    },
  });

  if (desiredFolderIsPublic) {
    if (content.isFolder) {
      await makeFolderPublic({
        id: content.id,
        ownerId,
        licenseCode: content.licenseCode ?? desiredFolderLicenseCode,
      });
    } else {
      await makeActivityPublic({
        id: content.id,
        ownerId,
        licenseCode: content.licenseCode ?? desiredFolderLicenseCode,
      });
    }
  }

  if (desiredFolderShares.length > 0) {
    if (content.isFolder) {
      await shareFolder({
        id: content.id,
        ownerId,
        licenseCode: content.licenseCode ?? desiredFolderLicenseCode,
        users: desiredFolderShares,
      });
    } else {
      await shareActivity({
        id: content.id,
        ownerId,
        licenseCode: content.licenseCode ?? desiredFolderLicenseCode,
        users: desiredFolderShares,
      });
    }
  }
}

/**
 * We calculate the new sortIndex of an item so that it will have the `desiredPosition`
 * within the array `currentItems` of sort indices.
 *
 * If it turns out that we need to shift the sort indices of `currentItems`
 * in order to fit a new item at `desiredPosition`,
 * then `shiftIndicesCallback` will be called to increment or decrement a subset of the sort indices.
 *
 * @param currentItems
 * @param desiredPosition
 * @param shiftIndicesCallback
 * @returns a promise resolving to the new sortIndex
 */
async function calculateNewSortIndex(
  currentSortIndices: bigint[],
  desiredPosition: number,
  shiftIndicesCallback: ShiftIndicesCallbackFunction,
) {
  if (currentSortIndices.length === 0) {
    return 0;
  } else if (desiredPosition <= 0) {
    return Number(currentSortIndices[0]) - SORT_INCREMENT;
  } else if (desiredPosition >= currentSortIndices.length) {
    return (
      Number(currentSortIndices[currentSortIndices.length - 1]) + SORT_INCREMENT
    );
  } else {
    const precedingSortIndex = Number(currentSortIndices[desiredPosition - 1]);
    const followingSortIndex = Number(currentSortIndices[desiredPosition]);
    const candidateSortIndex = Math.round(
      (precedingSortIndex + followingSortIndex) / 2,
    );
    if (
      candidateSortIndex > precedingSortIndex &&
      candidateSortIndex < followingSortIndex
    ) {
      return candidateSortIndex;
    } else {
      // There is no room in sort indices to insert a new item at `desiredLocation`,
      // as the distance between precedingSortIndex and followingSortIndex is too small to fit another integer
      // (presumably because the distance is 1, though possibly a larger distance if we are outside
      // the bounds of safe integers in Javascript).
      // We need to re-index; we shift the smaller set of items preceding or following the desired location.
      if (desiredPosition >= currentSortIndices.length / 2) {
        // We add `SORT_INCREMENT` to all items with sort index `followingSortIndex` or larger.
        await shiftIndicesCallback({
          shift: {
            increment: SORT_INCREMENT,
          },
          sortIndices: {
            gte: followingSortIndex,
          },
        });

        return Math.round(
          (precedingSortIndex + followingSortIndex + SORT_INCREMENT) / 2,
        );
      } else {
        // We subtract `SORT_INCREMENT` from all items with sort index `precedingSortIndex` or smaller.
        await shiftIndicesCallback({
          shift: {
            decrement: SORT_INCREMENT,
          },
          sortIndices: {
            lte: precedingSortIndex,
          },
        });

        return Math.round(
          (precedingSortIndex - SORT_INCREMENT + followingSortIndex) / 2,
        );
      }
    }
  }
}

/**
 * Copies the activity given by `origActivityId` into `folderId`, as the last item in that folder.
 *
 * Adds `origActivityId` and its contributor history to the contributor history of the new activity.
 *
 * Throws an error if `userId` doesn't have access to `origActivityId`.
 *
 * @param origActivityId - an existing activity
 * @param userId
 * @param desiredParentId - must be an existing folder which is owned by `userId` or, if the user is an admin, an existing _library_ folder
 * @returns new activity id
 */
export async function copyActivityToFolder(
  origActivityId: Uint8Array,
  userId: Uint8Array,
  desiredParentId: Uint8Array | null,
  prependCopy = false,
) {
  const isAdmin = await getIsAdmin(userId);
  const origActivity = await prisma.content.findUniqueOrThrow({
    where: {
      id: origActivityId,
      ...filterViewableActivity(userId, isAdmin),
    },
    include: {
      documents: {
        where: { isDeleted: false },
      },
      classifications: true,
      contentFeatures: true,
    },
  });

  if (origActivity.type !== "singleDoc") {
    throw Error(
      "Cannot copy anything but a single document with copyActivityToFolder",
    );
  }

  let desiredFolderIsPublic = false;
  let desiredFolderLicenseCode: LicenseCode = "CCDUAL";
  let desiredFolderShares: Uint8Array[] = [];

  if (desiredParentId !== null) {
    // if desired parent is specified, make sure it exists and is owned by `userId`
    const parent = await prisma.content.findUniqueOrThrow({
      where: {
        id: desiredParentId,
        ownerId: userId,
        isDeleted: false,
        isFolder: true,
      },
      select: {
        isPublic: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
      },
    });

    // If the parent folder is shared, then we'll need to share the resulting content, as well,
    // with the same license.
    if (parent.isPublic) {
      desiredFolderIsPublic = true;
      if (parent.licenseCode) {
        desiredFolderLicenseCode = parent.licenseCode as LicenseCode;
      }
    }
    if (parent.sharedWith.length > 0) {
      desiredFolderShares = parent.sharedWith.map((cs) => cs.userId);
      if (parent.licenseCode) {
        desiredFolderLicenseCode = parent.licenseCode as LicenseCode;
      }
    }
  }

  const sortIndex = await getNextSortIndexForFolder(userId, desiredParentId);

  const newActivity = await prisma.content.create({
    data: {
      name: (prependCopy ? "Copy of " : "") + origActivity.name,
      isFolder: false,
      imagePath: origActivity.imagePath,
      ownerId: userId,
      parentId: desiredParentId,
      sortIndex,
      classifications: {
        create: origActivity.classifications.map((c) => ({
          classificationId: c.classificationId,
        })),
      },
      contentFeatures: {
        connect: origActivity.contentFeatures.map((cf) => ({ id: cf.id })),
      },
      isPublic: desiredFolderIsPublic,
      licenseCode: origActivity.licenseCode ?? desiredFolderLicenseCode,
      sharedWith: { create: desiredFolderShares.map((u) => ({ userId: u })) },
    },
  });

  const documentsToAdd = await Promise.all(
    origActivity.documents.map(async (doc) => {
      // For each of the original documents, create a document version (i.e., a frozen snapshot)
      // that we will link to when creating contributor history, below.
      const originalDocVersion = await createDocumentVersion(doc.id);

      // document to create with new activityId (to associate it with newly created activity)
      // ignoring the docId, lastEdited, createdAt fields
      const {
        id: _ignoreId,
        lastEdited: _ignoreLastEdited,
        createdAt: _ignoreCreatedAt,
        assignedVersionNum: _ignoreAssignedVersionNum,
        ...docInfo
      } = doc;
      docInfo.activityId = newActivity.id;

      return { docInfo, originalDocVersion };
    }),
  );

  // TODO: When createManyAndReturn is rolled out,
  // (see: https://github.com/prisma/prisma/pull/24064#issuecomment-2093331715)
  // use that to give a list of the newly created docIds.
  await prisma.documents.createMany({
    data: documentsToAdd.map((x) => x.docInfo),
  });

  // In lieu of createManyAndReturn, get a list of the docIds of the newly created documents.
  const newDocIds = (
    await prisma.content.findUniqueOrThrow({
      where: { id: newActivity.id, isFolder: false },
      select: {
        documents: { select: { id: true }, orderBy: { id: "asc" } },
      },
    })
  ).documents.map((docIdObj) => docIdObj.id);

  // Create contributor history linking each newly created document
  // to the corresponding versioned document from origActivity.
  const contribHistoryInfo = newDocIds.map((docId, i) => ({
    docId,
    prevDocId: origActivity.documents[i].id,
    prevDocVersionNum: documentsToAdd[i].originalDocVersion.versionNum,
    withLicenseCode: origActivity.licenseCode,
  }));
  await prisma.contributorHistory.createMany({
    data: contribHistoryInfo,
  });

  // Get the time stamp created in the previous query
  const timestampDoc = (
    await prisma.contributorHistory.findFirst({
      where: { docId: newDocIds[0] },
    })
  )?.timestampDoc;

  // Create contributor history linking each newly created document
  // to the contributor history of the corresponding document from origActivity.
  // Note: we copy all history rather than using a linked list
  // so that this history is fixed even if the original documents
  // are modified to change their history.
  for (const [i, origDoc] of origActivity.documents.entries()) {
    const previousHistory = await prisma.contributorHistory.findMany({
      where: {
        docId: origDoc.id,
      },
    });

    // Note: contributorHistory has two timestamps:
    // - timestampPrevDoc: the time when prevDocId was remixed into a new activity
    // - timestampDoc: this time when docId was created by remixing
    // Each record we create below corresponds to an indirect path from prevDocId to docId
    // so the two timestamps will be different:
    // - timestampPrevDoc is copied from the original source to get the original remix time from prevDocId
    // - timestampDoc is copied from the create query just run (so is essentially now)
    await prisma.contributorHistory.createMany({
      data: previousHistory.map((hist) => ({
        docId: newDocIds[i],
        prevDocId: hist.prevDocId,
        prevDocVersionNum: hist.prevDocVersionNum,
        withLicenseCode: hist.withLicenseCode,
        timestampPrevDoc: hist.timestampPrevDoc,
        timestampDoc: timestampDoc,
      })),
    });
  }

  return newActivity.id;
}

/**
 * Copy the folder `origId` to `desiredParentId` (or to the base folder of `ownerId` if `null`).
 * If `prependCopy` is `true`, prepend the phrase "Copy of" to the name
 * of `origId` when copying (though do not prepend "Copy of" to its descendants).
 *
 * If any folder (either `origId` or a descendant folder) is shared, then all of its descendants
 * will be shared with the same users. The descendants will use the license of their corresponding
 * original content (falling back to the license of the folder only if they don't have a license specified).
 */
export async function copyFolderToFolder(
  origId: Uint8Array,
  ownerId: Uint8Array,
  desiredParentId: Uint8Array | null,
  prependCopy = false,
) {
  // make sure content exists and is viewable by `ownerId`
  const originalContent = await prisma.content.findUniqueOrThrow({
    where: {
      id: origId,
      OR: [
        { ownerId },
        { isPublic: true },
        { sharedWith: { some: { userId: ownerId } } },
      ],
      isDeleted: false,
    },
    select: {
      id: true,
      isFolder: true,
      type: true,
      name: true,
      licenseCode: true,
      numToSelect: true,
      selectByVariant: true,
      shuffle: true,
      paginate: true,
      activityLevelAttempts: true,
      itemLevelAttempts: true,
      children: {
        where: { isDeleted: false },
        select: { id: true, type: true },
      },
    },
  });

  if (originalContent.type === "singleDoc") {
    throw Error("copyFolderToFolder cannot copy a document");
  }

  let desiredFolderIsPublic = false;
  let desiredFolderLicenseCode: LicenseCode = "CCDUAL";
  let desiredFolderShares: Uint8Array[] = [];
  let desiredFolderType: ContentType = "folder";

  if (desiredParentId !== null) {
    // if desired parent is specified, make sure it exists and is owned by `ownerId`
    const parent = await prisma.content.findUniqueOrThrow({
      where: {
        id: desiredParentId,
        ownerId,
        isDeleted: false,
        isFolder: true,
      },
      select: {
        isPublic: true,
        type: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
      },
    });

    desiredFolderType = parent.type;

    // If the parent folder is shared, then we'll need to share the resulting content, as well,
    // with the same license.
    if (parent.isPublic) {
      desiredFolderIsPublic = true;
      if (parent.licenseCode) {
        desiredFolderLicenseCode = parent.licenseCode as LicenseCode;
      }
    }
    if (parent.sharedWith.length > 0) {
      desiredFolderShares = parent.sharedWith.map((cs) => cs.userId);
      if (parent.licenseCode) {
        desiredFolderLicenseCode = parent.licenseCode as LicenseCode;
      }
    }

    // if content is a folder and moving it to another folder,
    // make sure that folder is not itself or a subfolder of itself

    if (isEqualUUID(desiredParentId, originalContent.id)) {
      throw Error("Cannot move content into itself");
    }

    const subfolders = await prisma.$queryRaw<
      {
        id: Uint8Array;
      }[]
    >(Prisma.sql`
        WITH RECURSIVE folder_tree(id) AS (
          SELECT id FROM content
          WHERE parentId = ${originalContent.id} AND isFolder = TRUE 
          UNION ALL
          SELECT c.id FROM content AS c
          INNER JOIN folder_tree AS ft
          ON c.parentId = ft.id
          WHERE c.isFolder = TRUE 
        )

        SELECT * FROM folder_tree
        `);

    if (
      subfolders.findIndex((sf) => isEqualUUID(sf.id, desiredParentId)) !== -1
    ) {
      throw Error("Cannot move content into a subfolder of itself");
    }
  }

  const sortIndex = await getNextSortIndexForFolder(ownerId, desiredParentId);

  // if `originalContent` is not allowed to be a child of `desiredParentId`,
  // then copy the children of `originalContent` rather than the content itself

  const copyJustChildren =
    (desiredFolderType === "sequence" &&
      (originalContent.type === "sequence" ||
        originalContent.type === "folder")) ||
    desiredFolderType === "select";

  if (copyJustChildren) {
    const newIds: Uint8Array[] = [];

    // copy just the children of originalContent into `desireParentId`
    for (const child of originalContent.children) {
      if (child.type === "singleDoc") {
        const contentId = await copyActivityToFolder(
          child.id,
          ownerId,
          desiredParentId,
          false,
        );
        newIds.push(contentId);
      } else {
        const contentIds = await copyFolderToFolder(
          child.id,
          ownerId,
          desiredParentId,
          false,
        );
        newIds.push(...contentIds);
      }
    }
    return newIds;
  } else {
    // Duplicate the folder itself and make it a child of `desiredParentId`.

    const newFolder = await prisma.content.create({
      data: {
        name: (prependCopy ? "Copy of " : "") + originalContent.name,
        isFolder: originalContent.isFolder,
        type: originalContent.type,
        ownerId,
        parentId: desiredParentId,
        sortIndex,
        licenseCode: originalContent.licenseCode ?? desiredFolderLicenseCode,
        isPublic: desiredFolderIsPublic,
        sharedWith: {
          create: desiredFolderShares.map((u) => ({ userId: u })),
        },
        numToSelect: originalContent.numToSelect,
        selectByVariant: originalContent.selectByVariant,
        shuffle: originalContent.shuffle,
        paginate: originalContent.paginate,
        activityLevelAttempts: originalContent.activityLevelAttempts,
        itemLevelAttempts: originalContent.itemLevelAttempts,
      },
    });

    for (const child of originalContent.children) {
      if (child.type === "singleDoc") {
        await copyActivityToFolder(child.id, ownerId, newFolder.id, false);
      } else {
        await copyFolderToFolder(child.id, ownerId, newFolder.id, false);
      }
    }

    return [newFolder.id];
  }
}

/**
 * Copy all `origContent` to `parentId` (or the base folder of `userId` if `null).
 * If `prependCopy` is `true`, prepend the phrase "Copy of" to the names
 * of all `origContent` when copying (though do not prepend "Copy of" to their descendants).
 */
export async function copyContent(
  origContent: { contentId: Uint8Array; type: ContentType }[],
  userId: Uint8Array,
  parentId: Uint8Array | null,
  prependCopy = false,
) {
  const newContentIds: Uint8Array[] = [];

  for (const { contentId, type } of origContent) {
    if (type === "singleDoc") {
      newContentIds.push(
        await copyActivityToFolder(contentId, userId, parentId, prependCopy),
      );
    } else {
      newContentIds.push(
        ...(await copyFolderToFolder(contentId, userId, parentId, prependCopy)),
      );
    }
  }

  return newContentIds;
}

/**
 * Check if `folderId` has any descendants of type `contentId`.
 */
export async function checkIfFolderContains(
  folderId: Uint8Array | null,
  contentType: ContentType,
  loggedInUserId: Uint8Array,
) {
  // Note: not sure how to perform this calculation efficiently. Do we need to cache these values instead?
  // Would it be better to do a single recursive query rather than recurse will individual queries
  // even though we may be able to short circuit with an early return?

  const children = await prisma.content.findMany({
    where: {
      parentId: folderId,
      ownerId: loggedInUserId,
      isDeleted: false,
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (children.map((c) => c.type).includes(contentType)) {
    return true;
  }

  for (const child of children) {
    if (child.type !== "singleDoc") {
      if (await checkIfFolderContains(child.id, contentType, loggedInUserId)) {
        return true;
      }
    }
  }

  return false;
}
