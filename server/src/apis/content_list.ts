import { getLibraryAccountId } from "./curate";
import { prisma } from "../model";
import { filterEditableContent } from "../utils/permissions";
import { processContent, returnContentSelect } from "../utils/contentStructure";
import { Content } from "../types";
import { getAvailableContentFeatures } from "./classification";

export async function getMyFolderContent({
  folderId,
  loggedInUserId,
  isLibrary = false,
}: {
  folderId: Uint8Array | null;
  loggedInUserId: Uint8Array;
  isLibrary?: boolean;
}) {
  const ownerId = isLibrary ? await getLibraryAccountId() : loggedInUserId;

  let folder: Content | null = null;

  if (folderId !== null) {
    // if ask for a folder, make sure it exists and is owned by logged in user
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        id: folderId,
        type: "folder",
        ...filterEditableContent(ownerId, false),
      },
      select: returnContentSelect({ includeShareDetails: true }),
    });

    folder = processContent(preliminaryFolder);
  }

  const preliminaryContent = await prisma.content.findMany({
    where: {
      ownerId,
      isDeleted: false,
      parentId: folderId,
    },
    select: returnContentSelect({
      includeAssignInfo: true,
      countAssignmentScores: true,
      includeShareDetails: true,
    }),
    orderBy: { sortIndex: "asc" },
  });

  const content: Content[] = preliminaryContent.map(processContent);

  const availableFeatures = await getAvailableContentFeatures();

  return {
    content,
    folder,
    availableFeatures,
  };
}

export async function searchMyFolderContent({
  folderId,
  loggedInUserId,
  query,
  inLibrary = false, // Not to be exposed in API call
}: {
  folderId: Uint8Array | null;
  loggedInUserId: Uint8Array;
  query: string;
  inLibrary?: boolean;
}) {
  let ownerId = loggedInUserId;
  if (inLibrary) {
    await mustBeAdmin(loggedInUserId);
    ownerId = await getLibraryAccountId();
  }

  let folder: ContentStructure | null = null;

  if (folderId !== null) {
    // if ask for a folder, make sure it exists and is owned by logged in user
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        id: folderId,
        isDeleted: false,
        isFolder: true,
        ownerId,
      },
      select: returnContentStructureSharedDetailsNoClassDocsSelect(),
    });

    folder = processContentSharedDetailsNoClassDocs(preliminaryFolder);
  }

  // remove operators that break MySQL BOOLEAN search
  // and add * at the end of every word so that match beginning of words
  const query_as_prefixes = query
    .replace(/[+\-><()~*"@]+/g, " ")
    .split(" ")
    .filter((s) => s)
    .map((s) => s + "*")
    .join(" ");

  const matches = await prisma.$queryRaw<
    {
      id: Uint8Array;
      relevance: number;
    }[]
  >(Prisma.sql`
  
    ${
      folderId !== null
        ? Prisma.sql`
        WITH RECURSIVE content_tree(id) AS (
        SELECT id FROM content
        WHERE parentId = ${folderId} AND ownerId = ${ownerId} AND isDeleted = FALSE
        UNION ALL
        SELECT content.id FROM content
        INNER JOIN content_tree AS ft
        ON content.parentId = ft.id
        WHERE content.isDeleted = FALSE
      )`
        : Prisma.empty
    }
    SELECT
      content.id,
      AVG((MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) + 
      (MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) +
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, matchSubCategory: true, matchCategory: true, prependOperator: true, operator: "+" })} 
      ) as relevance
    FROM
      content
    LEFT JOIN
      (SELECT * from documents WHERE isDeleted = FALSE) AS documents ON content.id = documents.activityId
    ${returnClassificationJoins({ includeCategory: true, joinFromContent: true })}
    WHERE
      ${
        folderId !== null
          ? Prisma.sql`content.id IN (SELECT id from content_tree)`
          : Prisma.sql`content.ownerId = ${ownerId} AND content.isDeleted = FALSE`
      }
      AND
      (
        MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
        OR MATCH(documents.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
        ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, matchSubCategory: true, matchCategory: true, prependOperator: true, operator: "OR" })} 
      )
    GROUP BY
      content.id
    ORDER BY
      relevance DESC
    LIMIT 100
    `);

  // TODO: combine queries

  const preliminaryResults = await prisma.content.findMany({
    where: {
      id: { in: matches.map((m) => m.id) },
    },
    select: {
      ...returnContentStructureSharedDetailsSelect({
        includeAssignInfo: true,
      }),
      _count: { select: { assignmentScores: true } },
    },
  });

  // TODO: better way to sort! (For free if combine queries)
  const relevance = Object.fromEntries(
    matches.map((m) => [fromUUID(m.id), m.relevance]),
  );

  const content: ContentStructure[] = preliminaryResults
    .sort((a, b) => relevance[fromUUID(b.id)] - relevance[fromUUID(a.id)])
    .map(processContentSharedDetails);

  const availableFeatures = await getAvailableContentFeatures();

  return {
    content,
    folder,
    availableFeatures,
  };
}

export async function getSharedFolderContent({
  ownerId,
  folderId,
  loggedInUserId,
}: {
  ownerId: Uint8Array;
  folderId: Uint8Array | null;
  loggedInUserId: Uint8Array;
}) {
  let folder: ContentStructure | null = null;

  if (folderId !== null) {
    // if ask for a folder, make sure it exists and is viewable by logged in user
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        ownerId,
        id: folderId,
        isDeleted: false,
        isFolder: true,
        OR: [
          { isPublic: true },
          { sharedWith: { some: { userId: loggedInUserId } } },
        ],
      },
      select: returnContentStructureNoClassDocsSelect(),
    });

    // If parent folder is not public or not shared with me,
    // make it look like it doesn't have a parent folder.
    if (
      !(
        preliminaryFolder.parent &&
        (preliminaryFolder.parent.isPublic ||
          preliminaryFolder.parent.sharedWith.findIndex((cs) =>
            isEqualUUID(cs.userId, loggedInUserId),
          ) !== -1)
      )
    ) {
      preliminaryFolder.parent = null;
    }

    folder = processContentNoClassDocs(preliminaryFolder, loggedInUserId);
  }

  const preliminarySharedContent = await prisma.content.findMany({
    where: {
      ownerId,
      isDeleted: false,
      parentId: folderId,
      OR: [
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
    },
    select: returnContentStructureFullOwnerSelect(),
    orderBy: { sortIndex: "asc" },
  });

  // If looking in the base folder,
  // also include orphaned shared content,
  // i.e., shared content that is inside a non-shared folder.
  // That way, users can navigate to all of the owner's shared content
  // when start at the base folder
  if (folderId === null) {
    const orphanedSharedContent = await prisma.content.findMany({
      where: {
        ownerId,
        isDeleted: false,
        parent: {
          AND: [
            { isPublic: false },
            { sharedWith: { none: { userId: loggedInUserId } } },
          ],
        },
        OR: [
          { isPublic: true },
          { sharedWith: { some: { userId: loggedInUserId } } },
        ],
      },
      select: returnContentStructureFullOwnerSelect(),
      orderBy: { sortIndex: "asc" },
    });
    preliminarySharedContent.push(...orphanedSharedContent);
  }

  const publicContent = preliminarySharedContent.map((content) =>
    processContent(content, loggedInUserId),
  );

  const owner = await prisma.users.findUniqueOrThrow({
    where: { userId: ownerId },
    select: { firstNames: true, lastNames: true },
  });

  if (folder && !isEqualUUID(loggedInUserId, folder.ownerId)) {
    await recordContentView(folder.id, loggedInUserId);
  }

  return {
    content: publicContent,
    owner,
    folder,
  };
}

export async function setPreferredFolderView(
  loggedInUserId: Uint8Array,
  cardView: boolean,
) {
  return await prisma.users.update({
    where: { userId: loggedInUserId },
    data: { cardView },
    select: { cardView: true },
  });
}

export async function getPreferredFolderView(loggedInUserId: Uint8Array) {
  return await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: { cardView: true },
  });
}
