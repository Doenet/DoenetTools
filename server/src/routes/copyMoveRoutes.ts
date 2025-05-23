import express from "express";
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
import { queryLoggedIn } from "../middleware/queryMiddleware";

export const copyMoveRouter = express.Router();

copyMoveRouter.post(
  "/moveContent",
  queryLoggedIn(moveContent, moveContentSchema),
);

copyMoveRouter.post(
  "/copyContent",
  queryLoggedIn(copyContent, copyContentSchema),
);

copyMoveRouter.post(
  "/createContentCopyInChildren",
  queryLoggedIn(createContentCopyInChildren, createContentCopyInChildrenSchema),
);

copyMoveRouter.get(
  "/checkIfContentContains",
  queryLoggedIn(checkIfContentContains, checkIfContentContainsSchema),
);
