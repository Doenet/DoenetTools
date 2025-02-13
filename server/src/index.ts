import express, { Express, NextFunction, Request, Response } from "express";
import * as path from "path";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { DateTime } from "luxon";
import {
  prisma,
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
  getUserInfoFromEmail,
  updateDoc,
  searchSharedContent,
  updateContent,
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
  addClassification,
  removeClassification,
  getClassifications,
  searchPossibleClassifications,
  getSharedFolderContent,
  searchUsersWithSharedContent,
  getSharedEditorData,
  unassignActivity,
  updateAssignmentSettings,
  getAllLicenses,
  makeActivityPrivate,
  makeActivityPublic,
  makeFolderPublic,
  makeFolderPrivate,
  shareActivityWithEmail,
  unshareActivity,
  shareFolderWithEmail,
  unshareFolder,
  setActivityLicense,
  setFolderLicense,
  searchMyFolderContent,
  upgradeAnonymousUser,
  getActivityContributorHistory,
  getActivityRemixes,
  getDocumentSource,
  setPreferredFolderView,
  getPreferredFolderView,
  getClassificationCategories,
  updateContentFeatures,
  searchClassificationsWithSharedContent,
  searchClassificationSubCategoriesWithSharedContent,
  searchClassificationCategoriesWithSharedContent,
  browseClassificationsWithSharedContent,
  browseClassificationSubCategoriesWithSharedContent,
  browseClassificationCategoriesWithSharedContent,
  browseClassificationSystemsWithSharedContent,
  browseUsersWithSharedContent,
  browseSharedContent,
  getClassificationInfo,
  getSharedContentMatchCount,
  getAvailableContentFeatures,
  getSharedContentMatchCountPerAvailableFeature,
  getAuthorInfo,
  browseTrendingContent,
  recordRecentContent,
  getRecentContent,
  copyContent,
} from "./model";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { Prisma } from "@prisma/client";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MagicLinkStrategy } from "passport-magic-link";
//@ts-expect-error no declaration file
import { Strategy as AnonymIdStrategy } from "passport-anonym-uuid";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import * as fs from "fs/promises";
import {
  fromUUID,
  contentStructureConvertUUID,
  toUUID,
  userConvertUUID,
  docHistoryConvertUUID,
  assignmentConvertUUID,
  assignmentStudentDataConvertUUID,
  allAssignmentScoresConvertUUID,
  studentDataConvertUUID,
  isEqualUUID,
  docRemixesConvertUUID,
} from "./utils/uuid";
import {
  ContentType,
  isContentType,
  LicenseCode,
  PartialContentClassification,
  UserInfo,
} from "./types";
import { add_test_apis } from "./test/test_apis";

const client = new SESClient({ region: "us-east-2" });

dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    user: UserInfo;
  }
}

const app: Express = express();
app.use(cookieParser());

// make sure that when log out, it doesn't use old cached pages
app.use(function (req, res, next) {
  if (!req.user) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
  }
  next();
});

const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: (process.env.LOGIN_CALLBACK_ROOT || "") + "api/login/google",
      scope: ["profile", "email"],
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
      done(null, profile);
    },
  ),
);

passport.use(
  new MagicLinkStrategy(
    {
      secret: process.env.MAGIC_LINK_SECRET || "",
      allowReuse: true,
      userFields: ["email", "fromAnonymous"],
      tokenField: "token",
    },
    async (user, token) => {
      const confirmURL = `${process.env.CONFIRM_SIGNIN_URL}?token=${token}`;

      if (
        process.env.CONSOLE_LOG_EMAIL &&
        process.env.CONSOLE_LOG_EMAIL.toLocaleLowerCase() !== "false"
      ) {
        console.log(`Confirm email link: ${confirmURL}`);
        return;
      }

      let email_html: string = "";

      try {
        const filePath = path.resolve(__dirname, "signin_email.html");

        email_html = await fs.readFile(filePath, { encoding: "utf8" });
      } catch (err) {
        console.log(err);
        throw Error("Could not send email");
      }

      email_html = email_html.replace(/CONFIRM_LINK/g, confirmURL);

      const params = {
        Source: "Doenet Accounts <info@doenet.org>",
        Destination: {
          ToAddresses: [user.email],
        },
        Message: {
          Subject: {
            Data: "Finish log into Doenet",
          },
          Body: {
            Text: {
              Data: `To finish your login into Doenet, go to the URL: ${confirmURL}`,
            },
            Html: {
              Data: email_html,
            },
          },
        },
      };

      // Send the email
      const sendEmail = async () => {
        try {
          const command = new SendEmailCommand(params);
          await client.send(command);
          console.log("Email sent successfully");
        } catch (error) {
          console.error("Error sending email", error);
        }
      };

      sendEmail();
    },
    async (user: { email: string; fromAnonymous: string | number }) => {
      return {
        provider: "magiclink",
        email: user.email as string,
        fromAnonymous: user.fromAnonymous || "",
      };
    },
  ),
);

passport.use(new AnonymIdStrategy());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser<any, any>(async (req, user: any, done) => {
  if (user.provider === "magiclink") {
    const email: string = user.email;
    const fromAnonymous: string = user.fromAnonymous;

    let u;

    if (fromAnonymous !== "") {
      try {
        u = await upgradeAnonymousUser({
          userId: toUUID(fromAnonymous),
          email,
        });
      } catch (_e) {
        /// ignore any error
      }
    }

    if (!u) {
      u = await findOrCreateUser({
        email,
        firstNames: null,
        lastNames: "",
      });
    }

    return done(undefined, fromUUID(u.userId));
  } else if (user.provider === "google") {
    let email = user.id + "@google.com";
    if (user.emails[0].verified) {
      email = user.emails[0].value;
    }

    const u = await findOrCreateUser({
      email,
      firstNames: user.name.givenName,
      lastNames: user.name.familyName,
    });
    return done(undefined, fromUUID(u.userId));
  } else if (user.uuid) {
    let email = user.uuid + "@anonymous.doenet.org";
    let lastNames = "";
    let firstNames: string | null = null;
    let isAnonymous = true;

    if (
      process.env.ALLOW_TEST_LOGIN &&
      process.env.ALLOW_TEST_LOGIN.toLocaleLowerCase() !== "false"
    ) {
      if (req.body.email) {
        email = req.body.email;
        if (req.body.firstNames) {
          firstNames = req.body.firstNames;
        }
        if (req.body.lastNames) {
          lastNames = req.body.lastNames;
        }
        isAnonymous = false;
      }
    }

    const u = await findOrCreateUser({
      email,
      lastNames,
      firstNames,
      isAnonymous,
    });
    return done(undefined, fromUUID(u.userId));
  }
});

passport.deserializeUser(async (userId: string, done) => {
  const u = await getUserInfo(toUUID(userId));
  done(null, u);
});

app.use(
  session({
    cookie: {
      maxAge: 365 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET || "",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server" + JSON.stringify(req?.user));
});

// An anonymous login that will be redirected to
// when going to getAssignmentDataFromCode without being logged in.
// Redirect back to that page after anonymous user is created and logged in.
app.get(
  "/api/login/anonymId/:code",
  passport.authenticate("anonymId"),
  (req: Request, res: Response) => {
    const code = req.params.code;
    res.redirect(`/api/getAssignmentDataFromCode/${code}`);
  },
);

if (
  process.env.ALLOW_TEST_LOGIN &&
  process.env.ALLOW_TEST_LOGIN.toLocaleLowerCase() !== "false"
) {
  app.post(
    "/api/login/createOrLoginAsTest",
    passport.authenticate("anonymId"),
    (_req: Request, res: Response) => {
      res.send({});
    },
  );
}

app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/api/login/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
);

app.post(
  "/api/auth/magiclink",
  passport.authenticate("magiclink", { action: "requestToken" }),
  (_req, res) => res.redirect("/"),
);

app.get(
  "/api/login/magiclink",
  passport.authenticate("magiclink", {
    action: "acceptToken",
    userPrimaryKey: "email",
  }),
  async (req: Request, res: Response) => {
    const user = await getUserInfoFromEmail(
      (req.user as { email: string }).email,
    );
    res.send({ user });
  },
);

app.get("/api/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/api/getSignedIn", (req: Request, res: Response) => {
  const signedIn = req.user ? true : false;
  res.send({ signedIn });
});

app.get(
  "/api/getUser",
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      try {
        const user = await getUserInfo(req.user.userId);
        res.send({ user: userConvertUUID(user) });
      } catch (e) {
        next(e);
      }
    } else {
      res.send({});
    }
  },
);

app.post("/api/updateUser", async (req: Request, res: Response) => {
  if (!req.user) {
    res.sendStatus(403);
    return;
  }
  const loggedInUserId = req.user.userId;
  const body = req.body;
  const firstNames = body.firstNames;
  const lastNames = body.lastNames;
  await updateUser({ userId: loggedInUserId, firstNames, lastNames });
  res.send({ firstNames, lastNames });
});

app.get("/api/checkForCommunityAdmin", async (req: Request, res: Response) => {
  if (req.user) {
    const loggedInUserId = req.user.userId;
    const isAdmin = loggedInUserId ? await getIsAdmin(loggedInUserId) : false;
    res.send({ isAdmin });
  } else {
    res.send({ isAdmin: false });
  }
});

app.get(
  "/api/getAllRecentPublicActivities",
  async (_req: Request, res: Response) => {
    const activities = await getAllRecentPublicActivities();
    res.send(activities.map(contentStructureConvertUUID));
  },
);

app.get(
  "/api/getAssigned",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    try {
      const assignedData = await listUserAssigned(loggedInUserId);
      res.send({
        user: userConvertUUID(assignedData.user),
        assignments: assignedData.assignments.map(contentStructureConvertUUID),
      });
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    try {
      const scoreData = await getAssignedScores(loggedInUserId);
      res.send({
        userData: userConvertUUID(scoreData.userData),
        orderedActivityScores: scoreData.orderedActivityScores.map(
          (scores) => ({ ...scores, activityId: fromUUID(scores.activityId) }),
        ),
        folder: null,
      });
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
  "/api/deleteActivity",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.activityId);
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const folderId = toUUID(body.folderId);
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }

    const body = req.body;
    const contentType: ContentType = isContentType(body.type)
      ? body.type
      : "singleDoc";
    const loggedInUserId = req.user.userId;

    try {
      if (contentType === "singleDoc") {
        const { activityId, docId } = await createActivity(
          loggedInUserId,
          null,
        );
        res.send({ activityId: fromUUID(activityId), docId: fromUUID(docId) });
      } else {
        const { folderId: activityId } = await createFolder(
          loggedInUserId,
          null,
          contentType,
        );
        res.send({ activityId: fromUUID(activityId) });
      }
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/createActivity/:parentId",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const parentId = toUUID(req.params.parentId);

    const body = req.body;
    const contentType: ContentType = isContentType(body.type)
      ? body.type
      : "singleDoc";

    try {
      if (contentType === "singleDoc") {
        const { activityId, docId } = await createActivity(
          loggedInUserId,
          parentId,
        );
        res.send({ activityId: fromUUID(activityId), docId: fromUUID(docId) });
      } else {
        const { folderId: activityId } = await createFolder(
          loggedInUserId,
          parentId,
          contentType,
        );
        res.send({ activityId: fromUUID(activityId) });
      }
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/createFolder/",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    try {
      const { folderId } = await createFolder(loggedInUserId, null);
      res.send({ folderId: fromUUID(folderId) });
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/createFolder/:parentId",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const parentId = toUUID(req.params.parentId);
    try {
      const { folderId } = await createFolder(loggedInUserId, parentId);
      res.send({ folderId: fromUUID(folderId) });
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/updateContentName",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);
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
  "/api/setActivityLicense",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);

    let licenseCode: LicenseCode;

    const requestedCode: string = body.licenseCode;
    switch (requestedCode) {
      case "CCDUAL":
      case "CCBYSA":
      case "CCBYNCSA": {
        licenseCode = requestedCode;
        break;
      }
      default: {
        res.status(400).send("Invalid license code");
        return;
      }
    }

    try {
      await setActivityLicense({
        id,
        ownerId: loggedInUserId,
        licenseCode,
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
  "/api/setFolderLicense",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);

    let licenseCode: LicenseCode;

    const requestedCode: string = body.licenseCode;
    switch (requestedCode) {
      case "CCDUAL":
      case "CCBYSA":
      case "CCBYNCSA": {
        licenseCode = requestedCode;
        break;
      }
      default: {
        res.status(400).send("Invalid license code");
        return;
      }
    }

    try {
      await setFolderLicense({
        id,
        ownerId: loggedInUserId,
        licenseCode,
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
  "/api/makeActivityPublic",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);

    let licenseCode: LicenseCode;

    const requestedCode: string = body.licenseCode;
    switch (requestedCode) {
      case "CCDUAL":
      case "CCBYSA":
      case "CCBYNCSA": {
        licenseCode = requestedCode;
        break;
      }
      default: {
        res.status(400).send("Invalid license code");
        return;
      }
    }

    try {
      await makeActivityPublic({
        id,
        ownerId: loggedInUserId,
        licenseCode,
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
  "/api/makeActivityPrivate",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);
    try {
      await makeActivityPrivate({ id, ownerId: loggedInUserId });
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
  "/api/makeFolderPublic",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }

    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);

    let licenseCode: LicenseCode;

    const requestedCode: string = body.licenseCode;
    switch (requestedCode) {
      case "CCDUAL":
      case "CCBYSA":
      case "CCBYNCSA": {
        licenseCode = requestedCode;
        break;
      }
      default: {
        res.status(400).send("Invalid license code");
        return;
      }
    }

    try {
      await makeFolderPublic({
        id,
        ownerId: loggedInUserId,
        licenseCode,
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
  "/api/makeFolderPrivate",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);
    try {
      await makeFolderPrivate({ id, ownerId: loggedInUserId });
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
  "/api/shareActivity",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);
    const email: string = body.email;

    let licenseCode: LicenseCode;

    const requestedCode: string = body.licenseCode;
    switch (requestedCode) {
      case "CCDUAL":
      case "CCBYSA":
      case "CCBYNCSA": {
        licenseCode = requestedCode;
        break;
      }
      default: {
        res.status(400).send("Invalid license code");
        return;
      }
    }

    try {
      await shareActivityWithEmail({
        id,
        ownerId: loggedInUserId,
        licenseCode,
        email,
      });
      res.send({});
    } catch (e) {
      if ((e as { message: string }).message === "User with email not found") {
        res.status(404).send("User with email not found");
      } else if (
        (e as { message: string }).message === "Cannot share with self"
      ) {
        res.send({ noSelfShare: true });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(403);
      } else {
        next(e);
      }
    }
  },
);

app.post(
  "/api/unshareActivity",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);
    const userId = toUUID(body.userId);
    try {
      await unshareActivity({
        id,
        ownerId: loggedInUserId,
        users: [userId],
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
  "/api/shareFolder",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);
    const email: string = body.email;

    let licenseCode: LicenseCode;

    const requestedCode: string = body.licenseCode;
    switch (requestedCode) {
      case "CCDUAL":
      case "CCBYSA":
      case "CCBYNCSA": {
        licenseCode = requestedCode;
        break;
      }
      default: {
        res.status(400).send("Invalid license code");
        return;
      }
    }

    try {
      await shareFolderWithEmail({
        id,
        ownerId: loggedInUserId,
        licenseCode,
        email,
      });
      res.send({});
    } catch (e) {
      console.log("error", e);
      if ((e as { message: string }).message === "User with email not found") {
        res.status(404).send("User with email not found");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((e as any).message === "Cannot share with self") {
        res.send({ noSelfShare: true });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.sendStatus(403);
      } else {
        next(e);
      }
    }
  },
);

app.post(
  "/api/unshareFolder",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);
    const userId = toUUID(body.userId);
    try {
      await unshareFolder({
        id,
        ownerId: loggedInUserId,
        users: [userId],
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

app.get(
  "/api/loadSupportingFileInfo/:activityId",
  (_req: Request, res: Response) => {
    // const activityId = toUUID(req.params.activityId);
    res.send({
      success: true,
      supportingFiles: [],
      canUpload: true,
      userQuotaBytesAvailable: 1000000,
      quotaBytes: 9000000,
    });
  },
);

app.get(
  "/api/getCoursePermissionsAndSettings",
  (_req: Request, res: Response) => {
    res.send({});
  },
);

app.post(
  "/api/searchSharedContent",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
    const query: string = req.body.q;

    const classificationId: number | undefined = req.body.classificationId;
    const subCategoryId: number | undefined = req.body.subCategoryId;
    const categoryId: number | undefined = req.body.categoryId;
    const systemId: number | undefined = req.body.systemId;
    const isUnclassified: boolean =
      req.body.isUnclassified &&
      classificationId === undefined &&
      subCategoryId === undefined &&
      categoryId === undefined &&
      systemId === undefined;

    let features: Set<string> | undefined;

    if (req.body.features) {
      features = new Set(req.body.features);
    }

    const ownerId = req.body.ownerId ? toUUID(req.body.ownerId) : undefined;

    try {
      const topAuthors = ownerId
        ? null
        : (
            await browseUsersWithSharedContent({
              query,
              loggedInUserId,
              systemId,
              categoryId,
              subCategoryId,
              classificationId,
              isUnclassified,
              features,
              take: 10,
            })
          ).map(userConvertUUID);

      const matchedAuthors = ownerId
        ? null
        : (
            await searchUsersWithSharedContent({
              query,
              loggedInUserId,
              systemId,
              categoryId,
              subCategoryId,
              classificationId,
              isUnclassified,
              features,
            })
          ).map(userConvertUUID);

      const authorInfo = ownerId
        ? userConvertUUID(await getAuthorInfo(ownerId))
        : null;

      const content = (
        await searchSharedContent({
          query,
          loggedInUserId,
          systemId,
          categoryId,
          subCategoryId,
          classificationId,
          isUnclassified,
          features,
          ownerId,
        })
      ).map(contentStructureConvertUUID);

      let matchedClassifications: PartialContentClassification[] | null = null;
      let matchedSubCategories: PartialContentClassification[] | null = null;
      let matchedCategories: PartialContentClassification[] | null = null;

      let classificationBrowse: PartialContentClassification[] | null = null;
      let subCategoryBrowse: PartialContentClassification[] | null = null;
      let categoryBrowse: PartialContentClassification[] | null = null;
      let systemBrowse: PartialContentClassification[] | null = null;

      if (!isUnclassified && classificationId === undefined) {
        matchedClassifications = await searchClassificationsWithSharedContent({
          query,
          loggedInUserId,
          systemId,
          categoryId,
          subCategoryId,
          features,
          ownerId,
        });

        if (subCategoryId !== undefined) {
          classificationBrowse = await browseClassificationsWithSharedContent({
            query,
            loggedInUserId,
            subCategoryId,
            features,
            ownerId,
          });
        } else {
          matchedSubCategories =
            await searchClassificationSubCategoriesWithSharedContent({
              query,
              loggedInUserId,
              systemId,
              categoryId,
              features,
              ownerId,
            });
          if (categoryId !== undefined) {
            subCategoryBrowse =
              await browseClassificationSubCategoriesWithSharedContent({
                query,
                loggedInUserId,
                categoryId,
                features,
                ownerId,
              });
          } else {
            matchedCategories =
              await searchClassificationCategoriesWithSharedContent({
                query,
                loggedInUserId,
                systemId,
                features,
                ownerId,
              });

            if (systemId !== undefined) {
              categoryBrowse =
                await browseClassificationCategoriesWithSharedContent({
                  query,
                  loggedInUserId,
                  systemId,
                  features,
                  ownerId,
                });
            } else {
              systemBrowse = await browseClassificationSystemsWithSharedContent(
                {
                  query,
                  loggedInUserId,
                  features,
                  ownerId,
                },
              );
            }
          }
        }
      }

      const classificationInfo: PartialContentClassification | null =
        isUnclassified
          ? {}
          : await getClassificationInfo({
              systemId,
              categoryId,
              subCategoryId,
              classificationId,
            });

      const totalCount = await getSharedContentMatchCount({
        query,
        loggedInUserId,
        systemId,
        categoryId,
        subCategoryId,
        classificationId,
        isUnclassified,
        features,
        ownerId,
      });

      const countByFeature =
        await getSharedContentMatchCountPerAvailableFeature({
          query,
          loggedInUserId,
          systemId,
          categoryId,
          subCategoryId,
          classificationId,
          isUnclassified,
          features,
          ownerId,
        });

      res.send({
        topAuthors,
        matchedAuthors,
        authorInfo,
        content,
        matchedClassifications,
        matchedSubCategories,
        matchedCategories,
        classificationBrowse,
        subCategoryBrowse,
        categoryBrowse,
        systemBrowse,
        classificationInfo,
        totalCount,
        countByFeature,
      });
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/browseSharedContent",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);

    const classificationId: number | undefined = req.body.classificationId;
    const subCategoryId: number | undefined = req.body.subCategoryId;
    const categoryId: number | undefined = req.body.categoryId;
    const systemId: number | undefined = req.body.systemId;
    const isUnclassified: boolean =
      req.body.isUnclassified &&
      classificationId === undefined &&
      subCategoryId === undefined &&
      categoryId === undefined &&
      systemId === undefined;

    let features: Set<string> | undefined;

    if (req.body.features) {
      features = new Set(req.body.features);
    }

    const ownerId = req.body.ownerId ? toUUID(req.body.ownerId) : undefined;

    try {
      const topAuthors = ownerId
        ? null
        : (
            await browseUsersWithSharedContent({
              loggedInUserId,
              systemId,
              categoryId,
              subCategoryId,
              classificationId,
              isUnclassified,
              features,
              take: 10,
            })
          ).map(userConvertUUID);

      const authorInfo = ownerId
        ? userConvertUUID(await getAuthorInfo(ownerId))
        : null;

      const recentContent = (
        await browseSharedContent({
          loggedInUserId,
          systemId,
          categoryId,
          subCategoryId,
          classificationId,
          isUnclassified,
          features,
          ownerId,
        })
      ).map(contentStructureConvertUUID);

      const trendingContent = (
        await browseTrendingContent({
          loggedInUserId,
          systemId,
          categoryId,
          subCategoryId,
          classificationId,
          isUnclassified,
          features,
          ownerId,
          pageSize: 10,
        })
      ).map(contentStructureConvertUUID);

      let classificationBrowse: PartialContentClassification[] | null = null;
      let subCategoryBrowse: PartialContentClassification[] | null = null;
      let categoryBrowse: PartialContentClassification[] | null = null;
      let systemBrowse: PartialContentClassification[] | null = null;

      if (!isUnclassified && classificationId === undefined) {
        if (subCategoryId !== undefined) {
          classificationBrowse = await browseClassificationsWithSharedContent({
            loggedInUserId,
            subCategoryId,
            features,
            ownerId,
          });
        } else {
          if (categoryId !== undefined) {
            subCategoryBrowse =
              await browseClassificationSubCategoriesWithSharedContent({
                loggedInUserId,
                categoryId,
                features,
                ownerId,
              });
          } else {
            if (systemId !== undefined) {
              categoryBrowse =
                await browseClassificationCategoriesWithSharedContent({
                  loggedInUserId,
                  systemId,
                  features,
                  ownerId,
                });
            } else {
              systemBrowse = await browseClassificationSystemsWithSharedContent(
                {
                  loggedInUserId,
                  features,
                  ownerId,
                },
              );
            }
          }
        }
      }

      const classificationInfo: PartialContentClassification | null =
        isUnclassified
          ? {}
          : await getClassificationInfo({
              systemId,
              categoryId,
              subCategoryId,
              classificationId,
            });

      const totalCount = await getSharedContentMatchCount({
        loggedInUserId,
        systemId,
        categoryId,
        subCategoryId,
        classificationId,
        isUnclassified,
        features,
        ownerId,
      });

      const countByFeature =
        await getSharedContentMatchCountPerAvailableFeature({
          loggedInUserId,
          systemId,
          categoryId,
          subCategoryId,
          classificationId,
          isUnclassified,
          features,
          ownerId,
        });

      res.send({
        topAuthors,
        authorInfo,
        recentContent,
        trendingContent,
        classificationBrowse,
        subCategoryBrowse,
        categoryBrowse,
        systemBrowse,
        classificationInfo,
        totalCount,
        countByFeature,
      });
    } catch (e) {
      next(e);
    }
  },
);

app.get(
  "/api/getAvailableContentFeatures",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const availableFeatures = await getAvailableContentFeatures();
      res.send(availableFeatures);
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/addPromotedContent",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const groupId = req.body.groupId;
    const activityId = toUUID(req.body.activityId);
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
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);

    try {
      const content = await loadPromotedContent(loggedInUserId);
      const content2 = content.map((c) => ({
        ...c,
        promotedContent: c.promotedContent.map(contentStructureConvertUUID),
      }));
      res.send(content2);
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    try {
      const groupId = Number(req.body.groupId);
      const activityId = toUUID(req.body.activityId);

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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    try {
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    try {
      const { groupName } = req.body;
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const { groupId, newGroupName, homepage, currentlyFeatured } = req.body;
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    try {
      const { groupId } = req.body;
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    try {
      const { groupId, desiredPosition } = req.body;
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
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
    const activityId = toUUID(req.params.activityId);
    try {
      const editorData = await getActivityEditorData(
        activityId,
        loggedInUserId,
      );
      if (!editorData.notMe) {
        // record that this activity was accessed via editor
        await recordRecentContent(loggedInUserId, "edit", activityId);
      }
      res.send({
        notMe: editorData.notMe,
        activity: contentStructureConvertUUID(editorData.activity),
        availableFeatures: editorData.availableFeatures,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        res.sendStatus(404);
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getSharedEditorData/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
    const activityId = toUUID(req.params.activityId);
    try {
      const editorData = await getSharedEditorData(activityId, loggedInUserId);
      res.send(contentStructureConvertUUID(editorData));
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

app.get(
  "/api/getDocumentSource/:docId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
    const docId = toUUID(req.params.docId);
    try {
      const sourceData = await getDocumentSource(docId, loggedInUserId);
      res.send(sourceData);
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

app.get("/api/getAllDoenetmlVersions", async (_req: Request, res: Response) => {
  const allDoenetmlVersions = await getAllDoenetmlVersions();
  res.send(allDoenetmlVersions);
});

app.get("/api/getAllLicenses", async (_req: Request, res: Response) => {
  const allLicenses = await getAllLicenses();
  res.send(allLicenses);
});

app.get(
  "/api/getActivityViewerData/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
    const activityId = toUUID(req.params.activityId);

    try {
      const { activity, docHistories } = await getActivityViewerData(
        activityId,
        loggedInUserId,
      );

      res.send({
        activity: contentStructureConvertUUID(activity),
        docHistories: docHistories?.map(docHistoryConvertUUID),
      });
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
  "/api/getContributorHistory/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
    const activityId = toUUID(req.params.activityId);

    try {
      const { docHistories } = await getActivityContributorHistory({
        activityId,
        loggedInUserId,
      });
      // TODO: process to convert UUIDs
      res.send({ docHistories: docHistories.map(docHistoryConvertUUID) });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        res.sendStatus(404);
      } else {
        next(e);
      }
    }
  },
);

app.get(
  "/api/getRemixes/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
    const activityId = toUUID(req.params.activityId);

    try {
      const { docRemixes } = await getActivityRemixes({
        activityId,
        loggedInUserId,
      });
      res.send({ docRemixes: docRemixes.map(docRemixesConvertUUID) });
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
  async (req: Request, res: Response, next: NextFunction) => {
    const code = req.params.code;

    if (!req.user) {
      // If not logged in, then redirect to log in anonymously,
      // which will redirect back here with the anonymous user
      // logged in.
      return res.redirect(`/api/login/anonymId/${code}`);
    }

    const loggedInUserId = req.user.userId;

    try {
      const { assignmentFound, assignment } = await getAssignmentDataFromCode(
        code,
        loggedInUserId,
      );

      res.send({
        assignmentFound,
        assignment: assignment ? assignmentConvertUUID(assignment) : null,
      });
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/saveDoenetML",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const doenetML = body.doenetML;
    const docId = toUUID(body.docId);
    const numVariants = body.numVariants;
    const baseComponentCounts = body.baseComponentCounts;

    try {
      await updateDoc({
        id: docId,
        source: doenetML,
        ownerId: loggedInUserId,
        numVariants,
        baseComponentCounts,
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }

    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);
    const imagePath = body.imagePath;
    const name = body.name;
    const shuffle = body.shuffle;
    const numToSelect = body.numToSelect;
    const selectByVariant = body.selectByVariant;
    const paginate = body.paginate;
    const activityLevelAttempts = body.activityLevelAttempts;
    const itemLevelAttempts = body.itemLevelAttempts;

    try {
      await updateContent({
        id,
        imagePath,
        name,
        shuffle,
        numToSelect,
        selectByVariant,
        paginate,
        activityLevelAttempts,
        itemLevelAttempts,
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const docId = toUUID(body.docId);
    const name = body.name;
    // TODO - deal with learning outcomes
    // const learningOutcomes = body.learningOutcomes;
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

app.post(
  "/api/updateContentFeatures",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }

    const loggedInUserId = req.user.userId;
    const body = req.body;
    const id = toUUID(body.id);
    const features: Record<string, boolean> = body.features;

    try {
      await updateContentFeatures({
        id,
        features,
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
  "/api/moveContent",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }

    try {
      const loggedInUserId = req.user.userId;
      const id = toUUID(req.body.id);
      const desiredParentId = req.body.desiredParentId
        ? toUUID(req.body.desiredParentId)
        : null;
      const desiredPosition = Number(req.body.desiredPosition);

      await moveContent({
        id,
        desiredParentId,
        desiredPosition,
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
  "/api/duplicateActivity",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const targetActivityId = toUUID(req.body.activityId);
    const desiredParentId = req.body.desiredParentId
      ? toUUID(req.body.desiredParentId)
      : null;

    try {
      const newActivityId = await copyActivityToFolder(
        targetActivityId,
        loggedInUserId,
        desiredParentId,
        true,
      );

      res.send({
        newActivityId: fromUUID(newActivityId),
        userId: fromUUID(loggedInUserId),
      });
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
  "/api/copyContent",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    try {
      const loggedInUserId = req.user.userId;
      const sourceContent = req.body.sourceContent.map(
        ({ contentId, type }: { contentId: string; type: ContentType }) => ({
          contentId: toUUID(contentId),
          type,
        }),
      );
      const desiredParentId = req.body.desiredParentId
        ? toUUID(req.body.desiredParentId)
        : null;

      const newContentIds = await copyContent(
        sourceContent,
        loggedInUserId,
        desiredParentId,
      );

      if (desiredParentId) {
        await recordRecentContent(loggedInUserId, "edit", desiredParentId);
      }

      res.send({
        newContentIds: newContentIds.map(fromUUID),
        userId: fromUUID(loggedInUserId),
      });
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
  "/api/assignActivity",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const activityId = toUUID(req.body.id);
    try {
      await assignActivity(activityId, loggedInUserId);

      res.send({ userId: fromUUID(loggedInUserId) });
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
  "/api/openAssignmentWithCode",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const activityId = toUUID(body.activityId);
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
  "/api/updateAssignmentSettings",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const activityId = toUUID(body.activityId);
    const closeAt = DateTime.fromISO(body.closeAt);

    try {
      await updateAssignmentSettings(activityId, closeAt, loggedInUserId);
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
  "/api/closeAssignmentWithCode",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const activityId = toUUID(body.activityId);

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
  "/api/unassignActivity",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const activityId = toUUID(body.activityId);

    try {
      await unassignActivity(activityId, loggedInUserId);
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const activityId = toUUID(body.activityId);
    const docId = toUUID(body.docId);
    const docVersionNum = Number(body.docVersionNum);
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    if (!req.query.activityId || !req.query.docId || !req.query.docVersionNum) {
      res.status(204).send({});
      return;
    }
    const activityId = toUUID(req.query.activityId.toString());
    const docId = toUUID(req.query.docId.toString());
    const docVersionNum = Number(req.query.docVersionNum);
    const requestedUserId = req.query.userId
      ? toUUID(req.query.userId.toString())
      : loggedInUserId;
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const activityId = toUUID(req.params.activityId);

    try {
      const assignmentDataOrig = await getAssignmentScoreData({
        activityId,
        ownerId: loggedInUserId,
      });
      const assignmentData = {
        name: assignmentDataOrig.name,
        assignmentScores: assignmentDataOrig.assignmentScores.map(
          (scoreObj) => ({
            score: scoreObj.score,
            user: userConvertUUID(scoreObj.user),
          }),
        ),
      };
      const answerList = (
        await getAnswersThatHaveSubmittedResponses({
          activityId,
          ownerId: loggedInUserId,
        })
      ).map((answerObj) => ({
        ...answerObj,
        docId: fromUUID(answerObj.docId),
      }));
      const assignmentContent = (
        await getAssignmentContent({
          activityId,
          ownerId: loggedInUserId,
        })
      ).map((assignmentObj) =>
        assignmentObj.assignedVersion
          ? {
              ...assignmentObj.assignedVersion,
              docId: fromUUID(assignmentObj.assignedVersion.docId),
            }
          : null,
      );
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const activityId = toUUID(req.params.activityId);

    try {
      const assignmentData = await getAssignmentStudentData({
        activityId,
        loggedInUserId,
        studentId: loggedInUserId,
      });
      res.send(assignmentStudentDataConvertUUID(assignmentData));
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const activityId = toUUID(req.params.activityId);
    const userId = toUUID(req.params.userId);

    try {
      const assignmentData = await getAssignmentStudentData({
        activityId,
        loggedInUserId,
        studentId: userId,
      });
      res.send(assignmentStudentDataConvertUUID(assignmentData));
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;

    try {
      const data = await getAllAssignmentScores({
        ownerId: loggedInUserId,
        parentId: null,
      });
      res.send(allAssignmentScoresConvertUUID(data));
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
  "/api/getAllAssignmentScores/:parentId",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const folderId = toUUID(req.params.parentId);

    try {
      const data = await getAllAssignmentScores({
        ownerId: loggedInUserId,
        parentId: folderId,
      });
      res.send(allAssignmentScoresConvertUUID(data));
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
  "/api/getStudentData/:userId/",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const userId = toUUID(req.params.userId);

    try {
      // TODO: convert UUIDs
      const data = await getStudentData({
        userId: userId,
        ownerId: loggedInUserId,
        parentId: null,
      });
      res.send(studentDataConvertUUID(data));
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
  "/api/getStudentData/:userId/:parentId",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const userId = toUUID(req.params.userId);
    const parentId = toUUID(req.params.parentId);

    try {
      // TODO: convert UUIDs
      const data = await getStudentData({
        userId: userId,
        ownerId: loggedInUserId,
        parentId,
      });
      res.send(studentDataConvertUUID(data));
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const body = req.body;
    const activityId = toUUID(body.activityId);
    const docId = toUUID(body.docId);
    const docVersionNum = Number(body.docVersionNum);
    const answerId = body.answerId as string;
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const activityId = toUUID(req.params.activityId);
    const docId = toUUID(req.params.docId);
    const docVersionNum = Number(req.params.docVersionNum);
    const answerId = req.query.answerId as string;

    try {
      const { activityName, submittedResponses } =
        await getDocumentSubmittedResponses({
          activityId,
          docId,
          docVersionNum,
          answerId,
          ownerId: loggedInUserId,
        });
      res.send({
        activityName,
        submittedResponses: submittedResponses.map((sr) => ({
          ...sr,
          user: userConvertUUID(sr.user),
        })),
      });
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
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const activityId = toUUID(req.params.activityId);
    const docId = toUUID(req.params.docId);
    const docVersionNum = Number(req.params.docVersionNum);
    const userId = toUUID(req.params.userId);
    const answerId = req.query.answerId as string;

    try {
      const { activityName, submittedResponses } =
        await getDocumentSubmittedResponseHistory({
          activityId,
          docId,
          docVersionNum,
          answerId,
          userId,
          ownerId: loggedInUserId,
        });
      res.send({
        activityName,
        submittedResponses: submittedResponses.map((sr) => ({
          ...sr,
          user: userConvertUUID(sr.user),
        })),
      });
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
  "/api/getMyFolderContent/:ownerId/",
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = toUUID(req.params.ownerId);
    const loggedInUserId = req.user?.userId;

    if (!loggedInUserId || !isEqualUUID(ownerId, loggedInUserId)) {
      res.send({ notMe: true });
      return;
    }

    try {
      const contentData = await getMyFolderContent({
        folderId: null,
        loggedInUserId,
      });

      const allDoenetmlVersions = await getAllDoenetmlVersions();
      const allLicenses = await getAllLicenses();
      res.send({
        allDoenetmlVersions,
        allLicenses,
        content: contentData.content.map(contentStructureConvertUUID),
        folder: contentData.folder
          ? contentStructureConvertUUID(contentData.folder)
          : null,
        availableFeatures: contentData.availableFeatures,
      });
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
  "/api/getMyFolderContent/:ownerId/:folderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = toUUID(req.params.ownerId);
    const folderId = toUUID(req.params.folderId);
    const loggedInUserId = req.user?.userId;

    if (!loggedInUserId || !isEqualUUID(ownerId, loggedInUserId)) {
      res.send({ notMe: true });
      return;
    }

    try {
      const contentData = await getMyFolderContent({
        folderId,
        loggedInUserId,
      });
      const allDoenetmlVersions = await getAllDoenetmlVersions();
      const allLicenses = await getAllLicenses();
      // record that opened this folder
      await recordRecentContent(loggedInUserId, "edit", folderId);
      res.send({
        allDoenetmlVersions,
        allLicenses,
        content: contentData.content.map(contentStructureConvertUUID),
        folder: contentData.folder
          ? contentStructureConvertUUID(contentData.folder)
          : null,
        availableFeatures: contentData.availableFeatures,
      });
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
  "/api/searchMyFolderContent/:ownerId",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user?.userId;
    const ownerId = toUUID(req.params.ownerId);
    const query = req.query.q as string;

    if (!loggedInUserId || !isEqualUUID(ownerId, loggedInUserId)) {
      res.send({ notMe: true });
      return;
    }

    try {
      const contentData = await searchMyFolderContent({
        folderId: null,
        loggedInUserId,
        query,
      });

      const allDoenetmlVersions = await getAllDoenetmlVersions();
      const allLicenses = await getAllLicenses();
      res.send({
        allDoenetmlVersions,
        allLicenses,
        content: contentData.content.map(contentStructureConvertUUID),
        folder: contentData.folder
          ? contentStructureConvertUUID(contentData.folder)
          : null,
        availableFeatures: contentData.availableFeatures,
      });
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

app.get(
  "/api/searchMyFolderContent/:ownerId/:folderId",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user?.userId;
    const ownerId = toUUID(req.params.ownerId);
    const folderId = toUUID(req.params.folderId);
    const query = req.query.q as string;

    if (!loggedInUserId || !isEqualUUID(ownerId, loggedInUserId)) {
      res.send({ notMe: true });
      return;
    }

    try {
      const contentData = await searchMyFolderContent({
        folderId,
        loggedInUserId,
        query,
      });
      const allDoenetmlVersions = await getAllDoenetmlVersions();
      const allLicenses = await getAllLicenses();
      res.send({
        allDoenetmlVersions,
        allLicenses,
        content: contentData.content.map(contentStructureConvertUUID),
        folder: contentData.folder
          ? contentStructureConvertUUID(contentData.folder)
          : null,
        availableFeatures: contentData.availableFeatures,
      });
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
  "/api/getSharedFolderContent/:ownerId",
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = toUUID(req.params.ownerId);
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
    try {
      const contentData = await getSharedFolderContent({
        ownerId,
        folderId: null,
        loggedInUserId,
      });
      res.send({
        content: contentData.content.map(contentStructureConvertUUID),
        owner: contentData.owner,
        folder: contentData.folder
          ? contentStructureConvertUUID(contentData.folder)
          : null,
      });
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
  "/api/getSharedFolderContent/:ownerId/:folderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = toUUID(req.params.ownerId);
    const folderId = toUUID(req.params.folderId);
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
    try {
      const contentData = await getSharedFolderContent({
        ownerId,
        folderId,
        loggedInUserId,
      });
      res.send({
        content: contentData.content.map(contentStructureConvertUUID),
        owner: contentData.owner,
        folder: contentData.folder
          ? contentStructureConvertUUID(contentData.folder)
          : null,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(404).send("No content found");
      } else {
        next(e);
      }
    }
  },
);

app.post(
  "/api/addClassification",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const classificationId = Number(req.body.classificationId);
    const activityId = toUUID(req.body.activityId);
    try {
      await addClassification(activityId, classificationId, loggedInUserId);
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2002") {
          res
            .status(400)
            .send("This activity already has that classification.");
          return;
        } else if (e.code === "P2003") {
          res.status(400).send("That classification does not exist.");
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
  "/api/removeClassification",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    try {
      const classificationId = Number(req.body.classificationId);
      const activityId = toUUID(req.body.activityId);

      await removeClassification(activityId, classificationId, loggedInUserId);
      res.send({});
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") {
          res.status(400).send("That classification does not exist.");
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
  "/api/getClassifications",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activityId = toUUID(req.body.activityId);
      const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
      const classifications = await getClassifications(
        activityId,
        loggedInUserId,
      );
      res.send(classifications);
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
  "/api/searchPossibleClassifications",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q ? String(req.query.q) : undefined;
      const systemId = req.query.system ? Number(req.query.system) : undefined;
      const categoryId = req.query.category
        ? Number(req.query.category)
        : undefined;
      const subCategoryId = req.query.subCategory
        ? Number(req.query.subCategory)
        : undefined;
      const searchResults = await searchPossibleClassifications({
        query,
        systemId,
        categoryId,
        subCategoryId,
      });
      res.send(searchResults);
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
  "/api/getClassificationCategories",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await getClassificationCategories();
      res.send(results);
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
  "/api/setPreferredFolderView",
  async (req: Request, res: Response, next: NextFunction) => {
    const cardView = req.body.cardView as boolean;

    if (!req.user) {
      // if not signed in, then don't set anything and report back their choice
      res.send({ cardView });
      return;
    }

    try {
      const loggedInUserId = req.user.userId;

      const results = await setPreferredFolderView(loggedInUserId, cardView);
      res.send(results);
    } catch (e) {
      next(e);
    }
  },
);

app.get(
  "/api/getPreferredFolderView",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      // if not signed in, just have the default behavior
      res.send({ cardView: false });
      return;
    }

    try {
      const loggedInUserId = req.user.userId;

      const results = await getPreferredFolderView(loggedInUserId);
      res.send(results);
    } catch (e) {
      next(e);
    }
  },
);

app.get(
  "/api/getRecentContent",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      // if not signed in, don't have any recent content
      res.send([]);
      return;
    }

    try {
      const mode = req.query.mode === "edit" ? "edit" : "view";
      const restrictToTypes: ContentType[] = [];
      if (Array.isArray(req.query.restrictToTypes)) {
        for (const t of req.query.restrictToTypes) {
          if (
            typeof t === "string" &&
            ["sequence", "select", "folder", "singleDoc"].includes(t)
          ) {
            restrictToTypes.push(t as ContentType);
          }
        }
      }
      const loggedInUserId = req.user.userId;

      const results = await getRecentContent(
        loggedInUserId,
        mode,
        restrictToTypes,
      );
      res.send(results.map((r) => ({ ...r, id: fromUUID(r.id) })));
    } catch (e) {
      next(e);
    }
  },
);

if (
  process.env.ADD_TEST_APIS &&
  process.env.ADD_TEST_APIS.toLocaleLowerCase() !== "false"
) {
  add_test_apis(app);
}

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get("*", function (_request, response) {
  response.sendFile(path.resolve(__dirname, "../public/index.html"));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
