FROM node:lts-trixie
WORKDIR /DoenetTools/server


COPY server/dist ./dist
# COPY src ./src
# COPY scripts ./scripts
COPY server/prisma ./prisma
# COPY passport-anonymous ./passport-anonymous
# COPY tsconfig.json ./
COPY package*.json ./
COPY server/entrypoint.sh ./

# Just for testing locally
# COPY .env ./

# Assume a 'shared' directory exists on your host in the build context
# RUN --mount=type=bind,source=./shared,target=./shared npm install
# RUN --mount=type=bind,source=./shared,target=./shared npm run build
RUN npm install --no-save prisma@6.4.1 @prisma/client@6.4.1
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 3000

RUN useradd serveruser
RUN mkdir /home/serveruser && chown serveruser:serveruser /home/serveruser
USER serveruser
