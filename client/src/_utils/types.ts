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
  id: string;
  ownerId: number;
  owner?: UserInfo;
  name: string;
  imagePath: string | null;
  assignmentStatus: AssignmentStatus;
  isFolder?: boolean;
  classCode: string | null;
  codeValidUntil: string | null;
  isPublic: boolean;
  isShared: boolean;
  sharedWith: UserInfo[];
  license: License | null;
  classifications: ContentClassification[];
  documents: {
    id: string;
    versionNum?: number;
    name?: string;
    source?: string;
    doenetmlVersion: DoenetmlVersion;
  }[];
  hasScoreData: boolean;
  parentFolder: {
    id: string;
    name: string;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
  } | null;
};

export type DocHistoryItem = {
  docId: string;
  prevDocId: string;
  prevDocVersionNum: number;
  withLicenseCode: string | null;
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
  withLicenseCode: string | null;
  isDirect: boolean;
  timestampDoc: DateTime;
  timestampPrevDoc: DateTime;
  activityId: string;
  activityName: string;
  owner: UserInfo;
};
