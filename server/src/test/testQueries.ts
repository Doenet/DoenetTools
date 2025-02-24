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
  console.log("add classifications by names", { contentId, classifications });
  for (const classification of classifications) {
    console.log("trying code", classification.code);
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

    console.log({ classificationId });
    const hmm = await prisma.contentClassifications.create({
      data: {
        contentId: contentId,
        classificationId,
      },
    });

    console.log(hmm);
  }
}
