import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { DateTime } from "luxon";
import {
  copyPublicActivityToPortfolio,
  createActivity,
  deleteActivity,
  findOrCreateUser,
  getAllDoenetmlVersions,
  getActivityEditorData,
  getActivityViewerData,
  getAllRecentPublicActivities,
  getIsAdmin,
  getUserInfo,
  listUserActivities,
  updateDoc,
  searchPublicActivities,
  updateActivity,
  getDoc,
  assignActivity,
  listUserAssignments,
  deleteAssignment,
  getAssignmentEditorData,
  updateAssignment,
  getAssignmentDataFromCode,
  openAssignmentWithCode,
  closeAssignmentWithCode,
  updateUser,
  saveScoreAndState,
  getAssignmentScoreData,
} from "./model";
import { Prisma } from "@prisma/client";

dotenv.config();

const app: Express = express();
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/api/getQuickCheckSignedIn", (req: Request, res: Response) => {
  const signedIn = req.cookies.email ? true : false;
  res.send({ signedIn: signedIn });
});

app.get("/api/getUser", async (req: Request, res: Response) => {
  const signedIn = req.cookies.email ? true : false;
  if (signedIn) {
    let userInfo = await getUserInfo(req.cookies.email);
    res.send(userInfo);
  } else {
    res.send({});
  }
});

app.post("/api/updateUser", async (req: Request, res: Response) => {
  const signedIn = req.cookies.email ? true : false;
  if (signedIn) {
    const body = req.body;
    const name = body.name;
    await updateUser({ userId: Number(req.cookies.userId), name });
    res.cookie("name", name);
    res.send({ name });
  } else {
    res.send({});
  }
});

app.get("/api/checkForCommunityAdmin", async (req: Request, res: Response) => {
  const userEmail = req.cookies.email;
  const isAdmin = await getIsAdmin(userEmail);
  res.send({
    isAdmin,
  });
});

app.get(
  "/api/getAllRecentPublicActivities",
  async (req: Request, res: Response) => {
    const docs = await getAllRecentPublicActivities();
    res.send(docs);
  },
);

app.get(
  "/api/getPortfolio/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const userId = Number(req.params.userId);
    try {
      const activityLists = await listUserActivities(userId, loggedInUserId);
      const allDoenetmlVersions = await getAllDoenetmlVersions();

      res.send({ allDoenetmlVersions, ...activityLists });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(404);
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getPublicPortfolio/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.userId);
    try {
      const activityLists = await listUserActivities(userId, 0);

      res.send(activityLists);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(404);
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getAssignments/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const userId = Number(req.params.userId);
    try {
      const assignmentList = await listUserAssignments(userId, loggedInUserId);

      res.send(assignmentList);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(404);
      } else {
        next(e);
      }
    }
  },
);

app.get("/api/sendSignInEmail", async (req: Request, res: Response) => {
  const email: string = req.query.emailaddress as string;
  // TODO: add the ability to give a name after logging in or creating an account
  const user = await findOrCreateUser(email, email);
  res.cookie("email", email);
  res.cookie("userId", String(user.userId));
  res.cookie("name", String(user.name));
  res.send({});
});

app.post("/api/deleteActivity", async (req: Request, res: Response) => {
  const body = req.body;
  const activityId = Number(body.activityId);
  await deleteActivity(activityId);
  res.send({});
});

app.post("/api/deleteAssignment", async (req: Request, res: Response) => {
  const body = req.body;
  const assignmentId = Number(body.assignmentId);
  await deleteAssignment(assignmentId);
  res.send({});
});

app.post("/api/createActivity", async (req: Request, res: Response) => {
  const loggedInUserId = Number(req.cookies.userId);
  const { activityId, docId } = await createActivity(loggedInUserId);
  res.send({ activityId, docId });
});

app.post("/api/updateActivityName", (req: Request, res: Response) => {
  const body = req.body;
  const activityId = Number(body.activityId);
  const name = body.name;
  updateActivity({ activityId, name });
  res.send({});
});

app.post("/api/updateIsPublicActivity", (req: Request, res: Response) => {
  const body = req.body;
  const activityId = Number(body.activityId);
  const isPublic = body.isPublic;
  updateActivity({ activityId, isPublic });
  res.send({});
});

app.get(
  "/api/loadSupportingFileInfo/:activityId",
  (req: Request, res: Response) => {
    const activityId = Number(req.params.activityId as string);
    res.send({
      success: true,
      supportingFiles: [],
      canUpload: true,
      userQuotaBytesAvailable: 1000000,
      quotaBytes: 9000000,
    });
  },
);

app.get("/api/checkCredentials", (req: Request, res: Response) => {
  const loggedIn = req.cookies.email ? true : false;
  res.send({ loggedIn });
});

app.get(
  "/api/getCoursePermissionsAndSettings",
  (req: Request, res: Response) => {
    res.send({});
  },
);

app.get("/api/searchPublicActivities", async (req: Request, res: Response) => {
  const query = req.query.q as string;
  res.send({
    users: [], // TODO - this
    activities: await searchPublicActivities(query),
  });
});

app.get("/api/loadPromotedContent", (req: Request, res: Response) => {
  res.send({
    success: true,
    carouselData: {},
  });
});

app.get(
  "/api/getActivityEditorData/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    const activityId = Number(req.params.activityId);
    try {
      const editorData = await getActivityEditorData(activityId);
      res.send(editorData);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(404);
      } else {
        next(e);
      }
    }
  },
);

app.get("/api/getAllDoenetmlVersions", async (req: Request, res: Response) => {
  const allDoenetmlVersions = await getAllDoenetmlVersions();

  res.send(allDoenetmlVersions);
});

app.get(
  "/api/getActivityView/:docId",
  async (req: Request, res: Response, next: NextFunction) => {
    const docId = Number(req.params.docId);

    try {
      const viewerData = await getActivityViewerData(docId);
      res.send(viewerData);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(404);
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getAssignmentEditorData/:assignmentId",
  async (req: Request, res: Response, next: NextFunction) => {
    const assignmentId = Number(req.params.assignmentId);
    try {
      const editorData = await getAssignmentEditorData(assignmentId);
      res.send(editorData);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(404);
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getAssignmentDataFromCode/:code",
  async (req: Request, res: Response) => {
    const code = req.params.code;
    const signedIn = req.cookies.email ? true : false;

    let assignmentData = await getAssignmentDataFromCode(code, signedIn);

    let name: string;
    if (assignmentData.newAnonymousUser) {
      const anonymousUser = assignmentData.newAnonymousUser;
      // create a user with random name and email
      res.cookie("email", anonymousUser.email);
      res.cookie("userId", String(anonymousUser.userId));
      res.cookie("name", String(anonymousUser.name));
      name = anonymousUser.name;
    } else {
      name = req.cookies.name;
    }

    res.send({ name, ...assignmentData });
  },
);

app.get("/api/loadPromotedContentGroups", (req: Request, res: Response) => {
  res.send({});
});

app.post("/api/saveDoenetML", (req: Request, res: Response) => {
  const body = req.body;
  const doenetML = body.doenetML;
  const docId = Number(body.docId);
  updateDoc({ docId, content: doenetML });
  res.send({});
});

app.post("/api/updateActivitySettings", (req: Request, res: Response) => {
  const body = req.body;
  const activityId = Number(body.activityId);
  const imagePath = body.imagePath;
  const name = body.name;
  // TODO - deal with learning outcomes
  const learningOutcomes = body.learningOutcomes;
  const isPublic = body.isPublic;
  updateActivity({
    activityId,
    imagePath,
    name,
    isPublic,
  });
  res.send({});
});

app.post("/api/updateDocumentSettings", (req: Request, res: Response) => {
  const body = req.body;
  const docId = Number(body.docId);
  const name = body.name;
  // TODO - deal with learning outcomes
  const learningOutcomes = body.learningOutcomes;
  const doenetmlVersionId = Number(body.doenetmlVersionId);
  updateDoc({
    docId,
    name,
    doenetmlVersionId,
  });
  res.send({});
});

app.post("/api/duplicateActivity", async (req: Request, res: Response) => {
  const targetActivityId = Number(req.body.activityId);
  const loggedInUserId = Number(req.cookies.userId);

  let newActivityId = await copyPublicActivityToPortfolio(
    targetActivityId,
    loggedInUserId,
  );

  res.send({ newActivityId });
});

app.post("/api/assignActivity", async (req: Request, res: Response) => {
  const activityId = Number(req.body.activityId);
  const loggedInUserId = Number(req.cookies.userId);

  let assignmentId = await assignActivity(activityId, loggedInUserId);

  res.send({ assignmentId, userId: loggedInUserId });
});

app.post("/api/updateAssignmentName", (req: Request, res: Response) => {
  const body = req.body;
  const assignmentId = Number(body.assignmentId);
  const name = body.name;
  updateAssignment({ assignmentId, name });
  res.send({});
});

app.post("/api/updateAssignmentSettings", (req: Request, res: Response) => {
  const body = req.body;
  const assignmentId = Number(body.assignmentId);
  const imagePath = body.imagePath;
  const name = body.name;
  updateAssignment({
    assignmentId,
    imagePath,
    name,
  });
  res.send({});
});

app.post("/api/openAssignmentWithCode", async (req: Request, res: Response) => {
  const body = req.body;
  const assignmentId = Number(body.assignmentId);
  const closeAt = DateTime.fromISO(body.closeAt);

  const { classCode, codeValidUntil } = await openAssignmentWithCode(
    assignmentId,
    closeAt,
  );
  res.send({ classCode, codeValidUntil });
});

app.post(
  "/api/closeAssignmentWithCode",
  async (req: Request, res: Response) => {
    const body = req.body;
    const assignmentId = Number(body.assignmentId);

    await closeAssignmentWithCode(assignmentId);
    res.send({});
  },
);

app.post("/api/saveScoreAndState", async (req: Request, res: Response) => {
  const body = req.body;
  const assignmentId = Number(body.assignmentId);
  const docId = Number(body.docId);
  const docVersionId = Number(body.docVersionId);
  const loggedInUserId = Number(req.cookies.userId);
  const score = Number(body.score);
  const state = body.state;

  await saveScoreAndState({
    assignmentId,
    docId,
    docVersionId,
    userId: loggedInUserId,
    score,
    state,
  });
  res.send({});
});

app.get(
  "/api/getAssignmentScoreData/:assignmentId",
  async (req: Request, res: Response, next: NextFunction) => {
    const assignmentId = Number(req.params.assignmentId);
    const loggedInUserId = Number(req.cookies.userId);

    try {
      const assignmentWithData = await getAssignmentScoreData({
        assignmentId,
        ownerId: loggedInUserId,
      });
      res.send(assignmentWithData);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(404);
      } else {
        next(e);
      }
    }
  },
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
