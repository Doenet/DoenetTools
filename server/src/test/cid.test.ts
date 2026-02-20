import { describe, expect, test } from "vitest";
import { cidSchema } from "../schemas/contentSchema";

describe("CID validation", () => {
  test("cidSchema rejects invalid CID format", async () => {
    // Schema validation (happens at route middleware layer via queryOptionalLoggedIn)
    // Invalid CIDs should throw zod validation errors
    await expect(
      cidSchema.parseAsync({
        cid: "not-a-valid-cid",
      }),
    ).rejects.toThrow();

    await expect(
      cidSchema.parseAsync({
        cid: "",
      }),
    ).rejects.toThrow();

    await expect(
      cidSchema.parseAsync({
        cid: "123abc",
      }),
    ).rejects.toThrow();
  });

  test("cidSchema accepts valid CIDv0 and CIDv1", async () => {
    // Valid CIDv0 format (base58btc, starts with Qm)
    const validCidV0 = "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB";
    const result1 = await cidSchema.parseAsync({ cid: validCidV0 });
    expect(result1.cid).toBe(validCidV0);

    // Valid CIDv1 format (base32, starts with b)
    const validCidV1 =
      "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
    const result2 = await cidSchema.parseAsync({ cid: validCidV1 });
    expect(result2.cid).toBe(validCidV1);
  });

  test("valid CIDv0 passes schema validation", async () => {
    // Valid CIDv0 format (base58btc, starts with Qm) should pass schema validation
    const validCidV0 = "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB";

    // First verify it passes schema validation
    const result = await cidSchema.parseAsync({ cid: validCidV0 });
    expect(result.cid).toBe(validCidV0);
  });
});
