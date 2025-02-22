import express, { Request, Response } from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { handleErrors } from "../errors/routeErrorHandler";
import { convertUUID } from "../utils/uuid";
import {
  checkIfContentContains,
  copyContent,
  createContentCopyInChildren,
  moveContent,
} from "../query/copy_move";
import {
  checkIfContentContainsSchema,
  copyContentSchema,
  createContentCopyInChildrenSchema,
  moveContentSchema,
} from "../schemas/copyMoveSchema";

export const copyMoveRouter = express.Router();

copyMoveRouter.use(requireLoggedIn);

copyMoveRouter.post("/api/moveContent", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.userId;
    const moveArgs = moveContentSchema.parse(req.body);
    await moveContent({ loggedInUserId, ...moveArgs });
    res.send();
  } catch (e) {
    handleErrors(res, e);
  }
});

copyMoveRouter.post("/api/copyContent", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.userId;
    const copyArgs = copyContentSchema.parse(req.body);

    const result = await copyContent({ loggedInUserId, ...copyArgs });

    res.send(convertUUID(result));
  } catch (e) {
    handleErrors(res, e);
  }
});

copyMoveRouter.post(
  "/api/createContentCopyInChildren",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const createArgs = createContentCopyInChildrenSchema.parse(req.body);
      const result = await createContentCopyInChildren({
        loggedInUserId,
        ...createArgs,
      });
      res.send(convertUUID(result));
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

copyMoveRouter.get(
  "/api/checkIfContentContains",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;

      const checkArgs = checkIfContentContainsSchema.parse(req.body);
      const result = await checkIfContentContains({
        loggedInUserId,
        ...checkArgs,
      });
      res.send(convertUUID(result));
    } catch (e) {
      handleErrors(res, e);
    }
  },
);
