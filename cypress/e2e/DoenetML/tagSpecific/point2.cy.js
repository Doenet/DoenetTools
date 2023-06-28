import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Point Tag Tests 2", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("points depending on each other", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point x="$(_point2.y)" y="7" />
    <point x="$(_point1.y)" y="9" />
  
  </graph>
  
  <copy prop="coords" target="_point1" assignNames="coords1" />
      
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial values");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `(9,7)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 9;
      let y = 7;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: y, y: x },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
      });
    });
  });

  it("points depending on each other 2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point>(<copy prop="y" target="_point2" />, 7)</point>
    <point>(<copy prop="y" target="_point1" />, 9)</point>
  </graph>
      
  <copy prop="coords" target="_point1" assignNames="coords1" />

  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial values");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `(9,7)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 9;
      let y = 7;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: y, y: x },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
      });
    });
  });

  it("points depending on each other through intermediaries", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point x="$(P2a.y)" y="7" />
    <point x="$(P1a.y)" y="9" />
  </graph>
  
  <graph>
    <copy name="P1a" target="_point1" assignNames="P1ap" />
    <copy name="P2a" target="_point2" assignNames="P2ap" />
  </graph>

  <copy prop="coords" target="_point1" assignNames="coords1" />
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial values");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `(9,7)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 9;
      let y = 7;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);

      expect(stateVariables["/P1ap"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/P1ap"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/P2ap"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/P2ap"].stateValues.xs[1]).eq(x);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);

        expect(stateVariables["/P1ap"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/P1ap"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/P2ap"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/P2ap"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: y, y: x },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);

        expect(stateVariables["/P1ap"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/P1ap"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/P2ap"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/P2ap"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move point 3");
    cy.window().then(async (win) => {
      let x = 6;
      let y = -1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/P1ap",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);

        expect(stateVariables["/P1ap"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/P1ap"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/P2ap"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/P2ap"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move point 4");
    cy.window().then(async (win) => {
      let x = -3;
      let y = 2;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/P2ap",
        args: { x: y, y: x },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);

        expect(stateVariables["/P1ap"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/P1ap"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/P2ap"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/P2ap"].stateValues.xs[1]).eq(x);
      });
    });
  });

  it("points depending on each other through intermediaries 2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point>(<copy prop="y" target="P2a" />, 7)</point>
    <point>(<copy prop="y" target="P1a" />, 9)</point>
  </graph>
  
  <graph>
    <copy name="P1a" target="_point1" assignNames="P1ap" />
    <copy name="P2a" target="_point2" assignNames="P2ap" />
  </graph>

  <copy prop="coords" target="_point1" assignNames="coords1" />

  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial values");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `(9,7)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 9;
      let y = 7;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);

      expect(stateVariables["/P1ap"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/P1ap"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/P2ap"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/P2ap"].stateValues.xs[1]).eq(x);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);

        expect(stateVariables["/P1ap"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/P1ap"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/P2ap"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/P2ap"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: y, y: x },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);

        expect(stateVariables["/P1ap"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/P1ap"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/P2ap"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/P2ap"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move point 3");
    cy.window().then(async (win) => {
      let x = 6;
      let y = -1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/P1ap",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);

        expect(stateVariables["/P1ap"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/P1ap"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/P2ap"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/P2ap"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move point 4");
    cy.window().then(async (win) => {
      let x = -3;
      let y = 2;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/P2ap",
        args: { x: y, y: x },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);

        expect(stateVariables["/P1ap"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/P1ap"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/P2ap"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/P2ap"].stateValues.xs[1]).eq(x);
      });
    });
  });

  it("points depending on each other, one using coords", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point coords="($(_point2.y), 7)" />
    <point x="$(_point1.y)" y="9" />
  
  </graph>

  <copy prop="coords" target="_point1" assignNames="coords1" />

  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial values");

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `(9,7)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = 9;
      let y = 7;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
    });

    cy.log("move point 1");
    cy.window().then(async (win) => {
      let x = -3;
      let y = 5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move point 2");
    cy.window().then(async (win) => {
      let x = 7;
      let y = 9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: y, y: x },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(x);
      });
    });
  });

  it("points depending on themselves", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point>(3, 2<copy prop="x" target="_point1"/>+1)</point>
    <point>(2<copy prop="y" target="_point2"/>+1, 3)</point>
  </graph>
     
  <copy prop="coords" target="_point1" assignNames="coords1" />
  <copy prop="coords" target="_point2" assignNames="coords2" />
  
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial values");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = 3;
      let y1 = 2 * x1 + 1;

      let y2 = 3;
      let x2 = 2 * y2 + 1;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y1);

      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(x2);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(y2);

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `(${x1},${y1})`,
      );
    });

    cy.log("move points");
    cy.window().then(async (win) => {
      let x1 = -3;
      let y1try = 5;

      let x2 = 9;
      let y2try = -7;

      let y1 = 2 * x1 + 1;
      let y2 = (x2 - 1) / 2;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1try },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2try },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x1)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y1)}`,
      );
      cy.get(cesc("#\\/coords2") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x2)}`,
      );
      cy.get(cesc("#\\/coords2") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x1);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y1);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(x2);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(y2);
      });
    });
  });

  it("points depending original graph axis limit", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point x="3" y="$(_graph1.ymax{fixed='true'})" />
    <point>
      (<copy prop="xmin" fixed="true" target="_graph1" />,5)
    </point>
  </graph>

  <copy prop="coords" target="_point1" assignNames="coords1" />
  <copy prop="coords" target="_point2" assignNames="coords2" />
  
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial values");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = 3;
      let y1 = 10;
      let x2 = -10;
      let y2 = 5;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y1);

      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(x2);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(y2);

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `(${x1},${y1})`,
      );
    });

    cy.log("move points");
    cy.window().then(async (win) => {
      let x1 = 1;
      let y1 = 5;
      let x2 = 8;
      let y2 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x1)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `10`);
      cy.get(cesc("#\\/coords2") + " .mjx-mrow").should("contain.text", `−10`);
      cy.get(cesc("#\\/coords2") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y2)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x1);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(10);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(-10);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(y2);
      });
    });
  });

  it("label points by combining coordinates with other point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point>
      <label><text><copy prop="x" displaydigits="3" target="_point1" />, <copy prop="x" displaydigits="3" target="_point2" /></text></label>
      (1,2)
    </point>
    <point>
      (3,4)
      <label><text><copy prop="y" displaydigits="3" target="_point1" />, <copy prop="y" displaydigits="3" target="_point2" /></text></label>
    </point>
  </graph>

  <p>Label 1: <copy prop="label" target="_point1" /></p>
  <p>Label 2: <copy prop="label" target="_point2" /></p>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial values");

    cy.get(cesc("#\\/_p1")).should("have.text", "Label 1: 1, 3");
    cy.get(cesc("#\\/_p2")).should("have.text", "Label 2: 2, 4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = 1;
      let y1 = 2;
      let x2 = 3;
      let y2 = 4;

      let label1 = `${x1}, ${x2}`;
      let label2 = `${y1}, ${y2}`;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y1);

      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(x2);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(y2);

      expect(stateVariables["/_point1"].stateValues.label).eq(label1);
      expect(stateVariables["/_point2"].stateValues.label).eq(label2);
    });

    cy.log("move points");
    cy.window().then(async (win) => {
      let x1 = 1;
      let y1 = 5;
      let x2 = 8;
      let y2 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2 },
      });

      let label1 = `${x1}, ${x2}`;
      let label2 = `${y1}, ${y2}`;

      cy.get(cesc("#\\/_p1")).should("have.text", `Label 1: ${label1}`);
      cy.get(cesc("#\\/_p2")).should("have.text", `Label 2: ${label2}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x1);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y1);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(x2);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(y2);

        expect(stateVariables["/_point1"].stateValues.label).eq(label1);
        expect(stateVariables["/_point2"].stateValues.label).eq(label2);

        cy.get(cesc("#\\/_p1")).should("have.text", `Label 1: ${label1}`);
        cy.get(cesc("#\\/_p2")).should("have.text", `Label 2: ${label2}`);
      });
    });

    cy.log("move points to fractional coordinates");
    cy.window().then(async (win) => {
      let x1 = 3.12552502;
      let y1 = -3.4815436398;
      let x2 = 0.36193540738;
      let y2 = 7.813395519475;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2 },
      });

      let x1round = me.fromAst(x1).round_numbers_to_precision(3);
      let y1round = me.fromAst(y1).round_numbers_to_precision(3);
      let x2round = me.fromAst(x2).round_numbers_to_precision(3);
      let y2round = me.fromAst(y2).round_numbers_to_precision(3);

      let label1 = `${x1round}, ${x2round}`;
      let label2 = `${y1round}, ${y2round}`;

      cy.get(cesc("#\\/_p1")).should("have.text", `Label 1: ${label1}`);
      cy.get(cesc("#\\/_p2")).should("have.text", `Label 2: ${label2}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x1);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y1);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(x2);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(y2);

        expect(stateVariables["/_point1"].stateValues.label).eq(label1);
        expect(stateVariables["/_point2"].stateValues.label).eq(label2);
      });
    });
  });

  it("label points by combining coordinates with other point 2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <point>
      <label><copy prop="x" displaydigits="3" target="_point1" />, <copy prop="x" displaydigits="3" target="_point2" /></label>
      (1,2)
    </point>
    <point>
      (3,4)
      <label><copy prop="y" displaydigits="3" target="_point1" />, <copy prop="y" displaydigits="3" target="_point2" /></label>
    </point>
  </graph>

  <p>Label 1: <copy prop="label" target="_point1" /></p>
  <p>Label 2: <copy prop="label" target="_point2" /></p>
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("initial values");

    cy.get(cesc("#\\/_p1")).should("contain.text", "Label 1: ");
    cy.get(cesc("#\\/_p2")).should("contain.text", "Label 2: ");
    cy.get(cesc("#\\/_p1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("1");
      });
    cy.get(cesc("#\\/_p1"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text).eq("3");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("2");
      });
    cy.get(cesc("#\\/_p2"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text).eq("4");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x1 = 1;
      let y1 = 2;
      let x2 = 3;
      let y2 = 4;

      let label1 = `\\(${x1}\\), \\(${x2}\\)`;
      let label2 = `\\(${y1}\\), \\(${y2}\\)`;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x1);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y1);

      expect(stateVariables["/_point2"].stateValues.xs[0]).eq(x2);
      expect(stateVariables["/_point2"].stateValues.xs[1]).eq(y2);

      expect(stateVariables["/_point1"].stateValues.label).eq(label1);
      expect(stateVariables["/_point2"].stateValues.label).eq(label2);
    });

    cy.log("move points");
    cy.window().then(async (win) => {
      let x1 = 1;
      let y1 = 5;
      let x2 = 8;
      let y2 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2 },
      });

      let label1 = `\\(${x1}\\), \\(${x2}\\)`;
      let label2 = `\\(${y1}\\), \\(${y2}\\)`;

      cy.get(cesc("#\\/_p1")).should("contain.text", `${x2}`);

      cy.get(cesc("#\\/_p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq(`${x1}`);
        });
      cy.get(cesc("#\\/_p1"))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text).eq(`${x2}`);
        });
      cy.get(cesc("#\\/_p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq(`${y1}`);
        });
      cy.get(cesc("#\\/_p2"))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text).eq(`−3`);
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x1);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y1);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(x2);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(y2);

        expect(stateVariables["/_point1"].stateValues.label).eq(label1);
        expect(stateVariables["/_point2"].stateValues.label).eq(label2);
      });
    });

    cy.log("move points to fractional coordinates");
    cy.window().then(async (win) => {
      let x1 = 3.12552502;
      let y1 = -3.4815436398;
      let x2 = 0.36193540738;
      let y2 = 7.813395519475;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2 },
      });

      let x1round = me.fromAst(x1).round_numbers_to_precision(3);
      let y1round = me.fromAst(y1).round_numbers_to_precision(3);
      let x2round = me.fromAst(x2).round_numbers_to_precision(3);
      let y2round = me.fromAst(y2).round_numbers_to_precision(3);

      let label1 = `\\(${x1round}\\), \\(${x2round}\\)`;
      let label2 = `\\(${y1round}\\), \\(${y2round}\\)`;

      cy.get(cesc("#\\/_p1")).should("contain.text", `${x2round}`);

      cy.get(cesc("#\\/_p1"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq(`${x1round}`);
        });
      cy.get(cesc("#\\/_p1"))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text).eq(`${x2round}`);
        });
      cy.get(cesc("#\\/_p2"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text).eq(`−3.48`);
        });
      cy.get(cesc("#\\/_p2"))
        .find(".mjx-mrow")
        .eq(1)
        .invoke("text")
        .then((text) => {
          expect(text).eq(`${y2round}`);
        });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x1);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y1);

        expect(stateVariables["/_point2"].stateValues.xs[0]).eq(x2);
        expect(stateVariables["/_point2"].stateValues.xs[1]).eq(y2);

        expect(stateVariables["/_point1"].stateValues.label).eq(label1);
        expect(stateVariables["/_point2"].stateValues.label).eq(label2);
      });
    });
  });

  it("update point with constraints", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math hide name="fixed0" fixed>0</math>
    <graph>
      <point x="-4" y="1">
        <constraints>
          <attractTo><point>(1,-7)</point></attractTo>
        </constraints>
      </point>
      <point x="$(_point1.x)" y="$fixed0" />
      <point y="$(_point1.y)" x="$fixed0" />
    </graph>

    <copy prop="coords" target="_point1" assignNames="coords1" />
    
    <booleaninput name="bi" /><copy prop="value" target="bi" assignNames="b" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/coords1") + " .mjx-mrow").should("contain.text", `(−4,1)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = -4;
      let y = 1;

      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(x);
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(0);
      expect(stateVariables["/_point4"].stateValues.xs[0]).eq(0);
      expect(stateVariables["/_point4"].stateValues.xs[1]).eq(y);
    });

    cy.log("move first point");
    cy.window().then(async (win) => {
      let x = 3;
      let y = -2;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x, y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/_point3"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point3"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/_point4"].stateValues.xs[0]).eq(0);
        expect(stateVariables["/_point4"].stateValues.xs[1]).eq(y);
      });
    });

    cy.log("move x-axis point");
    cy.window().then(async (win) => {
      let x = 9;
      let y = -2;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x, y: -3 },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/_point3"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point3"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/_point4"].stateValues.xs[0]).eq(0);
        expect(stateVariables["/_point4"].stateValues.xs[1]).eq(y);
      });
    });

    cy.log("move y-axis point");
    cy.window().then(async (win) => {
      let x = 9;
      let y = -7.1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: -10, y: y },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(x)}`,
      );
      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `${Math.abs(y)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/_point3"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point3"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/_point4"].stateValues.xs[0]).eq(0);
        expect(stateVariables["/_point4"].stateValues.xs[1]).eq(y);
      });
    });

    cy.log("move near attractor");
    cy.window().then(async (win) => {
      let x = 1;
      let y = -7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: 0.9, y: 6 },
      });

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `(1,−7)`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/_point3"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point3"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/_point4"].stateValues.xs[0]).eq(0);
        expect(stateVariables["/_point4"].stateValues.xs[1]).eq(y);
      });
    });

    cy.log("move again near attractor to make sure doesn't change");
    cy.window().then(async (win) => {
      let x = 1;
      let y = -7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: 1.1, y: 6 },
      });

      // since nothing has changed in the DOM
      // check boolean input and wait for it to change
      // to make sure got message back from core
      cy.get(cesc("#\\/bi")).click();
      cy.get(cesc("#\\/b")).should("have.text", "true");

      cy.get(cesc("#\\/coords1") + " .mjx-mrow").should(
        "contain.text",
        `(1,−7)`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/_point3"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/_point3"].stateValues.xs[1]).eq(0);
        expect(stateVariables["/_point4"].stateValues.xs[0]).eq(0);
        expect(stateVariables["/_point4"].stateValues.xs[1]).eq(y);
      });
    });
  });

  it("change point dimensions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Specify point coordinates: <mathinput name="originalCoords" /></p>

    <section name="thePoints"><title>The points</title>
    <p name="point1p">The point: <point coords="$originalCoords"/></p>
    <p name="point2p">The point copied: <copy assignNames="point2" target="_point1"/></p>
    <p name="point3p">The point copied again: <copy assignNames="point3" target="point2"/></p>
    </section>

    <section><title>From point 1</title>
    <p>Number of dimensions: <copy assignNames="numDimensions1" prop="numDimensions" target="_point1" /></p>
    <p name="p1x">x-coordinate: <copy assignNames="point1x1" prop="x1" target="_point1"/></p>
    <p name="p1y">y-coordinate: <copy assignNames="point1x2" prop="x2" target="_point1"/></p>
    <p name="p1z">z-coordinate: <copy assignNames="point1x3" prop="x3" target="_point1"/></p>
    <p name="p1all">All individual coordinates: <aslist><copy prop="xs" target="_point1"/></aslist></p>
    <p>Coordinates: <copy assignNames="coords1" prop="coords" target="_point1"/></p>
    </section>

    <section><title>From point 2</title>
    <p>Number of dimensions: <copy assignNames="numDimensions2" prop="numDimensions" target="point2" /></p>
    <p name="p2x">x-coordinate: <copy assignNames="point2x1" prop="x1" target="point2"/></p>
    <p name="p2y">y-coordinate: <copy assignNames="point2x2" prop="x2" target="point2"/></p>
    <p name="p2z">z-coordinate: <copy assignNames="point2x3" prop="x3" target="point2"/></p>
    <p name="p2all">All individual coordinates: <aslist><copy prop="xs" target="point2"/></aslist></p>
    <p>Coordinates: <copy assignNames="coords2" prop="coords" target="point2"/></p>
    </section>

    <section><title>From point 3</title>
    <p>Number of dimensions: <copy assignNames="numDimensions3" prop="numDimensions" target="point3" /></p>
    <p name="p3x">x-coordinate: <copy assignNames="point3x1" prop="x1" target="point3"/></p>
    <p name="p3y">y-coordinate: <copy assignNames="point3x2" prop="x2" target="point3"/></p>
    <p name="p3z">z-coordinate: <copy assignNames="point3x3" prop="x3" target="point3"/></p>
    <p name="p3all">All individual coordinates: <aslist><copy prop="xs" target="point3"/></aslist></p>
    <p>Coordinates: <copy assignNames="coords3" prop="coords" target="point3"/></p>
    </section>

    <section><title>For point 1</title>
    <p>Change coords: <mathinput name="coords1b" bindValueTo="$(_point1.coords)" /></p>
    <p>Change x-coordinate: <mathinput name="point1x1b" bindValueTo="$(_point1.x1)" /></p>
    <p>Change y-coordinate: <mathinput name="point1x2b" bindValueTo="$(_point1.x2)" /></p>
    <p>Change z-coordinate: <mathinput name="point1x3b" bindValueTo="$(_point1.x3)" /></p>    
    </section>

    <section><title>For point 2</title>
    <p>Change coords: <mathinput name="coords2b" bindValueTo="$(point2.coords)" /></p>
    <p>Change x-coordinate: <mathinput name="point2x1b" bindValueTo="$(point2.x1)" /></p>
    <p>Change y-coordinate: <mathinput name="point2x2b" bindValueTo="$(point2.x2)" /></p>
    <p>Change z-coordinate: <mathinput name="point2x3b" bindValueTo="$(point2.x3)" /></p>    
    </section>

    <section><title>For point 3</title>
    <p>Change coords: <mathinput name="coords3b" bindValueTo="$(point3.coords)" /></p>
    <p>Change x-coordinate: <mathinput name="point3x1b" bindValueTo="$(point3.x1)" /></p>
    <p>Change y-coordinate: <mathinput name="point3x2b" bindValueTo="$(point3.x2)" /></p>
    <p>Change z-coordinate: <mathinput name="point3x3b" bindValueTo="$(point3.x3)" /></p>    
    </section>

    <section><title>collecting</title>
    <p name="pallx">x-coordinates: <aslist><collect assignNames="pointallx1A pointallx1B pointallx1C" componentTypes="point" prop="x1" target="thePoints"/></aslist></p>
    <p name="pally">y-coordinates: <aslist><collect assignNames="pointallx2A pointallx2B pointallx2C" componentTypes="point" prop="x2" target="thePoints"/></aslist></p>
    <p name="pallz">z-coordinates: <aslist><collect assignNames="pointallx3A pointallx3B pointallx3C" componentTypes="point" prop="x3" target="thePoints"/></aslist></p>
    <p name="pallall">All individual coordinates: <aslist><collect assignNames="pointallxsA pointallxsB pointallxsC" componentTypes="point" prop="xs" target="thePoints"/></aslist></p>
    <p>Coordinates: <aslist><collect assignNames="coordsallA coordsallB coordsallC" componentTypes="point" prop="coords" target="thePoints"/></aslist></p>
    </section>

    <section><title>Extracting from point 3</title>
    <p name="p3xe">x-coordinate: <extract assignNames="point3x1e" prop="x1"><copy target="point3"/></extract></p>
    <p name="p3ye">y-coordinate: <extract assignNames="point3x2e" prop="x2"><copy target="point3"/></extract></p>
    <p name="p3ze">z-coordinate: <extract assignNames="point3x3e" prop="x3"><copy target="point3"/></extract></p>
    <p name="p3alle">All individual coordinates: <aslist><extract prop="xs"><copy target="point3"/></extract></aslist></p>
    <p>Coordinates: <extract assignNames="coords3e" prop="coords"><copy target="point3"/></extract></p>
    </section>
 
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "1");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "1");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "1");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/p1y")).should("have.text", "y-coordinate: ");
    cy.get(cesc("#\\/p2y")).should("have.text", "y-coordinate: ");
    cy.get(cesc("#\\/p3y")).should("have.text", "y-coordinate: ");
    cy.get(cesc("#\\/p3ye")).should("have.text", "y-coordinate: ");
    cy.get(cesc("#\\/pally")).should("have.text", "y-coordinates: ");
    cy.get(cesc("#\\/p1z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p2z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3ze")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/pallz")).should("have.text", "z-coordinates: ");

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });

    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });

    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });

    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("＿");
      expect(stateVariables["/_point1"].stateValues.x1).eq("＿");
      expect(stateVariables["/_point1"].stateValues.x2).eq(undefined);
      expect(stateVariables["/_point1"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(1);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("＿");
      expect(stateVariables["/point2"].stateValues.x1).eq("＿");
      expect(stateVariables["/point2"].stateValues.x2).eq(undefined);
      expect(stateVariables["/point2"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(1);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("＿");
      expect(stateVariables["/point3"].stateValues.x1).eq("＿");
      expect(stateVariables["/point3"].stateValues.x2).eq(undefined);
      expect(stateVariables["/point3"].stateValues.x3).eq(undefined);
    });

    cy.log("Create 2D point");
    cy.get(cesc("#\\/originalCoords") + " textarea").type(
      "{end}{backspace}(a,b){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should("contain.text", "(a,b)");
    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "2");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "2");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "2");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p1z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p2z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3ze")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/pallz")).should("have.text", "z-coordinates: ");

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p1all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p2all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p3all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p3alle")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(6).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(7).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(8).should("not.exist");

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("b");
      expect(stateVariables["/_point1"].stateValues.x1).eq("a");
      expect(stateVariables["/_point1"].stateValues.x2).eq("b");
      expect(stateVariables["/_point1"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("b");
      expect(stateVariables["/point2"].stateValues.x1).eq("a");
      expect(stateVariables["/point2"].stateValues.x2).eq("b");
      expect(stateVariables["/point2"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("b");
      expect(stateVariables["/point3"].stateValues.x1).eq("a");
      expect(stateVariables["/point3"].stateValues.x2).eq("b");
      expect(stateVariables["/point3"].stateValues.x3).eq(undefined);
    });

    cy.log("Back to 1D point");
    cy.get(cesc("#\\/originalCoords") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}q{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should("contain.text", "q");

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "1");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "1");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "1");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });

    cy.get(cesc("#\\/p1y")).should("have.text", "y-coordinate: ");
    cy.get(cesc("#\\/p2y")).should("have.text", "y-coordinate: ");
    cy.get(cesc("#\\/p3y")).should("have.text", "y-coordinate: ");
    cy.get(cesc("#\\/p3ye")).should("have.text", "y-coordinate: ");
    cy.get(cesc("#\\/pally")).should("have.text", "y-coordinates: ");

    cy.get(cesc("#\\/p1z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p2z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3ze")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/pallz")).should("have.text", "z-coordinates: ");

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p1all")).find(".mjx-mrow").eq(1).should("not.exist");
    cy.get(cesc("#\\/p1all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p2all")).find(".mjx-mrow").eq(1).should("not.exist");
    cy.get(cesc("#\\/p2all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p3all")).find(".mjx-mrow").eq(1).should("not.exist");
    cy.get(cesc("#\\/p3all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p3alle")).find(".mjx-mrow").eq(1).should("not.exist");
    cy.get(cesc("#\\/p3alle")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(3).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(4).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(5).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(6).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(7).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(8).should("not.exist");

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("q");
      expect(stateVariables["/_point1"].stateValues.x1).eq("q");
      expect(stateVariables["/_point1"].stateValues.x2).eq(undefined);
      expect(stateVariables["/_point1"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(1);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("q");
      expect(stateVariables["/point2"].stateValues.x1).eq("q");
      expect(stateVariables["/point2"].stateValues.x2).eq(undefined);
      expect(stateVariables["/point2"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(1);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("q");
      expect(stateVariables["/point3"].stateValues.x1).eq("q");
      expect(stateVariables["/point3"].stateValues.x2).eq(undefined);
      expect(stateVariables["/point3"].stateValues.x3).eq(undefined);
    });

    cy.log("Create 3D point");
    cy.get(cesc("#\\/originalCoords") + " textarea").type(
      "{end}{backspace}\\langle 2x,u/v{rightarrow},w^2{rightarrow}\\rangle {enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should(
      "contain.text",
      "(2x,uv,w2)",
    );

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "3");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/point1x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });
    cy.get(cesc("#\\/point2x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });
    cy.get(cesc("#\\/point3x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });
    cy.get(cesc("#\\/point3x3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });
    cy.get(cesc("#\\/pointallx3A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });
    cy.get(cesc("#\\/pointallx3B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });
    cy.get(cesc("#\\/pointallx3C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });
    cy.get(cesc("#\\/p3alle") + " .mjx-mrow").should("contain.text", "2x");
    cy.get(cesc("#\\/p3alle") + " .mjx-mrow").should("contain.text", "uv");
    cy.get(cesc("#\\/p3alle") + " .mjx-mrow").should("contain.text", "w2");
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(8)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(9)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("uv");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(10)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("w2");
      });

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eqls(["*", 2, "x"]);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eqls([
        "/",
        "u",
        "v",
      ]);
      expect(stateVariables["/_point1"].stateValues.xs[2]).eqls(["^", "w", 2]);
      expect(stateVariables["/_point1"].stateValues.x1).eqls(["*", 2, "x"]);
      expect(stateVariables["/_point1"].stateValues.x2).eqls(["/", "u", "v"]);
      expect(stateVariables["/_point1"].stateValues.x3).eqls(["^", "w", 2]);
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point2"].stateValues.xs[0]).eqls(["*", 2, "x"]);
      expect(stateVariables["/point2"].stateValues.xs[1]).eqls(["/", "u", "v"]);
      expect(stateVariables["/point2"].stateValues.xs[2]).eqls(["^", "w", 2]);
      expect(stateVariables["/point2"].stateValues.x1).eqls(["*", 2, "x"]);
      expect(stateVariables["/point2"].stateValues.x2).eqls(["/", "u", "v"]);
      expect(stateVariables["/point2"].stateValues.x3).eqls(["^", "w", 2]);
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point3"].stateValues.xs[0]).eqls(["*", 2, "x"]);
      expect(stateVariables["/point3"].stateValues.xs[1]).eqls(["/", "u", "v"]);
      expect(stateVariables["/point3"].stateValues.xs[2]).eqls(["^", "w", 2]);
      expect(stateVariables["/point3"].stateValues.x1).eqls(["*", 2, "x"]);
      expect(stateVariables["/point3"].stateValues.x2).eqls(["/", "u", "v"]);
      expect(stateVariables["/point3"].stateValues.x3).eqls(["^", "w", 2]);
    });

    cy.log("change the coordinates from point 1 coords");
    cy.get(cesc("#\\/coords1b") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(7,8,9){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should(
      "contain.text",
      "(7,8,9)",
    );

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,8,9)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,8,9)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,8,9)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "3");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/point1x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/point2x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/point3x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/point3x3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/pointallx3A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/pointallx3B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/pointallx3C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("7");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(7)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("8");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(8)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("9");
      });

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,8,9)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,8,9)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,8,9)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,8,9)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,8,9)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,8,9)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(7,8,9)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq(7);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq(8);
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq(9);
      expect(stateVariables["/_point1"].stateValues.x1).eq(7);
      expect(stateVariables["/_point1"].stateValues.x2).eq(8);
      expect(stateVariables["/_point1"].stateValues.x3).eq(9);
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq(7);
      expect(stateVariables["/point2"].stateValues.xs[1]).eq(8);
      expect(stateVariables["/point2"].stateValues.xs[2]).eq(9);
      expect(stateVariables["/point2"].stateValues.x1).eq(7);
      expect(stateVariables["/point2"].stateValues.x2).eq(8);
      expect(stateVariables["/point2"].stateValues.x3).eq(9);
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq(7);
      expect(stateVariables["/point3"].stateValues.xs[1]).eq(8);
      expect(stateVariables["/point3"].stateValues.xs[2]).eq(9);
      expect(stateVariables["/point3"].stateValues.x1).eq(7);
      expect(stateVariables["/point3"].stateValues.x2).eq(8);
      expect(stateVariables["/point3"].stateValues.x3).eq(9);
    });

    cy.log("change the coordinates from point 2 coords");
    cy.get(cesc("#\\/coords2b") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}\\langle i,j,k\\rangle {enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should(
      "contain.text",
      "(i,j,k)",
    );

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(i,j,k)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(i,j,k)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(i,j,k)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "3");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/point1x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/point2x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/point3x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/point3x3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/pointallx3A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/pointallx3B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/pointallx3C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("i");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(7)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("j");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(8)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("k");
      });

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(i,j,k)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(i,j,k)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(i,j,k)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(i,j,k)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(i,j,k)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(i,j,k)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(i,j,k)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("i");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("j");
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq("k");
      expect(stateVariables["/_point1"].stateValues.x1).eq("i");
      expect(stateVariables["/_point1"].stateValues.x2).eq("j");
      expect(stateVariables["/_point1"].stateValues.x3).eq("k");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("i");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("j");
      expect(stateVariables["/point2"].stateValues.xs[2]).eq("k");
      expect(stateVariables["/point2"].stateValues.x1).eq("i");
      expect(stateVariables["/point2"].stateValues.x2).eq("j");
      expect(stateVariables["/point2"].stateValues.x3).eq("k");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("i");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("j");
      expect(stateVariables["/point3"].stateValues.xs[2]).eq("k");
      expect(stateVariables["/point3"].stateValues.x1).eq("i");
      expect(stateVariables["/point3"].stateValues.x2).eq("j");
      expect(stateVariables["/point3"].stateValues.x3).eq("k");
    });

    cy.log("change the coordinates from point 3 coords");
    cy.get(cesc("#\\/coords3b") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(l,m,n){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should(
      "contain.text",
      "(l,m,n)",
    );

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(l,m,n)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(l,m,n)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(l,m,n)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "3");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/point1x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/point2x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/point3x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/point3x3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/pointallx3A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/pointallx3B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/pointallx3C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("l");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(7)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("m");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(8)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("n");
      });

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(l,m,n)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(l,m,n)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(l,m,n)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(l,m,n)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(l,m,n)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(l,m,n)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(l,m,n)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("l");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("m");
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq("n");
      expect(stateVariables["/_point1"].stateValues.x1).eq("l");
      expect(stateVariables["/_point1"].stateValues.x2).eq("m");
      expect(stateVariables["/_point1"].stateValues.x3).eq("n");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("l");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("m");
      expect(stateVariables["/point2"].stateValues.xs[2]).eq("n");
      expect(stateVariables["/point2"].stateValues.x1).eq("l");
      expect(stateVariables["/point2"].stateValues.x2).eq("m");
      expect(stateVariables["/point2"].stateValues.x3).eq("n");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("l");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("m");
      expect(stateVariables["/point3"].stateValues.xs[2]).eq("n");
      expect(stateVariables["/point3"].stateValues.x1).eq("l");
      expect(stateVariables["/point3"].stateValues.x2).eq("m");
      expect(stateVariables["/point3"].stateValues.x3).eq("n");
    });

    cy.log("change the coordinates from point 1 individual components");
    cy.get(cesc("#\\/point1x1b") + " textarea").type(
      "{end}{backspace}r{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/point1x2b") + " textarea").type(
      "{end}{backspace}s{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/point1x3b") + " textarea").type(
      "{end}{backspace}t{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should(
      "contain.text",
      "(r,s,t)",
    );

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(r,s,t)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(r,s,t)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(r,s,t)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "3");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/point1x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/point2x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/point3x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/point3x3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/pointallx3A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/pointallx3B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/pointallx3C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(7)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(8)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(r,s,t)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(r,s,t)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(r,s,t)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(r,s,t)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(r,s,t)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(r,s,t)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(r,s,t)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("r");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("s");
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq("t");
      expect(stateVariables["/_point1"].stateValues.x1).eq("r");
      expect(stateVariables["/_point1"].stateValues.x2).eq("s");
      expect(stateVariables["/_point1"].stateValues.x3).eq("t");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("r");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("s");
      expect(stateVariables["/point2"].stateValues.xs[2]).eq("t");
      expect(stateVariables["/point2"].stateValues.x1).eq("r");
      expect(stateVariables["/point2"].stateValues.x2).eq("s");
      expect(stateVariables["/point2"].stateValues.x3).eq("t");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("r");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("s");
      expect(stateVariables["/point3"].stateValues.xs[2]).eq("t");
      expect(stateVariables["/point3"].stateValues.x1).eq("r");
      expect(stateVariables["/point3"].stateValues.x2).eq("s");
      expect(stateVariables["/point3"].stateValues.x3).eq("t");
    });

    cy.log("change the coordinates from point 2 individual components");
    cy.get(cesc("#\\/point2x1b") + " textarea").type(
      "{end}{backspace}f{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/point2x2b") + " textarea").type(
      "{end}{backspace}g{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/point2x3b") + " textarea").type(
      "{end}{backspace}h{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should(
      "contain.text",
      "(f,g,h)",
    );

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(f,g,h)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(f,g,h)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(f,g,h)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "3");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/point1x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/point2x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/point3x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/point3x3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/pointallx3A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/pointallx3B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/pointallx3C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });

    // TODO: makes no sense why this is failing.
    // It seems to be in the DOM just like the others
    // cy.get(cesc("#\\/p3alle")).find('.mjx-mrow').eq(2).invoke('text').then((text) => {
    //   expect(text.trim()).equal('h')
    // })

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("f");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(7)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(8)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(f,g,h)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(f,g,h)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(f,g,h)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(f,g,h)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(f,g,h)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(f,g,h)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(f,g,h)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("f");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("g");
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq("h");
      expect(stateVariables["/_point1"].stateValues.x1).eq("f");
      expect(stateVariables["/_point1"].stateValues.x2).eq("g");
      expect(stateVariables["/_point1"].stateValues.x3).eq("h");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("f");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("g");
      expect(stateVariables["/point2"].stateValues.xs[2]).eq("h");
      expect(stateVariables["/point2"].stateValues.x1).eq("f");
      expect(stateVariables["/point2"].stateValues.x2).eq("g");
      expect(stateVariables["/point2"].stateValues.x3).eq("h");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("f");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("g");
      expect(stateVariables["/point3"].stateValues.xs[2]).eq("h");
      expect(stateVariables["/point3"].stateValues.x1).eq("f");
      expect(stateVariables["/point3"].stateValues.x2).eq("g");
      expect(stateVariables["/point3"].stateValues.x3).eq("h");
    });

    cy.log("change the coordinates from point 3 individual components");
    cy.get(cesc("#\\/point3x1b") + " textarea").type(
      "{end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/point3x2b") + " textarea").type(
      "{end}{backspace}y{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/point3x3b") + " textarea").type(
      "{end}{backspace}z{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should(
      "contain.text",
      "(x,y,z)",
    );

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "3");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/point1x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point2x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point3x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point3x3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("x");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(7)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("y");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(8)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(x,y,z)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("x");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("y");
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/_point1"].stateValues.x1).eq("x");
      expect(stateVariables["/_point1"].stateValues.x2).eq("y");
      expect(stateVariables["/_point1"].stateValues.x3).eq("z");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("x");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("y");
      expect(stateVariables["/point2"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/point2"].stateValues.x1).eq("x");
      expect(stateVariables["/point2"].stateValues.x2).eq("y");
      expect(stateVariables["/point2"].stateValues.x3).eq("z");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("x");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("y");
      expect(stateVariables["/point3"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/point3"].stateValues.x1).eq("x");
      expect(stateVariables["/point3"].stateValues.x2).eq("y");
      expect(stateVariables["/point3"].stateValues.x3).eq("z");
    });

    cy.log(`can't decrease dimension from inverse direction 1`);
    cy.get(cesc("#\\/coords1b") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(u,v){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should(
      "contain.text",
      "(u,v,z)",
    );

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(u,v,z)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(u,v,z)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(u,v,z)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "3");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/point1x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point2x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point3x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point3x3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("u");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(7)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("v");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(8)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(u,v,z)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(u,v,z)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(u,v,z)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(u,v,z)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(u,v,z)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(u,v,z)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(u,v,z)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("u");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("v");
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/_point1"].stateValues.x1).eq("u");
      expect(stateVariables["/_point1"].stateValues.x2).eq("v");
      expect(stateVariables["/_point1"].stateValues.x3).eq("z");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("u");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("v");
      expect(stateVariables["/point2"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/point2"].stateValues.x1).eq("u");
      expect(stateVariables["/point2"].stateValues.x2).eq("v");
      expect(stateVariables["/point2"].stateValues.x3).eq("z");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("u");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("v");
      expect(stateVariables["/point3"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/point3"].stateValues.x1).eq("u");
      expect(stateVariables["/point3"].stateValues.x2).eq("v");
      expect(stateVariables["/point3"].stateValues.x3).eq("z");
    });

    cy.log(`can't decrease dimension from inverse direction 2`);
    cy.get(cesc("#\\/coords2b") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(s,t){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should(
      "contain.text",
      "(s,t,z)",
    );

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,z)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,z)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,z)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "3");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/point1x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point2x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point3x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point3x3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(7)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("t");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(8)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,z)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,z)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,z)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,z)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,z)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,z)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(s,t,z)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("s");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("t");
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/_point1"].stateValues.x1).eq("s");
      expect(stateVariables["/_point1"].stateValues.x2).eq("t");
      expect(stateVariables["/_point1"].stateValues.x3).eq("z");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("s");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("t");
      expect(stateVariables["/point2"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/point2"].stateValues.x1).eq("s");
      expect(stateVariables["/point2"].stateValues.x2).eq("t");
      expect(stateVariables["/point2"].stateValues.x3).eq("z");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("s");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("t");
      expect(stateVariables["/point3"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/point3"].stateValues.x1).eq("s");
      expect(stateVariables["/point3"].stateValues.x2).eq("t");
      expect(stateVariables["/point3"].stateValues.x3).eq("z");
    });

    cy.log(`can't decrease dimension from inverse direction 3`);
    cy.get(cesc("#\\/coords3b") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(q,r){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should(
      "contain.text",
      "(q,r,z)",
    );

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(q,r,z)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(q,r,z)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(q,r,z)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "3");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "3");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/point1x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point2x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point3x3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/point3x3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pointallx3C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(6)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(7)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("r");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(8)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("z");
      });

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(q,r,z)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(q,r,z)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(q,r,z)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(q,r,z)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(q,r,z)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(q,r,z)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(q,r,z)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("q");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("r");
      expect(stateVariables["/_point1"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/_point1"].stateValues.x1).eq("q");
      expect(stateVariables["/_point1"].stateValues.x2).eq("r");
      expect(stateVariables["/_point1"].stateValues.x3).eq("z");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("q");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("r");
      expect(stateVariables["/point2"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/point2"].stateValues.x1).eq("q");
      expect(stateVariables["/point2"].stateValues.x2).eq("r");
      expect(stateVariables["/point2"].stateValues.x3).eq("z");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("q");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("r");
      expect(stateVariables["/point3"].stateValues.xs[2]).eq("z");
      expect(stateVariables["/point3"].stateValues.x1).eq("q");
      expect(stateVariables["/point3"].stateValues.x2).eq("r");
      expect(stateVariables["/point3"].stateValues.x3).eq("z");
    });

    cy.log("Back to 2D point");
    cy.get(cesc("#\\/originalCoords") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(p,q){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should("contain.text", "(p,q)");

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "2");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "2");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "2");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p1z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p2z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3ze")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/pallz")).should("have.text", "z-coordinates: ");

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p1all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p2all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p3all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/p3alle")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("p");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(6).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(7).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(8).should("not.exist");

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("p");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("q");
      expect(stateVariables["/_point1"].stateValues.x1).eq("p");
      expect(stateVariables["/_point1"].stateValues.x2).eq("q");
      expect(stateVariables["/_point1"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("p");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("q");
      expect(stateVariables["/point2"].stateValues.x1).eq("p");
      expect(stateVariables["/point2"].stateValues.x2).eq("q");
      expect(stateVariables["/point2"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("p");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("q");
      expect(stateVariables["/point3"].stateValues.x1).eq("p");
      expect(stateVariables["/point3"].stateValues.x2).eq("q");
      expect(stateVariables["/point3"].stateValues.x3).eq(undefined);
    });

    cy.log(`can't increase dimension from inverse direction 1`);
    cy.get(cesc("#\\/coords1b") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(a,b,c){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should("contain.text", "(a,b)");

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "2");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "2");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "2");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p1z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p2z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3ze")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/pallz")).should("have.text", "z-coordinates: ");

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p1all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p2all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p3all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/p3alle")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("a");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("b");
      });
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(6).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(7).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(8).should("not.exist");

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("b");
      expect(stateVariables["/_point1"].stateValues.x1).eq("a");
      expect(stateVariables["/_point1"].stateValues.x2).eq("b");
      expect(stateVariables["/_point1"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("b");
      expect(stateVariables["/point2"].stateValues.x1).eq("a");
      expect(stateVariables["/point2"].stateValues.x2).eq("b");
      expect(stateVariables["/point2"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("b");
      expect(stateVariables["/point3"].stateValues.x1).eq("a");
      expect(stateVariables["/point3"].stateValues.x2).eq("b");
      expect(stateVariables["/point3"].stateValues.x3).eq(undefined);
    });

    cy.log(`can't increase dimension from inverse direction 2`);
    cy.get(cesc("#\\/coords2b") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(d,e,f){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should("contain.text", "(d,e)");

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(d,e)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(d,e)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(d,e)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "2");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "2");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "2");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p1z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p2z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3ze")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/pallz")).should("have.text", "z-coordinates: ");

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p1all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p2all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p3all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/p3alle")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("d");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("e");
      });
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(6).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(7).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(8).should("not.exist");

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(d,e)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(d,e)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(d,e)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(d,e)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(d,e)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(d,e)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(d,e)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("d");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("e");
      expect(stateVariables["/_point1"].stateValues.x1).eq("d");
      expect(stateVariables["/_point1"].stateValues.x2).eq("e");
      expect(stateVariables["/_point1"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("d");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("e");
      expect(stateVariables["/point2"].stateValues.x1).eq("d");
      expect(stateVariables["/point2"].stateValues.x2).eq("e");
      expect(stateVariables["/point2"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("d");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("e");
      expect(stateVariables["/point3"].stateValues.x1).eq("d");
      expect(stateVariables["/point3"].stateValues.x2).eq("e");
      expect(stateVariables["/point3"].stateValues.x3).eq(undefined);
    });

    cy.log(`can't increase dimension from inverse direction 3`);
    cy.get(cesc("#\\/coords3b") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(g,h,i){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should("contain.text", "(g,h)");

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(g,h)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(g,h)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(g,h)");
      });
    cy.get(cesc("#\\/numDimensions1")).should("have.text", "2");
    cy.get(cesc("#\\/numDimensions2")).should("have.text", "2");
    cy.get(cesc("#\\/numDimensions3")).should("have.text", "2");
    cy.get(cesc("#\\/point1x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/point2x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/point3x1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/point3x1e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pointallx1A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pointallx1B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pointallx1C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/point1x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/point2x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/point3x2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/point3x2e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/pointallx2A"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/pointallx2B"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/pointallx2C"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/p1z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p2z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3z")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/p3ze")).should("have.text", "z-coordinate: ");
    cy.get(cesc("#\\/pallz")).should("have.text", "z-coordinates: ");

    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/p1all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/p1all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/p2all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/p2all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/p3all"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/p3all")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/p3alle"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/p3alle")).find(".mjx-mrow").eq(2).should("not.exist");

    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(2)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(3)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(4)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("g");
      });
    cy.get(cesc("#\\/pallall"))
      .find(".mjx-mrow")
      .eq(5)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("h");
      });
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(6).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(7).should("not.exist");
    cy.get(cesc("#\\/pallall")).find(".mjx-mrow").eq(8).should("not.exist");

    cy.get(cesc("#\\/coords1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(g,h)");
      });
    cy.get(cesc("#\\/coords2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(g,h)");
      });
    cy.get(cesc("#\\/coords3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(g,h)");
      });
    cy.get(cesc("#\\/coords3e"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(g,h)");
      });
    cy.get(cesc("#\\/coordsallA"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(g,h)");
      });
    cy.get(cesc("#\\/coordsallB"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(g,h)");
      });
    cy.get(cesc("#\\/coordsallC"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(g,h)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("g");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("h");
      expect(stateVariables["/_point1"].stateValues.x1).eq("g");
      expect(stateVariables["/_point1"].stateValues.x2).eq("h");
      expect(stateVariables["/_point1"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("g");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("h");
      expect(stateVariables["/point2"].stateValues.x1).eq("g");
      expect(stateVariables["/point2"].stateValues.x2).eq("h");
      expect(stateVariables["/point2"].stateValues.x3).eq(undefined);
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("g");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("h");
      expect(stateVariables["/point3"].stateValues.x1).eq("g");
      expect(stateVariables["/point3"].stateValues.x2).eq("h");
      expect(stateVariables["/point3"].stateValues.x3).eq(undefined);
    });
  });

  // have this abbreviated test, at it was triggering an error
  // that wasn't caught with full test
  it("change point dimensions, abbreviated", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Specify point coordinates: <mathinput name="originalCoords" /></p>

    <section name="thePoints"><title>The points</title>
    <p name="point1p">The point: <point coords="$originalCoords" /></p>
    <p name="point2p">The point copied: <copy assignNames="point2" target="_point1"/></p>
    <p name="point3p">The point copied again: <copy assignNames="point3" target="point2"/></p>
    </section>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("＿");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("＿");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(1);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("＿");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(1);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("＿");
    });

    cy.log("Create 2D point 2");
    cy.get(cesc("#\\/originalCoords") + " textarea").type("(a,b){enter}", {
      force: true,
    });

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should("contain.text", "(a,b)");

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(a,b)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("b");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("b");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("a");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("b");
    });

    cy.log("Back to 1D point");
    cy.get(cesc("#\\/originalCoords") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}q{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should("contain.text", "q");

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(1);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("q");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(1);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("q");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(1);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("q");
    });

    cy.log("Create 3D point");
    cy.get(cesc("#\\/originalCoords") + " textarea").type(
      "{end}{backspace}(2x,u/v{rightarrow},w^2{rightarrow}){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should(
      "contain.text",
      "(2x,uv,w2)",
    );

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2x,uv,w2)");
      });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(3);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eqls(["*", 2, "x"]);
      expect(stateVariables["/_point1"].stateValues.xs[1]).eqls([
        "/",
        "u",
        "v",
      ]);
      expect(stateVariables["/_point1"].stateValues.xs[2]).eqls(["^", "w", 2]);
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point2"].stateValues.xs[0]).eqls(["*", 2, "x"]);
      expect(stateVariables["/point2"].stateValues.xs[1]).eqls(["/", "u", "v"]);
      expect(stateVariables["/point2"].stateValues.xs[2]).eqls(["^", "w", 2]);
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(3);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(3);
      expect(stateVariables["/point3"].stateValues.xs[0]).eqls(["*", 2, "x"]);
      expect(stateVariables["/point3"].stateValues.xs[1]).eqls(["/", "u", "v"]);
      expect(stateVariables["/point3"].stateValues.xs[2]).eqls(["^", "w", 2]);
    });

    cy.log("Back to 2D point 2");
    cy.get(cesc("#\\/originalCoords") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(p,q){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/point1p") + " .mjx-mrow").should("contain.text", "(p,q)");

    cy.get(cesc("#\\/point1p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });
    cy.get(cesc("#\\/point2p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });
    cy.get(cesc("#\\/point3p"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(p,q)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_point1"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs.length).eq(2);
      expect(stateVariables["/_point1"].stateValues.xs[0]).eq("p");
      expect(stateVariables["/_point1"].stateValues.xs[1]).eq("q");
      expect(stateVariables["/point2"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point2"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point2"].stateValues.xs[0]).eq("p");
      expect(stateVariables["/point2"].stateValues.xs[1]).eq("q");
      expect(stateVariables["/point3"].stateValues.numDimensions).eq(2);
      expect(stateVariables["/point3"].stateValues.xs.length).eq(2);
      expect(stateVariables["/point3"].stateValues.xs[0]).eq("p");
      expect(stateVariables["/point3"].stateValues.xs[1]).eq("q");
    });
  });

  it("label positioning", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <point labelPosition="$labelPos">
        <label>$label</label>
        (1,2)
      </point>
    </graph>

    <p>label: <textinput name="label" prefill="A" /></p>
    <p>position:
    <choiceinput inline preselectChoice="1" name="labelPos">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
    </choiceinput>
    </p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    // not sure what to test as don't know how to check renderer...

    cy.get(cesc("#\\/label_input")).clear().type("B{enter}");

    cy.get(cesc("#\\/labelPos")).select("upperLeft");
    cy.get(cesc("#\\/labelPos")).select("lowerRight");
    cy.get(cesc("#\\/labelPos")).select("lowerLeft");
  });

  it("copy and overwrite coordinates, initial individual components", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A" labelIsName x="1" y="2" />
      <point name="B" labelIsName x="3" y="4">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" labelIsName x="2$n+1" y="1" />
    </graph>

    <graph name="g1">
      <copy target="A" assignNames="A1" x="-1" />
      <copy target="B" assignNames="B1" y="-2" />
      <copy target="C" assignNames="C1" x="2$n-1" />
      <copy target="C" name="C2" assignNames="C" y="2$n-2" newNamespace />
    </graph>

    <copy target="A" assignNames="A2" z="4" />
    <copy target="C2/C" assignNames="C3" z="1" />

    <number name="n">1</number>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.log("initial values");

    cy.get(cesc("#\\/A2") + " .mjx-mrow").should("contain.text", "(1,2,4)");
    cy.get(cesc("#\\/C3") + " .mjx-mrow").should("contain.text", "(3,0,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/C"].stateValues.xs).eqls([3, 1]);
      expect(stateVariables["/A1"].stateValues.xs).eqls([-1, 2]);
      expect(stateVariables["/B1"].stateValues.xs).eqls([3, -2]);
      expect(stateVariables["/C1"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/C2/C"].stateValues.xs).eqls([3, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2, 4]);
      expect(stateVariables["/C3"].stateValues.xs).eqls([3, 0, 1]);
      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/A1"].stateValues.label).eq("A");
      expect(stateVariables["/B"].stateValues.label).eq("B");
      expect(stateVariables["/B1"].stateValues.label).eq("B");
      expect(stateVariables["/C"].stateValues.label).eq("C");
      expect(stateVariables["/C1"].stateValues.label).eq("C");
      expect(stateVariables["/C2/C"].stateValues.label).eq("C");
    });

    cy.log("move original points");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -2, y: -7 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 5.1, y: 8.9 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: -3, y: -8 },
      });
    });

    cy.get(cesc("#\\/A2") + " .mjx-mrow").should("contain.text", "(−2,−7,4)");
    cy.get(cesc("#\\/C3") + " .mjx-mrow").should("contain.text", "(−3,−6,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-2, -7]);
      expect(stateVariables["/B"].stateValues.xs).eqls([5, 9]);
      expect(stateVariables["/C"].stateValues.xs).eqls([-3, -8]);
      expect(stateVariables["/A1"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/B1"].stateValues.xs).eqls([5, -2]);
      expect(stateVariables["/C1"].stateValues.xs).eqls([-5, -8]);
      expect(stateVariables["/C2/C"].stateValues.xs).eqls([-3, -6]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([-2, -7, 4]);
      expect(stateVariables["/C3"].stateValues.xs).eqls([-3, -6, 1]);
    });

    cy.log("move copied points");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A1",
        args: { x: 8, y: -5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: -5.6, y: 6.3 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C1",
        args: { x: -7, y: 4 },
      });
    });

    cy.get(cesc("#\\/A2") + " .mjx-mrow").should("contain.text", "(−2,−5,4)");
    cy.get(cesc("#\\/C3") + " .mjx-mrow").should("contain.text", "(−5,−8,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-2, -5]);
      expect(stateVariables["/B"].stateValues.xs).eqls([-6, 9]);
      expect(stateVariables["/C"].stateValues.xs).eqls([-5, 4]);
      expect(stateVariables["/A1"].stateValues.xs).eqls([8, -5]);
      expect(stateVariables["/B1"].stateValues.xs).eqls([-6, 6]);
      expect(stateVariables["/C1"].stateValues.xs).eqls([-7, 4]);
      expect(stateVariables["/C2/C"].stateValues.xs).eqls([-5, -8]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([-2, -5, 4]);
      expect(stateVariables["/C3"].stateValues.xs).eqls([-5, -8, 1]);
    });
  });

  it("copy and overwrite coordinates, initial xs", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A" labelIsName xs="1 2" />
      <point name="B" labelIsName xs="3 4">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" labelIsName xs="2$n+1 1" />
    </graph>

    <graph name="g1">
      <copy target="A" assignNames="A1" x="-1" />
      <copy target="B" assignNames="B1" y="-2" />
      <copy target="C" assignNames="C1" x="2$n-1" />
      <copy target="C" name="C2" assignNames="C" y="2$n-2" newNamespace />
    </graph>

    <copy target="A" assignNames="A2" z="4" />
    <copy target="C2/C" assignNames="C3" z="1" />

    <number name="n">1</number>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.log("initial values");

    cy.get(cesc("#\\/A2") + " .mjx-mrow").should("contain.text", "(1,2,4)");
    cy.get(cesc("#\\/C3") + " .mjx-mrow").should("contain.text", "(3,0,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/C"].stateValues.xs).eqls([3, 1]);
      expect(stateVariables["/A1"].stateValues.xs).eqls([-1, 2]);
      expect(stateVariables["/B1"].stateValues.xs).eqls([3, -2]);
      expect(stateVariables["/C1"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/C2/C"].stateValues.xs).eqls([3, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2, 4]);
      expect(stateVariables["/C3"].stateValues.xs).eqls([3, 0, 1]);
      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/A1"].stateValues.label).eq("A");
      expect(stateVariables["/B"].stateValues.label).eq("B");
      expect(stateVariables["/B1"].stateValues.label).eq("B");
      expect(stateVariables["/C"].stateValues.label).eq("C");
      expect(stateVariables["/C1"].stateValues.label).eq("C");
      expect(stateVariables["/C2/C"].stateValues.label).eq("C");
    });

    cy.log("move original points");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -2, y: -7 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 5.1, y: 8.9 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: -3, y: -8 },
      });
    });

    cy.get(cesc("#\\/A2") + " .mjx-mrow").should("contain.text", "(−2,−7,4)");
    cy.get(cesc("#\\/C3") + " .mjx-mrow").should("contain.text", "(−3,−6,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-2, -7]);
      expect(stateVariables["/B"].stateValues.xs).eqls([5, 9]);
      expect(stateVariables["/C"].stateValues.xs).eqls([-3, -8]);
      expect(stateVariables["/A1"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/B1"].stateValues.xs).eqls([5, -2]);
      expect(stateVariables["/C1"].stateValues.xs).eqls([-5, -8]);
      expect(stateVariables["/C2/C"].stateValues.xs).eqls([-3, -6]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([-2, -7, 4]);
      expect(stateVariables["/C3"].stateValues.xs).eqls([-3, -6, 1]);
    });

    cy.log("move copied points");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A1",
        args: { x: 8, y: -5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: -5.6, y: 6.3 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C1",
        args: { x: -7, y: 4 },
      });
    });

    cy.get(cesc("#\\/A2") + " .mjx-mrow").should("contain.text", "(−2,−5,4)");
    cy.get(cesc("#\\/C3") + " .mjx-mrow").should("contain.text", "(−5,−8,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-2, -5]);
      expect(stateVariables["/B"].stateValues.xs).eqls([-6, 9]);
      expect(stateVariables["/C"].stateValues.xs).eqls([-5, 4]);
      expect(stateVariables["/A1"].stateValues.xs).eqls([8, -5]);
      expect(stateVariables["/B1"].stateValues.xs).eqls([-6, 6]);
      expect(stateVariables["/C1"].stateValues.xs).eqls([-7, 4]);
      expect(stateVariables["/C2/C"].stateValues.xs).eqls([-5, -8]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([-2, -5, 4]);
      expect(stateVariables["/C3"].stateValues.xs).eqls([-5, -8, 1]);
    });
  });

  it("copy and overwrite coordinates, initial coords", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <point name="A" labelIsName coords="(1,2)" />
      <point name="B" labelIsName coords="(3,4)">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" labelIsName coords="(2$n+1,1)" />
    </graph>

    <graph name="g1">
      <copy target="A" assignNames="A1" x="-1" />
      <copy target="B" assignNames="B1" y="-2" />
      <copy target="C" assignNames="C1" x="2$n-1" />
      <copy target="C" name="C2" assignNames="C" y="2$n-2" newNamespace />
    </graph>

    <copy target="A" assignNames="A2" z="4" />
    <copy target="C2/C" assignNames="C3" z="1" />

    <number name="n">1</number>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.log("initial values");

    cy.get(cesc("#\\/A2") + " .mjx-mrow").should("contain.text", "(1,2,4)");
    cy.get(cesc("#\\/C3") + " .mjx-mrow").should("contain.text", "(3,0,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([1, 2]);
      expect(stateVariables["/B"].stateValues.xs).eqls([3, 4]);
      expect(stateVariables["/C"].stateValues.xs).eqls([3, 1]);
      expect(stateVariables["/A1"].stateValues.xs).eqls([-1, 2]);
      expect(stateVariables["/B1"].stateValues.xs).eqls([3, -2]);
      expect(stateVariables["/C1"].stateValues.xs).eqls([1, 1]);
      expect(stateVariables["/C2/C"].stateValues.xs).eqls([3, 0]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([1, 2, 4]);
      expect(stateVariables["/C3"].stateValues.xs).eqls([3, 0, 1]);
      expect(stateVariables["/A"].stateValues.label).eq("A");
      expect(stateVariables["/A1"].stateValues.label).eq("A");
      expect(stateVariables["/B"].stateValues.label).eq("B");
      expect(stateVariables["/B1"].stateValues.label).eq("B");
      expect(stateVariables["/C"].stateValues.label).eq("C");
      expect(stateVariables["/C1"].stateValues.label).eq("C");
      expect(stateVariables["/C2/C"].stateValues.label).eq("C");
    });

    cy.log("move original points");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: -2, y: -7 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 5.1, y: 8.9 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: -3, y: -8 },
      });
    });

    cy.get(cesc("#\\/A2") + " .mjx-mrow").should("contain.text", "(−2,−7,4)");
    cy.get(cesc("#\\/C3") + " .mjx-mrow").should("contain.text", "(−3,−6,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-2, -7]);
      expect(stateVariables["/B"].stateValues.xs).eqls([5, 9]);
      expect(stateVariables["/C"].stateValues.xs).eqls([-3, -8]);
      expect(stateVariables["/A1"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/B1"].stateValues.xs).eqls([5, -2]);
      expect(stateVariables["/C1"].stateValues.xs).eqls([-5, -8]);
      expect(stateVariables["/C2/C"].stateValues.xs).eqls([-3, -6]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([-2, -7, 4]);
      expect(stateVariables["/C3"].stateValues.xs).eqls([-3, -6, 1]);
    });

    cy.log("move copied points");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A1",
        args: { x: 8, y: -5 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B1",
        args: { x: -5.6, y: 6.3 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C1",
        args: { x: -7, y: 4 },
      });
    });

    cy.get(cesc("#\\/A2") + " .mjx-mrow").should("contain.text", "(−2,−5,4)");
    cy.get(cesc("#\\/C3") + " .mjx-mrow").should("contain.text", "(−5,−8,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/A"].stateValues.xs).eqls([-2, -5]);
      expect(stateVariables["/B"].stateValues.xs).eqls([-6, 9]);
      expect(stateVariables["/C"].stateValues.xs).eqls([-5, 4]);
      expect(stateVariables["/A1"].stateValues.xs).eqls([8, -5]);
      expect(stateVariables["/B1"].stateValues.xs).eqls([-6, 6]);
      expect(stateVariables["/C1"].stateValues.xs).eqls([-7, 4]);
      expect(stateVariables["/C2/C"].stateValues.xs).eqls([-5, -8]);
      expect(stateVariables["/A2"].stateValues.xs).eqls([-2, -5, 4]);
      expect(stateVariables["/C3"].stateValues.xs).eqls([-5, -8, 1]);
    });
  });

  it("copy and overwrite each coordinate in sequence, initial sugar", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g1" newNamespace>
      <point name="P">(3,2)</point>
    </graph>
    
    <graph name="g2" newNamespace>
      <copy target="../g1/P" x="-1" assignNames="P" />
    </graph>
    
    <copy target="g2" assignNames="g3" />
    
    <graph name="g4" newNamespace>
      <copy target="../g3/P" y="-5" assignNames="P" />
    </graph>

    <copy target="g1/P" assignNames="P1" />
    <copy target="g2/P" assignNames="P2" />
    <copy target="g3/P" assignNames="P3" />
    <copy target="g4/P" assignNames="P4" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.log("initial values");

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", "(3,2)");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("contain.text", "(−1,2)");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("contain.text", "(−1,2)");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", "(−1,−5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1/P"].stateValues.xs).eqls([3, 2]);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([-1, 2]);
      expect(stateVariables["/g3/P"].stateValues.xs).eqls([-1, 2]);
      expect(stateVariables["/g4/P"].stateValues.xs).eqls([-1, -5]);
    });

    cy.log("move first point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/P",
        args: { x: -2, y: -7 },
      });
    });

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", "(−2,−7)");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("contain.text", "(−1,−7)");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("contain.text", "(−1,−7)");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", "(−1,−5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1/P"].stateValues.xs).eqls([-2, -7]);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/g3/P"].stateValues.xs).eqls([-1, -7]);
      expect(stateVariables["/g4/P"].stateValues.xs).eqls([-1, -5]);
    });

    cy.log("move second point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/P",
        args: { x: 8, y: -6 },
      });
    });

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", "(−2,−6)");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("contain.text", "(8,−6)");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("contain.text", "(8,−6)");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", "(8,−5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1/P"].stateValues.xs).eqls([-2, -6]);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([8, -6]);
      expect(stateVariables["/g3/P"].stateValues.xs).eqls([8, -6]);
      expect(stateVariables["/g4/P"].stateValues.xs).eqls([8, -5]);
    });

    cy.log("move third point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/P",
        args: { x: 1, y: 0 },
      });
    });

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", "(−2,0)");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("contain.text", "(1,0)");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("contain.text", "(1,0)");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", "(1,−5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1/P"].stateValues.xs).eqls([-2, 0]);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([1, 0]);
      expect(stateVariables["/g3/P"].stateValues.xs).eqls([1, 0]);
      expect(stateVariables["/g4/P"].stateValues.xs).eqls([1, -5]);
    });

    cy.log("move fourth point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/P",
        args: { x: 3, y: 4 },
      });
    });

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", "(−2,0)");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("contain.text", "(3,0)");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("contain.text", "(3,0)");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", "(3,4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1/P"].stateValues.xs).eqls([-2, 0]);
      expect(stateVariables["/g2/P"].stateValues.xs).eqls([3, 0]);
      expect(stateVariables["/g3/P"].stateValues.xs).eqls([3, 0]);
      expect(stateVariables["/g4/P"].stateValues.xs).eqls([3, 4]);
    });
  });

  it("1D point with 2D constraint does not crash", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph>
      <point xs="1">
        <constraints>
          <constrainTo><function>x^2</function></constrainTo>
        </constraints>
      </point>
      <point xs="2">
        <constraints>
          <constrainTo>
            <curve><function>x^2</function><function>x^3</function></curve>
          </constrainTo>
        </constraints>
      </point>
      <point xs="3">
        <constraints>
          <constrainTo><circle/></constrainTo>
        </constraints>
      </point>
      <point xs="4">
        <constraints>
          <constrainTo><line>y=2x</line></constrainTo>
        </constraints>
      </point>
      <point xs="5">
        <constraints>
          <constrainTo><polygon vertices="(1,2) (3,4) (5,-6)" /></constrainTo>
        </constraints>
      </point>
      <point xs="6">
        <constraints>
          <constrainTo><polyline vertices="(1,2) (3,4) (5,-6)" /></constrainTo>
        </constraints>
      </point>
      <point xs="7">
        <constraints>
          <constrainTo><parabola/></constrainTo>
        </constraints>
      </point>
    </graph>

    <copy prop="x" target="_point1" assignNames="xa" />
    <copy prop="x" target="_point2" assignNames="xb" />
    <copy prop="x" target="_point3" assignNames="xc" />
    <copy prop="x" target="_point4" assignNames="xd" />
    <copy prop="x" target="_point5" assignNames="xe" />
    <copy prop="x" target="_point6" assignNames="xf" />
    <copy prop="x" target="_point7" assignNames="xg" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("have.text", "1");
    cy.get(cesc("#\\/xb") + " .mjx-mrow").should("have.text", "2");
    cy.get(cesc("#\\/xc") + " .mjx-mrow").should("have.text", "3");
    cy.get(cesc("#\\/xd") + " .mjx-mrow").should("have.text", "4");
    cy.get(cesc("#\\/xe") + " .mjx-mrow").should("have.text", "5");
    cy.get(cesc("#\\/xf") + " .mjx-mrow").should("have.text", "6");
    cy.get(cesc("#\\/xg") + " .mjx-mrow").should("have.text", "7");
  });

  it("display digits propagates", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    
    <point displayDigits="2" name="P">(32.252609, 0.0672854, 5)</point>
    <point displayDecimals="2" name="Q" x="32.252609" y="0.0672854" z="5" />
    <point padZeros name="R" x="32.252609" y="0.0672854" z="5" />

    <copy prop="coords" target="P" assignNames="Pcoords" />
    <copy prop="coords" target="Q" assignNames="Qcoords" />
    <copy prop="coords" target="R" assignNames="Rcoords" />

    <copy prop="coords" target="P" assignNames="PcoordsDec4" displayDecimals="4" />
    <copy prop="coords" target="Q" assignNames="QcoordsDig4" displayDigits="4" />
    <copy prop="coords" target="R" assignNames="RcoordsDig2" displayDigits="2" />

    <copy prop="coords" target="P" assignNames="PcoordsPad" padZeros />
    <copy prop="coords" target="Q" assignNames="QcoordsPad" padZeros />
    <copy prop="coords" target="R" assignNames="RcoordsNoPad" padZeros="false" />

    <copy prop="xs" target="P" assignNames="Px1 Px2 Px3" />
    <copy prop="x1" target="Q" assignNames="Qx1" />
    <copy prop="y" target="Q" assignNames="Qx2" />
    <copy prop="z" target="R" assignNames="Rx3" />

    <math name="Pmath">$P</math>
    <math name="Qmath">$Q</math>
    <math name="Rmath">$R</math>

    <math name="PmathDec4" displayDecimals="4">$P</math>
    <math name="QmathDig4" displayDigits="4">$Q</math>
    <math name="RmathDig2" displayDigits="2">$R</math>

    <number name="Px1number">$(P.x)</number>
    <number name="Px2number"><copy prop="y" target="P" /></number>

    <number name="Px1numberDec4" displayDecimals="4">$(P.x)</number>
    <number name="Px2numberDig4" displayDigits="4"><copy prop="y" target="P" /></number>


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/P") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32,0.067,5)");
      });
    cy.get(cesc("#\\/Q") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.25,0.07,5)");
      });
    cy.get(cesc("#\\/R") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.25,0.0673,5.00)");
      });
    cy.get(cesc("#\\/Pcoords") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32,0.067,5)");
      });
    cy.get(cesc("#\\/Qcoords") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.25,0.07,5)");
      });
    cy.get(cesc("#\\/Rcoords") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.25,0.0673,5.00)");
      });
    cy.get(cesc("#\\/PcoordsDec4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.2526,0.0673,5)");
      });
    cy.get(cesc("#\\/QcoordsDig4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.25,0.06729,5)");
      });
    cy.get(cesc("#\\/RcoordsDig2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32,0.067,5.0)");
      });
    cy.get(cesc("#\\/PcoordsPad") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32,0.067,5.0)");
      });
    cy.get(cesc("#\\/QcoordsPad") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.25,0.07,5.00)");
      });
    cy.get(cesc("#\\/RcoordsNoPad") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.25,0.0673,5)");
      });
    cy.get(cesc("#\\/Px1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("32");
      });
    cy.get(cesc("#\\/Px2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0.067");
      });
    cy.get(cesc("#\\/Px3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("5");
      });
    cy.get(cesc("#\\/Qx1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("32.25");
      });
    cy.get(cesc("#\\/Qx2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("0.07");
      });
    cy.get(cesc("#\\/Rx3") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("5.00");
      });
    cy.get(cesc("#\\/Pmath") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32,0.067,5)");
      });
    cy.get(cesc("#\\/Qmath") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.25,0.07,5)");
      });
    cy.get(cesc("#\\/Rmath") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.25,0.0673,5.00)");
      });
    cy.get(cesc("#\\/PmathDec4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.2526,0.0673,5)");
      });
    cy.get(cesc("#\\/QmathDig4") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32.25,0.06729,5)");
      });
    cy.get(cesc("#\\/RmathDig2") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(32,0.067,5.0)");
      });
    cy.get(cesc("#\\/Px1number")).should("have.text", "32");
    cy.get(cesc("#\\/Px2number")).should("have.text", "0.067");
    cy.get(cesc("#\\/Px1numberDec4")).should("have.text", "32.2526");
    cy.get(cesc("#\\/Px2numberDig4")).should("have.text", "0.06729");
  });

  it("rounding, copy and override", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p><point name="p1" displayDigits="10">(34.245023482352345, 245.23823402358234234)</point></p>
    <p><point name="p1Dig4" copySource="p1" displayDigits="4" /></p>
    <p><point name="p1Dec6" copySource="p1" displayDecimals="5" /></p>
    <p><point name="p1Dig4a" copySource="p1Dec6" displayDigits="4" /></p>
    <p><point name="p1Dec6a" copySource="p1Dig4" displayDecimals="5" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/p1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(34.24502348,245.238234)");

    cy.get(cesc("#\\/p1Dig4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(34.25,245.2)");
    cy.get(cesc("#\\/p1Dig4a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(34.25,245.2)");

    cy.get(cesc("#\\/p1Dec6") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(34.24502,245.23823)");
    cy.get(cesc("#\\/p1Dec6a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(34.24502,245.23823)");
  });

  it("label point with child, part math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point name="P" displayDecimals="1" padZeros>
        (1,2)
        <label>We have <m>x^{<copy prop="x" target="P"/>} + y^{<copy target="P" prop="y" />}</m></label>
      </point>
      <point name="Q" displayDigits="3" padZeros>
        <label>No latex: x^<text><copy prop="x" target="Q"/></text> + y^<text><copy target="Q" prop="y" /></text></label>
        (3,4)
      </point>
      <point name="R" displayDecimals="2">
        <label><copy prop="label" target="P"/> and <copy prop="coords" target="R" /></label>
        (5,6)
      </point>
      <point name="S" displayDigits="2">
        <label><copy prop="label" target="Q"/> and <copy prop="coords" target="S" /></label>
        (7,8)
      </point>
    </graph>

    <p name="labelPPar">Label for P: <copy prop="label" target="P" /></p>
    <p name="labelQPar">Label for Q: <copy prop="label" target="Q" /></p>
    <p name="labelRPar">Label for R: <copy prop="label" target="R" /></p>
    <p name="labelSPar">Label for S: <copy prop="label" target="S" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/labelPPar")).should(
      "contain.text",
      "Label for P: We have ",
    );
    cy.get(cesc("#\\/labelPPar") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("x1.0+y2.0");
      });
    cy.get(cesc("#\\/labelQPar")).should(
      "have.text",
      "Label for Q: No latex: x^3.00 + y^4.00",
    );
    cy.get(cesc("#\\/labelRPar")).should(
      "contain.text",
      "Label for R: We have ",
    );
    cy.get(cesc("#\\/labelRPar")).should("contain.text", " and ");
    cy.get(cesc("#\\/labelSPar")).should(
      "contain.text",
      "Label for S: No latex: x^3.00 + y^4.00 and ",
    );
    cy.get(cesc("#\\/labelSPar") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(7,8)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.label).eq(
        "We have \\(x^{1.0} + y^{2.0}\\)",
      );
      expect(stateVariables["/P"].stateValues.labelHasLatex).eq(true);

      expect(stateVariables["/Q"].stateValues.label).eq(
        "No latex: x^3.00 + y^4.00",
      );
      expect(stateVariables["/Q"].stateValues.labelHasLatex).eq(false);

      expect(stateVariables["/R"].stateValues.label).eq(
        "We have \\(x^{1.0} + y^{2.0}\\) and \\(\\left( 5, 6 \\right)\\)",
      );
      expect(stateVariables["/R"].stateValues.labelHasLatex).eq(true);

      expect(stateVariables["/S"].stateValues.label).eq(
        "No latex: x^3.00 + y^4.00 and \\(\\left( 7, 8 \\right)\\)",
      );
      expect(stateVariables["/S"].stateValues.labelHasLatex).eq(true);
    });

    cy.log("move points");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: Math.PI, y: Math.E },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: Math.sqrt(2), y: 1 / 3 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/R",
        args: { x: 1 / 6, y: 2 / 3 },
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/S",
        args: { x: 1 / 8, y: 9 / 8 },
      });
    });

    cy.get(cesc("#\\/labelQPar")).should(
      "have.text",
      "Label for Q: No latex: x^1.41 + y^0.333",
    );

    cy.get(cesc("#\\/labelPPar")).should(
      "contain.text",
      "Label for P: We have ",
    );
    cy.get(cesc("#\\/labelPPar") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("x3.1+y2.7");
      });
    cy.get(cesc("#\\/labelSPar")).should(
      "contain.text",
      "Label for S: No latex: x^1.41 + y^0.333 and ",
    );
    cy.get(cesc("#\\/labelSPar") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("(0.13,1.1)");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.label).eq(
        "We have \\(x^{3.1} + y^{2.7}\\)",
      );
      expect(stateVariables["/P"].stateValues.labelHasLatex).eq(true);

      expect(stateVariables["/Q"].stateValues.label).eq(
        "No latex: x^1.41 + y^0.333",
      );
      expect(stateVariables["/Q"].stateValues.labelHasLatex).eq(false);

      expect(stateVariables["/R"].stateValues.label).eq(
        "We have \\(x^{3.1} + y^{2.7}\\) and \\(\\left( 0.17, 0.67 \\right)\\)",
      );
      expect(stateVariables["/R"].stateValues.labelHasLatex).eq(true);

      expect(stateVariables["/S"].stateValues.label).eq(
        "No latex: x^1.41 + y^0.333 and \\(\\left( 0.13, 1.1 \\right)\\)",
      );
      expect(stateVariables["/S"].stateValues.labelHasLatex).eq(true);
    });
  });

  it("copy point and override label", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point name="P" displayDecimals="1" padZeros>
        (1,2)
        <label>We have <m>x^{<copy prop="x" target="P"/>} + y^{<copy target="P" prop="y" />}</m></label>
      </point>
    </graph>
    <graph>
      <point name="Q" displayDigits="3" padZeros copySource="P">
        <label>No latex: x^<text><copy prop="x" target="Q"/></text> + y^<text><copy target="Q" prop="y" /></text></label>
      </point>
    </graph>

    <p name="labelPPar">Label for P: <copy prop="label" target="P" /></p>
    <p name="labelQPar">Label for Q: <copy prop="label" target="Q" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/labelPPar")).should(
      "contain.text",
      "Label for P: We have ",
    );
    cy.get(cesc("#\\/labelPPar") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("x1.0+y2.0");
      });
    cy.get(cesc("#\\/labelQPar")).should(
      "have.text",
      "Label for Q: No latex: x^1.00 + y^2.00",
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.label).eq(
        "We have \\(x^{1.0} + y^{2.0}\\)",
      );
      expect(stateVariables["/P"].stateValues.labelHasLatex).eq(true);

      expect(stateVariables["/Q"].stateValues.label).eq(
        "No latex: x^1.00 + y^2.00",
      );
      expect(stateVariables["/Q"].stateValues.labelHasLatex).eq(false);
    });

    cy.log("move point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: Math.PI, y: Math.E },
      });
    });

    cy.get(cesc("#\\/labelQPar")).should(
      "have.text",
      "Label for Q: No latex: x^3.14 + y^2.72",
    );

    cy.get(cesc("#\\/labelPPar")).should(
      "contain.text",
      "Label for P: We have ",
    );
    cy.get(cesc("#\\/labelPPar") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text).eq("x3.1+y2.7");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.label).eq(
        "We have \\(x^{3.1} + y^{2.7}\\)",
      );
      expect(stateVariables["/P"].stateValues.labelHasLatex).eq(true);

      expect(stateVariables["/Q"].stateValues.label).eq(
        "No latex: x^3.14 + y^2.72",
      );
      expect(stateVariables["/Q"].stateValues.labelHasLatex).eq(false);
    });
  });

  it("update labels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point name="P1">
        (1,2)
        <label>P1</label>
      </point>
      <point name="P2">
        (3,4)
        <label><text>P2</text></label>
      </point>
      <point name="P3">
        (5,6)
        <label><math>P/3</math></label>
      </point>
      <point name="P4">
        (7,8)
        <label><m>\\frac{P}{4}</m></label>
      </point>
    </graph>

    <p>Change label 1: <textinput bindValueTo="$(P1.label)" name="ti1" /></p>
    <p><updateValue target="P1" prop="label" newValue="P1" type="text" name="revert1" >
      <label>Revert value 1</label>
    </updateValue></p>
    <p>The label 1: <label copySource="P1" copyprop="label" name="theLabel1" /></p>

    <p>Change label 2: <textinput bindValueTo="$(P2.label)" name="ti2" /></p>
    <p><updateValue target="P2" prop="label" newValue="P2" type="text" name="revert2" >
      <label>Revert value 2</label>
    </updateValue></p>
    <p>The label 2: <label copySource="P2" copyprop="label" name="theLabel2" /></p>

    <p>Change label 3: <textinput bindValueTo="$(P3.label)" name="ti3" /></p>
    <p><updateValue target="P3" prop="label" newValue="\\frac{P}{3}" type="text" name="revert3" >
      <label>Revert value 3</label>
    </updateValue></p>
    <p>The label 3: <label copySource="P3" copyprop="label" name="theLabel3" /></p>
    

    <p>Change label 4: <textinput bindValueTo="$(P4.label)" name="ti4" /></p>
    <p><updateValue target="P4" prop="label" newValue="\\frac{P}{4}" type="text" name="revert4" >
      <label>Revert value 4</label>
    </updateValue></p>
    <p>The label 4: <label copySource="P4" copyprop="label" name="theLabel4" /></p>
    
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/theLabel1")).should("have.text", "P1");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "P1");
    cy.get(cesc("#\\/theLabel2")).should("have.text", "P2");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "P2");
    cy.get(cesc("#\\/theLabel3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "P3");
    cy.get(cesc("#\\/ti3_input")).should("have.value", "\\frac{P}{3}");
    cy.get(cesc("#\\/theLabel4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "P4");
    cy.get(cesc("#\\/ti4_input")).should("have.value", "\\frac{P}{4}");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.label).eq("P1");
      expect(stateVariables["/P1"].stateValues.labelHasLatex).eq(false);
      expect(stateVariables["/theLabel1"].stateValues.value).eq("P1");
      expect(stateVariables["/theLabel1"].stateValues.text).eq("P1");
      expect(stateVariables["/theLabel1"].stateValues.latex).eq("P1");
      expect(stateVariables["/theLabel1"].stateValues.hasLatex).eq(false);

      expect(stateVariables["/P2"].stateValues.label).eq("P2");
      expect(stateVariables["/P2"].stateValues.labelHasLatex).eq(false);
      expect(stateVariables["/theLabel2"].stateValues.value).eq("P2");
      expect(stateVariables["/theLabel2"].stateValues.text).eq("P2");
      expect(stateVariables["/theLabel2"].stateValues.latex).eq("P2");
      expect(stateVariables["/theLabel2"].stateValues.hasLatex).eq(false);

      expect(stateVariables["/P3"].stateValues.label).eq("\\(\\frac{P}{3}\\)");
      expect(stateVariables["/P3"].stateValues.labelHasLatex).eq(true);
      expect(stateVariables["/theLabel3"].stateValues.value).eq(
        "\\(\\frac{P}{3}\\)",
      );
      expect(stateVariables["/theLabel3"].stateValues.text).eq("\\frac{P}{3}");
      expect(stateVariables["/theLabel3"].stateValues.latex).eq("\\frac{P}{3}");
      expect(stateVariables["/theLabel3"].stateValues.hasLatex).eq(true);

      expect(stateVariables["/P4"].stateValues.label).eq("\\(\\frac{P}{4}\\)");
      expect(stateVariables["/P4"].stateValues.labelHasLatex).eq(true);
      expect(stateVariables["/theLabel4"].stateValues.value).eq(
        "\\(\\frac{P}{4}\\)",
      );
      expect(stateVariables["/theLabel4"].stateValues.text).eq("\\frac{P}{4}");
      expect(stateVariables["/theLabel4"].stateValues.latex).eq("\\frac{P}{4}");
      expect(stateVariables["/theLabel4"].stateValues.hasLatex).eq(true);
    });

    cy.log("Change label via textinput");
    cy.get(cesc("#\\/ti1_input")).clear().type("Q1{enter}");
    cy.get(cesc("#\\/ti2_input")).clear().type("Q2{enter}");
    cy.get(cesc("#\\/ti3_input")).clear().type("\\frac{{}Q}{{}3}{enter}");
    cy.get(cesc("#\\/ti4_input")).clear().type("\\frac{{}Q}{{}4}{enter}");
    cy.get(cesc("#\\/theLabel4") + " .mjx-mrow").should("contain.text", "Q4");

    cy.get(cesc("#\\/theLabel1")).should("have.text", "Q1");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "Q1");
    cy.get(cesc("#\\/theLabel2")).should("have.text", "Q2");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "Q2");
    cy.get(cesc("#\\/theLabel3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "Q3");
    cy.get(cesc("#\\/ti3_input")).should("have.value", "\\frac{Q}{3}");
    cy.get(cesc("#\\/theLabel4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "Q4");
    cy.get(cesc("#\\/ti4_input")).should("have.value", "\\frac{Q}{4}");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.label).eq("Q1");
      expect(stateVariables["/P1"].stateValues.labelHasLatex).eq(false);
      expect(stateVariables["/theLabel1"].stateValues.value).eq("Q1");
      expect(stateVariables["/theLabel1"].stateValues.text).eq("Q1");
      expect(stateVariables["/theLabel1"].stateValues.latex).eq("Q1");
      expect(stateVariables["/theLabel1"].stateValues.hasLatex).eq(false);

      expect(stateVariables["/P2"].stateValues.label).eq("Q2");
      expect(stateVariables["/P2"].stateValues.labelHasLatex).eq(false);
      expect(stateVariables["/theLabel2"].stateValues.value).eq("Q2");
      expect(stateVariables["/theLabel2"].stateValues.text).eq("Q2");
      expect(stateVariables["/theLabel2"].stateValues.latex).eq("Q2");
      expect(stateVariables["/theLabel2"].stateValues.hasLatex).eq(false);

      expect(stateVariables["/P3"].stateValues.label).eq("\\(\\frac{Q}{3}\\)");
      expect(stateVariables["/P3"].stateValues.labelHasLatex).eq(true);
      expect(stateVariables["/theLabel3"].stateValues.value).eq(
        "\\(\\frac{Q}{3}\\)",
      );
      expect(stateVariables["/theLabel3"].stateValues.text).eq("\\frac{Q}{3}");
      expect(stateVariables["/theLabel3"].stateValues.latex).eq("\\frac{Q}{3}");
      expect(stateVariables["/theLabel3"].stateValues.hasLatex).eq(true);

      expect(stateVariables["/P4"].stateValues.label).eq("\\(\\frac{Q}{4}\\)");
      expect(stateVariables["/P4"].stateValues.labelHasLatex).eq(true);
      expect(stateVariables["/theLabel4"].stateValues.value).eq(
        "\\(\\frac{Q}{4}\\)",
      );
      expect(stateVariables["/theLabel4"].stateValues.text).eq("\\frac{Q}{4}");
      expect(stateVariables["/theLabel4"].stateValues.latex).eq("\\frac{Q}{4}");
      expect(stateVariables["/theLabel4"].stateValues.hasLatex).eq(true);
    });

    cy.log("Revert label");
    cy.get(cesc("#\\/revert1_button")).click();
    cy.get(cesc("#\\/revert2_button")).click();
    cy.get(cesc("#\\/revert3_button")).click();
    cy.get(cesc("#\\/revert4_button")).click();
    cy.get(cesc("#\\/theLabel4") + " .mjx-mrow").should("contain.text", "P4");

    cy.get(cesc("#\\/theLabel1")).should("have.text", "P1");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "P1");
    cy.get(cesc("#\\/theLabel2")).should("have.text", "P2");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "P2");
    cy.get(cesc("#\\/theLabel3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "P3");
    cy.get(cesc("#\\/ti3_input")).should("have.value", "\\frac{P}{3}");
    cy.get(cesc("#\\/theLabel4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "P4");
    cy.get(cesc("#\\/ti4_input")).should("have.value", "\\frac{P}{4}");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.label).eq("P1");
      expect(stateVariables["/P1"].stateValues.labelHasLatex).eq(false);
      expect(stateVariables["/theLabel1"].stateValues.value).eq("P1");
      expect(stateVariables["/theLabel1"].stateValues.text).eq("P1");
      expect(stateVariables["/theLabel1"].stateValues.latex).eq("P1");
      expect(stateVariables["/theLabel1"].stateValues.hasLatex).eq(false);

      expect(stateVariables["/P2"].stateValues.label).eq("P2");
      expect(stateVariables["/P2"].stateValues.labelHasLatex).eq(false);
      expect(stateVariables["/theLabel2"].stateValues.value).eq("P2");
      expect(stateVariables["/theLabel2"].stateValues.text).eq("P2");
      expect(stateVariables["/theLabel2"].stateValues.latex).eq("P2");
      expect(stateVariables["/theLabel2"].stateValues.hasLatex).eq(false);

      expect(stateVariables["/P3"].stateValues.label).eq("\\(\\frac{P}{3}\\)");
      expect(stateVariables["/P3"].stateValues.labelHasLatex).eq(true);
      expect(stateVariables["/theLabel3"].stateValues.value).eq(
        "\\(\\frac{P}{3}\\)",
      );
      expect(stateVariables["/theLabel3"].stateValues.text).eq("\\frac{P}{3}");
      expect(stateVariables["/theLabel3"].stateValues.latex).eq("\\frac{P}{3}");
      expect(stateVariables["/theLabel3"].stateValues.hasLatex).eq(true);

      expect(stateVariables["/P4"].stateValues.label).eq("\\(\\frac{P}{4}\\)");
      expect(stateVariables["/P4"].stateValues.labelHasLatex).eq(true);
      expect(stateVariables["/theLabel4"].stateValues.value).eq(
        "\\(\\frac{P}{4}\\)",
      );
      expect(stateVariables["/theLabel4"].stateValues.text).eq("\\frac{P}{4}");
      expect(stateVariables["/theLabel4"].stateValues.latex).eq("\\frac{P}{4}");
      expect(stateVariables["/theLabel4"].stateValues.hasLatex).eq(true);
    });

    cy.log("Cannot switch to latex, unneeded delimiters ignored");
    cy.get(cesc("#\\/ti1_input")).clear().type("\\(\\frac{{}Q}{{}1}\\){enter}");
    cy.get(cesc("#\\/ti2_input")).clear().type("\\(\\frac{{}Q}{{}2}\\){enter}");
    cy.get(cesc("#\\/ti3_input")).clear().type("\\(\\frac{{}Q}{{}3}\\){enter}");
    cy.get(cesc("#\\/ti4_input")).clear().type("\\(\\frac{{}Q}{{}4}\\){enter}");
    cy.get(cesc("#\\/theLabel4") + " .mjx-mrow").should("contain.text", "Q4");

    cy.get(cesc("#\\/theLabel1")).should("have.text", "\\(\\frac{Q}{1}\\)");
    cy.get(cesc("#\\/ti1_input")).should("have.value", "\\(\\frac{Q}{1}\\)");
    cy.get(cesc("#\\/theLabel2")).should("have.text", "\\(\\frac{Q}{2}\\)");
    cy.get(cesc("#\\/ti2_input")).should("have.value", "\\(\\frac{Q}{2}\\)");
    cy.get(cesc("#\\/theLabel3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "Q3");
    cy.get(cesc("#\\/ti3_input")).should("have.value", "\\frac{Q}{3}");
    cy.get(cesc("#\\/theLabel4") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "Q4");
    cy.get(cesc("#\\/ti4_input")).should("have.value", "\\frac{Q}{4}");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P1"].stateValues.label).eq("\\(\\frac{Q}{1}\\)");
      expect(stateVariables["/P1"].stateValues.labelHasLatex).eq(false);
      expect(stateVariables["/theLabel1"].stateValues.value).eq(
        "\\(\\frac{Q}{1}\\)",
      );
      expect(stateVariables["/theLabel1"].stateValues.text).eq(
        "\\(\\frac{Q}{1}\\)",
      );
      expect(stateVariables["/theLabel1"].stateValues.latex).eq(
        "\\(\\frac{Q}{1}\\)",
      );
      expect(stateVariables["/theLabel1"].stateValues.hasLatex).eq(false);

      expect(stateVariables["/P2"].stateValues.label).eq("\\(\\frac{Q}{2}\\)");
      expect(stateVariables["/P2"].stateValues.labelHasLatex).eq(false);
      expect(stateVariables["/theLabel2"].stateValues.value).eq(
        "\\(\\frac{Q}{2}\\)",
      );
      expect(stateVariables["/theLabel2"].stateValues.text).eq(
        "\\(\\frac{Q}{2}\\)",
      );
      expect(stateVariables["/theLabel2"].stateValues.latex).eq(
        "\\(\\frac{Q}{2}\\)",
      );
      expect(stateVariables["/theLabel2"].stateValues.hasLatex).eq(false);

      expect(stateVariables["/P3"].stateValues.label).eq("\\(\\frac{Q}{3}\\)");
      expect(stateVariables["/P3"].stateValues.labelHasLatex).eq(true);
      expect(stateVariables["/theLabel3"].stateValues.value).eq(
        "\\(\\frac{Q}{3}\\)",
      );
      expect(stateVariables["/theLabel3"].stateValues.text).eq("\\frac{Q}{3}");
      expect(stateVariables["/theLabel3"].stateValues.latex).eq("\\frac{Q}{3}");
      expect(stateVariables["/theLabel3"].stateValues.hasLatex).eq(true);

      expect(stateVariables["/P4"].stateValues.label).eq("\\(\\frac{Q}{4}\\)");
      expect(stateVariables["/P4"].stateValues.labelHasLatex).eq(true);
      expect(stateVariables["/theLabel4"].stateValues.value).eq(
        "\\(\\frac{Q}{4}\\)",
      );
      expect(stateVariables["/theLabel4"].stateValues.text).eq("\\frac{Q}{4}");
      expect(stateVariables["/theLabel4"].stateValues.latex).eq("\\frac{Q}{4}");
      expect(stateVariables["/theLabel4"].stateValues.hasLatex).eq(true);
    });
  });

  it("copy point with no arguments, specify individual coordinates", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph name="g">
      <point name="A" labelIsName />
      <point copySource="A" name="B" labelIsName x="1" />
      <point copySource="A" name="C" labelIsName y="1" />
      <point copySource="B" name="D" labelIsName y="2" />
    </graph>

    <graph copySource="g" name="g2" newNamespace />

    <coords copySource="A" name="Ac" />
    <coords copySource="B" name="Bc" />
    <coords copySource="C" name="Cc" />
    <coords copySource="D" name="Dc" />
    <coords copySource="g2/A" name="Ac2" />
    <coords copySource="g2/B" name="Bc2" />
    <coords copySource="g2/C" name="Cc2" />
    <coords copySource="g2/D" name="Dc2" />
 
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(0,0)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(1,0)");
    cy.get(cesc("#\\/Cc") + " .mjx-mrow").should("contain.text", "(0,1)");
    cy.get(cesc("#\\/Dc") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.get(cesc("#\\/Ac2") + " .mjx-mrow").should("contain.text", "(0,0)");
    cy.get(cesc("#\\/Bc2") + " .mjx-mrow").should("contain.text", "(1,0)");
    cy.get(cesc("#\\/Cc2") + " .mjx-mrow").should("contain.text", "(0,1)");
    cy.get(cesc("#\\/Dc2") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 3, y: 4 },
      });
    });

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(3,4)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(1,4)");
    cy.get(cesc("#\\/Cc") + " .mjx-mrow").should("contain.text", "(3,1)");
    cy.get(cesc("#\\/Dc") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.get(cesc("#\\/Ac2") + " .mjx-mrow").should("contain.text", "(3,4)");
    cy.get(cesc("#\\/Bc2") + " .mjx-mrow").should("contain.text", "(1,4)");
    cy.get(cesc("#\\/Cc2") + " .mjx-mrow").should("contain.text", "(3,1)");
    cy.get(cesc("#\\/Dc2") + " .mjx-mrow").should("contain.text", "(1,2)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: 5, y: 6 },
      });
    });

    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(5,6)");

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(3,6)");
    cy.get(cesc("#\\/Cc") + " .mjx-mrow").should("contain.text", "(3,1)");
    cy.get(cesc("#\\/Dc") + " .mjx-mrow").should("contain.text", "(5,2)");

    cy.get(cesc("#\\/Ac2") + " .mjx-mrow").should("contain.text", "(3,6)");
    cy.get(cesc("#\\/Bc2") + " .mjx-mrow").should("contain.text", "(5,6)");
    cy.get(cesc("#\\/Cc2") + " .mjx-mrow").should("contain.text", "(3,1)");
    cy.get(cesc("#\\/Dc2") + " .mjx-mrow").should("contain.text", "(5,2)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: 7, y: 8 },
      });
    });

    cy.get(cesc("#\\/Cc") + " .mjx-mrow").should("contain.text", "(7,8)");

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(7,6)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(5,6)");
    cy.get(cesc("#\\/Dc") + " .mjx-mrow").should("contain.text", "(5,2)");

    cy.get(cesc("#\\/Ac2") + " .mjx-mrow").should("contain.text", "(7,6)");
    cy.get(cesc("#\\/Bc2") + " .mjx-mrow").should("contain.text", "(5,6)");
    cy.get(cesc("#\\/Cc2") + " .mjx-mrow").should("contain.text", "(7,8)");
    cy.get(cesc("#\\/Dc2") + " .mjx-mrow").should("contain.text", "(5,2)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/D",
        args: { x: 9, y: 10 },
      });
    });

    cy.get(cesc("#\\/Dc") + " .mjx-mrow").should("contain.text", "(9,10)");

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(7,6)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(9,6)");
    cy.get(cesc("#\\/Cc") + " .mjx-mrow").should("contain.text", "(7,8)");

    cy.get(cesc("#\\/Ac2") + " .mjx-mrow").should("contain.text", "(7,6)");
    cy.get(cesc("#\\/Bc2") + " .mjx-mrow").should("contain.text", "(9,6)");
    cy.get(cesc("#\\/Cc2") + " .mjx-mrow").should("contain.text", "(7,8)");
    cy.get(cesc("#\\/Dc2") + " .mjx-mrow").should("contain.text", "(9,10)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/D",
        args: { x: -1, y: -2 },
      });
    });

    cy.get(cesc("#\\/Dc") + " .mjx-mrow").should("contain.text", "(−1,−2)");

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(7,6)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(−1,6)");
    cy.get(cesc("#\\/Cc") + " .mjx-mrow").should("contain.text", "(7,8)");

    cy.get(cesc("#\\/Ac2") + " .mjx-mrow").should("contain.text", "(7,6)");
    cy.get(cesc("#\\/Bc2") + " .mjx-mrow").should("contain.text", "(−1,6)");
    cy.get(cesc("#\\/Cc2") + " .mjx-mrow").should("contain.text", "(7,8)");
    cy.get(cesc("#\\/Dc2") + " .mjx-mrow").should("contain.text", "(−1,−2)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/C",
        args: { x: -3, y: -4 },
      });
    });

    cy.get(cesc("#\\/Cc") + " .mjx-mrow").should("contain.text", "(−3,−4)");

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(−3,6)");
    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(−1,6)");
    cy.get(cesc("#\\/Dc") + " .mjx-mrow").should("contain.text", "(−1,−2)");

    cy.get(cesc("#\\/Ac2") + " .mjx-mrow").should("contain.text", "(−3,6)");
    cy.get(cesc("#\\/Bc2") + " .mjx-mrow").should("contain.text", "(−1,6)");
    cy.get(cesc("#\\/Cc2") + " .mjx-mrow").should("contain.text", "(−3,−4)");
    cy.get(cesc("#\\/Dc2") + " .mjx-mrow").should("contain.text", "(−1,−2)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: -5, y: -6 },
      });
    });

    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(−5,−6)");

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(−3,−6)");
    cy.get(cesc("#\\/Cc") + " .mjx-mrow").should("contain.text", "(−3,−4)");
    cy.get(cesc("#\\/Dc") + " .mjx-mrow").should("contain.text", "(−5,−2)");

    cy.get(cesc("#\\/Ac2") + " .mjx-mrow").should("contain.text", "(−3,−6)");
    cy.get(cesc("#\\/Bc2") + " .mjx-mrow").should("contain.text", "(−5,−6)");
    cy.get(cesc("#\\/Cc2") + " .mjx-mrow").should("contain.text", "(−3,−4)");
    cy.get(cesc("#\\/Dc2") + " .mjx-mrow").should("contain.text", "(−5,−2)");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: -7, y: -8 },
      });
    });

    cy.get(cesc("#\\/Ac") + " .mjx-mrow").should("contain.text", "(−7,−8)");

    cy.get(cesc("#\\/Bc") + " .mjx-mrow").should("contain.text", "(−5,−8)");
    cy.get(cesc("#\\/Cc") + " .mjx-mrow").should("contain.text", "(−7,−4)");
    cy.get(cesc("#\\/Dc") + " .mjx-mrow").should("contain.text", "(−5,−2)");

    cy.get(cesc("#\\/Ac2") + " .mjx-mrow").should("contain.text", "(−7,−8)");
    cy.get(cesc("#\\/Bc2") + " .mjx-mrow").should("contain.text", "(−5,−8)");
    cy.get(cesc("#\\/Cc2") + " .mjx-mrow").should("contain.text", "(−7,−4)");
    cy.get(cesc("#\\/Dc2") + " .mjx-mrow").should("contain.text", "(−5,−2)");
  });

  it("1D point from string, xs, coords, not x", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <point name="oneDa">1</point>
    <point name="oneDb" xs="1"/>
    <point name="oneDc" coords="1"/>
    <point name="twoD" x="1" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/oneDa") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc("#\\/oneDb") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc("#\\/oneDc") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "1");
    cy.get(cesc("#\\/twoD") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,0)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/oneDa"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/oneDb"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/oneDc"].stateValues.numDimensions).eq(1);
      expect(stateVariables["/twoD"].stateValues.numDimensions).eq(2);

      expect(stateVariables["/oneDa"].stateValues.xs).eqls([1]);
      expect(stateVariables["/oneDb"].stateValues.xs).eqls([1]);
      expect(stateVariables["/oneDc"].stateValues.xs).eqls([1]);
      expect(stateVariables["/twoD"].stateValues.xs).eqls([1, 0]);
    });
  });

  it("points from vector operations", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math name="m" fixed>(6,3)</math>
    <graph>
      <point name="P">(3,4) + 2(1,-1)</point>
      <point name="Q">2$m - 3$P</point>
    </graph>

    <math copySource="P" name="P2" />
    <math copySource="Q" name="Q2" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/m") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,3)");
    cy.get(cesc2("#/P2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,2)");
    cy.get(cesc2("#/Q2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,0)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/P"].stateValues.xs).eqls([5, 2]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([-3, 0]);
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 1, y: 4 },
      });
    });

    cy.get(cesc2("#/P2") + " .mjx-mrow").should("contain.text", "(1,4)");
    cy.get(cesc2("#/Q2") + " .mjx-mrow").should("contain.text", "(9,−6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([1, 4]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([9, -6]);
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: -9, y: 9 },
      });
    });

    cy.get(cesc2("#/P2") + " .mjx-mrow").should("contain.text", "(7,−1)");
    cy.get(cesc2("#/Q2") + " .mjx-mrow").should("contain.text", "(−9,9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs).eqls([7, -1]);
      expect(stateVariables["/Q"].stateValues.xs).eqls([-9, 9]);
    });
  });

  it("handle invalid layer", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point name="P" layer="$l">(3,4)</point>
    </graph>
    <mathinput name="l" />
    <number copysource="P.layer" name="l2" /> 
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/l2")).should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.layer).eq(0);
    });

    cy.get(cesc("#\\/l") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/l2")).should("have.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.layer).eq(1);
    });
  });

  it("style description changes with theme", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" markerColor="brown" markerColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" markerColor="#540907" markerColorWord="dark red" markerColorDarkMode="#f0c6c5" markerColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <point name="A" styleNumber="1" labelIsName>(1,2)</point>
      <point name="B" styleNumber="2" labelIsName>(3,4)</point>
      <point name="C" styleNumber="5" labelIsName>(5,6)</point>
    </graph>
    <p name="Adescrip">Point A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/Adescrip")).should("have.text", "Point A is brown.");
    cy.get(cesc("#\\/Bdescrip")).should("have.text", "B is a dark red square.");
    cy.get(cesc("#\\/Cdescrip")).should("have.text", "C is a black point.");

    cy.log("set dark mode");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_darkmode").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.get(cesc("#\\/Adescrip")).should("have.text", "Point A is yellow.");
    cy.get(cesc("#\\/Bdescrip")).should(
      "have.text",
      "B is a light red square.",
    );
    cy.get(cesc("#\\/Cdescrip")).should("have.text", "C is a white point.");
  });

  it("color point text via style", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
      </styleDefinitions>
    </setup>

    <p>Style number: <mathinput prefill="1" name="sn" /></p>

    <p><point name="no_style">(0,0)</point> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><point name="fixed_style" stylenumber="2">(1,1)</point> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><point name="variable_style" stylenumber="$sn">(2,2)</point> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      $no_style{anchor="(1,2)"}
      $fixed_style{anchor="(3,4)"}
      $variable_style
    </graph>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(0, 0, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    // TODO: how to test color in graph

    cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/tsd_variable_style")).should(
      "have.text",
      "red with a blue background",
    );
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "red");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "blue");

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(255, 0, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgb(0, 0, 255)",
    );
  });

  it("fix location versus fixed", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
      <point name="P" />
    </graph>

    <coords name="Pcoords" copysource="P.coords" />
    <mathinput name="miP" bindValueTo="$P" />

    <p>Fix location: <booleaninput name="fl" bindValueTo="$P.fixLocation" /> <boolean copySource="P.fixLocation" name="fl2" /></p>
    <p>Fixed: <booleaninput name="fx" bindValueTo="$P.fixed" /> <boolean copySource="P.fixed" name="fx2" /></p>
    <p>Draggable: <booleaninput name="dg" bindValueTo="$P.draggable" /> <boolean copySource="P.draggable" name="dg2" /></p>
    <p>nClicks: <number name="nClicks">0</number><updateValue triggerWhenObjectsClicked="P" target="nClicks" newValue="$nClicks+1" /></p>
    <p>nFocused: <number name="nFocused">0</number><updateValue triggerWhenObjectsFocused="P" target="nFocused" newValue="$nFocused+1" /></p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/Pcoords") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc2("#/nClicks")).should("have.text", "0");
    cy.get(cesc2("#/nFocused")).should("have.text", "0");
    cy.get(cesc2("#/fl2")).should("have.text", "false");
    cy.get(cesc2("#/fx2")).should("have.text", "false");
    cy.get(cesc2("#/dg2")).should("have.text", "true");

    cy.log("move point by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 3, y: 5 },
      });
    });

    cy.get(cesc2("#/Pcoords") + " .mjx-mrow").should("contain.text", "(3,5)");
    cy.get(cesc2("#/Pcoords") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,5)");

    cy.log("focus point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "pointFocused",
        componentName: "/P",
        args: { name: "/P" },
      });
    });

    cy.get(cesc2("#/nFocused")).should("have.text", "1");
    cy.get(cesc2("#/nClicks")).should("have.text", "0");

    cy.log("click point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
        args: { name: "/P" },
      });
    });

    cy.get(cesc2("#/nClicks")).should("have.text", "1");
    cy.get(cesc2("#/nFocused")).should("have.text", "1");

    cy.log("Make not draggable");
    cy.get(cesc2("#/dg")).click();
    cy.get(cesc2("#/dg2")).should("have.text", "false");

    cy.log("can't move point by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: 9, y: 0 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");

    cy.get(cesc2("#/Pcoords") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,5)");

    cy.log("can move entering coordinates");
    cy.get(cesc2("#/miP") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(8,7){enter}",
      { force: true },
    );
    cy.get(cesc2("#/Pcoords") + " .mjx-mrow").should("contain.text", "(8,7)");
    cy.get(cesc2("#/Pcoords") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,7)");

    cy.log("focus point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "pointFocused",
        componentName: "/P",
        args: { name: "/P" },
      });
    });

    cy.get(cesc2("#/nFocused")).should("have.text", "2");
    cy.get(cesc2("#/nClicks")).should("have.text", "1");

    cy.log("click point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
        args: { name: "/P" },
      });
    });

    cy.get(cesc2("#/nClicks")).should("have.text", "2");
    cy.get(cesc2("#/nFocused")).should("have.text", "2");

    cy.log("fix location");
    cy.get(cesc2("#/fl")).click();
    cy.get(cesc2("#/fl2")).should("have.text", "true");

    cy.log("can still change draggable");
    cy.get(cesc2("#/dg")).click();
    cy.get(cesc2("#/dg2")).should("have.text", "true");

    cy.log("still can't move point by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -4, y: 10 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "false");

    cy.get(cesc2("#/Pcoords") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,7)");

    cy.log("can't move entering coordinates");
    cy.get(cesc2("#/miP") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(-5,-9){enter}",
      { force: true },
    );

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");

    cy.get(cesc2("#/Pcoords") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,7)");

    cy.log("focus point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "pointFocused",
        componentName: "/P",
        args: { name: "/P" },
      });
    });

    cy.get(cesc2("#/nFocused")).should("have.text", "3");
    cy.get(cesc2("#/nClicks")).should("have.text", "2");

    cy.log("click point");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
        args: { name: "/P" },
      });
    });

    cy.get(cesc2("#/nClicks")).should("have.text", "3");
    cy.get(cesc2("#/nFocused")).should("have.text", "3");

    cy.log("fix point");
    cy.get(cesc2("#/fx")).click();
    cy.get(cesc2("#/fx2")).should("have.text", "true");

    cy.log("cannot change draggable or fix location");
    cy.get(cesc2("#/fl")).click();
    cy.get(cesc2("#/dg")).click();

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "false");

    cy.get(cesc2("#/fl2")).should("have.text", "true");
    cy.get(cesc2("#/dg2")).should("have.text", "true");

    cy.log("trying to focus point or click point does not increment counters");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "pointFocused",
        componentName: "/P",
        args: { name: "/P" },
      });

      await win.callAction1({
        actionName: "pointClicked",
        componentName: "/P",
        args: { name: "/P" },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");

    cy.get(cesc2("#/nFocused")).should("have.text", "3");
    cy.get(cesc2("#/nClicks")).should("have.text", "3");

    cy.log("can still change fixed");
    cy.get(cesc2("#/fx")).click();
    cy.get(cesc2("#/fx2")).should("have.text", "false");
  });

  it("fix location or fixed is comunicated so know math from point can't be changed", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
      <point name="P" fixLocation="$fl" fixed="$fx" draggable="$dg">(3,4)</point>
      <point name="Q">(5,6)</point>
      <point name="M">($P+$Q)/2</point>
    </graph>

    <p>Fix location: <booleaninput name="fl"/> <boolean copySource="P.fixLocation" name="fl2" /></p>
    <p>Fixed: <booleaninput name="fx" /> <boolean copySource="P.fixed" name="fx2" /></p>
    <p>Draggable: <booleaninput name="dg" prefill="true" /> <boolean copySource="P.draggable" name="dg2" /></p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>
    <p>Midpoint: <math name="Ma" copySource="M" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/Ma") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)");

    cy.log("cannot move midpoint point by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/M",
        args: { x: 5, y: 6 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "true");

    cy.get(cesc2("#/Ma") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,5)");

    cy.log("fix location of P");
    cy.get(cesc2("#/fl")).click();
    cy.get(cesc2("#/fl2")).should("have.text", "true");

    cy.log("now can move midpoint point by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/M",
        args: { x: 5, y: 6 },
      });
    });

    cy.get(cesc2("#/Ma") + " .mjx-mrow").should("contain.text", "(5,6)");
    cy.get(cesc2("#/Ma") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");

    cy.log("unfix location of P and make not draggable");
    cy.get(cesc2("#/fl")).click();
    cy.get(cesc2("#/dg")).click();
    cy.get(cesc2("#/fl2")).should("have.text", "false");
    cy.get(cesc2("#/dg2")).should("have.text", "false");

    cy.log("cannot move midpoint point by dragging again");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/M",
        args: { x: -1, y: -2 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc2("#/bi")).click();
    cy.get(cesc2("#/b")).should("have.text", "false");

    cy.get(cesc2("#/Ma") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,6)");

    cy.log("fix P and make draggable");
    cy.get(cesc2("#/fx")).click();
    cy.get(cesc2("#/dg")).click();
    cy.get(cesc2("#/fx2")).should("have.text", "true");
    cy.get(cesc2("#/dg2")).should("have.text", "true");

    cy.log("now can move midpoint point by dragging again");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/M",
        args: { x: 4, y: 3 },
      });
    });

    cy.get(cesc2("#/Ma") + " .mjx-mrow").should("contain.text", "(4,3)");
    cy.get(cesc2("#/Ma") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,3)");
  });

  it("hideOffGraphIndicator", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <graph>
      <point name="P1">(12,3)</point>
      <point name="Q1" hideOffGraphIndicator>(-2,14)</point>
      <point name="R1" hideOffGraphIndicator="false">(6,-14)</point>
    </graph>

    <boolean copySource="P1.hideOffGraphIndicator" name="P1h" />
    <boolean copySource="Q1.hideOffGraphIndicator" name="Q1h" />
    <boolean copySource="R1.hideOffGraphIndicator" name="R1h" />

    <graph hideOffGraphIndicators>
      <point name="P2" copySource="P1" />
      <point name="Q2" copySource="Q1" />
      <point name="R2" copySource="R1" />
    </graph>

    <boolean copySource="P2.hideOffGraphIndicator" name="P2h" />
    <boolean copySource="Q2.hideOffGraphIndicator" name="Q2h" />
    <boolean copySource="R2.hideOffGraphIndicator" name="R2h" />

    <graph hideOffGraphIndicators="false" >
      <point name="P3" copySource="P1" />
      <point name="Q3" copySource="Q1" />
      <point name="R3" copySource="R1" />
    </graph>

    <boolean copySource="P3.hideOffGraphIndicator" name="P3h" />
    <boolean copySource="Q3.hideOffGraphIndicator" name="Q3h" />
    <boolean copySource="R3.hideOffGraphIndicator" name="R3h" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/P1h")).should("have.text", "false");
    cy.get(cesc2("#/Q1h")).should("have.text", "true");
    cy.get(cesc2("#/R1h")).should("have.text", "false");

    cy.get(cesc2("#/P2h")).should("have.text", "true");
    cy.get(cesc2("#/Q2h")).should("have.text", "true");
    cy.get(cesc2("#/R2h")).should("have.text", "false");

    cy.get(cesc2("#/P3h")).should("have.text", "false");
    cy.get(cesc2("#/Q3h")).should("have.text", "true");
    cy.get(cesc2("#/R3h")).should("have.text", "false");
  });
});
