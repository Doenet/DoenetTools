import { UserInfo } from "./types";

/**
 * Concatenate optional firstNames and required lastNames
 * to form fullName
 */
export function createFullName({
  firstNames,
  lastNames,
}: {
  firstNames: string | null;
  lastNames: string;
}) {
  return (firstNames ? firstNames + " " : "") + lastNames;
}

export function createFullNameCheckCurated(user: UserInfo) {
  return createFullName(user) + (user.isMaskForLibrary ? " (curated)" : "");
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
