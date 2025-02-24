import { getLibraryAccountId, mustBeAdmin } from "./curate";
import { prisma } from "../model";
import { filterEditableContent } from "../utils/permissions";
import { processContent, returnContentSelect } from "../utils/contentStructure";
import { Content } from "../types";
import { getAvailableContentFeatures } from "./classification";
import { sanitizeQuery } from "../utils/search";
import { Prisma } from "@prisma/client";
import {
  returnClassificationJoins,
  returnClassificationMatchClauses,
} from "../utils/classificationsFeatures";
import { fromUUID, isEqualUUID } from "../utils/uuid";
import { recordContentView } from "./explore";
import { getAllDoenetmlVersions } from "./activity";
import { getAllLicenses } from "./share";

export async function getMyContent({
  ownerId,
  parentId,
  loggedInUserId,
}: {
  ownerId: Uint8Array;
  parentId: Uint8Array | null;
  loggedInUserId?: Uint8Array;
}) {
  if (!loggedInUserId || !isEqualUUID(ownerId, loggedInUserId)) {
    return { notMe: true as const };
  }
  return await getMyContentOrLibraryContent({
    parentId,
    loggedInUserId,
    isLibrary: false,
  });
}

/**
 * NOTE: This function does not nicely handle invalid permissions. Use {@link getMyContent} or {@link getCurationFolderContent} instead for API calls - they both call this function.
 */
async function getMyContentOrLibraryContent({
  parentId,
  loggedInUserId,
  isLibrary,
}: {
  parentId: Uint8Array | null;
  loggedInUserId: Uint8Array;
  isLibrary: boolean;
}) {
  const ownerId = isLibrary ? await getLibraryAccountId() : loggedInUserId;

  let folder: Content | null = null;

  if (parentId !== null) {
    // if ask for a folder, make sure it exists and is owned by logged in user
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        ...filterEditableContent(ownerId, false),
      },
      select: returnContentSelect({ includeShareDetails: true }),
    });

    //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
    folder = processContent(preliminaryFolder);
  }

  const preliminaryContent = await prisma.content.findMany({
    where: {
      ownerId,
      isDeleted: false,
      parentId,
    },
    select: returnContentSelect({
      includeAssignInfo: true,
      countAssignmentScores: true,
      includeShareDetails: true,
    }),
    orderBy: { sortIndex: "asc" },
  });

  //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
  const content: Content[] = preliminaryContent.map(processContent);

  //TODO: Does this API need to provide this extra data?
  const availableFeatures = await getAvailableContentFeatures();
  const allDoenetmlVersions = await getAllDoenetmlVersions();
  const allLicenses = await getAllLicenses();

  return {
    content,
    folder,
    availableFeatures,
    allDoenetmlVersions,
    allLicenses,
    notMe: false as const,
  };
}

export async function searchMyContent({
  ownerId,
  parentId,
  loggedInUserId,
  query,
}: {
  ownerId: Uint8Array;
  parentId: Uint8Array | null;
  loggedInUserId?: Uint8Array;
  query: string;
}) {
  if (!loggedInUserId || !isEqualUUID(ownerId, loggedInUserId)) {
    return { notMe: true as const };
  }
  return await searchMyContentOrLibraryContent({
    parentId,
    loggedInUserId,
    query,
    inLibrary: false,
  });
}

/**
 * NOTE: This function does not nicely handle invalid permissions. Use {@link searchMyContent} or {@link searchCurationContent} instead for API calls - they both call this function.
 */
async function searchMyContentOrLibraryContent({
  parentId,
  loggedInUserId,
  query,
  inLibrary,
}: {
  parentId: Uint8Array | null;
  loggedInUserId: Uint8Array;
  query: string;
  inLibrary: boolean;
}) {
  let ownerId = loggedInUserId;
  if (inLibrary) {
    await mustBeAdmin(loggedInUserId);
    ownerId = await getLibraryAccountId();
  }

  let folder: Content | null = null;

  if (parentId !== null) {
    // if ask for a folder, make sure it exists and is owned by logged in user
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        ...filterEditableContent(ownerId),
      },
      select: returnContentSelect({ includeShareDetails: true }),
    });

    //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
    folder = processContent(preliminaryFolder);
  }

  const query_as_prefixes = sanitizeQuery(query);

  const matches = await prisma.$queryRaw<
    {
      id: Uint8Array;
      relevance: number;
    }[]
  >(Prisma.sql`
  
    ${
      parentId !== null
        ? Prisma.sql`
        WITH RECURSIVE content_tree(id) AS (
        SELECT id FROM content
        WHERE parentId = ${parentId} AND ownerId = ${ownerId} AND isDeleted = FALSE
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
      (MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*100) +
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, matchSubCategory: true, matchCategory: true, prependOperator: true, operator: "+" })} 
      ) as relevance
    FROM
      content
    ${returnClassificationJoins({ includeCategory: true, joinFromContent: true })}
    WHERE
      ${
        parentId !== null
          ? Prisma.sql`content.id IN (SELECT id from content_tree)`
          : Prisma.sql`content.ownerId = ${ownerId} AND content.isDeleted = FALSE`
      }
      AND
      (
        MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
        OR MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
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
    select: returnContentSelect({
      includeAssignInfo: true,
      countAssignmentScores: true,
      includeShareDetails: true,
    }),
  });

  // TODO: better way to sort! (For free if combine queries)
  const relevance = Object.fromEntries(
    matches.map((m) => [fromUUID(m.id), m.relevance]),
  );

  const content: Content[] = preliminaryResults
    .sort((a, b) => relevance[fromUUID(b.id)] - relevance[fromUUID(a.id)])
    //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
    .map(processContent);

  //TODO: Do we need this extra data in this API?
  const availableFeatures = await getAvailableContentFeatures();
  const allDoenetmlVersions = await getAllDoenetmlVersions();
  const allLicenses = await getAllLicenses();

  return {
    content,
    folder,
    availableFeatures,
    allDoenetmlVersions,
    allLicenses,
    notMe: false as const,
  };
}

export async function getSharedContent({
  ownerId,
  parentId,
  loggedInUserId = new Uint8Array(16),
}: {
  ownerId: Uint8Array;
  parentId: Uint8Array | null;
  loggedInUserId?: Uint8Array;
}) {
  let folder: Content | null = null;

  if (parentId !== null) {
    // if ask for a folder, make sure it exists and is viewable by logged in user
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        ownerId,
        id: parentId,
        type: "folder",
        // Note: don't use viewable filter, as we require it to be public/shared even if owned by loggedInUserId
        isDeleted: false,
        OR: [
          { isPublic: true },
          { sharedWith: { some: { userId: loggedInUserId } } },
        ],
      },
      select: returnContentSelect({}),
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

    //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
    folder = processContent(preliminaryFolder, loggedInUserId);
  }

  const preliminarySharedContent = await prisma.content.findMany({
    where: {
      ownerId,
      parentId: parentId,
      // Note: don't use viewable filter, as we require it to be public/shared even if owned by loggedInUserId
      isDeleted: false,
      OR: [
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
    },
    select: returnContentSelect({ includeOwnerDetails: true }),
    orderBy: { sortIndex: "asc" },
  });

  // If looking in the base folder,
  // also include orphaned shared content,
  // i.e., shared content that is inside a non-shared folder.
  // That way, users can navigate to all of the owner's shared content
  // when start at the base folder
  if (parentId === null) {
    const orphanedSharedContent = await prisma.content.findMany({
      where: {
        ownerId,
        parent: {
          AND: [
            { isPublic: false },
            { sharedWith: { none: { userId: loggedInUserId } } },
          ],
        },
        // Note: don't use viewable filter, as we require it to be public/shared even if owned by loggedInUserId
        isDeleted: false,
        OR: [
          { isPublic: true },
          { sharedWith: { some: { userId: loggedInUserId } } },
        ],
      },
      select: returnContentSelect({ includeOwnerDetails: true }),
      orderBy: { sortIndex: "asc" },
    });
    preliminarySharedContent.push(...orphanedSharedContent);
  }

  const publicContent = preliminarySharedContent.map((content) =>
    //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
    processContent(content, loggedInUserId),
  );

  const owner = await prisma.users.findUniqueOrThrow({
    where: { userId: ownerId },
    select: { firstNames: true, lastNames: true },
  });

  if (folder && !isEqualUUID(loggedInUserId, folder.ownerId)) {
    await recordContentView(folder.contentId, loggedInUserId);
  }

  return {
    content: publicContent,
    owner,
    folder,
  };
}

export async function setPreferredFolderView({
  loggedInUserId,
  cardView,
}: {
  loggedInUserId?: Uint8Array;
  cardView: boolean;
}) {
  if (!loggedInUserId) {
    // if not signed in, then don't set anything and report back their choice
    return { cardView };
  }
  return await prisma.users.update({
    where: { userId: loggedInUserId },
    data: { cardView },
    select: { cardView: true },
  });
}

export async function getPreferredFolderView({
  loggedInUserId,
}: {
  loggedInUserId?: Uint8Array;
}) {
  if (!loggedInUserId) {
    // if not signed in, just have the default behavior
    return { cardView: false };
  }

  return await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: { cardView: true },
  });
}
