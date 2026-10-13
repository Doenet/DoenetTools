import { Prisma } from "@prisma/client";
import { prisma } from "../model";
import { sanitizeQuery } from "../utils/search";
import {
  returnClassificationFilterWhereClauses,
  returnClassificationJoins,
  returnClassificationMatchClauses,
  returnCategoryJoins,
  returnCategoryWhereClauses,
} from "../utils/classificationsCategories";
import { getAllCategories } from "../categories";

// The implementation of `countMatchingContentByCategory` from before it was
// rewritten as a single grouped query, kept unchanged so tests can check the
// new implementation in `query/explore.ts` against it. It runs one count query
// per category. Only the function name is changed, and
// `returnExploreVisibilityWhereClause` is copied here because explore.ts
// doesn't export it.

function returnExploreVisibilityWhereClause(loggedInUserId: Uint8Array) {
  return Prisma.sql`
    content.visibility = 'public'
    OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
  `;
}

export async function countMatchingContentByCategoryOld({
  query,
  loggedInUserId,
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified,
  categories,
  ownerId,
}: {
  query?: string;
  loggedInUserId: Uint8Array;
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
  categories?: Set<string>;
  ownerId?: Uint8Array;
}): Promise<Record<string, { numCommunity?: number; numCurated?: number }>> {
  const matchesPerCategory: Record<
    string,
    { numCommunity?: number; numCurated?: number }
  > = {};

  const { allCategories } = await getAllCategories();

  // Note: these queries iterate through all categories and, for each category, temporarily adds it
  // to the existing filter set to count how many content items would match. This is used to populate
  // category filter UI elements with counts showing users how many results they would get if they
  // selected each additional category.

  if (query) {
    const query_as_prefixes = sanitizeQuery(query);

    const matchClassification =
      !isUnclassified && classificationId === undefined;
    const matchSubCategory = matchClassification && subCategoryId === undefined;
    const matchCategory = matchSubCategory && categoryId === undefined;

    const includeClassification = true;
    const includeSubCategory = matchSubCategory;
    const includeCategory = matchCategory;

    for (const categoryGroup of allCategories) {
      for (const category of categoryGroup.categories) {
        const newCategories = new Set(categories);
        newCategories.add(category.code);

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
      ${returnCategoryJoins(newCategories)}
      WHERE
        content.isDeletedOn IS NULL
        AND (
           ${returnExploreVisibilityWhereClause(loggedInUserId)}
        )
        AND
        (
          MATCH(content.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
          OR MATCH(content.source) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
          ${ownerId === undefined ? Prisma.sql`OR MATCH(users.firstNames, users.lastNames) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)` : Prisma.empty}
          ${returnClassificationMatchClauses({ query_as_prefixes, matchClassification, matchSubCategory, matchCategory, prependOperator: true, operator: "OR" })}
        )
        ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
        ${returnCategoryWhereClauses(newCategories)}
        ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
      `);

        if (matches.length > 0) {
          const numTotal = Number(matches[0].numContent);
          const numCurated = Number(matches[0].numCurated);
          matchesPerCategory[category.code] = {
            numCommunity: numTotal - numCurated,
            numCurated: numCurated,
          };
        }
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

    for (const categoryGroup of allCategories) {
      for (const category of categoryGroup.categories) {
        const newCategories = new Set(categories);
        newCategories.add(category.code);

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
      ${returnCategoryJoins(newCategories)}
      WHERE
        content.isDeletedOn IS NULL
        AND (
           ${returnExploreVisibilityWhereClause(loggedInUserId)}
        )
        ${returnClassificationFilterWhereClauses({ systemId, categoryId, subCategoryId, classificationId, isUnclassified })}
        ${returnCategoryWhereClauses(newCategories)}
        ${ownerId === undefined ? Prisma.empty : Prisma.sql`AND content.ownerId=${ownerId}`}
      `);
        if (matches.length > 0) {
          const numTotal = Number(matches[0].numContent);
          const numCurated = Number(matches[0].numCurated);
          matchesPerCategory[category.code] = {
            numCommunity: numTotal - numCurated,
            numCurated: numCurated,
          };
        }
      }
    }
  }
  return matchesPerCategory;
}
