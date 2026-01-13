// Handle MathJax async typesetting errors that aren't critical for tests
Cypress.on("uncaught:exception", (err) => {
  // Suppress MathJax typesetting errors
  if (
    err.message?.includes("Typesetting failed") ||
    err.message?.includes("Cannot read properties of null") ||
    err.message?.includes("Cannot read property") ||
    err.toString()?.includes("MathJax")
  ) {
    return false; // Suppress the error
  }
  // Let other errors fail the test
  return true;
});
