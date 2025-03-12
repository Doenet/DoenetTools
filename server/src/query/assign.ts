import { DateTime } from "luxon";
import { prisma } from "../model";
import {
  editableContentWhere,
  filterEditableActivity,
  filterEditableContent,
} from "../utils/permissions";
import { getRandomValues } from "crypto";
import { AssignmentMode, Prisma } from "@prisma/client";
import { UserInfo } from "../types";
import { isEqualUUID } from "../utils/uuid";
import { processContent, returnContentSelect } from "../utils/contentStructure";
import { recordContentView } from "./stats";
import { InvalidRequestError } from "../utils/error";
import { getContent } from "./activity_edit_view";
import { getScore, getScoresOfAllStudents } from "./scores";
import { getUserInfo } from "./user";

/**
 * Assigned the content `contentId` owned by `loggedInUserId`
 *
 * Verify that `contentId` is not already assigned as part of another root assignment,
 * in which case an `InvalidRequestError` is thrown.
 *
 * If `contentId` is already assigned as a root assignment, just return the `classCode`.
 *
 * If `contentId` is not assigned, then assign it and its children, creating a new `classCode`
 * if it doesn't already exist, and return the `classCode`.
 */
export async function assignActivity({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  // verify content exists and is not assigned as part of another root assignment
  await verifyNotAssignedAsNonRoot({ contentId, loggedInUserId });

  const content = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterEditableActivity(loggedInUserId),
    },
    select: {
      rootAssignment: { select: { assigned: true, classCode: true } },
    },
  });

  //  If content was already assigned as the root, then there's nothing to do. Just report the code.
  if (content.rootAssignment?.assigned) {
    return { classCode: content.rootAssignment.classCode };
  }

  // Verify that no descendants of `contentId` are already assigned as a root.
  // Note: we don't have to check for non-root assignment, as either the root is a descendant of `contentId`
  // or `contentId` itself would have been assigned
  const descendantAssigned = await prisma.$queryRaw<
    {
      id: Uint8Array;
      assigned: boolean;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, assigned) AS (
      SELECT content.id, assignments.assigned
      FROM content
        LEFT JOIN assignments ON assignments.rootContentId = content.id
      WHERE parentId = ${contentId}
        AND content.isDeleted = FALSE
      UNION ALL
      SELECT content.id, assignments.assigned
      FROM content
        INNER JOIN content_tree AS ct ON content.parentId = ct.id
        LEFT JOIN assignments ON assignments.rootContentId = content.id
      WHERE 
        content.isDeleted = FALSE
    )
    SELECT id, assigned from content_tree
    WHERE assigned IS NOT NULL
  `);

  if (descendantAssigned.some((d) => d.assigned)) {
    throw new InvalidRequestError(
      "Cannot assign content with a descendant that is already assigned",
    );
  }

  // delete any assignment records from descendants that were previously assigned as their own root
  await prisma.assignments.deleteMany({
    where: { rootContentId: { in: descendantAssigned.map((d) => d.id) } },
  });

  const updatedContent = await prisma.content.update({
    where: { id: contentId },
    data: {
      rootAssignment: {
        upsert: {
          update: { assigned: true },
          create: {
            assigned: true,
            classCode: generateClassCode(),
          },
        },
      },
    },
    select: {
      rootAssignment: { select: { classCode: true } },
      type: true,
      children: { select: { id: true }, where: { isDeleted: false } },
    },
  });

  if (updatedContent.type !== "singleDoc") {
    await prisma.$executeRaw(Prisma.sql`
        WITH RECURSIVE content_tree(id) AS (
          SELECT id FROM content
          WHERE parentId = ${contentId}
          UNION ALL
          SELECT content.id FROM content
          INNER JOIN content_tree AS ct
          ON content.parentId = ct.id
          WHERE content.isDeleted = FALSE
        )
    
        UPDATE content
          SET content.nonRootAssignmentId = ${contentId}
          WHERE content.id IN (SELECT id from content_tree);
        `);
  }

  return { classCode: updatedContent.rootAssignment!.classCode };
}

/**
 * Verify that activity `contentId` owned by `loggedInUserId` is not assigned as part of another activity,
 * throwing an `InvalidRequestError` if it is.
 *
 * Also deletes connection to a non-root assignment if that assignment is no longer assigned
 */
async function verifyNotAssignedAsNonRoot({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const content = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterEditableActivity(loggedInUserId),
    },
    select: { nonRootAssignment: { select: { assigned: true } } },
  });

  if (content.nonRootAssignment) {
    if (content.nonRootAssignment.assigned) {
      throw new InvalidRequestError(
        "Activity is already assigned as a part of another activity",
      );
    } else {
      // if content has been unassigned as part of a non-root assignment,
      // we can delete that connection
      await prisma.content.update({
        where: { id: contentId },
        data: { nonRootAssignmentId: null },
      });
    }
  }
}

/**
 * Randomly generate a 6 digit number. Return as a string.
 */
function generateClassCode() {
  const array = new Uint32Array(1);
  getRandomValues(array);
  return array[0].toString().slice(-6);
}

/**
 * Assign activity `contentId` owned by `loggedInUserId`,
 * set its `closeAt`, and return the `classCode`.
 */
export async function openAssignmentWithCode({
  contentId,
  closeAt,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  closeAt: DateTime;
  loggedInUserId: Uint8Array;
}) {
  const { classCode } = await assignActivity({ contentId, loggedInUserId });

  const codeValidUntil = closeAt.toJSDate();

  await prisma.assignments.update({
    where: { rootContentId: contentId },
    data: { codeValidUntil },
  });
  return { classCode, codeValidUntil };
}

/**
 * Update `closeAt` of the assignment `contentId` owned by `loggedInUserId`.
 *
 * Throws an error if `contentId` is not the root of an assignment.
 */
export async function updateAssignmentCloseAt({
  contentId,
  closeAt,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  closeAt: DateTime;
  loggedInUserId: Uint8Array;
}) {
  const codeValidUntil = closeAt.toJSDate();

  await prisma.assignments.update({
    where: {
      rootContentId: contentId,
      rootContent: {
        ...filterEditableActivity(loggedInUserId),
      },
    },
    data: { codeValidUntil },
  });
}

/**
 * Update `maxAttempts` of the assignment `contentId` owned by `loggedInUserId`.
 *
 * The meaning of `maxAttempts` depends on the the assignment mode:
 * - For `formative` mode, students can create new attempts of individual assignments,
 *   and `maxAttempts` is the maximum number of attempts available for each item.
 * - For `summative` mode, students can create new attempts of the entire assignment,
 *   and `maxAttempts` is the maximum number of attempts available for the entire assignment.
 *
 * Verifies that `contentId` is not assigned as a part of another root assignment,
 * throwing an `InvalidRequestError` in that case.
 *
 * Creates a root assignment record for `contentId` if it doesn't exist.
 *
 * Note: updating `maxAttempts` is possible even if an `contentId` is assigned.
 */
export async function updateAssignmentMaxAttempts({
  contentId,
  maxAttempts,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  maxAttempts: number;
  loggedInUserId: Uint8Array;
}) {
  // verify content exists and is not assigned as part of another root assignment
  await verifyNotAssignedAsNonRoot({ contentId, loggedInUserId });

  if (maxAttempts && maxAttempts > 65535) {
    throw new InvalidRequestError(
      "maxAttempts must be less than or equal to 65535",
    );
  }

  await prisma.content.update({
    where: {
      id: contentId,
      ...filterEditableActivity(loggedInUserId),
    },
    data: {
      rootAssignment: {
        upsert: {
          where: { rootContentId: contentId },
          create: {
            maxAttempts,
            classCode: generateClassCode(),
          },
          update: { maxAttempts },
        },
      },
    },
  });

  return { success: true, maxAttempts };
}

/**
 * Updates the `mode` field of the assignment `contentId` that is owned by `loggedInUserId`.
 *
 * Verifies that `contentId` is not assigned as a part of another root assignment,
 * throwing an `InvalidRequestError` in that case.
 *
 * Creates a root assignment record for `contentId` if it doesn't exist.
 *
 * The mode can be updated only if the content is not assigned.
 */
export async function updateAssignmentMode({
  contentId,
  mode,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  mode: AssignmentMode;
  loggedInUserId: Uint8Array;
}) {
  // verify content exists and is not assigned as part of another root assignment
  await verifyNotAssignedAsNonRoot({ contentId, loggedInUserId });

  // verify that content is not currently assigned
  const assignment = await prisma.assignments.findUnique({
    where: {
      rootContentId: contentId,
      rootContent: {
        ...filterEditableActivity(loggedInUserId),
      },
    },
    select: { assigned: true },
  });

  if (assignment?.assigned) {
    throw new InvalidRequestError(
      "Cannot update assignment mode of assigned content",
    );
  }

  await prisma.content.update({
    where: {
      id: contentId,
      ...filterEditableActivity(loggedInUserId),
    },
    data: {
      rootAssignment: {
        upsert: {
          where: { rootContentId: contentId },
          create: {
            mode,
            classCode: generateClassCode(),
          },
          update: { mode },
        },
      },
    },
  });

  return { success: true, mode };
}

export async function closeAssignmentWithCode({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  await prisma.assignments.update({
    where: {
      rootContentId: contentId,
      rootContent: {
        ...filterEditableActivity(loggedInUserId),
      },
    },
    data: { codeValidUntil: null },
  });

  // attempt to unassign activity, which will succeed
  // only if there is no student data
  await unassignActivity({ contentId, loggedInUserId });
}

/**
 * Attempt to completely unassign assignment `contentId` owned by `loggedInUserId`.
 *
 * An assignment can be unassigned only if no students have begun the assignment,
 * which is defined by the presence of data in the `contentState` table corresponding
 * to `contentId`.
 *
 * Return a promise that resolves to an object with field
 * - success: whether or not the assignment was successfully unassigned.
 */
export async function unassignActivity({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  try {
    await prisma.content.update({
      where: {
        id: contentId,
        rootAssignment: { contentState: { none: { contentId } } },
        ...filterEditableActivity(loggedInUserId),
      },
      data: {
        rootAssignment: { update: { assigned: false, codeValidUntil: null } },
      },
    });

    return { success: true };
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      // Check to see if the reason for failure was simply due to the presence of student data
      // or the fact that assignment had not yet been assigned
      // (rather than the assignment just not existing)

      // If the content simply doesn't exist, then still throw an error
      const checkResult = await prisma.content.findUniqueOrThrow({
        where: {
          id: contentId,
          ...filterEditableActivity(loggedInUserId),
        },
        select: {
          rootAssignment: { select: { assigned: true } },
        },
      });

      // otherwise, if the original error was just thrown due to the presence of student data
      // or the fact that an assignment record had not yet been created,
      // then simply report success as whether or not the assignment is still assigned
      return { success: checkResult.rootAssignment?.assigned !== true };
    } else {
      throw e;
    }
  }
}

/**
 * TODO: when figure out what data this should actually return, write docstring
 */
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

  const assignmentInfo = await prisma.assignments.findUniqueOrThrow({
    where: {
      rootContentId: contentId,
      rootContent: {
        // if getting data for other person, you must be the owner
        ownerId: isEqualUUID(userId, loggedInUserId)
          ? undefined
          : loggedInUserId,
        isDeleted: false,
        type: { not: "folder" },
      },
    },
    select: {
      mode: true,
      rootContent: {
        select: {
          id: true,
          name: true,
          source: true,
          doenetmlVersion: { select: { fullVersion: true } },
        },
      },
    },
  });

  const userInfo = await getUserInfo({ loggedInUserId: userId });

  const assignmentDataPrelim = await prisma.contentState.findMany({
    // don't need to check user permissions since first query did that
    where: { contentId, userId },
    distinct: ["contentId", "userId"],
    orderBy: { score: "desc" },
    select: {
      score: true,
      contentItemStates:
        assignmentInfo.mode === "formative"
          ? {
              // Note this query works because with formative mode,
              // there will be only one content attempt.
              // Due to the join with the above distinct and order,
              // this is actually calculating just the maximum items score
              // over all item attempts from the content attempt with maximal score.
              distinct: ["itemNumber"],
              orderBy: [{ shuffledItemNumber: "asc" }, { score: "desc" }],
              select: { itemNumber: true, score: true },
            }
          : false,
    },
  });

  const assignmentData =
    assignmentDataPrelim.length === 1
      ? {
          score: assignmentDataPrelim[0].score,
          itemScores: assignmentDataPrelim[0].contentItemStates,
        }
      : { score: 0, itemScores: [] };

  // const activityScoresPrelim = await prisma.contentState.findMany({
  //   where: { contentId, userId },
  //   select: {
  //     score: true,
  //     scoreByItem: true,
  //   },
  //   orderBy: {
  //     score: "asc",
  //   },
  // });

  // const activityScores = activityScoresPrelim.map((scores) => ({
  //   ...scores,
  //   scoreByItem: parseNumberArrayString(scores.scoreByItem),
  // }));

  return {
    ...assignmentData,
    mode: assignmentInfo.mode,
    content: assignmentInfo.rootContent,
    userInfo,
  };
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
      AND (EXISTS(SELECT * FROM assignments WHERE rootContentId=content.id) or type = "folder") AND isDeleted = false
      UNION ALL
      SELECT c.id, c.parentId, c.type, CONCAT(ct.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ct
      ON c.parentId = ct.id
      WHERE (EXISTS(SELECT * FROM assignments WHERE rootContentId=c.id) or c.type = "folder") AND c.isDeleted = false
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

  const assignmentScoresPrelim = await prisma.assignments.findMany({
    where: {
      rootContentId: { in: orderedActivities.map((a) => a.id) },
    },
    select: {
      rootContentId: true,
      contentState: {
        distinct: ["contentId", "userId"],
        orderBy: [
          { user: { lastNames: "asc" } },
          { user: { firstNames: "asc" } },
          { score: "desc" },
        ],
        select: {
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
      },
    },
  });

  const assignmentScores = assignmentScoresPrelim.map((assignment) => ({
    contentId: assignment.rootContentId,
    userScores: assignment.contentState,
  }));

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
      AND (EXISTS(SELECT * FROM assignments WHERE rootContentId=content.id) or type = "folder") AND isDeleted = false
      UNION ALL
      SELECT c.id, c.parentId, c.type, CONCAT(ct.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ct
      ON c.parentId = ct.id
      WHERE (EXISTS(SELECT * FROM assignments WHERE rootContentId=c.id) or c.type = "folder") AND c.isDeleted = false
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
  const scores = await prisma.contentState.findMany({
    where: {
      userId: loggedInUserId,
      assignment: { rootContent: { isDeleted: false } },
    },
    select: {
      score: true,
      assignment: {
        select: {
          rootContent: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: { assignment: { rootContent: { createdAt: "asc" } } },
  });

  const orderedActivityScores = scores.map((obj) => ({
    contentId: obj.assignment.rootContent.id,
    activityName: obj.assignment.rootContent.name,
    score: obj.score,
  }));

  const userData: UserInfo = await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: { userId: true, firstNames: true, lastNames: true, email: true },
  });

  return { userData, orderedActivityScores };
}

// TODO: do we still record submitted event if an assignment isn't open?
// If so, do we mark it special to indicate that assignment wasn't open at the time?
export async function recordSubmittedEvent({
  contentId,
  loggedInUserId,
  contentAttemptNumber,
  itemAttemptNumber,
  answerId,
  response,
  answerNumber,
  componentNumber,
  itemNumber,
  shuffledItemNumber,
  answerCreditAchieved,
  componentCreditAchieved,
  itemCreditAchieved,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  contentAttemptNumber: number;
  itemAttemptNumber: number | null;
  answerId: string;
  response: string;
  answerNumber?: number;
  componentNumber: number;
  itemNumber: number;
  shuffledItemNumber: number;
  answerCreditAchieved: number;
  componentCreditAchieved: number;
  itemCreditAchieved: number;
}) {
  await prisma.submittedResponses.create({
    data: {
      contentId,
      userId: loggedInUserId,
      contentAttemptNumber,
      itemAttemptNumber,
      answerId,
      response,
      answerNumber,
      componentNumber,
      itemNumber,
      shuffledItemNumber,
      answerCreditAchieved,
      componentCreditAchieved,
      itemCreditAchieved,
    },
  });
}

/**
 * Return an array of the answers from `contentId` for which at least one student has submitted a response.
 * `contentId` must be owned by `loggedInUserId`.
 *
 * Returns an array of the answers. Each element has the fields:
 * - `answerId`: the DoenetML name of the answer submitted
 * - `answerNumber`: the (1-based) index of the answer in the document, if available
 * - `itemNumber`: in problem sets/question banks, the item number of the document
 * - `count`: the number of students who submitted a response to the answer
 * - `averageCredit`: the average (maximum) credit that students were awarded on the answer
 */
export async function getAnswersWithSubmittedResponses({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  // Using raw query as it seems prisma does not support distinct in count.
  // https://github.com/prisma/prisma/issues/4228

  let answerList = await prisma.$queryRaw<
    {
      answerId: string;
      answerNumber: number | null;
      itemNumber: number;
      count: number;
      averageCredit: number;
    }[]
  >(Prisma.sql`
    SELECT answerId, answerNumber, itemNumber,
    COUNT(userId) as count, AVG(maxCredit) as averageCredit
    FROM (
      SELECT contentId, answerId, answerNumber, itemNumber, userId, MAX(answerCreditAchieved) as maxCredit
      FROM submittedResponses
      WHERE contentId = ${contentId}
      GROUP BY contentId, answerId, answerNumber, itemNumber, userId 
    ) as sr
    INNER JOIN content on sr.contentId = content.id 
    WHERE content.id=${contentId}
      AND ${editableContentWhere(loggedInUserId)}
      AND EXISTS(SELECT * FROM assignments WHERE rootContentId=content.id)
      AND type != "folder"
    GROUP BY answerId, answerNumber, itemNumber
    ORDER BY itemNumber, answerNumber
    `);

  // The query returns a BigInt for count, which TypeScript doesn't know how to serialize,
  // so we convert into a Number.
  answerList = answerList.map((row) => {
    row.count = Number(row.count);
    return row;
  });

  return answerList;
}

export async function getSubmittedResponses({
  contentId,
  loggedInUserId,
  answerId,
  itemNumber,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  answerId: string;
  itemNumber: number;
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
      answerCreditAchieved: number;
      submittedAt: DateTime;
      maxCredit: number;
      numResponses: bigint;
    }[]
  >(Prisma.sql`
select sr.userId, users.firstNames, users.lastNames, users.email, response, answerCreditAchieved, submittedAt,
        MAX(answerCreditAchieved) over (partition by sr.userId) as maxCredit,
        COUNT(answerCreditAchieved) over (partition by sr.userId) as numResponses
        from submittedResponses as sr
      INNER JOIN content on sr.contentId = content.id 
      INNER JOIN users on sr.userId = users.userId 
      WHERE content.id=${contentId} and ownerId = ${loggedInUserId} 
        and EXISTS(SELECT * FROM assignments WHERE rootContentId=content.id) and type != "folder"
        and contentId = ${contentId} and answerId = ${answerId} and itemNumber = ${itemNumber}
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
        latestCreditAchieved: respObj.answerCreditAchieved,
        bestCreditAchieved: respObj.maxCredit,
        numResponses: Number(respObj.numResponses),
        bestResponse: "",
      };
    }
    if (
      newResponse?.bestResponse === "" &&
      respObj.answerCreditAchieved === newResponse.bestCreditAchieved
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
  loggedInUserId,
  answerId,
  itemNumber,
  userId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  answerId: string;
  itemNumber: number;
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

  // for this combination of ["contentId", "answerId", "itemNumber", "userId"],
  // find all submitted responses
  const submittedResponses = await prisma.submittedResponses.findMany({
    where: {
      contentId,
      answerId,
      itemNumber,
      userId,
      content: {
        ownerId: loggedInUserId,
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
      answerCreditAchieved: true,
      submittedAt: true,
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  return { activityName, submittedResponses };
}

export async function getAssignmentViewerDataFromCode({
  code,
  loggedInUserId,
}: {
  code: string;
  loggedInUserId: Uint8Array;
}) {
  let preliminaryAssignment;

  // make sure that content is assigned as is open
  try {
    preliminaryAssignment = await prisma.content.findFirstOrThrow({
      where: {
        rootAssignment: {
          classCode: code,
          codeValidUntil: {
            gte: DateTime.now().toISO(), // TODO - confirm this works with timezone stuff
          },
        },
        isDeleted: false,
        type: { not: "folder" },
      },
      select: { id: true, ownerId: true },
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

  const assignment = await getContent({
    contentId: preliminaryAssignment.id,
    loggedInUserId,
    includeAssignInfo: true,
    skipPermissionCheck: true,
  });

  if (!isEqualUUID(loggedInUserId, preliminaryAssignment.ownerId)) {
    await recordContentView(assignment.contentId, loggedInUserId);
  }

  const scoreData = await getScore({
    contentId: assignment.contentId,
    loggedInUserId,
  });

  return {
    assignmentFound: true,
    assignment,
    scoreData,
  };
}

export async function listUserAssigned({
  loggedInUserId,
}: {
  loggedInUserId: Uint8Array;
}) {
  const preliminaryAssignments = await prisma.content.findMany({
    where: {
      isDeleted: false,
      rootAssignment: {
        contentState: {
          some: { userId: loggedInUserId },
        },
      },
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

/**
 * Get the data for the overview of student responses for the assignment `contentId`.
 * It must be owned by `loggedInUserId` for the data to be returned.
 *
 * Return a Promise that results to an object with these fields:
 * - scores: an array of the scores achieved by all students
 * - answerList: an array of the answers from `contentId` that have responses
 * - content: information about `contentId`
 */
export async function getAssignmentResponseOverview({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const scores = await getScoresOfAllStudents({
    contentId,
    loggedInUserId,
  });

  const answerList = await getAnswersWithSubmittedResponses({
    contentId,
    loggedInUserId: loggedInUserId,
  });

  const content = await getContent({
    contentId,
    loggedInUserId,
  });

  return { scores, answerList, content };
}
