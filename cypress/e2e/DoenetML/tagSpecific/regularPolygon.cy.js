import { runTests, setupScene } from "./regularPolygonUtils";

describe("Regular Polygon Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("regular polygon with no parameters (gives triangle)", () => {
    setupScene({
      attributes: {},
    });

    runTests({
      nVertices: 3,
      vertex1: [1, 0],
      center: [0, 0],
      conservedWhenChangeNvertices: "circumradius",
    });
  });

  it("specify area for square", () => {
    setupScene({
      attributes: {
        nVertices: "4",
        area: "100",
      },
    });

    runTests({
      nVertices: 4,
      vertex1: [Math.sqrt(2) * 5, 0],
      center: [0, 0],
      conservedWhenChangeNvertices: "area",
    });
  });

  it("specify sidelength, center for pentegon", () => {
    setupScene({
      attributes: {
        nSides: "5",
        sideLength: "2",
        center: "(4,2)",
      },
    });

    runTests({
      nVertices: 5,
      vertex1: [4 + 2 / (2 * Math.sin(Math.PI / 5)), 2],
      center: [4, 2],
      conservedWhenChangeNvertices: "sideLength",
    });
  });

  it("specify inRadius, center for hexagon", () => {
    setupScene({
      attributes: {
        nVertices: "6",
        inRadius: "3",
        center: "(-2,5)",
      },
    });

    runTests({
      nVertices: 6,
      vertex1: [-2 + 3 / Math.cos(Math.PI / 6), 5],
      center: [-2, 5],
      conservedWhenChangeNvertices: "inradius",
    });
  });

  it("specify apothem for heptagon", () => {
    setupScene({
      attributes: {
        nSides: "7",
        apothem: "4",
      },
    });

    runTests({
      nVertices: 7,
      vertex1: [0 + 4 / Math.cos(Math.PI / 7), 0],
      center: [0, 0],
      conservedWhenChangeNvertices: "inradius",
      abbreviated: true,
    });
  });

  it("specify perimeter, center for octagon", () => {
    setupScene({
      attributes: {
        nVertices: "8",
        perimeter: "20",
        center: "(-4,7)",
      },
    });

    runTests({
      nVertices: 8,
      vertex1: [-4 + 20 / 8 / (2 * Math.sin(Math.PI / 8)), 7],
      center: [-4, 7],
      conservedWhenChangeNvertices: "perimeter",
      abbreviated: true,
    });
  });

  it("specify circumradius, center for triangle", () => {
    setupScene({
      attributes: {
        nSides: "3",
        circumradius: "6",
        center: "(-5,8)",
      },
    });

    runTests({
      nVertices: 3,
      vertex1: [-5 + 6, 8],
      center: [-5, 8],
      conservedWhenChangeNvertices: "circumradius",
    });
  });
});
