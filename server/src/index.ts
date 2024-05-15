import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {
  copyPublicActivityToPortfolio,
  createActivity,
  deleteActivity,
  findOrCreateUser,
  getAllDoenetmlVersions,
  getActivity,
  getActivityEditorData,
  getDocViewerData,
  getUserInfo,
  listUserActivities,
  updateDoc,
  searchPublicActivities,
  updateActivity,
  getDoc,
} from "./model";

dotenv.config();

const app: Express = express();
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/api/getQuickCheckSignedIn.php", (req: Request, res: Response) => {
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

app.get("/api/checkForCommunityAdmin.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/loadProfile.php", (req: Request, res: Response) => {
  const loggedInEmail = req.cookies.email;
  res.send({
    profile: {
      screenName: "",
      email: loggedInEmail,
      firstName: "",
      lastName: "",
      profilePicture: "anonymous",
      trackingConsent: true,
      signedIn: "0",
      userId: "",
      canUpload: "0",
    },
  });
});

app.get("/api/getPortfolio.php", async (req: Request, res: Response) => {
  const loggedInUserId = Number(req.cookies.userId);
  const ret = await listUserActivities(loggedInUserId, loggedInUserId);
  res.send(ret);
});

app.get("/api/sendSignInEmail.php", async (req: Request, res: Response) => {
  const email: string = req.query.emailaddress as string;
  // TODO: add the ability to give a name after logging in or creating an account
  const userId = await findOrCreateUser(email, email);
  res.cookie("email", email);
  res.cookie("userId", String(userId));
  res.send({ success: true });
});

app.post(
  "/api/deletePortfolioActivity",
  async (req: Request, res: Response) => {
    const body = req.body;
    const doenetId = Number(body.doenetId);
    await deleteActivity(doenetId);
    res.send({});
  },
);

app.post("/api/createActivity", async (req: Request, res: Response) => {
  const loggedInUserId = Number(req.cookies.userId);
  const { activityId, docId } = await createActivity(loggedInUserId);
  res.send({ activityId, docId });
});

app.get(
  "/api/updatePortfolioActivityLabel.php",
  (req: Request, res: Response) => {
    const doenetId = Number(req.query.doenetId as string);
    const label = req.query.label as string;
    updateDoc({ docId: doenetId, name: label });
    res.send({ success: true });
  },
);

app.post("/api/updateIsPublicActivity", (req: Request, res: Response) => {
  const body = req.body;
  const activityId = Number(body.activityId);
  const isPublic = body.isPublic;
  updateActivity({ activityId, isPublic });
  res.send({});
});

app.get("/api/loadSupportingFileInfo.php", (req: Request, res: Response) => {
  const doenetId = Number(req.query.doenetId as string);
  res.send({
    success: true,
    supportingFiles: [],
    canUpload: true,
    userQuotaBytesAvailable: 1000000,
    quotaBytes: 9000000,
  });
});

app.get("/api/checkCredentials.php", (req: Request, res: Response) => {
  const loggedIn = req.cookies.email ? true : false;
  res.send({ loggedIn });
});

app.get(
  "/api/getCoursePermissionsAndSettings.php",
  (req: Request, res: Response) => {
    res.send({});
  },
);

app.get(
  "/api/searchPublicActivities.php",
  async (req: Request, res: Response) => {
    const query = req.query.q as string;
    res.send({
      success: true,
      searchResults: {
        users: [], // TODO - this
        activities: await searchPublicActivities(query),
      },
    });
  },
);

app.get("/api/loadPromotedContent.php", (req: Request, res: Response) => {
  res.send({
    success: true,
    carouselData: {},
  });
});

app.get(
  "/api/getActivityEditorData/:activityId",
  async (req: Request, res: Response) => {
    const activityId = Number(req.params.activityId);
    const editorData = await getActivityEditorData(activityId);
    res.send(editorData);
  },
);

app.get(
  "/api/getAllDoenetmlVersions.php",
  async (req: Request, res: Response) => {
    const allDoenetmlVersions = await getAllDoenetmlVersions();

    res.send(allDoenetmlVersions);
  },
);

app.get(
  "/api/getPortfolioActivityView/:docId",
  async (req: Request, res: Response) => {
    const docId = Number(req.params.docId);

    const viewerData = await getDocViewerData(docId);
    res.send(viewerData);
  },
);

app.get("/api/loadPromotedContentGroups.php", (req: Request, res: Response) => {
  res.send({});
});

app.post("/api/saveDoenetML.php", (req: Request, res: Response) => {
  const body = req.body;
  const doenetML = body.doenetML;
  const docId = Number(body.pageId);
  updateDoc({ docId, content: doenetML });
  res.send({ success: true });
});

app.post("/api/updateActivitySettings", (req: Request, res: Response) => {
  const body = req.body;
  const activityId = Number(body.activityId);
  const imagePath = body.imagePath;
  const name = body.name;
  // TODO - deal with learning outcomes
  const learningOutcomes = body.learningOutcomes;
  const isPublic = body.public === "true";
  const doenetmlVersionId = Number(body.doenetmlVersionId);
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

app.post(
  "/api/duplicatePortfolioActivity",
  async (req: Request, res: Response) => {
    const targetDocId = Number(req.body.docId);
    const loggedInUserId = Number(req.cookies.userId);

    let newDocId = await copyPublicActivityToPortfolio(
      targetDocId,
      loggedInUserId,
    );

    res.send({ newDocId });
  },
);

app.get(
  "/media/byPageId/:doenetId.doenet",
  async (req: Request, res: Response) => {
    const doenetId = Number(req.params.doenetId);
    const doc = await getDoc(doenetId);
    res.send(doc.contentLocation);
  },
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
