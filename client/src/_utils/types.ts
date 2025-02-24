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

export type LibraryInfo = {
  sourceId: string;
  contentId: string | null;
  onwerRequested?: boolean;
  status:
    | "none"
    | "PENDING_REVIEW"
    | "REQUEST_REMOVED"
    | "PUBLISHED"
    | "NEEDS_REVISION";
  comments?: string;
};

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
  numCurated?: number;
  numCommunity?: number;
};

export type ContentType = "singleDoc" | "select" | "sequence" | "folder";

export type ContentBase = {
  contentId: string;
  ownerId: string;
  owner?: UserInfo;
  name: string;
  imagePath: string | null;
  isPublic: boolean;
  isShared: boolean;
  sharedWith: UserInfo[];
  // Content should ~almost always~ have a license.
  // The exception: content without license from old doenet website
  license: License | null;
  contentFeatures: {
    id: number;
    code: string;
    term: string;
    description: string;
    sortIndex: number;
  }[];
  classifications: ContentClassification[];
  librarySourceInfo?: LibraryInfo;
  libraryActivityInfo?: LibraryInfo;
  parent: {
    contentId: string;
    name: string;
    type: ContentType;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfo[];
  } | null;
  assignmentInfo?: AssignmentInfo;
};

export type Doc = ContentBase & {
  type: "singleDoc";
  numVariants: number;
  baseComponentCounts: string;
  revisionNum?: number;
  source: string;
  doenetmlVersion: DoenetmlVersion;
};

export type QuestionBank = ContentBase & {
  type: "select";
  numToSelect: number;
  selectByVariant: boolean;
  children: Content[];
};

export type ProblemSet = ContentBase & {
  type: "sequence";
  shuffle: boolean;
  paginate: boolean;
  activityLevelAttempts: boolean;
  itemLevelAttempts: boolean;
  children: Content[];
};

export type Folder = ContentBase & {
  type: "folder";
  children: Content[];
};

export type Activity = Doc | QuestionBank | ProblemSet;

export type Content = Doc | QuestionBank | ProblemSet | Folder;

export type AssignmentInfo = {
  assignmentStatus: AssignmentStatus;
  classCode: string | null;
  codeValidUntil: string | null;
  hasScoreData: boolean;
};

export type ActivityHistoryItem = {
  contentId: Uint8Array;
  prevContentId: Uint8Array;
  prevRevisionNum: number;
  withLicenseCode: LicenseCode | null;
  timestampActivity: DateTime;
  timestampPrevActivity: DateTime;
  prevName: string;
  prevOwner: UserInfo;
  prevCidAtRemix: string;
  prevChanged: boolean;
};

export type ActivityRemixItem = {
  prevContentId: Uint8Array;
  prevRevisionNum: number;
  withLicenseCode: LicenseCode | null;
  contentId: Uint8Array;
  name: string;
  owner: UserInfo;
  timestampActivity: DateTime;
  timestampPrevActivity: DateTime;
  directCopy: boolean;
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

export type ContentDescription = {
  contentId: string;
  name: string;
  type: ContentType;
};

export function isContentDescription(obj: unknown): obj is ContentDescription {
  const typedObj = obj as ContentDescription;
  return (
    typedObj !== null &&
    typeof typedObj === "object" &&
    typeof typedObj.contentId === "string" &&
    typeof typedObj.name === "string" &&
    ["singleDoc", "folder", "sequence", "select"].includes(typedObj.type)
  );
}
