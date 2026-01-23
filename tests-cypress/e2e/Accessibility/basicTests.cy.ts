describe("Basic accessibility tests", function () {
  it("Check accessibility of home page", () => {
    cy.visit("/");

    cy.get("body").should("contain.text", "Doenet");

    cy.checkAccessibility(undefined);
  });

  it("Check accessibility of explore page", () => {
    cy.visit("/explore");

    cy.get("body").should("contain.text", "Community");

    cy.checkAccessibility(undefined);
  });
});
