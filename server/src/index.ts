import express, { Express, NextFunction, Request, Response } from "express";
import * as path from "path";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { DateTime } from "luxon";
import { prisma } from "./model";
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
  isContentType,
  LibraryInfo,
  PartialContentClassification,
  UserInfo,
} from "./types";
import { add_test_apis } from "./test/test_apis";
import {
  findOrCreateUser,
  getUserInfo,
  upgradeAnonymousUser,
} from "./query/user";
import { userRouter } from "./routes/userRoutes";
import { loginRouter } from "./routes/loginRoutes";
import { oldAdminRouter } from "./routes/oldAdminRoutes";
import { assignRouter } from "./routes/assignRoutes";
import { updateContentRouter } from "./routes/updateContentRoutes";
import { shareRouter } from "./routes/shareRoutes";
import { scoreRouter } from "./routes/scoreRoutes";

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
    let isAdmin = false;

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
        if (req.body.isAdmin) {
          isAdmin = true;
        }
        isAnonymous = false;
      }
    }

    const u = await findOrCreateUser({
      email,
      lastNames,
      firstNames,
      isAnonymous,
      isAdmin,
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

app.use("/api/user", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/oldAdmin", oldAdminRouter);
app.use("/api/assign", assignRouter);
app.use("/api/updateContent", updateContentRouter);
app.use("/api/share", shareRouter);
app.use("/api/scores", scoreRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server" + JSON.stringify(req?.user));
});

app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.post(
  "/api/auth/magiclink",
  passport.authenticate("magiclink", { action: "requestToken" }),
  (_req, res) => res.redirect("/"),
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
          isCurated: false,
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

      const curatedContent = (
        await searchSharedContent({
          query,
          isCurated: true,
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
        curatedContent,
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
          isCurated: false,
          systemId,
          categoryId,
          subCategoryId,
          classificationId,
          isUnclassified,
          features,
          ownerId,
        })
      ).map(contentStructureConvertUUID);

      const curatedContent = (
        await browseSharedContent({
          isCurated: true,
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
        curatedContent,
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
  "/api/getActivityEditorData/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
    const activityId = toUUID(req.params.activityId);
    try {
      const editorData = await getActivityEditorData(
        activityId,
        loggedInUserId,
      );
      if (editorData.editableByMe) {
        // record that this activity was accessed via editor
        await recordRecentContent(loggedInUserId, "edit", activityId);
      }
      res.send({
        editableByMe: editorData.editableByMe,
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

app.get(
  "/api/getContentDescription/:contentId",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
    const contentId = toUUID(req.params.contentId);

    try {
      const contentDescription = await getContentDescription(
        contentId,
        loggedInUserId,
      );

      res.send({
        ...contentDescription,
        id: fromUUID(contentDescription.id),
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
  "/api/getActivityViewerData/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loggedInUserId = req.user?.userId ?? new Uint8Array(16);
      const activityId = toUUID(req.params.activityId);
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

app.post(
  "/api/moveContent",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }

    try {
      const ownerId = req.user.userId;
      const id = toUUID(req.body.id);
      const desiredParentId = req.body.desiredParentId
        ? toUUID(req.body.desiredParentId)
        : null;
      const desiredPosition = Number(req.body.desiredPosition);

      await moveContent({
        id,
        desiredParentId,
        desiredPosition,
        ownerId,
      });
      res.send({});
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

      const prependCopy = Boolean(req.body.prependCopy);

      const newContentIds = await copyContent(
        sourceContent,
        loggedInUserId,
        desiredParentId,
        prependCopy,
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
  "/api/createContentCopyInChildren",
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
      const desiredParentType = req.body.desiredParentType;

      const { folderId, folderName } = await createFolder(
        loggedInUserId,
        null,
        desiredParentType,
      );

      const newContentIds = await copyContent(
        sourceContent,
        loggedInUserId,
        folderId,
      );

      await recordRecentContent(loggedInUserId, "edit", folderId);

      res.send({
        newContentIds: newContentIds.map(fromUUID),
        newParentId: fromUUID(folderId),
        newParentName: folderName,
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

app.get(
  "/api/checkIfFolderContains",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    try {
      const loggedInUserId = req.user.userId;
      const folderId =
        typeof req.query.folderId === "string"
          ? toUUID(req.query.folderId)
          : null;

      const contentType = req.query.contentType;

      if (isContentType(contentType)) {
        const containsType = await checkIfFolderContains(
          folderId,
          contentType,
          loggedInUserId,
        );

        res.send({ contentType, containsType });
      } else {
        res.send({ contentType, containsType: false });
      }
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
  "/api/getMyContent/:ownerId/",
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = toUUID(req.params.ownerId);
    const loggedInUserId = req.user?.userId;

    if (!loggedInUserId || !isEqualUUID(ownerId, loggedInUserId)) {
      res.send({ notMe: true });
      return;
    }

    try {
      const contentData = await getMyContent({
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
  "/api/getMyContent/:ownerId/:folderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = toUUID(req.params.ownerId);
    const folderId = toUUID(req.params.folderId);
    const loggedInUserId = req.user?.userId;

    if (!loggedInUserId || !isEqualUUID(ownerId, loggedInUserId)) {
      res.send({ notMe: true });
      return;
    }

    try {
      const contentData = await getMyContent({
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

app.get(
  "/api/getCurationFolderContent",
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?.userId;

    if (!loggedInUserId) {
      res.sendStatus(404);
      return;
    }

    try {
      const contentData = await getMyContent({
        isLibrary: true,
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
  "/api/getCurationFolderContent/:folderId",
  async (req: Request, res: Response, next: NextFunction) => {
    const folderId = toUUID(req.params.folderId);
    const loggedInUserId = req.user?.userId;

    if (!loggedInUserId) {
      res.sendStatus(404);
      return;
    }

    try {
      const contentData = await getMyContent({
        isLibrary: true,
        folderId,
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
  "/api/searchCurationFolderContent",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user?.userId;
    const query = req.query.q as string;

    if (!loggedInUserId) {
      res.sendStatus(404);
      return;
    }

    try {
      const contentData = await searchMyFolderContent({
        folderId: null,
        loggedInUserId,
        query,
        inLibrary: true,
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
  "/api/searchCurationFolderContent/:folderId",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user?.userId;
    const folderId = toUUID(req.params.folderId);
    const query = req.query.q as string;

    if (!loggedInUserId) {
      res.sendStatus(404);
      return;
    }

    try {
      const contentData = await searchMyFolderContent({
        folderId,
        loggedInUserId,
        query,
        inLibrary: true,
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
  "/api/getLibraryStatus/:activityId",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }

    const activityId = toUUID(req.params.activityId);
    const loggedInUserId = req.user?.userId;

    try {
      const status: LibraryInfo = await getLibraryStatus({
        id: activityId,
        userId: loggedInUserId,
      });
      const statusNew = {
        ...status,
        activityId: status.activityId ? fromUUID(status.activityId) : null,
      };
      res.send(statusNew);
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
  "/api/addDraftToLibrary",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }

    try {
      const loggedInUserId = req.user.userId;
      const id = toUUID(req.body.activityId);
      const contentType = req.body.type;

      const { draftId } = await addDraftToLibrary({
        id,
        contentType,
        loggedInUserId,
      });
      res.send({
        newActivityId: fromUUID(draftId),
        userId: fromUUID(loggedInUserId),
      });
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/deleteDraftFromLibrary",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    try {
      const loggedInUserId = req.user.userId;
      const id = toUUID(req.body.activityId);
      const contentType = req.body.contentType;

      await deleteDraftFromLibrary({
        draftId: id,
        loggedInUserId,
        contentType,
      });
      res.send({});
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/createCurationFolder/",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    try {
      const { folderId } = await createFolder(
        loggedInUserId,
        null,
        "folder",
        true,
      );
      res.send({ folderId: fromUUID(folderId) });
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/createCurationFolder/:parentFolderId",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const parentFolderId = toUUID(req.params.parentFolderId);
    try {
      const { folderId } = await createFolder(
        loggedInUserId,
        parentFolderId,
        "folder",
        true,
      );
      res.send({ folderId: fromUUID(folderId) });
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/api/moveCurationContent",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const ownerId = req.user.userId;
    const id = toUUID(req.body.id);
    const desiredParentId = req.body.desiredParentId
      ? toUUID(req.body.desiredParentId)
      : null;
    const desiredPosition = Number(req.body.desiredPosition);

    try {
      await moveContent({
        id,
        desiredParentId,
        desiredPosition,
        ownerId,
        inLibrary: true,
      });
      res.send({});
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
  "/api/publishActivityToLibrary",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const id = toUUID(req.body.id);
    const comments = req.body.comments;

    try {
      await publishActivityToLibrary({ draftId: id, loggedInUserId, comments });
      res.send({});
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
  "/api/unpublishActivityFromLibrary",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const id = toUUID(req.body.id);

    try {
      await unpublishActivityFromLibrary({ activityId: id, loggedInUserId });
      res.send({});
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
  "/api/modifyCommentsOfLibraryRequest",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    const sourceId = toUUID(req.body.sourceId);
    const comments = req.body.comments;

    try {
      await modifyCommentsOfLibraryRequest({
        sourceId,
        comments,
        userId: loggedInUserId,
      });
      res.send({});
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
  "/api/markLibraryRequestNeedsRevision",
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }
    const loggedInUserId = req.user.userId;
    try {
      const sourceId = toUUID(req.body.sourceId);
      const comments = req.body.comments;

      await markLibraryRequestNeedsRevision({
        sourceId,
        comments,
        userId: loggedInUserId,
      });
      res.send({});
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
