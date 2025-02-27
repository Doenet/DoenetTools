import { ContentType, Prisma } from "@prisma/client";
import { prisma } from "../model";
import { getIsAdmin, getLibraryAccountId, mustBeAdmin } from "./curate";
import {
  filterEditableContent,
  filterViewableContent,
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

  // If parent isn't `null`, check if it is shared and get its license
  if (parentId !== null) {
    const parent = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        type: { not: "singleDoc" },
        isDeleted: false,
        ownerId,
      },
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

  const imagePath =
    contentType === "folder" ? "/folder_default.jpg" : "/activity_default.jpg";

  const content = await prisma.content.create({
    data: {
      ownerId,
      type: contentType,
      parentId,
      name,
      imagePath,
      isPublic,
      licenseCode,
      sortIndex,
      source: contentType === "singleDoc" ? "" : null,
      doenetmlVersionId:
        contentType === "singleDoc" ? defaultDoenetmlVersion.id : null,
      baseComponentCounts: contentType === "singleDoc" ? "{}" : null,
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

  // throw error if content does not exist or isn't visible
  await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterEditableContent(loggedInUserId),
    },
    select: { id: true },
  });

  await deleteContentNoCheck(contentId, loggedInUserId);
}

/**
 * Delete the content `id` along with all the content inside it,
 * recursing to its children
 *
 * WARNING: This function fails silently if content `id` does not exist. Use {@link deleteContent} instead if you would like the function to throw an error.
 */
export function deleteContentNoCheck(
  id: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  return prisma.$executeRaw(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${id} AND ownerId = ${loggedInUserId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ft
      ON content.parentId = ft.id
    )

    UPDATE content
      SET content.isDeleted = TRUE
      WHERE content.id IN (SELECT id from content_tree);
    `);
}

/**
 * Update the content with `id`, changing any of the parameters that are given:
 * `name`, `source`, `doenetmlVersionId`, `numVariants`, `baseComponentCounts`,
 * `imagePath`, `shuffle`, `numToSelect`, `selectByVariant`,
 * `paginate`, `activityLevelAttempts`, and/or `itemLevelAttempts`.
 *
 * For the change to succeed, either
 * - the content must be owned by `loggedInUserId`, or
 * - the content must be in the library and `loggedInUserId` must be an admin.
 */
export async function updateContent({
  contentId,
  name,
  source,
  doenetmlVersionId,
  numVariants,
  baseComponentCounts,
  imagePath,
  shuffle,
  numToSelect,
  selectByVariant,
  paginate,
  activityLevelAttempts,
  itemLevelAttempts,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  name?: string;
  source?: string;
  doenetmlVersionId?: number;
  numVariants?: number;
  baseComponentCounts?: string;
  imagePath?: string;
  shuffle?: boolean;
  numToSelect?: number;
  selectByVariant?: boolean;
  paginate?: boolean;
  activityLevelAttempts?: boolean;
  itemLevelAttempts?: boolean;
  loggedInUserId: Uint8Array;
}) {
  if (
    [
      name,
      source,
      doenetmlVersionId,
      numVariants,
      baseComponentCounts,
      imagePath,
      shuffle,
      selectByVariant,
      paginate,
      activityLevelAttempts,
      itemLevelAttempts,
    ].every((x) => x === undefined)
  ) {
    // if not information passed in, don't update anything, including `lastEdited`.
    return;
  }

  const isAdmin = await getIsAdmin(loggedInUserId);

  // check if content is assigned
  const isAssigned = (
    await prisma.content.findFirstOrThrow({
      where: {
        id: contentId,
        ...filterEditableContent(loggedInUserId, isAdmin),
      },
    })
  ).isAssigned;

  if (isAssigned && (source !== undefined || doenetmlVersionId !== undefined)) {
    throw new InvalidRequestError("Cannot change assigned content");
  }

  await prisma.content.update({
    where: { id: contentId, ...filterEditableContent(loggedInUserId, isAdmin) },
    data: {
      name,
      source,
      doenetmlVersionId,
      numVariants,
      baseComponentCounts,
      imagePath,
      shuffle,
      numToSelect,
      selectByVariant,
      paginate,
      activityLevelAttempts,
      itemLevelAttempts,
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
 * Create a new record in `activityRevisions` corresponding to the current state of
 * `contentId`.
 *
 * For documents, it stores the source and resulting cid.
 * For other activities, it compiles the activity json
 * and uses the stringified json for the source and resulting cid.
 */
export async function createActivityRevision(
  contentId: Uint8Array,
  loggedInUserId: Uint8Array,
): Promise<{
  contentId: Uint8Array;
  revisionNum: number;
  cid: string;
  source: string | null;
  doenetmlVersionId: number | null;
  numVariants: number;
  baseComponentCounts: string | null;
  createdAt: Date;
}> {
  const content = await getContent({ contentId, loggedInUserId });

  let source: string | null = null;
  let numVariants = 1;
  let doenetmlVersionId: number | null = null;
  let baseComponentCounts: string | null = null;
  let cid: string;

  if (content.type === "singleDoc") {
    source = content.source;
    numVariants = content.numVariants;
    doenetmlVersionId = content.doenetmlVersion.id;
    baseComponentCounts = content.baseComponentCounts;
    cid = await cidFromText(content.doenetmlVersion.fullVersion + "|" + source);
  } else {
    source = JSON.stringify(compileActivityFromContent(content));
    cid = await cidFromText(source);
  }

  let activityVersion = await prisma.activityRevisions.findUnique({
    where: { contentId_cid: { contentId: contentId, cid } },
  });

  if (!activityVersion) {
    // TODO: not sure how to make an atomic operation of this with the ORM.
    // Should we write a raw SQL query to accomplish this in one query?

    const aggregations = await prisma.activityRevisions.aggregate({
      _max: { revisionNum: true },
      where: { contentId },
    });
    const lastVersionNum = aggregations._max.revisionNum;
    const newVersionNum = lastVersionNum ? lastVersionNum + 1 : 1;

    activityVersion = await prisma.activityRevisions.create({
      data: {
        revisionNum: newVersionNum,
        contentId,
        cid,
        doenetmlVersionId,
        source,
        numVariants,
        baseComponentCounts,
      },
    });
  }

  return activityVersion;
}

/**
 * Get the source from the content with `contentId`. For Docs, return the `source` database field.
 * Otherwise compile the activity json and stringify that for the source
 *
 * Throws an error if not viewable by `loggedInUserId`.
 */
export async function getContentSource({
  contentId,
  loggedInUserId = new Uint8Array(16),
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  const content = await getContent({ contentId, loggedInUserId, isAdmin });

  let source: string;
  let doenetMLVersion: string | null = null;

  if (content.type === "singleDoc") {
    source = content.source;
    doenetMLVersion = content.doenetmlVersion.fullVersion;
  } else {
    source = JSON.stringify(compileActivityFromContent(content));
  }

  return { source, doenetMLVersion };
}
