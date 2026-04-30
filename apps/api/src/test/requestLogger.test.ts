import { EventEmitter } from "node:events";
import { Writable } from "node:stream";
import type { Request, Response } from "express";
import { afterEach, describe, expect, test } from "vitest";
import { initRequestLogger } from "../middleware/requestLogger";

class MockResponse extends EventEmitter {
  err?: Error;
  statusCode = 200;
  writableEnded = false;
}

const originalLogLevel = process.env.LOG_LEVEL;

function createMockRequest(overrides: Partial<Request> = {}) {
  return {
    baseUrl: "/api",
    method: "GET",
    originalUrl: "/api/health",
    path: "/health",
    url: "/health",
    ...overrides,
  } as Request;
}

function createLogCapture() {
  const lines: string[] = [];
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      lines.push(chunk.toString());
      callback();
    },
  });

  return { lines, stream };
}

function parseLogs(lines: string[]) {
  return lines.map((line) => JSON.parse(line));
}

describe("initRequestLogger", () => {
  afterEach(() => {
    if (originalLogLevel === undefined) {
      delete process.env.LOG_LEVEL;
      return;
    }

    process.env.LOG_LEVEL = originalLogLevel;
  });

  test("defaults to info and suppresses the debug start log", () => {
    delete process.env.LOG_LEVEL;

    const { lines, stream } = createLogCapture();
    const middleware = initRequestLogger({ stream });
    const req = createMockRequest();
    const mockResponse = new MockResponse();
    const res = mockResponse as unknown as Response;

    middleware(req, res, () => {});

    mockResponse.statusCode = 204;
    mockResponse.writableEnded = true;
    mockResponse.emit("finish");

    const [endLog] = parseLogs(lines);

    expect(lines).toHaveLength(1);
    expect(endLog).toMatchObject({
      event: "request_end",
      level: 30,
      msg: "204 GET /api/health",
      statusCode: 204,
    });
    expect(endLog.durationMs).toBeGreaterThanOrEqual(0);
  });

  test("emits the request start log when LOG_LEVEL=debug", () => {
    process.env.LOG_LEVEL = "debug";

    const { lines, stream } = createLogCapture();
    const middleware = initRequestLogger({ stream });
    const req = createMockRequest({
      method: "POST",
      originalUrl: "/api/login/anonymous?token=secret",
      path: "/login/anonymous",
      url: "/login/anonymous?token=secret",
      user: { isAnonymous: true } as Request["user"],
    });
    const mockResponse = new MockResponse();
    const res = mockResponse as unknown as Response;

    middleware(req, res, () => {});

    mockResponse.statusCode = 200;
    mockResponse.writableEnded = true;
    mockResponse.emit("finish");

    const [startLog, endLog] = parseLogs(lines);

    expect(startLog).toMatchObject({
      anonymous: true,
      authenticated: true,
      event: "request_start",
      method: "POST",
      path: "/api/login/anonymous",
    });
    expect(endLog).toMatchObject({
      anonymous: true,
      authenticated: true,
      event: "request_end",
      level: 30,
      method: "POST",
      msg: "200 POST /api/login/anonymous",
      path: "/api/login/anonymous",
      statusCode: 200,
    });
  });

  test("logs 4xx responses at warn", () => {
    delete process.env.LOG_LEVEL;

    const { lines, stream } = createLogCapture();
    const middleware = initRequestLogger({ stream });
    const req = createMockRequest({
      originalUrl: "/api/content/not-found?token=super-secret",
      path: "/content/not-found",
      url: "/content/not-found?token=super-secret",
    });
    const mockResponse = new MockResponse();
    const res = mockResponse as unknown as Response;

    middleware(req, res, () => {});

    mockResponse.statusCode = 404;
    mockResponse.writableEnded = true;
    mockResponse.emit("finish");

    const [endLog] = parseLogs(lines);

    expect(lines).toHaveLength(1);
    expect(endLog).toMatchObject({
      event: "request_end",
      level: 40,
      msg: "404 GET /api/content/not-found",
      path: "/api/content/not-found",
      statusCode: 404,
    });
  });

  test("uses a failure-specific completion message for errored requests", () => {
    delete process.env.LOG_LEVEL;

    const { lines, stream } = createLogCapture();
    const middleware = initRequestLogger({ stream });
    const req = createMockRequest({
      originalUrl: "/api/login/magic?token=super-secret",
      path: "/login/magic",
      url: "/login/magic?token=super-secret",
    });
    const mockResponse = new MockResponse();
    const res = mockResponse as unknown as Response;

    middleware(req, res, () => {});

    mockResponse.err = new Error("boom");
    mockResponse.statusCode = 500;
    mockResponse.writableEnded = true;
    mockResponse.emit("finish");

    const [endLog] = parseLogs(lines);

    expect(endLog).toMatchObject({
      event: "request_end",
      level: 50,
      msg: "500 GET /api/login/magic",
      path: "/api/login/magic",
      statusCode: 500,
    });
  });
});
