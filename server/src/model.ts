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

export async function deleteActivity(activityId: number, ownerId: number) {
  return await prisma.activities.update({
    where: { activityId, ownerId },
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

// Note: currently (June 4, 2024) unused and untested
export async function deleteDocument(docId: number, ownerId: number) {
  return await prisma.documents.update({
    where: { docId, activity: { ownerId } },
    data: { isDeleted: true },
  });
}

export async function deleteAssignment(assignmentId: number, ownerId: number) {
  return await prisma.assignments.update({
    where: { assignmentId, ownerId },
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
  ownerId,
}: {
  activityId: number;
  name?: string;
  imagePath?: string;
  isPublic?: boolean;
  ownerId: number;
}) {
  return await prisma.activities.update({
    where: { activityId, ownerId },
    data: {
      name,
      imagePath,
      isPublic,
    },
  });
}

export async function updateDoc({
  docId,
  content,
  name,
  doenetmlVersionId,
  ownerId,
}: {
  docId: number;
  content?: string;
  name?: string;
  doenetmlVersionId?: number;
  ownerId: number;
}) {
  return await prisma.documents.update({
    where: { docId, activity: { ownerId } },
    data: {
      content: content,
      name,
      doenetmlVersionId,
      lastEdited: DateTime.now().toJSDate(),
    },
  });
}

export async function updateAssignment({
  assignmentId,
  name,
  imagePath,
  ownerId,
}: {
  assignmentId: number;
  name?: string;
  imagePath?: string;
  ownerId: number;
}) {
  return await prisma.assignments.update({
    where: { assignmentId, ownerId },
    data: {
      name,
      imagePath,
    },
  });
}

// Note: getActivity does not currently incorporate access control,
// by relies on calling functions to determine access
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

// Note: getDoc does not currently incorporate access control,
// by relies on calling functions to determine access
export async function getDoc(docId: number) {
  return await prisma.documents.findUniqueOrThrow({
    where: { docId, isDeleted: false },
  });
}

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

// Note: createDocumentVersion does not currently incorporate access control,
// by relies on calling functions to determine access
async function createDocumentVersion(docId: number): Promise<{
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

export async function getActivityEditorData(
  activityId: number,
  ownerId: number,
) {
  // TODO: add pagination or a hard limit in the number of documents one can add to an activity
  let activity = await prisma.activities.findUniqueOrThrow({
    where: { activityId, isDeleted: false, ownerId },
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

// TODO: generalize this to multi-document activities
export async function getActivityViewerData(
  activityId: number,
  userId: number,
) {
  const activity = await prisma.activities.findUniqueOrThrow({
    where: {
      activityId,
      isDeleted: false,
      OR: [{ ownerId: userId }, { isPublic: true }],
    },
    include: {
      owner: { select: { userId: true, email: true, name: true } },
      documents: {
        where: { isDeleted: false },
        select: {
          docId: true,
          content: true,
          doenetmlVersion: {
            select: { fullVersion: true },
          },
        },
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

export async function getAssignmentEditorData(
  assignmentId: number,
  ownerId: number,
) {
  // TODO: add pagination or a hard limit in the number of documents one can add to an activity
  let assignment = await prisma.assignments.findUniqueOrThrow({
    where: { assignmentId, isDeleted: false, ownerId },
    include: {
      assignmentDocuments: {
        select: {
          docId: true,
          docVersionId: true,
          documentVersion: {
            select: {
              content: true,
              doenetmlVersion: { select: { fullVersion: true } },
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
                doenetmlVersion: { select: { fullVersion: true } },
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

export async function listUserAssignments(userId: number) {
  const assignments = await prisma.assignments.findMany({
    where: {
      isDeleted: false,
      OR: [{ ownerId: userId }, { assignmentScores: { some: { userId } } }],
    },
  });

  const user = await prisma.users.findUniqueOrThrow({
    where: { userId },
    select: { userId: true, name: true },
  });

  return {
    assignments,
    user,
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

export async function getIsAdmin(userId: number) {
  const user = await prisma.users.findUnique({ where: { userId } });
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
          name: true,
        },
      },
    },
  });
  return docs;
}

// TODO - access control
export async function addPromotedContentGroup(groupName: string) {
  try {
    await prisma.promotedContentGroups.create({
      data: {
        groupName,
        sortOrder: "a",
      },
    });
    return { success: true };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (err.code === "P2002") {
        return {
          success: false,
          message: "A group with that name already exists.",
        };
      }
    }
    throw err;
  }
}

// TODO - access control
export async function updatePromotedContentGroup(
  groupName: string,
  newGroupName: string,
  homepage: boolean,
  currentlyFeatured: boolean,
) {
  try {
    await prisma.promotedContentGroups.update({
      where: {
        groupName,
      },
      data: {
        groupName: newGroupName,
        homepage,
        currentlyFeatured,
      },
    });
    return { success: true };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (err.code === "P2002") {
        return {
          success: false,
          message: "A group with that name already exists.",
        };
      }
    }
    throw err;
  }
}

// TODO - access control
export async function loadPromotedContentGroups() {
  let groups = await prisma.promotedContentGroups.findMany({
    select: {
      promotedGroupId: true,
      groupName: true,
      currentlyFeatured: true,
      homepage: true,
      _count: {
        //is this used on client?
        select: {
          promotedContent: true,
        },
      },
    },
  });

  const reformatted_groups = groups.map((group) => {
    return {
      promotedGroupId: group.promotedGroupId,
      groupName: group.groupName,
      currentyFeatured: group.currentlyFeatured,
      homepage: group.homepage,
      itemCount: group._count.promotedContent,
    };
  });

  return reformatted_groups;
}

// TODO - access control
export async function addPromotedContent(groupId: number, activityId: number) {
  const activity = await prisma.activities.findUnique({
    where: {
      activityId,
      isPublic: true,
    },
    select: {
      // not using this, we just need to select one field
      activityId: true,
    },
  });
  if (!activity) {
    return {
      success: false,
      message: "This activity does not exist or is not public.",
    };
  }

  try {
    await prisma.promotedContent.create({
      data: {
        activityId,
        promotedGroupId: groupId,
        sortOrder: "1",
      },
    });
    return { success: true };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (err.code === "P2002") {
        return {
          success: false,
          message: "This activity is already in that group.",
        };
      } else if (err.code === "P2003") {
        return {
          success: false,
          message: "That group does not exist.",
        };
      }
    }
    throw err;
  }
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
              docId_version: {
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
  ownerId: number,
) {
  let classCode = (
    await prisma.assignments.findUniqueOrThrow({
      where: { assignmentId, ownerId },
      select: { classCode: true },
    })
  ).classCode;

  if (!classCode) {
    classCode = generateClassCode();
  }

  const codeValidUntil = closeAt.toJSDate();

  await prisma.assignments.update({
    where: { assignmentId, ownerId },
    data: {
      classCode,
      codeValidUntil,
    },
  });
  return { classCode, codeValidUntil };
}

export async function closeAssignmentWithCode(
  assignmentId: number,
  ownerId: number,
) {
  await prisma.assignments.update({
    where: { assignmentId, ownerId },
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

// TODO: do we still save score and state if assignment isn't open?
// If not, how do we communicate that fact
export async function saveScoreAndState({
  assignmentId,
  docId,
  docVersionId,
  userId,
  score,
  onSubmission,
  state,
}: {
  assignmentId: number;
  docId: number;
  docVersionId: number;
  userId: number;
  score: number;
  onSubmission: boolean;
  state: string;
}) {
  // make sure have an assignmentScores record
  // so that can satisfy foreign key constraints on documentState
  await prisma.assignmentScores.upsert({
    where: { assignmentId_userId: { assignmentId, userId } },
    update: {},
    create: { assignmentId, userId },
  });

  const stateWithMaxScore = await prisma.documentState.findUnique({
    where: {
      assignmentId_docId_docVersionId_userId_hasMaxScore: {
        assignmentId,
        docId,
        docVersionId,
        userId,
        hasMaxScore: true,
      },
    },
    select: { score: true },
  });

  const hasStrictMaxScore =
    stateWithMaxScore === null || score > stateWithMaxScore.score;

  // Use non-strict inequality for hasMaxScore
  // so that will update the hasMaxScore state to the latest
  // even if the current score matched the old max score.
  // Count a non-strict max only if it was saved on submitting an answer
  // so that the max score state is less likely to have unsubmitted results.
  const hasMaxScore =
    hasStrictMaxScore || (score === stateWithMaxScore.score && onSubmission);

  if (hasMaxScore) {
    // if there is a non-latest document state record,
    // delete it as latest is now maxScore as well
    try {
      await prisma.documentState.delete({
        where: {
          assignmentId_docId_docVersionId_userId_isLatest: {
            assignmentId,
            docId,
            docVersionId,
            userId,
            isLatest: false,
          },
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2001") {
          // if error was that record doesn't exist, then ignore it
        }
      } else {
        throw e;
      }
    }
  } else {
    // since the latest is not with max score,
    // mark the record with hasMaxScore as not the latest
    try {
      await prisma.documentState.update({
        where: {
          assignmentId_docId_docVersionId_userId_hasMaxScore: {
            assignmentId,
            docId,
            docVersionId,
            userId,
            hasMaxScore: true,
          },
        },
        data: {
          isLatest: false,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2001") {
          // if error was that record doesn't exist, then ignore it
        }
      } else {
        throw e;
      }
    }
  }

  // add/update the latest document state and maxScore
  await prisma.documentState.upsert({
    where: {
      assignmentId_docId_docVersionId_userId_isLatest: {
        assignmentId,
        docId,
        docVersionId,
        userId,
        isLatest: true,
      },
    },
    update: {
      score,
      state,
      hasMaxScore,
    },
    create: {
      assignmentId,
      docId,
      docVersionId,
      userId,
      isLatest: true,
      hasMaxScore,
      score,
      state,
    },
  });

  // use strict inequality for hasStrictMaxScore
  // so that we don't update the actual score tables
  // unless the score increased

  if (hasStrictMaxScore) {
    // recalculate the score using the new maximum scores from each document
    const documentStates = await prisma.documentState.findMany({
      where: {
        assignmentScore: {
          assignmentId,
          userId,
        },
        hasMaxScore: true,
      },
      select: {
        score: true,
      },
    });
    const documentMaxScores = documentStates.map((x) => x.score);

    // since some document might not have a score recorded yet,
    // count the number of actual documents for the assignment
    const assignmentDocumentsAggregation =
      await prisma.assignmentDocuments.aggregate({
        _count: {
          docId: true,
        },
        where: {
          assignmentId,
        },
      });
    const numDocuments = assignmentDocumentsAggregation._count.docId;

    const averageScore =
      documentMaxScores.reduce((a, c) => a + c) / numDocuments;

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
  withMaxScore,
}: {
  assignmentId: number;
  docId: number;
  docVersionId: number;
  requestedUserId: number;
  userId: number;
  withMaxScore: boolean;
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

  let documentState;

  if (withMaxScore) {
    documentState = await prisma.documentState.findUniqueOrThrow({
      where: {
        assignmentId_docId_docVersionId_userId_hasMaxScore: {
          assignmentId,
          docId,
          docVersionId,
          userId: requestedUserId,
          hasMaxScore: true,
        },
      },
      select: { state: true },
    });
  } else {
    documentState = await prisma.documentState.findUniqueOrThrow({
      where: {
        assignmentId_docId_docVersionId_userId_isLatest: {
          assignmentId,
          docId,
          docVersionId,
          userId: requestedUserId,
          isLatest: true,
        },
      },
      select: { state: true },
    });
  }
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

export async function getAssignmentStudentData({
  assignmentId,
  ownerId,
  userId,
}: {
  assignmentId: number;
  ownerId: number;
  userId: number;
}) {
  const assignmentData = await prisma.assignmentScores.findUniqueOrThrow({
    where: {
      assignmentId_userId: { assignmentId, userId },
      assignment: { ownerId, isDeleted: false },
    },
    include: {
      assignment: {
        select: {
          name: true,
          assignmentDocuments: {
            select: {
              docId: true,
              docVersionId: true,
              documentVersion: {
                select: {
                  content: true,
                  doenetmlVersion: { select: { fullVersion: true } },
                },
              },
            },
          },
        },
      },
      user: { select: { name: true } },
    },
  });

  const documentScores = await prisma.documentState.findMany({
    where: { assignmentId, userId },
    select: {
      docId: true,
      docVersionId: true,
      hasMaxScore: true,
      score: true,
    },
    orderBy: {
      score: "asc",
    },
  });

  return { ...assignmentData, documentScores };
}

export async function getAllAssignmentScores({ ownerId }: { ownerId: number }) {
  const assignments = await prisma.assignments.findMany({
    where: {
      ownerId,
      isDeleted: false,
    },
    select: {
      assignmentId: true,
      name: true,
      assignmentScores: {
        select: {
          assignmentId: true,
          userId: true,
          score: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return assignments;
}

export async function getStudentData({ userId }: { userId: number }) {
  const userData = await prisma.users.findUniqueOrThrow({
    where: {
      userId,
    },
    select: {
      userId: true,
      name: true,
      assignmentScores: {
        where: {
          assignment: {
            isDeleted: false,
          },
        },
        select: {
          assignmentId: true,
          score: true,
          assignment: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return userData;
}

export async function getAssignmentContent({
  assignmentId,
  ownerId,
}: {
  assignmentId: number;
  ownerId: number;
}) {
  const assignmentData = await prisma.assignmentDocuments.findMany({
    where: {
      assignmentId,
      assignment: { ownerId, isDeleted: false },
    },

    select: {
      docId: true,
      docVersionId: true,
      documentVersion: {
        select: {
          content: true,
          doenetmlVersion: { select: { fullVersion: true } },
        },
      },
    },
  });

  return assignmentData;
}

// TODO: do we still record submitted event if an assignment isn't open?
// If so, do we mark it special to indicate that assignment wasn't open at the time?
export async function recordSubmittedEvent({
  assignmentId,
  docId,
  docVersionId,
  userId,
  answerId,
  response,
  answerNumber,
  itemNumber,
  creditAchieved,
  itemCreditAchieved,
  documentCreditAchieved,
}: {
  assignmentId: number;
  docId: number;
  docVersionId: number;
  userId: number;
  answerId: string;
  response: string;
  answerNumber?: number;
  itemNumber: number;
  creditAchieved: number;
  itemCreditAchieved: number;
  documentCreditAchieved: number;
}) {
  await prisma.documentSubmittedResponses.create({
    data: {
      assignmentId,
      docVersionId,
      docId,
      userId,
      answerId,
      response,
      answerNumber,
      itemNumber,
      creditAchieved,
      itemCreditAchieved,
      documentCreditAchieved,
    },
  });
}

export async function getAnswersThatHaveSubmittedResponses({
  assignmentId,
  ownerId,
}: {
  assignmentId: number;
  ownerId: number;
}) {
  // Using raw query as it seems prisma does not support distinct in count.
  // https://github.com/prisma/prisma/issues/4228

  let submittedResponses = await prisma.$queryRaw<
    {
      docId: number;
      docVersionId: number;
      answerId: string;
      answerNumber: number | null;
      count: number;
    }[]
  >(Prisma.sql`
    SELECT "docId", "docVersionId", "answerId", "answerNumber", 
    COUNT("userId") as "count", AVG("maxCredit") as "averageCredit"
    FROM (
      SELECT "assignmentId", "docId", "docVersionId", "answerId", "answerNumber", "userId", MAX("creditAchieved") as "maxCredit"
      FROM "documentSubmittedResponses"
      WHERE "assignmentId" = ${assignmentId}
      GROUP BY "assignmentId", "docId", "docVersionId", "answerId", "answerNumber", "userId" 
    ) as "dsr"
    INNER JOIN "assignments" on "dsr"."assignmentId" = "assignments"."assignmentId" 
    WHERE "assignments"."assignmentId"=${assignmentId} and "ownerId" = ${ownerId}
    GROUP BY "docId", "docVersionId", "answerId", "answerNumber"
    ORDER BY "answerNumber"
    `);

  // For some reason, the query returns a BigInt for count, which TypeScript doesn't know how to serialize,
  // so we convert into a Number.
  submittedResponses = submittedResponses.map((row) => {
    row.count = Number(row.count);
    return row;
  });

  return submittedResponses;
}

export async function getDocumentSubmittedResponses({
  assignmentId,
  docId,
  docVersionId,
  ownerId,
  answerId,
}: {
  assignmentId: number;
  docId: number;
  docVersionId: number;
  ownerId: number;
  answerId: string;
}) {
  // TODO: gave up figuring out to do find the best response and the latest response in a SQL query,
  // so just create in via JS based on this one query.
  // Can we come up with a better solution?
  let rawResponses = await prisma.$queryRaw<
    {
      userId: number;
      userName: string;
      response: string;
      creditAchieved: number;
      submittedAt: DateTime;
      maxCredit: number;
      numResponses: number;
    }[]
  >(Prisma.sql`
select "dsr"."userId", "users"."name" AS "userName", "response", "creditAchieved", "submittedAt",
    	MAX("creditAchieved") over (partition by "dsr"."userId") as "maxCredit",
    	COUNT("creditAchieved") over (partition by "dsr"."userId") as "numResponses"
    	from "documentSubmittedResponses" as dsr
      INNER JOIN "assignments" on "dsr"."assignmentId" = "assignments"."assignmentId" 
      INNER JOIN "users" on "dsr"."userId" = "users"."userId" 
      WHERE "assignments"."assignmentId"=${assignmentId} and "ownerId" = ${ownerId}
    	and "docId" = ${docId} and "docVersionId" = ${docVersionId} and "answerId" = ${answerId}
    	order by "dsr"."userId" asc, "submittedAt" desc
  `);

  let responses = [];
  let newResponse;
  let lastUserId = 0;

  for (let respObj of rawResponses) {
    if (respObj.userId > lastUserId) {
      lastUserId = respObj.userId;
      if (newResponse) {
        responses.push(newResponse);
      }
      newResponse = {
        userId: respObj.userId,
        userName: respObj.userName,
        latestResponse: respObj.response,
        latestCreditAchieved: respObj.creditAchieved,
        bestCreditAchieved: respObj.maxCredit,
        numResponses: Number(respObj.numResponses),
        bestResponse: "",
      };
    }
    if (
      newResponse?.bestResponse === "" &&
      respObj.creditAchieved === newResponse.bestCreditAchieved
    ) {
      newResponse.bestResponse = respObj.response;
    }
  }

  if (newResponse) {
    responses.push(newResponse);
  }

  return responses;
}

export async function getDocumentSubmittedResponseHistory({
  assignmentId,
  docId,
  docVersionId,
  ownerId,
  answerId,
  userId,
}: {
  assignmentId: number;
  docId: number;
  docVersionId: number;
  ownerId: number;
  answerId: string;
  userId: number;
}) {
  // for each combination of ["assignmentId", "docId", "docVersionId", "answerId", "userId"],
  // find the latest submitted response
  let submittedResponses = await prisma.documentSubmittedResponses.findMany({
    where: {
      assignmentId,
      docVersionId,
      docId,
      answerId,
      userId,
      assignmentDocument: {
        assignment: {
          ownerId,
        },
      },
    },
    select: {
      user: { select: { userId: true, name: true } },
      response: true,
      creditAchieved: true,
      submittedAt: true,
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  return submittedResponses;
}
