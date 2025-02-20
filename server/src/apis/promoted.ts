import { ContentType } from "@prisma/client";
import { prisma } from "../model";
import { InvalidRequestError } from "../utils/error";
import { calculateNewSortIndex, getNextSortIndex, ShiftIndicesCallbackFunction } from "../utils/sort";
import { getIsAdmin, mustBeAdmin } from "./curate";
import { filterViewableContent } from "../utils/permissions";
import { Content } from "../types";

export async function addPromotedContentGroup(
  groupName: string,
  userId: Uint8Array,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );

  const lastIndex = (
    await prisma.promotedContentGroups.aggregate({
      _max: { sortIndex: true },
    })
  )._max.sortIndex;

  const newIndex = getNextSortIndex(lastIndex);

  const { id } = await prisma.promotedContentGroups.create({
    data: {
      groupName,
      sortIndex: newIndex,
    },
  });
  return id;
}

export async function updatePromotedContentGroup(
  groupId: number,
  newGroupName: string,
  homepage: boolean,
  currentlyFeatured: boolean,
  userId: Uint8Array,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );

  await prisma.promotedContentGroups.update({
    where: {
      id: groupId,
    },
    data: {
      groupName: newGroupName,
      homepage,
      currentlyFeatured,
    },
  });
}

export async function deletePromotedContentGroup(
  groupId: number,
  userId: Uint8Array,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );
  // Delete group and entries all in one transaction, so both succeed or fail together
  const deleteEntries = prisma.promotedContent.deleteMany({
    where: {
      promotedGroupId: groupId,
    },
  });
  const deleteGroup = prisma.promotedContentGroups.delete({
    where: {
      id: groupId,
    },
  });
  await prisma.$transaction([deleteEntries, deleteGroup]);
}

/**
 * Move the promoted content group with `groupId` to position `desiredPosition`
 *
 * `desiredPosition` is the 0-based index in the array of promoted content groups
 * sorted by `sortIndex`.
 */
export async function movePromotedContentGroup(
  groupId: number,
  userId: Uint8Array,
  desiredPosition: number,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );

  if (!Number.isInteger(desiredPosition)) {
    throw Error("desiredPosition must be an integer");
  }

  // find the sort indices of all groups other then moved group
  const currentSortIndices = (
    await prisma.promotedContentGroups.findMany({
      where: {
        id: { not: groupId },
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
    await prisma.promotedContentGroups.updateMany({
      where: {
        id: { not: groupId },
        sortIndex: sortIndices,
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

  // Move the item!
  await prisma.promotedContentGroups.update({
    where: {
      id: groupId,
    },
    data: {
      sortIndex: newSortIndex,
    },
  });
}

export async function loadPromotedContent(userId: Uint8Array) {
  const isAdmin = userId ? await getIsAdmin(userId) : false;
  const content = await prisma.promotedContentGroups.findMany({
    where: {
      // If admin, also include groups not featured
      currentlyFeatured: isAdmin ? undefined : true,
    },
    orderBy: {
      sortIndex: "asc",
    },
    select: {
      groupName: true,
      id: true,
      currentlyFeatured: true,
      homepage: true,

      promotedContent: {
        select: {
          activity: {
            select: returnContentStructureFullOwnerSelect(),
          },
        },
        orderBy: { sortIndex: "asc" },
      },
    },
  });

  const reformattedContent: {
    groupName: string;
    promotedGroupId: number;
    currentlyFeatured: boolean;
    homepage: boolean;
    promotedContent: Content[];
  }[] = content.map((groupContent) => {
    const reformattedActivities: Content[] =
      groupContent.promotedContent.map((content) =>
        processContent(content.activity),
      );

    return {
      groupName: groupContent.groupName,
      promotedGroupId: groupContent.id,
      currentlyFeatured: groupContent.currentlyFeatured,
      homepage: groupContent.homepage,
      promotedContent: reformattedActivities,
    };
  });

  return reformattedContent;
}

export async function addPromotedContent(
  groupId: number,
  activityId: Uint8Array,
  userId: Uint8Array,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      NOT: {
        type: ContentType.folder,
      },
      isPublic: true,
      isDeleted: false,
    },
    select: {
      // not using this, we just need to select one field
      id: true,
    },
  });
  if (!activity) {
    throw new InvalidRequestError(
      "This activity does not exist or is not public.",
    );
  }
  const lastIndex = (
    await prisma.promotedContent.aggregate({
      where: { promotedGroupId: groupId },
      _max: { sortIndex: true },
    })
  )._max.sortIndex;

  const newIndex = getNextSortIndex(lastIndex);

  await prisma.promotedContent.create({
    data: {
      activityId,
      promotedGroupId: groupId,
      sortIndex: newIndex,
    },
  });
}

export async function removePromotedContent(
  groupId: number,
  activityId: Uint8Array,
  userId: Uint8Array,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      isPublic: true,
      NOT: {
        type: ContentType.folder,
      },
      isDeleted: false,
    },
    select: {
      // not using this, we just need to select one field
      id: true,
    },
  });
  if (!activity) {
    throw new InvalidRequestError(
      "This activity does not exist or is not public.",
    );
  }

  await prisma.promotedContent.delete({
    where: {
      activityId_promotedGroupId: {
        activityId,
        promotedGroupId: groupId,
      },
    },
  });
}

/**
 * Move the promoted content with `activityId` to position `desiredPosition` in the group `groupId`
 *
 * `desiredPosition` is the 0-based index in the array of promoted content with group `groupId`
 * sorted by `sortIndex`.
 */
export async function movePromotedContent(
  groupId: number,
  activityId: Uint8Array,
  userId: Uint8Array,
  desiredPosition: number,
) {
  await mustBeAdmin(
    userId,
    "You must be a community admin to edit promoted content.",
  );
  const activity = await prisma.content.findUnique({
    where: {
      id: activityId,
      isPublic: true,
      NOT: {
        type: ContentType.folder,
      },
      isDeleted: false,
    },
    select: {
      // not using this, we just need to select one field
      id: true,
    },
  });
  if (!activity) {
    throw new InvalidRequestError(
      "This activity does not exist or is not public.",
    );
  }

  if (!Number.isInteger(desiredPosition)) {
    throw Error("desiredPosition must be an integer");
  }

  // find the sort indices of all promoted content in group other than moved content
  const currentSortIndices = (
    await prisma.promotedContent.findMany({
      where: {
        promotedGroupId: groupId,
        activityId: { not: activityId },
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
    await prisma.promotedContent.updateMany({
      where: {
        promotedGroupId: groupId,
        activityId: { not: activityId },
        sortIndex: sortIndices,
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

  // Move the item!
  await prisma.promotedContent.update({
    where: {
      activityId_promotedGroupId: { activityId, promotedGroupId: groupId },
    },
    data: {
      sortIndex: newSortIndex,
    },
  });
}

export async function getAllRecentPublicActivities() {
  const activities = await prisma.content.findMany({
    where: {
      isPublic: true,
      isDeleted: false,
      NOT: {
        type: ContentType.folder,
      },
    },
    orderBy: { lastEdited: "desc" },
    take: 100,
    select: returnContentStructureFullOwnerSelect(),
  });

  const activities2 = activities.map((activity) => processContent(activity));

  return activities2;
}
