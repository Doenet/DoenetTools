import cssesc from "cssesc";
import { ContentType } from "../types";

// since component names include a "/", escape them before using them as css identifiers
export function cesc(s: string) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === "\\#") {
    // just for convenience in case have a hash, don't escape leading #
    s = s.slice(1);
  }
  return s;
}

// In cypress tests, we need to escape the escaped component names
// for it to find them in the dom.
// Use it as cy.get(cesc2('#/component_name))
export function cesc2(s: string) {
  return cesc(cesc(s));
}

/**
 * The url for this content's editor page
 * Default tab is `edit`, but you can specify a different one.
 * You can also specify that you want the special curator mode which
 * gives library editors their special controls.
 */
export function editorUrl(
  contentId: string,
  contentType: ContentType,
  tabPath:
    | "edit"
    | "view"
    | "settings"
    | "history"
    | "remixes"
    | "library" = "edit",
  inCurateMode = false,
) {
  return `/${contentType === "singleDoc" ? "documentEditor" : "compoundEditor"}/${contentId}/${tabPath}${inCurateMode ? "?curate" : ""}`;
}
