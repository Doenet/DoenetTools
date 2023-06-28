import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

async function testLineSegmentCopiedTwice({
  x1,
  y1,
  x2,
  y2,
  lineSegmentName = "/ls",
  graph1Name = "/g1",
  graph2Name = "/g2",
  graph3Name = "/g3",
  point1InDomName = "/p1",
  point2InDomName = "/p2",
}) {
  cy.get(`#${cesc2(point1InDomName)} .mjx-mrow`).should(
    "contain.text",
    `(${nInDOM(x1)},${nInDOM(y1)})`,
  );
  cy.get(`#${cesc2(point2InDomName)} .mjx-mrow`).should(
    "contain.text",
    `(${nInDOM(x2)},${nInDOM(y2)})`,
  );

  cy.window().then(async (win) => {
    let stateVariables = await win.returnAllStateVariables1();
    expect(
      stateVariables[graph1Name + lineSegmentName].stateValues.endpoints[0],
    ).eqls([x1, y1]);
    expect(
      stateVariables[graph1Name + lineSegmentName].stateValues.endpoints[1],
    ).eqls([x2, y2]);
    expect(
      stateVariables[graph2Name + lineSegmentName].stateValues.endpoints[0],
    ).eqls([x1, y1]);
    expect(
      stateVariables[graph2Name + lineSegmentName].stateValues.endpoints[1],
    ).eqls([x2, y2]);
    expect(
      stateVariables[graph3Name + lineSegmentName].stateValues.endpoints[0],
    ).eqls([x1, y1]);
    expect(
      stateVariables[graph3Name + lineSegmentName].stateValues.endpoints[1],
    ).eqls([x2, y2]);
  });
}

async function testLineSegmentCopiedTwiceWithEndpoints({
  x1,
  y1,
  x2,
  y2,
  lineSegmentName = "/ls",
  endpoint1Name = "/A",
  endpoint2Name = "/B",
  graph1Name = "/g1",
  graph2Name = "/g2",
  graph3Name = "/g3",
  point1InDomName = "/p1",
  point2InDomName = "/p2",
}) {
  cy.get(`#${cesc2(point1InDomName)} .mjx-mrow`).should(
    "contain.text",
    `(${nInDOM(x1)},${nInDOM(y1)})`,
  );
  cy.get(`#${cesc2(point2InDomName)} .mjx-mrow`).should(
    "contain.text",
    `(${nInDOM(x2)},${nInDOM(y2)})`,
  );

  cy.window().then(async (win) => {
    let stateVariables = await win.returnAllStateVariables1();
    expect(
      stateVariables[graph1Name + lineSegmentName].stateValues.endpoints[0],
    ).eqls([x1, y1]);
    expect(
      stateVariables[graph1Name + lineSegmentName].stateValues.endpoints[1],
    ).eqls([x2, y2]);
    expect(
      stateVariables[graph2Name + lineSegmentName].stateValues.endpoints[0],
    ).eqls([x1, y1]);
    expect(
      stateVariables[graph2Name + lineSegmentName].stateValues.endpoints[1],
    ).eqls([x2, y2]);
    expect(
      stateVariables[graph3Name + lineSegmentName].stateValues.endpoints[0],
    ).eqls([x1, y1]);
    expect(
      stateVariables[graph3Name + lineSegmentName].stateValues.endpoints[1],
    ).eqls([x2, y2]);
    expect(stateVariables[graph1Name + endpoint1Name].stateValues.coords).eqls([
      "vector",
      x1,
      y1,
    ]);
    expect(stateVariables[graph1Name + endpoint2Name].stateValues.coords).eqls([
      "vector",
      x2,
      y2,
    ]);
    expect(stateVariables[graph2Name + endpoint1Name].stateValues.coords).eqls([
      "vector",
      x1,
      y1,
    ]);
    expect(stateVariables[graph2Name + endpoint2Name].stateValues.coords).eqls([
      "vector",
      x2,
      y2,
    ]);
    expect(stateVariables[graph3Name + endpoint1Name].stateValues.coords).eqls([
      "vector",
      x1,
      y1,
    ]);
    expect(stateVariables[graph3Name + endpoint2Name].stateValues.coords).eqls([
      "vector",
      x2,
      y2,
    ]);
  });
}

describe("LineSegment Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("lineSegment with no arguments", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <lineSegment name="ls"/>
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="ls" target="../g1/ls" />
  </graph>

  <copy assignNames="g3" target="g2" />

  <copy prop="endpoint1" target="g1/ls" assignNames="p1" />
  <copy prop="endpoint2" target="g1/ls" assignNames="p2" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 1,
      y1 = 0;
    let x2 = 0,
      y2 = 0;

    testLineSegmentCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move original first point");
    cy.window().then(async (win) => {
      x1 = 3;
      y1 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = -7;
      y2 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied first point");
    cy.window().then(async (win) => {
      x1 = 6;
      y1 = 0;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = 9;
      y2 = -8;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied first point");
    cy.window().then(async (win) => {
      x1 = -5;
      y1 = 7;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied second point");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = 3;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("lineSegment with empty endpoints", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <lineSegment name="ls" endpoints="" />
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="ls" target="../g1/ls" />
  </graph>

  <copy assignNames="g3" target="g2" />

  <copy prop="endpoint1" target="g1/ls" assignNames="p1" />
  <copy prop="endpoint2" target="g1/ls" assignNames="p2" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 1,
      y1 = 0;
    let x2 = 0,
      y2 = 0;

    testLineSegmentCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move original first point");
    cy.window().then(async (win) => {
      x1 = 3;
      y1 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = -7;
      y2 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied first point");
    cy.window().then(async (win) => {
      x1 = 6;
      y1 = 0;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = 9;
      y2 = -8;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied first point");
    cy.window().then(async (win) => {
      x1 = -5;
      y1 = 7;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied second point");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = 3;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("lineSegment with one point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <lineSegment  endpoints="(3,-8)" name="ls"/>
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="ls" target="../g1/ls" />
  </graph>

  <copy assignNames="g3" target="g2" />

  <copy prop="endpoint1" target="g1/ls" assignNames="p1" />
  <copy prop="endpoint2" target="g1/ls" assignNames="p2" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 3,
      y1 = -8;
    let x2 = 0,
      y2 = 0;

    testLineSegmentCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move original first point");
    cy.window().then(async (win) => {
      x1 = 3;
      y1 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = -7;
      y2 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied first point");
    cy.window().then(async (win) => {
      x1 = 6;
      y1 = 0;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = 9;
      y2 = -8;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied first point");
    cy.window().then(async (win) => {
      x1 = -5;
      y1 = 7;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied second point");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = 3;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("lineSegment with one point - the origin", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <lineSegment  endpoints="(0,0)" name="ls"/>
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="ls" target="../g1/ls" />
  </graph>

  <copy assignNames="g3" target="g2" />

  <copy prop="endpoint1" target="g1/ls" assignNames="p1" />
  <copy prop="endpoint2" target="g1/ls" assignNames="p2" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 0,
      y1 = 0;
    let x2 = 0,
      y2 = 0;

    testLineSegmentCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move original first point");
    cy.window().then(async (win) => {
      x1 = 3;
      y1 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = -7;
      y2 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied first point");
    cy.window().then(async (win) => {
      x1 = 6;
      y1 = 0;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = 9;
      y2 = -8;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied first point");
    cy.window().then(async (win) => {
      x1 = -5;
      y1 = 7;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied second point");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = 3;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("lineSegment with copied points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <point labelIsName name="A">(3,5)</point>
    <point labelIsName name="B">(-4,-1)</point>
    <lineSegment endpoints="$A $B" name="ls"/>
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="ls" target="../g1/ls" />
    <copy prop="endpoint1" target="ls" assignNames="A" />
    <copy prop="endpoint2" target="ls" assignNames="B" />
  </graph>

  <copy assignNames="g3" target="g2" />

  <copy prop="endpoint1" target="g1/ls" assignNames="p1" />
  <copy prop="endpoint2" target="g1/ls" assignNames="p2" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 3,
      y1 = 5;
    let x2 = -4,
      y2 = -1;

    testLineSegmentCopiedTwiceWithEndpoints({ x1, y1, x2, y2 });

    cy.log("move point A to (5,-5)");
    cy.window().then(async (win) => {
      x1 = 5;
      y1 = -5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x1, y: y1 },
      });

      testLineSegmentCopiedTwiceWithEndpoints({ x1, y1, x2, y2 });
    });

    cy.log("move line segment up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;

      x1 += moveX;
      x2 += moveX;
      y1 += moveY;
      y2 += moveY;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point1coords: [x1, y1],
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwiceWithEndpoints({ x1, y1, x2, y2 });
    });

    cy.log("move second copy of B to (-1,8)");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = 8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });

      testLineSegmentCopiedTwiceWithEndpoints({ x1, y1, x2, y2 });
    });
  });

  it("lineSegment with endpoints containing sugared string", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <lineSegment  endpoints="(3,5) (-4,9)" name="ls"/>
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="ls" target="../g1/ls" />
  </graph>

  <copy assignNames="g3" target="g2" />

  <copy prop="endpoint1" target="g1/ls" assignNames="p1" />
  <copy prop="endpoint2" target="g1/ls" assignNames="p2" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 3,
      y1 = 5;
    let x2 = -4,
      y2 = 9;

    testLineSegmentCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move original first point");
    cy.window().then(async (win) => {
      x1 = 3;
      y1 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = -7;
      y2 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied first point");
    cy.window().then(async (win) => {
      x1 = 6;
      y1 = 0;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = 9;
      y2 = -8;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied first point");
    cy.window().then(async (win) => {
      x1 = -5;
      y1 = 7;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied second point");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = 3;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("lineSegment with strings and copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <number>3</number>
  <graph>
  <linesegment />
  </graph>
  <graph name="g1" newNamespace>
    <point>(-2,1)</point>
    <lineSegment endpoints="($(../_number1), $(_point1.x)) ($(_point1.y),5)"  name="ls"/>
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="ls" target="../g1/ls" />
  </graph>

  <copy assignNames="g3" target="g2" />

  <copy prop="endpoint1" target="g1/ls" assignNames="p1" />
  <copy prop="endpoint2" target="g1/ls" assignNames="p2" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 3,
      y1 = -2;
    let x2 = 1,
      y2 = 5;

    testLineSegmentCopiedTwice({ x1, y1, x2, y2 });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g1/_point1"].stateValues.xs).eqls([-2, 1]);
      expect(stateVariables["/_number1"].stateValues.value).eq(3);
    });

    cy.log("move original first point");
    cy.window().then(async (win) => {
      x1 = 3;
      y1 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = -7;
      y2 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied first point");
    cy.window().then(async (win) => {
      x1 = 6;
      y1 = 0;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = 9;
      y2 = -8;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied first point");
    cy.window().then(async (win) => {
      x1 = -5;
      y1 = 7;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied second point");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = 3;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("lineSegment with multiple layers of copied points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <point>(2,1)</point>
  <point>(-2,-5)</point>
  <copy target="_point1" />
  <copy target="_point2" />
  <copy target="_copy1" />
  <copy target="_copy2" />
  <copy target="_copy3" />
  <copy target="_copy4" />
  
  <graph name="g1" newNamespace>
    <lineSegment  endpoints="$(../_copy5) $(../_copy6)" name="ls"/>
  </graph>

  <graph name="g2" newNamespace>
    <copy assignNames="ls" target="../g1/ls" />
  </graph>

  <copy assignNames="g3" target="g2" />

  <copy prop="endpoint1" target="g1/ls" assignNames="p1" />
  <copy prop="endpoint2" target="g1/ls" assignNames="p2" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 2,
      y1 = 1;
    let x2 = -2,
      y2 = -5;

    testLineSegmentCopiedTwice({ x1, y1, x2, y2 });

    cy.log("move original first point");
    cy.window().then(async (win) => {
      x1 = 3;
      y1 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = -7;
      y2 = -5;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied first point");
    cy.window().then(async (win) => {
      x1 = 6;
      y1 = 0;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move copied second point");
    cy.window().then(async (win) => {
      x2 = 9;
      y2 = -8;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied first point");
    cy.window().then(async (win) => {
      x1 = -5;
      y1 = 7;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point1coords: [x1, y1],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });

    cy.log("move double copied second point");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = 3;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/ls",
        args: {
          point2coords: [x2, y2],
        },
      });

      testLineSegmentCopiedTwice({ x1, y1, x2, y2 });
    });
  });

  it("initially non-numeric point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="x" prefill="q"/>
  <graph>
    <lineSegment endpoints="($x,2) (-2,3)" />
  </graph>
  <copy prop="endpoint1" target="_linesegment1" assignNames="p1" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("check initial values");
    cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", "(q,2)");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
        "q",
        2,
      ]);
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
        -2, 3,
      ]);
    });

    cy.log("change point to be numeric");
    cy.get(cesc("#\\/x") + " textarea").type("{end}{backspace}5{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", "(5,2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
        5, 2,
      ]);
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
        -2, 3,
      ]);
    });
  });

  it("linesegment with one endpoint, copy and overwrite the point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <linesegment endpoints="(-5,9)" name="l" />
    <copy prop="endpoint1" target="l" assignNames="A" />
    <copy prop="endpoint2" target="l" assignNames="B" />
  </graph>

  <graph newNamespace name="g2">
    <copy target="../g1/l" assignNames="l" endpoints="(4,-2)" />
    <copy prop="endpoint1" target="l" assignNames="A" />
    <copy prop="endpoint2" target="l" assignNames="B" />  
  </graph>

  <graph newNamespace name="g3">
    <copy target="../g2/l" assignNames="l" />
    <copy prop="endpoint1" target="l" assignNames="A" />
    <copy prop="endpoint2" target="l" assignNames="B" />  
  </graph>

  <graph newNamespace name="g4">
    <copy target="../g2/_copy1" assignNames="l" />
    <copy prop="endpoint1" target="l" assignNames="A" />
    <copy prop="endpoint2" target="l" assignNames="B" />  
  </graph>

  <copy target="g2" assignNames="g5" />

  <copy prop="endpointX1_1" target="g1/l" assignNames="x11" />
  <copy prop="endpointX1_2" target="g1/l" assignNames="y11" />
  <copy prop="endpointX2_1" target="g1/l" assignNames="x2" />
  <copy prop="endpointX2_2" target="g1/l" assignNames="y2" />
  <copy prop="endpointX1_1" target="g2/l" assignNames="x12" />
  <copy prop="endpointX1_2" target="g2/l" assignNames="y12" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    async function checkLineSegments({ x11, y11, x12, y12, x2, y2 }) {
      cy.get(cesc("#\\/x11") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x11).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y11") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y11).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/x2") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x2).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y2") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y2).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/x12") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x12).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y12") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y12).substring(0, 6)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.endpoints[0][0])
            .evaluate_to_constant(),
        ).closeTo(x11, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.endpoints[0][1])
            .evaluate_to_constant(),
        ).closeTo(y11, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.endpoints[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.endpoints[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.endpoints[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.endpoints[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.endpoints[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.endpoints[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.endpoints[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.endpoints[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.endpoints[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.endpoints[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.endpoints[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.endpoints[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.endpoints[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.endpoints[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.endpoints[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.endpoints[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.endpoints[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.endpoints[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(stateVariables["/g1/A"].stateValues.xs[0]).closeTo(x11, 1e-12);
        expect(stateVariables["/g1/A"].stateValues.xs[1]).closeTo(y11, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g2/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g2/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g3/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g3/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g4/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g4/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g5/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g5/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[1]).closeTo(y2, 1e-12);
      });
    }

    let x11 = -5,
      y11 = 9;
    let x12 = 4,
      y12 = -2;
    let x2 = 0,
      y2 = 0;

    cy.window().then(async (win) => {
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/A");
    cy.window().then(async (win) => {
      x11 = 7;
      y11 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x11, y: y11 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g1/l");
    cy.window().then(async (win) => {
      x11 = 5;
      y11 = 3;
      x2 = -7;
      y2 = -8;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/l",
        args: {
          point1coords: [x11, y11],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/A");
    cy.window().then(async (win) => {
      x12 = -1;
      y12 = 0;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g2/l");
    cy.window().then(async (win) => {
      x12 = 10;
      y12 = 9;
      x2 = 8;
      y2 = 7;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });

      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/A");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/B");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g3/l");
    cy.window().then(async (win) => {
      x12 = 0;
      y12 = -1;
      x2 = 2;
      y2 = -3;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/A");
    cy.window().then(async (win) => {
      x12 = 9;
      y12 = 8;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -9;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g4/l");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 4;
      x2 = -5;
      y2 = 6;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g4/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/A");
    cy.window().then(async (win) => {
      x12 = 1;
      y12 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/B");
    cy.window().then(async (win) => {
      x2 = 0;
      y2 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g5/l");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      x12 = 4;
      y12 = 5;
      x2 = -6;
      y2 = -7;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g5/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });
  });

  it("linesegment with one endpoint, copy and overwrite the point, swap linesegment", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <booleaninput name="b" />
  <graph name="g1" newNamespace>
  <conditionalContent assignNames="(l)">
    <case condition="$(../b)" >
      <linesegment endpoints="(1,2)" />
    </case>
    <else>
      <linesegment endpoints="(-5,9)" />
    </else>
  </conditionalContent>
    <copy prop="endpoint1" target="l" assignNames="A" />
    <copy prop="endpoint2" target="l" assignNames="B" />
  </graph>

  <graph newNamespace name="g2">
    <copy target="../g1/l" assignNames="l" endpoints="(4,-2)" />
    <copy prop="endpoint1" target="l" assignNames="A" />
    <copy prop="endpoint2" target="l" assignNames="B" />  
  </graph>

  <graph newNamespace name="g3">
    <copy target="../g2/l" assignNames="l" />
    <copy prop="endpoint1" target="l" assignNames="A" />
    <copy prop="endpoint2" target="l" assignNames="B" />  
  </graph>

  <graph newNamespace name="g4">
    <copy target="../g2/_copy1" assignNames="l" />
    <copy prop="endpoint1" target="l" assignNames="A" />
    <copy prop="endpoint2" target="l" assignNames="B" />  
  </graph>

  <copy target="g2" assignNames="g5" />

  <copy prop="endpointX1_1" target="g1/l" assignNames="x11" />
  <copy prop="endpointX1_2" target="g1/l" assignNames="y11" />
  <copy prop="endpointX2_1" target="g1/l" assignNames="x2" />
  <copy prop="endpointX2_2" target="g1/l" assignNames="y2" />
  <copy prop="endpointX1_1" target="g2/l" assignNames="x12" />
  <copy prop="endpointX1_2" target="g2/l" assignNames="y12" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    async function checkLineSegments({ x11, y11, x12, y12, x2, y2 }) {
      cy.get(cesc("#\\/x11") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x11).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y11") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y11).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/x2") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x2).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y2") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y2).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/x12") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(x12).substring(0, 6)}`,
      );
      cy.get(cesc("#\\/y12") + " .mjx-mrow").should(
        "contain.text",
        `${nInDOM(y12).substring(0, 6)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.endpoints[0][0])
            .evaluate_to_constant(),
        ).closeTo(x11, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.endpoints[0][1])
            .evaluate_to_constant(),
        ).closeTo(y11, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.endpoints[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g1/l"].stateValues.endpoints[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.endpoints[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.endpoints[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.endpoints[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g2/l"].stateValues.endpoints[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.endpoints[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.endpoints[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.endpoints[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g3/l"].stateValues.endpoints[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.endpoints[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.endpoints[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.endpoints[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g4/l"].stateValues.endpoints[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.endpoints[0][0])
            .evaluate_to_constant(),
        ).closeTo(x12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.endpoints[0][1])
            .evaluate_to_constant(),
        ).closeTo(y12, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.endpoints[1][0])
            .evaluate_to_constant(),
        ).closeTo(x2, 1e-12);
        expect(
          me
            .fromAst(stateVariables["/g5/l"].stateValues.endpoints[1][1])
            .evaluate_to_constant(),
        ).closeTo(y2, 1e-12);

        expect(stateVariables["/g1/A"].stateValues.xs[0]).closeTo(x11, 1e-12);
        expect(stateVariables["/g1/A"].stateValues.xs[1]).closeTo(y11, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g1/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g2/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g2/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g2/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g3/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g3/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g3/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g4/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g4/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g4/B"].stateValues.xs[1]).closeTo(y2, 1e-12);

        expect(stateVariables["/g5/A"].stateValues.xs[0]).closeTo(x12, 1e-12);
        expect(stateVariables["/g5/A"].stateValues.xs[1]).closeTo(y12, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[0]).closeTo(x2, 1e-12);
        expect(stateVariables["/g5/B"].stateValues.xs[1]).closeTo(y2, 1e-12);
      });
    }

    let x11 = -5,
      y11 = 9;
    let x12 = 4,
      y12 = -2;
    let x2 = 0,
      y2 = 0;

    cy.window().then(async (win) => {
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/A");
    cy.window().then(async (win) => {
      x11 = 7;
      y11 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x11, y: y11 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g1/l");
    cy.window().then(async (win) => {
      x11 = 5;
      y11 = 3;
      x2 = -7;
      y2 = -8;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/l",
        args: {
          point1coords: [x11, y11],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/A");
    cy.window().then(async (win) => {
      x12 = -1;
      y12 = 0;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g2/l");
    cy.window().then(async (win) => {
      x12 = 10;
      y12 = 9;
      x2 = 8;
      y2 = 7;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/A");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/B");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g3/l");
    cy.window().then(async (win) => {
      x12 = 0;
      y12 = -1;
      x2 = 2;
      y2 = -3;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/A");
    cy.window().then(async (win) => {
      x12 = 9;
      y12 = 8;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -9;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g4/l");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 4;
      x2 = -5;
      y2 = 6;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g4/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/A");
    cy.window().then(async (win) => {
      x12 = 1;
      y12 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/B");
    cy.window().then(async (win) => {
      x2 = 0;
      y2 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g5/l");
    cy.window().then(async (win) => {
      x12 = 4;
      y12 = 5;
      x2 = -6;
      y2 = -7;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g5/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.get(cesc("#\\/b_input")).check({ force: true });

    cy.window().then(async (win) => {
      (x11 = 1), (y11 = 2);
      (x12 = 4), (y12 = -2);
      (x2 = 0), (y2 = 0);

      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/A");
    cy.window().then(async (win) => {
      x11 = 7;
      y11 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/A",
        args: { x: x11, y: y11 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g1/B");
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g1/l");
    cy.window().then(async (win) => {
      x11 = 5;
      y11 = 3;
      x2 = -7;
      y2 = -8;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g1/l",
        args: {
          point1coords: [x11, y11],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/A");
    cy.window().then(async (win) => {
      x12 = -1;
      y12 = 0;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g2/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -6;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g2/l");
    cy.window().then(async (win) => {
      x12 = 10;
      y12 = 9;
      x2 = 8;
      y2 = 7;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g2/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/A");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g3/B");
    cy.window().then(async (win) => {
      x2 = -8;
      y2 = -4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g3/l");
    cy.window().then(async (win) => {
      x12 = 0;
      y12 = -1;
      x2 = 2;
      y2 = -3;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g3/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/A");
    cy.window().then(async (win) => {
      x12 = 9;
      y12 = 8;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g4/B");
    cy.window().then(async (win) => {
      x2 = 6;
      y2 = -9;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g4/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g4/l");
    cy.window().then(async (win) => {
      x12 = -3;
      y12 = 4;
      x2 = -5;
      y2 = 6;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g4/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/A");
    cy.window().then(async (win) => {
      x12 = 1;
      y12 = -3;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/A",
        args: { x: x12, y: y12 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move point g5/B");
    cy.window().then(async (win) => {
      x2 = 0;
      y2 = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g5/B",
        args: { x: x2, y: y2 },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });

    cy.log("move line g5/l");
    cy.window().then(async (win) => {
      x12 = 4;
      y12 = 5;
      x2 = -6;
      y2 = -7;
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/g5/l",
        args: {
          point1coords: [x12, y12],
          point2coords: [x2, y2],
        },
      });
      await checkLineSegments({ x11, y11, x12, y12, x2, y2 });
    });
  });

  it("constrain to linesegment", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <linesegment endpoints="$_point1 $_point2" />

  <point x="-5" y="2">
    <constraints>
      <constrainTo><copy target="_linesegment1" /></constrainTo>
    </constraints>
  </point>
  </graph>
  <copy target="_linesegment1" prop="endpoint1" assignNames="ep1a" />
  <copy target="_point3" assignNames="p3a" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("check initial values");

    cy.get(cesc("#\\/ep1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(1)},${nInDOM(2)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
        1, 2,
      ]);
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
        3, 4,
      ]);
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(2);
    });

    cy.log("move line segment to 45 degrees");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/_linesegment1",
        args: {
          point1coords: [-4, 4],
          point2coords: [4, -4],
        },
      });

      cy.get(cesc("#\\/ep1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-4)},${nInDOM(4)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          -4, 4,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          4, -4,
        ]);

        let xorig = -5;
        let yorig = 2;
        let temp = (xorig - yorig) / 2;
        if (temp > 4) {
          temp = 4;
        } else if (temp < -4) {
          temp = -4;
        }
        let p5x = temp;
        let p5y = -temp;

        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          p5x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          p5y,
          1e-12,
        );
      });
    });

    cy.log("move point");
    cy.window().then(async (win) => {
      let xorig = 10;
      let yorig = 1;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig },
      });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get(cesc("#\\/p3a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p5x)},${nInDOM(p5y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          p5x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          p5y,
          1e-12,
        );
      });
    });

    cy.log("move point");
    cy.window().then(async (win) => {
      let xorig = 9;
      let yorig = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig },
      });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get(cesc("#\\/p3a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p5x)},${nInDOM(p5y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          p5x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          p5y,
          1e-12,
        );
      });
    });

    cy.log("move point");
    cy.window().then(async (win) => {
      let xorig = -9;
      let yorig = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig },
      });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get(cesc("#\\/p3a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p5x)},${nInDOM(p5y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          p5x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          p5y,
          1e-12,
        );
      });
    });
  });

  it("attract to linesegment", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <linesegment endpoints="$_point1 $_point2" />

  <point x="-5" y="2">
    <constraints>
      <attractTo><copy target="_linesegment1" /></attractTo>
    </constraints>
  </point>
  </graph>
  <copy target="_linesegment1" prop="endpoint1" assignNames="ep1a" />
  <copy target="_point3" assignNames="p3a" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.log("check initial values");

    cy.get(cesc("#\\/ep1a") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(1)},${nInDOM(2)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
        1, 2,
      ]);
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
        3, 4,
      ]);
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(-5);
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(2);
    });

    cy.log("move line segment to 45 degrees");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/_linesegment1",
        args: {
          point1coords: [-4, 4],
          point2coords: [4, -4],
        },
      });

      cy.get(cesc("#\\/ep1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-4)},${nInDOM(4)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          -4, 4,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          4, -4,
        ]);
        expect(stateVariables["/_point3"].stateValues.xs[0]).eq(-5);
        expect(stateVariables["/_point3"].stateValues.xs[1]).eq(2);
      });
    });

    cy.log("move point");
    cy.window().then(async (win) => {
      let xorig = 3.3;
      let yorig = -3.6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig },
      });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get(cesc("#\\/p3a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p5x)},${nInDOM(p5y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          p5x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          p5y,
          1e-12,
        );
      });
    });

    cy.log("move point");
    cy.window().then(async (win) => {
      let xorig = 4.3;
      let yorig = -4.6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig },
      });

      cy.get(cesc("#\\/p3a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(xorig)},${nInDOM(yorig)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          4.3,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          -4.6,
          1e-12,
        );
      });
    });

    cy.log("move point");
    cy.window().then(async (win) => {
      let xorig = -2.4;
      let yorig = 2.8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig },
      });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get(cesc("#\\/p3a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(p5x * 1000) / 1000)},${nInDOM(
          Math.round(p5y * 1000) / 1000,
        )})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          p5x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          p5y,
          1e-12,
        );
      });
    });

    cy.log("move point");
    cy.window().then(async (win) => {
      let xorig = -4.2;
      let yorig = 4.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig },
      });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get(cesc("#\\/p3a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p5x)},${nInDOM(p5y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          p5x,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          p5y,
          1e-12,
        );
      });
    });
  });

  it("constrain to linesegment, different scales from graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <linesegment endpoints="(-1,-0.05) (1,0.05)" name="l" />
    <point x="100" y="0" name="P">
      <constraints>
        <constrainTo relativeToGraphScales><copy target="l" /></constrainTo>
      </constraints>
    </point>
  </graph>
  <copy target="P" assignNames="P1a" />
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`point on line segment, close to origin`);

    cy.get(cesc("#\\/P1a") + " .mjx-mrow").should("contain.text", ",0.00");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/P"].stateValues.xs[0];
      let y = stateVariables["/P"].stateValues.xs[1];

      expect(y).greaterThan(0);
      expect(y).lessThan(0.01);

      expect(x).closeTo(20 * y, 1e-10);
    });

    cy.log(`move point`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -100, y: 0.05 },
      });

      cy.get(cesc("#\\/P1a") + " .mjx-mrow").should("contain.text", ",0.04");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let x = stateVariables["/P"].stateValues.xs[0];
        let y = stateVariables["/P"].stateValues.xs[1];
        expect(y).lessThan(0.05);
        expect(y).greaterThan(0.04);
        expect(x).closeTo(20 * y, 1e-10);
      });
    });

    cy.log(`move point past endpoint`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -100, y: 0.1 },
      });

      cy.get(cesc("#\\/P1a") + " .mjx-mrow").should("contain.text", ",0.05");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let x = stateVariables["/P"].stateValues.xs[0];
        let y = stateVariables["/P"].stateValues.xs[1];
        expect(y).eq(0.05);
        expect(x).closeTo(20 * y, 1e-10);
      });
    });
  });

  it("copy endpoints of line segment", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <linesegment endpoints="(1,2) (3,4)"/>
  </graph>
  <graph>
  <copy prop="endpoint1" target="_linesegment1" assignNames="p1" />
  <copy prop="endpoint2" target="_linesegment1" assignNames="p2" />
  </graph>
  <graph>
  <copy prop="endpoints"  target="_linesegment1" assignNames="p1a p2a" />
  </graph>
  <copy prop="endpoint1" target="_linesegment1" assignNames="p1b" />
  <copy prop="endpoint2" target="_linesegment1" assignNames="p2b" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let p1x = 1;
      let p1y = 2;
      let p2x = 3;
      let p2y = 4;
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
      expect(stateVariables["/p1a"].stateValues.xs[0]).eq(p1x);
      expect(stateVariables["/p1a"].stateValues.xs[1]).eq(p1y);
      expect(stateVariables["/p2a"].stateValues.xs[0]).eq(p2x);
      expect(stateVariables["/p2a"].stateValues.xs[1]).eq(p2y);

      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p1x)},${nInDOM(p1y)})`,
      );
    });

    cy.log("move first individually copied point");
    cy.window().then(async (win) => {
      let p1x = -2;
      let p1y = -5;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1",
        args: { x: p1x, y: p1y },
      });

      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p1x)},${nInDOM(p1y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let p2x = 3;
        let p2y = 4;
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2a"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2a"].stateValues.xs[1]).eq(p2y);
      });
    });

    cy.log("move second individually copied point");
    cy.window().then(async (win) => {
      let p2x = 8;
      let p2y = -1;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2",
        args: { x: p2x, y: p2y },
      });

      cy.get(cesc("#\\/p2b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p2x)},${nInDOM(p2y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let p1x = -2;
        let p1y = -5;
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2a"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2a"].stateValues.xs[1]).eq(p2y);
      });
    });

    cy.log("move second array-copied point");
    cy.window().then(async (win) => {
      let p2x = -6;
      let p2y = 4;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p2a",
        args: { x: p2x, y: p2y },
      });

      cy.get(cesc("#\\/p2b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p2x)},${nInDOM(p2y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let p1x = -2;
        let p1y = -5;
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2a"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2a"].stateValues.xs[1]).eq(p2y);
      });
    });

    cy.log("move first array-copied point");
    cy.window().then(async (win) => {
      let p1x = 0;
      let p1y = 7;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/p1a",
        args: { x: p1x, y: p1y },
      });

      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p1x)},${nInDOM(p1y)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let p2x = -6;
        let p2y = 4;
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2a"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2a"].stateValues.xs[1]).eq(p2y);
      });
    });

    cy.log("move line up and to the right");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_linesegment1"].stateValues.endpoints[0][0],
        stateVariables["/_linesegment1"].stateValues.endpoints[0][1],
      ];
      let point2coords = [
        stateVariables["/_linesegment1"].stateValues.endpoints[1][0],
        stateVariables["/_linesegment1"].stateValues.endpoints[1][1],
      ];

      let moveX = 4;
      let moveY = 2;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/_linesegment1",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 4)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/p1"].stateValues.xs[0]).eq(point1coords[0]);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(point1coords[1]);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(point2coords[0]);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(point2coords[1]);
        expect(stateVariables["/p1a"].stateValues.xs[0]).eq(point1coords[0]);
        expect(stateVariables["/p1a"].stateValues.xs[1]).eq(point1coords[1]);
        expect(stateVariables["/p2a"].stateValues.xs[0]).eq(point2coords[0]);
        expect(stateVariables["/p2a"].stateValues.xs[1]).eq(point2coords[1]);
      });
    });
  });

  it("new linesegment from copied endpoints of line segment", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <linesegment endpoints="(-1,-2) (-3,-4)" />
  </graph>
  <graph>
  <linesegment endpoints="$(_linesegment1.endpoints)" />
  <copy prop="endpoints" target="_linesegment1" assignNames="p1 p2" />
  </graph>
  <copy prop="endpoint1" target="_linesegment1" assignNames="p1b" />
  <copy prop="endpoint2" target="_linesegment1" assignNames="p2b" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let p1x = -1;
      let p1y = -2;
      let p2x = -3;
      let p2y = -4;
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
      expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
      expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
      expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
      expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
        p1x,
        p1y,
      ]);
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
        p2x,
        p2y,
      ]);
      expect(stateVariables["/_linesegment2"].stateValues.endpoints[0]).eqls([
        p1x,
        p1y,
      ]);
      expect(stateVariables["/_linesegment2"].stateValues.endpoints[1]).eqls([
        p2x,
        p2y,
      ]);
      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(p1x)},${nInDOM(p1y)}`,
      );
    });

    cy.log("move first line segment up and to the right");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_linesegment1"].stateValues.endpoints[0][0],
        stateVariables["/_linesegment1"].stateValues.endpoints[0][1],
      ];
      let point2coords = [
        stateVariables["/_linesegment1"].stateValues.endpoints[1][0],
        stateVariables["/_linesegment1"].stateValues.endpoints[1][1],
      ];

      let moveX = 4;
      let moveY = 2;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/_linesegment1",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 4)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let p1x = -1 + moveX;
        let p1y = -2 + moveY;
        let p2x = -3 + moveX;
        let p2y = -4 + moveY;

        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          p1x,
          p1y,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          p2x,
          p2y,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[0]).eqls([
          p1x,
          p1y,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[1]).eqls([
          p2x,
          p2y,
        ]);
      });
    });

    cy.log("move second line segment up and to the left");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let point1coords = [
        stateVariables["/_linesegment2"].stateValues.endpoints[0][0],
        stateVariables["/_linesegment2"].stateValues.endpoints[0][1],
      ];
      let point2coords = [
        stateVariables["/_linesegment2"].stateValues.endpoints[1][0],
        stateVariables["/_linesegment2"].stateValues.endpoints[1][1],
      ];

      let moveX = -7;
      let moveY = 3;

      point1coords[0] = me.fromAst(point1coords[0]).add(moveX).simplify().tree;
      point1coords[1] = me.fromAst(point1coords[1]).add(moveY).simplify().tree;
      point2coords[0] = me.fromAst(point2coords[0]).add(moveX).simplify().tree;
      point2coords[1] = me.fromAst(point2coords[1]).add(moveY).simplify().tree;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/_linesegment2",
        args: {
          point1coords: point1coords,
          point2coords: point2coords,
        },
      });

      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(point1coords[0]).substring(0, 4)}`,
      );
      cy.get(cesc("#\\/p1b") + " .mjx-mrow").should(
        "contain.text",
        `,${nInDOM(point1coords[1]).substring(0, 4)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        moveX = 4 + moveX;
        moveY = 2 + moveY;
        let p1x = -1 + moveX;
        let p1y = -2 + moveY;
        let p2x = -3 + moveX;
        let p2y = -4 + moveY;

        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/p1"].stateValues.xs[0]).eq(p1x);
        expect(stateVariables["/p1"].stateValues.xs[1]).eq(p1y);
        expect(stateVariables["/p2"].stateValues.xs[0]).eq(p2x);
        expect(stateVariables["/p2"].stateValues.xs[1]).eq(p2y);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          p1x,
          p1y,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          p2x,
          p2y,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[0]).eqls([
          p1x,
          p1y,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[1]).eqls([
          p2x,
          p2y,
        ]);
      });
    });
  });

  it("extracting endpoint coordinates of symmetric linesegment", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <linesegment endpoints="(1,2) ($(_linesegment1.endpointX1_2), $(_linesegment1.endpointX1_1))" />
    <point name="x1">
      (<extract prop="x"><copy prop="endpoint1" target="_linesegment1" /></extract>,
      <math fixed>3</math>)
    </point>
    <point name="x2">
      (<extract prop="x"><copy prop="endpoint2" target="_linesegment1" /></extract>,
      <math fixed>4</math>)
    </point>
    <point name="y1">
      (<math fixed>3</math>,
      <extract prop="y"><copy prop="endpoint1" target="_linesegment1" /></extract>)
    </point>
    <point name="y2">
      (<math fixed>4</math>,
      <extract prop="y"><copy prop="endpoint2" target="_linesegment1" /></extract>)
    </point>
  </graph>
  <copy prop="endpoint1" target="_linesegment1" assignNames="p1" />
  <copy prop="endpoint2" target="_linesegment1" assignNames="p2" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x = 1,
      y = 2;

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(x)},${nInDOM(y)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
        x,
        y,
      ]);
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
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

      win.callAction1({
        actionName: "movePoint",
        componentName: "/x1",
        args: { x },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(y)},${nInDOM(x)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          x,
          y,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          y,
          x,
        ]);
        expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move x point 2");
    cy.window().then(async (win) => {
      y = 4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/x2",
        args: { x: y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(y)},${nInDOM(x)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          x,
          y,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          y,
          x,
        ]);
        expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move y point 1");
    cy.window().then(async (win) => {
      y = -6;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/y1",
        args: { y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(y)},${nInDOM(x)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          x,
          y,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          y,
          x,
        ]);
        expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
      });
    });

    cy.log("move y point 2");
    cy.window().then(async (win) => {
      x = -8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/y2",
        args: { y: x },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x)},${nInDOM(y)})`,
      );
      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(y)},${nInDOM(x)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          x,
          y,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          y,
          x,
        ]);
        expect(stateVariables["/x1"].stateValues.xs[0]).eq(x);
        expect(stateVariables["/x2"].stateValues.xs[0]).eq(y);
        expect(stateVariables["/y1"].stateValues.xs[1]).eq(y);
        expect(stateVariables["/y2"].stateValues.xs[1]).eq(x);
      });
    });
  });

  it("three linesegments with mutual references", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <linesegment endpoints="$(_linesegment2.endpoint2{ createComponentOfType='point'}) (1,0)" />
  <linesegment endpoints="$(_linesegment3.endpoint2{ createComponentOfType='point'}) (3,2)" />
  <linesegment endpoints="$(_linesegment1.endpoint2{ createComponentOfType='point'}) (-1,4)" />
  </graph>
  <copy prop="endpoint1" target="_linesegment1" assignNames="p11" />
  <copy prop="endpoint2" target="_linesegment1" assignNames="p12" />
  <copy prop="endpoint1" target="_linesegment2" assignNames="p21" />
  <copy prop="endpoint2" target="_linesegment2" assignNames="p22" />
  <copy prop="endpoint1" target="_linesegment3" assignNames="p31" />
  <copy prop="endpoint2" target="_linesegment3" assignNames="p32" />
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 1,
      y1 = 0;
    let x2 = 3,
      y2 = 2;
    let x3 = -1,
      y3 = 4;

    cy.get(cesc("#\\/p11") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(x2)},${nInDOM(y2)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
        x2,
        y2,
      ]);
      expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
        x1,
        y1,
      ]);
      expect(stateVariables["/_linesegment2"].stateValues.endpoints[0]).eqls([
        x3,
        y3,
      ]);
      expect(stateVariables["/_linesegment2"].stateValues.endpoints[1]).eqls([
        x2,
        y2,
      ]);
      expect(stateVariables["/_linesegment3"].stateValues.endpoints[0]).eqls([
        x1,
        y1,
      ]);
      expect(stateVariables["/_linesegment3"].stateValues.endpoints[1]).eqls([
        x3,
        y3,
      ]);
    });

    cy.log("move point 1 of line segment 1");
    cy.window().then(async (win) => {
      x2 = 7;
      y2 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p11",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/p11") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[0]).eqls([
          x3,
          y3,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[1]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[0]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[1]).eqls([
          x3,
          y3,
        ]);
      });
    });

    cy.log("move point 2 of line segment 1");
    cy.window().then(async (win) => {
      x1 = -1;
      y1 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p12",
        args: { x: x1, y: y1 },
      });

      cy.get(cesc("#\\/p12") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[0]).eqls([
          x3,
          y3,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[1]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[0]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[1]).eqls([
          x3,
          y3,
        ]);
      });
    });

    cy.log("move point 1 of line segment 2");
    cy.window().then(async (win) => {
      x3 = 9;
      y3 = -8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p21",
        args: { x: x3, y: y3 },
      });

      cy.get(cesc("#\\/p21") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x3)},${nInDOM(y3)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[0]).eqls([
          x3,
          y3,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[1]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[0]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[1]).eqls([
          x3,
          y3,
        ]);
      });
    });

    cy.log("move point 2 of line segment 2");
    cy.window().then(async (win) => {
      x2 = 3;
      y2 = 2;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p22",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/p22") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[0]).eqls([
          x3,
          y3,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[1]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[0]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[1]).eqls([
          x3,
          y3,
        ]);
      });
    });

    cy.log("move point 1 of line segment 3");
    cy.window().then(async (win) => {
      x1 = -5;
      y1 = 8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p31",
        args: { x: x1, y: y1 },
      });

      cy.get(cesc("#\\/p31") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[0]).eqls([
          x3,
          y3,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[1]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[0]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[1]).eqls([
          x3,
          y3,
        ]);
      });
    });

    cy.log("move point 2 of line segment 3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      x3 = 0;
      y3 = -5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/p32",
        args: { x: x3, y: y3 },
      });

      cy.get(cesc("#\\/p32") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x3)},${nInDOM(y3)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[0]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment1"].stateValues.endpoints[1]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[0]).eqls([
          x3,
          y3,
        ]);
        expect(stateVariables["/_linesegment2"].stateValues.endpoints[1]).eqls([
          x2,
          y2,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[0]).eqls([
          x1,
          y1,
        ]);
        expect(stateVariables["/_linesegment3"].stateValues.endpoints[1]).eqls([
          x3,
          y3,
        ]);
      });
    });
  });

  it("copy propIndex of points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <linesegment endpoints="(2,-3) (3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy prop="endpoints" target="_linesegment1" propIndex="$n" assignNames="P1 P2" /></p>

    <p><copy prop="endpoint2" target="_linesegment1" propIndex="$n" assignNames="x" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = 4;

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
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
    cy.get(cesc("#\\/x") + " .mjx-mrow").should(
      "contain.text",
      `${nInDOM(t2y)}`,
    );

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
  });

  it("copy propIndex of points, dot and array notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <linesegment endpoints="(2,-3) (3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy source="_linesegment1.endpoints[$n]" assignNames="P1 P2" /></p>

    <p><copy source="_linesegment1.endpoint2[$n]" assignNames="x" /></p>
    <p><copy source="_linesegment1.endpoints[2][$n]" assignNames="xa" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 2,
      t1y = -3;
    let t2x = 3,
      t2y = 4;

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
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
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");
  });

  it("lineSegment slope", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point name="A">(3,4)</point>
      <point name="B">(7,-2)</point>
      <linesegment name="l" endpoints="$A $B" />
    </graph>
    <copy prop="slope" target="l" assignNames="slope" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 3,
      t1y = 4;
    let t2x = 7,
      t2y = -2;
    let m = (t1y - t2y) / (t1x - t2x);

    cy.get(cesc("#\\/slope")).should("contain.text", String(m));

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.slope).eq(m);
    });

    cy.window().then(async (win) => {
      t1x = 7;
      t1y = 3;
      m = (t1y - t2y) / (t1x - t2x);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: t1x, y: t1y },
      });

      cy.get(cesc("#\\/slope")).should("contain.text", "∞");
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(Math.abs(stateVariables["/l"].stateValues.slope)).eq(Infinity);
    });

    cy.window().then(async (win) => {
      t2x = -9;
      t2y = 5;
      m = (t1y - t2y) / (t1x - t2x);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: t2x, y: t2y },
      });

      cy.get(cesc("#\\/slope")).should("contain.text", String(m));
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.slope).eq(m);
    });
  });

  it("lineSegment length", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <point name="A">(3,4)</point>
      <point name="B">(7,-2)</point>
      <linesegment name="l" endpoints="$A $B" />
    </graph>
    <copy prop="length" target="l" assignNames="length" displayDigits="10" />
    <point name="Ap" copySource="A" />
    <point name="Bp" copySource="B" />
    <mathinput name="milength" bindValueTo="$length" />
    <p><booleaninput name="bi"/><boolean copySource="bi" name="bi2" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    let t1x = 3,
      t1y = 4;
    let t2x = 7,
      t2y = -2;
    let len = Math.sqrt((t1y - t2y) ** 2 + (t1x - t2x) ** 2);

    cy.get(cesc("#\\/length")).should(
      "contain.text",
      String(Math.round(len * 10 ** 9) / 10 ** 9),
    );
    cy.get(cesc("#\\/Ap") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,4)");
    cy.get(cesc("#\\/Bp") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,−2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.length).eq(len);
    });

    cy.window().then(async (win) => {
      t1x = 7;
      t1y = 3;
      len = Math.sqrt((t1y - t2y) ** 2 + (t1x - t2x) ** 2);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: t1x, y: t1y },
      });

      cy.get(cesc("#\\/length")).should("contain.text", String(len));
      cy.get(cesc("#\\/Ap") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(7,3)");
      cy.get(cesc("#\\/Bp") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(7,−2)");
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.length).eq(len);
    });

    cy.get(cesc("#\\/milength") + " textarea").type(
      "{end}{backspace}10{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/length")).should("contain.text", "10");
    cy.get(cesc("#\\/Ap") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,5.5)");
    cy.get(cesc("#\\/Bp") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,−4.5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.length).eq(10);
    });

    cy.log("ignore requested negative length");
    cy.get(cesc("#\\/milength") + " textarea").type(
      "{end}{backspace}{backspace}-3{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/bi2")).should("have.text", "true"); // so know that core has responded to both requests

    cy.get(cesc("#\\/length")).should("contain.text", "10");
    cy.get(cesc("#\\/Ap") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,5.5)");
    cy.get(cesc("#\\/Bp") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,−4.5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.length).eq(10);
    });

    cy.window().then(async (win) => {
      t1y = 5.5;
      t2x = -9;
      t2y = 5;
      len = Math.sqrt((t1y - t2y) ** 2 + (t1x - t2x) ** 2);
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: t2x, y: t2y },
      });

      cy.get(cesc("#\\/length")).should(
        "contain.text",
        String(Math.round(len * 10 ** 8) / 10 ** 8),
      );
      cy.get(cesc("#\\/Ap") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(7,5.5)");
      cy.get(cesc("#\\/Bp") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(−9,5)");
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/l"].stateValues.length).eq(len);
    });
  });

  it("lineSegment symbolic length", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <linesegment name="l" endpoints="(x,y) (u,v)" />
    <copy prop="length" source="l" assignNames="length" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        me
          .fromAst(stateVariables["/l"].stateValues.length)
          .equals(me.fromText("sqrt((x-u)^2+(y-v)^2)")),
      ).eq(true);
    });
  });

  it("label positioning", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph name="g">
      <lineSegment endPoints="(1,2) (3,4)" labelPosition="$labelPos" name="ls">
        <label>$label</label>
      </lineSegment>
    </graph>

    <p>label: <textinput name="label" prefill="line segment" /></p>
    <p>position:
    <choiceinput inline preselectChoice="1" name="labelPos">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
    </choiceinput>
    </p>

    <p name="pPos">Position: $ls.labelPosition</p>
    <p name="pLabel">Label: $ls.label</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    // not sure what to test as don't know how to check renderer...

    cy.get(cesc("#\\/pPos")).should("have.text", "Position: upperright");
    cy.get(cesc("#\\/pLabel")).should("contain.text", "Label: line segment");

    cy.get(cesc("#\\/label_input")).clear().type("nothing{enter}");
    cy.get(cesc("#\\/pLabel")).should("contain.text", "Label: nothing");

    cy.get(cesc("#\\/labelPos")).select("upperLeft");
    cy.get(cesc("#\\/pPos")).should("have.text", "Position: upperleft");
    cy.get(cesc("#\\/labelPos")).select("lowerRight");
    cy.get(cesc("#\\/pPos")).should("have.text", "Position: lowerright");
    cy.get(cesc("#\\/labelPos")).select("lowerLeft");
    cy.get(cesc("#\\/pPos")).should("have.text", "Position: lowerleft");
  });

  it("draggable, endpoints draggable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <linesegment endpoints="(1,3) (5,7)" name="p" draggable="$draggable" endpointsDraggable="$endpointsDraggable" />
  </graph>
  <p>To wait: <booleaninput name="bi" /> <boolean copySource="bi" name="bi2" /></p>
  <p>draggable: <booleaninput name="draggable" /> <boolean copySource="p.draggable" name="d2" /></p>
  <p>endpoints draggable: <booleaninput name="endpointsDraggable" /> <boolean copySource="p.endpointsDraggable" name="ed2" /></p>
  <p name="pendpt">all endpoints: $p.endpoints</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/d2")).should("have.text", "false");
    cy.get(cesc("#\\/ed2")).should("have.text", "false");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([1, 3]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(false);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(false);
    });

    cy.log("cannot move single endpoint");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/p",
        args: {
          point1coords: [4, 7],
        },
      });
    });

    // wait for core to process click
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/bi2")).should("have.text", "true");

    cy.get(cesc("#\\/d2")).should("have.text", "false");
    cy.get(cesc("#\\/ed2")).should("have.text", "false");

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([1, 3]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(false);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(false);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/p",
        args: {
          point2coords: [4, 7],
        },
      });
    });

    // wait for core to process click
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/bi2")).should("have.text", "false");

    cy.get(cesc("#\\/d2")).should("have.text", "false");
    cy.get(cesc("#\\/ed2")).should("have.text", "false");

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([1, 3]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(false);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(false);
    });

    cy.log("cannot move both endpoints");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/p",
        args: {
          point1coords: [4, 7],
          point2coords: [8, 10],
        },
      });
    });

    // wait for core to process click
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/bi2")).should("have.text", "true");

    cy.get(cesc("#\\/d2")).should("have.text", "false");
    cy.get(cesc("#\\/ed2")).should("have.text", "false");

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([1, 3]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(false);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(false);
    });

    cy.log("only endpoints draggable");

    cy.get(cesc("#\\/endpointsDraggable")).click();
    cy.get(cesc("#\\/ed2")).should("have.text", "true");

    cy.log("can move single endpoint");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/p",
        args: {
          point1coords: [4, 7],
        },
      });
    });

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow").should("contain.text", "(4,7)");

    cy.get(cesc("#\\/d2")).should("have.text", "false");
    cy.get(cesc("#\\/ed2")).should("have.text", "true");

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([4, 7]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(false);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(true);
    });

    cy.log("cannot move both endpoints");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/p",
        args: {
          pointCoords: [
            [3, 8],
            [8, 10],
            [1, 9],
          ],
        },
      });
    });

    // wait for core to process click
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/bi2")).should("have.text", "false");

    cy.get(cesc("#\\/d2")).should("have.text", "false");
    cy.get(cesc("#\\/ed2")).should("have.text", "true");

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,7)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([4, 7]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(false);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(true);
    });

    cy.log("endpoints and line segment draggable");

    cy.get(cesc("#\\/draggable")).click();
    cy.get(cesc("#\\/d2")).should("have.text", "true");

    cy.log("can move first endpoint");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/p",
        args: {
          point1coords: [-3, 2],
        },
      });
    });

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow").should("contain.text", "(−3,2)");

    cy.get(cesc("#\\/d2")).should("have.text", "true");
    cy.get(cesc("#\\/ed2")).should("have.text", "true");

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,2)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(5,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([-3, 2]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(true);
    });

    cy.log("can move second endpoint");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/p",
        args: {
          point2coords: [-9, 0],
        },
      });
    });

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow").should("contain.text", "(−9,0)");

    cy.get(cesc("#\\/d2")).should("have.text", "true");
    cy.get(cesc("#\\/ed2")).should("have.text", "true");

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,2)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(−9,0)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([-3, 2]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([-9, 0]);
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(true);
    });

    cy.log("can move both endpoints");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/p",
        args: {
          point1coords: [3, 8],
          point2coords: [8, 10],
        },
      });
    });

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow").should("contain.text", "(3,8)");

    cy.get(cesc("#\\/d2")).should("have.text", "true");
    cy.get(cesc("#\\/ed2")).should("have.text", "true");

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,8)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(8,10)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([3, 8]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([8, 10]);
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(true);
    });

    cy.log("polygon but not endpoints draggable");

    cy.get(cesc("#\\/endpointsDraggable")).click();
    cy.get(cesc("#\\/ed2")).should("have.text", "false");

    cy.log("cannot move first endpoint");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/p",
        args: {
          point1coords: [9, 3],
        },
      });
    });

    // wait for core to process click
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/bi2")).should("have.text", "true");

    cy.get(cesc("#\\/d2")).should("have.text", "true");
    cy.get(cesc("#\\/ed2")).should("have.text", "false");

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,8)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(8,10)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([3, 8]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([8, 10]);
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(false);
    });

    cy.log("cannot move second endpoint");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/p",
        args: {
          point2coords: [9, 3],
        },
      });
    });

    // wait for core to process click
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/bi2")).should("have.text", "false");

    cy.get(cesc("#\\/d2")).should("have.text", "true");
    cy.get(cesc("#\\/ed2")).should("have.text", "false");

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,8)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(8,10)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([3, 8]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([8, 10]);
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(false);
    });

    cy.log("can move both endpoints");
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/p",
        args: {
          point1coords: [-4, 1],
          point2coords: [9, -4],
        },
      });
    });

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow").should("contain.text", "(−4,1)");

    cy.get(cesc("#\\/d2")).should("have.text", "true");
    cy.get(cesc("#\\/ed2")).should("have.text", "false");

    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−4,1)");
    cy.get(cesc("#\\/pendpt") + " .mjx-mrow")
      .eq(2)
      .should("have.text", "(9,−4)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.endpoints[0]).eqls([-4, 1]);
      expect(stateVariables["/p"].stateValues.endpoints[1]).eqls([9, -4]);
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(false);
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
      <linesegment name="A" styleNumber="1" labelIsName endpoints="(0,0) (1,2)" />
      <linesegment name="B" styleNumber="2" labelIsName endpoints="(2,2) (3,4)" />
      <linesegment name="C" styleNumber="5" labelIsName endpoints="(4,4) (5,6)" />
    </graph>
    <p name="Adescrip">Line segment A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/Adescrip")).should(
      "have.text",
      "Line segment A is thick brown.",
    );
    cy.get(cesc("#\\/Bdescrip")).should(
      "have.text",
      "B is a dark red line segment.",
    );
    cy.get(cesc("#\\/Cdescrip")).should(
      "have.text",
      "C is a thin black line segment.",
    );

    cy.log("set dark mode");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_darkmode").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.get(cesc("#\\/Adescrip")).should(
      "have.text",
      "Line segment A is thick yellow.",
    );
    cy.get(cesc("#\\/Bdescrip")).should(
      "have.text",
      "B is a light red line segment.",
    );
    cy.get(cesc("#\\/Cdescrip")).should(
      "have.text",
      "C is a thin white line segment.",
    );
  });

  it("line segment based on two endpoints, one constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point name="P" labelIsName>(3,5)
    <constraints><constrainToGrid dx="2" dy="3" /></constraints>
    </point>
  <point name="Q" labelIsName>(-4,-1)</point>
  <lineSegment endpoints="$P $Q" />
  </graph>
  <copy target="P" assignNames="Pa" />
  <copy target="Q" assignNames="Qa" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

    let x1 = 4,
      y1 = 6;
    let x2 = -4,
      y2 = -1;

    cy.get(cesc2("#/Pa") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(x1)},${nInDOM(y1)})`,
    );
    cy.get(cesc2("#/Qa") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(x2)},${nInDOM(y2)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs[0]).eq(x1);
      expect(stateVariables["/P"].stateValues.xs[1]).eq(y1);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", x1, y1]);
      expect(stateVariables["/Q"].stateValues.xs[0]).eq(x2);
      expect(stateVariables["/Q"].stateValues.xs[1]).eq(y2);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", x2, y2]);
    });

    cy.log(
      "move line down 4 and right 0.5 actually moves it down 3 and right none",
    );
    cy.window().then(async (win) => {
      let dx = 0.5,
        dy = -4;

      let x1Desired = x1 + dx;
      let y1Desired = y1 + dy;
      let x2Desired = x2 + dx;
      let y2Desired = y2 + dy;

      dx = 0;
      dy = -3;
      x1 += dx;
      y1 += dy;
      x2 += dx;
      y2 += dy;

      win.callAction1({
        actionName: "moveLineSegment",
        componentName: "/_linesegment1",
        args: {
          point1coords: [x1Desired, y1Desired],
          point2coords: [x2Desired, y2Desired],
        },
      });

      cy.get(cesc2("#/Pa") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );
      cy.get(cesc2("#/Qa") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.xs[0]).eq(x1);
      expect(stateVariables["/P"].stateValues.xs[1]).eq(y1);
      expect(stateVariables["/P"].stateValues.coords).eqls(["vector", x1, y1]);
      expect(stateVariables["/Q"].stateValues.xs[0]).eq(x2);
      expect(stateVariables["/Q"].stateValues.xs[1]).eq(y2);
      expect(stateVariables["/Q"].stateValues.coords).eqls(["vector", x2, y2]);
    });
  });

  it("handle bad endpoints", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <linesegment endpoints="A" />
    </graph>
    `,
        },
        "*",
      );
    });

    // page loads
    cy.get(cesc2("#/_text1")).should("have.text", "a");
  });
});
