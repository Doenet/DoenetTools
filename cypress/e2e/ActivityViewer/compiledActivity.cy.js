import { cesc } from "../../../src/_utils/url";

describe("Compiled activity tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("Minimal activity definition", () => {
    // Note:
    // - missing xmlns attribute on activity document
    // - missing behavior attribute on order (sequence is assumed)
    cy.window().then(async (win) => {
      win.postMessage(
        {
          activityDefinition: `
          <document type="activity">
            <order>
              <page>hi</page>
            </order>
          </document>

        `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_document1")).should("contain.text", "hi");
  });

  it("Minimal activity definition, with attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          activityDefinition: `
          <document type="activity" xmlns="https://doenet.org/spec/doenetml/v0.1.0">
            <order behavior="sequence">
              <page>hi</page>
            </order>
          </document>

        `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_document1")).should("contain.text", "hi");
  });

  it("page definition sent to activity viewer", () => {
    // Note:
    // - missing xmlns attribute on page document
    cy.window().then(async (win) => {
      win.postMessage(
        {
          activityDefinition: `
          <document type="page">hi</document>
        `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_document1")).should("contain.text", "hi");
  });

  it("page definition sent to activity viewer, with xmlns", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          activityDefinition: `
          <document type="page" xmlns="https://doenet.org/spec/doenetml/v0.1.0">hi</document>
        `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_document1")).should("contain.text", "hi");
  });
});
