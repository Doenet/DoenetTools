FROM node:lts-trixie
WORKDIR /DoenetTools/server
COPY package*.json ./
# RUN echo "$PWD"
# RUN npm install
COPY . .
# This assumes your seed script is named 'prisma/seed.ts' and executed by tsx
# CMD ["tsx", "prisma/seed.ts"]