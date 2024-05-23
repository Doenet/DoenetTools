import express, { Express, Request, Response } from "express";
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
  addPromotedContentGroup,
  assignActivity,
  listUserAssignments,
  deleteAssignment,
  getAssignmentEditorData,
  updateAssignment,
  getAssignmentDataFromCode,
  openAssignmentWithCode,
  closeAssignmentWithCode,
  updateUser,
  loadPromotedContentGroups,
  addPromotedContent,
} from "./model";

dotenv.config();

const app: Express = express();
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3000;

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

app.get("/api/getPortfolio/:userId", async (req: Request, res: Response) => {
  const loggedInUserId = Number(req.cookies.userId);
  const userId = Number(req.params.userId);
  const activityLists = await listUserActivities(userId, loggedInUserId);
  const allDoenetmlVersions = await getAllDoenetmlVersions();

  res.send({ allDoenetmlVersions, ...activityLists });
});

app.get(
  "/api/getPublicPortfolio/:userId",
  async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const activityLists = await listUserActivities(userId, 0);

    res.send(activityLists);
  },
);

app.get("/api/getAssignments/:userId", async (req: Request, res: Response) => {
  const loggedInUserId = Number(req.cookies.userId);
  const userId = Number(req.params.userId);
  const assignmentList = await listUserAssignments(userId, loggedInUserId);

  res.send(assignmentList);
});

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

app.post("/api/addPromotedContent", async (req: Request, res: Response) => {
  const groupId = req.body.groupId;
  const activityId = req.body.activityId;
  const response = await addPromotedContent(groupId, activityId);
  res.send(response);
});


app.post("/api/addPromotedContentGroup", async (req: Request, res: Response) => {
  const groupName = req.body.groupName;
  const response = await addPromotedContentGroup(groupName);
  res.send(response);
});

app.get(
  "/api/getActivityEditorData/:activityId",
  async (req: Request, res: Response) => {
    const activityId = Number(req.params.activityId);
    const editorData = await getActivityEditorData(activityId);
    res.send(editorData);
  },
);

app.get("/api/getAllDoenetmlVersions", async (req: Request, res: Response) => {
  const allDoenetmlVersions = await getAllDoenetmlVersions();

  res.send(allDoenetmlVersions);
});

app.get("/api/getActivityView/:docId", async (req: Request, res: Response) => {
  const docId = Number(req.params.docId);

  const viewerData = await getActivityViewerData(docId);
  res.send(viewerData);
});

app.get(
  "/api/getAssignmentEditorData/:assignmentId",
  async (req: Request, res: Response) => {
    const assignmentId = Number(req.params.assignmentId);
    const editorData = await getAssignmentEditorData(assignmentId);
    res.send(editorData);
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

app.get("/api/loadPromotedContentGroups", async (req: Request, res: Response) => {
  const groups = await loadPromotedContentGroups();
  console.log(groups);
  res.send({
    success: true, //TODO: do we need this?
    carouselGroups: groups
  });
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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
