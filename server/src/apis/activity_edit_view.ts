import { ContentType, Prisma } from "@prisma/client";
import { Content, createContentInfo } from "../types";
import { InvalidRequestError } from "../utils/error";
import {
  checkActivityPermissions,
  filterViewableActivity,
} from "../utils/permissions";
import { prisma } from "../model";
import { getAvailableContentFeatures } from "./classification";
import { processContent, returnContentSelect } from "../utils/contentStructure";
import { getIsAdmin } from "./curate";
import { isEqualUUID } from "../utils/uuid";
import { recordContentView } from "./explore";
import { getActivityContributorHistory } from "./remix";

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
  if (activityPermissions.viewable === false || !activityPermissions.ownerId) {
    throw new InvalidRequestError(
      "This activity does not exist or is not visible.",
    );
  }

  if (activityPermissions.editable === false) {
    return { editableByMe: false, activityId };
  }

  const { isAssigned, type: contentType } =
    await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        type: { not: "folder" },
      },
      select: {
        isAssigned: true,
        type: true,
      },
    });

  let activity: Content = await createContentInfo({
    contentId: activityId,
    contentType,
    ownerId: activityPermissions.ownerId,
  });

  const availableFeatures = await getAvailableContentFeatures();

  if (contentType !== "singleDoc") {
    // have a sequence or select activity
    const activity = await getCompoundActivity(activityId, loggedInUserId);

    return { editableByMe: true, activity, availableFeatures };
  }

  const contentSelect = returnContentSelect({
    includeAssignInfo: true,
    includeAssignedRevision: isAssigned,
    countAssignmentScores: true,
    includeClassifications: true,
  });

  const preliminaryActivity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      isDeleted: false,
    },
    select: contentSelect,
  });

  activity = processContent(preliminaryActivity);

  return { editableByMe: true, activity, availableFeatures };
}

/**
 * Get the data needed to view the source of public activity `activityId`
 *
 * We return current source from the documents table
 *
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
    select: returnContentSelect({}),
  });

  const activity = processContent(preliminaryActivity, loggedInUserId);

  return activity;
}

export async function getActivityViewerData(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  const isAdmin = await getIsAdmin(loggedInUserId);

  const getTypeOwner = await prisma.content.findUnique({
    where: {
      id: activityId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
    },
    select: { type: true, ownerId: true },
  });

  if (!getTypeOwner) {
    throw new InvalidRequestError(
      "This activity does not exist or is not visible.",
    );
  }

  if (!isEqualUUID(loggedInUserId, getTypeOwner.ownerId)) {
    await recordContentView(activityId, loggedInUserId);
  }

  if (getTypeOwner.type !== "singleDoc") {
    const activity = await getCompoundActivity(activityId, loggedInUserId);
    return { activity };
  }

  const preliminaryActivity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
    },
    select: returnContentSelect({ includeOwnerDetails: true }),
  });

  const activity = processContent(preliminaryActivity, loggedInUserId);

  const activityHistory = await getActivityContributorHistory({
    activityId,
    loggedInUserId,
    isAdmin,
  });

  return {
    activity,
    activityHistory,
  };
}

/**
 * Get the content structure for `activityId`, recursing to all descendants
 * to populate the `children` field of it and its descendants.
 *
 * Used for displaying the entire contents of a `select` or `sequence` activity.
 */
async function getCompoundActivity(
  activityId: Uint8Array<ArrayBufferLike>,
  loggedInUserId: Uint8Array<ArrayBufferLike>,
) {
  // first, get an ordered list of all the content inside the `activityId` folder
  const matches = await prisma.$queryRaw<
    {
      id: Uint8Array;
      parentId: Uint8Array;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, sortIndex) AS (
    SELECT id, parentId, sortIndex FROM content
    WHERE parentId = ${activityId}
      AND (
        ownerId = ${loggedInUserId}
        OR isPublic = TRUE
        OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
      )
      AND isDeleted = FALSE
    UNION ALL
    SELECT content.id, content.parentId, content.sortIndex FROM content
    INNER JOIN content_tree AS ft
    ON content.parentId = ft.id
    WHERE content.isDeleted = FALSE
      AND (
        ownerId = ${loggedInUserId}
        OR isPublic = TRUE
        OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
      )
  )
  SELECT id, parentId from content_tree
    ORDER BY
      parentId, sortIndex
`);

  // Next, get all the details on the content
  const preliminaryList = await prisma.content.findMany({
    where: {
      id: { in: [activityId, ...matches.map((m) => m.id)] },
    },
    select: returnContentSelect({ includeOwnerDetails: true }),
    orderBy: [{ parentId: "asc" }, { sortIndex: "asc" }],
  });

  const idx = preliminaryList.findIndex((c) => isEqualUUID(c.id, activityId));
  const activity = processContent(preliminaryList[idx], loggedInUserId);

  preliminaryList.splice(idx, 1);

  function findDescendants(id: Uint8Array) {
    const children: Content[] = [];
    for (let i = 0; i < preliminaryList.length; i++) {
      if (isEqualUUID(preliminaryList[i].parent!.id, id)) {
        children.push(processContent(preliminaryList[i], loggedInUserId));
        preliminaryList.splice(i, 1);
        i--;
      }
    }

    for (const child of children) {
      if (child.type !== "singleDoc") {
        child.children = findDescendants(child.id);
      }
    }

    return children;
  }

  if (activity.type !== "singleDoc") {
    activity.children = findDescendants(activity.id);
  }

  return activity;
}
