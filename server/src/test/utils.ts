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
  const { id: descriptionIdA1A } =
    await prisma.classificationDescriptions.create({
      data: {
        description: `${word}${code} ${word}A1A${code}`,
        subCategoryId: subCategoryIdA1,
      },
    });

  const { id: classificationIdA1A } = await prisma.classifications.create({
    data: {
      code: `${word}.A1A.${code}`,
      descriptions: { connect: { id: descriptionIdA1A } },
    },
  });

  // A1B. classification A1B
  const { id: descriptionIdA1B } =
    await prisma.classificationDescriptions.create({
      data: {
        description: `${word}${code} ${word}A1B${code}`,
        subCategoryId: subCategoryIdA1,
      },
    });

  const { id: classificationIdA1B } = await prisma.classifications.create({
    data: {
      code: `${word}.A1B.${code}`,
      descriptions: { connect: { id: descriptionIdA1B } },
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
  const { id: descriptionIdA2A } =
    await prisma.classificationDescriptions.create({
      data: {
        description: `${word}${code} ${word}A2A${code}`,
        subCategoryId: subCategoryIdA2,
      },
    });

  const { id: classificationIdA2A } = await prisma.classifications.create({
    data: {
      code: `${word}.A2A.${code}`,
      descriptions: { connect: { id: descriptionIdA2A } },
    },
  });

  // A2B. classification A2B
  const { id: descriptionIdA2B } =
    await prisma.classificationDescriptions.create({
      data: {
        description: `${word}${code} ${word}A2B${code}`,
        subCategoryId: subCategoryIdA2,
      },
    });

  const { id: classificationIdA2B } = await prisma.classifications.create({
    data: {
      code: `${word}.A2B.${code}`,
      descriptions: { connect: { id: descriptionIdA2B } },
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
  const { id: descriptionIdB1A } =
    await prisma.classificationDescriptions.create({
      data: {
        description: `${word}${code} ${word}B1A${code}`,
        subCategoryId: subCategoryIdB1,
      },
    });

  const { id: classificationIdB1A } = await prisma.classifications.create({
    data: {
      code: `${word}.B1A.${code}`,
      descriptions: { connect: { id: descriptionIdB1A } },
    },
  });

  // B1B. classification B1B
  const { id: descriptionIdB1B } =
    await prisma.classificationDescriptions.create({
      data: {
        description: `${word}${code} ${word}B1B${code}`,
        subCategoryId: subCategoryIdB1,
      },
    });

  const { id: classificationIdB1B } = await prisma.classifications.create({
    data: {
      code: `${word}.B1B.${code}`,
      descriptions: { connect: { id: descriptionIdB1B } },
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
  const { id: descriptionIdB2A } =
    await prisma.classificationDescriptions.create({
      data: {
        description: `${word}${code} ${word}B2A${code}`,
        subCategoryId: subCategoryIdB2,
      },
    });

  const { id: classificationIdB2A } = await prisma.classifications.create({
    data: {
      code: `${word}.B2A.${code}`,
      descriptions: { connect: { id: descriptionIdB2A } },
    },
  });

  // B2B. classification B2B
  const { id: descriptionIdB2B } =
    await prisma.classificationDescriptions.create({
      data: {
        description: `${word}${code} ${word}B2B${code}`,
        subCategoryId: subCategoryIdB2,
      },
    });

  const { id: classificationIdB2B } = await prisma.classifications.create({
    data: {
      code: `${word}.B2B.${code}`,
      descriptions: { connect: { id: descriptionIdB2B } },
    },
  });

  onTestFinished(() =>
    deleteTestClassifications({
      categoryIdA,
      subCategoryIdA1,
      descriptionIdA1A,
      classificationIdA1A,
      descriptionIdA1B,
      classificationIdA1B,
      subCategoryIdA2,
      descriptionIdA2A,
      classificationIdA2A,
      descriptionIdA2B,
      classificationIdA2B,
      categoryIdB,
      subCategoryIdB1,
      descriptionIdB1A,
      classificationIdB1A,
      descriptionIdB1B,
      classificationIdB1B,
      subCategoryIdB2,
      descriptionIdB2A,
      classificationIdB2A,
      descriptionIdB2B,
      classificationIdB2B,
    }),
  );

  return {
    categoryIdA,
    subCategoryIdA1,
    descriptionIdA1A,
    classificationIdA1A,
    descriptionIdA1B,
    classificationIdA1B,
    subCategoryIdA2,
    descriptionIdA2A,
    classificationIdA2A,
    descriptionIdA2B,
    classificationIdA2B,
    categoryIdB,
    subCategoryIdB1,
    descriptionIdB1A,
    classificationIdB1A,
    descriptionIdB1B,
    classificationIdB1B,
    subCategoryIdB2,
    descriptionIdB2A,
    classificationIdB2A,
    descriptionIdB2B,
    classificationIdB2B,
  };
}

export async function deleteTestClassifications({
  categoryIdA,
  subCategoryIdA1,
  descriptionIdA1A,
  classificationIdA1A,
  descriptionIdA1B,
  classificationIdA1B,
  subCategoryIdA2,
  descriptionIdA2A,
  classificationIdA2A,
  descriptionIdA2B,
  classificationIdA2B,
  categoryIdB,
  subCategoryIdB1,
  descriptionIdB1A,
  classificationIdB1A,
  descriptionIdB1B,
  classificationIdB1B,
  subCategoryIdB2,
  descriptionIdB2A,
  classificationIdB2A,
  descriptionIdB2B,
  classificationIdB2B,
}: {
  categoryIdA: number;
  subCategoryIdA1: number;
  descriptionIdA1A: number;
  classificationIdA1A: number;
  descriptionIdA1B: number;
  classificationIdA1B: number;
  subCategoryIdA2: number;
  descriptionIdA2A: number;
  classificationIdA2A: number;
  descriptionIdA2B: number;
  classificationIdA2B: number;
  categoryIdB: number;
  subCategoryIdB1: number;
  descriptionIdB1A: number;
  classificationIdB1A: number;
  descriptionIdB1B: number;
  classificationIdB1B: number;
  subCategoryIdB2: number;
  descriptionIdB2A: number;
  classificationIdB2A: number;
  descriptionIdB2B: number;
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

  await prisma.classifications.delete({ where: { id: classificationIdA1A } });
  await prisma.classificationDescriptions.delete({
    where: { id: descriptionIdA1A },
  });
  await prisma.classifications.delete({ where: { id: classificationIdA1B } });
  await prisma.classificationDescriptions.delete({
    where: { id: descriptionIdA1B },
  });
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

  await prisma.classifications.delete({ where: { id: classificationIdA2A } });
  await prisma.classificationDescriptions.delete({
    where: { id: descriptionIdA2A },
  });
  await prisma.classifications.delete({ where: { id: classificationIdA2B } });
  await prisma.classificationDescriptions.delete({
    where: { id: descriptionIdA2B },
  });
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

  await prisma.classifications.delete({ where: { id: classificationIdB1A } });
  await prisma.classificationDescriptions.delete({
    where: { id: descriptionIdB1A },
  });
  await prisma.classifications.delete({ where: { id: classificationIdB1B } });
  await prisma.classificationDescriptions.delete({
    where: { id: descriptionIdB1B },
  });
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

  await prisma.classifications.delete({ where: { id: classificationIdB2A } });
  await prisma.classificationDescriptions.delete({
    where: { id: descriptionIdB2A },
  });
  await prisma.classifications.delete({ where: { id: classificationIdB2B } });
  await prisma.classificationDescriptions.delete({
    where: { id: descriptionIdB2B },
  });
  await prisma.classificationSubCategories.delete({
    where: { id: subCategoryIdB2 },
  });

  await prisma.classificationCategories.delete({ where: { id: categoryIdB } });
}
