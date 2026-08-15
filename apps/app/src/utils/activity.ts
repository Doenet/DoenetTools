import { TbPuzzle } from "react-icons/tb";
import {
  MdAssignment,
  MdNotes,
  MdOutlineOndemandVideo,
  MdOutlineSwipeLeft,
} from "react-icons/md";
import {
  ContentClassification,
  Content,
  ContentType,
  DoenetmlVersion,
} from "../types";
import { ActivitySource, repeatCountInProblemSet } from "@doenet-tools/shared";
import { IconType } from "react-icons/lib";
import { FaFolder, FaImage } from "react-icons/fa";
import { FaListOl } from "react-icons/fa6";
import { RiArchive2Fill } from "react-icons/ri";
import { ReactElement, createElement } from "react";
import { Icon } from "@chakra-ui/react";
import { IoStatsChart } from "react-icons/io5";

/**
 * Content category icons. Displayed in this order.
 */
export const activityCategoryIcons = {
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

/**
 * Compile an `activity` into the activity json used for viewing composite activities.
 *
 * `inProblemSet` says whether `activity` is a child of a problem set, which is
 * where the document settings `isDescription` and `repeatInProblemSet` apply.
 *
 * Must stay in sync with the server compiler in
 * `apps/api/src/utils/contentStructure.ts`, since the two produce the source
 * for different views of the same problem set.
 */
export function compileActivityFromContent(
  activity: Content,
  inProblemSet = false,
): ActivitySource {
  switch (activity.type) {
    case "singleDoc": {
      const isDescription = inProblemSet && (activity.isDescription ?? false);
      const documentJson = {
        id: activity.contentId,
        type: activity.type,
        title: activity.name,
        isDescription,
        doenetML: activity.doenetML,
        version: activity.doenetmlVersion.fullVersion,
        numVariants: activity.numVariants,
      };
      const repeatCount = inProblemSet
        ? repeatCountInProblemSet({ ...activity, isDescription })
        : 1;
      if (repeatCount > 1) {
        // If the document repeats, wrap this document in
        // a `select` which can select that many variants.
        return {
          id: `select_for_${activity.contentId}`,
          type: "select",
          title: `Repeat ${repeatCount} times`,
          numToSelect: repeatCount,
          selectByVariant: true,
          items: [documentJson],
        };
      } else {
        return documentJson;
      }
    }
    case "select": {
      return {
        id: activity.contentId,
        type: activity.type,
        title: activity.name,
        numToSelect: activity.numToSelect,
        selectByVariant: activity.selectByVariant,
        items: activity.children.map((child) =>
          compileActivityFromContent(child, false),
        ),
      };
    }
    case "sequence": {
      return {
        id: activity.contentId,
        type: activity.type,
        title: activity.name,
        shuffle: activity.shuffle,
        items: activity.children.map((child) =>
          compileActivityFromContent(child, true),
        ),
      };
    }
    case "folder": {
      throw Error("No folder here");
    }
    case "image": {
      throw Error("No image here");
    }
  }
}

export const contentTypeToName = {
  singleDoc: "Document",
  select: "Question Bank",
  sequence: "Problem Set",
  folder: "Folder",
  image: "Image",
};

export function getAllowedParentTypes(childTypes: ContentType[]) {
  const allowedParentTypes: ContentType[] = ["folder"];
  // Folders, problem sets, and images can only live in a folder. Images are
  // standalone assets — the server also rejects moving/uploading one into a
  // problem set (`copy_move.ts`, `imageContent.ts`) — so keep them out of
  // problem sets and question banks here too.
  if (
    !childTypes.includes("folder") &&
    !childTypes.includes("sequence") &&
    !childTypes.includes("image")
  ) {
    allowedParentTypes.push("sequence");
    if (!childTypes.includes("select")) {
      allowedParentTypes.push("select");
    }
  }
  return allowedParentTypes.reverse();
}

export function getIconInfo(
  contentType: ContentType,
  isAssignment: boolean,
  /** A document marked as a description: shown to students, but not scored. */
  isDescription = false,
) {
  let iconImage: IconType;
  let iconColor: string;
  if (isAssignment) {
    iconImage = IoStatsChart;
    iconColor = "blue";
  } else if (isDescription) {
    // Distinct shape as well as color, so the difference does not rely on
    // color alone.
    iconImage = MdNotes;
    iconColor = "#6b7c93";
  } else if (contentType === "folder") {
    iconImage = FaFolder;
    iconColor = "#e6b800";
  } else if (contentType === "singleDoc") {
    iconImage = MdAssignment;
    iconColor = "#ff6600";
  } else if (contentType === "sequence") {
    iconImage = FaListOl;
    iconColor = "#cc3399";
  } else if (contentType === "image") {
    iconImage = FaImage;
    iconColor = "#0099cc";
  } else {
    // select
    iconImage = RiArchive2Fill;
    iconColor = "#009933";
  }

  return { iconImage, iconColor };
}

export const menuIcons: Record<string, ReactElement<any>> = {};

for (const t of ["folder", "sequence", "select", "singleDoc", "image"]) {
  const ct = t as ContentType;
  const { iconImage, iconColor } = getIconInfo(ct, false);
  const icon = createElement(Icon, {
    as: iconImage,
    color: iconColor,
    marginRight: "5px",
    "aria-label": contentTypeToName[ct],
  });

  menuIcons[t] = icon;
}

export function getDoenetMLDeprecationWarnings(
  doenetmlVersion: DoenetmlVersion,
) {
  return doenetmlVersion.deprecated
    ? [
        {
          level: 1,
          message: `DoenetML version
            ${doenetmlVersion.displayedVersion} is deprecated.
            ${doenetmlVersion.deprecationMessage}`,
          doenetMLrange: {},
        },
      ]
    : [];
}
