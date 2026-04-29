import { EventEmitter } from "node:events";
import { Writable } from "node:stream";
import type { Request, Response } from "express";
import { describe, expect, test } from "vitest";
import { initRequestLogger } from "../middleware/requestLogger";

class MockResponse extends EventEmitter {
  statusCode = 200;
  writableEnded = false;
}

function createMockRequest(overrides: Partial<Request> = {}) {
  return {
    method: "GET",
    originalUrl: "/api/health",
    url: "/api/health",
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
  test("logs request start at debug and request end at info", () => {
    const { lines, stream } = createLogCapture();
    const middleware = initRequestLogger({ stream });
    const req = createMockRequest();
    const mockResponse = new MockResponse();
    const res = mockResponse as unknown as Response;

    middleware(req, res, () => {});

    mockResponse.statusCode = 204;
    mockResponse.writableEnded = true;
    mockResponse.emit("finish");

    const [startLog, endLog] = parseLogs(lines);

    expect(startLog).toMatchObject({
      anonymous: false,
      authenticated: false,
      event: "request_start",
      level: 20,
      method: "GET",
      msg: "API request started",
      path: "/api/health",
    });
    expect(endLog).toMatchObject({
      event: "request_end",
      level: 30,
      msg: "API request completed",
      statusCode: 204,
    });
    expect(endLog.durationMs).toBeGreaterThanOrEqual(0);
  });

  test("includes safe authenticated request metadata in both lifecycle logs", () => {
    const { lines, stream } = createLogCapture();
    const middleware = initRequestLogger({ stream });
    const req = createMockRequest({
      method: "POST",
      originalUrl: "/api/login/anonymous",
      url: "/api/login/anonymous",
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
      method: "POST",
      path: "/api/login/anonymous",
      statusCode: 200,
    });
  });
});
