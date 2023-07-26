// import {signIn} from '../DoenetSignin/DoenetSignin.cy';

const { cesc2 } = require("../../../src/_utils/url");

describe("Porfolio Errors and Warnings ", function () {
  const userId = "cyuserId";
  const userId2 = "cyuserId2";

  before(() => {
    // cy.clearAllOfAUsersActivities({userId})
  });
  beforeEach(() => {
    cy.signin({ userId });
    cy.visit(`/`);
  });

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });

  it("Errors and Warnings in Portfolio Editor", () => {
    const label = "Errors Warnings PE";
    cy.deletePortfolioActivity({ userId, label });

    cy.get('[data-test="Portfolio"]').click();

    cy.log("Create an activity");
    cy.get('[data-test="Add Activity"]').click();

    cy.get(
      '[data-test="Activity Label Editable"] [data-test="Editable Preview"]',
    ).click();
    cy.get('[data-test="Activity Label Editable"] [data-test="Editable Input"]')
      .type(label)
      .blur();

    cy.get(".cm-content").type(`<p name="goodp">A good paragraph</p>{enter}`);

    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get(cesc2("#/goodp")).should("have.text", "A good paragraph");

    cy.get('[data-test="Warning Button"]').should("have.text", "0 Warnings");
    cy.get('[data-test="Error Button"]').should("have.text", "0 Errors");

    cy.get('[data-test="Warning Button"]').click();
    cy.get('[data-test="Warning Content"]').should("have.text", "No Warnings");

    cy.get('[data-test="Error Button"]').click();
    cy.get('[data-test="Error Content"]').should("have.text", "No Errors");

    cy.get(".cm-content").type(`{ctrl+end}{enter}<invalid/>{enter}`);

    cy.get('[data-test="Warning Button"]').should("have.text", "0 Warnings");
    cy.get('[data-test="Error Button"]').should("have.text", "0 Errors");

    cy.get('[data-test="Warning Button"]').click();
    cy.get('[data-test="Warning Content"]').should("have.text", "No Warnings");

    cy.get('[data-test="Error Button"]').click();
    cy.get('[data-test="Error Content"]').should("have.text", "No Errors");

    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get(cesc2("#/_invalid1")).should(
      "contain.text",
      "Invalid component type: <invalid>",
    );

    cy.get('[data-test="Warning Button"]').should("have.text", "0 Warnings");
    cy.get('[data-test="Error Button"]').should("have.text", "1 Error");

    cy.get('[data-test="Warning Button"]').click();
    cy.get('[data-test="Warning Content"]').should("have.text", "No Warnings");

    cy.get('[data-test="Error Button"]').click();
    cy.get('[data-test="Error Content"]').should(
      "contain.text",
      "ErrorLine #3 Invalid component type: <invalid>",
    );

    cy.get(".cm-content").type(`{ctrl+end}{leftarrow}{leftarrow}{backspace}`);
    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get(cesc2("#/__error1")).should(
      "contain.text",
      "Invalid DoenetML.  Missing closing tag",
    );
    cy.get(cesc2("#/_invalid1")).should(
      "contain.text",
      "Invalid component type: <invalid>",
    );

    cy.get('[data-test="Warning Button"]').should("have.text", "0 Warnings");
    cy.get('[data-test="Error Button"]').should("have.text", "2 Errors");

    cy.get('[data-test="Warning Button"]').click();
    cy.get('[data-test="Warning Content"]').should("have.text", "No Warnings");

    cy.get('[data-test="Error Button"]').click();
    cy.get('[data-test="Error Content"]').should(
      "contain.text",
      "Line #3 Invalid DoenetML.  Missing closing tag",
    );
    cy.get('[data-test="Error Content"]').should(
      "contain.text",
      "Line #3 Invalid component type: <invalid>",
    );

    cy.get(".cm-content").type(
      `{ctrl+end}{enter}<function name="f" ninputs="2">x+y</function>`,
    );
    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get(cesc2("#/f") + " .mjx-mrow").should("contain.text", "x+y");

    cy.get('[data-test="Warning Button"]').should("have.text", "1 Warning");
    cy.get('[data-test="Error Button"]').should("have.text", "2 Errors");

    cy.get('[data-test="Warning Button"]').click();
    cy.get('[data-test="Warning Content"]').should(
      "contain.text",
      "WarningLine #5 Attribute ninputs is deprecated. Use numInputs instead. Its use will become an error in version 0.7.",
    );
  });
});
