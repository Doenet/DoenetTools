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
        nVertices: "4",
        radius: "7",
        center: "(-6,-2)",
      },
    });

    runRegularPolygonTests({
      nVertices: 4,
      vertex1: [-6 + 7, -2],
      center: [-6, -2],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify center for pentagon", () => {
    setupRegularPolygonScene({
      attributes: {
        nVertices: "5",
        center: "(-5,-3)",
      },
    });

    runRegularPolygonTests({
      nVertices: 5,
      vertex1: [-5 + 1, -3],
      center: [-5, -3],
      conservedWhenChangeNvertices: "circumradius",
    });
  });

  it("specify one vertex for square", () => {
    setupRegularPolygonScene({
      attributes: {
        nVertices: 4,
        vertices: "(2,-5)",
      },
    });

    runRegularPolygonTests({
      nVertices: 4,
      vertex1: [2, -5],
      center: [1, -5],
      conservedWhenChangeNvertices: "circumradius",
    });
  });

  it("specify two vertices for pentagon", () => {
    setupRegularPolygonScene({
      attributes: {
        nVertices: "5",
        vertices: "(2,-5) (5,1)",
      },
    });

    let nVertices = 5;

    let vertex1 = [2, -5];
    let vertex2 = [5, 1];

    let sideVector = [vertex2[0] - vertex1[0], vertex2[1] - vertex1[1]];
    let midpoint = [
      (vertex1[0] + vertex2[0]) / 2,
      (vertex1[1] + vertex2[1]) / 2,
    ];
    let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
    let inradius = sideLength / (2 * Math.tan(Math.PI / nVertices));

    let inradiusDirection = [
      -sideVector[1] / sideLength,
      sideVector[0] / sideLength,
    ];

    let center = [
      midpoint[0] + inradiusDirection[0] * inradius,
      midpoint[1] + inradiusDirection[1] * inradius,
    ];

    runRegularPolygonTests({
      nVertices,
      vertex1,
      center,
      conservedWhenChangeNvertices: "twoVertices",
    });
  });

  it("specify center and one vertex for triangle", () => {
    setupRegularPolygonScene({
      attributes: {
        nVertices: "3",
        vertices: "(2,-5)",
        center: "(-1,-3)",
      },
    });

    runRegularPolygonTests({
      nVertices: 3,
      vertex1: [2, -5],
      center: [-1, -3],
      conservedWhenChangeNvertices: "circumradius",
    });
  });

  it("specify center and two vertices for triangle, ignore second vertex", () => {
    setupRegularPolygonScene({
      attributes: {
        nVertices: "3",
        vertices: "(2,-5) (10,12)",
        center: "(-1,-3)",
      },
    });

    runRegularPolygonTests({
      nVertices: 3,
      vertex1: [2, -5],
      center: [-1, -3],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify center and vertex for triangle, ignore all size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        nVertices: "3",
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
      nVertices: 3,
      vertex1: [2, -5],
      center: [-1, -3],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify center and circumradius for triangle, ignore all other size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        nVertices: "3",
        center: "(-1,-3)",
        circumradius: "11",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runRegularPolygonTests({
      nVertices: 3,
      vertex1: [10, -3],
      center: [-1, -3],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify vertex and circumradius for triangle, ignore all other size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        nVertices: "3",
        vertices: "(2,-5)",
        circumradius: "11",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runRegularPolygonTests({
      nVertices: 3,
      vertex1: [2, -5],
      center: [-9, -5],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });
  });

  it("specify two vertices for triangle, ingnore all size attributes", () => {
    setupRegularPolygonScene({
      attributes: {
        nVertices: "3",
        vertices: "(2,-5) (5,1)",
        circumradius: "11",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    let nVertices = 3;

    let vertex1 = [2, -5];
    let vertex2 = [5, 1];

    let sideVector = [vertex2[0] - vertex1[0], vertex2[1] - vertex1[1]];
    let midpoint = [
      (vertex1[0] + vertex2[0]) / 2,
      (vertex1[1] + vertex2[1]) / 2,
    ];
    let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
    let inradius = sideLength / (2 * Math.tan(Math.PI / nVertices));

    let inradiusDirection = [
      -sideVector[1] / sideLength,
      sideVector[0] / sideLength,
    ];

    let center = [
      midpoint[0] + inradiusDirection[0] * inradius,
      midpoint[1] + inradiusDirection[1] * inradius,
    ];

    runRegularPolygonTests({
      nVertices,
      vertex1,
      center,
      conservedWhenChangeNvertices: "twoVertices",
      abbreviated: true,
    });
  });
});
