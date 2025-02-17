describe("Navigate Explore Tests", function () {
  it("remember explore's current tab", () => {
    cy.loginAsTestUser({ isAdmin: true });

    // make sure library contains at least one item
    cy.createActivity({
      activityName: "Hello!",
      doenetML: "Initial content",
      makePublic: true,
      publishInLibrary: true,
    }).then(() => {
      cy.visit(`/explore`);

      // initially curated tab is selected
      cy.get('[data-test="Curated Tab"]').should(
        "have.attr",
        "aria-selected",
        "true",
      );
      cy.get('[data-test="Community Tab"]').should(
        "have.attr",
        "aria-selected",
        "false",
      );

      // select community tab
      cy.get('[data-test="Community Tab"]').click();
      cy.get('[data-test="Community Tab"]').should(
        "have.attr",
        "aria-selected",
        "true",
      );
      cy.get('[data-test="Curated Tab"]').should(
        "have.attr",
        "aria-selected",
        "false",
      );

      cy.get('[data-test="Home"]').click();
      cy.get('[data-test="Home"]').should("have.attr", "aria-current", "page");
      cy.get('[data-test="Explore"]').should("not.have.attr", "aria-current");

      cy.get('[data-test="Explore"]').click();
      cy.get('[data-test="Explore"]').should(
        "have.attr",
        "aria-current",
        "page",
      );
      cy.get('[data-test="Home"]').should("not.have.attr", "aria-current");

      // community tab is still selected
      cy.get('[data-test="Community Tab"]').should(
        "have.attr",
        "aria-selected",
        "true",
      );
      cy.get('[data-test="Curated Tab"]').should(
        "have.attr",
        "aria-selected",
        "false",
      );
    });
  });
});
