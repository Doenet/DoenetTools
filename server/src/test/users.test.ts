import { expect, test } from "vitest";
import { createTestAnonymousUser, createTestUser } from "./utils";
import { fromUUID } from "../utils/uuid";
import {
  findOrCreateUser,
  getUserInfo,
  updateUser,
  upgradeAnonymousUser,
} from "../query/user";
import { getMyContent } from "../query/content_list";

test("New user has no content", async () => {
  const user = await createTestUser();
  const userId = user.userId;
  const docs = await getMyContent({
    ownerId: userId,
    loggedInUserId: userId,
    parentId: null,
  });
  if (docs.notMe) {
    throw Error("shouldn't happen");
  }
  const {
    availableFeatures,
    allDoenetmlVersions,
    allLicenses,
    notMe,
    ...docs2
  } = docs;
  expect(docs2).toStrictEqual({
    content: [],
    folder: null,
  });
});

test("Update user name", async () => {
  let user = await createTestUser();
  const userId = user.userId;
  expect(user.firstNames).eq("vitest");
  expect(user.lastNames.startsWith("user")).eq(true);

  user = await updateUser({
    loggedInUserId: userId,
    firstNames: "New",
    lastNames: "Name",
  });
  expect(user.firstNames).eq("New");
  expect(user.lastNames).eq("Name");

  const { user: userInfo } = await getUserInfo({ userId: user.userId });
  expect(userInfo.firstNames).eq("New");
  expect(userInfo.lastNames).eq("Name");
});

test("findOrCreateUser finds an existing user or creates a new one", async () => {
  const email = `unique-${Date.now()}@example.com`;
  const firstNames = "vitest";
  const lastNames = "user";
  const user = await findOrCreateUser({ email, firstNames, lastNames });
  expect(user.userId).toBeTypeOf("object");
  expect(fromUUID(user.userId)).toBeTypeOf("string");
  // Attempt to find the same user again
  const sameUser = await findOrCreateUser({ email, firstNames, lastNames });
  expect(sameUser).toStrictEqual(user);
});

test("upgrade anonymous user", async () => {
  let anonUser = await createTestAnonymousUser();
  anonUser = await updateUser({
    loggedInUserId: anonUser.userId,
    firstNames: "Zoe",
    lastNames: "Zaborowski",
  });

  expect(anonUser.isAnonymous).eq(true);

  const id = Date.now().toString();
  const realEmail = `real${id}@vitest.test`;

  const upgraded = await upgradeAnonymousUser({
    userId: anonUser.userId,
    email: realEmail,
  });

  expect(upgraded.isAnonymous).eq(false);
  expect(upgraded.email).eq(realEmail);
});
