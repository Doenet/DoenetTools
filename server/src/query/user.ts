import { prisma } from "../model";
import { UserInfo } from "../types";

export async function findOrCreateUser({
  email,
  firstNames,
  lastNames,
  isAdmin = false,
  isAnonymous = false,
}: {
  email: string;
  firstNames: string | null;
  lastNames: string;
  isAdmin?: boolean;
  isAnonymous?: boolean;
}) {
  let user = await prisma.users.upsert({
    where: { email },
    update: {},
    create: { email, firstNames, lastNames, isAdmin, isAnonymous },
  });

  if (lastNames !== "" && user.lastNames == "") {
    user = await prisma.users.update({
      where: { email },
      data: { firstNames, lastNames },
    });
  }

  const { isLibrary: _isLibrary, ...userNoLibrary } = user;
  return userNoLibrary;
}

export function getUserInfoIfLoggedIn({
  loggedInUserId,
}: {
  loggedInUserId?: Uint8Array;
}) {
  if (!loggedInUserId) {
    return;
  }

  return getUserInfo({ loggedInUserId });
}

export async function getUserInfo({
  loggedInUserId,
}: {
  loggedInUserId: Uint8Array;
}) {
  const user = await prisma.users.findUniqueOrThrow({
    where: { userId: loggedInUserId },
    select: {
      userId: true,
      email: true,
      firstNames: true,
      lastNames: true,
      isAnonymous: true,
      isAdmin: true,
      isDeveloper: true,
    },
  });
  return { user };
}

export async function getAuthorInfo(userId: Uint8Array): Promise<UserInfo> {
  const user = await prisma.users.findUniqueOrThrow({
    where: { userId },
    select: {
      userId: true,
      firstNames: true,
      lastNames: true,
    },
  });
  return { email: "", ...user };
}

export async function getUserInfoFromEmail(email: string) {
  const user = await prisma.users.findUniqueOrThrow({
    where: { email },
    select: {
      userId: true,
      email: true,
      firstNames: true,
      lastNames: true,
      isAnonymous: true,
      isAdmin: true,
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
  firstNames: string;
  lastNames: string;
}) {
  const user = await prisma.users.update({
    where: { userId: loggedInUserId },
    data: { firstNames, lastNames },
  });
  const { isLibrary: _isLibrary, ...userNoLibrary } = user;
  return userNoLibrary;
}

export async function setIsDeveloper({
  loggedInUserId,
  isDeveloper,
}: {
  loggedInUserId: Uint8Array;
  isDeveloper: boolean;
}) {
  await prisma.users.update({
    where: { userId: loggedInUserId },
    data: { isDeveloper },
  });
}
