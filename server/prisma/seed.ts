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

  const group_homepage = await prisma.promotedContentGroups.upsert({
    where: { groupName: "Homepage" },
    update: { currentlyFeatured: true, sortOrder: "a", homepage: true },
    create: {
      groupName: "Homepage",
      currentlyFeatured: true,
      sortOrder: "a",
      homepage: true,
    },
  });
  const group_sample = await prisma.promotedContentGroups.upsert({
    where: { groupName: "Sample" },
    update: { currentlyFeatured: true, sortOrder: "b" },
    create: {
      groupName: "Sample",
      currentlyFeatured: true,
      sortOrder: "b",
    },
  });
  const group_k12 = await prisma.promotedContentGroups.upsert({
    where: { groupName: "K-12" },
    update: { currentlyFeatured: true, sortOrder: "c" },
    create: {
      groupName: "K-12",
      currentlyFeatured: true,
      sortOrder: "c",
    },
  });
  const group_unfeatured = await prisma.promotedContentGroups.upsert({
    where: { groupName: "Unfeatured" },
    update: { currentlyFeatured: false, sortOrder: "ba" },
    create: {
      groupName: "Unfeatured",
      currentlyFeatured: false,
      sortOrder: "ba",
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
