describe("Basic accessibility tests", function () {
  it("Check accessibility of home page", () => {
    cy.visit("/");

    cy.get("body").should("contain.text", "Doenet");

    cy.checkAccessibility(undefined, {
      //   // @ts-expect-error - wick-a11y extends cypress-axe options
      //   onlyWarnImpacts: ["moderate", "minor"],
    });
  });
});
