import { PrismaClient } from "@prisma/client";
import { cidFromText } from "./utils/cid";

const prisma = new PrismaClient();

export async function createActivity(ownerId: number) {
  let defaultDoenetmlVersion = await prisma.doenetmlVersions.findFirstOrThrow({
    where: { default: true },
  });

  const activity = await prisma.activities.create({
    data: {
      ownerId,
      name: "Untitled Activity",
      imagePath: "/activity_default.jpg",
      documents: {
        create: [
          {
            contentLocation: "",
            doenetmlVersionId: defaultDoenetmlVersion.versionId,
            name: "Untitled Document",
          },
        ],
      },
    },
  });

  let activityId = activity.activityId;

  const activityWithDoc = await prisma.activities.findUniqueOrThrow({
    where: { activityId },
    select: { documents: { select: { docId: true } } },
  });

  let docId = activityWithDoc.documents[0].docId;

  return { activityId, docId };
}

export async function deleteActivity(activityId: number) {
  return await prisma.activities.update({
    where: { activityId },
    data: {
      isDeleted: true,
      documents: {
        updateMany: {
          where: {},
          data: {
            isDeleted: true,
          },
        },
      },
    },
  });
}

export async function deleteDocument(docId: number) {
  return await prisma.documents.update({
    where: { docId },
    data: { isDeleted: true },
  });
}

export async function deleteAssignment(assignmentId: number) {
  return await prisma.assignments.update({
    where: { assignmentId },
    data: {
      isDeleted: true,
    },
  });
}

export async function updateActivity({
  activityId,
  name,
  imagePath,
  isPublic,
}: {
  activityId: number;
  name?: string;
  imagePath?: string;
  isPublic?: boolean;
}) {
  return await prisma.activities.update({
    where: { activityId },
    data: {
      name,
      imagePath,
      isPublic,
    },
  });
}

// TODO - access control
export async function updateDoc({
  docId,
  content,
  name,
  doenetmlVersionId,
}: {
  docId: number;
  content?: string;
  name?: string;
  doenetmlVersionId?: number;
}) {
  return await prisma.documents.update({
    where: { docId },
    data: {
      contentLocation: content,
      name,
      doenetmlVersionId,
    },
  });
}

export async function updateAssignment({
  assignmentId,
  name,
  imagePath,
}: {
  assignmentId: number;
  name?: string;
  imagePath?: string;
}) {
  return await prisma.assignments.update({
    where: { assignmentId },
    data: {
      name,
      imagePath,
    },
  });
}

// TODO - access control
export async function getActivity(activityId: number) {
  return await prisma.activities.findFirstOrThrow({
    where: { activityId, isDeleted: false },
    include: {
      documents: {
        where: { isDeleted: false },
      },
    },
  });
}

// TODO - access control
export async function getDoc(docId: number) {
  return await prisma.documents.findFirstOrThrow({
    where: { docId, isDeleted: false },
  });
}

// TODO - access control
export async function copyPublicActivityToPortfolio(
  origActivityId: number,
  userId: number,
) {
  let origActivity = await getActivity(origActivityId);

  if (!origActivity.isPublic) {
    throw Error("Cannot copy a non-public activity to portfolio");
  }

  let newActivity = await prisma.activities.create({
    data: {
      name: origActivity.name,
      imagePath: origActivity.imagePath,
      ownerId: userId,
    },
  });

  let documentsToAdd = await Promise.all(
    origActivity.documents.map(async (doc) => {
      // For each of the original documents, create a document version (i.e., a frozen snapshot)
      // that we will link to when creating contributor history, below.
      let originalDocVersion = await createDocumentVersion(doc.docId);

      // document to create with new activityId (to associate it with newly created activity)
      // ignoring the docId, lastEdited, createdAt fields
      const {
        docId: _ignoreDocId,
        lastEdited: _ignoreLastEdited,
        createdAt: _ignoreCreatedAt,
        ...docInfo
      } = doc;
      docInfo.activityId = newActivity.activityId;

      return { docInfo, originalDocVersion };
    }),
  );

  // TODO: When createManyAndReturn is rolled out,
  // (see: https://github.com/prisma/prisma/pull/24064#issuecomment-2093331715)
  // use that to give a list of the newly created docIds.
  await prisma.documents.createMany({
    data: documentsToAdd.map((x) => x.docInfo),
  });

  // In lieu of createManyAndReturn, get a list of the docIds of the newly created documents.
  const newDocIds = (
    await prisma.activities.findUniqueOrThrow({
      where: { activityId: newActivity.activityId },
      select: {
        documents: { select: { docId: true }, orderBy: { docId: "asc" } },
      },
    })
  ).documents.map((docIdObj) => docIdObj.docId);

  // Create contributor history linking each newly created document
  // to the corresponding versioned document from origActivity.
  let contribHistoryInfo = newDocIds.map((docId, i) => ({
    docId,
    prevDocId: origActivity.documents[i].docId,
    prevDocVersion: documentsToAdd[i].originalDocVersion.version,
  }));
  await prisma.contributorHistory.createMany({
    data: contribHistoryInfo,
  });

  // Create contributor history linking each newly created document
  // to the contributor history of the corresponding document from origActivity.
  // Note: we copy all history rather than using a linked list
  // due to inefficient queries necessary to traverse link lists.
  for (let [i, origDoc] of origActivity.documents.entries()) {
    const previousHistory = await prisma.contributorHistory.findMany({
      where: {
        docId: origDoc.docId,
      },
      orderBy: { timestamp: "desc" },
    });

    await prisma.contributorHistory.createMany({
      data: previousHistory.map((hist) => ({
        docId: newDocIds[i],
        prevDocId: hist.prevDocId,
        prevDocVersion: hist.prevDocVersion,
        timestamp: hist.timestamp,
      })),
    });
  }

  return newActivity.activityId;
}

// TODO - access control
export async function createDocumentVersion(docId: number): Promise<{
  version: number;
  docId: number;
  cid: string | null;
  contentLocation: string | null;
  createdAt: Date | null;
  doenetmlVersionId: number;
}> {
  const doc = await prisma.documents.findFirstOrThrow({
    where: { docId, isDeleted: false },
    include: {
      activity: { select: { name: true } },
    },
  });

  // TODO: cid should really include the doenetmlVersion
  const cid = await cidFromText(doc.contentLocation || "");

  let docVersion = await prisma.documentVersions.findUnique({
    where: { docId_cid: { docId, cid } },
  });

  if (!docVersion) {
    // TODO: not sure how to make an atomic operation of this with the ORM.
    // Should we write a raw SQL query to accomplish this in one query?

    const aggregations = await prisma.documentVersions.aggregate({
      _max: { version: true },
      where: { docId },
    });
    const lastVersion = aggregations._max.version;
    const newVersion = lastVersion ? lastVersion + 1 : 1;

    docVersion = await prisma.documentVersions.create({
      data: {
        version: newVersion,
        docId,
        cid,
        name: doc.name,
        activityName: doc.activity.name,
        doenetmlVersionId: doc.doenetmlVersionId,
        contentLocation: doc.contentLocation,
      },
    });
  }

  return docVersion;
}

// TODO - access control
export async function getActivityEditorData(activityId: number) {
  // TODO: add pagination or a hard limit in the number of documents one can add to an activity
  let activity = await prisma.activities.findFirstOrThrow({
    where: { activityId },
    include: {
      documents: {
        include: {
          doenetmlVersion: true,
        },
        // TODO: implement ability to allow users to order the documents within an activity
        orderBy: { docId: "asc" },
      },
    },
  });

  return activity;
}

// TODO - access control
// TODO: generalize this to multi-document activities
export async function getActivityViewerData(activityId: number) {
  const activity = await prisma.activities.findFirstOrThrow({
    where: { activityId },
    include: {
      owner: { select: { userId: true, email: true, name: true } },
      documents: { select: { docId: true } },
    },
  });
  const docId = activity.documents[0].docId;

  let doc = await prisma.documents.findFirstOrThrow({
    where: { docId },
    include: {
      contributorHistory: {
        include: {
          prevDoc: {
            select: {
              document: {
                select: {
                  activity: {
                    select: {
                      activityId: true,
                      name: true,
                      owner: {
                        select: { userId: true, email: true, name: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    activity,
    doc,
  };
}

// TODO - access control
export async function getAssignmentEditorData(assignmentId: number) {
  // TODO: add pagination or a hard limit in the number of documents one can add to an activity
  let activity = await prisma.assignments.findFirstOrThrow({
    where: { assignmentId },
    include: {
      assignmentItems: {
        select: {
          docId: true,
          docVersionId: true,
          documentVersion: {
            select: {
              contentLocation: true,
            },
          },
        },
        orderBy: {
          docId: "asc",
        },
      },
    },
  });

  return activity;
}

export async function searchPublicActivities(query: string) {
  let query_words = query.split(" ");
  let activities = await prisma.activities.findMany({
    where: {
      AND: query_words.map((qw) => ({ name: { contains: "%" + qw + "%" } })),
      isPublic: true,
      isDeleted: false,
    },
    include: {
      owner: true,
    },
  });

  return activities;
}

export async function listUserActivities(
  ownerId: number,
  loggedInUserId: number,
) {
  const notMe = ownerId !== loggedInUserId;

  const activities = await prisma.activities.findMany({
    where: { ownerId, isDeleted: false, isPublic: notMe ? true : undefined },
    include: { documents: { select: { docId: true, doenetmlVersion: true } } },
  });

  const publicActivities = activities.filter((activity) => activity.isPublic);
  const privateActivities = activities.filter(
    (activity) => !activity.isPublic && !notMe,
  );

  const user = await prisma.users.findUniqueOrThrow({
    where: { userId: ownerId },
    select: { name: true },
  });

  return {
    publicActivities,
    privateActivities,
    name: user.name,
    notMe,
  };
}

export async function listUserAssignments(
  ownerId: number,
  loggedInUserId: number,
) {
  if (ownerId !== loggedInUserId) {
    return [];
  }
  const assignments = await prisma.assignments.findMany({
    where: { ownerId, isDeleted: false },
  });

  const user = await prisma.users.findUniqueOrThrow({
    where: { userId: ownerId },
    select: { name: true },
  });

  return {
    assignments,
    name: user.name,
  };
}

export async function findOrCreateUser(email: string, name: string) {
  const user = await prisma.users.findUnique({ where: { email } });
  if (user) {
    return user.userId;
  } else {
    return createUser(email, name);
  }
}

export async function createUser(email: string, name: string) {
  const result = await prisma.users.create({ data: { email, name } });
  return result.userId;
}

export async function getUserInfo(email: string) {
  const user = await prisma.users.findUniqueOrThrow({
    where: { email },
    select: { userId: true, email: true, name: true },
  });
  return user;
}

export async function getAllDoenetmlVersions() {
  const allDoenetmlVersions = await prisma.doenetmlVersions.findMany({
    where: {
      removed: false,
    },
    orderBy: {
      displayedVersion: "asc",
    },
  });
  return allDoenetmlVersions;
}

export async function getIsAdmin(email: string) {
  const user = await prisma.users.findUnique({ where: { email } });
  let isAdmin = false;
  if (user) {
    isAdmin = user.isAdmin;
  }
  return isAdmin;
}

export async function getAllRecentPublicActivities() {
  const docs = await prisma.activities.findMany({
    where: { isPublic: true, isDeleted: false },
    orderBy: { lastEdited: "desc" },
    take: 100,
    include: {
      owner: {
        select: {
          email: true,
        },
      },
    },
  });
  return docs;
}

export async function assignActivity(activityId: number, userId: number) {
  let origActivity = await getActivity(activityId);

  if (!(origActivity.isPublic || origActivity.ownerId === userId)) {
    throw Error("Activity not found");
  }

  let documentsVersionsToAdd = await Promise.all(
    origActivity.documents.map(async (doc) => {
      // For each of the original documents, create a document version (i.e., a frozen snapshot)
      // that we will link the assignment to.
      return await createDocumentVersion(doc.docId);
    }),
  );

  let newAssignment = await prisma.assignments.create({
    data: {
      name: origActivity.name,
      activityId: origActivity.activityId,
      imagePath: origActivity.imagePath,
      ownerId: userId,
      assignmentItems: {
        create: documentsVersionsToAdd.map((docVersion) => ({
          documentVersion: {
            connect: {
              version_docId: {
                docId: docVersion.docId,
                version: docVersion.version,
              },
            },
          },
        })),
      },
    },
  });

  return newAssignment.assignmentId;
}

export async function getAssignment(assignmentId: number, ownerId: number) {
  let assignment = await prisma.assignments.findFirstOrThrow({
    where: {
      assignmentId,
      ownerId,
    },
    include: {
      assignmentItems: {
        select: {
          documentVersion: true,
        },
      },
    },
  });
  return assignment;
}
