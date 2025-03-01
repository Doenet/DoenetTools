import { Prisma } from "@prisma/client";
import { prisma } from "../model";
import { isEqualUUID } from "../utils/uuid";
import { filterEditableActivity } from "../utils/permissions";

// TODO: do we still save score and state if assignment isn't open?
// If not, how do we communicate that fact
export async function saveScoreAndState({
  contentId,
  loggedInUserId,
  score,
  onSubmission,
  state,
}: {
  contentId: Uint8Array;
  loggedInUserId: Uint8Array;
  score: number;
  onSubmission: boolean;
  state: string;
}) {
  // make sure have an assignmentScores record
  // so that can satisfy foreign key constraints on activityState
  await prisma.assignmentScores.upsert({
    where: {
      contentId_userId: { contentId, userId: loggedInUserId },
    },
    update: {},
    create: { contentId, userId: loggedInUserId },
  });

  const stateWithMaxScore = await prisma.activityState.findUnique({
    where: {
      contentId_userId_hasMaxScore: {
        contentId,
        userId: loggedInUserId,
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
      await prisma.activityState.delete({
        where: {
          contentId_userId_isLatest: {
            contentId,
            userId: loggedInUserId,
            isLatest: false,
          },
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        // if error was that record doesn't exist, then ignore it
      } else {
        throw e;
      }
    }
  } else {
    // since the latest is not with max score,
    // mark the record with hasMaxScore as not the latest
    try {
      await prisma.activityState.update({
        where: {
          contentId_userId_hasMaxScore: {
            contentId,
            userId: loggedInUserId,
            hasMaxScore: true,
          },
        },
        data: {
          isLatest: false,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        // if error was that record doesn't exist, then ignore it
      } else {
        throw e;
      }
    }
  }

  // add/update the latest activity state and maxScore
  await prisma.activityState.upsert({
    where: {
      contentId_userId_isLatest: {
        contentId,
        userId: loggedInUserId,
        isLatest: true,
      },
    },
    update: {
      score,
      state,
      hasMaxScore,
    },
    create: {
      contentId,
      userId: loggedInUserId,
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
    await prisma.assignmentScores.update({
      where: {
        contentId_userId: { contentId, userId: loggedInUserId },
      },
      data: {
        score,
      },
    });
  }
}

export async function loadState({
  contentId,
  requestedUserId,
  loggedInUserId,
  withMaxScore,
}: {
  contentId: Uint8Array;
  requestedUserId: Uint8Array;
  loggedInUserId: Uint8Array;
  withMaxScore: boolean;
}) {
  if (!isEqualUUID(requestedUserId, loggedInUserId)) {
    // If user isn't the requested user, then user is allowed to load requested users state
    // only if they are the owner of the assignment.
    // If not user is not owner, then it will throw an error.
    await prisma.content.findUniqueOrThrow({
      where: {
        id: contentId,
        assignmentId: { not: null },
        ...filterEditableActivity(loggedInUserId),
      },
    });
  }

  let documentState;

  if (withMaxScore) {
    documentState = await prisma.activityState.findUniqueOrThrow({
      where: {
        contentId_userId_hasMaxScore: {
          contentId,
          userId: requestedUserId,
          hasMaxScore: true,
        },
      },
      select: { state: true },
    });
  } else {
    documentState = await prisma.activityState.findUniqueOrThrow({
      where: {
        contentId_userId_isLatest: {
          contentId,
          userId: requestedUserId,
          isLatest: true,
        },
      },
      select: { state: true },
    });
  }
  return documentState.state;
}
