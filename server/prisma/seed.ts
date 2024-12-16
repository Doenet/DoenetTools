import { PrismaClient } from "@prisma/client";
import commonCoreMath from "./seed-data/common-core-math.json";
import mnMath from "./seed-data/mn-math.json";

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

  // Classifications
  async function upsertClassificationSystem(
    name: string,
    categoryLabel: string,
    subCategoryLabel: string,
    sortIndex: number,
  ) {
    const { id } = await prisma.classificationSystems.upsert({
      where: { name },
      update: { name, categoryLabel, subCategoryLabel, sortIndex },
      create: { name, categoryLabel, subCategoryLabel, sortIndex },
    });
    return id;
  }
  async function upsertClassificationCategory(
    category: string,
    systemId: number,
    sortIndex: number,
  ) {
    const { id } = await prisma.classificationCategories.upsert({
      where: { category_systemId: { category, systemId } },
      update: { category, systemId, sortIndex },
      create: { category, systemId, sortIndex },
    });
    return id;
  }
  async function upsertClassificationSubCategory(
    subCategory: string,
    categoryId: number,
    sortIndex: number,
  ) {
    const { id } = await prisma.classificationSubCategories.upsert({
      where: { subCategory_categoryId: { subCategory, categoryId } },
      update: { subCategory, categoryId, sortIndex },
      create: { subCategory, categoryId, sortIndex },
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

  type ClassificationSystemData = {
    category: string;
    subCategory: string;
    code: string;
    description: string;
    sortIndex: string;
  }[];

  async function addClassificationFromData({
    name,
    categoryLabel,
    subCategoryLabel,
    data,
    sortIndex,
  }: {
    name: string;
    categoryLabel: string;
    subCategoryLabel: string;
    data: ClassificationSystemData;
    sortIndex: number;
  }) {
    const systemId = await upsertClassificationSystem(
      name,
      categoryLabel,
      subCategoryLabel,
      sortIndex,
    );

    let lastCategory = "";
    let lastCategoryId = NaN;
    let lastSubCategory = "";
    let lastSubCategoryId = NaN;
    for (const classification of data) {
      if (classification.category !== lastCategory) {
        lastCategoryId = await upsertClassificationCategory(
          classification.category,
          systemId,
          Number(classification.sortIndex),
        );
        lastCategory = classification.category;
      }
      if (classification.subCategory !== lastSubCategory) {
        lastSubCategoryId = await upsertClassificationSubCategory(
          classification.subCategory,
          lastCategoryId,
          Number(classification.sortIndex),
        );
        lastSubCategory = classification.subCategory;
      }
      await upsertClassification(
        classification.code,
        classification.description,
        lastSubCategoryId,
      );
    }
  }

  await addClassificationFromData({
    name: "Common Core",
    categoryLabel: "Grade",
    subCategoryLabel: "Cluster",
    data: commonCoreMath,
    sortIndex: 1,
  });

  await addClassificationFromData({
    name: "Minnesota Academic Standards in Math",
    categoryLabel: "Grade",
    subCategoryLabel: "Standard",
    data: mnMath,
    sortIndex: 2,
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
