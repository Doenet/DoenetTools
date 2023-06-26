import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Integer Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("intersections between two lines", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
  <point>(1,2)</point>
  <point>(2,2)</point>
  <point>(3,2)</point>
  <point>(4,2)</point>
  
  <line through="$_point1 $_point2" />
  <line through="$_point3 $_point4" />
  <intersection assignNames="int1"><copy source="_line1" /><copy source="_line2" /></intersection>
  
  </graph>
  <copy prop="coords" source="_point1" assignNames="coords1" displayDecimals="2" />
  <copy prop="coords" source="_point2" assignNames="coords2" displayDecimals="2" />
  <copy prop="coords" source="_point3" assignNames="coords3" displayDecimals="2" />
  <copy prop="coords" source="_point4" assignNames="coords4" displayDecimals="2" />

  <text>a</text>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.log(`no intersection when lines coincide`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"]).eq(undefined);
    });

    cy.log(`make first line vertical`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3, y: 5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 3, y: -5 },
      });
    });
    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(3,5)");
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(3,−5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].componentType).eq("point");
      expect(stateVariables["/int1"].stateValues.xs[0]).eq(3);
      expect(stateVariables["/int1"].stateValues.xs[1]).eq(2);
    });

    cy.log(`make second line vertical`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: -4, y: 5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: -4, y: -5 },
      });
    });
    cy.get(cesc("#\\/coords3") + " .mjx-mrow").should("contain.text", "(−4,5)");
    cy.get(cesc("#\\/coords4") + " .mjx-mrow").should(
      "contain.text",
      "(−4,−5)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"]).eq(undefined);
    });

    cy.log(`make lines intersect again`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8, y: -7 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 8, y: 9 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: 4, y: 6 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: -4, y: -6 },
      });
    });
    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−8,−7)",
    );
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(8,9)");
    cy.get(cesc("#\\/coords3") + " .mjx-mrow").should("contain.text", "(4,6)");
    cy.get(cesc("#\\/coords4") + " .mjx-mrow").should(
      "contain.text",
      "(−4,−6)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].componentType).eq("point");
      expect(stateVariables["/int1"].stateValues.xs[0]).eq(2);
      expect(stateVariables["/int1"].stateValues.xs[1]).eq(3);
    });

    cy.log(`make lines equal again`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 6, y: 9 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -6, y: -9 },
      });
    });
    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(6,9)");
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should(
      "contain.text",
      "(−6,−9)",
    );
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"]).eq(undefined);
    });
  });

  it("intersection of two lines hides dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
  <point>(1,2)</point>
  <point>(2,2)</point>
  <point>(3,2)</point>
  <point>(4,2)</point>
  <line through="$_point1 $_point2" />
  <line through="$_point3 $_point4" />
  </graph>

  <booleaninput name='h1' prefill="false" >
    <label>Hide first intersection</label>
  </booleaninput>
  <booleaninput name='h2' prefill="true" >
    <label>Hide second intersection</label>
  </booleaninput>
  
  <p name="i1">Intersection 1: <intersection hide="$h1"><copy source="_line1" /><copy source="_line2" /></intersection></p>
  <p name="i2">Intersection 2: <intersection hide="$h2"><copy source="_line1" /><copy source="_line2" /></intersection></p>

  <copy prop="value" source="h1" assignNames="h1Val" />
  <copy prop="value" source="h2" assignNames="h2Val" />
  <copy prop="coords" source="_point1" assignNames="coords1" displayDecimals="2" />
  <copy prop="coords" source="_point2" assignNames="coords2" displayDecimals="2" />
  <copy prop="coords" source="_point3" assignNames="coords3" displayDecimals="2" />
  <copy prop="coords" source="_point4" assignNames="coords4" displayDecimals="2" />
  <text>a</text>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/h1Val")).should("have.text", "false");
    cy.get(cesc("#\\/h2Val")).should("have.text", "true");
    cy.get(cesc("#\\/i1")).find(".mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/i2")).find(".mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();
    cy.get(cesc("#\\/h1Val")).should("have.text", "true");
    cy.get(cesc("#\\/h2Val")).should("have.text", "false");
    cy.get(cesc("#\\/i1")).find(".mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/i2")).find(".mjx-mrow").should("not.exist");

    cy.log(`make first line vertical`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 3, y: 5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 3, y: -5 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(3,5)");
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(3,−5)");

    cy.get(cesc("#\\/i1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/i2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();
    cy.get(cesc("#\\/h1Val")).should("have.text", "false");
    cy.get(cesc("#\\/h2Val")).should("have.text", "true");
    cy.get(cesc("#\\/i2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/i1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3,2)");
      });

    cy.log(`make second line vertical`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: -4, y: 5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: -4, y: -5 },
      });
    });

    cy.get(cesc("#\\/coords3") + " .mjx-mrow").should("contain.text", "(−4,5)");
    cy.get(cesc("#\\/coords4") + " .mjx-mrow").should(
      "contain.text",
      "(−4,−5)",
    );

    cy.get(cesc("#\\/i1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/i2") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();

    cy.get(cesc("#\\/h1Val")).should("have.text", "true");
    cy.get(cesc("#\\/h2Val")).should("have.text", "false");
    cy.get(cesc("#\\/i1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/i2") + " .mjx-mrow").should("not.exist");

    cy.log(`make lines intersect again`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -8, y: -7 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: 8, y: 9 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: 4, y: 6 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: -4, y: -6 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
      "contain.text",
      "(−8,−7)",
    );
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", "(8,9)");
    cy.get(cesc("#\\/coords3") + " .mjx-mrow").should("contain.text", "(4,6)");
    cy.get(cesc("#\\/coords4") + " .mjx-mrow").should(
      "contain.text",
      "(−4,−6)",
    );

    cy.get(cesc("#\\/i1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/i2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,3)");
      });

    cy.get(cesc("#\\/h1")).click();
    cy.get(cesc("#\\/h2")).click();

    cy.get(cesc("#\\/h1Val")).should("have.text", "false");
    cy.get(cesc("#\\/h2Val")).should("have.text", "true");
    cy.get(cesc("#\\/i1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2,3)");
      });
    cy.get(cesc("#\\/i2") + " .mjx-mrow").should("not.exist");

    cy.log(`make lines equal again`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: 6, y: 9 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: -6, y: -9 },
      });
    });

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", "(6,9)");
    cy.get(cesc("#\\/coords2") + " .mjx-mrow").should(
      "contain.text",
      "(−6,−9)",
    );

    cy.get(cesc("#\\/i1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/i2") + " .mjx-mrow").should("not.exist");
  });

  it("intersections between two circles", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <mathinput name="r1" prefill="1" />
      <mathinput name="r2" prefill="1" />

      <graph>
        <point name="P1">(3,4)</point>
        <circle name="c1" center="$P1" radius="$r1" />
        <point name="P2">(3,6)</point>
        <circle name="c2" center="$P2" radius="$r2" />

        <intersection styleNumber="2" assignNames="int1 int2">$c1 $c2</intersection>

      </graph>

      <p>
        <copy source="r1" assignNames="r1a" />
        <copy source="r2" assignNames="r2a" />
        <copy source="P1" assginNames="P1a" />
        <copy source="P2" assginNames="P2a" />
        <copy source="int1" assignNames="int1a" />
        <copy source="int2" assignNames="int2a" />
      </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("start with single intersection");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].stateValues.xs).eqls([3, 5]);
      expect(stateVariables["/int2"]).eq(undefined);
    });

    cy.log("move first circle up");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P1",
        args: { x: 3, y: 5 },
      });
    });

    cy.get(cesc2("#/int1a") + " .mjx-mrow").should("contain.text", "5.5");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].stateValues.xs[0]).closeTo(
        3 + Math.sqrt(3) / 2,
        1e-12,
      );
      expect(stateVariables["/int1"].stateValues.xs[1]).eq(5.5);
      expect(stateVariables["/int2"].stateValues.xs[0]).closeTo(
        3 - Math.sqrt(3) / 2,
        1e-12,
      );
      expect(stateVariables["/int2"].stateValues.xs[1]).eq(5.5);
    });

    cy.log("increase radius of second circle");

    cy.get(cesc2("#/r2") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc2("#/int2a")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/int2"]).eq(undefined);
    });

    cy.log("increase radius of second circle further");

    cy.get(cesc2("#/r2") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc2("#/int1a")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"]).eq(undefined);
      expect(stateVariables["/int2"]).eq(undefined);
    });

    cy.log("increase radius of first circle");

    cy.get(cesc2("#/r1") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc2("#/r1a") + " .mjx-mrow").should("contain.text", "2");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"]).eq(undefined);
      expect(stateVariables["/int2"]).eq(undefined);
    });

    cy.log("make 30-60-90 triangle");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P2",
        args: { x: 3 - 2 * Math.sqrt(3), y: 5 },
      });
    });

    cy.get(cesc2("#/int1a") + " .mjx-mrow").should("contain.text", "(3,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].stateValues.xs[0]).closeTo(3, 1e-12);
      expect(stateVariables["/int1"].stateValues.xs[1]).closeTo(7, 1e-12);
      expect(stateVariables["/int2"].stateValues.xs[0]).closeTo(3, 1e-12);
      expect(stateVariables["/int2"].stateValues.xs[1]).closeTo(3, 1e-12);
    });

    cy.log("increase radius of first circle");

    cy.get(cesc2("#/r1") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc2("#/r1a") + " .mjx-mrow").should("contain.text", "4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let h = Math.sqrt(16 - 3);

      expect(stateVariables["/int1"].stateValues.xs[0]).closeTo(
        3 - Math.sqrt(3),
        1e-12,
      );
      expect(stateVariables["/int1"].stateValues.xs[1]).closeTo(5 + h, 1e-12);
      expect(stateVariables["/int2"].stateValues.xs[0]).closeTo(
        3 - Math.sqrt(3),
        1e-12,
      );
      expect(stateVariables["/int2"].stateValues.xs[1]).closeTo(5 - h, 1e-12);
    });

    cy.log("make circles identical");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P1",
        args: { x: 3 - 2 * Math.sqrt(3), y: 5 },
      });
    });

    cy.get(cesc2("#/int1a")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"]).eq(undefined);
      expect(stateVariables["/int2"]).eq(undefined);
    });
  });

  it("intersections between line and circle", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <mathinput name="r" prefill="1" />

      <graph>
        <point name="P">(3,4)</point>
        <circle name="c" center="$P" radius="$r" />
        <point name="A">(4,1)</point>
        <point name="B">(4,-4)</point>
        <line name="l" through="$A $B" />
      
        <intersection styleNumber="2" assignNames="int1 int2">$l $c</intersection>

      </graph>

      <p>
        <copy source="r" assignNames="ra" />
        <copy source="P" assginNames="Pa" />
        <copy source="A" assginNames="Aa" />
        <copy source="B" assginNames="Ba" />
        <copy source="int1" assignNames="int1a" />
        <copy source="int2" assignNames="int2a" />
      </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("start with single intersection");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].stateValues.xs).eqls([4, 4]);
      expect(stateVariables["/int2"]).eq(undefined);
    });

    cy.log("move circle up nad to right");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 4, y: 5 },
      });
    });

    cy.get(cesc2("#/int2a") + " .mjx-mrow").should("contain.text", "(4,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].stateValues.xs).eqls([4, 6]);
      expect(stateVariables["/int2"].stateValues.xs).eqls([4, 4]);
    });

    cy.log("increase radius of circle");

    cy.get(cesc2("#/r") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc2("#/int2a") + " .mjx-mrow").should("contain.text", "(4,3)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].stateValues.xs).eqls([4, 7]);
      expect(stateVariables["/int2"].stateValues.xs).eqls([4, 3]);
    });

    cy.log("move line point 1");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -2, y: 2 },
      });
    });

    cy.get(cesc2("#/int1a")).should("not.exist");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"]).eq(undefined);
      expect(stateVariables["/int2"]).eq(undefined);
    });

    cy.log("increase radius of circle to make it tangent to line");

    cy.get(cesc2("#/r") + " textarea").type(
      "{end}{backspace}9/\\sqrt{2}{enter}",
      {
        force: true,
      },
    );

    cy.get(cesc2("#/int1a") + " .mjx-mrow").should(
      "contain.text",
      "(−0.5,0.5)",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].stateValues.xs).eqls([-0.5, 0.5]);
      expect(stateVariables["/int2"]).eq(undefined);
    });

    cy.log("increase radius of circle further");

    cy.get(cesc2("#/r") + " textarea").type(
      "{end}{backspace}{backspace}{backspace}{backspace}9{enter}",
      {
        force: true,
      },
    );

    cy.get(cesc2("#/int1a") + " .mjx-mrow").should("contain.text", "(−5,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/int1"].stateValues.xs).eqls([-5, 5]);
      expect(stateVariables["/int2"].stateValues.xs).eqls([4, -4]);
    });
  });

  it("intersection involving zero or one object returns nothing", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>

      <graph>
        <circle name="c" center="(3,4)" radius="2" />
        <line name="l" through="(4,8) (5,8)" />
      
        <intersection assignNames="int1">$l</intersection>
        <intersection assignNames="int2">$c</intersection>
        <intersection assignNames="int3"></intersection>

      </graph>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("start with single intersection");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_intersection1"].replacements.length).eq(0);
      expect(stateVariables["/_intersection2"].replacements.length).eq(0);
      expect(stateVariables["/_intersection3"].replacements.length).eq(0);
      expect(stateVariables["/int1"]).eq(undefined);
      expect(stateVariables["/int2"]).eq(undefined);
      expect(stateVariables["/int3"]).eq(undefined);
    });
  });
});
