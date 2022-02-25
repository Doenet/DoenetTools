import base32 from '../../_snowpack/pkg/hi-base32.js';


export async function CIDFromDoenetML(doenetML) {

  let encoder = new TextEncoder();
  let data = encoder.encode(doenetML);

  return await CIDFromArrayBuffer(data);

}

export async function CIDFromArrayBuffer(data) {

  let hashBuffer = await crypto.subtle.digest("SHA-256", data);

  let CIDArray = new Uint8Array(36);

  // 0x01: cidV1
  // 0x55: raw binary IPLD
  // 0x12: code for SHA256
  // 0x20: 32 bytes (or 256 bits)
  CIDArray.set([0x01, 0x55, 0x12, 0x20]);

  CIDArray.set(new Uint8Array(hashBuffer), 4);

  // b: prefix for base 32
  // base32: hi-base uses RFC 4648 encoding
  // CID uses lowercase letter and does not include the padding at the end
  let CID = 'b' + base32.encode(CIDArray).toLowerCase().replace(/=+/, "");

  return CID;

}
