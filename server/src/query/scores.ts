import { prisma } from "../model";
import { isEqualUUID } from "../utils/uuid";
import { Prisma } from "@prisma/client";
import { InvalidRequestError } from "../utils/error";
import { filterEditableActivity } from "../utils/permissions";

// TODO: do we still save score and state if assignment isn't open?
// If not, how do we communicate that fact

/**
 * Save the `score` and `state` of assignment `contentId` for `loggedInUserId`.
 * The specified `attemptNumber` must be the latest attempt of `loggedInUserId`
 * (otherwise an `InvalidRequestError` is thrown).
 *
 * If `item` is specified, then also save the `score` and `state` of `itemNumber`,
 * or, if not specified, then `shuffledItemNumber`, throwing an `itemAttemptNumber` if neither specified.
 * The specified `itemAttemptNumber` must be the latest attempt of `loggedInUserId`
 * (otherwise an `InvalidRequestError` is thrown).
 * The `shuffledItemNumber` is the possibly reordered number for `itemNumber`.
 */
export async function saveScoreAndState({
  contentId,
  code,
  loggedInUserId,
  attemptNumber,
  score,
  state,
  item,
}: {
  contentId: Uint8Array;
  code: string;
  loggedInUserId: Uint8Array;
  attemptNumber: number;
  score: number | null;
  state: string;
  item?: {
    itemNumber?: number;
    shuffledItemNumber?: number;
    itemAttemptNumber: number;
    shuffledItemOrder: number[];
    score: number;
    state: string;
  };
}) {
  let itemNumber = 0;
  if (item) {
    // check item number first to throw error before any database changes are made
    itemNumber =
      item.itemNumber ??
      item.shuffledItemOrder.indexOf(item.shuffledItemNumber ?? 0) + 1;

    if (itemNumber === 0) {
      throw new InvalidRequestError(
        "A valid itemNumber or shuffledItemNumber must be supplied",
      );
    }

    if (score !== null) {
      throw new InvalidRequestError(
        "If an item is supplied, then the overall score cannot be supplied",
      );
    }
  } else if (score === null) {
    throw new InvalidRequestError(
      "If an item is not supplied, then the overall score must be supplied",
    );
  }

  const assignment = await prisma.assignments.findUniqueOrThrow({
    where: {
      rootContentId: contentId,
      assigned: true,
      classCode: code,
    },
    select: {
      mode: true,
      contentState: {
        distinct: ["contentId", "userId"],
        where: { userId: loggedInUserId },
        orderBy: { attemptNumber: "desc" },
        select: { attemptNumber: true },
      },
    },
  });

  let maxAttemptNumber = assignment.contentState[0]?.attemptNumber ?? 0;

  if (maxAttemptNumber === 0 && attemptNumber == 1) {
    // Perform queries to create the first attempt records.
    // If later queries fail, it's OK that these records were created,
    // as we're not saving score or state

    await prisma.contentState.create({
      data: {
        contentId,
        userId: loggedInUserId,
        attemptNumber: 1,
      },
    });

    if (item) {
      // if this is the first time that state was saved,
      // create a record in contentItemState for each item
      await prisma.contentItemState.createMany({
        data: item.shuffledItemOrder.map((shuffledNum, idx) => ({
          contentId,
          userId: loggedInUserId,
          contentAttemptNumber: 1,
          itemNumber: idx + 1,
          itemAttemptNumber: 1,
          shuffledItemNumber: shuffledNum,
        })),
      });
    }

    maxAttemptNumber = 1;
  }

  if (attemptNumber !== maxAttemptNumber) {
    throw new InvalidRequestError(
      "Cannot save score and state to non-maximal attempt number",
    );
  }

  if (item) {
    // Before actually update any score/state data, make sure have a valid itemAttemptNumber
    const maxItemResult = await prisma.contentItemState.aggregate({
      where: {
        contentId,
        userId: loggedInUserId,
        contentAttemptNumber: attemptNumber,
        itemNumber,
      },
      _max: {
        itemAttemptNumber: true,
      },
    });

    const maxItemAttemptNumber = maxItemResult._max.itemAttemptNumber ?? 0;

    if (
      item.itemAttemptNumber !== maxItemAttemptNumber &&
      !(item.itemAttemptNumber === 1 && maxItemAttemptNumber === 0)
    ) {
      throw new InvalidRequestError(
        "Cannot save score and state to non-maximal item attempt number",
      );
    }

    const shuffledItemNumber = item.shuffledItemOrder[itemNumber - 1];

    // perform all score/state updates for activity and item in a single transaction
    await prisma.contentState.update({
      where: {
        contentId_userId_attemptNumber: {
          contentId,
          userId: loggedInUserId,
          attemptNumber,
        },
      },
      data: {
        score,
        state,
        contentItemStates: {
          upsert: {
            where: {
              contentId_userId_contentAttemptNumber_itemNumber_itemAttemptNumber:
                {
                  contentId,
                  userId: loggedInUserId,
                  contentAttemptNumber: attemptNumber,
                  itemNumber,
                  itemAttemptNumber: item!.itemAttemptNumber,
                },
            },
            update: {
              score: item.score,
              state: item.state,
              shuffledItemNumber,
            },
            create: {
              itemNumber,
              itemAttemptNumber: item.itemAttemptNumber,
              score: item.score,
              state: item.state,
              shuffledItemNumber,
            },
          },
        },
      },
    });
  } else {
    // no items, update activity score/state
    await prisma.contentState.update({
      where: {
        contentId_userId_attemptNumber: {
          contentId,
          userId: loggedInUserId,
          attemptNumber,
        },
      },
      data: {
        score,
        state,
      },
    });
  }

  return await getScore({ contentId, loggedInUserId });
}

/**
 * Create a new attempt of assignment `contentId` for `loggedInUserId`, assuming `code` matches.
 *
 * The behavior depends on whether or not `itemNumber` is specified and it must correspond to the assignment mode as follows:
 * - If the assignment mode is "formative", then `itemNumber` must be supplied to create a new attempt of just that item.
 * - If the assignment mode is "summative", then `itemNumber` must not be supplied to create an new attempt of the entire activity.
 *
 * If the presence of `itemNumber` does not match the assignment mode, then an `InvalidRequestError` is thrown,
 * with the exception that singleDoc assignments don't require `itemNumber` even if the assignment mode is "formative".
 *
 * If `shuffledItemOrder` is specified, then:
 * - if `itemNumber` is not specified, create new item attempts for all items with `shuffledItemNumber`
 *   as given by `shuffledItemOrder`.
 * - if `itemNumber` is specified, then use its `shuffledItemNumber` determined by `shuffledItemOrder`
 *
 * If `itemNumber` is specified but not `shuffledItemOrder`, then an `InvalidRequestError` is thrown.
 */
export async function createNewAttempt({
  contentId,
  code,
  loggedInUserId,
  itemNumber,
  shuffledItemNumber,
  shuffledItemOrder,
}: {
  contentId: Uint8Array;
  code: string;
  loggedInUserId: Uint8Array;
  itemNumber?: number;
  shuffledItemNumber?: number;
  shuffledItemOrder?: number[];
}) {
  const assignment = await prisma.assignments.findUniqueOrThrow({
    where: {
      rootContentId: contentId,
      assigned: true,
      classCode: code,
    },
    select: {
      mode: true,
      maxAttempts: true,
      rootContent: { select: { type: true } },
      contentState: {
        distinct: ["contentId", "userId"],
        where: { userId: loggedInUserId },
        orderBy: { attemptNumber: "desc" },
        select: { attemptNumber: true },
      },
    },
  });

  if (assignment.mode === "formative") {
    if (
      itemNumber === undefined &&
      shuffledItemNumber === undefined &&
      assignment.rootContent.type !== "singleDoc"
    ) {
      throw new InvalidRequestError(
        "Formative assessments do not support creating new attempts of entire activity",
      );
    }
  } else if (itemNumber !== undefined || shuffledItemNumber !== undefined) {
    throw new InvalidRequestError(
      "Summative assessments do not support creating new attempts of single items",
    );
  }

  let maxAttemptNumber = assignment.contentState[0]?.attemptNumber ?? 0;

  if (maxAttemptNumber === 0) {
    // If no attempt made yet, create attempt 1
    // optionally with related records for items (if shuffledItemOrder if given).
    // It's OK if this query runs and later this function fails, as having attempt number 1 doesn't change the actual behavior.

    await prisma.contentState.create({
      data: {
        contentId,
        userId: loggedInUserId,
        attemptNumber: 1,
        score: shuffledItemOrder ? null : 0,
        contentItemStates: {
          create: shuffledItemOrder?.map((shuffledNum, idx) => ({
            itemNumber: idx + 1,
            itemAttemptNumber: 1,
            shuffledItemNumber: shuffledNum,
          })),
        },
      },
    });

    maxAttemptNumber++;
  }

  if (itemNumber === undefined && shuffledItemNumber === undefined) {
    // create a new attempt of the entire activity,
    // optionally with related records for items (if shuffledItemOrder if given)

    if (
      assignment.maxAttempts > 0 &&
      maxAttemptNumber >= assignment.maxAttempts
    ) {
      throw new InvalidRequestError(
        "Cannot create new attempt; maximum number of attempts exceeded",
      );
    }

    await prisma.contentState.create({
      data: {
        contentId,
        userId: loggedInUserId,
        attemptNumber: maxAttemptNumber + 1,
        score: shuffledItemOrder ? null : 0,
        contentItemStates: {
          create: shuffledItemOrder?.map((shuffledNum, idx) => ({
            itemNumber: idx + 1,
            itemAttemptNumber: 1,
            shuffledItemNumber: shuffledNum,
          })),
        },
      },
    });
  } else {
    // create a new attempt of just item `itemNumber` or `shuffleItemNumber`

    if (shuffledItemOrder === undefined) {
      throw new InvalidRequestError(
        "Cannot create a new item attempt without specifying shuffledItemOrder",
      );
    }

    if (itemNumber === undefined) {
      itemNumber = shuffledItemOrder.indexOf(shuffledItemNumber!) + 1;

      if (itemNumber === 0) {
        throw new InvalidRequestError(
          "An invalid shuffledItemNumber was supplied",
        );
      }
    }

    const maxResItem = await prisma.contentItemState.aggregate({
      where: {
        contentId,
        userId: loggedInUserId,
        contentAttemptNumber: maxAttemptNumber,
        itemNumber,
      },
      _max: {
        itemAttemptNumber: true,
      },
    });

    const maxItemAttemptNumber = maxResItem._max.itemAttemptNumber;

    if (maxItemAttemptNumber === null) {
      throw new InvalidRequestError(
        "Cannot create a new attempt of an item that doesn't exist",
      );
    }

    if (
      assignment.maxAttempts > 0 &&
      maxItemAttemptNumber >= assignment.maxAttempts
    ) {
      throw new InvalidRequestError(
        "Cannot create new attempt of item; maximum number of attempts exceeded",
      );
    }

    await prisma.contentItemState.create({
      data: {
        contentId,
        userId: loggedInUserId,
        contentAttemptNumber: maxAttemptNumber,
        itemNumber,
        itemAttemptNumber: maxItemAttemptNumber + 1,
        shuffledItemNumber: shuffledItemOrder[itemNumber - 1],
      },
    });
  }

  return await getScore({ contentId, loggedInUserId });
}

/**
 * Load the state and score for `attemptNumber` of assignment `contentId` by `requestedUserId`,
 * defaulting to `loggedInUserId` if `requestedUserId` is not specified.
 * If `attemptNumber` is not specified, load state from the latest attempt.
 *
 * If `requestedUserId` is specified to be different from `loggedInUserId`,
 * the state will be loaded only if `loggedInUserId` is the owner of `contentId`.
 *
 * Also loads any item state and score from the latest `itemAttemptNumber` associated with `attemptNumber`,
 * ordered by their `shuffledItemNumber`.
 *
 * Returns:
 * - loadedState: `true` if succeeded in loading state
 * If `loadedState` is `true`, then also returns:
 * - attemptNumber: the attempt number for which the state was loaded
 * - score: the user's score on this attempt
 * - state: the user's state for this attempt, or `null` if no state
 * - items: an array of `itemNumber`, `shuffledItemNumber`, `itemAttemptNumber`, `score`, and `state`
 *   where `shuffledItemNumber` is consecutive and entries of `null` are substituted for any missing `shuffledItemNumber`
 */
export async function loadState({
  contentId,
  requestedUserId,
  loggedInUserId,
  attemptNumber,
}: {
  contentId: Uint8Array;
  requestedUserId?: Uint8Array;
  loggedInUserId: Uint8Array;
  attemptNumber?: number;
}) {
  const stateUserId = requestedUserId ?? loggedInUserId;

  try {
    await prisma.assignments.findUniqueOrThrow({
      where: {
        rootContentId: contentId,
        rootContent: {
          // if getting data for other person, you must be the owner
          ownerId: isEqualUUID(stateUserId, loggedInUserId)
            ? undefined
            : loggedInUserId,
          isDeleted: false,
        },
      },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return { loadedState: false as const };
    } else {
      throw e;
    }
  }

  let contentState;
  if (attemptNumber) {
    try {
      contentState = await prisma.contentState.findUniqueOrThrow({
        where: {
          contentId_userId_attemptNumber: {
            contentId,
            userId: stateUserId,
            attemptNumber,
          },
        },
        select: {
          attemptNumber: true,
          state: true,
          score: true,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        return { loadedState: false as const };
      } else {
        throw e;
      }
    }
  } else {
    // If `attemptNumber` is not specified, attempt to load the latest attempt.

    const lastAttemptState = await prisma.contentState.findMany({
      where: { contentId, userId: stateUserId },
      orderBy: { attemptNumber: "desc" },
      distinct: ["contentId", "userId"],
      select: {
        attemptNumber: true,
        state: true,
        score: true,
      },
    });

    if (lastAttemptState.length !== 1) {
      return { loadedState: false as const };
    }

    contentState = lastAttemptState[0];
  }

  const itemState = await prisma.contentItemState.findMany({
    where: {
      contentId,
      userId: stateUserId,
      contentAttemptNumber: contentState.attemptNumber,
    },
    distinct: ["contentId", "userId", "contentAttemptNumber", "itemNumber"],
    orderBy: [{ shuffledItemNumber: "asc" }, { itemAttemptNumber: "desc" }],
    select: {
      itemNumber: true,
      itemAttemptNumber: true,
      shuffledItemNumber: true,
      state: true,
      score: true,
    },
  });

  if (itemState.length > 0) {
    // If have items, the `score` field on `contentState` is ignored.
    // Instead, we calculate the score as the average of the items.

    const score =
      itemState.reduce((a, c) => a + (c?.score ?? 0), 0) / itemState.length;

    contentState.score = score;
  }

  return {
    loadedState: true as const,
    ...contentState,
    items: itemState,
  };
}

/**
 * Load the state and score for one item of `contentAttemptNumber` of assignment `contentId` by `requestedUserId`,
 * defaulting to `loggedInUserId` if `requestedUserId` is not specified.
 * If `contentAttemptNumber` is not specified, load state from the last attempt.
 *
 * The item returned is determined by `itemNumber`, if defined, else `shuffledItemNumber`,
 * loading for item number 1 if neither was supplied.
 * Item state from `itemAttemptNumber` is loading, loading state from the last item attempt if not specified.
 *
 * If `requestedUserId` is specified to be different from `loggedInUserId`,
 * the state will be loaded only if `loggedInUserId` is the owner of `contentId`.
 *
 * Returns:
 * - loadedState: `true` if succeeded in loading state
 * If `loadedState` is `true`, then also returns:
 * - contentAttemptNumber: the attempt number of the activity for which the state was loaded
 * - itemAttemptNumber: the attempt number of the item for which state was loaded
 * - itemNumber: the (original, unshuffled) item number of the item for which state was loaded
 * - shuffledItemNumber: the potentially shuffled item number of the order the student viewed
 * - score: the user's score on this attempt of the item
 * - state: the user's state for this attempt of the item, or `null` if no state
 */
export async function loadItemState({
  contentId,
  requestedUserId,
  loggedInUserId,
  contentAttemptNumber,
  itemNumber,
  shuffledItemNumber,
  itemAttemptNumber,
}: {
  contentId: Uint8Array;
  requestedUserId?: Uint8Array;
  loggedInUserId: Uint8Array;
  contentAttemptNumber?: number;
  itemNumber?: number;
  shuffledItemNumber?: number;
  itemAttemptNumber?: number;
}) {
  const stateUserId = requestedUserId ?? loggedInUserId;

  if (itemNumber === undefined) {
    if (shuffledItemNumber === undefined) {
      // if both item numbers are undefined, get itemNumber 1
      itemNumber = 1;
    }
  } else if (shuffledItemNumber !== undefined) {
    // if both item numbers are defined, just use itemNumber
    shuffledItemNumber = undefined;
  }

  // it attemptNumber was not supplied, find the maximum attempt number, defaulting to 1 if not attempts taken
  if (contentAttemptNumber === undefined) {
    const maxResult = await prisma.contentState.aggregate({
      where: {
        contentId,
        userId: loggedInUserId,
      },
      _max: {
        attemptNumber: true,
      },
    });

    contentAttemptNumber = maxResult._max.attemptNumber ?? 1;
  }

  const contentStateWhere = {
    assignment: {
      rootContent: {
        // if getting data for other person, you must be the owner
        ownerId: isEqualUUID(stateUserId, loggedInUserId)
          ? undefined
          : loggedInUserId,
        isDeleted: false,
      },
    },
  };

  const select = {
    contentAttemptNumber: true,
    itemAttemptNumber: true,
    itemNumber: true,
    shuffledItemNumber: true,
    state: true,
    score: true,
  };

  let itemState;

  if (itemAttemptNumber) {
    try {
      if (itemNumber === undefined) {
        itemState = await prisma.contentItemState.findUniqueOrThrow({
          where: {
            contentId_userId_contentAttemptNumber_shuffledItemNumber_itemAttemptNumber:
              {
                contentId,
                userId: stateUserId,
                contentAttemptNumber: contentAttemptNumber,
                shuffledItemNumber: shuffledItemNumber!,
                itemAttemptNumber,
              },
            contentState: contentStateWhere,
          },
          select,
        });
      } else {
        itemState = await prisma.contentItemState.findUniqueOrThrow({
          where: {
            contentId_userId_contentAttemptNumber_itemNumber_itemAttemptNumber:
              {
                contentId,
                userId: stateUserId,
                contentAttemptNumber: contentAttemptNumber,
                itemNumber,
                itemAttemptNumber,
              },
            contentState: contentStateWhere,
          },
          select,
        });
      }
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        return { loadedState: false as const };
      } else {
        throw e;
      }
    }
  } else {
    // If `itemAttemptNumber` is not specified, attempt to load the latest attempt.

    const lastAttemptState = await prisma.contentItemState.findMany({
      where: {
        contentId,
        userId: stateUserId,
        contentAttemptNumber: contentAttemptNumber,
        itemNumber,
        shuffledItemNumber,
        contentState: contentStateWhere,
      },
      orderBy: { itemAttemptNumber: "desc" },
      distinct: ["contentId", "userId"],
      select,
    });

    if (lastAttemptState.length !== 1) {
      return { loadedState: false as const };
    }

    itemState = lastAttemptState[0];
  }

  return {
    loadedState: true as const,
    ...itemState,
  };
}

/**
 * Get the overall score, and item scores, if they exist on a formative assessment,
 * for assignment `contentId` by `requestedUserId`,
 * defaulting to `loggedInUserId` if `requestedUserId` is not specified.
 *
 * If `requestedUserId` is specified to be different from `loggedInUserId`,
 * the score will be loaded only if `loggedInUserId` is the owner of `contentId`.
 *
 * Returns:
 * - loadedScore: `true` if the score was loaded.
 * If `loadedScore` is `true`, then also return:
 * - score: the score on the assignment, the maximum score over all attempts
 * If the assignment mode is `formative`, then also return with the score:
 * - itemScores: an array of {itemNumber, shuffledItemNumber, score} objects giving the maximum score over all attempts
 *   for each consecutive shuffledItemNumber
 */
export async function getScore({
  contentId,
  requestedUserId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  requestedUserId?: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const scoreUserId = requestedUserId ?? loggedInUserId;

  let assignment;

  try {
    assignment = await prisma.assignments.findUniqueOrThrow({
      where: {
        rootContentId: contentId,
        rootContent: {
          // if getting data for other person, you must be the owner
          ownerId: isEqualUUID(scoreUserId, loggedInUserId)
            ? undefined
            : loggedInUserId,
          isDeleted: false,
        },
      },
      select: {
        mode: true,
        contentState: {
          distinct: ["contentId", "userId"],
          orderBy: { attemptNumber: "desc" },
          select: {
            attemptNumber: true,
          },
        },
      },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return { loadedScore: false as const };
    } else {
      throw e;
    }
  }

  const mode = assignment.mode;
  if (assignment.contentState.length !== 1) {
    return { loadedScore: false as const };
  }
  const latestAttemptNumber = assignment.contentState[0].attemptNumber;

  // Get the score for each attempt
  // For each attempt, also calculate the latest score for each item
  const scoreByAttemptPrelim = await prisma.contentState.findMany({
    where: { contentId, userId: scoreUserId },
    orderBy: { attemptNumber: "asc" },
    select: {
      score: true,
      contentItemStates: {
        distinct: ["contentId", "userId", "itemNumber"],
        orderBy: [{ shuffledItemNumber: "asc" }, { itemAttemptNumber: "desc" }],
        select: {
          itemNumber: true,
          shuffledItemNumber: true,
          itemAttemptNumber: true,
          score: true,
        },
      },
    },
  });

  if (scoreByAttemptPrelim.length === 0) {
    return { loadedScore: false as const };
  }

  // If we have items, then the score in the database should be null.
  // Replace that score with the average over items
  const scoreByAttempt = scoreByAttemptPrelim.map((sba) => {
    let score = sba.score;
    if (score === null) {
      score =
        sba.contentItemStates.reduce((a, c) => a + c.score, 0) /
        sba.contentItemStates.length;
    }
    return {
      ...sba,
      score,
    };
  });

  // In most cases, the score is the maximum over all attempts.
  let score = Math.max(...scoreByAttempt.map((sba) => sba.score));

  // If, however, have a formative assessment with items,
  // score instead is the average of the maximum score from each item (over all item attempts)
  let itemScores: {
    score: number;
    itemNumber: number;
    shuffledItemNumber: number;
  }[] = [];
  if (mode === "formative" && scoreByAttempt[0].contentItemStates.length > 0) {
    if (latestAttemptNumber !== 1) {
      throw Error(
        "Invalid data encountered. Should have only one attempt for a formative assessment with items",
      );
    }

    itemScores = await prisma.contentItemState.findMany({
      where: { contentId, userId: scoreUserId, contentAttemptNumber: 1 },
      distinct: ["contentId", "userId", "contentAttemptNumber", "itemNumber"],
      orderBy: [{ shuffledItemNumber: "asc" }, { score: "desc" }],
      select: {
        itemNumber: true,
        shuffledItemNumber: true,
        score: true,
      },
    });

    // For formative assessments with items, we calculate `score` as the average of the item scores
    score = itemScores.reduce((a, c) => a + c.score, 0) / itemScores.length;
  }

  // Next, calculate the score from just the latest attempt number
  const latestAttemptScore = scoreByAttempt[scoreByAttempt.length - 1];
  const latestItemScores = latestAttemptScore.contentItemStates;

  let latestScore = latestAttemptScore.score;
  if (latestItemScores.length > 0) {
    // for all assessments with items, the score for the latest attempt is the average of the latest item scores
    latestScore =
      latestItemScores.reduce((a, c) => a + c.score, 0) /
      latestItemScores.length;
  }

  const latestAttempt = {
    attemptNumber: latestAttemptNumber,
    score: latestScore,
    itemScores: latestItemScores,
  };

  if (mode === "summative") {
    return {
      loadedScore: true as const,
      score,
      latestAttempt,
    };
  } else {
    return {
      loadedScore: true as const,
      score,
      itemScores,
      latestAttempt,
    };
  }
}

/**
 * Given that `contentId` is owned by `loggedInUserId`,
 * return all the scores that students have achieved on `contentId`.
 *
 * @returns a Promise that resolves to an object with fields
 * - mode: the assignment mode (formative or summative)
 * - scores: an array with one entry per student that has taken `contentId`.
 *
 * Each element of the scores array is an object with fields
 * - user: a `UserInfo` object for the student
 * - score: the student's score on `contentId` (between 0 and 1), which is the maximum over all attempts
 *
 * If the assignment is in formative mode, then each element of the scores array also has the field
 * - itemScores: the `score` of the student on item `itemNumber`,
 *   where `itemNumber` is from the original (unshuffled) order and
 *   `score` is the maximum over all attempts on that item.
 */
export async function getScoresOfAllStudents({
  contentId,
  loggedInUserId,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
}) {
  const { mode } = await prisma.assignments.findUniqueOrThrow({
    where: {
      rootContentId: contentId,
      rootContent: filterEditableActivity(loggedInUserId),
    },
    select: { mode: true },
  });

  const assignmentScores = await prisma.contentState.findMany({
    // don't need to check user permissions since first query did that
    where: { contentId },
    distinct: ["contentId", "userId"],
    orderBy: [
      { user: { lastNames: "asc" } },
      { user: { firstNames: "asc" } },
      { score: "desc" },
    ],
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
      contentItemStates:
        mode === "formative"
          ? {
              // Note this query works because with formative mode,
              // there will be only one content attempt.
              // Due to the join with the above distinct and order,
              // this is actually calculating just the maximum items score
              // over all item attempts from the content attempt with maximal score.
              distinct: ["itemNumber"],
              orderBy: [{ itemNumber: "asc" }, { score: "desc" }],
              select: { itemNumber: true, score: true },
            }
          : false,
    },
  });

  return {
    mode,
    scores: assignmentScores.map((s) => {
      const itemScoresObj =
        mode === "formative" ? { itemScores: s.contentItemStates } : {};
      return {
        ...s,
        ...itemScoresObj,
      };
    }),
  };
}
