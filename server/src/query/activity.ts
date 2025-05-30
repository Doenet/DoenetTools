import { ContentType, Prisma } from "@prisma/client";
import { prisma } from "../model";
import { getIsAdmin, getLibraryAccountId, mustBeAdmin } from "./curate";
import {
  filterEditableActivity,
  filterEditableContent,
  filterViewableContent,
  getEarliestRecoverableDate,
} from "../utils/permissions";
import { getNextSortIndexForParent } from "../utils/sort";
import { DateTime } from "luxon";
import { cidFromText } from "../utils/cid";
import { getContent } from "./activity_edit_view";
import { compileActivityFromContent } from "../utils/contentStructure";
import { InvalidRequestError } from "../utils/error";

/**
 * Creates a new content of type `contentType` in `parentId` of `ownerId`,
 * putting the content in the base folder of `ownerId` if `parentId` is `null`.
 *
 * Places the content at the end of the parent.
 */
export async function createContent({
  loggedInUserId,
  contentType,
  parentId,
  inLibrary = false,
  name,
}: {
  loggedInUserId: Uint8Array;
  contentType: ContentType;
  parentId: Uint8Array | null;
  inLibrary?: boolean;
  name?: string;
}) {
  let ownerId = loggedInUserId;
  if (inLibrary) {
    await mustBeAdmin(loggedInUserId);
    ownerId = await getLibraryAccountId();
  }

  const sortIndex = await getNextSortIndexForParent(ownerId, parentId);

  const defaultDoenetmlVersion = await prisma.doenetmlVersions.findFirstOrThrow(
    {
      where: { default: true },
    },
  );

  let isPublic = false;
  let licenseCode = undefined;
  let sharedWith: Uint8Array[] = [];

  // If parent isn't `null`, check if it is shared and get its license,
  // and make sure it isn't assigned
  if (parentId !== null) {
    const parent = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        type: { not: "singleDoc" },
        isDeletedOn: null,
        ownerId,
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
        "Cannot add content to an assigned activity",
      );
    }

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

  if (!name) {
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
  }

  const content = await prisma.content.create({
    data: {
      ownerId,
      type: contentType,
      parentId,
      name,
      isPublic,
      licenseCode,
      sortIndex,
      source: contentType === "singleDoc" ? "" : null,
      doenetmlVersionId:
        contentType === "singleDoc" ? defaultDoenetmlVersion.id : null,
      sharedWith: {
        createMany: { data: sharedWith.map((userId) => ({ userId })) },
      },
    },
  });

  return { contentId: content.id, name: content.name };
}

/**
 * Delete the content `id` along with all the content inside it,
 * recursing to its children.
 * Throws error if content id does not exist
 */
export async function deleteContent({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  // TODO: Figure out how to delete folder in library (some contents may be published)

  // throw error if content does not exist or isn't visible or has parent that is assigned
  const content = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterEditableContent(loggedInUserId),
    },
    select: {
      id: true,
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
      "Cannot delete content from an assigned activity",
    );
  }

  const isDeletedOn = new Date();

  // Delete descendants
  const ids = await getDescendantIds(contentId);
  const deleteDescendants = prisma.content.updateMany({
    where: { id: { in: ids } },
    data: { isDeletedOn, deletionRootId: contentId },
  });
  // Delete the root content
  const deleteRoot = prisma.content.update({
    where: { id: contentId },
    data: { isDeletedOn },
  });
  await prisma.$transaction([deleteDescendants, deleteRoot]);
}

/**
 * Return the content ids of the descendants on `contentId`. (No permission checks are performed.)
 *
 * Returns a promise resulting to an array of content ids,
 * or an empty array if `contentId` doesn't exist or isn't owned by `loggedInUserId`.
 *
 * One use is to avoid deadlocks from recursive update queries that update all the descendants.
 * Instead, one can get all the ids with this function and then run an update query using the ids.
 */
export async function getDescendantIds(contentId: Uint8Array) {
  const ids = await prisma.$queryRaw<
    {
      id: Uint8Array;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE parentId = ${contentId} AND isDeletedOn IS NULL
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ct
      ON content.parentId = ct.id
      WHERE content.isDeletedOn IS NULL
    )
    SELECT id from content_tree;
  `);

  return ids.map((x) => x.id);
}

export async function restoreDeletedContent({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  // Verify content is owned by `loggedInUserId`, is recoverable, and is the root of a deletion.
  const checkForParent = await prisma.content.findUniqueOrThrow({
    where: {
      ownerId: loggedInUserId,
      id: contentId,
      deletionRootId: null, // if this is null and `isDeletedOn` is not null, then this is the root of a deletion
      isDeletedOn: { not: null, gte: getEarliestRecoverableDate().toJSDate() },
    },
    select: {
      parent: {
        select: {
          id: true,
          isDeletedOn: true,
        },
      },
    },
  });

  // Figure out where to put the restored root. If the parent is not deleted we'll put it back where it was.
  // If the parent is deleted or there was no parent, we're just going to put it in the base folder of the owner.
  const parentId =
    checkForParent.parent && checkForParent.parent.isDeletedOn === null
      ? checkForParent.parent.id
      : null;

  const updateRoot = prisma.content.update({
    where: {
      id: contentId,
    },
    data: {
      isDeletedOn: null,
      deletionRootId: null,
      parentId,
    },
  });

  const updateDescendants = prisma.content.updateMany({
    where: {
      deletionRootId: contentId,
    },
    data: {
      isDeletedOn: null,
      deletionRootId: null,
    },
  });

  await prisma.$transaction([updateRoot, updateDescendants]);
}

/**
 * Update the content with `contentId`, changing any of the parameters that are given:
 * `name`, `source`, `doenetmlVersionId`, `numVariants`,
 * `shuffle`, `numToSelect`, `selectByVariant`,
 * `paginate`, `activityLevelAttempts`, and/or `itemLevelAttempts`.
 *
 * For the change to succeed, either
 * - the content must be owned by `loggedInUserId`, or
 * - the content must be in the library and `loggedInUserId` must be an admin.
 * In addition, if the content is assigned, then the change will succeed
 * only if just modifying `name`, and/or `paginate`.
 */
export async function updateContent({
  contentId,
  name,
  source,
  doenetmlVersionId,
  numVariants,
  shuffle,
  numToSelect,
  selectByVariant,
  paginate,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  name?: string;
  source?: string;
  doenetmlVersionId?: number;
  numVariants?: number;
  shuffle?: boolean;
  numToSelect?: number;
  selectByVariant?: boolean;
  paginate?: boolean;
  loggedInUserId: Uint8Array;
}) {
  if (
    [
      name,
      source,
      doenetmlVersionId,
      numVariants,
      shuffle,
      numToSelect,
      selectByVariant,
      paginate,
    ].every((x) => x === undefined)
  ) {
    // if no information passed in, don't update anything, including `lastEdited`.
    return;
  }

  const isAdmin = await getIsAdmin(loggedInUserId);

  // check if content is assigned
  const content = await prisma.content.findFirstOrThrow({
    where: {
      id: contentId,
      ...filterEditableContent(loggedInUserId, isAdmin),
    },
    select: {
      rootAssignment: { select: { assigned: true } },
      nonRootAssignment: { select: { assigned: true } },
    },
  });

  const isAssigned = Boolean(
    content.rootAssignment?.assigned || content.nonRootAssignment?.assigned,
  );

  if (isAssigned) {
    // If assigned, the only items you can change are name or paginate.
    // If attempting to change any of the others, throw an error
    if (
      [
        // name,
        source,
        doenetmlVersionId,
        numVariants,
        shuffle,
        numToSelect,
        selectByVariant,
        // paginate,
      ].some((x) => x !== undefined)
    ) {
      throw new InvalidRequestError("Cannot change assigned content");
    }
  }

  await prisma.content.update({
    where: { id: contentId, ...filterEditableContent(loggedInUserId, isAdmin) },
    data: {
      name,
      source,
      doenetmlVersionId,
      numVariants,
      shuffle,
      numToSelect,
      selectByVariant,
      paginate,
      lastEdited: DateTime.now().toJSDate(),
    },
  });
}

/**
 * Add or remove the content features specified in `features` to the content with `contentId`.
 *
 * For the change to succeed, either
 * - the content must be owned by `loggedInUserId`, or
 * - the content must be in the library and `loggedInUserId` must be an admin.
 */
export async function updateContentFeatures({
  contentId,
  loggedInUserId,
  features,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  features: Record<string, boolean>;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  await prisma.content.update({
    where: { id: contentId, ...filterEditableContent(loggedInUserId, isAdmin) },
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
}

/**
 * Return the contentId, name, and content type of the content with `contentId`,
 * assuming it is viewable by `loggedInUserId`.
 *
 * Throws an error if not viewable by `loggedInUserId`.
 */
export async function getContentDescription({
  contentId,
  loggedInUserId = new Uint8Array(16),
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);

  const description = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterViewableContent(loggedInUserId, isAdmin),
    },
    select: {
      name: true,
      type: true,
      parent: { select: { type: true, id: true } },
    },
  });

  const parent = description.parent
    ? { type: description.parent.type, contentId: description.parent.id }
    : null;

  return { contentId, ...description, parent };
}

/**
 * Get a list of all currently available DoenetML versions.
 */
export async function getAllDoenetmlVersions() {
  const allDoenetmlVersions = await prisma.doenetmlVersions.findMany({
    where: {
      removed: false,
    },
    orderBy: {
      displayedVersion: "asc",
    },
  });
  return { allDoenetmlVersions };
}

/**
 * Create a new record in `contentRevisions` corresponding to the current state of
 * `contentId` owned by `loggedInUserId`, if it doesn't exist already.
 * Include `revisionName`, `note`, and `autoGenerated` in the record.
 *
 * If the revision with the cid already exists and `autoGenerated` is `false`,
 * then check to make sure there are no later manual revision.
 * If there are later manual revisions, ignore that revision and create a new one.
 * If there are no later manual revisions, then update `autoGenerated` of the record to `false`,
 * and if either `renameMatching` or the record's `autoGenerated` was `true`,
 * then also update `revisionName` and `note` of the record.
 *
 * If the revision with the cid already exists and `autoGenerated` is `true`,
 * then don't do anything but just return the `revisionNum` of the found revision.
 *
 * For documents, it stores the source and resulting cid.
 * For other activities, it compiles the activity json
 * and uses the stringified json for the source and resulting cid.
 *
 * Returns a Promise that resolves to an object with the fields
 * - revisionNum: the revision number matching the current state of `contentId`
 * - createdNew: `true` if a new content revision was created
 */
export async function createContentRevision({
  contentId,
  loggedInUserId,
  revisionName,
  note,
  autoGenerated = false,
  renameMatching = true,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  revisionName: string;
  note?: string;
  autoGenerated?: boolean;
  renameMatching?: boolean;
}) {
  const content = await getContent({ contentId, loggedInUserId });

  let source: string | null = null;
  let numVariants = 1;
  let doenetmlVersionId: number | null = null;
  let cid: string;

  if (content.type === "singleDoc") {
    source = content.doenetML;
    numVariants = content.numVariants;
    doenetmlVersionId = content.doenetmlVersion.id;
    // use doenetmlVersionId for cid so that cid doesn't change if we upgrade the minor version for all documents
    cid = await cidFromText(
      content.doenetmlVersion.id.toString() + "|" + source,
    );
  } else {
    source = JSON.stringify(compileActivityFromContent(content));
    // use doenetmlVersionId for cid so that cid doesn't change if we upgrade the minor version for all documents
    const sourceForCid = JSON.stringify(
      compileActivityFromContent(content, true),
    );
    cid = await cidFromText(sourceForCid);
  }

  // find most recent revision with cid
  let contentRevision = await prisma.contentRevisions.findFirst({
    where: { contentId: contentId, cid },
    orderBy: { createdAt: "desc" },
    select: { revisionNum: true, createdAt: true, autoGenerated: true },
  });

  if (contentRevision && !autoGenerated) {
    // A manual revision is being created and one with cid already exists.

    // Check if there are any manual revisions after the last one with cid
    const laterRevision = await prisma.contentRevisions.findFirst({
      where: {
        contentId: contentId,
        createdAt: { gt: contentRevision.createdAt },
        autoGenerated: false,
      },
      select: { revisionNum: true },
    });

    if (laterRevision) {
      // found a later manual revision, so ignore the matching revision
      contentRevision = null;
    }
  }

  let createdNew = false;

  if (!contentRevision) {
    // TODO: not sure how to make an atomic operation of this with the ORM.
    // Should we write a raw SQL query to accomplish this in one query?

    const aggregations = await prisma.contentRevisions.aggregate({
      _max: { revisionNum: true },
      where: { contentId },
    });
    const lastRevisionNum = aggregations._max.revisionNum;
    const newRevisionNum = lastRevisionNum ? lastRevisionNum + 1 : 1;

    contentRevision = await prisma.contentRevisions.create({
      data: {
        revisionNum: newRevisionNum,
        contentId,
        cid,
        doenetmlVersionId,
        source,
        numVariants,
        revisionName,
        note,
        autoGenerated,
      },
    });
    createdNew = true;
  } else if (!autoGenerated) {
    contentRevision = await prisma.contentRevisions.update({
      where: {
        contentId_revisionNum: {
          contentId,
          revisionNum: contentRevision.revisionNum,
        },
      },
      data: {
        revisionName:
          renameMatching || contentRevision.autoGenerated
            ? revisionName
            : undefined,
        note:
          renameMatching || contentRevision.autoGenerated ? note : undefined,
        autoGenerated,
      },
    });
  }

  return { revisionNum: contentRevision.revisionNum, createdNew };
}

/**
 * Update the `revisionName` and `note` of revision number `revision`
 * of `contentId` owned by `loggedInUserId`
 */
export async function updateContentRevision({
  contentId,
  loggedInUserId,
  revisionName,
  note,
  revisionNum,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  revisionName: string;
  note: string;
  revisionNum: number;
}) {
  await prisma.contentRevisions.update({
    where: {
      contentId_revisionNum: { contentId, revisionNum },
      content: filterEditableActivity(loggedInUserId),
    },
    data: { revisionName, note },
  });
}

/**
 * Get the `source` and, if a Doc, `doenetMLVersion`, from the content with `contentId` viewable by `loggedInUserId`.
 * The behavior depends on whether or not `fromRevisionNum` is specified.
 *
 * ### `fromRevision` is not specified
 *
 * For Docs, return the `source` database field from the `content` table.
 * Otherwise compile the activity json and stringify that for the source
 *
 * For Docs, also return the full doenetml version, unless `useVersionId` is `true`,
 * in which case, return the doenetmlVersionId.
 *
 * If not a Doc and `useVersionId` is `true`, then compile the activity json where use doenetmlVersionId
 * rather than the full doenetml version. Useful for generating a cid from the source
 * that won't change if we upgrade the minor version for all documents (though it does not
 * produce a valid source for viewing the activity).
 *
 * ### `fromRevision` is specified
 *
 * Return the `source` and, if a Doc, full doenetml version from the `contentRevisions` table
 * with `contentId` and revisionNum equal to `fromRevisionNum`.
 *
 * When `fromRevisionNum` is specified, `useVersionIds` is ignored, given that the source (for non Docs) stored in `contentRevisions`
 * includes full doenetml versions.
 *
 * In addition to returning `source` and, if Doc, the full `doenetmlVersion`, also return additional fields
 * from `contentRevision`: revisionNum, revisionName, and note,
 */
export async function getContentSource({
  contentId,
  loggedInUserId = new Uint8Array(16),
  useVersionIds = false,
  fromRevisionNum,
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
  useVersionIds?: boolean;
  fromRevisionNum?: number;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);

  if (fromRevisionNum === undefined) {
    const content = await getContent({ contentId, loggedInUserId, isAdmin });
    let source: string;
    let doenetMLVersion: string | null = null;

    if (content.type === "singleDoc") {
      source = content.doenetML;
      doenetMLVersion = useVersionIds
        ? content.doenetmlVersion.id.toString()
        : content.doenetmlVersion.fullVersion;
    } else {
      source = JSON.stringify(
        compileActivityFromContent(content, useVersionIds),
      );
    }

    return { source, doenetMLVersion };
  } else {
    const revisionPrelim = await prisma.contentRevisions.findUniqueOrThrow({
      where: {
        contentId_revisionNum: { contentId, revisionNum: fromRevisionNum },
        content: filterViewableContent(loggedInUserId, isAdmin),
      },
      select: {
        source: true,
        doenetmlVersion: { select: { fullVersion: true } },
        revisionNum: true,
        revisionName: true,
        note: true,
      },
    });

    const { doenetmlVersion, ...revision } = revisionPrelim;

    return {
      ...revision,
      doenetMLVersion: doenetmlVersion?.fullVersion ?? null,
    };
  }
}

/**
 * Get all content revisions of `contentId` owned by `loggedInUserId`.
 * Ignore auto-generated unless `includeAutogenerated` is `true`.
 *
 * Returns a promise that resolves to an array of revisions, with most recent revision first,
 * where each entry has the fields:
 * - revisionNum
 * - revisionName
 * - note
 * - source
 * - doenetmlVersion (just the fullVersion string, or null)
 * - cid
 * - createdA
 */
export async function getContentRevisions({
  contentId,
  loggedInUserId,
  includeAutogenerated = false,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  includeAutogenerated?: boolean;
}) {
  const revisions = await prisma.contentRevisions.findMany({
    where: {
      content: {
        id: contentId,
        ...filterEditableActivity(loggedInUserId),
      },
      autoGenerated: includeAutogenerated ? undefined : false,
    },
    orderBy: { createdAt: "desc" },
    select: {
      revisionNum: true,
      revisionName: true,
      note: true,
      source: true,
      doenetmlVersion: { select: { fullVersion: true } },
      cid: true,
      createdAt: true,
    },
  });

  return revisions.map((rev) => ({
    revisionNum: rev.revisionNum,
    revisionName: rev.revisionName,
    note: rev.note ?? "",
    source: rev.source,
    doenetmlVersion: rev.doenetmlVersion?.fullVersion ?? null,
    cid: rev.cid,
    createdAt: rev.createdAt,
  }));
}

export async function getContentHistory({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const content = await getContent({ contentId, loggedInUserId });

  const revisions = await getContentRevisions({ contentId, loggedInUserId });

  return { content, revisions };
}

/**
 * Revert activity `contentId` owned by `loggedInUserId` to a previous revision of number `revisionNum`.
 *
 * Implemented only for documents, and it reverts the fields `source`, `doenetmlVersionId`, and `numVariants`.
 */
export async function revertToRevision({
  contentId,
  loggedInUserId,
  revisionNum,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  revisionNum: number;
}) {
  const revision = await prisma.contentRevisions.findUniqueOrThrow({
    where: {
      contentId_revisionNum: { contentId, revisionNum },
      content: { ...filterEditableContent(loggedInUserId), type: "singleDoc" },
    },
    select: {
      revisionNum: true,
      revisionName: true,
      note: true,
      source: true,
      doenetmlVersion: { select: { fullVersion: true } },
      cid: true,
      createdAt: true,
      doenetmlVersionId: true,
      numVariants: true,
    },
  });

  // Create a manual revision beforehand, so it will be seen, but don't rename any existing manual revision
  await createContentRevision({
    contentId,
    loggedInUserId,
    revisionName: "Before changing to save point",
    note: `Before using the save point: ${revision.revisionName}`,
    autoGenerated: false,
    renameMatching: false,
  });

  await prisma.content.update({
    where: { id: contentId },
    data: {
      source: revision.source,
      doenetmlVersionId: revision.doenetmlVersionId,
      numVariants: revision.numVariants,
    },
  });

  // Create a manual revision afterwards, so it will be seen.
  // It would have a matching manual revision only if this reversion didn't change anything,
  // but don't rename the revision in that case.
  const newRevision = await createContentRevision({
    contentId,
    loggedInUserId,
    revisionName: "Changed to save point",
    note: `Used the save point: ${revision.revisionName}`,
    autoGenerated: false,
    renameMatching: false,
  });

  return {
    newRevisionNum: newRevision.revisionNum,
    revisionNum: revision.revisionNum,
    revisionName: revision.revisionName,
    note: revision.note ?? "",
    source: revision.source,
    doenetmlVersion: revision.doenetmlVersion?.fullVersion ?? null,
    cid: revision.cid,
    createdAt: revision.createdAt,
  };
}
