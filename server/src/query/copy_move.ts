import { ContentType, Prisma } from "@prisma/client";
import { prisma } from "../model";
import { LicenseCode } from "../types";
import {
  filterEditableContent,
  filterViewableContent,
} from "../utils/permissions";
import { isEqualUUID } from "../utils/uuid";
import { getIsAdmin } from "./curate";
import {
  calculateNewSortIndex,
  getNextSortIndexForParent,
  ShiftIndicesCallbackFunction,
} from "../utils/sort";
import { modifyContentSharedWith, setContentIsPublic } from "./share";
import { createActivityRevision, createContent } from "./activity";
import { InvalidRequestError } from "../utils/error";
import { recordRecentContent } from "./stats";

/**
 * Move the content with `id` to position `desiredPosition` in the folder `parentId`
 * (where an undefined `parentId` indicates the root folder of `ownerId`).
 *
 * `desiredPosition` is the 0-based index in the array of content with parent folder `parentId`
 * and owner `ownerId` sorted by `sortIndex`.
 *
 * For the library, content must be public before it is moved inside a public parent. We don't allow implicit publishing of curated content.
 */
export async function moveContent({
  contentId,
  parentId,
  desiredPosition,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  parentId: Uint8Array | null;
  desiredPosition: number;
  loggedInUserId: Uint8Array;
}) {
  if (!Number.isInteger(desiredPosition)) {
    throw Error("desiredPosition must be an integer");
  }

  const isAdmin = await getIsAdmin(loggedInUserId);

  // make sure content exists and is editable by `ownerId`
  const content = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterEditableContent(loggedInUserId, isAdmin),
    },
    select: {
      id: true,
      type: true,
      licenseCode: true,
      owner: {
        select: {
          userId: true,
          isLibrary: true,
        },
      },
      isPublic: true,
    },
  });

  let desiredParentIsPublic = false;
  let desiredParentLicenseCode: LicenseCode = "CCDUAL";
  let desiredParentShares: Uint8Array[] = [];

  if (parentId !== null) {
    // if desired parent is specified, make sure it exists and is owned by the same owner as the content
    const parent = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        type: { not: "singleDoc" },

        // NOTE: We don't use `filterEditableContent` because the owner must match exactly. We cannot move between admin's folders and library
        ownerId: content.owner.userId,
        isDeleted: false,
      },
      select: {
        isPublic: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
      },
    });

    // If the parent is shared, then we'll need to share the resulting content, as well.
    if (parent.isPublic) {
      if (content.owner.isLibrary && !content.isPublic) {
        throw new InvalidRequestError(
          "Cannot move draft from library to published folder/activity",
        );
      }
      desiredParentIsPublic = true;
      if (parent.licenseCode) {
        desiredParentLicenseCode = parent.licenseCode as LicenseCode;
      }
    }
    if (parent.sharedWith.length > 0) {
      desiredParentShares = parent.sharedWith.map((cs) => cs.userId);
      if (parent.licenseCode) {
        desiredParentLicenseCode = parent.licenseCode as LicenseCode;
      }
    }

    if (content.type !== "singleDoc") {
      // if content has children and we're moving it to another parent,
      // make sure that parent is not the content or a descendant of the content

      if (isEqualUUID(parentId, content.id)) {
        throw Error("Cannot move content into itself");
      }

      const descendants = await prisma.$queryRaw<
        {
          id: Uint8Array;
        }[]
      >(Prisma.sql`
        WITH RECURSIVE content_tree(id) AS (
          SELECT id FROM content
          WHERE parentId = ${content.id} AND type != "singleDoc" 
          UNION ALL
          SELECT c.id FROM content AS c
          INNER JOIN content_tree AS ct
          ON c.parentId = ct.id
          WHERE c.type != "singleDoc"
        )

        SELECT * FROM content_tree
        `);

      if (descendants.findIndex((sf) => isEqualUUID(sf.id, parentId)) !== -1) {
        throw Error("Cannot move content into a descendant of itself");
      }
    }
  }

  // find the sort indices of all content in folder other than moved content
  const currentSortIndices = (
    await prisma.content.findMany({
      where: {
        ownerId: content.owner.userId,
        parentId: parentId,
        id: { not: contentId },
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
        ownerId: content.owner.userId,
        parentId: parentId,
        id: { not: contentId },
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

  const data =
    content.licenseCode === undefined
      ? {
          sortIndex: newSortIndex,
          parentId: parentId,
          // content did not have a license code before,
          // use license from parent
          licenseCode: desiredParentLicenseCode,
        }
      : {
          sortIndex: newSortIndex,
          parentId: parentId,
        };

  // Move the item!
  await prisma.content.update({
    where: { id: contentId },
    data,
  });

  if (desiredParentIsPublic) {
    await setContentIsPublic({
      contentId: content.id,
      loggedInUserId,
      isPublic: true,
    });
  }

  if (desiredParentShares.length > 0) {
    await modifyContentSharedWith({
      action: "share",
      contentId: content.id,
      loggedInUserId,
      users: desiredParentShares,
    });
  }
}

/**
 * Copy the content from the `contentIds` array to `parentId`
 * (or the base folder of `loggedInUserId` if `parentId` is `null`).
 * If `prependCopy` is `true`, prepend the phrase "Copy of" to the name
 * of content when copying (though do not prepend "Copy of" to it descendants).
 *
 * If any content (either from `contentIds` or a descendant) is shared, then all of its descendants
 * will be shared with the same users. The descendants will use the license of their corresponding
 * original content (falling back to the license of the parent only if they don't have a license specified).
 *
 * If a content from `contentIds` is an activity,
 * add it and its contributor history to the contributor history of the new activity.
 *
 * The parameter `parentId`, if not `null`, must be existing content which is owned by `userId` or,
 * if the user is an admin, an existing _library_ folder.
 *
 * If `parentId` is a content type (`select` or `sequence`) that cannot be a parent of `origId`,
 * then instead copy the children of `origId` into `parentId`.
 *
 * Returns a list of the ids of new children of `parentId`.
 * Typically, this list would contain one id for each id in `contentId` (the id of its copy).
 * However, if a content's children were copied instead of itself, the list could be longer.
 *
 * Throws an error if `loggedInUserId` doesn't have read access to `contentIds`
 * or write access to `parentId`.
 */
export async function copyContent({
  contentIds,
  loggedInUserId,
  parentId,
  prependCopy = false,
}: {
  contentIds: Uint8Array[];
  loggedInUserId: Uint8Array;
  parentId: Uint8Array | null;
  prependCopy?: boolean;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);

  // make sure all content exists and is viewable by `loggedInUserId`

  const visibleContentIds = await prisma.content.findMany({
    where: {
      id: { in: contentIds },
      ...filterViewableContent(loggedInUserId, isAdmin),
    },
    select: { id: true },
  });

  if (visibleContentIds.length < contentIds.length) {
    throw new InvalidRequestError("Content not found or not visible");
  }

  let desiredParentIsPublic = false;
  let desiredParentLicenseCode: LicenseCode = "CCDUAL";
  let desiredParentShares: Uint8Array[] = [];
  let desiredParentType: ContentType = "folder";

  if (parentId !== null) {
    // if desired parent is specified, make sure it exists and is editable by `loggedInUserId`
    const parent = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        type: { not: "singleDoc" },
        ...filterEditableContent(loggedInUserId, isAdmin),
      },
      select: {
        isPublic: true,
        type: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
      },
    });

    desiredParentType = parent.type;

    // If the parent folder is public/shared, then we'll need to share the resulting content, as well
    if (parent.isPublic) {
      desiredParentIsPublic = true;
      if (parent.licenseCode) {
        desiredParentLicenseCode = parent.licenseCode as LicenseCode;
      }
    }
    if (parent.sharedWith.length > 0) {
      desiredParentShares = parent.sharedWith.map((cs) => cs.userId);
      if (parent.licenseCode) {
        desiredParentLicenseCode = parent.licenseCode as LicenseCode;
      }
    }

    for (const contentId of contentIds) {
      // if content has children and we're copying it to another parent,
      // make sure that parent is not the content or a descendant of the content

      if (isEqualUUID(parentId, contentId)) {
        throw new InvalidRequestError("Cannot copy content into itself");
      }

      const subfolders = await prisma.$queryRaw<
        {
          id: Uint8Array;
        }[]
      >(Prisma.sql`
        WITH RECURSIVE folder_tree(id) AS (
          SELECT id FROM content
          WHERE parentId = ${contentId} AND type != "singleDoc"
          UNION ALL
          SELECT c.id FROM content AS c
          INNER JOIN folder_tree AS ct
          ON c.parentId = ct.id
          WHERE c.type != "singleDoc"
        )

        SELECT * FROM folder_tree
        `);

      if (subfolders.findIndex((sf) => isEqualUUID(sf.id, parentId)) !== -1) {
        throw new InvalidRequestError(
          "Cannot copy content into a descendant of itself",
        );
      }
    }
  }

  const newContentIds: Uint8Array[] = [];

  for (const contentId of contentIds) {
    newContentIds.push(
      ...(await copySingleContent({
        loggedInUserId,
        contentId,
        parentId,
        prependCopy,
        isAdmin,
        desiredParentIsPublic,
        desiredParentLicenseCode,
        desiredParentShares,
        desiredParentType,
      })),
    );
  }

  if (parentId) {
    await recordRecentContent(loggedInUserId, "edit", parentId);
  }

  return { newContentIds };
}

async function copySingleContent({
  contentId,
  loggedInUserId,
  parentId,
  prependCopy,
  isAdmin,
  desiredParentIsPublic,
  desiredParentLicenseCode,
  desiredParentShares,
  desiredParentType,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  parentId: Uint8Array | null;
  prependCopy: boolean;
  isAdmin: boolean;
  desiredParentIsPublic: boolean;
  desiredParentLicenseCode: LicenseCode;
  desiredParentShares: Uint8Array[];
  desiredParentType: ContentType;
}) {
  // collect all the data that we will need to copy
  const originalContent = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterViewableContent(loggedInUserId, isAdmin),
    },
    omit: {
      id: true,
      ownerId: true,
      parentId: true,
      isPublic: true,
      isDeleted: true,
      createdAt: true,
      sortIndex: true,
      lastEdited: true,
      assignmentId: true,
    },
    include: {
      classifications: true,
      contentFeatures: true,
      children: {
        where: { isDeleted: false },
        select: { id: true, type: true },
        orderBy: { sortIndex: "asc" },
      },
    },
  });

  const sortIndex = await getNextSortIndexForParent(loggedInUserId, parentId);

  // if `originalContent` is not allowed to be a child of `parentId`,
  // then copy the children of `originalContent` rather than the content itself

  const copyJustChildren =
    (desiredParentType === "sequence" &&
      (originalContent.type === "sequence" ||
        originalContent.type === "folder")) ||
    (desiredParentType === "select" && originalContent.type !== "singleDoc");

  if (copyJustChildren) {
    const newIds: Uint8Array[] = [];

    // copy just the children of originalContent into `desireParentId`
    for (const child of originalContent.children) {
      const contentIds = await copySingleContent({
        contentId: child.id,
        loggedInUserId,
        parentId,
        prependCopy: false,
        isAdmin,
        desiredParentIsPublic,
        desiredParentLicenseCode,
        desiredParentShares,
        desiredParentType,
      });
      newIds.push(...contentIds);
    }
    return newIds;
  } else {
    // Duplicate the content itself and make it a child of `parentId`.

    const {
      children,
      contentFeatures,
      classifications,
      licenseCode: originalLicenseCode,
      ...originalFieldsToCopy
    } = originalContent;
    originalFieldsToCopy.name =
      (prependCopy ? "Copy of " : "") + originalFieldsToCopy.name;

    const licenseCode = originalLicenseCode ?? desiredParentLicenseCode;

    const newContent = await prisma.content.create({
      data: {
        ownerId: loggedInUserId,
        parentId: parentId,
        sortIndex,
        isPublic: desiredParentIsPublic,
        licenseCode,
        classifications: {
          create: classifications.map((c) => ({
            classificationId: c.classificationId,
          })),
        },
        contentFeatures: {
          connect: contentFeatures.map((cf) => ({ id: cf.id })),
        },
        sharedWith: {
          create: desiredParentShares.map((u) => ({ userId: u })),
        },
        ...originalFieldsToCopy,
      },
    });

    if (originalContent.type !== "folder") {
      await createContributorHistory(
        contentId,
        newContent.id,
        licenseCode,
        loggedInUserId,
      );
    }

    for (const child of children) {
      await copySingleContent({
        contentId: child.id,
        loggedInUserId,
        parentId: newContent.id,
        prependCopy: false,
        isAdmin,
        desiredParentIsPublic,
        desiredParentLicenseCode,
        desiredParentShares,
        desiredParentType,
      });
    }

    return [newContent.id];
  }
}

/**
 * Create a new content item of type `contentType` inside parent `parentId`
 * (or the base folder of `loggedInUserId` if `parentId` is `null`).
 * Then copy the content from `childSourceContentIds` into the new content.
 *
 * Record that the new content has been recently viewed by `loggedInUserId`.
 *
 * Returns (a promise that resolves to):
 * - newChildContentIds: the ids of the content copied from `childSourceContentIds`
 * - newContentId: the id of the new content created that is now the parent of `newContentId`
 * - newContentName: the name of the content with id `newParentId`
 */
export async function createContentCopyInChildren({
  loggedInUserId,
  childSourceContentIds,
  parentId,
  contentType,
}: {
  loggedInUserId: Uint8Array;
  childSourceContentIds: Uint8Array[];
  parentId: Uint8Array | null;
  contentType: ContentType;
}) {
  if (contentType === "singleDoc") {
    throw new InvalidRequestError("Cannot copy content into a Document");
  }

  const { contentId, name } = await createContent({
    loggedInUserId,
    contentType,
    parentId: parentId,
  });

  const { newContentIds: newChildContentIds } = await copyContent({
    contentIds: childSourceContentIds,
    loggedInUserId,
    parentId: contentId,
  });

  await recordRecentContent(loggedInUserId, "edit", contentId);

  return { newChildContentIds, newContentId: contentId, newContentName: name };
}

/**
 * Create entries in the `contributorHistory` table that record the fact that
 * `copiedId` was copied from `originalId` using `licenseCode`.
 *
 * An activity revision snapshot of `originalId` is taken, if it doesn't already exist,
 * and that revision is used to record which revision of `originalId` was copied.
 *
 * The contributor history of `originalId` is added to the contributor history of `copiedId`.
 */
async function createContributorHistory(
  originalId: Uint8Array,
  copiedId: Uint8Array,
  licenseCode: string,
  loggedInUserId: Uint8Array,
) {
  const originalActivityRevision = await createActivityRevision(
    originalId,
    loggedInUserId,
  );

  // First, create the record of `copiedId` being copied from
  // `originalId`, with revision given by `originalActivityRevision`
  const contribHistoryInfo = await prisma.contributorHistory.create({
    data: {
      contentId: copiedId,
      prevContentId: originalId,
      prevActivityRevisionNum: originalActivityRevision.revisionNum,
      withLicenseCode: licenseCode,
      directCopy: true,
    },
  });

  // we'll need the timestamp from this new record
  // to copy to additional records created
  const timestampActivity = contribHistoryInfo.timestampActivity;

  // Next, we grab all records from the history of `originalId`.
  // We will create records showing that these activities
  // are now in the history of `copiedId`.
  // We will create new records in the database
  // (rather than just linking to the records from `originalId`)
  // so that this history is fixed even if `originalId`
  // (or its predecessors) are modified to change their history
  const previousHistory = await prisma.contributorHistory.findMany({
    where: {
      contentId: originalId,
    },
  });

  // Note: contributorHistory has two timestamps:
  // - timestampPrevActivity: the time when prevContentId was remixed into a new activity
  // - timestampActivity: this time when contentId was created by remixing
  // Each record we create below corresponds to an indirect path from prevContentId to contentId
  // so the two timestamps will be different:
  // - timestampPrevActivity is copied from the original source to get the original remix time from prevContentId
  // - timestampActivity is copied from the above create query (so is essentially now)

  await prisma.contributorHistory.createMany({
    data: previousHistory.map((hist) => ({
      contentId: copiedId,
      prevContentId: hist.prevContentId,
      prevActivityRevisionNum: hist.prevActivityRevisionNum,
      withLicenseCode: hist.withLicenseCode,
      timestampPrevActivity: hist.timestampPrevActivity,
      timestampActivity: timestampActivity,
      directCopy: false,
    })),
  });
}

/**
 * Check if `contentId` has any descendants of type `contentType`.
 */
export async function checkIfContentContains({
  contentId,
  contentType,
  loggedInUserId,
}: {
  contentId: Uint8Array | null;
  contentType: ContentType;
  loggedInUserId: Uint8Array;
}) {
  // Note: not sure how to perform this calculation efficiently. Do we need to cache these values instead?
  // Would it be better to do a single recursive query rather than recurse will individual queries
  // even though we may be able to short circuit with an early return?

  const children = await prisma.content.findMany({
    where: {
      parentId: contentId,
      ...filterEditableContent(loggedInUserId),
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (children.map((c) => c.type).includes(contentType)) {
    return { containsType: true };
  }

  for (const child of children) {
    if (child.type !== "singleDoc") {
      if (
        (
          await checkIfContentContains({
            contentId: child.id,
            contentType,
            loggedInUserId,
          })
        ).containsType
      ) {
        return { containsType: true };
      }
    }
  }

  return { containsType: false };
}
