import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Integer Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("1.2+1.1", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      $_integer1{name="int"}
      <integer>1.2+1.1</integer>
    `,
        },
        "*",
      );
    });

    cy.log("Test value displayed in browser");
    cy.get(cesc2("#/int")).should("have.text", "2");
    cy.get(cesc2("#/_integer1")).should("have.text", "2");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int"].stateValues.value).eq(2);
      expect(stateVariables["/_integer1"].stateValues.value).eq(2);
    });
  });

  it(`non-numeric value`, () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      $_integer1{name="int"}
      <integer>x+1</integer>
      `,
        },
        "*",
      );
    });

    cy.log("Test value displayed in browser");
    cy.get(cesc2("#/int")).should("have.text", "NaN");
    cy.get(cesc2("#/_integer1")).should("have.text", "NaN");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      assert.isNaN(stateVariables["/int"].stateValues.value);
      assert.isNaN(stateVariables["/_integer1"].stateValues.value);
    });
  });

  it(`entering non-integer values dynamically`, () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <integer name="n">$_mathinput1</integer>
      <mathinput />
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/n")).should("have.text", "NaN");
    cy.get(cesc(`#\\/_mathinput1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}-6.5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/n")).should("have.text", "-6");
    cy.get(cesc(`#\\/_mathinput1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("−6.5");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("{end}x{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n")).should("have.text", "NaN");
    cy.get(cesc(`#\\/_mathinput1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("−6.5x");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}9.5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/n")).should("have.text", "10");
    cy.get(cesc(`#\\/_mathinput1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("9.5");
      });
  });

  it(`entering non-integer through inverse`, () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <integer name="n">5</integer>
      <mathinput bindValueTo="$n" hideNaN="false" />
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/n")).should("have.text", "5");

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}-6.5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/n")).should("have.text", "-6");
    cy.get(cesc(`#\\/_mathinput1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("−6");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("{end}x{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n")).should("have.text", "NaN");
    cy.get(cesc(`#\\/_mathinput1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("NaN");
      });

    // Note: change to 3 and then 31 to verify bug doesn't reappear
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}3{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/n")).should("have.text", "3");
    cy.get(cesc(`#\\/_mathinput1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("3");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("{end}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n")).should("have.text", "31");
    cy.get(cesc(`#\\/_mathinput1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("31");
      });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("{end}.5{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n")).should("have.text", "32");
    cy.get(cesc(`#\\/_mathinput1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("32");
      });
  });
});
