import { ContentType, Prisma } from "@prisma/client";
import { prisma } from "../model";
import { LicenseCode } from "../types";
import {
  filterEditableContent,
  filterViewableContent,
} from "../utils/permissions";
import { isEqualUUID } from "../utils/uuid";
import { getIsAdmin, getLibraryAccountId, mustBeAdmin } from "./curate";
import {
  getNextSortIndexForParent,
  ShiftIndicesCallbackFunction,
  SORT_INCREMENT,
} from "../utils/sort";
import { modifyContentSharedWith, setContentIsPublic } from "./share";
import { createActivityRevision } from "./activity";

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
  loggedInUserId,
  inLibrary = false,
}: {
  id: Uint8Array;
  desiredParentId: Uint8Array | null;
  desiredPosition: number;
  loggedInUserId: Uint8Array;
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
      ...filterEditableContent(ownerId),
    },
    select: { id: true, type: true, licenseCode: true },
  });

  let desiredParentIsPublic = false;
  let desiredParentLicenseCode: LicenseCode = "CCDUAL";
  let desiredParentShares: Uint8Array[] = [];

  if (desiredParentId !== null) {
    // if desired parent is specified, make sure it exists and is owned by `ownerId`
    const parent = await prisma.content.findUniqueOrThrow({
      where: {
        id: desiredParentId,
        type: { not: "singleDoc" },
        ...filterEditableContent(ownerId),
      },
      select: {
        isPublic: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
      },
    });

    // If the parent is shared, then we'll need to share the resulting content, as well.
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

    if (content.type !== "singleDoc") {
      // if content has children and we're moving it to another parent,
      // make sure that parent is not the content or a descendant of the content

      if (isEqualUUID(desiredParentId, content.id)) {
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

      if (
        descendants.findIndex((sf) => isEqualUUID(sf.id, desiredParentId)) !==
        -1
      ) {
        throw Error("Cannot move content into a descendant of itself");
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

  const data =
    content.licenseCode === undefined
      ? {
          sortIndex: newSortIndex,
          parentId: desiredParentId,
          // content did not have a license code before,
          // use license from parent
          licenseCode: desiredParentLicenseCode,
        }
      : {
          sortIndex: newSortIndex,
          parentId: desiredParentId,
        };

  // Move the item!
  await prisma.content.update({
    where: { id },
    data,
  });

  if (desiredParentIsPublic) {
    await setContentIsPublic({
      id: content.id,
      loggedInUserId: ownerId,
      isPublic: true,
    });
  }

  if (desiredParentShares.length > 0) {
    await modifyContentSharedWith({
      action: "share",
      id: content.id,
      loggedInUserId: ownerId,
      users: desiredParentShares,
    });
  }
}

/**
 * Copy the content `origId` to `desiredParentId` (or the base folder of `loggedInUserId` if `null).
 * If `prependCopy` is `true`, prepend the phrase "Copy of" to the name
 * of `origID` when copying (though do not prepend "Copy of" to it descendants).
 *
 * If any content (either `origId` or a descendant) is shared, then all of its descendants
 * will be shared with the same users. The descendants will use the license of their corresponding
 * original content (falling back to the license of the parent only if they don't have a license specified).
 *
 * If `origId` is an activity, adds it and its contributor history to the contributor history of the new activity.
 *
 * The parameter `desiredParentId`, if not `null`, must be existing content which is owned by `userId` or,
 * if the user is an admin, an existing _library_ folder.
 *
 * If `desiredParentId` is a content type (`select` or `sequence`) that cannot be a parent of `origId`,
 * then instead copy the children of `origId` into `desiredParentId`.
 *
 * Returns a list of the ids of new children of `desiredParentId`.
 * Typically, this list would contain one id: the id of the copy of `origId`.
 * However, if its children were copied instead, the list could be longer.
 *
 * Throws an error if `loggedInUserId` doesn't have read access to `origId`
 * or write access to `desiredParentId`.
 */
export async function copyContent(
  origId: Uint8Array,
  loggedInUserId: Uint8Array,
  desiredParentId: Uint8Array | null,
  prependCopy = false,
) {
  const isAdmin = await getIsAdmin(loggedInUserId);

  // make sure content exists and is viewable by `loggedInUserId`
  // and collect all the data that we will need to copy
  const originalContent = await prisma.content.findUniqueOrThrow({
    where: {
      id: origId,
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
      isAssigned: true,
      assignedRevisionNum: true,
      classCode: true,
      codeValidUntil: true,
    },
    include: {
      classifications: true,
      contentFeatures: true,
      children: {
        where: { isDeleted: false },
        select: { id: true, type: true },
      },
    },
  });

  let desiredParentIsPublic = false;
  let desiredParentLicenseCode: LicenseCode = "CCDUAL";
  let desiredParentShares: Uint8Array[] = [];
  let desiredParentType: ContentType = "folder";

  if (desiredParentId !== null) {
    // if desired parent is specified, make sure it exists and is editable by `loggedInUserId`
    const parent = await prisma.content.findUniqueOrThrow({
      where: {
        id: desiredParentId,
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

    // if content has children and we're copying it to another parent,
    // make sure that parent is not the content or a descendant of the content

    if (isEqualUUID(desiredParentId, origId)) {
      throw Error("Cannot copy content into itself");
    }

    const subfolders = await prisma.$queryRaw<
      {
        id: Uint8Array;
      }[]
    >(Prisma.sql`
        WITH RECURSIVE folder_tree(id) AS (
          SELECT id FROM content
          WHERE parentId = ${origId} AND type != "singleDoc"
          UNION ALL
          SELECT c.id FROM content AS c
          INNER JOIN folder_tree AS ct
          ON c.parentId = ct.id
          WHERE c.type != "singleDoc"
        )

        SELECT * FROM folder_tree
        `);

    if (
      subfolders.findIndex((sf) => isEqualUUID(sf.id, desiredParentId)) !== -1
    ) {
      throw Error("Cannot copy content into a descendant of itself");
    }
  }

  const sortIndex = await getNextSortIndexForParent(
    loggedInUserId,
    desiredParentId,
  );

  // if `originalContent` is not allowed to be a child of `desiredParentId`,
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
      const contentIds = await copyContent(
        child.id,
        loggedInUserId,
        desiredParentId,
        false,
      );
      newIds.push(...contentIds);
    }
    return newIds;
  } else {
    // Duplicate the content itself and make it a child of `desiredParentId`.

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
        parentId: desiredParentId,
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
        origId,
        newContent.id,
        licenseCode,
        loggedInUserId,
      );
    }

    for (const child of children) {
      await copyContent(child.id, loggedInUserId, newContent.id, false);
    }

    return [newContent.id];
  }
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
      activityId: copiedId,
      prevActivityId: originalId,
      prevActivityRevisionNum: originalActivityRevision.revisionNum,
      withLicenseCode: licenseCode,
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
      activityId: originalId,
    },
  });

  // Note: contributorHistory has two timestamps:
  // - timestampPrevActivity: the time when prevActivityId was remixed into a new activity
  // - timestampActivity: this time when activityId was created by remixing
  // Each record we create below corresponds to an indirect path from prevActivityId to activityId
  // so the two timestamps will be different:
  // - timestampPrevActivity is copied from the original source to get the original remix time from prevActivityId
  // - timestampActivity is copied from the above create query (so is essentially now)

  await prisma.contributorHistory.createMany({
    data: previousHistory.map((hist) => ({
      activityId: copiedId,
      prevActivityId: hist.prevActivityId,
      prevActivityRevisionNum: hist.prevActivityRevisionNum,
      withLicenseCode: hist.withLicenseCode,
      timestampPrevActivity: hist.timestampPrevActivity,
      timestampActivity: timestampActivity,
    })),
  });
}

/**
 * Check if `contentId` has any descendants of type `contentType`.
 */
export async function checkIfContentContains(
  contentId: Uint8Array | null,
  contentType: ContentType,
  loggedInUserId: Uint8Array,
) {
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
    return true;
  }

  for (const child of children) {
    if (child.type !== "singleDoc") {
      if (await checkIfContentContains(child.id, contentType, loggedInUserId)) {
        return true;
      }
    }
  }

  return false;
}
