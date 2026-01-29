// Note: copied from client. Presumably there's a better way where don't have to duplicate code.

import { generateUsername } from "friendly-username-generator";

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

export function generateHandle(useRandomNumber: boolean = false) {
  const randomName = generateUsername({
    useHyphen: true,
    useRandomNumber,
  }).split("-");

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    capitalizeFirstLetter(randomName[0]) + capitalizeFirstLetter(randomName[1])
  );
}
