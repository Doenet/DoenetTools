import { TbPuzzle } from "react-icons/tb";
import { MdOutlineOndemandVideo, MdOutlineSwipeLeft } from "react-icons/md";
import { ContentClassification } from "./types";

export const activityFeatures = {
  isQuestion: {
    icon: TbPuzzle,
    term: "Single question",
    description:
      "Activity is a single question suitable to add to an assessment.",
  },
  isInteractive: {
    icon: MdOutlineSwipeLeft,
    term: "Interactive",
    description:
      "Activity contains interactives, such as interactive graphics.",
  },
  containsVideo: {
    icon: MdOutlineOndemandVideo,
    term: "Video",
    description: "Activity contains videos.",
  },
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
