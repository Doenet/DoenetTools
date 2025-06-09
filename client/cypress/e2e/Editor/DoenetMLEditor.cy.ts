import { cesc2 } from "../../../src/utils/url";

describe("Editor Tests", function () {
  it("Update Button", () => {
    const label = "Editor Variant Control";
    const text1 = "Hello World";
    const text2 = "Hi";
    const text3 = "There";

    cy.loginAsTestUser();

    cy.createContent({
      name: label,
      doenetML: "",
    }).then((contentId) => {
      cy.visit(`/activityEditor/${contentId}`);

      cy.log("No content");

      cy.iframe()
        .find('[data-test="Viewer Update Button"]')
        .should("be.disabled");

      cy.log("Enter content");

      cy.wait(100);
      cy.iframe().find(".cm-activeLine").invoke("text", `<p>${text1}</p>`);
      cy.wait(100);
      cy.iframe().find(".cm-activeLine").type(`{enter}`);

      cy.iframe()
        .find('[data-test="Viewer Update Button"]')
        .should("be.enabled");

      cy.iframe().find('[data-test="Viewer Update Button"]').click();
      cy.iframe().find(cesc2("#/_document1")).should("contain", text1);
      cy.iframe()
        .find('[data-test="Viewer Update Button"]')
        .should("be.disabled");

      cy.iframe().find(".cm-activeLine").type("{ctrl+end}");
      cy.iframe().find(".cm-activeLine").invoke("text", `<p>${text2}</p>`);
      cy.iframe().find(".cm-activeLine").type("{enter}");

      cy.iframe()
        .find('[data-test="Viewer Update Button"]')
        .should("be.enabled");

      cy.get('[data-test="View Mode Button"]').click();
      cy.get('[data-test="Edit Mode Button"]').click();

      cy.iframe()
        .find('[data-test="Viewer Update Button"]')
        .should("be.disabled");

      cy.iframe().find(".cm-activeLine").type("{ctrl+end}");
      cy.iframe().find(".cm-activeLine").invoke("text", `<p>${text3}</p>`);
      cy.iframe().find(".cm-activeLine").type("{enter}");

      cy.iframe()
        .find('[data-test="Viewer Update Button"]')
        .should("be.enabled");

      cy.iframe().find('[data-test="Viewer Update Button"]').click();

      cy.iframe().find(cesc2("#/_document1")).should("contain", text1);
      cy.iframe().find(cesc2("#/_document1")).should("contain", text2);
      cy.iframe().find(cesc2("#/_document1")).should("contain", text3);
    });
  });
});
