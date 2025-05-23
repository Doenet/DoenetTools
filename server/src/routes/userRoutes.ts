import express from "express";
import { getUserInfoIfLoggedIn, setIsAuthor, updateUser } from "../query/user";
import { setIsAuthorSchema, userNamesSchema } from "../schemas/userSchemas";
import {
  queryLoggedIn,
  queryOptionalLoggedInNoArguments,
} from "../middleware/queryMiddleware";

export const userRouter = express.Router();

userRouter.post("/updateUser", queryLoggedIn(updateUser, userNamesSchema));

userRouter.get(
  "/getUser",
  queryOptionalLoggedInNoArguments(getUserInfoIfLoggedIn),
);

userRouter.post("/setIsAuthor", queryLoggedIn(setIsAuthor, setIsAuthorSchema));
