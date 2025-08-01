import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, z } from "zod";
import {
  InvalidRequestError,
  PermissionDeniedRedirectError,
} from "../utils/error";
import { Prisma } from "@prisma/client";

export function handleErrors(res: Response, e: unknown) {
  if (e instanceof ZodError) {
    const errorMessages = z.prettifyError(e);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid data", details: errorMessages });
  } else if (e instanceof InvalidRequestError) {
    res
      .status(e.errorCode)
      .json({ error: "Invalid request", details: e.message });
  } else if (e instanceof PermissionDeniedRedirectError) {
    res.status(e.errorCode).json({
      error: "Permission denied but can redirect",
      details: e.message,
    });
  } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2001" || e.code === "P2003" || e.code === "P2025") {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Not found" });
    } else if (e.code === "P2002") {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid request" });
    } else {
      console.error(e);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  } else {
    console.error(e);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
}
