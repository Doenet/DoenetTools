import { Request, Response } from "express";
import { z } from "zod";
import { handleErrors } from "../errors/routeErrorHandler";
import { convertUUID } from "../utils/uuid";

type LoggedInUser = {
  loggedInUserId: Uint8Array;
};

type OptionalLoggedInUser = {
  loggedInUserId?: Uint8Array;
};

export function queryLoggedIn<T extends z.ZodTypeAny>(
  query: (params: z.infer<T> & LoggedInUser) => unknown,
  schema: T,
) {
  return async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const params = schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      const results = convertUUID(await query({ loggedInUserId, ...params }));
      res.send(results);
    } catch (e) {
      handleErrors(res, e);
    }
  };
}

export function queryOptionalLoggedIn<T extends z.ZodTypeAny>(
  query: (params: z.infer<T> & OptionalLoggedInUser) => unknown,
  schema: T,
) {
  return async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user?.userId;
      const params = schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      const results = convertUUID(await query({ loggedInUserId, ...params }));
      res.send(results);
    } catch (e) {
      handleErrors(res, e);
    }
  };
}

export function queryLoggedInNoArguments(
  query: (params: LoggedInUser) => unknown,
) {
  return async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.user.userId;
      const results = convertUUID(await query({ loggedInUserId }));
      res.send(results);
    } catch (e) {
      handleErrors(res, e);
    }
  };
}

export function queryNoLoggedInNoArguments(query: () => unknown) {
  return async (_req: Request, res: Response) => {
    try {
      const results = convertUUID(await query());
      res.send(results);
    } catch (e) {
      handleErrors(res, e);
    }
  };
}
