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

export function returnFeatureJoins(features?: Record<string, boolean>) {
  const numFeatures = features === undefined ? 0 : Object.keys(features).length;

  // TODO: a better way to do this?
  if (numFeatures === 0) {
    return Prisma.empty;
  } else if (numFeatures === 1) {
    return Prisma.sql`
      LEFT JOIN _contentTocontentFeatures AS ccf1 ON ccf1.A = content.id
      LEFT JOIN contentFeatures as contentFeatures1 on contentFeatures1.id = ccf1.B 
    `;
  } else if (numFeatures === 2) {
    return Prisma.sql`
      LEFT JOIN _contentTocontentFeatures AS ccf1 ON ccf1.A = content.id
      LEFT JOIN contentFeatures as contentFeatures1 on contentFeatures1.id = ccf1.B 
      LEFT JOIN _contentTocontentFeatures AS ccf2 ON ccf2.A = content.id
      LEFT JOIN contentFeatures as contentFeatures2 on contentFeatures2.id = ccf2.B 
    `;
  } else {
    // stopping at 3 features for now
    return Prisma.sql`
      LEFT JOIN _contentTocontentFeatures AS ccf1 ON ccf1.A = content.id
      LEFT JOIN contentFeatures as contentFeatures1 on contentFeatures1.id = ccf1.B 
      LEFT JOIN _contentTocontentFeatures AS ccf2 ON ccf2.A = content.id
      LEFT JOIN contentFeatures as contentFeatures2 on contentFeatures2.id = ccf2.B 
      LEFT JOIN _contentTocontentFeatures AS ccf3 ON ccf3.A = content.id
      LEFT JOIN contentFeatures as contentFeatures3 on contentFeatures3.id = ccf3.B 
    `;
  }
}

export function returnFeatureWhereClauses(features?: Record<string, boolean>) {
  // TODO: is there a better way to code this?

  if (features === undefined) {
    return Prisma.empty;
  }

  const featuresToRequire = Object.entries(features)
    .filter(([_key, value]) => value)
    .map(([key, _value]) => key);

  const numFeatures = featuresToRequire.length;

  if (numFeatures === 0) {
    return Prisma.empty;
  } else if (numFeatures === 1) {
    return Prisma.sql`AND contentFeatures1.code = ${featuresToRequire[0]}`;
  } else if (numFeatures === 2) {
    return Prisma.sql`
    AND contentFeatures1.code = ${featuresToRequire[0]}
    AND contentFeatures2.code = ${featuresToRequire[1]}
    `;
  } else {
    // stopping at 3 features for now
    return Prisma.sql`
    AND contentFeatures1.code = ${featuresToRequire[0]}
    AND contentFeatures2.code = ${featuresToRequire[1]}
    AND contentFeatures3.code = ${featuresToRequire[2]}
    `;
  }
}
