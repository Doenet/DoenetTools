import { cesc } from "../../../src/_utils/url";

describe("Compiled activity tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("Minimal activity definition", () => {
    // Note:
    // - missing xmlns attribute on activity document
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
          <document type="activity">
            <page>hi</page>
          </document>

        `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_document1")).should("contain.text", "hi");
  });

  it("Minimal activity definition, with xmlns", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
          <document type="activity" xmlns="https://doenet.org/spec/doenetml/v0.1.0">
            <page>hi</page>
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
          doenetML: `
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
          doenetML: `
          <document type="page" xmlns="https://doenet.org/spec/doenetml/v0.1.0">hi</document>
        `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_document1")).should("contain.text", "hi");
  });
});
