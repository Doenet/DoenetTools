import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
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
    update: { fullVersion: "0.7.0-alpha18" },
    create: {
      displayedVersion: "0.7",
      fullVersion: "0.7.0-alpha18",
      default: true,
    },
  });

  await prisma.users.upsert({
    where: { email: "library@doenet.org" },
    update: {},
    create: {
      email: "library@doenet.org",
      lastNames: "Library",
      isLibrary: true
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

  // Classifications
  async function upsertClassificationSystem(
    name: string,
    categoryLabel: string,
    subCategoryLabel: string,
  ) {
    const { id } = await prisma.classificationSystems.upsert({
      where: { name },
      update: { name, categoryLabel, subCategoryLabel },
      create: { name, categoryLabel, subCategoryLabel },
    });
    return id;
  }
  async function upsertClassificationCategory(
    category: string,
    systemId: number,
  ) {
    const { id } = await prisma.classificationCategories.upsert({
      where: { category_systemId: { category, systemId } },
      update: { category, systemId },
      create: { category, systemId },
    });
    return id;
  }
  async function upsertClassificationSubCategory(
    subCategory: string,
    categoryId: number,
  ) {
    const { id } = await prisma.classificationSubCategories.upsert({
      where: { subCategory_categoryId: { subCategory, categoryId } },
      update: { subCategory, categoryId },
      create: { subCategory, categoryId },
    });
    return id;
  }
  async function upsertClassification(
    code: string,
    description: string,
    subCategoryId: number,
  ) {
    await prisma.classifications.upsert({
      where: {
        code_subCategoryId: { code, subCategoryId },
      },
      update: { code, description, subCategoryId },
      create: { code, description, subCategoryId },
    });
  }

  const commonCoreId = await upsertClassificationSystem(
    "Common Core",
    "Grade",
    "Cluster",
  );
  const commonCoreKinderId = await upsertClassificationCategory(
    "Kindergarten",
    commonCoreId,
  );
  const commonCoreHSId = await upsertClassificationCategory("HS", commonCoreId);
  const commonCoreCardinalityId = await upsertClassificationSubCategory(
    "Counting and Cardinality: Know number names and the count sequence.",
    commonCoreKinderId,
  );
  const commonCoreAlgebraicId = await upsertClassificationSubCategory(
    "Operations and Algebraic Thinking: Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.",
    commonCoreKinderId,
  );
  const commonCoreStructureId = await upsertClassificationSubCategory(
    "Seeing Structure in Expressions: Write expressions in equivalent forms to solve problems.",
    commonCoreHSId,
  );

  await upsertClassification(
    "K.CC.1",
    "Count to 100 by ones and by tens.",
    commonCoreCardinalityId,
  );
  await upsertClassification(
    "K.CC.2",
    "Count forward beginning from a given number within the known sequence (instead of having to begin at 1).",
    commonCoreCardinalityId,
  );
  await upsertClassification(
    "K.CC.3",
    "Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).",
    commonCoreCardinalityId,
  );
  await upsertClassification(
    "K.OA.1",
    "Represent addition and subtraction with objects, fingers, mental images, drawings (Drawings need not show details, but should show the mathematics in the problem.(This applies wherever drawings are mentioned in the Standards.)), sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations.",
    commonCoreAlgebraicId,
  );
  await upsertClassification(
    "A.SSE.3 c.",
    "Use the properties of exponents to transform expressions for exponential functions.  For example the expression 1.15t can be rewritten as (1.151/12)12t ≈1.01212t to reveal the approximate equivalent monthly interest rate if the annual rate is 15%.",
    commonCoreStructureId,
  );

  const mnId = await upsertClassificationSystem(
    "Minnesota Academic Standards in Math",
    "Grade",
    "Standard",
  );
  const mnEighthId = await upsertClassificationCategory("8", mnId);
  const mnNinthId = await upsertClassificationCategory("9", mnId);
  const mnFuncId = await upsertClassificationSubCategory(
    "Understand the concept of function in real-world and mathematical situations, and distinguish between linear and nonlinear functions.",
    mnEighthId,
  );
  const mnProbabilityId = await upsertClassificationSubCategory(
    "Calculate probabilities and apply probability concepts to solve real-world and mathematical problems.",
    mnNinthId,
  );
  await upsertClassification(
    "8.2.1.5",
    "Understand that a geometric sequence is a non-linear function that can be expressed in the form f(x) = ab^x, where x = 0, 1, 2, 3,….",
    mnFuncId,
  );
  await upsertClassification(
    "9.4.3.9",
    "Use the relationship between conditional probabilities and relative frequencies in contingency tables.",
    mnProbabilityId,
  );

  await prisma.licenses.upsert({
    where: { code: "CCBYSA" },
    update: {
      name: "Creative Commons Attribution-ShareAlike",
      description:
        "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, even for commercial purposes. If others remix, adapt, or build upon the material, they must license the modified material under identical terms.",
      imageURL: "/creative_commons_by_sa.png",
      smallImageURL: "/creative_commons_by_sa_small.png",
      licenseURL: "https://creativecommons.org/licenses/by-sa/4.0/",
      sortIndex: 2,
    },
    create: {
      code: "CCBYSA",
      name: "Creative Commons Attribution-ShareAlike",
      description:
        "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, even for commercial purposes. If others remix, adapt, or build upon the material, they must license the modified material under identical terms.",
      imageURL: "/creative_commons_by_sa.png",
      smallImageURL: "/creative_commons_by_sa_small.png",
      licenseURL: "https://creativecommons.org/licenses/by-sa/4.0/",
      sortIndex: 2,
    },
  });

  await prisma.licenses.upsert({
    where: { code: "CCBYNCSA" },
    update: {
      name: "Creative Commons Attribution-NonCommercial-ShareAlike",
      description:
        "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, for noncommercial purposes only. If others modify or adapt the material, they must license the modified material under identical terms.",
      imageURL: "/creative_commons_by_nc_sa.png",
      smallImageURL: "/creative_commons_by_nc_sa_small.png",
      licenseURL: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      sortIndex: 3,
    },
    create: {
      code: "CCBYNCSA",
      name: "Creative Commons Attribution-NonCommercial-ShareAlike",
      description:
        "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, for noncommercial purposes only. If others modify or adapt the material, they must license the modified material under identical terms.",
      imageURL: "/creative_commons_by_nc_sa.png",
      smallImageURL: "/creative_commons_by_nc_sa_small.png",
      licenseURL: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      sortIndex: 3,
    },
  });

  await prisma.licenses.upsert({
    where: { code: "CCDUAL" },
    update: {
      name: "Dual license Creative Commons Attribution-ShareAlike OR Attribution-NonCommercial-ShareAlike",
      description:
        "Allow reusers to use either the Creative Commons Attribution-ShareAlike license or the Creative Commons Attribution-NonCommercial-ShareAlike license.",
      sortIndex: 1,
    },
    create: {
      code: "CCDUAL",
      name: "Dual license Creative Commons Attribution-ShareAlike OR Attribution-NonCommercial-ShareAlike",
      description:
        "Allow reusers to use either the Creative Commons Attribution-ShareAlike license or the Creative Commons Attribution-NonCommercial-ShareAlike license.",
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
