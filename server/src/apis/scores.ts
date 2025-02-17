// TODO: do we still save score and state if assignment isn't open?
// If not, how do we communicate that fact
export async function saveScoreAndState({
  activityId,
  docId,
  docVersionNum,
  userId,
  score,
  onSubmission,
  state,
}: {
  activityId: Uint8Array;
  docId: Uint8Array;
  docVersionNum: number;
  userId: Uint8Array;
  score: number;
  onSubmission: boolean;
  state: string;
}) {
  // make sure have an assignmentScores record
  // so that can satisfy foreign key constraints on documentState
  await prisma.assignmentScores.upsert({
    where: { activityId_userId: { activityId, userId } },
    update: {},
    create: { activityId, userId },
  });

  const stateWithMaxScore = await prisma.documentState.findUnique({
    where: {
      activityId_docId_docVersionNum_userId_hasMaxScore: {
        activityId,
        docId,
        docVersionNum,
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
          activityId_docId_docVersionNum_userId_isLatest: {
            activityId,
            docId,
            docVersionNum,
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
          activityId_docId_docVersionNum_userId_hasMaxScore: {
            activityId,
            docId,
            docVersionNum,
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
      activityId_docId_docVersionNum_userId_isLatest: {
        activityId,
        docId,
        docVersionNum,
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
      activityId,
      docId,
      docVersionNum,
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
          activityId,
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
    const assignmentDocumentsAggregation = await prisma.documents.aggregate({
      _count: {
        id: true,
      },
      where: {
        activityId,
      },
    });
    const numDocuments = assignmentDocumentsAggregation._count.id;

    const averageScore =
      documentMaxScores.reduce((a, c) => a + c) / numDocuments;

    await prisma.assignmentScores.update({
      where: { activityId_userId: { activityId, userId } },
      data: {
        score: averageScore,
      },
    });
  }
}

export async function loadState({
  activityId,
  docId,
  docVersionNum,
  requestedUserId,
  userId,
  withMaxScore,
}: {
  activityId: Uint8Array;
  docId: Uint8Array;
  docVersionNum: number;
  requestedUserId: Uint8Array;
  userId: Uint8Array;
  withMaxScore: boolean;
}) {
  if (!isEqualUUID(requestedUserId, userId)) {
    // If user isn't the requested user, then user is allowed to load requested users state
    // only if they are the owner of the assignment.
    // If not user is not owner, then it will throw an error.
    await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        ownerId: userId,
        isAssigned: true,
        isFolder: false,
      },
    });
  }

  let documentState;

  if (withMaxScore) {
    documentState = await prisma.documentState.findUniqueOrThrow({
      where: {
        activityId_docId_docVersionNum_userId_hasMaxScore: {
          activityId,
          docId,
          docVersionNum,
          userId: requestedUserId,
          hasMaxScore: true,
        },
      },
      select: { state: true },
    });
  } else {
    documentState = await prisma.documentState.findUniqueOrThrow({
      where: {
        activityId_docId_docVersionNum_userId_isLatest: {
          activityId,
          docId,
          docVersionNum,
          userId: requestedUserId,
          isLatest: true,
        },
      },
      select: { state: true },
    });
  }
  return documentState.state;
}
