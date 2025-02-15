export type DoenetmlVersion = {
  id: number;
  displayedVersion: string;
  fullVersion: string;
  default: boolean;
  deprecated: boolean;
  removed: boolean;
  deprecationMessage: string;
};

export type AssignmentStatus = "Unassigned" | "Closed" | "Open";

export type LibraryInfo = {
  sourceId: Uint8Array;
  activityId: Uint8Array | null;
  ownerRequested?: boolean;
  status:
    | "none"
    | "PENDING_REVIEW"
    | "REQUEST_REMOVED"
    | "PUBLISHED"
    | "NEEDS_REVISION";
  comments?: string;
};

export function blankLibraryInfo(sourceId: Uint8Array): LibraryInfo {
  return {
    sourceId,
    activityId: null,
    status: "none",
  };
}

export type UserInfo = {
  userId: Uint8Array;
  firstNames: string | null;
  lastNames: string;
  email: string;
  // isLibrary: boolean;
  numLibrary?: number;
  numCommunity?: number;
};

export type ContentClassification = {
  id: number;
  code: string;
  descriptions: {
    description: string;
    sortIndex: number;
    subCategory: {
      id: number;
      subCategory: string;
      sortIndex: number;
      category: {
        id: number;
        category: string;
        system: {
          id: number;
          name: string;
          shortName: string;
          categoryLabel: string;
          subCategoryLabel: string;
          descriptionLabel: string;
          categoriesInDescription: boolean;
          type: string;
        };
      };
    };
  }[];
};

export type PartialContentClassification = {
  classification?: {
    id: number;
    code: string;
    descriptionId: number;
    description: string;
  };
  subCategory?: {
    id: number;
    subCategory: string;
  };
  category?: {
    id: number;
    category: string;
  };
  system?: {
    id: number;
    name: string;
    shortName: string;
    categoryLabel: string;
    subCategoryLabel: string;
    descriptionLabel: string;
    type?: string;
    categoriesInDescription: boolean;
  };
  numCurated?: number;
  numCommunity?: number;
};

export type ContentStructure = {
  id: Uint8Array;
  ownerId: Uint8Array;
  owner?: UserInfo;
  name: string;
  imagePath: string | null;
  assignmentStatus: AssignmentStatus;
  isFolder?: boolean;
  classCode: string | null;
  codeValidUntil: Date | null;
  isPublic: boolean;
  isShared: boolean;
  sharedWith: UserInfo[];
  license: License | null;
  contentFeatures: {
    id: number;
    code: string;
    term: string;
    description: string;
    sortIndex: number;
  }[];
  classifications: ContentClassification[];
  librarySource?: LibraryInfo;
  libraryActivity?: LibraryInfo;
  documents: {
    id: Uint8Array;
    versionNum?: number;
    name?: string;
    source?: string;
    doenetmlVersion: DoenetmlVersion;
  }[];
  hasScoreData: boolean;
  parentFolder: {
    id: Uint8Array;
    name: string;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
  } | null;
};

export function createContentStructure({
  activityId,
  ownerId,
}: {
  activityId: Uint8Array;
  ownerId: Uint8Array;
}) {
  const defaultStructure: ContentStructure = {
    id: activityId,
    name: "",
    ownerId: ownerId,
    imagePath: null,
    assignmentStatus: "Unassigned",
    classCode: null,
    codeValidUntil: null,
    isPublic: false,
    isShared: false,
    sharedWith: [],
    license: null,
    contentFeatures: [],
    classifications: [],
    documents: [],
    hasScoreData: false,
    parentFolder: null,
  };
  return defaultStructure;
}

export type LicenseCode = "CCDUAL" | "CCBYSA" | "CCBYNCSA";

export type License = {
  code: LicenseCode;
  name: string;
  description: string;
  imageURL: string | null;
  smallImageURL: string | null;
  licenseURL: string | null;
  isComposition: boolean;
  composedOf: {
    code: LicenseCode;
    name: string;
    description: string;
    imageURL: string | null;
    smallImageURL: string | null;
    licenseURL: string | null;
  }[];
};

export type DocHistory = {
  id: Uint8Array;
  contributorHistory: {
    docId: Uint8Array;
    prevDocId: Uint8Array;
    prevDocVersionNum: number;
    withLicenseCode: string | null;
    timestampDoc: Date;
    timestampPrevDoc: Date;
    prevDoc: {
      document: {
        source: string;
        activity: {
          name: string;
          id: Uint8Array;
          owner: UserInfo;
        };
      };
      versionNum: number;
      cid: string;
    };
  }[];
};

export type DocRemixes = {
  id: Uint8Array;
  documentVersions: {
    versionNumber: number;
    remixes: {
      activity: {
        id: Uint8Array;
        name: string;
        owner: {
          userId: Uint8Array;
          email: string;
          firstNames: string | null;
          lastNames: string;
        };
      };

      docId: Uint8Array;
      withLicenseCode: string | null;
      timestampDoc: Date;
      timestampPrevDoc: Date;
    }[];
  }[];
};

export type ClassificationCategoryTree = {
  id: number;
  name: string;
  type: string;
  categoryLabel: string;
  subCategoryLabel: string;
  categories: {
    id: number;
    category: string;
    subCategories: {
      id: number;
      subCategory: string;
    }[];
  }[];
};
