import express, { Request, Response } from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { loadStateSchema, scoreAndStateSchema } from "../schemas/scoreSchema";
import { loadState, saveScoreAndState } from "../query/scores";
import { handleErrors } from "../errors/routeErrorHandler";

export const scoreRouter = express.Router();

scoreRouter.use(requireLoggedIn);

scoreRouter.post("/saveScoreAndState", async (req: Request, res: Response) => {
  const loggedInUserId = req.user.userId;
  try {
    const scoreStateInfo = scoreAndStateSchema.parse(req.body);
    await saveScoreAndState({ loggedInUserId, ...scoreStateInfo });
    res.send({});
  } catch (e) {
    handleErrors(res, e);
  }
});

scoreRouter.get("/loadState", async (req: Request, res: Response) => {
  const loggedInUserId = req.user.userId;
  try {
    const params = loadStateSchema.parse(req.body);
    await loadState({ loggedInUserId, ...params });
    res.send({});
  } catch (e) {
    handleErrors(res, e);
  }
});
