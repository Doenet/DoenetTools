import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { asyncPassport } from "./asyncPassport";

type Done = (err: unknown, result?: unknown) => void;
type GoogleProfile = { name?: { givenName: string } };

describe("asyncPassport", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("passes through a successful result", async () => {
    const done = vi.fn();
    const wrapped = asyncPassport("ok", async (value: string, cb: Done) => {
      cb(null, value.toUpperCase());
    });

    wrapped("hi" as never, done as never);
    await vi.waitFor(() => expect(done).toHaveBeenCalledWith(null, "HI"));
  });

  it("routes a rejection to done(err) instead of letting it escape", async () => {
    const done = vi.fn();
    const boom = new Error("boom");
    const wrapped = asyncPassport("rejects", async (_cb: Done) => {
      throw boom;
    });

    wrapped(done as never);
    await vi.waitFor(() => expect(done).toHaveBeenCalledTimes(1));
    expect(done.mock.calls[0][0]).toBe(boom);
  });

  it("catches the exact production failure: reading a field off an absent profile", async () => {
    // Google omits `name` entirely when the account has neither given nor
    // family name, which crashed the server on 2026-08-23.
    const done = vi.fn();
    const profile: GoogleProfile = {};
    const wrapped = asyncPassport(
      "google",
      async (user: GoogleProfile, _cb: Done) => {
        return user.name!.givenName;
      },
    );

    wrapped(profile as never, done as never);
    await vi.waitFor(() => {
      expect(done).toHaveBeenCalledTimes(1);
      expect(done.mock.calls[0][0]).toBeInstanceOf(TypeError);
    });
  });

  it("catches synchronous throws from a non-async handler", async () => {
    const done = vi.fn();
    const throwsSync = (_cb: Done): Promise<unknown> => {
      throw new Error("sync boom");
    };
    const wrapped = asyncPassport("sync", throwsSync);

    wrapped(done as never);
    await vi.waitFor(() => expect(done).toHaveBeenCalledTimes(1));
  });

  it("does not call done twice when a handler succeeds and then throws", async () => {
    const done = vi.fn();
    const wrapped = asyncPassport("late-throw", async (cb: Done) => {
      cb(null, "first");
      throw new Error("after the fact");
    });

    wrapped(done as never);
    await vi.waitFor(() => expect(done).toHaveBeenCalledTimes(1));
    expect(done).toHaveBeenCalledWith(null, "first");
  });

  it("throws immediately if the last argument is not a callback", () => {
    const wrapped = asyncPassport("bad-args", async (_cb: Done) => {});
    expect(() => wrapped("not-a-function" as never)).toThrow(TypeError);
  });
});
