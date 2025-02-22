import express, { Request, Response } from "express";
import { z } from "zod";
import { handleErrors } from "../errors/routeErrorHandler";
import { convertUUID } from "../utils/uuid";

type LoggedInUser = {
  loggedInUserId: Uint8Array;
};

export function queryLoggedIn<T extends z.ZodTypeAny>(
  query: (params: z.infer<T> & LoggedInUser) => unknown,
  schema: T,
) {
  return async (req: Request, res: Response) => {
    const loggedInUserId = req.user.userId;
    try {
      const params = schema.parse(req.body);
      const results = convertUUID(await query({ loggedInUserId, ...params }));
      res.send(results);
    } catch (e) {
      handleErrors(res, e);
    }
  };
}

export function queryNoLoggedIn<T extends z.ZodTypeAny>(
  query: (params: z.infer<T>) => unknown,
  schema: T,
) {
  return async (req: Request, res: Response) => {
    try {
      const params = schema.parse(req.body);
      const results = convertUUID(await query(params));
      res.send(results);
    } catch (e) {
      handleErrors(res, e);
    }
  };
}

export function queryNoArguments(query: () => unknown) {
  return async (req: Request, res: Response) => {
    try {
      const results = convertUUID(await query());
      res.send(results);
    } catch (e) {
      handleErrors(res, e);
    }
  };
}
