import { Prisma, PrismaClient } from "@prisma/client";
import { seedClassifications } from "./seed/seed-classifications";

export const prisma = new PrismaClient();
async function main() {
  await seedDoenetMLVersions();
  await seedUsers();
  await seedLicenses();
  await seedCategories();
  await seedClassifications();
}

async function seedDoenetMLVersions() {
  async function updateOrCreateDoenetMLVersion(
    version: Prisma.doenetmlVersionsCreateInput,
  ) {
    await prisma.doenetmlVersions.upsert({
      where: { displayedVersion: version.displayedVersion },
      update: version,
      create: version,
    });
  }

  await updateOrCreateDoenetMLVersion({
    displayedVersion: "0.6",
    fullVersion: "0.6.7",
    deprecated: true,
    deprecationMessage: "It will be removed after June 2026.",
  });
  await updateOrCreateDoenetMLVersion({
    displayedVersion: "0.7",
    fullVersion: "0.7.0-alpha39",
    default: true,
  });
}

async function seedUsers() {
  async function updateOrCreateUser(user: Prisma.usersCreateInput) {
    await prisma.users.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  await updateOrCreateUser({
    email: "library@doenet.org",
    lastNames: "Library",
    isLibrary: true,
  });
  await updateOrCreateUser({
    email: "devuser@doenet.org",
    firstNames: "Dev",
    lastNames: "User",
  });
  await updateOrCreateUser({
    email: "editor@doenet.org",
    firstNames: "Editor",
    lastNames: "User",
    isEditor: true,
  });
  await updateOrCreateUser({
    email: "editor2@doenet.org",
    firstNames: "Second",
    lastNames: "Editor",
    isEditor: true,
  });
}

async function seedLicenses() {
  async function updateOrCreateLicense(license: Prisma.licensesCreateInput) {
    await prisma.licenses.upsert({
      where: { code: license.code },
      update: license,
      create: license,
    });
  }

  await updateOrCreateLicense({
    code: "CCBYSA",
    name: "Creative Commons Attribution-ShareAlike 4.0",
    description:
      "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, even for commercial purposes. If others remix, adapt, or build upon the material, they must license the modified material under identical terms.",
    imageURL: "/creative_commons_by_sa.png",
    smallImageURL: "/by-sa-sm.png",
    licenseURL: "https://creativecommons.org/licenses/by-sa/4.0/",
    sortIndex: 2,
  });

  await updateOrCreateLicense({
    code: "CCBYNCSA",
    name: "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
    description:
      "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, for noncommercial purposes only. If others modify or adapt the material, they must license the modified material under identical terms.",
    imageURL: "/creative_commons_by_nc_sa.png",
    smallImageURL: "/by-nc-sa-sm.png",
    licenseURL: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    sortIndex: 3,
  });

  await updateOrCreateLicense({
    code: "CCDUAL",
    name: "Dual license Creative Commons Attribution-ShareAlike 4.0 OR Attribution-NonCommercial-ShareAlike 4.0",
    description:
      "Allow reusers to use either the Creative Commons Attribution-ShareAlike 4.0 license or the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 license.",
    sortIndex: 1,
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
}

async function seedCategories() {
  async function updateOrCreateCategory(
    category: Prisma.categoriesCreateInput,
  ) {
    await prisma.categories.upsert({
      where: { code: category.code },
      update: category,
      create: category,
    });
  }

  const categoryType = await prisma.categoryGroups.upsert({
    where: { name: "Type" },
    update: { name: "Type", isExclusive: true },
    create: { name: "Type", isExclusive: true },
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryType.id } },
    code: "isProblemSet",
    term: "Problem set",
    description: "Activity is a problem set.",
    sortIndex: 1,
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryType.id } },
    code: "isQuestion",
    term: "Single question",
    description:
      "Activity is a single question suitable to add to an assessment.",
    sortIndex: 2,
  });
  // We will possibly add these later:
  // - Course (sortIndex 3)
  // - Chapter (sortIndex 4)
  await updateOrCreateCategory({
    group: { connect: { id: categoryType.id } },
    code: "isWidget",
    term: "Widget",
    description: "Activity is a widget that can be reused in other documents.",
    sortIndex: 5,
  });

  const categoryMode = await prisma.categoryGroups.upsert({
    where: { name: "Mode" },
    update: { name: "Mode" },
    create: { name: "Mode" },
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryMode.id } },
    code: "isAssessment",
    term: "Assessment",
    description: "Activity is an assessment suitable to assign to students.",
    sortIndex: 1,
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryMode.id } },
    code: "isPractice",
    term: "Practice",
    description: "Activity is suitable to be used as practice.",
    sortIndex: 2,
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryMode.id } },
    code: "isExploration",
    term: "Exploration",
    // TODO: better description
    description: "Activity is an exploration.",
    sortIndex: 3,
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryMode.id } },
    code: "isDemonstration",
    term: "Demonstration",
    description:
      "Activity is a demonstration that can be used to show students a concept.",
    sortIndex: 4,
  });

  const categorySetting = await prisma.categoryGroups.upsert({
    where: { name: "Setting" },
    update: { name: "Setting" },
    create: { name: "Setting" },
  });
  await updateOrCreateCategory({
    group: { connect: { id: categorySetting.id } },
    code: "forInClass",
    term: "In-class",
    description: "Activity is meant to be done in class.",
    sortIndex: 1,
  });
  await updateOrCreateCategory({
    group: { connect: { id: categorySetting.id } },
    code: "forPreClass",
    term: "Pre-class",
    description: "Activity is meant to be done before class.",
    sortIndex: 2,
  });
  await updateOrCreateCategory({
    group: { connect: { id: categorySetting.id } },
    code: "forHomework",
    term: "Homework",
    description: "Activity is meant to be done after class as homework.",
    sortIndex: 3,
  });

  const categoryDuration = await prisma.categoryGroups.upsert({
    where: { name: "Duration" },
    update: { name: "Duration", isExclusive: true },
    create: { name: "Duration", isExclusive: true },
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryDuration.id } },
    code: "takesLessThanFiveMinutes",
    term: "Less than 5 minutes",
    description: "Activity can be completed within 5 minutes.",
    sortIndex: 1,
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryDuration.id } },
    code: "takesFiveToTwentyMinutes",
    term: "Between 5-20 minutes",
    description: "Activity can be completed in 5 to 20 minutes.",
    sortIndex: 2,
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryDuration.id } },
    code: "takesMoreThanTwentyMinutes",
    term: "More than 20 minutes",
    description: "Activity will take at least 20 minutes to be completed.",
    sortIndex: 3,
  });

  const categoryCategory = await prisma.categoryGroups.upsert({
    where: { name: "Feature" },
    update: { name: "Feature" },
    create: { name: "Feature" },
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryCategory.id } },
    code: "isInteractive",
    term: "Interactive",
    description: "Activity contains interactives, such as draggable graphics.",
    sortIndex: 1,
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryCategory.id } },
    code: "containsVideo",
    term: "Video",
    description: "Activity contains videos.",
    sortIndex: 2,
  });
  await updateOrCreateCategory({
    group: { connect: { id: categoryCategory.id } },
    code: "isAnimation",
    term: "Animation",
    description: "Activity contains animations.",
    sortIndex: 3,
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
