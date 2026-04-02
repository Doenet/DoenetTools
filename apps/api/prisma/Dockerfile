FROM node:lts-trixie
WORKDIR /DoenetTools/server
COPY package*.json ./
# RUN echo "$PWD"
# RUN npm install
COPY . .

# 👇 Regenerate Prisma Client for the correct OS
RUN npx prisma generate


# This assumes your seed script is named 'prisma/seed.ts' and executed by tsx
CMD ["ts-node", "--compiler-options {\"module\":\"CommonJS\"}", "prisma/seed.ts"]