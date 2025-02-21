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

export async function assignActivity(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  // verify
  await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      isAssigned: false,
      ...filterEditableActivity(loggedInUserId),
    },
    select: { id: true },
  });

  const newRevision = await createActivityRevision(activityId, loggedInUserId);

  await prisma.content.update({
    where: { id: activityId },
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

export async function openAssignmentWithCode(
  activityId: Uint8Array,
  closeAt: DateTime,
  loggedInUserId: Uint8Array,
) {
  const initialActivity = await prisma.content.findUniqueOrThrow({
    where: { id: activityId, ownerId: loggedInUserId, type: { not: "folder" } },
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
      isAssigned: true,
      ...filterEditableActivity(loggedInUserId),
    },
    data: {
      codeValidUntil,
    },
  });

  return {};
}

export async function closeAssignmentWithCode(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  await prisma.content.update({
    where: {
      id: activityId,
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
    await unassignActivity(activityId, loggedInUserId);
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
  loggedInUserId: Uint8Array,
) {
  await prisma.content.update({
    where: {
      id: activityId,
      isAssigned: true,
      assignmentScores: { none: { activityId } },
      ...filterEditableActivity(loggedInUserId),
    },
    data: {
      isAssigned: false,
      assignedRevisionNum: null,
    },
  });
}

export async function getAssignment(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  const assignment = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      isAssigned: true,
      ...filterEditableActivity(loggedInUserId),
    },
    include: { assignedRevision: true },
  });
  return assignment;
}

export async function getAssignmentScoreData({
  activityId,
  loggedInUserId,
}: {
  activityId: Uint8Array;
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
      id: activityId,
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
    where: { activityId, userId: studentId },
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
  loggedInUserId,
  parentId,
}: {
  userId: Uint8Array;
  loggedInUserId: Uint8Array;
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
    
    SELECT c.id AS activityId, c.name AS activityName, s.score FROM content AS c
    INNER JOIN content_tree AS ct
    ON ct.id = c.id
    LEFT JOIN (
        SELECT * FROM assignmentScores WHERE userId=${userId}
        ) as s
    ON s.activityId  = c.id 
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
  loggedInUserId,
}: {
  activityId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const assignmentData = await prisma.content.findMany({
    where: {
      id: activityId,
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
  activityId,
  activityRevisionNum,
  userId,
  answerId,
  response,
  answerNumber,
  itemNumber,
  creditAchieved,
  itemCreditAchieved,
  activityCreditAchieved,
}: {
  activityId: Uint8Array;
  activityRevisionNum: number;
  userId: Uint8Array;
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
      activityId,
      activityRevisionNum,
      userId,
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
      SELECT activityId, activityRevisionNum, answerId, answerNumber, userId, MAX(creditAchieved) as maxCredit
      FROM submittedResponses
      WHERE activityId = ${activityId}
      GROUP BY activityId, activityRevisionNum, answerId, answerNumber, userId 
    ) as sr
    INNER JOIN content on sr.activityId = content.id 
    WHERE content.id=${activityId} and ownerId = ${ownerId} and isAssigned=true and type != "folder"
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
  activityId,
  activityRevisionNum,
  loggedInUserId,
  answerId,
}: {
  activityId: Uint8Array;
  activityRevisionNum: number;
  loggedInUserId: Uint8Array;
  answerId: string;
}) {
  // get activity name and make sure that loggedInUserId is the owner
  const activityName = (
    await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
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
      INNER JOIN content on sr.activityId = content.id 
      INNER JOIN users on sr.userId = users.userId 
      WHERE content.id=${activityId} and ownerId = ${loggedInUserId} and isAssigned=true and type != "folder"
        and activityId = ${activityId} and activityRevisionNum = ${activityRevisionNum} and answerId = ${answerId}
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
  activityId,
  activityRevisionNum,
  loggedInUserId,
  answerId,
  userId,
}: {
  activityId: Uint8Array;
  activityRevisionNum: number;
  loggedInUserId: Uint8Array;
  answerId: string;
  userId: Uint8Array;
}) {
  // get activity name and make sure that owner is the owner
  const activityName = (
    await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        ...filterEditableActivity(loggedInUserId),
      },
      select: { name: true },
    })
  ).name;

  // for each combination of ["activityId", "activityRevisionNum", "answerId", "userId"],
  // find the latest submitted response
  const submittedResponses = await prisma.submittedResponses.findMany({
    where: {
      activityId,
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

export async function listUserAssigned(userId: Uint8Array) {
  const preliminaryAssignments = await prisma.content.findMany({
    where: {
      isDeleted: false,
      isAssigned: true,
      assignmentScores: { some: { userId } },
    },
    select: returnContentSelect({
      includeAssignInfo: true,
    }),
    orderBy: { createdAt: "asc" },
  });

  //@ts-expect-error: Prisma is incorrectly generating types (https://github.com/prisma/prisma/issues/26370)
  const assignments = preliminaryAssignments.map((obj) => processContent(obj));

  const user: UserInfo = await prisma.users.findUniqueOrThrow({
    where: { userId },
    select: { userId: true, firstNames: true, lastNames: true, email: true },
  });

  return {
    assignments,
    user,
  };
}
