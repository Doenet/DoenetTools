import { TbPuzzle } from "react-icons/tb";
import { MdOutlineOndemandVideo, MdOutlineSwipeLeft } from "react-icons/md";
import { ContentClassification, NestedActivity } from "./types";
import { ActivitySource } from "./viewerTypes";

export const activityFeatureIcons = {
  isQuestion: TbPuzzle,
  isInteractive: MdOutlineSwipeLeft,
  containsVideo: MdOutlineOndemandVideo,
};

/**
 * Return augmented description from `classification`
 * with index given by the specified `index` (which defaults to `0`).
 *
 * If the classification system has `categoriesInDescription` set to `true`, then this
 * text include the category and subcategory, along with the description.
 * Otherwise, the text is just the description.
 */
export function getClassificationAugmentedDescription(
  classification: ContentClassification,
  index: number = 0,
) {
  const description = classification.descriptions[index];
  const categoriesInDescription =
    description.subCategory.category.system.categoriesInDescription;

  if (categoriesInDescription) {
    return (
      description.subCategory.category.category +
      " | " +
      description.subCategory.subCategory +
      " | " +
      description.description
    );
  } else {
    return description.description;
  }
}

/**
 * Reformat the description from `classification`
 * with index given by the specified `index` (which defaults to `0`).
 * Return a single object with information about that description.
 */
export function reformatClassificationData(
  classification: ContentClassification,
  index: number = 0,
) {
  const description = classification.descriptions[index];
  const system = description.subCategory.category.system;
  return {
    code: classification.code,
    systemName: system.name,
    categoryLabel: system.categoryLabel,
    category: description.subCategory.category.category,
    subCategoryLabel: system.subCategoryLabel,
    subCategory: description.subCategory.subCategory,
    descriptionLabel: system.descriptionLabel,
    description: description.description,
  };
}

/**
 * Find the the index of the first description of `classification`
 * that matches `systemName`, and if specified, also matches the `category` and `subCategory`.
 */
export function findClassificationDescriptionIndex({
  classification,
  systemName,
  category,
  subCategory,
}: {
  classification: ContentClassification;
  systemName: string;
  category?: string;
  subCategory?: string;
}) {
  const classificationList = classification.descriptions.map((_v, i) =>
    reformatClassificationData(classification, i),
  );

  return classificationList.findIndex((c) => {
    if (c.systemName !== systemName) {
      return false;
    }
    if (!category) {
      return true;
    }
    if (c.category !== category) {
      return false;
    }
    if (!subCategory) {
      return true;
    }
    return c.subCategory === subCategory;
  });
}

export function compileActivityFromContent(
  activity: NestedActivity,
): ActivitySource {
  const children = activity.children.map(compileActivityFromContent);

  const structure = activity.structure;

  switch (structure.type) {
    case "singleDoc": {
      return {
        id: structure.id,
        type: structure.type,
        isDescription: false,
        doenetML: structure.documents[0].source!,
        version: structure.documents[0].doenetmlVersion.fullVersion,
        numVariants: structure.numVariants,
        baseComponentCounts: structure.baseComponentCounts
          ? JSON.parse(structure.baseComponentCounts)
          : undefined,
      };
    }
    case "select": {
      return {
        id: structure.id,
        type: structure.type,
        title: structure.name,
        numToSelect: structure.numToSelect,
        selectByVariant: structure.selectByVariant,
        items: children,
      };
    }
    case "sequence": {
      return {
        id: structure.id,
        type: structure.type,
        title: structure.name,
        shuffle: structure.shuffle,
        items: children,
      };
    }
    case "folder": {
      throw Error("No folder here");
    }
  }
}

export const contentTypeToName = {
  singleDoc: "Document",
  select: "Question Bank",
  sequence: "Problem Set",
  folder: "Folder",
};
