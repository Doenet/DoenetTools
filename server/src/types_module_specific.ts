export type Uuid = Uint8Array;

export function isUuid(obj: unknown): obj is Uuid {
  return obj instanceof Uint8Array;
}
