import { findOrCreateUser } from "../model";

// create an isolated user for each test, will allow tests to be run in parallel
export async function createTestUser(isAdmin = false, isAnonymous = false) {
  const id = Date.now().toString();
  const email = `vitest${id}@vitest.test`;
  const firstNames = `vitest`;
  const lastNames = `user${id}`;
  const user = await findOrCreateUser({
    email,
    firstNames,
    lastNames,
    isAdmin,
    isAnonymous,
  });
  return user;
}

export async function createTestAdminUser() {
  return await createTestUser(true);
}

export async function createTestAnonymousUser() {
  return await createTestUser(false, true);
}
