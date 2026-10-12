import { afterEach, expect, test, vi } from "vitest";
import { prisma } from "../model";
import { getLibraryAccountId } from "../query/curate";
import { isEqualUUID } from "../utils/uuid";

afterEach(() => {
  vi.restoreAllMocks();
});

// Runs in its own file so the per-process cache starts empty.
test("getLibraryAccountId caches the library id, but not a failed lookup", async () => {
  const { userId: libraryId } = await prisma.users.findFirstOrThrow({
    where: { isLibrary: true },
    select: { userId: true },
  });

  // Prisma's model methods don't survive a plain spy, so wrap the original
  const findFirstOrThrow = prisma.users.findFirstOrThrow.bind(prisma.users);
  const lookup = vi
    .spyOn(prisma.users, "findFirstOrThrow")
    .mockImplementation(findFirstOrThrow as never)
    .mockRejectedValueOnce(new Error("lookup failed"));

  await expect(getLibraryAccountId()).rejects.toThrow("lookup failed");

  // The failure isn't cached: the next call looks it up again
  expect(isEqualUUID(await getLibraryAccountId(), libraryId)).eq(true);
  expect(lookup).toHaveBeenCalledTimes(2);

  // Success is cached: later calls don't query
  expect(isEqualUUID(await getLibraryAccountId(), libraryId)).eq(true);
  expect(lookup).toHaveBeenCalledTimes(2);
});
