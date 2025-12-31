import { prisma } from "../model";
import { UserInfo, UserInfoWithEmail } from "../types";
import { InvalidRequestError } from "../utils/error";
import { generateHandle } from "../utils/names";
import { filterEditableContent } from "../utils/permissions";
import { getDescendantIds, getAncestorIds } from "./activity";
import { fromUUID } from "../utils/uuid";
import bcrypt from "bcryptjs";
import { generateClassCode } from "./assign";

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
    create: {
      email,
      firstNames,
      lastNames,
      username: email,
      isEditor,
      isAnonymous,
    },
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
  firstNames?: string;
  lastNames?: string;
}) {
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

export async function createStudentHandleAccounts({
  loggedInUserId,
  folderId,
  numAccounts,
}: {
  loggedInUserId: Uint8Array;
  folderId: Uint8Array;
  numAccounts: number;
}) {
  // Make sure 1) content is owned by user and 2) content is a folder
  await prisma.content.findUniqueOrThrow({
    where: {
      id: folderId,
      ...filterEditableContent(loggedInUserId),
      type: "folder",
    },
    select: { id: true },
  });

  const ancestorIds = await getAncestorIds(folderId);
  let conflictingStudentHandles = await prisma.content.findMany({
    where: {
      id: { in: ancestorIds },
    },
    select: {
      _count: {
        select: {
          scopedUsers: true,
        },
      },
    },
  });

  if (conflictingStudentHandles.some((c) => c._count.scopedUsers > 0)) {
    throw new InvalidRequestError(
      "Parent folder already contains student handle accounts.",
    );
  }

  const descendantIds = await getDescendantIds(folderId);
  conflictingStudentHandles = await prisma.content.findMany({
    where: {
      id: { in: descendantIds },
    },
    select: {
      _count: {
        select: {
          scopedUsers: true,
        },
      },
    },
  });

  if (conflictingStudentHandles.some((c) => c._count.scopedUsers > 0)) {
    throw new InvalidRequestError(
      "Subfolder already contains student handle accounts.",
    );
  }

  // Create the student handle accounts
  const accounts: { userId: Uint8Array; handle: string; password: string }[] =
    [];

  for (let i = 0; i < numAccounts; i++) {
    const password = generateHandle(true);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

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

  // Create a code for this course folder if one does not already exist
  const folder = await prisma.content.findUniqueOrThrow({
    where: { id: folderId },
    select: { classCode: true },
  });

  let code = folder.classCode;
  if (!code) {
    const newClassCode = await generateClassCode();
    await prisma.content.update({
      where: { id: folderId },
      data: { classCode: newClassCode },
    });
    code = newClassCode;
  }

  return { accounts, code };
}
