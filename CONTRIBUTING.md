# Contributing to Doenet Apps

Thanks for helping build Doenet! This page covers getting a development
environment running, the checks we expect to pass, and how changes are
proposed. For the shape of the codebase itself, see [AGENTS.md](./AGENTS.md).

Questions are welcome on [Discord](https://discord.gg/PUduwtKJ5h).

## Setting up a development environment

Three ways, in order of how much you have to install. They all end up in the
same place, so pick whichever fits.

| Option                                                  | What you need    | Setup                        |
| ------------------------------------------------------- | ---------------- | ---------------------------- |
| [GitHub Codespaces](#option-1--github-codespaces)       | A browser        | One click                    |
| [Dev container locally](#option-2--dev-container)       | Docker           | One command                  |
| [Toolchain on your machine](#option-3--local-toolchain) | Node 24 + Docker | A few commands, full control |

### Option 1 — GitHub Codespaces

Nothing to install. On the repository page choose **Code → Codespaces → Create
codespace on main**, or open
[this link](https://codespaces.new/Doenet/DoenetApps).

The first build takes several minutes: it builds the image, installs
dependencies, and migrates and seeds the database. When the terminal is ready:

```bash
npm run dev
```

Codespaces forwards the ports automatically — click the app URL in the **Ports**
panel, or open the notification that appears.

### Option 2 — Dev container

The same environment on your own machine. Docker is the only prerequisite: the
container brings its own Node, MySQL, S3 mock, and Chrome for the Cypress
suites.

With **VS Code**, install the
[Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
extension, open the repository, and choose **Reopen in Container**.

With the **CLI**, no editor involved:

```bash
npx @devcontainers/cli up --workspace-folder .
npx @devcontainers/cli exec --workspace-folder . bash -lc 'npm run dev'
```

Either way, open http://localhost:8000 when the dev servers are up.

[Claude Code](https://claude.com/claude-code) is installed in the container —
run `claude` in any terminal there, or use the bundled VS Code extension.

Plain `docker compose` works too, and the container's internals — how the
services fit together, rebuilding, cleaning up, and the arm64 caveat — are
documented in [.devcontainer/README.md](./.devcontainer/README.md).

### Option 3 — Local toolchain

Full control, and the fastest inner loop. You need:

- [Node.js](https://nodejs.org/) 24 (see [.nvmrc](./.nvmrc))
- [Docker](https://www.docker.com/) with Compose v2, for the MySQL database

```bash
git clone https://github.com/Doenet/DoenetApps.git
cd DoenetApps
npm install
npm run setup
npm run dev
```

`npm run setup` creates `apps/api/.env`, starts the MySQL container, and
creates, migrates, and seeds the database. It is idempotent — safe to re-run at
any time, and the way to restart the database container if it is stopped later.
To change connection details, see the comments in `apps/api/.env`.

#### Running dev servers individually

Instead of `npm run dev`, each process can run in its own terminal:

```bash
npm run dev --workspace @doenet-tools/shared   # Shared package watcher
npm run dev --workspace @doenet-tools/api      # Express API
npm run dev --workspace @doenet-tools/app      # React SPA
npm run dev --workspace @doenet-tools/web      # Astro site
```

#### Working in multiple worktrees

Running `npm run dev` from several
[git worktrees](https://git-scm.com/docs/git-worktree) at once would collide on
ports and on the database. `npm run setup` handles this: it detects a linked
worktree and assigns it the next free set of ports and a dedicated database.

```bash
git worktree add ../doenet-feature feature-branch
cd ../doenet-feature
npm install
npm run setup
npm run dev
```

The MySQL container is shared across all worktrees — only the database and the
ports differ.

## What runs where

`npm run dev` starts the shared-package watcher and three servers:

| Server      | URL                   |
| ----------- | --------------------- |
| React SPA   | http://localhost:8000 |
| Express API | http://localhost:3000 |
| Astro site  | http://localhost:4321 |

The SPA proxies `/api/*` to the API and `/blog/*` to Astro, so both frontends
are reachable from the app origin and local URLs match production:

- app pages → `http://localhost:8000/...`
- blog pages → `http://localhost:8000/blog/...`

In a worktree, add that worktree's offset to each port; `npm run setup` prints
the ones it assigned.

## Running the tests

```bash
npm test --workspace @doenet-tools/api                # Vitest unit tests
npm test --workspace @doenet-tools/shared             # Vitest unit tests
npm run test:all --workspace @doenet-tools/app        # Cypress component tests
npm run test:all --workspace @doenet-tools/e2e-tests  # Cypress e2e tests
```

The e2e suite drives the running app, so start `npm run dev` first and let it
come up. Append a filename to the Vitest commands to run a single file; the
Cypress packages also expose grouped scripts (`test:group1` and friends) that
mirror how CI splits them.

## Before you commit

```bash
npm run format
npm run lint
```

Both run over the whole workspace. CI runs `format:check` and `lint:check`,
which fail rather than fix, along with a full build and every test suite above.

## Opening a pull request

Development uses a fork workflow. Push your branch to `origin` (your fork),
then open a pull request targeting `upstream/main`. Merged pull requests deploy
to production after human sign-off.

Database and API changes follow the **expand-migrate-contract** pattern: each
merged pull request must be safe to deploy on its own, so add new
columns/endpoints before removing old ones, across separate pull requests.
