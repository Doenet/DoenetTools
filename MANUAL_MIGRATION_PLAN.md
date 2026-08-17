# Manual migration plan — `20260814120000_problem_set_description_doc`

Runbook for applying the `content.isDescription` migration to **prod** by hand,
ahead of deploying the image from PR #3026.

## Why this is not a normal deploy

`content` carries two FULLTEXT indexes (`content_name_idx`, `content_source_idx`).
InnoDB cannot use `ALGORITHM=INSTANT` or `INPLACE` for `ADD COLUMN` on such a
table, so it falls all the way back to `ALGORITHM=COPY` — a full table rebuild.
MySQL says so itself:

```
mysql> ALTER TABLE content ADD COLUMN _x BOOLEAN NOT NULL DEFAULT false, ALGORITHM=INSTANT;
ERROR 1846 (0A000): ALGORITHM=INSTANT is not supported. Reason: InnoDB presently
supports one FULLTEXT index creation at a time. Try ALGORITHM=COPY/INPLACE.
```

Measured on dev3 (403 MB): **7 min 3 s**. The backend deploy allows **5 minutes**
(`timeout-minutes` defaults to `5` in `.github/actions/update-cluster-with-rollback`,
not overridden by `reusable-deploy-backend.yml`), and `entrypoint.sh` runs
`prisma migrate deploy` _before_ the server listens — so the task never passes a
health check while the rebuild runs, and the deploy kills it partway.

MySQL has no transactional DDL: the column commits but Prisma never writes
`finished_at`. Every later deploy then fails with `P3009` — **including a
rollback to `main`** — until someone runs `prisma migrate resolve` by hand. This
happened on dev3 on 2026-08-15 and left it undeployable until cleared manually.

Tracked in #3027. Until that is addressed, migrations touching `content` must be
applied out-of-band.

## Expected cost on prod

|                 | dev3      | prod                    |
| --------------- | --------- | ----------------------- |
| `content` data  | 383 MB    | 459 MB                  |
| `content` index | 20 MB     | 24 MB                   |
| Rebuild time    | 7 min 3 s | **~8–9 min (estimate)** |

Scale from dev3 with care — prod's MySQL container may not perform identically,
and the FULLTEXT rebuild may not scale linearly. **Budget 15–20 minutes and
decide the abort point before starting.**

`ALGORITHM=COPY` permits reads but **blocks writes** for the whole rebuild. The
site is read-only during the window, not down.

## 1. Pre-flight

Take a database backup. Open a maintenance window.

Confirm prod is at exactly 20 applied migrations with nothing broken — otherwise
the deploy will also run whatever else is outstanding:

```sql
SELECT COUNT(*) FROM _prisma_migrations
WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL;          -- expect 20

SELECT migration_name, started_at FROM _prisma_migrations
WHERE finished_at IS NULL OR rolled_back_at IS NOT NULL;           -- expect empty
```

_Verified 2026-08-17: 20 applied, none broken._

### Separate concern — repeated documents in live assignments

PR #3026 also makes `repeatInProblemSet` take effect for students for the first
time, so a problem set that was **assigned before this deploy** with a repeated
document gains items on the next student load, and its gradebook columns shift
with them.

Prod has **15** documents with `repeatInProblemSet > 1`. Identify which sit
inside an assignment with existing student work:

```sql
SELECT c.name  AS document,
       p.name  AS problem_set,
       p.isAssignmentRoot,
       (SELECT COUNT(*) FROM contentState  cs WHERE cs.contentId = p.id) AS attempts,
       (SELECT COUNT(*) FROM contentItemState cis WHERE cis.contentId = p.id) AS item_rows
FROM content c
JOIN content p ON c.parentId = p.id
WHERE c.repeatInProblemSet > 1
  AND c.isDeletedOn IS NULL;
```

Rows with `isAssignmentRoot = 1` and a non-zero `attempts` are the ones at risk.

**Reviewed 2026-08-17 — no action needed.** Of the 15, nine have a live parent;
three of those sit in an assigned problem set:

| problem set                 | attempts | item rows |
| --------------------------- | -------- | --------- |
| Untitled Problem Set        | 2        | 9         |
| Demo Problem Set for Debbie | 1        | 3         |
| Demo Problem Set for Debbie | 0        | 0         |

All appear to be experimental or demo content rather than live coursework, and
the affected student work is negligible. Decision: **proceed without resetting**.

The remaining six are excluded by the query above because they are soft-deleted
(`isDeletedOn` set), so they compile to nothing — verified 2026-08-17. To
re-check later:

```sql
SELECT c.name AS document,
       c.repeatInProblemSet,
       (c.isDeletedOn IS NOT NULL) AS doc_deleted,
       p.name AS problem_set,
       p.type AS parent_type,
       p.isAssignmentRoot,
       c.lastEdited
FROM content c
LEFT JOIN content p ON c.parentId = p.id
WHERE c.repeatInProblemSet > 1;
```

Should this ever need reverting for a real course, the repeat has never actually
reached students, so resetting loses nothing:

```sql
-- only after reviewing the query above
UPDATE content SET repeatInProblemSet = 1 WHERE id = <id>;
```

Re-check this before deploying if significant time has passed — an instructor
could assign a problem set with a repeated document in the meantime.

## 2. Apply the migration

Exactly the SQL from
`apps/api/prisma/migrations/20260814120000_problem_set_description_doc/migration.sql`:

```sql
ALTER TABLE `content` ADD COLUMN `isDescription` BOOLEAN NOT NULL DEFAULT false;
```

**Run it somewhere that survives a dropped connection** — `screen`, `tmux`, or
`nohup mysql -e "…" &`. An ECS exec session dying at minute 7 kills the `ALTER`.
That is recoverable (COPY discards the temp table and leaves the original
intact) but means starting over.

To watch progress from a second session:

```sql
SHOW PROCESSLIST;   -- the ALTER shows State = "copy to tmp table"
```

## 3. Record it in Prisma's bookkeeping

Prod has no row for this migration yet, so insert one. The checksum is the
SHA-256 of the migration file, and has been verified against the row Prisma
itself wrote on dev3:

```sql
INSERT INTO _prisma_migrations
  (id, checksum, migration_name, started_at, finished_at, applied_steps_count)
VALUES
  (UUID(),
   'cffbbc8e54852ec48adcffca534a0c8eeb0c0d10ae13101f8b84274cd1985a2b',
   '20260814120000_problem_set_description_doc',
   NOW(3), NOW(3), 1);
```

`logs` and `rolled_back_at` are nullable and correctly left unset.

> The checksum must be exact. Prisma verifies applied migrations against it, and
> a mismatch fails the next deploy with "migration has been modified". If
> `migration.sql` is ever edited, this value changes.

`prisma migrate resolve --applied` would normally do this, but it requires the
migration directory to exist locally, and the currently-running prod image
predates it — that path fails with `P3017`.

## 4. Verify before deploying

```sql
SHOW COLUMNS FROM content LIKE 'isDescription';
-- expect: tinyint(1), Null = NO, Default = 0

SELECT COUNT(*) FROM _prisma_migrations
WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL;          -- now 21
```

Both must pass before step 5.

## 5. Deploy

Deploy the image normally. `prisma migrate deploy` finds 21 of 21 applied and
goes straight to `npm run start`; the task should reach steady state in about a
minute, as healthy rollouts do.

If it instead sits unhealthy for 5 minutes, step 3 did not take. **Do not simply
retry** — a retry cannot fix a bookkeeping problem. Read the task's stdout
first:

```bash
aws logs tail prod --region us-east-2 --since 15m \
  --log-stream-name-prefix doenet/doenet/ --format short
```

## Backing out

Reverting the schema means another full rebuild of the same length and another
write freeze:

```sql
ALTER TABLE content DROP COLUMN isDescription;
DELETE FROM _prisma_migrations
WHERE migration_name = '20260814120000_problem_set_description_doc';
```

Usually the better option is to leave the column and roll back only the
application image. The column is additive, and the old code neither reads nor
writes it.

## Alternative: let Prisma do its own bookkeeping

Avoids the manual `INSERT` entirely. The deploy pushes to a **mutable** image tag
and only runs `update-service --force-new-deployment` — it never registers a new
task definition — so a one-off task launched after the push picks up the new
image:

1. Build and push the image to the prod tag **without** updating the service
   (the workflow does both in one job, so this means running the docker
   build/push steps by hand).
2. `aws ecs run-task --cluster prod --task-definition <current def>` — no load
   balancer and no health-check clock, so the migration can take as long as it
   needs, and Prisma writes its own row.
3. Watch the task's logs; stop it once the migration completes.
4. Deploy normally.

More faithful to what Prisma expects, at the cost of a manual image push.

## Provenance

Everything above was verified against **dev3** — the rebuild timing, the
`ALGORITHM=INSTANT` error, the checksum, and the `_prisma_migrations` schema —
and against the deploy tooling in `.github/`. **None of it has been executed
against prod.** Step 4 is the gate.

Prod facts confirmed 2026-08-17: cluster `prod`, service `doenet-FARGATE`,
`HealthCheckGracePeriod` 600s (the deploy script still gives up at 300s),
`content` at 459 MB + 24 MB index, 20 migrations applied, 15 documents with
`repeatInProblemSet > 1`.
