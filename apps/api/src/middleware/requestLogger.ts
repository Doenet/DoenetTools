import type { NextFunction, Request, Response } from "express";
import pinoHttp from "pino-http";
import {
  getApiLoggerOptions,
  type LoggerConfigOptions,
  type LogLevel,
} from "../logging/loggerConfig";

type LoggableObject = Record<string, unknown>;
type RequestWithLogger = Request & {
  log: {
    debug: (object: Record<string, unknown>, message: string) => void;
  };
};

/**
 * Initialize the pino-http middleware for logging API requests.
 *
 * The middleware logs two events per API call
 * 1) a start event as soon as a request enters the API (level: debug)
 * 2) a completion event when the response ends (level: info/warn/error)
 *
 * Each log entry includes only the metadata fields we want. No sensitive data.
 * LOG_LEVEL controls the minimum emitted log level in both local dev and prod.
 */
export function initRequestLogger(options: LoggerConfigOptions = {}) {
  const httpLogger = pinoHttp({
    ...getApiLoggerOptions({
      ...options,
      prettyIgnore: getRequestPrettyIgnore(),
    }),
    customErrorMessage: getRequestCompletionMessage,
    customErrorObject(
      req: Request,
      res: Response,
      _err: Error,
      loggableObject: LoggableObject,
    ) {
      return getRequestCompletionObject(req, res, loggableObject);
    },
    customSuccessMessage: getRequestCompletionMessage,
    customSuccessObject(
      req: Request,
      res: Response,
      loggableObject: LoggableObject,
    ) {
      return getRequestCompletionObject(req, res, loggableObject);
    },
    customLogLevel(_req: Request, res: Response, err?: Error) {
      return getRequestCompletionLogLevel(res, err);
    },
    quietReqLogger: true,
  });

  return (req: Request, res: Response, next: NextFunction) => {
    httpLogger(req, res);
    logRequestStart(req);
    next();
  };
}

/**
 * Pulls the safe request fields that we want to include in every lifecycle log.
 */
function getRequestMetadata(req: Request) {
  return {
    anonymous: req.user?.isAnonymous ?? false,
    authenticated: req.user !== undefined,
    method: req.method,
    path: getRequestPath(req),
  };
}

function getDurationMs(loggableObject: LoggableObject) {
  const responseTime = loggableObject.responseTime;

  return typeof responseTime === "number" ? responseTime : undefined;
}

function getRequestPath(req: Request) {
  if (req.baseUrl || req.path) {
    return `${req.baseUrl}${req.path}`;
  }

  return (req.originalUrl || req.url).split("?")[0];
}

function getRequestStartMessage(req: Request) {
  return `START: ${req.method} ${getRequestPath(req)}`;
}

function getRequestCompletionMessage(req: Request, res: Response) {
  return `${res.statusCode} ${req.method} ${getRequestPath(req)}`;
}

function getRequestCompletionLogLevel(res: Response, err?: Error): LogLevel {
  if (res.statusCode >= 500 || err) {
    return "error";
  }

  if (res.statusCode >= 400) {
    return "warn";
  }

  return "info";
}

function getRequestPrettyIgnore() {
  return [
    "pid",
    "hostname",
    "event",
    "method",
    "path",
    "statusCode",
    "durationMs",
    "authenticated",
    "anonymous",
  ];
}

function logRequestStart(req: Request) {
  (req as RequestWithLogger).log.debug(
    {
      ...getRequestMetadata(req),
      event: "request_start",
    },
    getRequestStartMessage(req),
  );
}

function getRequestCompletionObject(
  req: Request,
  res: Response,
  loggableObject: LoggableObject,
) {
  return {
    ...getRequestMetadata(req),
    durationMs: getDurationMs(loggableObject),
    event: "request_end",
    statusCode: res.statusCode,
  };
}
