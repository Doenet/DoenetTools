import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { findOrCreateUser, listUserDocs } from "./model";

dotenv.config();

const app: Express = express();
app.use(cookieParser());
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/api/getQuickCheckSignedIn.php", (req: Request, res: Response) => {
  const signedIn = req.cookies.email ? true : false;
  res.send({ signedIn: signedIn });
});

app.get("/api/getPorfolioCourseId.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/loadPromotedContent.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/checkForCommunityAdmin.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/loadProfile.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/getPortfolio.php", async (req: Request, res: Response) => {
  const loggedInEmail = req.cookies.email;
  const loggedInUserId = Number(req.cookies.userId);
  const ret = await listUserDocs(loggedInUserId);
  res.send(ret);
});

app.get("/api/sendSignInEmail.php", async (req: Request, res: Response) => {
  const email: string = req.query.emailaddress as string;
  console.log(req.query);
  console.log(email);
  const userId = await findOrCreateUser(email);
  res.cookie("email", email);
  res.cookie("userId", String(userId));
  res.send({ success: true });
});

app.get("/api/deletePortfolioActivity.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/createPortfolioActivity.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/updatePortfolioActivityLabel.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/updateIsPublicActivity.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/loadSupportingFileInfo.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/checkCredentials.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/getCoursePermissionsAndSettings.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/searchPublicActivities.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/getPortfolioEditorData.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/getAllDoenetmlVersions.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/loadProfile.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/getPortfolioActivityView.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/getPorfolioCourseId.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/loadPromotedContentGroups.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/saveDoenetML.php", (req: Request, res: Response) => {
  res.send({});
});

app.get("/api/updatePortfolioActivitySettings.php", (req: Request, res: Response) => {
  res.send({});
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
