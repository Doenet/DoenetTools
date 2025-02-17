/**
 * Get the data needed to edit `activityId` of `ownerId`.
 *
 * The data returned depends on whether or not `isAssigned` is set.
 *
 * If `isAssigned` is not set, then we return current source from the documents table
 *
 * If `isAssigned` is `true`, then we return the fixed source from documentVersions table
 * the is referenced by the `assignedVersionNum` in the documents table.
 * We also return information about whether or not the assignment is open in this case.
 *
 * @param activityId
 * @param loggedInUserId
 */
export async function getActivityEditorData(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  // TODO: add pagination or a hard limit i n the number of documents one can add to an activity

  const activityPermissions = await checkActivityPermissions(
    activityId,
    loggedInUserId,
  );
  if (activityPermissions.viewable === false) {
    throw new InvalidRequestError(
      "This activity does not exist or is not visible.",
    );
  }

  let activity: ContentStructure = createContentStructure({
    activityId,
    ownerId: activityPermissions.ownerId!,
  });

  if (activityPermissions.editable === false) {
    return { editableByMe: false, activity };
  }

  const { isAssigned, type: contentType } =
    await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
      },
      select: {
        isAssigned: true,
        type: true,
      },
    });

  const availableFeatures = await getAvailableContentFeatures();

  if (contentType !== "singleDoc") {
    // have a sequence or select activity
    const activity = await getCompoundActivity(activityId, loggedInUserId);

    return { editableByMe: true, activity, availableFeatures };
  }

  const contentSelect = returnContentStructureSharedDetailsSelect({
    includeAssignInfo: true,
  });

  if (isAssigned) {
    // modify `contentSelect` to include assigned doenetMl and to count assignment scores
    const documents = {
      ...contentSelect.documents,
      select: {
        id: true,
        name: true,
        assignedVersion: {
          select: {
            versionNum: true,
            source: true,
            doenetmlVersion: true,
            baseComponentCounts: true,
            numVariants: true,
          },
        },
      },
    };
    const contentSelectWithAssignedVersion = {
      ...contentSelect,
      documents,
      _count: { select: { assignmentScores: true } },
    };

    const assignedActivity = await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        isDeleted: false,
        isFolder: false,
      },
      select: contentSelectWithAssignedVersion,
    });

    activity = processContentSharedDetailsAssignedDoc(assignedActivity);
  } else {
    const unassignedActivity = await prisma.content.findUniqueOrThrow({
      where: {
        id: activityId,
        isDeleted: false,
        isFolder: false,
      },
      select: contentSelect,
    });

    activity = processContentSharedDetails(unassignedActivity);
  }

  return { editableByMe: true, activity, availableFeatures };
}

/**
 * Get the data needed to view the source of public activity `activityId`
 *
 * We return current source from the documents table
 *
 * @param activityId
 */
export async function getSharedEditorData(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  // TODO: add pagination or a hard limit in the number of documents one can add to an activity

  const preliminaryActivity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      ...filterViewableActivity(loggedInUserId, false),
    },
    select: returnContentStructureFullOwnerSelect(),
  });

  const activity = processContent(preliminaryActivity, loggedInUserId);

  return activity;
}

// TODO: generalize this to multi-document activities
export async function getActivityViewerData(
  activityId: Uint8Array,
  loggedInUserId: Uint8Array,
) {
  const isAdmin = await getIsAdmin(loggedInUserId);

  const getTypeOwner = await prisma.content.findUnique({
    where: {
      id: activityId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
    },
    select: { type: true, ownerId: true },
  });

  if (!getTypeOwner) {
    throw new InvalidRequestError(
      "This activity does not exist or is not visible.",
    );
  }

  if (!isEqualUUID(loggedInUserId, getTypeOwner.ownerId)) {
    await recordContentView(activityId, loggedInUserId);
  }

  if (getTypeOwner.type !== "singleDoc") {
    const activity = await getCompoundActivity(activityId, loggedInUserId);
    return { activity };
  }

  const preliminaryActivity = await prisma.content.findUniqueOrThrow({
    where: {
      id: activityId,
      ...filterViewableActivity(loggedInUserId, isAdmin),
    },
    select: returnContentStructureFullOwnerSelect(),
  });

  const activity = processContent(preliminaryActivity, loggedInUserId);

  const docHistories = await getDocumentContributorHistories({
    docIds: activity.documents.map((doc) => doc.id),
    loggedInUserId,
    isAdmin,
  });

  if (!isEqualUUID(loggedInUserId, activity.ownerId)) {
    await recordContentView(activityId, loggedInUserId);
  }

  return {
    activity,
    docHistories,
  };
}

/**
 * Get the content structure for `activityId`, recursing to all descendants
 * to populate the `children` field of it and its descendants.
 *
 * Used for displaying the entire contents of a `select` or `sequence` activity.
 */
export async function getCompoundActivity(
  activityId: Uint8Array<ArrayBufferLike>,
  loggedInUserId: Uint8Array<ArrayBufferLike>,
) {
  // first, get an ordered list of all the content inside the `activityId` folder
  const matches = await prisma.$queryRaw<
    {
      id: Uint8Array;
      parentId: Uint8Array;
    }[]
  >(Prisma.sql`
    WITH RECURSIVE content_tree(id, parentId, sortIndex) AS (
    SELECT id, parentId, sortIndex FROM content
    WHERE parentId = ${activityId}
      AND (
        ownerId = ${loggedInUserId}
        OR isPublic = TRUE
        OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
      )
      AND isDeleted = FALSE
    UNION ALL
    SELECT content.id, content.parentId, content.sortIndex FROM content
    INNER JOIN content_tree AS ft
    ON content.parentId = ft.id
    WHERE content.isDeleted = FALSE
      AND (
        ownerId = ${loggedInUserId}
        OR isPublic = TRUE
        OR content.id IN (SELECT contentId FROM contentShares WHERE userId = ${loggedInUserId})
      )
  )
  SELECT id, parentId from content_tree
    ORDER BY
      parentId, sortIndex
`);

  // Next, get all the details on the content
  const preliminaryList = await prisma.content.findMany({
    where: {
      id: { in: [activityId, ...matches.map((m) => m.id)] },
    },
    select: returnContentStructureFullOwnerSelect(),
    orderBy: [{ parentId: "asc" }, { sortIndex: "asc" }],
  });

  const idx = preliminaryList.findIndex((c) => isEqualUUID(c.id, activityId));
  const activity = processContent(preliminaryList[idx], loggedInUserId);

  preliminaryList.splice(idx, 1);

  function findDescendants(id: Uint8Array) {
    const children: ContentStructure[] = [];
    for (let i = 0; i < preliminaryList.length; i++) {
      if (isEqualUUID(preliminaryList[i].parent!.id, id)) {
        children.push(processContent(preliminaryList[i], loggedInUserId));
        preliminaryList.splice(i, 1);
        i--;
      }
    }

    for (const child of children) {
      child.children = findDescendants(child.id);
    }

    return children;
  }

  activity.children = findDescendants(activity.id);
  return activity;
}
