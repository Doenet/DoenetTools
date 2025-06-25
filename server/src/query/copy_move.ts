import { ContentType, Prisma } from "@prisma/client";
import { prisma } from "../model";
import { LicenseCode, UserInfo } from "../types";
import {
  filterEditableContent,
  filterViewableContent,
} from "../utils/permissions";
import { isEqualUUID } from "../utils/uuid";
import { getIsEditor } from "./curate";
import {
  calculateNewSortIndex,
  getNextSortIndexForParent,
  ShiftIndicesCallbackFunction,
} from "../utils/sort";
import { modifyContentSharedWith, setContentIsPublic } from "./share";
import { createContentRevision, createContent } from "./activity";
import { InvalidRequestError } from "../utils/error";
import { recordRecentContent } from "./stats";
import { createFullName } from "../utils/names";

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

  const isEditor = await getIsEditor(loggedInUserId);

  // make sure content exists and is editable by `ownerId`
  const content = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterEditableContent(loggedInUserId, isEditor),
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
      parent: {
        select: {
          rootAssignment: { select: { assigned: true } },
          nonRootAssignment: { select: { assigned: true } },
        },
      },
    },
  });

  if (
    content.parent?.rootAssignment?.assigned ||
    content.parent?.nonRootAssignment?.assigned
  ) {
    throw new InvalidRequestError(
      "Cannot move content in an assigned activity",
    );
  }

  let desiredParentIsPublic = false;
  let desiredParentLicenseCode: LicenseCode = "CCDUAL";
  let desiredParentShares: Uint8Array[] = [];

  if (parentId !== null) {
    // if desired parent is specified, make sure it exists, is owned by the same owner as the content,
    // and isn't assigned
    const parent = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        type: { not: "singleDoc" },

        // NOTE: We don't use `filterEditableContent` because the owner must match exactly. We cannot move between editor's folders and library
        ownerId: content.owner.userId,
        isDeletedOn: null,
      },
      select: {
        isPublic: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
        rootAssignment: { select: { assigned: true } },
        nonRootAssignment: { select: { assigned: true } },
      },
    });

    if (parent.rootAssignment?.assigned || parent.nonRootAssignment?.assigned) {
      throw new InvalidRequestError(
        "Cannot move content into an assigned activity",
      );
    }

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
        isDeletedOn: null,
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
        isDeletedOn: null,
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
 * if the user is an editor, an existing _library_ folder.
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
  const isEditor = await getIsEditor(loggedInUserId);

  // make sure all content exists and is viewable by `loggedInUserId`

  const visibleContentIds = await prisma.content.findMany({
    where: {
      id: { in: contentIds },
      ...filterViewableContent(loggedInUserId, isEditor),
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
    // if desired parent is specified, make sure it exists, is editable by `loggedInUserId`
    // and isn't assigned
    const parent = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        type: { not: "singleDoc" },
        ...filterEditableContent(loggedInUserId, isEditor),
      },
      select: {
        isPublic: true,
        type: true,
        licenseCode: true,
        sharedWith: { select: { userId: true } },
        rootAssignment: { select: { assigned: true } },
        nonRootAssignment: { select: { assigned: true } },
      },
    });

    if (parent.rootAssignment?.assigned || parent.nonRootAssignment?.assigned) {
      throw new InvalidRequestError(
        "Cannot copy content into an assigned activity",
      );
    }

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
        isEditor,
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
  isEditor,
  desiredParentIsPublic,
  desiredParentLicenseCode,
  desiredParentShares,
  desiredParentType,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  parentId: Uint8Array | null;
  prependCopy: boolean;
  isEditor: boolean;
  desiredParentIsPublic: boolean;
  desiredParentLicenseCode: LicenseCode;
  desiredParentShares: Uint8Array[];
  desiredParentType: ContentType;
}) {
  // collect all the data that we will need to copy
  const originalContent = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterViewableContent(loggedInUserId, isEditor),
    },
    omit: {
      id: true,
      ownerId: true,
      parentId: true,
      isPublic: true,
      isDeletedOn: true,
      createdAt: true,
      sortIndex: true,
      lastEdited: true,
      nonRootAssignmentId: true,
    },
    include: {
      owner: {
        omit: { email: true },
      },
      classifications: true,
      contentFeatures: true,
      children: {
        where: { isDeletedOn: null },
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
        isEditor,
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
      owner,
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
      await createContributorHistory({
        originContentId: contentId,
        remixContentId: newContent.id,
        licenseCode,
        loggedInUserId,
        originalName: originalContent.name,
        originalOwner: originalContent.owner,
      });
    }

    for (const child of children) {
      await copySingleContent({
        contentId: child.id,
        loggedInUserId,
        parentId: newContent.id,
        prependCopy: false,
        isEditor,
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
 * `remixContentId` was copied from `originContentId` using `licenseCode`.
 *
 * An activity revision snapshot of `originContentId` is taken, if it doesn't already exist,
 * and that revision is used to record which revision of `originContentId` was copied.
 *
 * The contributor history of `originContentId` is added to the contributor history of `remixContentId`.
 */
async function createContributorHistory({
  originContentId,
  remixContentId,
  licenseCode,
  loggedInUserId,
  originalName,
  originalOwner,
}: {
  originContentId: Uint8Array;
  remixContentId: Uint8Array;
  licenseCode: string;
  loggedInUserId: Uint8Array;
  originalName: string;
  originalOwner: UserInfo;
}) {
  // The revision for the origin is autogenerated as it is not caused by actions on `originContentId`.
  const originContentRevision = await createContentRevision({
    contentId: originContentId,
    loggedInUserId,
    revisionName: "Created due to being remixed",
    autoGenerated: true,
  });

  // The revision for the remix is manual, as it was caused by the author of `remixContentId`
  // and would be expected in the revision list.
  // But, set `renameMatching` to `false` to not rename if there already was a matching manual revision.
  const remixContentRevision = await createContentRevision({
    contentId: remixContentId,
    loggedInUserId,
    revisionName: "Initial save point",
    note: `Remixed from: ${originalName} by ${createFullName(originalOwner)}`,
    renameMatching: false,
  });

  // First, create the record of `remixContentId` with revision `remixContentRevision`
  // being copied from `originContentId` with revision `originalContentRevision`.
  // Since this is a new remix, both timestamps are set to the current time
  const contribHistoryInfo = await prisma.contributorHistory.create({
    data: {
      remixContentId,
      remixContentRevisionNum: remixContentRevision.revisionNum,
      originContentId,
      originContentRevisionNum: originContentRevision.revisionNum,
      withLicenseCode: licenseCode,
      directCopy: true,
    },
  });

  // we'll need the timestamp from this new record
  // to copy to additional records created
  const timestampRemixContent = contribHistoryInfo.timestampRemixContent;

  // Next, we grab all records from the history of `originContentId`.
  // We will create records showing that these activities
  // are now in the history of `remixContentId`.
  // We will create new records in the database
  // (rather than just linking to the records from `originContentId`)
  // so that this history is fixed even if `originContentId`
  // (or its predecessors) are modified to change their history
  const previousHistory = await prisma.contributorHistory.findMany({
    where: {
      remixContentId: originContentId,
    },
  });

  // Note: contributorHistory has two timestamps:
  // - timestampOriginContent: the time when originContentId was remixed into a new activity
  // - timestampRemixContent: this time when remixContentId was created by remixing
  // Each record we create below corresponds to an indirect path from originContentId to remixContentId
  // so the two timestamps will be different:
  // - timestampOriginContent is copied from the original source to get the original remix time from originContentId
  // - timestampRemixContent is copied from the above create query (so is essentially now)

  await prisma.contributorHistory.createMany({
    data: previousHistory.map((hist) => ({
      remixContentId,
      remixContentRevisionNum: remixContentRevision.revisionNum,
      originContentId: hist.originContentId,
      originContentRevisionNum: hist.originContentRevisionNum,
      withLicenseCode: hist.withLicenseCode,
      timestampOriginContent: hist.timestampOriginContent,
      timestampRemixContent: timestampRemixContent,
      directCopy: false,
    })),
  });
}

/**
 * Check if `contentId` has any descendants of type `contentType`.
 * Unless `countAssigned` is `true`, ignore any assigned descendants.
 */
export async function checkIfContentContains({
  contentId,
  contentType,
  loggedInUserId,
  countAssigned = false,
}: {
  contentId: Uint8Array | null;
  contentType: ContentType;
  loggedInUserId: Uint8Array;
  countAssigned?: boolean;
}) {
  // Note: not sure how to perform this calculation efficiently. Do we need to cache these values instead?
  // Would it be better to do a single recursive query rather than recurse will individual queries
  // even though we may be able to short circuit with an early return?

  const filterOutAssigned = countAssigned
    ? []
    : [
        {
          OR: [
            { rootAssignment: { is: null } },
            { rootAssignment: { assigned: false } },
          ],
        },
        {
          OR: [
            { nonRootAssignment: { is: null } },
            { nonRootAssignment: { assigned: false } },
          ],
        },
      ];

  const children = await prisma.content.findMany({
    where: {
      parentId: contentId,
      ...filterEditableContent(loggedInUserId),
      AND: filterOutAssigned,
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
            countAssigned,
          })
        ).containsType
      ) {
        return { containsType: true };
      }
    }
  }

  return { containsType: false };
}
