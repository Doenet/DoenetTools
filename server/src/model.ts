import { PrismaClient, Prisma } from "@prisma/client";
import { cidFromText } from "./utils/cid";
import { DateTime } from "luxon";
import { fromUUID, isEqualUUID } from "./utils/uuid";
import {
  AssignmentStatus,
  ClassificationCategoryTree,
  ContentClassification,
  ContentStructure,
  DocHistory,
  DocRemixes,
  License,
  LicenseCode,
  UserInfo,
} from "./types";
import { sortClassifications } from "./utils/classifications";
import {
  returnContentStructureFullOwnerSelect,
  returnContentStructureSharedDetailsSelect,
} from "./utils/contentStructure";

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
  ownerId: Uint8Array,
  parentFolderId: Uint8Array | null,
) {
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
  ownerId,
  isQuestion,
  isInteractive,
  containsVideo,
}: {
  id: Uint8Array;
  name?: string;
  imagePath?: string;
  ownerId: Uint8Array;
  isQuestion?: boolean;
  isInteractive?: boolean;
  containsVideo?: boolean;
}) {
  const updated = await prisma.content.update({
    where: { id, ownerId, isDeleted: false },
    data: {
      name,
      imagePath,
      isQuestion,
      isInteractive,
      containsVideo,
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
  id: Uint8Array;
  source?: string;
  name?: string;
  doenetmlVersionId?: number;
  ownerId: Uint8Array;
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
  ownerId,
}: {
  id: Uint8Array;
  desiredParentFolderId: Uint8Array | null;
  desiredPosition: number;
  ownerId: Uint8Array;
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

  if (!isEqualUUID(contentCheck.ownerId, loggedInUserId)) {
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
      isQuestion: false,
      isInteractive: false,
      containsVideo: false,
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

  const contentSelect = returnContentStructureSharedDetailsSelect({
    includeClassInfo: true,
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
    const constSelectWithAssignedVersion = {
      ...contentSelect,
      documents,
      _count: { select: { assignmentScores: true } },
    };

    const assignedActivity = await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        isDeleted: false,
        ownerId: loggedInUserId,
        isFolder: false,
      },
      select: constSelectWithAssignedVersion,
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
      isFolder: assignedActivity.isFolder,
      isPublic: assignedActivity.isPublic,
      isShared,
      sharedWith,
      license: assignedActivity.license
        ? processLicense(assignedActivity.license)
        : null,
      isQuestion: assignedActivity.isQuestion,
      isInteractive: assignedActivity.isInteractive,
      containsVideo: assignedActivity.containsVideo,
      classifications: sortClassifications(
        assignedActivity.classifications.map((c) => c.classification),
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
      select: contentSelect,
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
      classifications: sortClassifications(
        classifications.map((c) => c.classification),
      ),
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
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
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
    select: returnContentStructureFullOwnerSelect(),
  });

  const {
    license,
    sharedWith: sharedWithOrig,
    parentFolder,
    classifications,
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
    classifications: sortClassifications(
      classifications.map((c) => c.classification),
    ),
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
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
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
    select: returnContentStructureFullOwnerSelect(),
  });

  const {
    license,
    sharedWith: sharedWithOrig,
    parentFolder,
    classifications,
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
    classifications: sortClassifications(
      classifications.map((c) => c.classification),
    ),
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

export async function getDocumentSource(
  docId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
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
  activityId: Uint8Array;
  loggedInUserId: Uint8Array;
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
  docIds: Uint8Array[];
  loggedInUserId: Uint8Array;
}) {
  const docHistories: DocHistory[] = await prisma.documents.findMany({
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
  activityId: Uint8Array;
  loggedInUserId: Uint8Array;
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
  docIds: Uint8Array[];
  loggedInUserId: Uint8Array;
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
                isDeleted: false,
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
}: {
  docIds: Uint8Array[];
  loggedInUserId: Uint8Array;
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
                isDeleted: false,
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

export async function searchSharedContent({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isQuestion,
  isInteractive,
  containsVideo,
}: {
  query: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isQuestion?: boolean;
  isInteractive?: boolean;
  containsVideo?: boolean;
}) {
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
  SELECT
    content.id,
    AVG((MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) + 
    (MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) +
    MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classifications.code) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classificationDescriptions.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classificationSubCategories.subCategory) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classificationCategories.category) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
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
  LEFT JOIN
    _classificationDescriptionsToclassifications rel ON classifications.id = rel.B
  LEFT JOIN
    classificationDescriptions ON rel.A = classificationDescriptions.id
  LEFT JOIN
    classificationSubCategories ON classificationDescriptions.subCategoryId = classificationSubCategories.id
  LEFT JOIN
    classificationCategories ON classificationSubCategories.categoryId = classificationCategories.id
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
    OR MATCH(classifications.code) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classificationDescriptions.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classificationSubCategories.subCategory) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classificationCategories.category) AGAINST(${query_as_prefixes} IN BOOLEAN MODE))
    ${
      classificationId !== undefined
        ? Prisma.sql`AND classifications.id = ${classificationId}`
        : subCategoryId !== undefined
          ? Prisma.sql`AND classificationSubCategories.id = ${subCategoryId}`
          : categoryId !== undefined
            ? Prisma.sql`AND classificationCategories.id = ${categoryId}`
            : systemId !== undefined
              ? Prisma.sql`AND classificationCategories.systemId = ${systemId}`
              : Prisma.empty
    }
    ${isQuestion !== undefined ? Prisma.sql`AND content.isQuestion = ${isQuestion}` : Prisma.empty}
    ${isInteractive !== undefined ? Prisma.sql`AND content.isInteractive = ${isInteractive}` : Prisma.empty}
    ${containsVideo !== undefined ? Prisma.sql`AND content.containsVideo = ${containsVideo}` : Prisma.empty}
  GROUP BY
    content.id
  ORDER BY
    relevance DESC
  LIMIT 100
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

  const sharedContent: ContentStructure[] = preliminarySharedContent
    .sort((a, b) => relevance[fromUUID(b.id)] - relevance[fromUUID(a.id)])
    .map((content) => {
      const {
        license,
        sharedWith: sharedWithOrig,
        parentFolder,
        classifications,
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
        license: license ? processLicense(license) : null,
        classifications: sortClassifications(
          classifications.map((c) => c.classification),
        ),
        classCode: null,
        codeValidUntil: null,
        assignmentStatus: "Unassigned",
        hasScoreData: false,
        parentFolder: processParentFolderForUser(parentFolder, loggedInUserId),
      };
    });

  return sharedContent;
}

export async function searchUsersWithSharedContent(
  query: string,
  loggedInUserId: Uint8Array,
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
      userId: Uint8Array;
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

  const usersWithPublic2: UserInfo[] = usersWithPublic.map((u) => ({
    ...u,
    email: "",
  }));
  return usersWithPublic2;
}

export async function listUserAssigned(userId: Uint8Array) {
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
      isQuestion: true,
      isInteractive: true,
      containsVideo: true,
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

  return user;
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

  const activities2: ContentStructure[] = activities.map((activity) => {
    const { license, classifications, ...content2 } = activity;

    return {
      ...content2,
      license: license ? processLicense(license) : null,
      classifications: sortClassifications(
        classifications.map((c) => c.classification),
      ),
      classCode: null,
      codeValidUntil: null,
      assignmentStatus: "Unassigned",
      hasScoreData: false,
      parentFolder: null,
      isShared: false,
      sharedWith: [],
    };
  });

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
      groupContent.promotedContent.map((content) => {
        const { license, classifications, ...content2 } = content.activity;

        return {
          ...content2,
          license: license ? processLicense(license) : null,
          classifications: sortClassifications(
            classifications.map((c) => c.classification),
          ),
          classCode: null,
          codeValidUntil: null,
          assignmentStatus: "Unassigned",
          hasScoreData: false,
          parentFolder: null,
          isShared: false,
          sharedWith: [],
        };
      });

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
  return ("00000" + Math.floor(Math.random() * 1000000)).slice(-6);
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
      select: {
        id: true,
        ownerId: true,
        name: true,
        imagePath: true,
        isPublic: true,
        isQuestion: true,
        isInteractive: true,
        containsVideo: true,
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
      ...returnContentStructureSharedDetailsSelect({
        includeIsAssigned: true,
        includeClassInfo: true,
      }),
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
      classifications: sortClassifications(
        classifications.map((c) => c.classification),
      ),
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
  folderId: Uint8Array | null;
  loggedInUserId: Uint8Array;
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
        isQuestion: true,
        isInteractive: true,
        containsVideo: true,
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
      WHERE parentFolderId = ${folderId} AND ownerId = ${loggedInUserId} AND isDeleted = FALSE
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
    MATCH(classifications.code) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classificationDescriptions.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classificationSubCategories.subCategory) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classificationCategories.category) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    ) as relevance
  FROM
    content
  LEFT JOIN
    (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
  LEFT JOIN
    contentClassifications ON content.id = contentClassifications.contentId
  LEFT JOIN
    classifications ON contentClassifications.classificationId = classifications.id
  LEFT JOIN
    _classificationDescriptionsToclassifications rel ON classifications.id = rel.B
  LEFT JOIN
    classificationDescriptions ON rel.A = classificationDescriptions.id
  LEFT JOIN
    classificationSubCategories ON classificationDescriptions.subCategoryId = classificationSubCategories.id
  LEFT JOIN
    classificationCategories ON classificationSubCategories.categoryId = classificationCategories.id
  WHERE
    ${
      folderId !== null
        ? Prisma.sql`content.id IN (SELECT id from content_tree)`
        : Prisma.sql`content.ownerId = ${loggedInUserId} AND content.isDeleted = FALSE`
    }
    AND
    (MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classifications.code) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classificationDescriptions.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classificationSubCategories.subCategory) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classificationCategories.category) AGAINST(${query_as_prefixes} IN BOOLEAN MODE))
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
        includeClassInfo: true,
        includeIsAssigned: true,
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
        classifications: sortClassifications(
          classifications.map((c) => c.classification),
        ),
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
        isQuestion: true,
        isInteractive: true,
        containsVideo: true,
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
          preliminaryFolder.parentFolder.sharedWith.findIndex((cs) =>
            isEqualUUID(cs.userId, loggedInUserId),
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

  const publicContent: ContentStructure[] = preliminarySharedContent.map(
    (content) => {
      const {
        license,
        sharedWith: sharedWithOrig,
        parentFolder,
        classifications,
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
        license: license ? processLicense(license) : null,
        classifications: sortClassifications(
          classifications.map((c) => c.classification),
        ),
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
    const matches = await prisma.$queryRaw<
      {
        id: number;
        relevance: number;
      }[]
    >(Prisma.sql`
  SELECT
    classifications.id,
    AVG(
    MATCH(classifications.code) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classificationDescriptions.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classificationSubCategories.subCategory) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classificationCategories.category) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) +
    MATCH(classificationSystems.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    ) as relevance
  FROM
    classifications
  INNER JOIN
    _classificationDescriptionsToclassifications rel ON classifications.id = rel.B
  LEFT JOIN
    classificationDescriptions ON rel.A = classificationDescriptions.id
  LEFT JOIN
    classificationSubCategories ON classificationDescriptions.subCategoryId = classificationSubCategories.id
  INNER JOIN
    classificationCategories ON classificationSubCategories.categoryId = classificationCategories.id
  INNER JOIN
    classificationSystems ON classificationCategories.systemId = classificationSystems.id
  WHERE
    (MATCH(classifications.code) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classificationDescriptions.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classificationSubCategories.subCategory) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classificationCategories.category) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
    OR MATCH(classificationSystems.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE))
    ${
      subCategoryId !== undefined
        ? Prisma.sql`AND classificationSubCategories.id = ${subCategoryId}`
        : categoryId !== undefined
          ? Prisma.sql`AND classificationCategories.id = ${categoryId}`
          : systemId !== undefined
            ? Prisma.sql`AND classificationSystems.id = ${systemId}`
            : Prisma.empty
    }
    
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
        AND: [
          {
            OR: query_words.map((query_word) => ({
              code: { contains: query_word },
            })),
          },
          {
            descriptions: { some: { subCategory: { category: { systemId } } } },
          },
          { descriptions: { some: { subCategory: { categoryId } } } },
          { descriptions: { some: { subCategoryId } } },
        ],
      },
      select: { id: true },
    });

    const results: ContentClassification[] =
      await prisma.classifications.findMany({
        where: {
          id: { in: [...matches, ...code_matches].map((m) => m.id) },
        },
        select: {
          id: true,
          code: true,
          descriptions: {
            select: {
              description: true,
              subCategory: {
                select: {
                  id: true,
                  subCategory: true,
                  sortIndex: true,
                  category: {
                    select: {
                      id: true,
                      category: true,
                      system: {
                        select: {
                          id: true,
                          name: true,
                          shortName: true,
                          categoryLabel: true,
                          subCategoryLabel: true,
                          descriptionLabel: true,
                          categoriesInDescription: true,
                          type: true,
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
        AND: [
          {
            descriptions: { some: { subCategory: { category: { systemId } } } },
          },
          { descriptions: { some: { subCategory: { categoryId } } } },
          { descriptions: { some: { subCategoryId } } },
        ],
      },
      take: 100,
      select: {
        id: true,
        code: true,
        descriptions: {
          select: {
            description: true,
            subCategory: {
              select: {
                id: true,
                subCategory: true,
                sortIndex: true,
                category: {
                  select: {
                    id: true,
                    category: true,
                    system: {
                      select: {
                        id: true,
                        name: true,
                        shortName: true,
                        categoryLabel: true,
                        subCategoryLabel: true,
                        descriptionLabel: true,
                        categoriesInDescription: true,
                        type: true,
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
  activityId: Uint8Array,
  classificationId: number,
  loggedInUserId: Uint8Array,
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
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
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
          code: true,
          descriptions: {
            select: {
              description: true,
              subCategory: {
                select: {
                  id: true,
                  subCategory: true,
                  sortIndex: true,
                  category: {
                    select: {
                      id: true,
                      category: true,
                      system: {
                        select: {
                          id: true,
                          name: true,
                          shortName: true,
                          categoryLabel: true,
                          subCategoryLabel: true,
                          descriptionLabel: true,
                          categoriesInDescription: true,
                          type: true,
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
  const formatted: ContentClassification[] = sortClassifications(
    classifications.map((c) => c.classification),
  );
  return formatted;
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
  sharedWithIds: { userId: Uint8Array }[] | null | undefined,
  determineSharedToUser: Uint8Array,
): { isShared: boolean; sharedWith: UserInfo[] } {
  if (sharedWithIds === null || sharedWithIds === undefined) {
    return { isShared: false, sharedWith: [] };
  }

  const isShared =
    sharedWithIds.findIndex((cs) =>
      isEqualUUID(cs.userId, determineSharedToUser),
    ) !== -1;

  const sharedWith: {
    userId: Uint8Array;
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
    id: Uint8Array;
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
    id: Uint8Array;
    name: string;
    isPublic: boolean;
    sharedWith: { userId: Uint8Array }[];
  } | null,
  determineSharedToUser: Uint8Array,
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
  id: Uint8Array;
  ownerId: Uint8Array;
  licenseCode: LicenseCode;
}) {
  await prisma.content.update({
    where: { id, isDeleted: false, ownerId: ownerId, isFolder: false },
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
