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

  const { id: commonCoreId } = await prisma.classificationSystems.upsert({
    where: { name: "Common Core" },
    update: { name: "Common Core", categoryLabel: "Grade", subCategoryLabel: "Cluster"},
    create: { name: "Common Core", categoryLabel: "Grade", subCategoryLabel: "Cluster"},
  });
  await prisma.classifications.upsert({
    where: {
      code_systemId: {
        code: "K.CC.1",
        systemId: commonCoreId,
      },
    },
    update: {
      code: "K.CC.1",
      category: "Kindergarten",
      subCategory:
        "Counting and Cardinality: Know number names and the count sequence.",
      description: "Count to 100 by ones and by tens.",
      systemId: commonCoreId,
    },
    create: {
      code: "K.CC.1",
      category: "Kindergarten",
      subCategory:
        "Counting and Cardinality: Know number names and the count sequence.",
      description: "Count to 100 by ones and by tens.",
      systemId: commonCoreId,
    },
  });

  await prisma.classifications.upsert({
    where: {
      code_systemId: { code: "K.OA.1", systemId: commonCoreId },
    },
    update: {
      code: "K.OA.1",
      category: "Kindergarten",
      subCategory:
        "Operations and Algebraic Thinking: Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.",
      description:
        "Represent addition and subtraction with objects, fingers, mental images, drawings (Drawings need not show details, but should show the mathematics in the problem.(This applies wherever drawings are mentioned in the Standards.)), sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations.",
      systemId: commonCoreId,
    },
    create: {
      code: "K.OA.1",
      category: "Kindergarten",
      subCategory:
        "Operations and Algebraic Thinking: Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.",
      description:
        "Represent addition and subtraction with objects, fingers, mental images, drawings (Drawings need not show details, but should show the mathematics in the problem.(This applies wherever drawings are mentioned in the Standards.)), sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations.",
      systemId: commonCoreId,
    },
  });

  await prisma.classifications.upsert({
    where: {
      code_systemId: { code: "A.SSE.3 c.", systemId: commonCoreId },
    },
    update: {
      code: "A.SSE.3 c.",
      category: "HS",
      subCategory:
        "Seeing Structure in Expressions: Write expressions in equivalent forms to solve problems.",
      description:
        "Use the properties of exponents to transform expressions for exponential functions.  For example the expression 1.15t can be rewritten as (1.151/12)12t ≈1.01212t to reveal the approximate equivalent monthly interest rate if the annual rate is 15%.",
      systemId: commonCoreId,
    },
    create: {
      code: "A.SSE.3 c.",
      category: "HS",
      subCategory:
        "Seeing Structure in Expressions: Write expressions in equivalent forms to solve problems.",
      description:
        "Use the properties of exponents to transform expressions for exponential functions.  For example the expression 1.15t can be rewritten as (1.151/12)12t ≈1.01212t to reveal the approximate equivalent monthly interest rate if the annual rate is 15%.",
      systemId: commonCoreId,
    },
  });

  const { id: minnesotaMathId } = await prisma.classificationSystems.upsert({
    where: { name: "Minnesota Academic Standards in Math" },
    update: { name: "Minnesota Academic Standards in Math", categoryLabel: "Grade", subCategoryLabel: "Standard"},
    create: { name: "Minnesota Academic Standards in Math", categoryLabel: "Grade", subCategoryLabel: "Standard"},
  });

  await prisma.classifications.upsert({
    where: {
      code_systemId: {
        code: "8.2.1.5",
        systemId: minnesotaMathId,
      },
    },
    update: {
      code: "8.2.1.5",
      category: "8",
      subCategory:
        "Understand the concept of function in real-world and mathematical situations, and distinguish between linear and nonlinear functions.",
      description:
        "Understand that a geometric sequence is a non-linear function that can be expressed in the form f(x) = ab^x, where x = 0, 1, 2, 3,….",
      systemId: minnesotaMathId,
    },
    create: {
      code: "8.2.1.5",
      category: "8",
      subCategory:
        "Understand the concept of function in real-world and mathematical situations, and distinguish between linear and nonlinear functions.",
      description:
        "Understand that a geometric sequence is a non-linear function that can be expressed in the form f(x) = ab^x, where x = 0, 1, 2, 3,….",
      systemId: minnesotaMathId,
    },
  });

  await prisma.classifications.upsert({
    where: {
      code_systemId: {
        code: "9.4.3.9",
        systemId: minnesotaMathId,
      },
    },
    update: {
      code: "9.4.3.9",
      category: "9",
      subCategory:
        "Calculate probabilities and apply probability concepts to solve real-world and mathematical problems.",
      description:
        "Use the relationship between conditional probabilities and relative frequencies in contingency tables.",
      systemId: minnesotaMathId,
    },
    create: {
      code: "9.4.3.9",
      category: "9",
      subCategory:
        "Calculate probabilities and apply probability concepts to solve real-world and mathematical problems.",
      description:
        "Use the relationship between conditional probabilities and relative frequencies in contingency tables.",
      systemId: minnesotaMathId,
    },
  });

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
