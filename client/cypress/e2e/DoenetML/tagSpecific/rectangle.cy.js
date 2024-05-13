import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

describe("Rectangle Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("rectangle with no parameters (gives unit square)", () => {
    setupScene({
      rectangleProperties: "",
      rectangleChildren: "",
    });

    runTests({
      v0x: 0,
      v0y: 0,
      v2x: 1,
      v2y: 1,
      cornerDependencyState: 1,
    });
  });

  it("rectangle with only height", () => {
    setupScene({
      rectangleProperties: 'height="-3"',
      rectangleChildren: "",
    });

    runTests({
      v0x: 0,
      v0y: 0,
      v2x: 1,
      v2y: -3,
      cornerDependencyState: 1,
    });
  });

  it("rectangle with only width and height", () => {
    setupScene({
      rectangleProperties: 'width="3" height="5"',
      rectangleChildren: "",
    });

    runTests({
      v0x: 0,
      v0y: 0,
      v2x: 3,
      v2y: 5,
      cornerDependencyState: 1,
    });
  });

  it("rectangle with only center", () => {
    setupScene({
      rectangleProperties: 'center="(-1,5)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -1.5,
      v0y: 4.5,
      v2x: -0.5,
      v2y: 5.5,
      cornerDependencyState: 0,
    });
  });

  it("rectangle with only center and width", () => {
    setupScene({
      rectangleProperties: 'width="-2" center="(-4,2)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -3,
      v0y: 1.5,
      v2x: -5,
      v2y: 2.5,
      cornerDependencyState: 0,
    });
  });

  it("rectangle with only 1 vertex", () => {
    setupScene({
      rectangleProperties: 'vertices="(2,3)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: 2,
      v0y: 3,
      v2x: 3,
      v2y: 4,
      cornerDependencyState: 1,
    });
  });

  it("rectangle with only 1 vertex and height", () => {
    setupScene({
      rectangleProperties: 'height="6" vertices="(-3,4)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -3,
      v0y: 4,
      v2x: -2,
      v2y: 10,
      cornerDependencyState: 1,
    });
  });

  it("rectangle with center, width and height", () => {
    setupScene({
      rectangleProperties: 'width="6" height="-3" center="(-3,-4)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -6,
      v0y: -2.5,
      v2x: 0,
      v2y: -5.5,
      cornerDependencyState: 0,
    });
  });

  it("rectangle with vertex, width and height", () => {
    setupScene({
      rectangleProperties: 'width="7" height="4" vertices="(-1,2)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -1,
      v0y: 2,
      v2x: 6,
      v2y: 6,
      cornerDependencyState: 1,
    });
  });

  it("rectangle with 1 vertex and center", () => {
    setupScene({
      rectangleProperties: 'vertices="(-2,-4)" center="(1,-1)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -2,
      v0y: -4,
      v2x: 4,
      v2y: 2,
      cornerDependencyState: 2,
    });
  });

  it("rectangle with 2 vertices", () => {
    setupScene({
      rectangleProperties: 'vertices="(-5,-9) (-1,-2)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -5,
      v0y: -9,
      v2x: -1,
      v2y: -2,
      cornerDependencyState: 0,
    });
  });

  it("copy rectangle and overwrite attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <group newNamespace name="g1" >
      <sideBySide widths="25% 25% 25% 25%" >
      <graph width="180" height="180">
        <rectangle name="r1" />
      </graph>
      <graph width="180" height="180">
        <copy target="r1" vertices="(3,4)" assignNames="r2" styleNumber="2" />
      </graph>
      <graph width="180" height="180">
        <copy target="r2" width="5" assignNames="r3" styleNumber="3" />
      </graph>
      <graph width="180" height="180">
        <copy target="r3" center="(4,5)" assignNames="r4" styleNumber="4" />
      </graph>
      </sideBySide>
    </group>

    <copy target="g1" assignNames="g2" />


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    async function checkTransformedRectangleValues({
      stateVariables,
      v0x1,
      v0y1,
      v2x1,
      v2y1,
      v0x2,
      v0y2,
      v2x2,
      v2y2,
      v2x3,
      v2x4,
      v2y4,
    }) {
      checkRectangleValues(
        {
          rectangleNames: ["/g1/r1", "/g2/r1"],
        },
        {
          v0x: v0x1,
          v0y: v0y1,
          v2x: v2x1,
          v2y: v2y1,
        },
        stateVariables,
      );

      checkRectangleValues(
        {
          rectangleNames: ["/g1/r2", "/g2/r2"],
        },
        {
          v0x: v0x2,
          v0y: v0y2,
          v2x: v2x2,
          v2y: v2y2,
        },
        stateVariables,
      );

      checkRectangleValues(
        {
          rectangleNames: ["/g1/r3", "/g2/r3"],
        },
        {
          v0x: v0x2,
          v0y: v0y2,
          v2x: v2x3,
          v2y: v2y2,
        },
        stateVariables,
      );

      checkRectangleValues(
        {
          rectangleNames: ["/g1/r4", "/g2/r4"],
        },
        {
          v0x: v0x2,
          v0y: v0y2,
          v2x: v2x4,
          v2y: v2y4,
        },
        stateVariables,
      );
    }

    let v0x1 = 0,
      v0y1 = 0,
      v2x1 = 1,
      v2y1 = 1,
      v0x2 = 3,
      v0y2 = 4,
      v2x2 = 4,
      v2y2 = 5,
      v2x3 = 8,
      v2x4 = 5,
      v2y4 = 6;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      await checkTransformedRectangleValues({
        stateVariables,
        v0x1,
        v0y1,
        v2x1,
        v2y1,
        v0x2,
        v0y2,
        v2x2,
        v2y2,
        v2x3,
        v2x4,
        v2y4,
      });
    });

    cy.log("shift g1/r1");

    cy.window().then(async (win) => {
      let dx = -2;
      let dy = 4;

      v0x1 += dx;
      v0y1 += dy;
      v2x1 += dx;
      v2y1 += dy;

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/r1",
        args: {
          pointCoords: { 0: [v0x1, v0y1], 2: [v2x1, v2y1] },
        },
      });

      let stateVariables = await win.returnAllStateVariables1();
      await checkTransformedRectangleValues({
        stateVariables,
        v0x1,
        v0y1,
        v2x1,
        v2y1,
        v0x2,
        v0y2,
        v2x2,
        v2y2,
        v2x3,
        v2x4,
        v2y4,
      });
    });

    cy.log("move vertex 0 of g2/r1");

    cy.window().then(async (win) => {
      v0x1 = 1;
      v0y1 = 8;

      let width = v2x1 - v0x1;
      let height = v2y1 - v0y1;

      v2x2 = v0x2 + width;
      v2y2 = v0y2 + height;

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/r1",
        args: {
          pointCoords: { 0: [v0x1, v0y1] },
        },
      });

      let stateVariables = await win.returnAllStateVariables1();
      await checkTransformedRectangleValues({
        stateVariables,
        v0x1,
        v0y1,
        v2x1,
        v2y1,
        v0x2,
        v0y2,
        v2x2,
        v2y2,
        v2x3,
        v2x4,
        v2y4,
      });
    });

    cy.log("move vertex 1 of g1/r2");

    cy.window().then(async (win) => {
      let center4x = (v2x4 + v0x2) / 2;
      let center4y = (v2y4 + v0y2) / 2;

      let width3 = v2x3 - v0x2;

      v0x2 = -5;
      v0y2 = -2;

      let width = v2x2 - v0x2;
      let height = v2y2 - v0y2;

      v2x1 = v0x1 + width;
      v2y1 = v0y1 + height;

      v2x3 = v0x2 + width3;

      v2x4 = 2 * center4x - v0x2;
      v2y4 = 2 * center4y - v0y2;

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/r2",
        args: {
          pointCoords: { 0: [v0x2, v0y2] },
        },
      });

      let stateVariables = await win.returnAllStateVariables1();
      await checkTransformedRectangleValues({
        stateVariables,
        v0x1,
        v0y1,
        v2x1,
        v2y1,
        v0x2,
        v0y2,
        v2x2,
        v2y2,
        v2x3,
        v2x4,
        v2y4,
      });
    });

    cy.log("move vertex 2 of g2/r2");

    cy.window().then(async (win) => {
      let center4x = (v2x4 + v0x2) / 2;
      let center4y = (v2y4 + v0y2) / 2;

      let width3 = v2x3 - v0x2;

      v2x2 = -3;
      v0y2 = 3;

      let width = v2x2 - v0x2;
      let height = v2y2 - v0y2;

      v2x1 = v0x1 + width;
      v2y1 = v0y1 + height;

      // v2x3 = v0x2 + width3;

      // v2x4 = 2 * center4x - v0x2;
      v2y4 = 2 * center4y - v0y2;

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/r2",
        args: {
          pointCoords: { 1: [v2x2, v0y2] },
        },
      });

      let stateVariables = await win.returnAllStateVariables1();
      await checkTransformedRectangleValues({
        stateVariables,
        v0x1,
        v0y1,
        v2x1,
        v2y1,
        v0x2,
        v0y2,
        v2x2,
        v2y2,
        v2x3,
        v2x4,
        v2y4,
      });
    });

    cy.log("move vertex 3 of g1/r3");

    cy.window().then(async (win) => {
      let center4x = (v2x4 + v0x2) / 2;
      let center4y = (v2y4 + v0y2) / 2;

      let width3 = v2x3 - v0x2;

      v2x3 = -8;
      v2y2 = -6;

      let width = v2x2 - v0x2;
      let height = v2y2 - v0y2;

      // v2x1 = v0x1 + width;
      v2y1 = v0y1 + height;

      // v2x3 = v0x2 + width3;

      // v2x4 = 2 * center4x - v0x2;
      // v2y4 = 2 * center4y - v0y2;

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/r3",
        args: {
          pointCoords: { 2: [v2x3, v2y2] },
        },
      });

      let stateVariables = await win.returnAllStateVariables1();
      await checkTransformedRectangleValues({
        stateVariables,
        v0x1,
        v0y1,
        v2x1,
        v2y1,
        v0x2,
        v0y2,
        v2x2,
        v2y2,
        v2x3,
        v2x4,
        v2y4,
      });
    });

    cy.log("move vertex 4 of g2/r3");

    cy.window().then(async (win) => {
      let center4x = (v2x4 + v0x2) / 2;
      let center4y = (v2y4 + v0y2) / 2;

      // let width3 = v2x3 - v0x2;

      let width = v2x2 - v0x2;

      v0x2 = 7;
      v2y2 = -5;

      let height = v2y2 - v0y2;

      v2x2 = v0x2 + width;

      v2x1 = v0x1 + width;
      v2y1 = v0y1 + height;

      // v2x3 = v0x2 + width3;

      v2x4 = 2 * center4x - v0x2;
      // v2y4 = 2 * center4y - v0y2;

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/r3",
        args: {
          pointCoords: { 3: [v0x2, v2y2] },
        },
      });

      let stateVariables = await win.returnAllStateVariables1();
      await checkTransformedRectangleValues({
        stateVariables,
        v0x1,
        v0y1,
        v2x1,
        v2y1,
        v0x2,
        v0y2,
        v2x2,
        v2y2,
        v2x3,
        v2x4,
        v2y4,
      });
    });

    cy.log("move vertex 2 of g1/r4");

    cy.window().then(async (win) => {
      let center4x = (v2x4 + v0x2) / 2;
      let center4y = (v2y4 + v0y2) / 2;

      // let width3 = v2x3 - v0x2;

      let width = v2x2 - v0x2;
      let height = v2y2 - v0y2;

      v2x4 = -9;
      v0y2 = 8;

      v2y2 = v0y2 + height;

      // v2x1 = v0x1 + width;
      // v2y1 = v0y1 + height;

      // v2x3 = v0x2 + width3;

      // v2x4 = 2 * center4x - v0x2;
      // v2y4 = 2 * center4y - v0y2;

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/r4",
        args: {
          pointCoords: { 1: [v2x4, v0y2] },
        },
      });

      let stateVariables = await win.returnAllStateVariables1();
      await checkTransformedRectangleValues({
        stateVariables,
        v0x1,
        v0y1,
        v2x1,
        v2y1,
        v0x2,
        v0y2,
        v2x2,
        v2y2,
        v2x3,
        v2x4,
        v2y4,
      });
    });

    cy.log("move vertex 3 of g2/r4");

    cy.window().then(async (win) => {
      let center4x = (v2x4 + v0x2) / 2;
      let center4y = (v2y4 + v0y2) / 2;

      // let width3 = v2x3 - v0x2;

      let width = v2x2 - v0x2;
      let height = v2y2 - v0y2;

      v2x4 = 2;
      v2y4 = -5;

      // v2y2 = v0y2 + height;

      // v2x1 = v0x1 + width;
      // v2y1 = v0y1 + height;

      // v2x3 = v0x2 + width3;

      // v2x4 = 2 * center4x - v0x2;
      // v2y4 = 2 * center4y - v0y2;

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/r4",
        args: {
          pointCoords: { 2: [v2x4, v2y4] },
        },
      });

      let stateVariables = await win.returnAllStateVariables1();
      await checkTransformedRectangleValues({
        stateVariables,
        v0x1,
        v0y1,
        v2x1,
        v2y1,
        v0x2,
        v0y2,
        v2x2,
        v2y2,
        v2x3,
        v2x4,
        v2y4,
      });
    });
  });

  it("copy propIndex of vertices", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <rectangle vertices="(2,-3) (3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy prop="vertices" target="_rectangle1" propIndex="$n" assignNames="P1 P2 P3 P4" /></p>

    <p><copy prop="vertex2" target="_rectangle1" propIndex="$n" assignNames="x" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = -3;
    let t3x = 3,
      t3y = 4;
    let t4x = 2,
      t4y = 4;

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2x)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t2x)},${nInDOM(t2y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t3x)},${nInDOM(t3y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t4x)},${nInDOM(t4y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}5{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
  });

  it("copy propIndex of vertices, dot and array notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <rectangle vertices="(2,-3) (3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy source="_rectangle1.vertices[$n]" assignNames="P1 P2 P3 P4" /></p>

    <p><copy source="_rectangle1.vertex2[$n]" assignNames="x" /></p>

    <p><copy source="_rectangle1.vertices[2][$n]" assignNames="xa" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = -3;
    let t3x = 3,
      t3y = 4;
    let t4x = 2,
      t4y = 4;

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2x)}`,
    );
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2x)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t2x)},${nInDOM(t2y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t3x)},${nInDOM(t3y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t4x)},${nInDOM(t4y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}5{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");
  });

  it("draggable, vertices draggable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <rectangle vertices="(1,3) (5,7)" name="p" draggable="$draggable" verticesDraggable="$verticesDraggable" />
  </graph>
  <p>To wait: <booleaninput name="bi" /> <boolean copySource="bi" name="bi2" /></p>
  <p>draggable: <booleaninput name="draggable" /> <boolean copySource="p.draggable" name="d2" /></p>
  <p>vertices draggable: <booleaninput name="verticesDraggable" /> <boolean copySource="p.verticesDraggable" name="vd2" /></p>
  <p name="pvert">corner vertices: $p.vertex1 $p.vertex3</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/d2")).should("have.text", "false");
    cy.get(cesc("#\\/vd2")).should("have.text", "false");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([1, 3]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(false);
      expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);
    });

    cy.log("cannot move single vertex");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: { 0: [4, 7] },
        },
      });
    });

    // wait for core to process click
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/bi2")).should("have.text", "true");

    cy.get(cesc("#\\/d2")).should("have.text", "false");
    cy.get(cesc("#\\/vd2")).should("have.text", "false");

    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([1, 3]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(false);
      expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);
    });

    cy.log("cannot move all vertices");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [
            [4, 7],
            [8, 10],
            [1, 9],
            [3, 2],
          ],
        },
      });
    });

    // wait for core to process click
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/bi2")).should("have.text", "false");

    cy.get(cesc("#\\/d2")).should("have.text", "false");
    cy.get(cesc("#\\/vd2")).should("have.text", "false");

    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([1, 3]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(false);
      expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);
    });

    cy.log("only vertices draggable");

    cy.get(cesc("#\\/verticesDraggable")).click();
    cy.get(cesc("#\\/vd2")).should("have.text", "true");

    cy.log("can move single vertex");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: { 0: [4, 7] },
        },
      });
    });

    cy.get(cesc("#\\/pvert") + " .mjx-mrow").should("contain.text", "(4,7)");

    cy.get(cesc("#\\/d2")).should("have.text", "false");
    cy.get(cesc("#\\/vd2")).should("have.text", "true");

    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([4, 7]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(false);
      expect(stateVariables["/p"].stateValues.verticesDraggable).eq(true);
    });

    cy.log("cannot move all vertices");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [
            [3, 8],
            [8, 10],
            [1, 9],
            [3, 2],
          ],
        },
      });
    });

    // wait for core to process click
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/bi2")).should("have.text", "true");

    cy.get(cesc("#\\/d2")).should("have.text", "false");
    cy.get(cesc("#\\/vd2")).should("have.text", "true");

    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([4, 7]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(false);
      expect(stateVariables["/p"].stateValues.verticesDraggable).eq(true);
    });

    cy.log("vertices and polygon draggable");

    cy.get(cesc("#\\/draggable")).click();
    cy.get(cesc("#\\/d2")).should("have.text", "true");

    cy.log("can move single vertex");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: { 2: [-3, 2] },
        },
      });
    });

    cy.get(cesc("#\\/pvert") + " .mjx-mrow").should("contain.text", "(−3,2)");

    cy.get(cesc("#\\/d2")).should("have.text", "true");
    cy.get(cesc("#\\/vd2")).should("have.text", "true");

    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(−3,2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([4, 7]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([-3, 2]);
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.verticesDraggable).eq(true);
    });

    cy.log("can move all vertices");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [
            [3, 8],
            [5, 8],
            [5, 1],
            [3, 1],
          ],
        },
      });
    });

    cy.get(cesc("#\\/pvert") + " .mjx-mrow").should("contain.text", "(3,8)");

    cy.get(cesc("#\\/d2")).should("have.text", "true");
    cy.get(cesc("#\\/vd2")).should("have.text", "true");

    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,8)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([3, 8]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([5, 1]);
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.verticesDraggable).eq(true);
    });

    cy.log("polygon but not vertices draggable");

    cy.get(cesc("#\\/verticesDraggable")).click();
    cy.get(cesc("#\\/vd2")).should("have.text", "false");

    cy.log("cannot move single vertex");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: { 2: [9, 3] },
        },
      });
    });

    // wait for core to process click
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/bi2")).should("have.text", "false");

    cy.get(cesc("#\\/d2")).should("have.text", "true");
    cy.get(cesc("#\\/vd2")).should("have.text", "false");

    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,8)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,1)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([3, 8]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([5, 1]);
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);
    });

    cy.log("can move all vertices");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [
            [-4, 1],
            [3, 1],
            [3, 7],
            [-4, 7],
          ],
        },
      });
    });

    cy.get(cesc("#\\/pvert") + " .mjx-mrow").should("contain.text", "(−4,1)");

    cy.get(cesc("#\\/d2")).should("have.text", "true");
    cy.get(cesc("#\\/vd2")).should("have.text", "false");

    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−4,1)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(3,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([-4, 1]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([3, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);
    });
  });

  it("single vertex constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="P">(1,3)
      <constraints>
         <constrainToGrid dx="3" dy="2" />
      </constraints>
    </point>
    <rectangle vertices="$P" name="p" />
  </graph>
  <p name="pvert">corner vertices: $p.vertex1{assignNames="v1"} $p.vertex3{assignNames="v3"}</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,4)");
    cy.get(cesc2("#/v3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,5)");

    cy.log("move rectangle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [
            [8, 9],
            [9, 9],
            [9, 10],
            [8, 10],
          ],
        },
      });
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow").should("contain.text", "(9,10)");

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,10)");
    cy.get(cesc2("#/v3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(10,11)");
  });

  it("two vertices, first vertex constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="P">(1,3)
      <constraints>
         <constrainToGrid dx="3" dy="2" />
      </constraints>
    </point>
    <point name="Q">(6,5)</point>
    <rectangle vertices="$P $Q" name="p" />
  </graph>
  <p name="pvert">corner vertices: $p.vertex1{assignNames="v1"} $p.vertex3{assignNames="v3"}</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,4)");
    cy.get(cesc2("#/v3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,5)");

    cy.log("move rectangle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [
            [-8, -9],
            [-2, -9],
            [-2, -8],
            [-8, -8],
          ],
        },
      });
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow").should("contain.text", "(−9,−8)");

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−9,−8)");
    cy.get(cesc2("#/v3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,−7)");
  });

  it("center and vertex, vertex constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="P">(1,3)
      <constraints>
         <constrainToGrid dx="3" dy="2" />
      </constraints>
    </point>
    <point name="Q">(6,5)</point>
    <rectangle vertices="$P" center="$Q" name="p" />
  </graph>
  <p name="pvert">corner vertices: $p.vertex1{assignNames="v1"} $p.vertex3{assignNames="v3"}</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,4)");
    cy.get(cesc2("#/v3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(12,6)");

    cy.log("move rectangle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [
            [-8, -9],
            [4, -9],
            [4, -7],
            [-8, -7],
          ],
        },
      });
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow").should("contain.text", "(−9,−8)");

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−9,−8)");
    cy.get(cesc2("#/v3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,−6)");
  });

  it("center and vertex, center constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <point name="P">(1,3)</point>
    <point name="Q">(6,5)
      <constraints>
        <constrainToGrid dx="3" dy="2" />
      </constraints>
    </point>
    <rectangle vertices="$P" center="$Q" name="p" />
  </graph>
  <p name="pvert">corner vertices: $p.vertex1{assignNames="v1"} $p.vertex3{assignNames="v3"}</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc2("#/v3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(11,9)");

    cy.log("move rectangle");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [
            [-9, -8],
            [1, -8],
            [1, -2],
            [-9, -2],
          ],
        },
      });
    });
    cy.get(cesc2("#/v1") + " .mjx-mrow").should("contain.text", "(−8,−7)");

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−7)");
    cy.get(cesc2("#/v3") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,−1)");
  });

  it("area and perimeter", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <rectangle name="r"/>
  </graph>
  <p>Area: <number copySource="r.area" name="area" /></p>
  <p>Perimeter: <number copySource="r.perimeter" name="perimeter" /></p>
  `,
        },
        "*",
      );
    });

    let area = 1;
    let perimeter = 4;

    cy.get(cesc2("#/area")).should("have.text", `${area}`);
    cy.get(cesc2("#/perimeter")).should(
      "have.text",
      `${Math.round(perimeter * 100) / 100}`,
    );

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/r",
        args: { pointCoords: { 1: [9, -3] } },
      });

      area = 9 * 4;
      perimeter = 2 * 9 + 2 * 4;

      cy.get(cesc2("#/area")).should("have.text", `${area}`);
      cy.get(cesc2("#/perimeter")).should(
        "have.text",
        `${Math.round(perimeter * 100) / 100}`,
      );
    });
  });
});

function setupScene({ rectangleProperties, rectangleChildren }) {
  cy.window().then(async (win) => {
    win.postMessage(
      {
        doenetML:
          `
  <text>a</text>

  <graph>
  <rectangle ` +
          rectangleProperties +
          `>
  ` +
          rectangleChildren +
          `
  </rectangle>
  </graph>

  <graph>
  <copy name="centerPoint" target="_rectangle1" prop="center"/>
  <copy name="v1" target="_rectangle1" prop="vertex1"/>
  <copy name="v2" target="_rectangle1" prop="vertex2"/>
  <copy name="v3" target="_rectangle1" prop="vertex3"/>
  <copy name="v4" target="_rectangle1" prop="vertex4"/>
  </graph>

  <mathinput bindValueTo="$(_rectangle1.width)" />
  <mathinput bindValueTo="$(_rectangle1.height)" />

  <graph name="graph3">
    <copy name="rectangleCopy" target="_rectangle1"/>
  </graph>
  
  <copy name="graph4" target="graph3" />
  `,
      },
      "*",
    );
  });
}

function runTests({ v0x, v0y, v2x, v2y, cornerDependencyState }) {
  cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

  cy.window().then(async (win) => {
    let stateVariables = await win.returnAllStateVariables1();

    let rectangleName = "/_rectangle1";
    let centerPointName =
      stateVariables["/centerPoint"].replacements[0].componentName;
    let v0Name = stateVariables["/v1"].replacements[0].componentName;
    let v1Name = stateVariables["/v2"].replacements[0].componentName;
    let v2Name = stateVariables["/v3"].replacements[0].componentName;
    let v3Name = stateVariables["/v4"].replacements[0].componentName;
    let rectangleCopyName =
      stateVariables["/rectangleCopy"].replacements[0].componentName;
    let rectangleCopy2Name =
      stateVariables[stateVariables["/graph4"].replacements[0].componentName]
        .activeChildren[0].componentName;
    let widthInputName = "/_mathinput1";
    let heightInputName = "/_mathinput2";

    let inputs = {
      rectangleNames: [rectangleName, rectangleCopyName, rectangleCopy2Name],
      vertexNames: [v0Name, v1Name, v2Name, v3Name],
      widthInputName,
      heightInputName,
      centerPointName,
    };

    cy.window().then(async (win) => {
      checkRectangleValues(
        inputs,
        {
          v0x,
          v0y,
          v2x,
          v2y,
        },
        stateVariables,
      );
    });

    cy.log("move rectangle points individually");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleName,
        args: {
          pointCoords: { 0: [2, -1] },
        },
      });

      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: -1,
          v2x,
          v2y,
        },
        stateVariables,
      );

      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleName,
        args: {
          pointCoords: { 1: [0, 2] },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: 0,
          v2y,
        },
        stateVariables,
      );

      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleName,
        args: {
          pointCoords: { 2: [-4, -5] },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: -4,
          v2y: -5,
        },
        stateVariables,
      );

      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleName,
        args: {
          pointCoords: { 3: [3, 4] },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 3,
          v0y: 2,
          v2x: -4,
          v2y: 4,
        },
        stateVariables,
      );
    });

    cy.log("move rectangle points together");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleName,
        args: {
          pointCoords: {
            0: [4, 3],
            1: [-3, 3],
            2: [-3, 5],
            3: [4, 5],
          },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 4,
          v0y: 3,
          v2x: -3,
          v2y: 5,
        },
        stateVariables,
      );
    });

    cy.log("move center point");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: centerPointName,
        args: { x: 0, y: 0 },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 3.5,
          v0y: -1,
          v2x: -3.5,
          v2y: 1,
        },
        stateVariables,
      );
    });

    cy.log("move copied vertices");
    cy.window().then(async (win) => {
      if (cornerDependencyState === 0) {
        // natural behaviour

        await win.callAction1({
          actionName: "movePoint",
          componentName: v0Name,
          args: { x: 0, y: 0 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: 0,
            v2x: -3.5,
            v2y: 1,
          },
          stateVariables,
        );

        await win.callAction1({
          actionName: "movePoint",
          componentName: v1Name,
          args: { x: 1, y: -1 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 1,
            v2y: 1,
          },
          stateVariables,
        );

        await win.callAction1({
          actionName: "movePoint",
          componentName: v2Name,
          args: { x: 2.25, y: 2.25 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 2.25,
            v2y: 2.25,
          },
          stateVariables,
        );

        await win.callAction1({
          actionName: "movePoint",
          componentName: v3Name,
          args: { x: -1, y: -5 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: -1,
            v0y: -1,
            v2x: 2.25,
            v2y: -5,
          },
          stateVariables,
        );
      } else if (cornerDependencyState === 1) {
        // corner, width and height

        await win.callAction1({
          actionName: "movePoint",
          componentName: v0Name,
          args: { x: 0, y: 0 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: 0,
            v2x: -7,
            v2y: 2,
          },
          stateVariables,
        );

        await win.callAction1({
          actionName: "movePoint",
          componentName: v1Name,
          args: { x: 1, y: -1 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 1,
            v2y: 1,
          },
          stateVariables,
        );

        await win.callAction1({
          actionName: "movePoint",
          componentName: v2Name,
          args: { x: 2.25, y: 2.25 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 2.25,
            v2y: 2.25,
          },
          stateVariables,
        );

        await win.callAction1({
          actionName: "movePoint",
          componentName: v3Name,
          args: { x: -1, y: -5 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: -1,
            v0y: -1,
            v2x: 1.25,
            v2y: -5,
          },
          stateVariables,
        );
      } else if (cornerDependencyState === 2) {
        //TODO: corner and center

        await win.callAction1({
          actionName: "movePoint",
          componentName: v0Name,
          args: { x: 0, y: 0 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: 0,
            v2x: 0,
            v2y: 0,
          },
          stateVariables,
        );

        await win.callAction1({
          actionName: "movePoint",
          componentName: v1Name,
          args: { x: 1, y: -1 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 1,
            v2y: 1,
          },
          stateVariables,
        );

        await win.callAction1({
          actionName: "movePoint",
          componentName: v2Name,
          args: { x: 2.25, y: 2.25 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 2.25,
            v2y: 2.25,
          },
          stateVariables,
        );

        await win.callAction1({
          actionName: "movePoint",
          componentName: v3Name,
          args: { x: -1, y: -5 },
        });
        stateVariables = await win.returnAllStateVariables1();
        checkRectangleValues(
          inputs,
          {
            v0x: -1,
            v0y: -1,
            v2x: 3.25,
            v2y: -5,
          },
          stateVariables,
        );
      }
    });

    cy.log("rectangleCopy together");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleCopyName,
        args: {
          pointCoords: {
            0: [0, 0],
            1: [1, 0],
            2: [1, 1],
            3: [0, 1],
          },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 0,
          v0y: 0,
          v2x: 1,
          v2y: 1,
        },
        stateVariables,
      );
    });

    cy.log("rectangleCopy individually");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleCopyName,
        args: {
          pointCoords: { 0: [2, -1] },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: -1,
          v2x: 1,
          v2y: 1,
        },
        stateVariables,
      );

      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleCopyName,
        args: {
          pointCoords: { 1: [0, 2] },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: 0,
          v2y: 1,
        },
        stateVariables,
      );

      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleCopyName,
        args: {
          pointCoords: { 2: [-4, -5] },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: -4,
          v2y: -5,
        },
        stateVariables,
      );

      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleCopyName,
        args: {
          pointCoords: { 3: [3, 4] },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 3,
          v0y: 2,
          v2x: -4,
          v2y: 4,
        },
        stateVariables,
      );
    });

    cy.log("rectangleCopy2 together");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleCopy2Name,
        args: {
          pointCoords: {
            0: [0, 0],
            1: [1, 0],
            2: [1, 1],
            3: [0, 1],
          },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 0,
          v0y: 0,
          v2x: 1,
          v2y: 1,
        },
        stateVariables,
      );
    });

    cy.log("rectangleCopy2 individually");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleCopy2Name,
        args: {
          pointCoords: { 0: [2, -1] },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: -1,
          v2x: 1,
          v2y: 1,
        },
        stateVariables,
      );

      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleCopy2Name,
        args: {
          pointCoords: { 1: [0, 2] },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: 0,
          v2y: 1,
        },
        stateVariables,
      );

      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleCopy2Name,
        args: {
          pointCoords: { 2: [-4, -5] },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: -4,
          v2y: -5,
        },
        stateVariables,
      );

      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleCopy2Name,
        args: {
          pointCoords: { 3: [3, 4] },
        },
      });
      stateVariables = await win.returnAllStateVariables1();
      checkRectangleValues(
        inputs,
        {
          v0x: 3,
          v0y: 2,
          v2x: -4,
          v2y: 4,
        },
        stateVariables,
      );

      // reset polygon
      await win.callAction1({
        actionName: "movePolygon",
        componentName: rectangleName,
        args: {
          pointCoords: {
            0: [0, 0],
            1: [1, 0],
            2: [1, 1],
            3: [0, 1],
          },
        },
      });
    });
  });
}

function checkRectangleValues(
  {
    rectangleNames,
    vertexNames,
    widthInputName,
    heightInputName,
    centerPointName,
  },
  { v0x, v0y, v2x, v2y },
  stateVariables,
) {
  let vertexCoords = [
    [v0x, v0y],
    [v2x, v0y],
    [v2x, v2y],
    [v0x, v2y],
  ];
  let centerCoords = [(v0x + v2x) / 2, (v0y + v2y) / 2];
  let widthValue = Math.abs(v2x - v0x);
  let heightValue = Math.abs(v2y - v0y);

  for (let rectangleName of rectangleNames) {
    let rectangle = stateVariables[rectangleName];
    expect(
      rectangle.stateValues.vertices.map((x) =>
        x.map((y) => me.fromAst(y).evaluate_to_constant()),
      ),
    ).eqls(vertexCoords);
    expect(
      rectangle.stateValues.center.map((x) =>
        me.fromAst(x).evaluate_to_constant(),
      ),
    ).eqls(centerCoords);
    expect(rectangle.stateValues.width).eq(widthValue);
    expect(rectangle.stateValues.height).eq(heightValue);
  }

  if (vertexNames) {
    for (let [index, vertexName] of vertexNames.entries()) {
      let vertex = stateVariables[vertexName];
      expect(
        vertex.stateValues.xs.map((x) => me.fromAst(x).evaluate_to_constant()),
      ).eqls(vertexCoords[index]);
    }
  }

  if (centerPointName) {
    let centerPoint = stateVariables[centerPointName];
    expect(
      centerPoint.stateValues.xs.map((x) =>
        me.fromAst(x).evaluate_to_constant(),
      ),
    ).eqls(centerCoords);
  }
  // expect(widthInput.stateValues.value.tree).eq(widthValue);
  // expect(heightInput.stateValues.value.tree).eq(heightValue);
}
