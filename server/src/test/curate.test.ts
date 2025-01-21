import { expect, test } from "vitest";
import {
  addDraftToLibrary,
  createActivity,
  getLibraryStatus,
  makeActivityPublic,
  publishActivityToLibrary,

  submitLibraryRequest,
} from "../model";
import { createTestAdminUser, createTestUser } from "./utils";

test("library status admin privileges", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId, null);

  const admin = await createTestAdminUser();
  const adminId = admin.userId;

  const randomUser = await createTestUser();
  const randomUserId = randomUser.userId;

  let statusFromOwner = await getLibraryStatus({userId: ownerId, id: activityId});
  let statusFromAdmin = await getLibraryStatus({userId: adminId, id: activityId});
  let statusFromRandom = await getLibraryStatus({userId: randomUserId, id: activityId});
  expect(statusFromOwner).eqls({status: "none"});
  expect(statusFromAdmin).eqls({status: "none"});
  expect(statusFromRandom).eqls({status: "none"});
  
  await makeActivityPublic({
    id: activityId,
    ownerId,
    licenseCode: "CCDUAL",
  });
  
  statusFromOwner = await getLibraryStatus({userId: ownerId, id: activityId});
  statusFromAdmin = await getLibraryStatus({userId: adminId, id: activityId});
  statusFromRandom = await getLibraryStatus({userId: randomUserId, id: activityId});
  expect(statusFromOwner).eqls({status: "none"});
  expect(statusFromAdmin).eqls({status: "none"});
  expect(statusFromRandom).eqls({status: "none"});

  // Random user cannot request review
  await expect(() => submitLibraryRequest({activityId, ownerId: randomUserId})).rejects.toThrowError();
  let status = await getLibraryStatus({userId: adminId, id: activityId});
  expect(status).eqls({status: "none"}); // still none
  // Random user cannot add draft
  await expect( () => addDraftToLibrary({id: activityId, loggedInUserId: randomUserId})).rejects.toThrowError();
  status = await getLibraryStatus({userId: adminId, id: activityId});
  expect(status).eqls({status: "none"}); // still none

  // Admin cannot request review
  await expect(() => submitLibraryRequest({activityId, ownerId: adminId})).rejects.toThrowError();
  status = await getLibraryStatus({userId: adminId, id: activityId});
  expect(status).eqls({status: "none"}); // still none

  // ... but admin CAN add draft
  await addDraftToLibrary({id: activityId, loggedInUserId: adminId});
  statusFromOwner = await getLibraryStatus({userId: ownerId, id: activityId});
  statusFromAdmin = await getLibraryStatus({userId: adminId, id: activityId});
  statusFromRandom = await getLibraryStatus({userId: randomUserId, id: activityId});
  expect(statusFromOwner).eqls({status: "PENDING_REVIEW", comments: ""});
  expect(statusFromAdmin).eqls({status: "PENDING_REVIEW", comments: ""});
  expect(statusFromRandom).eqls({status: "none"});
});

test.skip("owner requests library review, admin accepts", async () => {
  const owner = await createTestUser();
  const ownerId = owner.userId;
  const { activityId } = await createActivity(ownerId, null);
  await makeActivityPublic({
    id: activityId,
    ownerId,
    licenseCode: "CCDUAL",
  });

  await submitLibraryRequest({ownerId, activityId});
  let status = await getLibraryStatus({userId: ownerId, id: activityId});
  expect(status).eqls({
    status: "PENDING_REVIEW",
    comments: "",
  });

  const admin = await createTestAdminUser();
  const adminId = admin.userId;
  const { draftId } = await addDraftToLibrary({id: activityId, loggedInUserId: adminId});
  status = await getLibraryStatus({userId: ownerId, id: activityId});
  expect(status).eqls({
    status: "PENDING_REVIEW",
    comments: "",
  });

  await publishActivityToLibrary({draftId, loggedInUserId: adminId, comments: "some feedback"});
  status = await getLibraryStatus({userId: ownerId, id: activityId});
  expect(status).eqls({
    status: "PUBLISHED",
    comments: "some feedback",
    publishedId: draftId
  });

});