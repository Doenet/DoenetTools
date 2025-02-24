import { DateTime } from "luxon";
import { prisma } from "../model";
import { createActivityRevision } from "./activity";
import {
  filterEditableActivity,
  filterEditableContent,
} from "../utils/permissions";
import { getRandomValues } from "crypto";
import { Prisma } from "@prisma/client";
import { UserInfo } from "../types";
import { isEqualUUID } from "../utils/uuid";
import { recordContentView } from "./explore";
import { processContent, returnContentSelect } from "../utils/contentStructure";

export async function assignActivity({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  // verify
  await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      isAssigned: false,
      ...filterEditableActivity(loggedInUserId),
    },
    select: { id: true },
  });

  const newRevision = await createActivityRevision(contentId, loggedInUserId);

  await prisma.content.update({
    where: { id: contentId },
    data: {
      isAssigned: true,
      assignedRevisionNum: newRevision.revisionNum,
    },
  });
}

function generateClassCode() {
  const array = new Uint32Array(1);
  getRandomValues(array);
  return array[0].toString().slice(-6);
}

export async function openAssignmentWithCode({
  contentId,
  closeAt,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  closeAt: DateTime;
  loggedInUserId: Uint8Array;
}) {
  const initialActivity = await prisma.content.findUniqueOrThrow({
    where: { id: contentId, ownerId: loggedInUserId, type: { not: "folder" } },
    select: { classCode: true, isAssigned: true },
  });

  if (!initialActivity.isAssigned) {
    await assignActivity({ contentId, loggedInUserId });
  }

  let classCode = initialActivity.classCode;

  if (!classCode) {
    classCode = generateClassCode();
  }

  const codeValidUntil = closeAt.toJSDate();

  await prisma.content.update({
    where: { id: contentId },
    data: {
      classCode,
      codeValidUntil,
    },
  });
  return { classCode, codeValidUntil };
}

export async function updateAssignmentSettings({
  contentId,
  closeAt,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  closeAt: DateTime;
  loggedInUserId: Uint8Array;
}) {
  const codeValidUntil = closeAt.toJSDate();

  await prisma.content.update({
    where: {
      id: contentId,
      isAssigned: true,
      ...filterEditableActivity(loggedInUserId),
    },
    data: {
      codeValidUntil,
    },
  });

  return {};
}

export async function closeAssignmentWithCode({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  await prisma.content.update({
    where: {
      id: contentId,
      isAssigned: true,
      ...filterEditableActivity(loggedInUserId),
    },
    data: {
      codeValidUntil: null,
    },
  });

  // attempt to unassign activity, which will succeed
  // only if there is no student data
  try {
    await unassignActivity({ contentId, loggedInUserId });
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

export async function unassignActivity({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  await prisma.content.update({
    where: {
      id: contentId,
      isAssigned: true,
      assignmentScores: { none: { contentId } },
      ...filterEditableActivity(loggedInUserId),
    },
    data: {
      isAssigned: false,
      assignedRevisionNum: null,
    },
  });
}

/**
 * Given the `contentId` is owned by `loggedInUserId`,
 * return all the scores that students have achieved on `contentId`.
 *
 * @returns a Promise that resolves to an object with fields
 * - name: the name of the assignment
 * - assignmentScores: an array with one entry per student that has taken `contentId`.
 *
 * Each element of the array `assignmentScores` is an object with fields
 *
 * - user: a `UserInfo` object for the student
 * - score: the student's score on `contentId` (between 0 and 1)
 */
export async function getAssignmentScoreData({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const assignment: {
    name: string;
    assignmentScores: {
      score: number;
      user: UserInfo;
    }[];
  } = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      isAssigned: true,
      ...filterEditableActivity(loggedInUserId),
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
  contentId,
  loggedInUserId,
  studentUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  studentUserId?: Uint8Array;
}) {
  const userId = studentUserId ?? loggedInUserId;

  const assignmentData = await prisma.assignmentScores.findUniqueOrThrow({
    where: {
      contentId_userId: { contentId, userId },
      activity: {
        // if studentUserId specified, you must be the owner
        ownerId: studentUserId ? loggedInUserId : undefined,
        isDeleted: false,
        type: { not: "folder" },
        isAssigned: true,
      },
    },
    select: {
      score: true,
      activity: {
        select: {
          id: true,
          name: true,
          assignedRevision: {
            select: {
              revisionNum: true,
              source: true,
              doenetmlVersion: { select: { fullVersion: true } },
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

  const activityScores = await prisma.activityState.findMany({
    where: { contentId, userId },
    select: {
      activityRevisionNum: true,
      hasMaxScore: true,
      score: true,
    },
    orderBy: {
      score: "asc",
    },
  });

  return { ...assignmentData, activityScores };
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
  loggedInUserId,
  parentId,
}: {
  loggedInUserId: Uint8Array;
  parentId: Uint8Array | null;
}) {
  const orderedActivities = await prisma.$queryRaw<
    {
      id: Uint8Array;
      name: string;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, type, path) AS (
      SELECT id, parentId, type, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE ${parentId === null ? Prisma.sql`parentId IS NULL` : Prisma.sql`parentId = ${parentId}`}
      AND ownerId = ${loggedInUserId}
      AND (isAssigned = true or type = "folder") AND isDeleted = false
      UNION ALL
      SELECT c.id, c.parentId, c.type, CONCAT(ct.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ct
      ON c.parentId = ct.id
      WHERE (c.isAssigned = true or c.type = "folder") AND c.isDeleted = false
    )
    
    SELECT c.id, c.name FROM content AS c
    INNER JOIN content_tree AS ct
    ON ct.id = c.id
    WHERE ct.type != "folder" ORDER BY path
  `);

  let folder: {
    id: Uint8Array;
    name: string;
  } | null = null;

  if (parentId !== null) {
    folder = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        type: "folder",
        ...filterEditableContent(loggedInUserId),
      },
      select: { id: true, name: true },
    });
  }

  const assignmentScores = await prisma.assignmentScores.findMany({
    where: {
      contentId: { in: orderedActivities.map((a) => a.id) },
    },
    select: {
      contentId: true,
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
 * - studentData: information on the student
 * - orderedActivities: the ordered list of all activities in the folder (and subfolders)
 *   along with the student's score, if it exists
 */
export async function getStudentData({
  studentUserId,
  loggedInUserId,
  parentId,
}: {
  studentUserId: Uint8Array;
  loggedInUserId: Uint8Array;
  parentId: Uint8Array | null;
}) {
  const studentData = await prisma.users.findUniqueOrThrow({
    where: {
      userId: studentUserId,
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
      contentId: Uint8Array;
      activityName: string;
      score: number | null;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, type, path) AS (
      SELECT id, parentId, type, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE ${parentId === null ? Prisma.sql`parentId IS NULL` : Prisma.sql`parentId = ${parentId}`}
      AND ownerId = ${loggedInUserId}
      AND (isAssigned = true or type = "folder") AND isDeleted = false
      UNION ALL
      SELECT c.id, c.parentId, c.type, CONCAT(ct.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ct
      ON c.parentId = ct.id
      WHERE (c.isAssigned = true or c.type = "folder") AND c.isDeleted = false
    )
    
    SELECT c.id AS contentId, c.name AS activityName, s.score FROM content AS c
    INNER JOIN content_tree AS ct
    ON ct.id = c.id
    LEFT JOIN (
        SELECT * FROM assignmentScores WHERE userId=${studentUserId}
        ) as s
    ON s.contentId  = c.id 
    WHERE ct.type != "folder" ORDER BY path
  `);

  let folder: {
    id: Uint8Array;
    name: string;
  } | null = null;

  if (parentId !== null) {
    folder = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        type: "folder",
        ...filterEditableContent(loggedInUserId),
      },
      select: { id: true, name: true },
    });
  }

  return { studentData, orderedActivityScores, folder };
}

export async function getAssignedScores({
  loggedInUserId,
}: {
  loggedInUserId: Uint8Array;
}) {
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
    contentId: obj.activity.id,
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
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const assignmentData = await prisma.content.findMany({
    where: {
      id: contentId,
      isAssigned: true,
      ...filterEditableActivity(loggedInUserId),
    },
    select: {
      assignedRevision: {
        select: {
          revisionNum: true,
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
  contentId,
  activityRevisionNum,
  loggedInUserId,
  answerId,
  response,
  answerNumber,
  itemNumber,
  creditAchieved,
  itemCreditAchieved,
  activityCreditAchieved,
}: {
  contentId: Uint8Array;
  activityRevisionNum: number;
  loggedInUserId: Uint8Array;
  answerId: string;
  response: string;
  answerNumber?: number;
  itemNumber: number;
  creditAchieved: number;
  itemCreditAchieved: number;
  activityCreditAchieved: number;
}) {
  await prisma.submittedResponses.create({
    data: {
      contentId,
      activityRevisionNum,
      userId: loggedInUserId,
      answerId,
      response,
      answerNumber,
      itemNumber,
      creditAchieved,
      itemCreditAchieved,
      activityCreditAchieved,
    },
  });
}

export async function getAnswersThatHaveSubmittedResponses({
  contentId,
  ownerId,
}: {
  contentId: Uint8Array;
  ownerId: Uint8Array;
}) {
  // Using raw query as it seems prisma does not support distinct in count.
  // https://github.com/prisma/prisma/issues/4228

  let submittedResponses = await prisma.$queryRaw<
    {
      activityRevisionNum: number;
      answerId: string;
      answerNumber: number | null;
      count: number;
      averageCredit: number;
    }[]
  >(Prisma.sql`
    SELECT activityRevisionNum, answerId, answerNumber, 
    COUNT(userId) as count, AVG(maxCredit) as averageCredit
    FROM (
      SELECT contentId, activityRevisionNum, answerId, answerNumber, userId, MAX(creditAchieved) as maxCredit
      FROM submittedResponses
      WHERE contentId = ${contentId}
      GROUP BY contentId, activityRevisionNum, answerId, answerNumber, userId 
    ) as sr
    INNER JOIN content on sr.contentId = content.id 
    WHERE content.id=${contentId} and ownerId = ${ownerId} and isAssigned=true and type != "folder"
    GROUP BY activityRevisionNum, answerId, answerNumber
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

export async function getSubmittedResponses({
  contentId,
  activityRevisionNum,
  loggedInUserId,
  answerId,
}: {
  contentId: Uint8Array;
  activityRevisionNum: number;
  loggedInUserId: Uint8Array;
  answerId: string;
}) {
  // get activity name and make sure that loggedInUserId is the owner
  const activityName = (
    await prisma.content.findUniqueOrThrow({
      where: {
        id: contentId,
        ...filterEditableActivity(loggedInUserId),
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
select sr.userId, users.firstNames, users.lastNames, users.email, response, creditAchieved, submittedAt,
        MAX(creditAchieved) over (partition by sr.userId) as maxCredit,
        COUNT(creditAchieved) over (partition by sr.userId) as numResponses
        from submittedResponses as sr
      INNER JOIN content on sr.contentId = content.id 
      INNER JOIN users on sr.userId = users.userId 
      WHERE content.id=${contentId} and ownerId = ${loggedInUserId} and isAssigned=true and type != "folder"
        and contentId = ${contentId} and activityRevisionNum = ${activityRevisionNum} and answerId = ${answerId}
        order by sr.userId asc, submittedAt desc
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

export async function getSubmittedResponseHistory({
  contentId,
  activityRevisionNum,
  loggedInUserId,
  answerId,
  userId,
}: {
  contentId: Uint8Array;
  activityRevisionNum: number;
  loggedInUserId: Uint8Array;
  answerId: string;
  userId: Uint8Array;
}) {
  // get activity name and make sure that owner is the owner
  const activityName = (
    await prisma.content.findUniqueOrThrow({
      where: {
        id: contentId,
        ...filterEditableActivity(loggedInUserId),
      },
      select: { name: true },
    })
  ).name;

  // for each combination of ["contentId", "activityRevisionNum", "answerId", "userId"],
  // find the latest submitted response
  const submittedResponses = await prisma.submittedResponses.findMany({
    where: {
      contentId,
      activityRevisionNum,
      answerId,
      userId,
      activityRevision: {
        activity: {
          ownerId: loggedInUserId,
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

export async function getAssignmentDataFromCode({
  code,
  loggedInUserId,
}: {
  code: string;
  loggedInUserId: Uint8Array;
}) {
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
        type: { not: "folder" },
      },
      select: {
        id: true,
        ownerId: true,
        assignedRevisionNum: true,
        assignedRevision: {
          select: {
            source: true,
            doenetmlVersion: { select: { fullVersion: true } },
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

export async function listUserAssigned({
  loggedInUserId,
}: {
  loggedInUserId: Uint8Array;
}) {
  const preliminaryAssignments = await prisma.content.findMany({
    where: {
      isDeleted: false,
      isAssigned: true,
      assignmentScores: { some: { userId: loggedInUserId } },
    },
    select: returnContentSelect({
      includeAssignInfo: true,
    }),
    orderBy: { createdAt: "asc" },
  });

  //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
  const assignments = preliminaryAssignments.map((obj) => processContent(obj));

  const user: UserInfo = await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: { userId: true, firstNames: true, lastNames: true, email: true },
  });

  return {
    assignments,
    user,
  };
}

export async function getAssignmentData({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const assignmentData = await getAssignmentScoreData({
    contentId,
    loggedInUserId,
  });

  const answerList = await getAnswersThatHaveSubmittedResponses({
    contentId,
    ownerId: loggedInUserId,
  });

  const assignmentContent = await getAssignmentContent({
    contentId,
    loggedInUserId,
  });

  return { assignmentData, answerList, assignmentContent };
}
