import express, { Request, Response } from "express";
import { handleErrors } from "../errors/routeErrorHandler";
import { convertUUID, toUUID } from "../utils/uuid";
import { getIsAdmin } from "../query/curate";
import {
  addPromotedContent,
  addPromotedContentGroup,
  deletePromotedContentGroup,
  getAllRecentPublicActivities,
  loadPromotedContent,
  movePromotedContent,
  movePromotedContentGroup,
  removePromotedContent,
  updatePromotedContentGroup,
} from "../query/promoted";
import { requireLoggedIn } from "../middleware/validationMiddleware";

export const oldAdminRouter = express.Router();

oldAdminRouter.get(
  "/checkForCommunityAdmin",
  async (req: Request, res: Response) => {
    if (req.user) {
      const loggedInUserId = req.user.userId;
      try {
        const isAdmin = loggedInUserId
          ? await getIsAdmin(loggedInUserId)
          : false;
        res.send({ isAdmin });
      } catch (e) {
        handleErrors(res, e);
      }
    } else {
      res.send({ isAdmin: false });
    }
  },
);

oldAdminRouter.get(
  "/getAllRecentPublicActivities",
  async (_req: Request, res: Response) => {
    try {
      const activities = await getAllRecentPublicActivities();
      res.send(activities.map(convertUUID));
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

oldAdminRouter.get(
  "/loadPromotedContent",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
      const content = await loadPromotedContent(loggedInUserId);
      const content2 = content.map((c) => ({
        ...c,
        promotedContent: c.promotedContent.map(convertUUID),
      }));
      res.send(content2);
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

oldAdminRouter.post(
  "/removePromotedContent",
  requireLoggedIn,
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const groupId = Number(req.body.groupId);
      const activityId = toUUID(req.body.activityId);

      await removePromotedContent(groupId, activityId, loggedInUserId);
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

oldAdminRouter.post(
  "/movePromotedContent",
  requireLoggedIn,
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const groupId = Number(req.body.groupId);
      const activityId = toUUID(req.body.activityId);
      const desiredPosition = Number(req.body.desiredPosition);

      await movePromotedContent(
        groupId,
        activityId,
        loggedInUserId,
        desiredPosition,
      );
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

oldAdminRouter.post(
  "/addPromotedContentGroup",
  requireLoggedIn,
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const { groupName } = req.body;
      const id = await addPromotedContentGroup(groupName, loggedInUserId);
      res.send({ id });
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

oldAdminRouter.post(
  "/updatePromotedContentGroup",
  requireLoggedIn,
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const { groupId, newGroupName, homepage, currentlyFeatured } = req.body;
      await updatePromotedContentGroup(
        Number(groupId),
        newGroupName,
        homepage,
        currentlyFeatured,
        loggedInUserId,
      );
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

oldAdminRouter.post(
  "/deletePromotedContentGroup",
  requireLoggedIn,
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const { groupId } = req.body;
      await deletePromotedContentGroup(Number(groupId), loggedInUserId);
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

oldAdminRouter.post(
  "/movePromotedContentGroup",
  requireLoggedIn,
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const { groupId, desiredPosition } = req.body;
      await movePromotedContentGroup(
        Number(groupId),
        loggedInUserId,
        Number(desiredPosition),
      );
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);

oldAdminRouter.post(
  "/api/addPromotedContent",
  async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const groupId = req.body.groupId;
      const activityId = toUUID(req.body.activityId);
      await addPromotedContent(groupId, activityId, loggedInUserId);
      res.send({});
    } catch (e) {
      handleErrors(res, e);
    }
  },
);
