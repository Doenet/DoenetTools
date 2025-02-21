import express, { Request, Response } from "express";
import { requireLoggedIn } from "../middleware/validationMiddleware";
import { handleErrors } from "../errors/routeErrorHandler";
import {
  contentCreateSchema,
  contentIdSchema,
  updateContentDoenetMLSchema,
  updateContentFeaturesSchema,
  updateContentSettingsSchema,
} from "../schemas/contentSchema";
import {
  createContent,
  deleteContent,
  updateContent,
  updateContentFeatures,
} from "../query/activity";
import { fromUUID } from "../utils/uuid";

export const updateContentRouter = express.Router();

updateContentRouter.use(requireLoggedIn);

updateContentRouter.post(
  "/deleteContent",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const contentId = contentIdSchema.parse(req.body).contentId;
      await deleteContent(contentId, loggedInUserId);
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

updateContentRouter.post(
  "/createContent/",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const contentCreateInfo = contentCreateSchema.parse(req.body);
      const { contentId } = await createContent({
        loggedInUserId,
        ...contentCreateInfo,
      });
      res.send({ contentId: fromUUID(contentId) });
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

updateContentRouter.post(
  "/updateContentSettings",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const updateContentArgs = updateContentSettingsSchema.parse(req.body);
      await updateContent({ loggedInUserId, ...updateContentArgs });
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

updateContentRouter.post(
  "/updateContentFeatures",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const updateContentFeaturesArgs = updateContentFeaturesSchema.parse(
        req.body,
      );
      await updateContentFeatures({
        loggedInUserId,
        ...updateContentFeaturesArgs,
      });
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

updateContentRouter.post(
  "/saveDoenetML",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const updateContentDoenetMLArgs = updateContentDoenetMLSchema.parse(
        req.body,
      );
      await updateContent({ loggedInUserId, ...updateContentDoenetMLArgs });
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);
