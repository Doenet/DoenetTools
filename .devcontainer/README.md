# Dev container

A self-contained development environment: Node, MySQL, an S3 mock, and a
headless Chrome for Cypress all run inside Docker. The only thing the host
needs is Docker. It follows the [dev container spec](https://containers.dev/),
so VS Code, GitHub Codespaces, and the `devcontainer` CLI all understand it —
but none of them are required, and plain `docker compose` works fine.

## Getting started without an editor

Docker is the only requirement. From the repository root:

```bash
docker compose -p doenet-dev -f .devcontainer/docker-compose.yml up -d --build --wait
docker compose -p doenet-dev -f .devcontainer/docker-compose.yml exec dev bash -lc 'bash .devcontainer/post-create.sh'
docker compose -p doenet-dev -f .devcontainer/docker-compose.yml exec dev bash
```

The first run takes several minutes (image build, `npm ci`, the Cypress binary,
migrate + seed). Then, in the shell it drops you into:

```bash
npm run dev
```

Open http://localhost:8000 in a browser on the host; blog pages are at
`/blog`, matching production. The dev servers listen on all interfaces inside
the container (`DEV_SERVER_HOST`) and the ports are published on the host's
loopback, so no editor or port-forwarding tooling is involved.

Stop the stack with `... down`, or `... down -v` to discard the database too.

### If the ports do not match

Ports come from `apps/api/.env`; a fresh checkout gets 8000/3000/4321, but a
[worktree](../README.md#working-in-multiple-worktrees) is assigned an offset.
`post-create.sh` prints the real ones at the end. Pass them when starting the
stack — also the fix if something on the host already holds a port:

```bash
APP_PORT=8002 API_PORT=3002 WEB_PORT=4323 \
  docker compose -p doenet-dev -f .devcontainer/docker-compose.yml up -d --wait
```

## With the devcontainer CLI

No editor involved; the CLI runs the post-create step for you.

```bash
npx @devcontainers/cli up --workspace-folder .      # build + set up (several minutes)
npx @devcontainers/cli exec --workspace-folder . bash -lc 'npm run dev'
```

Open http://localhost:8000. To get a shell instead, drop the `-lc` part.

`up` is idempotent — re-running it reuses the existing container. To force a
genuinely fresh one:

```bash
npx @devcontainers/cli up --workspace-folder . \
  --remove-existing-container --build-no-cache
```

That rebuilds the image and recreates the dev container, but keeps the named
volumes, so the database and the Cypress binary survive. Add a `down -v` (see
below) first if you want those gone too.

The CLI names its compose project after the folder — a checkout in `apps` gives
`apps_devcontainer`. Use it to manage the stack afterwards:

```bash
docker compose -p apps_devcontainer -f .devcontainer/docker-compose.yml ps
docker compose -p apps_devcontainer -f .devcontainer/docker-compose.yml down -v
```

## In an editor

Open the repository in VS Code and choose **Reopen in Container**.

> Git does not work inside the container for a linked git worktree: `.git` is a
> file pointing outside the bind mount. Use the main checkout, or a clone.

## What is in the stack

| Service  | What it is                        | Address inside the container |
| -------- | --------------------------------- | ---------------------------- |
| `dev`    | Node 24.15, Chrome, the workspace | —                            |
| `mysql`  | MySQL 8.0, seeded with dev data   | `mysql:3306`                 |
| `s3mock` | S3-compatible store for uploads   | `s3mock:9090`                |

The database and S3 addresses are set as environment variables in
`docker-compose.yml`. Both `dotenv` and the Prisma CLI leave already-set
variables alone, so those win over `apps/api/.env` — which means the same
checkout can be used on the host and in the container without the two fighting
over that file.

## Running the tests

Everything the CI workflow runs works here, with no external services:

```bash
npm test --workspace @doenet-tools/api                # Vitest unit tests
npm test --workspace @doenet-tools/shared             # Vitest unit tests
npm run test:all --workspace @doenet-tools/app        # Cypress component tests
npm run test:all --workspace @doenet-tools/e2e-tests  # Cypress e2e tests
```

The e2e suite drives the running app, so start `npm run dev` in another
terminal first and let it come up before running it.

Cypress runs headless Chrome; `xvfb` is installed for the cases where Cypress
wants a display. Watching a run interactively (`cypress open`) needs an X
server of your own — the headless runs above do not.

## Notes

- `node_modules` directories are Docker volumes, not part of the bind mount, so
  the container's Linux-native installs never collide with the host's. A
  consequence is that host-side editors will not see them — run tooling inside
  the container.
- The Cypress binary and the npm cache live in volumes too, so rebuilding the
  container does not re-download them.
- Rebuilding with **Dev Containers: Rebuild Container** keeps the database
  (`mysql_data` volume). To start from a clean database, remove the volumes:
  `docker compose -f .devcontainer/docker-compose.yml down -v`.
- On arm64 hosts, Google Chrome has no build available and Chromium is
  installed instead; run Cypress with `-b chromium` there.
- This stack is separate from the repo-root `docker-compose.yml`, which exists
  for host-based development. The two can run at the same time.
