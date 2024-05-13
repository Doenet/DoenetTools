import { expect, test, vi } from 'vitest'
import { findOrCreateUser, listUserDocs } from './model'

test('Do something with database', async () => {
  const username = "vitest-" + new Date().toJSON() + "@vitest.test"
  const ret = await findOrCreateUser(username);
  const docs = await listUserDocs(ret);
  expect(docs).toStrictEqual(
  {
    success: true,
    publicActivities: [],
    privateActivities: [],
    fullName: "stand-in name",
    notMe: false,
  });
});