import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("BestFitLine Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("fit line to 4 points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <graph name="g">
        <point>(1,2)</point>
        <point>(1,6)</point>
      
        <point>(7,3)</point>
        <point>(7,-1)</point>
      
        <bestFitLine data="$ps" name="l" />
      
      </graph>
      
      $l.equation{assignNames="eq"}
      <p name="data">data: <aslist>$l.data</aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/eq") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y=−0.5x+4.5");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,2)");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(1,6)");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(7,3)");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "(7,−1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText("y=-0.5x+4.5").simplify().tree;
      expect(stateVariables["/l"].stateValues.equation).eqls(eqTree);
      expect(stateVariables["/eq"].stateValues.value).eqls(eqTree);
    });

    cy.log("move points");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -5, y: -8 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 3, y: 5 },
      });

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: -5, y: -10 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: 3, y: 9 },
      });
    });

    cy.get(cesc2("#/eq") + " .mjx-mrow").should("contain.text", "y=2x+1");
    cy.get(cesc2("#/eq") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y=2x+1");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−5,−8)");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(3,5)");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(−5,−10)");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "(3,9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText("y=2x+1").simplify().tree;
      expect(stateVariables["/l"].stateValues.equation).eqls(eqTree);
      expect(stateVariables["/eq"].stateValues.value).eqls(eqTree);
    });
  });

  it("no arguments", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      
      <text>a</text>
      <graph name="g">
      
        <bestFitLine name="l" />
      
      </graph>
      
      $l.equation{assignNames="eq"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/eq"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.equation).eqls("＿");
      expect(stateVariables["/eq"].stateValues.value).eqls("＿");
    });
  });

  it("fit line to 0 points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
      
        <bestFitLine data="$ps" name="l" />
      
      </graph>
      
      $l.equation{assignNames="eq"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/eq"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.equation).eqls("＿");
      expect(stateVariables["/eq"].stateValues.value).eqls("＿");
    });
  });

  it("fit line to 1 point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
      
        <point>(3,4)</point>
        <bestFitLine data="$ps" name="l" />
      
      </graph>
      
      $l.equation{assignNames="eq"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/eq"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y=4");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.equation).eqls(["=", "y", 4]);
      expect(stateVariables["/eq"].stateValues.value).eqls(["=", "y", 4]);
    });

    cy.log("move point");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -5, y: -8 },
      });
    });

    cy.get(cesc("#\\/eq")).should("contain.text", "y=−8");
    cy.get(cesc("#\\/eq"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y=−8");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.equation).eqls(["=", "y", -8]);
      expect(stateVariables["/eq"].stateValues.value).eqls(["=", "y", -8]);
    });
  });

  it("fit line to 2 points, change variables", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
      
        <point>(3,4)</point>
        <point>(-5,0)</point>
        <bestFitLine data="$ps" name="l" variables="t z" />
      
      </graph>
       
      $l.equation{assignNames="eq"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/eq"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z=0.5t+2.5");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText("z=0.5t+2.5").simplify().tree;
      expect(stateVariables["/l"].stateValues.equation).eqls(eqTree);
      expect(stateVariables["/eq"].stateValues.value).eqls(eqTree);
    });

    cy.log("move points to be vertical");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -5, y: -8 },
      });
    });

    cy.get(cesc("#\\/eq")).should("contain.text", "z=−4");
    cy.get(cesc("#\\/eq"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z=−4");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.equation).eqls(["=", "z", -4]);
      expect(stateVariables["/eq"].stateValues.value).eqls(["=", "z", -4]);
    });

    cy.log("move points");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -4, y: -6 },
      });
    });

    cy.get(cesc("#\\/eq")).should("contain.text", "z=2t+2");
    cy.get(cesc("#\\/eq"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z=2t+2");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText("z=2t+2").simplify().tree;
      expect(stateVariables["/l"].stateValues.equation).eqls(eqTree);
      expect(stateVariables["/eq"].stateValues.value).eqls(eqTree);
    });
  });

  it("fit line to points of different dimensions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
        <point>(1,2)</point>
        <point>(1,6, a)</point>
      
        <point>(7,3,3,1,5)</point>
        <point>(7,-1,5,x)</point>
      
        <bestFitLine data="$ps" name="l" />
      
      </graph>
      
      $l.equation{assignNames="eq"}

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/eq"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y=−0.5x+4.5");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText("y=-0.5x+4.5").simplify().tree;
      expect(stateVariables["/l"].stateValues.equation).eqls(eqTree);
      expect(stateVariables["/eq"].stateValues.value).eqls(eqTree);
    });

    cy.log("move points");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -5, y: -8 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 3, y: 5 },
      });

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: -5, y: -10 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: 3, y: 9 },
      });
    });

    cy.get(cesc("#\\/eq")).should("contain.text", "y=2x+1");
    cy.get(cesc("#\\/eq"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y=2x+1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText("y=2x+1").simplify().tree;
      expect(stateVariables["/l"].stateValues.equation).eqls(eqTree);
      expect(stateVariables["/eq"].stateValues.value).eqls(eqTree);
    });
  });

  it("fit line to 4 points, ignore non-numerical points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <text>a</text>
      <graph name="g">
        <point>(a,b)</point>
        <point>(1,2)</point>
        <point>(c,2)</point>
        <point>(1,6)</point>
        <point>(1,d)</point>
      
        <point>(7,3)</point>
        <point>(7+f,3+g)</point>
        <point>(7,-1)</point>
        <point>(,-1)</point>
      
        <bestFitLine data="$ps" name="l" />
      
      </graph>
      
      $l.equation{assignNames="eq"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/eq"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y=−0.5x+4.5");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText("y=-0.5x+4.5").simplify().tree;
      expect(stateVariables["/l"].stateValues.equation).eqls(eqTree);
      expect(stateVariables["/eq"].stateValues.value).eqls(eqTree);
    });

    cy.log("move points");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -5, y: -8 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: 3, y: 5 },
      });

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point6",
        args: { x: -5, y: -10 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point8",
        args: { x: 3, y: 9 },
      });
    });

    cy.get(cesc("#\\/eq")).should("contain.text", "y=2x+1");

    cy.get(cesc("#\\/eq"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y=2x+1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let eqTree = me.fromText("y=2x+1").simplify().tree;
      expect(stateVariables["/l"].stateValues.equation).eqls(eqTree);
      expect(stateVariables["/eq"].stateValues.value).eqls(eqTree);
    });
  });

  it("rounding", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <setup>
        <collect name="ps" componentTypes="point" target="g" />
      </setup>
      
      <graph name="g">
        <point>(1.2345678,2.3456789)</point>
        <point>(1.2345678,6.7891234)</point>
      
        <point>(7.8912345,3.4567891)</point>
        <point>(7.8912345,-1.2345678)</point>
      
        <bestFitLine data="$ps" name="l" />
        <bestFitLine data="$ps" name="l2" displaydigits="5" />
      
      </graph>
      
      $l.equation{assignNames="eq"}
      <p name="data">data: <aslist>$l.data</aslist></p>
      
      $l2.equation{assignNames="eq2"}
      <p name="data2">data2: <aslist>$l2.data</aslist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/eq") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y=−0.519x+5.21");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1.23,2.35)");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(1.23,6.79)");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(7.89,3.46)");

    cy.get(cesc2("#/data") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "(7.89,−1.23)");

    cy.get(cesc2("#/eq2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "y=−0.51922x+5.2084");

    cy.get(cesc2("#/data2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1.2346,2.3457)");

    cy.get(cesc2("#/data2") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(1.2346,6.7891)");

    cy.get(cesc2("#/data2") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(7.8912,3.4568)");

    cy.get(cesc2("#/data2") + " .mjx-mrow")
      .eq(6)
      .should("have.text", "(7.8912,−1.2346)");
  });
});
