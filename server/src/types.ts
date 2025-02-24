import { ContentType } from "@prisma/client";
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

export type LibraryInfo = {
  sourceId: Uint8Array;
  contentId: Uint8Array | null;
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
    contentId: null,
    status: "none",
  };
}

export type UserInfo = {
  userId: Uint8Array;
  firstNames: string | null;
  lastNames: string;
  email: string;
  numLibrary?: number;
  numCommunity?: number;
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
    contentId: Uint8Array;
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
  codeValidUntil: Date | null;
  hasScoreData: boolean;
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
    imagePath: null,
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
        baseComponentCounts: "{}",
        source: "",
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
        activityLevelAttempts: false,
        itemLevelAttempts: false,
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

export type ActivityHistoryItem = {
  contentId: Uint8Array;
  prevContentId: Uint8Array;
  prevRevisionNum: number;
  withLicenseCode: LicenseCode | null;
  timestampActivity: Date;
  timestampPrevActivity: Date;
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
  timestampActivity: Date;
  timestampPrevActivity: Date;
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
    }[];
  }[];
};
