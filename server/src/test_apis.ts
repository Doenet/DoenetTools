import { Express, NextFunction, Request, Response } from "express";
import { prisma } from "./model";
import { toUUID } from "./utils/uuid";

type ClassificationByNames = {
  systemShortName: string;
  category: string;
  subCategory: string;
  code: string;
};

export function add_test_apis(app: Express) {
  app.post(
    "/api/test/addClassificationsByNames",
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const classificationsByNames =
        body.classifications as ClassificationByNames[];
      const activityId = toUUID(body.id);

      try {
        for (const classification of classificationsByNames) {
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
              contentId: activityId,
              classificationId,
            },
          });
        }
        res.send({});
      } catch (e) {
        next(e);
      }
    },
  );
}
