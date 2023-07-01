import {
  runRegularPolygonTests,
  setupRegularPolygonScene,
} from "../../../support/utils/regularPolygon";

describe("Regular Polygon Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("regular polygon with no parameters (gives triangle)", () => {
    setupRegularPolygonScene({
      attributes: {},
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [1, 0],
      center: [0, 0],
      conservedWhenChangeNumVertices: "circumradius",
    });
  });

  it("specify area for square", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "4",
        area: "100",
      },
    });

    runRegularPolygonTests({
      numVertices: 4,
      vertex1: [Math.sqrt(2) * 5, 0],
      center: [0, 0],
      conservedWhenChangeNumVertices: "area",
    });
  });

  it("specify sidelength, center for pentagon", () => {
    setupRegularPolygonScene({
      attributes: {
        numSides: "5",
        sideLength: "2",
        center: "(4,2)",
      },
    });

    runRegularPolygonTests({
      numVertices: 5,
      vertex1: [4 + 2 / (2 * Math.sin(Math.PI / 5)), 2],
      center: [4, 2],
      conservedWhenChangeNumVertices: "sideLength",
    });
  });

  it("specify inRadius, center for hexagon", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "6",
        inRadius: "3",
        center: "(-2,5)",
      },
    });

    runRegularPolygonTests({
      numVertices: 6,
      vertex1: [-2 + 3 / Math.cos(Math.PI / 6), 5],
      center: [-2, 5],
      conservedWhenChangeNumVertices: "inradius",
    });
  });

  it("specify apothem for heptagon", () => {
    setupRegularPolygonScene({
      attributes: {
        numSides: "7",
        apothem: "4",
      },
    });

    runRegularPolygonTests({
      numVertices: 7,
      vertex1: [0 + 4 / Math.cos(Math.PI / 7), 0],
      center: [0, 0],
      conservedWhenChangeNumVertices: "inradius",
      abbreviated: true,
    });
  });

  it("specify perimeter, center for octagon", () => {
    setupRegularPolygonScene({
      attributes: {
        numVertices: "8",
        perimeter: "20",
        center: "(-4,7)",
      },
    });

    runRegularPolygonTests({
      numVertices: 8,
      vertex1: [-4 + 20 / 8 / (2 * Math.sin(Math.PI / 8)), 7],
      center: [-4, 7],
      conservedWhenChangeNumVertices: "perimeter",
      abbreviated: true,
    });
  });

  it("specify circumradius, center for triangle", () => {
    setupRegularPolygonScene({
      attributes: {
        numSides: "3",
        circumradius: "6",
        center: "(-5,8)",
      },
    });

    runRegularPolygonTests({
      numVertices: 3,
      vertex1: [-5 + 6, 8],
      center: [-5, 8],
      conservedWhenChangeNumVertices: "circumradius",
    });
  });
});
