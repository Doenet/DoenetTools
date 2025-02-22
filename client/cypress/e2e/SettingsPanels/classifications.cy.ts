describe("Classification panel tests", function () {
  it("add classifications to activity", () => {
    cy.loginAsTestUser();

    cy.createActivity({
      activityName: "Hello!",
      doenetML: "Initial content",
    }).then((contentId) => {
      cy.visit(`/activityEditor/${contentId}`);

      cy.get('[data-test="Settings Button"]').click();

      cy.get('[data-test="Classifications"]').click();

      cy.get('[data-test="Classifications"]').should(
        "have.text",
        "Classifications (0)",
      );

      cy.get('[data-test="Search Terms"]').type("factor quadratic{enter}");

      cy.get('[data-test="Add 9.2.4.1"]').click();
      cy.get('[data-test="Add A.REI.4 b."]').click();

      cy.get('[data-test="Classifications"]').should(
        "have.text",
        "Classifications (2)",
      );

      cy.get('[data-test="Existing Classification 1"]').should(
        "have.text",
        "A.REI.4 b.",
      );
      cy.get('[data-test="Existing Classification 2"]').should(
        "have.text",
        "9.2.4.1",
      );

      cy.get('[data-test="Remove A.REI.4 b."]').click();
      cy.get('[data-test="Classifications"]').should(
        "have.text",
        "Classifications (1)",
      );
      cy.get('[data-test="Existing Classification 1"]').should(
        "have.text",
        "9.2.4.1",
      );

      cy.get('[data-test="Filter By System').select("Common Core Math");
      cy.get('[data-test="Add A.REI.4 b."]').should("be.visible");

      cy.get('[data-test="Filter By Category').select("Grade 6");
      cy.get('[data-test="Add A.REI.4 b."]').should("not.exist");

      cy.get('[data-test="Filter By Subcategory').select(2);
      cy.get('[data-test="Matching Classifications').should(
        "contain.text",
        "No matching classifications",
      );

      cy.get('[data-test="Stop Filter By Subcategory').click();

      cy.get('[data-test="Add 6.EE.2 b."]').click();
      cy.get('[data-test="Classifications"]').should(
        "have.text",
        "Classifications (2)",
      );
      cy.get('[data-test="Existing Classification 1"]').should(
        "have.text",
        "6.EE.2 b.",
      );
      cy.get('[data-test="Existing Classification 2"]').should(
        "have.text",
        "9.2.4.1",
      );

      cy.get('[data-test="Remove Existing 6.EE.2 b."]').click();
      cy.get('[data-test="Classifications"]').should(
        "have.text",
        "Classifications (1)",
      );
      cy.get('[data-test="Existing Classification 1"]').should(
        "have.text",
        "9.2.4.1",
      );

      cy.get('[data-test="Add A.REI.4 b."]').should("not.exist");
      cy.get('[data-test="Stop Filter By Category').click();
      cy.get('[data-test="Add A.REI.4 b."]').should("be.visible");

      cy.get('[data-test="Add 9.2.3.3"]').should("not.exist");
      cy.get('[data-test="Stop Filter By System').click();
      cy.get('[data-test="Add 9.2.3.3"]').scrollIntoView().should("be.visible");
    });
  });
});
