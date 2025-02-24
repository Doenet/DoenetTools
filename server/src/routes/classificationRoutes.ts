import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import {
  addClassification,
  getClassificationCategories,
  getClassifications,
  removeClassification,
  searchPossibleClassifications,
} from "../query/classification";
import {
  classificationSchema,
  searchPossibleClassificationsSchema,
} from "../schemas/classificationSchema";
import {
  queryLoggedIn,
  queryNoLoggedInNoArguments,
  queryOptionalLoggedIn,
} from "../middleware/queryMiddleware";
import { contentIdSchema } from "../schemas/contentSchema";

export const classificationRouter = express.Router();

classificationRouter.get(
  "/getClassificationCategories",
  queryNoLoggedInNoArguments(getClassificationCategories),
);

classificationRouter.get(
  "/searchPossibleClassifications",
  queryOptionalLoggedIn(
    searchPossibleClassifications,
    searchPossibleClassificationsSchema,
  ),
);

classificationRouter.post(
  "/addClassification",
  requireLoggedIn,
  queryLoggedIn(addClassification, classificationSchema),
);

classificationRouter.post(
  "/removeClassification",
  requireLoggedIn,
  queryLoggedIn(removeClassification, classificationSchema),
);

classificationRouter.post(
  "/getClassifications",
  requireLoggedIn,
  queryLoggedIn(getClassifications, contentIdSchema),
);
