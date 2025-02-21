import express, { Request, Response } from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { getUserInfo, updateUser } from "../query/user";
import { userNamesSchema } from "../schemas/userSchemas";
import { handleErrors } from "../errors/routeErrorHandler";
import { convertUUID } from "../utils/uuid";

export const userRouter = express.Router();

userRouter.post(
  "/updateUser",
  requireLoggedIn,
  async (req: Request, res: Response) => {
    const loggedInUserId = req.user.userId;

    try {
      const userInfo = userNamesSchema.parse(req.body);
      await updateUser({ userId: loggedInUserId, ...userInfo });
      res.send(userInfo);
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

userRouter.get("/getUser", async (req: Request, res: Response) => {
  if (req.user) {
    try {
      const user = await getUserInfo(req.user.userId);
      res.send({ user: convertUUID(user) });
    } catch (e) {
      handleErrors(res, e);
    }
  } else {
    res.send({});
  }
});
