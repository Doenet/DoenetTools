import express, { Request, Response } from "express";
import passportLib from "passport";
import { getUserInfoFromEmail } from "../query/user";
import axios from "axios";

// Type assertion to work around passport type declaration issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const passport = passportLib as any;

export const loginRouter = express.Router();

if (
  process.env.ALLOW_TEST_LOGIN &&
  process.env.ALLOW_TEST_LOGIN.toLocaleLowerCase() !== "false"
) {
  loginRouter.post(
    "/createOrLoginAsTest",
    passport.authenticate("anonymous"),
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

loginRouter.post(
  "/handle",
  passport.authenticate("local", {
    failureRedirect: "/login", // Redirect on failed login
  }),
  function (req, res) {
    console.log("req body");
    console.log(req.body);
    res.redirect("/");
  },
);

loginRouter.post(
  "/anonymous",
  passport.authenticate("anonymous"),
  (req: Request, res: Response) => {
    res.send(req.user);
  },
);

loginRouter.get(
  "/logout",
  async function (req, _res, next) {
    if (req.user) {
      try {
        const { data: discourseUser } = await axios.get(
          `${process.env.DISCOURSE_URL}/u/by-external/${req.user.userId}.json`,
          {
            headers: {
              "Api-Key": process.env.DISCOURSE_API_KEY || "",
              "Api-Username": process.env.DISCOURSE_API_USERNAME || "",
            },
          },
        );
        const discourseUserId = discourseUser.user.id;

        await axios.post(
          // https://{defaultHost}/admin/users/{id}/log_out.json
          `${process.env.DISCOURSE_URL}/admin/users/${discourseUserId}/log_out.json`,
          {},
          {
            headers: {
              "Api-Key": process.env.DISCOURSE_API_KEY || "",
              "Api-Username": process.env.DISCOURSE_API_USERNAME || "",
            },
          },
        );
      } catch (error) {
        console.error(`Failed to logout of Discourse: ${error}`);
      }
    }
    return next();
  },
  function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
);
