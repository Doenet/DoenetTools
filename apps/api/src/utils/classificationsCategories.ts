import { Prisma } from "@prisma/client";
import { ContentClassification } from "../types";

export function sortClassifications(classifications: ContentClassification[]) {
  // Sort based on the first description of the classification.

  function comparator(a: ContentClassification, b: ContentClassification) {
    return a.descriptions[0].sortIndex - b.descriptions[0].sortIndex;
  }

  classifications.sort(comparator);

  return classifications;
}

export function returnClassificationJoins({
  includeSystem = false,
  includeCategory = false,
  includeSubCategory = false,
  includeClassification = false,
  joinFromContent = false,
}: {
  includeSystem?: boolean;
  includeCategory?: boolean;
  includeSubCategory?: boolean;
  includeClassification?: boolean;
  joinFromContent?: boolean;
}) {
  if (
    !(
      includeClassification ||
      includeSubCategory ||
      includeCategory ||
      includeSystem
    )
  ) {
    return Prisma.empty;
  }

  return Prisma.sql`${
    joinFromContent
      ? Prisma.sql`
        LEFT JOIN
          contentClassifications ON content.id = contentClassifications.contentId
        LEFT JOIN
          classifications ON contentClassifications.classificationId = classifications.id`
      : Prisma.empty
  }
        LEFT JOIN
          classificationDescriptions ON classifications.id = classificationDescriptions.classificationId
  ${
    includeSubCategory || includeCategory || includeSystem
      ? Prisma.sql`
        LEFT JOIN
          classificationSubCategories ON classificationDescriptions.subCategoryId = classificationSubCategories.id`
      : Prisma.empty
  }
  ${
    includeCategory || includeSystem
      ? Prisma.sql`
        LEFT JOIN
          classificationCategories ON classificationSubCategories.categoryId = classificationCategories.id`
      : Prisma.empty
  }
  ${
    includeSystem
      ? Prisma.sql`
        LEFT JOIN
          classificationSystems ON classificationCategories.systemId = classificationSystems.id`
      : Prisma.empty
  }`;
}

export function returnClassificationMatchClauses({
  query_as_prefixes,
  matchClassification = false,
  matchSubCategory = false,
  matchCategory = false,
  matchSystem = false,
  prependOperator = false,
  operator = "OR",
}: {
  query_as_prefixes: string;
  matchClassification?: boolean;
  matchSubCategory?: boolean;
  matchCategory?: boolean;
  matchSystem?: boolean;
  prependOperator?: boolean;
  operator?: "+" | "OR";
}) {
  if (!(matchClassification || matchSubCategory || matchCategory)) {
    return Prisma.empty;
  }

  let classificationSQL;

  if (matchClassification) {
    classificationSQL = Prisma.sql`
      MATCH(classifications.code) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)
      + MATCH(classificationDescriptions.description) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)`;

    if (prependOperator) {
      if (operator === "OR") {
        classificationSQL = Prisma.sql`OR ${classificationSQL}`;
      } else {
        classificationSQL = Prisma.sql`+ ${classificationSQL}`;
      }
    }
  } else {
    classificationSQL = Prisma.empty;
  }

  let subCategorySQL;
  if (matchSubCategory) {
    subCategorySQL = Prisma.sql`MATCH(classificationSubCategories.subCategory) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)`;
    if (prependOperator || matchClassification) {
      if (operator === "OR") {
        subCategorySQL = Prisma.sql`OR ${subCategorySQL}`;
      } else {
        subCategorySQL = Prisma.sql`+ ${subCategorySQL}`;
      }
    }
  } else {
    subCategorySQL = Prisma.empty;
  }

  let categorySQL;
  if (matchCategory) {
    categorySQL = Prisma.sql`MATCH(classificationCategories.category) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)`;
    if (prependOperator || matchClassification || matchSubCategory) {
      if (operator === "OR") {
        categorySQL = Prisma.sql`OR ${categorySQL}`;
      } else {
        categorySQL = Prisma.sql`+ ${categorySQL}`;
      }
    }
  } else {
    categorySQL = Prisma.empty;
  }

  let systemSQL;
  if (matchSystem) {
    systemSQL = Prisma.sql`MATCH(classificationSystems.name) AGAINST(${query_as_prefixes} IN BOOLEAN MODE)`;
    if (
      prependOperator ||
      matchClassification ||
      matchSubCategory ||
      matchCategory
    ) {
      if (operator === "OR") {
        systemSQL = Prisma.sql`OR ${systemSQL}`;
      } else {
        systemSQL = Prisma.sql`+ ${systemSQL}`;
      }
    }
  } else {
    systemSQL = Prisma.empty;
  }

  return Prisma.sql`${classificationSQL} ${subCategorySQL} ${categorySQL} ${systemSQL}`;
}

export function returnClassificationFilterWhereClauses({
  systemId,
  categoryId,
  subCategoryId,
  classificationId,
  isUnclassified = false,
}: {
  systemId?: number;
  categoryId?: number;
  subCategoryId?: number;
  classificationId?: number;
  isUnclassified?: boolean;
}) {
  if (isUnclassified) {
    return Prisma.sql`AND classifications.id is null`;
  } else if (classificationId !== undefined) {
    return Prisma.sql`AND classifications.id = ${classificationId}`;
  } else if (subCategoryId !== undefined) {
    return Prisma.sql`AND classificationDescriptions.subCategoryId = ${subCategoryId}`;
  } else if (categoryId !== undefined) {
    return Prisma.sql`AND classificationSubCategories.categoryId = ${categoryId}`;
  } else if (systemId !== undefined) {
    return Prisma.sql`AND classificationCategories.systemId = ${systemId}`;
  } else {
    return Prisma.empty;
  }
}

/**
 * The most category codes that each get their own subquery in
 * `returnCategoryWhereClauses`. Larger sets share one grouped subquery.
 */
const MAX_CATEGORY_SUBQUERIES = 30;

/**
 * Generates a SQL WHERE clause to match content that has ALL specified categories.
 * Codes that are not category codes match nothing, so they exclude all content.
 *
 * Up to `MAX_CATEGORY_SUBQUERIES` codes, each code gets its own `IN` subquery.
 * MySQL turns these into semijoins, so it can start from the content with the
 * rarest category. Past about 20 codes it runs the rest as subqueries instead
 * of joining more tables, so the query stays under its limit of 61 tables in
 * a join.
 *
 * More codes share one subquery that groups by content, so a long list of
 * codes doesn't make a long query. MySQL can't turn a grouped subquery into a
 * semijoin, so it checks every content row against it.
 *
 * @param categories - A set of category codes that must all be present. If undefined or empty, returns Prisma.empty.
 * @returns Prisma.Sql object containing AND clauses on `content.id`, or Prisma.empty if no categories specified.
 *
 * @example
 * // For categories = new Set(["math", "algebra"])
 * // Generates:
 * // AND content.id IN (
 * //   SELECT categoriesTocontent.B FROM _categoriesTocontent AS categoriesTocontent
 * //   JOIN categories ON categories.id = categoriesTocontent.A
 * //   WHERE categories.code = 'math'
 * // )
 * // AND content.id IN (
 * //   SELECT categoriesTocontent.B FROM _categoriesTocontent AS categoriesTocontent
 * //   JOIN categories ON categories.id = categoriesTocontent.A
 * //   WHERE categories.code = 'algebra'
 * // )
 */
export function returnCategoryWhereClauses(categories?: Set<string>) {
  if (categories === undefined || categories.size === 0) {
    return Prisma.empty;
  }

  if (categories.size <= MAX_CATEGORY_SUBQUERIES) {
    return Prisma.join(
      [...categories].map(
        (code) => Prisma.sql`AND content.id IN (
          SELECT categoriesTocontent.B
          FROM _categoriesTocontent AS categoriesTocontent
          JOIN categories ON categories.id = categoriesTocontent.A
          WHERE categories.code = ${code}
        )`,
      ),
      " ",
    );
  }

  // A category is attached to a content at most once and codes are unique,
  // so COUNT(*) counts the distinct requested categories each content has.
  return Prisma.sql`AND content.id IN (
    SELECT categoriesTocontent.B
    FROM _categoriesTocontent AS categoriesTocontent
    JOIN categories ON categories.id = categoriesTocontent.A
    WHERE categories.code IN (${Prisma.join([...categories])})
    GROUP BY categoriesTocontent.B
    HAVING COUNT(*) = ${categories.size}
  )`;
}
