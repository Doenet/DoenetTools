import express from "express";
import {
  getUser,
  getUserInfoIfLoggedIn,
  setIsAuthor,
  updateUser,
} from "../query/user";
import {
  setIsAuthorSchema,
  userIdSchema,
  userNamesSchema,
} from "../schemas/userSchemas";
import {
  queryLoggedIn,
  queryOptionalLoggedIn,
  queryOptionalLoggedInNoArguments,
} from "../middleware/queryMiddleware";

export const userRouter = express.Router();

userRouter.post("/updateUser", queryLoggedIn(updateUser, userNamesSchema));

userRouter.get(
  "/getMyUserInfo",
  queryOptionalLoggedInNoArguments(getUserInfoIfLoggedIn),
);

userRouter.get(
  "/getUser/:userId",
  queryOptionalLoggedIn(getUser, userIdSchema),
);

userRouter.post("/setIsAuthor", queryLoggedIn(setIsAuthor, setIsAuthorSchema));
