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

export function returnClassificationWhereClauses({
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
    return Prisma.sql`AND classificationSubCategories.id = ${subCategoryId}`;
  } else if (categoryId !== undefined) {
    return Prisma.sql`AND classificationCategories.id = ${categoryId}`;
  } else if (systemId !== undefined) {
    return Prisma.sql`AND classificationCategories.systemId = ${systemId}`;
  } else {
    return Prisma.empty;
  }
}

export function returnFeatureWhereClauses({
  isQuestion,
  isInteractive,
  containsVideo,
}: {
  isQuestion?: boolean;
  isInteractive?: boolean;
  containsVideo?: boolean;
}) {
  return Prisma.sql`
    ${isQuestion !== undefined ? Prisma.sql`AND content.isQuestion = ${isQuestion}` : Prisma.empty}
    ${isInteractive !== undefined ? Prisma.sql`AND content.isInteractive = ${isInteractive}` : Prisma.empty}
    ${containsVideo !== undefined ? Prisma.sql`AND content.containsVideo = ${containsVideo}` : Prisma.empty}
  `;
}
