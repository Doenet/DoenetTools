import { PrismaClient, Prisma } from "@prisma/client";
import { cidFromText } from "./utils/cid";
import { DateTime } from "luxon";

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
            content: "",
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
      content: content,
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
  return await prisma.activities.findUniqueOrThrow({
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
  return await prisma.documents.findUniqueOrThrow({
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
  content: string | null;
  createdAt: Date | null;
  doenetmlVersionId: number;
}> {
  const doc = await prisma.documents.findUniqueOrThrow({
    where: { docId, isDeleted: false },
    include: {
      activity: { select: { name: true } },
    },
  });

  // TODO: cid should really include the doenetmlVersion
  const cid = await cidFromText(doc.content || "");

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
        content: doc.content,
      },
    });
  }

  return docVersion;
}

// TODO - access control
export async function getActivityEditorData(activityId: number) {
  // TODO: add pagination or a hard limit in the number of documents one can add to an activity
  let activity = await prisma.activities.findUniqueOrThrow({
    where: { activityId, isDeleted: false },
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
  const activity = await prisma.activities.findUniqueOrThrow({
    where: { activityId, isDeleted: false },
    include: {
      owner: { select: { userId: true, email: true, name: true } },
      documents: {
        where: { isDeleted: false },
        select: { docId: true, content: true },
      },
    },
  });
  const docId = activity.documents[0].docId;

  let doc = await prisma.documents.findUniqueOrThrow({
    where: { docId, isDeleted: false },
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
  let assignment = await prisma.assignments.findUniqueOrThrow({
    where: { assignmentId, isDeleted: false },
    include: {
      assignmentDocuments: {
        select: {
          docId: true,
          docVersionId: true,
          documentVersion: {
            select: {
              content: true,
            },
          },
        },
        orderBy: {
          docId: "asc",
        },
      },
    },
  });

  let stillOpen = false;
  if (assignment.codeValidUntil) {
    const endDate = DateTime.fromJSDate(assignment.codeValidUntil);
    stillOpen = DateTime.now() <= endDate;
  }

  return { ...assignment, stillOpen };
}

export async function getAssignmentDataFromCode(
  code: string,
  signedIn: boolean,
) {
  let assignment;

  try {
    assignment = await prisma.assignments.findFirstOrThrow({
      where: {
        classCode: code,
        codeValidUntil: {
          gte: DateTime.now().toISO(), // TODO - confirm this works with timezone stuff
        },
        isDeleted: false,
      },
      include: {
        assignmentDocuments: {
          select: {
            docId: true,
            docVersionId: true,
            documentVersion: {
              select: {
                content: true,
              },
            },
          },
          orderBy: {
            docId: "asc",
          },
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        assignmentFound: false,
        newAnonymousUser: null,
        assignment: null,
      };
    } else {
      throw e;
    }
  }

  let newAnonymousUser = signedIn ? null : await createAnonymousUser();

  return { assignmentFound: true, newAnonymousUser, assignment };
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
    return user;
  } else {
    return createUser(email, name);
  }
}

export async function createUser(email: string, name: string) {
  const result = await prisma.users.create({ data: { email, name } });
  return result;
}

export async function createAnonymousUser() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const random_number = array[0];
  const name = ``;
  const email = `anonymous${random_number}@example.com`;
  const result = await prisma.users.create({
    data: { email, name, anonymous: true },
  });

  return result;
}

export async function getUserInfo(email: string) {
  const user = await prisma.users.findUniqueOrThrow({
    where: { email },
    select: { userId: true, email: true, name: true, anonymous: true },
  });
  return user;
}

export async function updateUser({
  userId,
  name,
}: {
  userId: number;
  name: string;
}) {
  const user = await prisma.users.update({
    where: { userId },
    data: { name },
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
      assignmentDocuments: {
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

function generateClassCode() {
  return ("00000" + Math.floor(Math.random() * 1000000)).slice(-6);
}

export async function openAssignmentWithCode(
  assignmentId: number,
  closeAt: DateTime,
) {
  let classCode = (
    await prisma.assignments.findUniqueOrThrow({
      where: { assignmentId },
      select: { classCode: true },
    })
  ).classCode;

  if (!classCode) {
    classCode = generateClassCode();
  }

  const codeValidUntil = closeAt.toJSDate();

  await prisma.assignments.update({
    where: { assignmentId },
    data: {
      classCode,
      codeValidUntil,
    },
  });
  return { classCode, codeValidUntil };
}

export async function closeAssignmentWithCode(assignmentId: number) {
  await prisma.assignments.update({
    where: { assignmentId },
    data: {
      codeValidUntil: null,
    },
  });
}

export async function getAssignment(assignmentId: number, ownerId: number) {
  let assignment = await prisma.assignments.findUniqueOrThrow({
    where: {
      assignmentId,
      ownerId,
      isDeleted: false,
    },
    include: {
      assignmentDocuments: {
        select: {
          documentVersion: true,
        },
      },
    },
  });
  return assignment;
}

export async function saveScoreAndState({
  assignmentId,
  docId,
  docVersionId,
  userId,
  score,
  state,
}: {
  assignmentId: number;
  docId: number;
  docVersionId: number;
  userId: number;
  score: number;
  state: string;
}) {
  // make sure have an assignmentScores record
  const assignmentScores = await prisma.assignmentScores.upsert({
    where: { assignmentId_userId: { assignmentId, userId } },
    update: {},
    create: { assignmentId, userId },
  });

  // record score and state for this document
  await prisma.documentState.upsert({
    where: {
      assignmentId_docVersionId_docId_userId: {
        assignmentId,
        docId,
        docVersionId,
        userId,
      },
    },
    update: {
      score,
      state,
    },
    create: {
      assignmentId,
      docId,
      docVersionId,
      userId,
      score,
      state,
    },
  });

  const assignmentScore = await prisma.assignmentScores.findUniqueOrThrow({
    where: {
      assignmentId_userId: {
        assignmentId,
        userId,
      },
    },
    include: {
      documentState: true,
    },
  });

  // for now, make score be the maximum of the current score and the weighted averages of the scores from the documents

  const assignmentDocuments = await prisma.assignments.findUniqueOrThrow({
    where: { assignmentId },
    select: { assignmentDocuments: { select: { docId: true } } },
  });
  const numDocuments = assignmentDocuments.assignmentDocuments.length;

  const currentScore = assignmentScore.score;
  const documentScores = assignmentScore.documentState.map((x) => x.score);
  const averageScore = documentScores.reduce((a, c) => a + c) / numDocuments;

  if (averageScore > currentScore) {
    await prisma.assignmentScores.update({
      where: { assignmentId_userId: { assignmentId, userId } },
      data: {
        score: averageScore,
      },
    });
  }
}

export async function loadState({
  assignmentId,
  docId,
  docVersionId,
  requestedUserId,
  userId,
}: {
  assignmentId: number;
  docId: number;
  docVersionId: number;
  requestedUserId: number;
  userId: number;
}) {
  if (requestedUserId !== userId) {
    // If user isn't the requested user, then user is allowed to load requested users state
    // only if they are the owner of the assignment.
    // If not user is not owner, then it will throw an error.
    await prisma.assignments.findUniqueOrThrow({
      where: {
        assignmentId,
        ownerId: userId,
      },
    });
  }

  const documentState = await prisma.documentState.findUniqueOrThrow({
    where: {
      assignmentId_docVersionId_docId_userId: {
        assignmentId,
        docId,
        docVersionId,
        userId: requestedUserId,
      },
    },
    select: { state: true },
  });

  return documentState.state;
}

export async function getAssignmentScoreData({
  assignmentId,
  ownerId,
}: {
  assignmentId: number;
  ownerId: number;
}) {
  const assignment = await prisma.assignments.findUniqueOrThrow({
    where: { assignmentId, ownerId, isDeleted: false },
    select: {
      name: true,
      assignmentScores: {
        select: {
          user: {
            select: { name: true, userId: true },
          },
          score: true,
        },
        orderBy: { user: { name: "asc" } },
      },
    },
  });

  return assignment;
}
