describe("Classifications test", function () {
  it("cannot select incompatible license after remix, ShareAlike", () => {
    let code = Date.now().toString();
    const scrappyEmail = `scrappy${code}@doo`;
    const scoobyEmail = `scooby${code}@doo`;

    cy.loginAsTestUser({
      email: scoobyEmail,
      firstNames: "Scooby",
      lastNames: "Doo",
    });

    cy.createActivity({
      activityName: "Share alike",
      doenetML: "Shared with ShareAlike",
    }).then((activityId) => {
      cy.visit(`/activityEditor/${activityId}`);

      cy.get('[data-test="Sharing Button"]').click();

      cy.get('[data-test="Public Checkbox"]').click();
      cy.get('[data-test="Status message"]').should(
        "contain.text",
        "shared publicly",
      );

      cy.get('[data-test="Select License"]').select(
        "Creative Commons Attribution-ShareAlike 4.0",
      );
      cy.get('[data-test="Status message"]').should(
        "contain.text",
        "changed license",
      );

      cy.loginAsTestUser({
        email: scrappyEmail,
        firstNames: "Scrappy",
        lastNames: "Doo",
      });

      cy.visit(`/activityViewer/${activityId}`);
      cy.get('[data-test="Copy to Activities Button"]').click();
      cy.get('[data-test="Go to Activities"]').click();

      cy.get('[data-test="Card Menu Button"]').eq(0).click();
      cy.get('[data-test="Share Menu Item"]').click();

      cy.get('[data-test="Cannot Change License"]').should(
        "contain.text",
        "Creative Commons Attribution-ShareAlike 4.0",
      );
      cy.get('[data-test="Cannot Change License"]').should(
        "contain.text",
        "Cannot change license",
      );
      cy.get('[data-test="Select License"]').should("not.exist");
    });
  });

  it("cannot select incompatible license after remix, NonCommercial-ShareAlike", () => {
    let code = Date.now().toString();
    const scrappyEmail = `scrappy${code}@doo`;
    const scoobyEmail = `scooby${code}@doo`;

    cy.loginAsTestUser({
      email: scoobyEmail,
      firstNames: "Scooby",
      lastNames: "Doo",
    });

    cy.createActivity({
      activityName: "Non-commercial share alike",
      doenetML: "Shared with NonCommercial-ShareAlike",
    }).then((activityId) => {
      cy.visit(`/activityEditor/${activityId}`);

      cy.get('[data-test="Sharing Button"]').click();

      cy.get('[data-test="Public Checkbox"]').click();
      cy.get('[data-test="Status message"]').should(
        "contain.text",
        "shared publicly",
      );

      cy.get('[data-test="Select License"]').select(
        "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
      );
      cy.get('[data-test="Status message"]').should(
        "contain.text",
        "changed license",
      );

      cy.loginAsTestUser({
        email: scrappyEmail,
        firstNames: "Scrappy",
        lastNames: "Doo",
      });

      cy.visit(`/activityViewer/${activityId}`);
      cy.get('[data-test="Copy to Activities Button"]').click();
      cy.get('[data-test="Go to Activities"]').click();

      cy.get('[data-test="Card Menu Button"]').eq(0).click();
      cy.get('[data-test="Share Menu Item"]').click();

      cy.get('[data-test="Cannot Change License"]').should(
        "contain.text",
        "Creative Commons Attribution-NonCommercial-ShareAlike 4.0",
      );
      cy.get('[data-test="Cannot Change License"]').should(
        "contain.text",
        "Cannot change license",
      );
      cy.get('[data-test="Select License"]').should("not.exist");
    });
  });

  it("can select license after remix, Dual License", () => {
    let code = Date.now().toString();
    const scrappyEmail = `scrappy${code}@doo`;
    const scoobyEmail = `scooby${code}@doo`;

    cy.loginAsTestUser({
      email: scoobyEmail,
      firstNames: "Scooby",
      lastNames: "Doo",
    });

    cy.createActivity({
      activityName: "Dual license",
      doenetML: "Shared with Dual License",
    }).then((activityId) => {
      cy.visit(`/activityEditor/${activityId}`);

      cy.get('[data-test="Sharing Button"]').click();

      cy.get('[data-test="Public Checkbox"]').click();
      cy.get('[data-test="Status message"]').should(
        "contain.text",
        "shared publicly",
      );

      cy.get('[data-test="Select License"]').should(
        "contain.text",
        "Dual license Creative Commons Attribution-ShareAlike 4.0 OR Attribution-NonCommercial-ShareAlike 4.0",
      );

      cy.loginAsTestUser({
        email: scrappyEmail,
        firstNames: "Scrappy",
        lastNames: "Doo",
      });

      cy.visit(`/activityViewer/${activityId}`);
      cy.get('[data-test="Copy to Activities Button"]').click();
      cy.get('[data-test="Go to Activities"]').click();

      cy.get('[data-test="Card Menu Button"]').eq(0).click();
      cy.get('[data-test="Share Menu Item"]').click();

      cy.get('[data-test="Select License"]').select(
        "Creative Commons Attribution-ShareAlike 4.0",
      );
      cy.get('[data-test="Status message"]').should(
        "contain.text",
        "changed license",
      );
    });
  });
});
