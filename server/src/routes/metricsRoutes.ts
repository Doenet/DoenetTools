import express from "express";
import { queryLoggedIn } from "../middleware/queryMiddleware";
import {
  getWeeklyContentCreated,
  getWeeklyContentSharedPublicly,
  getWeeklyUsersJoined,
} from "../query/metrics";
import { z } from "zod";

export const metricsRouter = express.Router();

const metricStartEnd = z.object({
  start: z.date(),
  end: z.date(),
});

metricsRouter.get(
  "/users/joined/weekly",
  queryLoggedIn(getWeeklyUsersJoined, metricStartEnd),
);

metricsRouter.get(
  "/content/created/weekly",
  queryLoggedIn(getWeeklyContentCreated, metricStartEnd),
);

metricsRouter.get(
  "/content/sharedPublicly/weekly",
  queryLoggedIn(getWeeklyContentSharedPublicly, metricStartEnd),
);
