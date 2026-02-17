describe("Activity Viewer Tests", { tags: ["@group1"] }, function () {
  it("classifications shown in activity viewer", () => {
    cy.loginAsTestUser();
    cy.createContent({
      name: "Classifications!",
      doenetML: "Hi!",
      classifications: [
        {
          systemShortName: "HS/C Math",
          category: "Algebra",
          subCategory: "Factoring",
          code: "Alg.FA.2",
        },
        {
          systemShortName: "CC Math",
          category: "HS",
          subCategory:
            "Seeing Structure in Expressions. Write expressions in equivalent forms to solve problems.",
          code: "A.SSE.3 a.",
        },
      ],
    }).then((contentId) => {
      cy.visit(`/activityViewer/${contentId}`);

      cy.get('[data-test="Classifications Footer"]').should(
        "contain.text",
        "Alg.FA.2",
      );
      cy.get('[data-test="Classifications Footer"]').should(
        "contain.text",
        "A.SSE.3 a.",
      );
      cy.get('[data-test="Classifications Footer"]').click();

      cy.get('[data-test="Classification 1"]').should(
        "contain.text",
        "Alg.FA.2",
      );
      cy.get('[data-test="Classification 2"]').should(
        "contain.text",
        "A.SSE.3 a.",
      );

      cy.get('[data-test="Close Settings Button"]').click();
      cy.get('[data-test="Classification 1"]').should("not.exist");

      cy.get('[data-test="Info Button"]').click();

      cy.get('[data-test="Classifications"]').click();
      cy.get('[data-test="Classification 1"]').should(
        "contain.text",
        "Alg.FA.2",
      );
      cy.get('[data-test="Classification 2"]').should(
        "contain.text",
        "A.SSE.3 a.",
      );
    });
  });
});
