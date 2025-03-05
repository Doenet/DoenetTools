import { ContentType } from "@prisma/client";
import {
  AssignmentStatus,
  ContentClassification,
  Content,
  LibraryInfo,
  License,
  LicenseCode,
  UserInfo,
  ContentBase,
  AssignmentInfo,
  DoenetmlVersion,
} from "../types";
import { sortClassifications } from "./classificationsFeatures";
import { fromUUID, isEqualUUID } from "./uuid";
import { DateTime } from "luxon";
import { ActivitySource } from "./viewerTypes";
import { InvalidRequestError } from "./error";

/**
 * Process a list of user info from the SharedWith table
 *
 * If `sharedWithOrig` includes all user info,
 * (i.e., is of type FullShareInfo),
 * then the assumption is that we are sharing for the owner and we return full information.
 * Return
 * - isShared: `true` if there were any SharedWith items
 * - sharedWith: an array of UserInfo sorted by last names, then first names, then email.
 *
 * Else if `forUser` is given, return
 * - isShared: `true` if `sharedWithOrig` includes `forUser`
 * - sharedWith: an empty array
 *
 * Otherwise, return
 * - isShared: `false`
 * - sharedWith: an empty array
 */
function processSharedWith(
  sharedWithOrig: FullShareInfo | IdShareInfo | null | undefined,
  forUser?: Uint8Array,
): { isShared: boolean; sharedWith: UserInfo[] } {
  if (sharedWithOrig === null || sharedWithOrig === undefined) {
    return { isShared: false, sharedWith: [] };
  }

  if (isIdShareInfo(sharedWithOrig)) {
    if (forUser) {
      const isShared =
        sharedWithOrig.findIndex((cs) => isEqualUUID(cs.userId, forUser)) !==
        -1;

      return { isShared, sharedWith: [] };
    }
  } else {
    const isShared = sharedWithOrig.length > 0;

    const sharedWith = sharedWithOrig
      .map((cs) => cs.user)
      .sort(
        (a, b) =>
          a.lastNames.localeCompare(b.lastNames) ||
          a.firstNames?.localeCompare(b.firstNames || "") ||
          a.email.localeCompare(b.email),
      );

    return { isShared, sharedWith };
  }

  return { isShared: false, sharedWith: [] };
}

/**
 * Process a parent folder of content to standard form for the parent folder of `type`
 *
 * Return fields `id`, `name`, `type`, and `isPublic` unchanged from parent.
 *
 * Adds the fields `isShared` and `sharedWith` using the algorithm from {@link processSharedWith}
 * applied to the parent's `sharedWith` field.
 */
function processParent(
  parent: {
    id: Uint8Array;
    name: string;
    type: ContentType;
    isPublic: boolean;
    sharedWith?: FullShareInfo | IdShareInfo;
  },
  forUser?: Uint8Array,
) {
  const { isShared, sharedWith } = processSharedWith(
    parent.sharedWith,
    forUser,
  );

  return {
    contentId: parent.id,
    name: parent.name,
    type: parent.type,
    isPublic: parent.isPublic,
    isShared,
    sharedWith,
  };
}

/**
 * Convert the `PreliminaryLicense` data structure returned by the queries
 * to the `License` data structure.
 */
export function processLicense(
  preliminary_license: PreliminaryLicense,
): License {
  if (preliminary_license.composedOf.length > 0) {
    return {
      code: preliminary_license.code as LicenseCode,
      name: preliminary_license.name,
      description: preliminary_license.description,
      imageURL: null,
      smallImageURL: null,
      licenseURL: null,
      isComposition: true,
      composedOf: preliminary_license.composedOf.map((comp) => ({
        code: comp.composedOf.code as LicenseCode,
        name: comp.composedOf.name,
        description: comp.composedOf.description,
        imageURL: comp.composedOf.imageURL,
        smallImageURL: comp.composedOf.smallImageURL,
        licenseURL: comp.composedOf.licenseURL,
      })),
    };
  } else {
    return {
      code: preliminary_license.code as LicenseCode,
      name: preliminary_license.name,
      description: preliminary_license.description,
      imageURL: preliminary_license.imageURL,
      smallImageURL: preliminary_license.smallImageURL,
      licenseURL: preliminary_license.licenseURL,
      isComposition: false,
      composedOf: [],
    };
  }
}

export function returnContentSelect({
  includeAssignInfo = false,
  countAssignmentScores = false,
  includeLibraryInfo = false,
  includeClassifications = false,
  includeShareDetails = false,
  includeOwnerDetails = false,
  isAdmin = false,
}) {
  const sharedWith = {
    select: includeShareDetails
      ? {
          user: {
            select: {
              userId: true,
              email: true,
              firstNames: true,
              lastNames: true,
            },
          },
        }
      : {
          userId: true,
        },
  };

  const librarySourceInfo = includeLibraryInfo
    ? {
        select: {
          status: true,
          sourceId: true,
          contentId: true,
          comments: isAdmin,
          ownerRequested: isAdmin,
        },
      }
    : false;

  const libraryActivityInfo = includeLibraryInfo
    ? {
        select: {
          status: true,
          sourceId: true,
          contentId: true,
          comments: isAdmin,
          ownerRequested: isAdmin,
        },
      }
    : false;

  const classificationsObj = includeClassifications
    ? {
        classifications: {
          select: {
            classification: {
              select: returnClassificationListSelect(),
            },
          },
        },
      }
    : {};

  const owner = includeOwnerDetails
    ? {
        select: {
          userId: true,
          email: true,
          firstNames: true,
          lastNames: true,
        },
      }
    : false;

  const _count = countAssignmentScores
    ? { select: { assignmentScores: true } }
    : false;

  const baseSelect = {
    id: true,
    name: true,
    type: true,
    ownerId: true,
    owner,
    imagePath: true,
    isPublic: true,
    contentFeatures: true,
    sharedWith,
    license: {
      include: {
        composedOf: {
          select: { composedOf: true },
          orderBy: { composedOf: { sortIndex: "asc" as const } },
        },
      },
    },
    parent: {
      select: {
        id: true,
        name: true,
        type: true,
        isPublic: true,
        sharedWith,
      },
    },
    librarySourceInfo,
    libraryActivityInfo,
    ...classificationsObj,
    _count,
    activityLevelAttempts: true,
    itemLevelAttempts: true,
  };

  const assignment = includeAssignInfo
    ? {
        select: {
          classCode: true,
          codeValidUntil: true,
          rootContent: {
            select: {
              name: true,
              id: true,
              type: true,
            },
          },
        },
      }
    : false;

  const docSelect = {
    numVariants: true,
    baseComponentCounts: true,
    source: true,
    doenetmlVersion: true,
  };

  const questionBankSelect = {
    numToSelect: true,
    selectByVariant: true,
  };

  const problemSetSelect = {
    shuffle: true,
    paginate: true,
  };

  return {
    assignment,
    ...baseSelect,
    ...docSelect,
    ...questionBankSelect,
    ...problemSetSelect,
  };
}

type PreliminaryLicense = {
  composedOf: {
    composedOf: {
      code: string;
      name: string;
      description: string;
      imageURL: string | null;
      smallImageURL: string | null;
      licenseURL: string | null;
      sortIndex: number;
    };
  }[];
} & {
  code: string;
  name: string;
  description: string;
  imageURL: string | null;
  smallImageURL: string | null;
  licenseURL: string | null;
  sortIndex: number;
};

type FullShareInfo = { user: UserInfo }[];
type IdShareInfo = { userId: Uint8Array }[];

// function isFullShareInfo(obj: unknown): obj is FullShareInfo {
//   const typedObj = obj as FullShareInfo;
//   return Array.isArray(typedObj) && typedObj.every((v) => isUserInfo(v));
// }

function isIdShareInfo(obj: unknown): obj is IdShareInfo {
  const typedObj = obj as IdShareInfo;
  return (
    Array.isArray(typedObj) &&
    typedObj.every((v) => v.userId instanceof Uint8Array)
  );
}

type PreliminaryContent = {
  id: Uint8Array;
  type: ContentType;
  name: string;
  ownerId: Uint8Array;
  owner?: UserInfo;
  imagePath: string | null;
  isPublic: boolean;
  contentFeatures: {
    id: number;
    code: string;
    term: string;
    description: string;
    sortIndex: number;
  }[];
  sharedWith: { userId: Uint8Array }[] | { user: UserInfo }[];
  license: PreliminaryLicense | null;
  parent?: {
    id: Uint8Array;
    name: string;
    type: ContentType;
    isPublic: boolean;
    sharedWith: { userId: Uint8Array }[] | { user: UserInfo }[];
  } | null;
  libraryActivityInfo: LibraryInfo | null;
  librarySourceInfo: LibraryInfo | null;
  classifications?: {
    classification: ContentClassification;
  }[];
  _count?: {
    assignmentScores: number;
  };
  activityLevelAttempts: boolean;
  itemLevelAttempts: boolean;

  // if `includeAssignInfo` is specified
  assignment?: {
    classCode: string;
    codeValidUntil: Date | null;
    rootContent: {
      name: string;
      id: Uint8Array;
      type: ContentType;
    };
  } | null;

  // from document select
  source?: string | null;
  doenetmlVersion?: {
    id: number;
    default: boolean;
    displayedVersion: string;
    fullVersion: string;
    deprecated: boolean;
    removed: boolean;
    deprecationMessage: string;
  } | null;
  numVariants?: number;
  baseComponentCounts?: string | null;

  // from question bank select
  numToSelect: number;
  selectByVariant: boolean;

  // from problem bank select
  shuffle: boolean;
  paginate: boolean;
};

export function processContent(
  preliminaryContent: PreliminaryContent,
  forUserId?: Uint8Array,
  isAdmin?: boolean,
): Content {
  const {
    id,
    type,
    _count,
    activityLevelAttempts,
    itemLevelAttempts,
    sharedWith: sharedWithOrig,
    license,
    parent,
    classifications,
    libraryActivityInfo,
    librarySourceInfo,
    assignment,

    // from doc select
    source: sourceOrig,
    numVariants: numVariantsOrig,
    baseComponentCounts: baseComponentCountsOrig,
    doenetmlVersion: doenetmlVersionOrig,

    // from question bank select
    numToSelect,
    selectByVariant,

    // from problem set select
    shuffle,
    paginate,

    ...preliminaryContent2
  } = preliminaryContent;

  const assignmentInfoObj: { assignmentInfo?: AssignmentInfo } = {};

  if (assignment) {
    const { codeValidUntil, classCode, rootContent } = assignment;
    const isOpen = codeValidUntil
      ? DateTime.now() <= DateTime.fromJSDate(codeValidUntil)
      : false;
    const assignmentStatus: AssignmentStatus = isOpen ? "Open" : "Closed";
    assignmentInfoObj.assignmentInfo = {
      assignmentStatus,
      classCode,
      codeValidUntil,
      rootName: rootContent.name,
      rootContentId: rootContent.id,
      rootType: rootContent.type,
      hasScoreData: _count ? _count.assignmentScores > 0 : false,
      activityLevelAttempts,
      itemLevelAttempts,
    };
  }

  const { isShared, sharedWith } = processSharedWith(sharedWithOrig, forUserId);

  // Don't include library fields if the values are null
  const libraryInfos: {
    libraryActivityInfo?: LibraryInfo;
    librarySourceInfo?: LibraryInfo;
  } = {};
  if (libraryActivityInfo) {
    libraryInfos.libraryActivityInfo = libraryActivityInfo;
  }
  if (librarySourceInfo) {
    if (librarySourceInfo.status !== "PUBLISHED" && !isAdmin) {
      // Owner cannot see library draft for their activity
      librarySourceInfo.contentId = null;
    }
    libraryInfos.librarySourceInfo = librarySourceInfo;
  }

  const baseContent: ContentBase = {
    contentId: id,
    ...preliminaryContent2,
    ...libraryInfos,
    ...assignmentInfoObj,
    isShared,
    sharedWith,
    license: license ? processLicense(license) : null,
    classifications: sortClassifications(
      (classifications ?? []).map((c) => c.classification),
    ),
    parent: parent ? processParent(parent, forUserId) : null,
  };

  switch (type) {
    case "singleDoc": {
      let docInfo: {
        doenetML: string;
        numVariants: number;
        baseComponentCounts: string;
        doenetmlVersion: DoenetmlVersion;
        revisionNum?: number;
      };

      if (
        sourceOrig != null &&
        numVariantsOrig !== undefined &&
        baseComponentCountsOrig != null &&
        doenetmlVersionOrig != null
      ) {
        docInfo = {
          doenetML: sourceOrig,
          numVariants: numVariantsOrig,
          baseComponentCounts: baseComponentCountsOrig,
          doenetmlVersion: doenetmlVersionOrig,
        };
      } else {
        throw new InvalidRequestError("Invalid document");
      }

      return {
        type: "singleDoc",
        ...docInfo,
        ...baseContent,
      };
    }
    case "select": {
      return {
        type: "select",
        numToSelect,
        selectByVariant,
        children: [],
        ...baseContent,
      };
    }
    case "sequence": {
      return {
        type: "sequence",
        shuffle,
        paginate,
        children: [],
        ...baseContent,
      };
    }
    case "folder": {
      return {
        type: "folder",
        children: [],
        ...baseContent,
      };
    }
  }
}

/**
 *
 * Return the select statement for prisma to select the components needed
 * to form the ContentClassification object for each classification
 */
export function returnClassificationListSelect() {
  return {
    id: true,
    code: true,
    descriptions: {
      select: {
        description: true,
        sortIndex: true,
        subCategory: {
          select: {
            id: true,
            subCategory: true,
            sortIndex: true,
            category: {
              select: {
                id: true,
                category: true,
                system: {
                  select: {
                    id: true,
                    name: true,
                    shortName: true,
                    categoryLabel: true,
                    subCategoryLabel: true,
                    descriptionLabel: true,
                    categoriesInDescription: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { isPrimary: "desc" as const },
    },
  };
}

export function compileActivityFromContent(activity: Content): ActivitySource {
  switch (activity.type) {
    case "singleDoc": {
      return {
        id: fromUUID(activity.contentId),
        type: activity.type,
        isDescription: false,
        doenetML: activity.doenetML!,
        version: activity.doenetmlVersion.fullVersion,
        numVariants: activity.numVariants,
        baseComponentCounts: activity.baseComponentCounts
          ? JSON.parse(activity.baseComponentCounts)
          : undefined,
      };
    }
    case "select": {
      return {
        id: fromUUID(activity.contentId),
        type: activity.type,
        title: activity.name,
        numToSelect: activity.numToSelect,
        selectByVariant: activity.selectByVariant,
        items: activity.children.map(compileActivityFromContent),
      };
    }
    case "sequence": {
      return {
        id: fromUUID(activity.contentId),
        type: activity.type,
        title: activity.name,
        shuffle: activity.shuffle,
        items: activity.children.map(compileActivityFromContent),
      };
    }
    case "folder": {
      throw Error("No folder here");
    }
  }
}
