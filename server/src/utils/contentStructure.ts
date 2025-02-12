import {
  AssignmentStatus,
  ContentClassification,
  ContentStructure,
  ContentType,
  License,
  LicenseCode,
  UserInfo,
} from "../types";
import { sortClassifications } from "./classificationsFeatures";
import { isEqualUUID } from "./uuid";
import { DateTime } from "luxon";

/**
 * Process a list of user info from the SharedWith table
 *
 * Since the `sharedWithOrig` parameter includes all user info,
 * the function is designed to be used with one of the `SharedDetails` functions
 *
 * Returns:
 * - isShared: true if there were any SharedWith items
 * - sharedWith: an array of UserInfo sorted by last names, then first names, then email.
 */
function processSharedWith(
  sharedWithOrig:
    | {
        user: UserInfo;
      }[]
    | null
    | undefined,
): { isShared: boolean; sharedWith: UserInfo[] } {
  if (sharedWithOrig === null || sharedWithOrig === undefined) {
    return { isShared: false, sharedWith: [] };
  }

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

/**
 * Process a list of userIds from the SharedWith table to determine
 * if the content was shared with `determineSharedToUser`
 *
 * Since the `sharedWithIds` parameter includes just user ids,
 * the function is designed to be used with one of the functions that does not have `SharedDetails`
 *
 * If `determineSharedToUser` is no specified, then `isShared` will be `false`.
 *
 * Returns:
 * - isShared: true if `determineSharedToUser` is in the list of userIds
 * - sharedWith: any empty array of UserInfo
 *
 * @param sharedWithIds
 * @param determineSharedToUser
 * @returns
 */
function processSharedWithForUser(
  sharedWithIds: { userId: Uint8Array }[] | null | undefined,
  determineSharedToUser?: Uint8Array,
): { isShared: boolean; sharedWith: UserInfo[] } {
  if (
    sharedWithIds === null ||
    sharedWithIds === undefined ||
    determineSharedToUser === undefined
  ) {
    return { isShared: false, sharedWith: [] };
  }

  const isShared =
    sharedWithIds.findIndex((cs) =>
      isEqualUUID(cs.userId, determineSharedToUser),
    ) !== -1;

  const sharedWith: {
    userId: Uint8Array;
    email: string;
    firstNames: string | null;
    lastNames: string;
  }[] = [];

  return { isShared, sharedWith };
}

/**
 * Process a parent folder of content to standard form for the parent folder of ContentStructure
 *
 * Since the `sharedWith` parameter includes all user info,
 * the function is designed to be used with one of the `SharedDetails` functions
 *
 */
function processParent(parent: {
  id: Uint8Array;
  name: string;
  type: ContentType;
  isPublic: boolean;
  sharedWith?: {
    user: UserInfo;
  }[];
}) {
  const { isShared, sharedWith } = processSharedWith(parent.sharedWith);

  return {
    id: parent.id,
    name: parent.name,
    type: parent.type,
    isPublic: parent.isPublic,
    isShared,
    sharedWith,
  };
}

/**
 * Process a parent folder of content to standard form for the parent folder of ContentStructure
 * where the content sharing is just for the user `determineSharedToUser`.
 *
 * Since the `sharedWith` parameter includes just user ids,
 * the function is designed to be used with one of the functions that does not have `SharedDetails`
 *
 * If `determineSharedToUser` is no specified, then `isShared` will be `false`.
 */
function processParentForUser(
  parent: {
    id: Uint8Array;
    name: string;
    type: ContentType;
    isPublic: boolean;
    sharedWith: { userId: Uint8Array }[];
  },
  determineSharedToUser?: Uint8Array,
) {
  const { isShared, sharedWith } = processSharedWithForUser(
    parent.sharedWith,
    determineSharedToUser,
  );

  return {
    id: parent.id,
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

/**
 * Return the select statement for prisma to select the components needed
 * to form the ContentStructure object for each content item,
 * where classifications and documents are ignored.
 *
 * When a query is run with this select, the data will be of the form `PreliminaryContentNoClassDocs`
 * that can be processed by `processContentNoClassDocs` to obtain the `ContentStructure` type.
 */
export function returnContentStructureNoClassDocsSelect({
  includeAssignInfo = false,
} = {}) {
  return {
    id: true,
    name: true,
    type: true,
    ownerId: true,
    imagePath: true,
    isFolder: true,
    isPublic: true,
    isAssigned: includeAssignInfo,
    classCode: includeAssignInfo,
    codeValidUntil: includeAssignInfo,
    numToSelect: true,
    selectByVariant: true,
    shuffle: true,
    paginate: true,
    activityLevelAttempts: true,
    itemLevelAttempts: true,
    contentFeatures: true,
    sharedWith: {
      select: {
        userId: true,
      },
    },
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
        sharedWith: {
          select: {
            userId: true,
          },
        },
      },
    },
  };
}

/**
 * Return the select statement for prisma to select the components needed
 * to form the ContentStructure object for each content item,
 * where classifications and documents are ignored and full details about sharing are included.
 *
 * When a query is run with this select, the data will be of the form `PreliminaryContentSharedDetailsNoClassDocs`
 * that can be processed by `processContentSharedDetailsNoClassDocs` to obtain the `ContentStructure` type.
 */
export function returnContentStructureSharedDetailsNoClassDocsSelect({
  includeAssignInfo = false,
} = {}) {
  const selectBase = returnContentStructureNoClassDocsSelect({
    includeAssignInfo,
  });

  const sharedWith = {
    select: {
      user: {
        select: {
          userId: true,
          email: true,
          firstNames: true,
          lastNames: true,
        },
      },
    },
  };

  const parentSelect = {
    ...selectBase.parent.select,
    sharedWith,
  };
  const parent = {
    ...selectBase.parent,
    select: parentSelect,
  };

  const selectedSharedDetails = {
    ...selectBase,
    sharedWith,
    parent,
  };

  return selectedSharedDetails;
}

/**
 * Return the base select statement for prisma to select the components needed
 * to form the ContentStructure object for each content item.
 */
export function returnContentStructureBaseSelect({
  includeAssignInfo = false,
} = {}) {
  const folderSelect = returnContentStructureNoClassDocsSelect({
    includeAssignInfo,
  });

  return {
    ...folderSelect,
    documents: {
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        source: true,
        doenetmlVersion: true,
        numVariants: true,
        baseComponentCounts: true,
      },
      orderBy: { id: "asc" as const },
    },
    classifications: {
      select: {
        classification: {
          select: {
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
          },
        },
      },
    },
  };
}

/**
 * Return the select statement for prisma to select the components needed
 * to form the ContentStructure object for each content item,
 * where each item has full information about the owner
 *
 * When a query is run with this select, the data will be of the form `PreliminaryContent`
 * that can be processed by `processContent` to obtain the `ContentStructure` type.
 */
export function returnContentStructureFullOwnerSelect() {
  const selectBase = returnContentStructureBaseSelect({});

  const selectFullOwner = {
    ...selectBase,
    owner: {
      select: {
        userId: true,
        email: true,
        firstNames: true,
        lastNames: true,
      },
    },
  };
  return selectFullOwner;
}

/**
 * Return the select statement for prisma to select the components needed
 * to form the ContentStructure object for each content item,
 * where each item has full information about the users to whom the content is shared
 *
 * When a query is run with this select, the data will be of the form `PreliminaryContentSharedDetails`
 * that can be processed by `processContentSharedDetails` to obtain the `ContentStructure` type.
 */
export function returnContentStructureSharedDetailsSelect({
  includeAssignInfo = false,
}: {
  includeAssignInfo?: boolean;
} = {}) {
  const selectBase = returnContentStructureBaseSelect({
    includeAssignInfo,
  });

  const sharedWith = {
    select: {
      user: {
        select: {
          userId: true,
          email: true,
          firstNames: true,
          lastNames: true,
        },
      },
    },
  };

  const parentSelect = {
    ...selectBase.parent.select,
    sharedWith,
  };
  const parent = {
    ...selectBase.parent,
    select: parentSelect,
  };

  const selectedSharedDetails = {
    ...selectBase,
    sharedWith,
    parent,
  };

  return selectedSharedDetails;
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

type PreliminaryContentNoClassDocs = {
  id: Uint8Array;
  type: ContentType;
  name: string;
  ownerId: Uint8Array;
  owner?: UserInfo;
  imagePath: string | null;
  isFolder: boolean;
  isPublic: boolean;
  isAssigned?: boolean;
  classCode?: string | null;
  codeValidUntil?: Date | null;
  numToSelect: number;
  selectByVariant: boolean;
  shuffle: boolean;
  paginate: boolean;
  activityLevelAttempts: boolean;
  itemLevelAttempts: boolean;
  contentFeatures: {
    id: number;
    code: string;
    term: string;
    description: string;
    sortIndex: number;
  }[];
  sharedWith: { userId: Uint8Array }[];
  license: PreliminaryLicense | null;
  parent?: {
    id: Uint8Array;
    name: string;
    type: ContentType;
    isPublic: boolean;
    sharedWith: { userId: Uint8Array }[];
  } | null;
};

type PreliminaryContentSharedDetailsNoClassDocs = Omit<
  PreliminaryContentNoClassDocs,
  "sharedWith" | "parent"
> & {
  sharedWith: { user: UserInfo }[];
  parent?: {
    id: Uint8Array;
    name: string;
    type: ContentType;
    isPublic: boolean;
    sharedWith: { user: UserInfo }[];
  } | null;
};

type PreliminaryContent = PreliminaryContentNoClassDocs & {
  documents: {
    id: Uint8Array;
    name: string;
    source: string;
    doenetmlVersion: {
      id: number;
      default: boolean;
      displayedVersion: string;
      fullVersion: string;
      deprecated: boolean;
      removed: boolean;
      deprecationMessage: string;
    };
    numVariants: number;
    baseComponentCounts: string;
  }[];
  classifications: {
    classification: ContentClassification;
  }[];
  _count?: {
    assignmentScores: number;
  };
};

type PreliminaryContentSharedDetails = Omit<
  PreliminaryContent,
  "sharedWith" | "parent"
> & {
  sharedWith: { user: UserInfo }[];
  parent?: {
    id: Uint8Array;
    name: string;
    type: ContentType;
    isPublic: boolean;
    sharedWith: { user: UserInfo }[];
  } | null;
};

type PreliminaryContentSharedDetailsAssignedDoc = Omit<
  PreliminaryContentSharedDetails,
  "documents"
> & {
  documents: {
    id: Uint8Array;
    name: string;
    assignedVersion?: {
      source: string;
      doenetmlVersion: {
        id: number;
        default: boolean;
        displayedVersion: string;
        fullVersion: string;
        deprecated: boolean;
        removed: boolean;
        deprecationMessage: string;
      };
      versionNum: number;
      numVariants: number;
      baseComponentCounts: string;
    } | null;
  }[];
};

/**
 * Process the results of a query using the select from `returnContentStructureNoClassDocsSelect`
 * to create an object of `ContentStructure` type
 */
export function processContentNoClassDocs(
  preliminaryContent: PreliminaryContentNoClassDocs,
  forUserId?: Uint8Array,
) {
  const {
    isAssigned,
    classCode,
    codeValidUntil,
    sharedWith: sharedWithOrig,
    license,
    parent,
    ...preliminaryContent2
  } = preliminaryContent;

  const isOpen = codeValidUntil
    ? DateTime.now() <= DateTime.fromJSDate(codeValidUntil)
    : false;
  const assignmentStatus: AssignmentStatus = !isAssigned
    ? "Unassigned"
    : !isOpen
      ? "Closed"
      : "Open";
  const { isShared, sharedWith } = processSharedWithForUser(
    sharedWithOrig,
    forUserId,
  );

  const content: ContentStructure = {
    ...preliminaryContent2,
    isShared,
    sharedWith,
    classCode: classCode ?? null,
    codeValidUntil: codeValidUntil ?? null,
    license: license ? processLicense(license) : null,
    classifications: [],
    documents: [],
    children: [],
    assignmentStatus,
    hasScoreData: false,
    parent: parent ? processParentForUser(parent, forUserId) : null,
  };

  return content;
}

/**
 * Process the results of a query using the select from `returnContentStructureSharedDetailsNoClassDocsSelect`
 * to create an object of `ContentStructure` type
 */
export function processContentSharedDetailsNoClassDocs(
  preliminaryContent: PreliminaryContentSharedDetailsNoClassDocs,
) {
  const {
    isAssigned,
    classCode,
    codeValidUntil,
    sharedWith: sharedWithOrig,
    license,
    parent,
    ...preliminaryContent2
  } = preliminaryContent;

  const isOpen = codeValidUntil
    ? DateTime.now() <= DateTime.fromJSDate(codeValidUntil)
    : false;
  const assignmentStatus: AssignmentStatus = !isAssigned
    ? "Unassigned"
    : !isOpen
      ? "Closed"
      : "Open";
  const { isShared, sharedWith } = processSharedWith(sharedWithOrig);

  const content: ContentStructure = {
    ...preliminaryContent2,
    isShared,
    sharedWith,
    classCode: classCode ?? null,
    codeValidUntil: codeValidUntil ?? null,
    license: license ? processLicense(license) : null,
    classifications: [],
    documents: [],
    children: [],
    assignmentStatus,
    hasScoreData: false,
    parent: parent ? processParent(parent) : null,
  };

  return content;
}

/**
 * Process the results of a query using the select from `returnContentStructureFullOwnerSelect`
 * to create an object of `ContentStructure` type
 */
export function processContent(
  preliminaryContent: PreliminaryContent,
  forUserId?: Uint8Array,
) {
  const {
    _count,
    isAssigned,
    classCode,
    codeValidUntil,
    sharedWith: sharedWithOrig,
    license,
    classifications,
    parent,
    ...preliminaryContent2
  } = preliminaryContent;

  const isOpen = codeValidUntil
    ? DateTime.now() <= DateTime.fromJSDate(codeValidUntil)
    : false;
  const assignmentStatus: AssignmentStatus = !isAssigned
    ? "Unassigned"
    : !isOpen
      ? "Closed"
      : "Open";
  const { isShared, sharedWith } = processSharedWithForUser(
    sharedWithOrig,
    forUserId,
  );

  const content: ContentStructure = {
    ...preliminaryContent2,
    isShared,
    sharedWith,
    classCode: classCode ?? null,
    codeValidUntil: codeValidUntil ?? null,
    license: license ? processLicense(license) : null,
    classifications: sortClassifications(
      classifications.map((c) => c.classification),
    ),
    numVariants: preliminaryContent2.documents[0]?.numVariants,
    baseComponentCounts: preliminaryContent2.documents[0]?.baseComponentCounts,
    assignmentStatus,
    hasScoreData: _count ? _count.assignmentScores > 0 : false,
    parent: parent ? processParentForUser(parent, forUserId) : null,
    children: [],
  };

  return content;
}

/**
 * Process the results of a query using the select from `returnContentStructureSharedDetailsSelect`
 * to create an object of `ContentStructure` type
 */
export function processContentSharedDetails(
  preliminaryContent: PreliminaryContentSharedDetails,
) {
  const {
    _count,
    isAssigned,
    classCode,
    codeValidUntil,
    sharedWith: sharedWithOrig,
    license,
    classifications,
    parent,
    documents: documentsOrig,
    ...preliminaryContent2
  } = preliminaryContent;

  const isOpen = codeValidUntil
    ? DateTime.now() <= DateTime.fromJSDate(codeValidUntil)
    : false;
  const assignmentStatus: AssignmentStatus = !isAssigned
    ? "Unassigned"
    : !isOpen
      ? "Closed"
      : "Open";
  const { isShared, sharedWith } = processSharedWith(sharedWithOrig);

  const documents = documentsOrig.map((doc) => ({
    id: doc.id,
    name: doc.name,
    source: doc.source,
    doenetmlVersion: doc.doenetmlVersion,
  }));

  const content: ContentStructure = {
    ...preliminaryContent2,
    documents,
    isShared,
    sharedWith,
    classCode: classCode ?? null,
    codeValidUntil: codeValidUntil ?? null,
    license: license ? processLicense(license) : null,
    classifications: sortClassifications(
      classifications.map((c) => c.classification),
    ),
    numVariants: documentsOrig[0]?.numVariants,
    baseComponentCounts: documentsOrig[0]?.baseComponentCounts,
    assignmentStatus,
    hasScoreData: _count ? _count.assignmentScores > 0 : false,
    parent: parent ? processParent(parent) : null,
    children: [],
  };

  return content;
}

/**
 * Process the results of a query using the select from `returnContentStructureSharedDetailsSelect`
 * that has been altered to give information about the assigned version of the documents
 * to create an object of `ContentStructure` type
 */
export function processContentSharedDetailsAssignedDoc(
  preliminaryContent: PreliminaryContentSharedDetailsAssignedDoc,
) {
  const {
    _count,
    isAssigned,
    classCode,
    codeValidUntil,
    sharedWith: sharedWithOrig,
    license,
    classifications,
    parent,
    documents: documentsOrig,
    ...preliminaryContent2
  } = preliminaryContent;

  const isOpen = codeValidUntil
    ? DateTime.now() <= DateTime.fromJSDate(codeValidUntil)
    : false;
  const assignmentStatus: AssignmentStatus = !isAssigned
    ? "Unassigned"
    : !isOpen
      ? "Closed"
      : "Open";
  const { isShared, sharedWith } = processSharedWith(sharedWithOrig);

  const documents = documentsOrig.map((doc) => ({
    id: doc.id,
    versionNum: doc.assignedVersion!.versionNum,
    name: doc.name,
    source: doc.assignedVersion!.source,
    doenetmlVersion: doc.assignedVersion!.doenetmlVersion,
  }));

  const content: ContentStructure = {
    ...preliminaryContent2,
    isShared,
    sharedWith,
    numVariants: documentsOrig[0].assignedVersion?.numVariants,
    baseComponentCounts: documentsOrig[0].assignedVersion?.baseComponentCounts,
    documents,
    classCode: classCode ?? null,
    codeValidUntil: codeValidUntil ?? null,
    license: license ? processLicense(license) : null,
    classifications: sortClassifications(
      classifications.map((c) => c.classification),
    ),
    assignmentStatus,
    hasScoreData: _count ? _count.assignmentScores > 0 : false,
    parent: parent ? processParent(parent) : null,
    children: [],
  };

  return content;
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
