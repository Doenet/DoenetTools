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
  return activity.activityId;
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
  ownerId: number,
) {
  let origActivity = await getActivity(origActivityId);

  if (!origActivity.isPublic) {
    throw Error("Cannot copy a non-public activity to portfolio");
  }

  let newActivity = await prisma.activities.create({
    data: {
      name: origActivity.name,
      imagePath: origActivity.imagePath,
      ownerId,
    },
  });

  let documentsToAdd = await Promise.all(
    origActivity.documents.map(async (doc) => {
      // For each of the original documents, create a document version (i.e., a frozen snapshot)
      // that we will link to when creating contributor history, below.
      let originalDocVersion = await createDocumentVersion(doc.docId, ownerId);

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
export async function createDocumentVersion(
  docId: number,
  ownerId: number,
): Promise<{
  version: number;
  docId: number;
  cid: string | null;
  contentLocation: string | null;
  createdAt: Date | null;
  doenetmlVersionId: number;
}> {
  const doc = await getDoc(docId);

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
        doenetmlVersionId: doc.doenetmlVersionId,
        contentLocation: doc.contentLocation,
      },
    });
  }

  return docVersion;
}

// TODO - access control
export async function getDocEditorData(activityId: number) {
  let activity = await prisma.activities.findFirstOrThrow({
    where: { activityId },
    include: {
      documents: {
        include: {
          doenetmlVersion: true,
        },
      },
    },
  });

  return activity;
}

// TODO - access control
export async function getDocViewerData(docId: number) {
  let doc = await prisma.documents.findFirstOrThrow({
    where: { docId },
    include: {
      activity: {
        select: {
          owner: { select: { userId: true, email: true } },
        },
      },
      contributorHistory: {
        include: {
          prevDoc: {
            select: {
              document: {
                select: {
                  activity: {
                    select: {
                      owner: { select: { userId: true, email: true } },
                    },
                  },
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return doc;
}

export async function searchPublicActivities(query: string) {
  let activities = await prisma.activities.findMany({
    where: {
      name: { contains: "%" + query + "%" },
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
  let notMe = ownerId !== loggedInUserId;

  let activities = await prisma.activities.findMany({
    where: { ownerId, isDeleted: false, isPublic: true },
  });

  let publicActivities = activities.filter((activity) => activity.isPublic);
  let privateActivities = activities.filter(
    (activity) => !activity.isPublic && !notMe,
  );

  let user = await prisma.users.findUniqueOrThrow({
    where: { userId: ownerId },
    select: { name: true },
  });

  return {
    success: true,
    publicActivities: publicActivities,
    privateActivities: privateActivities,
    fullName: user.name,
    notMe,
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
