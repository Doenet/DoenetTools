import { PrismaClient, Prisma } from "@prisma/client";
import { cidFromText } from "./utils/cid";
import { DateTime } from "luxon";

export type DoenetmlVersion = {
  id: number;
  displayedVersion: string;
  fullVersion: string;
  default: boolean;
  deprecated: boolean;
  removed: boolean;
  deprecationMessage: string;
};

export type AssignmentStatus = "Unassigned" | "Closed" | "Open";

export type UserInfo = {
  userId: number;
  firstNames: string | null;
  lastNames: string;
  email: string;
};

export type ContentClassification = {
  id: number;
  code: string;
  grade: string | null;
  category: string;
  description: string;
  system: {
    id: number;
    name: string;
  };
};

export type ContentStructure = {
  id: number;
  ownerId: number;
  owner?: UserInfo;
  name: string;
  imagePath: string | null;
  assignmentStatus: AssignmentStatus;
  isFolder?: boolean;
  classCode: string | null;
  codeValidUntil: Date | null;
  isPublic: boolean;
  isShared: boolean;
  sharedWith: UserInfo[];
  license: License | null;
  classifications: ContentClassification[];
  documents: {
    id: number;
    versionNum?: number;
    name?: string;
    source?: string;
    doenetmlVersion: DoenetmlVersion;
  }[];
  hasScoreData: boolean;
  parentFolder: {
    id: number;
    name: string;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
  } | null;
};

export type LicenseCode = "CCDUAL" | "CCBYSA" | "CCBYNCSA";

export type License = {
  code: LicenseCode;
  name: string;
  description: string;
  imageURL: string | null;
  smallImageURL: string | null;
  licenseURL: string | null;
  isComposition: boolean;
  composedOf: {
    code: LicenseCode;
    name: string;
    description: string;
    imageURL: string | null;
    smallImageURL: string | null;
    licenseURL: string | null;
  }[];
};

export class InvalidRequestError extends Error {
  errorCode = 400;
  constructor(message: string) {
    super(message);
    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, InvalidRequestError.prototype);
  }
}

export const prisma = new PrismaClient();

async function mustBeAdmin(
  userId: number,
  message = "You must be an community admin to take this action",
) {
  const isAdmin = await getIsAdmin(userId);
  if (!isAdmin) {
    throw new InvalidRequestError(message);
  }
}

const SORT_INCREMENT = 2 ** 32;

type ShiftIndicesCallbackFunction = ({
  shift,
  sortIndices,
}: {
  shift: { increment: number } | { decrement: number };
  sortIndices: { gte: number } | { lte: number };
}) => Promise<void>;

/**
 * Creates a new activity in folderId of ownerId.
 *
 * Places the activity at the end of the folder.
 *
 * @param ownerId
 * @param folderId
 */
export async function createActivity(
  ownerId: number,
  parentFolderId: number | null,
) {
  const sortIndex = await getNextSortIndexForFolder(ownerId, parentFolderId);

  const defaultDoenetmlVersion = await prisma.doenetmlVersions.findFirstOrThrow(
    {
      where: { default: true },
    },
  );

  let isPublic = false;
  let licenseCode = undefined;
  let sharedWith: number[] = [];

  // If parent folder isn't null, check if it is shared and get its license
  if (parentFolderId !== null) {
    const parentFolder = await prisma.content.findUniqueOrThrow({
      where: { id: parentFolderId, isFolder: true, isDeleted: false, ownerId },
      select: {
        isPublic: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
      },
    });
    if (parentFolder.isPublic) {
      isPublic = true;
      if (parentFolder.licenseCode) {
        licenseCode = parentFolder.licenseCode;
      }
    }

    if (parentFolder.sharedWith.length > 0) {
      sharedWith = parentFolder.sharedWith.map((cs) => cs.userId);
      if (parentFolder.licenseCode) {
        licenseCode = parentFolder.licenseCode;
      }
    }
  }

  const activity = await prisma.content.create({
    data: {
      ownerId,
      isFolder: false,
      parentFolderId,
      name: "Untitled Activity",
      imagePath: "/activity_default.jpg",
      isPublic,
      licenseCode,
      sortIndex,
      documents: {
        create: [
          {
            source: "",
            doenetmlVersionId: defaultDoenetmlVersion.id,
            name: "Untitled Document",
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
  ownerId: number,
  parentFolderId: number | null,
) {
  const sortIndex = await getNextSortIndexForFolder(ownerId, parentFolderId);

  let isPublic = false;
  let licenseCode = undefined;
  let sharedWith: number[] = [];

  // If parent folder isn't null, check if it is shared and get its license
  if (parentFolderId !== null) {
    const parentFolder = await prisma.content.findUniqueOrThrow({
      where: { id: parentFolderId, isFolder: true, isDeleted: false, ownerId },
      select: {
        isPublic: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
      },
    });
    if (parentFolder.isPublic) {
      isPublic = true;
      if (parentFolder.licenseCode) {
        licenseCode = parentFolder.licenseCode;
      }
    }
    if (parentFolder.sharedWith.length > 0) {
      sharedWith = parentFolder.sharedWith.map((cs) => cs.userId);
      if (parentFolder.licenseCode) {
        licenseCode = parentFolder.licenseCode;
      }
    }
  }

  const folder = await prisma.content.create({
    data: {
      ownerId,
      isFolder: true,
      parentFolderId,
      name: "Untitled Folder",
      imagePath: "/folder_default.jpg",
      isPublic,
      licenseCode,
      sortIndex,
      sharedWith: {
        createMany: { data: sharedWith.map((userId) => ({ userId })) },
      },
    },
  });

  return { folderId: folder.id };
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
  ownerId: number,
  folderId: number | null,
) {
  if (folderId !== null) {
    // if a folderId is present, verify that it is a folder is owned by ownerId
    await prisma.content.findUniqueOrThrow({
      where: { id: folderId, ownerId, isFolder: true },
    });
  }

  const lastIndex = (
    await prisma.content.aggregate({
      where: { ownerId, parentFolderId: folderId },
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

export async function deleteActivity(id: number, ownerId: number) {
  const deleted = await prisma.content.update({
    where: { id, ownerId, isFolder: false },
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

export async function deleteFolder(id: number, ownerId: number) {
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
      ON content.parentFolderId = ft.id
    )

    UPDATE content LEFT JOIN documents ON documents.activityId  = content.id
      SET content.isDeleted = TRUE, documents.isDeleted = TRUE
      WHERE content.id IN (SELECT id from content_tree);
    `);
}

// Note: currently (June 4, 2024) unused and untested
export async function deleteDocument(id: number, ownerId: number) {
  await prisma.documents.update({
    where: { id, activity: { ownerId } },
    data: { isDeleted: true },
  });
}

export async function updateContent({
  id,
  name,
  imagePath,
  ownerId,
}: {
  id: number;
  name?: string;
  imagePath?: string;
  ownerId: number;
}) {
  const updated = await prisma.content.update({
    where: { id, ownerId, isDeleted: false },
    data: {
      name,
      imagePath,
    },
  });

  return {
    id: updated.id,
    name: updated.name,
    imagePath: updated.imagePath,
  };
}

export async function updateDoc({
  id,
  source,
  name,
  doenetmlVersionId,
  ownerId,
}: {
  id: number;
  source?: string;
  name?: string;
  doenetmlVersionId?: number;
  ownerId: number;
}) {
  // check if activity is assigned
  const isAssigned = (
    await prisma.content.findFirstOrThrow({
      where: {
        ownerId,
        isDeleted: false,
        documents: { some: { id, isDeleted: false } },
      },
    })
  ).isAssigned;

  if (isAssigned && (source !== undefined || doenetmlVersionId !== undefined)) {
    throw Error("Cannot change source of assigned document");
  }

  const updated = await prisma.documents.update({
    where: { id, activity: { ownerId } },
    data: {
      source,
      name,
      doenetmlVersionId,
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
export async function getActivity(id: number) {
  return await prisma.content.findUniqueOrThrow({
    where: { id, isDeleted: false, isFolder: false },
    include: {
      documents: {
        where: { isDeleted: false },
      },
    },
  });
}

export async function getActivityName(id: number) {
  return await prisma.content.findUniqueOrThrow({
    where: { id, isDeleted: false, isFolder: false },
    select: {
      id: true,
      name: true,
    },
  });
}

// Note: getDoc does not currently incorporate access control,
// by relies on calling functions to determine access
export async function getDoc(id: number) {
  return await prisma.documents.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });
}

/**
 * Move the content with `id` to position `desiredPosition` in the folder `desiredParentFolderId`
 * (where an undefined `desiredParentFolderId` indicates the root folder of `ownerId`).
 *
 * `desiredPosition` is the 0-based index in the array of content with parent folder `desiredParentFolderId`
 * and owner `ownerId` sorted by `sortIndex`.
 */
export async function moveContent({
  id,
  desiredParentFolderId,
  desiredPosition,
  ownerId,
}: {
  id: number;
  desiredParentFolderId: number | null;
  desiredPosition: number;
  ownerId: number;
}) {
  if (!Number.isInteger(desiredPosition)) {
    throw Error("desiredPosition must be an integer");
  }

  // make sure content exists and is owned by `ownerId`
  const content = await prisma.content.findUniqueOrThrow({
    where: {
      id,
      ownerId,
      isDeleted: false,
    },
    select: { id: true, isFolder: true },
  });

  let desiredFolderIsPublic = false;
  let desiredFolderLicenseCode: LicenseCode = "CCDUAL";
  let desiredFolderShares: number[] = [];

  if (desiredParentFolderId !== null) {
    // if desired parent folder is specified, make sure it exists and is owned by `ownerId`
    const parentFolder = await prisma.content.findUniqueOrThrow({
      where: {
        id: desiredParentFolderId,
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

    // If the parent folder is shared, then we'll need to share the resulting content, as well,
    // with the same license.
    if (parentFolder.isPublic) {
      desiredFolderIsPublic = true;
      if (parentFolder.licenseCode) {
        desiredFolderLicenseCode = parentFolder.licenseCode as LicenseCode;
      }
    }
    if (parentFolder.sharedWith.length > 0) {
      desiredFolderShares = parentFolder.sharedWith.map((cs) => cs.userId);
      if (parentFolder.licenseCode) {
        desiredFolderLicenseCode = parentFolder.licenseCode as LicenseCode;
      }
    }

    if (content.isFolder) {
      // if content is a folder and moving it to another folder,
      // make sure that folder is not itself or a subfolder of itself

      if (desiredParentFolderId === content.id) {
        throw Error("Cannot move folder into itself");
      }

      const subfolders = await prisma.$queryRaw<
        {
          id: number;
        }[]
      >(Prisma.sql`
        WITH RECURSIVE folder_tree(id) AS (
          SELECT id FROM content
          WHERE parentFolderId = ${content.id} AND isFolder = TRUE 
          UNION ALL
          SELECT c.id FROM content AS c
          INNER JOIN folder_tree AS ft
          ON c.parentFolderId = ft.id
          WHERE c.isFolder = TRUE 
        )

        SELECT * FROM folder_tree
        `);

      if (subfolders.map((sf) => sf.id).includes(desiredParentFolderId)) {
        throw Error("Cannot move folder into a subfolder of itself");
      }
    }
  }

  // find the sort indices of all content in folder other than moved content
  const currentSortIndices = (
    await prisma.content.findMany({
      where: {
        ownerId,
        parentFolderId: desiredParentFolderId,
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
        parentFolderId: desiredParentFolderId,
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
      parentFolderId: desiredParentFolderId,
    },
  });

  if (desiredFolderIsPublic) {
    if (content.isFolder) {
      await makeFolderPublic({
        id: content.id,
        ownerId,
        licenseCode: desiredFolderLicenseCode,
      });
    } else {
      await makeActivityPublic({
        id: content.id,
        ownerId,
        licenseCode: desiredFolderLicenseCode,
      });
    }
  }

  if (desiredFolderShares.length > 0) {
    if (content.isFolder) {
      await shareFolder({
        id: content.id,
        ownerId,
        licenseCode: desiredFolderLicenseCode,
        users: desiredFolderShares,
      });
    } else {
      await shareActivity({
        id: content.id,
        ownerId,
        licenseCode: desiredFolderLicenseCode,
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
 * Copies the activity given by `origActivityId` into `folderId` of `ownerId`.
 *
 * Places the activity at the end of the folder.
 *
 * Adds `origActivityId` and its contributor history to the contributor history of the new activity.
 *
 * Throws an error if `userId` doesn't have access to `origActivityId`
 *
 * Return the id of the newly created activity
 *
 * @param origActivityId
 * @param userId
 * @param folderId
 */
export async function copyActivityToFolder(
  origActivityId: number,
  userId: number,
  folderId: number | null,
) {
  const origActivity = await prisma.content.findUniqueOrThrow({
    where: {
      id: origActivityId,
      isDeleted: false,
      isFolder: false,
      OR: [
        { ownerId: userId },
        { isPublic: true },
        { sharedWith: { some: { userId } } },
      ],
    },
    include: {
      documents: {
        where: { isDeleted: false },
      },
      classifications: true,
    },
  });

  const sortIndex = await getNextSortIndexForFolder(userId, folderId);

  const newActivity = await prisma.content.create({
    data: {
      name: `Copy of ${origActivity.name}`,
      isFolder: false,
      imagePath: origActivity.imagePath,
      ownerId: userId,
      parentFolderId: folderId,
      sortIndex,
      classifications: {
        create: origActivity.classifications.map((c) => ({
          classificationId: c.classificationId,
        })),
      },
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

// Note: createDocumentVersion does not currently incorporate access control,
// by relies on calling functions to determine access
async function createDocumentVersion(docId: number): Promise<{
  versionNum: number;
  docId: number;
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
      },
    });
  }

  return docVersion;
}

/**
 * Get the data needed to edit `activityId` of `ownerId`.
 *
 * The data returned depends on whether or not `isAssigned` is set.
 *
 * If `isAssigned` is not set, then we return current source from the documents table
 *
 * If `isAssigned` is `true`, then we return the fixed source from documentVersions table
 * the is referenced by the `assignedVersionNum` in the documents table.
 * We also return information about whether or not the assignment is open in this case.
 *
 * @param activityId
 * @param loggedInUserId
 */
export async function getActivityEditorData(
  activityId: number,
  loggedInUserId: number,
) {
  // TODO: is there a way to combine these queries and avoid any race condition?

  const contentCheck = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      OR: [
        { ownerId: loggedInUserId },
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
    },
    select: { isAssigned: true, ownerId: true },
  });

  if (contentCheck.ownerId !== loggedInUserId) {
    // activity is public or shared but not owned by the logged in user

    const activity: ContentStructure = {
      id: activityId,
      name: "",
      ownerId: contentCheck.ownerId,
      imagePath: null,
      assignmentStatus: "Unassigned",
      classCode: null,
      codeValidUntil: null,
      isPublic: false,
      isShared: false,
      sharedWith: [],
      license: null,
      classifications: [],
      documents: [],
      hasScoreData: false,
      parentFolder: null,
    };
    return { notMe: true, activity };
  }

  const isAssigned = contentCheck.isAssigned;

  let activity: ContentStructure;

  // TODO: add pagination or a hard limit in the number of documents one can add to an activity

  if (isAssigned) {
    const assignedActivity = await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        isDeleted: false,
        ownerId: loggedInUserId,
        isFolder: false,
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        imagePath: true,
        isAssigned: true,
        classCode: true,
        codeValidUntil: true,
        isPublic: true,
        sharedWith: {
          select: {
            user: {
              select: {
                userId: true,
                email: true,
                firstNames: true,
                lastNames: true,
              },
            },
          },
        },
        license: {
          include: {
            composedOf: {
              select: { composedOf: true },
              orderBy: { composedOf: { sortIndex: "asc" } },
            },
          },
        },
        classifications: {
          select: {
            classification: {
              select: {
                id: true,
                grade: true,
                code: true,
                category: true,
                description: true,
                system: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            assignedVersion: {
              select: {
                versionNum: true,
                source: true,
                doenetmlVersion: true,
              },
            },
          },
          // TODO: implement ability to allow users to order the documents within an activity
          orderBy: { id: "asc" },
        },
        parentFolder: {
          select: {
            id: true,
            name: true,
            isPublic: true,
            sharedWith: {
              select: {
                user: {
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
        _count: { select: { assignmentScores: true } },
      },
    });

    const isOpen = assignedActivity.codeValidUntil
      ? DateTime.now() <= DateTime.fromJSDate(assignedActivity.codeValidUntil)
      : false;

    const { isShared, sharedWith } = processSharedWith(
      assignedActivity.sharedWith,
    );

    activity = {
      id: assignedActivity.id,
      name: assignedActivity.name,
      ownerId: assignedActivity.ownerId,
      imagePath: assignedActivity.imagePath,
      assignmentStatus: isOpen ? "Open" : "Closed",
      classCode: assignedActivity.classCode,
      codeValidUntil: assignedActivity.codeValidUntil,
      isPublic: assignedActivity.isPublic,
      isShared,
      sharedWith,
      license: assignedActivity.license
        ? processLicense(assignedActivity.license)
        : null,
      classifications: assignedActivity.classifications.map(
        (c) => c.classification,
      ),
      documents: assignedActivity.documents.map((doc) => ({
        id: doc.id,
        versionNum: doc.assignedVersion!.versionNum,
        name: doc.name,
        source: doc.assignedVersion!.source,
        doenetmlVersion: doc.assignedVersion!.doenetmlVersion,
      })),
      hasScoreData: assignedActivity._count.assignmentScores > 0,
      parentFolder: processParentFolder(assignedActivity.parentFolder),
    };
  } else {
    const unassignedActivity = await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        isDeleted: false,
        ownerId: loggedInUserId,
        isFolder: false,
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        imagePath: true,
        classCode: true,
        codeValidUntil: true,
        isPublic: true,
        sharedWith: {
          select: {
            user: {
              select: {
                userId: true,
                email: true,
                firstNames: true,
                lastNames: true,
              },
            },
          },
        },
        license: {
          include: {
            composedOf: {
              select: { composedOf: true },
              orderBy: { composedOf: { sortIndex: "asc" } },
            },
          },
        },
        classifications: {
          select: {
            classification: {
              select: {
                id: true,
                grade: true,
                code: true,
                category: true,
                description: true,
                system: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        documents: {
          select: {
            name: true,
            id: true,
            source: true,
            doenetmlVersion: true,
          },
          // TODO: implement ability to allow users to order the documents within an activity
          orderBy: { id: "asc" },
        },
        parentFolder: {
          select: {
            id: true,
            name: true,
            isPublic: true,
            sharedWith: {
              select: {
                user: {
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
    });

    const {
      sharedWith: sharedWithOrig,
      license,
      classifications,
      parentFolder,
      ...unassignedActivity2
    } = unassignedActivity;

    const { isShared, sharedWith } = processSharedWith(sharedWithOrig);

    activity = {
      ...unassignedActivity2,
      isShared,
      sharedWith,
      license: license ? processLicense(license) : null,
      classifications: classifications.map((c) => c.classification),
      assignmentStatus: "Unassigned",
      hasScoreData: false,
      parentFolder: processParentFolder(parentFolder),
    };
  }

  return { notMe: false, activity };
}

/**
 * Get the data needed to view the source of public activity `activityId`
 *
 * We return current source from the documents table
 *
 * @param activityId
 */
export async function getSharedEditorData(
  activityId: number,
  loggedInUserId: number,
) {
  // TODO: add pagination or a hard limit in the number of documents one can add to an activity

  const preliminaryActivity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      OR: [
        { ownerId: loggedInUserId },
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
    },
    select: {
      id: true,
      isFolder: true,
      ownerId: true,
      name: true,
      imagePath: true,
      isPublic: true,
      sharedWith: {
        select: {
          userId: true,
        },
      },
      documents: {
        select: {
          name: true,
          id: true,
          source: true,
          doenetmlVersion: true,
        },
        // TODO: implement ability to allow users to order the documents within an activity
        orderBy: { id: "asc" },
      },
      license: {
        include: {
          composedOf: {
            select: { composedOf: true },
            orderBy: { composedOf: { sortIndex: "asc" } },
          },
        },
      },
      classifications: {
        select: {
          classification: {
            select: {
              id: true,
              grade: true,
              code: true,
              category: true,
              description: true,
              system: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      parentFolder: {
        select: {
          id: true,
          name: true,
          isPublic: true,
          sharedWith: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  });

  const {
    license,
    classifications,
    sharedWith: sharedWithOrig,
    parentFolder,
    ...preliminaryActivity2
  } = preliminaryActivity;

  const { isShared, sharedWith } = processSharedWithForUser(
    sharedWithOrig,
    loggedInUserId,
  );

  const activity: ContentStructure = {
    ...preliminaryActivity2,
    isShared,
    sharedWith,
    license: license ? processLicense(license) : null,
    classifications: classifications.map((c) => c.classification),
    classCode: null,
    codeValidUntil: null,
    assignmentStatus: "Unassigned",
    hasScoreData: false,
    parentFolder: processParentFolderForUser(parentFolder, loggedInUserId),
  };

  return activity;
}

// TODO: generalize this to multi-document activities
export async function getActivityViewerData(
  activityId: number,
  loggedInUserId: number,
) {
  const preliminaryActivity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      OR: [
        { ownerId: loggedInUserId },
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
      imagePath: true,
      isPublic: true,
      sharedWith: {
        select: {
          userId: true,
        },
      },
      license: {
        include: {
          composedOf: {
            select: { composedOf: true },
            orderBy: { composedOf: { sortIndex: "asc" } },
          },
        },
      },
      classifications: {
        select: {
          classification: {
            select: {
              id: true,
              grade: true,
              code: true,
              category: true,
              description: true,
              system: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      documents: {
        where: { isDeleted: false },
        select: {
          name: true,
          id: true,
          source: true,
          doenetmlVersion: true,
        },
        // TODO: implement ability to allow users to order the documents within an activity
        orderBy: { id: "asc" },
      },
      parentFolder: {
        select: {
          id: true,
          name: true,
          isPublic: true,
          sharedWith: {
            select: {
              userId: true,
            },
          },
        },
      },
      owner: {
        select: {
          userId: true,
          email: true,
          firstNames: true,
          lastNames: true,
        },
      },
    },
  });

  const {
    license,
    classifications,
    sharedWith: sharedWithOrig,
    parentFolder,
    ...preliminaryActivity2
  } = preliminaryActivity;

  const { isShared, sharedWith } = processSharedWithForUser(
    sharedWithOrig,
    loggedInUserId,
  );

  const activity: ContentStructure = {
    ...preliminaryActivity2,
    isFolder: false,
    isShared,
    sharedWith,
    license: license ? processLicense(license) : null,
    classifications: classifications.map((c) => c.classification),
    classCode: null,
    codeValidUntil: null,
    assignmentStatus: "Unassigned",
    hasScoreData: false,
    parentFolder: processParentFolderForUser(parentFolder, loggedInUserId),
  };

  const docHistories = await getDocumentContributorHistories({
    docIds: activity.documents.map((doc) => doc.id),
    loggedInUserId,
  });

  return {
    activity,
    docHistories,
  };
}

export async function getDocumentSource(docId: number, loggedInUserId: number) {
  const document = await prisma.documents.findUniqueOrThrow({
    where: {
      id: docId,
      isDeleted: false,
      activity: {
        OR: [
          { ownerId: loggedInUserId },
          { isPublic: true },
          { sharedWith: { some: { userId: loggedInUserId } } },
        ],
      },
    },
    select: { source: true },
  });

  return { source: document.source };
}

export async function getActivityContributorHistory({
  activityId,
  loggedInUserId,
}: {
  activityId: number;
  loggedInUserId: number;
}) {
  const activity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      OR: [
        { ownerId: loggedInUserId },
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
    },
    select: { documents: { select: { id: true } } },
  });

  const docHistories = await getDocumentContributorHistories({
    docIds: activity.documents.map((doc) => doc.id),
    loggedInUserId,
  });

  return { docHistories };
}

export async function getDocumentContributorHistories({
  docIds,
  loggedInUserId,
}: {
  docIds: number[];
  loggedInUserId: number;
}) {
  const docHistories = await prisma.documents.findMany({
    where: {
      id: { in: docIds },
      isDeleted: false,
      activity: {
        OR: [
          { ownerId: loggedInUserId },
          { isPublic: true },
          { sharedWith: { some: { userId: loggedInUserId } } },
        ],
      },
    },
    select: {
      id: true,
      contributorHistory: {
        where: {
          prevDoc: {
            document: {
              activity: {
                OR: [
                  { ownerId: loggedInUserId },
                  { isPublic: true },
                  { sharedWith: { some: { userId: loggedInUserId } } },
                ],
              },
            },
          },
        },
        orderBy: { timestampPrevDoc: "desc" },
        include: {
          prevDoc: {
            select: {
              cid: true,
              versionNum: true,
              document: {
                select: {
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
      },
    },
  });

  return docHistories;
}

export async function getActivityRemixes({
  activityId,
  loggedInUserId,
}: {
  activityId: number;
  loggedInUserId: number;
}) {
  const activity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      OR: [
        { ownerId: loggedInUserId },
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
    },
    select: { documents: { select: { id: true } } },
  });

  const docRemixes = await getDocumentRemixes({
    docIds: activity.documents.map((doc) => doc.id),
    loggedInUserId,
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
}: {
  docIds: number[];
  loggedInUserId: number;
}) {
  const docRemixes = await prisma.documents.findMany({
    where: {
      id: { in: docIds },
      isDeleted: false,
      activity: {
        OR: [
          { ownerId: loggedInUserId },
          { isPublic: true },
          { sharedWith: { some: { userId: loggedInUserId } } },
        ],
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
                activity: {
                  OR: [
                    { ownerId: loggedInUserId },
                    { isPublic: true },
                    { sharedWith: { some: { userId: loggedInUserId } } },
                  ],
                },
              },
              timestampDoc: {
                equals: prisma.contributorHistory.fields.timestampPrevDoc,
              },
            },
            orderBy: { timestampDoc: "desc" },
            include: {
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

  return docRemixes;
}

export async function getDocumentRemixes({
  docIds,
  loggedInUserId,
}: {
  docIds: number[];
  loggedInUserId: number;
}) {
  const docRemixes = await prisma.documents.findMany({
    where: {
      id: { in: docIds },
      isDeleted: false,
      activity: {
        OR: [
          { ownerId: loggedInUserId },
          { isPublic: true },
          { sharedWith: { some: { userId: loggedInUserId } } },
        ],
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
                activity: {
                  OR: [
                    { ownerId: loggedInUserId },
                    { isPublic: true },
                    { sharedWith: { some: { userId: loggedInUserId } } },
                  ],
                },
              },
            },
            orderBy: { timestampDoc: "desc" },
            include: {
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

  return docRemixes;
}

export async function getAssignmentDataFromCode(code: string) {
  let assignment;

  try {
    assignment = await prisma.content.findFirstOrThrow({
      where: {
        classCode: code,
        codeValidUntil: {
          gte: DateTime.now().toISO(), // TODO - confirm this works with timezone stuff
        },
        isDeleted: false,
        isAssigned: true,
        isFolder: false,
      },
      select: {
        id: true,
        documents: {
          select: {
            id: true,
            assignedVersionNum: true,
            assignedVersion: {
              select: {
                source: true,
                doenetmlVersion: { select: { fullVersion: true } },
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        },
      },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return {
        assignmentFound: false,
        assignment: null,
      };
    } else {
      throw e;
    }
  }

  return { assignmentFound: true, assignment };
}

export async function searchSharedContent(
  query: string,
  loggedInUserId: number,
) {
  // remove operators that break MySQL BOOLEAN search
  // and add * at the end of every word so that match beginning of words
  const query_as_prefixes = query
    .replace(/[+\-><()~*"@]+/g, " ")
    .split(" ")
    .filter((s) => s)
    .map((s) => s + "*")
    .join(" ");

  const matches = await prisma.$queryRaw<
    {
      id: number;
      relevance: number;
    }[]
  >(Prisma.sql`
  SELECT
    content.id,
    AVG((MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) + 
    (MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) +
    MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classifications.code, classifications.category, classifications.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    ) as relevance
  FROM
    content
  LEFT JOIN
    (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
  LEFT JOIN
    users ON content.ownerId = users.userId
  LEFT JOIN
    contentClassifications ON content.id = contentClassifications.contentId
  LEFT JOIN
    classifications ON contentClassifications.classificationId = classifications.id
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND
    (MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classifications.code, classifications.category, classifications.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE))
  GROUP BY
    content.id
  ORDER BY
    relevance DESC
  LIMIT 100
  `);

  // TODO: combine queries

  const preliminaryPublicContent = await prisma.content.findMany({
    where: {
      id: { in: matches.map((m) => m.id) },
    },
    select: {
      id: true,
      isFolder: true,
      ownerId: true,
      owner: {
        select: {
          userId: true,
          firstNames: true,
          lastNames: true,
          email: true,
        },
      },
      name: true,
      imagePath: true,
      isPublic: true,
      sharedWith: {
        select: {
          userId: true,
        },
      },
      license: {
        include: {
          composedOf: {
            select: { composedOf: true },
            orderBy: { composedOf: { sortIndex: "asc" } },
          },
        },
      },
      classifications: {
        select: {
          classification: {
            select: {
              id: true,
              grade: true,
              code: true,
              category: true,
              description: true,
              system: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      parentFolder: {
        select: {
          id: true,
          name: true,
          isPublic: true,
          sharedWith: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  });

  // TODO: better way to sort! (For free if combine queries)
  const relevance = Object.fromEntries(matches.map((m) => [m.id, m.relevance]));

  const publicContent: ContentStructure[] = preliminaryPublicContent
    .sort((a, b) => relevance[b.id] - relevance[a.id])
    .map((content) => {
      const {
        license,
        classifications,
        sharedWith: sharedWithOrig,
        parentFolder,
        ...content2
      } = content;

      const { isShared, sharedWith } = processSharedWithForUser(
        sharedWithOrig,
        loggedInUserId,
      );

      return {
        ...content2,
        isShared,
        sharedWith,
        documents: [],
        license: license ? processLicense(license) : null,
        classifications: classifications.map((c) => c.classification),
        classCode: null,
        codeValidUntil: null,
        assignmentStatus: "Unassigned",
        hasScoreData: false,
        parentFolder: processParentFolderForUser(parentFolder, loggedInUserId),
      };
    });

  return publicContent;
}

export async function searchUsersWithSharedContent(
  query: string,
  loggedInUserId: number,
) {
  // remove operators that break MySQL BOOLEAN search
  // and add * at the end of every word so that match beginning of words
  const query_as_prefixes = query
    .replace(/[+\-><()~*"@]+/g, " ")
    .split(" ")
    .filter((s) => s)
    .map((s) => s + "*")
    .join(" ");

  const usersWithPublic = await prisma.$queryRaw<
    {
      userId: number;
      firstNames: string | null;
      lastNames: string;
    }[]
  >(Prisma.sql`
  SELECT
    users.userId, users.firstNames, users.lastNames,
    MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) as relevance
  FROM
    users
  WHERE
    users.isAnonymous = FALSE
    AND users.userId IN (
      SELECT ownerId FROM content WHERE isDeleted = FALSE AND (
        isPublic = TRUE
        OR id IN (
          SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId}
        )
      )
    )
    AND
    MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
  ORDER BY
    relevance DESC
  LIMIT 100
  `);

  return usersWithPublic;
}

export async function listUserAssigned(userId: number) {
  const preliminaryAssignments = await prisma.content.findMany({
    where: {
      isDeleted: false,
      isAssigned: true,
      assignmentScores: { some: { userId } },
    },
    select: {
      id: true,
      isFolder: true,
      ownerId: true,
      name: true,
      imagePath: true,
      isPublic: true,
      classCode: true,
      codeValidUntil: true,
      license: {
        include: {
          composedOf: {
            select: { composedOf: true },
            orderBy: { composedOf: { sortIndex: "asc" } },
          },
        },
      },
      parentFolder: { select: { id: true, name: true, isPublic: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const assignments: ContentStructure[] = preliminaryAssignments.map((obj) => {
    const isOpen = obj.codeValidUntil
      ? DateTime.now() <= DateTime.fromJSDate(obj.codeValidUntil)
      : false;
    const assignmentStatus: AssignmentStatus = !isOpen ? "Closed" : "Open";
    return {
      ...obj,
      isShared: false,
      sharedWith: [],
      license: obj.license ? processLicense(obj.license) : null,
      classifications: [],
      assignmentStatus,
      documents: [],
      hasScoreData: false,
      parentFolder: processParentFolder(obj.parentFolder),
    };
  });

  const user = await prisma.users.findUniqueOrThrow({
    where: { userId },
    select: { userId: true, firstNames: true, lastNames: true },
  });

  return {
    assignments,
    user,
  };
}

export async function findOrCreateUser({
  email,
  firstNames,
  lastNames,
  isAdmin = false,
  isAnonymous = false,
}: {
  email: string;
  firstNames: string | null;
  lastNames: string;
  isAdmin?: boolean;
  isAnonymous?: boolean;
}) {
  let user = await prisma.users.upsert({
    where: { email },
    update: {},
    create: { email, firstNames, lastNames, isAdmin, isAnonymous },
  });

  if (lastNames !== "" && user.lastNames == "") {
    user = await prisma.users.update({
      where: { email },
      data: { firstNames, lastNames },
    });
  }

  return user;
}

export async function getUserInfo(userId: number) {
  const user = await prisma.users.findUniqueOrThrow({
    where: { userId },
    select: {
      userId: true,
      email: true,
      firstNames: true,
      lastNames: true,
      isAnonymous: true,
      isAdmin: true,
    },
  });
  return user;
}

export async function getUserInfoFromEmail(email: string) {
  const user = await prisma.users.findUniqueOrThrow({
    where: { email },
    select: {
      userId: true,
      email: true,
      firstNames: true,
      lastNames: true,
      isAnonymous: true,
      isAdmin: true,
    },
  });
  return user;
}

export async function upgradeAnonymousUser({
  userId,
  email,
}: {
  userId: number;
  email: string;
}) {
  const user = await prisma.users.update({
    where: { userId, isAnonymous: true },
    data: { isAnonymous: false, email },
  });

  return user;
}

export async function updateUser({
  userId,
  firstNames,
  lastNames,
}: {
  userId: number;
  firstNames: string;
  lastNames: string;
}) {
  const user = await prisma.users.update({
    where: { userId },
    data: { firstNames, lastNames },
  });
  return user;
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

export async function getIsAdmin(userId: number) {
  const user = await prisma.users.findUnique({ where: { userId } });
  let isAdmin = false;
  if (user) {
    isAdmin = user.isAdmin;
  }
  return isAdmin;
}

export async function getAllRecentPublicActivities() {
  const activities = await prisma.content.findMany({
    where: { isPublic: true, isDeleted: false, isFolder: false },
    orderBy: { lastEdited: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      imagePath: true,
      owner: {
        select: {
          firstNames: true,
          lastNames: true,
        },
      },
    },
  });
  return activities;
}

export async function addPromotedContentGroup(
  groupName: string,
  userId: number,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );

  const lastIndex = (
    await prisma.promotedContentGroups.aggregate({
      _max: { sortIndex: true },
    })
  )._max.sortIndex;

  const newIndex = getNextSortIndex(lastIndex);

  const { promotedGroupId } = await prisma.promotedContentGroups.create({
    data: {
      groupName,
      sortIndex: newIndex,
    },
  });
  return promotedGroupId;
}

export async function updatePromotedContentGroup(
  groupId: number,
  newGroupName: string,
  homepage: boolean,
  currentlyFeatured: boolean,
  userId: number,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );

  await prisma.promotedContentGroups.update({
    where: {
      promotedGroupId: groupId,
    },
    data: {
      groupName: newGroupName,
      homepage,
      currentlyFeatured,
    },
  });
}

export async function deletePromotedContentGroup(
  groupId: number,
  userId: number,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );
  // Delete group and entries all in one transaction, so both succeed or fail together
  const deleteEntries = prisma.promotedContent.deleteMany({
    where: {
      promotedGroupId: groupId,
    },
  });
  const deleteGroup = prisma.promotedContentGroups.delete({
    where: {
      promotedGroupId: groupId,
    },
  });
  await prisma.$transaction([deleteEntries, deleteGroup]);
}

/**
 * Move the promoted content group with `groupId` to position `desiredPosition`
 *
 * `desiredPosition` is the 0-based index in the array of promoted content groups
 * sorted by `sortIndex`.
 */
export async function movePromotedContentGroup(
  groupId: number,
  userId: number,
  desiredPosition: number,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );

  if (!Number.isInteger(desiredPosition)) {
    throw Error("desiredPosition must be an integer");
  }

  // find the sort indices of all groups other then moved group
  const currentSortIndices = (
    await prisma.promotedContentGroups.findMany({
      where: {
        promotedGroupId: { not: groupId },
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
    await prisma.promotedContentGroups.updateMany({
      where: {
        promotedGroupId: { not: groupId },
        sortIndex: sortIndices,
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
  await prisma.promotedContentGroups.update({
    where: {
      promotedGroupId: groupId,
    },
    data: {
      sortIndex: newSortIndex,
    },
  });
}

export async function loadPromotedContent(userId: number) {
  const isAdmin = userId ? await getIsAdmin(userId) : false;
  const content = await prisma.promotedContentGroups.findMany({
    where: {
      // If admin, also include groups not featured
      currentlyFeatured: isAdmin ? undefined : true,
    },
    orderBy: {
      sortIndex: "asc",
    },
    select: {
      groupName: true,
      promotedGroupId: true,
      currentlyFeatured: true,
      homepage: true,

      promotedContent: {
        select: {
          activity: {
            select: {
              id: true,
              name: true,
              imagePath: true,

              owner: {
                select: {
                  firstNames: true,
                  lastNames: true,
                },
              },
            },
          },
        },
        orderBy: { sortIndex: "asc" },
      },
    },
  });

  const reformattedContent = content.map((groupContent) => {
    const reformattedActivities = groupContent.promotedContent.map(
      (promoted) => {
        return {
          name: promoted.activity.name,
          activityId: promoted.activity.id,
          imagePath: promoted.activity.imagePath,
          owner: promoted.activity.owner,
        };
      },
    );

    return {
      groupName: groupContent.groupName,
      promotedGroupId: groupContent.promotedGroupId,
      currentlyFeatured: groupContent.currentlyFeatured,
      homepage: groupContent.homepage,
      promotedContent: reformattedActivities,
    };
  });

  return reformattedContent;
}

export async function addPromotedContent(
  groupId: number,
  activityId: number,
  userId: number,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      isPublic: true,
      isFolder: false,
      isDeleted: false,
    },
    select: {
      // not using this, we just need to select one field
      id: true,
    },
  });
  if (!activity) {
    throw new InvalidRequestError(
      "This activity does not exist or is not public.",
    );
  }
  const lastIndex = (
    await prisma.promotedContent.aggregate({
      where: { promotedGroupId: groupId },
      _max: { sortIndex: true },
    })
  )._max.sortIndex;

  const newIndex = getNextSortIndex(lastIndex);

  await prisma.promotedContent.create({
    data: {
      activityId,
      promotedGroupId: groupId,
      sortIndex: newIndex,
    },
  });
}

export async function removePromotedContent(
  groupId: number,
  activityId: number,
  userId: number,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      isPublic: true,
      isFolder: false,
      isDeleted: false,
    },
    select: {
      // not using this, we just need to select one field
      id: true,
    },
  });
  if (!activity) {
    throw new InvalidRequestError(
      "This activity does not exist or is not public.",
    );
  }

  await prisma.promotedContent.delete({
    where: {
      activityId_promotedGroupId: {
        activityId,
        promotedGroupId: groupId,
      },
    },
  });
}

/**
 * Move the promoted content with `activityId` to position `desiredPosition` in the group `groupId`
 *
 * `desiredPosition` is the 0-based index in the array of promoted content with group `groupId`
 * sorted by `sortIndex`.
 */
export async function movePromotedContent(
  groupId: number,
  activityId: number,
  userId: number,
  desiredPosition: number,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      isPublic: true,
      isFolder: false,
      isDeleted: false,
    },
    select: {
      // not using this, we just need to select one field
      id: true,
    },
  });
  if (!activity) {
    throw new InvalidRequestError(
      "This activity does not exist or is not public.",
    );
  }

  if (!Number.isInteger(desiredPosition)) {
    throw Error("desiredPosition must be an integer");
  }

  // find the sort indices of all promoted content in group other than moved content
  const currentSortIndices = (
    await prisma.promotedContent.findMany({
      where: {
        promotedGroupId: groupId,
        activityId: { not: activityId },
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
    await prisma.promotedContent.updateMany({
      where: {
        promotedGroupId: groupId,
        activityId: { not: activityId },
        sortIndex: sortIndices,
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
  await prisma.promotedContent.update({
    where: {
      activityId_promotedGroupId: { activityId, promotedGroupId: groupId },
    },
    data: {
      sortIndex: newSortIndex,
    },
  });
}

export async function assignActivity(activityId: number, userId: number) {
  const origActivity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      ownerId: userId,
      isAssigned: false,
    },
    include: {
      documents: {
        where: { isDeleted: false },
      },
    },
  });

  await prisma.content.update({
    where: { id: activityId },
    data: {
      isAssigned: true,
    },
  });

  for (const doc of origActivity.documents) {
    const docVersion = await createDocumentVersion(doc.id);
    await prisma.documents.update({
      where: { id: doc.id },
      data: { assignedVersionNum: docVersion.versionNum },
    });
  }
}

function generateClassCode() {
  return ("00000" + Math.floor(Math.random() * 1000000)).slice(-6);
}

export async function openAssignmentWithCode(
  activityId: number,
  closeAt: DateTime,
  loggedInUserId: number,
) {
  const initialActivity = await prisma.content.findUniqueOrThrow({
    where: { id: activityId, ownerId: loggedInUserId, isFolder: false },
    select: { classCode: true, isAssigned: true },
  });

  if (!initialActivity.isAssigned) {
    await assignActivity(activityId, loggedInUserId);
  }

  let classCode = initialActivity.classCode;

  if (!classCode) {
    classCode = generateClassCode();
  }

  const codeValidUntil = closeAt.toJSDate();

  await prisma.content.update({
    where: { id: activityId },
    data: {
      classCode,
      codeValidUntil,
    },
  });
  return { classCode, codeValidUntil };
}

export async function updateAssignmentSettings(
  activityId: number,
  closeAt: DateTime,
  loggedInUserId: number,
) {
  const codeValidUntil = closeAt.toJSDate();

  await prisma.content.update({
    where: {
      id: activityId,
      ownerId: loggedInUserId,
      isFolder: false,
      isAssigned: true,
    },
    data: {
      codeValidUntil,
    },
  });

  return {};
}

export async function closeAssignmentWithCode(
  activityId: number,
  userId: number,
) {
  await prisma.content.update({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      ownerId: userId,
      isAssigned: true,
    },
    data: {
      codeValidUntil: null,
    },
  });

  // attempt to unassign activity, which will succeed
  // only if there is no student data
  try {
    await unassignActivity(activityId, userId);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      // ignore inability to unassign due to presence of student data
    } else {
      throw e;
    }
  }
}

export async function unassignActivity(activityId: number, userId: number) {
  await prisma.content.update({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      ownerId: userId,
      isAssigned: true,
      assignmentScores: { none: { activityId } },
    },
    data: {
      isAssigned: false,
    },
  });

  await prisma.documents.updateMany({
    where: { activityId },
    data: { assignedVersionNum: null },
  });
}

// Note: this function returns `sortIndex` (which is a bigint)
// so the data shouldn't be sent unchanged to the response
export async function getAssignment(activityId: number, ownerId: number) {
  const assignment = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      ownerId,
      isDeleted: false,
      isFolder: false,
      isAssigned: true,
    },
    include: {
      documents: {
        select: {
          assignedVersion: true,
        },
      },
    },
  });
  return assignment;
}

// TODO: do we still save score and state if assignment isn't open?
// If not, how do we communicate that fact
export async function saveScoreAndState({
  activityId,
  docId,
  docVersionNum,
  userId,
  score,
  onSubmission,
  state,
}: {
  activityId: number;
  docId: number;
  docVersionNum: number;
  userId: number;
  score: number;
  onSubmission: boolean;
  state: string;
}) {
  // make sure have an assignmentScores record
  // so that can satisfy foreign key constraints on documentState
  await prisma.assignmentScores.upsert({
    where: { activityId_userId: { activityId, userId } },
    update: {},
    create: { activityId, userId },
  });

  const stateWithMaxScore = await prisma.documentState.findUnique({
    where: {
      activityId_docId_docVersionNum_userId_hasMaxScore: {
        activityId,
        docId,
        docVersionNum,
        userId,
        hasMaxScore: true,
      },
    },
    select: { score: true },
  });

  const hasStrictMaxScore =
    stateWithMaxScore === null || score > stateWithMaxScore.score;

  // Use non-strict inequality for hasMaxScore
  // so that will update the hasMaxScore state to the latest
  // even if the current score matched the old max score.
  // Count a non-strict max only if it was saved on submitting an answer
  // so that the max score state is less likely to have unsubmitted results.
  const hasMaxScore =
    hasStrictMaxScore || (score === stateWithMaxScore.score && onSubmission);

  if (hasMaxScore) {
    // if there is a non-latest document state record,
    // delete it as latest is now maxScore as well
    try {
      await prisma.documentState.delete({
        where: {
          activityId_docId_docVersionNum_userId_isLatest: {
            activityId,
            docId,
            docVersionNum,
            userId,
            isLatest: false,
          },
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2001") {
          // if error was that record doesn't exist, then ignore it
        }
      } else {
        throw e;
      }
    }
  } else {
    // since the latest is not with max score,
    // mark the record with hasMaxScore as not the latest
    try {
      await prisma.documentState.update({
        where: {
          activityId_docId_docVersionNum_userId_hasMaxScore: {
            activityId,
            docId,
            docVersionNum,
            userId,
            hasMaxScore: true,
          },
        },
        data: {
          isLatest: false,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2001") {
          // if error was that record doesn't exist, then ignore it
        }
      } else {
        throw e;
      }
    }
  }

  // add/update the latest document state and maxScore
  await prisma.documentState.upsert({
    where: {
      activityId_docId_docVersionNum_userId_isLatest: {
        activityId,
        docId,
        docVersionNum,
        userId,
        isLatest: true,
      },
    },
    update: {
      score,
      state,
      hasMaxScore,
    },
    create: {
      activityId,
      docId,
      docVersionNum,
      userId,
      isLatest: true,
      hasMaxScore,
      score,
      state,
    },
  });

  // use strict inequality for hasStrictMaxScore
  // so that we don't update the actual score tables
  // unless the score increased

  if (hasStrictMaxScore) {
    // recalculate the score using the new maximum scores from each document
    const documentStates = await prisma.documentState.findMany({
      where: {
        assignmentScore: {
          activityId,
          userId,
        },
        hasMaxScore: true,
      },
      select: {
        score: true,
      },
    });
    const documentMaxScores = documentStates.map((x) => x.score);

    // since some document might not have a score recorded yet,
    // count the number of actual documents for the assignment
    const assignmentDocumentsAggregation = await prisma.documents.aggregate({
      _count: {
        id: true,
      },
      where: {
        activityId,
      },
    });
    const numDocuments = assignmentDocumentsAggregation._count.id;

    const averageScore =
      documentMaxScores.reduce((a, c) => a + c) / numDocuments;

    await prisma.assignmentScores.update({
      where: { activityId_userId: { activityId, userId } },
      data: {
        score: averageScore,
      },
    });
  }
}

export async function loadState({
  activityId,
  docId,
  docVersionNum,
  requestedUserId,
  userId,
  withMaxScore,
}: {
  activityId: number;
  docId: number;
  docVersionNum: number;
  requestedUserId: number;
  userId: number;
  withMaxScore: boolean;
}) {
  if (requestedUserId !== userId) {
    // If user isn't the requested user, then user is allowed to load requested users state
    // only if they are the owner of the assignment.
    // If not user is not owner, then it will throw an error.
    await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        ownerId: userId,
        isAssigned: true,
        isFolder: false,
      },
    });
  }

  let documentState;

  if (withMaxScore) {
    documentState = await prisma.documentState.findUniqueOrThrow({
      where: {
        activityId_docId_docVersionNum_userId_hasMaxScore: {
          activityId,
          docId,
          docVersionNum,
          userId: requestedUserId,
          hasMaxScore: true,
        },
      },
      select: { state: true },
    });
  } else {
    documentState = await prisma.documentState.findUniqueOrThrow({
      where: {
        activityId_docId_docVersionNum_userId_isLatest: {
          activityId,
          docId,
          docVersionNum,
          userId: requestedUserId,
          isLatest: true,
        },
      },
      select: { state: true },
    });
  }
  return documentState.state;
}

export async function getAssignmentScoreData({
  activityId,
  ownerId,
}: {
  activityId: number;
  ownerId: number;
}) {
  const assignment = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      ownerId,
      isDeleted: false,
      isAssigned: true,
      isFolder: false,
    },
    select: {
      name: true,
      assignmentScores: {
        select: {
          user: {
            select: { firstNames: true, lastNames: true, userId: true },
          },
          score: true,
        },
        orderBy: [
          { user: { lastNames: "asc" } },
          { user: { firstNames: "asc" } },
        ],
      },
    },
  });

  return assignment;
}

export async function getAssignmentStudentData({
  activityId,
  loggedInUserId,
  studentId,
}: {
  activityId: number;
  loggedInUserId: number;
  studentId: number;
}) {
  const assignmentData = await prisma.assignmentScores.findUniqueOrThrow({
    where: {
      activityId_userId: { activityId, userId: studentId },
      activity: {
        // allow access if logged in user is the student or the owner
        ownerId: studentId === loggedInUserId ? undefined : loggedInUserId,
        isDeleted: false,
        isFolder: false,
        isAssigned: true,
      },
    },
    include: {
      activity: {
        select: {
          name: true,
          documents: {
            select: {
              assignedVersion: {
                select: {
                  docId: true,
                  versionNum: true,
                  source: true,
                  doenetmlVersion: { select: { fullVersion: true } },
                },
              },
            },
          },
        },
      },
      user: { select: { firstNames: true, lastNames: true } },
    },
  });

  const documentScores = await prisma.documentState.findMany({
    where: { activityId, userId: studentId },
    select: {
      docId: true,
      docVersionNum: true,
      hasMaxScore: true,
      score: true,
    },
    orderBy: {
      score: "asc",
    },
  });

  return { ...assignmentData, documentScores };
}

/**
 * Recurses through all subfolders of `parentFolderId`
 * to return all content of it and its subfolders.
 * Results are ordered via a `sortIndex` and a depth-first search,
 * i.e., the contents of a folder immediately follow the folder itself,
 * and items within a folder are ordered by `sortIndex`
 *
 * @returns A Promise that resolves to an object with
 * - orderedActivities: the ordered list of all activities in the folder (and subfolders)
 * - assignmentScores: the scores that student achieved on those activities
 */
export async function getAllAssignmentScores({
  ownerId,
  parentFolderId,
}: {
  ownerId: number;
  parentFolderId: number | null;
}) {
  let orderedActivities;

  let folder: {
    id: number;
    name: string;
  } | null = null;

  // NOTE: the string after `Prisma.sql` is NOT interpreted as a regular string,
  // but it does special processing with the template variables.
  // For this reason, one cannot have an operator such as "=" or "IS" as a template variable
  // or a phrase such as "parentFolderId IS NULL".
  // To get two versions, one with `parentFolderId IS NULL` and the other with `parentFolderId = ${parentFolderId}`,
  // we had to make two completely separate raw queries.
  // See: https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/raw-queries#considerations
  if (parentFolderId === null) {
    orderedActivities = await prisma.$queryRaw<
      {
        id: number;
        name: string;
      }[]
    >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, isFolder, path) AS (
      SELECT id, parentFolderId, isFolder, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE parentFolderId IS NULL AND ownerId = ${ownerId}
      AND (isAssigned = true or isFolder = true) AND isDeleted = false
      UNION ALL
      SELECT c.id, c.parentFolderId, c.isFolder, CONCAT(ft.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ft
      ON c.parentFolderId = ft.id
      WHERE (c.isAssigned = true or c.isFolder = true) AND c.isDeleted = false
    )
    
    SELECT c.id, c.name FROM content AS c
    INNER JOIN content_tree AS ct
    ON ct.id = c.id
    WHERE ct.isFolder = FALSE ORDER BY path
  `);
  } else {
    orderedActivities = await prisma.$queryRaw<
      {
        id: number;
        name: string;
      }[]
    >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, isFolder, path) AS (
      SELECT id, parentFolderId, isFolder, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE parentFolderId = ${parentFolderId} AND ownerId = ${ownerId}
      AND (isAssigned = true or isFolder = true) AND isDeleted = false
      UNION ALL
      SELECT c.id, c.parentFolderId, c.isFolder, CONCAT(ft.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ft
      ON c.parentFolderId = ft.id
      WHERE (c.isAssigned = true or c.isFolder = true) AND c.isDeleted = false
    )
    
    SELECT c.id, c.name FROM content AS c
    INNER JOIN content_tree AS ct
    ON ct.id = c.id
    WHERE ct.isFolder = FALSE ORDER BY path
  `);

    folder = await prisma.content.findUniqueOrThrow({
      where: { id: parentFolderId, ownerId, isDeleted: false, isFolder: true },
      select: { id: true, name: true },
    });
  }

  const assignmentScores = await prisma.assignmentScores.findMany({
    where: {
      activityId: { in: orderedActivities.map((a) => a.id) },
    },
    select: {
      activityId: true,
      userId: true,
      score: true,
      user: {
        select: {
          firstNames: true,
          lastNames: true,
        },
      },
    },
  });

  return { orderedActivities, assignmentScores, folder };
}

/**
 * Recurses through all subfolders of `parentFolderId`
 * to return all content of it and its subfolders.
 * Results are ordered via a `sortIndex` and a depth-first search,
 * i.e., the contents of a folder immediately follow the folder itself,
 * and items within a folder are ordered by `sortIndex`
 *
 * @returns A Promise that resolves to an object with
 * - userData: information on the student
 * - orderedActivities: the ordered list of all activities in the folder (and subfolders)
 *   along with the student's score, if it exists
 */
export async function getStudentData({
  userId,
  ownerId,
  parentFolderId,
}: {
  userId: number;
  ownerId: number;
  parentFolderId: number | null;
}) {
  const userData = await prisma.users.findUniqueOrThrow({
    where: {
      userId,
    },
    select: {
      userId: true,
      firstNames: true,
      lastNames: true,
    },
  });

  let orderedActivityScores;

  let folder: {
    id: number;
    name: string;
  } | null = null;

  // NOTE: the string after `Prisma.sql` is NOT interpreted as a regular string,
  // but it does special processing with the template variables.
  // For this reason, one cannot have an operator such as "=" or "IS" as a template variable
  // or a phrase such as "parentFolderId IS NULL".
  // To get two versions, one with `parentFolderId IS NULL` and the other with `parentFolderId = ${parentFolderId}`,
  // we had to make two completely separate raw queries.
  // See: https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/raw-queries#considerations
  if (parentFolderId === null) {
    orderedActivityScores = await prisma.$queryRaw<
      {
        activityId: number;
        activityName: string;
        score: number | null;
      }[]
    >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, isFolder, path) AS (
      SELECT id, parentFolderId, isFolder, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE parentFolderId IS NULL AND ownerId = ${ownerId}
      AND (isAssigned = true or isFolder = true) AND isDeleted = false
      UNION ALL
      SELECT c.id, c.parentFolderId, c.isFolder, CONCAT(ft.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ft
      ON c.parentFolderId = ft.id
      WHERE (c.isAssigned = true or c.isFolder = true) AND c.isDeleted = false
    )
    
    SELECT c.id AS activityId, c.name AS activityName, s.score FROM content AS c
    INNER JOIN content_tree AS ct
    ON ct.id = c.id
    LEFT JOIN (
    	SELECT * FROM assignmentScores WHERE userId=${userId}
    	) as s
    ON s.activityId  = c.id 
    WHERE ct.isFolder = FALSE ORDER BY path
  `);
  } else {
    orderedActivityScores = await prisma.$queryRaw<
      {
        activityId: number;
        activityName: string;
        score: number | null;
      }[]
    >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, isFolder, path) AS (
      SELECT id, parentFolderId, isFolder, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE parentFolderId = ${parentFolderId} AND ownerId = ${ownerId}
      AND (isAssigned = true or isFolder = true) AND isDeleted = false
      UNION ALL
      SELECT c.id, c.parentFolderId, c.isFolder, CONCAT(ft.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ft
      ON c.parentFolderId = ft.id
      WHERE (c.isAssigned = true or c.isFolder = true) AND c.isDeleted = false
    )
    
    SELECT c.id AS activityId, c.name AS activityName, s.score FROM content AS c
    INNER JOIN content_tree AS ct
    ON ct.id = c.id
    LEFT JOIN (
    	SELECT * FROM assignmentScores WHERE userId=${userId}
    	) as s
    ON s.activityId  = c.id 
    WHERE ct.isFolder = FALSE ORDER BY path
  `);

    folder = await prisma.content.findUniqueOrThrow({
      where: { id: parentFolderId, ownerId, isDeleted: false, isFolder: true },
      select: { id: true, name: true },
    });
  }

  return { userData, orderedActivityScores, folder };
}

export async function getAssignedScores(loggedInUserId: number) {
  const scores = await prisma.assignmentScores.findMany({
    where: {
      userId: loggedInUserId,
      activity: { isAssigned: true, isDeleted: false },
    },
    select: {
      score: true,
      activity: { select: { id: true, name: true } },
    },
    orderBy: { activity: { createdAt: "asc" } },
  });

  const orderedActivityScores = scores.map((obj) => ({
    activityId: obj.activity.id,
    activityName: obj.activity.name,
    score: obj.score,
  }));

  const userData = await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: { userId: true, firstNames: true, lastNames: true },
  });

  return { userData, orderedActivityScores };
}

export async function getAssignmentContent({
  activityId,
  ownerId,
}: {
  activityId: number;
  ownerId: number;
}) {
  const assignmentData = await prisma.documents.findMany({
    where: {
      activityId,
      activity: {
        ownerId,
        isDeleted: false,
        isAssigned: true,
        isFolder: false,
      },
    },
    select: {
      assignedVersion: {
        select: {
          docId: true,
          versionNum: true,
          source: true,
          doenetmlVersion: { select: { fullVersion: true } },
        },
      },
    },
  });

  return assignmentData;
}

// TODO: do we still record submitted event if an assignment isn't open?
// If so, do we mark it special to indicate that assignment wasn't open at the time?
export async function recordSubmittedEvent({
  activityId,
  docId,
  docVersionNum,
  userId,
  answerId,
  response,
  answerNumber,
  itemNumber,
  creditAchieved,
  itemCreditAchieved,
  documentCreditAchieved,
}: {
  activityId: number;
  docId: number;
  docVersionNum: number;
  userId: number;
  answerId: string;
  response: string;
  answerNumber?: number;
  itemNumber: number;
  creditAchieved: number;
  itemCreditAchieved: number;
  documentCreditAchieved: number;
}) {
  await prisma.documentSubmittedResponses.create({
    data: {
      activityId,
      docVersionNum,
      docId,
      userId,
      answerId,
      response,
      answerNumber,
      itemNumber,
      creditAchieved,
      itemCreditAchieved,
      documentCreditAchieved,
    },
  });
}

export async function getAnswersThatHaveSubmittedResponses({
  activityId,
  ownerId,
}: {
  activityId: number;
  ownerId: number;
}) {
  // Using raw query as it seems prisma does not support distinct in count.
  // https://github.com/prisma/prisma/issues/4228

  let submittedResponses = await prisma.$queryRaw<
    {
      docId: number;
      docVersionNum: number;
      answerId: string;
      answerNumber: number | null;
      count: number;
    }[]
  >(Prisma.sql`
    SELECT docId, docVersionNum, answerId, answerNumber, 
    COUNT(userId) as count, AVG(maxCredit) as averageCredit
    FROM (
      SELECT activityId, docId, docVersionNum, answerId, answerNumber, userId, MAX(creditAchieved) as maxCredit
      FROM documentSubmittedResponses
      WHERE activityId = ${activityId}
      GROUP BY activityId, docId, docVersionNum, answerId, answerNumber, userId 
    ) as dsr
    INNER JOIN content on dsr.activityId = content.id 
    WHERE content.id=${activityId} and ownerId = ${ownerId} and isAssigned=true and isFolder=false
    GROUP BY docId, docVersionNum, answerId, answerNumber
    ORDER BY answerNumber
    `);

  // The query returns a BigInt for count, which TypeScript doesn't know how to serialize,
  // so we convert into a Number.
  submittedResponses = submittedResponses.map((row) => {
    row.count = Number(row.count);
    return row;
  });

  return submittedResponses;
}

export async function getDocumentSubmittedResponses({
  activityId,
  docId,
  docVersionNum,
  ownerId,
  answerId,
}: {
  activityId: number;
  docId: number;
  docVersionNum: number;
  ownerId: number;
  answerId: string;
}) {
  // get activity name and make sure that owner is the owner
  const activityName = (
    await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        ownerId,
        isDeleted: false,
        isFolder: false,
      },
      select: { name: true },
    })
  ).name;

  // TODO: gave up figuring out to do find the best response and the latest response in a SQL query,
  // so just create in via JS based on this one query.
  // Can we come up with a better solution?
  const rawResponses = await prisma.$queryRaw<
    {
      userId: number;
      firstNames: string | null;
      lastNames: string;
      response: string;
      creditAchieved: number;
      submittedAt: DateTime;
      maxCredit: number;
      numResponses: bigint;
    }[]
  >(Prisma.sql`
select dsr.userId, users.firstNames, users.lastNames, response, creditAchieved, submittedAt,
    	MAX(creditAchieved) over (partition by dsr.userId) as maxCredit,
    	COUNT(creditAchieved) over (partition by dsr.userId) as numResponses
    	from documentSubmittedResponses as dsr
      INNER JOIN content on dsr.activityId = content.id 
      INNER JOIN users on dsr.userId = users.userId 
      WHERE content.id=${activityId} and ownerId = ${ownerId} and isAssigned=true and isFolder=false
    	and docId = ${docId} and docVersionNum = ${docVersionNum} and answerId = ${answerId}
    	order by dsr.userId asc, submittedAt desc
  `);

  const submittedResponses = [];
  let newResponse;
  let lastUserId = 0;

  for (const respObj of rawResponses) {
    if (respObj.userId > lastUserId) {
      lastUserId = respObj.userId;
      if (newResponse) {
        submittedResponses.push(newResponse);
      }
      newResponse = {
        userId: respObj.userId,
        firstNames: respObj.firstNames,
        lastNames: respObj.lastNames,
        latestResponse: respObj.response,
        latestCreditAchieved: respObj.creditAchieved,
        bestCreditAchieved: respObj.maxCredit,
        numResponses: Number(respObj.numResponses),
        bestResponse: "",
      };
    }
    if (
      newResponse?.bestResponse === "" &&
      respObj.creditAchieved === newResponse.bestCreditAchieved
    ) {
      newResponse.bestResponse = respObj.response;
    }
  }

  if (newResponse) {
    submittedResponses.push(newResponse);
  }

  return { activityName, submittedResponses };
}

export async function getDocumentSubmittedResponseHistory({
  activityId,
  docId,
  docVersionNum,
  ownerId,
  answerId,
  userId,
}: {
  activityId: number;
  docId: number;
  docVersionNum: number;
  ownerId: number;
  answerId: string;
  userId: number;
}) {
  // get activity name and make sure that owner is the owner
  const activityName = (
    await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        ownerId,
        isDeleted: false,
        isFolder: false,
      },
      select: { name: true },
    })
  ).name;

  // for each combination of ["activityId", "docId", "docVersionNum", "answerId", "userId"],
  // find the latest submitted response
  const submittedResponses = await prisma.documentSubmittedResponses.findMany({
    where: {
      activityId,
      docVersionNum,
      docId,
      answerId,
      userId,
      documentVersion: {
        document: {
          activity: {
            ownerId,
          },
        },
      },
    },
    select: {
      user: { select: { userId: true, firstNames: true, lastNames: true } },
      response: true,
      creditAchieved: true,
      submittedAt: true,
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  return { activityName, submittedResponses };
}

export async function getMyFolderContent({
  folderId,
  loggedInUserId,
}: {
  folderId: number | null;
  loggedInUserId: number;
}) {
  let folder: ContentStructure | null = null;

  if (folderId !== null) {
    // if ask for a folder, make sure it exists and is owned by logged in user
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        id: folderId,
        isDeleted: false,
        isFolder: true,
        ownerId: loggedInUserId,
      },
      select: {
        id: true,
        ownerId: true,
        name: true,
        imagePath: true,
        isPublic: true,
        sharedWith: {
          select: {
            user: {
              select: {
                userId: true,
                email: true,
                firstNames: true,
                lastNames: true,
              },
            },
          },
        },
        license: {
          include: {
            composedOf: {
              select: { composedOf: true },
              orderBy: { composedOf: { sortIndex: "asc" } },
            },
          },
        },
        parentFolder: {
          select: {
            id: true,
            name: true,
            isPublic: true,
            sharedWith: {
              select: {
                user: {
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
    });

    const {
      sharedWith: sharedWithOrig,
      license,
      parentFolder,
      ...preliminaryFolder2
    } = preliminaryFolder;

    const { isShared, sharedWith } = processSharedWith(sharedWithOrig);

    folder = {
      ...preliminaryFolder2,
      isFolder: true,
      isShared,
      sharedWith,
      assignmentStatus: "Unassigned",
      classCode: null,
      codeValidUntil: null,
      documents: [],
      hasScoreData: false,
      license: license ? processLicense(license) : null,
      parentFolder: processParentFolder(parentFolder),
      classifications: [],
    };
  }

  const preliminaryContent = await prisma.content.findMany({
    where: {
      ownerId: loggedInUserId,
      isDeleted: false,
      parentFolderId: folderId,
    },
    select: {
      id: true,
      isFolder: true,
      ownerId: true,
      name: true,
      imagePath: true,
      isPublic: true,
      sharedWith: {
        select: {
          user: {
            select: {
              userId: true,
              email: true,
              firstNames: true,
              lastNames: true,
            },
          },
        },
      },
      isAssigned: true,
      classCode: true,
      codeValidUntil: true,
      license: {
        include: {
          composedOf: {
            select: { composedOf: true },
            orderBy: { composedOf: { sortIndex: "asc" } },
          },
        },
      },
      classifications: {
        select: {
          classification: {
            select: {
              id: true,
              code: true,
              grade: true,
              category: true,
              description: true,
              system: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      documents: { select: { id: true, doenetmlVersion: true } },
      parentFolder: {
        select: {
          id: true,
          name: true,
          isPublic: true,
          sharedWith: {
            select: {
              user: {
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
      _count: { select: { assignmentScores: true } },
    },
    orderBy: { sortIndex: "asc" },
  });

  const content: ContentStructure[] = preliminaryContent.map((obj) => {
    const {
      _count,
      isAssigned,
      sharedWith: sharedWithOrig,
      license,
      classifications,
      parentFolder,
      ...activity
    } = obj;
    const isOpen = obj.codeValidUntil
      ? DateTime.now() <= DateTime.fromJSDate(obj.codeValidUntil)
      : false;
    const assignmentStatus: AssignmentStatus = !obj.isAssigned
      ? "Unassigned"
      : !isOpen
        ? "Closed"
        : "Open";
    const { isShared, sharedWith } = processSharedWith(sharedWithOrig);

    return {
      ...activity,
      isShared,
      sharedWith,
      license: license ? processLicense(license) : null,
      classifications: classifications.map((c) => c.classification),
      assignmentStatus,
      hasScoreData: _count.assignmentScores > 0,
      parentFolder: processParentFolder(parentFolder),
    };
  });

  return {
    content,
    folder,
  };
}

export async function searchMyFolderContent({
  folderId,
  loggedInUserId,
  query,
}: {
  folderId: number | null;
  loggedInUserId: number;
  query: string;
}) {
  let folder: ContentStructure | null = null;

  if (folderId !== null) {
    // if ask for a folder, make sure it exists and is owned by logged in user
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        id: folderId,
        isDeleted: false,
        isFolder: true,
        ownerId: loggedInUserId,
      },
      select: {
        id: true,
        ownerId: true,
        name: true,
        imagePath: true,
        isPublic: true,
        sharedWith: {
          select: {
            user: {
              select: {
                userId: true,
                email: true,
                firstNames: true,
                lastNames: true,
              },
            },
          },
        },
        license: {
          include: {
            composedOf: {
              select: { composedOf: true },
              orderBy: { composedOf: { sortIndex: "asc" } },
            },
          },
        },
        parentFolder: {
          select: {
            id: true,
            name: true,
            isPublic: true,
            sharedWith: {
              select: {
                user: {
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
    });

    const {
      sharedWith: sharedWithOrig,
      license,
      parentFolder,
      ...preliminaryFolder2
    } = preliminaryFolder;
    const { isShared, sharedWith } = processSharedWith(sharedWithOrig);

    folder = {
      ...preliminaryFolder2,
      isFolder: true,
      isShared,
      sharedWith,
      assignmentStatus: "Unassigned",
      classCode: null,
      codeValidUntil: null,
      documents: [],
      hasScoreData: false,
      license: license ? processLicense(license) : null,
      parentFolder: processParentFolder(parentFolder),
      classifications: [],
    };
  }

  let matches: {
    id: number;
    relevance: number;
  }[];

  // remove operators that break MySQL BOOLEAN search
  // and add * at the end of every word so that match beginning of words
  const query_as_prefixes = query
    .replace(/[+\-><()~*"@]+/g, " ")
    .split(" ")
    .filter((s) => s)
    .map((s) => s + "*")
    .join(" ");

  if (folderId === null) {
    matches = await prisma.$queryRaw<
      {
        id: number;
        relevance: number;
      }[]
    >(Prisma.sql`
  SELECT
    content.id,
    AVG((MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) + 
    (MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) +
    MATCH(classifications.code, classifications.category, classifications.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    ) as relevance
  FROM
    content
  LEFT JOIN
    (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
  LEFT JOIN
    contentClassifications ON content.id = contentClassifications.contentId
  LEFT JOIN
    classifications ON contentClassifications.classificationId = classifications.id
  WHERE
    content.ownerId = ${loggedInUserId}
    AND content.isDeleted = FALSE
    AND
    (MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classifications.code, classifications.category, classifications.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE))
  GROUP BY
    content.id
  ORDER BY
    relevance DESC
  LIMIT 100
  `);
  } else {
    matches = await prisma.$queryRaw<
      {
        id: number;
        relevance: number;
      }[]
    >(
      Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE parentFolderId = ${folderId} AND ownerId = ${loggedInUserId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ft
      ON content.parentFolderId = ft.id
      WHERE content.isDeleted = FALSE
    )

    SELECT
      content.id,
      AVG((MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) + 
      (MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) +
      MATCH(classifications.code, classifications.category, classifications.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ) as relevance
    FROM
      content
    LEFT JOIN
      (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
    LEFT JOIN
      contentClassifications ON content.id = contentClassifications.contentId
    LEFT JOIN
      classifications ON contentClassifications.classificationId = classifications.id
    WHERE
      content.id IN (SELECT id from content_tree)
      AND
      (MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(classifications.code, classifications.category, classifications.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE))
    GROUP BY
      content.id
    ORDER BY
      relevance DESC
    LIMIT 100
    `,
    );
  }

  // TODO: combine queries

  const preliminaryResults = await prisma.content.findMany({
    where: {
      id: { in: matches.map((m) => m.id) },
    },
    select: {
      id: true,
      isFolder: true,
      ownerId: true,
      name: true,
      imagePath: true,
      isPublic: true,
      sharedWith: {
        select: {
          user: {
            select: {
              userId: true,
              email: true,
              firstNames: true,
              lastNames: true,
            },
          },
        },
      },
      isAssigned: true,
      classCode: true,
      codeValidUntil: true,
      license: {
        include: {
          composedOf: {
            select: { composedOf: true },
            orderBy: { composedOf: { sortIndex: "asc" } },
          },
        },
      },
      classifications: {
        select: {
          classification: {
            select: {
              id: true,
              code: true,
              grade: true,
              category: true,
              description: true,
              system: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      documents: { select: { id: true, doenetmlVersion: true } },
      parentFolder: {
        select: {
          id: true,
          name: true,
          isPublic: true,
          sharedWith: {
            select: {
              user: {
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
      _count: { select: { assignmentScores: true } },
    },
  });

  // TODO: better way to sort! (For free if combine queries)
  const relevance = Object.fromEntries(matches.map((m) => [m.id, m.relevance]));

  const content: ContentStructure[] = preliminaryResults
    .sort((a, b) => relevance[b.id] - relevance[a.id])
    .map((obj) => {
      const {
        _count,
        isAssigned,
        sharedWith: sharedWithOrig,
        license,
        classifications,
        parentFolder,
        ...activity
      } = obj;
      const isOpen = obj.codeValidUntil
        ? DateTime.now() <= DateTime.fromJSDate(obj.codeValidUntil)
        : false;
      const assignmentStatus: AssignmentStatus = !obj.isAssigned
        ? "Unassigned"
        : !isOpen
          ? "Closed"
          : "Open";
      const { isShared, sharedWith } = processSharedWith(sharedWithOrig);

      return {
        ...activity,
        isShared,
        sharedWith,
        license: license ? processLicense(license) : null,
        classifications: classifications.map((c) => c.classification),
        assignmentStatus,
        hasScoreData: _count.assignmentScores > 0,
        parentFolder: processParentFolder(parentFolder),
      };
    });

  return {
    content,
    folder,
  };
}

export async function getSharedFolderContent({
  ownerId,
  folderId,
  loggedInUserId,
}: {
  ownerId: number;
  folderId: number | null;
  loggedInUserId: number;
}) {
  let folder: ContentStructure | null = null;

  if (folderId !== null) {
    // if ask for a folder, make sure it exists and is owned by logged in user
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        ownerId,
        id: folderId,
        isDeleted: false,
        OR: [
          { isPublic: true },
          { sharedWith: { some: { userId: loggedInUserId } } },
        ],
      },
      select: {
        id: true,
        ownerId: true,
        name: true,
        imagePath: true,
        isPublic: true,
        sharedWith: {
          select: {
            userId: true,
          },
        },
        license: {
          include: {
            composedOf: {
              select: { composedOf: true },
              orderBy: { composedOf: { sortIndex: "asc" } },
            },
          },
        },
        parentFolder: {
          select: {
            id: true,
            name: true,
            isPublic: true,
            sharedWith: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    // If parent folder is not public or not shared with me,
    // make it look like it doesn't have a parent folder.
    if (
      !(
        preliminaryFolder.parentFolder &&
        (preliminaryFolder.parentFolder.isPublic ||
          preliminaryFolder.parentFolder.sharedWith.findIndex(
            (cs) => cs.userId === loggedInUserId,
          ) !== -1)
      )
    ) {
      preliminaryFolder.parentFolder = null;
    }

    const {
      license,
      sharedWith: sharedWithOrig,
      parentFolder,
      ...preliminaryFolder2
    } = preliminaryFolder;

    const { isShared, sharedWith } = processSharedWithForUser(
      sharedWithOrig,
      loggedInUserId,
    );

    folder = {
      ...preliminaryFolder2,
      isFolder: true,
      isShared,
      sharedWith,
      assignmentStatus: "Unassigned",
      classCode: null,
      codeValidUntil: null,
      documents: [],
      hasScoreData: false,
      license: license ? processLicense(license) : null,
      parentFolder: processParentFolderForUser(parentFolder, loggedInUserId),
      classifications: [],
    };
  }

  const preliminarySharedContent = await prisma.content.findMany({
    where: {
      ownerId,
      isDeleted: false,
      parentFolderId: folderId,
      OR: [
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
    },
    select: {
      id: true,
      isFolder: true,
      ownerId: true,
      name: true,
      imagePath: true,
      isPublic: true,
      sharedWith: {
        select: {
          userId: true,
        },
      },
      classifications: {
        select: {
          classification: {
            select: {
              id: true,
              grade: true,
              code: true,
              category: true,
              description: true,
              system: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      license: {
        include: {
          composedOf: {
            select: { composedOf: true },
            orderBy: { composedOf: { sortIndex: "asc" } },
          },
        },
      },
      parentFolder: {
        select: {
          id: true,
          name: true,
          isPublic: true,
          sharedWith: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
    orderBy: { sortIndex: "asc" },
  });

  // If looking in the base folder,
  // also include orphaned shared content,
  // i.e., shared content that is inside a non-shared folder.
  // That way, users can navigate to all of the owner's shared content
  // when start at the base folder
  if (folderId === null) {
    const orphanedSharedContent = await prisma.content.findMany({
      where: {
        ownerId,
        isDeleted: false,
        parentFolder: {
          AND: [
            { isPublic: false },
            { sharedWith: { none: { userId: loggedInUserId } } },
          ],
        },
        OR: [
          { isPublic: true },
          { sharedWith: { some: { userId: loggedInUserId } } },
        ],
      },
      select: {
        id: true,
        isFolder: true,
        ownerId: true,
        name: true,
        imagePath: true,
        isPublic: true,
        sharedWith: {
          select: {
            userId: true,
          },
        },
        classifications: {
          select: {
            classification: {
              select: {
                id: true,
                grade: true,
                code: true,
                category: true,
                description: true,
                system: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        license: {
          include: {
            composedOf: {
              select: { composedOf: true },
              orderBy: { composedOf: { sortIndex: "asc" } },
            },
          },
        },
        parentFolder: {
          select: {
            id: true,
            name: true,
            isPublic: true,
            sharedWith: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
      orderBy: { sortIndex: "asc" },
    });
    preliminarySharedContent.push(...orphanedSharedContent);
  }

  const publicContent: ContentStructure[] = preliminarySharedContent.map(
    (content) => {
      const {
        license,
        classifications,
        sharedWith: sharedWithOrig,
        parentFolder,
        ...content2
      } = content;

      const { isShared, sharedWith } = processSharedWithForUser(
        sharedWithOrig,
        loggedInUserId,
      );

      return {
        ...content2,
        isShared,
        sharedWith,
        documents: [],
        license: license ? processLicense(license) : null,
        classifications: classifications.map((c) => c.classification),
        classCode: null,
        codeValidUntil: null,
        assignmentStatus: "Unassigned",
        hasScoreData: false,
        parentFolder: processParentFolderForUser(parentFolder, loggedInUserId),
      };
    },
  );

  const owner = await prisma.users.findUniqueOrThrow({
    where: { userId: ownerId },
    select: { firstNames: true, lastNames: true },
  });

  return {
    content: publicContent,
    owner,
    folder,
  };
}

export async function searchPossibleClassifications(query: string) {
  const query_words = query.split(" ");
  const results: ContentClassification[] =
    await prisma.classifications.findMany({
      where: {
        AND: query_words.map((query_word) => ({
          OR: [
            { code: { contains: query_word } },
            { grade: { contains: query_word } },
            { category: { contains: query_word } },
            { description: { contains: query_word } },
            { system: { name: { contains: query_word } } },
          ],
        })),
      },
      select: {
        id: true,
        grade: true,
        code: true,
        category: true,
        description: true,
        system: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  return results;
}

/**
 * Add a classification to an activity. The activity must be owned by the logged in user.
 * Activity id must be an activity, not a folder.
 * @param activityId
 * @param classificationId
 * @param loggedInUserId
 */
export async function addClassification(
  activityId: number,
  classificationId: number,
  loggedInUserId: number,
) {
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      isFolder: false,
      isDeleted: false,
      ownerId: loggedInUserId,
    },
    select: {
      // not using this, we just need to select one field
      id: true,
    },
  });
  if (!activity) {
    throw new InvalidRequestError(
      "This activity does not exist or is not owned by this user.",
    );
  }
  await prisma.contentClassifications.create({
    data: {
      contentId: activityId,
      classificationId,
    },
  });
}

/**
 * Remove a classification to an activity. The activity must be owned by the logged in user.
 * Activity id must be an activity, not a folder.
 * @param activityId
 * @param classificationId
 * @param loggedInUserId
 */
export async function removeClassification(
  activityId: number,
  classificationId: number,
  loggedInUserId: number,
) {
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      isFolder: false,
      isDeleted: false,
      ownerId: loggedInUserId,
    },
    select: {
      // not using this, we just need to select one field
      id: true,
    },
  });
  if (!activity) {
    throw new InvalidRequestError(
      "This activity does not exist or is not owned by this user.",
    );
  }
  await prisma.contentClassifications.delete({
    where: {
      contentId_classificationId: { contentId: activityId, classificationId },
    },
  });
}

/**
 * Get all classifications for an activity. The activity must be either public or owned by
 * loggedInUser.
 * @param activityId
 * @param loggedInUserId
 */
export async function getClassifications(
  activityId: number,
  loggedInUserId: number,
) {
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      isFolder: false,
      isDeleted: false,
      OR: [
        {
          ownerId: loggedInUserId,
        },
        {
          isPublic: true,
        },
      ],
    },
    select: {
      // not using this, we just need to select one field
      id: true,
    },
  });
  if (!activity) {
    throw new InvalidRequestError(
      "This activity does not exist or cannot be accessed.",
    );
  }

  const classifications = await prisma.contentClassifications.findMany({
    where: {
      contentId: activityId,
    },
    select: {
      classification: {
        select: {
          id: true,
          system: {
            select: {
              name: true,
            },
          },
          code: true,
          category: true,
          description: true,
        },
      },
    },
  });
  return classifications;
}

export async function getLicense(code: string) {
  const preliminary_license = await prisma.licenses.findUniqueOrThrow({
    where: { code },
    include: {
      composedOf: {
        select: { composedOf: true },
        orderBy: { composedOf: { sortIndex: "asc" } },
      },
    },
  });

  const license = processLicense(preliminary_license);
  return license;
}

export async function getAllLicenses() {
  const preliminary_licenses = await prisma.licenses.findMany({
    include: {
      composedOf: {
        select: { composedOf: true },
        orderBy: { composedOf: { sortIndex: "asc" } },
      },
    },
    orderBy: { sortIndex: "asc" },
  });

  const licenses = preliminary_licenses.map(processLicense);
  return licenses;
}

/**
 * Process a list of user info from the SharedWith table
 *
 * Returns:
 * - isShared: true if there were any SharedWith items
 * - sharedWith: an array of UserInfo sorted by last names, then first names, then email.
 */
function processSharedWith(
  sharedWithOrig:
    | {
        user: UserInfo;
      }[]
    | null
    | undefined,
): { isShared: boolean; sharedWith: UserInfo[] } {
  if (sharedWithOrig === null || sharedWithOrig === undefined) {
    return { isShared: false, sharedWith: [] };
  }

  const isShared = sharedWithOrig.length > 0;

  const sharedWith = sharedWithOrig
    .map((cs) => cs.user)
    .sort(
      (a, b) =>
        a.lastNames.localeCompare(b.lastNames) ||
        a.firstNames?.localeCompare(b.firstNames || "") ||
        a.email.localeCompare(b.email),
    );

  return { isShared, sharedWith };
}

/**
 * Process a list of userIds from the SharedWith table to determine
 * if the content was shared with `determineSharedToUser`
 *
 * Returns:
 * - isShared: true if `determineSharedToUser` is in the list of userIds
 * - sharedWith: any empty array of UserInfo
 *
 * @param sharedWithIds
 * @param determineSharedToUser
 * @returns
 */
function processSharedWithForUser(
  sharedWithIds: { userId: number }[] | null | undefined,
  determineSharedToUser: number,
): { isShared: boolean; sharedWith: UserInfo[] } {
  if (sharedWithIds === null || sharedWithIds === undefined) {
    return { isShared: false, sharedWith: [] };
  }

  const isShared =
    sharedWithIds.findIndex((cs) => cs.userId === determineSharedToUser) !== -1;

  const sharedWith: {
    userId: number;
    email: string;
    firstNames: string | null;
    lastNames: string;
  }[] = [];

  return { isShared, sharedWith };
}

/**
 * Process a parent folder of content to standard form for the parent folder of ContentStructure
 */
function processParentFolder(
  parentFolder: {
    id: number;
    name: string;
    isPublic: boolean;
    sharedWith?: {
      user: UserInfo;
    }[];
  } | null,
) {
  if (parentFolder === null) {
    return null;
  }

  const { isShared, sharedWith } = processSharedWith(parentFolder.sharedWith);

  return {
    id: parentFolder.id,
    name: parentFolder.name,
    isPublic: parentFolder.isPublic,
    isShared,
    sharedWith,
  };
}

/**
 * Process a parent folder of content to standard form for the parent folder of ContentStructure
 * where the content sharing is just for the user `determineSharedToUser`.
 */
function processParentFolderForUser(
  parentFolder: {
    id: number;
    name: string;
    isPublic: boolean;
    sharedWith: { userId: number }[];
  } | null,
  determineSharedToUser: number,
) {
  if (parentFolder === null) {
    return null;
  }

  const { isShared, sharedWith } = processSharedWithForUser(
    parentFolder.sharedWith,
    determineSharedToUser,
  );

  return {
    id: parentFolder.id,
    name: parentFolder.name,
    isPublic: parentFolder.isPublic,
    isShared,
    sharedWith,
  };
}

function processLicense(
  preliminary_license: {
    composedOf: {
      composedOf: {
        code: string;
        name: string;
        description: string;
        imageURL: string | null;
        smallImageURL: string | null;
        licenseURL: string | null;
        sortIndex: number;
      };
    }[];
  } & {
    code: string;
    name: string;
    description: string;
    imageURL: string | null;
    smallImageURL: string | null;
    licenseURL: string | null;
    sortIndex: number;
  },
): License {
  if (preliminary_license.composedOf.length > 0) {
    return {
      code: preliminary_license.code as LicenseCode,
      name: preliminary_license.name,
      description: preliminary_license.description,
      imageURL: null,
      smallImageURL: null,
      licenseURL: null,
      isComposition: true,
      composedOf: preliminary_license.composedOf.map((comp) => ({
        code: comp.composedOf.code as LicenseCode,
        name: comp.composedOf.name,
        description: comp.composedOf.description,
        imageURL: comp.composedOf.imageURL,
        smallImageURL: comp.composedOf.smallImageURL,
        licenseURL: comp.composedOf.licenseURL,
      })),
    };
  } else {
    return {
      code: preliminary_license.code as LicenseCode,
      name: preliminary_license.name,
      description: preliminary_license.description,
      imageURL: preliminary_license.imageURL,
      smallImageURL: preliminary_license.smallImageURL,
      licenseURL: preliminary_license.licenseURL,
      isComposition: false,
      composedOf: [],
    };
  }
}

export async function setActivityLicense({
  id,
  ownerId,
  licenseCode,
}: {
  id: number;
  ownerId: number;
  licenseCode: LicenseCode;
}) {
  const updated = await prisma.content.update({
    where: { id, isDeleted: false, ownerId: ownerId, isFolder: false },
    data: { licenseCode },
  });

  return { id: updated.id };
}

export async function makeActivityPublic({
  id,
  ownerId,
  licenseCode,
}: {
  id: number;
  ownerId: number;
  licenseCode: LicenseCode;
}) {
  const updated = await prisma.content.update({
    where: { id, isDeleted: false, ownerId: ownerId, isFolder: false },
    data: { isPublic: true, licenseCode },
  });

  return { id: updated.id, isPublic: updated.isPublic };
}

export async function makeActivityPrivate({
  id,
  ownerId,
}: {
  id: number;
  ownerId: number;
}) {
  const updated = await prisma.content.update({
    where: { id, isDeleted: false, ownerId, isFolder: false },
    data: { isPublic: false },
  });

  return { id: updated.id, isPublic: updated.isPublic };
}

export async function shareActivity({
  id,
  ownerId,
  licenseCode,
  users,
}: {
  id: number;
  ownerId: number;
  licenseCode: LicenseCode;
  users: number[];
}) {
  const updated = await prisma.content.update({
    where: { id, isDeleted: false, ownerId: ownerId, isFolder: false },
    data: {
      licenseCode,
      sharedWith: {
        createMany: {
          data: users.map((userId) => ({ userId })),
          skipDuplicates: true,
        },
      },
    },
  });

  return { id: updated.id };
}

export async function shareActivityWithEmail({
  id,
  ownerId,
  licenseCode,
  email,
}: {
  id: number;
  ownerId: number;
  licenseCode: LicenseCode;
  email: string;
}) {
  let userId;

  try {
    userId = (
      await prisma.users.findUniqueOrThrow({
        where: { email, isAnonymous: false },
        select: { userId: true },
      })
    ).userId;
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      throw Error("User with email not found");
    } else {
      throw e;
    }
  }

  if (userId === ownerId) {
    // don't need to share with self
    return { id };
  }

  return await shareActivity({ id, ownerId, licenseCode, users: [userId] });
}

export async function unshareActivity({
  id,
  ownerId,
  users,
}: {
  id: number;
  ownerId: number;
  users: number[];
}) {
  await prisma.contentShares.deleteMany({
    where: {
      content: { id, isDeleted: false, ownerId, isFolder: false },
      OR: users.map((userId) => ({ userId })),
    },
  });

  return { id };
}

export async function setFolderLicense({
  id,
  ownerId,
  licenseCode,
}: {
  id: number;
  ownerId: number;
  licenseCode: LicenseCode;
}) {
  // Set license for the folder `id` along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

  await prisma.$queryRaw(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${id} AND ownerId = ${ownerId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ft
      ON content.parentFolderId = ft.id
      WHERE content.isDeleted = FALSE
    )

    UPDATE content
      SET content.licenseCode = ${licenseCode}
      WHERE content.id IN (SELECT id from content_tree);
    `);
}

export async function makeFolderPublic({
  id,
  ownerId,
  licenseCode,
}: {
  id: number;
  ownerId: number;
  licenseCode: LicenseCode;
}) {
  // Make the folder `id` public along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

  await prisma.$queryRaw(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${id} AND ownerId = ${ownerId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ft
      ON content.parentFolderId = ft.id
      WHERE content.isDeleted = FALSE
    )

    UPDATE content
      SET content.isPublic = TRUE, content.licenseCode = ${licenseCode}
      WHERE content.id IN (SELECT id from content_tree);
    `);
}

export async function makeFolderPrivate({
  id,
  ownerId,
}: {
  id: number;
  ownerId: number;
}) {
  // Make the folder `id` private along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

  await prisma.$queryRaw(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${id} AND ownerId = ${ownerId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ft
      ON content.parentFolderId = ft.id
      WHERE content.isDeleted = FALSE
    )

    UPDATE content
      SET content.isPublic = FALSE
      WHERE content.id IN (SELECT id from content_tree);
    `);
}

export async function shareFolder({
  id,
  ownerId,
  licenseCode,
  users,
}: {
  id: number;
  ownerId: number;
  licenseCode: LicenseCode;
  users: number[];
}) {
  // Share the folder `id` to users along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

  const contentIds = (
    await prisma.$queryRaw<{ id: number }[]>(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${id} AND ownerId = ${ownerId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ft
      ON content.parentFolderId = ft.id
      WHERE content.isDeleted = FALSE
    )

    SELECT id from content_tree;
    `)
  ).map((obj) => obj.id);

  // TODO: combine queries?

  await prisma.content.updateMany({
    where: { id: { in: contentIds } },
    data: {
      licenseCode,
    },
  });

  await prisma.contentShares.createMany({
    data: users.flatMap((userId) =>
      contentIds.map((contentId) => ({ userId, contentId })),
    ),
    skipDuplicates: true,
  });

  return { id };
}

export async function shareFolderWithEmail({
  id,
  ownerId,
  licenseCode,
  email,
}: {
  id: number;
  ownerId: number;
  licenseCode: LicenseCode;
  email: string;
}) {
  let userId;

  try {
    userId = (
      await prisma.users.findUniqueOrThrow({
        where: { email, isAnonymous: false },
        select: { userId: true },
      })
    ).userId;
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      throw Error("User with email not found");
    } else {
      throw e;
    }
  }

  if (userId === ownerId) {
    // don't need to share with self
    return { id };
  }

  return await shareFolder({ id, ownerId, licenseCode, users: [userId] });
}

export async function unshareFolder({
  id,
  ownerId,
  users,
}: {
  id: number;
  ownerId: number;
  users: number[];
}) {
  // Stop the folder `id` along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

  const contentIds = (
    await prisma.$queryRaw<{ id: number }[]>(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${id} AND ownerId = ${ownerId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ft
      ON content.parentFolderId = ft.id
      WHERE content.isDeleted = FALSE
    )

    SELECT id from content_tree;
    `)
  ).map((obj) => obj.id);

  // TODO: combine queries?

  await prisma.contentShares.deleteMany({
    where: {
      OR: users.flatMap((userId) =>
        contentIds.map((contentId) => ({ userId, contentId })),
      ),
    },
  });
}

export async function setPreferredFolderView(
  loggedInUserId: number,
  cardView: boolean,
) {
  return await prisma.users.update({
    where: { userId: loggedInUserId },
    data: { cardView },
    select: { cardView: true },
  });
}

export async function getPreferredFolderView(loggedInUserId: number) {
  return await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: { cardView: true },
  });
}
