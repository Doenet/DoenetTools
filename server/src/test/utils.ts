import { onTestFinished } from "vitest";
import { findOrCreateUser, prisma } from "../model";

// create an isolated user for each test, will allow tests to be run in parallel
export async function createTestUser(isAdmin = false, isAnonymous = false) {
  const id =
    Date.now().toString() + Math.round(Math.random() * 1000).toString();
  const email = `vitest${id}@vitest.test`;
  const firstNames = `vitest`;
  const lastNames = `user${id}`;

  let user;

  try {
    user = await findOrCreateUser({
      email,
      firstNames,
      lastNames,
      isAdmin,
      isAnonymous,
    });
  } catch (_e) {
    // try again by adding "a" to the end of the id for the email
    user = await findOrCreateUser({
      email: `vitest${id}a@vitest.test`,
      firstNames,
      lastNames: `user${id}a`,
      isAdmin,
      isAnonymous,
    });
  }
  return user;
}

export async function createTestAdminUser() {
  return await createTestUser(true);
}

export async function createTestAnonymousUser() {
  return await createTestUser(false, true);
}

export async function createTestClassifications({
  systemId,
  word,
  code,
}: {
  systemId: number;
  word: string;
  code: string;
}) {
  ////////////////
  // A. category A
  ////////////////
  const { id: categoryIdA } = await prisma.classificationCategories.create({
    data: {
      category: `${word}${code} ${word}A${code}`,
      systemId,
      sortIndex: 1,
    },
  });

  // A1. sub category A1
  //////////////////////
  const { id: subCategoryIdA1 } =
    await prisma.classificationSubCategories.create({
      data: {
        subCategory: `${word}${code} ${word}A1${code}`,
        categoryId: categoryIdA,
        sortIndex: 1,
      },
    });

  // A1A. classification A1A
  const { id: classificationIdA1A } = await prisma.classifications.create({
    data: {
      code: `${word}.A1A.${code}`,
      descriptions: {
        create: {
          description: `${word}${code} ${word}A1A${code}`,
          subCategoryId: subCategoryIdA1,
          sortIndex: 1,
        },
      },
    },
  });

  // A1B. classification A1B
  const { id: classificationIdA1B } = await prisma.classifications.create({
    data: {
      code: `${word}.A1B.${code}`,
      descriptions: {
        create: {
          description: `${word}${code} ${word}A1B${code}`,
          subCategoryId: subCategoryIdA1,
          sortIndex: 1,
        },
      },
    },
  });

  // A2. sub category A2
  //////////////////////
  const { id: subCategoryIdA2 } =
    await prisma.classificationSubCategories.create({
      data: {
        subCategory: `${word}${code} ${word}A2${code}`,
        categoryId: categoryIdA,
        sortIndex: 1,
      },
    });

  // A2A. classification A2A
  const { id: classificationIdA2A } = await prisma.classifications.create({
    data: {
      code: `${word}.A2A.${code}`,
      descriptions: {
        create: {
          description: `${word}${code} ${word}A2A${code}`,
          subCategoryId: subCategoryIdA2,
          sortIndex: 1,
        },
      },
    },
  });

  // A2B. classification A2B
  const { id: classificationIdA2B } = await prisma.classifications.create({
    data: {
      code: `${word}.A2B.${code}`,
      descriptions: {
        create: {
          description: `${word}${code} ${word}A2B${code}`,
          subCategoryId: subCategoryIdA2,
          sortIndex: 1,
        },
      },
    },
  });

  ////////////////
  // B. category B
  ////////////////
  const { id: categoryIdB } = await prisma.classificationCategories.create({
    data: {
      category: `${word}${code} ${word}B${code}`,
      systemId,
      sortIndex: 1,
    },
  });

  // B1. sub category B1
  //////////////////////
  const { id: subCategoryIdB1 } =
    await prisma.classificationSubCategories.create({
      data: {
        subCategory: `${word}${code} ${word}B1${code}`,
        categoryId: categoryIdB,
        sortIndex: 1,
      },
    });

  // B1A. classification B1A
  const { id: classificationIdB1A } = await prisma.classifications.create({
    data: {
      code: `${word}.B1A.${code}`,
      descriptions: {
        create: {
          description: `${word}${code} ${word}B1A${code}`,
          subCategoryId: subCategoryIdB1,
          sortIndex: 1,
        },
      },
    },
  });

  // B1B. classification B1B
  const { id: classificationIdB1B } = await prisma.classifications.create({
    data: {
      code: `${word}.B1B.${code}`,
      descriptions: {
        create: {
          description: `${word}${code} ${word}B1B${code}`,
          subCategoryId: subCategoryIdB1,
          sortIndex: 1,
        },
      },
    },
  });

  // B2. sub category B2
  //////////////////////
  const { id: subCategoryIdB2 } =
    await prisma.classificationSubCategories.create({
      data: {
        subCategory: `${word}${code} ${word}B2${code}`,
        categoryId: categoryIdB,
        sortIndex: 1,
      },
    });

  // B2A. classification B2A
  const { id: classificationIdB2A } = await prisma.classifications.create({
    data: {
      code: `${word}.B2A.${code}`,
      descriptions: {
        create: {
          description: `${word}${code} ${word}B2A${code}`,
          subCategoryId: subCategoryIdB2,
          sortIndex: 1,
        },
      },
    },
  });

  // B2B. classification B2B
  const { id: classificationIdB2B } = await prisma.classifications.create({
    data: {
      code: `${word}.B2B.${code}`,
      descriptions: {
        create: {
          description: `${word}${code} ${word}B2B${code}`,
          subCategoryId: subCategoryIdB2,
          sortIndex: 1,
        },
      },
    },
  });

  onTestFinished(() =>
    deleteTestClassifications({
      categoryIdA,
      subCategoryIdA1,
      classificationIdA1A,
      classificationIdA1B,
      subCategoryIdA2,
      classificationIdA2A,
      classificationIdA2B,
      categoryIdB,
      subCategoryIdB1,
      classificationIdB1A,
      classificationIdB1B,
      subCategoryIdB2,
      classificationIdB2A,
      classificationIdB2B,
    }),
  );

  return {
    categoryIdA,
    subCategoryIdA1,
    classificationIdA1A,
    classificationIdA1B,
    subCategoryIdA2,
    classificationIdA2A,
    classificationIdA2B,
    categoryIdB,
    subCategoryIdB1,
    classificationIdB1A,
    classificationIdB1B,
    subCategoryIdB2,
    classificationIdB2A,
    classificationIdB2B,
  };
}

export async function deleteTestClassifications({
  categoryIdA,
  subCategoryIdA1,
  classificationIdA1A,
  classificationIdA1B,
  subCategoryIdA2,
  classificationIdA2A,
  classificationIdA2B,
  categoryIdB,
  subCategoryIdB1,
  classificationIdB1A,
  classificationIdB1B,
  subCategoryIdB2,
  classificationIdB2A,
  classificationIdB2B,
}: {
  categoryIdA: number;
  subCategoryIdA1: number;
  classificationIdA1A: number;
  classificationIdA1B: number;
  subCategoryIdA2: number;
  classificationIdA2A: number;
  classificationIdA2B: number;
  categoryIdB: number;
  subCategoryIdB1: number;
  classificationIdB1A: number;
  classificationIdB1B: number;
  subCategoryIdB2: number;
  classificationIdB2A: number;
  classificationIdB2B: number;
}) {
  // sub category A1
  await prisma.classifications.update({
    where: { id: classificationIdA1A },
    data: { contentClassifications: { deleteMany: {} } },
  });
  await prisma.classifications.update({
    where: { id: classificationIdA1B },
    data: { contentClassifications: { deleteMany: {} } },
  });

  await prisma.classificationDescriptions.delete({
    where: {
      classificationId_subCategoryId: {
        classificationId: classificationIdA1A,
        subCategoryId: subCategoryIdA1,
      },
    },
  });
  await prisma.classifications.delete({ where: { id: classificationIdA1A } });
  await prisma.classificationDescriptions.delete({
    where: {
      classificationId_subCategoryId: {
        classificationId: classificationIdA1B,
        subCategoryId: subCategoryIdA1,
      },
    },
  });
  await prisma.classifications.delete({ where: { id: classificationIdA1B } });
  await prisma.classificationSubCategories.delete({
    where: { id: subCategoryIdA1 },
  });

  // sub category A2
  await prisma.classifications.update({
    where: { id: classificationIdA2A },
    data: { contentClassifications: { deleteMany: {} } },
  });
  await prisma.classifications.update({
    where: { id: classificationIdA2B },
    data: { contentClassifications: { deleteMany: {} } },
  });

  await prisma.classificationDescriptions.delete({
    where: {
      classificationId_subCategoryId: {
        classificationId: classificationIdA2A,
        subCategoryId: subCategoryIdA2,
      },
    },
  });
  await prisma.classifications.delete({ where: { id: classificationIdA2A } });
  await prisma.classificationDescriptions.delete({
    where: {
      classificationId_subCategoryId: {
        classificationId: classificationIdA2B,
        subCategoryId: subCategoryIdA2,
      },
    },
  });
  await prisma.classifications.delete({ where: { id: classificationIdA2B } });
  await prisma.classificationSubCategories.delete({
    where: { id: subCategoryIdA2 },
  });

  await prisma.classificationCategories.delete({ where: { id: categoryIdA } });

  // sub category B1
  await prisma.classifications.update({
    where: { id: classificationIdB1A },
    data: { contentClassifications: { deleteMany: {} } },
  });
  await prisma.classifications.update({
    where: { id: classificationIdB1B },
    data: { contentClassifications: { deleteMany: {} } },
  });

  await prisma.classificationDescriptions.delete({
    where: {
      classificationId_subCategoryId: {
        classificationId: classificationIdB1A,
        subCategoryId: subCategoryIdB1,
      },
    },
  });
  await prisma.classifications.delete({ where: { id: classificationIdB1A } });
  await prisma.classificationDescriptions.delete({
    where: {
      classificationId_subCategoryId: {
        classificationId: classificationIdB1B,
        subCategoryId: subCategoryIdB1,
      },
    },
  });
  await prisma.classifications.delete({ where: { id: classificationIdB1B } });
  await prisma.classificationSubCategories.delete({
    where: { id: subCategoryIdB1 },
  });

  // sub category B2
  await prisma.classifications.update({
    where: { id: classificationIdB2A },
    data: { contentClassifications: { deleteMany: {} } },
  });
  await prisma.classifications.update({
    where: { id: classificationIdB2B },
    data: { contentClassifications: { deleteMany: {} } },
  });

  await prisma.classificationDescriptions.delete({
    where: {
      classificationId_subCategoryId: {
        classificationId: classificationIdB2A,
        subCategoryId: subCategoryIdB2,
      },
    },
  });
  await prisma.classifications.delete({ where: { id: classificationIdB2A } });
  await prisma.classificationDescriptions.delete({
    where: {
      classificationId_subCategoryId: {
        classificationId: classificationIdB2B,
        subCategoryId: subCategoryIdB2,
      },
    },
  });
  await prisma.classifications.delete({ where: { id: classificationIdB2B } });
  await prisma.classificationSubCategories.delete({
    where: { id: subCategoryIdB2 },
  });

  await prisma.classificationCategories.delete({ where: { id: categoryIdB } });
}
