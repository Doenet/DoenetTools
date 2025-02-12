// Copied from doenetml utils.
// Currently also duplicated in server.

import base32 from "hi-base32";

export async function cidFromText(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  return await cidFromArrayBuffer(data);
}

export async function cidFromArrayBuffer(data: Uint8Array) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const cidArray = new Uint8Array(36);

  // 0x01: cidV1
  // 0x55: raw binary IPLD
  // 0x12: code for SHA256
  // 0x20: 32 bytes (or 256 bits)
  cidArray.set([0x01, 0x55, 0x12, 0x20]);

  cidArray.set(new Uint8Array(hashBuffer), 4);

  // b: prefix for base 32
  // base32: hi-base uses RFC 4648 encoding
  // cid uses lowercase letter and does not include the padding at the end
  const cid = "b" + base32.encode(cidArray).toLowerCase().replace(/=+/, "");

  return cid;
}
