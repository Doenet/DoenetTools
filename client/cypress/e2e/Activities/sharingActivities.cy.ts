describe("Share Activities Tests", function () {
  before(() => {});

  beforeEach(() => {});

  it("create, share, and copy public activity", () => {
    let code = Date.now().toString();
    const scrappyEmail = `scrappy${code}@doo`;
    const scoobyEmail = `scooby${code}@doo`;

    cy.loginAsTestUser({
      email: scoobyEmail,
      firstNames: "Scooby",
      lastNames: "Doo",
    });

    cy.visit("/");

    cy.get('[data-test="Activities"]').click();
    cy.get('[data-test="New Button"]').click();
    cy.get('[data-test="Add Activity Button"]').click();

    cy.get('[data-test="Editable Title"]').type(
      `My new activity${code}{enter}`,
    );

    cy.iframe().find(".cm-editor").type(`{ctrl+A}Hello there!{enter}{ctrl+S}`);

    cy.iframe().find(".doenet-viewer").should("contain.text", `Hello there!`);

    cy.get('[data-test="Sharing Button"]').click();
    cy.get('[data-test="Public Checkbox"]').click();
    cy.get('[data-test="Status message"]').should(
      "have.text",
      "Successfully shared publicly",
    );

    cy.get('[data-test="Close Share Drawer Button"]').click();

    cy.loginAsTestUser({
      email: scrappyEmail,
    });
    cy.visit("/");

    cy.get('[data-test="Community"]').click();
    cy.get('[data-test="Search"]').type(`activity${code}{enter}`);

    cy.get(
      '[data-test="Results All Matches"] [data-test="Activity Link"]',
    ).click();

    cy.get('[data-test="Copy to Activities Button"]').click();
    cy.get('[data-test="Go to Activities"]').click();

    cy.get(`[data-test="Activity Link"]`).eq(0).click();
    cy.iframe().find(".doenet-viewer").should("contain.text", `Hello there!`);
  });
});
