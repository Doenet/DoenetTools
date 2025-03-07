import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export function requireLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    res.status(StatusCodes.FORBIDDEN).json({ error: "Must be logged in" });
  } else {
    next();
  }
}
