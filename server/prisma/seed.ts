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
    update: { fullVersion: "0.7.0-alpha18" },
    create: {
      displayedVersion: "0.7",
      fullVersion: "0.7.0-alpha18",
      default: true,
    },
  });

  const dev_user = await prisma.users.upsert({
    where: { email: "devuser@doenet.org" },
    update: {},
    create: {
      email: "devuser@doenet.org",
      firstNames: "Dev",
      lastNames: "User",
    },
  });

  const admin_user = await prisma.users.upsert({
    where: { email: "admin@doenet.org" },
    update: {},
    create: {
      email: "admin@doenet.org",
      firstNames: "Admin",
      lastNames: "User",
      isAdmin: true,
    },
  });

  const group_homepage = await prisma.promotedContentGroups.upsert({
    where: { groupName: "Homepage" },
    update: { currentlyFeatured: true, sortIndex: 0, homepage: true },
    create: {
      groupName: "Homepage",
      currentlyFeatured: true,
      sortIndex: 0,
      homepage: true,
    },
  });
  const group_sample = await prisma.promotedContentGroups.upsert({
    where: { groupName: "Sample" },
    update: { currentlyFeatured: true, sortIndex: 2 ** 32 },
    create: {
      groupName: "Sample",
      currentlyFeatured: true,
      sortIndex: 2 ** 32,
    },
  });
  const group_k12 = await prisma.promotedContentGroups.upsert({
    where: { groupName: "K-12" },
    update: { currentlyFeatured: true, sortIndex: 2 ** 32 * 3 },
    create: {
      groupName: "K-12",
      currentlyFeatured: true,
      sortIndex: 2 ** 32 * 3,
    },
  });
  const group_unfeatured = await prisma.promotedContentGroups.upsert({
    where: { groupName: "Unfeatured" },
    update: { currentlyFeatured: false, sortIndex: 2 ** 32 * 2 },
    create: {
      groupName: "Unfeatured",
      currentlyFeatured: false,
      sortIndex: 2 ** 32 * 2,
    },
  });

  console.log({
    old_version,
    current_version,
    dev_user,
    admin_user,
    group_homepage,
    group_sample,
    group_k12,
    group_unfeatured,
  });
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
