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
