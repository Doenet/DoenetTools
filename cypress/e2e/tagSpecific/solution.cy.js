import { cesc } from "../../../../src/utils/url";

describe("Solution Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("solution isn't created before opening", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <solution name="sol">
    <p name="solutionText">This is the text of the solution.</p>
  </solution>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/solutionText")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solutionText"]).be.undefined;
    });

    cy.get(cesc("#\\/sol_button")).click();

    cy.get(cesc("#\\/solutionText")).should(
      "have.text",
      "This is the text of the solution.",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/solutionText"].stateValues.text).eq(
        "This is the text of the solution.",
      );
    });
  });

  it("Can open solution in read only mode", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_readOnly").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <solution name="solution1">
        <title>Hello</title>
        <p>Content</p>
      </solution>

      <p><textinput name="ti" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/solution1_button")).should("contain.text", "Solution");

    cy.get(cesc("#\\/_title1")).should("not.exist");
    cy.get(cesc("#\\/_p1")).should("not.exist");
    cy.get(cesc("#\\/ti_input")).should("be.disabled");

    cy.get(cesc("#\\/solution1_button")).click();
    cy.get(cesc("#\\/_title1")).should("have.text", "Hello");
    cy.get(cesc("#\\/_p1")).should("have.text", "Content");

    cy.get(cesc("#\\/solution1_button")).click();
    cy.get(cesc("#\\/_title1")).should("not.exist");
    cy.get(cesc("#\\/_p1")).should("not.exist");
  });

  it("empty solution", () => {
    // an empty solution was creating an infinite loop
    // as the zero replacements were always treated as uninitialized
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <solution name="sol" />
  <boolean name="solOpen" copySource="sol.open" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/solOpen")).should("have.text", "false");

    cy.get(cesc("#\\/sol_button")).click();
    cy.get(cesc("#\\/solOpen")).should("have.text", "true");

    cy.get(cesc("#\\/sol_button")).click();
    cy.get(cesc("#\\/solOpen")).should("have.text", "false");
  });
});
