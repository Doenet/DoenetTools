import { cesc2 } from "../../../src/utils/url";

describe("Editor Errors and Warnings ", function () {
  it("Errors and Warnings in Activities Editor", () => {
    cy.loginAsTestUser();
    const label = "Errors Warnings PE";

    cy.createContent({
      name: label,
      doenetML: "Initial content",
    }).then((contentId) => {
      cy.visit(`/activityEditor/${contentId}`);

      cy.iframe()
        .find(".cm-activeLine")
        .invoke("text", `<p name="goodp">A good paragraph</p>`);
      cy.wait(100);
      cy.iframe().find(".cm-activeLine").type("{end}{enter}");
      cy.iframe().find('[data-test="Viewer Update Button"]').click();
      cy.iframe()
        .find(".doenet-viewer " + cesc2("#/goodp"))
        .should("have.text", `A good paragraph`);

      cy.iframe()
        .find('[data-test="Warning Button"]')
        .should("have.text", "0 Warnings");
      cy.iframe()
        .find('[data-test="Error Button"]')
        .should("have.text", "0 Errors");

      cy.iframe().find('[data-test="Warning Button"]').click();
      cy.iframe()
        .find('[data-test="Warning Content"]')
        .should("have.text", "No Warnings");

      cy.iframe().find('[data-test="Error Button"]').click();
      cy.iframe()
        .find('[data-test="Error Content"]')
        .should("have.text", "No Errors");

      cy.iframe().find(".cm-activeLine").type("{ctrl+end}{enter}");
      cy.iframe().find(".cm-activeLine").invoke("text", `<invalid/>`);
      cy.iframe().find(".cm-activeLine").type("{enter}");

      cy.iframe()
        .find('[data-test="Warning Button"]')
        .should("have.text", "0 Warnings");
      cy.iframe()
        .find('[data-test="Error Button"]')
        .should("have.text", "0 Errors");

      cy.iframe().find('[data-test="Warning Button"]').click();
      cy.iframe()
        .find('[data-test="Warning Content"]')
        .should("have.text", "No Warnings");

      cy.iframe().find('[data-test="Error Button"]').click();
      cy.iframe()
        .find('[data-test="Error Content"]')
        .should("have.text", "No Errors");

      cy.iframe().find('[data-test="Viewer Update Button"]').click();

      cy.iframe()
        .find(cesc2("#/_invalid1"))
        .should("contain.text", "Invalid component type: <invalid>");

      cy.iframe()
        .find('[data-test="Warning Button"]')
        .should("have.text", "0 Warnings");
      cy.iframe()
        .find('[data-test="Error Button"]')
        .should("have.text", "1 Error");

      cy.iframe().find('[data-test="Warning Button"]').click();
      cy.iframe()
        .find('[data-test="Warning Content"]')
        .should("have.text", "No Warnings");

      cy.iframe().find('[data-test="Error Button"]').click();
      cy.iframe()
        .find('[data-test="Error Content"]')
        .should(
          "contain.text",
          "ErrorLine #3 Invalid component type: <invalid>",
        );

      cy.iframe()
        .find(".cm-content")
        .type(`{ctrl+end}{leftarrow}{leftarrow}{backspace}`);
      cy.iframe().find('[data-test="Viewer Update Button"]').click();

      cy.iframe()
        .find(cesc2("#/__error1"))
        .should("contain.text", "Invalid DoenetML.  Missing closing tag");
      cy.iframe()
        .find(cesc2("#/_invalid1"))
        .should("contain.text", "Invalid component type: <invalid>");

      cy.iframe()
        .find('[data-test="Warning Button"]')
        .should("have.text", "0 Warnings");
      cy.iframe()
        .find('[data-test="Error Button"]')
        .should("have.text", "2 Errors");

      cy.iframe().find('[data-test="Warning Button"]').click();
      cy.iframe()
        .find('[data-test="Warning Content"]')
        .should("have.text", "No Warnings");

      cy.iframe().find('[data-test="Error Button"]').click();
      cy.iframe()
        .find('[data-test="Error Content"]')
        .should(
          "contain.text",
          "Line #3 Invalid DoenetML.  Missing closing tag",
        );
      cy.iframe()
        .find('[data-test="Error Content"]')
        .should("contain.text", "Line #3 Invalid component type: <invalid>");

      cy.iframe().find(".cm-content").type(`{ctrl+end}{enter}`);
      cy.iframe()
        .find(".cm-activeLine")
        .invoke("text", `<function name="f" ninputs="2">x+y</function>`);
      cy.iframe().find('[data-test="Viewer Update Button"]').click();

      cy.iframe().find(cesc2("#/f")).should("contain.text", "x+y");

      cy.iframe()
        .find('[data-test="Warning Button"]')
        .should("have.text", "1 Warning");
      cy.iframe()
        .find('[data-test="Error Button"]')
        .should("have.text", "2 Errors");

      cy.iframe().find('[data-test="Warning Button"]').click();
      cy.iframe()
        .find('[data-test="Warning Content"]')
        .should(
          "contain.text",
          "WarningLine #5 Attribute ninputs is deprecated. Use numInputs instead. Its use will become an error in the next major version (0.7). Version 0.6 will be phased out in summer 2024.",
        );
    });
  });
});
