import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { getUserInfo, updateUser } from "../query/user";
import { userIdSchema, userNamesSchema } from "../schemas/userSchemas";
import {
  queryLoggedIn,
  queryOptionalLoggedIn,
} from "../middleware/queryMiddleware";

export const userRouter = express.Router();

userRouter.post(
  "/updateUser",
  requireLoggedIn,
  queryLoggedIn(updateUser, userNamesSchema),
);

userRouter.get("/getUser", queryOptionalLoggedIn(getUserInfo, userIdSchema));
