import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const old_version = await prisma.doenetmlVersions.upsert({
    where: { displayedVersion: "0.6" },
    update: {},
    create: {
      displayedVersion: "0.6",
      fullVersion: "0.6.0",
      deprecated: true,
      deprecationMessage: "It will be removed after June 2025.",
    },
  });
  const current_version = await prisma.doenetmlVersions.upsert({
    where: { displayedVersion: "0.7" },
    update: {},
    create: {
      displayedVersion: "0.7",
      fullVersion: "0.7.0-alpha1",
      default: true,
    },
  });

  const dev_user = await prisma.users.upsert({
    where: { email: "devuser@doenet.org" },
    update: {},
    create: {
      email: "devuser@doenet.org",
    },
  });

  console.log({ old_version, current_version, dev_user });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
