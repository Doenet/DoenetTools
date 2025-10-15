/**
 * ====================================================================================
 * MAINTAIN EQUIVALENT TYPES in client and server
 * ---------------------------------------------------------------------------------
 * This file should be exactly the same in both the client module and the server module!
 * Use the file `types_module_specific.ts` for any types that are defined differently.
 *
 * If you make edits to this file, please copy and paste the full file to the other module.
 * =====================================================================================
 */

import { DoenetDateTime, isUuid, Uuid } from "./types_module_specific";

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

/** This type must match the Prisma-defined enum `LibraryStatus` */
export type LibraryStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "PUBLISHED"
  | "REJECTED";

/**
 * This type represents the library status of a provided content id in both directions.
 * The `activity` field contains info about an activity revised from provided content .
 * The `source` fields refers an activity that uses the provied content as a source.
 *
 * Optional fields are only included for certain users:
 * - `activity.comments` - must be owner or editor
 * - `activity.reviewRequestDate` - must be owner or editor
 * - `source.comments` - must be editor
 * - `source.ownerRequested` - must be editor
 */
export type LibraryRelations = {
  activity?: {
    status: LibraryStatus;
    activityContentId: Uuid | null;
    reviewRequestDate?: DoenetDateTime;
  };
  source?: {
    status: LibraryStatus;
    sourceContentId: Uuid | null;
    reviewRequestDate?: DoenetDateTime;
    ownerRequested?: boolean;
    primaryEditor?: UserInfo;
    iAmPrimaryEditor?: boolean;
  };
};

export type LibraryComment = {
  user: UserInfo;
  dateTime: DoenetDateTime;
  comment: string;
  isMe: boolean;
};

export type UserInfo = {
  userId: Uuid;
  firstNames: string | null;
  lastNames: string;
  isAuthor?: boolean;
  isAnonymous?: boolean;
  numLibrary?: number;
  numCommunity?: number;
  isMaskForLibrary?: boolean;
};

export function isUserInfo(obj: unknown): obj is UserInfo {
  const typedObj = obj as UserInfo;
  return (
    typedObj !== null &&
    typeof typedObj === "object" &&
    isUuid(typedObj.userId) &&
    (typedObj.firstNames === null || typeof typedObj.firstNames === "string") &&
    typeof typedObj.lastNames === "string" &&
    (typedObj.numLibrary === undefined ||
      typeof typedObj.numLibrary === "number") &&
    (typedObj.numCommunity === undefined ||
      typeof typedObj.numCommunity === "number")
  );
}

export type UserInfoWithEmail = UserInfo & {
  email: string;
};

export type CategoryGroup = {
  name: string;
  isRequired: boolean;
  isExclusive: boolean;
  categories: Category[];
};

export type Category = {
  code: string;
  description: string;
  term: string;
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

export type ContentType = "singleDoc" | "select" | "sequence" | "folder";
export function isContentType(type: unknown): type is ContentType {
  return (
    typeof type === "string" &&
    ["singleDoc", "select", "sequence", "folder"].includes(type)
  );
}

export type AssignmentMode = "formative" | "summative";

export type ContentBase = {
  contentId: Uuid;
  ownerId: Uuid;
  owner?: UserInfo;
  name: string;
  isPublic: boolean;
  isShared: boolean;
  sharedWith: UserInfoWithEmail[];
  // Content should ~almost always~ have a license.
  // The exception: content without license from old doenet website
  licenseCode: LicenseCode | null;
  categories: {
    id: number;
    code: string;
    term: string;
    description: string;
    sortIndex: number;
  }[];
  classifications: ContentClassification[];
  parent: {
    contentId: Uuid;
    name: string;
    type: ContentType;
    isPublic: boolean;
    isShared: boolean;
    sharedWith: UserInfoWithEmail[];
  } | null;
  assignmentInfo?: AssignmentInfo;
};

export type Doc = ContentBase & {
  type: "singleDoc";
  numVariants: number;
  revisionNum?: number;
  doenetML: string;
  doenetmlVersion: DoenetmlVersion;
  repeatInProblemSet?: number;
};

export type QuestionBank = ContentBase & {
  type: "select";
  activityJson?: string;
  revisionNum?: number;
  numToSelect: number;
  selectByVariant: boolean;
  children: Content[];
};

export type ProblemSet = ContentBase & {
  type: "sequence";
  activityJson?: string;
  revisionNum?: number;
  shuffle: boolean;
  paginate: boolean;
  children: Content[];
};

export type Folder = ContentBase & {
  type: "folder";
  revisionNum?: number;
  children: Content[];
};

export type Activity = Doc | QuestionBank | ProblemSet;

export type Content = Doc | QuestionBank | ProblemSet | Folder;

export type AssignmentInfo = {
  assignmentStatus: AssignmentStatus;
  classCode: string;
  codeValidUntil: DoenetDateTime;
  hasScoreData: boolean;
  mode: AssignmentMode;
  individualizeByStudent: boolean;
  maxAttempts: number;
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

export type ActivityRemixItem = {
  originContent: RemixContent;
  remixContent: RemixContent;
  withLicenseCode: LicenseCode | null;
  directCopy: boolean;
};

export type RemixContent = {
  contentId: Uuid;
  revisionNum: number;
  timestamp: DoenetDateTime;
  name: string;
  owner: UserInfo;
  cidAtLastUpdate: string;
  currentCid: string;
  changed: boolean;
  source?: string;
  doenetmlVersion?: string;
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

export type ContentDescription = {
  contentId: Uuid;
  name: string;
  type: ContentType;
  parent: {
    contentId: Uuid;
    type: ContentType;
    name?: string;
  } | null;

  grandparentId?: Uuid | null;
  grandparentName?: string | null;
  // TODO: remove this when fix bad assignment versions
  hasBadVersion?: boolean;
};

export function isContentDescription(obj: unknown): obj is ContentDescription {
  const typedObj = obj as ContentDescription;
  return (
    typedObj !== null &&
    typeof typedObj === "object" &&
    isUuid(typedObj.contentId) &&
    typeof typedObj.name === "string" &&
    ["singleDoc", "folder", "sequence", "select"].includes(typedObj.type) &&
    (typedObj.parent === null ||
      (typeof typedObj.parent === "object" &&
        typeof typedObj.parent.contentId === "string" &&
        ["singleDoc", "folder", "sequence", "select"].includes(
          typedObj.parent.type,
        )))
  );
}

export type ContentRevision = {
  revisionNum: number;
  revisionName: string;
  note: string;
  source: string;
  doenetmlVersion: string | null;
  cid: string;
  createdAt: DoenetDateTime;
};
