import { Prisma } from "@prisma/client";
import { Content } from "../types";
import { InvalidRequestError } from "../utils/error";
import {
  checkActivityPermissions,
  filterViewableActivity,
  viewableContentWhere,
} from "../utils/permissions";
import { prisma } from "../model";
import { getAvailableContentFeatures } from "./classification";
import { processContent, returnContentSelect } from "../utils/contentStructure";
import { getIsAdmin } from "./curate";
import { isEqualUUID } from "../utils/uuid";
import { getContributorHistory } from "./remix";
import { recordContentView, recordRecentContent } from "./stats";

/**
 * Get the data needed to edit `contentId` of `ownerId`.
 *
 * The data returned depends on whether or not `isAssigned` is set.
 *
 * If `isAssigned` is not set, then we return current source from the documents table
 *
 * If `isAssigned` is `true`, then we return the fixed source from documentVersions table
 * the is referenced by the `assignedVersionNum` in the documents table.
 * We also return information about whether or not the assignment is open in this case.
 *
 * @param contentId
 * @param loggedInUserId
 */
export async function getActivityEditorData({
  contentId,
  loggedInUserId = new Uint8Array(16),
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
}) {
  // TODO: add pagination or a hard limit i n the number of documents one can add to an activity

  const activityPermissions = await checkActivityPermissions(
    contentId,
    loggedInUserId,
  );
  if (activityPermissions.viewable === false || !activityPermissions.ownerId) {
    throw new InvalidRequestError(
      "This activity does not exist or is not visible.",
    );
  }

  if (activityPermissions.editable === false) {
    return { editableByMe: false, contentId };
  }

  const { isAssigned } = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      type: { not: "folder" },
    },
    select: {
      isAssigned: true,
      type: true,
    },
  });

  const { availableFeatures } = await getAvailableContentFeatures();

  const isAdmin = await getIsAdmin(loggedInUserId);

  const activity = await getContent({
    contentId,
    loggedInUserId,
    includeAssignInfo: true,
    includeAssignedRevision: isAssigned,
    countAssignmentScores: true,
    includeClassifications: true,
    includeShareDetails: true,
    isAdmin,
  });

  await recordRecentContent(loggedInUserId, "edit", contentId);

  return { editableByMe: true, activity, availableFeatures };
}

/**
 * Get the data needed to view the source of public activity `contentId`
 */
export async function getSharedEditorData({
  contentId,
  loggedInUserId = new Uint8Array(16),
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
}) {
  // TODO: add pagination or a hard limit in the number of documents one can add to an activity
  const activity = getContent({ contentId, loggedInUserId });
  return activity;
}

export async function getActivityViewerData({
  contentId,
  loggedInUserId = new Uint8Array(16),
}: {
  contentId: Uint8Array;
  loggedInUserId?: Uint8Array;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);

  const activity = await getContent({
    contentId,
    loggedInUserId,
    isAdmin,
    includeOwnerDetails: true,
    includeClassifications: true,
  });

  if (!isEqualUUID(loggedInUserId, activity.ownerId)) {
    await recordContentView(contentId, loggedInUserId);
  }

  const activityHistory = await getContributorHistory({
    contentId,
    loggedInUserId,
    isAdmin,
  });

  return {
    activity,
    activityHistory,
  };
}

/**
 * Get the content structure for `contentId`, recursing to all descendants
 * to populate the `children` field of it and its descendants.
 *
 */
export async function getContent({
  contentId,
  loggedInUserId,
  includeAssignInfo = false,
  includeAssignedRevision = false,
  countAssignmentScores = false,
  includeLibraryInfo = false,
  includeClassifications = false,
  includeShareDetails = false,
  includeOwnerDetails = false,
  isAdmin = false,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  includeAssignInfo?: boolean;
  includeAssignedRevision?: boolean;
  countAssignmentScores?: boolean;
  includeLibraryInfo?: boolean;
  includeClassifications?: boolean;
  includeShareDetails?: boolean;
  includeOwnerDetails?: boolean;
  isAdmin?: boolean;
}) {
  // 1. verify that `loggedInUserId` can view content
  await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
    },
    select: { id: true },
  });

  // 2. get an ordered list of all the content inside `contentId`
  const matches = await prisma.$queryRaw<
    {
      id: Uint8Array;
      parentId: Uint8Array;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, sortIndex) AS (
    SELECT id, parentId, sortIndex FROM content
    WHERE parentId = ${contentId}
      AND ${viewableContentWhere(loggedInUserId, isAdmin)}
    UNION ALL
    SELECT content.id, content.parentId, content.sortIndex FROM content
    INNER JOIN content_tree AS ct
    ON content.parentId = ct.id
    WHERE ${viewableContentWhere(loggedInUserId, isAdmin)}
  )
  SELECT id, parentId from content_tree
    ORDER BY
      parentId, sortIndex
`);

  // 3. get all the details on content and its descendants

  const contentSelect = returnContentSelect({
    includeAssignInfo,
    includeAssignedRevision,
    countAssignmentScores,
    includeLibraryInfo,
    includeClassifications,
    includeShareDetails,
    includeOwnerDetails,
    isAdmin,
  });

  const preliminaryList = await prisma.content.findMany({
    where: {
      id: { in: [contentId, ...matches.map((m) => m.id)] },
    },
    select: contentSelect,
    orderBy: [{ parentId: "asc" }, { sortIndex: "asc" }],
  });

  // 4. piece together all those details into a tree of the form given by `Content`
  const idx = preliminaryList.findIndex((c) => isEqualUUID(c.id, contentId));
  //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
  const activity = processContent(preliminaryList[idx], loggedInUserId);

  preliminaryList.splice(idx, 1);

  function findDescendants(id: Uint8Array) {
    const children: Content[] = [];
    for (let i = 0; i < preliminaryList.length; i++) {
      if (isEqualUUID(preliminaryList[i].parent!.id, id)) {
        //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
        children.push(processContent(preliminaryList[i], loggedInUserId));
        preliminaryList.splice(i, 1);
        i--;
      }
    }

    for (const child of children) {
      if (child.type !== "singleDoc") {
        child.children = findDescendants(child.contentId);
      }
    }

    return children;
  }

  if (activity.type !== "singleDoc") {
    activity.children = findDescendants(activity.contentId);
  }

  return activity;
}
