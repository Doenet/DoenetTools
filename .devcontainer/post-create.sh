#!/usr/bin/env bash
# One-time setup inside the dev container. The host-oriented `npm run setup`
# is not used here: it drives `docker compose` and assigns per-worktree ports,
# neither of which applies inside a container that owns its own network.
set -euo pipefail

cd /home/node/workspace

# 1. apps/api/.env — the API and the Vite/Astro configs both need this file to
# exist (it is the source of truth for the dev-server ports). The database and
# media addresses in it are irrelevant here: docker-compose.yml sets those as
# real environment variables, which take precedence. An existing file is left
# untouched so a checkout shared with the host keeps working on both sides.
if [ -f apps/api/.env ]; then
  echo "✅ apps/api/.env already exists — leaving it as is"
else
  cp apps/api/.env.example apps/api/.env
  echo "✅ Created apps/api/.env from .env.example"
fi

# 2. Dependencies. `npm ci` also runs the postinstall `prisma generate`.
echo "📦 Installing dependencies..."
npm ci

# 3. Cypress binary — kept in the cypress_cache volume, so this is a no-op on
# a rebuild that reuses the volume.
echo "🌲 Verifying the Cypress binary..."
npx cypress install

# 4. packages/shared must be built before the api and app can typecheck or run.
echo "🔨 Building @doenet-tools/shared..."
npm run build --workspace @doenet-tools/shared

# 5. Migrate + seed. Compose already gated startup on the MySQL healthcheck,
# but retry briefly in case the container is still finishing recovery.
echo "🗄️  Migrating and seeding the database..."
for attempt in 1 2 3 4 5; do
  if npm run db:setup; then
    break
  fi
  if [ "$attempt" = 5 ]; then
    echo "❌ Database setup failed after 5 attempts" >&2
    exit 1
  fi
  echo "   retrying in 5s (attempt $attempt)..."
  sleep 5
done

# Ports come from apps/api/.env, so report the real ones rather than the
# defaults a fresh checkout happens to get.
read -r API_PORT APP_PORT WEB_PORT <<<"$(node -e '
import("./scripts/worktree-env.js").then((m) =>
  console.log(m.apiPort, m.appPort, m.webPort),
)')"

cat <<MSG

✅ Dev container ready.

   npm run dev     # api :$API_PORT, app :$APP_PORT, blog :$WEB_PORT

   Then open http://localhost:$APP_PORT (the blog is at /blog). If the stack was
   started with those ports published, that URL works from the host browser too.

   npm test --workspace @doenet-tools/api                 # Vitest unit tests
   npm run test:all --workspace @doenet-tools/app         # Cypress component tests
   npm run test:all --workspace @doenet-tools/e2e-tests   # Cypress e2e (needs \`npm run dev\`)

MSG
