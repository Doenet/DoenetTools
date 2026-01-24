// TODO: these are just front-end tests.
// They don't need the full e2e setup with the database
describe("Basic accessibility tests", function () {
  it("Check accessibility of home page", () => {
    cy.visit("/");

    cy.get("body").should("contain.text", "Doenet");

    cy.checkAccessibility(undefined);
  });

  it("Check accessibility of explore page", () => {
    cy.visit("/explore");

    cy.get("body").should("contain.text", "Community");

    cy.checkAccessibility(undefined);
  });

  it("Check accessibility of author tab in explore page", () => {
    // Make sure there is at least one author with name Test
    cy.loginAsTestUser({
      firstNames: "Test",
      lastNames: "User",
    });
    cy.createContent({
      name: "Test Content",
      makePublic: true,
    });

    cy.visit("/explore");
    cy.get('[data-test="Search"]').type("Test{enter}");

    cy.get('[data-test="Authors Tab"]').click();

    cy.get("h2").contains("Matching authors").should("be.visible");

    cy.checkAccessibility(undefined);
  });

  it("Check accessibility of classifications tab in explore page", () => {
    // Make sure there is at least one public document with a Calculus classification
    cy.loginAsTestUser();
    cy.createContent({
      name: "Test Content",
      makePublic: true,
      classifications: [
        {
          systemShortName: "HS/C Math",
          category: "Calculus - single variable",
          subCategory: "Applications of differentiation",
          code: "CalcSV.AD.17",
        },
      ],
    });

    cy.visit("/explore");
    cy.get('[data-test="Search"]').type("Calculus{enter}");

    cy.get('[data-test="Classifications Tab"]').click();

    cy.get("h2").contains("Matching classifications").should("be.visible");

    cy.checkAccessibility(undefined);
  });

  it("Check accessibility of my activities", () => {
    // Make sure there is at least one public document with a Calculus classification
    cy.loginAsTestUser();
    cy.createContent({
      name: "Test Document",
      makePublic: true,
      categories: {
        isQuestion: true,
        isExploration: true,
        isGameOrPuzzle: true,
        isCollaborative: true,
        containsVideo: true,
      },
    }).then((contentId) => {
      cy.createAssignment({
        contentId,
        closedOn: "2099-12-31T23:59:59Z",
      });
    });
    cy.createContent({
      name: "Test Problem Set",
      contentType: "sequence",
      categories: { isProblemSet: true, isInteractive: true },
    }).then((contentId) => {
      cy.createAssignment({
        contentId,
        closedOn: "1999-12-31T23:59:59Z",
      });
    });

    cy.visit("/");
    cy.get('[data-test="Activities"]').click();

    cy.get('[data-test="Folder Title"]').should("have.text", "My Activities");

    cy.checkAccessibility(undefined);
  });
});
