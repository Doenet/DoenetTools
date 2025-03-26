import { PrismaClient } from "@prisma/client";
import { seedClassifications } from "./seed/seed-classifications";

export const prisma = new PrismaClient();
async function main() {
  await prisma.doenetmlVersions.upsert({
    where: { displayedVersion: "0.6" },
    update: { fullVersion: "0.6.7" },
    create: {
      displayedVersion: "0.6",
      fullVersion: "0.6.7",
      deprecated: true,
      deprecationMessage: "It will be removed after June 2025.",
    },
  });
  await prisma.doenetmlVersions.upsert({
    where: { displayedVersion: "0.7" },
    update: { fullVersion: "0.7.0-alpha36" },
    create: {
      displayedVersion: "0.7",
      fullVersion: "0.7.0-alpha36",
      default: true,
    },
  });

  await prisma.users.upsert({
    where: { email: "library@doenet.org" },
    update: {},
    create: {
      email: "library@doenet.org",
      lastNames: "Library",
      isLibrary: true,
    },
  });

  await prisma.users.upsert({
    where: { email: "devuser@doenet.org" },
    update: {},
    create: {
      email: "devuser@doenet.org",
      firstNames: "Dev",
      lastNames: "User",
    },
  });

  await prisma.users.upsert({
    where: { email: "admin@doenet.org" },
    update: {},
    create: {
      email: "admin@doenet.org",
      firstNames: "Admin",
      lastNames: "User",
      isAdmin: true,
    },
  });

  await prisma.promotedContentGroups.upsert({
    where: { groupName: "Homepage" },
    update: { currentlyFeatured: true, sortIndex: 0, homepage: true },
    create: {
      groupName: "Homepage",
      currentlyFeatured: true,
      sortIndex: 0,
      homepage: true,
    },
  });
  await prisma.promotedContentGroups.upsert({
    where: { groupName: "Sample" },
    update: { currentlyFeatured: true, sortIndex: 2 ** 32 },
    create: {
      groupName: "Sample",
      currentlyFeatured: true,
      sortIndex: 2 ** 32,
    },
  });
  await prisma.promotedContentGroups.upsert({
    where: { groupName: "K-12" },
    update: { currentlyFeatured: true, sortIndex: 2 ** 32 * 3 },
    create: {
      groupName: "K-12",
      currentlyFeatured: true,
      sortIndex: 2 ** 32 * 3,
    },
  });
  await prisma.promotedContentGroups.upsert({
    where: { groupName: "Unfeatured" },
    update: { currentlyFeatured: false, sortIndex: 2 ** 32 * 2 },
    create: {
      groupName: "Unfeatured",
      currentlyFeatured: false,
      sortIndex: 2 ** 32 * 2,
    },
  });

  await prisma.licenses.upsert({
    where: { code: "CCBYSA" },
    update: {
      name: "Creative Commons Attribution-ShareAlike 4.0",
      description:
        "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, even for commercial purposes. If others remix, adapt, or build upon the material, they must license the modified material under identical terms.",
      imageURL: "/creative_commons_by_sa.png",
      smallImageURL: "/by-sa-sm.png",
      licenseURL: "https://creativecommons.org/licenses/by-sa/4.0/",
      sortIndex: 2,
    },
    create: {
      code: "CCBYSA",
      name: "Creative Commons Attribution-ShareAlike 4.0",
      description:
        "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, even for commercial purposes. If others remix, adapt, or build upon the material, they must license the modified material under identical terms.",
      imageURL: "/creative_commons_by_sa.png",
      smallImageURL: "/by-sa-sm.png",
      licenseURL: "https://creativecommons.org/licenses/by-sa/4.0/",
      sortIndex: 2,
    },
  });

  await prisma.licenses.upsert({
    where: { code: "CCBYNCSA" },
    update: {
      name: "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
      description:
        "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, for noncommercial purposes only. If others modify or adapt the material, they must license the modified material under identical terms.",
      imageURL: "/creative_commons_by_nc_sa.png",
      smallImageURL: "/by-nc-sa-sm.png",
      licenseURL: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      sortIndex: 3,
    },
    create: {
      code: "CCBYNCSA",
      name: "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
      description:
        "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, for noncommercial purposes only. If others modify or adapt the material, they must license the modified material under identical terms.",
      imageURL: "/creative_commons_by_nc_sa.png",
      smallImageURL: "/by-nc-sa-sm.png",
      licenseURL: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      sortIndex: 3,
    },
  });

  await prisma.licenses.upsert({
    where: { code: "CCDUAL" },
    update: {
      name: "Dual license Creative Commons Attribution-ShareAlike 4.0 OR Attribution-NonCommercial-ShareAlike 4.0",
      description:
        "Allow reusers to use either the Creative Commons Attribution-ShareAlike 4.0 license or the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 license.",
      sortIndex: 1,
    },
    create: {
      code: "CCDUAL",
      name: "Dual license Creative Commons Attribution-ShareAlike 4.0 OR Attribution-NonCommercial-ShareAlike 4.0",
      description:
        "Allow reusers to use either the Creative Commons Attribution-ShareAlike 4.0 license or the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 license.",
      sortIndex: 1,
    },
  });

  await prisma.licenseCompositions.upsert({
    where: {
      composedOfCode_includedInCode: {
        composedOfCode: "CCBYSA",
        includedInCode: "CCDUAL",
      },
    },
    update: {},
    create: { composedOfCode: "CCBYSA", includedInCode: "CCDUAL" },
  });

  await prisma.licenseCompositions.upsert({
    where: {
      composedOfCode_includedInCode: {
        composedOfCode: "CCBYNCSA",
        includedInCode: "CCDUAL",
      },
    },
    update: {},
    create: { composedOfCode: "CCBYNCSA", includedInCode: "CCDUAL" },
  });

  await prisma.contentFeatures.upsert({
    where: { code: "isQuestion" },
    update: {
      term: "Single question",
      description:
        "Activity is a single question suitable to add to an assessment.",
      sortIndex: 1,
    },
    create: {
      code: "isQuestion",
      term: "Single question",
      description:
        "Activity is a single question suitable to add to an assessment.",
      sortIndex: 1,
    },
  });

  await prisma.contentFeatures.upsert({
    where: { code: "isInteractive" },
    update: {
      term: "Interactive",
      description:
        "Activity contains interactives, such as draggable graphics.",
      sortIndex: 2,
    },
    create: {
      code: "isInteractive",
      term: "Interactive",
      description:
        "Activity contains interactives, such as draggable graphics.",
      sortIndex: 2,
    },
  });

  await prisma.contentFeatures.upsert({
    where: { code: "containsVideo" },
    update: {
      term: "Video",
      description: "Activity contains videos.",
      sortIndex: 3,
    },
    create: {
      code: "containsVideo",
      term: "Video",
      description: "Activity contains videos.",
      sortIndex: 3,
    },
  });

  await seedClassifications();
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
