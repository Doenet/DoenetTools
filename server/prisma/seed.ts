import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const old_version = await prisma.doenetmlVersions.upsert({
    where: { displayedVersion: "0.6" },
    update: { fullVersion: "0.6.7" },
    create: {
      displayedVersion: "0.6",
      fullVersion: "0.6.7",
      deprecated: true,
      deprecationMessage: "It will be removed after June 2025.",
    },
  });
  const current_version = await prisma.doenetmlVersions.upsert({
    where: { displayedVersion: "0.7" },
    update: { fullVersion: "0.7.0-alpha16" },
    create: {
      displayedVersion: "0.7",
      fullVersion: "0.7.0-alpha16",
      default: true,
    },
  });

  const dev_user = await prisma.users.upsert({
    where: { email: "devuser@doenet.org" },
    update: {},
    create: {
      email: "devuser@doenet.org",
      name: "Dev User",
    },
  });

  const admin_user = await prisma.users.upsert({
    where: { email: "admin@doenet.org" },
    update: {},
    create: {
      email: "admin@doenet.org",
      name: "Admin User",
      isAdmin: true,
    },
  });

  console.log({ old_version, current_version, dev_user, admin_user });
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
