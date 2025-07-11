import { Prisma } from "@prisma/client";
import { prisma } from "../model";
import { isEqualUUID } from "./uuid";
import { DateTime } from "luxon";

/**
 * Filter Prisma's `where` clause to exclude unviewable activities for `loggedInUserId`
 *
 * For an activity to be viewable, one of these conditions must be true:
 * 1. `loggedInUserId` is the owner
 * 2. The content is public
 * 3. The content is shared with `loggedInUserId`
 * 4. `loggedInUserId` is an editor and the content is in the library.
 *
 * NOTE: This function does not verify editor privileges. You must pass in the correct `isEditor` flag.
 */
export function filterViewableActivity(
  loggedInUserId: Uint8Array,
  isEditor: boolean = false,
) {
  return {
    ...filterViewableContent(loggedInUserId, isEditor),
    type: { not: "folder" as const },
  };
}

/**
 * Filter Prisma's `where` clause to exclude unviewable content for `loggedInUserId`
 *
 * For content to be viewable, one of these conditions must be true:
 * 1. `loggedInUserId` is the owner
 * 2. The content is public
 * 3. The content is shared with `loggedInUserId`
 * 4. `loggedInUserId` is an editor and the content is in the library.
 *
 * NOTE: This function does not verify editor privileges. You must pass in the correct `isEditor` flag.
 */
export function filterViewableContent(
  loggedInUserId: Uint8Array,
  isEditor: boolean = false,
) {
  const visibilityOptions: (
    | { ownerId: Uint8Array }
    | { isPublic: boolean }
    | { sharedWith: { some: { userId: Uint8Array } } }
    | { owner: { isLibrary: boolean } }
  )[] = [
    { ownerId: loggedInUserId },
    { isPublic: true },
    { sharedWith: { some: { userId: loggedInUserId } } },
  ];
  if (isEditor) {
    visibilityOptions.push({ owner: { isLibrary: true } });
  }
  return {
    isDeletedOn: null,
    OR: visibilityOptions,
  };
}

/**
 * Return a MySQL cause to be added to a WHERE statement, filtering to content viewable by `loggedInUserId`.
 *
 * For content to be viewable, one of these conditions must be true:
 * 1. `loggedInUserId` is the owner
 * 2. The content is public
 * 3. The content is shared with `loggedInUserId`
 * 4. `loggedInUserId` is an editor and the content is in the library.
 *
 * NOTE: This function does not verify editor privileges. You must pass in the correct `isEditor` flag.
 */
export function viewableContentWhere(
  loggedInUserId: Uint8Array,
  isEditor: boolean = false,
) {
  let visibilityOptions = Prisma.sql`
      content.ownerId = ${loggedInUserId}
      OR content.isPublic = TRUE
      OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
  `;

  if (isEditor) {
    visibilityOptions = Prisma.sql`
        ${visibilityOptions}
        OR (SELECT isLibrary FROM users WHERE userId = content.ownerId) = TRUE
        `;
  }

  const whereStatement = Prisma.sql`
    content.isDeletedOn IS NULL
    AND (
      ${visibilityOptions}
    )
  `;

  return whereStatement;
}

/**
 * Filter Prisma's `where` clause to exclude uneditable activities by `loggedInUserId`
 *
 * For an activity to be editable, one of these conditions must be true:
 * 1. `loggedInUserId` is the owner
 * 4. `loggedInUserId` is an editor and the content is in the library.
 *
 * NOTE: This function does not verify editor privileges. You must pass in the correct `isEditor` flag.
 */
export function filterEditableActivity(
  loggedInUserId: Uint8Array,
  isEditor: boolean = false,
) {
  return {
    ...filterEditableContent(loggedInUserId, isEditor),
    type: { not: "folder" as const },
  };
}

/**
 * Filter Prisma's `where` clause to exclude uneditable content by `loggedInUserId`
 *
 * For content to be editable, one of these conditions must be true:
 * 1. `loggedInUserId` is the owner
 * 2. `loggedInUserId` is an editor and the content is in the library.
 *
 * NOTE: This function does not verify editor privileges. You must pass in the correct `isEditor` flag.
 */
export function filterEditableContent(
  loggedInUserId: Uint8Array,
  isEditor: boolean = false,
) {
  const editabilityOptions: (
    | { ownerId: Uint8Array }
    | { owner: { isLibrary: boolean } }
  )[] = [{ ownerId: loggedInUserId }];

  if (isEditor) {
    editabilityOptions.push({ owner: { isLibrary: true } });
  }
  return {
    isDeletedOn: null,
    OR: editabilityOptions,
  };
}

/**
 * Return a MySQL cause to be added to a WHERE statement, filtering to content editable by `loggedInUserId`.
 *
 * For content to be viewable, one of these conditions must be true:
 * 1. `loggedInUserId` is the owner
 * 2. `loggedInUserId` is an editor and the content is in the library.
 *
 * NOTE: This function does not verify editor privileges. You must pass in the correct `isEditor` flag.
 */
export function editableContentWhere(
  loggedInUserId: Uint8Array,
  isEditor: boolean = false,
) {
  let visibilityOptions = Prisma.sql`
      content.ownerId = ${loggedInUserId}
  `;

  if (isEditor) {
    visibilityOptions = Prisma.sql`
        ${visibilityOptions}
        OR (SELECT isLibrary FROM users WHERE userId = content.ownerId) = TRUE
        `;
  }

  const whereStatement = Prisma.sql`
    content.isDeletedOn IS NULL
    AND (
      ${visibilityOptions}
    )
  `;

  return whereStatement;
}

/**
 * Get edit and view permissions for this activity.
 *
 * For an activity to be editable, one of these conditions must be true:
 * 1. You are the owner
 * 2. You are an editor and the activity is in the library
 *
 * For an activity to be viewable, these conditions also work:
 *
 * 3. The activity is public
 * 4. The activity is shared with you
 *
 * @param contentId
 * @param loggedInUserId
 * @returns
 */
export async function checkActivityPermissions(
  contentId: Uint8Array,
  loggedInUserId: Uint8Array,
  isEditor: boolean,
): Promise<{
  editable: boolean;
  viewable: boolean;
  ownerId: Uint8Array | null;
}> {
  const viewable = await prisma.content.findUnique({
    where: {
      id: contentId,
      ...filterViewableActivity(loggedInUserId, isEditor),
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
  // 2. You are an editor and the activity is in the library
  if (
    isEqualUUID(viewable.owner.userId, loggedInUserId) ||
    (viewable.owner.isLibrary && isEditor)
  ) {
    return { editable: true, viewable: true, ownerId: viewable.owner.userId };
  } else {
    return { editable: false, viewable: true, ownerId: viewable.owner.userId };
  }
}

export function getEarliestRecoverableDate() {
  // Only return content deleted up to 30 days ago
  return DateTime.now().minus({ days: 30 });
}
