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

export function returnCategoryJoins(categories?: Set<string>) {
  const numCategories = categories === undefined ? 0 : categories.size;

  // TODO: a better way to do this?
  if (numCategories === 0) {
    return Prisma.empty;
  } else if (numCategories === 1) {
    return Prisma.sql`
      LEFT JOIN _categoriesTocontent AS ccf1 ON ccf1.B = content.id
      LEFT JOIN categories as categories1 on categories1.id = ccf1.A
    `;
  } else if (numCategories === 2) {
    return Prisma.sql`
      LEFT JOIN _categoriesTocontent AS ccf1 ON ccf1.B = content.id
      LEFT JOIN categories as categories1 on categories1.id = ccf1.A 
      LEFT JOIN _categoriesTocontent AS ccf2 ON ccf2.B = content.id
      LEFT JOIN categories as categories2 on categories2.id = ccf2.A 
    `;
  } else {
    // stopping at 3 categories for now
    return Prisma.sql`
      LEFT JOIN _categoriesTocontent AS ccf1 ON ccf1.B = content.id
      LEFT JOIN categories as categories1 on categories1.id = ccf1.A 
      LEFT JOIN _categoriesTocontent AS ccf2 ON ccf2.B = content.id
      LEFT JOIN categories as categories2 on categories2.id = ccf2.A 
      LEFT JOIN _categoriesTocontent AS ccf3 ON ccf3.B = content.id
      LEFT JOIN categories as categories3 on categories3.id = ccf3.A 
    `;
  }
}

export function returnCategoryWhereClauses(categories?: Set<string>) {
  // TODO: is there a better way to code this?

  if (categories === undefined) {
    return Prisma.empty;
  }

  const categoriesToRequire = [...categories.keys()];

  const numCategories = categoriesToRequire.length;

  if (numCategories === 0) {
    return Prisma.empty;
  } else if (numCategories === 1) {
    return Prisma.sql`AND categories1.code = ${categoriesToRequire[0]}`;
  } else if (numCategories === 2) {
    return Prisma.sql`
    AND categories1.code = ${categoriesToRequire[0]}
    AND categories2.code = ${categoriesToRequire[1]}
    `;
  } else {
    // stopping at 3 categories for now
    return Prisma.sql`
    AND categories1.code = ${categoriesToRequire[0]}
    AND categories2.code = ${categoriesToRequire[1]}
    AND categories3.code = ${categoriesToRequire[2]}
    `;
  }
}
