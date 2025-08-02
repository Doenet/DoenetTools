export type Uuid = string;

export function isUuid(obj: unknown): obj is Uuid {
  return typeof obj === "string";
}
