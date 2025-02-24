import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { loadStateSchema, scoreAndStateSchema } from "../schemas/scoreSchema";
import { loadState, saveScoreAndState } from "../query/scores";
import { queryLoggedIn } from "../middleware/queryMiddleware";

export const scoreRouter = express.Router();

scoreRouter.use(requireLoggedIn);

scoreRouter.post(
  "/saveScoreAndState",
  queryLoggedIn(saveScoreAndState, scoreAndStateSchema),
);

scoreRouter.get("/loadState", queryLoggedIn(loadState, loadStateSchema));
