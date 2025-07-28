import { DateTime } from "luxon";
import { prisma } from "../model";
import {
  filterEditableActivity,
  filterEditableContent,
  filterEditableRootAssignment,
  filterViewableRootAssignment,
  getIsEditor,
} from "../utils/permissions";
import { getRandomValues } from "crypto";
import { AssignmentMode, ContentType, Prisma } from "@prisma/client";
import { Content, UserInfo } from "../types";
import { isEqualUUID } from "../utils/uuid";
import { processContent, returnContentSelect } from "../utils/contentStructure";
import { InvalidRequestError } from "../utils/error";
import { getContent } from "./activity_edit_view";
import {
  calculateScoreAndCacheResults,
  getScore,
  getScoresOfAllStudents,
  ItemScores,
} from "./scores";
import { getMyUserInfo } from "./user";
import { StatusCodes } from "http-status-codes";
import { getDescendantIds } from "./activity";
import { recordContentView } from "./popularity";
import { copyContent } from "./copy_move";

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
      OR: [
        filterEditableActivity(loggedInUserId),
        filterEditableRootAssignment(loggedInUserId),
      ],
    },
    select: { nonRootAssignment: { select: { rootContentId: true } } },
  });

  if (content.nonRootAssignment) {
    if (content.nonRootAssignment) {
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
 * Create an assignment from an activity
 * Remixes activity to destination parent and automatically opens the assignmemt.
 */
export async function createAssignment({
  contentId,
  closeAt,
  destinationParentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  closeAt: DateTime;
  loggedInUserId: Uint8Array;
  destinationParentId: Uint8Array | null;
}) {
  // verify content exists and is not assigned as part of another root assignment
  await verifyNotAssignedAsNonRoot({ contentId, loggedInUserId });

  // verify content is not a root assignment
  await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ...filterEditableActivity(loggedInUserId),
    },
    select: { id: true },
  });

  // Verify that no descendants of `contentId` are already assigned as a root.
  // Note: we don't have to check for non-root assignment, as either the root is a descendant of `contentId`
  // or `contentId` itself would have been assigned

  const descendantIds = await getDescendantIds(contentId);
  const descendantAssigned = await prisma.assignments.findFirst({
    where: {
      rootContentId: {
        in: descendantIds,
      },
    },
    select: { rootContentId: true },
  });

  if (descendantAssigned) {
    throw new InvalidRequestError(
      "Cannot assign content with a descendant that is already assigned",
    );
  }

  // Copy the content to the destination folders
  const { newContentIds } = await copyContent({
    contentIds: [contentId],
    parentId: destinationParentId,
    loggedInUserId,
  });
  const assignmentId = newContentIds[0];
  const newDescendantIds = await getDescendantIds(assignmentId);

  // Create the assignment linking it to the root
  // Point all descendants to the new assignment
  // If the type was single doc, there won't be any descendants
  const { classCode } = await prisma.assignments.create({
    data: {
      rootContentId: assignmentId,
      codeValidStarting: new Date(),
      codeValidUntil: null,
      classCode: generateClassCode(),
      nonRootContent: {
        connect: newDescendantIds.map((id) => ({ id })),
      },
    },
  });

  const codeValidUntil = closeAt.toJSDate();

  await prisma.assignments.update({
    where: {
      rootContentId: assignmentId,
      rootContent: {
        ...filterEditableContent(loggedInUserId),
      },
    },
    data: { codeValidUntil },
  });

  return { assignmentId, classCode, codeValidUntil };
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
        ...filterEditableContent(loggedInUserId),
      },
    },
    data: { codeValidUntil },
  });
}

/**
 * Update `maxAttempts` of the assignment `contentId` owned by `loggedInUserId`.
 * This can be called on either an activity or an assignment
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
  const isEditor = await getIsEditor(loggedInUserId);

  if (maxAttempts && maxAttempts > 65535) {
    throw new InvalidRequestError(
      "maxAttempts must be less than or equal to 65535",
    );
  }

  await prisma.content.update({
    where: {
      id: contentId,
      OR: [
        filterEditableActivity(loggedInUserId, isEditor),
        filterEditableRootAssignment(loggedInUserId),
      ],
    },
    data: {
      maxAttempts,
    },
  });

  return { success: true, maxAttempts };
}

/**
 * Updates the `mode` and/or `individualizeByStudent` field of the assignment `contentId` that is owned by `loggedInUserId`.
 *
 * Verifies that `contentId` is not assigned as a part of another root assignment,
 * throwing an `InvalidRequestError` in that case.
 *
 * Creates a root assignment record for `contentId` if it doesn't exist.
 *
 * The mode can be updated only if the content is not assigned.
 */
export async function updateAssignmentSettings({
  contentId,
  mode,
  individualizeByStudent,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  mode?: AssignmentMode;
  individualizeByStudent?: boolean;
  loggedInUserId: Uint8Array;
}) {
  const isEditor = await getIsEditor(loggedInUserId);

  await prisma.content.update({
    where: {
      id: contentId,
      ...filterEditableActivity(loggedInUserId, isEditor),
    },
    data: {
      mode,
      individualizeByStudent,
    },
  });

  return { success: true, mode, individualizeByStudent };
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
        ...filterEditableContent(loggedInUserId),
        // ...filterEditableRootAssignment(loggedInUserId),
      },
    },
    data: { codeValidUntil: null },
  });
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
      contentId: Uint8Array;
      name: string;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, type, path) AS (
      SELECT id, parentId, type, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE ${parentId === null ? Prisma.sql`parentId IS NULL` : Prisma.sql`parentId = ${parentId}`}
      AND ownerId = ${loggedInUserId}
      AND (EXISTS(SELECT * FROM assignments WHERE rootContentId=content.id) or type = "folder") 
      AND isDeletedOn IS NULL
      UNION ALL
      SELECT c.id, c.parentId, c.type, CONCAT(ct.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ct
      ON c.parentId = ct.id
      WHERE (EXISTS(SELECT * FROM assignments WHERE rootContentId=c.id) or c.type = "folder") 
      AND c.isDeletedOn IS NULL
    )
    
    SELECT c.id as contentId, c.name FROM content AS c
    INNER JOIN content_tree AS ct
    ON ct.id = c.id
    WHERE ct.type != "folder" ORDER BY path
  `);

  let folder: {
    contentId: Uint8Array;
    name: string;
  } | null = null;

  if (parentId !== null) {
    const folderPrelim = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        type: "folder",
        ...filterEditableContent(loggedInUserId),
      },
      select: { id: true, name: true },
    });
    folder = folderPrelim
      ? { contentId: folderPrelim.id, name: folderPrelim.name }
      : null;
  }

  const assignmentScoresPrelim = await prisma.assignments.findMany({
    where: {
      rootContentId: { in: orderedActivities.map((a) => a.contentId) },
    },
    select: {
      rootContentId: true,
      assignmentScores: {
        orderBy: [
          { user: { lastNames: "asc" } },
          { user: { firstNames: "asc" } },
        ],
        select: {
          cachedScore: true,
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

  const assignmentScores: {
    contentId: Uint8Array;
    userScores: {
      score: number;
      user: {
        userId: Uint8Array<ArrayBufferLike>;
        email: string;
        firstNames: string | null;
        lastNames: string;
      };
    }[];
  }[] = [];

  for (const assignment of assignmentScoresPrelim) {
    const userScores: {
      score: number;
      user: {
        userId: Uint8Array<ArrayBufferLike>;
        email: string;
        firstNames: string | null;
        lastNames: string;
      };
    }[] = [];
    for (const scoreObj of assignment.assignmentScores) {
      let score = scoreObj.cachedScore;
      if (score === null) {
        const calcResults = await calculateScoreAndCacheResults({
          contentId: assignment.rootContentId,
          requestedUserId: scoreObj.user.userId,
          loggedInUserId,
        });

        if (calcResults.calculatedScore) {
          score = calcResults.score;
        } else {
          throw Error("Invalid data. Could not calculate score for student");
        }
      }
      userScores.push({
        score,
        user: scoreObj.user,
      });
    }
    assignmentScores.push({
      contentId: assignment.rootContentId,
      userScores,
    });
  }

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
 * - studentAssignmentScores: information on the student
 * - orderedActivities: the ordered list of all activities in the folder (and subfolders)
 *   along with the student's score, if it exists
 */
export async function getStudentAssignmentScores({
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

  const orderedCachedScores = await prisma.$queryRaw<
    {
      contentId: Uint8Array;
      activityName: string;
      cachedScore: number | null;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, type, path) AS (
      SELECT id, parentId, type, CAST(LPAD(sortIndex+100000000000000000, 18, 0) AS CHAR(1000)) FROM content
      WHERE ${parentId === null ? Prisma.sql`parentId IS NULL` : Prisma.sql`parentId = ${parentId}`}
      AND ownerId = ${loggedInUserId}
      AND (EXISTS(SELECT * FROM assignments WHERE rootContentId=content.id) or type = "folder") AND isDeletedOn IS NULL
      UNION ALL
      SELECT c.id, c.parentId, c.type, CONCAT(ct.path, ',', LPAD(c.sortIndex+100000000000000000, 18, 0))
      FROM content AS c
      INNER JOIN content_tree AS ct
      ON c.parentId = ct.id
      WHERE (EXISTS(SELECT * FROM assignments WHERE rootContentId=c.id) or c.type = "folder") AND c.isDeletedOn IS NULL
    )
    
    SELECT c.id AS contentId, c.name AS activityName, s.cachedScore FROM content AS c
    INNER JOIN content_tree AS ct
    ON ct.id = c.id
    LEFT JOIN (
        SELECT * FROM assignmentScores WHERE userId=${studentUserId}
        ) as s
    ON s.contentId  = c.id 
    WHERE ct.type != "folder" ORDER BY path
  `);

  const orderedActivityScores: {
    contentId: Uint8Array;
    activityName: string;
    score: number | null;
  }[] = [];

  for (const scoreObj of orderedCachedScores) {
    let score = scoreObj.cachedScore;
    if (score === null) {
      const calcResults = await calculateScoreAndCacheResults({
        contentId: scoreObj.contentId,
        requestedUserId: studentUserId,
        loggedInUserId,
      });

      if (calcResults.calculatedScore) {
        score = calcResults.score;
      } else {
        // don't have a score for student on this assessment
      }
    }
    orderedActivityScores.push({
      contentId: scoreObj.contentId,
      activityName: scoreObj.activityName,
      score,
    });
  }

  let folder: {
    contentId: Uint8Array;
    name: string;
  } | null = null;

  if (parentId !== null) {
    const preliminaryFolder = await prisma.content.findUniqueOrThrow({
      where: {
        id: parentId,
        type: "folder",
        ...filterEditableContent(loggedInUserId),
      },
      select: { id: true, name: true },
    });
    folder = preliminaryFolder
      ? { contentId: preliminaryFolder.id, name: preliminaryFolder.name }
      : null;
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
      assignment: { rootContent: { isDeletedOn: null } },
    },
    select: {
      contentId: true,
      cachedScore: true,
      assignment: {
        select: {
          rootContent: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { assignment: { rootContent: { createdAt: "asc" } } },
  });

  const orderedActivityScores: {
    contentId: Uint8Array;
    activityName: string;
    score: number;
  }[] = [];

  for (const scoreObj of scores) {
    let score = scoreObj.cachedScore;
    if (score === null) {
      const calcResults = await calculateScoreAndCacheResults({
        contentId: scoreObj.contentId,
        loggedInUserId,
      });

      if (calcResults.calculatedScore) {
        score = calcResults.score;
      } else {
        throw Error("Invalid data. Could not calculate score for student");
      }
    }

    orderedActivityScores.push({
      contentId: scoreObj.contentId,
      activityName: scoreObj.assignment.rootContent.name,
      score,
    });
  }

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
 * Get the data needed for `loggedInUserId` to take the assignment with `code`.
 *
 * If an open assignment with `code` is not found return:
 * - assignmentFound: `false`
 * - assignment: null
 *
 * Else, return
 * - assignmentFound: `true`
 * - assignment: the `Content` describing the found assignment
 * - scoreData: the scores that `loggedInUserId` has achieved so far on the assignment.
 *   See {@link getScore}.
 */
export async function getAssignmentViewerDataFromCode({
  code,
  loggedInUserId,
}: {
  code: string;
  loggedInUserId: Uint8Array;
}) {
  let preliminaryAssignment;

  // make sure that content is assigned and is either open or has data from `loggedInUserId`
  try {
    preliminaryAssignment = await prisma.content.findFirstOrThrow({
      where: {
        ...filterViewableRootAssignment(loggedInUserId),
        rootAssignment: {
          classCode: code,
        },
      },
      select: {
        id: true,
        ownerId: true,
        rootAssignment: { select: { codeValidUntil: true } },
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

  const assignment = await getContent({
    contentId: preliminaryAssignment.id,
    loggedInUserId,
    includeAssignInfo: true,
    skipPermissionCheck: true,
  });

  if (assignment.assignmentInfo?.assignmentStatus === "Closed") {
    return {
      assignmentFound: true,
      assignmentOpen: false,
      assignment: assignment,
    };
  }

  if (!isEqualUUID(loggedInUserId, preliminaryAssignment.ownerId)) {
    await recordContentView(assignment.contentId, loggedInUserId);
  }

  const scoreData = await getScore({
    contentId: assignment.contentId,
    loggedInUserId,
  });

  return {
    assignmentFound: true,
    assignmentOpen: true,
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
      isDeletedOn: null,
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
  const scoreSummary = await getScoresOfAllStudents({
    contentId,
    loggedInUserId,
  });

  const content = await getContent({
    contentId,
    loggedInUserId,
    includeAssignInfo: true,
  });

  const itemNames = getItemNames(content);

  return { scoreSummary, content, itemNames };
}

/**
 * Get the data for the view of the response of a single student on an assignment
 *
 * The data returned depends on whether or `attemptNumber` or `itemNumber` are specified.
 *
 * In all cases, returns the base data:
 * - mode: `formative` or `summative`
 * - user: the `UserInfo` for the student
 * - assignment: `name`, `type`, `contentId`, and `shuffledOrder` of the assignment, where `shuffledOrder`
 *   is `true` if the assignment is a sequence with `shuffle` set to `true`.
 * - overallScores: the return value of {@link getScores} for this student and assignment
 * - itemNames: list of item names (in original order) for the assignment
 * - allStudents: all students who have taken the assignment
 *
 * If `attemptNumber` or `itemNumber` are specified, then return information about the requested
 * attempt of the items. If `attemptNumber` is not specified, then use the attemptNumber with the best score.
 * If `itemNumber` is not specified, then use item number 1. Return, in addition to the base data:
 * - singleItemAttempt: `true`
 * - attemptNumber: the attempt number for which information is returned
 * - itemAttemptState: the state and score for the attempt of the item. See {@link getAttemptScoresAndState}.
 * - attemptScores: scores for all attempts. See {@link getAttemptScoresAndState}.
 * - itemScores: the overall items scores (for `formative`) or the scores for all items on the current attempt (for `summative`)
 * - content: information about the document specified in `itemAttemptState`
 * - responseCounts: on array of `[answerId, count]` pairs giving the number of responses submitted for `answerId`
 *   for the item attempt of `itemAttemptState`
 *
 * If neither `attemptNumber` or `itemNumber` are specified, then return summary information about
 * the student's responses to the assignment. Return, in addition to the base data:
 * - singleItemAttempt: `false`
 * - allAttemptScore: See the return of {@link getAllAttemptScores}.
 */
export async function getAssignmentResponseStudent({
  contentId,
  loggedInUserId,
  studentUserId,
  attemptNumber: requestedAttemptNumber,
  shuffledOrder,
  itemNumber: requestedItemNumber, // is either shuffledItemNumber or itemNumber, depending on `shuffledOrder`
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  studentUserId?: Uint8Array;
  attemptNumber?: number;
  shuffledOrder: boolean;
  itemNumber?: number;
}) {
  const responseUserId = studentUserId ?? loggedInUserId;

  // verify have access, get assignment info
  const assignment = await prisma.assignments.findUniqueOrThrow({
    where: {
      rootContentId: contentId,
      NOT: {
        codeValidStarting: null,
      },
      rootContent: {
        // if getting data for other person, you must be the owner
        ownerId: isEqualUUID(responseUserId, loggedInUserId)
          ? undefined
          : loggedInUserId,
        isDeletedOn: null,
        type: { not: "folder" },
      },
    },
    select: {
      codeValidUntil: true,
      rootContent: {
        select: {
          name: true,
          type: true,
          ownerId: true,
          numToSelect: true,
          shuffle: true,
          mode: true,
          children: {
            where: { isDeletedOn: null },
            orderBy: { sortIndex: "asc" },
            select: { name: true, type: true, numToSelect: true },
          },
        },
      },
    },
  });

  const isOpen = assignment.codeValidUntil
    ? DateTime.now() <= DateTime.fromJSDate(assignment.codeValidUntil)
    : false;

  const { user } = await getMyUserInfo({ loggedInUserId: responseUserId });

  const overallScores = await getScore({
    contentId,
    requestedUserId: responseUserId,
    loggedInUserId,
  });

  if (!overallScores.calculatedScore) {
    throw new InvalidRequestError("Responses not found", StatusCodes.NOT_FOUND);
  }

  const haveItems =
    overallScores.itemScores && overallScores.itemScores.length > 0;

  const rootContent = assignment.rootContent;
  const itemNames = getItemNames(rootContent);

  const allStudents: {
    userId: Uint8Array<ArrayBufferLike>;
    lastNames: string;
    firstNames: string | null;
  }[] = [];

  // If user is the owner, then get list of all students
  if (isEqualUUID(loggedInUserId, assignment.rootContent.ownerId)) {
    const allStudentsPrelim = await prisma.assignmentScores.findMany({
      where: { contentId },
      orderBy: [
        { user: { lastNames: "asc" } },
        { user: { firstNames: "asc" } },
      ],
      select: {
        user: {
          select: {
            firstNames: true,
            lastNames: true,
            userId: true,
          },
        },
      },
    });

    allStudents.push(...allStudentsPrelim.map((asp) => asp.user));
  }

  const baseData = {
    mode: assignment.rootContent.mode,
    user,
    assignment: {
      name: rootContent.name,
      type: rootContent.type,
      contentId,
      shuffledOrder: rootContent.type == "sequence" && rootContent.shuffle,
      isOpen,
    },
    overallScores,
    itemNames,
    allStudents,
  };

  if (
    requestedItemNumber !== undefined ||
    requestedAttemptNumber !== undefined
  ) {
    const { attemptNumber, attemptScores, itemAttemptState } =
      await getAttemptScoresAndState({
        contentId,
        mode: assignment.rootContent.mode,
        haveItems,
        userId: responseUserId,
        shuffledOrder,
        requestedItemNumber,
        requestedAttemptNumber,
      });

    let itemScores: ItemScores = [];
    if (haveItems) {
      if (assignment.rootContent.mode === "formative") {
        // items scores for formative are just the overall item scores
        itemScores = overallScores.itemScores;
      } else {
        // item scores for summative are the scores for all items on the current attempt number
        itemScores = await prisma.contentItemState.findMany({
          where: {
            contentId,
            userId: responseUserId,
            contentAttemptNumber: attemptNumber,
            itemAttemptNumber: 1,
          },
          orderBy: shuffledOrder
            ? { shuffledItemNumber: "asc" }
            : { itemNumber: "asc" },
          select: {
            itemNumber: true,
            shuffledItemNumber: true,
            itemAttemptNumber: true,
            score: true,
          },
        });
      }
    }

    const content = await getContent({
      contentId: itemAttemptState.docId,
      loggedInUserId,
      includeAssignInfo: true,
      skipPermissionCheck: true,
    });

    const responseCounts = await getResponseCounts({
      contentId,
      mode: assignment.rootContent.mode,
      contentType: rootContent.type,
      requestedItemNumber,
      attemptNumber,
      shuffledOrder,
      userId: responseUserId,
    });

    return {
      singleItemAttempt: true as const,
      attemptNumber,
      itemAttemptState,
      attemptScores,
      itemScores,
      content,
      responseCounts,
      ...baseData,
    };
  } else {
    // No item number or attempt number requested.
    // Get overview data for the student

    const allAttemptScores = await getAllAttemptScores({
      contentId,
      mode: assignment.rootContent.mode,
      haveItems,
      userId: responseUserId,
      shuffledOrder,
    });
    return {
      singleItemAttempt: false as const,
      allAttemptScores,
      ...baseData,
    };
  }
}

/**
 * Get the scores and state of user `userId` on assignment `contentId` of item `requestedItemNumber` and attempt `requestedAttemptNumber.
 * The assignment's mode is given by `mode` and `shuffledOrder` is true if it is a `sequence` with `shuffle` set to `true`.
 * If 'haveItems` is `true`, the assignment has items.
 *
 * If `shuffledOrder` is true, then `requestedItemNumber` specifies the `shuffledItemNumber`; otherwise it specifies the `itemNumber`.
 *
 * If `requestedAttemptNumber` is not given, then find the attempt with the maximum score.
 *
 * Returns the fields
 * - attemptNumber: `requestedAttemptNumber` if specified, else the attempt with the maximum score
 * - itemAttemptState: the `state`, `score`, `variant`, and `docId` for the requested item attempt.
 *   If `contentId` is not a single doc, then it also includes the `itemNumber` and `shuffledItemNumber` of the item.
 * - attemptScores: the `attemptNumber` and `score` for each attempt. The score is computed differently depending on assignment `mode`.
 *   For `formative` assignments with items, the attempt's `score` is the item's score for that attempt.
 *   Otherwise, the attempt's `score` is the overall score for the attempt (averaging over items if they exist).
 */
async function getAttemptScoresAndState({
  contentId,
  mode,
  haveItems,
  userId,
  shuffledOrder,
  requestedItemNumber = 1,
  requestedAttemptNumber,
}: {
  contentId: Uint8Array;
  mode: AssignmentMode;
  haveItems: boolean;
  userId: Uint8Array;
  shuffledOrder: boolean;
  requestedItemNumber?: number;
  requestedAttemptNumber?: number;
}) {
  let attemptScores: { attemptNumber: number; score: number }[];
  let attemptNumber: number;
  let itemAttemptState: {
    state: string | null;
    score: number;
    variant: number;
    docId: Uint8Array;
    itemNumber?: number;
    shuffledItemNumber?: number;
  };

  if (haveItems && mode === "formative") {
    // A formative attempt with items.
    // Get scores for requestedItemNumber on all item attempts for contentAttemptNumber 1.
    const allAttemptData = await prisma.contentItemState.findMany({
      // don't need to check user permissions since first query did that
      where: {
        contentId,
        userId,
        contentAttemptNumber: 1,
        itemNumber: shuffledOrder ? undefined : requestedItemNumber,
        shuffledItemNumber: shuffledOrder ? requestedItemNumber : undefined,
      },
      orderBy: { itemAttemptNumber: "asc" },
      select: {
        itemAttemptNumber: true,
        score: true,
      },
    });

    attemptScores = allAttemptData.map((a) => ({
      attemptNumber: a.itemAttemptNumber,
      score: a.score,
    }));

    if (requestedAttemptNumber !== undefined) {
      attemptNumber = requestedAttemptNumber;
    } else {
      const maxScore = attemptScores.reduce((a, c) => Math.max(a, c.score), 0);
      const maxIndex = attemptScores.map((v) => v.score).lastIndexOf(maxScore);
      attemptNumber = attemptScores[maxIndex]?.attemptNumber ?? 1;
    }

    // Note: don't use loadState() as not getting a root assignment
    itemAttemptState = await prisma.contentItemState.findUniqueOrThrow({
      // don't need to check user permissions since first query did that
      where: shuffledOrder
        ? {
            contentId_userId_contentAttemptNumber_shuffledItemNumber_itemAttemptNumber:
              {
                contentId,
                userId,
                contentAttemptNumber: 1,
                shuffledItemNumber: requestedItemNumber,
                itemAttemptNumber: attemptNumber,
              },
          }
        : {
            contentId_userId_contentAttemptNumber_itemNumber_itemAttemptNumber:
              {
                contentId,
                userId,
                contentAttemptNumber: 1,
                itemNumber: requestedItemNumber,
                itemAttemptNumber: attemptNumber,
              },
          },
      select: {
        state: true,
        score: true,
        docId: true,
        variant: true,
        itemNumber: true,
        shuffledItemNumber: true,
      },
    });
  } else {
    // Have either a single doc (no items) or a summative assessment.
    // Get score on all content attempts.
    const allAttemptData = await prisma.contentState.findMany({
      // don't need to check user permissions since first query did that
      where: {
        contentId,
        userId,
      },
      orderBy: { attemptNumber: "asc" },
      select: {
        attemptNumber: true,
        score: true,
        contentItemStates: haveItems
          ? {
              where: { itemAttemptNumber: 1 },
              select: { score: true },
            }
          : false,
      },
    });

    attemptScores = allAttemptData.map((attempt) => {
      // if have items, score is the average over all items
      const score = haveItems
        ? attempt.contentItemStates.reduce((a, c) => a + c.score, 0) /
          attempt.contentItemStates.length
        : (attempt.score ?? 0);
      return { attemptNumber: attempt.attemptNumber, score };
    });

    if (requestedAttemptNumber !== undefined) {
      attemptNumber = requestedAttemptNumber;
    } else {
      const maxScore = attemptScores.reduce((a, c) => Math.max(a, c.score), 0);
      const maxIndex = attemptScores.map((v) => v.score).lastIndexOf(maxScore);
      attemptNumber = attemptScores[maxIndex].attemptNumber;
    }

    if (haveItems) {
      // Note: don't use loadState() as not getting a root assignment
      itemAttemptState = await prisma.contentItemState.findUniqueOrThrow({
        // don't need to check user permissions since first query did that
        where: shuffledOrder
          ? {
              contentId_userId_contentAttemptNumber_shuffledItemNumber_itemAttemptNumber:
                {
                  contentId,
                  userId,
                  contentAttemptNumber: attemptNumber,
                  shuffledItemNumber: requestedItemNumber,
                  itemAttemptNumber: 1,
                },
            }
          : {
              contentId_userId_contentAttemptNumber_itemNumber_itemAttemptNumber:
                {
                  contentId,
                  userId,
                  contentAttemptNumber: attemptNumber,
                  itemNumber: requestedItemNumber,
                  itemAttemptNumber: 1,
                },
            },
        select: {
          state: true,
          score: true,
          docId: true,
          variant: true,
          itemNumber: true,
          shuffledItemNumber: true,
        },
      });
    } else {
      // no items, so single document
      // use score from the contentState table

      const { state, score, variant } =
        await prisma.contentState.findUniqueOrThrow({
          where: {
            contentId_userId_attemptNumber: {
              contentId,
              userId,
              attemptNumber,
            },
          },
          select: { state: true, score: true, variant: true },
        });
      itemAttemptState = {
        state,
        score: score ?? 0,
        docId: contentId,
        variant,
      };
    }
  }
  return { attemptNumber, attemptScores, itemAttemptState };
}

/**
 * Get the number of responses student `userId` submitted to all answers blanks of attempt `attemptNumber` of item `requestedItemNumber`
 * of assignment `contentId`. The assignment's mode and type are given by `mode` and `contentType`;
 * `shuffledOrder` is true if it is a `sequence` with `shuffle` set to `true`.
 *
 * If `formative` with items, then `attemptNumber` refers to the item attempt number; otherwise it refers to the content attempt number.
 *
 * If `shuffledOrder` is `true`, then `requestedItemNumber` refers to `shuffledItemNumber`; other it refers to `itemNumber`.
 *
 * Returns: an array with entries `[answerCode,count]` that gives the number of responses submitted to `answerCode`.
 */
async function getResponseCounts({
  contentId,
  mode,
  contentType,
  requestedItemNumber = 1,
  attemptNumber,
  shuffledOrder,
  userId,
}: {
  contentId: Uint8Array;
  mode: AssignmentMode;
  contentType: ContentType;
  requestedItemNumber?: number;
  attemptNumber: number;
  shuffledOrder: boolean;
  userId: Uint8Array;
}) {
  const [contentAttemptNumber, itemAttemptNumber] =
    contentType === "singleDoc"
      ? [attemptNumber, null]
      : mode === "formative"
        ? [1, attemptNumber]
        : [attemptNumber, 1];

  const responseCountsPrelim = await prisma.submittedResponses.groupBy({
    where: {
      contentId,
      itemNumber: shuffledOrder ? undefined : requestedItemNumber,
      shuffledItemNumber: shuffledOrder ? requestedItemNumber : undefined,
      contentAttemptNumber,
      itemAttemptNumber,
      userId,
    },
    by: ["answerId", "shuffledItemNumber"],
    orderBy: { shuffledItemNumber: "asc" },
    _count: { response: true },
  });

  const responseCounts = responseCountsPrelim.map((r) => [
    r.answerId,
    r._count.response,
  ]);
  return responseCounts;
}

/**
 * Returns information about all attempts of user `userId` on assignment `contentId`. The assignment's mode is given by `mode`
 * and `shuffledOrder` is true if it is a `sequence` with `shuffle` set to `true`.
 *
 * Returns an object whose fields depend on the assessment mode and type as follows.
 *
 * For `formative` assessments with items, `getAllAttemptScores` summarizes the score for each item. It has `byItem` set to `true`
 * and has `itemAttemptScores`, which is an array for each item, sorted by `shuffledItemNumber` if `shuffledOrder` is `true`,
 * otherwise sorted by `itemNumber`. Each entry of the `itemAttemptScores` array has these fields
 * - itemNumber: the original item number
 * - shuffledItemNumber: the shuffled item number
 * - attempts: an array giving information (`itemAttemptNumber` and `score`) about each attempt of the item.
 *
 * For `summative` assessments or assessments without items, `getAllAttemptScores` summarizes the score for each attempt.
 * It has `byItem` set to `false` and has `attemptScores`, which is an array with an entry for each attempt. Each entry has the fields:
 * - attemptNumber
 * - score: score for the attempt number (averaged over items, if they exist)
 * - items: an array for each item, sorted by `shuffledItemNumber` if `shuffledOrder` is `true`, otherwise sorted by `itemNumber`.
 *   Each entry of `items` has the fields `score`, `itemNumber`, and `shuffledItemNumber`.
 */
async function getAllAttemptScores({
  contentId,
  mode,
  haveItems,
  userId,
  shuffledOrder,
}: {
  contentId: Uint8Array;
  mode: AssignmentMode;
  haveItems: boolean;
  userId: Uint8Array;
  shuffledOrder: boolean;
}) {
  if (haveItems && mode === "formative") {
    // A formative attempt with items.
    // Get scores for all items and all item attempt numbers, with contentAttemptNumber = 1
    const allAttemptData = await prisma.contentItemState.findMany({
      // don't need to check user permissions since first query did that
      where: {
        contentId,
        userId,
        contentAttemptNumber: 1,
      },
      orderBy: [
        shuffledOrder ? { shuffledItemNumber: "asc" } : { itemNumber: "asc" },
        { itemAttemptNumber: "asc" },
      ],
      select: {
        itemNumber: true,
        shuffledItemNumber: true,
        itemAttemptNumber: true,
        score: true,
      },
    });

    const itemAttemptScores: {
      itemNumber: number;
      shuffledItemNumber: number;
      attempts: { itemAttemptNumber: number; score: number }[];
    }[] = [];

    for (const itemAttempt of allAttemptData) {
      const itemIdx =
        (shuffledOrder
          ? itemAttempt.shuffledItemNumber
          : itemAttempt.itemNumber) - 1;
      if (itemAttemptScores[itemIdx] === undefined) {
        itemAttemptScores[itemIdx] = {
          itemNumber: itemAttempt.itemNumber,
          shuffledItemNumber: itemAttempt.shuffledItemNumber,
          attempts: [],
        };
      }
      itemAttemptScores[itemIdx].attempts.push({
        itemAttemptNumber: itemAttempt.itemAttemptNumber,
        score: itemAttempt.score,
      });
    }

    return { byItem: true as const, itemAttemptScores };
  } else {
    // Have either a single doc (no items) or a summative assessment.
    // Get score on all content attempts.
    const allAttemptData = await prisma.contentState.findMany({
      // don't need to check user permissions since first query did that
      where: {
        contentId,
        userId,
      },
      orderBy: { attemptNumber: "asc" },
      select: {
        attemptNumber: true,
        score: true,
        contentItemStates: {
          where: { itemAttemptNumber: 1 },
          orderBy: shuffledOrder
            ? { shuffledItemNumber: "asc" }
            : { itemNumber: "asc" },
          select: {
            itemNumber: true,
            shuffledItemNumber: true,
            score: true,
          },
        },
      },
    });

    const attemptScores = allAttemptData.map((attempt) => {
      // if have items, score is the average over all items
      const score = haveItems
        ? attempt.contentItemStates.reduce((a, c) => a + c.score, 0) /
          attempt.contentItemStates.length
        : (attempt.score ?? 0);
      return {
        attemptNumber: attempt.attemptNumber,
        score,
        items: attempt.contentItemStates,
      };
    });

    return { byItem: false as const, attemptScores };
  }
}

/** Get a list of the names of the documents/selects in `content`, in original order. */
function getItemNames(
  content:
    | Content
    | {
        name: string;
        type: ContentType;
        numToSelect: number;
        children: {
          name: string;
          type: ContentType;
          numToSelect: number;
        }[];
      },
) {
  const itemNames: string[] = [];

  if (content.type === "select") {
    if (content.numToSelect === 1) {
      itemNames.push(content.name);
    } else {
      for (let i = 1; i <= content.numToSelect; i++) {
        itemNames.push(`${content.name} (${i})`);
      }
    }
  } else if (content.type === "sequence") {
    for (const child of content.children) {
      if (child.type === "singleDoc") {
        itemNames.push(child.name);
      } else if (child.type === "select") {
        if (child.numToSelect === 1) {
          itemNames.push(child.name);
        } else {
          for (let i = 1; i <= child.numToSelect; i++) {
            itemNames.push(`${child.name} (${i})`);
          }
        }
      }
    }
  }

  return itemNames;
}

/**
 * Get the list of responses that student `studentUserId` submitted to `answerId` of `contentAttemptNumber` of assignment `contentId`.
 * If `requestedItemNumber` and `itemAttemptNumber` are provided, then filter with those parameters,
 * where `requestedItemNumber` refers to `shuffledItemNumber` if `shuffledOrder` is `true`, else it refers to `itemNumber`.
 *
 * If `loggedInUserId` is not `studentUserId`, then return results only if `loggedInUserId` is the owner of `contentId`.
 *
 * Returns:
 * - responses: an array `response`, `creditAchieved` and `submittedAt`, with one entry per response.
 */
export async function getStudentSubmittedResponses({
  contentId,
  studentUserId,
  loggedInUserId,
  requestedItemNumber,
  shuffledOrder,
  answerId,
  contentAttemptNumber,
  itemAttemptNumber = null,
}: {
  contentId: Uint8Array;
  studentUserId?: Uint8Array;
  loggedInUserId: Uint8Array;
  requestedItemNumber?: number;
  shuffledOrder: boolean;
  answerId: string;
  contentAttemptNumber: number;
  itemAttemptNumber?: number | null;
}) {
  const responseUserId = studentUserId ?? loggedInUserId;

  // verify have access, get info
  const responses = await prisma.content.findUniqueOrThrow({
    where: {
      id: contentId,
      ownerId: isEqualUUID(responseUserId, loggedInUserId)
        ? undefined
        : loggedInUserId,
      isDeletedOn: null,
    },
    select: {
      submittedResponses: {
        where: {
          userId: responseUserId,
          itemNumber: shuffledOrder ? undefined : requestedItemNumber,
          shuffledItemNumber: shuffledOrder ? requestedItemNumber : undefined,
          answerId,
          contentAttemptNumber,
          itemAttemptNumber,
        },
        select: {
          response: true,
          answerCreditAchieved: true,
          submittedAt: true,
        },
      },
    },
  });

  return { responses: responses.submittedResponses };
}
