import { PrismaClient, Prisma } from "@prisma/client";
import { cidFromText } from "./utils/cid";
import { DateTime } from "luxon";

export class InvalidRequestError extends Error {
  errorCode = 400;
  constructor(message: string) {
    super(message);
    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, InvalidRequestError.prototype);
  }
}

const prisma = new PrismaClient();

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

  let defaultDoenetmlVersion = await prisma.doenetmlVersions.findFirstOrThrow({
    where: { default: true },
  });

  const activity = await prisma.content.create({
    data: {
      ownerId,
      isFolder: false,
      parentFolderId,
      name: "Untitled Activity",
      imagePath: "/activity_default.jpg",
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
    },
  });

  let activityId = activity.id;

  const activityWithDoc = await prisma.content.findUniqueOrThrow({
    where: { id: activityId },
    select: { documents: { select: { id: true } } },
  });

  let docId = activityWithDoc.documents[0].id;

  return { activityId, docId };
}

export async function createFolder(
  ownerId: number,
  parentFolderId: number | null,
) {
  const sortIndex = await getNextSortIndexForFolder(ownerId, parentFolderId);

  const folder = await prisma.content.create({
    data: {
      ownerId,
      isFolder: true,
      parentFolderId,
      name: "Untitled Folder",
      imagePath: "/folder_default.jpg",
      sortIndex,
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

  // The new index is a multiple of SORT_INCREMENT and is at least SORT_INCREMENT after lastIndex.
  // It is set to zero if it is the first item in the folder.
  const newIndex =
    lastIndex === null
      ? 0
      : Math.ceil(Number(lastIndex) / SORT_INCREMENT + 1) * SORT_INCREMENT;

  return newIndex;
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

  return await prisma.content.findUniqueOrThrow({
    where: { id, ownerId },
    select: { id: true, isDeleted: true },
  });
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
  isPublic,
  ownerId,
}: {
  id: number;
  name?: string;
  imagePath?: string;
  isPublic?: boolean;
  ownerId: number;
}) {
  const updated = await prisma.content.update({
    where: { id, ownerId },
    data: {
      name,
      imagePath,
      isPublic,
    },
  });

  return {
    id: updated.id,
    name: updated.name,
    imagePath: updated.imagePath,
    isPublic: updated.isPublic,
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
      where: { documents: { some: { id } } },
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
  });

  if (desiredParentFolderId !== null) {
    // if desired parent folder is specified, make sure it exists and is owned by `ownerId`
    await prisma.content.findUniqueOrThrow({
      where: {
        id: desiredParentFolderId,
        ownerId,
        isDeleted: false,
        isFolder: true,
      },
    });

    if (content.isFolder) {
      // if content is a folder and moving it to another folder,
      // make that folder is not itself or a subfolder of itself

      if (desiredParentFolderId === content.id) {
        throw Error("Cannot move folder into itself");
      }

      let subfolders = await prisma.$queryRaw<
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

  let newSortIndex: number;

  if (desiredPosition <= 0) {
    // If desired position is the first position,
    // then we need only look up the first item in the folder.
    const firstItem = await prisma.content.findFirst({
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
    });

    // If there is no other content, set sort index to 0,
    // else set it to be the first index - `SORT_INCREMENT`.
    newSortIndex =
      firstItem === null ? 0 : Number(firstItem.sortIndex) - SORT_INCREMENT;
  } else {
    // find all content in folder other than moved content
    const currentItems = await prisma.content.findMany({
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
    });

    if (currentItems.length === 0) {
      newSortIndex = 0;
    } else if (desiredPosition >= currentItems.length) {
      newSortIndex =
        Number(currentItems[currentItems.length - 1].sortIndex) +
        SORT_INCREMENT;
    } else {
      const precedingSortIndex = Number(
        currentItems[desiredPosition - 1].sortIndex,
      );
      const followingSortIndex = Number(
        currentItems[desiredPosition].sortIndex,
      );
      const candidateSortIndex = Math.round(
        (precedingSortIndex + followingSortIndex) / 2,
      );
      if (
        candidateSortIndex > precedingSortIndex &&
        candidateSortIndex < followingSortIndex
      ) {
        newSortIndex = candidateSortIndex;
      } else {
        // There is no room in sort indices to insert a new item at `desiredLocation`,
        // as the distance between precedingSortIndex and followingSortIndex is too small to fit another integer
        // (presumably because the distance is 1, though possibly a larger distance if we are outside
        // the bounds of safe integers in Javascript).
        // We need to re-index; we shift the smaller set of items preceding or following the desired location.
        if (desiredPosition >= currentItems.length / 2) {
          // We add `SORT_INCREMENT` to all items with sort index `followingSortIndex` or larger.
          await prisma.content.updateMany({
            where: {
              ownerId,
              parentFolderId: desiredParentFolderId,
              id: { not: id },
              sortIndex: {
                gte: followingSortIndex,
              },
              isDeleted: false,
            },
            data: {
              sortIndex: { increment: SORT_INCREMENT },
            },
          });
          newSortIndex = Math.round(
            (precedingSortIndex + followingSortIndex + SORT_INCREMENT) / 2,
          );
        } else {
          // We subtract `SORT_INCREMENT` from all items with sort index `precedingSortIndex` or smaller.
          await prisma.content.updateMany({
            where: {
              ownerId,
              parentFolderId: desiredParentFolderId,
              id: { not: id },
              sortIndex: {
                lte: precedingSortIndex,
              },
              isDeleted: false,
            },
            data: {
              sortIndex: { decrement: SORT_INCREMENT },
            },
          });
          newSortIndex = Math.round(
            (precedingSortIndex - SORT_INCREMENT + followingSortIndex) / 2,
          );
        }
      }
    }
  }

  // Move the item!
  await prisma.content.update({
    where: { id },
    data: {
      sortIndex: newSortIndex,
      parentFolderId: desiredParentFolderId,
    },
  });
}

/**
 * Copies the activity given by `origActivityId` into `folderId` of `ownerId`.
 *
 * Places the activity at the end of the folder.
 *
 * Adds `origActivityId` and its contributor history to the contributor history of the new activity.
 *
 * Throws an error if `userId` doesn't have access to `origActivityId`
 * (currently means a non-public activity with a different owner)
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
      OR: [{ ownerId: userId }, { isPublic: true }],
    },
    include: {
      documents: {
        where: { isDeleted: false },
      },
    },
  });

  const sortIndex = await getNextSortIndexForFolder(userId, folderId);

  let newActivity = await prisma.content.create({
    data: {
      name: origActivity.name,
      isFolder: false,
      imagePath: origActivity.imagePath,
      ownerId: userId,
      parentFolderId: folderId,
      sortIndex,
    },
  });

  let documentsToAdd = await Promise.all(
    origActivity.documents.map(async (doc) => {
      // For each of the original documents, create a document version (i.e., a frozen snapshot)
      // that we will link to when creating contributor history, below.
      let originalDocVersion = await createDocumentVersion(doc.id);

      // document to create with new activityId (to associate it with newly created activity)
      // ignoring the docId, lastEdited, createdAt fields
      const {
        id: _ignoreId,
        lastEdited: _ignoreLastEdited,
        createdAt: _ignoreCreatedAt,
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
  let contribHistoryInfo = newDocIds.map((docId, i) => ({
    docId,
    prevDocId: origActivity.documents[i].id,
    prevDocVersionNum: documentsToAdd[i].originalDocVersion.versionNum,
  }));
  await prisma.contributorHistory.createMany({
    data: contribHistoryInfo,
  });

  // Create contributor history linking each newly created document
  // to the contributor history of the corresponding document from origActivity.
  // Note: we copy all history rather than using a linked list
  // due to inefficient queries necessary to traverse link lists.
  for (let [i, origDoc] of origActivity.documents.entries()) {
    const previousHistory = await prisma.contributorHistory.findMany({
      where: {
        docId: origDoc.id,
      },
      orderBy: { timestamp: "desc" },
    });

    await prisma.contributorHistory.createMany({
      data: previousHistory.map((hist) => ({
        docId: newDocIds[i],
        prevDocId: hist.prevDocId,
        prevDocVersionNum: hist.prevDocVersionNum,
        timestamp: hist.timestamp,
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
 * @param ownerId
 */
export async function getActivityEditorData(
  activityId: number,
  ownerId: number,
) {
  // TODO: is there a way to combine these queries and avoid any race condition?

  let isAssigned = (
    await prisma.content.findUniqueOrThrow({
      where: { id: activityId, isDeleted: false, ownerId, isFolder: false },
      select: { isAssigned: true },
    })
  ).isAssigned;

  type DoenetmlVersion = {
    id: number;
    displayedVersion: string;
    fullVersion: string;
    default: boolean;
    deprecated: boolean;
    removed: boolean;
    deprecationMessage: string;
  };

  let activity: {
    name: string;
    imagePath: string | null;
    isAssigned: boolean;
    classCode: string | null;
    codeValidUntil: Date | null;
    isPublic: boolean;
    documents: {
      id: number;
      versionNum: number | null;
      name: string;
      source: string;
      doenetmlVersion: DoenetmlVersion;
    }[];
    stillOpen: boolean;
  };

  // TODO: add pagination or a hard limit in the number of documents one can add to an activity

  if (isAssigned) {
    let assignedActivity = await prisma.content.findUniqueOrThrow({
      where: { id: activityId, isDeleted: false, ownerId, isFolder: false },
      select: {
        name: true,
        imagePath: true,
        isAssigned: true,
        classCode: true,
        codeValidUntil: true,
        isPublic: true,
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
      },
    });

    activity = {
      name: assignedActivity.name,
      imagePath: assignedActivity.imagePath,
      isAssigned: assignedActivity.isAssigned,
      classCode: assignedActivity.classCode,
      codeValidUntil: assignedActivity.codeValidUntil,
      isPublic: assignedActivity.isPublic,
      documents: assignedActivity.documents.map((doc) => ({
        id: doc.id,
        versionNum: doc.assignedVersion!.versionNum,
        name: doc.name,
        source: doc.assignedVersion!.source,
        doenetmlVersion: doc.assignedVersion!.doenetmlVersion,
      })),
      stillOpen: assignedActivity.codeValidUntil
        ? DateTime.now() <= DateTime.fromJSDate(assignedActivity.codeValidUntil)
        : false,
    };
  } else {
    let unassignedActivity = await prisma.content.findUniqueOrThrow({
      where: { id: activityId, isDeleted: false, ownerId, isFolder: false },
      select: {
        name: true,
        imagePath: true,
        isAssigned: true,
        classCode: true,
        codeValidUntil: true,
        isPublic: true,
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
      },
    });

    activity = {
      ...unassignedActivity,
      documents: unassignedActivity.documents.map((doc) => ({
        ...doc,
        versionNum: null,
      })),
      stillOpen: false,
    };
  }

  return activity;
}

// TODO: generalize this to multi-document activities
export async function getActivityViewerData(
  activityId: number,
  userId: number,
) {
  const activity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      OR: [{ ownerId: userId }, { isPublic: true }],
    },
    select: {
      id: true,
      name: true,
      owner: { select: { userId: true, email: true, name: true } },
      documents: {
        where: { isDeleted: false },
        select: {
          id: true,
          source: true,
          doenetmlVersion: {
            select: { fullVersion: true },
          },
        },
      },
    },
  });
  const docId = activity.documents[0].id;

  let doc = await prisma.documents.findUniqueOrThrow({
    where: { id: docId, isDeleted: false },
    include: {
      contributorHistory: {
        include: {
          prevDoc: {
            select: {
              document: {
                select: {
                  activity: {
                    select: {
                      id: true,
                      name: true,
                      owner: {
                        select: { userId: true, email: true, name: true },
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

  return {
    activity,
    doc,
  };
}

export async function getAssignmentDataFromCode(
  code: string,
  signedIn: boolean,
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
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        assignmentFound: false,
        newAnonymousUser: null,
        assignment: null,
      };
    } else {
      throw e;
    }
  }

  let newAnonymousUser = signedIn ? null : await createAnonymousUser();

  return { assignmentFound: true, newAnonymousUser, assignment };
}

export async function searchPublicContent(query: string) {
  // TODO: how should we sort these?

  let query_words = query.split(" ");
  let content = await prisma.content.findMany({
    where: {
      AND: query_words.map((qw) => ({ name: { contains: "%" + qw + "%" } })),
      isPublic: true,
      isDeleted: false,
    },
    select: {
      id: true,
      isFolder: true,
      ownerId: true,
      name: true,
      imagePath: true,
      createdAt: true,
      lastEdited: true,
      owner: true,
    },
  });

  return content;
}

/**
 * Lists the content inside `folderId` where the user has an assignment score record.
 *
 * @param userId
 * @param folderId
 */
export async function listUserAssigned(userId: number) {
  const assignments = await prisma.content.findMany({
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
      createdAt: true,
      lastEdited: true,
      isPublic: true,
      isAssigned: true,
      classCode: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const user = await prisma.users.findUniqueOrThrow({
    where: { userId },
    select: { userId: true, name: true },
  });

  return {
    assignments,
    user,
  };
}

export async function findOrCreateUser(
  email: string,
  name: string,
  isAdmin = false,
) {
  const user = await prisma.users.findUnique({ where: { email } });
  if (user) {
    return user;
  } else {
    return createUser(email, name, isAdmin);
  }
}

export async function createUser(
  email: string,
  name: string,
  isAdmin: boolean,
) {
  const result = await prisma.users.create({ data: { email, name, isAdmin } });
  return result;
}

export async function createAnonymousUser() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const random_number = array[0];
  const name = ``;
  const email = `anonymous${random_number}@example.com`;
  const result = await prisma.users.create({
    data: { email, name, anonymous: true },
  });

  return result;
}

export async function getUserInfo(email: string) {
  const user = await prisma.users.findUniqueOrThrow({
    where: { email },
    select: { userId: true, email: true, name: true, anonymous: true },
  });
  return user;
}

export async function updateUser({
  userId,
  name,
}: {
  userId: number;
  name: string;
}) {
  const user = await prisma.users.update({
    where: { userId },
    data: { name },
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
          name: true,
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

  const { promotedGroupId } = await prisma.promotedContentGroups.create({
    data: {
      groupName,
      sortOrder: "a",
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

export async function loadPromotedContent(userId: number) {
  const isAdmin = userId ? await getIsAdmin(userId) : false;
  let content = await prisma.promotedContentGroups.findMany({
    where: {
      // If admin, also include groups not featured
      currentlyFeatured: isAdmin ? undefined : true,
    },
    orderBy: {
      sortOrder: "desc",
    },
    select: {
      groupName: true,
      promotedGroupId: true,
      currentlyFeatured: true,
      homepage: true,

      promotedContent: {
        select: {
          sortOrder: true,
          activity: {
            select: {
              id: true,
              name: true,
              imagePath: true,

              owner: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
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
          owner: promoted.activity.owner.name,
          sortOrder: promoted.sortOrder,
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

  await prisma.promotedContent.create({
    data: {
      activityId,
      promotedGroupId: groupId,
      sortOrder: "1",
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

  for (let doc of origActivity.documents) {
    let docVersion = await createDocumentVersion(doc.id);
    await prisma.documents.update({
      where: { id: doc.id },
      data: { assignedVersionNum: docVersion.versionNum },
    });
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

function generateClassCode() {
  return ("00000" + Math.floor(Math.random() * 1000000)).slice(-6);
}

export async function openAssignmentWithCode(
  activityId: number,
  closeAt: DateTime,
  ownerId: number,
) {
  let classCode = (
    await prisma.content.findUniqueOrThrow({
      where: { id: activityId, ownerId, isAssigned: true, isFolder: false },
      select: { classCode: true },
    })
  ).classCode;

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

export async function closeAssignmentWithCode(
  activityId: number,
  ownerId: number,
) {
  await prisma.content.update({
    where: { id: activityId, ownerId, isAssigned: true, isFolder: false },
    data: {
      codeValidUntil: null,
    },
  });
}

// Note: this function returns `sortIndex` (which is a bigint)
// so the data shouldn't be sent unchanged to the response
export async function getAssignment(activityId: number, ownerId: number) {
  let assignment = await prisma.content.findUniqueOrThrow({
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
            select: { name: true, userId: true },
          },
          score: true,
        },
        orderBy: { user: { name: "asc" } },
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
      user: { select: { name: true } },
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
          name: true,
        },
      },
    },
  });

  return { orderedActivities, assignmentScores };
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
      name: true,
    },
  });

  let orderedActivityScores;

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
  }

  return { userData, orderedActivityScores };
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
    select: { userId: true, name: true },
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
    SELECT "docId", "docVersionNum", "answerId", "answerNumber", 
    COUNT("userId") as "count", AVG("maxCredit") as "averageCredit"
    FROM (
      SELECT "activityId", "docId", "docVersionNum", "answerId", "answerNumber", "userId", MAX("creditAchieved") as "maxCredit"
      FROM "documentSubmittedResponses"
      WHERE "activityId" = ${activityId}
      GROUP BY "activityId", "docId", "docVersionNum", "answerId", "answerNumber", "userId" 
    ) as "dsr"
    INNER JOIN "content" on "dsr"."activityId" = "content"."id" 
    WHERE "content"."id"=${activityId} and "ownerId" = ${ownerId} and "isAssigned"=true and "isFolder"=false
    GROUP BY "docId", "docVersionNum", "answerId", "answerNumber"
    ORDER BY "answerNumber"
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
  let rawResponses = await prisma.$queryRaw<
    {
      userId: number;
      userName: string;
      response: string;
      creditAchieved: number;
      submittedAt: DateTime;
      maxCredit: number;
      numResponses: bigint;
    }[]
  >(Prisma.sql`
select "dsr"."userId", "users"."name" AS "userName", "response", "creditAchieved", "submittedAt",
    	MAX("creditAchieved") over (partition by "dsr"."userId") as "maxCredit",
    	COUNT("creditAchieved") over (partition by "dsr"."userId") as "numResponses"
    	from "documentSubmittedResponses" as dsr
      INNER JOIN "content" on "dsr"."activityId" = "content"."id" 
      INNER JOIN "users" on "dsr"."userId" = "users"."userId" 
      WHERE "content"."id"=${activityId} and "ownerId" = ${ownerId} and "isAssigned"=true and "isFolder"=false
    	and "docId" = ${docId} and "docVersionNum" = ${docVersionNum} and "answerId" = ${answerId}
    	order by "dsr"."userId" asc, "submittedAt" desc
  `);

  let submittedResponses = [];
  let newResponse;
  let lastUserId = 0;

  for (let respObj of rawResponses) {
    if (respObj.userId > lastUserId) {
      lastUserId = respObj.userId;
      if (newResponse) {
        submittedResponses.push(newResponse);
      }
      newResponse = {
        userId: respObj.userId,
        userName: respObj.userName,
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
  let submittedResponses = await prisma.documentSubmittedResponses.findMany({
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
      user: { select: { userId: true, name: true } },
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

export async function getFolderContent({
  ownerId,
  folderId,
  loggedInUserId,
}: {
  ownerId: number;
  folderId: number | null;
  loggedInUserId: number;
}) {
  const notMe = ownerId !== loggedInUserId;

  if (folderId !== null) {
    // if ask for a folder, make sure it exists and is allowed to be seen
    await prisma.content.findUniqueOrThrow({
      where: {
        ownerId,
        id: folderId,
        isDeleted: false,
        isPublic: notMe ? true : undefined,
      },
      select: { id: true },
    });
  }

  const content = await prisma.content.findMany({
    where: {
      ownerId,
      isDeleted: false,
      isPublic: notMe ? true : undefined,
      parentFolderId: folderId,
    },
    select: {
      id: true,
      isFolder: true,
      ownerId: true,
      name: true,
      imagePath: true,
      createdAt: true,
      lastEdited: true,
      isPublic: true,
      isAssigned: true,
      documents: { select: { id: true, doenetmlVersion: true } },
    },
    orderBy: { sortIndex: "asc" },
  });

  const user = await prisma.users.findUniqueOrThrow({
    where: { userId: ownerId },
    select: { name: true },
  });

  return {
    content,
    name: user.name,
    notMe,
  };
}
