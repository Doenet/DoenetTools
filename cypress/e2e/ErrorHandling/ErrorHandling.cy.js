describe("error handling tests", function () {
  it("Invalid link", () => {
    cy.visit("hmm");

    cy.get("body").should("contain.text", "not found");

    cy.contains("Home").click();

    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
