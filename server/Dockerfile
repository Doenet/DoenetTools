FROM node:lts-trixie
WORKDIR /DoenetTools/server


COPY src ./src
COPY scripts ./scripts
COPY prisma ./prisma
COPY passport-anonymous ./passport-anonymous
COPY tsconfig.json ./
COPY package*.json ./
COPY entrypoint.sh ./


# Just for testing locally
# COPY .env ./

# Assume a 'shared' directory exists on your host in the build context
RUN --mount=type=bind,source=./shared,target=./shared npm install
RUN --mount=type=bind,source=./shared,target=./shared npm run build

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 3000

RUN useradd serveruser
USER serveruser