import { prisma } from "../model";

type ClassificationByNames = {
  systemShortName: string;
  category: string;
  subCategory: string;
  code: string;
};

export async function addClassificationsByNames({
  contentId,
  classifications,
}: {
  contentId: Uint8Array;
  classifications: ClassificationByNames[];
}) {
  for (const classification of classifications) {
    const classificationId = (
      await prisma.classifications.findFirstOrThrow({
        select: {
          id: true,
        },
        where: {
          code: classification.code,
          descriptions: {
            some: {
              subCategory: {
                subCategory: classification.subCategory,
                category: {
                  category: classification.category,
                  system: {
                    shortName: classification.systemShortName,
                  },
                },
              },
            },
          },
        },
      })
    ).id;

    await prisma.contentClassifications.create({
      data: {
        contentId: contentId,
        classificationId,
      },
    });
  }
}
