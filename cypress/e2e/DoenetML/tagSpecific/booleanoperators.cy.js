import { cesc } from "../../../../src/_utils/url";

describe("Boolean Operator Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("not", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <booleaninput />
    <not>$_booleaninput1.value{assignNames="bv"}</not>
    <not>true</not>
    <not>false</not>
    `,
        },
        "*",
      );
    });

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/_not1")).should("have.text", "true");
    cy.get(cesc("#\\/_not2")).should("have.text", "false");
    cy.get(cesc("#\\/_not3")).should("have.text", "true");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/bv"].stateValues.value).eq(false);
      expect(stateVariables["/_not1"].stateValues.value).eq(true);
      expect(stateVariables["/_not2"].stateValues.value).eq(false);
      expect(stateVariables["/_not3"].stateValues.value).eq(true);
    });

    cy.log("check the box");
    cy.get(cesc("#\\/_booleaninput1")).click();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/_not1")).should("have.text", "false");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/bv"].stateValues.value).eq(true);
      expect(stateVariables["/_not1"].stateValues.value).eq(false);
    });
  });

  it("not when", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <mathinput />
    <not><when>$_mathinput1.value{assignNames="mv"} > 1</when></not>
    `,
        },
        "*",
      );
    });

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/_not1")).should("have.text", "true");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathinput1"].stateValues.value).eq("\uff3f");
      expect(stateVariables["/mv"].stateValues.value).eq("\uff3f");
      expect(stateVariables["/_not1"].stateValues.value).eq(true);
    });

    cy.log("enter 2");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type("2{enter}", {
      force: true,
    });

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/_not1")).should("have.text", "false");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathinput1"].stateValues.value).eq(2);
      expect(stateVariables["/mv"].stateValues.value).eq(2);
      expect(stateVariables["/_not1"].stateValues.value).eq(false);
    });

    cy.log("enter 1");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/_not1")).should("have.text", "true");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_mathinput1"].stateValues.value).eq(1);
      expect(stateVariables["/mv"].stateValues.value).eq(1);
      expect(stateVariables["/_not1"].stateValues.value).eq(true);
    });
  });

  it("and", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <and>
      $_booleaninput1.value
      $_booleaninput2.value
      $_booleaninput3.value
    </and>
    <and>
      $_booleaninput1.value
      $_booleaninput2.value
      $_booleaninput3.value
      true
    </and>
    <and>
      $_booleaninput1.value
      $_booleaninput2.value
      $_booleaninput3.value
      false
    </and>
    <p>
      $_booleaninput1.value{assignNames="bv1"}
      $_booleaninput2.value{assignNames="bv2"}
      $_booleaninput3.value{assignNames="bv3"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.log("Test initial values");
    cy.get(cesc("#\\/_and1")).should("have.text", "false");
    cy.get(cesc("#\\/_and2")).should("have.text", "false");
    cy.get(cesc("#\\/_and3")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables["/_and1"].stateValues.value).eq(false);
      expect(stateVariables["/_and2"].stateValues.value).eq(false);
      expect(stateVariables["/_and3"].stateValues.value).eq(false);
    });

    cy.log("check box 1");
    cy.get(cesc("#\\/_booleaninput1")).click();
    cy.get(cesc("#\\/bv1")).should("have.text", "true");
    cy.get(cesc("#\\/_and1")).should("have.text", "false");
    cy.get(cesc("#\\/_and2")).should("have.text", "false");
    cy.get(cesc("#\\/_and3")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables["/_and1"].stateValues.value).eq(false);
      expect(stateVariables["/_and2"].stateValues.value).eq(false);
      expect(stateVariables["/_and3"].stateValues.value).eq(false);
    });

    cy.log("check box 2");
    cy.get(cesc("#\\/_booleaninput2")).click();
    cy.get(cesc("#\\/bv2")).should("have.text", "true");
    cy.get(cesc("#\\/_and1")).should("have.text", "false");
    cy.get(cesc("#\\/_and2")).should("have.text", "false");
    cy.get(cesc("#\\/_and3")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables["/_and1"].stateValues.value).eq(false);
      expect(stateVariables["/_and2"].stateValues.value).eq(false);
      expect(stateVariables["/_and3"].stateValues.value).eq(false);
    });

    cy.log("check box 3");
    cy.get(cesc("#\\/_booleaninput3")).click();
    cy.get(cesc("#\\/bv3")).should("have.text", "true");
    cy.get(cesc("#\\/_and1")).should("have.text", "true");
    cy.get(cesc("#\\/_and2")).should("have.text", "true");
    cy.get(cesc("#\\/_and3")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables["/_and1"].stateValues.value).eq(true);
      expect(stateVariables["/_and2"].stateValues.value).eq(true);
      expect(stateVariables["/_and3"].stateValues.value).eq(false);
    });
  });

  it("or", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <or>
      $_booleaninput1.value
      $_booleaninput2.value
      $_booleaninput3.value
    </or>
    <or>
      $_booleaninput1.value
      $_booleaninput2.value
      $_booleaninput3.value
      true
    </or>
    <or>
      $_booleaninput1.value
      $_booleaninput2.value
      $_booleaninput3.value
      false
    </or>
    <p>
      $_booleaninput1.value{assignNames="bv1"}
      $_booleaninput2.value{assignNames="bv2"}
      $_booleaninput3.value{assignNames="bv3"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.log("Test initial values");
    cy.get(cesc("#\\/_or1")).should("have.text", "false");
    cy.get(cesc("#\\/_or2")).should("have.text", "true");
    cy.get(cesc("#\\/_or3")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables["/_or1"].stateValues.value).eq(false);
      expect(stateVariables["/_or2"].stateValues.value).eq(true);
      expect(stateVariables["/_or3"].stateValues.value).eq(false);
    });

    cy.log("check box 1");
    cy.get(cesc("#\\/_booleaninput1")).click();
    cy.get(cesc("#\\/bv1")).should("have.text", "true");
    cy.get(cesc("#\\/_or1")).should("have.text", "true");
    cy.get(cesc("#\\/_or2")).should("have.text", "true");
    cy.get(cesc("#\\/_or3")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables["/_or1"].stateValues.value).eq(true);
      expect(stateVariables["/_or2"].stateValues.value).eq(true);
      expect(stateVariables["/_or3"].stateValues.value).eq(true);
    });

    cy.log("check box 2");
    cy.get(cesc("#\\/_booleaninput2")).click();
    cy.get(cesc("#\\/bv2")).should("have.text", "true");
    cy.get(cesc("#\\/_or1")).should("have.text", "true");
    cy.get(cesc("#\\/_or2")).should("have.text", "true");
    cy.get(cesc("#\\/_or3")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables["/_or1"].stateValues.value).eq(true);
      expect(stateVariables["/_or2"].stateValues.value).eq(true);
      expect(stateVariables["/_or3"].stateValues.value).eq(true);
    });

    cy.log("check box 3");
    cy.get(cesc("#\\/_booleaninput3")).click();
    cy.get(cesc("#\\/bv3")).should("have.text", "true");
    cy.get(cesc("#\\/_or1")).should("have.text", "true");
    cy.get(cesc("#\\/_or2")).should("have.text", "true");
    cy.get(cesc("#\\/_or3")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables["/_or1"].stateValues.value).eq(true);
      expect(stateVariables["/_or2"].stateValues.value).eq(true);
      expect(stateVariables["/_or3"].stateValues.value).eq(true);
    });

    cy.log("uncheck box 1");
    cy.get(cesc("#\\/_booleaninput1")).click();
    cy.get(cesc("#\\/bv1")).should("have.text", "false");
    cy.get(cesc("#\\/_or1")).should("have.text", "true");
    cy.get(cesc("#\\/_or2")).should("have.text", "true");
    cy.get(cesc("#\\/_or3")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables["/_or1"].stateValues.value).eq(true);
      expect(stateVariables["/_or2"].stateValues.value).eq(true);
      expect(stateVariables["/_or3"].stateValues.value).eq(true);
    });

    cy.log("uncheck box 2");
    cy.get(cesc("#\\/_booleaninput2")).click();
    cy.get(cesc("#\\/bv2")).should("have.text", "false");
    cy.get(cesc("#\\/_or1")).should("have.text", "true");
    cy.get(cesc("#\\/_or2")).should("have.text", "true");
    cy.get(cesc("#\\/_or3")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables["/_or1"].stateValues.value).eq(true);
      expect(stateVariables["/_or2"].stateValues.value).eq(true);
      expect(stateVariables["/_or3"].stateValues.value).eq(true);
    });

    cy.log("uncheck box 3");
    cy.get(cesc("#\\/_booleaninput3")).click();
    cy.get(cesc("#\\/bv3")).should("have.text", "false");
    cy.get(cesc("#\\/_or1")).should("have.text", "false");
    cy.get(cesc("#\\/_or2")).should("have.text", "true");
    cy.get(cesc("#\\/_or3")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables["/_or1"].stateValues.value).eq(false);
      expect(stateVariables["/_or2"].stateValues.value).eq(true);
      expect(stateVariables["/_or3"].stateValues.value).eq(false);
    });
  });

  it("xor", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <booleaninput />
    <booleaninput />
    <booleaninput />
    <xor>
      $_booleaninput1.value
      $_booleaninput2.value
      $_booleaninput3.value
    </xor>
    <xor>
      $_booleaninput1.value
      $_booleaninput2.value
      $_booleaninput3.value
      true
    </xor>
    <xor>
      $_booleaninput1.value
      $_booleaninput2.value
      $_booleaninput3.value
      false
    </xor>
    <p>
      $_booleaninput1.value{assignNames="bv1"}
      $_booleaninput2.value{assignNames="bv2"}
      $_booleaninput3.value{assignNames="bv3"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.log("Test initial values");
    cy.get(cesc("#\\/_xor1")).should("have.text", "false");
    cy.get(cesc("#\\/_xor2")).should("have.text", "true");
    cy.get(cesc("#\\/_xor3")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables["/_xor1"].stateValues.value).eq(false);
      expect(stateVariables["/_xor2"].stateValues.value).eq(true);
      expect(stateVariables["/_xor3"].stateValues.value).eq(false);
    });

    cy.log("check box 1");
    cy.get(cesc("#\\/_booleaninput1")).click();
    cy.get(cesc("#\\/bv1")).should("have.text", "true");
    cy.get(cesc("#\\/_xor1")).should("have.text", "true");
    cy.get(cesc("#\\/_xor2")).should("have.text", "false");
    cy.get(cesc("#\\/_xor3")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables["/_xor1"].stateValues.value).eq(true);
      expect(stateVariables["/_xor2"].stateValues.value).eq(false);
      expect(stateVariables["/_xor3"].stateValues.value).eq(true);
    });

    cy.log("check box 2");
    cy.get(cesc("#\\/_booleaninput2")).click();
    cy.get(cesc("#\\/bv2")).should("have.text", "true");
    cy.get(cesc("#\\/_xor1")).should("have.text", "false");
    cy.get(cesc("#\\/_xor2")).should("have.text", "false");
    cy.get(cesc("#\\/_xor3")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables["/_xor1"].stateValues.value).eq(false);
      expect(stateVariables["/_xor2"].stateValues.value).eq(false);
      expect(stateVariables["/_xor3"].stateValues.value).eq(false);
    });

    cy.log("check box 3");
    cy.get(cesc("#\\/_booleaninput3")).click();
    cy.get(cesc("#\\/bv3")).should("have.text", "true");
    cy.get(cesc("#\\/_xor1")).should("have.text", "false");
    cy.get(cesc("#\\/_xor2")).should("have.text", "false");
    cy.get(cesc("#\\/_xor3")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(true);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables["/_xor1"].stateValues.value).eq(false);
      expect(stateVariables["/_xor2"].stateValues.value).eq(false);
      expect(stateVariables["/_xor3"].stateValues.value).eq(false);
    });

    cy.log("uncheck box 1");
    cy.get(cesc("#\\/_booleaninput1")).click();
    cy.get(cesc("#\\/bv1")).should("have.text", "false");
    cy.get(cesc("#\\/_xor1")).should("have.text", "false");
    cy.get(cesc("#\\/_xor2")).should("have.text", "false");
    cy.get(cesc("#\\/_xor3")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(true);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(true);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables["/_xor1"].stateValues.value).eq(false);
      expect(stateVariables["/_xor2"].stateValues.value).eq(false);
      expect(stateVariables["/_xor3"].stateValues.value).eq(false);
    });

    cy.log("uncheck box 2");
    cy.get(cesc("#\\/_booleaninput2")).click();
    cy.get(cesc("#\\/bv2")).should("have.text", "false");
    cy.get(cesc("#\\/_xor1")).should("have.text", "true");
    cy.get(cesc("#\\/_xor2")).should("have.text", "false");
    cy.get(cesc("#\\/_xor3")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(true);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(true);
      expect(stateVariables["/_xor1"].stateValues.value).eq(true);
      expect(stateVariables["/_xor2"].stateValues.value).eq(false);
      expect(stateVariables["/_xor3"].stateValues.value).eq(true);
    });

    cy.log("uncheck box 3");
    cy.get(cesc("#\\/_booleaninput3")).click();
    cy.get(cesc("#\\/bv3")).should("have.text", "false");
    cy.get(cesc("#\\/_xor1")).should("have.text", "false");
    cy.get(cesc("#\\/_xor2")).should("have.text", "true");
    cy.get(cesc("#\\/_xor3")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput2"].stateValues.value).eq(false);
      expect(stateVariables["/_booleaninput3"].stateValues.value).eq(false);
      expect(stateVariables["/bv1"].stateValues.value).eq(false);
      expect(stateVariables["/bv2"].stateValues.value).eq(false);
      expect(stateVariables["/bv3"].stateValues.value).eq(false);
      expect(stateVariables["/_xor1"].stateValues.value).eq(false);
      expect(stateVariables["/_xor2"].stateValues.value).eq(true);
      expect(stateVariables["/_xor3"].stateValues.value).eq(false);
    });
  });

  it("show point based on logic", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <booleaninput>
      <label>show point</label>
    </booleaninput>
    <graph>
      <point hide="not $_booleaninput1">
       (1,2)
      </point>
    </graph>
    $_booleaninput1.value{assignNames="bv1"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_booleaninput1_input")); //wait for page to load
    cy.log("Test initial values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_point1"].stateValues.hide).eq(true);
    });

    cy.log("check box to show point");
    cy.get(cesc("#\\/_booleaninput1")).click();
    cy.get(cesc("#\\/bv1")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_point1"].stateValues.hide).eq(false);
    });
  });
});
