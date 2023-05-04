import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

async function testPolygonCopiedTwice({
  vertices,
  polygonName = "/pg",
  graph1Name = "/g1",
  graph2Name = "/g2",
  graph3Name = "/g3",
  pointsInDomPrefix = "/p",
}) {
  for (let i in vertices) {
    let ind = Number(i) + 1;
    if (Number.isFinite(vertices[i][0])) {
      cy.get(`#${cesc2(pointsInDomPrefix + ind)} .mjx-mrow`).should(
        "contain.text",
        `(${nInDOM(
          Math.round(vertices[i][0] * 100000000) / 100000000,
        ).substring(0, 6)}`,
      );
    }
    if (Number.isFinite(vertices[i][1])) {
      cy.get(`#${cesc2(pointsInDomPrefix + ind)} .mjx-mrow`).should(
        "contain.text",
        `,${nInDOM(
          Math.round(vertices[i][1] * 100000000) / 100000000,
        ).substring(0, 6)}`,
      );
    }
  }
  cy.get(`#${cesc2(pointsInDomPrefix + (vertices.length + 1))}`).should(
    "not.exist",
  );

  cy.window().then(async (win) => {
    let stateVariables = await win.returnAllStateVariables1();
    expect(stateVariables[graph1Name + polygonName].stateValues.nVertices).eqls(
      vertices.length,
    );
    expect(stateVariables[graph2Name + polygonName].stateValues.nVertices).eqls(
      vertices.length,
    );
    expect(stateVariables[graph3Name + polygonName].stateValues.nVertices).eqls(
      vertices.length,
    );

    for (let i in vertices) {
      if (Number.isFinite(vertices[i][0])) {
        expect(
          me
            .fromAst(
              stateVariables[graph1Name + polygonName].stateValues.vertices[
                i
              ][0],
            )
            .evaluate_to_constant(),
        ).closeTo(vertices[i][0], 1e-12);
        expect(
          me
            .fromAst(
              stateVariables[graph2Name + polygonName].stateValues.vertices[
                i
              ][0],
            )
            .evaluate_to_constant(),
        ).closeTo(vertices[i][0], 1e-12);
        expect(
          me
            .fromAst(
              stateVariables[graph3Name + polygonName].stateValues.vertices[
                i
              ][0],
            )
            .evaluate_to_constant(),
        ).closeTo(vertices[i][0], 1e-12);
      } else {
        expect(
          stateVariables[graph1Name + polygonName].stateValues.vertices[i][0],
        ).eq(vertices[i][0]);
        expect(
          stateVariables[graph2Name + polygonName].stateValues.vertices[i][0],
        ).eq(vertices[i][0]);
        expect(
          stateVariables[graph3Name + polygonName].stateValues.vertices[i][0],
        ).eq(vertices[i][0]);
      }
      if (Number.isFinite(vertices[i][1])) {
        expect(
          me
            .fromAst(
              stateVariables[graph1Name + polygonName].stateValues.vertices[
                i
              ][1],
            )
            .evaluate_to_constant(),
        ).closeTo(vertices[i][1], 1e-12);
        expect(
          me
            .fromAst(
              stateVariables[graph2Name + polygonName].stateValues.vertices[
                i
              ][1],
            )
            .evaluate_to_constant(),
        ).closeTo(vertices[i][1], 1e-12);
        expect(
          me
            .fromAst(
              stateVariables[graph3Name + polygonName].stateValues.vertices[
                i
              ][1],
            )
            .evaluate_to_constant(),
        ).closeTo(vertices[i][1], 1e-12);
      } else {
        expect(
          stateVariables[graph1Name + polygonName].stateValues.vertices[i][1],
        ).eq(vertices[i][1]);
        expect(
          stateVariables[graph2Name + polygonName].stateValues.vertices[i][1],
        ).eq(vertices[i][1]);
        expect(
          stateVariables[graph3Name + polygonName].stateValues.vertices[i][1],
        ).eq(vertices[i][1]);
      }
    }
  });
}

describe("Polygon Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("Polygon vertices and copied points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)</point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <copy target="g1/pg" prop="vertices" assignNames="p1 p2 p3 p4" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let vertices = [
      [3, 5],
      [-4, -1],
      [5, 2],
      [-3, 4],
    ];

    testPolygonCopiedTwice({ vertices });

    cy.log("move individual vertex");
    cy.window().then(async (win) => {
      vertices[1] = [4, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/pg",
        args: {
          pointCoords: { 1: vertices[1] },
        },
      });

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("move copied polygon up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices,
        },
      });

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("move double copied individual vertex");
    cy.window().then(async (win) => {
      vertices[2] = [-9, -8];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g3/pg",
        args: {
          pointCoords: { 2: vertices[2] },
        },
      });

      testPolygonCopiedTwice({ vertices });
    });
  });

  it("Polygon string points in vertices", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <math>-1</math>
  <graph name="g1" newNamespace>
    <polygon vertices="(3,5) (-4,$(../_math1))(5,2)(-3,4)" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <copy target="g1/pg" prop="vertices" assignNames="p1 p2 p3 p4" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let vertices = [
      [3, 5],
      [-4, -1],
      [5, 2],
      [-3, 4],
    ];

    testPolygonCopiedTwice({ vertices });

    cy.log("move individual vertex");
    cy.window().then(async (win) => {
      vertices[1] = [4, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/pg",
        args: {
          pointCoords: { 1: vertices[1] },
        },
      });

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("move copied polygon up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices,
        },
      });

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("move double copied individual vertex");
    cy.window().then(async (win) => {
      vertices[2] = [-9, -8];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g3/pg",
        args: {
          pointCoords: { 2: vertices[2] },
        },
      });

      testPolygonCopiedTwice({ vertices });
    });
  });

  it("dynamic polygon with vertices from copied map, initially zero, copied", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <mathinput name="length" prefill="0" />
  <graph name="g1" newNamespace>
    <map>
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="0" length="$(../length)" /></sources>
    </map>
    <polygon vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6) (p7) (p8) (p9) (p10)" >
    <template><round numberDecimals="8">$v</round></template>
    <sources alias="v"><copy target="g1/pg" prop="vertices" /></sources>
  </map>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let vertices = [];
    testPolygonCopiedTwice({ vertices });

    cy.get(cesc("#\\/length") + " textarea")
      .type("{end}{backspace}1{enter}", { force: true })
      .then(() => {
        vertices[0] = [0, 5 * Math.sin(0)];
        testPolygonCopiedTwice({ vertices });
      });

    cy.get(cesc("#\\/length") + " textarea")
      .type("{end}{backspace}2{enter}", { force: true })
      .then(() => {
        vertices[1] = [1, 5 * Math.sin(1)];
        testPolygonCopiedTwice({ vertices });
      });

    cy.get(cesc("#\\/length") + " textarea")
      .type("{end}{backspace}3{enter}", { force: true })
      .then(() => {
        vertices[2] = [2, 5 * Math.sin(2)];
        testPolygonCopiedTwice({ vertices });
      });

    cy.get(cesc("#\\/length") + " textarea")
      .type("{end}{backspace}2{enter}", { force: true })
      .then(() => {
        vertices.splice(2, 1);
        testPolygonCopiedTwice({ vertices });
      });

    cy.get(cesc("#\\/length") + " textarea")
      .type("{end}{backspace}0{enter}", { force: true })
      .then(() => {
        vertices = [];
        testPolygonCopiedTwice({ vertices });
      });

    cy.get(cesc("#\\/length") + " textarea")
      .type("{end}{backspace}5{enter}", { force: true })
      .then(() => {
        for (let i = 0; i < 5; i++) {
          vertices.push([i, 5 * Math.sin(i)]);
        }
        testPolygonCopiedTwice({ vertices });
      });

    cy.log("start over and begin with big increment");
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>b</text>

  <mathinput name="length" prefill="0" />
  <graph name="g1" newNamespace>
    <map>
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="0" length="$(../length)" /></sources>
    </map>
    <polygon vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6) (p7) (p8) (p9) (p10)" >
    <template><round numberDecimals="8">$v</round></template>
    <sources alias="v"><copy target="g1/pg" prop="vertices" /></sources>
  </map>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "b"); //wait for page to load

    cy.window().then(async (win) => {
      vertices = [];
      testPolygonCopiedTwice({ vertices });
    });

    cy.get(cesc("#\\/length") + " textarea")
      .type("{end}{backspace}10{enter}", { force: true })
      .then(() => {
        for (let i = 0; i < 10; i++) {
          vertices.push([i, 5 * Math.sin(i)]);
        }
        testPolygonCopiedTwice({ vertices });
      });

    cy.get(cesc("#\\/length") + " textarea")
      .type("{end}{backspace}{backspace}1{enter}", { force: true })
      .then(() => {
        vertices = [[0, 5 * Math.sin(0)]];
        testPolygonCopiedTwice({ vertices });
      });
  });

  it("polygon with initially undefined point", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput/>

  <graph name="g1" newNamespace>
    <polygon vertices="(1,2) (-1,5) ($(../_mathinput1),7)(3,-5)(-4,-3)" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <map assignNames="(p1) (p2) (p3) (p4) (p5)" >
    <template><round numberDecimals="8">$v</round></template>
    <sources alias="v"><copy target="g1/pg" prop="vertices" /></sources>
  </map>
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let vertices = [
      [1, 2],
      [-1, 5],
      ["\uff3f", 7],
      [3, -5],
      [-4, -3],
    ];
    testPolygonCopiedTwice({ vertices });

    cy.get(cesc("#\\/_mathinput1") + " textarea")
      .type("{end}{backspace}-2{enter}", { force: true })
      .then(() => {
        vertices[2][0] = -2;
        testPolygonCopiedTwice({ vertices });
      });
  });

  it(`can't move polygon based on map`, () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  
  <graph name="g1" newNamespace>
    <map hide assignNames="(mp1) (mp2) (mp3) (mp4) (mp5) (mp6) (mp7) (mp8) (mp9) (mp10) (mp11)" >
      <template><point>($x, 5sin($x))</point></template>
      <sources alias="x"><sequence from="-5" to="5"/></sources>
    </map>
    <polygon vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6) (p7) (p8) (p9) (p10) (p11)" >
    <template><round numberDecimals="8">$v</round></template>
    <sources alias="v"><copy target="g1/pg" prop="vertices" /></sources>
  </map>
  <textinput name="ti" />
  <copy target="ti" prop="value" assignNames="t" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let vertices = [];
    for (let i = -5; i <= 5; i++) {
      vertices.push([i, 5 * Math.sin(i)]);
    }
    testPolygonCopiedTwice({ vertices });

    cy.log("can't move points");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/mp1",
        args: { x: 9, y: -8 },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/mp9",
        args: { x: -8, y: 4 },
      });

      // since core could be delayed and we can't tell that no change occurred,
      // change value of textinput and wait for the change to be processed by core
      cy.get(cesc("#\\/ti_input")).type("wait{enter}");
      cy.get(cesc("#\\/t"))
        .should("have.text", "wait")
        .then(() => {
          testPolygonCopiedTwice({ vertices });
        });
    });

    cy.log("can't move polygon1");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;

      let vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/pg",
        args: {
          pointCoords: vertices2,
        },
      });

      cy.get(cesc("#\\/ti_input")).clear().type("more{enter}");
      cy.get(cesc("#\\/t"))
        .should("have.text", "more")
        .then(() => {
          testPolygonCopiedTwice({ vertices });
        });
    });

    cy.log("can't move polygon2");
    cy.window().then(async (win) => {
      let moveX = -5;
      let moveY = 6;

      let vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices2,
        },
      });

      cy.get(cesc("#\\/ti_input")).clear().type("less{enter}");
      cy.get(cesc("#\\/t"))
        .should("have.text", "less")
        .then(() => {
          testPolygonCopiedTwice({ vertices });
        });
    });

    cy.log("can't move polygon3");
    cy.window().then(async (win) => {
      let moveX = 7;
      let moveY = -4;

      let vertices2 = vertices.map((v) => [v[0] + moveX, v[1] + moveY]);

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g3/pg",
        args: {
          pointCoords: vertices2,
        },
      });

      cy.get(cesc("#\\/ti_input")).clear().type("last{enter}");
      cy.get(cesc("#\\/t"))
        .should("have.text", "last")
        .then(() => {
          testPolygonCopiedTwice({ vertices });
        });
    });
  });

  it(`create moveable polygon based on map`, () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>

  <graph name="g1" newNamespace>
    <map hide assignNames="(mp1) (mp2) (mp3) (mp4) (mp5) (mp6) (mp7) (mp8) (mp9) (mp10) (mp11)" >
      <template><point>($x + <math>0</math>, 5sin($x) + <math>0</math>)</point></template>
      <sources alias="x"><sequence from="-5" to="5"/></sources>
    </map>
    <polygon vertices="$_map1" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <map assignNames="(p1) (p2) (p3) (p4) (p5) (p6) (p7) (p8) (p9) (p10) (p11)" >
    <template><round numberDecimals="8">$v</round></template>
    <sources alias="v"><copy target="g1/pg" prop="vertices" /></sources>
  </map>
  <textinput name="ti" />
  <copy target="ti" prop="value" assignNames="t" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let vertices = [];
    for (let i = -5; i <= 5; i++) {
      vertices.push([i, 5 * Math.sin(i)]);
    }
    testPolygonCopiedTwice({ vertices });

    cy.log("can move points");

    cy.window().then(async (win) => {
      vertices[0] = [9, -8];
      vertices[8] = [-8, 4];

      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/mp1",
        args: { x: vertices[0][0], y: vertices[0][1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/g1/mp9",
        args: { x: vertices[8][0], y: vertices[8][1] },
      });

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("can move polygon1");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/pg",
        args: {
          pointCoords: vertices,
        },
      });

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("can move polygon2");
    cy.window().then(async (win) => {
      let moveX = -5;
      let moveY = 6;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices,
        },
      });

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("can move polygon3");
    cy.window().then(async (win) => {
      let moveX = 7;
      let moveY = -4;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices,
        },
      });

      testPolygonCopiedTwice({ vertices });
    });
  });

  it("copy vertices of polygon", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <polygon vertices="(-3,-1)(1,2)(3,4)(6,-2)" />
  </graph>
  <graph>
  <copy assignNames="v1" prop="vertex1" target="_polygon1" />
  <copy assignNames="v2" prop="vertex2" target="_polygon1" />
  <copy assignNames="v3" prop="vertex3" target="_polygon1" />
  <copy assignNames="v4" prop="vertex4" target="_polygon1" />
  </graph>
  <graph>
  <copy assignNames="v1a v2a v3a v4a" prop="vertices" target="_polygon1" />
  </graph>
  <copy assignNames="v4b" prop="vertex4" target="_polygon1" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let ps = [
        [-3, -1],
        [1, 2],
        [3, 4],
        [6, -2],
      ];

      for (let i = 0; i < 4; i++) {
        expect(stateVariables[`/v${i + 1}`].stateValues.xs[0]).eq(ps[i][0]);
        expect(stateVariables[`/v${i + 1}a`].stateValues.xs[0]).eq(ps[i][0]);
        expect(stateVariables[`/v${i + 1}`].stateValues.xs[1]).eq(ps[i][1]);
        expect(stateVariables[`/v${i + 1}a`].stateValues.xs[1]).eq(ps[i][1]);
      }

      cy.get(cesc("#\\/v4b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(ps[3][0])},${nInDOM(ps[3][1])})`,
      );
    });

    cy.log("move individually copied vertices");
    cy.window().then(async (win) => {
      let ps = [
        [-5, 3],
        [-2, 7],
        [0, -8],
        [9, -6],
      ];

      for (let i = 0; i < 4; i++) {
        win.callAction1({
          actionName: "movePoint",
          componentName: `/v${i + 1}`,
          args: { x: ps[i][0], y: ps[i][1] },
        });
      }

      cy.get(cesc("#\\/v4b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(ps[3][0])},${nInDOM(ps[3][1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        for (let i = 0; i < 4; i++) {
          expect(stateVariables[`/v${i + 1}`].stateValues.xs[0]).eq(ps[i][0]);
          expect(stateVariables[`/v${i + 1}a`].stateValues.xs[0]).eq(ps[i][0]);
          expect(stateVariables[`/v${i + 1}`].stateValues.xs[1]).eq(ps[i][1]);
          expect(stateVariables[`/v${i + 1}a`].stateValues.xs[1]).eq(ps[i][1]);
        }
      });
    });

    cy.log("move array-copied vertices");
    cy.window().then(async (win) => {
      let ps = [
        [-7, -1],
        [-3, 5],
        [2, 4],
        [6, 0],
      ];

      for (let i = 0; i < 4; i++) {
        win.callAction1({
          actionName: "movePoint",
          componentName: `/v${i + 1}a`,
          args: { x: ps[i][0], y: ps[i][1] },
        });
      }

      cy.get(cesc("#\\/v4b") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(ps[3][0])},${nInDOM(ps[3][1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        for (let i = 0; i < 4; i++) {
          expect(stateVariables[`/v${i + 1}`].stateValues.xs[0]).eq(ps[i][0]);
          expect(stateVariables[`/v${i + 1}a`].stateValues.xs[0]).eq(ps[i][0]);
          expect(stateVariables[`/v${i + 1}`].stateValues.xs[1]).eq(ps[i][1]);
          expect(stateVariables[`/v${i + 1}a`].stateValues.xs[1]).eq(ps[i][1]);
        }
      });
    });
  });

  it("new polygon from copied vertices of polygon", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
  <polygon vertices="(-9,6)(-3,7)(4,0)(8,5)" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <polygon vertices="$(../g1/pg.vertices)" name="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <copy target="g1/pg" prop="vertices" assignNames="p1 p2 p3 p4" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let vertices = [
      [-9, 6],
      [-3, 7],
      [4, 0],
      [8, 5],
    ];

    testPolygonCopiedTwice({ vertices });

    cy.log("move first polygon up and to the right");
    cy.window().then(async (win) => {
      let moveX = 4;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/pg",
        args: {
          pointCoords: vertices,
        },
      });

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("move copied polygon up and to the left");
    cy.window().then(async (win) => {
      let moveX = -7;
      let moveY = 3;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices,
        },
      });

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("move dobule copied polygon down and to the left");
    cy.window().then(async (win) => {
      let moveX = -1;
      let moveY = -4;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] += moveX;
        vertices[i][1] += moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g3/pg",
        args: {
          pointCoords: vertices,
        },
      });

      testPolygonCopiedTwice({ vertices });
    });
  });

  it("new polygon as translated version of polygon", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="5" name="transx" />
    <mathinput prefill="7" name="transy" />
    <graph>
    <polygon vertices=" (0,0) (3,-4) (1,-6) (-5,-6) " />
    <map hide>
      <template newNamespace>
        <point>(<extract prop="x"><copy target="x" fixed="false"/></extract>+
          <copy prop="value" modifyIndirectly="false" target="../transx" />,
        <extract prop="y"><copy target="x" fixed="false" /></extract>+
        <copy prop="value" modifyIndirectly="false" target="../transy" />)
        </point>
      </template>
      <sources alias="x">
        <copy prop="vertices" name="vs" target="_polygon1" />
      </sources>
    </map>
    <polygon vertices="$_map1" />
    </graph>
    <copy target="_polygon2" prop="vertices" assignNames="p1 p2 p3 p4" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    async function testPolygons({ vertices, transX, transY }) {
      let vertices2 = vertices.map((v) => [v[0] + transX, v[1] + transY]);

      for (let i in vertices) {
        let ind = Number(i) + 1;
        cy.get(`#${cesc2("/p" + ind)} .mjx-mrow`).should(
          "contain.text",
          `(${nInDOM(
            Math.round(vertices2[i][0] * 100000000) / 100000000,
          ).substring(0, 6)}`,
        );
        cy.get(`#${cesc2("/p" + ind)} .mjx-mrow`).should(
          "contain.text",
          `,${nInDOM(
            Math.round(vertices2[i][1] * 100000000) / 100000000,
          ).substring(0, 6)}`,
        );
      }
      cy.get(`#${cesc2("/p" + (vertices.length + 1))}`).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.nVertices).eqls(
          vertices.length,
        );
        expect(stateVariables["/_polygon2"].stateValues.nVertices).eqls(
          vertices.length,
        );

        for (let i in vertices) {
          if (Number.isFinite(vertices[i][0])) {
            expect(
              me
                .fromAst(
                  stateVariables["/_polygon1"].stateValues.vertices[i][0],
                )
                .evaluate_to_constant(),
            ).closeTo(vertices[i][0], 1e-12);
            expect(
              me
                .fromAst(
                  stateVariables["/_polygon2"].stateValues.vertices[i][0],
                )
                .evaluate_to_constant(),
            ).closeTo(vertices2[i][0], 1e-12);
          } else {
            expect(stateVariables["/_polygon1"].stateValues.vertices[i][0]).eq(
              vertices[i][0],
            );
            expect(stateVariables["/_polygon2"].stateValues.vertices[i][0]).eq(
              vertices2[i][0],
            );
          }
          if (Number.isFinite(vertices[i][1])) {
            expect(
              me
                .fromAst(
                  stateVariables["/_polygon1"].stateValues.vertices[i][1],
                )
                .evaluate_to_constant(),
            ).closeTo(vertices[i][1], 1e-12);
            expect(
              me
                .fromAst(
                  stateVariables["/_polygon2"].stateValues.vertices[i][1],
                )
                .evaluate_to_constant(),
            ).closeTo(vertices2[i][1], 1e-12);
          } else {
            expect(stateVariables["/_polygon1"].stateValues.vertices[i][1]).eq(
              vertices[i][1],
            );
            expect(stateVariables["/_polygon2"].stateValues.vertices[i][1]).eq(
              vertices2[i][1],
            );
          }
        }
      });
    }

    let vertices = [
      [0, 0],
      [3, -4],
      [1, -6],
      [-5, -6],
    ];
    let transX = 5;
    let transY = 7;

    testPolygons({ vertices, transX, transY });

    cy.log("move points on first polygon");
    cy.window().then(async (win) => {
      vertices = [
        [1, -1],
        [-3, 2],
        [-1, 7],
        [6, 3],
      ];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: vertices,
        },
      });

      testPolygons({ vertices, transX, transY });
    });

    cy.log("move points on second polygon");
    cy.window().then(async (win) => {
      let vertices2 = [
        [-3, 4],
        [1, 0],
        [9, 6],
        [2, -1],
      ];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon2",
        args: {
          pointCoords: vertices2,
        },
      });

      vertices = vertices2.map((v) => [v[0] - transX, v[1] - transY]);

      testPolygons({ vertices, transX, transY });
    });

    cy.log("change translation");
    cy.get(cesc("#\\/transx") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/transy") + " textarea").type("{end}{backspace}10{enter}", {
      force: true,
    });
    cy.window().then(async (win) => {
      transX = 2;
      transY = 10;

      testPolygons({ vertices, transX, transY });
    });
  });

  it("parallelogram based on three points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <polygon name="parallelogram" vertices="(1,2) (3,4) (-5,6) ($(parallelogram.vertexX1_1{fixed})+$(parallelogram.vertexX3_1{fixed})-$(parallelogram.vertexX2_1), $(parallelogram.vertexX1_2{fixed})+$(parallelogram.vertexX3_2{fixed})-$(parallelogram.vertexX2_2))" />
    </graph>

    <copy target="parallelogram" prop="vertices" assignNames="p1 p2 p3 p4" />

    `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/parallelogram"].stateValues.vertices[0]).eqls(A);
      expect(stateVariables["/parallelogram"].stateValues.vertices[1]).eqls(B);
      expect(stateVariables["/parallelogram"].stateValues.vertices[2]).eqls(C);
      expect(stateVariables["/parallelogram"].stateValues.vertices[3]).eqls(D);
    });

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A[0])},${nInDOM(A[1])})`,
    );

    cy.log("move first vertex");
    cy.window().then(async (win) => {
      A = [-4, -1];
      D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/parallelogram",
        args: {
          pointCoords: { 0: A },
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/parallelogram"].stateValues.vertices[0]).eqls(
          A,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[1]).eqls(
          B,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[2]).eqls(
          C,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[3]).eqls(
          D,
        );
      });
    });

    cy.log("move second vertex");
    cy.window().then(async (win) => {
      B = [8, 9];
      D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/parallelogram",
        args: {
          pointCoords: { 1: B },
        },
      });

      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(B[0])},${nInDOM(B[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/parallelogram"].stateValues.vertices[0]).eqls(
          A,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[1]).eqls(
          B,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[2]).eqls(
          C,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[3]).eqls(
          D,
        );
      });
    });

    cy.log("move third vertex");
    cy.window().then(async (win) => {
      C = [-3, 7];
      D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/parallelogram",
        args: {
          pointCoords: { 2: C },
        },
      });

      cy.get(cesc("#\\/p3") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(C[0])},${nInDOM(C[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/parallelogram"].stateValues.vertices[0]).eqls(
          A,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[1]).eqls(
          B,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[2]).eqls(
          C,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[3]).eqls(
          D,
        );
      });
    });

    cy.log("move fourth vertex");
    cy.window().then(async (win) => {
      D = [7, 0];
      B = [A[0] + C[0] - D[0], A[1] + C[1] - D[1]];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/parallelogram",
        args: {
          pointCoords: { 3: D },
        },
      });

      cy.get(cesc("#\\/p4") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(D[0])},${nInDOM(D[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/parallelogram"].stateValues.vertices[0]).eqls(
          A,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[1]).eqls(
          B,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[2]).eqls(
          C,
        );
        expect(stateVariables["/parallelogram"].stateValues.vertices[3]).eqls(
          D,
        );
      });
    });
  });

  it("new polygon from copied vertices, some flipped", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <polygon vertices="(-9,6)(-3,7)(4,0)(8,5)" />
  </graph>
  <graph>
    <polygon vertices="$(_polygon1.vertex1) ($(_polygon1.vertexX2_2), $(_polygon1.vertexX2_1)) $(_polygon1.vertex3) ($(_polygon1.vertexX4_2), $(_polygon1.vertexX4_1))" />
  </graph>
  <copy target="_polygon2" prop="vertices" assignNames="p1 p2 p3 p4" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    async function testPolygons({ vertices }) {
      let vertices2 = [...vertices];
      vertices2[1] = [vertices2[1][1], vertices2[1][0]];
      vertices2[3] = [vertices2[3][1], vertices2[3][0]];

      for (let i in vertices) {
        let ind = Number(i) + 1;
        cy.get(`#${cesc2("/p" + ind)} .mjx-mrow`).should(
          "contain.text",
          `(${nInDOM(
            Math.round(vertices2[i][0] * 100000000) / 100000000,
          ).substring(0, 6)}`,
        );
        cy.get(`#${cesc2("/p" + ind)} .mjx-mrow`).should(
          "contain.text",
          `,${nInDOM(
            Math.round(vertices2[i][1] * 100000000) / 100000000,
          ).substring(0, 6)}`,
        );
      }
      cy.get(`#${cesc2("/p" + (vertices.length + 1))}`).should("not.exist");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.nVertices).eqls(
          vertices.length,
        );
        expect(stateVariables["/_polygon2"].stateValues.nVertices).eqls(
          vertices.length,
        );

        for (let i in vertices) {
          if (Number.isFinite(vertices[i][0])) {
            expect(
              me
                .fromAst(
                  stateVariables["/_polygon1"].stateValues.vertices[i][0],
                )
                .evaluate_to_constant(),
            ).closeTo(vertices[i][0], 1e-12);
            expect(
              me
                .fromAst(
                  stateVariables["/_polygon2"].stateValues.vertices[i][0],
                )
                .evaluate_to_constant(),
            ).closeTo(vertices2[i][0], 1e-12);
          } else {
            expect(stateVariables["/_polygon1"].stateValues.vertices[i][0]).eq(
              vertices[i][0],
            );
            expect(stateVariables["/_polygon2"].stateValues.vertices[i][0]).eq(
              vertices2[i][0],
            );
          }
          if (Number.isFinite(vertices[i][1])) {
            expect(
              me
                .fromAst(
                  stateVariables["/_polygon1"].stateValues.vertices[i][1],
                )
                .evaluate_to_constant(),
            ).closeTo(vertices[i][1], 1e-12);
            expect(
              me
                .fromAst(
                  stateVariables["/_polygon2"].stateValues.vertices[i][1],
                )
                .evaluate_to_constant(),
            ).closeTo(vertices2[i][1], 1e-12);
          } else {
            expect(stateVariables["/_polygon1"].stateValues.vertices[i][1]).eq(
              vertices[i][1],
            );
            expect(stateVariables["/_polygon2"].stateValues.vertices[i][1]).eq(
              vertices2[i][1],
            );
          }
        }
      });
    }

    let vertices = [
      [-9, 6],
      [-3, 7],
      [4, 0],
      [8, 5],
    ];

    testPolygons({ vertices });

    cy.log("move first polygon verticies");
    cy.window().then(async (win) => {
      vertices = [
        [7, 2],
        [1, -3],
        [2, 9],
        [-4, -3],
      ];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: vertices,
        },
      });

      testPolygons({ vertices });
    });

    cy.log("move second polygon verticies");
    cy.window().then(async (win) => {
      let vertices2 = [
        [-1, 9],
        [5, 7],
        [-8, 1],
        [-7, 6],
      ];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon2",
        args: {
          pointCoords: vertices2,
        },
      });

      vertices = [...vertices2];
      vertices[1] = [vertices[1][1], vertices[1][0]];
      vertices[3] = [vertices[3][1], vertices[3][0]];

      testPolygons({ vertices });
    });
  });

  it("four vertex polygon based on three points", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <polygon vertices="(1,2) (3,4) (-5,6) ($(_polygon1.vertexX3_1{fixed})+$(_polygon1.vertexX2_1{fixed})-$(_polygon1.vertexX1_1), $(_polygon1.vertexX3_2{fixed})+$(_polygon1.vertexX2_2{fixed})-$(_polygon1.vertexX1_2))" />
  </graph>
  <copy target="_polygon1" prop="vertices" assignNames="p1 p2 p3 p4" />

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A[0])},${nInDOM(A[1])})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
      expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
      expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
      expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(D);
    });

    cy.log("move first vertex");
    cy.window().then(async (win) => {
      A = [-4, -1];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 0: A },
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(D);
      });
    });

    cy.log("move second vertex");
    cy.window().then(async (win) => {
      B = [8, 9];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 1: B },
        },
      });

      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(B[0])},${nInDOM(B[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(D);
      });
    });

    cy.log("move third vertex");
    cy.window().then(async (win) => {
      C = [-3, 7];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 2: C },
        },
      });

      cy.get(cesc("#\\/p3") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(C[0])},${nInDOM(C[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(D);
      });
    });

    cy.log("move fourth vertex");
    cy.window().then(async (win) => {
      D = [7, 0];
      A = [C[0] + B[0] - D[0], C[1] + B[1] - D[1]];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 3: D },
        },
      });

      cy.get(cesc("#\\/p4") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(D[0])},${nInDOM(D[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(D);
      });
    });
  });

  it("fourth vertex depends on internal copy of first vertex", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <polygon vertices="(1,2) (3,4)(-5,6) $(_polygon1.vertex1{createComponentOfType='point'})" />
  </graph>
  <copy target="_polygon1" prop="vertices" assignNames="p1 p2 p3 p4" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A[0])},${nInDOM(A[1])})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_polygon1"].stateValues.nVertices).eq(4);
      expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
      expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
      expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
      expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
    });

    cy.log("move first vertex");
    cy.window().then(async (win) => {
      A = [-4, -1];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 0: A },
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
      });
    });

    cy.log("move second vertex");
    cy.window().then(async (win) => {
      B = [8, 9];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 1: B },
        },
      });

      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(B[0])},${nInDOM(B[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
      });
    });

    cy.log("move third vertex");
    cy.window().then(async (win) => {
      C = [-3, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 2: C },
        },
      });

      cy.get(cesc("#\\/p3") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(C[0])},${nInDOM(C[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
      });
    });

    cy.log("move fourth vertex");
    cy.window().then(async (win) => {
      A = [7, 0];
      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 3: A },
        },
      });

      cy.get(cesc("#\\/p4") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
      });
    });
  });

  it("first vertex depends on internal copy of fourth vertex", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <polygon vertices="$(_polygon1.vertex4{ createComponentOfType='point' }) (3,4) (-5,6) (1,2)" />
  </graph>
  <copy target="_polygon1" prop="vertices" assignNames="p1 p2 p3 p4" />
  
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A[0])},${nInDOM(A[1])})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_polygon1"].stateValues.nVertices).eq(4);
      expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
      expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
      expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
      expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
    });

    cy.log("move first vertex");
    cy.window().then(async (win) => {
      A = [-4, -1];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 0: A },
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
      });
    });

    cy.log("move second vertex");
    cy.window().then(async (win) => {
      B = [8, 9];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 1: B },
        },
      });

      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(B[0])},${nInDOM(B[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
      });
    });

    cy.log("move third vertex");
    cy.window().then(async (win) => {
      C = [-3, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 2: C },
        },
      });

      cy.get(cesc("#\\/p3") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(C[0])},${nInDOM(C[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
      });
    });

    cy.log("move fourth vertex");
    cy.window().then(async (win) => {
      A = [7, 0];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 3: A },
        },
      });

      cy.get(cesc("#\\/p4") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
      });
    });
  });

  it("first vertex depends fourth, formula for fifth", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <polygon vertices="$(_polygon1.vertex4{createComponentOfType='point'}) (3,4)(-5,6) (1,2) ($(_polygon1.vertexX1_1)+1,2)" />
  </graph>
  <copy target="_polygon1" prop="vertices" assignNames="p1 p2 p3 p4 p5" />
  
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [A[0] + 1, 2];

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A[0])},${nInDOM(A[1])})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
      expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
      expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
      expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
      expect(stateVariables["/_polygon1"].stateValues.vertices[4]).eqls(D);
    });

    cy.log("move first vertex");
    cy.window().then(async (win) => {
      A = [-4, -1];
      D[0] = A[0] + 1;

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 0: A },
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[4]).eqls(D);
      });
    });

    cy.log("move second vertex");
    cy.window().then(async (win) => {
      B = [8, 9];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 1: B },
        },
      });

      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(B[0])},${nInDOM(B[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[4]).eqls(D);
      });
    });

    cy.log("move third vertex");
    cy.window().then(async (win) => {
      C = [-3, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 2: C },
        },
      });

      cy.get(cesc("#\\/p3") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(C[0])},${nInDOM(C[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[4]).eqls(D);
      });
    });

    cy.log("move fourth vertex");
    cy.window().then(async (win) => {
      A = [7, 0];
      D[0] = A[0] + 1;

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 3: A },
        },
      });

      cy.get(cesc("#\\/p4") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[4]).eqls(D);
      });
    });

    cy.log("move fifth vertex");
    cy.window().then(async (win) => {
      D = [-5, 9];
      A[0] = D[0] - 1;

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 4: D },
        },
      });

      cy.get(cesc("#\\/p5") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(D[0])},${nInDOM(D[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_polygon1"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/_polygon1"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/_polygon1"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/_polygon1"].stateValues.vertices[4]).eqls(D);
      });
    });
  });

  it("first, fourth, seventh vertex depends on fourth, seventh, tenth", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <polygon name="P" vertices="$(P.vertex4{createComponentOfType='point'}) (1,2) (3,4) $(P.vertex7{createComponentOfType='point'}) (5,7) (-5,7) $(P.vertex10{createComponentOfType='point'}) (3,1) (5,0) (-5,-1)" />
  </graph>
  <copy target="P" prop="vertices" assignNames="p1 p2 p3 p4 p5 p6 p7 p8 p9 p10" />
  
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let A = [-5, -1];
    let B = [1, 2];
    let C = [3, 4];
    let D = [5, 7];
    let E = [-5, 7];
    let F = [3, 1];
    let G = [5, 0];

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A[0])},${nInDOM(A[1])})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A);
      expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
      expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
      expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A);
      expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
      expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
      expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A);
      expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
      expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
      expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
    });

    cy.log("move first vertex");
    cy.window().then(async (win) => {
      A = [-4, -9];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 0: A },
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move second vertex");
    cy.window().then(async (win) => {
      B = [8, 9];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 1: B },
        },
      });

      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(B[0])},${nInDOM(B[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move third vertex");
    cy.window().then(async (win) => {
      C = [-3, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 2: C },
        },
      });

      cy.get(cesc("#\\/p3") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(C[0])},${nInDOM(C[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move fourth vertex");
    cy.window().then(async (win) => {
      A = [7, 0];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 3: A },
        },
      });

      cy.get(cesc("#\\/p4") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move fifth vertex");
    cy.window().then(async (win) => {
      D = [-9, 1];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 4: D },
        },
      });

      cy.get(cesc("#\\/p5") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(D[0])},${nInDOM(D[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move sixth vertex");
    cy.window().then(async (win) => {
      E = [-3, 6];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 5: E },
        },
      });

      cy.get(cesc("#\\/p6") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(E[0])},${nInDOM(E[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move seventh vertex");
    cy.window().then(async (win) => {
      A = [2, -4];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 6: A },
        },
      });

      cy.get(cesc("#\\/p7") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move eighth vertex");
    cy.window().then(async (win) => {
      F = [6, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 7: F },
        },
      });

      cy.get(cesc("#\\/p8") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(F[0])},${nInDOM(F[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move nineth vertex");
    cy.window().then(async (win) => {
      G = [1, -8];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 8: G },
        },
      });

      cy.get(cesc("#\\/p9") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(G[0])},${nInDOM(G[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move tenth vertex");
    cy.window().then(async (win) => {
      A = [-6, 10];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 9: A },
        },
      });

      cy.get(cesc("#\\/p10") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });
  });

  it("first, fourth, seventh vertex depends on shifted fourth, seventh, tenth", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <polygon name="P" vertices="($(P.vertexX4_1)+1,$(P.vertexX4_2)+1) (1,2) (3,4) ($(P.vertexX7_1)+1,$(P.vertexX7_2)+1) (5,7) (-5,7) ($(P.vertexX10_1)+1,$(P.vertexX10_2)+1) (3,1) (5,0) (-5,-1)" />
  </graph>
  <copy target="P" prop="vertices" assignNames="p1 p2 p3 p4 p5 p6 p7 p8 p9 p10" />
  
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let A = [-5, -1];
    let B = [1, 2];
    let C = [3, 4];
    let D = [5, 7];
    let E = [-5, 7];
    let F = [3, 1];
    let G = [5, 0];
    let A1 = [A[0] + 1, A[1] + 1];
    let A2 = [A[0] + 2, A[1] + 2];
    let A3 = [A[0] + 3, A[1] + 3];

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(A3[0])},${nInDOM(A3[1])})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A3);
      expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
      expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
      expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A2);
      expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
      expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
      expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A1);
      expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
      expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
      expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
    });

    cy.log("move first vertex");
    cy.window().then(async (win) => {
      A = [-4, -9];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 0: A3 },
        },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A3[0])},${nInDOM(A3[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A3);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A2);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A1);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move second vertex");
    cy.window().then(async (win) => {
      B = [8, 9];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 1: B },
        },
      });

      cy.get(cesc("#\\/p2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(B[0])},${nInDOM(B[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A3);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A2);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A1);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move third vertex");
    cy.window().then(async (win) => {
      C = [-3, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 2: C },
        },
      });

      cy.get(cesc("#\\/p3") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(C[0])},${nInDOM(C[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A3);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A2);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A1);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move fourth vertex");
    cy.window().then(async (win) => {
      A = [7, 0];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 3: A2 },
        },
      });

      cy.get(cesc("#\\/p4") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A2[0])},${nInDOM(A2[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A3);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A2);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A1);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move fifth vertex");
    cy.window().then(async (win) => {
      D = [-9, 1];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 4: D },
        },
      });

      cy.get(cesc("#\\/p5") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(D[0])},${nInDOM(D[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A3);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A2);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A1);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move sixth vertex");
    cy.window().then(async (win) => {
      E = [-3, 6];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 5: E },
        },
      });

      cy.get(cesc("#\\/p6") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(E[0])},${nInDOM(E[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A3);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A2);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A1);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move seventh vertex");
    cy.window().then(async (win) => {
      A = [2, -4];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 6: A1 },
        },
      });

      cy.get(cesc("#\\/p7") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A1[0])},${nInDOM(A1[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A3);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A2);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A1);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move eighth vertex");
    cy.window().then(async (win) => {
      F = [6, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 7: F },
        },
      });

      cy.get(cesc("#\\/p8") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(F[0])},${nInDOM(F[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A3);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A2);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A1);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move nineth vertex");
    cy.window().then(async (win) => {
      G = [1, -8];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 8: G },
        },
      });

      cy.get(cesc("#\\/p9") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(G[0])},${nInDOM(G[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A3);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A2);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A1);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });

    cy.log("move tenth vertex");
    cy.window().then(async (win) => {
      A = [-6, 7];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/P",
        args: {
          pointCoords: { 9: A },
        },
      });

      cy.get(cesc("#\\/p10") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(A[0])},${nInDOM(A[1])})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/P"].stateValues.vertices[0]).eqls(A3);
        expect(stateVariables["/P"].stateValues.vertices[1]).eqls(B);
        expect(stateVariables["/P"].stateValues.vertices[2]).eqls(C);
        expect(stateVariables["/P"].stateValues.vertices[3]).eqls(A2);
        expect(stateVariables["/P"].stateValues.vertices[4]).eqls(D);
        expect(stateVariables["/P"].stateValues.vertices[5]).eqls(E);
        expect(stateVariables["/P"].stateValues.vertices[6]).eqls(A1);
        expect(stateVariables["/P"].stateValues.vertices[7]).eqls(F);
        expect(stateVariables["/P"].stateValues.vertices[8]).eqls(G);
        expect(stateVariables["/P"].stateValues.vertices[9]).eqls(A);
      });
    });
  });

  it("attract to polygon", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <polygon vertices=" (3,5) (-4,-1)(5,2)" />
    <point x="7" y="8">
      <constraints>
        <attractTo><copy target="_polygon1" /></attractTo>
      </constraints>
    </point>
  </graph>
  <copy target="_point1" assignNames="p1" />
  <copy target="_polygon1" prop="vertices" assignNames="v1 v2 v3" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let x1 = 3,
      x2 = -4,
      x3 = 5;
    let y1 = 5,
      y2 = -1,
      y3 = 2;

    cy.log("point originally not attracted");

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", `(7,8)`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        7,
        8,
      ]);
    });

    cy.log("move point near segment 1");
    cy.window().then(async (win) => {
      let x = 1;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", `(1.14`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);
      });
    });

    cy.log("move point near segment 2");
    cy.window().then(async (win) => {
      let x = 3;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.4;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", `(3.12`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);
      });
    });

    cy.log("move point near segment between first and last vertices");
    cy.window().then(async (win) => {
      let x = 4;
      let mseg3 = (y1 - y3) / (x1 - x3);
      let y = mseg3 * (x - x3) + y3 + 0.2;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", `(3.90`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(py).closeTo(mseg3 * (px - x3) + y3, 1e-6);
      });
    });

    cy.log("move point just past first vertex");
    cy.window().then(async (win) => {
      let x = x1 + 0.2;
      let y = y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", `(3,5)`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);
      });
    });

    cy.log("point not attracted along extension of first segment");
    cy.window().then(async (win) => {
      let x = 4;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", `(4,`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);
      });
    });

    cy.window().then(async (win) => {
      let x = -5;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-5)},`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);
      });
    });

    cy.log("move point just past second vertex");
    cy.window().then(async (win) => {
      let x = x2 - 0.2;
      let y = y2 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-4)},`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);
      });
    });

    cy.log("point not attracted along extension of second segment");
    cy.window().then(async (win) => {
      let x = 6;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", `(6,`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);
      });
    });

    cy.window().then(async (win) => {
      let x = -5;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-5)},`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x, 1e-6);
        expect(py).closeTo(y, 1e-6);
      });
    });

    cy.log("move polygon so point attracts to first segment");
    cy.window().then(async (win) => {
      let moveX = -3;
      let moveY = -2;

      x1 += moveX;
      x2 += moveX;
      x3 += moveX;
      y1 += moveY;
      y2 += moveY;
      y3 += moveY;

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: [
            [x1, y1],
            [x2, y2],
            [x3, y3],
          ],
        },
      });

      cy.get(cesc("#\\/v1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        let mseg1 = (y2 - y1) / (x2 - x1);

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);
      });
    });

    cy.log("move second vertex so point attracts to second segment");
    cy.window().then(async (win) => {
      let moveX = -1;
      let moveY = 1;

      x2 += moveX;
      y2 += moveY;

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 1: [x2, y2] },
        },
      });

      cy.get(cesc("#\\/v2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        let mseg2 = (y2 - y3) / (x2 - x3);

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);
      });
    });
  });

  it("constrain to polygon", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <polygon vertices=" (3,5) (-4,-1)(5,2)" />
    <point x="7" y="8">
      <constraints>
        <constrainTo><copy target="_polygon1" /></constrainTo>
      </constraints>
    </point>
  </graph>
  <copy target="_point1" assignNames="p1" />
  <copy target="_polygon1" prop="vertices" assignNames="v1 v2 v3" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let x1 = 3,
      x2 = -4,
      x3 = 5;
    let y1 = 5,
      y2 = -1,
      y3 = 2;

    cy.log("point originally constrained");

    cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
      "contain.text",
      `(${x1},${y1})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_point1"].stateValues.coords).eqls([
        "vector",
        x1,
        y1,
      ]);
    });

    cy.log("move point near segment 1");
    cy.window().then(async (win) => {
      let x = 1;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", `(1.14`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);
      });
    });

    cy.log("move point near segment 2");
    cy.window().then(async (win) => {
      let x = 3;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.4;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", `(3.12`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);
      });
    });

    cy.log("move point near segment between first and last vertices");
    cy.window().then(async (win) => {
      let x = 4;
      let mseg3 = (y1 - y3) / (x1 - x3);
      let y = mseg3 * (x - x3) + y3 + 0.2;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", `(3.90`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(py).closeTo(mseg3 * (px - x3) + y3, 1e-6);
      });
    });

    cy.log("move point just past first vertex");
    cy.window().then(async (win) => {
      let x = x1 + 0.2;
      let y = y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should("contain.text", `(3,5)`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);
      });
    });

    cy.log("point along extension of first segment constrained to endpoint");
    cy.window().then(async (win) => {
      let x = 4;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x1, 1e-6);
        expect(py).closeTo(y1, 1e-6);
      });
    });

    cy.window().then(async (win) => {
      let x = -5;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);
      });
    });

    cy.log("move point just past second vertex");
    cy.window().then(async (win) => {
      let x = x2 - 0.2;
      let y = y2 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);
      });
    });

    cy.log("point along extension of second segment constrained to endpoint");
    cy.window().then(async (win) => {
      let x = 6;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x3)},${nInDOM(y3)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x3, 1e-6);
        expect(py).closeTo(y3, 1e-6);
      });
    });

    cy.window().then(async (win) => {
      let x = -5;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 - 0.3;

      win.callAction1({
        actionName: "movePoint",
        componentName: `/_point1`,
        args: { x, y },
      });

      cy.get(cesc("#\\/p1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        expect(px).closeTo(x2, 1e-6);
        expect(py).closeTo(y2, 1e-6);
      });
    });

    cy.log("move polygon so point constrained to first segment");
    cy.window().then(async (win) => {
      let moveX = -3;
      let moveY = -5;

      x1 += moveX;
      x2 += moveX;
      x3 += moveX;
      y1 += moveY;
      y2 += moveY;
      y3 += moveY;

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: [
            [x1, y1],
            [x2, y2],
            [x3, y3],
          ],
        },
      });

      cy.get(cesc("#\\/v1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        let mseg1 = (y2 - y1) / (x2 - x1);

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);
      });
    });

    cy.log("move second vertex so point constrained to second segment");
    cy.window().then(async (win) => {
      let moveX = -1;
      let moveY = 8;

      x2 += moveX;
      y2 += moveY;

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/_polygon1",
        args: {
          pointCoords: { 1: [x2, y2] },
        },
      });

      cy.get(cesc("#\\/v2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let px = stateVariables["/_point1"].stateValues.xs[0];
        let py = stateVariables["/_point1"].stateValues.xs[1];

        let mseg2 = (y2 - y3) / (x2 - x3);

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);
      });
    });
  });

  it("constrain to polygon, different scales from graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <polygon vertices="(-50,-0.02) (-40,0.07) (70,0.06) (10,-0.01)" name="p" />
    <point x="0" y="0.01" name="A">
      <constraints baseOnGraph="_graph1">
        <constrainTo><copy target="p" /></constrainTo>
      </constraints>
    </point>
  </graph>
  <copy target="A" assignNames="A2" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let x1 = -50,
      x2 = -40,
      x3 = 70,
      x4 = 10;
    let y1 = -0.02,
      y2 = 0.07,
      y3 = 0.06,
      y4 = -0.01;

    cy.log("point originally on segment 3");

    cy.get(cesc("#\\/A2") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(15)}`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let mseg3 = (y4 - y3) / (x4 - x3);

      let px = stateVariables["/A"].stateValues.xs[0];
      let py = stateVariables["/A"].stateValues.xs[1];

      expect(py).closeTo(mseg3 * (px - x3) + y3, 1e-6);
    });

    cy.log("move point near segment 1");
    cy.window().then(async (win) => {
      let mseg1 = (y2 - y1) / (x2 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: `/A`,
        args: { x: -20, y: 0.02 },
      });

      cy.get(cesc("#\\/A2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-45)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/A"].stateValues.xs[0];
        let py = stateVariables["/A"].stateValues.xs[1];

        expect(py).closeTo(mseg1 * (px - x1) + y1, 1e-6);
      });
    });

    cy.log("move point near segment 2");
    cy.window().then(async (win) => {
      let mseg2 = (y2 - y3) / (x2 - x3);

      win.callAction1({
        actionName: "movePoint",
        componentName: `/A`,
        args: { x: 0, y: 0.04 },
      });

      cy.get(cesc("#\\/A2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(2.3)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/A"].stateValues.xs[0];
        let py = stateVariables["/A"].stateValues.xs[1];

        expect(py).closeTo(mseg2 * (px - x2) + y2, 1e-6);
      });
    });

    cy.log("move point near segment 4");
    cy.window().then(async (win) => {
      let mseg4 = (y4 - y1) / (x4 - x1);

      win.callAction1({
        actionName: "movePoint",
        componentName: `/A`,
        args: { x: -10, y: 0.02 },
      });

      cy.get(cesc("#\\/A2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-4.5)}`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let px = stateVariables["/A"].stateValues.xs[0];
        let py = stateVariables["/A"].stateValues.xs[1];

        expect(py).closeTo(mseg4 * (px - x4) + y4, 1e-6);
      });
    });
  });

  it("fixed polygon", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <polygon vertices="(1,3) (5,7) (-2,6)" name="p" fixed />
  </graph>
  <textinput name="ti" />
  <copy prop="value" target="ti" assignNames="t" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([1, 3]);
      expect(stateVariables["/p"].stateValues.vertices[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([-2, 6]);
      expect(stateVariables["/p"].stateValues.fixed).eq(true);
    });

    cy.log("cannot move vertices");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [
            [4, 7],
            [8, 10],
            [1, 9],
          ],
        },
      });

      // to make sure waited for core to react,
      // wait for text to change from change in textinput
      cy.get(cesc("#\\/ti_input")).type("wait{enter}");
      cy.get(cesc("#\\/t")).should("have.text", "wait");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/p"].stateValues.vertices[0]).eqls([1, 3]);
        expect(stateVariables["/p"].stateValues.vertices[1]).eqls([5, 7]);
        expect(stateVariables["/p"].stateValues.vertices[2]).eqls([-2, 6]);
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
      <polygon vertices="(2,-3) (3,4) (-3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy prop="vertices" target="_polygon1" propIndex="$n" assignNames="P1 P2 P3" /></p>

    <p><copy prop="vertex2" target="_polygon1" propIndex="$n" assignNames="x" /></p>
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
    let t3x = -3,
      t3y = 4;

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
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
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
  });

  it("copy propIndex of vertices, dot and array notation", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph>
      <polygon vertices="(2,-3) (3,4) (-3,4)" />
    </graph>
 
    <p><mathinput name="n" /></p>

    <p><copy source="_polygon1.vertices[$n]" assignNames="P1 P2 P3" /></p>

    <p><copy source="_polygon1.vertex2[$n]" assignNames="x" /></p>

    <p><copy source="_polygon1.vertices[2][$n]" assignNames="xa" /></p>
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
    let t3x = -3,
      t3y = 4;

    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(t1x)},${nInDOM(t1y)})`,
    );
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
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
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/x") + " .mjx-mrow").should("not.exist");
    cy.get(cesc("#\\/xa") + " .mjx-mrow").should("not.exist");
  });

  it("changing styles", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <setup>
      <styledefinitions>
        <styledefinition stylenumber="1" lineColor="blue" fillColor="blue" lineWidth="2" lineStyle="solid" />
        <styledefinition stylenumber="2" lineColor="red" fillColor="green" lineWidth="2" lineStyle="solid" />

        <styledefinition stylenumber="3" lineColor="blue" fillColor="blue" lineWidth="5" lineStyle="solid" />
        <styledefinition stylenumber="4" lineColor="red" fillColor="green" lineWidth="1" lineStyle="dotted" />
        </styledefinitions>
    </setup>

    <graph>
      <polygon vertices="(0,0) (0,2) (2,0)" name="p1" />
      <polygon vertices="(3,0) (3,2) (5,0)" name="p2" filled />
      <polygon vertices="(0,3) (0,5) (2,3)" name="p3" stylenumber="2" />
      <polygon vertices="(3,3) (3,5) (5,3)" name="p4" stylenumber="2" filled />

      <polygon vertices="(0,-10) (0,-8) (2,-10)" name="p5" stylenumber="3"/>
      <polygon vertices="(3,-10) (3,-8) (5,-10)" name="p6" stylenumber="3" filled />
      <polygon vertices="(0,-7) (0,-5) (2,-7)" name="p7" stylenumber="4" />
      <polygon vertices="(3,-7) (3,-5) (5,-7)" name="p8" stylenumber="4" filled />

    </graph>

    <p>First polygon is $p1.styleDescription{assignNames="st1"}.  It is a $p1.styleDescriptionWithNoun{assignNames="stn1"}. 
      Its border is $p1.borderStyleDescription{assignNames="bst1"}.  Its fill is $p1.fillStyleDescription{assignNames="fst1"}.
    </p>
    <p>Second polygon is $p2.styleDescription{assignNames="st2"}.  It is a $p2.styleDescriptionWithNoun{assignNames="stn2"}. 
      Its border is $p2.borderStyleDescription{assignNames="bst2"}.  Its fill is $p2.fillStyleDescription{assignNames="fst2"}.
    </p>
    <p>Third polygon is $p3.styleDescription{assignNames="st3"}.  It is a $p3.styleDescriptionWithNoun{assignNames="stn3"}. 
      Its border is $p3.borderStyleDescription{assignNames="bst3"}.  Its fill is $p3.fillStyleDescription{assignNames="fst3"}.
    </p>
    <p>Fourth polygon is $p4.styleDescription{assignNames="st4"}.  It is a $p4.styleDescriptionWithNoun{assignNames="stn4"}. 
      Its border is $p4.borderStyleDescription{assignNames="bst4"}.  Its fill is $p4.fillStyleDescription{assignNames="fst4"}.
    </p>

    <p>Fifth polygon is $p5.styleDescription{assignNames="st5"}.  It is a $p5.styleDescriptionWithNoun{assignNames="stn5"}. 
      Its border is $p5.borderStyleDescription{assignNames="bst5"}.  Its fill is $p5.fillStyleDescription{assignNames="fst5"}.
    </p>
    <p>Sixth polygon is $p6.styleDescription{assignNames="st6"}.  It is a $p6.styleDescriptionWithNoun{assignNames="stn6"}. 
      Its border is $p6.borderStyleDescription{assignNames="bst6"}.  Its fill is $p6.fillStyleDescription{assignNames="fst6"}.
    </p>
    <p>Seventh polygon is $p7.styleDescription{assignNames="st7"}.  It is a $p7.styleDescriptionWithNoun{assignNames="stn7"}. 
      Its border is $p7.borderStyleDescription{assignNames="bst7"}.  Its fill is $p7.fillStyleDescription{assignNames="fst7"}.
    </p>
    <p>Eighth polygon is $p8.styleDescription{assignNames="st8"}.  It is a $p8.styleDescriptionWithNoun{assignNames="stn8"}. 
      Its border is $p8.borderStyleDescription{assignNames="bst8"}.  Its fill is $p8.fillStyleDescription{assignNames="fst8"}.
    </p>


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/st1")).should("have.text", "blue");
    cy.get(cesc("#\\/stn1")).should("have.text", "blue polygon");
    cy.get(cesc("#\\/bst1")).should("have.text", "blue");
    cy.get(cesc("#\\/fst1")).should("have.text", "unfilled");

    cy.get(cesc("#\\/st2")).should("have.text", "filled blue");
    cy.get(cesc("#\\/stn2")).should("have.text", "filled blue polygon");
    cy.get(cesc("#\\/bst2")).should("have.text", "blue");
    cy.get(cesc("#\\/fst2")).should("have.text", "blue");

    cy.get(cesc("#\\/st3")).should("have.text", "red");
    cy.get(cesc("#\\/stn3")).should("have.text", "red polygon");
    cy.get(cesc("#\\/bst3")).should("have.text", "red");
    cy.get(cesc("#\\/fst3")).should("have.text", "unfilled");

    cy.get(cesc("#\\/st4")).should("have.text", "filled green with red border");
    cy.get(cesc("#\\/stn4")).should(
      "have.text",
      "filled green polygon with a red border",
    );
    cy.get(cesc("#\\/bst4")).should("have.text", "red");
    cy.get(cesc("#\\/fst4")).should("have.text", "green");

    cy.get(cesc("#\\/st5")).should("have.text", "thick blue");
    cy.get(cesc("#\\/stn5")).should("have.text", "thick blue polygon");
    cy.get(cesc("#\\/bst5")).should("have.text", "thick blue");
    cy.get(cesc("#\\/fst5")).should("have.text", "unfilled");

    cy.get(cesc("#\\/st6")).should(
      "have.text",
      "filled blue with thick border",
    );
    cy.get(cesc("#\\/stn6")).should(
      "have.text",
      "filled blue polygon with a thick border",
    );
    cy.get(cesc("#\\/bst6")).should("have.text", "thick blue");
    cy.get(cesc("#\\/fst6")).should("have.text", "blue");

    cy.get(cesc("#\\/st7")).should("have.text", "thin dotted red");
    cy.get(cesc("#\\/stn7")).should("have.text", "thin dotted red polygon");
    cy.get(cesc("#\\/bst7")).should("have.text", "thin dotted red");
    cy.get(cesc("#\\/fst7")).should("have.text", "unfilled");

    cy.get(cesc("#\\/st8")).should(
      "have.text",
      "filled green with thin dotted red border",
    );
    cy.get(cesc("#\\/stn8")).should(
      "have.text",
      "filled green polygon with a thin dotted red border",
    );
    cy.get(cesc("#\\/bst8")).should("have.text", "thin dotted red");
    cy.get(cesc("#\\/fst8")).should("have.text", "green");
  });

  it("draggable, vertices draggable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <polygon vertices="(1,3) (5,7) (-2,6)" name="p" draggable="$draggable" verticesDraggable="$verticesDraggable" />
  </graph>
  <p>To wait: <booleaninput name="bi" /> <boolean copySource="bi" name="bi2" /></p>
  <p>draggable: <booleaninput name="draggable" /> <boolean copySource="p.draggable" name="d2" /></p>
  <p>vertices draggable: <booleaninput name="verticesDraggable" /> <boolean copySource="p.verticesDraggable" name="vd2" /></p>
  <p name="pvert">all vertices: $p.vertices</p>
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
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(−2,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([1, 3]);
      expect(stateVariables["/p"].stateValues.vertices[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([-2, 6]);
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
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(−2,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([1, 3]);
      expect(stateVariables["/p"].stateValues.vertices[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([-2, 6]);
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
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(−2,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([1, 3]);
      expect(stateVariables["/p"].stateValues.vertices[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([-2, 6]);
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
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(−2,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([4, 7]);
      expect(stateVariables["/p"].stateValues.vertices[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([-2, 6]);
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
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(−2,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([4, 7]);
      expect(stateVariables["/p"].stateValues.vertices[1]).eqls([5, 7]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([-2, 6]);
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
          pointCoords: { 1: [-3, 2] },
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
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(−2,6)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([4, 7]);
      expect(stateVariables["/p"].stateValues.vertices[1]).eqls([-3, 2]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([-2, 6]);
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
            [8, 10],
            [1, 9],
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
      .should("have.text", "(8,10)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(1,9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([3, 8]);
      expect(stateVariables["/p"].stateValues.vertices[1]).eqls([8, 10]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([1, 9]);
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
      .should("have.text", "(8,10)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(1,9)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([3, 8]);
      expect(stateVariables["/p"].stateValues.vertices[1]).eqls([8, 10]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([1, 9]);
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
            [9, -4],
            [0, 7],
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
      .should("have.text", "(9,−4)");
    cy.get(cesc("#\\/pvert") + " .mjx-mrow")
      .eq(4)
      .should("have.text", "(0,7)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([-4, 1]);
      expect(stateVariables["/p"].stateValues.vertices[1]).eqls([9, -4]);
      expect(stateVariables["/p"].stateValues.vertices[2]).eqls([0, 7]);
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);
    });
  });

  it("style description changes with theme", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" fillColor="brown" fillColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" fillColor="#540907" fillColorWord="dark red" fillColorDarkMode="#f0c6c5" fillColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <polygon name="A" styleNumber="1" labelIsName vertices="(0,0) (0,2) (2,0)" filled />
      <polygon name="B" styleNumber="2" labelIsName vertices="(2,2) (2,4) (4,2)" filled />
      <polygon name="C" styleNumber="5" labelIsName vertices="(4,4) (4,6) (6,4)" filled />
    </graph>
    <p name="Adescrip">Polygon A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    <p name="Aborderdescrip">A has a $A.borderStyleDescription border.</p>
    <p name="Bborderdescrip">B has a $B.borderStyleDescription border.</p>
    <p name="Cborderdescrip">C has a $C.borderStyleDescription border.</p>
    <p name="Afilldescrip">A has a $A.fillStyleDescription fill.</p>
    <p name="Bfilldescrip">B has a $B.fillStyleDescription fill.</p>
    <p name="Cfilldescrip">C has a $C.fillStyleDescription fill.</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/Adescrip")).should(
      "have.text",
      "Polygon A is filled brown with thick border.",
    );
    cy.get(cesc("#\\/Bdescrip")).should(
      "have.text",
      "B is a filled dark red polygon.",
    );
    cy.get(cesc("#\\/Cdescrip")).should(
      "have.text",
      "C is a filled black polygon with a thin border.",
    );
    cy.get(cesc("#\\/Aborderdescrip")).should(
      "have.text",
      "A has a thick brown border.",
    );
    cy.get(cesc("#\\/Bborderdescrip")).should(
      "have.text",
      "B has a dark red border.",
    );
    cy.get(cesc("#\\/Cborderdescrip")).should(
      "have.text",
      "C has a thin black border.",
    );
    cy.get(cesc("#\\/Afilldescrip")).should("have.text", "A has a brown fill.");
    cy.get(cesc("#\\/Bfilldescrip")).should(
      "have.text",
      "B has a dark red fill.",
    );
    cy.get(cesc("#\\/Cfilldescrip")).should("have.text", "C has a black fill.");

    cy.log("set dark mode");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_darkmode").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.get(cesc("#\\/Adescrip")).should(
      "have.text",
      "Polygon A is filled yellow with thick border.",
    );
    cy.get(cesc("#\\/Bdescrip")).should(
      "have.text",
      "B is a filled light red polygon.",
    );
    cy.get(cesc("#\\/Cdescrip")).should(
      "have.text",
      "C is a filled white polygon with a thin border.",
    );
    cy.get(cesc("#\\/Aborderdescrip")).should(
      "have.text",
      "A has a thick yellow border.",
    );
    cy.get(cesc("#\\/Bborderdescrip")).should(
      "have.text",
      "B has a light red border.",
    );
    cy.get(cesc("#\\/Cborderdescrip")).should(
      "have.text",
      "C has a thin white border.",
    );
    cy.get(cesc("#\\/Afilldescrip")).should(
      "have.text",
      "A has a yellow fill.",
    );
    cy.get(cesc("#\\/Bfilldescrip")).should(
      "have.text",
      "B has a light red fill.",
    );
    cy.get(cesc("#\\/Cfilldescrip")).should("have.text", "C has a white fill.");
  });

  it("One vertex constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <copy target="g1/pg" prop="vertices" assignNames="p1 p2 p3 p4" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let vertices = [
      [3, 5],
      [-4, -1],
      [6, 4],
      [-3, 4],
    ];

    testPolygonCopiedTwice({ vertices });

    cy.log("move individual vertex");
    cy.window().then(async (win) => {
      vertices[1] = [4, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/pg",
        args: {
          pointCoords: { 1: vertices[1] },
        },
      });

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("move copied polygon up and to the right");
    cy.window().then(async (win) => {
      let moveX = 4;
      let moveY = 3;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices,
        },
      });

      // adjustment due to constraint
      moveX = -1;
      moveY = 1;
      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("try to move double copied polygon down and to the right");
    cy.window().then(async (win) => {
      let moveX = 1;
      let moveY = -7;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g3/pg",
        args: {
          pointCoords: vertices,
        },
      });

      // adjustment due to constraint
      moveX = -1;
      moveY = -1;
      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      testPolygonCopiedTwice({ vertices });
    });
  });

  it("Two vertices constrained to same grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <point>(3,5)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(-4,-1)</point>
    <point>(5,2)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <copy target="g1/pg" prop="vertices" assignNames="p1 p2 p3 p4" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let vertices = [
      [3, 4],
      [-4, -1],
      [6, 4],
      [-3, 4],
    ];

    testPolygonCopiedTwice({ vertices });

    cy.log("move individual vertex");
    cy.window().then(async (win) => {
      vertices[1] = [4, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/pg",
        args: {
          pointCoords: { 1: vertices[1] },
        },
      });

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("move copied polygon up and to the right");
    cy.window().then(async (win) => {
      let moveX = 4;
      let moveY = 3;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices,
        },
      });

      // adjustment due to constraint
      moveX = -1;
      moveY = 1;
      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("try to move double copied polygon down and to the right");
    cy.window().then(async (win) => {
      let moveX = 1;
      let moveY = -7;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g3/pg",
        args: {
          pointCoords: vertices,
        },
      });

      // adjustment due to constraint
      moveX = -1;
      moveY = -1;
      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      testPolygonCopiedTwice({ vertices });
    });
  });

  it("Three vertices constrained to same grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <point>(3,5)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(-4,-1)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(5,2)
      <constraints>
        <constrainToGrid dx="3" dy="4" />
      </constraints>
    </point>
    <point>(-3,4)</point>
    <polygon vertices="$_point1 $_point2 $_point3 $_point4" name="pg" />
  </graph>
  <graph name="g2" newNamespace>
    <copy target="../g1/pg" assignNames="pg" />
  </graph>
  <copy target="g2" assignNames="g3" />
  <copy target="g1/pg" prop="vertices" assignNames="p1 p2 p3 p4" />
  `,
        },
        "*",
      );
    });
    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let vertices = [
      [3, 4],
      [-3, 0],
      [6, 4],
      [-3, 4],
    ];

    testPolygonCopiedTwice({ vertices });

    cy.log("move individual vertex");
    cy.window().then(async (win) => {
      vertices[1] = [4, 7];

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g1/pg",
        args: {
          pointCoords: { 1: vertices[1] },
        },
      });

      // adjust for constraint
      vertices[1] = [3, 8];

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("move copied polygon up and to the right");
    cy.window().then(async (win) => {
      let moveX = 4;
      let moveY = 3;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g2/pg",
        args: {
          pointCoords: vertices,
        },
      });

      // adjustment due to constraint
      moveX = -1;
      moveY = 1;
      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      testPolygonCopiedTwice({ vertices });
    });

    cy.log("try to move double copied polygon down and to the right");
    cy.window().then(async (win) => {
      let moveX = 1;
      let moveY = -7;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      win.callAction1({
        actionName: "movePolygon",
        componentName: "/g3/pg",
        args: {
          pointCoords: vertices,
        },
      });

      // adjustment due to constraint
      moveX = -1;
      moveY = -1;
      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0] + moveX;
        vertices[i][1] = vertices[i][1] + moveY;
      }

      testPolygonCopiedTwice({ vertices });
    });
  });
});
