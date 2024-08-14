describe("Create Folders Tests", function () {
  before(() => {});

  beforeEach(() => {});

  // TODO: this test is unfinished, but waiting until
  // the folder UI redesign
  it("create and share folder", () => {
    let code = Date.now().toString();
    const scrappyEmail = `scrappy${code}@doo`;
    const scoobyEmail = `scooby${code}@doo`;

    // create scrappy account so can share content with it
    cy.loginAsTestUser({
      email: scrappyEmail,
      firstNames: "Scrappy",
      lastNames: "Doo",
    });

    cy.loginAsTestUser({
      email: scoobyEmail,
      firstNames: "Scooby",
      lastNames: "Doo",
    });

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();
    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Folder Button"]').click();

    cy.get('[data-test="Editable Title"]').type("My new folder{enter}");
    cy.get('[data-test="Activity Link"]').click();

    cy.get('[data-test="Folder Heading"]').should(
      "contain.text",
      "My new folder",
    );

    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Folder Button"]').click();
    cy.get('[data-test="Editable Title"]').type(`Private folder${code}{enter}`);

    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Folder Button"]').click();
    cy.get('[data-test="Editable Title"]')
      .eq(1)
      .type(`Shared folder${code}{enter}`);

    cy.get('[data-test="Card Menu Button"]').eq(1).click();
    cy.get('[data-test="Share Menu Item"]').eq(1).click({ force: true });
    cy.get('[data-test="Email address"]').type(`${scrappyEmail}{enter}`);
    cy.get('[data-test="Status message"]').should("contain.text", scrappyEmail);
    cy.get('[data-test="Close Share Drawer Button"]').click();

    cy.get('[data-test="Activity Link"]').eq(1).click();
    cy.get('[data-test="Folder Heading"]').should(
      "contain.text",
      `Shared folder${code}`,
    );

    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Activity Button"]').click();

    cy.get('[data-test="Activity Name Editable"]').type(
      "Shared activity{enter}",
    );

    cy.iframe().find(".cm-editor").type(`Hello${code}!{enter}`);
    cy.iframe().find('[data-test="Viewer Update Button"]').click();
    cy.iframe().find(".doenet-viewer").should("contain.text", `Hello${code}!`);

    cy.loginAsTestUser({
      email: scrappyEmail,
    });
    cy.visit("/");

    cy.get('[data-test="Community"]').click();
    cy.get('[data-test="Search"]').type(`folder${code}{enter}`);
  });
});
