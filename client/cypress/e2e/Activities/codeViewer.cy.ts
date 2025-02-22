describe("Code Viewer Tests", function () {
  it("classifications shown in code viewer", () => {
    cy.loginAsTestUser();
    cy.createActivity({
      activityName: "Classifications!",
      doenetML: "Hi!",
      classifications: [
        {
          systemShortName: "HS/C Math",
          category: "Algebra",
          subCategory: "Factoring",
          code: "Alg.F.2",
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
      cy.visit(`/codeViewer/${contentId}`);

      cy.get('[data-test="Activity Information"]').click();

      cy.get('[data-test="Classifications"]').click();
      cy.get('[data-test="Classification 1"]').should(
        "contain.text",
        "Alg.F.2",
      );
      cy.get('[data-test="Classification 2"]').should(
        "contain.text",
        "A.SSE.3 a.",
      );
    });
  });
});
