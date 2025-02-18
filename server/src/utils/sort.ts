import { prisma } from "../model";
import { filterEditableContent } from "./permissions";

export const SORT_INCREMENT = 2 ** 32;

export type ShiftIndicesCallbackFunction = ({
  shift,
  sortIndices,
}: {
  shift: { increment: number } | { decrement: number };
  sortIndices: { gte: number } | { lte: number };
}) => Promise<void>;

/**
 * For parent given by `parentId` and `ownerId`,
 * find the `sortIndex` that will place a new item as the last entry in the parent.
 * If `parentId` is undefined, then the root folder of `ownerId` is used.
 *
 * Throws an error if `parentId` is supplied but isn't a folder, sequence, or select owned by `ownerId`.
 */
export async function getNextSortIndexForParent(
  ownerId: Uint8Array,
  parentId: Uint8Array | null,
) {
  if (parentId !== null) {
    // if a folderId is present, verify that it is a folder is owned by ownerId
    await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        type: { not: "singleDoc" },
        ...filterEditableContent(ownerId),
      },
    });
  }

  const lastIndex = (
    await prisma.content.aggregate({
      where: { ownerId, parentId },
      _max: { sortIndex: true },
    })
  )._max.sortIndex;

  return getNextSortIndex(lastIndex);
}

/**
 * Get the sort index that should come after an item with sort index `lastIndex`,
 * given that the item is the last one in the list
 */
export function getNextSortIndex(lastIndex: bigint | null) {
  // The new index is a multiple of SORT_INCREMENT and is at least SORT_INCREMENT after lastIndex.
  // It is set to zero if it is the first item in the folder.
  return lastIndex === null
    ? 0
    : Math.ceil(Number(lastIndex) / SORT_INCREMENT + 1) * SORT_INCREMENT;
}
