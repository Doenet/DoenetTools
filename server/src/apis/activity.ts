/**
 * Creates a new activity in folderId of ownerId.
 *
 * Places the activity at the end of the folder.
 *
 * @param ownerId
 * @param folderId
 */
export async function createActivity(
  ownerId: Uint8Array,
  parentId: Uint8Array | null,
) {
  const sortIndex = await getNextSortIndexForFolder(ownerId, parentId);

  const defaultDoenetmlVersion = await prisma.doenetmlVersions.findFirstOrThrow(
    {
      where: { default: true },
    },
  );

  let isPublic = false;
  let licenseCode = undefined;
  let sharedWith: Uint8Array[] = [];

  // If parent folder isn't null, check if it is shared and get its license
  if (parentId !== null) {
    const parent = await prisma.content.findUniqueOrThrow({
      where: { id: parentId, isFolder: true, isDeleted: false, ownerId },
      select: {
        isPublic: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
      },
    });
    if (parent.isPublic) {
      isPublic = true;
      if (parent.licenseCode) {
        licenseCode = parent.licenseCode;
      }
    }

    if (parent.sharedWith.length > 0) {
      sharedWith = parent.sharedWith.map((cs) => cs.userId);
      if (parent.licenseCode) {
        licenseCode = parent.licenseCode;
      }
    }
  }

  const activity = await prisma.content.create({
    data: {
      ownerId,
      isFolder: false,
      parentId,
      name: "Untitled Document",
      imagePath: "/activity_default.jpg",
      isPublic,
      licenseCode,
      sortIndex,
      documents: {
        create: [
          {
            source: "",
            doenetmlVersionId: defaultDoenetmlVersion.id,
            name: "Untitled sub-document",
            baseComponentCounts: "{}",
          },
        ],
      },
      sharedWith: {
        createMany: { data: sharedWith.map((userId) => ({ userId })) },
      },
    },
  });

  const activityId = activity.id;

  const activityWithDoc = await prisma.content.findUniqueOrThrow({
    where: { id: activityId },
    select: { documents: { select: { id: true } } },
  });

  const docId = activityWithDoc.documents[0].id;

  return { activityId, docId };
}

export async function createFolder(
  loggedInUserId: Uint8Array,
  parentId: Uint8Array | null,
  contentType: ContentType = "folder",
  inLibrary: boolean = false,
) {
  let ownerId = loggedInUserId;
  if (inLibrary) {
    await mustBeAdmin(loggedInUserId);
    ownerId = await getLibraryAccountId();
  }

  const sortIndex = await getNextSortIndexForFolder(ownerId, parentId);

  let isPublic = false;
  let licenseCode = undefined;
  let sharedWith: Uint8Array[] = [];

  // If parent folder isn't null, check if it is shared and get its license
  if (parentId !== null) {
    const parent = await prisma.content.findUniqueOrThrow({
      where: { id: parentId, isFolder: true, isDeleted: false, ownerId },
      select: {
        isPublic: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
      },
    });
    if (parent.isPublic) {
      isPublic = true;
      if (parent.licenseCode) {
        licenseCode = parent.licenseCode;
      }
    }
    if (parent.sharedWith.length > 0) {
      sharedWith = parent.sharedWith.map((cs) => cs.userId);
      if (parent.licenseCode) {
        licenseCode = parent.licenseCode;
      }
    }
  }

  let name;

  switch (contentType) {
    case "singleDoc": {
      name = "Untitled Document";
      break;
    }
    case "select": {
      name = "Untitled Question Bank";
      break;
    }
    case "sequence": {
      name = "Untitled Problem Set";
      break;
    }
    case "folder": {
      name = "Untitled Folder";
      break;
    }
  }

  const folder = await prisma.content.create({
    data: {
      ownerId,
      type: contentType,
      isFolder: true,
      parentId,
      name,
      imagePath: "/folder_default.jpg",
      isPublic,
      licenseCode,
      sortIndex,
      sharedWith: {
        createMany: { data: sharedWith.map((userId) => ({ userId })) },
      },
    },
  });

  return { folderId: folder.id, folderName: folder.name };
}

/**
 * For folder given by `folderId` and `ownerId`,
 * find the `sortIndex` that will place a new item as the last entry in the folder.
 * If `folderId` is undefined, then the root folder of `ownerID` is used.
 *
 * Throws an error if `folderId` is supplied but isn't a folder owned by `ownerId`.
 *
 * @param ownerId
 * @param folderId
 */
async function getNextSortIndexForFolder(
  ownerId: Uint8Array,
  folderId: Uint8Array | null,
) {
  if (folderId !== null) {
    // if a folderId is present, verify that it is a folder is owned by ownerId
    await prisma.content.findUniqueOrThrow({
      where: { id: folderId, ownerId, isFolder: true },
    });
  }

  const lastIndex = (
    await prisma.content.aggregate({
      where: { ownerId, parentId: folderId },
      _max: { sortIndex: true },
    })
  )._max.sortIndex;

  return getNextSortIndex(lastIndex);
}

function getNextSortIndex(lastIndex: bigint | null) {
  // The new index is a multiple of SORT_INCREMENT and is at least SORT_INCREMENT after lastIndex.
  // It is set to zero if it is the first item in the folder.
  return lastIndex === null
    ? 0
    : Math.ceil(Number(lastIndex) / SORT_INCREMENT + 1) * SORT_INCREMENT;
}

export async function deleteActivity(id: Uint8Array, ownerId: Uint8Array) {
  const deleted = await prisma.content.update({
    where: { id, ownerId, type: { not: "folder" } },
    data: {
      isDeleted: true,
      documents: {
        updateMany: {
          where: {},
          data: {
            isDeleted: true,
          },
        },
      },
    },
  });

  return { id: deleted.id, isDeleted: deleted.isDeleted };
}

// TODO: Figure out how to delete folder in library (some contents may be published)
export async function deleteFolder(id: Uint8Array, ownerId: Uint8Array) {
  // Delete the folder `id` along with all the content inside it,
  // recursing to subfolders, and including the documents of activities.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

  await prisma.$queryRaw(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${id} AND ownerId = ${ownerId}
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

// Note: currently (June 4, 2024) unused and untested
export async function deleteDocument(id: Uint8Array, ownerId: Uint8Array) {
  await prisma.documents.update({
    where: { id, activity: { ownerId } },
    data: { isDeleted: true },
  });
}

export async function updateContent({
  id,
  name,
  imagePath,
  shuffle,
  numToSelect,
  selectByVariant,
  paginate,
  activityLevelAttempts,
  itemLevelAttempts,
  ownerId: loggedInUserId,
}: {
  id: Uint8Array;
  name?: string;
  imagePath?: string;
  shuffle?: boolean;
  numToSelect?: number;
  selectByVariant?: boolean;
  paginate?: boolean;
  activityLevelAttempts?: boolean;
  itemLevelAttempts?: boolean;
  ownerId: Uint8Array;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);

  const updated = await prisma.content.update({
    where: { id, ...filterEditableContent(loggedInUserId, isAdmin) },
    data: {
      name,
      imagePath,
      shuffle,
      numToSelect,
      selectByVariant,
      paginate,
      activityLevelAttempts,
      itemLevelAttempts,
    },
  });

  return {
    id: updated.id,
    name: updated.name,
    imagePath: updated.imagePath,
    shuffle: updated.shuffle,
    numToSelect: updated.numToSelect,
    selectByVariant: updated.selectByVariant,
    paginate: updated.paginate,
    activityLevelAttempts: updated.activityLevelAttempts,
    itemLevelAttempts: updated.itemLevelAttempts,
  };
}

export async function updateContentFeatures({
  id,
  ownerId: loggedInUserId,
  features,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  features: Record<string, boolean>;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  const updated = await prisma.content.update({
    where: { id, ...filterEditableActivity(loggedInUserId, isAdmin) },
    data: {
      contentFeatures: {
        connect: Object.entries(features)
          .filter(([_, val]) => val)
          .map(([code, _]) => ({ code })),
        disconnect: Object.entries(features)
          .filter(([_, val]) => !val)
          .map(([code, _]) => ({ code })),
      },
    },
    select: { id: true },
  });

  return {
    id: updated.id,
  };
}

export async function updateDoc({
  id,
  source,
  name,
  doenetmlVersionId,
  numVariants,
  baseComponentCounts,
  ownerId: loggedInUserId,
}: {
  id: Uint8Array;
  source?: string;
  name?: string;
  doenetmlVersionId?: number;
  numVariants?: number;
  baseComponentCounts?: string;
  ownerId: Uint8Array;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  // check if activity is assigned
  const isAssigned = (
    await prisma.content.findFirstOrThrow({
      where: {
        documents: { some: { id, isDeleted: false } },
        ...filterEditableActivity(loggedInUserId, isAdmin),
      },
    })
  ).isAssigned;

  if (isAssigned && (source !== undefined || doenetmlVersionId !== undefined)) {
    throw Error("Cannot change source of assigned document");
  }

  const updated = await prisma.documents.update({
    where: {
      id,
      activity: { ...filterEditableActivity(loggedInUserId, isAdmin) },
    },
    data: {
      source,
      name,
      doenetmlVersionId,
      numVariants,
      baseComponentCounts: baseComponentCounts,
      lastEdited: DateTime.now().toJSDate(),
    },
  });

  return {
    id: updated.id,
    name: updated.name,
    source: updated.source,
    doenetmlVersionId: updated.doenetmlVersionId,
  };
}

// Note: getActivity does not currently incorporate access control,
// by relies on calling functions to determine access.
// Also, the results of getActivity shouldn't be sent unchanged to the response,
// as the sortIndex (bigint) cannot be serialized
export async function getActivity(id: Uint8Array) {
  return await prisma.content.findUniqueOrThrow({
    where: { id, isDeleted: false, isFolder: false },
    include: {
      documents: {
        where: { isDeleted: false },
      },
    },
  });
}

/**
 * Return the id, name, and content type of the content with `id`,
 * assuming it is viewable by `loggedInUserId`.
 *
 * Throws an error if not viewable by `loggedInUserId`.
 */
export async function getContentDescription(
  id: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  const isAdmin = await getIsAdmin(loggedInUserId);

  return await prisma.content.findUniqueOrThrow({
    where: {
      id,
      ...filterViewableContent(loggedInUserId, isAdmin),
    },
    select: { id: true, name: true, type: true },
  });
}

// Note: getDoc does not currently incorporate access control,
// by relies on calling functions to determine access
export async function getDoc(id: Uint8Array) {
  return await prisma.documents.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });
}

export async function getDocumentSource(
  docId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  const document = await prisma.documents.findUniqueOrThrow({
    where: {
      id: docId,
      isDeleted: false,
      activity: {
        ...filterViewableActivity(loggedInUserId, isAdmin),
      },
    },
    select: { source: true },
  });

  return { source: document.source };
}

export async function getAllDoenetmlVersions() {
  const allDoenetmlVersions = await prisma.doenetmlVersions.findMany({
    where: {
      removed: false,
    },
    orderBy: {
      displayedVersion: "asc",
    },
  });
  return allDoenetmlVersions;
}

// Note: createDocumentVersion does not currently incorporate access control,
// by relies on calling functions to determine access
async function createDocumentVersion(docId: Uint8Array): Promise<{
  versionNum: number;
  docId: Uint8Array;
  cid: string | null;
  source: string | null;
  createdAt: Date | null;
  doenetmlVersionId: number;
}> {
  const doc = await prisma.documents.findUniqueOrThrow({
    where: { id: docId, isDeleted: false },
    include: {
      activity: { select: { name: true } },
    },
  });

  // TODO: cid should really include the doenetmlVersion
  const cid = await cidFromText(doc.source || "");

  let docVersion = await prisma.documentVersions.findUnique({
    where: { docId_cid: { docId, cid } },
  });

  if (!docVersion) {
    // TODO: not sure how to make an atomic operation of this with the ORM.
    // Should we write a raw SQL query to accomplish this in one query?

    const aggregations = await prisma.documentVersions.aggregate({
      _max: { versionNum: true },
      where: { docId },
    });
    const lastVersionNum = aggregations._max.versionNum;
    const newVersionNum = lastVersionNum ? lastVersionNum + 1 : 1;

    docVersion = await prisma.documentVersions.create({
      data: {
        versionNum: newVersionNum,
        docId,
        cid,
        doenetmlVersionId: doc.doenetmlVersionId,
        source: doc.source,
        numVariants: doc.numVariants,
        baseComponentCounts: doc.baseComponentCounts,
      },
    });
  }

  return docVersion;
}
