import type { Request, Response } from "express";
import pinoHttp from "pino-http";

type LoggableObject = Record<string, unknown>;
type RequestLoggerOptions = {
  stream?: NodeJS.WritableStream;
};

/**
 * Initialize the pino-http middleware for logging API requests.
 *
 * The middleware logs two events per API call
 * 1) a start event as soon as a request enters the API
 * 2) a completion event when the response ends
 *
 * Each log entry includes only the metadata fields we want. No sensitive data.
 */
export function initRequestLogger(options: RequestLoggerOptions = {}) {
  return pinoHttp({
    customErrorMessage() {
      return "API request completed";
    },
    customErrorObject(req, res, _err, loggableObject) {
      return getRequestEndObject(
        req as Request,
        res as Response,
        loggableObject as LoggableObject,
      );
    },
    customReceivedMessage() {
      return "API request started";
    },
    customReceivedObject(req) {
      return {
        ...getRequestMetadata(req as Request),
        event: "request_start",
      };
    },
    customSuccessMessage() {
      return "API request completed";
    },
    customSuccessObject(req, res, loggableObject) {
      return getRequestEndObject(
        req as Request,
        res as Response,
        loggableObject as LoggableObject,
      );
    },
    level: process.env.LOG_LEVEL?.trim() || "info",
    quietReqLogger: true,
    stream: options.stream,
  });
}

/**
 * Pulls the safe request fields that we want to include in every lifecycle log.
 */
function getRequestMetadata(req: Request) {
  return {
    anonymous: req.user?.isAnonymous ?? false,
    authenticated: req.user !== undefined,
    method: req.method,
    path: req.originalUrl || req.url,
  };
}

function getDurationMs(loggableObject: LoggableObject) {
  const responseTime = loggableObject.responseTime;

  return typeof responseTime === "number" ? responseTime : undefined;
}

function getRequestEndObject(
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
