import { ContentType, LibraryStatus, AssignmentMode } from "@prisma/client";
import { prisma } from "./model";

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
    activityContentId: Uint8Array | null;
    reviewRequestDate?: Date;
  };
  source?: {
    status: LibraryStatus;
    sourceContentId: Uint8Array | null;
    reviewRequestDate?: Date;
    ownerRequested?: boolean;
    primaryEditor?: UserInfo;
    iAmPrimaryEditor?: boolean;
  };
};

export type LibraryComment = {
  user: UserInfo;
  dateTime: Date;
  comment: string;
  isMe: boolean;
};

export type UserInfo = {
  userId: Uint8Array;
  firstNames: string | null;
  lastNames: string;
  isAnonymous?: boolean;
  isAuthor?: boolean;
  numLibrary?: number;
  numCommunity?: number;
  isMaskForLibrary?: boolean;
};

export function isUserInfo(obj: unknown): obj is UserInfo {
  const typedObj = obj as UserInfo;
  return (
    typedObj !== null &&
    typeof typedObj === "object" &&
    typedObj.userId instanceof Uint8Array &&
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

export function isContentType(type: unknown): type is ContentType {
  return (
    typeof type === "string" &&
    ["singleDoc", "select", "sequence", "folder"].includes(type)
  );
}

export type ContentBase = {
  contentId: Uint8Array;
  ownerId: Uint8Array;
  owner?: UserInfo;
  name: string;
  isPublic: boolean;
  isShared: boolean;
  sharedWith: UserInfoWithEmail[];
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
  parent: {
    contentId: Uint8Array;
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
  codeValidUntil: Date | null;
  otherRoot?: {
    rootContentId: Uint8Array;
    rootName: string;
    rootType: ContentType;
  };
  hasScoreData: boolean;
  mode: AssignmentMode;
  individualizeByStudent: boolean;
  maxAttempts: number;
};

export async function createContentInfo({
  contentId,
  ownerId,
  contentType,
}: {
  contentId: Uint8Array;
  ownerId: Uint8Array;
  contentType: ContentType;
}): Promise<Content> {
  const contentBase: ContentBase = {
    contentId: contentId,
    name: "",
    ownerId: ownerId,
    isPublic: false,
    isShared: false,
    sharedWith: [],
    license: null,
    parent: null,
    contentFeatures: [],
    classifications: [],
  };

  switch (contentType) {
    case "singleDoc": {
      const defaultDoenetmlVersion =
        await prisma.doenetmlVersions.findFirstOrThrow({
          where: { default: true },
        });
      return {
        type: "singleDoc",
        numVariants: 1,
        doenetML: "",
        doenetmlVersion: defaultDoenetmlVersion,
        ...contentBase,
      };
    }
    case "select": {
      return {
        type: "select",
        numToSelect: 1,
        selectByVariant: false,
        children: [],
        ...contentBase,
      };
    }
    case "sequence": {
      return {
        type: "sequence",
        shuffle: false,
        paginate: false,
        children: [],
        ...contentBase,
      };
    }
    case "folder": {
      return {
        type: "folder",
        children: [],
        ...contentBase,
      };
    }
  }
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

export type ActivityRemixItem = {
  originContent: RemixContent;
  remixContent: RemixContent;
  withLicenseCode: LicenseCode | null;
  directCopy: boolean;
};

export type RemixContent = {
  contentId: Uint8Array;
  revisionNum: number;
  timestamp: Date;
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
