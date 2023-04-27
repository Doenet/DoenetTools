import cssesc from "cssesc";

// since component names include a "/", escape them before using them as css identifiers
export function cesc(s) {
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
export function cesc2(s) {
  return cesc(cesc(s));
}
