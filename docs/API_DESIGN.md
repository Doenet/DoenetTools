# Doenet API design

Status: proposal. The questions still open are collected in [Open decisions](#open-decisions); the rest is written as if the recommended answer were chosen. How the current code moves to this design, and what it replaces, is in [API_MIGRATION.md](./API_MIGRATION.md).

The API is one surface that the Doenet app uses in full and that can be published as-is. It has to meet three criteria:

1. **Dogfooded.** The app calls the public API. The private surface is the sign-in flows, the test routes and the health check, nothing else.
2. **Resource-centred.** An operation reads or changes one resource or one collection. What a page needs is composed in the app from those operations, not pre-mixed on the server.
3. **No slower.** A page load is one round trip to the API, and database queries per perf scenario do not go up (perf proxies as in `docs/adr/0002`).

Terms (operation, covered operation, breaking change, stale client, perf scenario, query count snapshot) are those of `CONTEXT.md`.

## Principles

### P1. Public by default

Every operation declares an `audience`: `public` or `internal`. Internal is only the sign-in flows (`/auth/*`), the Discourse SSO callback, `/health`, `/test/*` and `/metrics/*`. Everything else is public, including operations gated by a role or a flag (curation needs `isEditor`, rosters need course ownership, image upload needs `canUploadImages`), the same way an admin endpoint is public but gated. The public OpenAPI document contains only public operations; a test fails if the app calls an internal one outside the sign-in files.

### P2. Resources, not screens

- An operation returns one resource, one collection, or the result of one command on one resource.
- Related data is attached with `include=`, from a fixed list per resource, never by default.
- A list returns the summary form of its items (no DoenetML source, no children). The full form is one read away, or an `include`.
- Reference data (licenses, DoenetML versions, categories, classification systems) is its own cacheable collection, never embedded in another response.
- Reads have no side effects. Recording a recent edit or a view is an explicit write the app fires without awaiting.
- The server does not tell the client where to go. A read of something you may not read is `404`; a write you may not make is `403`; every content read carries `permissions` so the app decides what to show.
- Reads are `GET`; replacing a sub-resource is `PUT`; a partial update is `PATCH`; a state transition with side effects (publish, move, restore, sync) is a `POST` command under the resource. `DELETE` moves to the trash.

### P3. One round trip per page

- All the API requests a page needs are issued at once. The only second hop is an auth redirect (a guest entering a class code gets an anonymous account first).
- A page URL carries every id its loader needs, or the API accepts an alias for it: `me` (the signed-in user), `root` (the caller's personal root folder), `library` (the library root). A loader never calls the API to learn an id it then uses in another call.
- Parallel requests cost the server nothing beyond their own data queries: the session user is cached (see [Session caching](#session-caching)).
- Two perf proxies, snapshotted per perf scenario: `apiRequests` and `apiDepth` (the longest chain of requests where one starts after another ends). `apiDepth` is 1 for every page-load scenario. An ESLint rule forbids a loader from `await`ing one API call after another outside `Promise.all`.

### P4. Built for where the product is going

Three directions shape the model even though the current data does not need them yet:

- **Content is held by a drive, authored by people.** A folder tree belongs to a root, which today is a user's personal root or the library, and later may be a group's. Listings are addressed by folder, not by user. Sharing grants carry a role. Authorship is a separate list from the holding account, so assistant authors and co-authors are an additive change.
- **Content operations take sets.** Move, copy, trash and restore accept many ids and are atomic, so the app's multi-select and a public caller's bulk job are the same operation.
- **An assignment is a resource that references content, not a kind of content.** Scores, attempts, responses and the class code hang off the assignment. Today an assignment is implemented as a copied content subtree; when assigning becomes an aspect of the same item, the assignment resource keeps its shape and its `contentId` simply stops pointing at a copy.

## Model

```
drives                              the roots the caller can see
content/{contentId|root|library}    doc, problem set, question bank, folder, image
  /children                         folder listing (paginated); activity structure via include=children
  /source, /revisions, /audit
  /sharing, /shares/{userId}
  /categories, /classifications/{classificationId}
  /remix-sources, /remixes, /comparisons/{otherContentId}
  /library                          this content's library status
  /assignments                      assignments made from this content
  /students, /gradebook             course roster and gradebook (course folders)
  /views                            popularity (write only)
content/move, /copies, /trash, /restore   bulk commands
assignments/{assignmentId}
  /scores/{userId|me}, /attempts/{userId|me}/{attemptNumber}, /responses, /responses/counts
codes/{classCode}
users/{userId|me}
  /content, /trash, /shared-with-me, /recent, /assignments, /scores
library/submissions/{submissionId}  curation, with /comments
search/content, search/authors, explore/trending, explore/recent
licenses, doenetml-versions, categories, classification-systems, classifications
images/uploads, images
auth/*                              internal
```

### Content

`Content` is a discriminated union on `type` (`singleDoc`, `select`, `sequence`, `folder`, `image`). Its own fields: `contentId`, `type`, `name`, `ownerId` (the account whose drive holds it), `parentId`, `visibility`, `licenseCode`, `createdAt`, `lastEdited`, the type-specific settings (`numVariants`, `shuffle`, `paginate`, `numToSelect`, `selectByVariant`, `repeatInProblemSet`, image attribution), `inLibrary`, and `permissions: { canView, canEdit, canShare, canAssign, canDelete, isOwner }`. DoenetML source and children are never in the base form.

Includes: `children` (the activity structure, recursive through `sequence` and `select`, never into folders), `parent`, `ancestors` (the chain to the root), `owner`, `authors`, `shares`, `categories`, `classifications`, `library`, `assignments`, `remixStatus` (whether a remix source has changed), `source`.

| Operation             | Method and path                                                     | Auth     | Notes                                                                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getContent`          | `GET /content/{contentId}?include=`                                 | optional | Public, unlisted, shared or own content.                                                                                                                                                                                         |
| `createContent`       | `POST /content`                                                     | required | `{ type, name?, parentId, source?, childrenCopiedFrom?: contentId[] }` → `Content`. `parentId` may be `root` or `library` (editor only).                                                                                         |
| `updateContent`       | `PATCH /content/{contentId}`                                        | required | Any settable scalar of the type: `name`, `licenseCode`, `visibility`, `doenetmlVersionId`, the type-specific settings, image attribution. A field the type doesn't have is `400`. Visibility changes apply the publishing gates. |
| `deleteContent`       | `DELETE /content/{contentId}`                                       | required | Moves to the trash; sugar for `trashContent` with one id.                                                                                                                                                                        |
| `listContentChildren` | `GET /content/{folderId}/children?q=&type=&limit=&cursor=&include=` | optional | The folder listing. `folderId` may be `root` or `library`. `include=parent,ancestors,library,shares,assignments` for an owner's view.                                                                                            |
| `moveContent`         | `POST /content/move`                                                | required | `{ contentIds, parentId, position? }`. Atomic. Cascades sharing to match the destination.                                                                                                                                        |
| `copyContent`         | `POST /content/copies`                                              | required | `{ contentIds, parentId, prependCopy? }` → `{ contentIds }`. Atomic.                                                                                                                                                             |
| `trashContent`        | `POST /content/trash`                                               | required | `{ contentIds }`. Atomic.                                                                                                                                                                                                        |
| `restoreContent`      | `POST /content/restore`                                             | required | `{ contentIds }`. Atomic.                                                                                                                                                                                                        |

#### Source and revisions

| Operation                | Method and path                                                    | Notes                                                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getContentSource`       | `GET /content/{contentId}/source?revision=&format=`                | `{ source, doenetmlVersion, numVariants, revisionNum?, cid? }`. Compound content returns the compiled activity; `format=activity` asks for it for a document too. `GET /content/by-cid/{cid}/source` resolves a public revision by CID. |
| `saveContentSource`      | `PUT /content/{contentId}/source`                                  | `{ source, numVariants, doenetmlVersionId?, ifRevision? }`. `409` when `ifRevision` is stale.                                                                                                                                           |
| `upgradeContentSyntax`   | `POST /content/{contentId}/source/upgrades`                        | `{ source, doenetmlVersionId }`. Records the before and after revisions and saves.                                                                                                                                                      |
| `listContentRevisions`   | `GET /content/{contentId}/revisions?include=source&limit=&cursor=` |                                                                                                                                                                                                                                         |
| `createContentRevision`  | `POST /content/{contentId}/revisions`                              | `{ name, note, autoGenerated? }` → `{ revisionNum, createdNew, cid }`.                                                                                                                                                                  |
| `updateContentRevision`  | `PATCH /content/{contentId}/revisions/{revisionNum}`               | `{ name, note }`.                                                                                                                                                                                                                       |
| `restoreContentRevision` | `POST /content/{contentId}/revisions/{revisionNum}/restore`        |                                                                                                                                                                                                                                         |
| `setContentAudit`        | `PUT /content/{contentId}/audit`                                   | `{ source, doenetmlVersionId, errorsCheckPasses, accessibilityCheckPasses }`; `409` if the source is stale.                                                                                                                             |

#### Sharing, authorship, categories, classifications

Sharing is a list of grants, each `{ user, role, inherited }`. The only role today is `viewer`; `editor` is an additive change. `authors` is the list of people credited for the content, separate from the holding account; today it is the owner.

| Operation                     | Method and path                                                  | Notes                                                                                                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getContentSharing`           | `GET /content/{contentId}/sharing`                               | `{ visibility, shares, inherited: { visibility, shares }, publicShareIssues, publicShareBlockers }`: the derived sharing state of one content, including what blocks making it public. |
| `shareContent`                | `POST /content/{contentId}/shares`                               | `{ email \| userId, role }` → the grant.                                                                                                                                               |
| `unshareContent`              | `DELETE /content/{contentId}/shares/{userId}`                    |                                                                                                                                                                                        |
| `setContentCategories`        | `PUT /content/{contentId}/categories`                            | `{ codes }`.                                                                                                                                                                           |
| `addContentClassification`    | `POST /content/{contentId}/classifications`                      | `{ classificationId }`.                                                                                                                                                                |
| `removeContentClassification` | `DELETE /content/{contentId}/classifications/{classificationId}` |                                                                                                                                                                                        |

Visibility and license are fields of the content and change through `updateContent`.

#### Remixes and comparison

| Operation              | Method and path                                                  | Notes                                                                                                      |
| ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `listRemixSources`     | `GET /content/{contentId}/remix-sources?include=source`          |                                                                                                            |
| `listRemixes`          | `GET /content/{contentId}/remixes?include=source`                |                                                                                                            |
| `syncRemixSource`      | `POST /content/{contentId}/remix-sources/{originContentId}/sync` | `{ direction: "fromOrigin" \| "toOrigin", revisionNum?, onlyMarkUnchanged? }` → `{ updated, newSource? }`. |
| `getContentComparison` | `GET /content/{contentId}/comparisons/{otherContentId}`          | Both sources, their relation and change flags.                                                             |

#### Library status

| Operation                 | Method and path                    | Notes                                                                                         |
| ------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `getContentLibraryStatus` | `GET /content/{contentId}/library` | The content's relation to the library: as a source (its submission) or as the library's copy. |

#### Courses

A course is a folder whose students are rostered to it. Until courses become their own resource these live on the folder.

| Operation               | Method and path                     | Auth     | Notes                                                                                    |
| ----------------------- | ----------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `listContentStudents`   | `GET /content/{folderId}/students`  | required | The roster; owner only.                                                                  |
| `createContentStudents` | `POST /content/{folderId}/students` | required | `{ count }` → the accounts made, with handles and one-time passwords.                    |
| `getContentGradebook`   | `GET /content/{folderId}/gradebook` | required | `{ students, assignments, scores }`: every student on every assignment under the folder. |

### Drives

A drive is a root the caller can see: their personal root, the library, and later any group drive. It exists so the app can list roots without assuming they belong to users.

| Operation    | Method and path | Notes                                                                                     |
| ------------ | --------------- | ----------------------------------------------------------------------------------------- |
| `listDrives` | `GET /drives`   | `{ items: [{ driveId, kind: "personal" \| "library" \| "group", name, rootFolderId }] }`. |

`root` and `library` are aliases for the two drives every caller has; a group drive is addressed by its `rootFolderId` like any folder.

### Assignments

An `Assignment` is `{ assignmentId, contentId, ownerId, classCode, openOn, closedOn, status, mode, maxAttempts, individualizeByStudent, hasScoreData, permissions }`. `contentId` is the content students work on. Owner-only fields are omitted for students. Includes: `content` (with its children), `owner`.

| Operation                 | Method and path                                                                                    | Auth     | Notes                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| `createAssignment`        | `POST /assignments`                                                                                | required | `{ contentId, closedOn, parentId? }` → `Assignment`.                            |
| `getAssignment`           | `GET /assignments/{assignmentId}?include=content`                                                  | required | Students and owner.                                                             |
| `updateAssignment`        | `PATCH /assignments/{assignmentId}`                                                                | required | `{ closedOn?, maxAttempts?, mode?, individualizeByStudent? }`.                  |
| `listContentAssignments`  | `GET /content/{contentId}/assignments`                                                             | required | Assignments made from a content.                                                |
| `resolveClassCode`        | `GET /codes/{classCode}`                                                                           | optional | `{ assignmentId, contentId, name }`.                                            |
| `listAssignmentScores`    | `GET /assignments/{assignmentId}/scores?include=items&limit=&cursor=`                              | required | Every student's score; owner only.                                              |
| `getAssignmentScore`      | `GET /assignments/{assignmentId}/scores/{userId\|me}`                                              | required | `ScoreData` for one student.                                                    |
| `listAssignmentAttempts`  | `GET /assignments/{assignmentId}/attempts/{userId\|me}`                                            | required | Per-attempt scores.                                                             |
| `getAssignmentAttempt`    | `GET /assignments/{assignmentId}/attempts/{userId\|me}/{attemptNumber\|latest}?item=&itemAttempt=` | required | State, score, variant and item states of one attempt.                           |
| `createAssignmentAttempt` | `POST /assignments/{assignmentId}/attempts`                                                        | required | For `me`.                                                                       |
| `saveAttemptState`        | `PUT /assignments/{assignmentId}/attempts/me/{attemptNumber}/state`                                | required | Returns `ScoreData`.                                                            |
| `recordResponse`          | `POST /assignments/{assignmentId}/responses`                                                       | required | One submitted answer.                                                           |
| `listResponses`           | `GET /assignments/{assignmentId}/responses?userId=&answerId=&attempt=&item=&itemAttempt=`          | required | Self, or owner for any student.                                                 |
| `getResponseCounts`       | `GET /assignments/{assignmentId}/responses/counts?userId=&attempt=&item=`                          | required |                                                                                 |
| `listUserAssignments`     | `GET /users/me/assignments?include=content`                                                        | required | What the caller has been assigned.                                              |
| `listUserScores`          | `GET /users/{userId\|me}/scores?parent=`                                                           | required | `{ items: [{ assignmentId, name, score }] }`; self, or the owner of the course. |

### Library (curation)

A submission is a content proposed for the library, with its status (`pending`, `underReview`, `published`, `rejected`), the library's copy and its comments.

| Operation                    | Method and path                                                   | Auth     | Notes                                                                     |
| ---------------------------- | ----------------------------------------------------------------- | -------- | ------------------------------------------------------------------------- |
| `createLibrarySubmission`    | `POST /library/submissions`                                       | required | `{ contentId }` → the submission.                                         |
| `listLibrarySubmissions`     | `GET /library/submissions?status=&limit=&cursor=&include=content` | editor   | `status` takes several values; each item carries its own.                 |
| `claimLibrarySubmission`     | `POST /library/submissions/{submissionId}/claim`                  | editor   |                                                                           |
| `publishLibrarySubmission`   | `POST /library/submissions/{submissionId}/publish`                | editor   | The primary editor; applies the publishing gates.                         |
| `unpublishLibrarySubmission` | `POST /library/submissions/{submissionId}/unpublish`              | editor   |                                                                           |
| `rejectLibrarySubmission`    | `POST /library/submissions/{submissionId}/reject`                 | editor   |                                                                           |
| `listLibraryComments`        | `GET /library/submissions/{submissionId}/comments`                | required | The submitter or an editor.                                               |
| `addLibraryComment`          | `POST /library/submissions/{submissionId}/comments`               | required | `{ comment }`; whether it is an editor's comment follows from the caller. |

Library folders are ordinary content under the `library` root.

### Users

| Operation           | Method and path                                         | Auth     | Notes                                                                                                                                 |
| ------------------- | ------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `getUser`           | `GET /users/{userId\|me}`                               | optional | `me`: the full profile with `isEditor`, `isAuthor`, `canUploadImages`, `theme`; `401` for a guest. Others: the public profile.        |
| `updateUser`        | `PATCH /users/me`                                       | required | `{ firstNames?, lastNames?, isAuthor?, theme? }`.                                                                                     |
| `listUserContent`   | `GET /users/{userId}/content?parent=&q=&limit=&cursor=` | optional | The content this user owns that the caller may see: an author's public listing. The caller's own tree is `listContentChildren(root)`. |
| `listUserTrash`     | `GET /users/me/trash`                                   | required | `{ items: [{ content, deletedOn }] }`.                                                                                                |
| `listSharedWithMe`  | `GET /users/me/shared-with-me`                          | required |                                                                                                                                       |
| `listUserRecent`    | `GET /users/me/recent?mode=&types=`                     | required |                                                                                                                                       |
| `recordUserRecent`  | `POST /users/me/recent`                                 | required | `{ contentId, mode }`.                                                                                                                |
| `recordContentView` | `POST /content/{contentId}/views`                       | optional |                                                                                                                                       |

### Reference data

`GET /licenses`, `GET /doenetml-versions` (the default flagged), `GET /categories` (groups with their categories), `GET /classification-systems` (the full tree), `GET /classifications?q=&systemId=&categoryId=&subCategoryId=&limit=`. Optional auth, `ETag` and `Cache-Control: max-age=3600`. The app fetches each once per session.

### Search and explore

| Operation          | Method and path                                                                                                          | Notes                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `searchContent`    | `GET /search/content?q=&systemId=&categoryId=&subCategoryId=&classificationId=&unclassified=&category=&ownerId=&facets=` | `{ community, curated, totalCount, facets?: { categories, classifications, authors } }`. A result with its facets is one resource; facets are opt-in. |
| `searchAuthors`    | `GET /search/authors?q=&…filters`                                                                                        |                                                                                                                                                       |
| `listTrending`     | `GET /explore/trending?…filters`                                                                                         |                                                                                                                                                       |
| `listRecentPublic` | `GET /explore/recent?…filters`                                                                                           |                                                                                                                                                       |

`category=` repeats for several codes; the server validates them.

### Images

| Operation           | Method and path        | Notes                                                                    |
| ------------------- | ---------------------- | ------------------------------------------------------------------------ |
| `createImageUpload` | `POST /images/uploads` | `{ mimeType, sizeBytes }` → a presigned PUT. Requires `canUploadImages`. |
| `createImage`       | `POST /images`         | `{ uploadKey, parentId, name?, attribution… }` → the image `Content`.    |

An image is content: `getContent` reads it, `updateContent` changes its attribution.

### Auth (internal)

`POST /auth/magic-link`, `GET /auth/magic-link/confirm?token=`, `POST /auth/handle`, `POST /auth/anonymous` (returns the user it made), `GET /auth/google`, `POST /auth/logout`, `GET /auth/discourse/sso`. All `audience: internal`; the two OAuth-style callbacks are `external` in the contract's sense.

## Conventions

- Prefix `/api/v1`. The method and path are the identity of an operation, for the public and for our own callers; they are fixed from the first public release and evolve additively under expand-migrate-contract. The `name` in `defineOperation` is the OpenAPI `operationId`, used by the generated documentation, SDK generators and the request log; no caller says it.
- Ids are short UUIDs. The same id is always called the same thing: `contentId`, `folderId` (a content id known to be a folder), `assignmentId`, `userId`, `submissionId`, `revisionNum`, `attemptNumber`.
- Timestamps are ISO 8601 with offset.
- Every collection takes `limit` and `cursor` and returns `{ items, nextCursor }`. The default `limit` is 500, the maximum 1000.
- `include` values are validated against the operation's list; an unknown value is `400`.
- Bulk commands are atomic: all ids succeed or none do, and the response lists the outcome per id.
- Responses are always objects; mutations return the resource or the ids they touched.
- Errors use one body, `{ error, details? }`: `400` invalid input, `401` guest where a user is required, `403` permitted to read but not to do this, `404` not found or not viewable, `409` stale `ifRevision`.

### Calling the API

The app and the e2e tests call an operation by its route string, the method and path template in one literal, typed from the `paths` interface that `openapi-typescript` generates from the contract:

```ts
const { content } = await api("GET /v1/content/{contentId}", {
  contentId,
  include: ["children", "ancestors"],
});
submit(fetcher, "PATCH /v1/content/{contentId}", { contentId, name });
cy.api("GET /v1/users/me");
```

A template-literal type over `paths` checks the string: a path not in the contract, a method the path doesn't have, a missing path parameter or a wrong body is a compile error, and the response type is the contract's. Path parameters are substituted from the params object; for `GET` the rest are the query, otherwise the JSON body. Removing an operation removes its key, so every caller fails to compile; changing a path is a removal plus an addition, which is what it is to a stale client. GitHub's SDK (`request("GET /repos/{owner}/{repo}", …)`) is the precedent.

### Session caching

Every request resolves the session user before its handler runs. That user, including `isEditor`, is cached in process for a short TTL keyed by session id, cleared on logout and on `updateUser` in the same process. A page's parallel requests then cost the server only their own data queries, which is what lets resource operations replace bundled ones without raising query counts. The perf middleware's per-request query count shows the effect.

## How the app composes a page

Each loader issues all its requests at once. Reference data is in memory after first use. Operation names stand for their route strings.

| Page                    | Requests, all in parallel                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Root layout             | `getUser(me)`                                                                                                                                                                  |
| My content (a folder)   | `listContentChildren(folderId \| root, include=parent,ancestors,library,shares,assignments)`                                                                                   |
| An author's content     | `listUserContent(userId, parent)`, `getUser(userId)`                                                                                                                           |
| Library folder          | `listContentChildren(folderId \| library, include=parent,ancestors)`                                                                                                           |
| Curation queue          | `listLibrarySubmissions(status=pending,underReview,rejected,published, include=content)`                                                                                       |
| Explore                 | `searchContent(facets=…)` or `listTrending` + `listRecentPublic` + `searchContent(curated)`; `searchAuthors`; `getUser(ownerId)` when filtering by author                      |
| Activity viewer         | `getContent(id, include=children,owner,authors,classifications,library,remixSources)`; `recordContentView`                                                                     |
| Editor layout           | `getContent(id, include=ancestors,remixStatus,assignments)`; `recordUserRecent`                                                                                                |
| Editor: edit / view     | `getContentSource(id)`                                                                                                                                                         |
| Editor: settings        | `getContent(id, include=categories,classifications,remixSources)`                                                                                                              |
| Editor: history         | `listContentRevisions(id)`, `getContentSource(id)`                                                                                                                             |
| Editor: remixes         | `listRemixSources(id)`, `listRemixes(id)`                                                                                                                                      |
| Editor: library         | `getContentLibraryStatus(id)`, `listLibraryComments(submissionId)`                                                                                                             |
| Editor: compound        | `getContent(id, include=children)` or `getContentSource(id, format=activity)`                                                                                                  |
| Share modal             | `getContentSharing(id)`                                                                                                                                                        |
| Assign modal            | `getContent(id)`                                                                                                                                                               |
| Student enters a code   | `resolveClassCode`, then the assignment page                                                                                                                                   |
| Assignment (student)    | `getAssignment(id, include=content)`, `getAssignmentScore(id, me)`, `getAssignmentAttempt(id, me, latest)`                                                                     |
| Assignment overview     | `getAssignment(id, include=content)`, `listAssignmentScores(id, include=items)`                                                                                                |
| Assignment, one student | `getAssignment(id, include=content)`, `getAssignmentScore(id, user)`, `listAssignmentAttempts` or `getAssignmentAttempt(…) + getResponseCounts`, `listContentStudents(course)` |
| Answer drawer           | `listResponses`                                                                                                                                                                |
| Gradebook               | `getContentGradebook(folderId)`                                                                                                                                                |
| Student scores          | `listUserScores(user, parent)`, `getUser(user)`                                                                                                                                |
| Assigned                | `listUserAssignments(include=content)`                                                                                                                                         |
| Trash, shared with me   | `listUserTrash` / `listSharedWithMe`                                                                                                                                           |
| Compare                 | `getContentComparison`                                                                                                                                                         |
| Scratch pad             | `getContentSource(id)`                                                                                                                                                         |
| Embed                   | `getContent(id, include=children,source)` or `getContentSource(by-cid)`                                                                                                        |
| Add-to menu             | `listUserRecent`, `listContentChildren(root, type=…, limit=1)` per type                                                                                                        |
| Move/copy dialog        | `listContentChildren(folderId, include=parent,ancestors)`; `canOpen` is `permissions` plus type                                                                                |

Mutations are one typed `submit` each; the app revalidates only the loaders the mutation affects, and reference data never revalidates.

## Open decisions

The recommendation is first in each.

1. **Who is the public API for, and how do they authenticate?** Integrations acting as a user, with personal access tokens (`Authorization: Bearer`) scoped read or write; OAuth clients later. This is why `/auth/*` is internal and `me` is meaningful. A server-to-server audience with no user would use only the optional-auth operations.
2. **Session cache TTL and invalidation.** 60 seconds, invalidated in process on logout and `updateUser`, no cross-task invalidation; an admin's change to `isEditor` or `canUploadImages` may take that long to show elsewhere.
3. **`/api/v1` now.** Yes: public URLs are new and stable from the start. No `v2` is planned; breaking changes go through expand-migrate-contract.
4. **One `updateContent` or several?** One `PATCH /content/{id}` for every scalar field, with per-field permission checks inside. The alternative, one operation per concern, keeps each route's rule obvious but recreates sprawl.
5. **Commands versus state fields.** `POST …/claim|publish|reject|unpublish` and `POST /content/move`, because each has side effects and a distinct permission.
6. **Class codes.** `GET /codes/{code}` resolves to an assignment and the student page is `/assignment/:assignmentId`; entry by code costs one extra round trip once. The alternative, accepting `code:12345` wherever an assignment id goes, avoids that at the cost of two id forms.
7. **Drives now or later.** Ship `listDrives` and the `root`/`library` aliases now, with only the two kinds; group drives are a new row later. The alternative is to leave `drives` out until a group feature exists, which means the app keeps assuming a root is a user.
8. **Assignment identity.** `assignmentId` is the assignment root's content id for now; when assigning stops copying, it becomes its own id and `contentId` points at the authored content. Public callers see no change in shape.
9. **Bulk atomicity.** All-or-nothing, with a per-id outcome list. The alternative, best-effort with partial success, is simpler to implement and harder to reason about from the app.
10. **Lists without source.** List items never carry DoenetML.
11. **Reads with side effects.** None; `recordUserRecent` and `recordContentView` are explicit writes the app fires without awaiting. Callers that don't send them don't count toward recency or popularity.
12. **Pagination from the start.** `limit` and `cursor` on every collection, default 500, so the app's behaviour doesn't change and the public surface is bounded.
13. **Search as one resource with facets.** `searchContent` returns hits plus opt-in facets; authors, trending and recent are separate operations requested in parallel.
14. **What "no slower" means.** `apiDepth` 1, and `apiRequests` and database queries per scenario not above their snapshots, with any rise accepted explicitly in the PR that causes it.
