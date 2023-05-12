import {
  runRegularPolygonTests,
  setupRegularPolygonScene,
} from "./regularPolygon.cy";

describe("Regular Polygon Tag Tests 2", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("specify radius for square", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "4",
        radius: "7",
        center: "(-6,-2)",
      },
    });

    runRegularPolygonTests({
      numVertices: 4,
      vertex1: [-6 + 7, -2],
      center: [-6, -2],
      conservedWhenChangeNumVertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify center for pentagon", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "5",
        center: "(-5,-3)",
      },
    });

    runRegularPolygonTests({
      numVertices: 5,
      vertex1: [-5 + 1, -3],
      center: [-5, -3],
      conservedWhenChangeNumVertices: "circumradius",
    });
  });

  it("specify one vertex for square", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: 4,
        vertices: "(2,-5)",
      },
    });

    runRegularPolygonTests({
      numVertices: 4,
      vertex1: [2, -5],
      center: [1, -5],
      conservedWhenChangeNumVertices: "circumradius",
    });
  });

  it("specify two vertices for pentagon", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "5",
        vertices: "(2,-5) (5,1)",
      },
    });

    let numVertices = 5;

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
    });
  });
});
