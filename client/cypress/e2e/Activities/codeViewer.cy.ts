describe("Code Viewer Tests", function () {
  it("classifications shown in code viewer", () => {
    cy.loginAsTestUser();
    cy.createActivity({
      activityName: "Classifications!",
      doenetML: "Hi!",
      classifications: [
        {
          systemShortName: "WeBWorK",
          category: "Algebra",
          subCategory: "Factoring",
          code: "Alg.F.2",
        },
        {
          systemShortName: "Common Core",
          category: "HS",
          subCategory:
            "Seeing Structure in Expressions. Write expressions in equivalent forms to solve problems.",
          code: "A.SSE.3 a.",
        },
      ],
    }).then((activityId) => {
      cy.visit(`/codeViewer/${activityId}`);

      cy.get('[data-test="Activity Information"]').click();

      cy.get('[data-test="Classifications"]').click();
      cy.get('[data-test="Classification 1"]').should(
        "contain.text",
        "A.SSE.3 a.",
      );
      cy.get('[data-test="Classification 2"]').should(
        "contain.text",
        "Alg.F.2",
      );
    });
  });
});
