import { Prisma } from "@prisma/client";
import { prisma } from "../model";
import { LicenseCode } from "../types";
import { processLicense } from "../utils/contentStructure";
import {
  filterEditableActivity,
  filterEditableContent,
} from "../utils/permissions";
import { getIsAdmin } from "./curate";
import { isEqualUUID } from "../utils/uuid";
import { InvalidRequestError } from "../utils/error";

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
    where: { id, ...filterEditableContent(loggedInUserId, isAdmin) },
    data: { licenseCode },
  });
}

/**
 * Set the `isPublic` flag on a content `id` along with all of its children.
 * Recurses to grandchildren/subfolders.
 *
 * If parent is public, however, it does not all the content to be set to private.
 */
export async function setContentIsPublic({
  id,
  loggedInUserId,
  isPublic,
}: {
  id: Uint8Array;
  loggedInUserId: Uint8Array;
  isPublic: boolean;
}) {
  if (!isPublic) {
    const content = await prisma.content.findUniqueOrThrow({
      where: { id, ...filterEditableContent(loggedInUserId) },
      select: { parent: { select: { isPublic: true } } },
    });

    if (content.parent !== null && content.parent.isPublic) {
      throw new InvalidRequestError(
        "Content has a public parent -- cannot make it private.",
      );
    }
  }

  return prisma.$queryRaw(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${id} AND ownerId = ${loggedInUserId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ct
      ON content.parentId = ct.id
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
  loggedInUserId,
  users,
}: {
  action: "share" | "unshare";
  id: Uint8Array;
  loggedInUserId: Uint8Array;
  users: Uint8Array[];
}) {
  const contentIds = (
    await prisma.$queryRaw<{ id: Uint8Array }[]>(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${id} AND ownerId = ${loggedInUserId} AND isDeleted = FALSE
      UNION ALL
      SELECT content.id FROM content
      INNER JOIN content_tree AS ct
      ON content.parentId = ct.id
      WHERE content.isDeleted = FALSE
    )

    SELECT id from content_tree;
    `)
  ).map((obj) => obj.id);

  if (contentIds.length === 0) {
    throw new InvalidRequestError("Content does not exist or is not editable");
  }

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
  loggedInUserId,
  email,
}: {
  id: Uint8Array;
  loggedInUserId: Uint8Array;
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

  if (isEqualUUID(userId, loggedInUserId)) {
    throw Error("Cannot share with self");
  }

  await modifyContentSharedWith({
    action: "share",
    id,
    loggedInUserId,
    users: [userId],
  });
}
