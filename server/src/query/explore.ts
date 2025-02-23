import { ContentType, Prisma } from "@prisma/client";
import { prisma } from "../model";
import { sanitizeQuery } from "../utils/search";
import {
  returnClassificationFilterWhereClauses,
  returnClassificationJoins,
  returnClassificationMatchClauses,
  returnFeatureJoins,
  returnFeatureWhereClauses,
} from "../utils/classificationsFeatures";
import { processContent, returnContentSelect } from "../utils/contentStructure";
import { fromUUID } from "../utils/uuid";
import { getLibraryAccountId } from "./curate";
import { PartialContentClassification, UserInfo } from "../types";
import {
  getAvailableContentFeatures,
  getClassificationInfo,
} from "./classification";
import { DateTime } from "luxon";
import { getAuthorInfo } from "./user";

export async function searchSharedContent({
  query,
  isCurated,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
  page = 1,
}: {
  query: string;
  isCurated: boolean;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
  page?: number;
}) {
  const pageSize = 100;

  const query_as_prefixes = sanitizeQuery(query);

  const matchClassification = !isUnclassified && classificationId === undefined;
  const matchSubCategory = matchClassification && subCategoryId === undefined;
  const matchCategory = matchSubCategory && categoryId === undefined;

  const includeClassification = true;
  const includeSubCategory = matchSubCategory;
  const includeCategory = matchCategory;

  const matches = await prisma.$queryRaw<
    {
      id: Uint8Array;
      relevance: number;
    }[]
  >(Prisma.sql`
  SELECT
    content.id,
    AVG((MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*5)
    +(MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)*5)
    ${ownerId === undefined ? Prisma.sql`+ MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
    ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, prependOperator: true, operator: "+" })}
    ) as relevance
  FROM
    content
  LEFT JOIN
    users ON content.ownerId = users.userId
  ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND users.isLibrary = ${isCurated ? Prisma.sql`TRUE` : Prisma.sql`FALSE`}
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND
    (
      MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, prependOperator: true, operator: "OR" })}
    )
    ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    content.id
  ORDER BY
    relevance DESC
  LIMIT ${pageSize}
  OFFSET ${(page - 1) * pageSize}
  `);

  // TODO: combine queries

  const preliminarySharedContent = await prisma.content.findMany({
    where: {
      id: { in: matches.map((m) => m.id) },
    },
    select: returnContentSelect({ includeOwnerDetails: true }),
  });

  // TODO: better way to sort! (For free if combine queries)
  const relevance = Object.fromEntries(
    matches.map((m) => [fromUUID(m.id), m.relevance]),
  );

  const sharedContent = preliminarySharedContent
    .sort((a, b) => relevance[fromUUID(b.id)] - relevance[fromUUID(a.id)])
    //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
    .map((content) => processContent(content, loggedInUserId));

  return sharedContent;
}

// TODO: add tests of this api if we're sure we want to keep it
export async function browseSharedContent({
  isCurated,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
  page = 1,
}: {
  isCurated: boolean;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
  page?: number;
}) {
  const pageSize = 100;

  const classificationsFilter = isUnclassified
    ? {
        none: {},
      }
    : classificationId !== undefined
      ? { some: { classification: { id: classificationId } } }
      : subCategoryId !== undefined ||
          categoryId !== undefined ||
          systemId !== undefined
        ? {
            some: {
              classification: {
                descriptions: {
                  some: {
                    subCategoryId,
                    subCategory: {
                      categoryId,
                      category: { systemId },
                    },
                  },
                },
              },
            },
          }
        : undefined;

  const featuresToRequire = features === undefined ? [] : [...features.keys()];

  const preliminarySharedContent = await prisma.content.findMany({
    where: {
      isDeleted: false,
      owner: { isLibrary: isCurated },
      OR: [
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
      AND: featuresToRequire.map((feature) => ({
        contentFeatures: { some: { code: feature } },
      })),
      ownerId,
      classifications: classificationsFilter,
    },
    select: returnContentSelect({ includeOwnerDetails: true }),
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  const sharedContent = preliminarySharedContent.map((content) =>
    //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
    processContent(content, loggedInUserId),
  );

  return sharedContent;
}

// TODO: add tests of this api if we're sure we want to keep it
export async function browseTrendingContent({
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
  page = 1,
  pageSize = 100,
}: {
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
  page?: number;
  pageSize?: number;
}) {
  const matchClassification = !isUnclassified && classificationId === undefined;
  const matchSubCategory = matchClassification && subCategoryId === undefined;
  const matchCategory = matchSubCategory && categoryId === undefined;

  const includeClassification = true;
  const includeSubCategory = matchSubCategory;
  const includeCategory = matchCategory;

  const libraryId = await getLibraryAccountId();

  const matches = await prisma.$queryRaw<
    {
      id: Uint8Array;
      numViews: bigint;
    }[]
  >(Prisma.sql`
  SELECT
    content.id,
    COUNT(distinct contentViews.userId) AS numViews,
    content.createdAt
  FROM
    content
  LEFT JOIN
    users ON content.ownerId = users.userId
  ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  LEFT JOIN
    contentViews ON contentViews.contentId = content.id
  WHERE
    content.isDeleted = FALSE
    AND content.ownerId <> ${libraryId}
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    content.id
  ORDER BY
    numViews DESC, content.createdAt DESC
  LIMIT ${pageSize}
  OFFSET ${(page - 1) * pageSize}
  `);

  // TODO: combine queries

  const preliminarySharedContent = await prisma.content.findMany({
    where: {
      id: { in: matches.map((m) => m.id) },
    },
    select: returnContentSelect({ includeOwnerDetails: true }),
    orderBy: { createdAt: "desc" },
  });

  // TODO: better way to sort! (For free if combine queries)
  const numViews = Object.fromEntries(
    matches.map((m) => [fromUUID(m.id), Number(m.numViews)]),
  );

  // relying on the fact that .sort() is stable so that numView ties
  // will still be sorted in descending createdAt order
  const sharedContent = preliminarySharedContent
    .sort((a, b) => numViews[fromUUID(b.id)] - numViews[fromUUID(a.id)])
    //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
    .map((content) => processContent(content, loggedInUserId));

  return sharedContent;
}

export async function searchUsersWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  page = 1,
}: {
  query: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  page?: number;
}) {
  const pageSize = 100;

  const libraryId = await getLibraryAccountId();

  const query_as_prefixes = sanitizeQuery(query);

  const includeClassification =
    classificationId !== undefined ||
    isUnclassified ||
    subCategoryId !== undefined;
  const includeSubCategory = !includeClassification && categoryId !== undefined;
  const includeCategory = !includeSubCategory && systemId !== undefined;

  const usersWithShared = await prisma.$queryRaw<
    {
      userId: Uint8Array;
      firstNames: string | null;
      lastNames: string;
      relevance: number;
    }[]
  >(Prisma.sql`
  SELECT
    users.userId, users.firstNames, users.lastNames,
    MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE) as relevance
  FROM
    users
  WHERE
    users.isAnonymous = FALSE
    AND users.userId <> ${libraryId}
    AND users.userId IN (
      SELECT ownerId 
        FROM content 
        ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
        ${returnFeatureJoins(features)}
        WHERE
          isDeleted = FALSE AND (
            isPublic = TRUE
            OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
          )
          ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
          ${returnFeatureWhereClauses(features)}
      
    )
    AND
    MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
  ORDER BY
    relevance DESC
  LIMIT ${pageSize}
  OFFSET ${(page - 1) * pageSize}
  `);

  const usersWithShared2: UserInfo[] = usersWithShared.map((u) => ({
    userId: u.userId,
    firstNames: u.firstNames,
    lastNames: u.lastNames,
    email: "",
  }));
  return usersWithShared2;
}

export async function browseUsersWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  take = 100,
  skip = 0,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  take?: number;
  skip?: number;
}) {
  let usersWithShared;

  if (query) {
    const query_as_prefixes = sanitizeQuery(query);

    const matchClassification =
      !isUnclassified && classificationId === undefined;
    const matchSubCategory = matchClassification && subCategoryId === undefined;
    const matchCategory = matchSubCategory && categoryId === undefined;

    const includeClassification = true;
    const includeSubCategory = matchSubCategory;
    const includeCategory = matchCategory;

    usersWithShared = await prisma.$queryRaw<
      {
        userId: Uint8Array;
        firstNames: string | null;
        lastNames: string;
        numContent: bigint;
      }[]
    >(Prisma.sql`
      SELECT
        users.userId, users.firstNames, users.lastNames, COUNT(content.id) AS numContent
      FROM
        users
      INNER JOIN
        content on content.ownerId = users.userId
      WHERE
        users.isAnonymous = FALSE
        AND users.isLibrary = FALSE
        AND content.id IN (
          SELECT content.id
          FROM content
          ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
          ${returnFeatureJoins(features)}
          WHERE
            content.isDeleted = FALSE
            AND (
              content.isPublic = TRUE
              OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
            )
            AND (
              MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
              OR MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
              ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, prependOperator: true, operator: "OR" })}
            )
            ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
            ${returnFeatureWhereClauses(features)}
        )
      GROUP BY
        users.userId
      ORDER BY
        numContent DESC
      LIMIT ${take}
      OFFSET ${skip}
  `);
  } else {
    const includeClassification =
      classificationId !== undefined ||
      isUnclassified ||
      subCategoryId !== undefined;
    const includeSubCategory =
      !includeClassification && categoryId !== undefined;
    const includeCategory = !includeSubCategory && systemId !== undefined;

    usersWithShared = await prisma.$queryRaw<
      {
        userId: Uint8Array;
        firstNames: string | null;
        lastNames: string;
        numContent: bigint;
      }[]
    >(Prisma.sql`
      SELECT
        users.userId, users.firstNames, users.lastNames, COUNT(content.id) AS numContent
      FROM
        users
      INNER JOIN
        content on content.ownerId = users.userId
      WHERE
        users.isAnonymous = FALSE
        AND users.isLibrary = FALSE
        AND content.id IN (
          SELECT content.id
          FROM content
          ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
          ${returnFeatureJoins(features)}
          WHERE
            content.isDeleted = FALSE
            AND (
              content.isPublic = TRUE
              OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
            )
            ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
            ${returnFeatureWhereClauses(features)}
        )
      GROUP BY
        users.userId
      ORDER BY
        numContent DESC
      LIMIT ${take}
      OFFSET ${skip}
  `);
  }

  const usersWithShared2: UserInfo[] = usersWithShared.map((u) => {
    const { numContent, ...u2 } = u;
    return {
      ...u2,
      email: "",
      numCommunity: Number(numContent),
    };
  });
  return usersWithShared2;
}

export async function searchClassificationsWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  features,
  ownerId,
}: {
  query: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  const query_as_prefixes = sanitizeQuery(query);
  const queryRegEx = query
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "|");

  const matches = await prisma.$queryRaw<
    {
      classificationId: number;
      code: string;
      descriptionId: number;
      description: string;
      subCategoryId: number;
      subCategory: string;
      categoryId: number;
      category: string;
      systemId: number;
      systemName: string;
      systemShortName: string;
      categoryLabel: string;
      subCategoryLabel: string;
      descriptionLabel: string;
      categoriesInDescription: boolean;
      codeMatch: bigint;
      relevance: number;
    }[]
  >(Prisma.sql`
  SELECT
    classifications.id as classificationId,
    classifications.code,
    classificationDescriptions.id AS descriptionId,
    classificationDescriptions.description,
    classificationSubCategories.id subCategoryId,
    classificationSubCategories.subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    REGEXP_LIKE(classifications.code, ${queryRegEx}) AS codeMatch,
    AVG(
    ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, operator: "+" })}
    ) as relevance
  FROM
    content
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND
    (
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, operator: "OR" })}
      OR classifications.code REGEXP ${queryRegEx}
    )
    ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationId, descriptionId
  ORDER BY
    codeMatch DESC, relevance DESC
  LIMIT 100
  `);

  return matches.map((m) => ({
    classification: {
      id: m.classificationId,
      code: m.code,
      descriptionId: m.descriptionId,
      description: m.description,
    },
    subCategory: {
      id: m.subCategoryId,
      subCategory: m.subCategory,
    },
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
  }));
}

export async function searchClassificationSubCategoriesWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  features,
  ownerId,
}: {
  query: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  const query_as_prefixes = sanitizeQuery(query);

  const matches = await prisma.$queryRaw<
    {
      subCategoryId: number;
      subCategory: string;
      categoryId: number;
      category: string;
      systemId: number;
      systemName: string;
      systemShortName: string;
      categoryLabel: string;
      subCategoryLabel: string;
      descriptionLabel: string;
      categoriesInDescription: boolean;
      relevance: number;
    }[]
  >(Prisma.sql`
  SELECT
    classificationSubCategories.id subCategoryId,
    classificationSubCategories.subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    ${returnClassificationMatchClauses({ query_as_prefixes, matchSubCategory: true })} as relevance
  FROM
    content
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND
    ${returnClassificationMatchClauses({ query_as_prefixes, matchSubCategory: true })}
    ${returnClassificationFilterWhereClauses({ systemId, categoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}

  GROUP BY
    classificationSubCategories.id
  ORDER BY
    relevance DESC
  LIMIT 100
  `);

  return matches.map((m) => ({
    subCategory: {
      id: m.subCategoryId,
      subCategory: m.subCategory,
    },
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
  }));
}

export async function searchClassificationCategoriesWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  features,
  ownerId,
}: {
  query: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  const query_as_prefixes = sanitizeQuery(query);

  const matches = await prisma.$queryRaw<
    {
      categoryId: number;
      category: string;
      systemId: number;
      systemName: string;
      systemShortName: string;
      categoryLabel: string;
      subCategoryLabel: string;
      descriptionLabel: string;
      categoriesInDescription: boolean;
      relevance: number;
    }[]
  >(Prisma.sql`
  SELECT
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationCategories.sortIndex,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    ${returnClassificationMatchClauses({ query_as_prefixes, matchCategory: true })} as relevance
  FROM
    content
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND
    ${returnClassificationMatchClauses({ query_as_prefixes, matchCategory: true })}
    ${returnClassificationFilterWhereClauses({ systemId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}

  GROUP BY
    classificationCategories.id
  ORDER BY
    relevance DESC, classificationCategories.sortIndex
  LIMIT 100
  `);

  return matches.map((m) => ({
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
  }));
}

export async function browseClassificationSharedContent({
  loggedInUserId,
  classificationId,
  features,
  ownerId,
  page = 1,
}: {
  loggedInUserId: Uint8Array;
  classificationId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
  page?: number;
}) {
  const pageSize = 100;

  const featuresToRequire = features === undefined ? [] : [...features.keys()];

  // TODO: how do we sort these?
  const results = await prisma.content.findMany({
    where: {
      isDeleted: false,
      OR: [
        { isPublic: true },
        { sharedWith: { some: { userId: loggedInUserId } } },
      ],
      AND: featuresToRequire.map((feature) => ({
        contentFeatures: { some: { code: feature } },
      })),
      classifications: { some: { classificationId } },
      ownerId,
    },
    select: returnContentSelect({ includeOwnerDetails: true }),
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
  const content = results.map((c) => processContent(c));

  return { content };
}

export async function browseClassificationSubCategorySharedContent({
  loggedInUserId,
  subCategoryId,
  features,
  ownerId,
}: {
  loggedInUserId: Uint8Array;
  subCategoryId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}) {
  // TODO: how do we sort the content within each classification

  const featuresToRequire = features === undefined ? [] : [...features.keys()];

  const preliminaryResults =
    await prisma.classificationSubCategories.findUniqueOrThrow({
      where: { id: subCategoryId },
      select: {
        subCategory: true,
        category: {
          select: {
            category: true,
            system: {
              select: {
                name: true,
                shortName: true,
                categoryLabel: true,
                subCategoryLabel: true,
                descriptionLabel: true,
                categoriesInDescription: true,
              },
            },
          },
        },
        descriptions: {
          where: {
            classification: {
              contentClassifications: {
                some: {
                  content: {
                    isDeleted: false,
                    OR: [
                      { isPublic: true },
                      { sharedWith: { some: { userId: loggedInUserId } } },
                    ],
                    AND: featuresToRequire.map((feature) => ({
                      contentFeatures: { some: { code: feature } },
                    })),
                    ownerId,
                  },
                },
              },
            },
          },
          orderBy: { sortIndex: "asc" },
          select: {
            description: true,
            id: true,
            classification: {
              select: {
                code: true,
                id: true,
                contentClassifications: {
                  where: {
                    content: {
                      isDeleted: false,
                      OR: [
                        { isPublic: true },
                        { sharedWith: { some: { userId: loggedInUserId } } },
                      ],
                      AND: featuresToRequire.map((feature) => ({
                        contentFeatures: { some: { code: feature } },
                      })),
                      ownerId,
                    },
                  },
                  select: {
                    content: {
                      select: returnContentSelect({
                        includeOwnerDetails: true,
                      }),
                    },
                  },
                  take: 100,
                },
              },
            },
          },
        },
      },
    });

  const results = {
    subCategory: preliminaryResults.subCategory,
    category: preliminaryResults.category,
    classifications: preliminaryResults.descriptions.map((description) => ({
      code: description.classification.code,
      classificationId: description.classification.id,
      description: description.description,
      descriptionId: description.id,
      content: description.classification.contentClassifications.map((cc) =>
        //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
        processContent(cc.content),
      ),
    })),
  };

  return results;
}

export async function browseClassificationCategorySharedContent({
  loggedInUserId,
  categoryId,
  features,
  ownerId,
}: {
  loggedInUserId: Uint8Array;
  categoryId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}) {
  const featuresToRequire = features === undefined ? [] : [...features.keys()];

  // TODO: how do we sort the content within each classification

  const preliminaryResults =
    await prisma.classificationCategories.findUniqueOrThrow({
      where: { id: categoryId },
      select: {
        category: true,
        subCategories: {
          where: {
            descriptions: {
              some: {
                classification: {
                  contentClassifications: {
                    some: {
                      content: {
                        isDeleted: false,
                        OR: [
                          { isPublic: true },
                          { sharedWith: { some: { userId: loggedInUserId } } },
                        ],
                        AND: featuresToRequire.map((feature) => ({
                          contentFeatures: { some: { code: feature } },
                        })),
                        ownerId,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { sortIndex: "asc" },
          select: {
            subCategory: true,
            id: true,
            category: {
              select: {
                category: true,
                system: {
                  select: {
                    name: true,
                    shortName: true,
                    categoryLabel: true,
                    subCategoryLabel: true,
                    descriptionLabel: true,
                    categoriesInDescription: true,
                  },
                },
              },
            },
            descriptions: {
              where: {
                classification: {
                  contentClassifications: {
                    some: {
                      content: {
                        isDeleted: false,
                        OR: [
                          { isPublic: true },
                          { sharedWith: { some: { userId: loggedInUserId } } },
                        ],
                        AND: featuresToRequire.map((feature) => ({
                          contentFeatures: { some: { code: feature } },
                        })),
                        ownerId,
                      },
                    },
                  },
                },
              },
              orderBy: { sortIndex: "asc" },
              select: {
                description: true,
                id: true,
                classification: {
                  select: {
                    code: true,
                    id: true,
                    contentClassifications: {
                      where: {
                        content: {
                          isDeleted: false,
                          OR: [
                            { isPublic: true },
                            {
                              sharedWith: { some: { userId: loggedInUserId } },
                            },
                          ],
                          AND: featuresToRequire.map((feature) => ({
                            contentFeatures: { some: { code: feature } },
                          })),
                          ownerId,
                        },
                      },
                      select: {
                        content: {
                          select: returnContentSelect({
                            includeOwnerDetails: true,
                          }),
                        },
                      },
                      take: 10,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

  const results = {
    category: preliminaryResults.category,
    subCategories: preliminaryResults.subCategories.map((subCategory) => ({
      subCategory: subCategory.subCategory,
      subCategoryId: subCategory.id,
      classifications: subCategory.descriptions.map((description) => ({
        code: description.classification.code,
        classificationId: description.classification.id,
        description: description.description,
        descriptionId: description.id,
        content: description.classification.contentClassifications.map((cc) =>
          //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
          processContent(cc.content),
        ),
      })),
    })),
  };

  return results;
}

export async function browseClassificationsWithSharedContent({
  query,
  loggedInUserId,
  subCategoryId,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  subCategoryId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  let matches;

  if (query) {
    const query_as_prefixes = sanitizeQuery(query);

    matches = await prisma.$queryRaw<
      {
        classificationId: number;
        code: string;
        descriptionId: number;
        description: string;
        subCategoryId: number;
        subCategory: string;
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
        numCurated: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classifications.id AS classificationId,
    classifications.code,
    classificationDescriptions.id AS descriptionId,
    classificationDescriptions.description,
    classificationSubCategories.id subCategoryId,
    classificationSubCategories.subCategory subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent,
    COUNT(distinct libraryActivityInfos.contentId) AS numCurated
  FROM
    content
  LEFT JOIN
    libraryActivityInfos ON content.id = libraryActivityInfos.contentId
  ${ownerId === undefined ? Prisma.sql`LEFT JOIN users ON content.ownerId = users.userId` : Prisma.empty}
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND (
      MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
    )
    ${returnClassificationFilterWhereClauses({ subCategoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classifications.id, classificationDescriptions.id
  ORDER BY
    classificationDescriptions.sortIndex
  `);
  } else {
    matches = await prisma.$queryRaw<
      {
        classificationId: number;
        code: string;
        descriptionId: number;
        description: string;
        subCategoryId: number;
        subCategory: string;
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
        numCurated: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classifications.id AS classificationId,
    classifications.code,
    classificationDescriptions.id AS descriptionId,
    classificationDescriptions.description,
    classificationSubCategories.id subCategoryId,
    classificationSubCategories.subCategory subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent,
    COUNT(distinct libraryActivityInfos.contentId) AS numCurated
  FROM
    content
  LEFT JOIN
    libraryActivityInfos ON content.id = libraryActivityInfos.contentId
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    ${returnClassificationFilterWhereClauses({ subCategoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classifications.id, classificationDescriptions.id
  ORDER BY
    classificationDescriptions.sortIndex
  `);
  }

  return matches.map((m) => ({
    classification: {
      id: m.classificationId,
      code: m.code,
      descriptionId: m.descriptionId,
      description: m.description,
    },
    subCategory: {
      id: m.subCategoryId,
      subCategory: m.subCategory,
    },
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
    numCommunity: Number(m.numContent) - Number(m.numCurated),
    numCurated: Number(m.numCurated),
  }));
}

export async function browseClassificationSubCategoriesWithSharedContent({
  query,
  loggedInUserId,
  categoryId,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  categoryId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  let matches;

  if (query) {
    const query_as_prefixes = sanitizeQuery(query);

    matches = await prisma.$queryRaw<
      {
        subCategoryId: number;
        subCategory: string;
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
        numCurated: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationSubCategories.id AS subCategoryId,
    classificationSubCategories.subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent,
    COUNT(distinct libraryActivityInfos.contentId) AS numCurated
  FROM
    content
  LEFT JOIN
    libraryActivityInfos ON content.id = libraryActivityInfos.contentId        
  ${ownerId === undefined ? Prisma.sql`LEFT JOIN users ON content.ownerId = users.userId` : Prisma.empty}
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND (
      MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, prependOperator: true, operator: "OR" })}
      ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
    )
    ${returnClassificationFilterWhereClauses({ categoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationSubCategories.id
  ORDER BY
    classificationSubCategories.sortIndex
  `);
  } else {
    matches = await prisma.$queryRaw<
      {
        subCategoryId: number;
        subCategory: string;
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
        numCurated: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationSubCategories.id AS subCategoryId,
    classificationSubCategories.subCategory,
    classificationCategories.id categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent,
    COUNT(distinct libraryActivityInfos.contentId) AS numCurated

  FROM
    content
  LEFT JOIN
    libraryActivityInfos ON content.id = libraryActivityInfos.contentId    
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    ${returnClassificationFilterWhereClauses({ categoryId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationSubCategories.id
  ORDER BY
    classificationSubCategories.sortIndex
  `);
  }

  return matches.map((m) => ({
    subCategory: {
      id: m.subCategoryId,
      subCategory: m.subCategory,
    },
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
    numCommunity: Number(m.numContent) - Number(m.numCurated),
    numCurated: Number(m.numCurated),
  }));
}

export async function browseClassificationCategoriesWithSharedContent({
  query,
  loggedInUserId,
  systemId,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  systemId: number;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  let matches;

  if (query) {
    const query_as_prefixes = sanitizeQuery(query);

    matches = await prisma.$queryRaw<
      {
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
        numCurated: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationCategories.id AS categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent,
    COUNT(distinct libraryActivityInfos.contentId) AS numCurated
  FROM
    content
  LEFT JOIN
      libraryActivityInfos ON content.id = libraryActivityInfos.contentId
  ${ownerId === undefined ? Prisma.sql`LEFT JOIN users ON content.ownerId = users.userId` : Prisma.empty}
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND (
      MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, matchSubCategory: true, prependOperator: true, operator: "OR" })}
      ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
    )
    ${returnClassificationFilterWhereClauses({ systemId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationCategories.id
  ORDER BY
    classificationCategories.sortIndex
  `);
  } else {
    matches = await prisma.$queryRaw<
      {
        categoryId: number;
        category: string;
        systemId: number;
        systemName: string;
        systemShortName: string;
        categoryLabel: string;
        subCategoryLabel: string;
        descriptionLabel: string;
        categoriesInDescription: boolean;
        numContent: bigint;
        numCurated: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationCategories.id AS categoryId,
    classificationCategories.category,
    classificationSystems.id systemId,
    classificationSystems.name systemName,
    classificationSystems.shortName systemShortName,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent,
    COUNT(distinct libraryActivityInfos.contentId) AS numCurated
  FROM
    content
  LEFT JOIN
    libraryActivityInfos ON content.id = libraryActivityInfos.contentId
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    ${returnClassificationFilterWhereClauses({ systemId })}
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationCategories.id
  ORDER BY
    classificationCategories.sortIndex
  `);
  }

  return matches.map((m) => ({
    category: {
      id: m.categoryId,
      category: m.category,
    },
    system: {
      id: m.systemId,
      name: m.systemName,
      shortName: m.systemShortName,
      descriptionLabel: m.descriptionLabel,
      subCategoryLabel: m.subCategoryLabel,
      categoryLabel: m.categoryLabel,
      categoriesInDescription: m.categoriesInDescription,
    },
    numCurated: Number(m.numCurated),
    numCommunity: Number(m.numContent) - Number(m.numCurated),
  }));
}

export async function browseClassificationSystemsWithSharedContent({
  query,
  loggedInUserId,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<PartialContentClassification[]> {
  let matches;

  if (query) {
    const query_as_prefixes = sanitizeQuery(query);

    matches = await prisma.$queryRaw<
      {
        systemId: number | null;
        systemName: string | null;
        systemShortName: string | null;
        systemType: string | null;
        categoryLabel: string | null;
        subCategoryLabel: string | null;
        descriptionLabel: string | null;
        categoriesInDescription: boolean | null;
        numContent: bigint;
        numCurated: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationSystems.id AS systemId,
    classificationSystems.name as systemName,
    classificationSystems.shortName as systemShortName,
    classificationSystems.type as systemType,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent,
    COUNT(distinct libraryActivityInfos.contentId) AS numCurated
  FROM
    content
  LEFT JOIN
      libraryActivityInfos ON content.id = libraryActivityInfos.contentId
  ${ownerId === undefined ? Prisma.sql`LEFT JOIN users ON content.ownerId = users.userId` : Prisma.empty}
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    AND (
      MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      OR MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification: true, matchSubCategory: true, matchCategory: true, prependOperator: true, operator: "OR" })}
      ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
    )
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationSystems.id
  ORDER BY
    classificationSystems.sortIndex
  `);
  } else {
    matches = await prisma.$queryRaw<
      {
        systemId: number | null;
        systemName: string | null;
        systemShortName: string | null;
        systemType: string | null;
        categoryLabel: string | null;
        subCategoryLabel: string | null;
        descriptionLabel: string | null;
        categoriesInDescription: boolean | null;
        numContent: bigint;
        numCurated: bigint;
      }[]
    >(Prisma.sql`
  SELECT
    classificationSystems.id AS systemId,
    classificationSystems.name as systemName,
    classificationSystems.shortName as systemShortName,
    classificationSystems.type as systemType,
    classificationSystems.categoryLabel,
    classificationSystems.subCategoryLabel,
    classificationSystems.descriptionLabel,
    classificationSystems.categoriesInDescription,
    COUNT(distinct content.id) AS numContent,
    COUNT(distinct libraryActivityInfos.contentId) AS numCurated
  FROM
    content
  LEFT JOIN
    libraryActivityInfos ON content.id = libraryActivityInfos.contentId    
  ${returnClassificationJoins({ includeSystem: true, joinFromContent: true })}
  ${returnFeatureJoins(features)}
  WHERE
    content.isDeleted = FALSE
    AND (
       content.isPublic = TRUE
       OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
    )
    ${returnFeatureWhereClauses(features)}
    ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
  GROUP BY
    classificationSystems.id
  ORDER BY
    classificationSystems.sortIndex
  `);
  }

  return matches.map((m) => {
    const numCommunity = Number(m.numContent) - Number(m.numCurated);
    const numCurated = Number(m.numCurated);

    if (m.systemId === null) {
      return { numCommunity, numCurated };
    }
    const partialClass: PartialContentClassification = {
      system: {
        id: m.systemId,
        name: m.systemName!,
        shortName: m.systemShortName!,
        descriptionLabel: m.descriptionLabel!,
        subCategoryLabel: m.subCategoryLabel!,
        categoryLabel: m.categoryLabel!,
        categoriesInDescription: m.categoriesInDescription!,
      },
      numCommunity,
      numCurated,
    };

    return partialClass;
  });
}

// TODO: add test
export async function getSharedContentMatchCount({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<{ numCommunity: number; numCurated: number }> {
  let matches;

  if (query) {
    const query_as_prefixes = sanitizeQuery(query);

    const matchClassification =
      !isUnclassified && classificationId === undefined;
    const matchSubCategory = matchClassification && subCategoryId === undefined;
    const matchCategory = matchSubCategory && categoryId === undefined;

    const includeClassification = true;
    const includeSubCategory = matchSubCategory;
    const includeCategory = matchCategory;

    matches = await prisma.$queryRaw<
      {
        numContent: bigint;
        curatedContent: bigint;
      }[]
    >(Prisma.sql`
      SELECT
        COUNT(distinct content.id) as numContent,
        COUNT(distinct libraryActivityInfos.contentId) as curatedContent
      FROM
        content
      LEFT JOIN
        users ON content.ownerId = users.userId
      LEFT JOIN
        libraryActivityInfos ON content.id = libraryActivityInfos.contentId
      ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
      ${returnFeatureJoins(features)}
      WHERE
        content.isDeleted = FALSE
        AND (
           content.isPublic = TRUE
           OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
        )
        AND
        (
          MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
          OR MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
          ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
          ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, prependOperator: true, operator: "OR" })}
        )
        ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
        ${returnFeatureWhereClauses(features)}
        ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
      `);
  } else {
    const includeClassification =
      isUnclassified ||
      classificationId !== undefined ||
      subCategoryId !== undefined;
    const includeSubCategory =
      !includeClassification && categoryId !== undefined;
    const includeCategory = !includeSubCategory && systemId !== undefined;

    matches = await prisma.$queryRaw<
      {
        numContent: bigint;
        curatedContent: bigint;
      }[]
    >(Prisma.sql`
      SELECT
        COUNT(distinct content.id) as numContent,
        COUNT(distinct libraryActivityInfos.contentId) as curatedContent
      FROM
        content
      LEFT JOIN
        users ON content.ownerId = users.userId
      LEFT JOIN
        libraryActivityInfos ON content.id = libraryActivityInfos.contentId
      ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
      ${returnFeatureJoins(features)}
      WHERE
        content.isDeleted = FALSE
        AND (
           content.isPublic = TRUE
           OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
        )
        ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
        ${returnFeatureWhereClauses(features)}
        ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
      `);
  }

  if (matches.length === 0) {
    return { numCommunity: 0, numCurated: 0 };
  } else {
    const numTotal = Number(matches[0].numContent);
    const numCurated = Number(matches[0].curatedContent);
    return { numCommunity: numTotal - numCurated, numCurated };
  }
}

// TODO: add test
export async function getSharedContentMatchCountPerAvailableFeature({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<Record<string, { numCommunity?: number; numCurated?: number }>> {
  const matchesPerFeature: Record<
    string,
    { numCommunity?: number; numCurated?: number }
  > = {};

  const availableFeatures = await getAvailableContentFeatures();

  if (query) {
    const query_as_prefixes = sanitizeQuery(query);

    const matchClassification =
      !isUnclassified && classificationId === undefined;
    const matchSubCategory = matchClassification && subCategoryId === undefined;
    const matchCategory = matchSubCategory && categoryId === undefined;

    const includeClassification = true;
    const includeSubCategory = matchSubCategory;
    const includeCategory = matchCategory;

    for (const feature of availableFeatures) {
      const newFeatures = new Set(features);
      newFeatures.add(feature.code);

      const matches = await prisma.$queryRaw<
        {
          numContent: bigint;
          numCurated: bigint;
        }[]
      >(Prisma.sql`
      SELECT
        COUNT(distinct content.id) as numContent,
        COUNT(distinct libraryActivityInfos.contentId) as numCurated
      FROM
        content
      LEFT JOIN
        users ON content.ownerId = users.userId
      LEFT JOIN
        libraryActivityInfos ON content.id = libraryActivityInfos.contentId
      ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
      ${returnFeatureJoins(newFeatures)}
      WHERE
        content.isDeleted = FALSE
        AND (
           content.isPublic = TRUE
           OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
        )
        AND
        (
          MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
          OR MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
          ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
          ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, prependOperator: true, operator: "OR" })}
        )
        ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
        ${returnFeatureWhereClauses(newFeatures)}
        ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
      `);

      if (matches.length > 0) {
        const numTotal = Number(matches[0].numContent);
        const numCurated = Number(matches[0].numCurated);
        matchesPerFeature[feature.code] = {
          numCommunity: numTotal - numCurated,
          numCurated: numCurated,
        };
      }
    }
  } else {
    const includeClassification =
      isUnclassified ||
      classificationId !== undefined ||
      subCategoryId !== undefined;
    const includeSubCategory =
      !includeClassification && categoryId !== undefined;
    const includeCategory = !includeSubCategory && systemId !== undefined;

    for (const feature of availableFeatures) {
      const newFeatures = new Set(features);
      newFeatures.add(feature.code);

      const matches = await prisma.$queryRaw<
        {
          numContent: bigint;
          numCurated: bigint;
        }[]
      >(Prisma.sql`
      SELECT
        COUNT(distinct content.id) as numContent,
        COUNT(distinct libraryActivityInfos.contentId) as numCurated
      FROM
        content
      LEFT JOIN
        users ON content.ownerId = users.userId
      LEFT JOIN
        libraryActivityInfos ON content.id = libraryActivityInfos.contentId
      ${returnClassificationJoins({ includeClassification, includeSubCategory, includeCategory, joinFromContent: true })}
      ${returnFeatureJoins(newFeatures)}
      WHERE
        content.isDeleted = FALSE
        AND (
           content.isPublic = TRUE
           OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
        )
        ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
        ${returnFeatureWhereClauses(newFeatures)}
        ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
      `);
      if (matches.length > 0) {
        const numTotal = Number(matches[0].numContent);
        const numCurated = Number(matches[0].numCurated);
        matchesPerFeature[feature.code] = {
          numCommunity: numTotal - numCurated,
          numCurated: numCurated,
        };
      }
    }
  }
  return matchesPerFeature;
}

export async function recordContentView(
  contentId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  try {
    await prisma.contentViews.create({
      data: { contentId, userId: loggedInUserId },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // if error was due to unique constraint failure,
        // then it was presumably due to a user viewing an activity
        // twice in one day, so we ignore the error
        return;
      }
    }
    throw e;
  }
}

/**
 * Record the fact that `contentId` was edited/viewed by `loggedInUserId`.
 *
 * Used for creating a list of recent content with {@link getRecentContent}.
 */
export async function recordRecentContent(
  loggedInUserId: Uint8Array,
  mode: "edit" | "view",
  contentId: Uint8Array,
) {
  await prisma.recentContent.upsert({
    where: {
      userId_mode_contentId: { userId: loggedInUserId, mode, contentId },
    },
    update: { accessed: DateTime.now().toJSDate() },
    create: { userId: loggedInUserId, mode, contentId },
  });
}

/**
 * Get a list of the 5 most recent items recorded by {@link recordRecentContent}
 * that were edited/viewed by `loggedInUserId`,
 * optionally filtered to just the content types of `restrictToTypes`.
 */
export async function getRecentContent(
  loggedInUserId: Uint8Array,
  mode: "edit" | "view",
  restrictToTypes: ContentType[] = [],
) {
  const results = await prisma.recentContent.findMany({
    where:
      restrictToTypes.length > 0
        ? {
            userId: loggedInUserId,
            mode,
            OR: restrictToTypes.map((t) => ({ content: { type: t } })),
          }
        : {
            userId: loggedInUserId,
            mode,
          },
    select: {
      content: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
    take: 5,
    orderBy: { accessed: "desc" },
  });
  return results.map((r) => r.content);
}

/**
 * Delete all but the most recent 100 recentContent records for each user.
 *
 * Get `getRecentContent` retrieves the most recent 10,
 * possibly filtered by content type,
 * so this query could remove items that would have been retrieved in `getRecentContent`
 * if the viewed types were unbalanced.
 *
 * Note: this query seem pretty slow even on a test database, so not sure if it is workable in production.
 * We could alternatively just purge records older than some given date.
 */
export async function purgeOldRecentContent() {
  await prisma.$executeRaw(Prisma.sql`
    DELETE rc FROM recentContent as rc
    WHERE accessed < (
      SELECT ac FROM (
        SELECT accessed ac from recentContent as rc2
        WHERE rc2.userid = rc.userId
        ORDER BY accessed DESC
        LIMIT 1 OFFSET 99
      ) as sub
    )`);
}

export async function searchExplore({
  loggedInUserId = new Uint8Array(16),
  query,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
}: {
  loggedInUserId?: Uint8Array;
  query: string;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
}) {
  isUnclassified =
    isUnclassified &&
    classificationId === undefined &&
    subCategoryId === undefined &&
    categoryId === undefined &&
    systemId === undefined;

  const topAuthors = ownerId
    ? null
    : await browseUsersWithSharedContent({
        query,
        loggedInUserId,
        systemId,
        categoryId,
        subCategoryId,
        classificationId,
        isUnclassified,
        features,
        take: 10,
      });

  const matchedAuthors = ownerId
    ? null
    : await searchUsersWithSharedContent({
        query,
        loggedInUserId,
        systemId,
        categoryId,
        subCategoryId,
        classificationId,
        isUnclassified,
        features,
      });

  const authorInfo = ownerId ? await getAuthorInfo(ownerId) : null;

  const content = await searchSharedContent({
    query,
    isCurated: false,
    loggedInUserId,
    systemId,
    categoryId,
    subCategoryId,
    classificationId,
    isUnclassified,
    features,
    ownerId,
  });

  const curatedContent = await searchSharedContent({
    query,
    isCurated: true,
    loggedInUserId,
    systemId,
    categoryId,
    subCategoryId,
    classificationId,
    isUnclassified,
    features,
    ownerId,
  });

  let matchedClassifications: PartialContentClassification[] | null = null;
  let matchedSubCategories: PartialContentClassification[] | null = null;
  let matchedCategories: PartialContentClassification[] | null = null;

  let classificationBrowse: PartialContentClassification[] | null = null;
  let subCategoryBrowse: PartialContentClassification[] | null = null;
  let categoryBrowse: PartialContentClassification[] | null = null;
  let systemBrowse: PartialContentClassification[] | null = null;

  if (!isUnclassified && classificationId === undefined) {
    matchedClassifications = await searchClassificationsWithSharedContent({
      query,
      loggedInUserId,
      systemId,
      categoryId,
      subCategoryId,
      features,
      ownerId,
    });

    if (subCategoryId !== undefined) {
      classificationBrowse = await browseClassificationsWithSharedContent({
        query,
        loggedInUserId,
        subCategoryId,
        features,
        ownerId,
      });
    } else {
      matchedSubCategories =
        await searchClassificationSubCategoriesWithSharedContent({
          query,
          loggedInUserId,
          systemId,
          categoryId,
          features,
          ownerId,
        });
      if (categoryId !== undefined) {
        subCategoryBrowse =
          await browseClassificationSubCategoriesWithSharedContent({
            query,
            loggedInUserId,
            categoryId,
            features,
            ownerId,
          });
      } else {
        matchedCategories =
          await searchClassificationCategoriesWithSharedContent({
            query,
            loggedInUserId,
            systemId,
            features,
            ownerId,
          });

        if (systemId !== undefined) {
          categoryBrowse =
            await browseClassificationCategoriesWithSharedContent({
              query,
              loggedInUserId,
              systemId,
              features,
              ownerId,
            });
        } else {
          systemBrowse = await browseClassificationSystemsWithSharedContent({
            query,
            loggedInUserId,
            features,
            ownerId,
          });
        }
      }
    }
  }

  const classificationInfo: PartialContentClassification | null = isUnclassified
    ? {}
    : await getClassificationInfo({
        systemId,
        categoryId,
        subCategoryId,
        classificationId,
      });

  const totalCount = await getSharedContentMatchCount({
    query,
    loggedInUserId,
    systemId,
    categoryId,
    subCategoryId,
    classificationId,
    isUnclassified,
    features,
    ownerId,
  });

  const countByFeature = await getSharedContentMatchCountPerAvailableFeature({
    query,
    loggedInUserId,
    systemId,
    categoryId,
    subCategoryId,
    classificationId,
    isUnclassified,
    features,
    ownerId,
  });

  return {
    topAuthors,
    matchedAuthors,
    authorInfo,
    content,
    curatedContent,
    matchedClassifications,
    matchedSubCategories,
    matchedCategories,
    classificationBrowse,
    subCategoryBrowse,
    categoryBrowse,
    systemBrowse,
    classificationInfo,
    totalCount,
    countByFeature,
  };
}

export async function browseExplore({
  loggedInUserId = new Uint8Array(16),
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  features,
  ownerId,
}: {
  loggedInUserId?: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  features?: Set<string>;
  ownerId?: Uint8Array;
}) {
  isUnclassified =
    isUnclassified &&
    classificationId === undefined &&
    subCategoryId === undefined &&
    categoryId === undefined &&
    systemId === undefined;

  const topAuthors = ownerId
    ? null
    : await browseUsersWithSharedContent({
        loggedInUserId,
        systemId,
        categoryId,
        subCategoryId,
        classificationId,
        isUnclassified,
        features,
        take: 10,
      });

  const authorInfo = ownerId ? await getAuthorInfo(ownerId) : null;

  const recentContent = await browseSharedContent({
    loggedInUserId,
    isCurated: false,
    systemId,
    categoryId,
    subCategoryId,
    classificationId,
    isUnclassified,
    features,
    ownerId,
  });

  const curatedContent = await browseSharedContent({
    isCurated: true,
    loggedInUserId,
    systemId,
    categoryId,
    subCategoryId,
    classificationId,
    isUnclassified,
    features,
    ownerId,
  });

  const trendingContent = await browseTrendingContent({
    loggedInUserId,
    systemId,
    categoryId,
    subCategoryId,
    classificationId,
    isUnclassified,
    features,
    ownerId,
    pageSize: 10,
  });

  let classificationBrowse: PartialContentClassification[] | null = null;
  let subCategoryBrowse: PartialContentClassification[] | null = null;
  let categoryBrowse: PartialContentClassification[] | null = null;
  let systemBrowse: PartialContentClassification[] | null = null;

  if (!isUnclassified && classificationId === undefined) {
    if (subCategoryId !== undefined) {
      classificationBrowse = await browseClassificationsWithSharedContent({
        loggedInUserId,
        subCategoryId,
        features,
        ownerId,
      });
    } else {
      if (categoryId !== undefined) {
        subCategoryBrowse =
          await browseClassificationSubCategoriesWithSharedContent({
            loggedInUserId,
            categoryId,
            features,
            ownerId,
          });
      } else {
        if (systemId !== undefined) {
          categoryBrowse =
            await browseClassificationCategoriesWithSharedContent({
              loggedInUserId,
              systemId,
              features,
              ownerId,
            });
        } else {
          systemBrowse = await browseClassificationSystemsWithSharedContent({
            loggedInUserId,
            features,
            ownerId,
          });
        }
      }
    }
  }

  const classificationInfo: PartialContentClassification | null = isUnclassified
    ? {}
    : await getClassificationInfo({
        systemId,
        categoryId,
        subCategoryId,
        classificationId,
      });

  const totalCount = await getSharedContentMatchCount({
    loggedInUserId,
    systemId,
    categoryId,
    subCategoryId,
    classificationId,
    isUnclassified,
    features,
    ownerId,
  });

  const countByFeature = await getSharedContentMatchCountPerAvailableFeature({
    loggedInUserId,
    systemId,
    categoryId,
    subCategoryId,
    classificationId,
    isUnclassified,
    features,
    ownerId,
  });

  return {
    topAuthors,
    authorInfo,
    recentContent,
    trendingContent,
    curatedContent,
    classificationBrowse,
    subCategoryBrowse,
    categoryBrowse,
    systemBrowse,
    classificationInfo,
    totalCount,
    countByFeature,
  };
}
