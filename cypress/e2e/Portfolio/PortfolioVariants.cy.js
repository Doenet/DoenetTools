const { cesc2 } = require("../../../src/_utils/url");

describe("Portfolio Variant Tests", function () {
  const userId = "cyuserId";
  const userId2 = "cyuserId2";

  beforeEach(() => {
    cy.signin({ userId });
    cy.visit(`/`);
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("Portfolio Editor Varient Control Shows Up", () => {
    const label = "Portfolio Variant Control";
    const text1 = "Hello World";

    cy.log("Make an activity in the portfolio");
    cy.get('[data-test="Portfolio"]').click();
    cy.get('[data-test="Add Activity"]').click();

    cy.get('[data-test="Variant Select Menu Button"]').should('not.exist');

    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Activity Label"]').clear().type(label).blur();
    cy.get('[data-test="Close Settings Button"]').click();

    cy.log("Enter content without need of a variant")

    cy.get(".cm-content").type(
      `<p>${text1}</p> {enter}`,
    );

    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2("#/_document1")).should("contain", text1);

    cy.get('[data-test="Variant Select Menu Button"]').should('not.exist');

    cy.log("Enter content that does need of a variant")

    cy.get(".cm-content").type(
      `{ctrl+end}<selectFromSequence /> {enter}`,
    );

    cy.get('[data-test="Variant Select Menu Button"]').should('not.exist');

    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get('[data-test="Variant Select Menu Button"]').should('exist');
    cy.get(cesc2("#/_document1")).should("contain", "1");


    cy.log("Change the variants with the control")

    cy.get('[data-test="Variant Select Down Button"]').click();
    cy.get(cesc2("#/_document1")).should("contain", "2");

    cy.get('[data-test="Variant Select Up Button"]').click();
    cy.get(cesc2("#/_document1")).should("contain", "1");

    cy.get('[data-test="Variant Select Menu Button"]').click();
    cy.get('[data-test="Variant Select Menu Item 2"]').click();

    cy.get(cesc2("#/_document1")).should("contain", "3");

    cy.get('[data-test="Variant Select Menu Button"]').click();
    cy.get('[data-test="Variant Select Filter Input"]').clear().type('d').blur();
    cy.get('[data-test="Variant Select Menu Item 0"]').click();
    cy.get(cesc2("#/_document1")).should("contain", "4");

    cy.log("View Variant Select keeps sync with Edit")
    cy.get('[data-test="View Mode Button"]').click();

    cy.get(cesc2("#/_document1")).should("contain", "4");
    cy.get('[data-test="Variant Select Menu Button"]').should("contain", "d");

    cy.get('[data-test="Variant Select Down Button"]').click();
    cy.get(cesc2("#/_document1")).should("contain", "5");

    cy.get('[data-test="Variant Select Up Button"]').click();
    cy.get(cesc2("#/_document1")).should("contain", "4");

    cy.get('[data-test="Variant Select Menu Button"]').click();
    cy.get('[data-test="Variant Select Menu Item 5"]').click();

    cy.get(cesc2("#/_document1")).should("contain", "6");

    cy.get('[data-test="Edit Mode Button"]').click();

    cy.get(cesc2("#/_document1")).should("contain", "6");
    cy.get('[data-test="Variant Select Menu Button"]').should("contain", "f");


    cy.get('[data-test="Controls Button"]').click();
    cy.get('.chakra-checkbox__control').click();
    cy.get('[data-test="Close Settings Button"]').click();

    cy.log("sign in as someone else and open the public activity")
    cy.signin({ userId2 });

    cy.get('[data-test="Community"]').click();

    cy.get('[data-test="Search"]').clear().type(`${label}{enter}`);

    cy.get('[data-test="Results All Matches"] [data-test="Card Image Link"]')
      .eq(0)
      .click();

    cy.log("Change the variants using the selector")

    cy.get('[data-test="Variant Select Menu Button"]').should('exist');
    cy.get('[data-test="Variant Select Down Button"]').click();
    cy.get(cesc2("#/_document1")).should("contain", "2");

    cy.get('[data-test="Variant Select Up Button"]').click();
    cy.get(cesc2("#/_document1")).should("contain", "1");

    cy.get('[data-test="Variant Select Menu Button"]').click();
    cy.get('[data-test="Variant Select Menu Item 2"]').click();

    cy.get(cesc2("#/_document1")).should("contain", "3");

    cy.log("Try the public editor")

    cy.get('[data-test="See Inside"]').click();

    cy.wait(500); //Need this to wait for the public editor to spin up

    cy.get('[data-test="Variant Select Menu Button"]').should('exist');

    cy.get('[data-test="Variant Select Down Button"]').click();
    cy.get(cesc2("#/_document1")).should("contain", "2");

    cy.get('[data-test="Variant Select Up Button"]').click();
    cy.get(cesc2("#/_document1")).should("contain", "1");

    cy.get('[data-test="Variant Select Menu Button"]').click();
    cy.get('[data-test="Variant Select Menu Item 2"]').click();

    cy.get(cesc2("#/_document1")).should("contain", "3");

    cy.log("Delete the variant DoenetML code");

    cy.get(".cm-content").clear().type("<p>Hello World</p>");
    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get('[data-test="Variant Select Menu Button"]').should('not.exist');
    cy.get(cesc2("#/_document1")).should("contain", "Hello World");


  });

});
