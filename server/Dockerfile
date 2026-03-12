# syntax=docker/dockerfile:1

# Note: the build context should be the project root, not this package
# Run with:
# docker build -f server/Dockerfile .

########################################
# Stage 1 — Build
########################################

FROM node:lts-trixie AS builder
WORKDIR /DoenetTools

# Copy workspace manifests first so dependency install can cache well
COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY shared/package.json shared/package.json
COPY client/package.json client/package.json
COPY blog/package.json blog/package.json
COPY tests-cypress/package.json tests-cypress/package.json

# Install all dependencies
# This is more than we need, but it doesn't hurt.
# We really just need `server`, `shared`, and the root
RUN npm ci

# Copy source after install for better layer caching
COPY tsconfig.json ./
COPY server ./server
COPY shared ./shared

# Generate Prisma client and build server/shared
WORKDIR /DoenetTools/server
RUN npm run prisma:generate
RUN npm run build


########################################
# Stage 2 — Production runtime
########################################
FROM node:lts-trixie AS runtime
WORKDIR /DoenetTools
ENV NODE_ENV=production

# Preserve the monorepo layout so npm workspace resolution still works
COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY shared/package.json shared/package.json
COPY client/package.json client/package.json
COPY blog/package.json blog/package.json
COPY tests-cypress/package.json tests-cypress/package.json

# Install only production deps for the server workspace
RUN npm ci --omit=dev --workspace=server

# Copy built application artifacts
COPY --from=builder /DoenetTools/server/dist ./server/dist
COPY --from=builder /DoenetTools/shared/dist ./shared/dist

# Copy Prisma runtime artifacts
COPY --from=builder /DoenetTools/server/prisma ./server/prisma
COPY --from=builder /DoenetTools/node_modules/.prisma/client ./node_modules/.prisma/client

WORKDIR /DoenetTools/server
EXPOSE 3000

# Run migrations then start server
ENTRYPOINT ["./entrypoint.sh"]