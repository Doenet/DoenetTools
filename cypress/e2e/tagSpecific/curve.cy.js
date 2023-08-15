import me from "math-expressions";
import { createFunctionFromDefinition } from "../../../../src/Core/utils/function";
import { cesc } from "../../../../src/utils/url";

describe("Curve Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("spline through four points, as string with copy", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <curve through="(-1,2) (2, $_mathinput1) (2$_mathinput1, -4) (5,6)" />
    </graph>
    $_mathinput1.value{assignNames="m1"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq("bezier");
      expect(stateVariables["/_curve1"].stateValues.numThroughPoints).eq(4);
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.8);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(1)).eq(2);
      expect(f2(1)).eq(-2);
      expect(f1(2)).eq(-4);
      expect(f2(2)).eq(-4);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}{backspace}4{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "4");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq("bezier");
      expect(stateVariables["/_curve1"].stateValues.numThroughPoints).eq(4);
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.8);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(1)).eq(2);
      expect(f2(1)).eq(4);
      expect(f1(2)).eq(8);
      expect(f2(2)).eq(-4);
    });
  });

  it("spline through four points, as string with copy, label with math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <curve through="(-1,2) (2, $_mathinput1) (2$_mathinput1, -4) (5,6)" >
      <label>Hi <m>(-1,2), (2, $_mathinput1), (2($_mathinput1), -4), (5,6)</m></label>
    </curve>
    </graph>
    $_mathinput1.value{assignNames="m1"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq("bezier");
      expect(stateVariables["/_curve1"].stateValues.numThroughPoints).eq(4);
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.8);
      expect(stateVariables["/_curve1"].stateValues.label).eq(
        "Hi \\((-1,2), (2, -2), (2(-2), -4), (5,6)\\)",
      );
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(1)).eq(2);
      expect(f2(1)).eq(-2);
      expect(f1(2)).eq(-4);
      expect(f2(2)).eq(-4);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}{backspace}4{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "4");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq("bezier");
      expect(stateVariables["/_curve1"].stateValues.numThroughPoints).eq(4);
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.8);
      expect(stateVariables["/_curve1"].stateValues.label).eq(
        "Hi \\((-1,2), (2, 4), (2(4), -4), (5,6)\\)",
      );
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(1)).eq(2);
      expect(f2(1)).eq(4);
      expect(f1(2)).eq(8);
      expect(f2(2)).eq(-4);
    });
  });

  it("spline through four points, as copied points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <point>(-1,2)</point>
    <point>(2, $_mathinput1.value)</point>
    <point>(2$_mathinput1.value, -4)</point>
    <point>(5,6)</point>
    <curve through="$_point1 $_point2 $_point3 $_point4" />
    </graph>
    $_mathinput1.value{assignNames="m1"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq("bezier");
      expect(stateVariables["/_curve1"].stateValues.numThroughPoints).eq(4);
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.8);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(1)).eq(2);
      expect(f2(1)).eq(-2);
      expect(f1(2)).eq(-4);
      expect(f2(2)).eq(-4);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}{backspace}4{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "4");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq("bezier");
      expect(stateVariables["/_curve1"].stateValues.numThroughPoints).eq(4);
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.8);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(1)).eq(2);
      expect(f2(1)).eq(4);
      expect(f1(2)).eq(8);
      expect(f2(2)).eq(-4);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 5, y: 7 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq("bezier");
      expect(stateVariables["/_curve1"].stateValues.numThroughPoints).eq(4);
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.8);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(1)).eq(5);
      expect(f2(1)).eq(7);
      expect(f1(2)).eq(14);
      expect(f2(2)).eq(-4);
    });
  });

  it("spline through four points, as copied points, change spline parameters", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="-2"/>
    <graph>
    <point>(-1,2)</point>
    <point>(2, $_mathinput1.value)</point>
    <point>(2$_mathinput1.value, -4)</point>
    <point>(5,6)</point>
    <curve splineForm="uniform" splineTension="0.4" through="$_point1 $_point2 $_point3 $_point4" />
    </graph>
    $_mathinput1.value{assignNames="m1"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq("bezier");
      expect(stateVariables["/_curve1"].stateValues.numThroughPoints).eq(4);
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq("uniform");
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.4);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(1)).eq(2);
      expect(f2(1)).eq(-2);
      expect(f1(2)).eq(-4);
      expect(f2(2)).eq(-4);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}{backspace}4{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "4");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq("bezier");
      expect(stateVariables["/_curve1"].stateValues.numThroughPoints).eq(4);
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq("uniform");
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.4);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(1)).eq(2);
      expect(f2(1)).eq(4);
      expect(f1(2)).eq(8);
      expect(f2(2)).eq(-4);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 5, y: 7 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq("bezier");
      expect(stateVariables["/_curve1"].stateValues.numThroughPoints).eq(4);
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq("uniform");
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.4);
      let f1 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[0],
      );
      let f2 = createFunctionFromDefinition(
        stateVariables["/_curve1"].stateValues.fDefinitions[1],
      );
      expect(f1(1)).eq(5);
      expect(f2(1)).eq(7);
      expect(f1(2)).eq(14);
      expect(f2(2)).eq(-4);
    });
  });

  it("constrain to spline", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <textinput />
    <mathinput prefill="0.8"/>
    <graph>
    <point>(-7,-4)</point>
    <point>(2.5,6)</point>
    <point>(3, 5.8)</point>
    <point>(8,-6)</point>
    <curve splineForm="$_textinput1" splineTension="$_mathinput1" through="$_point1 $_point2 $_point3 $_point4" />
    
    <point x="5" y="10">
      <constraints>
        <constrainTo>$_curve1</constrainTo>
      </constraints>
    </point>
    
    </graph>
    $_textinput1.value{assignNames="t1"}
    $_mathinput1.value{assignNames="m1"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.curveType).eq("bezier");
      expect(stateVariables["/_curve1"].stateValues.numThroughPoints).eq(4);
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.8);

      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(2.8, 0.1);
      expect(y).closeTo(6.1, 0.1);
    });

    cy.get(cesc("#\\/_textinput1_input")).clear().type("uniform{enter}");
    cy.get(cesc("#\\/t1")).should("contain.text", "uniform");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq("uniform");
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.8);
      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(3.4, 0.1);
      expect(y).closeTo(8, 0.1);
    });

    cy.get(cesc("#\\/_textinput1_input")).clear().type("centripetal{enter}");
    cy.get(cesc("#\\/t1")).should("contain.text", "centripetal");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.8);
      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(2.8, 0.1);
      expect(y).closeTo(6.1, 0.1);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point5",
        args: { x: 10, y: 2 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(5.5, 0.1);
      expect(y).closeTo(0.2, 0.1);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}0.1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0.1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.1);
      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(5.5, 0.1);
      expect(y).closeTo(0.2, 0.1);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 9, y: 9 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -9, y: 2 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: 6, y: -8 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: 9, y: 9 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point5",
        args: { x: 10, y: -7 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.1);
      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(6.4, 0.1);
      expect(y).closeTo(-6.3, 0.1);
    });

    cy.get(cesc("#\\/_textinput1_input")).clear().type("uniform{enter}");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point5",
        args: { x: 10, y: -7 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq("uniform");
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(0.1);
      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(6.5, 0.1);
      expect(y).closeTo(-6.3, 0.1);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}1{enter}",
      { force: true },
    );
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point5",
        args: { x: 10, y: -7 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq("uniform");
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(1);
      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(8.6, 0.1);
      expect(y).closeTo(-6.1, 0.1);
    });

    cy.get(cesc("#\\/_textinput1_input")).clear().blur();
    cy.window().then(async (win) => {
      await win.callAction1({
        componentName: "/_point5",
        actionName: "movePoint",
        args: { x: 10, y: -7 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point5",
        args: { x: 10, y: -7 },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.splineForm).eq(
        "centripetal",
      );
      expect(stateVariables["/_curve1"].stateValues.splineTension).eq(1);
      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(7.4, 0.1);
      expect(y).closeTo(-6.1, 0.1);
    });
  });

  it("extrapolate", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <booleaninput />
    <booleaninput />
    <graph>
    <point>(-7,-4)</point>
    <point>(-4, 3)</point>
    <point>(4, 3)</point>
    <point>(7,-4)</point>
    <curve extrapolatebackward="$_booleaninput1" extrapolateforward="$_booleaninput2" through="$_point1 $_point2 $_point3 $_point4">
      <beziercontrols/>
    </curve>
    
    <point x="8" y="-8">
      <constraints>
        <constrainTo>$_curve1</constrainTo>
      </constraints>
    </point>
    <point x="-8" y="-8">
      <constraints>
        <constrainTo>$_curve1</constrainTo>
      </constraints>
    </point>
    
    </graph>


    <p>Temp way to change controls 1:
    <choiceInput name="dir1" bindValueTo="$_curve1.vectorcontroldirection1" >
      <group>
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    <choiceInput name="dir4" bindValueTo="$_curve1.vectorcontroldirection4" >
      <group>
        <choice>none</choice>
        <choice>symmetric</choice>
        <choice>both</choice>
        <choice>previous</choice>
        <choice>next</choice>
      </group>
    </choiceInput>
    </p>
    $_booleaninput1.value{assignNames="b1"}
    $_booleaninput2.value{assignNames="b2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(7, 1e-3);
      expect(y).closeTo(-4, 1e-3);

      x = stateVariables["/_point6"].stateValues.xs[0];
      y = stateVariables["/_point6"].stateValues.xs[1];
      expect(x).closeTo(-7, 1e-3);
      expect(y).closeTo(-4, 1e-3);
    });

    cy.log("turn on extrapolation");
    cy.get(cesc("#\\/_booleaninput1")).click();
    cy.get(cesc("#\\/_booleaninput2")).click();
    cy.get(cesc("#\\/b1")).should("contain.text", "true");
    cy.get(cesc("#\\/b2")).should("contain.text", "true");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(9.1, 0.1);
      expect(y).closeTo(-6.9, 0.1);

      x = stateVariables["/_point6"].stateValues.xs[0];
      y = stateVariables["/_point6"].stateValues.xs[1];
      expect(x).closeTo(-9.1, 0.1);
      expect(y).closeTo(-6.9, 0.1);
    });

    cy.log("activate bezier controls and move tangents");
    cy.get(cesc(`#\\/dir1_choice2_input`)).click();
    cy.get(cesc(`#\\/dir4_choice2_input`)).click();
    cy.window().then(async (win) => {
      // stateVariables['/_curve1'].togglePointControl(0)
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: [-1, 2],
        },
      });
      // stateVariables['/_curve1'].togglePointControl(3)
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [3, 1],
          controlVector: [1, 2],
        },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(6.7, 0.1);
      expect(y).closeTo(-4.3, 0.1);

      x = stateVariables["/_point6"].stateValues.xs[0];
      y = stateVariables["/_point6"].stateValues.xs[1];
      expect(x).closeTo(-6.7, 0.1);
      expect(y).closeTo(-4.3, 0.1);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: [1, -2],
        },
      });
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [3, 1],
          controlVector: [-1, -2],
        },
      });

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point5",
        args: { x: 9, y: -3 },
      });

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point5"].stateValues.xs[0];
      let y = stateVariables["/_point5"].stateValues.xs[1];
      expect(x).closeTo(7.2, 0.1);
      expect(y).closeTo(-3, 0.1);

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point6",
        args: { x: -9, y: -3 },
      });

      stateVariables = await win.returnAllStateVariables1();
      x = stateVariables["/_point6"].stateValues.xs[0];
      y = stateVariables["/_point6"].stateValues.xs[1];
      expect(x).closeTo(-7.2, 0.1);
      expect(y).closeTo(-3, 0.1);
    });
  });

  it("extrapolate always reaches edge of graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>xmin = <mathinput name="xmin" prefill="-10" /></p>
    <p>xmax = <mathinput name="xmax" prefill="10" /></p>
    <p>ymin = <mathinput name="ymin" prefill="-10" /></p>
    <p>ymax = <mathinput name="ymax" prefill="10" /></p>
    
    <graph xmin="$xmin" xmax="$xmax" ymin="$ymin" ymax="$ymax">
    <curve extrapolatebackward extrapolateforward through="(0,0) (1,1)">
      <beziercontrols alwaysVisible>(-0.2,-0.2) (-0.2, -0.2)</bezierControls>
    </curve>
    
    <point x="8" y="-6">
      <constraints>
        <constrainTo>$_curve1</constrainTo>
      </constraints>
    </point>
    <point x="-8" y="6">
      <constraints>
        <constrainTo>$_curve1</constrainTo>
      </constraints>
    </point>

    </graph>

    $xmin.value{assignNames="xmin2"}
    $xmax.value{assignNames="xmax2"}
    $ymin.value{assignNames="ymin2"}
    $ymax.value{assignNames="ymax2"}

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1, 1e-5);
      expect(y).closeTo(1, 1e-5);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(-1, 1e-5);
      expect(y).closeTo(-1, 1e-5);
    });

    cy.log("make tangents even smaller");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: [-0.01, -0.01],
        },
      });
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [1, 0],
          controlVector: [-0.01, -0.01],
        },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1, 1e-5);
      expect(y).closeTo(1, 1e-5);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(-1, 1e-5);
      expect(y).closeTo(-1, 1e-5);
    });

    cy.log("make graph larger");
    cy.get(cesc("#\\/xmin") + " textarea").type("{end}00{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/xmax") + " textarea").type("{end}00{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/ymin") + " textarea").type("{end}00{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/ymax") + " textarea").type("{end}00{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/ymax2")).should("contain.text", "1000");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1, 1e-5);
      expect(y).closeTo(1, 1e-5);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(-1, 1e-5);
      expect(y).closeTo(-1, 1e-5);
    });

    cy.log("move points to corners");

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 1001, y: 999 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -1001, y: -999 },
      });

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1000, 1e-5);
      expect(y).closeTo(1000, 1e-5);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(-1000, 1e-5);
      expect(y).closeTo(-1000, 1e-5);
    });

    cy.log("upper right tangent slightly upward");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [1, 0],
          controlVector: [-0.01, -0.012],
        },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(10, 10);
      expect(y).closeTo(1000, 10);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(-10, 10);
      expect(y).closeTo(-1000, 10);
    });

    cy.log("upper right tangent slightly rightward");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [1, 0],
          controlVector: [-0.012, -0.01],
        },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1000, 10);
      expect(y).closeTo(10, 10);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(-1000, 10);
      expect(y).closeTo(-10, 10);
    });

    cy.log("lower left tangent upward and to left");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: [-0.02, 0.02],
        },
      });

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -1000, y: 1000 },
      });

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1000, 10);
      expect(y).closeTo(10, 10);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(-10, 10);
      expect(y).closeTo(1000, 10);
    });

    cy.log("lower left tangent downward and to right");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: [0.1, -0.1],
        },
      });

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 1000, y: -1000 },
      });

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(10, 10);
      expect(y).closeTo(1000, 10);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(1000, 10);
      expect(y).closeTo(-10, 10);
    });

    cy.log("upper right tangent straight right");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [1, 0],
          controlVector: [-0.01, 0],
        },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1000, 1e-5);
      expect(y).closeTo(1, 1e-5);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(1000, 10);
      expect(y).closeTo(-10, 10);
    });

    cy.log("upper right tangent straight up");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [1, 0],
          controlVector: [0, -0.01],
        },
      });
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1, 1e-5);
      expect(y).closeTo(1000, 1e-5);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(1000, 10);
      expect(y).closeTo(-10, 10);
    });

    cy.log("lower left tangent straight left");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: [-0.01, 0],
        },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -1000, y: -1000 },
      });

      let stateVariables = await win.returnAllStateVariables1();

      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1, 1e-5);
      expect(y).closeTo(1000, 1e-5);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(-1000, 1e-5);
      expect(y).closeTo(0, 1e-5);
    });

    cy.log("lower left tangent straight down");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: [0, -0.01],
        },
      });

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -1000, y: -1000 },
      });

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/_point1"].stateValues.xs[0];
      let y = stateVariables["/_point1"].stateValues.xs[1];
      expect(x).closeTo(1, 1e-5);
      expect(y).closeTo(1000, 1e-5);

      x = stateVariables["/_point2"].stateValues.xs[0];
      y = stateVariables["/_point2"].stateValues.xs[1];
      expect(x).closeTo(0, 1e-5);
      expect(y).closeTo(-1000, 1e-5);
    });
  });

  it("extrapolate modes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <booleaninput name="eb"/>
    <booleaninput name="ef"/>
    
    <graph>
      <curve through="(1,2) (3,4) (-5,6)" extrapolateBackward="$eb" extrapolateForward="$ef">
        <bezierControls>(1,0) (-1,0) (0, -1)</bezierControls>
      </curve>
    
    </graph>
    
    <p>ebm: $_curve1.extrapolateBackwardMode{assignNames="ebm"}</p>
    <p>efm: $_curve1.extrapolateForwardMode{assignNames="efm"}</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.get(cesc("#\\/ebm")).should("have.text", "");
    cy.get(cesc("#\\/efm")).should("have.text", "");

    cy.log("extrapolate backward");
    cy.get(cesc("#\\/eb")).click();
    cy.get(cesc("#\\/ebm")).should("have.text", "line");
    cy.get(cesc("#\\/efm")).should("have.text", "");

    cy.log("move first control vector");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [0, 0],
          controlVector: [1, -1],
        },
      });

      cy.get(cesc("#\\/ebm")).should("have.text", "parabolaHorizontal");
      cy.get(cesc("#\\/efm")).should("have.text", "");
    });

    cy.log("move second through point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: [-1, 4],
        },
      });

      cy.get(cesc("#\\/ebm")).should("have.text", "parabolaVertical");
      cy.get(cesc("#\\/efm")).should("have.text", "");
    });

    cy.log("extrapolate foward");
    cy.get(cesc("#\\/ef")).click();
    cy.get(cesc("#\\/ebm")).should("have.text", "parabolaVertical");
    cy.get(cesc("#\\/efm")).should("have.text", "line");

    cy.log("move last control vector");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 0],
          controlVector: [1, -1],
        },
      });

      cy.get(cesc("#\\/ebm")).should("have.text", "parabolaVertical");
      cy.get(cesc("#\\/efm")).should("have.text", "parabolaVertical");
    });

    cy.log("move last control vector again");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveControlVector",
        componentName: "/_curve1",
        args: {
          controlVectorInds: [2, 0],
          controlVector: [-1, -1],
        },
      });

      cy.get(cesc("#\\/ebm")).should("have.text", "parabolaVertical");
      cy.get(cesc("#\\/efm")).should("have.text", "parabolaHorizontal");
    });
  });

  it("variable length curve", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput /></p>
    <p>Step size: <mathinput /></p>
    
    <map hide>
      <template><point>($x, sin($x))</point></template>
      <sources alias="x">
        <sequence from="0" length="$_mathinput1" step="$_mathinput2" />
      </sources>
    </map>
    <graph>
    <curve through="$_map1" />
    </graph>
    $_mathinput1.value{assignNames="m1"}
    $_mathinput2.value{assignNames="m2"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let curve = stateVariables["/_curve1"];

      expect((await curve.stateValues.throughPoints).length).eq(0);
      expect((await curve.stateValues.controlVectors).length).eq(0);
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}{backspace}10{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput2") + " textarea").type(
      "{end}{backspace}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m2")).should("contain.text", "1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let curve = stateVariables["/_curve1"];

      let throughPoints = await curve.stateValues.throughPoints;

      expect(throughPoints.length).eq(10);
      expect((await curve.stateValues.controlVectors).length).eq(10);

      for (let i = 0; i < 10; i++) {
        expect(me.fromAst(throughPoints[i][0]).evaluate_to_constant()).closeTo(
          i,
          1e-12,
        );
        expect(me.fromAst(throughPoints[i][1]).evaluate_to_constant()).closeTo(
          Math.sin(i),
          1e-12,
        );
      }
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}{backspace}20{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "20");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let curve = stateVariables["/_curve1"];

      let throughPoints = await curve.stateValues.throughPoints;

      expect(throughPoints.length).eq(20);
      expect((await curve.stateValues.controlVectors).length).eq(20);

      for (let i = 0; i < 20; i++) {
        expect(me.fromAst(throughPoints[i][0]).evaluate_to_constant()).closeTo(
          i,
          1e-12,
        );
        expect(me.fromAst(throughPoints[i][1]).evaluate_to_constant()).closeTo(
          Math.sin(i),
          1e-12,
        );
      }
    });

    cy.get(cesc("#\\/_mathinput2") + " textarea").type(
      "{end}{backspace}{backspace}0.5{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m2")).should("contain.text", "0.5");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let curve = stateVariables["/_curve1"];

      let throughPoints = await curve.stateValues.throughPoints;

      expect(throughPoints.length).eq(20);
      expect((await curve.stateValues.controlVectors).length).eq(20);

      for (let i = 0; i < 20; i++) {
        expect(me.fromAst(throughPoints[i][0]).evaluate_to_constant()).closeTo(
          i * 0.5,
          1e-12,
        );
        expect(me.fromAst(throughPoints[i][1]).evaluate_to_constant()).closeTo(
          Math.sin(i * 0.5),
          1e-12,
        );
      }
    });

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}{backspace}10{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "10");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let curve = stateVariables["/_curve1"];

      let throughPoints = await curve.stateValues.throughPoints;

      expect(throughPoints.length).eq(10);
      expect((await curve.stateValues.controlVectors).length).eq(10);

      for (let i = 0; i < 10; i++) {
        expect(me.fromAst(throughPoints[i][0]).evaluate_to_constant()).closeTo(
          i * 0.5,
          1e-12,
        );
        expect(me.fromAst(throughPoints[i][1]).evaluate_to_constant()).closeTo(
          Math.sin(i * 0.5),
          1e-12,
        );
      }
    });
  });

  it("new curve from copied vertices, some flipped", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
    <curve through="(-9,6) (-3,7) (4,0) (8,5)" />
    </graph>
    <graph>
    <curve through="$(_curve1.throughPoint1) ($(_curve1.throughPointX2_2),$(_curve1.throughPointX2_1)) $(_curve1.throughPoint3) ($(_curve1.throughPointX4_2),$(_curve1.throughPointX4_1))" />
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    cy.window().then(async (win) => {
      let ps = [
        [-9, 6],
        [-3, 7],
        [4, 0],
        [8, 5],
      ];
      let psflipped = [
        [-9, 6],
        [7, -3],
        [4, 0],
        [5, 8],
      ];
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[0]).eqls(
        ps[0],
      );
      expect(stateVariables["/_curve1"].stateValues.throughPoints[1]).eqls(
        ps[1],
      );
      expect(stateVariables["/_curve1"].stateValues.throughPoints[2]).eqls(
        ps[2],
      );
      expect(stateVariables["/_curve1"].stateValues.throughPoints[3]).eqls(
        ps[3],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[0]).eqls(
        psflipped[0],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[1]).eqls(
        psflipped[1],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[2]).eqls(
        psflipped[2],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[3]).eqls(
        psflipped[3],
      );
    });

    cy.log("move first curve points");
    cy.window().then(async (win) => {
      let ps = [
        [7, 2],
        [1, -3],
        [2, 9],
        [-4, -3],
      ];
      let psflipped = [
        [7, 2],
        [-3, 1],
        [2, 9],
        [-3, -4],
      ];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 0,
          throughPoint: ps[0],
        },
      });

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[0]).eqls(
        ps[0],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[0]).eqls(
        psflipped[0],
      );

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 1,
          throughPoint: ps[1],
        },
      });

      stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[1]).eqls(
        ps[1],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[1]).eqls(
        psflipped[1],
      );

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 2,
          throughPoint: ps[2],
        },
      });

      stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[2]).eqls(
        ps[2],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[2]).eqls(
        psflipped[2],
      );

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve1",
        args: {
          throughPointInd: 3,
          throughPoint: ps[3],
        },
      });

      stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[3]).eqls(
        ps[3],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[3]).eqls(
        psflipped[3],
      );
    });

    cy.log("move second polyline verticies");
    cy.window().then(async (win) => {
      let ps = [
        [-1, 9],
        [7, 5],
        [-8, 1],
        [6, -7],
      ];
      let psflipped = [
        [-1, 9],
        [5, 7],
        [-8, 1],
        [-7, 6],
      ];

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve2",
        args: {
          throughPointInd: 0,
          throughPoint: psflipped[0],
        },
      });

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[0]).eqls(
        ps[0],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[0]).eqls(
        psflipped[0],
      );

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve2",
        args: {
          throughPointInd: 1,
          throughPoint: psflipped[1],
        },
      });

      stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[1]).eqls(
        ps[1],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[1]).eqls(
        psflipped[1],
      );

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve2",
        args: {
          throughPointInd: 2,
          throughPoint: psflipped[2],
        },
      });

      stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[2]).eqls(
        ps[2],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[2]).eqls(
        psflipped[2],
      );

      await win.callAction1({
        actionName: "moveThroughPoint",
        componentName: "/_curve2",
        args: {
          throughPointInd: 3,
          throughPoint: psflipped[3],
        },
      });

      stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[3]).eqls(
        ps[3],
      );
      expect(stateVariables["/_curve2"].stateValues.throughPoints[3]).eqls(
        psflipped[3],
      );
    });
  });

  it("extracting point coordinates of symmetric curve", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math hide fixed name="fixed3">3</math>
    <math hide fixed name="fixed4">4</math>
    <point hide>(1,2)</point>
    <graph>
      <curve through="$_point1 ($_point1.y, $_point1.x)" /> 
      <point name="x1" x="$(_curve1.throughPointX1_1)" y="$fixed3" />
      <point name="x2" x="$(_curve1.throughPointX2_1)" y="$fixed4" />
      <point name="y1" y="$(_curve1.throughPointX1_2)" x="$fixed3" />
      <point name="y2" y="$(_curve1.throughPointX2_2)" x="$fixed4" />
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for window to load

    let x = 1,
      y = 2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[0]).eqls([
        x,
        y,
      ]);
      expect(stateVariables["/_curve1"].stateValues.throughPoints[1]).eqls([
        y,
        x,
      ]);
      expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
    });

    cy.log("move x point 1");
    cy.window().then(async (win) => {
      x = 3;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/x1",
        args: { x: x },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[0]).eqls([
        x,
        y,
      ]);
      expect(stateVariables["/_curve1"].stateValues.throughPoints[1]).eqls([
        y,
        x,
      ]);
      expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
    });

    cy.log("move x point 2");
    cy.window().then(async (win) => {
      y = 4;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/x2",
        args: { x: y },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[0]).eqls([
        x,
        y,
      ]);
      expect(stateVariables["/_curve1"].stateValues.throughPoints[1]).eqls([
        y,
        x,
      ]);
      expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
    });

    cy.log("move y point 1");
    cy.window().then(async (win) => {
      y = -6;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/y1",
        args: { y: y },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[0]).eqls([
        x,
        y,
      ]);
      expect(stateVariables["/_curve1"].stateValues.throughPoints[1]).eqls([
        y,
        x,
      ]);
      expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
    });

    cy.log("move y point 2");
    cy.window().then(async (win) => {
      x = -8;
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/y2",
        args: { y: x },
      });
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_curve1"].stateValues.throughPoints[0]).eqls([
        x,
        y,
      ]);
      expect(stateVariables["/_curve1"].stateValues.throughPoints[1]).eqls([
        y,
        x,
      ]);
      expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
    });
  });

  it("style description changes with theme", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <curve name="A" styleNumber="1" labelIsName through="(0,0) (0,2) (2,0)" />
      <curve name="B" styleNumber="2" labelIsName through="(2,2) (2,4) (4,2)" />
      <curve name="C" styleNumber="5" labelIsName through="(4,4) (4,6) (6,4)" />
    </graph>
    <p name="Adescrip">Curve A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/Adescrip")).should("have.text", "Curve A is thick brown.");
    cy.get(cesc("#\\/Bdescrip")).should("have.text", "B is a dark red curve.");
    cy.get(cesc("#\\/Cdescrip")).should(
      "have.text",
      "C is a thin black curve.",
    );

    cy.log("set dark mode");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_darkmode").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.get(cesc("#\\/Adescrip")).should(
      "have.text",
      "Curve A is thick yellow.",
    );
    cy.get(cesc("#\\/Bdescrip")).should("have.text", "B is a light red curve.");
    cy.get(cesc("#\\/Cdescrip")).should(
      "have.text",
      "C is a thin white curve.",
    );
  });
});
