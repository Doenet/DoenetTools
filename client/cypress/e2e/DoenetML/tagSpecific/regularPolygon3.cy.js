import { cesc, cesc2 } from "../../../../src/_utils/url";
import {
  runRegularPolygonTests,
  setupRegularPolygonScene,
} from "../../../support/utils/regularPolygon";

describe("Regular Polygon Tag Tests 3", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("specify center and one vertex for triangle", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        vertices: "(2,-5)",
        center: "(-1,-3)",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [2, -5],
      center: [-1, -3],
      conservedWhenChangeNumVertices: "circumradius",
    });
  });

  it("specify center and two vertices for triangle, ignore second vertex", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        vertices: "(2,-5) (10,12)",
        center: "(-1,-3)",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [2, -5],
      center: [-1, -3],
      conservedWhenChangeNumVertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify center and vertex for triangle, ignore all size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        vertices: "(2,-5)",
        center: "(-1,-3)",
        circumradius: "11",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [2, -5],
      center: [-1, -3],
      conservedWhenChangeNumVertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify center and circumradius for triangle, ignore all other size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        center: "(-1,-3)",
        circumradius: "11",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [10, -3],
      center: [-1, -3],
      conservedWhenChangeNumVertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify vertex and circumradius for triangle, ignore all other size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        vertices: "(2,-5)",
        circumradius: "11",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [2, -5],
      center: [-9, -5],
      conservedWhenChangeNumVertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify two vertices for triangle, ingnore all size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        vertices: "(2,-5) (5,1)",
        circumradius: "11",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    let numVertices = 3;

    let vertex1 = [2, -5];
    let vertex2 = [5, 1];

    let sideVector = [vertex2[0] - vertex1[0], vertex2[1] - vertex1[1]];
    let midpoint = [
      (vertex1[0] + vertex2[0]) / 2,
      (vertex1[1] + vertex2[1]) / 2,
    ];
    let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
    let inradius = sideLength / (2 * Math.tan(Math.PI / numVertices));

    let inradiusDirection = [
      -sideVector[1] / sideLength,
      sideVector[0] / sideLength,
    ];

    let center = [
      midpoint[0] + inradiusDirection[0] * inradius,
      midpoint[1] + inradiusDirection[1] * inradius,
    ];

    runRegularPolygonTests({
      numVertices,
      vertex1,
      center,
      conservedWhenChangeNumVertices: "twoVertices",
      abbreviated: true,
    });
  });

  it("specify circumradius for triangle, ignore all other size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        circumradius: "11",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [11, 0],
      center: [0, 0],
      conservedWhenChangeNumVertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify radius for triangle, ignore all other size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        radius: "11",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [11, 0],
      center: [0, 0],
      conservedWhenChangeNumVertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify inradius for triangle, ignore all other size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [3 / Math.cos(Math.PI / 3), 0],
      center: [0, 0],
      conservedWhenChangeNumVertices: "inradius",
      abbreviated: true,
    });
  });

  it("specify center and apothem for triangle, ignore all other size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        center: "(-1,-3)",
        apothem: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [-1 + 3 / Math.cos(Math.PI / 3), -3],
      center: [-1, -3],
      conservedWhenChangeNumVertices: "inradius",
      abbreviated: true,
    });
  });

  it("specify sideLength for triangle, ignore all other size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [5 / (2 * Math.sin(Math.PI / 3)), 0],
      center: [0, 0],
      conservedWhenChangeNumVertices: "sideLength",
      abbreviated: true,
    });
  });

  it("specify center and perimeter for triangle, ignore area", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "3",
        center: "(-1,-3)",
        perimeter: "10",
        area: "99",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [-1 + 10 / (3 * 2 * Math.sin(Math.PI / 3)), -3],
      center: [-1, -3],
      conservedWhenChangeNumVertices: "perimeter",
      abbreviated: true,
    });
  });

  it("specify numVertices, ignore numSides", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "4",
        numSides: "6",
        center: "(4,1)",
      },
    });

    runRegularPolygonTests({
      numVertices: 4,
      vertex1: [5, 1],
      center: [4, 1],
      conservedWhenChangeNumVertices: "circumradius",
      abbreviated: true,
    });
  });

  it("draggable, vertices draggable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <graph>
    <regularpolygon vertices="(1,3) (5,7)" name="p" draggable="$draggable" verticesDraggable="$verticesDraggable" />
  </graph>
  <p>To wait: <booleaninput name="bi" /> <boolean copySource="bi" name="bi2" /></p>
  <p>draggable: <booleaninput name="draggable" /> <boolean copySource="p.draggable" name="d2" /></p>
  <p>vertices draggable: <booleaninput name="verticesDraggable" /> <boolean copySource="p.verticesDraggable" name="vd2" /></p>
  <p name="pvert">two vertices: $p.vertex1 $p.vertex2</p>
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.vertices[0]).eqls([4, 7]);
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
      .eq(2)
      .should("have.text", "(−3,2)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
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
            [4, 8 + Math.sqrt(3)],
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
      .should("have.text", "(5,8)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
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
          pointCoords: { 0: [9, 3] },
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
      .should("have.text", "(5,8)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
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
            [-4, 5],
            [-4 - 2 * Math.sqrt(3), 3],
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
      .should("have.text", "(−4,5)");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/p"].stateValues.draggable).eq(true);
      expect(stateVariables["/p"].stateValues.verticesDraggable).eq(false);
    });
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
    <regularPolygon numSides="5" vertices="$P $Q" name="p" />
  </graph>
  <p name="pvert">First two vertices: $p.vertex1{assignNames="v1"} $p.vertex2{assignNames="v2" displaySmallAsZero}</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,4)");
    cy.get(cesc2("#/v2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,5)");

    cy.log("move pentagon");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalVertices =
        stateVariables["/p"].stateValues.numericalVertices;

      let dx = -7;
      let dy = -5;

      let pointCoords = numericalVertices.map((v) => [v[0] + dx, v[1] + dy]);

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords,
        },
      });
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow").should("contain.text", "(−6,0)");

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−6,0)");
    cy.get(cesc2("#/v2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");
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
    <regularPolygon numSides="5" vertices="$P" center="$Q" name="p" />
  </graph>
  <p name="pvert">First two vertex: $p.vertex1{assignNames="v1"}</p>
  <p name="pcenter">Center: $p.center{assignNames="c"}</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,4)");
    cy.get(cesc2("#/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,5)");

    cy.log("move pentagon");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalVertices =
        stateVariables["/p"].stateValues.numericalVertices;

      let dx = -7;
      let dy = -5;

      let pointCoords = numericalVertices.map((v) => [v[0] + dx, v[1] + dy]);

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords,
        },
      });
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow").should("contain.text", "(−6,0)");

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−6,0)");
    cy.get(cesc2("#/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");
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
    <regularPolygon numSides="5" vertices="$P" center="$Q" name="p" />
  </graph>
  <p name="pvert">First vertex: $p.vertex1{assignNames="v1"}</p>
  <p name="pcenter">Center: $p.center{assignNames="c"}</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc2("#/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,6)");

    cy.log("move pentagon");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numericalVertices =
        stateVariables["/p"].stateValues.numericalVertices;

      let dx = -7;
      let dy = -5;

      let pointCoords = numericalVertices.map((v) => [v[0] + dx, v[1] + dy]);

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords,
        },
      });
    });

    cy.get(cesc2("#/v1") + " .mjx-mrow").should("contain.text", "(−5,−1)");

    cy.get(cesc2("#/v1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−5,−1)");
    cy.get(cesc2("#/c") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,2)");
  });
});
