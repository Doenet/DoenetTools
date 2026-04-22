import { Visibility } from "@prisma/client";
import { prisma } from "../model";
import { InvalidRequestError } from "../utils/error";
import { getAncestorIds, getDescendantIds } from "../query/activity";
import type { AccessPolicy } from "./types";
import { StatusCodes } from "http-status-codes";
import { isEqualUUID } from "../utils/uuid";

// Visibility levels ordered from most restrictive to least restrictive
const visibilityOrder: Record<Visibility, number> = {
  private: 0,
  unlisted: 1,
  public: 2,
};

function uuidKey(id: Uint8Array) {
  return Buffer.from(id).toString("hex");
}

async function getUpdatableDescendantIds(contentId: Uint8Array) {
  const descendantIds = await getDescendantIds(contentId);

  if (descendantIds.length === 0) {
    return descendantIds;
  }

  const assignmentRoots = await prisma.content.findMany({
    where: {
      id: { in: descendantIds },
      isAssignmentRoot: true,
      isDeletedOn: null,
    },
    select: { id: true },
  });

  if (assignmentRoots.length === 0) {
    return descendantIds;
  }

  const assignmentDescendants = await Promise.all(
    assignmentRoots.map(({ id }) => getDescendantIds(id)),
  );
  const excludedIds = new Set(
    assignmentRoots.flatMap(({ id }, index) => [
      uuidKey(id),
      ...assignmentDescendants[index].map(uuidKey),
    ]),
  );

  return descendantIds.filter((id) => !excludedIds.has(uuidKey(id)));
}

/**
 * Updates the visibility of a content item and its descendants.
 *
 * Rules:
 * 1. Only the owner can change visibility
 * 2. Assignments cannot have their visibility changed (always private)
 * 3. A child cannot be less public than its parent
 * 4. Content within an assignment cannot have visibility changed
 */
export async function updateVisibility({
  loggedInUserId,
  contentId,
  visibility,
}: {
  loggedInUserId: Uint8Array;
  contentId: Uint8Array;
  visibility: Visibility;
}): Promise<AccessPolicy> {
  const content = await prisma.content.findFirst({
    where: { id: contentId, isDeletedOn: null },
    select: {
      ownerId: true,
      isAssignmentRoot: true,
      visibility: true,
      parent: {
        select: {
          visibility: true,
        },
      },
    },
  });

  if (!content || !isEqualUUID(content.ownerId, loggedInUserId)) {
    throw new InvalidRequestError("Content not found", StatusCodes.NOT_FOUND);
  }

  const ancestorIds = await getAncestorIds(contentId);
  const assignmentAncestor = await prisma.content.findFirst({
    where: {
      id: { in: ancestorIds },
      isAssignmentRoot: true,
      isDeletedOn: null,
    },
    select: { id: true },
  });

  if (content.isAssignmentRoot || assignmentAncestor) {
    throw new InvalidRequestError("Assignment visibility cannot be changed");
  }

  // Validate hierarchy: check if parent is more restrictive than new visibility
  if (content.parent) {
    const parentLevel = visibilityOrder[content.parent.visibility];
    const newLevel = visibilityOrder[visibility];

    // Child cannot be less public than parent
    if (newLevel < parentLevel) {
      throw new InvalidRequestError(
        `Cannot set visibility to ${visibility} (less public than parent's ${content.parent.visibility})`,
      );
    }
  }

  const descendantIds = await getUpdatableDescendantIds(contentId);

  const publiclySharedAt = visibility === "public" ? new Date() : null;

  // Update share timestamp for those whose share status is changing
  const updateTimestamp = prisma.content.updateMany({
    where: {
      id: { in: [contentId, ...descendantIds] },
      NOT: { visibility },
    },
    data: { publiclySharedAt },
  });

  const updateContent = prisma.content.updateMany({
    where: {
      id: { in: [contentId, ...descendantIds] },
    },
    data: {
      visibility,
      isPublic: visibility === "public", // legacy flag, remove eventually
    },
  });

  // Note: updateTimestamp first because it checks `visibility` status
  await prisma.$transaction([updateTimestamp, updateContent]);

  return { visibility };
}
