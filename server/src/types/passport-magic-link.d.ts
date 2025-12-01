/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy as PassportStrategy } from "passport";
import { Request } from "express";

declare module "passport-magic-link" {
  // Options interface for the MagicLinkStrategy
  interface MagicLinkStrategyOptions {
    secret: string;
    userFields: string[];
    tokenField: string;
    ttl?: number;
    passReqToCallbacks?: boolean;
    verifyUserAfterToken?: boolean;
    storage?: TokenStorage;
    allowReuse?: boolean;
    userPrimaryKey?: string;
    tokenAlreadyUsedMessage?: string;
  }

  // Interface for the token storage
  interface TokenStorage {
    store: (key: string, value: string, ttl: number) => Promise<void>;
    retrieve: (key: string) => Promise<string | null>;
    delete: (key: string) => Promise<void>;
  }

  // Callback function type for sending token
  type SendTokenCallback = (
    user: any,
    token: string,
    req?: Request,
  ) => Promise<void>;

  // Callback function type for verifying user
  // The callback signature depends on passReqToCallbacks and verifyUserAfterToken options:
  // - If passReqToCallbacks=false & verifyUserAfterToken=false: (userFields) => any
  // - If passReqToCallbacks=true & verifyUserAfterToken=false: (req, userFields) => any
  // - If passReqToCallbacks=false & verifyUserAfterToken=true: (user) => any
  // - If passReqToCallbacks=true & verifyUserAfterToken=true: (req, user) => any
  type VerifyUserCallback = (userOrReq: any, userFields?: any) => any;

  // The MagicLinkStrategy class
  class Strategy extends PassportStrategy {
    constructor(
      options: MagicLinkStrategyOptions,
      sendToken: SendTokenCallback,
      verifyUser: VerifyUserCallback,
    );

    authenticate(req: Request, options?: object): void;
  }
}

// allow magiclink-specific options when using "google" strategy
declare module "passport" {
  interface AuthenticateOptions {
    action?: string;
    userPrimaryKey?: string;
  }

  interface Authenticator {
    authenticate(
      strategy: "magiclink",
      options: { action: string },
      callback?: (...args: any[]) => any,
    ): any;
    authorize(
      strategy: "magiclink",
      options: { action: string },
      callback?: (...args: any[]) => any,
    ): any;
  }
}
