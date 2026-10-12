import { describe, expect, test } from "vitest";
import { buildOperationRequest, isOperationName } from "./client.js";

describe("buildOperationRequest", () => {
  test("params may be omitted when the operation takes none", () => {
    expect(buildOperationRequest("getAssigned")).toEqual({
      method: "get",
      url: "/api/assign/getAssigned",
      query: {},
    });
  });

  test("rejects params for an operation that takes none", () => {
    // Type-checked by the build: `{}` would accept any object here, so
    // options passed in the params slot would be sent as params.
    // @ts-expect-error getAssigned takes no params
    buildOperationRequest("getAssigned", { redirectOnSuccess: "/x" });
    const extra = { anything: 1 };
    // @ts-expect-error getAssigned takes no params
    buildOperationRequest("getAssigned", extra);

    expect(buildOperationRequest("getAssigned", {})).toEqual(
      buildOperationRequest("getAssigned"),
    );
  });
});

test("isOperationName", () => {
  expect(isOperationName("getAssigned")).toBe(true);
  expect(isOperationName("toString")).toBe(false);
  expect(isOperationName("nope")).toBe(false);
});
