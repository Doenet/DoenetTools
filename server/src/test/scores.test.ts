import { expect, test } from "vitest";
import { createTestAnonymousUser, createTestUser } from "./utils";
import { createContent } from "../query/activity";
import { DateTime } from "luxon";
import {
  openAssignmentWithCode,
  updateAssignmentMaxAttempts,
  updateAssignmentMode,
} from "../query/assign";
import {
  createNewAttempt,
  getScore,
  loadItemState,
  loadState,
  saveScoreAndState,
} from "../query/scores";

test("Create and save responses for new attempts, no items", async () => {
  const { userId: ownerId } = await createTestUser();
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state 1",
    score: 0.5,
    attemptNumber: 1,
    items: [],
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.5,
    itemScores: [],
  });

  // cannot save state to an attempt number that doesn't exist
  await expect(
    saveScoreAndState({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      attemptNumber: 2,
      score: 0.9,
      state: "document state 2",
    }),
  ).rejects.toThrow("non-maximal attempt number");

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });
  expect(retrievedState.loadedState).eq(false);

  // fail to create an attempt as maxAttempts defaults to 1
  await expect(
    createNewAttempt({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
    }),
  ).rejects.toThrow(
    "Cannot create new attempt; maximum number of attempts exceeded",
  );

  // set max attempts to unlimited
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 0,
  });

  // create a new attempt
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: null,
    score: 0,
    attemptNumber: 2,
    items: [],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.5,
    itemScores: [],
  });

  // now we can save state to attempt 2
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.9,
    state: "document state 3",
  });

  // skip attempt number on loadState gets the latest attempt
  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state 3",
    score: 0.9,
    items: [],
    attemptNumber: 2,
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.9,
    itemScores: [],
  });

  // can still load old attempt
  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state 1",
    score: 0.5,
    items: [],
    attemptNumber: 1,
  });

  // if get lower score, lowers score on state and lower actual score to the higher previous attempt score
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.2,
    state: "document state 4",
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state 4",
    score: 0.2,
    items: [],
    attemptNumber: 2,
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.5,
    itemScores: [],
  });
});

test("Create and save responses for new activity-wide attempts, two items", async () => {
  const { userId: ownerId } = await createTestUser();

  // Note: wouldn't get two items for just a singleDoc (would need a sequence),
  // but we aren't testing that part
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  // since we are doing activity-wide attempts, we are creating data in line with the summative mode
  await updateAssignmentMode({
    contentId,
    loggedInUserId: ownerId,
    mode: "summative",
  });

  // set max attempts to unlimited
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 0,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 0.4,
    item: {
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 1,
      score: 0.8,
      state: "Item 1 state 1",
    },
    state: "assignment state 1",
  });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.4,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 1,
        score: 0.8,
        state: "Item 1 state 1",
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
    ],
  });

  // load item states separately
  let retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    itemNumber: 1,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0.8,
    state: "Item 1 state 1",
  });

  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    itemNumber: 2,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0,
    state: null,
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  // no item score in summary getScore since summative
  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.4,
  });

  // cannot save state to an attempt number that doesn't exist
  await expect(
    saveScoreAndState({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      attemptNumber: 2,
      score: 0.7,
      state: "assignment state 2",
      item: {
        itemNumber: 2,
        shuffledItemOrder: [1, 2],
        itemAttemptNumber: 1,
        score: 0.6,
        state: "Item 2 state 1",
      },
    }),
  ).rejects.toThrow("non-maximal attempt number");

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });
  expect(retrievedState.loadedState).eq(false);

  // create a new attempt
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    shuffledItemOrder: [1, 2],
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: null,
    score: 0,
    attemptNumber: 2,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
    ],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  // no item score in summary getScore since summative
  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.4,
  });

  // now we can save state to attempt 2
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.3,
    state: "assignment state 3",
    item: {
      itemNumber: 2,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 1,
      score: 0.6,
      state: "Item 2 state 2",
    },
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 3",
    score: 0.3,
    attemptNumber: 2,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0.6,
        state: "Item 2 state 2",
      },
    ],
  });

  // load item states separately
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 2,
    itemNumber: 1,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 1,
    contentAttemptNumber: 2,
    itemAttemptNumber: 1,
    score: 0,
    state: null,
  });

  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 2,
    itemNumber: 2,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumber: 1,
    score: 0.6,
    state: "Item 2 state 2",
  });

  // no item score in summary getScore since summative
  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.4, // maximum occurred on first attempt
  });

  // can still load old attempt
  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.4,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 1,
        score: 0.8,
        state: "Item 1 state 1",
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
    ],
  });

  // load old item states separately
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    itemNumber: 1,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0.8,
    state: "Item 1 state 1",
  });

  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    itemNumber: 2,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0,
    state: null,
  });

  // get a lower score on problem 1 still increases score since combined with problem 2 on this attempt
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.5,
    state: "assignment state 4",
    item: {
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 1,
      score: 0.4,
      state: "Item 1 state 2",
    },
  });

  // skip attempt number loads state from latest attempt
  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 4",
    score: 0.5,
    attemptNumber: 2,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 1,
        score: 0.4,
        state: "Item 1 state 2",
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0.6,
        state: "Item 2 state 2",
      },
    ],
  });

  // load item states separately, skip contentAttemptNumber, loads latest attempt
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 1,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 1,
    contentAttemptNumber: 2,
    itemAttemptNumber: 1,
    score: 0.4,
    state: "Item 1 state 2",
  });

  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 2,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumber: 1,
    score: 0.6,
    state: "Item 2 state 2",
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  // no item score in summary getScore since summative
  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.5,
  });
});

test("Create and save responses for new item attempts, two items", async () => {
  const { userId: ownerId } = await createTestUser();

  // Note: wouldn't get two items without adding children to the sequence,
  // but we aren't testing that part
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });

  // set max attempts to unlimited
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 0,
  });

  // Since we are doing item attempts, we are creating data in line with the formative mode.
  // (Set the mode to stress the fact even though it is the default)
  await updateAssignmentMode({
    contentId,
    loggedInUserId: ownerId,
    mode: "formative",
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 0.3,
    state: "assignment state 1",
    item: {
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 1,
      score: 0.6,
      state: "Item 1 state 1",
    },
  });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.3,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 1,
        score: 0.6,
        state: "Item 1 state 1",
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
    ],
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  // get items scores in summary getScore since we are in formative mode
  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    itemScores: [
      { itemNumber: 1, shuffledItemNumber: 1, score: 0.6 },
      { itemNumber: 2, shuffledItemNumber: 2, score: 0 },
    ],
  });

  // load item one state
  let retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    itemNumber: 1,
    itemAttemptNumber: 1,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0.6,
    state: "Item 1 state 1",
  });

  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    itemNumber: 2,
    itemAttemptNumber: 1,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0,
    state: null,
  });

  // cannot load state from non-existent itemAttemptNumber
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    itemNumber: 1,
    itemAttemptNumber: 2,
  });

  expect(retrievedItemState).eqls({ loadedState: false });

  // We cannot save a score to the second attempt of item 1
  await expect(
    saveScoreAndState({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      attemptNumber: 1,
      score: 0.2,
      state: "assignment state 1",
      item: {
        itemNumber: 1,
        shuffledItemOrder: [1, 2],
        itemAttemptNumber: 2,
        score: 0.4,
        state: "Item 1 state 2",
      },
    }),
  ).rejects.toThrow("non-maximal item attempt number");

  // create a new attempt for item 1
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    shuffledItemOrder: [1, 2],
    itemNumber: 1,
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.0,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 2,
        score: 0,
        state: null,
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
    ],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    itemScores: [
      { itemNumber: 1, shuffledItemNumber: 1, score: 0.6 },
      { itemNumber: 2, shuffledItemNumber: 2, score: 0 },
    ],
  });

  // now we can save state to item attempt 2
  // did worse on problem 1

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 0.2,
    state: "assignment state 1",
    item: {
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 2,
      score: 0.4,
      state: "Item 1 state 3",
    },
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.2,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 2,
        score: 0.4,
        state: "Item 1 state 3",
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
    ],
  });

  // load item states, skipping content attempt number
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 1,
    itemAttemptNumber: 2,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumber: 2,
    score: 0.4,
    state: "Item 1 state 3",
  });

  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 2,
    itemAttemptNumber: 1,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0,
    state: null,
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  // remember previous max score of 0.3 and 0.6 on item 1
  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    itemScores: [
      { itemNumber: 1, shuffledItemNumber: 1, score: 0.6 },
      { itemNumber: 2, shuffledItemNumber: 2, score: 0 },
    ],
  });

  // can still load old item attempt
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    itemNumber: 1,
    itemAttemptNumber: 1,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0.6,
    state: "Item 1 state 1",
  });

  // create a new attempt for item 2
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    shuffledItemOrder: [1, 2],
    itemNumber: 2,
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.2,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 2,
        score: 0.4,
        state: "Item 1 state 3",
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 2,
        score: 0,
        state: null,
      },
    ],
  });

  // load item states, skipping content and item attempt numbers
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 1,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumber: 2,
    score: 0.4,
    state: "Item 1 state 3",
  });

  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 2,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumber: 2,
    score: 0,
    state: null,
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    itemScores: [
      { itemNumber: 1, shuffledItemNumber: 1, score: 0.6 },
      { itemNumber: 2, shuffledItemNumber: 2, score: 0 },
    ],
  });

  // now we can no longer save state to attempt 1 of item 2
  await expect(
    saveScoreAndState({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      attemptNumber: 1,
      score: 0.6,
      state: "assignment state 1",
      item: {
        itemNumber: 2,
        shuffledItemOrder: [1, 2],
        itemAttemptNumber: 1,
        score: 0.8,
        state: "Item 2 state 2",
      },
    }),
  ).rejects.toThrow("non-maximal item attempt number");

  // We can save state to attempt 2 of item 2
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, // this is ignored since in formative mode
    state: "assignment state 1",
    item: {
      itemNumber: 2,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 2,
      score: 0.8,
      state: "Item 2 state 3",
    },
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: (0.4 + 0.8) / 2,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 2,
        score: 0.4,
        state: "Item 1 state 3",
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 2,
        score: 0.8,
        state: "Item 2 state 3",
      },
    ],
  });

  // load item states, skipping just item attempt numbers
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    itemNumber: 1,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumber: 2,
    score: 0.4,
    state: "Item 1 state 3",
  });

  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    itemNumber: 2,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumber: 2,
    score: 0.8,
    state: "Item 2 state 3",
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: (0.6 + 0.8) / 2,
    itemScores: [
      { itemNumber: 1, shuffledItemNumber: 1, score: 0.6 },
      { itemNumber: 2, shuffledItemNumber: 2, score: 0.8 },
    ],
  });
});

test("Create attempts before responding, no items", async () => {
  const { userId: ownerId } = await createTestUser();
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  // create a new attempt without recording any response to attempt 1

  // first attempt fail as max attempts is 1
  await expect(
    createNewAttempt({
      contentId: contentId,
      loggedInUserId: anonId,
      code: classCode,
    }),
  ).rejects.toThrow(
    "Cannot create new attempt; maximum number of attempts exceeded",
  );

  // set max attempts to unlimited
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 0,
  });

  await createNewAttempt({
    contentId: contentId,
    loggedInUserId: anonId,
    code: classCode,
  });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: null,
    score: 0,
    attemptNumber: 2,
    items: [],
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0,
    itemScores: [],
  });

  // save state to attempt 2
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.9,
    state: "document state 1",
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state 1",
    score: 0.9,
    items: [],
    attemptNumber: 2,
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.9,
    itemScores: [],
  });

  // attempt to load attempt 1, which was never taken
  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  // get a score of 0 and a state of null
  expect(retrievedState).eqls({
    loadedState: true,
    state: null,
    score: 0,
    attemptNumber: 1,
    items: [],
  });
});

test("Create item attempts before responding, two items", async () => {
  const { userId: ownerId } = await createTestUser();

  // Note: wouldn't get two items without adding children to the sequence,
  // but we aren't testing that part
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });

  // Since we are doing item attempts, we are creating data in line with the formative mode.
  // (Set the mode to stress the fact even though it is the default)
  await updateAssignmentMode({
    contentId,
    loggedInUserId: ownerId,
    mode: "formative",
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  // create a new attempt for item 1 before responding

  // initial attempt fails as max attempts is 1
  await expect(
    createNewAttempt({
      contentId: contentId,
      loggedInUserId: anonId,
      code: classCode,
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
    }),
  ).rejects.toThrow(
    "Cannot create new attempt of item; maximum number of attempts exceeded",
  );

  // set max attempts to unlimited
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 0,
  });

  await createNewAttempt({
    contentId: contentId,
    loggedInUserId: anonId,
    code: classCode,
    itemNumber: 1,
    shuffledItemOrder: [1, 2],
  });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: null,
    score: 0,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 2,
        score: 0,
        state: null,
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
    ],
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0,
    itemScores: [
      { itemNumber: 1, shuffledItemNumber: 1, score: 0 },
      { itemNumber: 2, shuffledItemNumber: 2, score: 0 },
    ],
  });

  // now we can save state to attempt 2 for item 2
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, // this is ignored since in formative mode
    state: "assignment state 1",
    item: {
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 2,
      score: 0.4,
      state: "Item 1 state 1",
    },
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.2,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 2,
        score: 0.4,
        state: "Item 1 state 1",
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
    ],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.2,
    itemScores: [
      { itemNumber: 1, shuffledItemNumber: 1, score: 0.4 },
      { itemNumber: 2, shuffledItemNumber: 2, score: 0 },
    ],
  });

  // attempt to load attempt 1, which was never taken
  const retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    itemNumber: 1,
    itemAttemptNumber: 1,
  });

  // get a scores of 0 and a state of null
  expect(retrievedItemState).eqls({
    loadedState: true,
    state: null,
    score: 0,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    itemNumber: 1,
    shuffledItemNumber: 1,
  });
});

test("Create and save responses for new item attempts, two shuffled items", async () => {
  const { userId: ownerId } = await createTestUser();

  // Note: wouldn't get two items without adding children to the sequence,
  // but we aren't testing that part
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });

  // Since we are doing item attempts, we are creating data in line with the formative mode.
  // (Set the mode to stress the fact even though it is the default)
  await updateAssignmentMode({
    contentId,
    loggedInUserId: ownerId,
    mode: "formative",
  });

  // set max attempts to unlimited
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 0,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  // save state for shuffled item number 1 (which is item number 2)
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 0.3,
    state: "assignment state 1",
    item: {
      shuffledItemNumber: 1,
      shuffledItemOrder: [2, 1],
      itemAttemptNumber: 1,
      score: 0.6,
      state: "Item 1 state 1",
    },
  });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.3,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 2,
        shuffledItemNumber: 1,
        itemAttemptNumber: 1,
        score: 0.6,
        state: "Item 1 state 1",
      },
      {
        itemNumber: 1,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
    ],
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  // get items scores in summary getScore since we are in formative mode
  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    itemScores: [
      { itemNumber: 2, shuffledItemNumber: 1, score: 0.6 },
      { itemNumber: 1, shuffledItemNumber: 2, score: 0 },
    ],
  });

  // load shuffled item one state
  let retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    shuffledItemNumber: 1,
    itemAttemptNumber: 1,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0.6,
    state: "Item 1 state 1",
  });

  // load shuffled item 2 state
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    shuffledItemNumber: 2,
    itemAttemptNumber: 1,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0,
    state: null,
  });

  // cannot load state from non-existent itemAttemptNumber
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    shuffledItemNumber: 1,
    itemAttemptNumber: 2,
  });

  expect(retrievedItemState).eqls({ loadedState: false });

  // We cannot save a score to the second attempt of shuffled item 1
  await expect(
    saveScoreAndState({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      attemptNumber: 1,
      score: 0.2,
      state: "assignment state 1",
      item: {
        shuffledItemNumber: 1,
        shuffledItemOrder: [2, 1],
        itemAttemptNumber: 2,
        score: 0.4,
        state: "Item 1 state 2",
      },
    }),
  ).rejects.toThrow("non-maximal item attempt number");

  // create a new attempt for shuffled item 1
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    shuffledItemOrder: [2, 1],
    shuffledItemNumber: 1,
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.0,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 2,
        shuffledItemNumber: 1,
        itemAttemptNumber: 2,
        score: 0,
        state: null,
      },
      {
        itemNumber: 1,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
    ],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    itemScores: [
      { itemNumber: 2, shuffledItemNumber: 1, score: 0.6 },
      { itemNumber: 1, shuffledItemNumber: 2, score: 0 },
    ],
  });

  // now we can save state to item attempt 2 for shuffledItemNumber 1
  // did worse than on first attempt

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 0.2,
    state: "assignment state 1",
    item: {
      shuffledItemNumber: 1,
      shuffledItemOrder: [2, 1],
      itemAttemptNumber: 2,
      score: 0.4,
      state: "Item 1 state 3",
    },
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.2,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 2,
        shuffledItemNumber: 1,
        itemAttemptNumber: 2,
        score: 0.4,
        state: "Item 1 state 3",
      },
      {
        itemNumber: 1,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0,
        state: null,
      },
    ],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  // remember previous max score of 0.3 and 0.6 on item 2 (shuffledItemNumber 1)
  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    itemScores: [
      { itemNumber: 2, shuffledItemNumber: 1, score: 0.6 },
      { itemNumber: 1, shuffledItemNumber: 2, score: 0 },
    ],
  });

  // can still load old item attempt
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    contentAttemptNumber: 1,
    shuffledItemNumber: 1,
    itemAttemptNumber: 1,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0.6,
    state: "Item 1 state 1",
  });

  // create a new attempt for shuffled item 2
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    shuffledItemOrder: [2, 1],
    shuffledItemNumber: 2,
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.2,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 2,
        shuffledItemNumber: 1,
        itemAttemptNumber: 2,
        score: 0.4,
        state: "Item 1 state 3",
      },
      {
        itemNumber: 1,
        shuffledItemNumber: 2,
        itemAttemptNumber: 2,
        score: 0,
        state: null,
      },
    ],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    itemScores: [
      { itemNumber: 2, shuffledItemNumber: 1, score: 0.6 },
      { itemNumber: 1, shuffledItemNumber: 2, score: 0 },
    ],
  });

  // now we can no longer save state to attempt 1 of shuffled item 2
  await expect(
    saveScoreAndState({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      attemptNumber: 1,
      score: 0.6,
      state: "assignment state 1",
      item: {
        shuffledItemNumber: 2,
        shuffledItemOrder: [2, 1],
        itemAttemptNumber: 1,
        score: 0.8,
        state: "Item 2 state 2",
      },
    }),
  ).rejects.toThrow("non-maximal item attempt number");

  // We can save state to attempt 2 of shuffled item 2
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, // this is ignored since in formative mode
    state: "assignment state 1",
    item: {
      shuffledItemNumber: 2,
      shuffledItemOrder: [2, 1],
      itemAttemptNumber: 2,
      score: 0.8,
      state: "Item 2 state 3",
    },
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: (0.4 + 0.8) / 2,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 2,
        shuffledItemNumber: 1,
        itemAttemptNumber: 2,
        score: 0.4,
        state: "Item 1 state 3",
      },
      {
        itemNumber: 1,
        shuffledItemNumber: 2,
        itemAttemptNumber: 2,
        score: 0.8,
        state: "Item 2 state 3",
      },
    ],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: (0.6 + 0.8) / 2,
    itemScores: [
      { itemNumber: 2, shuffledItemNumber: 1, score: 0.6 },
      { itemNumber: 1, shuffledItemNumber: 2, score: 0.8 },
    ],
  });
});

test("New item attempt does not affect other item", async () => {
  const { userId: ownerId } = await createTestUser();

  // Note: wouldn't get two items without adding children to the sequence,
  // but we aren't testing that part
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });

  // Since we are doing item attempts, we are creating data in line with the formative mode.
  // (Set the mode to stress the fact even though it is the default)
  await updateAssignmentMode({
    contentId,
    loggedInUserId: ownerId,
    mode: "formative",
  });

  // set max attempts to unlimited
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 0,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  // save state for items 1 amd 2
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, // ignored
    state: "assignment state 1",
    item: {
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 1,
      score: 0.8,
      state: "Item 1 state 1",
    },
  });

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, // ignored
    state: "assignment state 1",
    item: {
      itemNumber: 2,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 1,
      score: 1,
      state: "Item 2 state 1",
    },
  });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.9,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 1,
        score: 0.8,
        state: "Item 1 state 1",
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 1,
        state: "Item 2 state 1",
      },
    ],
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.9,
    itemScores: [
      { itemNumber: 1, shuffledItemNumber: 1, score: 0.8 },
      { itemNumber: 2, shuffledItemNumber: 2, score: 1 },
    ],
  });

  // Creating new attempt of item 2 locks in that score,
  // but does not lock in the score of item 1
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    shuffledItemOrder: [1, 2],
    itemNumber: 2,
  });

  // save state with lower scores for items 1 amd 2
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, // ignored
    state: "assignment state 1",
    item: {
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 1,
      score: 0.4,
      state: "Item 1 state 2",
    },
  });

  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, // ignored
    state: "assignment state 1",
    item: {
      itemNumber: 2,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 2,
      score: 0.2,
      state: "Item 2 state 2",
    },
  });

  // loading state gets lower score for both
  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });
  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: (0.4 + 0.2) / 2,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 1,
        score: 0.4,
        state: "Item 1 state 2",
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 2,
        score: 0.2,
        state: "Item 2 state 2",
      },
    ],
  });

  // loading item state get lower score for both
  let retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 1,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumber: 1,
    score: 0.4,
    state: "Item 1 state 2",
  });

  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 2,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumber: 2,
    score: 0.2,
    state: "Item 2 state 2",
  });

  // However, getting score retrieves higher score for item 2 but not item 1
  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.7,
    itemScores: [
      { itemNumber: 1, shuffledItemNumber: 1, score: 0.4 },
      { itemNumber: 2, shuffledItemNumber: 2, score: 1 },
    ],
  });
});

test("Using both itemNumber and shuffledItemNumber, two shuffled items", async () => {
  const { userId: ownerId } = await createTestUser();

  // Note: wouldn't get two items without adding children to the sequence,
  // but we aren't testing that part
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });

  // set max attempts to unlimited
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 0,
  });

  // Since we are doing item attempts, we are creating data in line with the formative mode.
  // (Set the mode to stress the fact even though it is the default)
  await updateAssignmentMode({
    contentId,
    loggedInUserId: ownerId,
    mode: "formative",
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  // save state for item number 1 (which is shuffled item number 2)
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, //ignored
    state: "assignment state 1",
    item: {
      itemNumber: 1,
      shuffledItemOrder: [2, 1],
      itemAttemptNumber: 1,
      score: 0.6,
      state: "Item 2 state 1",
    },
  });

  // save state for shuffled item number 1 (which is item number 2)
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, //ignored
    state: "assignment state 1",
    item: {
      shuffledItemNumber: 1,
      shuffledItemOrder: [2, 1],
      itemAttemptNumber: 1,
      score: 0.8,
      state: "Item 1 state 1",
    },
  });

  const retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: (0.6 + 0.8) / 2,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 2,
        shuffledItemNumber: 1,
        itemAttemptNumber: 1,
        score: 0.8,
        state: "Item 1 state 1",
      },
      {
        itemNumber: 1,
        shuffledItemNumber: 2,
        itemAttemptNumber: 1,
        score: 0.6,
        state: "Item 2 state 1",
      },
    ],
  });

  const retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  // get items scores in summary getScore since we are in formative mode
  expect(retrievedScore).eqls({
    loadedScore: true,
    score: (0.6 + 0.8) / 2,
    itemScores: [
      { itemNumber: 2, shuffledItemNumber: 1, score: 0.8 },
      { itemNumber: 1, shuffledItemNumber: 2, score: 0.6 },
    ],
  });

  // specifying neither itemNumber nor shuffledItemNumber when saving state throws an error
  await expect(
    saveScoreAndState({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      attemptNumber: 1,
      score: 1000, //ignored
      state: "assignment state 1",
      item: {
        shuffledItemOrder: [2, 1],
        itemAttemptNumber: 1,
        score: 1,
        state: "Which item?",
      },
    }),
  ).rejects.toThrow(
    "A valid itemNumber or shuffledItemNumber must be supplied",
  );

  // omitting shuffledItemOrder when creating new item items throws an error
  await expect(
    createNewAttempt({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      shuffledItemNumber: 2,
    }),
  ).rejects.toThrow(
    "Cannot create a new item attempt without specifying shuffledItemOrder",
  );
  await expect(
    createNewAttempt({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      itemNumber: 2,
    }),
  ).rejects.toThrow(
    "Cannot create a new item attempt without specifying shuffledItemOrder",
  );

  // create a new attempt for shuffled item 2 (item number 1)
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    shuffledItemOrder: [2, 1],
    shuffledItemNumber: 2,
  });

  // create a new attempt for item 2 (shuffled item number 1)
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    shuffledItemOrder: [2, 1],
    itemNumber: 2,
  });

  // load shuffled item one state, specifying no item number, gives first item number
  let retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumber: 2,
    score: 0,
    state: null,
  });

  // load shuffled item 2 state
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    shuffledItemNumber: 2,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 1,
    shuffledItemNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumber: 2,
    score: 0,
    state: null,
  });

  // load item 2 state
  retrievedItemState = await loadItemState({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 2,
  });
  expect(retrievedItemState).eqls({
    loadedState: true,
    itemNumber: 2,
    shuffledItemNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumber: 2,
    score: 0,
    state: null,
  });
});

test("Cannot create activity-wide attempt on formative assessment", async () => {
  const { userId: ownerId } = await createTestUser();

  // Note: wouldn't get two items without adding children to the sequence,
  // but we aren't testing that part
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });

  // Since we are doing item attempts, we are creating data in line with the formative mode.
  // (Set the mode to stress the fact even though it is the default)
  await updateAssignmentMode({
    contentId,
    loggedInUserId: ownerId,
    mode: "formative",
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  await expect(
    createNewAttempt({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
    }),
  ).rejects.toThrow(
    "Formative assessments do not support creating new attempts of entire activity",
  );
});

test("Cannot create item attempt on summative assessment", async () => {
  const { userId: ownerId } = await createTestUser();

  // Note: wouldn't get two items without adding children to the sequence,
  // but we aren't testing that part
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });

  // Since we are doing item attempts, we are creating data in line with the formative mode.
  // (Set the mode to stress the fact even though it is the default)
  await updateAssignmentMode({
    contentId,
    loggedInUserId: ownerId,
    mode: "summative",
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  await expect(
    createNewAttempt({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
    }),
  ).rejects.toThrow(
    "Summative assessments do not support creating new attempts of single items",
  );
});

test("Setting maximum number of attempts, no items", async () => {
  const { userId: ownerId } = await createTestUser();

  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  // can save state
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  // cannot create new attempt
  await expect(
    createNewAttempt({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
    }),
  ).rejects.toThrow(
    "Cannot create new attempt; maximum number of attempts exceeded",
  );

  // set max attempts to 2
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 2,
  });

  // create a new attempt, attempt 2
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
  });

  // can save state
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.6,
    state: "document state 2",
  });

  // cannot create new attempt
  await expect(
    createNewAttempt({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
    }),
  ).rejects.toThrow(
    "Cannot create new attempt; maximum number of attempts exceeded",
  );

  // set max attempts to 3
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 3,
  });

  // create a new attempt, attempt 3
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
  });

  // bring max attempts back down to 2
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 2,
  });

  // can still save state
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 3,
    score: 0.7,
    state: "document state 3",
  });

  // cannot save state to attempt 2
  await expect(
    saveScoreAndState({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      attemptNumber: 2,
      score: 0.8,
      state: "document state 4",
    }),
  ).rejects.toThrow(
    "Cannot save score and state to non-maximal attempt number",
  );

  // can retrieve score and state from third attempt
  const retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state 3",
    score: 0.7,
    attemptNumber: 3,
    items: [],
  });

  // retrieved score reflects third attempt
  const retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.7,
    itemScores: [],
  });
});

test("Setting maximum number of attempts, new item attempts", async () => {
  const { userId: ownerId } = await createTestUser();

  // Note: wouldn't get two items without adding children to the sequence,
  // but we aren't testing that part
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "sequence",
    parentId: null,
  });

  // Since we are doing item attempts, we are creating data in line with the formative mode.
  // (Set the mode to stress the fact even though it is the default)
  await updateAssignmentMode({
    contentId,
    loggedInUserId: ownerId,
    mode: "formative",
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  const { classCode } = await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  // save state for attempt 1 of item 1
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, // ignored
    state: "assignment state 1",
    item: {
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 1,
      score: 0.6,
      state: "Item 1 state 1",
    },
  });

  // cannot create a new attempt for item 1 or item 2
  await expect(
    createNewAttempt({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      shuffledItemOrder: [1, 2],
      itemNumber: 1,
    }),
  ).rejects.toThrow(
    "Cannot create new attempt of item; maximum number of attempts exceeded",
  );

  await expect(
    createNewAttempt({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      shuffledItemOrder: [1, 2],
      itemNumber: 2,
    }),
  ).rejects.toThrow(
    "Cannot create new attempt of item; maximum number of attempts exceeded",
  );

  // set max attempts to 2
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 2,
  });

  // create a new attempt for item 1, attempt 2
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    shuffledItemOrder: [1, 2],
    itemNumber: 1,
  });

  // save state for attempt 2 of item 1
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, // ignored
    state: "assignment state 1",
    item: {
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 2,
      score: 0.8,
      state: "Item 1 state 2",
    },
  });

  // cannot create a new attempt for item 1
  await expect(
    createNewAttempt({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      shuffledItemOrder: [1, 2],
      itemNumber: 1,
    }),
  ).rejects.toThrow(
    "Cannot create new attempt of item; maximum number of attempts exceeded",
  );

  // set max attempts to 3
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 3,
  });

  // create a new attempt for item 1, attempt 3
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    shuffledItemOrder: [1, 2],
    itemNumber: 1,
  });

  // set max attempts back down to 2
  await updateAssignmentMaxAttempts({
    contentId,
    loggedInUserId: ownerId,
    maxAttempts: 2,
  });

  // can still save state for attempt 3 of item 1
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, // ignored
    state: "assignment state 1",
    item: {
      itemNumber: 1,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 3,
      score: 1,
      state: "Item 1 state 3",
    },
  });

  // can no longer save state for attempt 2 of item 1
  await expect(
    saveScoreAndState({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      attemptNumber: 1,
      score: 1000, // ignored
      state: "assignment state 1",
      item: {
        itemNumber: 1,
        shuffledItemOrder: [1, 2],
        itemAttemptNumber: 2,
        score: 0.2,
        state: "Item 1 state 4",
      },
    }),
  ).rejects.toThrow(
    "Cannot save score and state to non-maximal item attempt number",
  );

  // create a new attempt for item 2, attempt 2
  await createNewAttempt({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    shuffledItemOrder: [1, 2],
    itemNumber: 2,
  });

  // cannot create a third attempt for item 2
  await expect(
    createNewAttempt({
      contentId: contentId,
      code: classCode,
      loggedInUserId: anonId,
      shuffledItemOrder: [1, 2],
      itemNumber: 2,
    }),
  ).rejects.toThrow(
    "Cannot create new attempt of item; maximum number of attempts exceeded",
  );

  // can  save state for attempt 2 of item 1
  await saveScoreAndState({
    contentId: contentId,
    code: classCode,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 1000, // ignored
    state: "assignment state 1",
    item: {
      itemNumber: 2,
      shuffledItemOrder: [1, 2],
      itemAttemptNumber: 2,
      score: 0.4,
      state: "Item 2 state 1",
    },
  });

  // retrieved state reflects attempt 3 for item 1 and attempt 2 for item 2
  const retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: (1 + 0.4) / 2,
    attemptNumber: 1,
    items: [
      {
        itemNumber: 1,
        shuffledItemNumber: 1,
        itemAttemptNumber: 3,
        score: 1,
        state: "Item 1 state 3",
      },
      {
        itemNumber: 2,
        shuffledItemNumber: 2,
        itemAttemptNumber: 2,
        score: 0.4,
        state: "Item 2 state 1",
      },
    ],
  });

  // retrieved score reflects attempt 3 for item 1 and attempt 2 for item 2
  const retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: (1 + 0.4) / 2,
    itemScores: [
      { itemNumber: 1, shuffledItemNumber: 1, score: 1 },
      { itemNumber: 2, shuffledItemNumber: 2, score: 0.4 },
    ],
  });
});
