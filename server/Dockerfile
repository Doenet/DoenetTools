FROM node:lts-trixie
WORKDIR /DoenetTools/server

COPY src ./src
COPY scripts ./scripts
COPY prisma ./prisma
COPY passport-anonymous ./passport-anonymous
COPY tsconfig.json ./
COPY package*.json ./

# Just for testing locally
# COPY .env ./

RUN npm install
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3000

RUN useradd serveruser
USER serveruser