// Note: copied from client. Presumably there's a better way where don't have to duplicate code.

import { readFileSync } from "fs";
import { join } from "path";

function loadWordList(filename: string): string[] {
  const filePath = join(process.cwd(), "assets", filename);
  return readFileSync(filePath, "utf-8")
    .split("\n")
    .map((line) => line.replace(/,\s*$/, "").trim())
    .filter((word) => word.length > 0);
}

const adjectives = loadWordList("adjectives.csv");
const trees = loadWordList("trees.csv");

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

export function generateHandle() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const tree = trees[Math.floor(Math.random() * trees.length)];
  const digits = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return adjective + tree + digits;
}
