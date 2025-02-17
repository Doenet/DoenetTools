export async function assignActivity(
  activityId: Uint8Array,
  userId: Uint8Array,
) {
  const origActivity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      ownerId: userId,
      isAssigned: false,
    },
    include: {
      documents: {
        where: { isDeleted: false },
      },
    },
  });

  await prisma.content.update({
    where: { id: activityId },
    data: {
      isAssigned: true,
    },
  });

  for (const doc of origActivity.documents) {
    const docVersion = await createDocumentVersion(doc.id);
    await prisma.documents.update({
      where: { id: doc.id },
      data: { assignedVersionNum: docVersion.versionNum },
    });
  }
}

function generateClassCode() {
  const array = new Uint32Array(1);
  getRandomValues(array);
  return array[0].toString().slice(-6);
}

export async function openAssignmentWithCode(
  activityId: Uint8Array,
  closeAt: DateTime,
  loggedInUserId: Uint8Array,
) {
  const initialActivity = await prisma.content.findUniqueOrThrow({
    where: { id: activityId, ownerId: loggedInUserId, isFolder: false },
    select: { classCode: true, isAssigned: true },
  });

  if (!initialActivity.isAssigned) {
    await assignActivity(activityId, loggedInUserId);
  }

  let classCode = initialActivity.classCode;

  if (!classCode) {
    classCode = generateClassCode();
  }

  const codeValidUntil = closeAt.toJSDate();

  await prisma.content.update({
    where: { id: activityId },
    data: {
      classCode,
      codeValidUntil,
    },
  });
  return { classCode, codeValidUntil };
}

export async function updateAssignmentSettings(
  activityId: Uint8Array,
  closeAt: DateTime,
  loggedInUserId: Uint8Array,
) {
  const codeValidUntil = closeAt.toJSDate();

  await prisma.content.update({
    where: {
      id: activityId,
      ownerId: loggedInUserId,
      isFolder: false,
      isAssigned: true,
    },
    data: {
      codeValidUntil,
    },
  });

  return {};
}

export async function closeAssignmentWithCode(
  activityId: Uint8Array,
  userId: Uint8Array,
) {
  await prisma.content.update({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      ownerId: userId,
      isAssigned: true,
    },
    data: {
      codeValidUntil: null,
    },
  });

  // attempt to unassign activity, which will succeed
  // only if there is no student data
  try {
    await unassignActivity(activityId, userId);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      // ignore inability to unassign due to presence of student data
    } else {
      throw e;
    }
  }
}

export async function unassignActivity(
  activityId: Uint8Array,
  userId: Uint8Array,
) {
  await prisma.content.update({
    where: {
      id: activityId,
      isDeleted: false,
      isFolder: false,
      ownerId: userId,
      isAssigned: true,
      assignmentScores: { none: { activityId } },
    },
    data: {
      isAssigned: false,
    },
  });

  await prisma.documents.updateMany({
    where: { activityId },
    data: { assignedVersionNum: null },
  });
}

// Note: this function returns `sortIndex` (which is a bigint)
// so the data shouldn't be sent unchanged to the response
export async function getAssignment(
  activityId: Uint8Array,
  ownerId: Uint8Array,
) {
  const assignment = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      ownerId,
      isDeleted: false,
      isFolder: false,
      isAssigned: true,
    },
    include: {
      documents: {
        select: {
          assignedVersion: true,
        },
      },
    },
  });
  return assignment;
}

export async function getAssignmentScoreData({
  activityId,
  ownerId,
}: {
  activityId: Uint8Array;
  ownerId: Uint8Array;
}) {
  const assignment: {
    name: string;
    assignmentScores: {
      score: number;
      user: UserInfo;
    }[];
  } = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      ownerId,
      isDeleted: false,
      isAssigned: true,
      isFolder: false,
    },
    select: {
      name: true,
      assignmentScores: {
        select: {
          user: {
            select: {
              firstNames: true,
              lastNames: true,
              userId: true,
              email: true,
            },
          },
          score: true,
        },
        orderBy: [
          { user: { lastNames: "asc" } },
          { user: { firstNames: "asc" } },
        ],
      },
    },
  });

  return assignment;
}

export async function getAssignmentStudentData({
  activityId,
  loggedInUserId,
  studentId,
}: {
  activityId: Uint8Array;
  loggedInUserId: Uint8Array;
  studentId: Uint8Array;
}) {
  const assignmentData = await prisma.assignmentScores.findUniqueOrThrow({
    where: {
      activityId_userId: { activityId, userId: studentId },
      activity: {
        // allow access if logged in user is the student or the owner
        ownerId: isEqualUUID(studentId, loggedInUserId)
          ? undefined
          : loggedInUserId,
        isDeleted: false,
        isFolder: false,
        isAssigned: true,
      },
    },
    select: {
      score: true,
      activity: {
        select: {
          id: true,
          name: true,
          documents: {
            select: {
              assignedVersion: {
                select: {
                  docId: true,
                  versionNum: true,
                  source: true,
                  doenetmlVersion: { select: { fullVersion: true } },
                },
              },
            },
          },
        },
      },
      user: {
        select: {
          firstNames: true,
          lastNames: true,
          userId: true,
          email: true,
        },
      },
    },
  });

  const documentScores = await prisma.documentState.findMany({
    where: { activityId, userId: studentId },
    select: {
      docId: true,
      docVersionNum: true,
      hasMaxScore: true,
      score: true,
    },
    orderBy: {
      score: "asc",
    },
  });

  return { ...assignmentData, documentScores };
}

/**
 * Recurses through all subfolders of `parentId`
 * to return all content of it and its subfolders.
 * Results are ordered via a `sortIndex` and a depth-first search,
 * i.e., the contents of a folder immediately follow the folder itself,
 * and items within a folder are ordered by `sortIndex`
 *
 * @returns A Promise that resolves to an object with
 * - orderedActivities: the ordered list of all activities in the folder (and subfolders)
 * - assignmentScores: the scores that student achieved on those activities
 */
export async function getAllAssignmentScores({
  ownerId,
  parentId,
}: {
  ownerId: Uint8Array;
  parentId: Uint8Array | null;
}) {
  const orderedActivities = await prisma.$queryRaw<
    {
      id: Uint8Array;
      name: string;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, isFolder, path) AS (
      SELECT id, parentId, isFolder, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE ${parentId === null ? Prisma.sql`parentId IS NULL` : Prisma.sql`parentId = ${parentId}`}
      AND ownerId = ${ownerId}
      AND (isAssigned = true or isFolder = true) AND isDeleted = false
      UNION ALL
      SELECT c.id, c.parentId, c.isFolder, CONCAT(ft.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ft
      ON c.parentId = ft.id
      WHERE (c.isAssigned = true or c.isFolder = true) AND c.isDeleted = false
    )
    
    SELECT c.id, c.name FROM content AS c
    INNER JOIN content_tree AS ct
    ON ct.id = c.id
    WHERE ct.isFolder = FALSE ORDER BY path
  `);

  let folder: {
    id: Uint8Array;
    name: string;
  } | null = null;

  if (parentId !== null) {
    folder = await prisma.content.findUniqueOrThrow({
      where: { id: parentId, ownerId, isDeleted: false, isFolder: true },
      select: { id: true, name: true },
    });
  }

  const assignmentScores = await prisma.assignmentScores.findMany({
    where: {
      activityId: { in: orderedActivities.map((a) => a.id) },
    },
    select: {
      activityId: true,
      score: true,
      user: {
        select: {
          firstNames: true,
          lastNames: true,
          userId: true,
          email: true,
        },
      },
    },
  });

  return { orderedActivities, assignmentScores, folder };
}

/**
 * Recurses through all subfolders of `parentId`
 * to return all content of it and its subfolders.
 * Results are ordered via a `sortIndex` and a depth-first search,
 * i.e., the contents of a folder immediately follow the folder itself,
 * and items within a folder are ordered by `sortIndex`
 *
 * @returns A Promise that resolves to an object with
 * - userData: information on the student
 * - orderedActivities: the ordered list of all activities in the folder (and subfolders)
 *   along with the student's score, if it exists
 */
export async function getStudentData({
  userId,
  ownerId,
  parentId,
}: {
  userId: Uint8Array;
  ownerId: Uint8Array;
  parentId: Uint8Array | null;
}) {
  const userData = await prisma.users.findUniqueOrThrow({
    where: {
      userId,
    },
    select: {
      userId: true,
      firstNames: true,
      lastNames: true,
      email: true,
    },
  });

  const orderedActivityScores = await prisma.$queryRaw<
    {
      activityId: Uint8Array;
      activityName: string;
      score: number | null;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, isFolder, path) AS (
      SELECT id, parentId, isFolder, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE ${parentId === null ? Prisma.sql`parentId IS NULL` : Prisma.sql`parentId = ${parentId}`}
      AND ownerId = ${ownerId}
      AND (isAssigned = true or isFolder = true) AND isDeleted = false
      UNION ALL
      SELECT c.id, c.parentId, c.isFolder, CONCAT(ft.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ft
      ON c.parentId = ft.id
      WHERE (c.isAssigned = true or c.isFolder = true) AND c.isDeleted = false
    )
    
    SELECT c.id AS activityId, c.name AS activityName, s.score FROM content AS c
    INNER JOIN content_tree AS ct
    ON ct.id = c.id
    LEFT JOIN (
        SELECT * FROM assignmentScores WHERE userId=${userId}
        ) as s
    ON s.activityId  = c.id 
    WHERE ct.isFolder = FALSE ORDER BY path
  `);

  let folder: {
    id: Uint8Array;
    name: string;
  } | null = null;

  if (parentId !== null) {
    folder = await prisma.content.findUniqueOrThrow({
      where: { id: parentId, ownerId, isDeleted: false, isFolder: true },
      select: { id: true, name: true },
    });
  }

  return { userData, orderedActivityScores, folder };
}

export async function getAssignedScores(loggedInUserId: Uint8Array) {
  const scores = await prisma.assignmentScores.findMany({
    where: {
      userId: loggedInUserId,
      activity: { isAssigned: true, isDeleted: false },
    },
    select: {
      score: true,
      activity: { select: { id: true, name: true } },
    },
    orderBy: { activity: { createdAt: "asc" } },
  });

  const orderedActivityScores = scores.map((obj) => ({
    activityId: obj.activity.id,
    activityName: obj.activity.name,
    score: obj.score,
  }));

  const userData: UserInfo = await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: { userId: true, firstNames: true, lastNames: true, email: true },
  });

  return { userData, orderedActivityScores };
}

export async function getAssignmentContent({
  activityId,
  ownerId,
}: {
  activityId: Uint8Array;
  ownerId: Uint8Array;
}) {
  const assignmentData = await prisma.documents.findMany({
    where: {
      activityId,
      activity: {
        ownerId,
        isDeleted: false,
        isAssigned: true,
        isFolder: false,
      },
    },
    select: {
      assignedVersion: {
        select: {
          docId: true,
          versionNum: true,
          source: true,
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
  activityId,
  docId,
  docVersionNum,
  userId,
  answerId,
  response,
  answerNumber,
  itemNumber,
  creditAchieved,
  itemCreditAchieved,
  documentCreditAchieved,
}: {
  activityId: Uint8Array;
  docId: Uint8Array;
  docVersionNum: number;
  userId: Uint8Array;
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
      activityId,
      docVersionNum,
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
  activityId,
  ownerId,
}: {
  activityId: Uint8Array;
  ownerId: Uint8Array;
}) {
  // Using raw query as it seems prisma does not support distinct in count.
  // https://github.com/prisma/prisma/issues/4228

  let submittedResponses = await prisma.$queryRaw<
    {
      docId: Uint8Array;
      docVersionNum: number;
      answerId: string;
      answerNumber: number | null;
      count: number;
      averageCredit: number;
    }[]
  >(Prisma.sql`
    SELECT docId, docVersionNum, answerId, answerNumber, 
    COUNT(userId) as count, AVG(maxCredit) as averageCredit
    FROM (
      SELECT activityId, docId, docVersionNum, answerId, answerNumber, userId, MAX(creditAchieved) as maxCredit
      FROM documentSubmittedResponses
      WHERE activityId = ${activityId}
      GROUP BY activityId, docId, docVersionNum, answerId, answerNumber, userId 
    ) as dsr
    INNER JOIN content on dsr.activityId = content.id 
    WHERE content.id=${activityId} and ownerId = ${ownerId} and isAssigned=true and isFolder=false
    GROUP BY docId, docVersionNum, answerId, answerNumber
    ORDER BY answerNumber
    `);

  // The query returns a BigInt for count, which TypeScript doesn't know how to serialize,
  // so we convert into a Number.
  submittedResponses = submittedResponses.map((row) => {
    row.count = Number(row.count);
    return row;
  });

  return submittedResponses;
}

export async function getDocumentSubmittedResponses({
  activityId,
  docId,
  docVersionNum,
  ownerId,
  answerId,
}: {
  activityId: Uint8Array;
  docId: Uint8Array;
  docVersionNum: number;
  ownerId: Uint8Array;
  answerId: string;
}) {
  // get activity name and make sure that owner is the owner
  const activityName = (
    await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        ownerId,
        isDeleted: false,
        isFolder: false,
      },
      select: { name: true },
    })
  ).name;

  // TODO: gave up figuring out to do find the best response and the latest response in a SQL query,
  // so just create in via JS based on this one query.
  // Can we come up with a better solution?
  const rawResponses = await prisma.$queryRaw<
    {
      userId: Uint8Array;
      firstNames: string | null;
      lastNames: string;
      email: string;
      response: string;
      creditAchieved: number;
      submittedAt: DateTime;
      maxCredit: number;
      numResponses: bigint;
    }[]
  >(Prisma.sql`
select dsr.userId, users.firstNames, users.lastNames, users.email, response, creditAchieved, submittedAt,
        MAX(creditAchieved) over (partition by dsr.userId) as maxCredit,
        COUNT(creditAchieved) over (partition by dsr.userId) as numResponses
        from documentSubmittedResponses as dsr
      INNER JOIN content on dsr.activityId = content.id 
      INNER JOIN users on dsr.userId = users.userId 
      WHERE content.id=${activityId} and ownerId = ${ownerId} and isAssigned=true and isFolder=false
        and docId = ${docId} and docVersionNum = ${docVersionNum} and answerId = ${answerId}
        order by dsr.userId asc, submittedAt desc
  `);

  const submittedResponses = [];
  let newResponse;
  let lastUserId = new Uint8Array(16);

  for (const respObj of rawResponses) {
    if (respObj.userId > lastUserId) {
      lastUserId = respObj.userId;
      if (newResponse) {
        submittedResponses.push(newResponse);
      }
      newResponse = {
        user: {
          userId: respObj.userId,
          firstNames: respObj.firstNames,
          lastNames: respObj.lastNames,
          email: respObj.email,
        },
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
    submittedResponses.push(newResponse);
  }

  return { activityName, submittedResponses };
}

export async function getDocumentSubmittedResponseHistory({
  activityId,
  docId,
  docVersionNum,
  ownerId,
  answerId,
  userId,
}: {
  activityId: Uint8Array;
  docId: Uint8Array;
  docVersionNum: number;
  ownerId: Uint8Array;
  answerId: string;
  userId: Uint8Array;
}) {
  // get activity name and make sure that owner is the owner
  const activityName = (
    await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        ownerId,
        isDeleted: false,
        isFolder: false,
      },
      select: { name: true },
    })
  ).name;

  // for each combination of ["activityId", "docId", "docVersionNum", "answerId", "userId"],
  // find the latest submitted response
  const submittedResponses = await prisma.documentSubmittedResponses.findMany({
    where: {
      activityId,
      docVersionNum,
      docId,
      answerId,
      userId,
      documentVersion: {
        document: {
          activity: {
            ownerId,
          },
        },
      },
    },
    select: {
      user: {
        select: {
          userId: true,
          firstNames: true,
          lastNames: true,
          email: true,
        },
      },
      response: true,
      creditAchieved: true,
      submittedAt: true,
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  return { activityName, submittedResponses };
}

export async function getAssignmentDataFromCode(
  code: string,
  loggedInUserId: Uint8Array,
) {
  let assignment;

  try {
    assignment = await prisma.content.findFirstOrThrow({
      where: {
        classCode: code,
        codeValidUntil: {
          gte: DateTime.now().toISO(), // TODO - confirm this works with timezone stuff
        },
        isDeleted: false,
        isAssigned: true,
        isFolder: false,
      },
      select: {
        id: true,
        ownerId: true,
        documents: {
          select: {
            id: true,
            assignedVersionNum: true,
            assignedVersion: {
              select: {
                source: true,
                doenetmlVersion: { select: { fullVersion: true } },
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        },
      },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return {
        assignmentFound: false,
        assignment: null,
      };
    } else {
      throw e;
    }
  }

  if (!isEqualUUID(loggedInUserId, assignment.ownerId)) {
    await recordContentView(assignment.id, loggedInUserId);
  }

  return { assignmentFound: true, assignment };
}

export async function listUserAssigned(userId: Uint8Array) {
  const preliminaryAssignments = await prisma.content.findMany({
    where: {
      isDeleted: false,
      isAssigned: true,
      assignmentScores: { some: { userId } },
    },
    select: returnContentStructureNoClassDocsSelect({
      includeAssignInfo: true,
    }),
    orderBy: { createdAt: "asc" },
  });

  const assignments = preliminaryAssignments.map((obj) =>
    processContentNoClassDocs(obj),
  );

  const user: UserInfo = await prisma.users.findUniqueOrThrow({
    where: { userId },
    select: { userId: true, firstNames: true, lastNames: true, email: true },
  });

  return {
    assignments,
    user,
  };
}
