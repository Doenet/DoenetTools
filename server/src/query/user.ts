import { prisma } from "../model";
import { UserInfo, UserInfoWithEmail } from "../types";
import { generateHandle } from "../utils/names";
import { filterEditableContent } from "../utils/permissions";
import { fromUUID } from "../utils/uuid";
import bcrypt from "bcryptjs";

export async function findOrCreateUser({
  email,
  firstNames,
  lastNames,
  isEditor = false,
  isAnonymous = false,
  isPremium,
}: {
  email: string;
  firstNames: string | null;
  lastNames: string;
  isEditor?: boolean;
  isAnonymous?: boolean;
  isPremium?: boolean;
}): Promise<UserInfoWithEmail> {
  // For now, make any non-anonymous user a premium user
  // We'll change this once we have the UI for non-premium users working
  // by deleting this line and by defaulting isPremium to false in the function signature
  isPremium = isPremium ?? !isAnonymous;

  let user = await prisma.users.upsert({
    where: { email },
    update: {},
    create: {
      email,
      firstNames,
      lastNames,
      username: email,
      isEditor,
      isAnonymous,
      isPremium,
    },
  });

  if (lastNames !== "" && user.lastNames == "") {
    user = await prisma.users.update({
      where: { email },
      data: { firstNames, lastNames },
    });
  }

  return {
    userId: user.userId,
    email: user.email,
    firstNames: user.firstNames,
    lastNames: user.lastNames,
    username: user.username,
    isAnonymous: user.isAnonymous,
    isAuthor: user.isAuthor,
  };
}

export function getUserInfoIfLoggedIn({
  loggedInUserId,
}: {
  loggedInUserId?: Uint8Array;
}) {
  if (!loggedInUserId) {
    return;
  }

  return getMyUserInfo({ loggedInUserId });
}

export async function getMyUserInfo({
  loggedInUserId,
}: {
  loggedInUserId: Uint8Array;
}) {
  const user = await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: {
      userId: true,
      firstNames: true,
      lastNames: true,
      isAnonymous: true,
      isEditor: true,
      isAuthor: true,
    },
  });
  return { user };
}

export async function getUser({ userId }: { userId: Uint8Array }) {
  return getAuthorInfo(userId);
}

export async function getAuthorInfo(userId: Uint8Array): Promise<UserInfo> {
  return await prisma.users.findUniqueOrThrow({
    where: { userId },
    select: {
      userId: true,
      firstNames: true,
      lastNames: true,
      username: true,
    },
  });
}

export async function getUserInfoFromEmail(
  email: string,
): Promise<UserInfoWithEmail> {
  const user = await prisma.users.findUniqueOrThrow({
    where: { email },
    select: {
      userId: true,
      email: true,
      firstNames: true,
      lastNames: true,
      username: true,
      isAnonymous: true,
      isEditor: true,
    },
  });
  return user;
}

export async function upgradeAnonymousUser({
  userId,
  email,
}: {
  userId: Uint8Array;
  email: string;
}) {
  const user = await prisma.users.update({
    where: { userId, isAnonymous: true },
    data: { isAnonymous: false, email },
  });

  return user;
}

export async function updateUser({
  loggedInUserId,
  firstNames,
  lastNames,
}: {
  loggedInUserId: Uint8Array;
  firstNames?: string;
  lastNames?: string;
}): Promise<UserInfoWithEmail> {
  const { isAnonymous } = await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: { isAnonymous: true },
  });
  if (isAnonymous && (firstNames !== "" || lastNames !== "")) {
    throw new Error("Anonymous users cannot set name.");
  }

  const user = await prisma.users.update({
    where: { userId: loggedInUserId },
    data: { firstNames, lastNames },
  });
  return {
    userId: user.userId,
    email: user.email,
    firstNames: user.firstNames,
    lastNames: user.lastNames,
    username: user.username,
    isAnonymous: user.isAnonymous,
    isAuthor: user.isAuthor,
  };
}

export async function setIsAuthor({
  loggedInUserId,
  isAuthor,
}: {
  loggedInUserId: Uint8Array;
  isAuthor: boolean;
}) {
  await prisma.users.update({
    where: { userId: loggedInUserId },
    data: { isAuthor },
  });
}

export async function createStudentHandleAccounts({
  loggedInUserId,
  folderId,
  numAccounts,
}: {
  loggedInUserId: Uint8Array;
  folderId: Uint8Array;
  numAccounts: number;
}) {
  // Make sure content is a course owned by `loggedInUserId`
  await prisma.content.findUniqueOrThrow({
    where: {
      id: folderId,
      courseRootId: folderId,
      ...filterEditableContent(loggedInUserId),
    },
    select: { id: true },
  });

  // Create the student handle accounts
  const accounts: { userId: Uint8Array; handle: string; password: string }[] =
    [];

  for (let i = 0; i < numAccounts; i++) {
    const password = generateHandle(true);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // We're looping in case `generateHandle` creates a duplicate handle
    // Usernames are unique, so we try again if that happens
    let success = false;
    while (success === false) {
      const handle = generateHandle();
      const username = `${fromUUID(folderId)}:${handle}`;

      try {
        const { userId } = await prisma.users.create({
          data: {
            username,
            firstNames: "",
            lastNames: handle,
            scopedToClassId: folderId,
            passwordHash,
          },
        });

        accounts.push({ handle, password, userId });
        success = true;
      } catch (_e) {
        continue;
      }
    }
  }

  accounts.sort((a, b) => (a.handle < b.handle ? -1 : 1));

  return { accounts };
}
