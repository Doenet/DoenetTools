// Handle MathJax async typesetting errors that aren't critical for tests
Cypress.on("uncaught:exception", (err) => {
  // Suppress MathJax typesetting errors
  if (err.message?.includes("Typesetting failed")) {
    return false; // Suppress the error
  }

  // Let other errors fail the test
  return true;
});
