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
      isAuthor: true,
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

    cy.get('[data-test="Share Button"]').click();
    cy.get('[data-test="Public Status"]').should(
      "contain.text",
      "Content is not public",
    );
    cy.get('[data-test="Share Publicly Button"]').click();
    cy.get('[data-test="Public Status"]').should(
      "contain.text",
      "Content is public",
    );

    cy.get('[data-test="Share Close Button"]').click();

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

    // Note: get a typesetting error from MathJax without cy.wait here
    cy.wait(500);
    cy.get('[data-test="Go to Destination"]').click();

    cy.get(`[data-test="Content Card"]`).eq(0).click();
    cy.iframe().find(".doenet-viewer").should("contain.text", `Hello there!`);
  });
});
