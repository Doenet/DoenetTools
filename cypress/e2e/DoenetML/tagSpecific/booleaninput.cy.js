import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("BooleanInput Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("single boolean input", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <booleaninput name="bi1" >
      <label>hello</label>
    </booleaninput>
    <copy prop="value" target="bi1" assignNames="v1" />
    <copy target="_copy1" assignNames="v2" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test values displayed in browser");

    cy.get(cesc("#\\/v1")).should("have.text", "false");
    cy.get(cesc("#\\/v2")).should("have.text", "false");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/bi1"].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
      expect(stateVariables["/bi1"].stateValues.label).eq("hello");
    });

    cy.log("check the box");
    cy.get(cesc("#\\/bi1")).click();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/v1")).should("have.text", "true");
    cy.get(cesc("#\\/v2")).should("have.text", "true");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/bi1"].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });

    cy.log("uncheck the box");
    cy.get(cesc("#\\/bi1")).click();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/v1")).should("have.text", "false");
    cy.get(cesc("#\\/v2")).should("have.text", "false");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/bi1"].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
    });
  });

  it("single boolean input, starts checked", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <booleaninput prefill="true"/>
    <copy prop="value" target="_booleaninput1" assignNames="v1" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/v1")).should("have.text", "true");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
    });

    cy.log("uncheck the box");
    cy.get(cesc("#\\/_booleaninput1")).click();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/v1")).should("have.text", "false");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
    });

    cy.log("recheck the box");
    cy.get(cesc("#\\/_booleaninput1")).click();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/v1")).should("have.text", "true");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
    });
  });

  it("copied boolean input", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><booleaninput prefill="true" name="bi1" >
      <label>green</label>
    </booleaninput></p>
    <p><booleanInput copySource="bi1" name="bi1a" /></p>
    <p><copy prop="value" target="bi1" assignNames="v1" /></p>
    <p><booleaninput name="bi2" >
      <label>red</label>
    </booleaninput></p>
    <p><copy prop="value" target="bi2" assignNames="v2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/v1")).should("have.text", "true");
    cy.get(cesc("#\\/v2")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/bi1"].stateValues.value).eq(true);
      expect(stateVariables["/bi1a"].stateValues.value).eq(true);
      expect(stateVariables["/bi2"].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
      expect(stateVariables["/bi1"].stateValues.label).eq("green");
      expect(stateVariables["/bi2"].stateValues.label).eq("red");
    });

    cy.log("click the first input");
    cy.get(cesc("#\\/bi1")).click();
    cy.get(cesc("#\\/v1")).should("have.text", "false");
    cy.get(cesc("#\\/v2")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/bi1"].stateValues.value).eq(false);
      expect(stateVariables["/bi1a"].stateValues.value).eq(false);
      expect(stateVariables["/bi2"].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
    });

    cy.log("click the second input");
    cy.get(cesc("#\\/bi1a")).click();
    cy.get(cesc("#\\/v1")).should("have.text", "true");
    cy.get(cesc("#\\/v2")).should("have.text", "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/bi1"].stateValues.value).eq(true);
      expect(stateVariables["/bi1a"].stateValues.value).eq(true);
      expect(stateVariables["/bi2"].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
    });

    cy.log("click the third input");
    cy.get(cesc("#\\/bi2")).click();
    cy.get(cesc("#\\/v1")).should("have.text", "true");
    cy.get(cesc("#\\/v2")).should("have.text", "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/bi1"].stateValues.value).eq(true);
      expect(stateVariables["/bi1a"].stateValues.value).eq(true);
      expect(stateVariables["/bi2"].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });
  });

  it("downstream from booleaninput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput bindValueTo="$_boolean1" /></p>
    <p>Copied boolean: <copy target="_boolean1" assignNames="b2" /></p>
    <p>Copied boolean input: <copy prop="value" target="_booleaninput1" assignNames="b3" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
    cy.get(cesc("#\\/b2")).should("have.text", "true");
    cy.get(cesc("#\\/b3")).should("have.text", "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_boolean1"].stateValues.value).eq(true);
      expect(stateVariables["/b2"].stateValues.value).eq(true);
      expect(stateVariables["/b3"].stateValues.value).eq(true);
    });

    cy.log("change value");
    cy.get(cesc("#\\/_booleaninput1")).click();

    // cy.get(cesc('#\\/_booleaninput1_input')).should('not.have.attr', 'checked');

    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");
    cy.get(cesc("#\\/b2")).should("have.text", "false");
    cy.get(cesc("#\\/b3")).should("have.text", "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_boolean1"].stateValues.value).eq(false);
      expect(stateVariables["/b2"].stateValues.value).eq(false);
      expect(stateVariables["/b3"].stateValues.value).eq(false);
    });

    cy.log("prefill ignored");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>b</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput prefill="false" bindValueTo="$_boolean1" /></p>
    <p>Value: <boolean copysource="_booleaninput1" name="bi2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "b"); // to wait until loaded

    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
    cy.get(cesc("#\\/bi2")).should("have.text", "true");

    cy.log("change value");
    cy.get(cesc("#\\/_booleaninput1")).click();

    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");
    cy.get(cesc("#\\/bi2")).should("have.text", "false");

    cy.log("values revert if not updatable");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>c</text>
    <p>Original boolean: <boolean>can't <text>update</text> <text>me</text></boolean></p>
    <p>booleaninput based on boolean: <booleaninput bindValueTo="$_boolean1" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "c"); // to wait until loaded

    // cy.get(cesc('#\\/_booleaninput1_input')).should('not.have.attr', 'checked');

    cy.get(cesc("#\\/_boolean1")).should("have.text", `false`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_boolean1"].stateValues.value).eq(false);
    });

    cy.log("change value, but it reverts");
    cy.get(cesc("#\\/_booleaninput1")).click();

    // cy.get(cesc('#\\/_booleaninput1_input')).should('not.have.attr', 'checked');

    cy.get(cesc("#\\/_boolean1")).should("have.text", `false`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_boolean1"].stateValues.value).eq(false);
    });
  });

  it("downstream from booleaninput via child", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput>$_boolean1</booleaninput></p>
    <p>Copied boolean: <copy target="_boolean1" assignNames="b2" /></p>
    <p>Copied boolean input: <copy prop="value" target="_booleaninput1" assignNames="b3" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
    cy.get(cesc("#\\/b2")).should("have.text", "true");
    cy.get(cesc("#\\/b3")).should("have.text", "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(true);
      expect(stateVariables["/_boolean1"].stateValues.value).eq(true);
      expect(stateVariables["/b2"].stateValues.value).eq(true);
      expect(stateVariables["/b3"].stateValues.value).eq(true);
    });

    cy.log("change value");
    cy.get(cesc("#\\/_booleaninput1")).click();

    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");
    cy.get(cesc("#\\/b2")).should("have.text", "false");
    cy.get(cesc("#\\/b3")).should("have.text", "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/_boolean1"].stateValues.value).eq(false);
      expect(stateVariables["/b2"].stateValues.value).eq(false);
      expect(stateVariables["/b3"].stateValues.value).eq(false);
    });

    cy.log("prefill ignored");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>b</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>booleaninput based on boolean: <booleaninput prefill="false">$_boolean1</booleaninput></p>
    <p>Value: <boolean copysource="_booleaninput1" name="bi2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "b"); // to wait until loaded

    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
    cy.get(cesc("#\\/bi2")).should("have.text", "true");

    cy.log("change value");
    cy.get(cesc("#\\/_booleaninput1")).click();

    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");
    cy.get(cesc("#\\/bi2")).should("have.text", "false");

    cy.log("bindValueTo ignored");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>bb</text>
    <p>Original boolean: <boolean>true</boolean></p>
    <p>Not bound: <boolean>false</boolean></p>
    <p>booleaninput based on boolean: <booleaninput bindValueTo="$_boolean2">$_boolean1</booleaninput></p>
    <p>Value: <boolean copysource="_booleaninput1" name="bi2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "bb"); // to wait until loaded

    cy.get(cesc("#\\/_boolean1")).should("have.text", "true");
    cy.get(cesc("#\\/_boolean2")).should("have.text", "false");
    cy.get(cesc("#\\/bi2")).should("have.text", "true");

    cy.log("change value");
    cy.get(cesc("#\\/_booleaninput1")).click();

    cy.get(cesc("#\\/_boolean1")).should("have.text", "false");
    cy.get(cesc("#\\/_boolean2")).should("have.text", "false");
    cy.get(cesc("#\\/bi2")).should("have.text", "false");

    cy.log("values revert if not updatable");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>c</text>
    <p>booleaninput based on boolean: <booleaninput>can't <text>update</text></booleaninput></p>
    <p>Value: <boolean copysource="_booleaninput1" name="bi2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "c"); // to wait until loaded

    cy.get(cesc("#\\/bi2")).should("have.text", `false`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/bi2"].stateValues.value).eq(false);
    });

    cy.log("change value, but it reverts");
    cy.get(cesc("#\\/_booleaninput1")).click();

    cy.get(cesc("#\\/bi2")).should("have.text", `false`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_booleaninput1"].stateValues.value).eq(false);
      expect(stateVariables["/bi2"].stateValues.value).eq(false);
    });
  });

  it("chain update off booleaninput", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <booleaninput name="bi" />
    <number name="n">1</number>
    <updateValue triggerWith="bi" target="n" newValue="$n+1" type="number" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/n")).should("have.text", "1");
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/n")).should("have.text", "2");
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/n")).should("have.text", "3");
  });

  it("boolean input as toggle button", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><booleanInput name="atb" >
      <label>As Toggle</label>
    </booleaninput></p>
    <p><booleanInput name="bi" asToggleButton="$atb">
      <label>hello</label>
    </booleaninput></p>

    <copy prop="value" target="bi" assignNames="v1" />
    <copy target="_copy1" assignNames="v2" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test values displayed in browser");

    cy.get(cesc("#\\/atb_input")).should("not.be.checked");
    cy.get(cesc("#\\/bi_input")).should("not.be.checked");
    cy.get(cesc("#\\/v1")).should("have.text", "false");
    cy.get(cesc("#\\/v2")).should("have.text", "false");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/atb"].stateValues.value).eq(false);
      expect(stateVariables["/bi"].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
      expect(stateVariables["/atb"].stateValues.label).eq("As Toggle");
      expect(stateVariables["/bi"].stateValues.label).eq("hello");
    });

    cy.log("check the box");
    cy.get(cesc("#\\/bi")).click();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/atb_input")).should("not.be.checked");
    cy.get(cesc("#\\/bi_input")).should("be.checked");
    cy.get(cesc("#\\/v1")).should("have.text", "true");
    cy.get(cesc("#\\/v2")).should("have.text", "true");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/atb"].stateValues.value).eq(false);
      expect(stateVariables["/bi"].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });

    cy.log("set as toggle button");
    cy.get(cesc("#\\/atb")).click();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/atb_input")).should("be.checked");
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get(cesc('#\\/bi_input')).should('be.checked');
    cy.get(cesc("#\\/v1")).should("have.text", "true");
    cy.get(cesc("#\\/v2")).should("have.text", "true");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/atb"].stateValues.value).eq(true);
      expect(stateVariables["/bi"].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });

    cy.log("turn off via toggle button");
    cy.get(cesc("#\\/bi_input")).click();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/atb_input")).should("be.checked");
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get(cesc('#\\/bi_input')).should('not.be.checked');
    cy.get(cesc("#\\/v1")).should("have.text", "false");
    cy.get(cesc("#\\/v2")).should("have.text", "false");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/atb"].stateValues.value).eq(true);
      expect(stateVariables["/bi"].stateValues.value).eq(false);
      expect(stateVariables["/v1"].stateValues.value).eq(false);
      expect(stateVariables["/v2"].stateValues.value).eq(false);
    });

    cy.log("turn on via toggle button");
    cy.get(cesc("#\\/bi_input")).click();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/atb_input")).should("be.checked");
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get(cesc('#\\/bi_input')).should('be.checked');
    cy.get(cesc("#\\/v1")).should("have.text", "true");
    cy.get(cesc("#\\/v2")).should("have.text", "true");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/atb"].stateValues.value).eq(true);
      expect(stateVariables["/bi"].stateValues.value).eq(true);
      expect(stateVariables["/v1"].stateValues.value).eq(true);
      expect(stateVariables["/v2"].stateValues.value).eq(true);
    });
  });

  it("boolean input with math in label", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><booleanInput name="atb" ><label>It is <m>\\int_a^b f(x)\\,dx</m></label></booleaninput></p>
    <p><booleanInput name="bi" asToggleButton="$atb"><label>Hello <math>a/b</math></label></booleaninput></p>

    <copy prop="value" target="atb" assignNames="v" />

    <p><updateValue target="_label1.hide" newValue="!$_label1.hide" type="boolean" name="toggleLabels"><label>Toggle labels</label></updateValue>
    <updateValue triggerWith="toggleLabels" target="_label2.hide" newValue="!$_label2.hide" type="boolean" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test values displayed in browser");

    cy.get(cesc("#\\/atb_input")).should("not.be.checked");
    cy.get(cesc("#\\/bi_input")).should("not.be.checked");
    cy.get(cesc("#\\/v")).should("have.text", "false");
    cy.get(cesc("#\\/atb")).should("contain.text", "It is ∫baf(x)dx");
    cy.get(cesc("#\\/bi")).should("contain.text", "Hello ab");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/atb"].stateValues.value).eq(false);
      expect(stateVariables["/bi"].stateValues.value).eq(false);
      expect(stateVariables["/v"].stateValues.value).eq(false);
      expect(stateVariables["/atb"].stateValues.label).eq(
        "It is \\(\\int_a^b f(x)\\,dx\\)",
      );
      expect(stateVariables["/bi"].stateValues.label).eq(
        "Hello \\(\\frac{a}{b}\\)",
      );
    });

    cy.log("set as toggle button");
    cy.get(cesc("#\\/atb")).click();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/v")).should("have.text", "true");
    cy.get(cesc("#\\/atb_input")).should("be.checked");
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get(cesc('#\\/bi_input')).should('be.checked');
    cy.get(cesc("#\\/atb")).should("contain.text", "It is ∫baf(x)dx");
    cy.get(cesc("#\\/bi")).should("contain.text", "Hello ab");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/atb"].stateValues.value).eq(true);
      expect(stateVariables["/bi"].stateValues.value).eq(false);
      expect(stateVariables["/v"].stateValues.value).eq(true);
      expect(stateVariables["/atb"].stateValues.label).eq(
        "It is \\(\\int_a^b f(x)\\,dx\\)",
      );
      expect(stateVariables["/bi"].stateValues.label).eq(
        "Hello \\(\\frac{a}{b}\\)",
      );
    });

    cy.log("hide labels");
    cy.get(cesc2("#/toggleLabels")).click();

    cy.get(cesc("#\\/atb")).should("not.contain.text", "It is ∫baf(x)dx");
    cy.get(cesc("#\\/bi")).should("not.contain.text", "Hello ab");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/atb"].stateValues.value).eq(true);
      expect(stateVariables["/bi"].stateValues.value).eq(false);
      expect(stateVariables["/v"].stateValues.value).eq(true);
      expect(stateVariables["/atb"].stateValues.label).eq("");
      expect(stateVariables["/bi"].stateValues.label).eq("");
    });

    cy.log("show labels again");
    cy.get(cesc2("#/toggleLabels")).click();

    cy.get(cesc("#\\/atb")).should("contain.text", "It is ∫baf(x)dx");
    cy.get(cesc("#\\/bi")).should("contain.text", "Hello ab");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/atb"].stateValues.value).eq(true);
      expect(stateVariables["/bi"].stateValues.value).eq(false);
      expect(stateVariables["/v"].stateValues.value).eq(true);
      expect(stateVariables["/atb"].stateValues.label).eq(
        "It is \\(\\int_a^b f(x)\\,dx\\)",
      );
      expect(stateVariables["/bi"].stateValues.label).eq(
        "Hello \\(\\frac{a}{b}\\)",
      );
    });
  });

  it("boolean input with labelIsName", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><booleanInput name="asToggleButton" labelIsName /></p>
    <p><booleanInput name="AnotherInput" asToggleButton="$asToggleButton" labelIsName /></p>

    <boolean copySource="asToggleButton" name="v" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test values displayed in browser");

    cy.get(cesc("#\\/asToggleButton_input")).should("not.be.checked");
    cy.get(cesc("#\\/AnotherInput_input")).should("not.be.checked");
    cy.get(cesc("#\\/v")).should("have.text", "false");
    cy.get(cesc("#\\/asToggleButton")).should(
      "contain.text",
      "as toggle button",
    );
    cy.get(cesc("#\\/AnotherInput")).should("contain.text", "Another Input");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/asToggleButton"].stateValues.value).eq(false);
      expect(stateVariables["/AnotherInput"].stateValues.value).eq(false);
      expect(stateVariables["/v"].stateValues.value).eq(false);
      expect(stateVariables["/asToggleButton"].stateValues.label).eq(
        "as toggle button",
      );
      expect(stateVariables["/AnotherInput"].stateValues.label).eq(
        "Another Input",
      );
    });

    cy.log("set as toggle button");
    cy.get(cesc("#\\/asToggleButton")).click();

    cy.log("Test values displayed in browser");
    cy.get(cesc("#\\/v")).should("have.text", "true");
    cy.get(cesc("#\\/asToggleButton_input")).should("be.checked");
    // TODO: how to check the renderer if ToggleButton is selected
    //cy.get(cesc('#\\/AnotherInput_input')).should('be.checked');
    cy.get(cesc("#\\/asToggleButton")).should(
      "contain.text",
      "as toggle button",
    );
    cy.get(cesc("#\\/AnotherInput")).should("contain.text", "Another Input");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/asToggleButton"].stateValues.value).eq(true);
      expect(stateVariables["/AnotherInput"].stateValues.value).eq(false);
      expect(stateVariables["/v"].stateValues.value).eq(true);
      expect(stateVariables["/asToggleButton"].stateValues.label).eq(
        "as toggle button",
      );
      expect(stateVariables["/AnotherInput"].stateValues.label).eq(
        "Another Input",
      );
    });
  });

  it("boolean input in graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph >
      <booleaninput anchor="$anchorCoords1" name="booleaninput1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1"><label>input 1</label></booleaninput>
      <booleaninput name="booleaninput2"><label>input 2</label></booleaninput>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $booleaninput1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $booleaninput2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$booleaninput2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $booleaninput1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $booleaninput2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceinput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p>Change position from anchor 2
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$booleaninput2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$booleaninput2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$booleaninput2.disabled" /></p>
    <p name="pFixed1">Fixed 1: $fixed1</p>
    <p name="pFixed2">Fixed 2: $fixed2</p>
    <p>Change fixed 1 <booleanInput name="fixed1" prefill="false" /></p>
    <p>Change fixed 2 <booleanInput name="fixed2" bindValueTo="$booleaninput2.fixed" /></p>
    <p name="pFixLocation1">FixLocation 1: $fixLocation1</p>
    <p name="pFixLocation2">FixLocation 2: $fixLocation2</p>
    <p>Change fixLocation 1 <booleanInput name="fixLocation1" prefill="false" /></p>
    <p>Change fixLocation 2 <booleanInput name="fixLocation2" bindValueTo="$booleaninput2.fixLocation" /></p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    `,
        },
        "*",
      );
    });

    // TODO: how to click on the checkboxes and test if they are disabled?

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: upperright",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: center",
    );
    cy.get(cesc("#\\/positionFromAnchor1")).should("have.value", "1");
    cy.get(cesc("#\\/positionFromAnchor2")).should("have.value", "9");
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: true");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: true");

    cy.log("move booleaninputs by dragging");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput1",
        args: { x: -2, y: 3 },
      });
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput2",
        args: { x: 4, y: -5 },
      });
    });

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should(
      "contain.text",
      "(4,−5)",
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,−5)");

    cy.log("move booleaninputs by entering coordinates");

    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(6,7){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(8,9){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should("contain.text", "(8,9)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");

    cy.log("change position from anchor");
    cy.get(cesc("#\\/positionFromAnchor1")).select("lowerLeft");
    cy.get(cesc("#\\/positionFromAnchor2")).select("lowerRight");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: lowerleft",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("make not draggable");

    cy.get(cesc("#\\/draggable1")).click();
    cy.get(cesc("#\\/draggable2")).click();
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: false");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: false");

    cy.log("cannot move booleaninputs by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput1",
        args: { x: -10, y: -9 },
      });
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput2",
        args: { x: -8, y: -7 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");

    cy.log("make draggable again");

    cy.get(cesc("#\\/draggable1")).click();
    cy.get(cesc("#\\/draggable2")).click();
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: true");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: true");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput1",
        args: { x: -10, y: -9 },
      });
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput2",
        args: { x: -8, y: -7 },
      });
    });

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should(
      "contain.text",
      "(−8,−7)",
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−10,−9)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("fix location");

    cy.get(cesc("#\\/fixLocation1")).click();
    cy.get(cesc("#\\/fixLocation2")).click();
    cy.get(cesc("#\\/pFixLocation1")).should(
      "have.text",
      "FixLocation 1: true",
    );
    cy.get(cesc("#\\/pFixLocation2")).should(
      "have.text",
      "FixLocation 2: true",
    );

    cy.log("can change coordinates entering coordinates only for input 1");

    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(3,4){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(1,2){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,2)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("cannot move booleaninputs by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput1",
        args: { x: 4, y: 6 },
      });
      win.callAction1({
        actionName: "moveInput",
        componentName: "/booleaninput2",
        args: { x: 7, y: 8 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "false");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,2)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("can change position from anchor only for input 1");
    cy.get(cesc("#\\/positionFromAnchor2")).select("bottom");
    cy.get(cesc("#\\/positionFromAnchor1")).select("top");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: top",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("can change disabled attribute");
    cy.get(cesc("#\\/disabled1")).click();
    cy.get(cesc("#\\/disabled2")).click();
    cy.get(cesc("#\\/pDisabled1")).should("have.text", "Disabled 1: false");
    cy.get(cesc("#\\/pDisabled2")).should("have.text", "Disabled 2: true");

    cy.log("make completely fixed");
    cy.get(cesc("#\\/fixed1")).click();
    cy.get(cesc("#\\/fixed2")).click();
    cy.get(cesc("#\\/pFixed1")).should("have.text", "Fixed 1: true");
    cy.get(cesc("#\\/pFixed2")).should("have.text", "Fixed 2: true");

    cy.log("can change coordinates entering coordinates only for input 1");

    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(7,8){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(5,6){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow").should("contain.text", "(5,6)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");

    cy.log("can change position from anchor only for input 1");
    cy.get(cesc("#\\/positionFromAnchor2")).select("left");
    cy.get(cesc("#\\/positionFromAnchor1")).select("right");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: right",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("can change disabled attribute only for input 1");
    cy.get(cesc("#\\/disabled2")).click();
    cy.get(cesc("#\\/disabled1")).click();
    cy.get(cesc("#\\/pDisabled1")).should("have.text", "Disabled 1: true");
    cy.get(cesc("#\\/pDisabled2")).should("have.text", "Disabled 2: true");
  });

  it("valueChanged", () => {
    let doenetML = `
    <p><booleanInput name="bi1" /> <boolean copySource="bi1" name="bi1a" /> <boolean copysource="bi1.valueChanged" name="bi1changed" /></p>
    <p><booleanInput name="bi2" prefill="true" /> <boolean copySource="bi2" name="bi2a" /> <boolean copysource="bi2.valueChanged" name="bi2changed" /></p>
    <p><booleanInput name="bi3" bindValueTo="$bi1" /> <boolean copySource="bi3" name="bi3a" /> <boolean copysource="bi3.valueChanged" name="bi3changed" /></p>
    <p><booleanInput name="bi4">$bi2</booleanInput> <boolean copySource="bi4" name="bi4a" /> <boolean copysource="bi4.valueChanged" name="bi4changed" /></p>

    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/bi1_input")).should("not.be.checked");
    cy.get(cesc2("#/bi2_input")).should("be.checked");
    cy.get(cesc2("#/bi3_input")).should("not.be.checked");
    cy.get(cesc2("#/bi4_input")).should("be.checked");

    cy.get(cesc2("#/bi1a")).should("have.text", "false");
    cy.get(cesc2("#/bi2a")).should("have.text", "true");
    cy.get(cesc2("#/bi3a")).should("have.text", "false");
    cy.get(cesc2("#/bi4a")).should("have.text", "true");

    cy.get(cesc2("#/bi1changed")).should("have.text", "false");
    cy.get(cesc2("#/bi2changed")).should("have.text", "false");
    cy.get(cesc2("#/bi3changed")).should("have.text", "false");
    cy.get(cesc2("#/bi4changed")).should("have.text", "false");

    cy.log("clicking first marks only first as changed");

    cy.get(cesc2("#/bi1")).click();

    cy.get(cesc2("#/bi1_input")).should("be.checked");
    cy.get(cesc2("#/bi2_input")).should("be.checked");
    cy.get(cesc2("#/bi3_input")).should("be.checked");
    cy.get(cesc2("#/bi4_input")).should("be.checked");

    cy.get(cesc2("#/bi1a")).should("have.text", "true");
    cy.get(cesc2("#/bi2a")).should("have.text", "true");
    cy.get(cesc2("#/bi3a")).should("have.text", "true");
    cy.get(cesc2("#/bi4a")).should("have.text", "true");

    cy.get(cesc2("#/bi1changed")).should("have.text", "true");
    cy.get(cesc2("#/bi2changed")).should("have.text", "false");
    cy.get(cesc2("#/bi3changed")).should("have.text", "false");
    cy.get(cesc2("#/bi4changed")).should("have.text", "false");

    cy.log("clicking second marks only second as changed");

    cy.get(cesc2("#/bi2")).click();

    cy.get(cesc2("#/bi1_input")).should("be.checked");
    cy.get(cesc2("#/bi2_input")).should("not.be.checked");
    cy.get(cesc2("#/bi3_input")).should("be.checked");
    cy.get(cesc2("#/bi4_input")).should("not.be.checked");

    cy.get(cesc2("#/bi1a")).should("have.text", "true");
    cy.get(cesc2("#/bi2a")).should("have.text", "false");
    cy.get(cesc2("#/bi3a")).should("have.text", "true");
    cy.get(cesc2("#/bi4a")).should("have.text", "false");

    cy.get(cesc2("#/bi1changed")).should("have.text", "true");
    cy.get(cesc2("#/bi2changed")).should("have.text", "true");
    cy.get(cesc2("#/bi3changed")).should("have.text", "false");
    cy.get(cesc2("#/bi4changed")).should("have.text", "false");

    cy.log("clicking third and fourth");

    cy.get(cesc2("#/bi3")).click();
    cy.get(cesc2("#/bi4")).click();

    cy.get(cesc2("#/bi1_input")).should("not.be.checked");
    cy.get(cesc2("#/bi2_input")).should("be.checked");
    cy.get(cesc2("#/bi3_input")).should("not.be.checked");
    cy.get(cesc2("#/bi4_input")).should("be.checked");

    cy.get(cesc2("#/bi1a")).should("have.text", "false");
    cy.get(cesc2("#/bi2a")).should("have.text", "true");
    cy.get(cesc2("#/bi3a")).should("have.text", "false");
    cy.get(cesc2("#/bi4a")).should("have.text", "true");

    cy.get(cesc2("#/bi1changed")).should("have.text", "true");
    cy.get(cesc2("#/bi2changed")).should("have.text", "true");
    cy.get(cesc2("#/bi3changed")).should("have.text", "true");
    cy.get(cesc2("#/bi4changed")).should("have.text", "true");

    cy.log("reload");
    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc2("#/bi1_input")).should("not.be.checked");
    cy.get(cesc2("#/bi2_input")).should("be.checked");
    cy.get(cesc2("#/bi3_input")).should("not.be.checked");
    cy.get(cesc2("#/bi4_input")).should("be.checked");

    cy.get(cesc2("#/bi1a")).should("have.text", "false");
    cy.get(cesc2("#/bi2a")).should("have.text", "true");
    cy.get(cesc2("#/bi3a")).should("have.text", "false");
    cy.get(cesc2("#/bi4a")).should("have.text", "true");

    cy.get(cesc2("#/bi1changed")).should("have.text", "false");
    cy.get(cesc2("#/bi2changed")).should("have.text", "false");
    cy.get(cesc2("#/bi3changed")).should("have.text", "false");
    cy.get(cesc2("#/bi4changed")).should("have.text", "false");

    cy.log("clicking third marks first and third as changed");

    cy.get(cesc2("#/bi3")).click();

    cy.get(cesc2("#/bi1_input")).should("be.checked");
    cy.get(cesc2("#/bi2_input")).should("be.checked");
    cy.get(cesc2("#/bi3_input")).should("be.checked");
    cy.get(cesc2("#/bi4_input")).should("be.checked");

    cy.get(cesc2("#/bi1a")).should("have.text", "true");
    cy.get(cesc2("#/bi2a")).should("have.text", "true");
    cy.get(cesc2("#/bi3a")).should("have.text", "true");
    cy.get(cesc2("#/bi4a")).should("have.text", "true");

    cy.get(cesc2("#/bi1changed")).should("have.text", "true");
    cy.get(cesc2("#/bi2changed")).should("have.text", "false");
    cy.get(cesc2("#/bi3changed")).should("have.text", "true");
    cy.get(cesc2("#/bi4changed")).should("have.text", "false");

    cy.log("clicking fourth marks only second and fourth as changed");

    cy.get(cesc2("#/bi4")).click();

    cy.get(cesc2("#/bi1_input")).should("be.checked");
    cy.get(cesc2("#/bi2_input")).should("not.be.checked");
    cy.get(cesc2("#/bi3_input")).should("be.checked");
    cy.get(cesc2("#/bi4_input")).should("not.be.checked");

    cy.get(cesc2("#/bi1a")).should("have.text", "true");
    cy.get(cesc2("#/bi2a")).should("have.text", "false");
    cy.get(cesc2("#/bi3a")).should("have.text", "true");
    cy.get(cesc2("#/bi4a")).should("have.text", "false");

    cy.get(cesc2("#/bi1changed")).should("have.text", "true");
    cy.get(cesc2("#/bi2changed")).should("have.text", "true");
    cy.get(cesc2("#/bi3changed")).should("have.text", "true");
    cy.get(cesc2("#/bi4changed")).should("have.text", "true");

    cy.log("clicking first and second");

    cy.get(cesc2("#/bi1")).click();
    cy.get(cesc2("#/bi2")).click();

    cy.get(cesc2("#/bi1_input")).should("not.be.checked");
    cy.get(cesc2("#/bi2_input")).should("be.checked");
    cy.get(cesc2("#/bi3_input")).should("not.be.checked");
    cy.get(cesc2("#/bi4_input")).should("be.checked");

    cy.get(cesc2("#/bi1a")).should("have.text", "false");
    cy.get(cesc2("#/bi2a")).should("have.text", "true");
    cy.get(cesc2("#/bi3a")).should("have.text", "false");
    cy.get(cesc2("#/bi4a")).should("have.text", "true");

    cy.get(cesc2("#/bi1changed")).should("have.text", "true");
    cy.get(cesc2("#/bi2changed")).should("have.text", "true");
    cy.get(cesc2("#/bi3changed")).should("have.text", "true");
    cy.get(cesc2("#/bi4changed")).should("have.text", "true");
  });
});
