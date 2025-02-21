import express, { Request, Response } from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { handleErrors } from "../errors/routeErrorHandler";
import {
  contentIdEmailSchema,
  setLicenseCodeSchema,
  contentIdUserIdSchema,
} from "../schemas/shareSchema";
import {
  modifyContentSharedWith,
  setContentIsPublic,
  setContentLicense,
  shareContentWithEmail,
} from "../query/share";
import { contentIdSchema } from "../schemas/contentSchema";

export const shareRouter = express.Router();

shareRouter.use(requireLoggedIn);

shareRouter.post("/setContentLicense", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.userId;
    const licenseCodeArgs = setLicenseCodeSchema.parse(req.body);

    await setContentLicense({ loggedInUserId, ...licenseCodeArgs });
    res.send({});
  } catch (e) {
    handleErrors(res, e);
  }
});

shareRouter.post("/makeContentPublic", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.userId;
    const contentId = contentIdSchema.parse(req.body).contentId;
    await setContentIsPublic({
      loggedInUserId,
      contentId,
      isPublic: true,
    });
    res.send({});
  } catch (e) {
    handleErrors(res, e);
  }
});

shareRouter.post("/makeContentPrivate", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.userId;
    const contentId = contentIdSchema.parse(req.body).contentId;
    await setContentIsPublic({
      loggedInUserId,
      contentId,
      isPublic: false,
    });
    res.send({});
  } catch (e) {
    handleErrors(res, e);
  }
});

shareRouter.post("/shareContent", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.userId;
    const shareArgs = contentIdEmailSchema.parse(req.body);
    await shareContentWithEmail({ loggedInUserId, ...shareArgs });
    res.send({});
  } catch (e) {
    handleErrors(res, e);
  }
});

shareRouter.post("/unshareContent", async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.userId;
    const shareArgs = contentIdUserIdSchema.parse(req.body);
    await modifyContentSharedWith({
      action: "unshare",
      contentId: shareArgs.contentId,
      loggedInUserId,
      users: [shareArgs.userId],
    });
    res.send({});
  } catch (e) {
    handleErrors(res, e);
  }
});
