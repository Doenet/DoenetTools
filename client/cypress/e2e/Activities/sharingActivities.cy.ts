describe("Share Activities Tests", function () {
  before(() => {});

  beforeEach(() => {});

  it("create, share, and copy public activity", () => {
    const code = Date.now().toString();
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
    cy.get('[data-test="Add Document Button"]').click();

    cy.get('[data-test="Editable Title"]').type(
      `My new activity${code}{enter}`,
    );

    cy.iframe().find(".cm-activeLine").invoke("text", "Hello there!");
    cy.iframe().find(".cm-activeLine").type("{enter}");
    cy.iframe().find(".cm-activeLine").type("{ctrl+S}");

    cy.iframe().find(".doenet-viewer").should("contain.text", `Hello there!`);

    cy.get('[data-test="Sharing Button"]').click();
    cy.get('[data-test="Public Checkbox"]').click();
    cy.get('[data-test="Status message"]').should(
      "contain.text",
      "shared publicly",
    );

    cy.get('[data-test="Close Share Drawer Button"]').click();

    cy.loginAsTestUser({
      email: scrappyEmail,
    });
    cy.visit("/");

    cy.get('[data-test="Explore"]').click();
    cy.get('[data-test="Search"]').type(`activity${code}{enter}`);

    cy.get('[data-test="Search Results For"]').should(
      "contain.text",
      `activity${code}`,
    );

    cy.get('[data-test="Community Tab"]').click();

    cy.get(
      '[data-test="Community Results"] [data-test="Content Card"]',
    ).click();

    cy.get('[data-test="Add To"]').click();
    cy.get('[data-test="Add To My Activities"]').click();

    cy.get('[data-test="Go to Activities"]').click();

    cy.get(`[data-test="Content Card"]`).eq(0).click();
    cy.iframe().find(".doenet-viewer").should("contain.text", `Hello there!`);
  });
});
