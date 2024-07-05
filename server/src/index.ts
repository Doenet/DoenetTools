import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { DateTime } from "luxon";
import {
  copyActivityToFolder,
  createActivity,
  createFolder,
  deleteActivity,
  deleteFolder,
  findOrCreateUser,
  getAllDoenetmlVersions,
  getActivityEditorData,
  getActivityViewerData,
  getAllRecentPublicActivities,
  getIsAdmin,
  getUserInfo,
  updateDoc,
  searchPublicContent,
  updateContent,
  getDoc,
  assignActivity,
  listUserAssigned,
  getAssignmentDataFromCode,
  openAssignmentWithCode,
  closeAssignmentWithCode,
  updateUser,
  saveScoreAndState,
  getAssignmentScoreData,
  loadState,
  getAssignmentStudentData,
  getAllAssignmentScores,
  getStudentData,
  recordSubmittedEvent,
  getAnswersThatHaveSubmittedResponses,
  getDocumentSubmittedResponses,
  getAssignment,
  getAssignmentContent,
  getDocumentSubmittedResponseHistory,
  moveContent,
  getFolderContent,
} from "./model";
import { Prisma } from "@prisma/client";

dotenv.config();

const app: Express = express();
app.use(cookieParser());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);

const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/api/getQuickCheckSignedIn", (req: Request, res: Response) => {
  const signedIn = req.cookies.email ? true : false;
  res.send({ signedIn: signedIn });
});

app.get(
  "/api/getUser",
  async (req: Request, res: Response, next: NextFunction) => {
    const signedIn = req.cookies.email ? true : false;
    if (signedIn) {
      try {
        let userInfo = await getUserInfo(req.cookies.email);
        res.send(userInfo);
      } catch (e) {
        next(e);
      }
    } else {
      res.send({});
    }
  },
);

app.post("/api/updateUser", async (req: Request, res: Response) => {
  const signedIn = req.cookies.email ? true : false;
  if (signedIn) {
    const loggedInUserId = Number(req.cookies.userId);
    const body = req.body;
    const name = body.name;
    await updateUser({ userId: loggedInUserId, name });
    res.cookie("name", name);
    res.send({ name });
  } else {
    res.send({});
  }
});

app.get("/api/checkForCommunityAdmin", async (req: Request, res: Response) => {
  const loggedInUserId = Number(req.cookies.userId);
  const isAdmin = await getIsAdmin(loggedInUserId);
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
  "/api/getContent/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const userId = Number(req.params.userId);
    try {
      const contentData = await getFolderContent({
        ownerId: userId,
        loggedInUserId,
        folderId: null,
      });
      const allDoenetmlVersions = await getAllDoenetmlVersions();
      res.send({ allDoenetmlVersions, ...contentData });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(404).send("No content found");
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getContent/:userId/:folderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const folderId = Number(req.params.folderId);
    const userId = Number(req.params.userId);
    try {
      const contentData = await getFolderContent({
        ownerId: userId,
        loggedInUserId,
        folderId,
      });
      const allDoenetmlVersions = await getAllDoenetmlVersions();
      res.send({ allDoenetmlVersions, ...contentData });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(404).send("No content found");
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getPublicContent/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.userId);
    try {
      // send 0 as the logged in content to make sure get only public content
      const contentData = await getFolderContent({
        ownerId: userId,
        loggedInUserId: 0,
        folderId: null,
      });
      res.send(contentData);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(404).send("No content found");
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getPublicContent/:userId/:folderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.userId);
    const folderId = Number(req.params.folderId);
    try {
      // send 0 as the logged in content to make sure get only public content
      const contentData = await getFolderContent({
        ownerId: userId,
        loggedInUserId: 0,
        folderId,
      });
      res.send(contentData);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(404).send("No content found");
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getAssigned",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    try {
      const assignedData = await listUserAssigned(loggedInUserId, null);
      res.send(assignedData);
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
  "/api/getAssigned/:folderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const folderId = Number(req.params.folderId);
    try {
      const assignedData = await listUserAssigned(loggedInUserId, folderId);
      res.send(assignedData);
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

app.post(
  "/api/deleteActivity",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const body = req.body;
    const activityId = Number(body.activityId);
    try {
      await deleteActivity(activityId, loggedInUserId);
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(403);
      } else {
        next(e);
      }
    }
  },
);

app.post(
  "/api/deleteFolder",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const body = req.body;
    const folderId = Number(body.folderId);
    try {
      await deleteFolder(folderId, loggedInUserId);
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(403);
      } else {
        next(e);
      }
    }
  },
);

app.post("/api/createActivity", async (req: Request, res: Response) => {
  const loggedInUserId = Number(req.cookies.userId);
  const { activityId, docId } = await createActivity(loggedInUserId, null);
  res.send({ activityId, docId });
});

app.post(
  "/api/createActivity/:parentFolderId",
  async (req: Request, res: Response) => {
    const loggedInUserId = Number(req.cookies.userId);
    const parentFolderId = Number(req.params.parentFolderId);
    const { activityId, docId } = await createActivity(
      loggedInUserId,
      parentFolderId,
    );
    res.send({ activityId, docId });
  },
);

app.post("/api/createFolder", async (req: Request, res: Response) => {
  const loggedInUserId = Number(req.cookies.userId);
  const { folderId } = await createFolder(loggedInUserId, null);
  res.send({ folderId });
});

app.post(
  "/api/createFolder/:parentFolderId",
  async (req: Request, res: Response) => {
    const loggedInUserId = Number(req.cookies.userId);
    const parentFolderId = Number(req.params.parentFolderId);
    const { folderId } = await createFolder(loggedInUserId, parentFolderId);
    res.send({ folderId });
  },
);

app.post(
  "/api/updateContentName",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const body = req.body;
    const id = Number(body.id);
    const name = body.name;
    try {
      await updateContent({ id, name, ownerId: loggedInUserId });
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(403);
      } else {
        next(e);
      }
    }
  },
);

app.post(
  "/api/updateIsPublicContent",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const body = req.body;
    const id = Number(body.id);
    const isPublic = body.isPublic;
    try {
      await updateContent({ id, isPublic, ownerId: loggedInUserId });
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(403);
      } else {
        next(e);
      }
    }
  },
);

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

app.get("/api/searchPublicContent", async (req: Request, res: Response) => {
  const query = req.query.q as string;
  res.send({
    users: [], // TODO - this
    content: await searchPublicContent(query),
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
    const loggedInUserId = Number(req.cookies.userId);
    try {
      const editorData = await getActivityEditorData(
        activityId,
        loggedInUserId,
      );
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
  "/api/getActivityView/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const activityId = Number(req.params.activityId);

    try {
      const viewerData = await getActivityViewerData(
        activityId,
        loggedInUserId,
      );
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

app.post(
  "/api/saveDoenetML",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const body = req.body;
    const doenetML = body.doenetML;
    const docId = Number(body.docId);
    try {
      await updateDoc({
        id: docId,
        source: doenetML,
        ownerId: loggedInUserId,
      });
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(403);
      } else {
        next(e);
      }
    }
  },
);

app.post(
  "/api/updateContentSettings",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const body = req.body;
    const id = Number(body.id);
    const imagePath = body.imagePath;
    const name = body.name;
    // TODO - deal with learning outcomes
    const learningOutcomes = body.learningOutcomes;
    const isPublic = body.isPublic;
    try {
      await updateContent({
        id,
        imagePath,
        name,
        isPublic,
        ownerId: loggedInUserId,
      });
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(403);
      } else {
        next(e);
      }
    }
  },
);

app.post(
  "/api/updateDocumentSettings",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const body = req.body;
    const docId = Number(body.docId);
    const name = body.name;
    // TODO - deal with learning outcomes
    const learningOutcomes = body.learningOutcomes;
    const doenetmlVersionId = Number(body.doenetmlVersionId);
    try {
      await updateDoc({
        id: docId,
        name,
        doenetmlVersionId,
        ownerId: loggedInUserId,
      });
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(403);
      } else {
        next(e);
      }
    }
  },
);

app.post("/api/moveContent", async (req: Request, res: Response) => {
  const id = Number(req.body.id);
  const desiredParentFolderId = req.body.desiredParentFolderId
    ? Number(req.body.desiredParentFolderId)
    : null;
  const desiredPosition = Number(req.body.desiredPosition);
  const loggedInUserId = Number(req.cookies.userId);

  await moveContent({
    id,
    desiredParentFolderId,
    desiredPosition,
    ownerId: loggedInUserId,
  });

  res.send({});
});

app.post("/api/duplicateActivity", async (req: Request, res: Response) => {
  const targetActivityId = Number(req.body.activityId);
  const desiredParentFolderId = req.body.desiredParentFolderId
    ? Number(req.body.desiredParentFolderId)
    : null;
  const loggedInUserId = Number(req.cookies.userId);

  let newActivityId = await copyActivityToFolder(
    targetActivityId,
    loggedInUserId,
    desiredParentFolderId,
  );

  res.send({ newActivityId });
});

app.post("/api/assignActivity", async (req: Request, res: Response) => {
  const activityId = Number(req.body.activityId);
  const loggedInUserId = Number(req.cookies.userId);

  await assignActivity(activityId, loggedInUserId);

  res.send({ userId: loggedInUserId });
});

app.post(
  "/api/openAssignmentWithCode",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const body = req.body;
    const activityId = Number(body.activityId);
    const closeAt = DateTime.fromISO(body.closeAt);

    try {
      const { classCode, codeValidUntil } = await openAssignmentWithCode(
        activityId,
        closeAt,
        loggedInUserId,
      );
      res.send({ classCode, codeValidUntil });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(403);
      } else {
        next(e);
      }
    }
  },
);

app.post(
  "/api/closeAssignmentWithCode",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const body = req.body;
    const activityId = Number(body.activityId);

    try {
      await closeAssignmentWithCode(activityId, loggedInUserId);
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(403);
      } else {
        next(e);
      }
    }
  },
);

app.post(
  "/api/saveScoreAndState",
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const activityId = Number(body.activityId);
    const docId = Number(body.docId);
    const docVersionNum = Number(body.docVersionNum);
    const loggedInUserId = Number(req.cookies.userId);
    const score = Number(body.score);
    const onSubmission = body.onSubmission as boolean;
    const state = body.state;

    try {
      await saveScoreAndState({
        activityId,
        docId,
        docVersionNum,
        userId: loggedInUserId,
        score,
        onSubmission,
        state,
      });
      res.send({});
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientValidationError ||
        e instanceof Prisma.PrismaClientKnownRequestError
      ) {
        res.status(400).send({});
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/loadState",
  async (req: Request, res: Response, next: NextFunction) => {
    const activityId = Number(req.query.activityId);
    const docId = Number(req.query.docId);
    const docVersionNum = Number(req.query.docVersionNum);
    const requestedUserId = Number(req.query.userId || req.cookies.userId);
    const loggedInUserId = Number(req.cookies.userId);
    const withMaxScore = req.query.withMaxScore === "1";

    try {
      const state = await loadState({
        activityId,
        docId,
        docVersionNum,
        requestedUserId,
        userId: loggedInUserId,
        withMaxScore,
      });
      res.send({ state });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(204).send({});
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getAssignmentData/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    const activityId = Number(req.params.activityId);
    const loggedInUserId = Number(req.cookies.userId);

    try {
      const assignmentData = await getAssignmentScoreData({
        activityId,
        ownerId: loggedInUserId,
      });
      const answerList = await getAnswersThatHaveSubmittedResponses({
        activityId,
        ownerId: loggedInUserId,
      });
      const assignmentContent = await getAssignmentContent({
        activityId,
        ownerId: loggedInUserId,
      });
      res.send({ assignmentData, answerList, assignmentContent });
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
  "/api/getAssignmentStudentData/:activityId/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const activityId = Number(req.params.activityId);
    const userId = Number(req.params.userId);
    const loggedInUserId = Number(req.cookies.userId);

    try {
      const assignmentData = await getAssignmentStudentData({
        activityId,
        ownerId: loggedInUserId,
        userId,
      });
      res.send(assignmentData);
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
  "/api/getAllAssignmentScores",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);

    try {
      const data = await getAllAssignmentScores({
        ownerId: loggedInUserId,
        parentFolderId: null,
      });
      res.send(data);
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
  "/api/getAllAssignmentScores/:parentFolderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.cookies.userId);
    const parentFolderId = Number(req.params.parentFolderId);

    try {
      const data = await getAllAssignmentScores({
        ownerId: loggedInUserId,
        parentFolderId,
      });
      res.send(data);
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
  "/api/getStudentData/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.userId);
    const loggedInUserId = Number(req.cookies.userId);

    try {
      const data = await getStudentData({
        userId: userId,
        ownerId: loggedInUserId,
        parentFolderId: null,
      });
      res.send(data);
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
  "/api/getStudentData/:userId/:parentFolderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.userId);
    const loggedInUserId = Number(req.cookies.userId);
    const parentFolderId = Number(req.params.parentFolderId);

    try {
      const data = await getStudentData({
        userId: userId,
        ownerId: loggedInUserId,
        parentFolderId,
      });
      res.send(data);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(404);
      } else {
        next(e);
      }
    }
  },
);

app.post(
  "/api/recordSubmittedEvent",
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const activityId = Number(body.activityId);
    const docId = Number(body.docId);
    const docVersionNum = Number(body.docVersionNum);
    const answerId = body.answerId as string;
    const loggedInUserId = Number(req.cookies.userId);
    const response = body.result.response as string;
    const itemNumber = Number(body.result.itemNumber);
    const creditAchieved = Number(body.result.creditAchieved);
    const itemCreditAchieved = Number(body.result.itemCreditAchieved);
    const documentCreditAchieved = Number(body.result.documentCreditAchieved);
    const answerNumber = body.answerNumber
      ? Number(body.answerNumber)
      : undefined;

    try {
      await recordSubmittedEvent({
        activityId,
        docId,
        docVersionNum,
        userId: loggedInUserId,
        answerId,
        answerNumber,
        response,
        itemNumber,
        creditAchieved,
        itemCreditAchieved,
        documentCreditAchieved,
      });
      res.send({});
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientValidationError ||
        e instanceof Prisma.PrismaClientKnownRequestError
      ) {
        res.status(400).send({});
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getSubmittedResponses/:activityId/:docId/:docVersionNum",
  async (req: Request, res: Response, next: NextFunction) => {
    const activityId = Number(req.params.activityId);
    const docId = Number(req.params.docId);
    const docVersionNum = Number(req.params.docVersionNum);
    const answerId = req.query.answerId as string;
    const loggedInUserId = Number(req.cookies.userId);

    try {
      const assignment = await getAssignment(activityId, loggedInUserId);
      const submittedResponses = await getDocumentSubmittedResponses({
        activityId,
        docId,
        docVersionNum,
        answerId,
        ownerId: loggedInUserId,
      });
      res.send({ assignment, submittedResponses });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(204);
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getSubmittedResponseHistory/:activityId/:docId/:docVersionNum/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const activityId = Number(req.params.activityId);
    const docId = Number(req.params.docId);
    const docVersionNum = Number(req.params.docVersionNum);
    const userId = Number(req.params.userId);
    const answerId = req.query.answerId as string;
    const loggedInUserId = Number(req.cookies.userId);

    try {
      const assignment = await getAssignment(activityId, loggedInUserId);
      const submittedResponses = await getDocumentSubmittedResponseHistory({
        activityId,
        docId,
        docVersionNum,
        answerId,
        userId,
        ownerId: loggedInUserId,
      });
      res.send({ assignment, submittedResponses });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(204);
      } else {
        next(e);
      }
    }
  },
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
