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

export async function setActivityLicense({
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

export async function makeActivityPublic({
  id,
  ownerId,
  licenseCode,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  licenseCode: LicenseCode;
}) {
  await prisma.content.update({
    where: { id, isDeleted: false, ownerId: ownerId, isFolder: false },
    data: { isPublic: true, licenseCode },
  });
}

export async function makeActivityPrivate({
  id,
  ownerId,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
}) {
  await prisma.content.update({
    where: { id, isDeleted: false, ownerId, isFolder: false },
    data: { isPublic: false },
  });
}

export async function shareActivity({
  id,
  ownerId,
  licenseCode,
  users,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  licenseCode: LicenseCode;
  users: Uint8Array[];
}) {
  await prisma.content.update({
    where: { id, isDeleted: false, ownerId: ownerId, isFolder: false },
    data: {
      licenseCode,
      sharedWith: {
        createMany: {
          data: users.map((userId) => ({ userId })),
          skipDuplicates: true,
        },
      },
    },
  });
}

export async function shareActivityWithEmail({
  id,
  ownerId,
  licenseCode,
  email,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  licenseCode: LicenseCode;
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
    // cannot share with self
    throw Error("Cannot share with self");
  }

  return await shareActivity({ id, ownerId, licenseCode, users: [userId] });
}

export async function unshareActivity({
  id,
  ownerId,
  users,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  users: Uint8Array[];
}) {
  await prisma.contentShares.deleteMany({
    where: {
      content: { id, isDeleted: false, ownerId, isFolder: false },
      OR: users.map((userId) => ({ userId })),
    },
  });
}

export async function setFolderLicense({
  id,
  ownerId,
  licenseCode,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  licenseCode: LicenseCode;
}) {
  // Set license for the folder `id` along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

  await prisma.$queryRaw(Prisma.sql`
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
      SET content.licenseCode = ${licenseCode}
      WHERE content.id IN (SELECT id from content_tree);
    `);
}

export async function makeFolderPublic({
  id,
  ownerId,
  licenseCode,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  licenseCode: LicenseCode;
}) {
  // Make the folder `id` public along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

  await prisma.$queryRaw(Prisma.sql`
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
      SET content.isPublic = TRUE, content.licenseCode = ${licenseCode}
      WHERE content.id IN (SELECT id from content_tree);
    `);
}

export async function makeFolderPrivate({
  id,
  ownerId,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
}) {
  // Make the folder `id` private along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

  await prisma.$queryRaw(Prisma.sql`
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
      SET content.isPublic = FALSE
      WHERE content.id IN (SELECT id from content_tree);
    `);
}

export async function shareFolder({
  id,
  ownerId,
  licenseCode,
  users,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  licenseCode: LicenseCode;
  users: Uint8Array[];
}) {
  // Share the folder `id` to users along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

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

  // TODO: combine queries?

  await prisma.content.updateMany({
    where: { id: { in: contentIds } },
    data: {
      licenseCode,
    },
  });

  await prisma.contentShares.createMany({
    data: users.flatMap((userId) =>
      contentIds.map((contentId) => ({ userId, contentId })),
    ),
    skipDuplicates: true,
  });
}

export async function shareFolderWithEmail({
  id,
  ownerId,
  licenseCode,
  email,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  licenseCode: LicenseCode;
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
    // cannot share with self
    throw Error("Cannot share with self");
  }

  return await shareFolder({ id, ownerId, licenseCode, users: [userId] });
}

export async function unshareFolder({
  id,
  ownerId,
  users,
}: {
  id: Uint8Array;
  ownerId: Uint8Array;
  users: Uint8Array[];
}) {
  // Stop the folder `id` along with all the content inside it,
  // recursing to subfolders.

  // Verify the folder exists
  await prisma.content.findUniqueOrThrow({
    where: { id, ownerId, isFolder: true, isDeleted: false },
    select: { id: true },
  });

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

  // TODO: combine queries?

  await prisma.contentShares.deleteMany({
    where: {
      OR: users.flatMap((userId) =>
        contentIds.map((contentId) => ({ userId, contentId })),
      ),
    },
  });
}
