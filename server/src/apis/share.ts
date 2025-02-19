import { ContentType, Prisma } from "@prisma/client";
import { prisma } from "../model";
import { LicenseCode } from "../types";
import { processLicense } from "../utils/contentStructure";
import { filterEditableActivity } from "../utils/permissions";
import { getIsAdmin } from "./curate";
import { isEqualUUID } from "../utils/uuid";

export async function getLicense(code: string) {
  const preliminary_license = await prisma.licenses.findUniqueOrThrow({
    where: { code },
    include: {
      composedOf: {
        select: { composedOf: true },
        orderBy: { composedOf: { sortIndex: "asc" } },
      },
    },
  });

  const license = processLicense(preliminary_license);
  return license;
}

export async function getAllLicenses() {
  const preliminary_licenses = await prisma.licenses.findMany({
    include: {
      composedOf: {
        select: { composedOf: true },
        orderBy: { composedOf: { sortIndex: "asc" } },
      },
    },
    orderBy: { sortIndex: "asc" },
  });

  const licenses = preliminary_licenses.map(processLicense);
  return licenses;
}

export async function setContentLicense({
  id,
  loggedInUserId,
  licenseCode,
}: {
  id: Uint8Array;
  loggedInUserId: Uint8Array;
  licenseCode: LicenseCode;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  await prisma.content.update({
    where: { id, ...filterEditableActivity(loggedInUserId, isAdmin) },
    data: { licenseCode },
  });
}

/**
 * Set the `isPublic` flag on a content `id` along with all of its children.
 * Recurses to grandchildren/subfolders.
 */
export function setContentIsPublic({
  id,
  ownerId,
  isPublic,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  isPublic: boolean;
}) {
  return prisma.$queryRaw(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${id} AND ownerId = ${ownerId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ft
      ON content.parentId = ft.id
      WHERE content.isDeleted = FALSE
    )

    UPDATE content
      SET content.isPublic = ${isPublic}
      WHERE content.id IN (SELECT id from content_tree);
    `);
}

/**
 * Modify who this content `id` (and all its recursive children content) is shared with.
 * The `users` parameter will either be added or removed from the 'shared' list, depending on which action you choose.
 */
export async function modifyContentSharedWith({
  action,
  id,
  ownerId,
  users,
}: {
  action: "share" | "unshare";
  id: Uint8Array;
  ownerId: Uint8Array;
  users: Uint8Array[];
}) {
  const contentIds = (
    await prisma.$queryRaw<{ id: Uint8Array }[]>(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${id} AND ownerId = ${ownerId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ft
      ON content.parentId = ft.id
      WHERE content.isDeleted = FALSE
    )

    SELECT id from content_tree;
    `)
  ).map((obj) => obj.id);

  const relevantContentShares = users.flatMap((userId) =>
    contentIds.map((contentId) => ({ userId, contentId })),
  );

  if (action === "share") {
    // Share
    await prisma.contentShares.createMany({
      data: relevantContentShares,
      skipDuplicates: true,
    });
  } else {
    // Unshare
    await prisma.contentShares.deleteMany({
      where: {
        OR: relevantContentShares,
      },
    });
  }
}

export async function shareContentWithEmail({
  id,
  ownerId,
  email,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  email: string;
}) {
  let userId;

  try {
    userId = (
      await prisma.users.findUniqueOrThrow({
        where: { email, isAnonymous: false },
        select: { userId: true },
      })
    ).userId;
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      throw Error("User with email not found");
    } else {
      throw e;
    }
  }

  if (isEqualUUID(userId, ownerId)) {
    throw Error("Cannot share with self");
  }

  await modifyContentSharedWith({
    action: "share",
    id,
    ownerId,
    users: [userId],
  });
}
