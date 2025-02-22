import express, { Request, Response } from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { loadStateSchema, scoreAndStateSchema } from "../schemas/scoreSchema";
import { loadState, saveScoreAndState } from "../query/scores";
import { handleErrors } from "../errors/routeErrorHandler";
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
  queryNoArguments,
  queryNoLoggedIn,
} from "../middleware/queryMiddleware";
import { contentIdSchema } from "../schemas/contentSchema";

export const classificationRouter = express.Router();

classificationRouter.get(
  "/getClassificationCategories",
  queryNoArguments(getClassificationCategories),
);

classificationRouter.get(
  "/searchPossibleClassifications",
  queryNoLoggedIn(
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
