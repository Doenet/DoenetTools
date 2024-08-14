/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy as PassportStrategy } from "passport";

declare module "passport-magic-link" {
  import { Request } from "express";

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
  type VerifyUserCallback = (req: Request) => Promise<any>;

  // The MagicLinkStrategy class
  class Strategy extends PassportStrategy {
    constructor(
      options: MagicLinkStrategyOptions,
      sendToken: SendTokenCallback,
      verifyUser: VerifyUserCallback,
    );

    authenticate(req: Request, options?: object): void;
  }

  export {
    Strategy,
    MagicLinkStrategyOptions,
    TokenStorage,
    SendTokenCallback,
    VerifyUserCallback,
  };
}

// allow magiclink-specific options when using "google" strategy
declare module "passport" {
  interface AuthenticateOptions {
    action?: string;
    userPrimaryKey?: string;
  }

  interface Authenticator<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    InitializeRet = express.Handler,
    AuthenticateRet = any,
    AuthorizeRet = AuthenticateRet,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    AuthorizeOptions = passport.AuthenticateOptions,
  > {
    authenticate(
      strategy: "magiclink",
      options: { action: string },
      callback?: (...args: any[]) => any,
    ): AuthenticateRet;
    authorize(
      strategy: "magiclink",
      options: { action: string },
      callback?: (...args: any[]) => any,
    ): AuthorizeRet;
  }
}
