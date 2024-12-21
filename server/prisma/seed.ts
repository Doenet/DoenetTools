import { PrismaClient } from "@prisma/client";
import commonCoreMath from "./seed-data/common-core-math.json";
import mnMath from "./seed-data/mn-math.json";
import webWork from "./seed-data/webwork.json";

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
    shortName: string,
    categoryLabel: string,
    subCategoryLabel: string,
    descriptionLabel: string,
    sortIndex: number,
  ) {
    const { id } = await prisma.classificationSystems.upsert({
      where: { name },
      update: {
        name,
        shortName,
        categoryLabel,
        subCategoryLabel,
        descriptionLabel,
        sortIndex,
      },
      create: {
        name,
        shortName,
        categoryLabel,
        subCategoryLabel,
        descriptionLabel,
        sortIndex,
      },
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
    // can't actually upsert and don't a unique index
    const classification = await prisma.classifications.findMany({
      where: {
        code,
        subCategories: { some: { id: subCategoryId } },
      },
    });
    if (classification.length > 1) {
      throw Error("Shouldn't get a duplicate classification when seeding...");
    }

    if (classification.length === 1) {
      // even though just one record have to use updateMany as don't a unique index
      await prisma.classifications.updateMany({
        where: { code, subCategories: { some: { id: subCategoryId } } },
        data: { description },
      });
    } else {
      await prisma.classifications.create({
        data: {
          code,
          description,
          subCategories: { connect: { id: subCategoryId } },
        },
      });
    }
  }

  type ClassificationSystemData = {
    category: string;
    subCategory: string;
    code: string;
    description:
      | string
      | {
          descriptionLinked: string;
          toCategory: string;
          toSubCategory: string;
          toDescription: string;
        };
    sortIndex: string;
  }[];

  async function addClassificationFromData({
    name,
    shortName,
    categoryLabel,
    subCategoryLabel,
    descriptionLabel,
    data,
    sortIndex,
  }: {
    name: string;
    shortName: string;
    categoryLabel: string;
    subCategoryLabel: string;
    descriptionLabel: string;
    data: ClassificationSystemData;
    sortIndex: number;
  }) {
    const systemId = await upsertClassificationSystem(
      name,
      shortName,
      categoryLabel,
      subCategoryLabel,
      descriptionLabel,
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
      if (typeof classification.description === "string") {
        await upsertClassification(
          classification.code,
          classification.description,
          lastSubCategoryId,
        );
      }
    }

    for (const classification of data) {
      if (typeof classification.description !== "string") {
        const linked = classification.description;

        if (linked.toDescription !== linked.descriptionLinked) {
          throw Error(
            `We haven't yet implemented case where descriptions don't match. ${JSON.stringify(classification)}`,
          );
        }

        // find category, subCategory, classification that we'll link to
        const linkedCategoryId = (
          await prisma.classificationCategories.findUniqueOrThrow({
            where: {
              category_systemId: { systemId, category: linked.toCategory },
            },
          })
        ).id;

        const linkedSubCategoryId = (
          await prisma.classificationSubCategories.findUniqueOrThrow({
            where: {
              subCategory_categoryId: {
                categoryId: linkedCategoryId,
                subCategory: linked.toSubCategory,
              },
            },
          })
        ).id;

        const linkedClassification = await prisma.classifications.findMany({
          where: {
            description: linked.toDescription,
            subCategories: { some: { id: linkedSubCategoryId } },
          },
        });

        if (linkedClassification.length !== 1) {
          throw Error(
            "Classification linked to description that isn't found or isn't unique",
          );
        }

        // find new category and subcategory
        const newCategoryId = (
          await prisma.classificationCategories.findUniqueOrThrow({
            where: {
              category_systemId: {
                systemId,
                category: classification.category,
              },
            },
          })
        ).id;

        const newSubCategoryId = (
          await prisma.classificationSubCategories.findUniqueOrThrow({
            where: {
              subCategory_categoryId: {
                categoryId: newCategoryId,
                subCategory: classification.subCategory,
              },
            },
          })
        ).id;

        await prisma.classifications.update({
          where: { id: linkedClassification[0].id },
          data: { subCategories: { connect: { id: newSubCategoryId } } },
        });
      }
    }
  }

  await addClassificationFromData({
    name: "Common Core",
    shortName: "Common Core",
    categoryLabel: "Grade",
    subCategoryLabel: "Cluster",
    descriptionLabel: "Standard",
    data: commonCoreMath,
    sortIndex: 1,
  });

  await addClassificationFromData({
    name: "Minnesota Academic Standards in Math",
    shortName: "MN Math",
    categoryLabel: "Grade",
    subCategoryLabel: "Standard",
    descriptionLabel: "Benchmark",
    data: mnMath,
    sortIndex: 2,
  });

  await addClassificationFromData({
    name: "WeBWorK taxonomy",
    shortName: "WeBWorK",
    categoryLabel: "Subject",
    subCategoryLabel: "Chapter",
    descriptionLabel: "Section",
    data: webWork,
    sortIndex: 3,
  });

  await prisma.licenses.upsert({
    where: { code: "CCBYSA" },
    update: {
      name: "Creative Commons Attribution-ShareAlike 4.0",
      description:
        "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, even for commercial purposes. If others remix, adapt, or build upon the material, they must license the modified material under identical terms.",
      imageURL: "/creative_commons_by_sa.png",
      smallImageURL: "/creative_commons_by_sa_small.png",
      licenseURL: "https://creativecommons.org/licenses/by-sa/4.0/",
      sortIndex: 2,
    },
    create: {
      code: "CCBYSA",
      name: "Creative Commons Attribution-ShareAlike 4.0",
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
      name: "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
      description:
        "This license requires that reusers give credit to the creator. It allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, for noncommercial purposes only. If others modify or adapt the material, they must license the modified material under identical terms.",
      imageURL: "/creative_commons_by_nc_sa.png",
      smallImageURL: "/creative_commons_by_nc_sa_small.png",
      licenseURL: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      sortIndex: 3,
    },
    create: {
      code: "CCBYNCSA",
      name: "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
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
