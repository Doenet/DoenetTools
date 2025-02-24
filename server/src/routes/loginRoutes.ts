import express, { Request, Response } from "express";
import passport from "passport";
import { getUserInfoFromEmail } from "../query/user";

export const loginRouter = express.Router();

// An anonymous login that will be redirected to
// when going to getAssignmentDataFromCode without being logged in.
// Redirect back to that page after anonymous user is created and logged in.
loginRouter.get(
  "/anonymId/:code",
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
  loginRouter.post(
    "/createOrLoginAsTest",
    passport.authenticate("anonymId"),
    (_req: Request, res: Response) => {
      res.send();
    },
  );
}

loginRouter.get(
  "/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
);

loginRouter.get(
  "/magiclink",
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

loginRouter.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
