import { Prisma } from "@prisma/client";
import { getIsAdmin } from "../query/curate";
import { prisma } from "../model";
import { isEqualUUID } from "./uuid";

/**
 * Filter Prisma's `where` clause to exclude unviewable activities for `loggedInUserId`
 *
 * For an activity to be viewable, one of these conditions must be true:
 * 1. `loggedInUserId` is the owner
 * 2. The content is public
 * 3. The content is shared with `loggedInUserId`
 * 4. `loggedInUserId` is an admin and the content is in the library.
 *
 * NOTE: This function does not verify admin privileges. You must pass in the correct `isAdmin` flag.
 */
export function filterViewableActivity(
  loggedInUserId: Uint8Array,
  isAdmin: boolean = false,
) {
  return {
    ...filterViewableContent(loggedInUserId, isAdmin),
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
 * 4. `loggedInUserId` is an admin and the content is in the library.
 *
 * NOTE: This function does not verify admin privileges. You must pass in the correct `isAdmin` flag.
 */
export function filterViewableContent(
  loggedInUserId: Uint8Array,
  isAdmin: boolean = false,
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
  if (isAdmin) {
    visibilityOptions.push({ owner: { isLibrary: true } });
  }
  return {
    isDeleted: false,
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
 * 4. `loggedInUserId` is an admin and the content is in the library.
 *
 * NOTE: This function does not verify admin privileges. You must pass in the correct `isAdmin` flag.
 */
export function viewableContentWhere(
  loggedInUserId: Uint8Array,
  isAdmin: boolean = false,
) {
  let visibilityOptions = Prisma.sql`
      content.ownerId = ${loggedInUserId}
      OR content.isPublic = TRUE
      OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
  `;

  if (isAdmin) {
    visibilityOptions = Prisma.sql`
        ${visibilityOptions}
        OR (SELECT isLibrary FROM user WHERE userId = content.ownerId) = TRUE
        `;
  }

  const whereStatement = Prisma.sql`
    content.isDeleted = FALSE
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
 * 4. `loggedInUserId` is an admin and the content is in the library.
 *
 * NOTE: This function does not verify admin privileges. You must pass in the correct `isAdmin` flag.
 */
export function filterEditableActivity(
  loggedInUserId: Uint8Array,
  isAdmin: boolean = false,
) {
  return {
    ...filterEditableContent(loggedInUserId, isAdmin),
    type: { not: "folder" as const },
  };
}

/**
 * Filter Prisma's `where` clause to exclude uneditable content by `loggedInUserId`
 *
 * For content to be editable, one of these conditions must be true:
 * 1. `loggedInUserId` is the owner
 * 4. `loggedInUserId` is an admin and the content is in the library.
 *
 * NOTE: This function does not verify admin privileges. You must pass in the correct `isAdmin` flag.
 */
export function filterEditableContent(
  loggedInUserId: Uint8Array,
  isAdmin: boolean = false,
) {
  const editabilityOptions: (
    | { ownerId: Uint8Array }
    | { owner: { isLibrary: boolean } }
  )[] = [{ ownerId: loggedInUserId }];

  if (isAdmin) {
    editabilityOptions.push({ owner: { isLibrary: true } });
  }
  return {
    isDeleted: false,
    OR: editabilityOptions,
  };
}

/**
 * Get edit and view permissions for this activity.
 *
 * For an activity to be editable, one of these conditions must be true:
 * 1. You are the owner
 * 2. You are an admin and the activity is in the library
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
): Promise<{
  editable: boolean;
  viewable: boolean;
  ownerId: Uint8Array | null;
}> {
  const isAdmin = await getIsAdmin(loggedInUserId);

  const viewable = await prisma.content.findUnique({
    where: {
      id: contentId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
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
  // 2. You are an admin and the activity is in the library
  if (
    isEqualUUID(viewable.owner.userId, loggedInUserId) ||
    (viewable.owner.isLibrary && isAdmin)
  ) {
    return { editable: true, viewable: true, ownerId: viewable.owner.userId };
  } else {
    return { editable: false, viewable: true, ownerId: viewable.owner.userId };
  }
}
