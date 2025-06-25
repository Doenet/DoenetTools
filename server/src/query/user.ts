import { prisma } from "../model";
import { UserInfo, UserInfoWithEmail } from "../types";

export async function findOrCreateUser({
  email,
  firstNames,
  lastNames,
  isEditor = false,
  isAnonymous = false,
}: {
  email: string;
  firstNames: string | null;
  lastNames: string;
  isEditor?: boolean;
  isAnonymous?: boolean;
}) {
  let user = await prisma.users.upsert({
    where: { email },
    update: {},
    create: { email, firstNames, lastNames, isEditor, isAnonymous },
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
      firstNames: true,
      lastNames: true,
      isAnonymous: true,
      isEditor: true,
      isAuthor: true,
    },
  });
  return { user };
}

export async function getAuthorInfo(userId: Uint8Array): Promise<UserInfo> {
  return await prisma.users.findUniqueOrThrow({
    where: { userId },
    select: {
      userId: true,
      firstNames: true,
      lastNames: true,
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
