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

export type UserInfo = {
  userId: Uint8Array;
  firstNames: string | null;
  lastNames: string;
  email: string;
};

export type ContentClassification = {
  id: number;
  code: string;
  description: string;
  subCategory: {
    id: number;
    subCategory: string;
    category: {
      id: number;
      category: string;
      system: {
        id: number;
        name: string;
        categoryLabel: string;
        subCategoryLabel: string;
      };
    };
  };
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
  classifications: ContentClassification[];
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

export type ClassificationSystemTree = {
  id: number;
  name: string;
  categoryLabel: string;
  subCategoryLabel: string;
  categories: {
    id: number;
    category: string;
    subCategories: {
      id: number;
      subCategory: string;
      classifications: {
        id: number;
        code: string;
        description: string;
      }[];
    }[];
  }[];
};
