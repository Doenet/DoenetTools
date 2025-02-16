import {
  ContentStructure,
  DocHistory,
  DocRemixes,
  LibraryInfo,
  UserInfo,
} from "../types";
import { fromBinaryUUID, toBinaryUUID } from "./binary-uuid";
import short from "short-uuid";

const translator = short();

export function toUUID(id: string) {
  return toBinaryUUID(translator.toUUID(id));
}

export function fromUUID(UUID: Uint8Array) {
  return translator.fromUUID(fromBinaryUUID(UUID));
}

export function newUUID() {
  return toBinaryUUID(translator.new());
}

export function isEqualUUID(UUID1: Uint8Array, UUID2: Uint8Array) {
  if (UUID1.length !== UUID2.length) {
    return false;
  }
  for (let i = 0; i < UUID1.length; i++) {
    if (UUID1[i] !== UUID2[i]) {
      return false;
    }
  }
  return true;
}

export function compareUUID(UUID1: Uint8Array, UUID2: Uint8Array) {
  return Buffer.from(UUID1).compare(UUID2);
}

export function contentStructureConvertUUID(content: ContentStructure) {
  const parentFolder = content.parentFolder
    ? {
        ...content.parentFolder,
        id: fromUUID(content.parentFolder.id),
        sharedWith: content.parentFolder.sharedWith.map(userConvertUUID),
      }
    : null;

  const owner = content.owner ? userConvertUUID(content.owner) : undefined;

  const sharedWith = content.sharedWith.map(userConvertUUID);
  const documents = content.documents.map((doc) => ({
    ...doc,
    id: fromUUID(doc.id),
  }));

  const librarySourceInfo = content.librarySourceInfo
    ? libraryInfoConvertUUID(content.librarySourceInfo)
    : undefined;
  const libraryActivityInfo = content.libraryActivityInfo
    ? libraryInfoConvertUUID(content.libraryActivityInfo)
    : undefined;

  return {
    ...content,
    id: fromUUID(content.id),
    ownerId: fromUUID(content.ownerId),
    owner,
    sharedWith,
    documents,
    parentFolder,
    librarySourceInfo,
    libraryActivityInfo,
  };
}

export function userConvertUUID(user: UserInfo) {
  return { ...user, userId: fromUUID(user.userId) };
}

export function docHistoryConvertUUID(docHistory: DocHistory) {
  return {
    id: fromUUID(docHistory.id),
    contributorHistory: docHistory.contributorHistory.map((ch) => {
      const activityOrig = ch.prevDoc.document.activity;
      const activity = {
        name: activityOrig.name,
        id: fromUUID(activityOrig.id),
        owner: userConvertUUID(activityOrig.owner),
      };

      return {
        ...ch,
        docId: fromUUID(ch.docId),
        prevDocId: fromUUID(ch.prevDocId),
        prevDoc: {
          versionNum: ch.prevDoc.versionNum,
          cid: ch.prevDoc.cid,
          source: ch.prevDoc.document.source,
          activity,
        },
      };
    }),
  };
}

export function docRemixesConvertUUID(docRemixes: DocRemixes) {
  return {
    id: fromUUID(docRemixes.id),
    documentVersions: docRemixes.documentVersions.map((docVersion) => ({
      versionNumber: docVersion.versionNumber,
      remixes: docVersion.remixes.map((remix) => ({
        ...remix,
        docId: fromUUID(remix.docId),
        activity: {
          name: remix.activity.name,
          id: fromUUID(remix.activity.id),
          owner: userConvertUUID(remix.activity.owner),
        },
      })),
    })),
  };
}

export function assignmentConvertUUID(assignment: {
  id: Uint8Array;
  documents: {
    id: Uint8Array;
    assignedVersionNum: number | null;
    assignedVersion: {
      source: string;
      doenetmlVersion: {
        fullVersion: string;
      };
    } | null;
  }[];
}) {
  return {
    id: fromUUID(assignment.id),
    documents: assignment.documents.map((doc) => ({
      ...doc,
      id: fromUUID(doc.id),
    })),
  };
}

export function assignmentStudentDataConvertUUID({
  score,
  documentScores,
  user,
  activity,
}: {
  score: number;
  documentScores: {
    docId: Uint8Array;
    score: number;
    docVersionNum: number;
    hasMaxScore: boolean;
  }[];
  user: UserInfo;
  activity: {
    documents: {
      assignedVersion: {
        source: string;
        doenetmlVersion: { fullVersion: string };
        docId: Uint8Array;
        versionNum: number;
      } | null;
    }[];
    id: Uint8Array;
    name: string;
  };
}) {
  return {
    score,
    documentScores: documentScores.map((ds) => ({
      ...ds,
      docId: fromUUID(ds.docId),
    })),
    user: userConvertUUID(user),
    activity: {
      name: activity.name,
      id: fromUUID(activity.id),
      documents: activity.documents.map((assignmentObj) =>
        assignmentObj.assignedVersion
          ? {
              ...assignmentObj.assignedVersion,
              docId: fromUUID(assignmentObj.assignedVersion.docId),
            }
          : null,
      ),
    },
  };
}

export function allAssignmentScoresConvertUUID({
  orderedActivities,
  assignmentScores,
  folder,
}: {
  orderedActivities: {
    id: Uint8Array;
    name: string;
  }[];
  assignmentScores: {
    score: number;
    user: UserInfo;
    activityId: Uint8Array;
  }[];
  folder: {
    id: Uint8Array;
    name: string;
  } | null;
}) {
  return {
    orderedActivities: orderedActivities.map((act) => ({
      id: fromUUID(act.id),
      name: act.name,
    })),
    assignmentScores: assignmentScores.map((scoreObj) => ({
      score: scoreObj.score,
      user: userConvertUUID(scoreObj.user),
      activityId: fromUUID(scoreObj.activityId),
    })),
    folder: folder ? { id: fromUUID(folder.id), name: folder.name } : null,
  };
}

export function studentDataConvertUUID({
  userData,
  orderedActivityScores,
  folder,
}: {
  userData: UserInfo;
  orderedActivityScores: {
    activityId: Uint8Array;
    activityName: string;
    score: number | null;
  }[];
  folder: {
    id: Uint8Array;
    name: string;
  } | null;
}) {
  return {
    userData: userConvertUUID(userData),
    orderedActivityScores: orderedActivityScores.map((act) => ({
      activityId: fromUUID(act.activityId),
      activityName: act.activityName,
      score: act.score,
    })),
    folder: folder ? { id: fromUUID(folder.id), name: folder.name } : null,
  };
}

export function libraryInfoConvertUUID(libraryInfo: LibraryInfo) {
  const sourceId = fromUUID(libraryInfo.sourceId);
  const activityId = libraryInfo.activityId
    ? fromUUID(libraryInfo.activityId)
    : null;
  return {
    sourceId,
    activityId,
    status: libraryInfo.status,
    ownerRequested: libraryInfo.ownerRequested,
    comments: libraryInfo.comments,
  };
}
