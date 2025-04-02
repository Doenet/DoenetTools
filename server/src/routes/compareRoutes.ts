import express from "express";
import { queryLoggedIn } from "../middleware/queryMiddleware";
import { getDoenetMLComparison } from "../query/compare";
import { getDoenetMLComparisonSchema } from "../schemas/compareSchema";
import { requireLoggedIn } from "../middleware/validationMiddleware";

export const compareRouter = express.Router();

compareRouter.use(requireLoggedIn);

compareRouter.get(
  "/getDoenetMLComparison/:contentId/:compareId",
  queryLoggedIn(getDoenetMLComparison, getDoenetMLComparisonSchema),
);
