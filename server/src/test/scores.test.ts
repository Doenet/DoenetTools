import { expect, test } from "vitest";
import { createTestAnonymousUser, createTestUser } from "./utils";
import { createContent } from "../query/activity";
import { DateTime } from "luxon";
import { openAssignmentWithCode } from "../query/assign";
import {
  createNewAttempt,
  getScore,
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
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  let saveResult = await saveScoreAndState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 0.5,
    state: "document state 1",
  });

  expect(saveResult).eqls({ score: 0.5, scoreByItem: null });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state 1",
    score: 0.5,
    scoreByItem: null,
    attemptNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumbers: null,
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.5,
    scoreByItem: null,
  });

  // cannot save state to an attempt number that doesn't exist
  await expect(
    saveScoreAndState({
      contentId: contentId,
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

  // create a new attempt
  saveResult = await createNewAttempt({
    contentId: contentId,
    loggedInUserId: anonId,
    score: 0,
    state: "document state new",
  });

  expect(saveResult).eqls({
    attemptNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumbers: null,
    score: 0.5,
    scoreByItem: null,
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state new",
    score: 0,
    scoreByItem: null,
    attemptNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumbers: null,
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.5,
    scoreByItem: null,
  });

  // now we can save state to attempt 2
  saveResult = await saveScoreAndState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.9,
    state: "document state 3",
  });

  expect(saveResult).eqls({ score: 0.9, scoreByItem: null });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state 3",
    score: 0.9,
    scoreByItem: null,
    attemptNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumbers: null,
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.9,
    scoreByItem: null,
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
    scoreByItem: null,
    attemptNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumbers: null,
  });

  // if get lower score, lowers score on state but not actual score
  saveResult = await saveScoreAndState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.2,
    state: "document state 4",
  });

  expect(saveResult).eqls({ score: 0.9, scoreByItem: null });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state 4",
    score: 0.2,
    scoreByItem: null,
    attemptNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumbers: null,
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.9,
    scoreByItem: null,
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

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  let saveResult = await saveScoreAndState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 0.4,
    scoreByItem: [0.8, 0],
    state: "assignment state 1",
  });

  expect(saveResult).eqls({ score: 0.4, scoreByItem: [0.8, 0] });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.4,
    scoreByItem: [0.8, 0],
    attemptNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [1, 1],
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.4,
    scoreByItem: [0.8, 0],
  });

  // cannot save state to an attempt number that doesn't exist
  await expect(
    saveScoreAndState({
      contentId: contentId,
      loggedInUserId: anonId,
      attemptNumber: 2,
      score: 0.7,
      scoreByItem: [0.8, 0.6],
      state: "assignment state 2",
    }),
  ).rejects.toThrow("non-maximal attempt number");

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });
  expect(retrievedState.loadedState).eq(false);

  // create a new attempt
  saveResult = await createNewAttempt({
    contentId: contentId,
    loggedInUserId: anonId,
    numItems: 2,
    score: 0,
    scoreByItem: [0, 0],
    state: "assignment state new",
  });

  expect(saveResult).eqls({
    attemptNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumbers: [1, 1],
    score: 0.4,
    scoreByItem: [0.8, 0],
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state new",
    score: 0,
    scoreByItem: [0, 0],
    attemptNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumbers: [1, 1],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.4,
    scoreByItem: [0.8, 0],
  });

  // now we can save state to attempt 2
  saveResult = await saveScoreAndState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.7,
    scoreByItem: [0.8, 0.6],
    state: "assignment state 3",
  });

  expect(saveResult).eqls({ score: 0.7, scoreByItem: [0.8, 0.6] });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 3",
    score: 0.7,
    scoreByItem: [0.8, 0.6],
    attemptNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumbers: [1, 1],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.7,
    scoreByItem: [0.8, 0.6],
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
    scoreByItem: [0.8, 0],
    attemptNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [1, 1],
  });

  // if get lower score, lowers score on state but not actual score
  saveResult = await saveScoreAndState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.3,
    scoreByItem: [0, 0.6],
    state: "assignment state 4",
  });

  expect(saveResult).eqls({ score: 0.7, scoreByItem: [0.8, 0.6] });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 4",
    score: 0.3,
    scoreByItem: [0, 0.6],
    attemptNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumbers: [1, 1],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.7,
    scoreByItem: [0.8, 0.6],
  });
});

test("Create and save responses for new item attempts, two items", async () => {
  const { userId: ownerId } = await createTestUser();

  // Note: wouldn't get two items for just a singleDoc (would need a sequence),
  // but we aren't testing that part
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  let saveResult = await saveScoreAndState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
    score: 0.3,
    scoreByItem: [0.6, 0],
    state: "assignment state 1",
  });

  expect(saveResult).eqls({ score: 0.3, scoreByItem: [0.6, 0.0] });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.3,
    scoreByItem: [0.6, 0],
    attemptNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [1, 1],
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    scoreByItem: [0.6, 0],
  });

  // create a new attempt for item 1
  saveResult = await createNewAttempt({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 1,
    numItems: 2,
    score: 0,
    scoreByItem: [0, 0],
    state: "assignment state new",
  });

  expect(saveResult).eqls({
    attemptNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [2, 1],
    score: 0.3,
    scoreByItem: [0.6, 0.0],
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state new",
    score: 0,
    scoreByItem: [0, 0],
    attemptNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [2, 1],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    scoreByItem: [0.6, 0],
  });

  // now we can save state to attempt 2
  // did worse on problem 1
  saveResult = await saveScoreAndState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.2,
    scoreByItem: [0.4, 0.0],
    state: "assignment state 3",
  });

  expect(saveResult).eqls({ score: 0.3, scoreByItem: [0.6, 0.0] });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 3",
    score: 0.2,
    scoreByItem: [0.4, 0.0],
    attemptNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [2, 1],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  // remember previous max score of 0.3 and 0.6 on item 1
  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    scoreByItem: [0.6, 0],
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
    score: 0.3,
    scoreByItem: [0.6, 0],
    attemptNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [1, 1],
  });

  // create a new attempt for item 2
  saveResult = await createNewAttempt({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 2,
    numItems: 2,
    score: 0.2,
    scoreByItem: [0.4, 0],
    state: "assignment state new 2",
  });

  expect(saveResult).eqls({
    attemptNumber: 3,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [2, 2],
    score: 0.3,
    scoreByItem: [0.6, 0],
  });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 3,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state new 2",
    score: 0.2,
    scoreByItem: [0.4, 0],
    attemptNumber: 3,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [2, 2],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.3,
    scoreByItem: [0.6, 0],
  });

  // now we can no longer save state to attempt 2
  await expect(
    saveScoreAndState({
      contentId: contentId,
      loggedInUserId: anonId,
      attemptNumber: 2,
      score: 0.6,
      scoreByItem: [0.4, 0.8],
      state: "assignment state 4",
    }),
  ).rejects.toThrow("non-maximal attempt number");

  // We can save state to attempt 3
  saveResult = await saveScoreAndState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 3,
    score: 0.6,
    scoreByItem: [0.4, 0.8],
    state: "assignment state 5",
  });

  expect(saveResult).eqls({ score: 0.7, scoreByItem: [0.6, 0.8] });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 3,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 5",
    score: 0.6,
    scoreByItem: [0.4, 0.8],
    attemptNumber: 3,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [2, 2],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  // The actual score should be 0.7, the average of the maximal item scores 0.6 and 0.8,
  // even though 0.6 and 0.8 were never scored at the same time
  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.7,
    scoreByItem: [0.6, 0.8],
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
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  // create a new attempt without recording any response to attempt 1
  const saveResult = await createNewAttempt({
    contentId: contentId,
    loggedInUserId: anonId,
    score: 0,
    state: "document state new",
  });

  expect(saveResult).eqls({
    attemptNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumbers: null,
    score: 0,
    scoreByItem: null,
  });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state new",
    score: 0,
    scoreByItem: null,
    attemptNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumbers: null,
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0,
    scoreByItem: null,
  });

  // save state to attempt 2
  const saveResult2 = await saveScoreAndState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.9,
    state: "document state 1",
  });

  expect(saveResult2).eqls({ score: 0.9, scoreByItem: null });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "document state 1",
    score: 0.9,
    scoreByItem: null,
    attemptNumber: 2,
    contentAttemptNumber: 2,
    itemAttemptNumbers: null,
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.9,
    scoreByItem: null,
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
    scoreByItem: null,
    attemptNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumbers: null,
  });
});

test("Create item attempts before responding, two items", async () => {
  const { userId: ownerId } = await createTestUser();

  // Note: wouldn't get two items for just a singleDoc (would need a sequence),
  // but we aren't testing that part
  const { contentId: contentId } = await createContent({
    loggedInUserId: ownerId,
    contentType: "singleDoc",
    parentId: null,
  });

  // open assignment generates code
  const closeAt = DateTime.now().plus({ days: 1 });
  await openAssignmentWithCode({
    contentId: contentId,
    closeAt: closeAt,
    loggedInUserId: ownerId,
  });

  // create new anonymous user
  const { userId: anonId } = await createTestAnonymousUser();

  // create a new attempt for item 1 before responding
  const saveResult = await createNewAttempt({
    contentId: contentId,
    loggedInUserId: anonId,
    itemNumber: 1,
    numItems: 2,
    score: 0,
    scoreByItem: [0, 0],
    state: "assignment state new",
  });

  expect(saveResult).eqls({
    attemptNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [2, 1],
    score: 0,
    scoreByItem: [0, 0],
  });

  let retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state new",
    score: 0,
    scoreByItem: [0.0, 0.0],
    attemptNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [2, 1],
  });

  let retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0,
    scoreByItem: [0, 0],
  });

  // now we can save state to attempt 2
  const saveResult2 = await saveScoreAndState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
    score: 0.2,
    scoreByItem: [0.4, 0.0],
    state: "assignment state 1",
  });

  expect(saveResult2).eqls({ score: 0.2, scoreByItem: [0.4, 0.0] });

  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 2,
  });

  expect(retrievedState).eqls({
    loadedState: true,
    state: "assignment state 1",
    score: 0.2,
    scoreByItem: [0.4, 0.0],
    attemptNumber: 2,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [2, 1],
  });

  retrievedScore = await getScore({
    contentId: contentId,
    loggedInUserId: anonId,
  });

  expect(retrievedScore).eqls({
    loadedScore: true,
    score: 0.2,
    scoreByItem: [0.4, 0],
  });

  // attempt to load attempt 1, which was never taken
  retrievedState = await loadState({
    contentId: contentId,
    loggedInUserId: anonId,
    attemptNumber: 1,
  });

  // get a scores of 0 and a state of null
  expect(retrievedState).eqls({
    loadedState: true,
    state: null,
    score: 0,
    scoreByItem: [0.0, 0],
    attemptNumber: 1,
    contentAttemptNumber: 1,
    itemAttemptNumbers: [1, 1],
  });
});
