import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { getUserInfoIfLoggedIn, setIsAuthor, updateUser } from "../query/user";
import { setIsAuthorSchema, userNamesSchema } from "../schemas/userSchemas";
import {
  queryLoggedIn,
  queryOptionalLoggedInNoArguments,
} from "../middleware/queryMiddleware";

export const userRouter = express.Router();

userRouter.post(
  "/updateUser",
  requireLoggedIn,
  queryLoggedIn(updateUser, userNamesSchema),
);

userRouter.get(
  "/getUser",
  queryOptionalLoggedInNoArguments(getUserInfoIfLoggedIn),
);

userRouter.post(
  "/setIsAuthor",
  requireLoggedIn,
  queryLoggedIn(setIsAuthor, setIsAuthorSchema),
);
