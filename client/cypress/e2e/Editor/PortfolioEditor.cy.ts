import { cesc2 } from "../../../src/_utils/url";

describe.skip("Activities Editor Tests", function () {
  it("Update Button", () => {
    const label = "Activities Variant Control";
    const text1 = "Hello World";
    const text2 = "Hi";
    const text3 = "There";

    cy.log("Make an activity in the activities page");
    cy.get('[data-test="Activities"]').click();
    cy.get('[data-test="Add Activity"]').click();

    cy.get('[data-test="Controls Button"]').click();
    cy.get('[data-test="Activity Label"]').clear().type(label).blur();
    cy.get('[data-test="Close Settings Button"]').click();

    cy.log("No content");

    cy.get('[data-test="Viewer Update Button"]').should("be.disabled");

    cy.log("Enter content");

    cy.get(".cm-content").type(`<p>${text1}</p> {enter}`);
    cy.get('[data-test="Viewer Update Button"]').should("be.enabled");

    cy.get('[data-test="Viewer Update Button"]').click();
    cy.get(cesc2("#/_document1")).should("contain", text1);
    cy.get('[data-test="Viewer Update Button"]').should("be.disabled");

    cy.get(".cm-content").type(`{ctrl+end}<p>${text2}</p> {enter}`);
    cy.get('[data-test="Viewer Update Button"]').should("be.enabled");

    cy.get('[data-test="View Mode Button"]').click();

    cy.get('[data-test="Edit Mode Button"]').click();

    cy.get('[data-test="Viewer Update Button"]').should("be.enabled");

    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get('[data-test="Viewer Update Button"]').should("be.disabled");

    cy.get(".cm-content").type(`{ctrl+end}<p>${text3}</p> {enter}`);

    cy.get('[data-test="Viewer Update Button"]').should("be.enabled");

    cy.get('[data-test="Viewer Update Button"]').click();

    cy.get(cesc2("#/_document1")).should("contain", text1);
    cy.get(cesc2("#/_document1")).should("contain", text2);
    cy.get(cesc2("#/_document1")).should("contain", text3);
  });
});
