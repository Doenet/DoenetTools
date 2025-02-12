import { DateTime } from "luxon";

export type DoenetmlVersion = {
  id: number;
  displayedVersion: string;
  fullVersion: string;
  default: boolean;
  deprecated: boolean;
  removed: boolean;
  deprecationMessage: string;
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

export type AssignmentStatus = "Unassigned" | "Closed" | "Open";

export type UserInfo = {
  userId: string;
  firstNames: string | null;
  lastNames: string;
  email: string;
  numLibrary?: number;
  numCommunity?: number;
};

export type ContentFeature = {
  id: number;
  code: string;
  description: string;
  term: string;
};

export type ContentClassification = {
  id: number;
  code: string;
  descriptions: {
    description: string;
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
  numLibrary?: number;
  numCommunity?: number;
};

export type ContentType = "singleDoc" | "select" | "sequence" | "folder";

export type ContentStructure = {
  id: string;
  type: ContentType;
  ownerId: number;
  owner?: UserInfo;
  name: string;
  imagePath: string | null;
  assignmentStatus: AssignmentStatus;
  isFolder?: boolean;
  classCode: string | null;
  codeValidUntil: string | null;
  isPublic: boolean;
  contentFeatures: {
    id: number;
    code: string;
    term: string;
    description: string;
    sortIndex: number;
  }[];
  isShared: boolean;
  sharedWith: UserInfo[];
  license: License | null;
  numVariants?: number;
  baseComponentCounts?: string;
  numToSelect: number;
  selectByVariant: boolean;
  shuffle: boolean;
  paginate: boolean;
  activityLevelAttempts: boolean;
  itemLevelAttempts: boolean;
  classifications: ContentClassification[];
  documents: {
    id: string;
    versionNum?: number;
    name?: string;
    source?: string;
    doenetmlVersion: DoenetmlVersion;
  }[];
  hasScoreData: boolean;
  parent: {
    id: string;
    name: string;
    type: ContentType;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
  } | null;
  children: ContentStructure[];
};

export type DocHistoryItem = {
  docId: string;
  prevDocId: string;
  prevDocVersionNum: number;
  withLicenseCode: LicenseCode | null;
  timestampDoc: DateTime;
  timestampPrevDoc: DateTime;
  prevActivityId: string;
  prevActivityName: string;
  prevOwner: UserInfo;
  prevChanged: boolean;
  prevCid: string;
};

export type DocRemixItem = {
  docId: string;
  prevDocId: string;
  prevDocVersionNum: number;
  withLicenseCode: LicenseCode | null;
  isDirect: boolean;
  timestampDoc: DateTime;
  timestampPrevDoc: DateTime;
  activityId: string;
  activityName: string;
  owner: UserInfo;
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
      classifications: {
        id: number;
        code: string;
        description: string;
      }[];
    }[];
  }[];
};
