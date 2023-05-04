import { cesc2 } from "../../../../src/_utils/url";

describe("Tabular Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("inHeader attribute", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <tabular>
      <row header>
        <cell>A</cell>
        <cell>B</cell>
      </row>
      <row>
        <cell>🟣</cell>
        <cell>🔴</cell>
      </row>
    </tabular>

    <p>Top: <c>inHeader</c> = $_cell1.inHeader</p>
    <p>Bottom: <c>inHeader</c> = $_cell3.inHeader</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_p1")).should("have.text", "Top: inHeader = true")
    cy.get(cesc2("#/_p2")).should("have.text", "Bottom: inHeader = false")
  });
});
