# Doenet API design

Status: proposal. The questions still open are collected in [Open decisions](#open-decisions); the rest is written as if the recommended answer were chosen. How the current code moves to this design, and which current route each endpoint replaces, is in [API_MIGRATION.md](./API_MIGRATION.md).

The API is one surface that the Doenet app uses in full and that can be published as-is. It has to meet three criteria:

1. **Dogfooded.** The app calls the public API. The private surface is the sign-in flows, the test routes and the health check, nothing else.
2. **Resource-centred.** An endpoint reads or changes one resource or one collection. What a page needs is composed in the app from those endpoints, not pre-mixed on the server.
3. **No slower.** A page load is one round trip to the API. Each page's database queries are the minimum its data needs; they are measured per perf scenario (`docs/adr/0002`) and expected to fall, since the current queries were never designed as a set.

Terms (covered operation, breaking change, stale client, perf scenario, query count snapshot) are those of `CONTEXT.md`. All paths below are under `/api/v1`.

## Principles

### P1. Public by default

Every endpoint declares an `audience`: `public` or `internal`. Internal is only the sign-in flows (`/auth/*`), the Discourse SSO callback, `/health`, `/test/*` and `/metrics/*`. Everything else is public, including endpoints gated by a role or a flag (curation needs `isEditor`, rosters need course ownership, image upload needs `canUploadImages`), the same way an admin endpoint is public but gated. The public OpenAPI document contains only public endpoints; a test fails if the app calls an internal one outside the sign-in files.

### P2. Resources, not screens

- An endpoint returns one resource, one collection, or the result of one command on one resource.
- Related data is attached with `include=`, from a fixed list per resource, never by default. An include is a direct relation of bounded size (a parent, an owner, a list of grants); a collection that needs paging is a sub-resource with its own endpoint, never an include. Each include is resolved with one query for the whole response, not one per item.
- A list returns the summary form of its items (no DoenetML source, no children). The full form is one read away, or an `include`.
- Reference data (licenses, DoenetML versions, categories, classification systems) is its own cacheable collection, never embedded in another response.
- Reads have no side effects. Recording a recent edit or a view is an explicit write the app fires without awaiting.
- The server does not tell the client where to go. A read of something you may not read is `404`; a write you may not make is `403`; every content read carries `permissions` so the app decides what to show.
- Reads are `GET`; replacing a sub-resource is `PUT`; a partial update is `PATCH`; a state transition with side effects (publish, move, restore, sync) is a `POST` command under the resource. `DELETE` moves to the trash.

### P3. One round trip per page

- All the API requests a page needs are issued at once. The only second hop is an auth redirect (a guest entering a class code gets an anonymous account first).
- A page URL carries every id its loader needs, or the API accepts an alias for it: `me` (the signed-in user), `root` (the caller's root folder), `library` (the library's root folder). A loader never calls the API to learn an id it then uses in another call. Aliases are resolved in one middleware before any handler or permission filter runs, and a response addressed by alias is private to the caller, so it never carries a cacheable `Cache-Control`.
- Parallel requests cost the server nothing beyond their own data queries: the session user is cached (see [Session caching](#session-caching)).
- Two perf proxies, snapshotted per perf scenario: `apiRequests` and `apiDepth` (the longest chain of requests where one starts after another ends). `apiDepth` is 1 for every page-load scenario and is the hard rule. Database queries per scenario are snapshotted too, and every change is reviewed, but the target is the minimum the page needs, not parity with any earlier number. An ESLint rule forbids a loader from `await`ing one API call after another outside `Promise.all`.

### P4. Built for where the product is going

Three directions shape the model even though the current data does not need them yet:

- **A group folder is a shared folder.** Any folder someone shares with others at an editing level is a group folder; nothing needs to be a root, an account or a drive for that. So sharing grants carry a role from the start, grants on a folder apply to everything under it, and listings are addressed by folder, never by user. Ownership follows the folder (content is held by the account whose tree it is in) while authorship is a list of people, so co-authors and assistant authors are an additive change.
- **Content commands take sets.** Move, copy, trash and restore accept many ids and are atomic, so the app's multi-select and a public caller's bulk job are the same request.
- **An assignment is a resource that references content, not a kind of content.** Scores, attempts, responses and the class code hang off the assignment. Today an assignment is implemented as a copied content subtree; when assigning becomes an aspect of the same item, the assignment resource keeps its shape and its `contentId` simply stops pointing at a copy.

## Model

```
content/{contentId|root|library}    document, problem set, question bank, folder, image
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
  /trash, /shared-with-me, /recent, /assignments, /scores
library/submissions/{submissionId}  curation, with /comments
search/content, search/authors, explore/trending, explore/recent
licenses, doenetml-versions, categories, classification-systems, classifications
images/uploads, images
auth/*                              internal
```

### Content

The content tree holds five types, named on the wire as `document`, `problemSet`, `questionBank`, `folder` and `image`. (The question bank may be retired; it is a type like any other until then.) A problem set contains documents and question banks; a question bank contains documents; a folder contains anything. Every account has a root folder; `GET /users/{userId}` tells you its id, and `root` and `library` are accepted wherever a folder id is, for the caller's own root and the library's.

A `Content` has `contentId`, `type`, `name`, `ownerId` (the account whose tree it is in, inherited from the parent on create and on move), `parentId`, `visibility` (`private`, `unlisted`, `public`), `licenseCode`, `createdAt`, `lastEdited`, `inLibrary`, the settings of its type (`numVariants` and `doenetmlVersion` for a document; `shuffle` and `paginate` for a problem set; `numToSelect` and `selectByVariant` for a question bank; `repeatInProblemSet` for a document inside a problem set; attribution fields for an image), and `permissions: { canView, canEdit, canShare, canAssign, canDelete, isOwner }` for the caller. The DoenetML source and the children are never in the base form.

Includes: `children` (the activity structure, recursive through problem sets and question banks, never into folders), `parent`, `ancestors` (the chain up to the root, for breadcrumbs), `owner`, `authors`, `shares`, `categories`, `classifications`, `library`, `assignments`, `remixStatus` (whether any remix source has changed since), `source`. The remix sources themselves are a sub-resource (`/remix-sources`), not an include.

| Endpoint                                                            | Auth     | What it does                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /content/{contentId}?include=`                                 | optional | One content item, if it is public, unlisted, shared with the caller, or theirs. `404` otherwise.                                                                                                                                                                                                                                            |
| `GET /content/{folderId}/children?q=&type=&limit=&cursor=&include=` | optional | The items directly in a folder, in order, in summary form; `q` searches names and sources under the folder; `type` filters. Returns what the caller may see of the folder. `include=parent,ancestors` describes the folder itself; `library,shares,assignments` add each item's library status, grants and assignments for an owner's view. |
| `POST /content`                                                     | required | `{ type, name?, parentId, source?, authors?, childrenCopiedFrom? }`. Creates an item in a folder the caller can edit; the item is held by the folder's owner. `childrenCopiedFrom` makes a problem set or question bank whose children are copies of the given ids. Returns the `Content`.                                                  |
| `PATCH /content/{contentId}`                                        | required | Changes any settable scalar: `name`, `licenseCode`, `visibility`, `doenetmlVersionId`, `authors`, the type's settings, an image's attribution. A field the type doesn't have is `400`. A visibility change applies the publishing gates (required categories, audit) and cascades to descendants. Returns the `Content`.                    |
| `DELETE /content/{contentId}`                                       | required | Moves the item and its subtree to the trash. A trashed item is `404` everywhere except `GET /users/me/trash` and `POST /content/restore`. Sugar for `POST /content/trash` with one id.                                                                                                                                                      |
| `POST /content/move`                                                | required | `{ contentIds, parentId, position? }`. Moves the items under a folder the caller can edit, in order, at `position`; their sharing is changed to match the destination. Refused with `409` when the destination is in a tree with a different owner, because that would transfer ownership; copy instead. Atomic.                            |
| `POST /content/copies`                                              | required | `{ contentIds, parentId, prependCopy? }` → `{ contentIds }`. Copies items the caller can view into a folder they can edit, recording the remix relation. Atomic.                                                                                                                                                                            |
| `POST /content/trash`                                               | required | `{ contentIds }`. Atomic.                                                                                                                                                                                                                                                                                                                   |
| `POST /content/restore`                                             | required | `{ contentIds }`. Restores trashed items to where they were. Atomic.                                                                                                                                                                                                                                                                        |

#### Source and revisions

A document's source is DoenetML; a problem set's or question bank's source is the compiled activity that the viewer runs. Revisions are numbered save points with a name and a note, each with a content id (`cid`) that identifies its exact source.

| Endpoint                                                           | What it does                                                                                                                                                                                                             |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET /content/{contentId}/source?revision=&format=`                | `{ source, doenetmlVersion, numVariants, revisionNum?, cid? }`. The current source, or a revision's. `format=activity` asks for the compiled form of a document too.                                                     |
| `GET /content/by-cid/{cid}/source`                                 | The source of a public or unlisted revision by its `cid`, for embedding.                                                                                                                                                 |
| `PUT /content/{contentId}/source`                                  | `{ source, numVariants, doenetmlVersionId?, ifRevision }`. Saves a document's source; `409` if `ifRevision` is not the current revision, so two editors cannot overwrite each other unknowingly. Resets the audit.       |
| `POST /content/{contentId}/source/upgrades`                        | `{ source, doenetmlVersionId }`. Saves a source converted to a newer DoenetML version, recording a revision before and after.                                                                                            |
| `GET /content/{contentId}/revisions?include=source&limit=&cursor=` | The document's revisions, newest first.                                                                                                                                                                                  |
| `POST /content/{contentId}/revisions`                              | `{ name, note, autoGenerated? }` → `{ revisionNum, createdNew, cid }`. Records the current source as a revision; `createdNew` is false if an identical one exists.                                                       |
| `PATCH /content/{contentId}/revisions/{revisionNum}`               | `{ name, note }`.                                                                                                                                                                                                        |
| `POST /content/{contentId}/revisions/{revisionNum}/restore`        | Makes a revision's source current, recording a revision of what it replaced.                                                                                                                                             |
| `PUT /content/{contentId}/audit`                                   | `{ source, doenetmlVersionId, errorsCheckPasses, accessibilityCheckPasses }`. Records the client's diagnostics for the given source; `409` if that source is no longer current. Public sharing requires a passing audit. |

#### Sharing and authorship

Sharing is a list of grants, each `{ user, role, inherited }`, with `role` one of `viewer` or `editor`. A grant on a folder applies to everything under it and shows as `inherited` there. A folder shared at `editor` is a group folder: its editors read, edit and create inside it, and what they create is held by the folder's owner like everything else in that tree. Only `viewer` grants are issued today; `editor` is a new allowed value, not a new shape. `authors` is the list of people credited for the content, separate from the account that holds it; today it is the owner.

| Endpoint                                                         | What it does                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /content/{contentId}/sharing`                               | `{ visibility, shares, inherited: { visibility, shares }, publicShareIssues, publicShareBlockers }`: the item's own grants, what it inherits from its ancestors, and what stops it from being made public (missing required categories, a failing audit, or descendants with either). |
| `POST /content/{contentId}/shares`                               | `{ email \| userId, role }` → the grant. Owner only.                                                                                                                                                                                                                                  |
| `DELETE /content/{contentId}/shares/{userId}`                    | Removes a direct grant. Owner only.                                                                                                                                                                                                                                                   |
| `PUT /content/{contentId}/categories`                            | `{ codes }`. Replaces the item's categories (subject, level and so on).                                                                                                                                                                                                               |
| `POST /content/{contentId}/classifications`                      | `{ classificationId }`. Adds a standards classification.                                                                                                                                                                                                                              |
| `DELETE /content/{contentId}/classifications/{classificationId}` | Removes one.                                                                                                                                                                                                                                                                          |

Visibility and license are fields of the content and change through `PATCH /content/{contentId}`.

#### Remixes and comparison

Copying records a remix relation from the copy to its origin, with the license it was taken under. Either side can later pull the other's changes.

| Endpoint                                                         | What it does                                                                                                                                                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET /content/{contentId}/remix-sources?include=source`          | What this item was remixed from, each with whether it has changed since.                                                                                                                         |
| `GET /content/{contentId}/remixes?include=source`                | What has been remixed from this item.                                                                                                                                                            |
| `POST /content/{contentId}/remix-sources/{originContentId}/sync` | `{ direction: "fromOrigin" \| "toOrigin", revisionNum?, onlyMarkUnchanged? }` → `{ updated, newSource? }`. Copies the source across in the given direction, or marks the relation as up to date. |
| `GET /content/{contentId}/comparisons/{otherContentId}`          | Both sources, their remix relation and which side has changed, for a side-by-side view.                                                                                                          |

#### Library status

| Endpoint                           | What it does                                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `GET /content/{contentId}/library` | The item's relation to the library: its submission if it was proposed, or the submission it is the library's copy of. |

#### Courses

A course is a folder whose students are rostered to it. Until courses become their own resource these live on the folder.

| Endpoint                            | Auth     | What it does                                                                                              |
| ----------------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `GET /content/{folderId}/students`  | required | The roster; owner only.                                                                                   |
| `POST /content/{folderId}/students` | required | `{ count }` → the accounts made, with handles and one-time passwords.                                     |
| `GET /content/{folderId}/gradebook` | required | `{ students, assignments, scores }`: every rostered student's score on every assignment under the folder. |

### Assignments

An `Assignment` is `{ assignmentId, contentId, ownerId, classCode, openOn, closedOn, status, mode, maxAttempts, individualizeByStudent, hasScoreData, permissions }`. `contentId` is the content students work on; `status` is `open` or `closed` from `closedOn`; `mode` is `formative` or `summative`. Owner-only fields are omitted for students. Includes: `content` (with its children), `owner`.

Students work in attempts. An attempt has a variant, a saved state and a score, and for a problem set, per-item attempts of their own. A response is one submitted answer inside an attempt.

| Endpoint                                                                                           | Auth     | What it does                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /assignments`                                                                                | required | `{ contentId, closedOn, parentId? }` → `Assignment`. Assigns content the caller can assign, with a new class code.                                                                                                    |
| `GET /assignments/{assignmentId}?include=content`                                                  | required | The assignment, for its owner or a student who has it.                                                                                                                                                                |
| `PATCH /assignments/{assignmentId}`                                                                | required | `{ closedOn?, maxAttempts?, mode?, individualizeByStudent? }`. Owner only.                                                                                                                                            |
| `GET /content/{contentId}/assignments`                                                             | required | The assignments made from a content item.                                                                                                                                                                             |
| `GET /codes/{classCode}`                                                                           | optional | `{ assignmentId, contentId, name }`. Resolves a class code, which is how students arrive. Codes are small integers, so this endpoint is rate-limited per client and returns nothing beyond what the entry flow needs. |
| `GET /assignments/{assignmentId}/scores?include=items&limit=&cursor=`                              | required | Every student's score, with per-item scores on request. Owner only.                                                                                                                                                   |
| `GET /assignments/{assignmentId}/scores/{userId\|me}`                                              | required | One student's score: best attempt, latest attempt, per-item scores.                                                                                                                                                   |
| `GET /assignments/{assignmentId}/attempts/{userId\|me}`                                            | required | The student's attempts with their scores.                                                                                                                                                                             |
| `GET /assignments/{assignmentId}/attempts/{userId\|me}/{attemptNumber\|latest}?item=&itemAttempt=` | required | One attempt's state, score and variant, with its item states; `item` and `itemAttempt` select one item attempt.                                                                                                       |
| `POST /assignments/{assignmentId}/attempts`                                                        | required | Starts a new attempt for the caller, if `maxAttempts` allows.                                                                                                                                                         |
| `PUT /assignments/{assignmentId}/attempts/me/{attemptNumber}/state`                                | required | `{ state, score, variant, item? }`. Saves the viewer's state and score; returns the recomputed score.                                                                                                                 |
| `POST /assignments/{assignmentId}/responses`                                                       | required | Records one submitted answer with its credit.                                                                                                                                                                         |
| `GET /assignments/{assignmentId}/responses?userId=&answerId=&attempt=&item=&itemAttempt=`          | required | A student's submitted answers to one question; self, or owner for any student.                                                                                                                                        |
| `GET /assignments/{assignmentId}/responses/counts?userId=&attempt=&item=`                          | required | How many responses each answer received, for the owner's review view.                                                                                                                                                 |
| `GET /users/me/assignments?include=content`                                                        | required | What the caller has been assigned.                                                                                                                                                                                    |
| `GET /users/{userId\|me}/scores?parent=`                                                           | required | `{ items: [{ assignmentId, name, score }] }` across assignments, optionally under one course folder; self, or the course's owner.                                                                                     |

### Library (curation)

A submission is a content item proposed for the library, with its status (`pending`, `underReview`, `published`, `rejected`), the library's copy and the comments between submitter and editors.

| Endpoint                                                          | Auth     | What it does                                                                            |
| ----------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| `POST /library/submissions`                                       | required | `{ contentId }` → the submission. Proposes a public document; the library takes a copy. |
| `GET /library/submissions?status=&limit=&cursor=&include=content` | editor   | The queue. `status` takes several values; each item carries its own.                    |
| `POST /library/submissions/{submissionId}/claim`                  | editor   | Takes the review.                                                                       |
| `POST /library/submissions/{submissionId}/publish`                | editor   | Makes the library copy public; the primary editor only; applies the publishing gates.   |
| `POST /library/submissions/{submissionId}/unpublish`              | editor   |                                                                                         |
| `POST /library/submissions/{submissionId}/reject`                 | editor   |                                                                                         |
| `GET /library/submissions/{submissionId}/comments`                | required | The submitter or an editor.                                                             |
| `POST /library/submissions/{submissionId}/comments`               | required | `{ comment }`; whether it is an editor's comment follows from the caller.               |

Library folders are ordinary content under the `library` root.

### Users

| Endpoint                             | Auth     | What it does                                                                                                                                        |
| ------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /users/{userId\|me}`            | optional | `me`: the full profile with `rootFolderId`, `isEditor`, `isAuthor`, `canUploadImages`, `theme`; `401` for a guest. Others: name and `rootFolderId`. |
| `PATCH /users/me`                    | required | `{ firstNames?, lastNames?, isAuthor?, theme? }`.                                                                                                   |
| `GET /users/me/trash`                | required | `{ items: [{ content, deletedOn }] }`.                                                                                                              |
| `GET /users/me/shared-with-me?role=` | required | The folders and items others have granted the caller; with `role=editor`, the group folders the caller can work in.                                 |
| `GET /users/me/recent?mode=&types=`  | required | Recently edited or viewed items.                                                                                                                    |
| `POST /users/me/recent`              | required | `{ contentId, mode }`. Records one.                                                                                                                 |
| `POST /content/{contentId}/views`    | optional | Records a view, for popularity. Counted at most once per viewer per day.                                                                            |

An author's public content is their root folder's listing: `GET /content/{rootFolderId}/children` returns what the caller may see of it.

### Reference data

`GET /licenses`, `GET /doenetml-versions` (the default flagged), `GET /categories` (groups with their categories), `GET /classification-systems` (the full tree), `GET /classifications?q=&systemId=&categoryId=&subCategoryId=&limit=`. Optional auth, `ETag` and `Cache-Control: max-age=3600`. The app fetches each once per session.

### Search and explore

| Endpoint                                                                                                                 | What it does                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET /search/content?q=&systemId=&categoryId=&subCategoryId=&classificationId=&unclassified=&category=&ownerId=&facets=` | `{ community, curated, totalCount, facets?: { categories, classifications, authors } }`: public content matching the text and filters, with the counts behind each facet on request. |
| `GET /search/authors?q=&…filters`                                                                                        | Authors with public content, matched by name, with their counts.                                                                                                                     |
| `GET /explore/trending?…filters`                                                                                         | Public content by recent views.                                                                                                                                                      |
| `GET /explore/recent?…filters`                                                                                           | Public content by when it was shared.                                                                                                                                                |

`category=` repeats for several codes; the server validates them.

### Images

| Endpoint               | What it does                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `POST /images/uploads` | `{ mimeType, sizeBytes }` → a presigned PUT and an upload key. Requires `canUploadImages`.          |
| `POST /images`         | `{ uploadKey, parentId, name?, attribution… }` → the image `Content`, once the upload has been PUT. |

An image is content: `GET /content/{contentId}` reads it, `PATCH` changes its attribution.

### Auth (internal)

`POST /auth/magic-link`, `GET /auth/magic-link/confirm?token=`, `POST /auth/handle`, `POST /auth/anonymous` (returns the user it made), `GET /auth/google`, `POST /auth/logout`, `GET /auth/discourse/sso`. All `audience: internal`; the two OAuth-style callbacks are `external` in the contract's sense.

## Conventions

- Prefix `/api/v1`. The method and path are the identity of an endpoint, for the public and for our own callers; they are fixed from the first public release and evolve additively under expand-migrate-contract. The contract is keyed by them too; the OpenAPI `operationId` that documentation and SDK generators want is derived from them by the generator and is not something a caller says.
- Ids are short UUIDs. The same id is always called the same thing: `contentId`, `folderId` (a content id known to be a folder), `assignmentId`, `userId`, `submissionId`, `revisionNum`, `attemptNumber`.
- Timestamps are ISO 8601 with offset.
- Every collection takes `limit` and `cursor` and returns `{ items, nextCursor }`. The default `limit` is 500, the maximum 1000. A caller that does not page must treat an unexpected `nextCursor` as an error rather than silently show a partial list.
- `include` values are validated against the endpoint's list; an unknown value is `400`.
- Bulk commands are atomic: all ids succeed or none do, and the response lists the outcome per id. A command takes at most 100 ids; cascades (sharing on move, visibility on `PATCH`) run inside the same transaction, which is why the bound exists.
- Responses are always objects; mutations return the resource or the ids they touched.
- Errors use one body, `{ error, details? }`: `400` invalid input, `401` guest where a user is required, `403` permitted to read but not to do this, `404` not found or not viewable, `409` stale `ifRevision`.

### Calling the API

The app and the e2e tests call an endpoint by its route string, the method and path template in one literal, typed from the `paths` interface that `openapi-typescript` generates from the contract:

```ts
const { content } = await request("GET /content/{contentId}", {
  contentId,
  include: ["children", "ancestors"],
});
submit(fetcher, "PATCH /content/{contentId}", { contentId, name });
cy.apiRequest("GET /users/me");
```

A template-literal type over `paths` checks the string: a path not in the contract, a method the path doesn't have, a missing path parameter or a wrong body is a compile error, and the response type is the contract's. Path parameters are substituted from the params object; for `GET` the rest are the query, otherwise the JSON body. Removing an endpoint removes its key, so every caller fails to compile; changing a path is a removal plus an addition, which is what it is to a stale client. GitHub's SDK (`request("GET /repos/{owner}/{repo}", …)`) is the precedent, and the name.

### Session caching

Every request resolves the session user before its handler runs. That user, including `isEditor`, is cached in process for a short TTL keyed by session id, cleared on logout and on `PATCH /users/me` in the same process. A page's parallel requests then cost the server only their own data queries, which is what lets resource endpoints replace bundled ones. The perf middleware's per-request query count shows the effect.

## How the app composes a page

Each loader issues all its requests at once. Reference data is in memory after first use.

| Page                    | Requests, all in parallel                                                                                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root layout             | `GET /users/me`                                                                                                                                                                                                   |
| A folder                | `GET /content/{folderId\|root}/children?include=parent,ancestors,library,shares,assignments`                                                                                                                      |
| An author's content     | `GET /content/{rootFolderId}/children?include=parent,owner`                                                                                                                                                       |
| Library folder          | `GET /content/{folderId\|library}/children?include=parent,ancestors`                                                                                                                                              |
| Curation queue          | `GET /library/submissions?status=pending,underReview,rejected,published&include=content`                                                                                                                          |
| Explore                 | `GET /search/content?facets=…` or `GET /explore/trending` + `GET /explore/recent` + `GET /search/content?curated`; `GET /search/authors`; `GET /users/{ownerId}` when filtering by author                         |
| Activity viewer         | `GET /content/{id}?include=children,owner,authors,classifications,library`, `GET /content/{id}/remix-sources`; `POST /content/{id}/views`                                                                         |
| Editor layout           | `GET /content/{id}?include=ancestors,remixStatus,assignments`; `POST /users/me/recent`                                                                                                                            |
| Editor: edit / view     | `GET /content/{id}/source`                                                                                                                                                                                        |
| Editor: settings        | `GET /content/{id}?include=categories,classifications`, `GET /content/{id}/remix-sources`                                                                                                                         |
| Editor: history         | `GET /content/{id}/revisions`, `GET /content/{id}/source`                                                                                                                                                         |
| Editor: remixes         | `GET /content/{id}/remix-sources`, `GET /content/{id}/remixes`                                                                                                                                                    |
| Editor: library         | `GET /content/{id}/library`, `GET /library/submissions/{submissionId}/comments`                                                                                                                                   |
| Editor: compound        | `GET /content/{id}?include=children` or `GET /content/{id}/source?format=activity`                                                                                                                                |
| Share modal             | `GET /content/{id}/sharing`                                                                                                                                                                                       |
| Assign modal            | `GET /content/{id}`                                                                                                                                                                                               |
| Student enters a code   | `GET /codes/{classCode}`, then the assignment page                                                                                                                                                                |
| Assignment (student)    | `GET /assignments/{id}?include=content`, `GET /assignments/{id}/scores/me`, `GET /assignments/{id}/attempts/me/latest`                                                                                            |
| Assignment overview     | `GET /assignments/{id}?include=content`, `GET /assignments/{id}/scores?include=items`                                                                                                                             |
| Assignment, one student | `GET /assignments/{id}?include=content`, `GET /assignments/{id}/scores/{userId}`, `GET …/attempts/{userId}` or `GET …/attempts/{userId}/{n}?item=` + `GET …/responses/counts`, `GET /content/{courseId}/students` |
| Answer drawer           | `GET /assignments/{id}/responses?…`                                                                                                                                                                               |
| Gradebook               | `GET /content/{folderId}/gradebook`                                                                                                                                                                               |
| Student scores          | `GET /users/{userId}/scores?parent=`, `GET /users/{userId}`                                                                                                                                                       |
| Assigned                | `GET /users/me/assignments?include=content`                                                                                                                                                                       |
| Trash, shared with me   | `GET /users/me/trash` / `GET /users/me/shared-with-me`                                                                                                                                                            |
| Compare                 | `GET /content/{id}/comparisons/{otherId}`                                                                                                                                                                         |
| Scratch pad             | `GET /content/{id}/source`                                                                                                                                                                                        |
| Embed                   | `GET /content/{id}?include=children,source` or `GET /content/by-cid/{cid}/source`                                                                                                                                 |
| Add-to menu             | `GET /users/me/recent`, `GET /content/root/children?type=…&limit=1` per type                                                                                                                                      |
| Move/copy dialog        | `GET /content/{folderId}/children?include=parent,ancestors`; whether an item can be opened is `permissions` plus type                                                                                             |

Mutations are one typed `submit` each; the app revalidates only the loaders the mutation affects, and reference data never revalidates.

## Open decisions

The recommendation is first in each.

1. **Who is the public API for, and how do they authenticate?** Integrations acting as a user, with personal access tokens (`Authorization: Bearer`) scoped read or write; OAuth clients later. This is why `/auth/*` is internal and `me` is meaningful. A server-to-server audience with no user would use only the optional-auth endpoints.
2. **Session cache TTL and invalidation.** 60 seconds, invalidated in process on logout and `PATCH /users/me`, no cross-task invalidation; an admin's change to `isEditor` or `canUploadImages` may take that long to show elsewhere, and a session cookie replayed on another task after logout keeps working for up to the TTL.
3. **`/api/v1` now.** Yes: public URLs are new and stable from the start. No `v2` is planned; breaking changes go through expand-migrate-contract.
4. **One `PATCH /content/{id}` or several?** One, for every scalar field, with per-field permission checks inside. The alternative, one endpoint per concern, keeps each route's rule obvious but recreates sprawl.
5. **Commands versus state fields.** `POST …/claim|publish|reject|unpublish` and `POST /content/move`, because each has side effects and a distinct permission.
6. **Class codes.** `GET /codes/{code}` resolves to an assignment and the student page is `/assignment/:assignmentId`; entry by code costs one extra round trip once. The alternative, accepting `code:12345` wherever an assignment id goes, avoids that at the cost of two id forms.
7. **Root folders as rows.** Give every account a real root folder (a folder row with no parent) and put `rootFolderId` on the profile, so every listing is `GET /content/{folderId}/children` and no endpoint is keyed by user. It is a small, non-destructive database expand (one row per account, top-level items reparented). The alternative keeps the root virtual and needs a user-keyed listing endpoint for other people's content.
8. **Who holds content created in a shared folder.** The folder's owner: `ownerId` is a property of the tree, inherited on create and on move, and `authors` records who wrote it. The alternative, creator-owns (Google Drive's default for ordinary shared folders), needs a transfer-ownership command and a rule for what happens when the creator's access is revoked, and makes the visibility cascade and the move command reason about mixed-owner trees.
9. **Assignment identity.** `assignmentId` is the assignment root's content id for now; when assigning stops copying, it becomes its own id and `contentId` points at the authored content. Public callers see no change in shape. Because the two ids are equal today, mixing them works by accident: the app brands `AssignmentId` and `ContentId` as distinct types, and `/assignments/{id}` is `404` for any content that is not an assignment root.
10. **Bulk atomicity and bound.** All-or-nothing, with a per-id outcome list, at most 100 ids per command. The alternative, best-effort with partial success and no bound, is simpler to implement and harder to reason about from the app, and lets one public call hold locks over arbitrarily large subtrees.
11. **Lists without source.** List items never carry DoenetML.
12. **Reads with side effects.** None; `POST /users/me/recent` and `POST /content/{id}/views` are explicit writes the app fires without awaiting. Callers that don't send them don't count toward recency or popularity.
13. **Pagination from the start.** `limit` and `cursor` on every collection, default 500, so the app's behaviour doesn't change and the public surface is bounded.
14. **Search as one resource with facets.** `GET /search/content` returns hits plus opt-in facets; authors, trending and recent are separate requests in parallel.
15. **Content type names on the wire.** `document`, `problemSet`, `questionBank`, `folder`, `image`, the names people use, rather than the database enum's `singleDoc`, `select`, `sequence`. The handlers translate.
16. **What "no slower" means.** `apiDepth` 1 is the rule. `apiRequests` and database queries per scenario are snapshotted and every change is reviewed in the PR that causes it, with the aim of the minimum a page needs rather than parity with any earlier number.
