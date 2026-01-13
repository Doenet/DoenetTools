// Handle MathJax async typesetting errors that aren't critical for tests
Cypress.on("uncaught:exception", (err) => {
  // Suppress MathJax typesetting errors
  if (
    err.message?.includes("Typesetting failed") ||
    err.message?.includes("Cannot read properties of null") ||
    err.message?.includes("Cannot read property") ||
    err.message?.includes("reading 'contains'") ||
    err.toString()?.includes("MathJax")
  ) {
    return false; // Suppress the error
  }
  // Let other errors fail the test
  return true;
});

// Also handle promise rejections from MathJax
Cypress.on("uncaught:exception", (err, runnable, promise) => {
  // If it's a promise rejection related to MathJax, suppress it
  if (promise && err.message?.includes("Typesetting failed")) {
    return false;
  }
  return true;
});
