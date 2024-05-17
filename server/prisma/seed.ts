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

  const admin_user = await prisma.users.upsert({
    where: { email: "admin@doenet.org" },
    update: {},
    create: {
      email: "admin@doenet.org",
      isAdmin: true,
    },
  });

  
  const delete_groups = await prisma.promotedContentGroups.deleteMany({});
  const content_groups = await prisma.promotedContentGroups.createMany({
    data: [
      {groupName: "Homepage", currentlyFeatured: true, sortOrder: "a", homepage: true, },
      {groupName: "Sample", currentlyFeatured: true, sortOrder: "b"},
      {groupName: "K-12", currentlyFeatured: true, sortOrder: "c"},
      {groupName: "Unfeatured", currentlyFeatured: false, sortOrder: "ba"},
    ]
  });

  // const homepage_group = await prisma.promotedContentGroups.upsert({
  //   where: { groupName: "Homepage" },
  //   update: {},
  //   create: {
  //     groupName: "Homepage",
  //   }
  // });

  console.log({ old_version, current_version, dev_user, admin_user, content_groups });
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
