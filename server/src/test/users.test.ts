import { describe, expect, test } from "vitest";
import { createTestAnonymousUser, createTestUser } from "./utils";
import { fromUUID } from "../utils/uuid";
import {
  createStudentHandleAccounts,
  findOrCreateUser,
  getAuthorInfo,
  getMyUserInfo,
  getUserInfoIfLoggedIn,
  setIsAuthor,
  updateUser,
  upgradeAnonymousUser,
} from "../query/user";
import { getMyContent } from "../query/content_list";
import { createContent } from "../query/activity";
import { prisma } from "../model";

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
  const { allCategories, allDoenetmlVersions, allLicenses, notMe, ...docs2 } =
    docs;
  expect(docs2).toStrictEqual({
    content: [],
    libraryRelations: [],
    parent: null,
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

  const { user: userInfo } = await getMyUserInfo({
    loggedInUserId: user.userId,
  });
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
  const anonUser = await createTestAnonymousUser();

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

test("turn author mode on and off", async () => {
  const { userId } = await createTestUser();

  let userInfo = await getMyUserInfo({ loggedInUserId: userId });
  expect(userInfo.user.isAuthor).eq(false);

  await setIsAuthor({ loggedInUserId: userId, isAuthor: true });
  userInfo = await getMyUserInfo({ loggedInUserId: userId });
  expect(userInfo.user.isAuthor).eq(true);

  await setIsAuthor({ loggedInUserId: userId, isAuthor: false });
  userInfo = await getMyUserInfo({ loggedInUserId: userId });
  expect(userInfo.user.isAuthor).eq(false);
});

test("user apis do not provide email", async () => {
  const { userId: loggedInUserId } = await createTestUser();
  const results1 = await getMyUserInfo({ loggedInUserId });
  expect(results1.user).not.toHaveProperty("email");

  const results2 = await getAuthorInfo(loggedInUserId);
  expect(results2).not.toHaveProperty("email");

  const results3 = await getUserInfoIfLoggedIn({ loggedInUserId });
  expect(results3!.user).not.toHaveProperty("email");
});

describe("student handles", () => {
  describe("create", () => {
    test("instructor creates accounts", async () => {
      const { userId } = await createTestUser();

      // create folder
      const { contentId } = await createContent({
        loggedInUserId: userId,
        contentType: "folder",
        parentId: null,
      });

      const { accounts } = await createStudentHandleAccounts({
        loggedInUserId: userId,
        folderId: contentId,
        numAccounts: 3,
      });

      const dbAccounts = await prisma.users.findMany({
        where: { scopedToClassId: contentId },
        select: { username: true },
        orderBy: { username: "asc" },
      });

      expect(accounts).toHaveLength(3);
      expect(dbAccounts).toHaveLength(3);

      for (const [i, account] of accounts.entries()) {
        expect(typeof account.handle).toBe("string");
        expect(typeof account.password).toBe("string");
        // Expect there not to be an number symbols
        expect(account.handle.split("").every((c) => isNaN(Number(c)))).toBe(
          true,
        );

        expect(dbAccounts[i].username).toEqual(
          `${fromUUID(contentId)}:${account.handle}`,
        );
      }
    });

    test.todo("handles are unique inside the folder");

    test.todo("instructor cannot create nested accounts");
  });
  test.todo("only instructor can change student password");
});
