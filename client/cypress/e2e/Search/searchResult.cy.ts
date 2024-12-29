describe("Search results Tests", function () {
  it("classifications shown in search", () => {
    cy.loginAsTestUser();
    const code = Date.now().toString();

    cy.createActivity({
      activityName: `Classifications${code}!`,
      doenetML: "Hi!",
      makePublic: true,
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
    }).then(() => {
      cy.visit(`/community?q=Classifications${code}`);

      cy.get('[data-test="Results All Matches"] [data-test="Card Menu Button"]')
        .eq(0)
        .click();

      cy.get(
        '[data-test="Results All Matches"] [data-test="Activity Information"]',
      )
        .eq(0)
        .click();

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
