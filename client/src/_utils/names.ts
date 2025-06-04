import { UserInfo } from "./types";

/**
 * Concatenate optional firstNames and required lastNames
 * to form fullName
 */
export function createNameNoCurateTag({
  firstNames,
  lastNames,
}: {
  firstNames: string | null;
  lastNames: string;
}) {
  return (firstNames ? firstNames + " " : "") + lastNames;
}

export function createNameCheckCurateTag(user: UserInfo) {
  return createNameNoCurateTag(user) + (user.isMaskForLibrary ? " (curated)" : "");
}

/**
 * Concatenate required lastNames and optional firstNames with comma
 */
export function lastNameFirst({
  firstNames,
  lastNames,
}: {
  firstNames: string | null;
  lastNames: string;
}) {
  return lastNames + (firstNames ? ", " + firstNames : "");
}
