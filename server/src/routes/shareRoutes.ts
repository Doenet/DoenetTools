import express from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import {
  contentIdEmailSchema,
  setLicenseCodeSchema,
  contentIdUserIdSchema,
} from "../schemas/shareSchema";
import {
  makeContentPrivate,
  makeContentPublic,
  setContentLicense,
  shareContentWithEmail,
  unshareContent,
} from "../query/share";
import { contentIdSchema } from "../schemas/contentSchema";
import { queryLoggedIn } from "../middleware/queryMiddleware";

export const shareRouter = express.Router();

shareRouter.use(requireLoggedIn);

shareRouter.post(
  "/setContentLicense",
  queryLoggedIn(setContentLicense, setLicenseCodeSchema),
);

shareRouter.post(
  "/makeContentPublic",
  queryLoggedIn(makeContentPublic, contentIdSchema),
);

shareRouter.post(
  "/makeContentPrivate",
  queryLoggedIn(makeContentPrivate, contentIdSchema),
);

shareRouter.post(
  "/shareContent",
  queryLoggedIn(shareContentWithEmail, contentIdEmailSchema),
);

shareRouter.post(
  "/unshareContent",
  queryLoggedIn(unshareContent, contentIdUserIdSchema),
);
