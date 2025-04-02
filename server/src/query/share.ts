import { Prisma } from "@prisma/client";
import { prisma } from "../model";
import { LicenseCode } from "../types";
import { processLicense } from "../utils/contentStructure";
import { filterEditableContent } from "../utils/permissions";
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
  return { license };
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

  const allLicenses = preliminary_licenses.map(processLicense);
  return { allLicenses };
}

export async function setContentLicense({
  contentId,
  loggedInUserId,
  licenseCode,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  licenseCode: LicenseCode;
}) {
  const isAdmin = await getIsAdmin(loggedInUserId);
  await prisma.content.update({
    where: { id: contentId, ...filterEditableContent(loggedInUserId, isAdmin) },
    data: { licenseCode },
  });
}

export function makeContentPublic({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  return setContentIsPublic({ contentId, loggedInUserId, isPublic: true });
}

export function makeContentPrivate({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  return setContentIsPublic({ contentId, loggedInUserId, isPublic: false });
}

/**
 * Set the `isPublic` flag on a content `id` along with all of its children.
 * Recurses to grandchildren/subfolders.
 *
 * If parent is public, however, it does not all the content to be set to private.
 */
export async function setContentIsPublic({
  contentId,
  loggedInUserId,
  isPublic,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  isPublic: boolean;
}) {
  // select content to make sure it is exists and is editable by loggedInUserId
  const content = await prisma.content.findUniqueOrThrow({
    where: { id: contentId, ...filterEditableContent(loggedInUserId) },
    select: { parent: { select: { isPublic: true } } },
  });

  if (!isPublic) {
    if (content.parent !== null && content.parent.isPublic) {
      throw new InvalidRequestError(
        "Content has a public parent -- cannot make it private.",
      );
    }
  }

  await prisma.$executeRaw(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${contentId} AND ownerId = ${loggedInUserId} AND isDeleted = FALSE
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

export function unshareContent({
  contentId,
  loggedInUserId,
  userId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  userId: Uint8Array;
}) {
  return modifyContentSharedWith({
    action: "unshare",
    contentId,
    loggedInUserId,
    users: [userId],
  });
}

/**
 * Modify who this content `id` (and all its recursive children content) is shared with.
 * The `users` parameter will either be added or removed from the 'shared' list, depending on which action you choose.
 */
export async function modifyContentSharedWith({
  action,
  contentId,
  loggedInUserId,
  users,
}: {
  action: "share" | "unshare";
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  users: Uint8Array[];
}) {
  if (action === "unshare") {
    const content = await prisma.content.findUniqueOrThrow({
      where: { id: contentId, ...filterEditableContent(loggedInUserId) },
      select: {
        parent: { select: { sharedWith: { select: { userId: true } } } },
      },
    });

    if (content.parent !== null) {
      const parentSharedWith = content.parent.sharedWith.map((s) => s.userId);
      for (const userId of users) {
        if (parentSharedWith.find((u) => isEqualUUID(u, userId))) {
          throw new InvalidRequestError(
            "Content has a parent shared with user -- cannot stop sharing with that user.",
          );
        }
      }
    }
  }

  const contentIds = (
    await prisma.$queryRaw<{ id: Uint8Array }[]>(Prisma.sql`
    WITH RECURSIVE content_tree(id) AS (
      SELECT id FROM content
      WHERE id = ${contentId} AND ownerId = ${loggedInUserId} AND isDeleted = FALSE
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
  contentId,
  loggedInUserId,
  email,
}: {
  contentId: Uint8Array;
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
      throw new InvalidRequestError("User with email not found");
    } else {
      throw e;
    }
  }

  if (isEqualUUID(userId, loggedInUserId)) {
    throw new InvalidRequestError("Cannot share with self");
  }

  await modifyContentSharedWith({
    action: "share",
    contentId: contentId,
    loggedInUserId,
    users: [userId],
  });
}
