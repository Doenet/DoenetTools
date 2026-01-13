// Handle MathJax async typesetting errors that aren't critical for tests
Cypress.on("uncaught:exception", (err, runnable) => {
  const errorMessage = err.message || err.toString();

  // Suppress MathJax typesetting errors
  if (errorMessage.includes("Typesetting failed")) {
    return false; // Suppress the error
  }

  // Let other errors fail the test
  return true;
});

// Suppress unhandled promise rejections from MathJax after page load
beforeEach(() => {
  cy.window().then((win) => {
    win.addEventListener("unhandledrejection", (event: any) => {
      const reason = event.reason || {};
      const message = reason?.message || reason?.toString() || "";

      // Suppress MathJax typesetting errors
      if (message.includes("Typesetting failed")) {
        event.preventDefault(); // Prevent the error from propagating
      }
    });
  });
});
