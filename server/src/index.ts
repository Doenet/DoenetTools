import express, { Express, NextFunction, Request, Response } from "express";
import * as path from "path";
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
  getAssignmentContent,
  getDocumentSubmittedResponseHistory,
  addPromotedContentGroup,
  addPromotedContent,
  updatePromotedContentGroup,
  loadPromotedContent,
  removePromotedContent,
  deletePromotedContentGroup,
  movePromotedContent,
  movePromotedContentGroup,
  InvalidRequestError,
  moveContent,
  getMyFolderContent,
  getAssignedScores,
  getPublicFolderContent,
  searchUsersWithPublicContent,
  getPublicEditorData,
} from "./model";
import { Prisma } from "@prisma/client";

import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';

dotenv.config();

interface User {
  userId: Number;
  firstNames: string;
  lastNames: string;
  email: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}


const app: Express = express();
app.use(cookieParser());

const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

passport.use(new GoogleStrategy({
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: (process.env.LOGIN_CALLBACK_ROOT || '') + 'api/login/google',
  scope: [ 'profile', 'email' ]
},
                                (accessToken : any, refreshToken : any, profile : any, done : any) => {
                                  done(null, profile);
                                }));

passport.serializeUser<any, any>(async (req, user : any, done) => {

  var email = user.id + "@google.com";
  if (user.emails[0].verified)
    email = user.emails[0].value;
  
  const u = await findOrCreateUser({
    email,
    firstNames: user.name.givenName,
    lastNames: user.name.familyName
  });

  done(undefined, u.email);
});

passport.deserializeUser(async (id : string, done) => {
  const u = await getUserInfo(id);
  done(null, u);
});

// TODO: this will need to be configured to use Redis or something else
app.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);

app.use (passport.initialize());
app.use (passport.session());

const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server" + JSON.stringify(req?.user));
});

app.get('/api/auth/google',
	passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/login/google',
        passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' })
       );

app.get('/api/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.get("/api/getQuickCheckSignedIn", (req: Request, res: Response) => {
  const signedIn = req.user ? true : false;
  res.send({ signedIn: signedIn });
});

app.get(
  "/api/getUser",
  async (req: Request, res: Response, next: NextFunction) => {
    const signedIn = req.user.email ? true : false;
    if (signedIn) {
      try {
        let userInfo = await getUserInfo(req.user.email);
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
  const signedIn = req.user.email ? true : false;
  if (signedIn) {
    const loggedInUserId = Number(req.user.userId);
    const body = req.body;
    const firstNames = body.firstNames;
    const lastNames = body.lastNames;
    await updateUser({ userId: loggedInUserId, firstNames, lastNames });
    res.cookie("firstNames", firstNames);
    res.cookie("lastNames", lastNames);
    res.send({ firstNames, lastNames });
  } else {
    res.send({});
  }
});

app.get("/api/checkForCommunityAdmin", async (req: Request, res: Response) => {
  const loggedInUserId = Number(req.user.userId);
  const isAdmin = loggedInUserId ? await getIsAdmin(loggedInUserId) : false;
  res.send({ isAdmin });
});

app.get(
  "/api/getAllRecentPublicActivities",
  async (req: Request, res: Response) => {
    const docs = await getAllRecentPublicActivities();
    res.send(docs);
  },
);

app.get(
  "/api/getAssigned",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.user.userId);
    try {
      const assignedData = await listUserAssigned(loggedInUserId);
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
  "/api/getAssignedScores",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.user.userId);
    try {
      const scoreData = await getAssignedScores(loggedInUserId);
      res.send(scoreData);
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
  const user = await findOrCreateUser({
    email,
    firstNames: null,
    lastNames: "",
  });
  res.cookie("email", email);
  res.cookie("userId", String(user.userId));
  res.cookie("firstNames", String(user.firstNames));
  res.cookie("lastNames", String(user.lastNames));
  res.send({});
});

app.post(
  "/api/deleteActivity",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.user.userId);
    const body = req.body;
    const id = Number(body.activityId);
    try {
      await deleteActivity(id, loggedInUserId);
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
    const loggedInUserId = Number(req.user.userId);
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

app.post(
  "/api/createActivity/",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.user.userId);
    try {
      const { activityId, docId } = await createActivity(loggedInUserId, null);
      res.send({ activityId, docId });
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/createActivity/:parentFolderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.user.userId);
    const parentFolderId = Number(req.params.parentFolderId);
    try {
      const { activityId, docId } = await createActivity(
        loggedInUserId,
        parentFolderId,
      );
      res.send({ activityId, docId });
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/createFolder/",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.user.userId);
    try {
      const { folderId } = await createFolder(loggedInUserId, null);
      res.send({ folderId });
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/createFolder/:parentFolderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.user.userId);
    const parentFolderId = Number(req.params.parentFolderId);
    try {
      const { folderId } = await createFolder(loggedInUserId, parentFolderId);
      res.send({ folderId });
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/updateContentName",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.user.userId);
    const body = req.body;
    const id = Number(body.id);
    const name = body.name;
    try {
      await updateContent({ id, name, ownerId: loggedInUserId });
      res.send({});
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
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
    const loggedInUserId = Number(req.user.userId);
    const body = req.body;
    const id = Number(body.id);
    const isPublic = Boolean(body.isPublic);
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
  const loggedIn = req.user.email ? true : false;
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
    users: await searchUsersWithPublicContent(query),
    content: await searchPublicContent(query),
  });
});

app.post(
  "/api/addPromotedContent",
  async (req: Request, res: Response, next: NextFunction) => {
    const { groupId, activityId } = req.body;
    const loggedInUserId = Number(req.user.userId);
    try {
      await addPromotedContent(groupId, activityId, loggedInUserId);
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2002") {
          res.status(400).send("This activity is already in that group.");
          return;
        } else if (e.code === "P2003") {
          res.status(400).send("That group does not exist.");
          return;
        }
      } else if (e instanceof InvalidRequestError) {
        res.status(e.errorCode).send(e.message);
        return;
      }
      next(e);
    }
  },
);

app.get(
  "/api/loadPromotedContent",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
	const loggedInUserId = Number(req.user.userId);
	const content = await loadPromotedContent(loggedInUserId);
	res.send(content);
      } else {
	const content = await loadPromotedContent(0);
	res.send(content);
      }
    } catch (e) {
      if (e instanceof InvalidRequestError) {
        res.status(e.errorCode).send(e.message);
        return;
      }
      next(e);
    }
  },
);

app.post(
  "/api/removePromotedContent",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groupId = Number(req.body.groupId);
      const activityId = Number(req.body.activityId);
      const loggedInUserId = Number(req.user.userId);

      await removePromotedContent(groupId, activityId, loggedInUserId);
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") {
          res.status(400).send("That group does not exist.");
          return;
        }
      } else if (e instanceof InvalidRequestError) {
        res.status(e.errorCode).send(e.message);
        return;
      }
      next(e);
    }
  },
);

app.post(
  "/api/movePromotedContent",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groupId = Number(req.body.groupId);
      const activityId = Number(req.body.activityId);
      const desiredPosition = Number(req.body.desiredPosition);
      const loggedInUserId = Number(req.user.userId);

      await movePromotedContent(
        groupId,
        activityId,
        loggedInUserId,
        desiredPosition,
      );
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") {
          res.status(400).send("That group does not exist.");
          return;
        }
      } else if (e instanceof InvalidRequestError) {
        res.status(e.errorCode).send(e.message);
        return;
      }
      next(e);
    }
  },
);

app.post(
  "/api/addPromotedContentGroup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { groupName } = req.body;
      const loggedInUserId = Number(req.user.userId);
      const id = await addPromotedContentGroup(groupName, loggedInUserId);
      res.send({ id });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2002") {
          res.status(400).send("A group with that name already exists.");
          return;
        }
      } else if (e instanceof InvalidRequestError) {
        res.status(e.errorCode).send(e.message);
        return;
      }
      next(e);
    }
  },
);

app.post(
  "/api/updatePromotedContentGroup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { groupId, newGroupName, homepage, currentlyFeatured } = req.body;
    const loggedInUserId = Number(req.user.userId);
    try {
      await updatePromotedContentGroup(
        Number(groupId),
        newGroupName,
        homepage,
        currentlyFeatured,
        loggedInUserId,
      );
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2002") {
          res.status(400).send("A group with that name already exists.");
          return;
        }
      } else if (e instanceof InvalidRequestError) {
        res.status(e.errorCode).send(e.message);
        return;
      }
      next(e);
    }
  },
);

app.post(
  "/api/deletePromotedContentGroup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { groupId } = req.body;
      const loggedInUserId = Number(req.user.userId);
      await deletePromotedContentGroup(Number(groupId), loggedInUserId);
      res.send({});
    } catch (e) {
      if (e instanceof InvalidRequestError) {
        res.status(e.errorCode).send(e.message);
        return;
      }
      next(e);
    }
  },
);

app.post(
  "/api/movePromotedContentGroup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { groupId, desiredPosition } = req.body;
      const loggedInUserId = Number(req.user.userId);
      await movePromotedContentGroup(
        Number(groupId),
        loggedInUserId,
        Number(desiredPosition),
      );
      res.send({});
    } catch (e) {
      if (e instanceof InvalidRequestError) {
        res.status(e.errorCode).send(e.message);
        return;
      }
      next(e);
    }
  },
);

app.get(
  "/api/getActivityEditorData/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    const activityId = Number(req.params.activityId);
    const loggedInUserId = Number(req.user.userId);
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

app.get(
  "/api/getPublicEditorData/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    const activityId = Number(req.params.activityId);
    try {
      const editorData = await getPublicEditorData(activityId);
      res.send(editorData);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2001"
      ) {
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
    const loggedInUserId = req.user.userId ? Number(req.user.userId) : 0;
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
    const signedIn = req.user.email ? true : false;

    let assignmentData = await getAssignmentDataFromCode(code, signedIn);

    let firstNames: string | null;
    let lastNames: string;
    if (assignmentData.newAnonymousUser) {
      const anonymousUser = assignmentData.newAnonymousUser;
      // create a user with random name and email
      res.cookie("email", anonymousUser.email);
      res.cookie("userId", String(anonymousUser.userId));
      res.cookie("firstNames", String(anonymousUser.firstNames));
      res.cookie("lastNames", String(anonymousUser.lastNames));
      firstNames = anonymousUser.firstNames;
      lastNames = anonymousUser.lastNames;
    } else {
      firstNames = req.user.firstNames;
      lastNames = req.user.lastNames;
    }

    res.send({ student: { firstNames, lastNames }, ...assignmentData });
  },
);

app.post(
  "/api/saveDoenetML",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.user.userId);
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
    const loggedInUserId = Number(req.user.userId);
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
    const loggedInUserId = Number(req.user.userId);
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
  const loggedInUserId = Number(req.user.userId);

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
  const loggedInUserId = Number(req.user.userId);

  let newActivityId = await copyActivityToFolder(
    targetActivityId,
    loggedInUserId,
    desiredParentFolderId,
  );

  res.send({ newActivityId });
});

app.post("/api/assignActivity", async (req: Request, res: Response) => {
  const activityId = Number(req.body.id);
  const loggedInUserId = Number(req.user.userId);

  await assignActivity(activityId, loggedInUserId);

  res.send({ userId: loggedInUserId });
});

app.post(
  "/api/openAssignmentWithCode",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.user.userId);
    const body = req.body;
    const activityId = Number(body.assignmentId);
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
    const loggedInUserId = Number(req.user.userId);
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
    const loggedInUserId = Number(req.user.userId);
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
    const requestedUserId = Number(req.query.userId || req.user.userId);
    const loggedInUserId = Number(req.user.userId);
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
    const loggedInUserId = Number(req.user.userId);

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
  "/api/getAssignmentStudentData/:activityId/",
  async (req: Request, res: Response, next: NextFunction) => {
    const activityId = Number(req.params.activityId);
    const loggedInUserId = Number(req.user.userId);

    try {
      const assignmentData = await getAssignmentStudentData({
        activityId,
        loggedInUserId,
        studentId: loggedInUserId,
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
  "/api/getAssignmentStudentData/:activityId/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    const activityId = Number(req.params.activityId);
    const userId = Number(req.params.userId);
    const loggedInUserId = Number(req.user.userId);

    try {
      const assignmentData = await getAssignmentStudentData({
        activityId,
        loggedInUserId,
        studentId: userId,
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
  "/api/getAllAssignmentScores/",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = Number(req.user.userId);

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
    const folderId = Number(req.params.parentFolderId);
    const loggedInUserId = Number(req.user.userId);

    try {
      const data = await getAllAssignmentScores({
        ownerId: loggedInUserId,
        parentFolderId: folderId,
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
    const loggedInUserId = Number(req.user.userId);

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
    const loggedInUserId = Number(req.user.userId);
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
    const loggedInUserId = Number(req.user.userId);
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
    const loggedInUserId = Number(req.user.userId);

    try {
      const responseData = await getDocumentSubmittedResponses({
        activityId,
        docId,
        docVersionNum,
        answerId,
        ownerId: loggedInUserId,
      });
      res.send(responseData);
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
    const loggedInUserId = Number(req.user.userId);

    try {
      const responseData = await getDocumentSubmittedResponseHistory({
        activityId,
        docId,
        docVersionNum,
        answerId,
        userId,
        ownerId: loggedInUserId,
      });
      res.send(responseData);
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
  "/api/getMyFolderContent/",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user.userId ? Number(req.user.userId) : 0;

    try {
      const contentData = await getMyFolderContent({
        folderId: null,
        loggedInUserId,
      });

      const allDoenetmlVersions = await getAllDoenetmlVersions();
      res.send({ allDoenetmlVersions, ...contentData });
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
  "/api/getMyFolderContent/:folderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const folderId = Number(req.params.folderId);
    const loggedInUserId = Number(req.user.userId);

    try {
      const contentData = await getMyFolderContent({
        folderId,
        loggedInUserId,
      });
      const allDoenetmlVersions = await getAllDoenetmlVersions();
      res.send({ allDoenetmlVersions, ...contentData });
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
  "/api/getPublicFolderContent/:ownerId",
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = Number(req.params.ownerId);
    try {
      // send 0 as the logged in content to make sure get only public content
      const contentData = await getPublicFolderContent({
        ownerId,
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
  "/api/getPublicFolderContent/:ownerId/:folderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = Number(req.params.ownerId);
    const folderId = Number(req.params.folderId);
    try {
      // send 0 as the logged in content to make sure get only public content
      const contentData = await getPublicFolderContent({
        ownerId,
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

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "../public/index.html"));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
