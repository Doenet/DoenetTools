import {
  PrismaClient,
  Prisma,
  LibraryStatus,
  LibraryEventType,
} from "@prisma/client";
import { cidFromText } from "./utils/cid";
import { DateTime } from "luxon";
import { fromUUID, isEqualUUID } from "./utils/uuid";
import {
  LibraryInfo,
  ClassificationCategoryTree,
  ContentClassification,
  ContentStructure,
  createContentStructure,
  DocHistory,
  DocRemixes,
  LicenseCode,
  PartialContentClassification,
  UserInfo,
} from "./types";
import {
  returnClassificationJoins,
  returnClassificationFilterWhereClauses,
  returnFeatureJoins,
  returnFeatureWhereClauses,
  sortClassifications,
  returnClassificationMatchClauses,
} from "./utils/classificationsFeatures";
import {
  processContentSharedDetails,
  processContentSharedDetailsAssignedDoc,
  processContent,
  processContentSharedDetailsNoClassDocs,
  processContentNoClassDocs,
  processLicense,
  returnContentStructureFullOwnerSelect,
  returnContentStructureNoClassDocsSelect,
  returnContentStructureSharedDetailsNoClassDocsSelect,
  returnContentStructureSharedDetailsSelect,
  returnClassificationListSelect,
} from "./utils/contentStructure";
import { getRandomValues } from "crypto";

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
  userId: Uint8Array,
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
  ownerId: Uint8Array,
  parentFolderId: Uint8Array | null,
) {
  const sortIndex = await getNextSortIndexForFolder(ownerId, parentFolderId);

  const defaultDoenetmlVersion = await prisma.doenetmlVersions.findFirstOrThrow(
    {
      where: { default: true },
    },
  );

  let isPublic = false;
  let licenseCode = undefined;
  let sharedWith: Uint8Array[] = [];

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
  loggedInUserId: Uint8Array,
  parentFolderId: Uint8Array | null,
  inLibrary: boolean = false,
) {
  let ownerId = loggedInUserId;
  if (inLibrary) {
    await mustBeAdmin(loggedInUserId);
    ownerId = await getLibraryAccountId();
  }

  const sortIndex = await getNextSortIndexForFolder(ownerId, parentFolderId);

  let isPublic = false;
  let licenseCode = undefined;
  let sharedWith: Uint8Array[] = [];

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

export async function deleteActivity(id: Uint8Array, ownerId: Uint8Array) {
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
      ON content.parentFolderId = ft.id
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
  ownerId: loggedInUserId,
}: {
  id: Uint8Array;
  name?: string;
  imagePath?: string;
  ownerId: Uint8Array;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);

  const updated = await prisma.content.update({
    where: { id, ...filterEditableContent(loggedInUserId, isAdmin) },
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

export async function getAvailableContentFeatures() {
  return await prisma.contentFeatures.findMany({
    orderBy: { sortIndex: "asc" },
  });
}

export async function updateDoc({
  id,
  source,
  name,
  doenetmlVersionId,
  ownerId: loggedInUserId,
}: {
  id: Uint8Array;
  source?: string;
  name?: string;
  doenetmlVersionId?: number;
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

export async function getActivityName(id: Uint8Array) {
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
export async function getDoc(id: Uint8Array) {
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
  ownerId: loggedInUserId,
  inLibrary = false, // Not exposed to API call
}: {
  id: Uint8Array;
  desiredParentFolderId: Uint8Array | null;
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
  let desiredFolderShares: Uint8Array[] = [];

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

      if (isEqualUUID(desiredParentFolderId, content.id)) {
        throw Error("Cannot move folder into itself");
      }

      const subfolders = await prisma.$queryRaw<
        {
          id: Uint8Array;
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

      if (
        subfolders.findIndex((sf) =>
          isEqualUUID(sf.id, desiredParentFolderId),
        ) !== -1
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
  origActivityId: Uint8Array,
  userId: Uint8Array,
  folderId: Uint8Array | null,
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
      contentFeatures: {
        connect: origActivity.contentFeatures.map((cf) => ({ id: cf.id })),
      },
      licenseCode: origActivity.licenseCode,
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
      },
    });
  }

  return docVersion;
}

function filterViewableActivity(loggedInUserId: Uint8Array, isAdmin: boolean) {
  // For an activity to be viewable, one of these conditions must be true:
  // 1. You are the owner
  // 2. The activity is public
  // 3. The activity is shared with you
  // 4. You are an admin and the activity is in the library
  const visibilityOptions: any[] = [
    { ownerId: loggedInUserId },
    { isPublic: true },
    { sharedWith: { some: { userId: loggedInUserId } } },
  ];
  if (isAdmin) {
    visibilityOptions.push({ owner: { isLibrary: true } });
  }
  return {
    isDeleted: false,
    isFolder: false,
    OR: visibilityOptions,
  };
}

function filterEditableActivity(loggedInUserId: Uint8Array, isAdmin: boolean) {
  return {
    ...filterEditableContent(loggedInUserId, isAdmin),
    isFolder: false,
  };
}

function filterEditableContent(loggedInUserId: Uint8Array, isAdmin: boolean) {
  // For content to be editable, one of these conditions must be true:
  // 1. You are the owner
  // 2. You are an admin and the activity is in the library
  const editabilityOptions: any = [{ ownerId: loggedInUserId }];
  if (isAdmin) {
    editabilityOptions.push({ owner: { isLibrary: true } });
  }
  return {
    isDeleted: false,
    OR: editabilityOptions,
  };
}

async function checkActivityPermissions(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  const isAdmin = await getIsAdmin(loggedInUserId);

  const viewable = await prisma.content.findUnique({
    where: {
      id: activityId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
    },
    select: {
      // We will use these fields to determine if it is editable
      owner: {
        select: {
          userId: true,
          isLibrary: true,
        },
      },
    },
  });

  if (!viewable) {
    return { editable: false, viewable: false, ownerId: null };
  }

  // For an activity to be editable, either
  // 1. You are the owner
  // 2. You are an admin and the activity is in the library
  if (
    isEqualUUID(viewable.owner.userId, loggedInUserId) ||
    (viewable.owner.isLibrary && isAdmin)
  ) {
    return { editable: true, viewable: true, ownerId: viewable.owner.userId };
  } else {
    return { editable: false, viewable: true, ownerId: viewable.owner.userId };
  }
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
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  // TODO: add pagination or a hard limit i n the number of documents one can add to an activity

  const activityPermissions = await checkActivityPermissions(
    activityId,
    loggedInUserId,
  );
  if (activityPermissions.viewable === false) {
    throw new InvalidRequestError(
      "This activity does not exist or is not visible.",
    );
  }

  let activity: ContentStructure = createContentStructure({
    activityId,
    ownerId: activityPermissions.ownerId!,
  });

  if (activityPermissions.editable === false) {
    return { editableByMe: false, activity };
  }

  const contentSelect = returnContentStructureSharedDetailsSelect({
    includeAssignInfo: true,
  });

  const { isAssigned } = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
    },
    select: {
      isAssigned: true,
    },
  });

  if (isAssigned) {
    // modify `contentSelect` to include assigned doenetMl and to count assignment scores
    const documents = {
      ...contentSelect.documents,
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
    };
    const contentSelectWithAssignedVersion = {
      ...contentSelect,
      documents,
      _count: { select: { assignmentScores: true } },
    };

    const assignedActivity = await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        isDeleted: false,
        isFolder: false,
      },
      select: contentSelectWithAssignedVersion,
    });

    activity = processContentSharedDetailsAssignedDoc(assignedActivity);
  } else {
    const unassignedActivity = await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        isDeleted: false,
        isFolder: false,
      },
      select: contentSelect,
    });

    activity = processContentSharedDetails(unassignedActivity);
  }

  const availableFeatures = await getAvailableContentFeatures();

  return { editableByMe: true, activity, availableFeatures };
}

/**
 * Get the data needed to view the source of public activity `activityId`
 *
 * We return current source from the documents table
 *
 * @param activityId
 */
export async function getSharedEditorData(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  // TODO: add pagination or a hard limit in the number of documents one can add to an activity

  const preliminaryActivity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      ...filterViewableActivity(loggedInUserId, false),
    },
    select: returnContentStructureFullOwnerSelect(),
  });

  const activity = processContent(preliminaryActivity, loggedInUserId);

  return activity;
}

// TODO: generalize this to multi-document activities
export async function getActivityViewerData(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  const preliminaryActivity = await prisma.content.findUnique({
    where: {
      id: activityId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
    },
    select: returnContentStructureFullOwnerSelect(),
  });

  if (!preliminaryActivity) {
    throw new InvalidRequestError(
      "This activity does not exist or is not visible.",
    );
  }

  const activity = processContent(preliminaryActivity, loggedInUserId);

  const docHistories = await getDocumentContributorHistories({
    docIds: activity.documents.map((doc) => doc.id),
    loggedInUserId,
    isAdmin,
  });

  if (!isEqualUUID(loggedInUserId, activity.ownerId)) {
    await recordActivityView(activityId, loggedInUserId);
  }

  return {
    activity,
    docHistories,
  };
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

export async function recordActivityView(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  try {
    await prisma.contentViews.create({
      data: { activityId, userId: loggedInUserId },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // if error was due to unique constraint failure,
        // then it was presumably due to a user viewing an activity
        // twice in one day, so we ignore the error
        return;
      }
    }
    throw e;
  }
}

export async function getActivityContributorHistory({
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

  const docHistories = await getDocumentContributorHistories({
    docIds: activity.documents.map((doc) => doc.id),
    loggedInUserId,
    isAdmin,
  });

  return { docHistories };
}

export async function getDocumentContributorHistories({
  docIds,
  loggedInUserId,
  isAdmin = false,
}: {
  docIds: Uint8Array[];
  loggedInUserId: Uint8Array;
  isAdmin?: boolean;
}) {
  const docHistories: DocHistory[] = await prisma.documents.findMany({
    where: {
      id: { in: docIds },
      isDeleted: false,
      activity: {
        ...filterViewableActivity(loggedInUserId, isAdmin),
      },
    },
    select: {
      id: true,
      contributorHistory: {
        where: {
          prevDoc: {
            document: {
              activity: {
                ...filterViewableActivity(loggedInUserId, isAdmin),
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

export async function getAssignmentDataFromCode(
  code: string,
  loggedInUserId: Uint8Array,
) {
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
        ownerId: true,
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

  if (!isEqualUUID(loggedInUserId, assignment.ownerId)) {
    await recordActivityView(assignment.id, loggedInUserId);
  }

  return { assignmentFound: true, assignment };
}

export async function searchSharedContent({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
  page = 1,
}: {
  query: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
  page?: number;
}) {
  const pageSize = 100;

  // remove operators that break MySQL BOOLEAN search
  // and add * at the end of every word so that match beginning of words
  const query_as_prefixes = query
    .replace(/[+\-><()~*"@]+/g, " ")
    .split(" ")
    .filter((s) => s)
    .map((s) => s + "*")
    .join(" ");

  const matchClassification = !isUnclassified && classificationId === undefined;
  const matchSubCategory = matchClassification && subCategoryId === undefined;
  const matchCategory = matchSubCategory && categoryId === undefined;

  const includeClassification = true;
  const includeSubCategory = matchSubCategory;
  const includeCategory = matchCategory;

  const matches = await prisma.$queryRaw<
    {
      id: Uint8Array;
      relevance: number;
    }[]
  >(Prisma.sql`
  SELECT
    content.id,
    AVG((MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*5)
    +(MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*5)
    ${ownerId === undefined ? Prisma.sql`+ MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
    ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, prependOperator: true, operator: "+" })}
    ) as relevance
  FROM
    content
  LEFT JOIN
    (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
  LEFT JOIN
    users ON content.ownerId = users.userId
  ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND
    (
      MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, prependOperator: true, operator: "OR" })}
    )
    ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    content.id
  ORDER BY
    relevance DESC
  LIMIT ${pageSize}
  OFFSET ${(page - 1) * pageSize}
  `);

  // TODO: combine queries

  const preliminarySharedContent = await prisma.content.findMany({
    where: {
      id: { in: matches.map((m) => m.id) },
    },
    select: returnContentStructureFullOwnerSelect(),
  });

  // TODO: better way to sort! (For free if combine queries)
  const relevance = Object.fromEntries(
    matches.map((m) => [fromUUID(m.id), m.relevance]),
  );

  const sharedContent = preliminarySharedContent
    .sort((a, b) => relevance[fromUUID(b.id)] - relevance[fromUUID(a.id)])
    .map((content) => processContent(content, loggedInUserId));

  return sharedContent;
}

// TODO: add tests of this api if we're sure we want to keep it
export async function browseSharedContent({
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
  page = 1,
}: {
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
  page?: number;
}) {
  const pageSize = 100;

  const classificationsFilter = isUnclassified
    ? {
        none: {},
      }
    : classificationId !== undefined
      ? { some: { classification: { id: classificationId } } }
      : subCategoryId !== undefined ||
          categoryId !== undefined ||
          systemId !== undefined
        ? {
            some: {
              classification: {
                descriptions: {
                  some: {
                    subCategoryId,
                    subCategory: {
                      categoryId,
                      category: { systemId },
                    },
                  },
                },
              },
            },
          }
        : undefined;

  const featuresToRequire = features === undefined ? [] : [...features.keys()];

  const preliminarySharedContent = await prisma.content.findMany({
    where: {
      isDeleted: false,
      OR: [
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
      AND: featuresToRequire.map((feature) => ({
        contentFeatures: { some: { code: feature } },
      })),
      ownerId,
      classifications: classificationsFilter,
    },
    select: returnContentStructureFullOwnerSelect(),
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  const sharedContent = preliminarySharedContent.map((content) =>
    processContent(content, loggedInUserId),
  );

  return sharedContent;
}

// TODO: add tests of this api if we're sure we want to keep it
export async function browseTrendingContent({
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
  page = 1,
  pageSize = 100,
}: {
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
  page?: number;
  pageSize?: number;
}) {
  const matchClassification = !isUnclassified && classificationId === undefined;
  const matchSubCategory = matchClassification && subCategoryId === undefined;
  const matchCategory = matchSubCategory && categoryId === undefined;

  const includeClassification = true;
  const includeSubCategory = matchSubCategory;
  const includeCategory = matchCategory;

  const matches = await prisma.$queryRaw<
    {
      id: Uint8Array;
      numViews: bigint;
    }[]
  >(Prisma.sql`
  SELECT
    content.id,
    COUNT(distinct contentViews.userId) AS numViews,
    content.createdAt
  FROM
    content
  LEFT JOIN
    (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
  LEFT JOIN
    users ON content.ownerId = users.userId
  ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  LEFT JOIN
    contentViews ON contentViews.activityId = content.id
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    content.id
  ORDER BY
    numViews DESC, content.createdAt DESC
  LIMIT ${pageSize}
  OFFSET ${(page - 1) * pageSize}
  `);

  // TODO: combine queries

  const preliminarySharedContent = await prisma.content.findMany({
    where: {
      id: { in: matches.map((m) => m.id) },
    },
    select: returnContentStructureFullOwnerSelect(),
    orderBy: { createdAt: "desc" },
  });

  // TODO: better way to sort! (For free if combine queries)
  const numViews = Object.fromEntries(
    matches.map((m) => [fromUUID(m.id), Number(m.numViews)]),
  );

  // relying on the fact that .sort() is stable so that numView ties
  // will still be sorted in descending createdAt order
  const sharedContent = preliminarySharedContent
    .sort((a, b) => numViews[fromUUID(b.id)] - numViews[fromUUID(a.id)])
    .map((content) => processContent(content, loggedInUserId));

  return sharedContent;
}

export async function searchUsersWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  page = 1,
}: {
  query: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  page?: number;
}) {
  const pageSize = 100;

  // remove operators that break MySQL BOOLEAN search
  // and add * at the end of every word so that match beginning of words
  const query_as_prefixes = query
    .replace(/[+\-><()~*"@]+/g, " ")
    .split(" ")
    .filter((s) => s)
    .map((s) => s + "*")
    .join(" ");

  const includeClassification =
    classificationId !== undefined ||
    isUnclassified ||
    subCategoryId !== undefined;
  const includeSubCategory = !includeClassification && categoryId !== undefined;
  const includeCategory = !includeSubCategory && systemId !== undefined;

  const usersWithShared = await prisma.$queryRaw<
    {
      userId: Uint8Array;
      firstNames: string | null;
      lastNames: string;
      relevance: number;
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
      SELECT ownerId 
        FROM content 
        ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
        ${returnFeatureJoins(features)}
        WHERE
          isDeleted = FALSE AND (
            isPublic = TRUE
            OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
          )
          ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
          ${returnFeatureWhereClauses(features)}
      
    )
    AND
    MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
  ORDER BY
    relevance DESC
  LIMIT ${pageSize}
  OFFSET ${(page - 1) * pageSize}
  `);

  const usersWithShared2: UserInfo[] = usersWithShared.map((u) => ({
    userId: u.userId,
    firstNames: u.firstNames,
    lastNames: u.lastNames,
    email: "",
  }));
  return usersWithShared2;
}

export async function browseUsersWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  take = 100,
  skip = 0,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  take?: number;
  skip?: number;
}) {
  let usersWithShared;

  if (query) {
    // remove operators that break MySQL BOOLEAN search
    // and add * at the end of every word so that match beginning of words
    const query_as_prefixes = query
      .replace(/[+\-><()~*"@]+/g, " ")
      .split(" ")
      .filter((s) => s)
      .map((s) => s + "*")
      .join(" ");

    const matchClassification =
      !isUnclassified && classificationId === undefined;
    const matchSubCategory = matchClassification && subCategoryId === undefined;
    const matchCategory = matchSubCategory && categoryId === undefined;

    const includeClassification = true;
    const includeSubCategory = matchSubCategory;
    const includeCategory = matchCategory;

    usersWithShared = await prisma.$queryRaw<
      {
        userId: Uint8Array;
        firstNames: string | null;
        lastNames: string;
        numContent: bigint;
      }[]
    >(Prisma.sql`
      SELECT
        users.userId, users.firstNames, users.lastNames, COUNT(content.id) AS numContent
      FROM
        users
      INNER JOIN
        content on content.ownerId = users.userId
      WHERE
        users.isAnonymous = FALSE
        AND content.id IN (
          SELECT content.id
          FROM content
          LEFT JOIN
            (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
          ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
          ${returnFeatureJoins(features)}
          WHERE
            content.isDeleted = FALSE
            AND (
              content.isPublic = TRUE
              OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
            )
            AND (
              MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
              OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
              ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, prependOperator: true, operator: "OR" })}
            )
            ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
            ${returnFeatureWhereClauses(features)}
        )
      GROUP BY
        users.userId
      ORDER BY
        numContent DESC
      LIMIT ${take}
      OFFSET ${skip}
  `);
  } else {
    const includeClassification =
      classificationId !== undefined ||
      isUnclassified ||
      subCategoryId !== undefined;
    const includeSubCategory =
      !includeClassification && categoryId !== undefined;
    const includeCategory = !includeSubCategory && systemId !== undefined;

    usersWithShared = await prisma.$queryRaw<
      {
        userId: Uint8Array;
        firstNames: string | null;
        lastNames: string;
        numContent: bigint;
      }[]
    >(Prisma.sql`
      SELECT
        users.userId, users.firstNames, users.lastNames, COUNT(content.id) AS numContent
      FROM
        users
      INNER JOIN
        content on content.ownerId = users.userId
      WHERE
        users.isAnonymous = FALSE
        AND content.id IN (
          SELECT content.id
          FROM content
          ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
          ${returnFeatureJoins(features)}
          WHERE
            content.isFolder = FALSE
            AND content.isDeleted = FALSE
            AND (
              content.isPublic = TRUE
              OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
            )
            ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
            ${returnFeatureWhereClauses(features)}
        )
      GROUP BY
        users.userId
      ORDER BY
        numContent DESC
      LIMIT ${take}
      OFFSET ${skip}
  `);
  }

  const usersWithShared2: UserInfo[] = usersWithShared.map((u) => {
    const { numContent, ...u2 } = u;
    return {
      ...u2,
      email: "",
      numCommunity: Number(numContent),
    };
  });
  return usersWithShared2;
}

export async function searchClassificationsWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  features,
  ownerId,
}: {
  query: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  // remove operators that break MySQL BOOLEAN search
  // and add * at the end of every word so that match beginning of words
  const query_as_prefixes = query
    .replace(/[+\-><()~*"@]+/g, " ")
    .split(" ")
    .filter((s) => s)
    .map((s) => s + "*")
    .join(" ");

  const queryRegEx = query
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "|");

  const matches = await prisma.$queryRaw<
    {
      classificationId: number;
      code: string;
      descriptionId: number;
      description: string;
      subCategoryId: number;
      subCategory: string;
      categoryId: number;
      category: string;
      systemId: number;
      systemName: string;
      systemShortName: string;
      categoryLabel: string;
      subCategoryLabel: string;
      descriptionLabel: string;
      categoriesInDescription: boolean;
      codeMatch: bigint;
      relevance: number;
    }[]
  >(Prisma.sql`
  SELECT
    classifications.id as classificationId,
    classifications.code,
    classificationDescriptions.id AS descriptionId,
    classificationDescriptions.description,
    classificationSubCategories.id subCategoryId,
    classificationSubCategories.subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    REGEXP_LIKE(classifications.code, ${queryRegEx}) AS codeMatch,
    AVG(
    ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, operator: "+" })}
    ) as relevance
  FROM
    content
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND
    (
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, operator: "OR" })}
      OR classifications.code REGEXP ${queryRegEx}
    )
    ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationId, descriptionId
  ORDER BY
    codeMatch DESC, relevance DESC
  LIMIT 100
  `);

  return matches.map((m) => ({
    classification: {
      id: m.classificationId,
      code: m.code,
      descriptionId: m.descriptionId,
      description: m.description,
    },
    subCategory: {
      id: m.subCategoryId,
      subCategory: m.subCategory,
    },
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
  }));
}

export async function searchClassificationSubCategoriesWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  features,
  ownerId,
}: {
  query: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
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
      subCategoryId: number;
      subCategory: string;
      categoryId: number;
      category: string;
      systemId: number;
      systemName: string;
      systemShortName: string;
      categoryLabel: string;
      subCategoryLabel: string;
      descriptionLabel: string;
      categoriesInDescription: boolean;
      relevance: number;
    }[]
  >(Prisma.sql`
  SELECT
    classificationSubCategories.id subCategoryId,
    classificationSubCategories.subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    ${returnClassificationMatchClauses({ query_as_prefixes, matchSubCategory: true })} as relevance
  FROM
    content
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND
    ${returnClassificationMatchClauses({ query_as_prefixes, matchSubCategory: true })}
    ${returnClassificationFilterWhereClauses({ systemId, categoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}

  GROUP BY
    classificationSubCategories.id
  ORDER BY
    relevance DESC
  LIMIT 100
  `);

  return matches.map((m) => ({
    subCategory: {
      id: m.subCategoryId,
      subCategory: m.subCategory,
    },
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
  }));
}

export async function searchClassificationCategoriesWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  features,
  ownerId,
}: {
  query: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
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
      categoryId: number;
      category: string;
      systemId: number;
      systemName: string;
      systemShortName: string;
      categoryLabel: string;
      subCategoryLabel: string;
      descriptionLabel: string;
      categoriesInDescription: boolean;
      relevance: number;
    }[]
  >(Prisma.sql`
  SELECT
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationCategories.sortIndex,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    ${returnClassificationMatchClauses({ query_as_prefixes, matchCategory: true })} as relevance
  FROM
    content
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND
    ${returnClassificationMatchClauses({ query_as_prefixes, matchCategory: true })}
    ${returnClassificationFilterWhereClauses({ systemId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}

  GROUP BY
    classificationCategories.id
  ORDER BY
    relevance DESC, classificationCategories.sortIndex
  LIMIT 100
  `);

  return matches.map((m) => ({
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
  }));
}

export async function browseClassificationSharedContent({
  loggedInUserId,
  classificationId,
  features,
  ownerId,
  page = 1,
}: {
  loggedInUserId: Uint8Array;
  classificationId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
  page?: number;
}) {
  const pageSize = 100;

  const featuresToRequire = features === undefined ? [] : [...features.keys()];

  // TODO: how do we sort these?
  const results = await prisma.content.findMany({
    where: {
      isDeleted: false,
      OR: [
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
      AND: featuresToRequire.map((feature) => ({
        contentFeatures: { some: { code: feature } },
      })),
      classifications: { some: { classificationId } },
      ownerId,
    },
    select: returnContentStructureFullOwnerSelect(),
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  const content = results.map((c) => processContent(c));

  return { content };
}

export async function browseClassificationSubCategorySharedContent({
  loggedInUserId,
  subCategoryId,
  features,
  ownerId,
}: {
  loggedInUserId: Uint8Array;
  subCategoryId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}) {
  // TODO: how do we sort the content within each classification

  const featuresToRequire = features === undefined ? [] : [...features.keys()];

  const preliminaryResults =
    await prisma.classificationSubCategories.findUniqueOrThrow({
      where: { id: subCategoryId },
      select: {
        subCategory: true,
        category: {
          select: {
            category: true,
            system: {
              select: {
                name: true,
                shortName: true,
                categoryLabel: true,
                subCategoryLabel: true,
                descriptionLabel: true,
                categoriesInDescription: true,
              },
            },
          },
        },
        descriptions: {
          where: {
            classification: {
              contentClassifications: {
                some: {
                  content: {
                    isDeleted: false,
                    OR: [
                      { isPublic: true },
                      { sharedWith: { some: { userId: loggedInUserId } } },
                    ],
                    AND: featuresToRequire.map((feature) => ({
                      contentFeatures: { some: { code: feature } },
                    })),
                    ownerId,
                  },
                },
              },
            },
          },
          orderBy: { sortIndex: "asc" },
          select: {
            description: true,
            id: true,
            classification: {
              select: {
                code: true,
                id: true,
                contentClassifications: {
                  where: {
                    content: {
                      isDeleted: false,
                      OR: [
                        { isPublic: true },
                        { sharedWith: { some: { userId: loggedInUserId } } },
                      ],
                      AND: featuresToRequire.map((feature) => ({
                        contentFeatures: { some: { code: feature } },
                      })),
                      ownerId,
                    },
                  },
                  select: {
                    content: {
                      select: returnContentStructureFullOwnerSelect(),
                    },
                  },
                  take: 100,
                },
              },
            },
          },
        },
      },
    });

  const results = {
    subCategory: preliminaryResults.subCategory,
    category: preliminaryResults.category,
    classifications: preliminaryResults.descriptions.map((description) => ({
      code: description.classification.code,
      classificationId: description.classification.id,
      description: description.description,
      descriptionId: description.id,
      content: description.classification.contentClassifications.map((cc) =>
        processContent(cc.content),
      ),
    })),
  };

  return results;
}

export async function browseClassificationCategorySharedContent({
  loggedInUserId,
  categoryId,
  features,
  ownerId,
}: {
  loggedInUserId: Uint8Array;
  categoryId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}) {
  const featuresToRequire = features === undefined ? [] : [...features.keys()];

  // TODO: how do we sort the content within each classification

  const preliminaryResults =
    await prisma.classificationCategories.findUniqueOrThrow({
      where: { id: categoryId },
      select: {
        category: true,
        subCategories: {
          where: {
            descriptions: {
              some: {
                classification: {
                  contentClassifications: {
                    some: {
                      content: {
                        isDeleted: false,
                        OR: [
                          { isPublic: true },
                          { sharedWith: { some: { userId: loggedInUserId } } },
                        ],
                        AND: featuresToRequire.map((feature) => ({
                          contentFeatures: { some: { code: feature } },
                        })),
                        ownerId,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { sortIndex: "asc" },
          select: {
            subCategory: true,
            id: true,
            category: {
              select: {
                category: true,
                system: {
                  select: {
                    name: true,
                    shortName: true,
                    categoryLabel: true,
                    subCategoryLabel: true,
                    descriptionLabel: true,
                    categoriesInDescription: true,
                  },
                },
              },
            },
            descriptions: {
              where: {
                classification: {
                  contentClassifications: {
                    some: {
                      content: {
                        isDeleted: false,
                        OR: [
                          { isPublic: true },
                          { sharedWith: { some: { userId: loggedInUserId } } },
                        ],
                        AND: featuresToRequire.map((feature) => ({
                          contentFeatures: { some: { code: feature } },
                        })),
                        ownerId,
                      },
                    },
                  },
                },
              },
              orderBy: { sortIndex: "asc" },
              select: {
                description: true,
                id: true,
                classification: {
                  select: {
                    code: true,
                    id: true,
                    contentClassifications: {
                      where: {
                        content: {
                          isDeleted: false,
                          OR: [
                            { isPublic: true },
                            {
                              sharedWith: { some: { userId: loggedInUserId } },
                            },
                          ],
                          AND: featuresToRequire.map((feature) => ({
                            contentFeatures: { some: { code: feature } },
                          })),
                          ownerId,
                        },
                      },
                      select: {
                        content: {
                          select: returnContentStructureFullOwnerSelect(),
                        },
                      },
                      take: 10,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

  const results = {
    category: preliminaryResults.category,
    subCategories: preliminaryResults.subCategories.map((subCategory) => ({
      subCategory: subCategory.subCategory,
      subCategoryId: subCategory.id,
      classifications: subCategory.descriptions.map((description) => ({
        code: description.classification.code,
        classificationId: description.classification.id,
        description: description.description,
        descriptionId: description.id,
        content: description.classification.contentClassifications.map((cc) =>
          processContent(cc.content),
        ),
      })),
    })),
  };

  return results;
}

export async function browseClassificationsWithSharedContent({
  query,
  loggedInUserId,
  subCategoryId,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  subCategoryId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  let matches;

  if (query) {
    // remove operators that break MySQL BOOLEAN search
    // and add * at the end of every word so that match beginning of words
    const query_as_prefixes = query
      .replace(/[+\-><()~*"@]+/g, " ")
      .split(" ")
      .filter((s) => s)
      .map((s) => s + "*")
      .join(" ");

    matches = await prisma.$queryRaw<
      {
        classificationId: number;
        code: string;
        descriptionId: number;
        description: string;
        subCategoryId: number;
        subCategory: string;
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classifications.id AS classificationId,
    classifications.code,
    classificationDescriptions.id AS descriptionId,
    classificationDescriptions.description,
    classificationSubCategories.id subCategoryId,
    classificationSubCategories.subCategory subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent
  FROM
    content
  LEFT JOIN
    (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
  ${ownerId === undefined ? Prisma.sql`LEFT JOIN users ON content.ownerId = users.userId` : Prisma.empty}
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND (
      MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
    )
    ${returnClassificationFilterWhereClauses({ subCategoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classifications.id, classificationDescriptions.id
  ORDER BY
    classificationDescriptions.sortIndex
  `);
  } else {
    matches = await prisma.$queryRaw<
      {
        classificationId: number;
        code: string;
        descriptionId: number;
        description: string;
        subCategoryId: number;
        subCategory: string;
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classifications.id AS classificationId,
    classifications.code,
    classificationDescriptions.id AS descriptionId,
    classificationDescriptions.description,
    classificationSubCategories.id subCategoryId,
    classificationSubCategories.subCategory subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent
  FROM
    content
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    ${returnClassificationFilterWhereClauses({ subCategoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classifications.id, classificationDescriptions.id
  ORDER BY
    classificationDescriptions.sortIndex
  `);
  }

  return matches.map((m) => ({
    classification: {
      id: m.classificationId,
      code: m.code,
      descriptionId: m.descriptionId,
      description: m.description,
    },
    subCategory: {
      id: m.subCategoryId,
      subCategory: m.subCategory,
    },
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
    numCommunity: Number(m.numContent),
  }));
}

export async function browseClassificationSubCategoriesWithSharedContent({
  query,
  loggedInUserId,
  categoryId,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  categoryId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  let matches;

  if (query) {
    // remove operators that break MySQL BOOLEAN search
    // and add * at the end of every word so that match beginning of words
    const query_as_prefixes = query
      .replace(/[+\-><()~*"@]+/g, " ")
      .split(" ")
      .filter((s) => s)
      .map((s) => s + "*")
      .join(" ");

    matches = await prisma.$queryRaw<
      {
        subCategoryId: number;
        subCategory: string;
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationSubCategories.id AS subCategoryId,
    classificationSubCategories.subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent
  FROM
    content
  LEFT JOIN
    (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
  ${ownerId === undefined ? Prisma.sql`LEFT JOIN users ON content.ownerId = users.userId` : Prisma.empty}
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND (
      MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, prependOperator: true, operator: "OR" })}
      ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
    )
    ${returnClassificationFilterWhereClauses({ categoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationSubCategories.id
  ORDER BY
    classificationSubCategories.sortIndex
  `);
  } else {
    matches = await prisma.$queryRaw<
      {
        subCategoryId: number;
        subCategory: string;
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationSubCategories.id AS subCategoryId,
    classificationSubCategories.subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent
  FROM
    content
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    ${returnClassificationFilterWhereClauses({ categoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationSubCategories.id
  ORDER BY
    classificationSubCategories.sortIndex
  `);
  }

  return matches.map((m) => ({
    subCategory: {
      id: m.subCategoryId,
      subCategory: m.subCategory,
    },
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
    numCommunity: Number(m.numContent),
  }));
}

export async function browseClassificationCategoriesWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  systemId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  let matches;

  if (query) {
    // remove operators that break MySQL BOOLEAN search
    // and add * at the end of every word so that match beginning of words
    const query_as_prefixes = query
      .replace(/[+\-><()~*"@]+/g, " ")
      .split(" ")
      .filter((s) => s)
      .map((s) => s + "*")
      .join(" ");

    matches = await prisma.$queryRaw<
      {
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationCategories.id AS categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent
  FROM
    content
  LEFT JOIN
    (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
  ${ownerId === undefined ? Prisma.sql`LEFT JOIN users ON content.ownerId = users.userId` : Prisma.empty}
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND (
      MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, matchSubCategory: true, prependOperator: true, operator: "OR" })}
      ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
    )
    ${returnClassificationFilterWhereClauses({ systemId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationCategories.id
  ORDER BY
    classificationCategories.sortIndex
  `);
  } else {
    matches = await prisma.$queryRaw<
      {
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationCategories.id AS categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent
  FROM
    content
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    ${returnClassificationFilterWhereClauses({ systemId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationCategories.id
  ORDER BY
    classificationCategories.sortIndex
  `);
  }

  return matches.map((m) => ({
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
    numCommunity: Number(m.numContent),
  }));
}

export async function browseClassificationSystemsWithSharedContent({
  query,
  loggedInUserId,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  let matches;

  if (query) {
    // remove operators that break MySQL BOOLEAN search
    // and add * at the end of every word so that match beginning of words
    const query_as_prefixes = query
      .replace(/[+\-><()~*"@]+/g, " ")
      .split(" ")
      .filter((s) => s)
      .map((s) => s + "*")
      .join(" ");

    matches = await prisma.$queryRaw<
      {
        systemId: number | null;
        systemName: string | null;
        systemShortName: string | null;
        systemType: string | null;
        categoryLabel: string | null;
        subCategoryLabel: string | null;
        descriptionLabel: string | null;
        categoriesInDescription: boolean | null;
        numContent: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationSystems.id AS systemId,
    classificationSystems.name as systemName,
    classificationSystems.shortName as systemShortName,
    classificationSystems.type as systemType,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent
  FROM
    content
  LEFT JOIN
    (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
  ${ownerId === undefined ? Prisma.sql`LEFT JOIN users ON content.ownerId = users.userId` : Prisma.empty}
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND (
      MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, matchSubCategory: true, matchCategory: true, prependOperator: true, operator: "OR" })}
      ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
    )
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationSystems.id
  ORDER BY
    classificationSystems.sortIndex
  `);
  } else {
    matches = await prisma.$queryRaw<
      {
        systemId: number | null;
        systemName: string | null;
        systemShortName: string | null;
        systemType: string | null;
        categoryLabel: string | null;
        subCategoryLabel: string | null;
        descriptionLabel: string | null;
        categoriesInDescription: boolean | null;
        numContent: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationSystems.id AS systemId,
    classificationSystems.name as systemName,
    classificationSystems.shortName as systemShortName,
    classificationSystems.type as systemType,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent
  FROM
    content
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationSystems.id
  ORDER BY
    classificationSystems.sortIndex
  `);
  }

  return matches.map((m) => {
    if (m.systemId === null) {
      return { numCommunity: Number(m.numContent) };
    }
    const partialClass: PartialContentClassification = {
      system: {
        id: m.systemId,
        name: m.systemName!,
        shortName: m.systemShortName!,
        descriptionLabel: m.descriptionLabel!,
        subCategoryLabel: m.subCategoryLabel!,
        categoryLabel: m.categoryLabel!,
        categoriesInDescription: m.categoriesInDescription!,
      },
      numCommunity: Number(m.numContent),
    };

    return partialClass;
  });
}

// TODO: add test
export async function getSharedContentMatchCount({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<{ numCommunity: number }> {
  let matches;

  if (query) {
    // remove operators that break MySQL BOOLEAN search
    // and add * at the end of every word so that match beginning of words
    const query_as_prefixes = query
      .replace(/[+\-><()~*"@]+/g, " ")
      .split(" ")
      .filter((s) => s)
      .map((s) => s + "*")
      .join(" ");

    const matchClassification =
      !isUnclassified && classificationId === undefined;
    const matchSubCategory = matchClassification && subCategoryId === undefined;
    const matchCategory = matchSubCategory && categoryId === undefined;

    const includeClassification = true;
    const includeSubCategory = matchSubCategory;
    const includeCategory = matchCategory;

    matches = await prisma.$queryRaw<
      {
        numContent: bigint;
      }[]
    >(Prisma.sql`
      SELECT
        COUNT(distinct content.id) as numContent
      FROM
        content
      LEFT JOIN
        (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
      LEFT JOIN
        users ON content.ownerId = users.userId
      ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
      ${returnFeatureJoins(features)}
      WHERE
        content.isDeleted = FALSE
        AND (
           content.isPublic = TRUE
           OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
        )
        AND
        (
          MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
          OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
          ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
          ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, prependOperator: true, operator: "OR" })}
        )
        ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
        ${returnFeatureWhereClauses(features)}
        ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
      `);
  } else {
    const includeClassification =
      isUnclassified ||
      classificationId !== undefined ||
      subCategoryId !== undefined;
    const includeSubCategory =
      !includeClassification && categoryId !== undefined;
    const includeCategory = !includeSubCategory && systemId !== undefined;

    matches = await prisma.$queryRaw<
      {
        numContent: bigint;
      }[]
    >(Prisma.sql`
      SELECT
        COUNT(distinct content.id) as numContent
      FROM
        content
      LEFT JOIN
        (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
      LEFT JOIN
        users ON content.ownerId = users.userId
      ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
      ${returnFeatureJoins(features)}
      WHERE
        content.isDeleted = FALSE
        AND (
           content.isPublic = TRUE
           OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
        )
        ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
        ${returnFeatureWhereClauses(features)}
        ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
      `);
  }

  if (matches.length === 0) {
    return { numCommunity: 0 };
  } else {
    return { numCommunity: Number(matches[0].numContent) };
  }
}

// TODO: add test
export async function getSharedContentMatchCountPerAvailableFeature({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<Record<string, { numCommunity?: number; numLibrary?: number }>> {
  const matchesPerFeature: Record<
    string,
    { numCommunity?: number; numLibrary?: number }
  > = {};

  const availableFeatures = await getAvailableContentFeatures();

  if (query) {
    // remove operators that break MySQL BOOLEAN search
    // and add * at the end of every word so that match beginning of words
    const query_as_prefixes = query
      .replace(/[+\-><()~*"@]+/g, " ")
      .split(" ")
      .filter((s) => s)
      .map((s) => s + "*")
      .join(" ");

    const matchClassification =
      !isUnclassified && classificationId === undefined;
    const matchSubCategory = matchClassification && subCategoryId === undefined;
    const matchCategory = matchSubCategory && categoryId === undefined;

    const includeClassification = true;
    const includeSubCategory = matchSubCategory;
    const includeCategory = matchCategory;

    for (const feature of availableFeatures) {
      const newFeatures = new Set(features);
      newFeatures.add(feature.code);

      const matches = await prisma.$queryRaw<
        {
          numContent: bigint;
        }[]
      >(Prisma.sql`
      SELECT
        COUNT(distinct content.id) as numContent
      FROM
        content
      LEFT JOIN
        (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
      LEFT JOIN
        users ON content.ownerId = users.userId
      ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
      ${returnFeatureJoins(newFeatures)}
      WHERE
        content.isDeleted = FALSE
        AND (
           content.isPublic = TRUE
           OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
        )
        AND
        (
          MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
          OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
          ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
          ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, prependOperator: true, operator: "OR" })}
        )
        ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
        ${returnFeatureWhereClauses(newFeatures)}
        ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
      `);

      if (matches.length > 0) {
        matchesPerFeature[feature.code] = {
          numCommunity: Number(matches[0].numContent),
        };
      }
    }
  } else {
    const includeClassification =
      isUnclassified ||
      classificationId !== undefined ||
      subCategoryId !== undefined;
    const includeSubCategory =
      !includeClassification && categoryId !== undefined;
    const includeCategory = !includeSubCategory && systemId !== undefined;

    for (const feature of availableFeatures) {
      const newFeatures = new Set(features);
      newFeatures.add(feature.code);

      const matches = await prisma.$queryRaw<
        {
          numContent: bigint;
        }[]
      >(Prisma.sql`
      SELECT
        COUNT(distinct content.id) as numContent
      FROM
        content
      LEFT JOIN
        (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
      LEFT JOIN
        users ON content.ownerId = users.userId
      ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
      ${returnFeatureJoins(newFeatures)}
      WHERE
        content.isDeleted = FALSE
        AND (
           content.isPublic = TRUE
           OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
        )
        ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
        ${returnFeatureWhereClauses(newFeatures)}
        ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
      `);
      if (matches.length > 0) {
        matchesPerFeature[feature.code] = {
          numCommunity: Number(matches[0].numContent),
        };
      }
    }
  }
  return matchesPerFeature;
}

export async function listUserAssigned(userId: Uint8Array) {
  const preliminaryAssignments = await prisma.content.findMany({
    where: {
      isDeleted: false,
      isAssigned: true,
      assignmentScores: { some: { userId } },
    },
    select: returnContentStructureNoClassDocsSelect({
      includeAssignInfo: true,
    }),
    orderBy: { createdAt: "asc" },
  });

  const assignments = preliminaryAssignments.map((obj) =>
    processContentNoClassDocs(obj),
  );

  const user: UserInfo = await prisma.users.findUniqueOrThrow({
    where: { userId },
    select: { userId: true, firstNames: true, lastNames: true, email: true },
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

  const { isLibrary: _isLibrary, ...userNoLibrary } = user;
  return userNoLibrary;
}

export async function getUserInfo(userId: Uint8Array) {
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

export async function getAuthorInfo(userId: Uint8Array): Promise<UserInfo> {
  const user = await prisma.users.findUniqueOrThrow({
    where: { userId },
    select: {
      userId: true,
      firstNames: true,
      lastNames: true,
    },
  });
  return { email: "", ...user };
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
  userId: Uint8Array;
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
  userId: Uint8Array;
  firstNames: string;
  lastNames: string;
}) {
  const user = await prisma.users.update({
    where: { userId },
    data: { firstNames, lastNames },
  });
  const { isLibrary: _isLibrary, ...userNoLibrary } = user;
  return userNoLibrary;
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

export async function getIsAdmin(userId: Uint8Array) {
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
    select: returnContentStructureFullOwnerSelect(),
  });

  const activities2 = activities.map((activity) => processContent(activity));

  return activities2;
}

export async function addPromotedContentGroup(
  groupName: string,
  userId: Uint8Array,
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

  const { id } = await prisma.promotedContentGroups.create({
    data: {
      groupName,
      sortIndex: newIndex,
    },
  });
  return id;
}

export async function updatePromotedContentGroup(
  groupId: number,
  newGroupName: string,
  homepage: boolean,
  currentlyFeatured: boolean,
  userId: Uint8Array,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );

  await prisma.promotedContentGroups.update({
    where: {
      id: groupId,
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
  userId: Uint8Array,
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
      id: groupId,
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
  userId: Uint8Array,
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
        id: { not: groupId },
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
        id: { not: groupId },
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
      id: groupId,
    },
    data: {
      sortIndex: newSortIndex,
    },
  });
}

export async function loadPromotedContent(userId: Uint8Array) {
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
      id: true,
      currentlyFeatured: true,
      homepage: true,

      promotedContent: {
        select: {
          activity: {
            select: returnContentStructureFullOwnerSelect(),
          },
        },
        orderBy: { sortIndex: "asc" },
      },
    },
  });

  const reformattedContent: {
    groupName: string;
    promotedGroupId: number;
    currentlyFeatured: boolean;
    homepage: boolean;
    promotedContent: ContentStructure[];
  }[] = content.map((groupContent) => {
    const reformattedActivities: ContentStructure[] =
      groupContent.promotedContent.map((content) =>
        processContent(content.activity),
      );

    return {
      groupName: groupContent.groupName,
      promotedGroupId: groupContent.id,
      currentlyFeatured: groupContent.currentlyFeatured,
      homepage: groupContent.homepage,
      promotedContent: reformattedActivities,
    };
  });

  return reformattedContent;
}

export async function addPromotedContent(
  groupId: number,
  activityId: Uint8Array,
  userId: Uint8Array,
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
  activityId: Uint8Array,
  userId: Uint8Array,
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
  activityId: Uint8Array,
  userId: Uint8Array,
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

export async function assignActivity(
  activityId: Uint8Array,
  userId: Uint8Array,
) {
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
  const array = new Uint32Array(1);
  getRandomValues(array);
  return array[0].toString().slice(-6);
}

export async function openAssignmentWithCode(
  activityId: Uint8Array,
  closeAt: DateTime,
  loggedInUserId: Uint8Array,
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
  activityId: Uint8Array,
  closeAt: DateTime,
  loggedInUserId: Uint8Array,
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
  activityId: Uint8Array,
  userId: Uint8Array,
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

export async function unassignActivity(
  activityId: Uint8Array,
  userId: Uint8Array,
) {
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
export async function getAssignment(
  activityId: Uint8Array,
  ownerId: Uint8Array,
) {
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
  activityId: Uint8Array;
  docId: Uint8Array;
  docVersionNum: number;
  userId: Uint8Array;
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
  activityId: Uint8Array;
  docId: Uint8Array;
  docVersionNum: number;
  requestedUserId: Uint8Array;
  userId: Uint8Array;
  withMaxScore: boolean;
}) {
  if (!isEqualUUID(requestedUserId, userId)) {
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
  activityId: Uint8Array;
  ownerId: Uint8Array;
}) {
  const assignment: {
    name: string;
    assignmentScores: {
      score: number;
      user: UserInfo;
    }[];
  } = await prisma.content.findUniqueOrThrow({
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
            select: {
              firstNames: true,
              lastNames: true,
              userId: true,
              email: true,
            },
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
  activityId: Uint8Array;
  loggedInUserId: Uint8Array;
  studentId: Uint8Array;
}) {
  const assignmentData = await prisma.assignmentScores.findUniqueOrThrow({
    where: {
      activityId_userId: { activityId, userId: studentId },
      activity: {
        // allow access if logged in user is the student or the owner
        ownerId: isEqualUUID(studentId, loggedInUserId)
          ? undefined
          : loggedInUserId,
        isDeleted: false,
        isFolder: false,
        isAssigned: true,
      },
    },
    select: {
      score: true,
      activity: {
        select: {
          id: true,
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
      user: {
        select: {
          firstNames: true,
          lastNames: true,
          userId: true,
          email: true,
        },
      },
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
  ownerId: Uint8Array;
  parentFolderId: Uint8Array | null;
}) {
  const orderedActivities = await prisma.$queryRaw<
    {
      id: Uint8Array;
      name: string;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, isFolder, path) AS (
      SELECT id, parentFolderId, isFolder, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE ${parentFolderId === null ? Prisma.sql`parentFolderId IS NULL` : Prisma.sql`parentFolderId = ${parentFolderId}`}
      AND ownerId = ${ownerId}
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

  let folder: {
    id: Uint8Array;
    name: string;
  } | null = null;

  if (parentFolderId !== null) {
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
      score: true,
      user: {
        select: {
          firstNames: true,
          lastNames: true,
          userId: true,
          email: true,
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
  userId: Uint8Array;
  ownerId: Uint8Array;
  parentFolderId: Uint8Array | null;
}) {
  const userData = await prisma.users.findUniqueOrThrow({
    where: {
      userId,
    },
    select: {
      userId: true,
      firstNames: true,
      lastNames: true,
      email: true,
    },
  });

  const orderedActivityScores = await prisma.$queryRaw<
    {
      activityId: Uint8Array;
      activityName: string;
      score: number | null;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, isFolder, path) AS (
      SELECT id, parentFolderId, isFolder, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE ${parentFolderId === null ? Prisma.sql`parentFolderId IS NULL` : Prisma.sql`parentFolderId = ${parentFolderId}`}
      AND ownerId = ${ownerId}
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

  let folder: {
    id: Uint8Array;
    name: string;
  } | null = null;

  if (parentFolderId !== null) {
    folder = await prisma.content.findUniqueOrThrow({
      where: { id: parentFolderId, ownerId, isDeleted: false, isFolder: true },
      select: { id: true, name: true },
    });
  }

  return { userData, orderedActivityScores, folder };
}

export async function getAssignedScores(loggedInUserId: Uint8Array) {
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

  const userData: UserInfo = await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: { userId: true, firstNames: true, lastNames: true, email: true },
  });

  return { userData, orderedActivityScores };
}

export async function getAssignmentContent({
  activityId,
  ownerId,
}: {
  activityId: Uint8Array;
  ownerId: Uint8Array;
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
  activityId: Uint8Array;
  docId: Uint8Array;
  docVersionNum: number;
  userId: Uint8Array;
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
  activityId: Uint8Array;
  ownerId: Uint8Array;
}) {
  // Using raw query as it seems prisma does not support distinct in count.
  // https://github.com/prisma/prisma/issues/4228

  let submittedResponses = await prisma.$queryRaw<
    {
      docId: Uint8Array;
      docVersionNum: number;
      answerId: string;
      answerNumber: number | null;
      count: number;
      averageCredit: number;
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
  activityId: Uint8Array;
  docId: Uint8Array;
  docVersionNum: number;
  ownerId: Uint8Array;
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
      userId: Uint8Array;
      firstNames: string | null;
      lastNames: string;
      email: string;
      response: string;
      creditAchieved: number;
      submittedAt: DateTime;
      maxCredit: number;
      numResponses: bigint;
    }[]
  >(Prisma.sql`
select dsr.userId, users.firstNames, users.lastNames, users.email, response, creditAchieved, submittedAt,
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
  let lastUserId = new Uint8Array(16);

  for (const respObj of rawResponses) {
    if (respObj.userId > lastUserId) {
      lastUserId = respObj.userId;
      if (newResponse) {
        submittedResponses.push(newResponse);
      }
      newResponse = {
        user: {
          userId: respObj.userId,
          firstNames: respObj.firstNames,
          lastNames: respObj.lastNames,
          email: respObj.email,
        },
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
  activityId: Uint8Array;
  docId: Uint8Array;
  docVersionNum: number;
  ownerId: Uint8Array;
  answerId: string;
  userId: Uint8Array;
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
      user: {
        select: {
          userId: true,
          firstNames: true,
          lastNames: true,
          email: true,
        },
      },
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
  folderId: Uint8Array | null;
  loggedInUserId: Uint8Array;
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
      select: returnContentStructureSharedDetailsNoClassDocsSelect(),
    });

    folder = processContentSharedDetailsNoClassDocs(preliminaryFolder);
  }

  const preliminaryContent = await prisma.content.findMany({
    where: {
      ownerId: loggedInUserId,
      isDeleted: false,
      parentFolderId: folderId,
    },
    select: {
      ...returnContentStructureSharedDetailsSelect({
        includeAssignInfo: true,
      }),
      _count: { select: { assignmentScores: true } },
    },
    orderBy: { sortIndex: "asc" },
  });

  const content: ContentStructure[] = preliminaryContent.map(
    processContentSharedDetails,
  );

  const availableFeatures = await getAvailableContentFeatures();

  return {
    content,
    folder,
    availableFeatures,
  };
}

export async function searchMyFolderContent({
  folderId,
  loggedInUserId,
  query,
  inLibrary = false, // Not to be exposed in API call
}: {
  folderId: Uint8Array | null;
  loggedInUserId: Uint8Array;
  query: string;
  inLibrary?: boolean;
}) {
  let ownerId = loggedInUserId;
  if (inLibrary) {
    await mustBeAdmin(loggedInUserId);
    ownerId = await getLibraryAccountId();
  }

  let folder: ContentStructure | null = null;

  if (folderId !== null) {
    // if ask for a folder, make sure it exists and is owned by logged in user
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        id: folderId,
        isDeleted: false,
        isFolder: true,
        ownerId,
      },
      select: returnContentStructureSharedDetailsNoClassDocsSelect(),
    });

    folder = processContentSharedDetailsNoClassDocs(preliminaryFolder);
  }

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
      id: Uint8Array;
      relevance: number;
    }[]
  >(Prisma.sql`

  ${
    folderId !== null
      ? Prisma.sql`
      WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE parentFolderId = ${folderId} AND ownerId = ${ownerId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ft
      ON content.parentFolderId = ft.id
      WHERE content.isDeleted = FALSE
    )`
      : Prisma.empty
  }
  SELECT
    content.id,
    AVG((MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) + 
    (MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) +
    ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, matchSubCategory: true, matchCategory: true, prependOperator: true, operator: "+" })} 
    ) as relevance
  FROM
    content
  LEFT JOIN
    (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
  ${returnClassificationJoins({ includeCategory: true, joinFromContent: true })}
  WHERE
    ${
      folderId !== null
        ? Prisma.sql`content.id IN (SELECT id from content_tree)`
        : Prisma.sql`content.ownerId = ${ownerId} AND content.isDeleted = FALSE`
    }
    AND
    (
      MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, matchSubCategory: true, matchCategory: true, prependOperator: true, operator: "OR" })} 
    )
  GROUP BY
    content.id
  ORDER BY
    relevance DESC
  LIMIT 100
  `);

  // TODO: combine queries

  const preliminaryResults = await prisma.content.findMany({
    where: {
      id: { in: matches.map((m) => m.id) },
    },
    select: {
      ...returnContentStructureSharedDetailsSelect({
        includeAssignInfo: true,
      }),
      _count: { select: { assignmentScores: true } },
    },
  });

  // TODO: better way to sort! (For free if combine queries)
  const relevance = Object.fromEntries(
    matches.map((m) => [fromUUID(m.id), m.relevance]),
  );

  const content: ContentStructure[] = preliminaryResults
    .sort((a, b) => relevance[fromUUID(b.id)] - relevance[fromUUID(a.id)])
    .map(processContentSharedDetails);

  const availableFeatures = await getAvailableContentFeatures();

  return {
    content,
    folder,
    availableFeatures,
  };
}

export async function getSharedFolderContent({
  ownerId,
  folderId,
  loggedInUserId,
}: {
  ownerId: Uint8Array;
  folderId: Uint8Array | null;
  loggedInUserId: Uint8Array;
}) {
  let folder: ContentStructure | null = null;

  if (folderId !== null) {
    // if ask for a folder, make sure it exists and is owned by logged in user
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        ownerId,
        id: folderId,
        isDeleted: false,
        isFolder: true,
        OR: [
          { isPublic: true },
          { sharedWith: { some: { userId: loggedInUserId } } },
        ],
      },
      select: returnContentStructureNoClassDocsSelect(),
    });

    // If parent folder is not public or not shared with me,
    // make it look like it doesn't have a parent folder.
    if (
      !(
        preliminaryFolder.parentFolder &&
        (preliminaryFolder.parentFolder.isPublic ||
          preliminaryFolder.parentFolder.sharedWith.findIndex((cs) =>
            isEqualUUID(cs.userId, loggedInUserId),
          ) !== -1)
      )
    ) {
      preliminaryFolder.parentFolder = null;
    }

    folder = processContentNoClassDocs(preliminaryFolder, loggedInUserId);
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
    select: returnContentStructureFullOwnerSelect(),
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
      select: returnContentStructureFullOwnerSelect(),
      orderBy: { sortIndex: "asc" },
    });
    preliminarySharedContent.push(...orphanedSharedContent);
  }

  const publicContent = preliminarySharedContent.map((content) =>
    processContent(content, loggedInUserId),
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

export async function getClassificationCategories() {
  const results = await prisma.classificationSystems.findMany({
    orderBy: {
      sortIndex: "asc",
    },
    select: {
      id: true,
      name: true,
      categoryLabel: true,
      subCategoryLabel: true,
      type: true,
      categories: {
        orderBy: {
          sortIndex: "asc",
        },
        select: {
          id: true,
          category: true,
          subCategories: {
            orderBy: {
              sortIndex: "asc",
            },
            select: {
              id: true,
              subCategory: true,
            },
          },
        },
      },
    },
  });

  const formattedResults: ClassificationCategoryTree[] = results.map(
    (system) => {
      return {
        id: system.id,
        name: system.name,
        type: system.type,
        categoryLabel: system.categoryLabel,
        subCategoryLabel: system.subCategoryLabel,
        categories: system.categories.map((category) => {
          return {
            id: category.id,
            category: category.category,
            subCategories: category.subCategories.map((subCategory) => {
              return {
                id: subCategory.id,
                subCategory: subCategory.subCategory,
              };
            }),
          };
        }),
      };
    },
  );
  return formattedResults;
}

export async function searchPossibleClassifications({
  query = "",
  systemId,
  categoryId,
  subCategoryId,
}: {
  query?: string;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
}) {
  // remove operators that break MySQL BOOLEAN search
  // and add * at the end of every word so that match beginning of words
  const query_as_prefixes = query
    .replace(/[+\-><()~*"@]+/g, " ")
    .split(" ")
    .filter((s) => s)
    .map((s) => s + "*")
    .join(" ");

  if (query_as_prefixes.length > 0) {
    const matchClassification = true;
    const matchSubCategory = subCategoryId === undefined;
    const matchCategory = matchSubCategory && categoryId === undefined;
    const matchSystem = matchCategory && systemId === undefined;

    const includeClassification = true;
    const includeSubCategory = matchSubCategory;
    const includeCategory = matchCategory;
    const includeSystem = matchSystem;

    const matches = await prisma.$queryRaw<
      {
        id: number;
        relevance: number;
      }[]
    >(Prisma.sql`
  SELECT
    classifications.id,
    AVG(
    ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, matchSystem, operator: "+" })} 
    ) as relevance
  FROM
    classifications
    ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, includeSystem })}
  WHERE
    (
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, matchSystem, operator: "OR" })} 
    )
    ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId })}
    
  GROUP BY
    classifications.id
  ORDER BY
    relevance DESC
  LIMIT 100
  `);

    // since full text search doesn't match code well, separately match for those
    // and put matches at the top of the list
    const query_words = query.split(" ");

    const code_matches = await prisma.classifications.findMany({
      where: {
        OR: query_words.map((query_word) => ({
          code: { contains: query_word },
        })),
        descriptions: {
          some: {
            subCategoryId,
            subCategory: {
              categoryId,
              category: { systemId },
            },
          },
        },
      },
      select: { id: true },
    });

    const results: ContentClassification[] =
      await prisma.classifications.findMany({
        where: {
          id: { in: [...matches, ...code_matches].map((m) => m.id) },
        },
        select: returnClassificationListSelect(),
      });

    // TODO: a more efficient way to get desired sort order?
    const sort_order: Record<string, number> = {};
    matches.forEach((match) => {
      sort_order[match.id] = match.relevance;
    });
    code_matches.forEach((match) => {
      sort_order[match.id] = 100 + (sort_order[match.id] || 0); // code matches go at the top
    });
    results.sort((a, b) => sort_order[b.id] - sort_order[a.id]);

    return results;
  }

  const results: ContentClassification[] =
    await prisma.classifications.findMany({
      where: {
        descriptions: {
          some: {
            subCategoryId,
            subCategory: {
              categoryId,
              category: { systemId },
            },
          },
        },
      },
      take: 100,
      select: returnClassificationListSelect(),
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
  activityId: Uint8Array,
  classificationId: number,
  loggedInUserId: Uint8Array,
) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      ...filterEditableActivity(loggedInUserId, isAdmin),
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
  activityId: Uint8Array,
  classificationId: number,
  loggedInUserId: Uint8Array,
) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      ...filterEditableActivity(loggedInUserId, isAdmin),
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

// TODO: The getClassifications API is not being used (Jan 2, 2025). Remove?

/**
 * Get all classifications for an activity. The activity must be either public or owned by
 * loggedInUser.
 * @param activityId
 * @param loggedInUserId
 */
export async function getClassifications(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
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
        select: returnClassificationListSelect(),
      },
    },
  });
  const formatted: ContentClassification[] = sortClassifications(
    classifications.map((c) => c.classification),
  );
  return formatted;
}

// TODO: create test
export async function getClassificationInfo({
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
}: {
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
}): Promise<PartialContentClassification | null> {
  if (classificationId !== undefined) {
    const classificationInfo = await prisma.classifications.findUniqueOrThrow({
      where: { id: classificationId },
      select: {
        id: true,
        code: true,
        descriptions: {
          where: { subCategoryId },
          select: {
            id: true,
            description: true,
            subCategory: {
              select: {
                id: true,
                subCategory: true,
                category: {
                  select: {
                    id: true,
                    category: true,
                    system: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const description = classificationInfo.descriptions[0];

    return {
      classification: {
        id: classificationInfo.id,
        code: classificationInfo.code,
        descriptionId: description.id,
        description: description.description,
      },
      subCategory: {
        id: description.subCategory.id,
        subCategory: description.subCategory.subCategory,
      },
      category: {
        id: description.subCategory.category.id,
        category: description.subCategory.category.category,
      },
      system: description.subCategory.category.system,
    };
  } else if (subCategoryId !== undefined) {
    const subCategoryInfo =
      await prisma.classificationSubCategories.findUniqueOrThrow({
        where: { id: subCategoryId },
        select: {
          id: true,
          subCategory: true,
          category: {
            select: {
              id: true,
              category: true,
              system: true,
            },
          },
        },
      });

    return {
      subCategory: {
        id: subCategoryInfo.id,
        subCategory: subCategoryInfo.subCategory,
      },
      category: {
        id: subCategoryInfo.category.id,
        category: subCategoryInfo.category.category,
      },
      system: subCategoryInfo.category.system,
    };
  } else if (categoryId !== undefined) {
    const categoryInfo =
      await prisma.classificationCategories.findUniqueOrThrow({
        where: { id: categoryId },
        select: {
          id: true,
          category: true,
          system: true,
        },
      });

    return {
      category: {
        id: categoryInfo.id,
        category: categoryInfo.category,
      },
      system: categoryInfo.system,
    };
  } else if (systemId !== undefined) {
    const systemInfo = await prisma.classificationSystems.findUniqueOrThrow({
      where: { id: systemId },
    });
    return { system: systemInfo };
  } else {
    return null;
  }
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

export async function setActivityLicense({
  id,
  loggedInUserId,
  licenseCode,
}: {
  id: Uint8Array;
  loggedInUserId: Uint8Array;
  licenseCode: LicenseCode;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  await prisma.content.update({
    where: { id, ...filterEditableActivity(loggedInUserId, isAdmin) },
    data: { licenseCode },
  });
}

export async function makeActivityPublic({
  id,
  ownerId,
  licenseCode,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  licenseCode: LicenseCode;
}) {
  await prisma.content.update({
    where: { id, isDeleted: false, ownerId: ownerId, isFolder: false },
    data: { isPublic: true, licenseCode },
  });
}

export async function makeActivityPrivate({
  id,
  ownerId,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
}) {
  await prisma.content.update({
    where: { id, isDeleted: false, ownerId, isFolder: false },
    data: { isPublic: false },
  });
}

export async function shareActivity({
  id,
  ownerId,
  licenseCode,
  users,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  licenseCode: LicenseCode;
  users: Uint8Array[];
}) {
  await prisma.content.update({
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
}

export async function shareActivityWithEmail({
  id,
  ownerId,
  licenseCode,
  email,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
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

  if (isEqualUUID(userId, ownerId)) {
    // cannot share with self
    throw Error("Cannot share with self");
  }

  return await shareActivity({ id, ownerId, licenseCode, users: [userId] });
}

export async function unshareActivity({
  id,
  ownerId,
  users,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  users: Uint8Array[];
}) {
  await prisma.contentShares.deleteMany({
    where: {
      content: { id, isDeleted: false, ownerId, isFolder: false },
      OR: users.map((userId) => ({ userId })),
    },
  });
}

export async function setFolderLicense({
  id,
  ownerId,
  licenseCode,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
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
  id: Uint8Array;
  ownerId: Uint8Array;
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
  id: Uint8Array;
  ownerId: Uint8Array;
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
  id: Uint8Array;
  ownerId: Uint8Array;
  licenseCode: LicenseCode;
  users: Uint8Array[];
}) {
  // Share the folder `id` to users along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

  const contentIds = (
    await prisma.$queryRaw<{ id: Uint8Array }[]>(Prisma.sql`
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
}

export async function shareFolderWithEmail({
  id,
  ownerId,
  licenseCode,
  email,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
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

  if (isEqualUUID(userId, ownerId)) {
    // cannot share with self
    throw Error("Cannot share with self");
  }

  return await shareFolder({ id, ownerId, licenseCode, users: [userId] });
}

export async function unshareFolder({
  id,
  ownerId,
  users,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  users: Uint8Array[];
}) {
  // Stop the folder `id` along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

  const contentIds = (
    await prisma.$queryRaw<{ id: Uint8Array }[]>(Prisma.sql`
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
  loggedInUserId: Uint8Array,
  cardView: boolean,
) {
  return await prisma.users.update({
    where: { userId: loggedInUserId },
    data: { cardView },
    select: { cardView: true },
  });
}

export async function getPreferredFolderView(loggedInUserId: Uint8Array) {
  return await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: { cardView: true },
  });
}

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

  if (!info) {
    return { status: "none", sourceId: id, activityId: null };
  } else {
    const isAdmin = await prisma.users.findFirst({
      where: {
        userId,
        isAdmin: true,
      },
      select: {
        userId: true,
      },
    });

    if (isAdmin) {
      if (info.activityId) {
        return info;
      } else {
        return {
          status: info.status,
          comments: info.comments,
          sourceId: info.sourceId,
          activityId: null,
        };
      }
    } else {
      const isOwner = await prisma.users.findUnique({
        where: {
          userId,
          content: {
            some: {},
          },
        },
      });

      if (isOwner) {
        if (info.status === LibraryStatus.PUBLISHED) {
          return info;
        } else {
          return {
            status: info.status,
            comments: info.comments,
            sourceId: info.sourceId,
            activityId: null,
          };
        }
      } else {
        if (info.status === LibraryStatus.PUBLISHED) {
          return {
            status: info.status,
            sourceId: info.sourceId,
            activityId: info.activityId,
            // skip comments
          };
        } else {
          return { status: "none", sourceId: info.sourceId, activityId: null };
        }
      }
    }
  }
}

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

export async function addDraftToLibrary({
  id,
  loggedInUserId,
}: {
  id: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);

  // Cannot add draft if it can already be found in library
  const existingLibId = await prisma.libraryActivityInfos.findUnique({
    where: {
      sourceId: id,
      NOT: {
        activityId: null,
      },
    },
    select: {
      activityId: true,
    },
  });

  if (existingLibId) {
    throw new InvalidRequestError(
      `Already included in library, see activity ${existingLibId}`,
    );
  }

  const libraryId = await getLibraryAccountId();

  const draftId = await copyActivityToFolder(id, libraryId, null);

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

export async function deleteDraftFromLibrary({
  draftId,
  loggedInUserId,
}: {
  draftId: Uint8Array;
  loggedInUserId: Uint8Array;
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

  const deleteDraft = prisma.content.update({
    where: {
      id: draftId,
      isPublic: false, // This is key! We're only deleting unpublished drafts here
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

// TODO: Notify owner that their activity has been added to the library
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
      libraryActivity: {
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
      libraryActivity: {
        status: LibraryStatus.PUBLISHED,
      },
    },
    data: {
      isPublic: false,
      libraryActivity: {
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

// TODO: Notify owner that their activity needs revision before it will be accepted into the library
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
      librarySource: {
        status: LibraryStatus.PENDING_REVIEW,
        ownerRequested: true,
      },
    },
    data: {
      librarySource: {
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

// TODO: Notify owner that the comments have changed
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
        librarySource: null,
      },
    },
    data: {
      librarySource: {
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

export async function getCurationFolderContent({
  folderId,
  loggedInUserId,
}: {
  folderId: Uint8Array | null;
  loggedInUserId: Uint8Array;
}) {
  await mustBeAdmin(loggedInUserId);
  const libraryId = await getLibraryAccountId();

  let folder: ContentStructure | null = null;

  if (folderId !== null) {
    // if ask for a folder, make sure it exists and is owned by the library
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        id: folderId,
        isDeleted: false,
        isFolder: true,
        ownerId: libraryId,
      },
      select: returnContentStructureSharedDetailsNoClassDocsSelect(),
    });

    folder = processContentSharedDetailsNoClassDocs(preliminaryFolder);
  }

  const preliminaryContent = await prisma.content.findMany({
    where: {
      ownerId: libraryId,
      isDeleted: false,
      parentFolderId: folderId,
    },
    select: {
      ...returnContentStructureSharedDetailsSelect({
        includeAssignInfo: true,
        isAdmin: true,
      }),
      _count: { select: { assignmentScores: true } },
    },
    orderBy: { sortIndex: "asc" },
  });

  const content: ContentStructure[] = preliminaryContent.map(
    processContentSharedDetails,
  );

  const availableFeatures = await getAvailableContentFeatures();

  return {
    content,
    folder,
    availableFeatures,
  };
}
