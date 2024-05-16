import { PrismaClient } from "@prisma/client";
import { cidFromText } from "./utils/cid";

const prisma = new PrismaClient();

export async function createDocument(ownerId: number) {
  let defaultDoenetmlVersion = await prisma.doenetmlVersions.findFirstOrThrow({
    where: { default: true },
  });

  const result = await prisma.documents.create({
    data: {
      ownerId,
      contentLocation: "",
      name: "untitled doc",
      imagePath: "/activity_default.jpg",
      doenetmlVersionId: defaultDoenetmlVersion.versionId,
    },
  });
  return result.docId;
}

export async function deleteDocument(docId: number) {
  return await prisma.documents.update({
    where: { docId },
    data: { isDeleted: true },
  });
}

// TODO - access control
export async function saveDoc({
  docId,
  content,
  name,
  imagePath,
  isPublic,
  doenetmlVersionId,
}: {
  docId: number;
  content?: string;
  name?: string;
  isPublic?: boolean;
  imagePath?: string;
  doenetmlVersionId?: number;
}) {
  return await prisma.documents.update({
    where: { docId },
    data: {
      contentLocation: content,
      name,
      isPublic,
      imagePath,
      doenetmlVersionId,
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
export async function copyPublicDocumentToPortfolio(
  docId: number,
  ownerId: number,
) {
  let doc = await getDoc(docId);

  if (!doc.isPublic) {
    throw Error("Cannot copy a non-public document to portfolio");
  }

  let docVersion = await createDocumentVersion(docId, ownerId);

  // create new document with new owner and non-public,
  // ignoring the docId and lastEdited fields
  const {
    docId: _ignoreDocId,
    lastEdited: _ignoreLastEdited,
    ...docInfo
  } = doc;
  docInfo.ownerId = ownerId;
  docInfo.isPublic = false;

  const result = await prisma.documents.create({
    data: docInfo,
  });

  const newDocId = result.docId;

  await prisma.contributorHistory.create({
    data: {
      docId: newDocId,
      prevDocId: docId,
      prevDocVersion: docVersion.version,
    },
  });

  const previousHistory = await prisma.contributorHistory.findMany({
    where: {
      docId,
    },
    orderBy: { timestamp: "desc" },
  });

  await prisma.contributorHistory.createMany({
    data: previousHistory.map((hist) => ({
      docId: newDocId,
      prevDocId: hist.prevDocId,
      prevDocVersion: hist.prevDocVersion,
      timestamp: hist.timestamp,
    })),
  });

  return result.docId;
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
export async function getDocEditorData(docId: number) {
  let doc = await prisma.documents.findFirstOrThrow({
    where: { docId },
    include: { doenetmlVersion: true },
  });
  // TODO - delete, just massaging to make old client happy
  return {
    success: true,
    activity: {
      type: "activity",
      label: doc.name,
      imagePath: doc.imagePath,
      content: doc.contentLocation,
      isSinglePage: true,
      isPublic: doc.isPublic,
      version: "",
      learningOutcomes: [],
      doenetmlVersion: doc.doenetmlVersion,
    },
    courseId: null,
  };
}

// TODO - access control
export async function getDocViewerData(docId: number) {
  let doc = await prisma.documents.findFirstOrThrow({
    where: { docId },
    include: {
      owner: { select: { userId: true, email: true } },
      contributorHistory: {
        include: {
          prevDoc: {
            select: {
              document: {
                select: {
                  owner: { select: { userId: true, email: true } },
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

export async function searchPublicDocs(query: string) {
  let ret = await prisma.documents.findMany({
    where: {
      name: { contains: "%" + query + "%" },
      isPublic: true,
      isDeleted: false,
    },
  });
  let massaged = ret.map((doc) => {
    return {
      ...doc,
      firstName: "standin",
      lastName: "Name",
      type: "activity",
      course: doc.docId,
      doenetId: doc.docId,
      label: doc.name,
      content: [doc.docId],
    };
  });
  return massaged;
}

export async function listUserDocs(ownerId: number) {
  let ret = await prisma.documents.findMany({
    where: { ownerId, isDeleted: false },
  });
  // TODO - delete, just massaging to make old client happy
  let massaged = ret.map((doc) => {
    return {
      ...doc,
      doenetId: doc.docId,
      label: doc.name,
      content: [doc.docId],
    };
  });
  let publicDocs = massaged.filter((doc) => doc.isPublic);
  let privateDocs = massaged.filter((doc) => !doc.isPublic);
  //console.log(ret);
  return {
    success: true,
    publicActivities: publicDocs || [],
    privateActivities: privateDocs || [],
    fullName: "stand-in name",
    notMe: false,
  };
}

export async function findOrCreateUser(email: string) {
  const user = await prisma.users.findUnique({ where: { email } });
  if (user) {
    return user.userId;
  } else {
    return createUser(email);
  }
}

export async function createUser(email: string) {
  const result = await prisma.users.create({ data: { email } });
  return result.userId;
}

export async function getUserInfo(email: string) {
  const user = await prisma.users.findUnique({
    where: { email },
    select: { userId: true, email: true },
  });
  if (user) {
    return user;
  } else {
    return {};
  }
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
  if(user) {
    isAdmin = user.isAdmin;
  }
  return isAdmin;
}

export async function getAllRecentPublicActivites() {
  const docs = await prisma.documents.findMany({
    where: {isPublic: true, isDeleted: false},
    orderBy: {lastEdited: "desc"},
    take: 100,
    include: {
      owner: {
        select: {
          email: true
        }
      }
    }
  })
  return docs;
}