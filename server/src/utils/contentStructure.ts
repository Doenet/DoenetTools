import { AssignmentMode, ContentType } from "@prisma/client";
import {
  AssignmentStatus,
  ContentClassification,
  Content,
  License,
  LicenseCode,
  UserInfo,
  ContentBase,
  AssignmentInfo,
  DoenetmlVersion,
  UserInfoWithEmail,
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
export function processSharedWith(
  sharedWithOrig: FullShareInfo | IdShareInfo | null | undefined,
  forUser?: Uint8Array,
): { isShared: boolean; sharedWith: UserInfoWithEmail[] } {
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
  includeClassifications = false,
  includeShareDetails = false,
  includeOwnerDetails = false,
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
          firstNames: true,
          lastNames: true,
        },
      }
    : false;

  const baseSelect = {
    id: true,
    name: true,
    type: true,
    ownerId: true,
    owner,
    isPublic: true,
    contentFeatures: true,
    mode: true,
    individualizeByStudent: true,
    maxAttempts: true,
    sharedWith,
    licenseCode: true,
    parent: {
      select: {
        id: true,
        name: true,
        type: true,
        isPublic: true,
        sharedWith,
      },
    },
    ...classificationsObj,
  };

  const rootAssignment = includeAssignInfo
    ? {
        select: {
          classCode: true,
          codeValidUntil: true,
          _count: { select: { contentState: true } },
        },
      }
    : false;

  const nonRootAssignment = includeAssignInfo
    ? {
        select: {
          classCode: true,
          codeValidUntil: true,
          rootContent: {
            select: {
              name: true,
              id: true,
              type: true,
              mode: true,
              individualizeByStudent: true,
              maxAttempts: true,
            },
          },
        },
      }
    : false;

  const docSelect = {
    numVariants: true,
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
    rootAssignment,
    nonRootAssignment,
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

type FullShareInfo = { user: UserInfoWithEmail }[];
type IdShareInfo = { userId: Uint8Array }[];

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
  isPublic: boolean;
  mode: AssignmentMode;
  individualizeByStudent: boolean;
  maxAttempts: number;
  contentFeatures: {
    id: number;
    code: string;
    term: string;
    description: string;
    sortIndex: number;
  }[];
  sharedWith: { userId: Uint8Array }[] | { user: UserInfoWithEmail }[];
  licenseCode: LicenseCode | null;
  parent?: {
    id: Uint8Array;
    name: string;
    type: ContentType;
    isPublic: boolean;
    sharedWith: { userId: Uint8Array }[] | { user: UserInfoWithEmail }[];
  } | null;
  classifications?: {
    classification: ContentClassification;
  }[];
  activityLevelAttempts: boolean;
  itemLevelAttempts: boolean;

  // if `includeAssignInfo` is specified
  rootAssignment?: {
    classCode: string;
    codeValidUntil: Date;
    _count?: {
      contentState: number;
    };
  } | null;
  nonRootAssignment?: {
    classCode: string;
    codeValidUntil: Date;
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

  // from question bank select
  numToSelect: number;
  selectByVariant: boolean;

  // from problem bank select
  shuffle: boolean;
  paginate: boolean;
};

/**
 * Converts fields `assigned` and `codeValidUntil` to field `assignmentStatus`
 * Leaves any additional fields the same.
 */
export function processAssignmentStatus({
  codeValidUntil,
}: {
  codeValidUntil: Date;
}) {
  const isOpen = DateTime.now() <= DateTime.fromJSDate(codeValidUntil);
  const assignmentStatus: AssignmentStatus = isOpen ? "Open" : "Closed";

  return assignmentStatus;
}

/**
 * Convert `PreliminaryContent` classifications into a list of `ContentClassification` sorted by their `sortIndex`.
 *
 * You can pass the full `PreliminaryContent` struct as the argument.
 */
export function processClassifications(
  queryResult: Pick<PreliminaryContent, "classifications">,
) {
  return sortClassifications(
    (queryResult.classifications ?? []).map((c) => c.classification),
  );
}

export function processContent(
  preliminaryContent: PreliminaryContent,
  forUserId?: Uint8Array,
): Content {
  const {
    id,
    type,
    activityLevelAttempts,
    itemLevelAttempts,
    sharedWith: sharedWithOrig,
    licenseCode,
    parent,
    classifications,

    individualizeByStudent,
    maxAttempts,
    mode,

    rootAssignment,
    nonRootAssignment,

    // from doc select
    source: sourceOrig,
    numVariants: numVariantsOrig,
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

  if (rootAssignment) {
    const { codeValidUntil, _count, ...other } = rootAssignment;

    assignmentInfoObj.assignmentInfo = {
      ...other,
      assignmentStatus: processAssignmentStatus({ codeValidUntil }),
      codeValidUntil,
      hasScoreData: _count ? _count.contentState > 0 : false,
      individualizeByStudent,
      maxAttempts,
      mode,
    };
  } else if (nonRootAssignment) {
    const { codeValidUntil, rootContent, ...other } = nonRootAssignment;
    assignmentInfoObj.assignmentInfo = {
      ...other,
      assignmentStatus: processAssignmentStatus({ codeValidUntil }),
      codeValidUntil,
      hasScoreData: false,
      individualizeByStudent,
      maxAttempts,
      mode,
    };
  }

  const { isShared, sharedWith } = processSharedWith(sharedWithOrig, forUserId);

  const baseContent: ContentBase = {
    contentId: id,
    ...preliminaryContent2,
    ...assignmentInfoObj,
    isShared,
    sharedWith,
    licenseCode,
    classifications: processClassifications({ classifications }),
    parent: parent ? processParent(parent, forUserId) : null,
  };

  switch (type) {
    case "singleDoc": {
      let docInfo: {
        doenetML: string;
        numVariants: number;
        doenetmlVersion: DoenetmlVersion;
        revisionNum?: number;
      };

      if (
        sourceOrig != null &&
        numVariantsOrig !== undefined &&
        doenetmlVersionOrig != null
      ) {
        docInfo = {
          doenetML: sourceOrig,
          numVariants: numVariantsOrig,
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

/**
 * Compile an `activity` into the activity json used for viewing composite activities.
 *
 * If `useVersionId` is `true`, then compile the activity json where use doenetmlVersionId
 * rather than the full doenetml version. Useful for generating a cid from the source
 * that won't change if we upgrade the minor version for all documents (though it does not
 * produce a valid source for viewing the activity).
 */
export function compileActivityFromContent(
  activity: Content,
  useVersionIds = false,
): ActivitySource {
  switch (activity.type) {
    case "singleDoc": {
      return {
        id: fromUUID(activity.contentId),
        type: activity.type,
        isDescription: false,
        doenetML: activity.doenetML!,
        version: useVersionIds
          ? activity.doenetmlVersion.id.toString()
          : activity.doenetmlVersion.fullVersion,
        numVariants: activity.numVariants,
      };
    }
    case "select": {
      return {
        id: fromUUID(activity.contentId),
        type: activity.type,
        title: activity.name,
        numToSelect: activity.numToSelect,
        selectByVariant: activity.selectByVariant,
        items: activity.children.map((child) =>
          compileActivityFromContent(child, useVersionIds),
        ),
      };
    }
    case "sequence": {
      return {
        id: fromUUID(activity.contentId),
        type: activity.type,
        title: activity.name,
        shuffle: activity.shuffle,
        items: activity.children.map((child) =>
          compileActivityFromContent(child, useVersionIds),
        ),
      };
    }
    case "folder": {
      throw Error("No folder here");
    }
  }
}
