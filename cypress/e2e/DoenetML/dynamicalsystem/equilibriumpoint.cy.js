import me from "math-expressions";
import { cesc } from "../../../../src/_utils/url";

describe("Equilibriumpoint Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("equilibriumpoint change stable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph name="g" newNamespace>
      <equilibriumpoint name="A" switchAble>(4,0)</equilibriumpoint>
      <equilibriumpoint name="B" stable="false">(7,0)</equilibriumpoint>
      <equilibriumpoint name="C" stable="$(../b1)" styleNumber="2">(-9,0)</equilibriumpoint>
      <equilibriumpoint name="D" stable="$(../b2)" styleNumber="2" switchable>(-3,0)</equilibriumpoint>
    </graph>
  
    <booleaninput name="b1" />
    <booleaninput name="b2" />

    <p><aslist>
    <copy prop="stable" target="g/A" assignNames="gAs" />
    <copy prop="stable" target="g/B" assignNames="gBs" />
    <copy prop="stable" target="g/C" assignNames="gCs" />
    <copy prop="stable" target="g/D" assignNames="gDs" />
    </aslist>
    </p>

    <copy target="g" assignNames="g2" />

    <p><aslist>
    <copy prop="stable" target="g2/A" assignNames="g2As" />
    <copy prop="stable" target="g2/B" assignNames="g2Bs" />
    <copy prop="stable" target="g2/C" assignNames="g2Cs" />
    <copy prop="stable" target="g2/D" assignNames="g2Ds" />
    </aslist>
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/gAs")).should("have.text", "true");
    cy.get(cesc("#\\/gBs")).should("have.text", "false");
    cy.get(cesc("#\\/gCs")).should("have.text", "false");
    cy.get(cesc("#\\/gDs")).should("have.text", "false");
    cy.get(cesc("#\\/g2As")).should("have.text", "true");
    cy.get(cesc("#\\/g2Bs")).should("have.text", "false");
    cy.get(cesc("#\\/g2Cs")).should("have.text", "false");
    cy.get(cesc("#\\/g2Ds")).should("have.text", "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(false);
      expect(stateVariables["/g/D"].stateValues.stable).eq(false);
      expect(stateVariables["/g/A"].stateValues.xs.map((x) => x)).eqls([4, 0]);
      expect(stateVariables["/g/B"].stateValues.xs.map((x) => x)).eqls([7, 0]);
      expect(stateVariables["/g/C"].stateValues.xs.map((x) => x)).eqls([-9, 0]);
      expect(stateVariables["/g/D"].stateValues.xs.map((x) => x)).eqls([-3, 0]);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/A"].stateValues.xs.map((x) => x)).eqls([4, 0]);
      expect(stateVariables["/g2/B"].stateValues.xs.map((x) => x)).eqls([7, 0]);
      expect(stateVariables["/g2/C"].stateValues.xs.map((x) => x)).eqls([
        -9, 0,
      ]);
      expect(stateVariables["/g2/D"].stateValues.xs.map((x) => x)).eqls([
        -3, 0,
      ]);
    });

    cy.log("switch C via boolean input");
    cy.get(cesc("#\\/b1")).click();

    cy.get(cesc("#\\/gAs")).should("have.text", "true");
    cy.get(cesc("#\\/gBs")).should("have.text", "false");
    cy.get(cesc("#\\/gCs")).should("have.text", "true");
    cy.get(cesc("#\\/gDs")).should("have.text", "false");
    cy.get(cesc("#\\/g2As")).should("have.text", "true");
    cy.get(cesc("#\\/g2Bs")).should("have.text", "false");
    cy.get(cesc("#\\/g2Cs")).should("have.text", "true");
    cy.get(cesc("#\\/g2Ds")).should("have.text", "false");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(false);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(false);
    });

    cy.log("switch D via boolean input");
    cy.get(cesc("#\\/b2")).click();

    cy.get(cesc("#\\/gAs")).should("have.text", "true");
    cy.get(cesc("#\\/gBs")).should("have.text", "false");
    cy.get(cesc("#\\/gCs")).should("have.text", "true");
    cy.get(cesc("#\\/gDs")).should("have.text", "true");
    cy.get(cesc("#\\/g2As")).should("have.text", "true");
    cy.get(cesc("#\\/g2Bs")).should("have.text", "false");
    cy.get(cesc("#\\/g2Cs")).should("have.text", "true");
    cy.get(cesc("#\\/g2Ds")).should("have.text", "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(true);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(true);
    });

    cy.log("switch A via first action");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "switchPoint",
        componentName: "/g/A",
      });

      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(false);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(true);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(true);

      cy.get(cesc("#\\/gAs")).should("have.text", "false");
      cy.get(cesc("#\\/gBs")).should("have.text", "false");
      cy.get(cesc("#\\/gCs")).should("have.text", "true");
      cy.get(cesc("#\\/gDs")).should("have.text", "true");
      cy.get(cesc("#\\/g2As")).should("have.text", "false");
      cy.get(cesc("#\\/g2Bs")).should("have.text", "false");
      cy.get(cesc("#\\/g2Cs")).should("have.text", "true");
      cy.get(cesc("#\\/g2Ds")).should("have.text", "true");
    });

    cy.log("switch A via second action");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "switchPoint",
        componentName: "/g2/A",
      });

      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(true);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(true);

      cy.get(cesc("#\\/gAs")).should("have.text", "true");
      cy.get(cesc("#\\/gBs")).should("have.text", "false");
      cy.get(cesc("#\\/gCs")).should("have.text", "true");
      cy.get(cesc("#\\/gDs")).should("have.text", "true");
      cy.get(cesc("#\\/g2As")).should("have.text", "true");
      cy.get(cesc("#\\/g2Bs")).should("have.text", "false");
      cy.get(cesc("#\\/g2Cs")).should("have.text", "true");
      cy.get(cesc("#\\/g2Ds")).should("have.text", "true");
    });

    cy.log("cannot switch B via action");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "switchPoint",
        componentName: "/g/B",
      });

      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(true);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(true);

      cy.get(cesc("#\\/gAs")).should("have.text", "true");
      cy.get(cesc("#\\/gBs")).should("have.text", "false");
      cy.get(cesc("#\\/gCs")).should("have.text", "true");
      cy.get(cesc("#\\/gDs")).should("have.text", "true");
      cy.get(cesc("#\\/g2As")).should("have.text", "true");
      cy.get(cesc("#\\/g2Bs")).should("have.text", "false");
      cy.get(cesc("#\\/g2Cs")).should("have.text", "true");
      cy.get(cesc("#\\/g2Ds")).should("have.text", "true");
    });

    cy.log("cannot switch C via second action");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "switchPoint",
        componentName: "/g2/C",
      });

      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(true);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(true);

      cy.get(cesc("#\\/gAs")).should("have.text", "true");
      cy.get(cesc("#\\/gBs")).should("have.text", "false");
      cy.get(cesc("#\\/gCs")).should("have.text", "true");
      cy.get(cesc("#\\/gDs")).should("have.text", "true");
      cy.get(cesc("#\\/g2As")).should("have.text", "true");
      cy.get(cesc("#\\/g2Bs")).should("have.text", "false");
      cy.get(cesc("#\\/g2Cs")).should("have.text", "true");
      cy.get(cesc("#\\/g2Ds")).should("have.text", "true");
    });

    cy.log("switch D via second action");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "switchPoint",
        componentName: "/g2/D",
      });

      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/g/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g/D"].stateValues.stable).eq(false);

      expect(stateVariables["/g2/A"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
      expect(stateVariables["/g2/C"].stateValues.stable).eq(true);
      expect(stateVariables["/g2/D"].stateValues.stable).eq(false);

      cy.get(cesc("#\\/gAs")).should("have.text", "true");
      cy.get(cesc("#\\/gBs")).should("have.text", "false");
      cy.get(cesc("#\\/gCs")).should("have.text", "true");
      cy.get(cesc("#\\/gDs")).should("have.text", "false");
      cy.get(cesc("#\\/g2As")).should("have.text", "true");
      cy.get(cesc("#\\/g2Bs")).should("have.text", "false");
      cy.get(cesc("#\\/g2Cs")).should("have.text", "true");
      cy.get(cesc("#\\/g2Ds")).should("have.text", "false");
    });
  });
});
