describe("Share panel tests", function () {
  it("cannot select incompatible license after remix, ShareAlike", () => {
    const code = Date.now().toString();
    const scrappyEmail = `scrappy${code}@doo`;
    const scoobyEmail = `scooby${code}@doo`;

    cy.loginAsTestUser({
      email: scoobyEmail,
      firstNames: "Scooby",
      lastNames: "Doo",
    });

    cy.createContent({
      name: "Share alike",
      doenetML: "Shared with ShareAlike",
    }).then((contentId) => {
      cy.visit(`/activityEditor/${contentId}`);

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

      cy.visit(`/activityViewer/${contentId}`);

      cy.get('[data-test="Add To"]').click();
      cy.get('[data-test="Add To My Activities"]').click();
      cy.get('[data-test="Go to Destination"]').click();

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
    const code = Date.now().toString();
    const scrappyEmail = `scrappy${code}@doo`;
    const scoobyEmail = `scooby${code}@doo`;

    cy.loginAsTestUser({
      email: scoobyEmail,
      firstNames: "Scooby",
      lastNames: "Doo",
    });

    cy.createContent({
      name: "Non-commercial share alike",
      doenetML: "Shared with NonCommercial-ShareAlike",
    }).then((contentId) => {
      cy.visit(`/activityEditor/${contentId}`);

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

      cy.visit(`/activityViewer/${contentId}`);

      cy.get('[data-test="Add To"]').click();
      cy.get('[data-test="Add To My Activities"]').click();
      cy.get('[data-test="Go to Destination"]').click();

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
    const code = Date.now().toString();
    const scrappyEmail = `scrappy${code}@doo`;
    const scoobyEmail = `scooby${code}@doo`;

    cy.loginAsTestUser({
      email: scoobyEmail,
      firstNames: "Scooby",
      lastNames: "Doo",
    });

    cy.createContent({
      name: "Dual license",
      doenetML: "Shared with Dual License",
    }).then((contentId) => {
      cy.visit(`/activityEditor/${contentId}`);

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

      cy.visit(`/activityViewer/${contentId}`);

      cy.get('[data-test="Add To"]').click();
      cy.get('[data-test="Add To My Activities"]').click();
      cy.get('[data-test="Go to Destination"]').click();

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

  it("Remixes shown in share panel", () => {
    const code = Date.now().toString();
    const scrappyEmail = `scrappy${code}@doo`;
    const scoobyEmail = `scooby${code}@doo`;

    cy.loginAsTestUser({
      email: scoobyEmail,
      firstNames: "Scooby",
      lastNames: "Doo",
    });

    cy.createContent({
      name: "Original activity",
      doenetML: "The original activity",
    }).then((contentId) => {
      cy.visit(`/activityEditor/${contentId}`);

      cy.get('[data-test="Sharing Button"]').click();

      cy.get('[data-test="Public Checkbox"]').click();
      cy.get('[data-test="Status message"]').should(
        "contain.text",
        "shared publicly",
      );

      cy.get('[data-test="Remix Sources Tab"]').click();
      cy.get('[data-test="Not Remixed"]').should("contain.text", "Not remixed");

      cy.get('[data-test="Remixes Tab"]').click();
      cy.get('[data-test="No Remixes"]').should(
        "contain.text",
        "No visible remixes",
      );

      cy.loginAsTestUser({
        email: scrappyEmail,
        firstNames: "Scrappy",
        lastNames: "Doo",
      });

      cy.visit(`/activityViewer/${contentId}`);

      cy.get('[data-test="Add To"]').click();
      cy.get('[data-test="Add To My Activities"]').click();
      cy.get('[data-test="Go to Destination"]').click();

      cy.get('[data-test="Card Menu Button"]').eq(0).click();
      cy.get('[data-test="Share Menu Item"]').click();

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

      cy.get('[data-test="Remix Sources Tab"]').click();

      cy.get('[data-test="Remix source 1"]').should(
        "contain.text",
        "Original activity",
      );

      cy.get('[data-test="Remixes Tab"]').click();
      cy.get('[data-test="No Remixes"]').should(
        "contain.text",
        "No visible remixes",
      );

      cy.loginAsTestUser({
        email: scoobyEmail,
      });

      cy.visit(`/activityEditor/${contentId}`);

      cy.get('[data-test="Sharing Button"]').click();

      cy.get('[data-test="Remixes Tab"]').click();
      cy.get('[data-test="Remix 1"]').should(
        "contain.text",
        "Original activity",
      );
    });
  });
});
