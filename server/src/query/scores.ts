import { prisma } from "../model";
import { isEqualUUID } from "../utils/uuid";
import { filterEditableActivity } from "../utils/permissions";
import { Prisma } from "@prisma/client";
import { InvalidRequestError } from "../utils/error";

// TODO: do we still save score and state if assignment isn't open?
// If not, how do we communicate that fact
export async function saveScoreAndState({
  contentId,
  loggedInUserId,
  attemptNumber,
  score,
  scoreByItem,
  state,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  attemptNumber: number;
  score: number;
  scoreByItem?: number[];
  state: string;
}) {
  // get previous scores, creating record if needed
  const prevScores = await prisma.assignmentScores.upsert({
    where: {
      contentId_userId: { contentId, userId: loggedInUserId },
    },
    update: {},
    create: { contentId, userId: loggedInUserId },
    select: { score: true, scoreByItem: true },
  });

  const maxRes = await prisma.contentState.aggregate({
    where: { contentId, userId: loggedInUserId },
    _max: {
      attemptNumber: true,
    },
  });
  const maxAttemptNumber = maxRes._max.attemptNumber;

  if (
    attemptNumber !== maxAttemptNumber &&
    !(attemptNumber === 1 && maxAttemptNumber === null)
  ) {
    throw new InvalidRequestError(
      "Cannot save score and state to non-maximal attempt number",
    );
  }

  const scoreByItemString = scoreByItem ? JSON.stringify(scoreByItem) : null;

  // if this is the first attempt and we have items, initialize item attempt numbers
  const newItemAttemptNumbersString =
    scoreByItem && maxAttemptNumber === null
      ? JSON.stringify(Array(scoreByItem.length).fill(1))
      : null;

  // add/update the activity state for this attempt
  await prisma.contentState.upsert({
    where: {
      contentId_userId_attemptNumber: {
        contentId,
        userId: loggedInUserId,
        attemptNumber,
      },
    },
    update: {
      score,
      scoreByItem: scoreByItemString,
      state,
    },
    create: {
      contentId,
      userId: loggedInUserId,
      attemptNumber: 1,
      contentAttemptNumber: 1,
      itemAttemptNumbers: newItemAttemptNumbersString,
      score,
      scoreByItem: scoreByItemString,
      state,
    },
  });

  // We don't update the actual score tables
  // unless the score increased

  const prevScoreByItemParsed = prevScores?.scoreByItem
    ? JSON.parse(prevScores.scoreByItem)
    : null;
  const prevScoreByItem = Array.isArray(prevScoreByItemParsed)
    ? prevScoreByItemParsed.map(Number)
    : null;

  const updateScores =
    score > prevScores.score ||
    (scoreByItem &&
      (prevScoreByItem === null ||
        scoreByItem.some((s, i) => s > prevScoreByItem[i])));

  if (updateScores) {
    let newScore = Math.max(score, prevScores.score);
    const newScoreByItem =
      scoreByItem === undefined
        ? null
        : prevScoreByItem === null
          ? scoreByItem
          : scoreByItem.map((s, i) => Math.max(s, prevScoreByItem[i]));
    if (newScoreByItem) {
      // for now, since we haven't added weights of the items,
      // we can calculate the score from newScoreByItem by taking the unweighted average
      newScore = Math.max(
        newScore,
        newScoreByItem.reduce((a, c) => a + c, 0) / newScoreByItem.length,
      );
    }
    await prisma.assignmentScores.update({
      where: {
        contentId_userId: { contentId, userId: loggedInUserId },
      },
      data: {
        score: newScore,
        scoreByItem: newScoreByItem ? JSON.stringify(newScoreByItem) : null,
      },
    });
  }
}

export async function createNewAttempt({
  contentId,
  loggedInUserId,
  itemNumber,
  numItems,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  itemNumber?: number;
  numItems?: number;
}) {
  // make sure have an assignmentScores record
  // so that can satisfy foreign key constraints on contentState
  await prisma.assignmentScores.upsert({
    where: {
      contentId_userId: { contentId, userId: loggedInUserId },
    },
    update: {},
    create: { contentId, userId: loggedInUserId },
  });

  const maxRes = await prisma.contentState.aggregate({
    where: { contentId, userId: loggedInUserId },
    _max: {
      attemptNumber: true,
    },
  });
  const maxAttemptNumber = maxRes._max.attemptNumber;

  const prevState =
    maxAttemptNumber === null
      ? null
      : await prisma.contentState.findUnique({
          where: {
            contentId_userId_attemptNumber: {
              contentId,
              userId: loggedInUserId,
              attemptNumber: maxAttemptNumber,
            },
          },
          select: {
            score: true,
            scoreByItem: true,
            contentAttemptNumber: true,
            itemAttemptNumbers: true,
          },
        });

  if (!prevState) {
    // A new attempt is being created before any state was saved.
    // Save a record to contentState for attemptNumber 1, contentAttemptNumber 1
    const itemAttemptNumbers = numItems
      ? JSON.stringify(Array(numItems).fill(1))
      : null;
    const scoreByItem = numItems
      ? JSON.stringify(Array(numItems).fill(0))
      : null;
    await prisma.contentState.create({
      data: {
        contentId,
        userId: loggedInUserId,
        attemptNumber: 1,
        contentAttemptNumber: 1,
        score: 0,
        scoreByItem,
        itemAttemptNumbers,
      },
    });
  }

  let newItemAttemptNumbers: number[] | null = null;
  let newContentAttemptNumber = prevState?.contentAttemptNumber ?? 1;

  if (itemNumber === undefined) {
    // we are creating a new attempt for the entire activity
    newContentAttemptNumber++;

    // if we have items, then set all item attempt numbers to 1
    newItemAttemptNumbers =
      numItems === undefined ? null : Array(numItems).fill(1);
  } else {
    if (numItems === undefined || itemNumber > numItems) {
      throw new InvalidRequestError(
        "Item number must be no larger than numItems",
      );
    }

    const prevItemAttemptNumbersParsed = prevState?.itemAttemptNumbers
      ? JSON.parse(prevState.itemAttemptNumbers)
      : null;

    const prevItemAttemptNumbers = Array.isArray(prevItemAttemptNumbersParsed)
      ? prevItemAttemptNumbersParsed.map(Number)
      : null;

    // create newItemAttemptNumbers with length `numItems`,
    // filling in any missing items with 1
    newItemAttemptNumbers = [];
    if (prevItemAttemptNumbers) {
      newItemAttemptNumbers = prevItemAttemptNumbers
        .map((v) => (Number.isFinite(v) ? v : 1))
        .slice(0, numItems);
    }
    if (newItemAttemptNumbers.length < numItems) {
      newItemAttemptNumbers.push(
        ...Array(numItems - newItemAttemptNumbers.length).fill(1),
      );
    }

    newItemAttemptNumbers[itemNumber - 1]++;
  }

  const newItemAttemptNumbersString = newItemAttemptNumbers
    ? JSON.stringify(newItemAttemptNumbers)
    : null;

  const newAttemptNumber = (maxAttemptNumber ?? 1) + 1;

  // Add new record to 'contentState` for new attempt
  await prisma.contentState.create({
    data: {
      contentId,
      userId: loggedInUserId,
      attemptNumber: newAttemptNumber,
      contentAttemptNumber: newContentAttemptNumber,
      itemAttemptNumbers: newItemAttemptNumbersString,
    },
  });

  return {
    attemptNumber: newAttemptNumber,
    contentAttemptNumber: newContentAttemptNumber,
    itemAttemptNumbers: newItemAttemptNumbers,
  };
}

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

  if (!isEqualUUID(stateUserId, loggedInUserId)) {
    // If loggedInUserId isn't the requested user, then loggedInUserId is allowed to load requested users state
    // only if they are the owner of the assignment.
    // If not user is not owner, then do not load state
    try {
      await prisma.content.findUniqueOrThrow({
        where: {
          id: contentId,
          assignmentId: { not: null },
          ...filterEditableActivity(loggedInUserId),
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
  }

  let documentState;
  if (attemptNumber) {
    try {
      documentState = await prisma.contentState.findUniqueOrThrow({
        where: {
          contentId_userId_attemptNumber: {
            contentId,
            userId: stateUserId,
            attemptNumber,
          },
        },
        select: {
          state: true,
          score: true,
          scoreByItem: true,
          attemptNumber: true,
          contentAttemptNumber: true,
          itemAttemptNumbers: true,
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
    // TODO: combine these two queries into a single query.
    // Could do it with raw SQL. Is there a way to do it with prisma?
    const maxRes = await prisma.contentState.aggregate({
      where: { contentId, userId: stateUserId },
      _max: {
        attemptNumber: true,
      },
    });

    const aNum = maxRes._max.attemptNumber;

    if (aNum === null) {
      return { loadedState: false as const };
    }

    documentState = await prisma.contentState.findUniqueOrThrow({
      where: {
        contentId_userId_attemptNumber: {
          contentId,
          userId: stateUserId,
          attemptNumber: aNum,
        },
      },
      select: {
        state: true,
        score: true,
        scoreByItem: true,
        attemptNumber: true,
        contentAttemptNumber: true,
        itemAttemptNumbers: true,
      },
    });
  }

  const scoreByItem = documentState.scoreByItem
    ? JSON.parse(documentState.scoreByItem)
    : null;
  const itemAttemptNumbers = documentState.itemAttemptNumbers
    ? JSON.parse(documentState.itemAttemptNumbers)
    : null;

  return {
    loadedState: true as const,
    ...documentState,
    scoreByItem,
    itemAttemptNumbers,
  };
}

/**
 * Get the overall score, and scores by items if they exist, for one student's assignment `contentId`.
 *
 * If `requestedUserId` is not specified, then retrieve the score for `loggedInUserId`.
 *
 * If `requestedUserId` is specified, retrieve their score only if `loggedInUserId` is the assignment's owner
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
  const stateUserId = requestedUserId ?? loggedInUserId;

  if (!isEqualUUID(stateUserId, loggedInUserId)) {
    // If loggedInUserId isn't the requested user, then loggedInUserId is allowed to load requested users state
    // only if they are the owner of the assignment.
    // If not user is not owner, then do not load state
    try {
      await prisma.content.findUniqueOrThrow({
        where: {
          id: contentId,
          assignmentId: { not: null },
          ...filterEditableActivity(loggedInUserId),
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
  }

  let scores;
  try {
    scores = await prisma.assignmentScores.findUniqueOrThrow({
      where: {
        contentId_userId: {
          contentId,
          userId: stateUserId,
        },
      },
      select: {
        score: true,
        scoreByItem: true,
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

  return {
    loadedScore: true as const,
    score: scores.score,
    scoreByItem: scores.scoreByItem ? JSON.parse(scores.scoreByItem) : null,
  };
}
