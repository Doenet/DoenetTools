# A resource-centred API for Doenet

Status: proposal. Decisions the maintainers still have to make are collected in [Decisions needed](#decisions-needed) at the end; everything before it is written as if the recommended option were chosen.

The goal is one API that the app uses in full and that can be published as-is. It is judged on three criteria:

1. **Dogfooded.** The app calls the public API. The private surface is the sign-in flows, the test routes and the health check, nothing else.
2. **Resource-centred, not screen-shaped.** An operation reads or changes one resource (or one collection). What a page needs is composed in the app from those operations, not pre-mixed on the server.
3. **No slower than today.** The perf proxies of `docs/adr/0002` stay flat: database queries per perf scenario, and, new in this proposal, API round trips per page load, which must be exactly one.

Criteria 2 and 3 pull against each other: screen-shaped endpoints exist precisely because one request was the cheapest way to load a page. The proposal resolves that with two mechanisms (`include` expansions and identity aliases such as `me`), one structural rule (a page URL carries every id its loader needs, so its requests can all go out at once) and one server change (the session user is cached, so a parallel request costs no extra database queries). The sections below first describe what is there now, then the rules, then the resources, then how each page is composed under the new API, and finally the migration.

Terms (operation, covered operation, breaking change, stale client, perf scenario, query count snapshot) are those of `CONTEXT.md`.

## Where we are

Both inventories were taken from the code on `main` at the time of writing (the route list is `apps/api/contract-uncovered.json`).

**Surface.** About 110 `/api` routes. One (`getAssigned`) is a covered operation; the rest are Express routes with a Zod input schema and no response schema. The app calls one operation through the typed client; everything else is raw `axios` (40 files on the ESLint suppression list) or `fetcher.submit({ path, ...body })` through `genericAction`.

**Screen-shaped responses.** Eighteen routes return a bundle assembled for one page. The clearest cases:

- `getMyContent`, `searchMyContent`, `getCurationFolderContent`, `searchCurationFolderContent` and `getCurationQueue` each return a folder listing **plus** every category, every DoenetML version and every license. The app's root loader has already fetched two of those three lists on the same page load. `content_list.ts` carries a TODO asking whether the extra data is needed.
- `getEditor`, `getEditorSettings`, `getEditorShareStatus`, `getDocEditorHistory`, `getCompoundEditorView`, `getCompoundEditorEdit`, `getContentDescription`: one route per editor tab, each a different slice of the same content row plus whatever that tab's React component wanted.
- `getAssignmentResponseStudent`: student info, the assignment, overall scores, item names, the whole class roster, and then either one attempt's state with response counts or all attempt scores, selected by query parameters.
- `searchExplore` and `browseExplore`: 15 and 12 independent result sets each from its own query, sent as `POST`.
- `getActivityViewerData`: content tree plus remix sources plus library relations.

About seventy routes are called from exactly one page or component. Content lists (every one except Explore) ship the full DoenetML source of every document in the folder.

**Round trips.** No loader in the app runs its calls in parallel (the only `Promise.all` is in a menu popup). Serial chains with no data dependency:

| Page                     | Chain                                                                      | Depth |
| ------------------------ | -------------------------------------------------------------------------- | ----- |
| Every page (root loader) | `getMyUserInfo` → `getAllLicenses` → `getAllDoenetmlVersions`              | 3     |
| Explore                  | `getAllCategories` → `browseExplore` / `searchExplore`                     | 2     |
| Editor (header)          | `getEditor` → `getContentDescription`                                      | 2     |
| Editor settings tab      | `getEditorSettings` → `getAllCategories` → `getRemixSources`               | 3     |
| Editor remixes tab       | `getRemixSources` → `getRemixes`                                           | 2     |
| Editor library tab       | `getLibraryRelations` → `getComments`                                      | 2     |
| Shared activities        | `getSharedContent` → `getUser`                                             | 2     |
| Assignment viewer        | `getMyUserInfo` → [`login/anonymous`] → `code/:code` → `getAssignmentData` | 3–4   |
| Content info drawer      | `getRemixSources` → `getRemixes`                                           | 2     |
| Add-to menu              | `getRecentContent` → 3 × `checkIfContentContains`                          | 2     |

The root loader runs on every page and on every revalidation, so an editor settings page load today is 3 (root) in parallel with 2 (header) in parallel with 3 (settings): a critical path of three round trips before data is ready, and the same again after every mutation, since nothing defines `shouldRevalidate` and the reference lists are refetched each time.

**Other findings the redesign has to carry.**

- Reads with writes: `getEditor` and `getMyContent` record recent content; `getActivityViewerData` and `getSharedContent` record views; every score read may rewrite the score cache.
- Two visibility paths: `PATCH /content/:id/access` enforces the category and audit gates; the legacy `setContentIsPublic` (used by `ShareTable` and by `moveContent`) does not, and `publishActivityToLibrary` writes visibility directly.
- Authorization inconsistencies: `getCurationFolderContent` is not editor-gated but its search twin is; `getMoveCopyContentData` fetches the parent with no ownership filter; `recordSubmittedEvent` checks nothing about `contentId`; `getMyContent` returns `200 { notMe: true }` instead of `403`; `getEditor` is declared optional-auth but throws without a user.
- Dead or wrong wiring: `/score/loadItemState` is bound to `loadState`; `getContentSource` strips its revision parameters; `updateContentSettings` accepts and ignores `activityLevelAttempts` and `itemLevelAttempts`; the settings page reads `isPublic`, `isShared` and `assigned` from a response that doesn't contain them.
- Shape inconsistencies: five routes return bare arrays; many mutations return an empty body (`createCurationFolder` doesn't return the id it made); the same id is called `contentId`, `assignmentId`, `parentId`, `folderId`, `compareId`, `id`.
- Reads as `POST`: `searchExplore`, `browseExplore`, `getClassifications`.
- `getMyUserInfo` returns an empty body for a guest; `login/anonymous` returns `{ anonymous: true }` rather than the user it created; `logout` is a `GET` with side effects.

## Rules

These are the criteria made checkable. Each has an enforcement mechanism; a rule without one would decay the way the current API did.

### R1. The app calls only public operations

Every operation declares an `audience`: `"public"` or `"internal"`. Internal is limited to: the sign-in flows (`/auth/*`, since a public API will authenticate with tokens, not magic links), the Discourse SSO callback, `/health`, `/test/*`, and `/metrics/*` until it has an admin role. Everything else is public. Curation, course rosters and image upload are public operations gated by a role or flag (`isEditor`, course ownership, `canUploadImages`), the same way GitHub's admin endpoints are public but gated.

Enforcement: the OpenAPI document is generated twice (public and full); a test in `apps/api/src/contract` lists every operation the app calls (from the generated client's usage) and fails on an internal one outside a fixed allowlist of the sign-in files.

### R2. Operations are resources, not screens

- An operation returns one resource, one collection, or the result of one command on one resource. It never returns two unrelated things (a folder listing and the license list).
- Related data is attached with `include=` (comma-separated, from a fixed list per resource), never by default. A response without `include` is the resource's own fields.
- A list returns a summary form (no DoenetML source, no children). The full form is one `getX` call away, or an `include`.
- Reference data (licenses, DoenetML versions, categories, classification systems) is its own collection, served with `ETag` and `Cache-Control: max-age`, and never embedded in another response.
- No read has a side effect. Recording a recent edit or a view is an explicit, fire-and-forget write from the app (`POST /users/me/recent`, `POST /content/{id}/views`), off the critical path.
- No "notMe", no "notCompound", no redirect hints. A read of something you may not read is `404`; something you may read but not edit is `403` on the edit, and the read carries `permissions` so the app can decide what to show.
- Paths are plural kebab-case nouns; ids are `contentId`, `userId`, `revisionNum`, `attemptNumber` everywhere; responses are always objects; collections are `{ items, nextCursor }`; mutations return the resource (or its id) they touched.
- Reads are `GET`; replacing a whole sub-resource is `PUT`; partial updates are `PATCH`; state transitions with side effects (publish, reject, move, restore, sync) are `POST` commands under the resource. `DELETE` is a soft delete.
- Optional path segments (`/:parentId?`) are gone; the optional thing is a query parameter.

Enforcement: review, plus a contract test that rejects a `get` operation whose response schema has more than one top-level key that is itself a named resource schema, unless the key is declared as an `include`.

### R3. One round trip per page load, and no more queries than today

- **Waterfall depth is 1.** All API requests a page needs are issued at once. The only permitted second hop is an auth redirect (a guest entering a class code gets an anonymous account, then the page loads).
- **Structural rule that makes depth 1 possible:** a page URL carries every id its loader needs, or the API accepts an alias for it. The aliases are `me` (the signed-in user), `library` (the library account) and `root` (a user's top-level folder). A loader never calls the API to learn an id it then uses in another call.
- **Parallel requests are free of database cost.** A page that composes several resources sends several requests at once. Today each request costs three queries before its handler runs (the session row, the user row in `deserializeUser`, and `getIsEditor` in most handlers), which would make resource operations lose to bundled ones on query count. So the session user is cached: see [Session caching](#session-caching).
- **Database queries per perf scenario ≤ today's.** With auth queries gone, a screen-shaped handler split into resource handlers runs the same data queries it ran before, plus at most a repeated permission lookup on the pages that compose several sub-resources of one content (accounted for below).
- **Request count per page is a snapshot, not a ceiling.** Parallel requests on one HTTP/2 connection add no round trips; what they add is per-request overhead on the server, which the query-count proxy and the session cache cover. A change in the count is accepted explicitly like a query-count change.

Enforcement: two new perf proxies in the harness of #3059, snapshotted per perf scenario like query counts: `apiRequests` and `apiDepth` (the longest chain of requests where one starts after another ends). `apiDepth` must be 1 for every page-load scenario; a change to `apiRequests` must be accepted explicitly. Locally, an ESLint rule for `loader`/`action` functions forbids `await`ing an `api()` call after another `await` of one unless both are inside `Promise.all`.

## Resources

The domain has one big resource, **content**, with everything else either a sub-resource of it, a user, reference data, or a search.

```
users/{userId|me}                 profile, settings
  /content                        a user's folder listing (parent=, q=)
  /trash, /shared-with-me, /recent, /assignments, /scores
content/{contentId}               doc, problem set, question bank, folder, image, assignment root
  /children                       folder contents (paginated); activity structure via include=children
  /source, /revisions, /audit
  /sharing, /shares/{userId}
  /categories, /classifications/{id}
  /remix-sources, /remixes, /comparisons/{otherId}
  /library                        this content's library status (as source or as library copy)
  /students                       course roster (course root only)
  /gradebook                      all students × all assignments under a folder
  /scores/{userId|me}             one student's score on an assignment
  /attempts/{userId|me}[/{n}]     attempt state
  /responses, /responses/counts   submitted answers
  /views                          popularity (write only)
assignments                       create (copy + assign)
codes/{classCode}                 resolve a class code to content
library/submissions/{id}          curation queue, claim/publish/reject/unpublish, comments
search/content, explore/trending, explore/recent
licenses, doenetml-versions, categories, classification-systems, classifications
images/uploads, images
auth/* (internal)                 magic-link, handle, anonymous, google, logout, discourse
```

### Content

`Content` is the existing discriminated union (`singleDoc | select | sequence | folder | image`) **without** `doenetML` and without `children` unless included. The base fields stay as in `sharedResponseSchemas.ts` plus:

- `permissions: { canView, canEdit, canShare, canAssign, canDelete, isOwner }`, always present. This replaces `getEditor`'s redirect-by-exception, `licenseIsEditable`, `notMe` and `canOpen`.
- `assignment` (present on assignment roots and their descendants): `{ status, classCode, closedOn, mode, maxAttempts, individualizeByStudent, hasScoreData }`, owner-only fields omitted for students.
- `inLibrary: boolean`.

Includes: `children` (the activity structure, recursive through `sequence`/`select`, never into folders), `parent`, `ancestors` (the chain to the root, for breadcrumbs; replaces `getContentDescription`), `owner`, `sharedWith`, `classifications`, `categories` (already small; made opt-in to keep lists light), `library` (the `LibraryRelations`), `remixStatus` (`remixSourceHasChanged`), `source` (the document's DoenetML and version, for callers that want one request).

| Operation             | Method and path                                                | Auth     | Notes                                                                                                                                                                                                                                                                                                                                               |
| --------------------- | -------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getContent`          | `GET /content/{contentId}?include=`                            | optional | Public, unlisted, shared or own content. Replaces the editor header, settings, compound-edit, viewer, description and image-details reads.                                                                                                                                                                                                          |
| `createContent`       | `POST /content`                                                | required | `{ type, name?, parentId, source?, childrenCopiedFrom?: contentId[] }`. Returns the `Content`. `parentId: "library"` creates in the library (editor only).                                                                                                                                                                                          |
| `updateContent`       | `PATCH /content/{contentId}`                                   | required | Any settable scalar: `name`, `licenseCode`, `visibility`, `doenetmlVersionId`, `shuffle`, `paginate`, `numToSelect`, `selectByVariant`, `repeatInProblemSet`, assignment settings (`closedOn`, `maxAttempts`, `mode`, `individualizeByStudent`), image attribution. One operation replaces nine. Visibility changes go through the gated path only. |
| `deleteContent`       | `DELETE /content/{contentId}`                                  | required | Soft delete, as today.                                                                                                                                                                                                                                                                                                                              |
| `restoreContent`      | `POST /content/{contentId}/restore`                            | required |                                                                                                                                                                                                                                                                                                                                                     |
| `moveContent`         | `POST /content/{contentId}/move`                               | required | `{ parentId, position }`. A command because it cascades sharing.                                                                                                                                                                                                                                                                                    |
| `copyContent`         | `POST /content/copies`                                         | required | `{ contentIds, parentId, prependCopy? }` → `{ contentIds }`. Multiple sources, so not `POST /content`.                                                                                                                                                                                                                                              |
| `listContentChildren` | `GET /content/{contentId}/children?q=&limit=&cursor=&include=` | optional | Folder listing. `include=library,sharedWith,assignment` for the owner's view.                                                                                                                                                                                                                                                                       |
| `containsContentType` | `GET /content/{contentId}/children?type=&limit=1`              | required | Replaces `checkIfContentContains`: the same list operation with a type filter; the app asks for three types in parallel.                                                                                                                                                                                                                            |

#### Source and revisions

| Operation                | Method and path                                             | Notes                                                                                                                                                                                                                                                               |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getContentSource`       | `GET /content/{contentId}/source?revision=&format=`         | `{ source, doenetmlVersion, numVariants, revisionNum?, cid? }`. For compound content `source` is the compiled activity JSON. `format=activity` asks for the compiled form of a doc too. Also serves `getPublicContentByCid` via `GET /content/by-cid/{cid}/source`. |
| `saveContentSource`      | `PUT /content/{contentId}/source`                           | `{ source, numVariants, doenetmlVersionId?, ifRevision? }`. `409` when `ifRevision` is stale (the audit route's rule, generalised).                                                                                                                                 |
| `upgradeContentSyntax`   | `POST /content/{contentId}/source/upgrades`                 | `{ source, doenetmlVersionId }`. Creates the before/after revisions and saves, as `saveSyntaxUpdate` does.                                                                                                                                                          |
| `listContentRevisions`   | `GET /content/{contentId}/revisions?include=source`         | Replaces `getDocEditorHistory`; the current source is `getContentSource` in parallel.                                                                                                                                                                               |
| `createContentRevision`  | `POST /content/{contentId}/revisions`                       | `{ name, note, autoGenerated? }` → `{ revisionNum, createdNew, cid }`.                                                                                                                                                                                              |
| `updateContentRevision`  | `PATCH /content/{contentId}/revisions/{revisionNum}`        | `{ name, note }`.                                                                                                                                                                                                                                                   |
| `restoreContentRevision` | `POST /content/{contentId}/revisions/{revisionNum}/restore` | Replaces `revertToRevision`.                                                                                                                                                                                                                                        |
| `setContentAudit`        | `PUT /content/{contentId}/audit`                            | As today (already resource-shaped).                                                                                                                                                                                                                                 |

#### Sharing, categories, classifications

| Operation                     | Method and path                                                  | Notes                                                                                                                                                                                                        |
| ----------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `getContentSharing`           | `GET /content/{contentId}/sharing`                               | `{ visibility, isPublic, sharedWith, inherited: { visibility, sharedWith }, publicShareIssues, publicShareBlockers }`. Replaces `getEditorShareStatus`. Derived state of one resource, so not screen-shaped. |
| `shareContent`                | `POST /content/{contentId}/shares`                               | `{ email }` → the user shared with.                                                                                                                                                                          |
| `unshareContent`              | `DELETE /content/{contentId}/shares/{userId}`                    |                                                                                                                                                                                                              |
| (visibility, license)         | `PATCH /content/{contentId}`                                     | `setContentIsPublic` is retired; `moveContent` and `publishLibrarySubmission` call the gated visibility code internally.                                                                                     |
| `setContentCategories`        | `PUT /content/{contentId}/categories`                            | `{ codes: string[] }`.                                                                                                                                                                                       |
| `addContentClassification`    | `POST /content/{contentId}/classifications`                      | `{ classificationId }`.                                                                                                                                                                                      |
| `removeContentClassification` | `DELETE /content/{contentId}/classifications/{classificationId}` |                                                                                                                                                                                                              |

#### Remixes and comparison

| Operation              | Method and path                                                  | Notes                                                                                                                                             |
| ---------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `listRemixSources`     | `GET /content/{contentId}/remix-sources?include=source`          |                                                                                                                                                   |
| `listRemixes`          | `GET /content/{contentId}/remixes?include=source`                |                                                                                                                                                   |
| `syncRemixSource`      | `POST /content/{contentId}/remix-sources/{originContentId}/sync` | `{ direction: "fromOrigin" \| "toOrigin", revisionNum?, onlyMarkUnchanged? }` → `{ updated, newSource? }`. Replaces both `update…ToOrigin/Remix`. |
| `getContentComparison` | `GET /content/{contentId}/comparisons/{otherContentId}`          | Both sources, the relation and change flags, as `getDoenetMLComparison`. A comparison is a resource of its own (like a GitHub compare view).      |

#### Assignments, scores, attempts, responses

An assignment is content (`isAssignmentRoot`); creating one copies content and assigns the copy.

| Operation                  | Method and path                                                                             | Auth     | Notes                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `createAssignment`         | `POST /assignments`                                                                         | required | `{ contentId, closedOn, parentId }` → `Content` of the new assignment root (with `assignment.classCode`).                      |
| `resolveClassCode`         | `GET /codes/{classCode}`                                                                    | optional | `{ contentId, type, name }`. The student entry point; see Decision 6.                                                          |
| `listContentStudents`      | `GET /content/{courseId}/students`                                                          | required | The roster, owner only. Replaces `allStudents` inside `getAssignmentResponseStudent`.                                          |
| `createContentStudents`    | `POST /content/{courseId}/students`                                                         | required | `{ count }` → accounts with handles. Replaces `user/handles`.                                                                  |
| `getContentGradebook`      | `GET /content/{folderId}/gradebook`                                                         | required | `{ students, assignments, scores[][] }`. Replaces `getAllAssignmentScores`.                                                    |
| `listContentScores`        | `GET /content/{contentId}/scores?include=items`                                             | required | All students on one assignment (owner). Replaces the `scoreSummary` of `getAssignmentResponseOverview`.                        |
| `getContentScore`          | `GET /content/{contentId}/scores/{userId\|me}`                                              | required | `ScoreData`. Replaces `getScore` and the `scoreData` of `getAssignmentData`.                                                   |
| `listContentAttempts`      | `GET /content/{contentId}/attempts/{userId\|me}`                                            | required | Per-attempt scores. Replaces `allAttemptScores`.                                                                               |
| `getContentAttempt`        | `GET /content/{contentId}/attempts/{userId\|me}/{attemptNumber\|latest}?item=&itemAttempt=` | required | State, score, variant, item states. Replaces `loadState`, the real `loadItemState`, and `itemAttemptState`.                    |
| `createContentAttempt`     | `POST /content/{contentId}/attempts`                                                        | required | As `createNewAttempt`, for `me`.                                                                                               |
| `saveContentAttemptState`  | `PUT /content/{contentId}/attempts/me/{attemptNumber}/state`                                | required | As `saveScoreAndState`. Returns `ScoreData`.                                                                                   |
| `recordContentResponse`    | `POST /content/{contentId}/responses`                                                       | required | As `recordSubmittedEvent`, now with the viewable-assignment check it lacks.                                                    |
| `listContentResponses`     | `GET /content/{contentId}/responses?userId=&answerId=&attempt=&item=&itemAttempt=`          | required | Replaces `getStudentSubmittedResponses`.                                                                                       |
| `getContentResponseCounts` | `GET /content/{contentId}/responses/counts?userId=&attempt=&item=`                          | required | Replaces `responseCounts`.                                                                                                     |
| `listUserAssignments`      | `GET /users/me/assignments`                                                                 | required | The existing `getAssigned`, minus the embedded `user`.                                                                         |
| `listUserScores`           | `GET /users/{userId\|me}/scores?parent=`                                                    | required | `{ items: [{ contentId, name, score }], folder? }`. Replaces `getAssignedScores` and both `getStudentAssignmentScores` routes. |

`shuffledOrder`, `itemNumber` and `attemptNumber` keep their meaning; they move from path-position-dependent parameters into named query parameters.

#### Library (curation)

A **submission** is the `libraryActivityInfos` row: a user's content proposed for the library, with its status and the library's copy.

| Operation                    | Method and path                                                   | Auth     | Notes                                                                                                                                       |
| ---------------------------- | ----------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `createLibrarySubmission`    | `POST /library/submissions`                                       | required | `{ contentId }` → the submission (with `libraryContentId`). Replaces `suggestToBeCurated`.                                                  |
| `listLibrarySubmissions`     | `GET /library/submissions?status=&limit=&cursor=&include=content` | editor   | One list; `status` takes several values and each item carries its status, so the curation page is one request. Replaces `getCurationQueue`. |
| `getContentLibraryStatus`    | `GET /content/{contentId}/library`                                | optional | The `LibraryRelations` of a content. Also `include=library` on `getContent`.                                                                |
| `claimLibrarySubmission`     | `POST /library/submissions/{id}/claim`                            | editor   |                                                                                                                                             |
| `publishLibrarySubmission`   | `POST /library/submissions/{id}/publish`                          | editor   | Goes through the gated visibility code.                                                                                                     |
| `unpublishLibrarySubmission` | `POST /library/submissions/{id}/unpublish`                        | editor   |                                                                                                                                             |
| `rejectLibrarySubmission`    | `POST /library/submissions/{id}/reject`                           | editor   |                                                                                                                                             |
| `listLibraryComments`        | `GET /library/submissions/{id}/comments`                          | required | Owner or editor.                                                                                                                            |
| `addLibraryComment`          | `POST /library/submissions/{id}/comments`                         | required | `{ comment }`; `asEditor` is derived from the caller's role, not sent.                                                                      |

Library folders are `getContent`/`listContentChildren` on content owned by the `library` alias (`GET /users/library/content?parent=`), editor-gated for private folders. `createCurationFolder` is `createContent` with `parentId` in the library.

### Users

| Operation           | Method and path                                                               | Auth     | Notes                                                                                                                                                                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getUser`           | `GET /users/{userId\|me}`                                                     | optional | For `me`: the full `UserInfoWithEmail` plus `isEditor`, `isAuthor`, `canUploadImages`, `theme`; `401` for a guest. For others: public profile.                                                                                                                                                              |
| `updateUser`        | `PATCH /users/me`                                                             | required | `{ firstNames?, lastNames?, isAuthor?, theme? }`. Replaces `updateUser`, `setIsAuthor`, `setTheme`.                                                                                                                                                                                                         |
| `listUserContent`   | `GET /users/{userId\|me\|library}/content?parent=&q=&limit=&cursor=&include=` | optional | Same operation for my content, another user's shared content and the library. Permission filtering decides what is listed. Replaces `getMyContent`, `searchMyContent`, `getSharedContent`, `getCurationFolderContent`, `searchCurationFolderContent`. The parent folder itself comes with `include=parent`. |
| `listUserTrash`     | `GET /users/me/trash`                                                         | required | `{ items: [{ content, deletedOn }] }` instead of parallel arrays.                                                                                                                                                                                                                                           |
| `listSharedWithMe`  | `GET /users/me/shared-with-me`                                                | required |                                                                                                                                                                                                                                                                                                             |
| `listUserRecent`    | `GET /users/me/recent?mode=&types=`                                           | required |                                                                                                                                                                                                                                                                                                             |
| `recordUserRecent`  | `POST /users/me/recent`                                                       | required | `{ contentId, mode }`. The explicit write that `getEditor` and `getMyContent` hid.                                                                                                                                                                                                                          |
| `recordContentView` | `POST /content/{contentId}/views`                                             | optional | The explicit write that `getActivityViewerData` and `getSharedContent` hid.                                                                                                                                                                                                                                 |

### Reference data

`GET /licenses`, `GET /doenetml-versions` (with the default flagged, so `getDefaultDoenetmlVersion` goes), `GET /categories` (groups), `GET /classification-systems` (the tree), `GET /classifications?q=&systemId=&categoryId=&subCategoryId=&limit=`. All optional-auth, all with `ETag` and `Cache-Control: max-age=3600`. The app fetches each once per session and holds it in memory; they leave the root loader.

### Search and explore

| Operation          | Method and path                                                                                                           | Notes                                                                                                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `searchContent`    | `GET /search/content?q=&systemId=&categoryId=&subCategoryId=&classificationId=&unclassified=&category=…&ownerId=&facets=` | `{ community, curated, totalCount, facets?: { categories, classifications, authors } }`. A search result with facets is one resource; the facet lists are opt-in. Replaces the content and classification parts of `searchExplore`/`browseExplore`. |
| `listTrending`     | `GET /explore/trending?…filters`                                                                                          |                                                                                                                                                                                                                                                     |
| `listRecentPublic` | `GET /explore/recent?…filters`                                                                                            |                                                                                                                                                                                                                                                     |
| `searchAuthors`    | `GET /search/authors?q=&…filters`                                                                                         | `topAuthors` and `matchedAuthors`. `authorInfo` is `getUser(ownerId)`.                                                                                                                                                                              |

Category codes are sent as `category=` repeated; the server knows which codes exist, so the client no longer loads the category list to parse its own URL.

### Images

| Operation              | Method and path               | Notes                                                                                                                            |
| ---------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `createImageUpload`    | `POST /images/uploads`        | `{ mimeType, sizeBytes }` → presigned PUT. Requires `canUploadImages`.                                                           |
| `createImage`          | `POST /images`                | `{ uploadKey, parentId, attribution… }` → the image `Content`. The S3 PUT between them is inherent; it is not an API round trip. |
| (details, attribution) | `getContent`, `updateContent` | An image is content.                                                                                                             |

### Session caching

This is the server change that lets resource operations replace bundled ones without raising query counts. Today every `/api` request runs three queries before its handler: the `Session` row (the Prisma session store), the `users` row (`deserializeUser` calls `getMyUserInfo`), and `getIsEditor` inside most handlers. A page that sends four parallel resource requests would pay twelve such queries where one bundled request paid three.

The fix is to cache the deserialized session user in process, keyed by session id, for a short TTL (a minute is enough: `isEditor`, `isAuthor`, names and `canUploadImages` change rarely and by the user's own action), and to carry `isEditor` on that cached user so no handler queries for it. The cache is cleared for a session on logout and whenever `updateUser` runs in the same process; on other tasks it expires. The perf middleware already counts these queries per request, so the effect is visible in the `Server-Timing` header before and after.

The alternative that was considered and dropped is a `POST /batch` operation that ran several reads under one session resolution. It would have kept request counts at today's level, but it adds a second way to call every read, loses HTTP caching for the reads it carries, cannot be typed in OpenAPI, and solved a cost that the cache removes at the source.

### Auth (internal)

`POST /auth/magic-link`, `GET /auth/magic-link/confirm?token=`, `POST /auth/handle`, `POST /auth/anonymous` (returns the user it made), `GET /auth/google` (external), `POST /auth/logout`, `GET /auth/discourse/sso` (external). Unchanged in substance, renamed into one router, all `audience: "internal"`.

### Conventions

- Prefix `/api/v1`. The operation name remains the contract identity; the path is what the public sees, so it is fixed from the first public release and evolves additively under expand-migrate-contract rather than by version bump.
- Ids are short UUIDs as today. Timestamps are ISO 8601 with offset.
- Every collection takes `limit` and `cursor` and returns `nextCursor`. The default `limit` is large enough that the app's current single call still returns everything it shows today (folders, scores); the cap protects the public surface, not the app.
- `include` values are validated against the operation's list; an unknown one is `400`.
- Errors keep the existing `ErrorResponse` body; `404` for not found or not viewable, `403` for viewable but not permitted, `401` for a guest where a user is required, `409` for a stale `ifRevision`.

## Page composition under the new API

Each page's loader issues all its requests at once (`Promise.all`). Reference data is in memory after first use. Depth is 1 everywhere; the last column compares the number of HTTP requests on the critical path today with the number of parallel requests under the new API.

| Page                                        | Requests, all in parallel                                                                                                                                                                                           | Today → new       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Root layout (every page)                    | `getUser(me)`; licenses and versions from cache                                                                                                                                                                     | 3 → 1             |
| Activities `/activities/:userId/:parentId?` | `listUserContent(userId, parent, include=parent,library,sharedWith,assignment)`                                                                                                                                     | 1 → 1             |
| Shared activities                           | `listUserContent(ownerId, parent, include=parent)`, `getUser(ownerId)`                                                                                                                                              | 2 → 2             |
| Library activities                          | `listUserContent(library, parent, q, include=parent)`                                                                                                                                                               | 1 → 1             |
| Curate queue                                | `listLibrarySubmissions(status=pending,underReview,rejected,published, include=content)`                                                                                                                            | 1 → 1             |
| Explore                                     | `searchContent(facets=…)` or `listTrending` + `listRecentPublic` + `searchContent(curated)`; `searchAuthors`; `getUser(ownerId)` when filtering by author                                                           | 2 → 2–5           |
| Activity viewer                             | `getContent(id, include=children,owner,classifications,library,remixSources)`; `recordContentView` fire-and-forget                                                                                                  | 1 → 1             |
| Editor layout (header)                      | `getContent(id, include=ancestors,remixStatus,sharing-summary)`; `recordUserRecent` fire-and-forget                                                                                                                 | 2 → 1             |
| Editor: edit / view tab                     | `getContentSource(id)`                                                                                                                                                                                              | 1 → 1             |
| Editor: settings tab                        | `getContent(id, include=categories,classifications,remixSources)`; categories from cache                                                                                                                            | 3 → 1             |
| Editor: history tab                         | `listContentRevisions(id)`, `getContentSource(id)`                                                                                                                                                                  | 1 → 2             |
| Editor: remixes tab                         | `listRemixSources(id)`, `listRemixes(id)`                                                                                                                                                                           | 2 → 2             |
| Editor: library tab                         | `getContentLibraryStatus(id)`, `listLibraryComments(submission)`                                                                                                                                                    | 2 → 2             |
| Editor: compound edit / view                | `getContent(id, include=children)` / `getContentSource(id, format=activity)` + `getContent(id)` for the attempt settings                                                                                            | 1 → 1–2           |
| Share modal                                 | `getContentSharing(id)`                                                                                                                                                                                             | 1 → 1             |
| Assign modal                                | `getContent(id)` (assignment settings are content fields)                                                                                                                                                           | 3 → 1             |
| Assignment viewer `/code/:classCode`        | `resolveClassCode` then redirect to `/assignment/:contentId` (Decision 6); that page: `getContent(id, include=children)`, `getContentScore(id, me)`, `getContentAttempt(id, me, latest)`                            | 3–4 → 3 (+1 once) |
| Assignment overview                         | `getContent(id, include=children)`, `listContentScores(id, include=items)`                                                                                                                                          | 1 → 2             |
| Assignment, one student                     | `getContent(id, include=children)`, `getContentScore(id, user)`, `listContentAttempts(id, user)` or `getContentAttempt(id, user, n, item)` + `getContentResponseCounts`, `listContentStudents(course)` (owner only) | 1 → 4–5           |
| Answer drawer                               | `listContentResponses`                                                                                                                                                                                              | 1 → 1             |
| Students (gradebook)                        | `getContentGradebook(folder)`                                                                                                                                                                                       | 1 → 1             |
| Student scores                              | `listUserScores(user, parent)`, `getUser(user)`                                                                                                                                                                     | 1 → 2             |
| Assigned                                    | `listUserAssignments`                                                                                                                                                                                               | 1 → 1             |
| Trash, shared with me                       | `listUserTrash` / `listSharedWithMe`                                                                                                                                                                                | 1 → 1             |
| Compare                                     | `getContentComparison`                                                                                                                                                                                              | 1 → 1             |
| Image details                               | `getContent(id)`                                                                                                                                                                                                    | 1 → 1             |
| Scratch pad `?contentId=`                   | `getContentSource(id)`; default version from cache                                                                                                                                                                  | 2 (+redirect) → 1 |
| Embed `/embed/:id`                          | `getContent(id, include=children,source)` or `getContentSource(by-cid)`                                                                                                                                             | 1 → 1             |
| Add-to menu (popup)                         | `listUserRecent`, `listContentChildren(root, type=folder, limit=1)` ×3 types                                                                                                                                        | 4 (depth 2) → 4   |
| Move/copy dialog                            | `listContentChildren(parent, include=parent,ancestors,permissions)`; `canOpen` is `permissions` plus type                                                                                                           | 1 → 1             |
| Content info drawer                         | `listRemixSources`, `listRemixes` (or none: the viewer already included them)                                                                                                                                       | 2 → 0–2           |

Every chain of today becomes a fan-out. The count falls on the pages the root loader and the editor dominate, and rises on the pages that today get one bundle: the history tab, the assignment overview, the one-student page, the student scores page and Explore. Those rises are parallel requests on one connection, not round trips, and with the session cache each extra request costs the server only its own data queries.

**Mutations.** Every mutation becomes one typed `submitOperation` through `genericAction`. Create-then-rename (`createContentCopyInChildren` + `updateContentSettings`) becomes one `createContent` with `name` and `childrenCopiedFrom`. After a mutation the app revalidates the loaders it affects: `shouldRevalidate` on the root route returns `false` unless the mutation touched the user, and reference data never revalidates. That alone removes the three root calls from every mutation and every search-parameter change today.

## Performance accounting

**Round trips.** Depth 1 for every page load, because every id a loader needs is in the URL or an alias, checked by the `apiDepth` snapshot. Today's worst critical paths (editor settings: 3; assignment viewer: 3–4) become 1.

**HTTP requests.** Fewer on most pages, more on five (table above), all parallel. Fewer per mutation (root no longer revalidates). Per-request server overhead is the session cache's job; what remains per request is JSON parsing, Zod validation and the handler's own queries.

**Database queries.** Three effects, in the direction they push:

- Down: reference lists are no longer queried on every page (two per page today, five on the content-list pages); `getDocEditorDoenetML` stops loading all versions; the session row, the user row and `isEditor` come from the session cache instead of three queries per request (today every request pays them, and the pages above send up to eight).
- Flat: a screen-shaped handler that ran five queries becomes five resource handlers that run the same five queries in five concurrent requests; the Prisma connection pool runs them concurrently either way.
- Up, and to be watched: a resource read repeats a permission lookup that a bundled handler shared. `getContent` with several includes is written as one `findUnique` with a composed `select` (the existing `returnContentSelect` flags map to includes almost one to one), so the content pages don't pay this. The assignment pages do: `getContent`, `getContentScore` and `listContentAttempts` each verify the assignment, so the one-student page runs three or four small indexed lookups that one handler shared before. Those are separate requests, so nothing can share them; the snapshot for that scenario is expected to rise by that amount and the PR that migrates it says so. If it matters, `include=myScore,myAttempts` on `getContent` folds the student's own sub-resources back into one request without reintroducing a screen shape, since they are attributes of that content for that viewer.

Payload goes down: lists stop shipping DoenetML (the Activities page never renders it), and the editor settings read is a few hundred bytes instead of the full remix-source list.

The gate is the query count snapshot per perf scenario, taken before each page migrates and compared after. The harness of #3059 has to exist before the first page migrates; otherwise "no slower" is an assertion, not a measurement.

## Migration

Every step is its own expand-migrate-contract cycle; the old routes stay until the client-build log shows no caller.

1. **Contract machinery.** `audience`, `include` parsing with per-operation allow-lists, pagination helpers, `ETag`/`Cache-Control` for reference data, the ESLint rule, the session cache with `isEditor` on the cached user. The two perf proxies in the harness.
2. **Reference data and `users/me`.** Root loader goes to one operation plus cached lists; `shouldRevalidate`. Cheapest win, touches every page's request count.
3. **`getContent` with includes.** Migrate the editor header, settings, compound tabs, viewer, breadcrumbs, image details and the assign modal onto it. Retire seven routes.
4. **Lists.** `listUserContent`, `listContentChildren`, trash, shared-with-me, library folders, move/copy dialog, add-to menu.
5. **Source and revisions, sharing, categories, classifications, remixes, comparison.**
6. **Assignments.** Scores, attempts, responses, roster, gradebook, class codes, the viewer.
7. **Library submissions, search and explore, images.**
8. **Contract phase** for each retired route after the stale-client check, and shrink `contract-uncovered.json` to empty.

Step 3 is the one to do first after the machinery: it retires the most screen-shaped routes and proves the `include` design on the heaviest resource.

## Decisions needed

Each one changes the design above if it goes the other way. The recommendation is first.

1. **Who is the public API for, and how do they authenticate?** Recommendation: first-party and institutional integrations acting as a user, with personal access tokens (`Authorization: Bearer`), scoped read/write, before any OAuth client flow. This is why `/auth/*` is internal and why `me` aliases are fine. If the audience is instead server-to-server with no user (an LMS reading a public library), `me` has no meaning for them and the public surface shrinks to the optional-auth operations; the design holds but the token model differs.

2. **Session cache TTL and invalidation.** Decided: no batch operation; parallel requests plus a cached session user (see [Session caching](#session-caching)). What remains to choose is the TTL and whether a flag change by an admin (`isEditor`, `canUploadImages`) may take up to that long to show on other tasks. Recommendation: 60 seconds, invalidated in process on logout and `updateUser`, no cross-task invalidation. GraphQL, which would solve the composition problem differently, stays rejected for the reasons in ADR 0003.

3. **`/api/v1` prefix or keep `/api`?** Recommendation: `/api/v1` for the new operations, so the public URLs are new, stable and distinguishable from the legacy routes during migration; no `v2` is planned, since breaking changes are handled by expand-migrate-contract and deprecation headers. Keeping `/api` would mean some public URLs are the old haphazard ones until their contract phase lands.

4. **One `updateContent` or several?** Recommendation: one `PATCH /content/{id}` for every scalar field, including assignment settings and image attribution, with the server rejecting a field the content type doesn't have. It replaces nine routes. The alternative, one operation per concern (`updateAssignmentSettings`, `setLicense`…), keeps permission rules per route obvious but recreates the sprawl.

5. **Commands versus state fields for library status and moves.** Recommendation: `POST …/claim|publish|reject|unpublish` and `POST …/move`, because each has side effects and a distinct permission (publish needs the primary editor). `PATCH { status }` is terser but hides that.

6. **Class codes.** Recommendation: `GET /codes/{code}` resolves to a content id and the student URL becomes `/assignment/:contentId` after a redirect. Entry by code then costs one extra round trip once, and every reload of the assignment is depth 1. The alternative is to accept `code:12345` as an alternate id in every `/content/{id}` path (depth 1 at entry too, but two id forms in the public API). The rule "one round trip" was written for page loads; the question is whether the entry redirect counts.

7. **Lists without source.** Recommendation: list items never carry DoenetML. Verify during step 4 that no list consumer renders it; the inventory found none.

8. **Reads with side effects.** Recommendation: make them explicit writes (`recordUserRecent`, `recordContentView`) the app fires without awaiting. If you prefer the server to keep recording on reads, say so and the two operations disappear, at the cost of a public `GET` that writes.

9. **Pagination now or later.** Recommendation: `limit`/`cursor` on every collection from the start, default `limit` 500, so the app's behaviour doesn't change and the public surface is bounded. Adding pagination later is a breaking change for public callers.

10. **Search as one resource with facets, or many.** Recommendation: `searchContent` returns hits plus opt-in facets in one response (the Algolia/GitHub shape); authors and trending/recent are separate operations requested in parallel. Splitting the facets into their own operations would be purer and cost nothing in round trips, but doubles the operation count for Explore.

11. **How strict is "no substantial slow-down"?** Recommendation: define it as the three proxies (`apiDepth` = 1, `apiRequests` and database queries per scenario not above the pre-migration snapshot), measured per page as each migrates, with any increase needing an explicit snapshot update and a reason in the PR. Without that definition, every migration PR will argue it on wall-clock numbers, which ADR 0002 already says are not a gate.

12. **Fix the inherited authorization gaps during migration, or before?** Recommendation: during, since each operation is rewritten anyway, but each fix is called out in its PR: `recordContentResponse` gains the assignment check; `listUserContent(library)` is editor-gated for private folders; the move/copy dialog's parent lookup applies ownership; `resolveClassCode` stays open (students use it before signing in) but returns only id, type and name; metrics become admin-only or stay internal.
