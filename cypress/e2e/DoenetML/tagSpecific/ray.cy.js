import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

function nInDOM(n) {
  if (n < 0) {
    return `−${Math.abs(n)}`;
  } else {
    return String(n);
  }
}

describe("Ray Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  async function testRayCopiedHTD({
    throughx,
    throughy,
    endpointx,
    endpointy,
    directionEndpointShiftx = 0,
    directionEndpointShifty = 0,
    rayName = "/_ray1",
    endpointName = "/endpoint",
    throughName = "/through",
    directionName = "/direction",
    endpointInDomName = "/endpoint2",
    throughInDomName = "/through2",
    directionInDomName = "/direction2",
  }) {
    let directionx = throughx - endpointx;
    let directiony = throughy - endpointy;

    cy.get(`#${cesc2(endpointInDomName)} .mjx-mrow`).should(
      "contain.text",
      `(${nInDOM(endpointx)},${nInDOM(endpointy)})`,
    );
    cy.get(`#${cesc2(throughInDomName)} .mjx-mrow`).should(
      "contain.text",
      `(${nInDOM(throughx)},${nInDOM(throughy)})`,
    );
    cy.get(`#${cesc2(directionInDomName)} .mjx-mrow`).should(
      "contain.text",
      `(${nInDOM(directionx)},${nInDOM(directiony)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[rayName].stateValues.endpoint).eqls([
        endpointx,
        endpointy,
      ]);
      expect(stateVariables[rayName].stateValues.through).eqls([
        throughx,
        throughy,
      ]);
      expect(stateVariables[rayName].stateValues.direction).eqls([
        directionx,
        directiony,
      ]);
      expect(stateVariables[endpointName].stateValues.xs).eqls([
        endpointx,
        endpointy,
      ]);
      expect(stateVariables[throughName].stateValues.xs).eqls([
        throughx,
        throughy,
      ]);
      expect(stateVariables[directionName].stateValues.tail).eqls([
        directionEndpointShiftx,
        directionEndpointShifty,
      ]);
      expect(stateVariables[directionName].stateValues.head).eqls([
        directionx + directionEndpointShiftx,
        directiony + directionEndpointShifty,
      ]);
      expect(stateVariables[directionName].stateValues.displacement).eqls([
        directionx,
        directiony,
      ]);
    });
  }

  it("ray with no arguments, through/endpoint/direction copied", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray/>
  </graph>

  <graph>
  <copy prop="endpoint" target="_ray1" assignNames="endpoint" />
  <copy prop="through" target="_ray1" assignNames="through" />
  <copy prop="direction" target="_ray1" assignNames="direction" />
  </graph>
  
  <copy prop="endpoint" target="_ray1" assignNames="endpoint2" />
  <copy prop="through" target="_ray1" assignNames="through2" />
  <copy prop="direction" target="_ray1" assignNames="direction2" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let endpointx = 0;
    let endpointy = 0;
    let throughx = 1;
    let throughy = 0;
    let directionEndpointShiftx = 0;
    let directionEndpointShifty = 0;

    cy.window().then(async (win) => {
      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move ray up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: {
          endpointcoords: [endpointx, endpointy],
          throughcoords: [throughx, throughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied endpoint moves ray");
    cy.window().then(async (win) => {
      let moveX = -8;
      let moveY = 4;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/endpoint",
        args: { x: endpointx, y: endpointy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied through");
    cy.window().then(async (win) => {
      throughx = -3;
      throughy = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/through",
        args: { x: throughx, y: throughy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied direction");
    cy.window().then(async (win) => {
      let directionEndpointShiftx = -4;
      let directionEndpointShifty = -5;

      let directionx = 2;
      let directiony = -3;

      throughx = endpointx + directionx;
      throughy = endpointy + directiony;

      let directionthroughx = directionEndpointShiftx + directionx;
      let directionthroughy = directionEndpointShifty + directiony;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/direction",
        args: {
          tailcoords: [directionEndpointShiftx, directionEndpointShifty],
          headcoords: [directionthroughx, directionthroughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });
  });

  it("ray with just direction, through/endpoint/direction copied", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray direction ="(-4,2)" />
  </graph>

  <graph>
  <copy prop="endpoint" target="_ray1" assignNames="endpoint" />
  <copy prop="through" target="_ray1" assignNames="through" />
  <copy prop="direction" target="_ray1" assignNames="direction" />
  </graph>
  
  <copy prop="endpoint" target="_ray1" assignNames="endpoint2" />
  <copy prop="through" target="_ray1" assignNames="through2" />
  <copy prop="direction" target="_ray1" assignNames="direction2" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let endpointx = 0;
    let endpointy = 0;
    let throughx = -4;
    let throughy = 2;
    let directionEndpointShiftx = 0;
    let directionEndpointShifty = 0;

    cy.window().then(async (win) => {
      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move ray up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: {
          endpointcoords: [endpointx, endpointy],
          throughcoords: [throughx, throughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied endpoint moves ray");
    cy.window().then(async (win) => {
      let moveX = -8;
      let moveY = 4;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/endpoint",
        args: { x: endpointx, y: endpointy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied through");
    cy.window().then(async (win) => {
      throughx = -3;
      throughy = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/through",
        args: { x: throughx, y: throughy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied direction");
    cy.window().then(async (win) => {
      let directionEndpointShiftx = -4;
      let directionEndpointShifty = -5;

      let directionx = 2;
      let directiony = -3;

      throughx = endpointx + directionx;
      throughy = endpointy + directiony;

      let directionthroughx = directionEndpointShiftx + directionx;
      let directionthroughy = directionEndpointShifty + directiony;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/direction",
        args: {
          tailcoords: [directionEndpointShiftx, directionEndpointShifty],
          headcoords: [directionthroughx, directionthroughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });
  });

  it("ray with direction and endpoint, through/endpoint/direction copied", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray direction="(-8,1)" endpoint="(4,1)" />
  </graph>

  <graph>
  <copy prop="endpoint" target="_ray1" assignNames="endpoint" />
  <copy prop="through" target="_ray1" assignNames="through" />
  <copy prop="direction" target="_ray1" assignNames="direction" />
  </graph>
  
  <copy prop="endpoint" target="_ray1" assignNames="endpoint2" />
  <copy prop="through" target="_ray1" assignNames="through2" />
  <copy prop="direction" target="_ray1" assignNames="direction2" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let endpointx = 4;
    let endpointy = 1;
    let throughx = -4;
    let throughy = 2;
    let directionEndpointShiftx = 0;
    let directionEndpointShifty = 0;

    cy.window().then(async (win) => {
      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move ray up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: {
          endpointcoords: [endpointx, endpointy],
          throughcoords: [throughx, throughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied endpoint moves ray");
    cy.window().then(async (win) => {
      let moveX = -8;
      let moveY = 4;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/endpoint",
        args: { x: endpointx, y: endpointy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied through");
    cy.window().then(async (win) => {
      throughx = -3;
      throughy = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/through",
        args: { x: throughx, y: throughy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied direction");
    cy.window().then(async (win) => {
      let directionEndpointShiftx = -4;
      let directionEndpointShifty = -5;

      let directionx = 2;
      let directiony = -3;

      throughx = endpointx + directionx;
      throughy = endpointy + directiony;

      let directionthroughx = directionEndpointShiftx + directionx;
      let directionthroughy = directionEndpointShifty + directiony;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/direction",
        args: {
          tailcoords: [directionEndpointShiftx, directionEndpointShifty],
          headcoords: [directionthroughx, directionthroughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });
  });

  it("ray with direction and through, through/endpoint/direction copied", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray direction="(-8,1)" through="(-4,2)" />
  </graph>

  <graph>
  <copy prop="endpoint" target="_ray1" assignNames="endpoint" />
  <copy prop="through" target="_ray1" assignNames="through" />
  <copy prop="direction" target="_ray1" assignNames="direction" />
  </graph>
  
  <copy prop="endpoint" target="_ray1" assignNames="endpoint2" />
  <copy prop="through" target="_ray1" assignNames="through2" />
  <copy prop="direction" target="_ray1" assignNames="direction2" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let endpointx = 4;
    let endpointy = 1;
    let throughx = -4;
    let throughy = 2;
    let directionEndpointShiftx = 0;
    let directionEndpointShifty = 0;

    cy.window().then(async (win) => {
      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move ray up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: {
          endpointcoords: [endpointx, endpointy],
          throughcoords: [throughx, throughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied through moves ray");
    cy.window().then(async (win) => {
      let moveX = -8;
      let moveY = 4;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/through",
        args: { x: throughx, y: throughy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied endpoint");
    cy.window().then(async (win) => {
      endpointx = -3;
      endpointy = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/endpoint",
        args: { x: endpointx, y: endpointy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied direction");
    cy.window().then(async (win) => {
      let directionEndpointShiftx = -4;
      let directionEndpointShifty = -5;

      let directionx = 2;
      let directiony = -3;

      endpointx = throughx - directionx;
      endpointy = throughy - directiony;

      let directionthroughx = directionEndpointShiftx + directionx;
      let directionthroughy = directionEndpointShifty + directiony;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/direction",
        args: {
          tailcoords: [directionEndpointShiftx, directionEndpointShifty],
          headcoords: [directionthroughx, directionthroughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });
  });

  it("ray with just through, through/endpoint/direction copied", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray through="(-4,2)"/>
  </graph>

  <graph>
  <copy prop="endpoint" target="_ray1" assignNames="endpoint" />
  <copy prop="through" target="_ray1" assignNames="through" />
  <copy prop="direction" target="_ray1" assignNames="direction" />
  </graph>
  
  <copy prop="endpoint" target="_ray1" assignNames="endpoint2" />
  <copy prop="through" target="_ray1" assignNames="through2" />
  <copy prop="direction" target="_ray1" assignNames="direction2" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let endpointx = 0;
    let endpointy = 0;
    let throughx = -4;
    let throughy = 2;
    let directionEndpointShiftx = 0;
    let directionEndpointShifty = 0;

    cy.window().then(async (win) => {
      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move ray up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: {
          endpointcoords: [endpointx, endpointy],
          throughcoords: [throughx, throughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied through");
    cy.window().then(async (win) => {
      throughx = -5;
      throughy = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/through",
        args: { x: throughx, y: throughy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied endpoint");
    cy.window().then(async (win) => {
      endpointx = -3;
      endpointy = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/endpoint",
        args: { x: endpointx, y: endpointy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied direction");
    cy.window().then(async (win) => {
      let directionEndpointShiftx = -4;
      let directionEndpointShifty = -5;

      let directionx = 2;
      let directiony = -3;

      throughx = endpointx + directionx;
      throughy = endpointy + directiony;

      let directionthroughx = directionEndpointShiftx + directionx;
      let directionthroughy = directionEndpointShifty + directiony;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/direction",
        args: {
          tailcoords: [directionEndpointShiftx, directionEndpointShifty],
          headcoords: [directionthroughx, directionthroughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });
  });

  it("ray with through and endpoint, through/endpoint/direction copied", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray endpoint="(4,1)" through="(-4,2)" />
  </graph>

  <graph>
  <copy prop="endpoint" target="_ray1" assignNames="endpoint" />
  <copy prop="through" target="_ray1" assignNames="through" />
  <copy prop="direction" target="_ray1" assignNames="direction" />
  </graph>
  
  <copy prop="endpoint" target="_ray1" assignNames="endpoint2" />
  <copy prop="through" target="_ray1" assignNames="through2" />
  <copy prop="direction" target="_ray1" assignNames="direction2" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let endpointx = 4;
    let endpointy = 1;
    let throughx = -4;
    let throughy = 2;
    let directionEndpointShiftx = 0;
    let directionEndpointShifty = 0;

    cy.window().then(async (win) => {
      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move ray up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: {
          endpointcoords: [endpointx, endpointy],
          throughcoords: [throughx, throughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied through");
    cy.window().then(async (win) => {
      throughx = -5;
      throughy = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/through",
        args: { x: throughx, y: throughy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied endpoint");
    cy.window().then(async (win) => {
      endpointx = -3;
      endpointy = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/endpoint",
        args: { x: endpointx, y: endpointy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied direction");
    cy.window().then(async (win) => {
      let directionEndpointShiftx = -4;
      let directionEndpointShifty = -5;

      let directionx = 2;
      let directiony = -3;

      throughx = endpointx + directionx;
      throughy = endpointy + directiony;

      let directionthroughx = directionEndpointShiftx + directionx;
      let directionthroughy = directionEndpointShifty + directiony;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/direction",
        args: {
          tailcoords: [directionEndpointShiftx, directionEndpointShifty],
          headcoords: [directionthroughx, directionthroughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });
  });

  it("ray with just endpoint, through/endpoint/direction copied", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray endpoint="(3,4)"/>
  </graph>

  <graph>
  <copy prop="endpoint" target="_ray1" assignNames="endpoint" />
  <copy prop="through" target="_ray1" assignNames="through" />
  <copy prop="direction" target="_ray1" assignNames="direction" />
  </graph>
  
  <copy prop="endpoint" target="_ray1" assignNames="endpoint2" />
  <copy prop="through" target="_ray1" assignNames="through2" />
  <copy prop="direction" target="_ray1" assignNames="direction2" />
 `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let endpointx = 3;
    let endpointy = 4;
    let throughx = 4;
    let throughy = 4;
    let directionEndpointShiftx = 0;
    let directionEndpointShifty = 0;

    cy.window().then(async (win) => {
      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move ray up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: {
          endpointcoords: [endpointx, endpointy],
          throughcoords: [throughx, throughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied endpoint moves ray");
    cy.window().then(async (win) => {
      let moveX = -8;
      let moveY = 4;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/endpoint",
        args: { x: endpointx, y: endpointy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied through");
    cy.window().then(async (win) => {
      throughx = -3;
      throughy = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/through",
        args: { x: throughx, y: throughy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied direction");
    cy.window().then(async (win) => {
      let directionEndpointShiftx = -4;
      let directionEndpointShifty = -5;

      let directionx = 2;
      let directiony = -3;

      throughx = endpointx + directionx;
      throughy = endpointy + directiony;

      let directionthroughx = directionEndpointShiftx + directionx;
      let directionthroughy = directionEndpointShifty + directiony;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/direction",
        args: {
          tailcoords: [directionEndpointShiftx, directionEndpointShifty],
          headcoords: [directionthroughx, directionthroughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });
  });

  it("copied rays", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph newNamespace name="g1">
    <ray endpoint="(-1,2)" through="(-2,3)" name="ray1" />
    <point>(-4,7)</point>
    <point>(3,5)</point>
    <ray endpoint="$_point1" through="$_point2" name="ray2" />
    <ray endpoint="(-9,-1)" through="(-3,6)" name="ray3" />
  </graph>

  <graph newNamespace name="g2">
    <copy target="/g1/ray1" assignNames="ray1" />
    <copy target="/g1/ray2" assignNames="ray2" />
    <copy target="/g1/ray3" assignNames="ray3" />
  </graph>

  <copy target="g2" assignNames="g3" />

  <copy prop="direction" target="g3/ray1" assignNames="dir1" />
  <copy prop="direction" target="g3/ray2" assignNames="dir2" />
  <copy prop="direction" target="g3/ray3" assignNames="dir3" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let ray1s = ["/g1/ray1", "/g2/ray1", "/g3/ray1"];
    let ray2s = ["/g1/ray2", "/g2/ray2", "/g3/ray2"];
    let ray3s = ["/g1/ray3", "/g2/ray3", "/g3/ray3"];

    cy.log("initial state");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let v1tx = -1;
      let v1ty = 2;
      let v1hx = -2;
      let v1hy = 3;
      let v2tx = -4;
      let v2ty = 7;
      let v2hx = 3;
      let v2hy = 5;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      for (let name of ray1s) {
        expect(stateVariables[name].stateValues.endpoint).eqls([v1tx, v1ty]);
        expect(stateVariables[name].stateValues.through).eqls([v1hx, v1hy]);
      }
      for (let name of ray2s) {
        expect(stateVariables[name].stateValues.endpoint).eqls([v2tx, v2ty]);
        expect(stateVariables[name].stateValues.through).eqls([v2hx, v2hy]);
      }
      for (let name of ray3s) {
        expect(stateVariables[name].stateValues.endpoint).eqls([v3tx, v3ty]);
        expect(stateVariables[name].stateValues.through).eqls([v3hx, v3hy]);
      }

      cy.get(cesc("#\\/dir1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(v1hx - v1tx)},${nInDOM(v1hy - v1ty)})`,
      );
    });

    cy.log("move ray1");
    cy.window().then(async (win) => {
      let v1tx = 5;
      let v1ty = -8;
      let v1hx = 4;
      let v1hy = -9;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g1/ray1",
        args: {
          endpointcoords: [v1tx, v1ty],
          throughcoords: [v1hx, v1hy],
        },
      });

      let v2tx = -4;
      let v2ty = 7;
      let v2hx = 3;
      let v2hy = 5;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get(cesc("#\\/dir1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(v1hx - v1tx)},${nInDOM(v1hy - v1ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of ray1s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.through).eqls([v1hx, v1hy]);
        }
        for (let name of ray2s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.through).eqls([v2hx, v2hy]);
        }
        for (let name of ray3s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.through).eqls([v3hx, v3hy]);
        }
      });
    });

    cy.log("move ray4");
    cy.window().then(async (win) => {
      let v1tx = 2;
      let v1ty = 6;
      let v1hx = -2;
      let v1hy = -4;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g2/ray1",
        args: {
          endpointcoords: [v1tx, v1ty],
          throughcoords: [v1hx, v1hy],
        },
      });

      let v2tx = -4;
      let v2ty = 7;
      let v2hx = 3;
      let v2hy = 5;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get(cesc("#\\/dir1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(v1hx - v1tx)},${nInDOM(v1hy - v1ty)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of ray1s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.through).eqls([v1hx, v1hy]);
        }
        for (let name of ray2s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.through).eqls([v2hx, v2hy]);
        }
        for (let name of ray3s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.through).eqls([v3hx, v3hy]);
        }
      });
    });

    cy.log("move ray7");
    cy.window().then(async (win) => {
      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g3/ray1",
        args: {
          endpointcoords: [v1tx, v1ty],
          throughcoords: [v1hx, v1hy],
        },
      });
      let v2tx = -4;
      let v2ty = 7;
      let v2hx = 3;
      let v2hy = 5;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get(cesc("#\\/dir1") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(v1hx - v1tx)},${nInDOM(v1hy - v1ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of ray1s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.through).eqls([v1hx, v1hy]);
        }
        for (let name of ray2s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.through).eqls([v2hx, v2hy]);
        }
        for (let name of ray3s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.through).eqls([v3hx, v3hy]);
        }
      });
    });

    cy.log("move ray2");
    cy.window().then(async (win) => {
      let v2tx = -4;
      let v2ty = 7;
      let v2hx = 3;
      let v2hy = 5;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g1/ray2",
        args: {
          endpointcoords: [v2tx, v2ty],
          throughcoords: [v2hx, v2hy],
        },
      });

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get(cesc("#\\/dir2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(v2hx - v2tx)},${nInDOM(v2hy - v2ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of ray1s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.through).eqls([v1hx, v1hy]);
        }
        for (let name of ray2s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.through).eqls([v2hx, v2hy]);
        }
        for (let name of ray3s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.through).eqls([v3hx, v3hy]);
        }
      });
    });

    cy.log("move ray5");
    cy.window().then(async (win) => {
      let v2tx = 6;
      let v2ty = -2;
      let v2hx = 1;
      let v2hy = -7;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g2/ray2",
        args: {
          endpointcoords: [v2tx, v2ty],
          throughcoords: [v2hx, v2hy],
        },
      });

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get(cesc("#\\/dir2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(v2hx - v2tx)},${nInDOM(v2hy - v2ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of ray1s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.through).eqls([v1hx, v1hy]);
        }
        for (let name of ray2s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.through).eqls([v2hx, v2hy]);
        }
        for (let name of ray3s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.through).eqls([v3hx, v3hy]);
        }
      });
    });

    cy.log("move ray8");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let v2tx = -3;
      let v2ty = -6;
      let v2hx = 5;
      let v2hy = -9;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g3/ray2",
        args: {
          endpointcoords: [v2tx, v2ty],
          throughcoords: [v2hx, v2hy],
        },
      });

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v3tx = -9;
      let v3ty = -1;
      let v3hx = -3;
      let v3hy = 6;

      cy.get(cesc("#\\/dir2") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(v2hx - v2tx)},${nInDOM(v2hy - v2ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of ray1s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.through).eqls([v1hx, v1hy]);
        }
        for (let name of ray2s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.through).eqls([v2hx, v2hy]);
        }
        for (let name of ray3s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.through).eqls([v3hx, v3hy]);
        }
      });
    });

    cy.log("move ray3");
    cy.window().then(async (win) => {
      let v3tx = 6;
      let v3ty = -8;
      let v3hx = -1;
      let v3hy = 0;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g1/ray3",
        args: {
          endpointcoords: [v3tx, v3ty],
          throughcoords: [v3hx, v3hy],
        },
      });

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v2ty = -6;
      let v2tx = -3;
      let v2hx = 5;
      let v2hy = -9;

      cy.get(cesc("#\\/dir3") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(v3hx - v3tx)},${nInDOM(v3hy - v3ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of ray1s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.through).eqls([v1hx, v1hy]);
        }
        for (let name of ray2s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.through).eqls([v2hx, v2hy]);
        }
        for (let name of ray3s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.through).eqls([v3hx, v3hy]);
        }
      });
    });

    cy.log("move ray6");
    cy.window().then(async (win) => {
      let v3tx = 3;
      let v3ty = 1;
      let v3hx = -7;
      let v3hy = -2;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g2/ray3",
        args: {
          endpointcoords: [v3tx, v3ty],
          throughcoords: [v3hx, v3hy],
        },
      });

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v2ty = -6;
      let v2tx = -3;
      let v2hx = 5;
      let v2hy = -9;

      cy.get(cesc("#\\/dir3") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(v3hx - v3tx)},${nInDOM(v3hy - v3ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of ray1s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.through).eqls([v1hx, v1hy]);
        }
        for (let name of ray2s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.through).eqls([v2hx, v2hy]);
        }
        for (let name of ray3s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.through).eqls([v3hx, v3hy]);
        }
      });
    });

    cy.log("move ray9");
    cy.window().then(async (win) => {
      let v3tx = -2;
      let v3ty = 7;
      let v3hx = 5;
      let v3hy = -6;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g3/ray3",
        args: {
          endpointcoords: [v3tx, v3ty],
          throughcoords: [v3hx, v3hy],
        },
      });

      let v1tx = -3;
      let v1ty = 9;
      let v1hx = 6;
      let v1hy = -8;
      let v2ty = -6;
      let v2tx = -3;
      let v2hx = 5;
      let v2hy = -9;

      cy.get(cesc("#\\/dir3") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(v3hx - v3tx)},${nInDOM(v3hy - v3ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let name of ray1s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v1tx, v1ty]);
          expect(stateVariables[name].stateValues.through).eqls([v1hx, v1hy]);
        }
        for (let name of ray2s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v2tx, v2ty]);
          expect(stateVariables[name].stateValues.through).eqls([v2hx, v2hy]);
        }
        for (let name of ray3s) {
          expect(stateVariables[name].stateValues.endpoint).eqls([v3tx, v3ty]);
          expect(stateVariables[name].stateValues.through).eqls([v3hx, v3hy]);
        }
      });
    });
  });

  it("copied rays and directions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray name="ray1" direction="(1,2)" />
  </graph>
  
  <graph>
  <copy target="ray1" assignNames="ray2" />
  </graph>

  <graph>
  <copy prop="direction" target="ray1" assignNames="dir1" />
  </graph>
    
  <graph>
  <copy prop="direction" target="ray1" assignNames="dir2" />
  </graph>


  <copy prop="direction" target="ray1" assignNames="dir1a" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let rays = ["/ray1", "/ray2"];
    let directions = ["/dir1", "/dir2"];

    cy.log("initial state");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let ray_tx = 0;
      let ray_ty = 0;
      let ray_hx = 1;
      let ray_hy = 2;
      let direction_x = ray_hx - ray_tx;
      let direction_y = ray_hy - ray_ty;
      let dendpoint_xs = [0, 0];
      let dendpoint_ys = [0, 0];
      let dthrough_xs = dendpoint_xs.map((x) => x + direction_x);
      let dthrough_ys = dendpoint_ys.map((y) => y + direction_y);

      for (let name of rays) {
        expect(stateVariables[name].stateValues.endpoint).eqls([
          ray_tx,
          ray_ty,
        ]);
        expect(stateVariables[name].stateValues.through).eqls([ray_hx, ray_hy]);
        expect(stateVariables[name].stateValues.direction).eqls([
          direction_x,
          direction_y,
        ]);
      }
      for (let i = 0; i < 2; i++) {
        let name = directions[i];
        expect(stateVariables[name].stateValues.tail).eqls([
          dendpoint_xs[i],
          dendpoint_ys[i],
        ]);
        expect(stateVariables[name].stateValues.head).eqls([
          dthrough_xs[i],
          dthrough_ys[i],
        ]);
        expect(stateVariables[name].stateValues.displacement).eqls([
          direction_x,
          direction_y,
        ]);
      }

      cy.get(cesc("#\\/dir1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(direction_x)},${nInDOM(direction_y)})`,
      );
    });

    cy.log("move rays");
    cy.window().then(async (win) => {
      let txs = [-4, 7];
      let tys = [9, 3];
      let hxs = [6, -2];
      let hys = [5, 0];

      for (let i = 0; i < 2; i++) {
        cy.window().then(async (win) => {
          let ray_tx = txs[i];
          let ray_ty = tys[i];
          let ray_hx = hxs[i];
          let ray_hy = hys[i];

          win.callAction1({
            actionName: "moveRay",
            componentName: rays[i],
            args: {
              endpointcoords: [ray_tx, ray_ty],
              throughcoords: [ray_hx, ray_hy],
            },
          });

          let direction_x = ray_hx - ray_tx;
          let direction_y = ray_hy - ray_ty;
          let dendpoint_xs = [0, 0];
          let dendpoint_ys = [0, 0];
          let dthrough_xs = dendpoint_xs.map((x) => x + direction_x);
          let dthrough_ys = dendpoint_ys.map((y) => y + direction_y);

          cy.get(cesc("#\\/dir1a") + " .mjx-mrow").should(
            "contain.text",
            `(${nInDOM(direction_x)},${nInDOM(direction_y)})`,
          );

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            for (let name of rays) {
              expect(stateVariables[name].stateValues.endpoint).eqls([
                ray_tx,
                ray_ty,
              ]);
              expect(stateVariables[name].stateValues.through).eqls([
                ray_hx,
                ray_hy,
              ]);
              expect(stateVariables[name].stateValues.direction).eqls([
                direction_x,
                direction_y,
              ]);
            }
            for (let i = 0; i < 2; i++) {
              let name = directions[i];
              expect(stateVariables[name].stateValues.tail).eqls([
                dendpoint_xs[i],
                dendpoint_ys[i],
              ]);
              expect(stateVariables[name].stateValues.head).eqls([
                dthrough_xs[i],
                dthrough_ys[i],
              ]);
              expect(stateVariables[name].stateValues.displacement).eqls([
                direction_x,
                direction_y,
              ]);
            }
          });
        });
      }
    });

    cy.log("move directions");
    cy.window().then(async (win) => {
      let ray_tx = 7;
      let ray_ty = 3;
      let dendpoint_xs = [0, 0];
      let dendpoint_ys = [0, 0];

      let txs = [7, 0];
      let tys = [-3, 4];
      let hxs = [8, -7];
      let hys = [-2, 1];

      for (let i = 0; i < 2; i++) {
        cy.window().then(async (win) => {
          let direction_x = hxs[i] - txs[i];
          let direction_y = hys[i] - tys[i];
          dendpoint_xs[i] = txs[i];
          dendpoint_ys[i] = tys[i];
          let dthrough_xs = dendpoint_xs.map((x) => x + direction_x);
          let dthrough_ys = dendpoint_ys.map((y) => y + direction_y);
          let ray_hx = ray_tx + direction_x;
          let ray_hy = ray_ty + direction_y;

          win.callAction1({
            actionName: "moveVector",
            componentName: directions[i],
            args: {
              tailcoords: [dendpoint_xs[i], dendpoint_ys[i]],
              headcoords: [dthrough_xs[i], dthrough_ys[i]],
            },
          });

          cy.get(cesc("#\\/dir1a") + " .mjx-mrow").should(
            "contain.text",
            `(${nInDOM(direction_x)},${nInDOM(direction_y)})`,
          );

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            for (let name of rays) {
              expect(stateVariables[name].stateValues.endpoint).eqls([
                ray_tx,
                ray_ty,
              ]);
              expect(stateVariables[name].stateValues.through).eqls([
                ray_hx,
                ray_hy,
              ]);
              expect(stateVariables[name].stateValues.direction).eqls([
                direction_x,
                direction_y,
              ]);
            }
            for (let j = 0; j < 2; j++) {
              let name = directions[j];
              expect(stateVariables[name].stateValues.tail).eqls([
                dendpoint_xs[j],
                dendpoint_ys[j],
              ]);
              expect(stateVariables[name].stateValues.head).eqls([
                dthrough_xs[j],
                dthrough_ys[j],
              ]);
              expect(stateVariables[name].stateValues.displacement).eqls([
                direction_x,
                direction_y,
              ]);
            }
          });
        });
      }
    });
  });

  it("constrain to ray", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <ray endpoint="$_point1" through="$_point2" />

  <point x="-5" y="2">
    <constraints>
      <constrainTo><copy target="_ray1" /></constrainTo>
    </constraints>
  </point>
  </graph>
  <copy target="_ray1" prop="direction" assignNames="dir1" />
  <copy target="_point3" assignNames="p3a" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("check initial values");

    cy.get(cesc("#\\/dir1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(2)},${nInDOM(2)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([1, 2]);
      expect(stateVariables["/_ray1"].stateValues.through).eqls([3, 4]);
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(1);
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(2);
    });

    cy.log("move ray to 45 degrees");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: {
          endpointcoords: [-4, 4],
          throughcoords: [4, -4],
        },
      });
    });

    cy.get(cesc("#\\/dir1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(8)},${nInDOM(-8)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([-4, 4]);
      expect(stateVariables["/_ray1"].stateValues.through).eqls([4, -4]);

      let xorig = -5;
      let yorig = 2;
      let temp = (xorig - yorig) / 2;
      if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(p5x, 1e-12);
      expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(p5y, 1e-12);
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
      if (temp < -4) {
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
      if (temp < -4) {
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
      if (temp < -4) {
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

  it("attract to ray", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <ray endpoint="$_point1" through="$_point2" />

  <point x="-5" y="2">
    <constraints>
      <attractTo><copy target="_ray1" /></attractTo>
    </constraints>
  </point>
  </graph>
  <copy prop="direction" target="_ray1" assignNames="dir1" />
  <copy target="_point3" assignNames="p3a" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("check initial values");

    cy.get(cesc("#\\/dir1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(2)},${nInDOM(2)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([1, 2]);
      expect(stateVariables["/_ray1"].stateValues.through).eqls([3, 4]);
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(-5);
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(2);
    });

    cy.log("move ray to 45 degrees");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: {
          endpointcoords: [-4, 4],
          throughcoords: [4, -4],
        },
      });
    });

    cy.get(cesc("#\\/dir1") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(8)},${nInDOM(-8)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([-4, 4]);
      expect(stateVariables["/_ray1"].stateValues.through).eqls([4, -4]);
      expect(stateVariables["/_point3"].stateValues.xs[0]).eq(-5);
      expect(stateVariables["/_point3"].stateValues.xs[1]).eq(2);
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
      if (temp < -4) {
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

      let temp = (xorig - yorig) / 2;
      if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get(cesc("#\\/p3a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(p5x * 100) / 100)},${nInDOM(
          Math.round(p5y * 100) / 100,
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
      let xorig = -2.4;
      let yorig = 2.8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig },
      });

      let temp = (xorig - yorig) / 2;
      if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      cy.get(cesc("#\\/p3a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(Math.round(p5x * 10) / 10)},${nInDOM(
          Math.round(p5y * 10) / 10,
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
      if (temp < -4) {
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
      let xorig = -4.4;
      let yorig = 4.5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: xorig, y: yorig },
      });

      cy.get(cesc("#\\/p3a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-4.4)},${nInDOM(4.5)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/_point3"].stateValues.xs[0]).closeTo(
          -4.4,
          1e-12,
        );
        expect(stateVariables["/_point3"].stateValues.xs[1]).closeTo(
          4.5,
          1e-12,
        );
      });
    });
  });

  it("constrain to ray, different scales from graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <ray through="(-1,-0.05)" endpoint="(1,0.05)" name="l" />
    <point x="100" y="0" name="P">
      <constraints>
        <constrainTo relativeToGraphScales><copy target="l" /></constrainTo>
      </constraints>
    </point>
  </graph>
  <copy target="P" assignNames="Pa" displayDigits="8" />
  `,
        },
        "*",
      );
    });

    // use this to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log(`point on ray, close to origin`);

    cy.get(cesc("#\\/Pa") + " .mjx-mrow").should("contain.text", `0.001`);

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
    });

    cy.get(cesc("#\\/Pa") + " .mjx-mrow").should("contain.text", `0.04`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/P"].stateValues.xs[0];
      let y = stateVariables["/P"].stateValues.xs[1];
      expect(y).lessThan(0.05);
      expect(y).greaterThan(0.04);
      expect(x).closeTo(20 * y, 1e-10);
    });

    cy.log(`move point past end`);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/P",
        args: { x: -100, y: 0.1 },
      });
    });

    cy.get(cesc("#\\/Pa") + " .mjx-mrow").should("contain.text", `0.05`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables["/P"].stateValues.xs[0];
      let y = stateVariables["/P"].stateValues.xs[1];
      expect(y).eq(0.05);
      expect(x).closeTo(20 * y, 1e-10);
    });
  });

  it("two update paths through rays", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <point name="zeroFixed" fixed>(0,0)</point>
  <mathinput name="a" prefill="2" modifyIndirectly="false" />
  <graph>
    <ray name="original" endpoint="$zeroFixed" through="(1,3)" />
  </graph>
  <graph>
    <ray name="multiplied" endpoint="$zeroFixed" through="($a$(original.throughX1), $a$(original.throughX2))" />
  </graph>
  <copy prop="direction" target='original' assignNames="o2" />
  <copy prop="direction" target='multiplied' assignNames="m2" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.log("check initial values");

    cy.get(cesc("#\\/o2") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(1)},${nInDOM(3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/original"].stateValues.through).eqls([1, 3]);
      expect(stateVariables["/multiplied"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/multiplied"].stateValues.through).eqls([2, 6]);
    });

    cy.log("move original ray");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/original",
        args: {
          throughcoords: [-5, 1],
        },
      });
    });

    cy.get(cesc("#\\/o2") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(-5)},${nInDOM(1)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/original"].stateValues.through).eqls([-5, 1]);
      expect(stateVariables["/multiplied"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/multiplied"].stateValues.through).eqls([-10, 2]);
    });

    cy.log("move multiplied ray");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/multiplied",
        args: {
          throughcoords: [6, -8],
        },
      });
    });

    cy.get(cesc("#\\/m2") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(6)},${nInDOM(-8)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/original"].stateValues.through).eqls([3, -4]);
      expect(stateVariables["/multiplied"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/multiplied"].stateValues.through).eqls([6, -8]);
    });

    cy.log("Change factor");
    cy.get(cesc("#\\/a") + " textarea").type(`{end}{backspace}-3{enter}`, {
      force: true,
    });

    cy.get(cesc("#\\/m2") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(-9)},${nInDOM(12)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/original"].stateValues.through).eqls([3, -4]);
      expect(stateVariables["/multiplied"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/multiplied"].stateValues.through).eqls([-9, 12]);
    });

    cy.log("move multiplied ray again");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/multiplied",
        args: {
          throughcoords: [-6, -3],
        },
      });
    });

    cy.get(cesc("#\\/m2") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(-6)},${nInDOM(-3)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/original"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/original"].stateValues.through).eqls([2, 1]);
      expect(stateVariables["/multiplied"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/multiplied"].stateValues.through).eqls([-6, -3]);
    });
  });

  it("combining components of through and endpoint through copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray name="v" endpoint="(1,2)" through="(-2,3)" />
  <copy prop="through" assignNames="vh" target="v" />
  <copy prop="endpoint" assignNames="vt" target="v" />
  <point name="c" x="$(vh.x)" y="$(vt.y)"/>
  </graph>
  <copy prop="direction" target="v" assignNames="va" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let tx = 1,
      ty = 2,
      hx = -2,
      hy = 3;

    cy.log("initial positions");

    cy.get(cesc("#\\/va") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(hx - tx)},${nInDOM(hy - ty)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/v"].stateValues.endpoint).eqls([tx, ty]);
      expect(stateVariables["/v"].stateValues.through).eqls([hx, hy]);
      expect(stateVariables["/v"].stateValues.direction).eqls([
        hx - tx,
        hy - ty,
      ]);

      expect(stateVariables["/vt"].stateValues.coords).eqls(["vector", tx, ty]);
      expect(stateVariables["/vh"].stateValues.coords).eqls(["vector", hx, hy]);
      expect(stateVariables["/c"].stateValues.coords).eqls(["vector", hx, ty]);
    });

    cy.log("move ray 1");
    cy.window().then(async (win) => {
      (tx = 3), (ty = -1), (hx = -4), (hy = 7);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/v",
        args: {
          throughcoords: [hx, hy],
          endpointcoords: [tx, ty],
        },
      });

      cy.get(cesc("#\\/va") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(hx - tx)},${nInDOM(hy - ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/v"].stateValues.endpoint).eqls([tx, ty]);
        expect(stateVariables["/v"].stateValues.through).eqls([hx, hy]);
        expect(stateVariables["/v"].stateValues.direction).eqls([
          hx - tx,
          hy - ty,
        ]);

        expect(stateVariables["/vt"].stateValues.coords).eqls([
          "vector",
          tx,
          ty,
        ]);
        expect(stateVariables["/vh"].stateValues.coords).eqls([
          "vector",
          hx,
          hy,
        ]);
        expect(stateVariables["/c"].stateValues.coords).eqls([
          "vector",
          hx,
          ty,
        ]);
      });
    });

    cy.log("move through point");
    cy.window().then(async (win) => {
      (hx = 2), (hy = 9);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/vh",
        args: { x: hx, y: hy },
      });

      cy.get(cesc("#\\/va") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(hx - tx)},${nInDOM(hy - ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/v"].stateValues.endpoint).eqls([tx, ty]);
        expect(stateVariables["/v"].stateValues.through).eqls([hx, hy]);
        expect(stateVariables["/v"].stateValues.direction).eqls([
          hx - tx,
          hy - ty,
        ]);

        expect(stateVariables["/vt"].stateValues.coords).eqls([
          "vector",
          tx,
          ty,
        ]);
        expect(stateVariables["/vh"].stateValues.coords).eqls([
          "vector",
          hx,
          hy,
        ]);
        expect(stateVariables["/c"].stateValues.coords).eqls([
          "vector",
          hx,
          ty,
        ]);
      });
    });

    cy.log("move endpoint point");
    cy.window().then(async (win) => {
      (tx = -3), (ty = 10);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/vt",
        args: { x: tx, y: ty },
      });

      cy.get(cesc("#\\/va") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(hx - tx)},${nInDOM(hy - ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/v"].stateValues.endpoint).eqls([tx, ty]);
        expect(stateVariables["/v"].stateValues.through).eqls([hx, hy]);
        expect(stateVariables["/v"].stateValues.direction).eqls([
          hx - tx,
          hy - ty,
        ]);

        expect(stateVariables["/vt"].stateValues.coords).eqls([
          "vector",
          tx,
          ty,
        ]);
        expect(stateVariables["/vh"].stateValues.coords).eqls([
          "vector",
          hx,
          hy,
        ]);
        expect(stateVariables["/c"].stateValues.coords).eqls([
          "vector",
          hx,
          ty,
        ]);
      });
    });

    cy.log("move combined point");
    cy.window().then(async (win) => {
      (hx = -6), (ty = 0);

      win.callAction1({
        actionName: "movePoint",
        componentName: "/c",
        args: { x: hx, y: ty },
      });

      cy.get(cesc("#\\/va") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(hx - tx)},${nInDOM(hy - ty)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/v"].stateValues.endpoint).eqls([tx, ty]);
        expect(stateVariables["/v"].stateValues.through).eqls([hx, hy]);
        expect(stateVariables["/v"].stateValues.direction).eqls([
          hx - tx,
          hy - ty,
        ]);

        expect(stateVariables["/vt"].stateValues.coords).eqls([
          "vector",
          tx,
          ty,
        ]);
        expect(stateVariables["/vh"].stateValues.coords).eqls([
          "vector",
          hx,
          hy,
        ]);
        expect(stateVariables["/c"].stateValues.coords).eqls([
          "vector",
          hx,
          ty,
        ]);
      });
    });
  });

  it("updates depending on ray definition", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point name="tvt">(1,2)</point>
  <point name="hvh">(-3,4)</point>
  <point name="dvd">(-5,-6)</point>
  <point name="tvth">(7,-8)</point>
  <point name="hvth">(-1,-2)</point>
  <point name="tvtd">(3,-4)</point>
  <point name="dvtd">(5,6)</point>
  <point name="hvhd">(-7,8)</point>
  <point name="dvhd">(9,10)</point>
  </graph>

  <graph>
  <ray name="vt" endpoint="$tvt" />
  <ray name="vh" through="$hvh" />
  <ray name="vd" direction="$dvd" />
  <ray name="vth" endpoint="$tvth" through="$hvth" />
  <ray name="vtd" endpoint="$tvtd" direction="$dvtd" />
  <ray name="vhd" through="$hvhd" direction="$dvhd" />
  </graph>

  <graph>
  <copy prop="endpoint" assignNames="tfvt" target="vt" />
  <copy prop="through" assignNames="hfvt" target="vt" />
  <copy prop="direction" assignNames="dfvt" target="vt" />

  <copy prop="endpoint" assignNames="tfvh" target="vh" />
  <copy prop="through" assignNames="hfvh" target="vh" />
  <copy prop="direction" assignNames="dfvh" target="vh" />

  <copy prop="endpoint" assignNames="tfvd" target="vd" />
  <copy prop="through" assignNames="hfvd" target="vd" />
  <copy prop="direction" assignNames="dfvd" target="vd" />

  <copy prop="endpoint" assignNames="tfvth" target="vth" />
  <copy prop="through" assignNames="hfvth" target="vth" />
  <copy prop="direction" assignNames="dfvth" target="vth" />

  <copy prop="endpoint" assignNames="tfvtd" target="vtd" />
  <copy prop="through" assignNames="hfvtd" target="vtd" />
  <copy prop="direction" assignNames="dfvtd" target="vtd" />

  <copy prop="endpoint" assignNames="tfvhd" target="vhd" />
  <copy prop="through" assignNames="hfvhd" target="vhd" />
  <copy prop="direction" assignNames="dfvhd" target="vhd" />

  </graph>

  <graph>
  <copy assignNames="vt2" target="vt" />
  <copy assignNames="vh2" target="vh" />
  <copy assignNames="vd2" target="vd" />
  <copy assignNames="vth2" target="vth" />
  <copy assignNames="vtd2" target="vtd" />
  <copy assignNames="vhd2" target="vhd" />
  </graph>

  <graph>
  <copy prop="endpoint" assignNames="tfvt2" target="vt2" />
  <copy prop="through" assignNames="hfvt2" target="vt2" />
  <copy prop="direction" assignNames="dfvt2" target="vt2" />

  <copy prop="endpoint" assignNames="tfvh2" target="vh2" />
  <copy prop="through" assignNames="hfvh2" target="vh2" />
  <copy prop="direction" assignNames="dfvh2" target="vh2" />

  <copy prop="endpoint" assignNames="tfvd2" target="vd2" />
  <copy prop="through" assignNames="hfvd2" target="vd2" />
  <copy prop="direction" assignNames="dfvd2" target="vd2" />

  <copy prop="endpoint" assignNames="tfvth2" target="vth2" />
  <copy prop="through" assignNames="hfvth2" target="vth2" />
  <copy prop="direction" assignNames="dfvth2" target="vth2" />

  <copy prop="endpoint" assignNames="tfvtd2" target="vtd2" />
  <copy prop="through" assignNames="hfvtd2" target="vtd2" />
  <copy prop="direction" assignNames="dfvtd2" target="vtd2" />

  <copy prop="endpoint" assignNames="tfvhd2" target="vhd2" />
  <copy prop="through" assignNames="hfvhd2" target="vhd2" />
  <copy prop="direction" assignNames="dfvhd2" target="vhd2" />

  </graph>

  <copy prop="head" target="dfvhd2" assignNames="dfvhd2_hdom" />
  <copy target="hfvhd2" assignNames="hfvhd2_dom" />
  <copy target="tfvhd2" assignNames="tfvhd2_dom" />
  <copy prop="through" target="vhd2" assignNames="vhd2_hdom" />
  <copy prop="endpoint" target="vhd2" assignNames="vhd2_tdom" />
  <copy prop="head" target="dfvhd" assignNames="dfvhd_hdom" />
  <copy target="hfvhd" assignNames="hfvhd_dom" />
  <copy target="tfvhd" assignNames="tfvhd_dom" />
  <copy target="dvhd" assignNames="dvhd_dom" />
  <copy target="hvhd" assignNames="hvhd_dom" />
  <copy target="tvtd" assignNames="tvtd_dom" />
  <copy prop="through" target="vhd" assignNames="vhd_hdom" />
  <copy prop="endpoint" target="vhd" assignNames="vhd_tdom" />

  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let tvt = [1, 2];
    let hvt = [2, 2];

    let hvh = [-3, 4];
    let tvh = [0, 0];

    let dvd = [-5, -6];
    let tvd = [0, 0];

    let tvth = [7, -8];
    let hvth = [-1, -2];

    let tvtd = [3, -4];
    let dvtd = [5, 6];

    let hvhd = [-7, 8];
    let dvhd = [9, 10];

    let dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
    let dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
    let hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
    let dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
    let hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];
    let tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

    cy.log("Initial configuration");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(
        me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvt]);
      expect(
        me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvh]);
      expect(
        me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...dvd]);
      expect(
        me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvth]);
      expect(
        me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvth]);
      expect(
        me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvtd]);
      expect(
        me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...dvtd]);
      expect(
        me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvhd]);
      expect(
        me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...dvhd]);

      expect(
        stateVariables["/vt"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvt]);
      expect(
        stateVariables["/vt"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvt]);
      expect(
        stateVariables["/vt"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvt]);

      expect(
        stateVariables["/vh"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvh]);
      expect(
        stateVariables["/vh"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvh]);
      expect(
        stateVariables["/vh"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvh]);

      expect(
        stateVariables["/vd"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvd]);
      expect(
        stateVariables["/vd"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvd]);
      expect(
        stateVariables["/vd"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvd]);

      expect(
        stateVariables["/vth"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvth]);
      expect(
        stateVariables["/vth"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvth]);
      expect(
        stateVariables["/vth"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvth]);

      expect(
        stateVariables["/vtd"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvtd]);
      expect(
        stateVariables["/vtd"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvtd]);
      expect(
        stateVariables["/vtd"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvtd]);

      expect(
        stateVariables["/vhd"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvhd]);
      expect(
        stateVariables["/vhd"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvhd]);
      expect(
        stateVariables["/vhd"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvhd]);

      expect(
        me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvt]);
      expect(
        me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvt]);
      expect(
        stateVariables["/dfvt"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvt]);

      expect(
        me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvh]);
      expect(
        me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvh]);
      expect(
        stateVariables["/dfvh"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvh]);

      expect(
        me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvd]);
      expect(
        me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvd]);
      expect(
        stateVariables["/dfvd"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvd]);

      expect(
        me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvth]);
      expect(
        me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvth]);
      expect(
        stateVariables["/dfvth"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvth]);

      expect(
        me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvtd]);
      expect(
        me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvtd]);
      expect(
        stateVariables["/dfvtd"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvtd]);

      expect(
        me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvhd]);
      expect(
        me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvhd]);
      expect(
        stateVariables["/dfvhd"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvhd]);

      expect(
        stateVariables["/vt2"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvt]);
      expect(
        stateVariables["/vt2"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvt]);
      expect(
        stateVariables["/vt2"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvt]);

      expect(
        stateVariables["/vh2"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvh]);
      expect(
        stateVariables["/vh2"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvh]);
      expect(
        stateVariables["/vh2"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvh]);

      expect(
        stateVariables["/vd2"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvd]);
      expect(
        stateVariables["/vd2"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvd]);
      expect(
        stateVariables["/vd2"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvd]);

      expect(
        stateVariables["/vth2"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvth]);
      expect(
        stateVariables["/vth2"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvth]);
      expect(
        stateVariables["/vth2"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvth]);

      expect(
        stateVariables["/vtd2"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvtd]);
      expect(
        stateVariables["/vtd2"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvtd]);
      expect(
        stateVariables["/vtd2"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvtd]);

      expect(
        stateVariables["/vhd2"].stateValues.endpoint.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...tvhd]);
      expect(
        stateVariables["/vhd2"].stateValues.through.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...hvhd]);
      expect(
        stateVariables["/vhd2"].stateValues.direction.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvhd]);

      expect(
        me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvt]);
      expect(
        me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvt]);
      expect(
        stateVariables["/dfvt2"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvt]);

      expect(
        me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvh]);
      expect(
        me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvh]);
      expect(
        stateVariables["/dfvh2"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvh]);

      expect(
        me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...tvd]);
      expect(
        me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify().tree,
      ).eqls(["vector", ...hvd]);
      expect(
        stateVariables["/dfvd2"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvd]);

      expect(
        me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
          .tree,
      ).eqls(["vector", ...tvth]);
      expect(
        me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
          .tree,
      ).eqls(["vector", ...hvth]);
      expect(
        stateVariables["/dfvth2"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvth]);

      expect(
        me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
          .tree,
      ).eqls(["vector", ...tvtd]);
      expect(
        me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
          .tree,
      ).eqls(["vector", ...hvtd]);
      expect(
        stateVariables["/dfvtd2"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvtd]);

      expect(
        me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
          .tree,
      ).eqls(["vector", ...tvhd]);
      expect(
        me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
          .tree,
      ).eqls(["vector", ...hvhd]);
      expect(
        stateVariables["/dfvhd2"].stateValues.displacement.map(
          (x) => me.fromAst(x).simplify().tree,
        ),
      ).eqls([...dvhd]);
    });

    cy.log("move endpoint of each ray directly");
    cy.window().then(async (win) => {
      tvt = [-3, 5];
      tvh = [9, -2];
      tvd = [0, 7];
      tvth = [-7, 4];
      tvtd = [5, -9];
      tvhd = [-1, -6];

      win.callAction1({
        actionName: "moveRay",
        componentName: "/vt",
        args: { endpointcoords: tvt },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vh",
        args: { endpointcoords: tvh },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vd",
        args: { endpointcoords: tvd },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vth",
        args: { endpointcoords: tvth },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vtd",
        args: { endpointcoords: tvtd },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vhd",
        args: { endpointcoords: tvhd },
      });

      cy.get(cesc("#\\/vhd_tdom")).should(
        "contain.text",
        `(${nInDOM(tvhd[0])},${nInDOM(tvhd[1])})`,
      );

      // since moved endpoints directly, throughs stay fixed and direction changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...hvh]);
        expect(
          me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...dvd]);
        expect(
          me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvtd]);
        expect(
          me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvhd]);

        expect(
          stateVariables["/vt"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vt2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });

    cy.log("move through of each ray directly");
    cy.window().then(async (win) => {
      hvt = [5, -1];
      hvh = [3, -6];
      hvd = [1, -9];
      hvth = [6, 2];
      hvtd = [-6, -4];
      hvhd = [-4, 8];

      win.callAction1({
        actionName: "moveRay",
        componentName: "/vt",
        args: { throughcoords: hvt },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vh",
        args: { throughcoords: hvh },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vd",
        args: { throughcoords: hvd },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vth",
        args: { throughcoords: hvth },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vtd",
        args: { throughcoords: hvtd },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vhd",
        args: { throughcoords: hvhd },
      });

      cy.get(cesc("#\\/vhd_hdom")).should(
        "contain.text",
        `(${nInDOM(hvhd[0])},${nInDOM(hvhd[1])})`,
      );

      // since moved throughs directly, endpoints stay fixed and direction changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...hvh]);
        expect(
          me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...dvd]);
        expect(
          me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvtd]);
        expect(
          me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvhd]);

        expect(
          stateVariables["/vt"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vt2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });

    cy.log("move endpoint through defining point, if exists");
    cy.window().then(async (win) => {
      tvt = [9, -1];
      tvth = [3, -2];
      tvtd = [-1, 5];

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tvt",
        args: { x: tvt[0], y: tvt[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tvth",
        args: { x: tvth[0], y: tvth[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tvtd",
        args: { x: tvtd[0], y: tvtd[1] },
      });

      cy.get(cesc("#\\/tvtd_dom")).should(
        "contain.text",
        `(${nInDOM(tvtd[0])},${nInDOM(tvtd[1])})`,
      );

      // defined by endpoint/through, through stays fixed and direction changes
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

      // defined by endpoint or endpoint and direction, direction stays fixed and through changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);

        expect(
          stateVariables["/vt"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vt2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);
      });
    });

    cy.log("move through through defining point, if exists");
    cy.window().then(async (win) => {
      hvh = [5, 3];
      hvth = [-8, -3];
      hvhd = [7, -6];

      win.callAction1({
        actionName: "movePoint",
        componentName: "/hvh",
        args: { x: hvh[0], y: hvh[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hvth",
        args: { x: hvth[0], y: hvth[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hvhd",
        args: { x: hvhd[0], y: hvhd[1] },
      });

      cy.get(cesc("#\\/hvhd_dom")).should(
        "contain.text",
        `(${nInDOM(hvhd[0])},${nInDOM(hvhd[1])})`,
      );

      // defined by through only or endpoint/through, endpoint stays fixed and direction changes
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];

      // defined by through and direction, direction stays fixed and endpoint changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...hvh]);
        expect(
          me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);

        expect(
          stateVariables["/vh"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vh2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });

    cy.log("change direction through defining point, if exists");
    cy.window().then(async (win) => {
      dvd = [-1, -2];
      dvtd = [-6, 8];
      dvhd = [3, -7];

      win.callAction1({
        actionName: "movePoint",
        componentName: "/dvd",
        args: { x: dvd[0], y: dvd[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/dvtd",
        args: { x: dvtd[0], y: dvtd[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/dvhd",
        args: { x: dvhd[0], y: dvhd[1] },
      });

      cy.get(cesc("#\\/dvhd_dom")).should(
        "contain.text",
        `(${nInDOM(dvhd[0])},${nInDOM(dvhd[1])})`,
      );

      // defined by direction only or endpoint/direction, endpoint stays fixed and through changes
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      // defined by through and direction, through stays fixed and endpoint changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...dvd]);
        expect(
          me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvtd]);
        expect(
          me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvhd]);

        expect(
          stateVariables["/vd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });

    cy.log("move endpoint of each ray through copied point");
    cy.window().then(async (win) => {
      tvt = [-5, 3];
      tvh = [7, 0];
      tvd = [-2, 1];
      tvth = [8, -8];
      tvtd = [6, 5];
      tvhd = [-3, 4];

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvt",
        args: { x: tvt[0], y: tvt[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvh",
        args: { x: tvh[0], y: tvh[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvd",
        args: { x: tvd[0], y: tvd[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvth",
        args: { x: tvth[0], y: tvth[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvtd",
        args: { x: tvtd[0], y: tvtd[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvhd",
        args: { x: tvhd[0], y: tvhd[1] },
      });

      cy.get(cesc("#\\/tfvhd_dom")).should(
        "contain.text",
        `(${nInDOM(tvhd[0])},${nInDOM(tvhd[1])})`,
      );

      // if defined by through, through stays fixed and direction changes
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      // if not defined by through,
      // direction stays fixed and through changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...hvh]);
        expect(
          me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...dvd]);
        expect(
          me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvtd]);
        expect(
          me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvhd]);

        expect(
          stateVariables["/vt"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vt2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });

    cy.log("move through of each ray through copied point");
    cy.window().then(async (win) => {
      hvt = [-1, -3];
      hvh = [7, -6];
      hvd = [-2, -5];
      hvth = [-3, 8];
      hvtd = [9, 1];
      hvhd = [-4, 4];

      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvt",
        args: { x: hvt[0], y: hvt[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvh",
        args: { x: hvh[0], y: hvh[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvd",
        args: { x: hvd[0], y: hvd[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvth",
        args: { x: hvth[0], y: hvth[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvtd",
        args: { x: hvtd[0], y: hvtd[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvhd",
        args: { x: hvhd[0], y: hvhd[1] },
      });

      cy.get(cesc("#\\/hfvhd_dom")).should(
        "contain.text",
        `(${nInDOM(hvhd[0])},${nInDOM(hvhd[1])})`,
      );

      // for most rays, endpoints stay fixed and direction changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];

      // defined by through and direction, direction stays fixed and endpoint changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...hvh]);
        expect(
          me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...dvd]);
        expect(
          me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvtd]);
        expect(
          me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvhd]);

        expect(
          stateVariables["/vt"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vt2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });

    cy.log("change direction of each ray through copied rays");
    cy.window().then(async (win) => {
      dvt = [-9, 0];
      dvh = [-3, -1];
      dvd = [-5, 5];
      dvth = [7, 3];
      dvtd = [9, -8];
      dvhd = [1, 2];

      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvt",
        args: { headcoords: dvt },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvh",
        args: { headcoords: dvh },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvd",
        args: { headcoords: dvd },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvth",
        args: { headcoords: dvth },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvtd",
        args: { headcoords: dvtd },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvhd",
        args: { headcoords: dvhd },
      });

      cy.get(cesc("#\\/dfvhd_hdom")).should(
        "contain.text",
        `(${nInDOM(dvhd[0])},${nInDOM(dvhd[1])})`,
      );

      // for most rays, endpoints stay fixed and through changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvh = [tvh[0] + dvh[0], tvh[1] + dvh[1]];
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvth = [tvth[0] + dvth[0], tvth[1] + dvth[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      // defined by through and direction, through stays fixed and endpoint changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...hvh]);
        expect(
          me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...dvd]);
        expect(
          me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvtd]);
        expect(
          me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvhd]);

        expect(
          stateVariables["/vt"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vt2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });

    cy.log("move endpoint of each copied ray directly");
    cy.window().then(async (win) => {
      tvt = [1, 8];
      tvh = [-3, 2];
      tvd = [9, -1];
      tvth = [5, -3];
      tvtd = [-4, -8];
      tvhd = [-1, 6];

      win.callAction1({
        actionName: "moveRay",
        componentName: "/vt2",
        args: { endpointcoords: tvt },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vh2",
        args: { endpointcoords: tvh },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vd2",
        args: { endpointcoords: tvd },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vth2",
        args: { endpointcoords: tvth },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vtd2",
        args: { endpointcoords: tvtd },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vhd2",
        args: { endpointcoords: tvhd },
      });

      cy.get(cesc("#\\/vhd2_tdom")).should(
        "contain.text",
        `(${nInDOM(tvhd[0])},${nInDOM(tvhd[1])})`,
      );

      // since moved endpoints directly, throughs stay fixed and direction changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...hvh]);
        expect(
          me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...dvd]);
        expect(
          me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvtd]);
        expect(
          me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvhd]);

        expect(
          stateVariables["/vt"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vt2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });

    cy.log("move through of each copied ray directly");
    cy.window().then(async (win) => {
      hvt = [-7, 2];
      hvh = [-2, 9];
      hvd = [0, -3];
      hvth = [6, 1];
      hvtd = [7, 0];
      hvhd = [-8, -4];

      win.callAction1({
        actionName: "moveRay",
        componentName: "/vt2",
        args: { throughcoords: hvt },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vh2",
        args: { throughcoords: hvh },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vd2",
        args: { throughcoords: hvd },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vth2",
        args: { throughcoords: hvth },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vtd2",
        args: { throughcoords: hvtd },
      });
      win.callAction1({
        actionName: "moveRay",
        componentName: "/vhd2",
        args: { throughcoords: hvhd },
      });

      cy.get(cesc("#\\/vhd2_hdom")).should(
        "contain.text",
        `(${nInDOM(hvhd[0])},${nInDOM(hvhd[1])})`,
      );

      // since moved throughs directly, endpoints stay fixed and direction changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...hvh]);
        expect(
          me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...dvd]);
        expect(
          me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvtd]);
        expect(
          me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvhd]);

        expect(
          stateVariables["/vt"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vt2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });

    cy.log("move endpoint of each copied ray through copied point");
    cy.window().then(async (win) => {
      tvt = [1, -1];
      tvh = [9, -9];
      tvd = [-3, 2];
      tvth = [5, 0];
      tvtd = [-1, 7];
      tvhd = [-6, 6];

      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvt2",
        args: { x: tvt[0], y: tvt[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvh2",
        args: { x: tvh[0], y: tvh[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvd2",
        args: { x: tvd[0], y: tvd[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvth2",
        args: { x: tvth[0], y: tvth[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvtd2",
        args: { x: tvtd[0], y: tvtd[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/tfvhd2",
        args: { x: tvhd[0], y: tvhd[1] },
      });

      cy.get(cesc("#\\/tfvhd2_dom")).should(
        "contain.text",
        `(${nInDOM(tvhd[0])},${nInDOM(tvhd[1])}`,
      );

      // if defined by through, through stays fixed and direction changes
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvhd = [hvhd[0] - tvhd[0], hvhd[1] - tvhd[1]];

      // if not defined by through,
      // direction stays fixed and through changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...hvh]);
        expect(
          me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...dvd]);
        expect(
          me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvtd]);
        expect(
          me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvhd]);

        expect(
          stateVariables["/vt"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vt2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });

    cy.log("move through of each copied ray through copied point");
    cy.window().then(async (win) => {
      hvt = [-6, -8];
      hvh = [2, -2];
      hvd = [0, 6];
      hvth = [-5, 4];
      hvtd = [3, 8];
      hvhd = [-1, 5];

      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvt2",
        args: { x: hvt[0], y: hvt[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvh2",
        args: { x: hvh[0], y: hvh[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvd2",
        args: { x: hvd[0], y: hvd[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvth2",
        args: { x: hvth[0], y: hvth[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvtd2",
        args: { x: hvtd[0], y: hvtd[1] },
      });
      win.callAction1({
        actionName: "movePoint",
        componentName: "/hfvhd2",
        args: { x: hvhd[0], y: hvhd[1] },
      });

      cy.get(cesc("#\\/hfvhd2_dom")).should(
        "contain.text",
        `(${nInDOM(hvhd[0])},${nInDOM(hvhd[1])})`,
      );

      // for most rays, endpoints stay fixed and direction changes
      dvt = [hvt[0] - tvt[0], hvt[1] - tvt[1]];
      dvh = [hvh[0] - tvh[0], hvh[1] - tvh[1]];
      dvd = [hvd[0] - tvd[0], hvd[1] - tvd[1]];
      dvth = [hvth[0] - tvth[0], hvth[1] - tvth[1]];
      dvtd = [hvtd[0] - tvtd[0], hvtd[1] - tvtd[1]];

      // defined by through and direction, direction stays fixed and endpoint changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...hvh]);
        expect(
          me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...dvd]);
        expect(
          me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvtd]);
        expect(
          me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvhd]);

        expect(
          stateVariables["/vt"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vt2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });

    cy.log("change direction of each copied ray through copied rays");
    cy.window().then(async (win) => {
      dvt = [-1, 7];
      dvh = [5, 9];
      dvd = [9, 2];
      dvth = [-3, -5];
      dvtd = [9, -4];
      dvhd = [-5, 3];

      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvt2",
        args: { headcoords: dvt },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvh2",
        args: { headcoords: dvh },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvd2",
        args: { headcoords: dvd },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvth2",
        args: { headcoords: dvth },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvtd2",
        args: { headcoords: dvtd },
      });
      win.callAction1({
        actionName: "moveVector",
        componentName: "/dfvhd2",
        args: { headcoords: dvhd },
      });

      cy.get(cesc("#\\/dfvhd2_hdom")).should(
        "contain.text",
        `(${nInDOM(dvhd[0])},${nInDOM(dvhd[1])})`,
      );

      // for most rays, endpoints stay fixed and through changes
      hvt = [tvt[0] + dvt[0], tvt[1] + dvt[1]];
      hvh = [tvh[0] + dvh[0], tvh[1] + dvh[1]];
      hvd = [tvd[0] + dvd[0], tvd[1] + dvd[1]];
      hvth = [tvth[0] + dvth[0], tvth[1] + dvth[1]];
      hvtd = [tvtd[0] + dvtd[0], tvtd[1] + dvtd[1]];

      // defined by through and direction, through stays fixed and endpoint changes
      tvhd = [hvhd[0] - dvhd[0], hvhd[1] - dvhd[1]];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(
          me.fromAst(stateVariables["/tvt"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hvh"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...hvh]);
        expect(
          me.fromAst(stateVariables["/dvd"].stateValues.coords).simplify().tree,
        ).eqls(["vector", ...dvd]);
        expect(
          me.fromAst(stateVariables["/tvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          me.fromAst(stateVariables["/tvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/dvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvtd]);
        expect(
          me.fromAst(stateVariables["/hvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          me.fromAst(stateVariables["/dvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...dvhd]);

        expect(
          stateVariables["/vt"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          stateVariables["/vt2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvt]);
        expect(
          stateVariables["/vt2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvt]);
        expect(
          stateVariables["/vt2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          stateVariables["/vh2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvh]);
        expect(
          stateVariables["/vh2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvh]);
        expect(
          stateVariables["/vh2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          stateVariables["/vd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvd]);
        expect(
          stateVariables["/vd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvd]);
        expect(
          stateVariables["/vd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          stateVariables["/vth2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvth]);
        expect(
          stateVariables["/vth2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvth]);
        expect(
          stateVariables["/vth2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          stateVariables["/vtd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvtd]);
        expect(
          stateVariables["/vtd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          stateVariables["/vhd2"].stateValues.endpoint.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...tvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.through.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...hvhd]);
        expect(
          stateVariables["/vhd2"].stateValues.direction.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);

        expect(
          me.fromAst(stateVariables["/tfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvt]);
        expect(
          me.fromAst(stateVariables["/hfvt2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvt]);
        expect(
          stateVariables["/dfvt2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvt]);

        expect(
          me.fromAst(stateVariables["/tfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvh]);
        expect(
          me.fromAst(stateVariables["/hfvh2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvh]);
        expect(
          stateVariables["/dfvh2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvh]);

        expect(
          me.fromAst(stateVariables["/tfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvd]);
        expect(
          me.fromAst(stateVariables["/hfvd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvd]);
        expect(
          stateVariables["/dfvd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvd]);

        expect(
          me.fromAst(stateVariables["/tfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvth]);
        expect(
          me.fromAst(stateVariables["/hfvth2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvth]);
        expect(
          stateVariables["/dfvth2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvth]);

        expect(
          me.fromAst(stateVariables["/tfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvtd]);
        expect(
          me.fromAst(stateVariables["/hfvtd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvtd]);
        expect(
          stateVariables["/dfvtd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvtd]);

        expect(
          me.fromAst(stateVariables["/tfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...tvhd]);
        expect(
          me.fromAst(stateVariables["/hfvhd2"].stateValues.coords).simplify()
            .tree,
        ).eqls(["vector", ...hvhd]);
        expect(
          stateVariables["/dfvhd2"].stateValues.displacement.map(
            (x) => me.fromAst(x).simplify().tree,
          ),
        ).eqls([...dvhd]);
      });
    });
  });

  it("three rays with mutual references", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray through="$(_ray2.through)" endpoint="(1,0)" />
  <ray endpoint="$(_ray3.endpoint)" through="(3,2)" />
  <ray through="$(_ray1.endpoint)" endpoint="(-1,4)" />
  </graph>
  <copy prop="through" target="_ray1" assignNames="v1h" />
  <copy prop="endpoint" target="_ray1" assignNames="v1t" />
  <copy prop="through" target="_ray2" assignNames="v2h" />
  <copy prop="endpoint" target="_ray2" assignNames="v2t" />
  <copy prop="through" target="_ray3" assignNames="v3h" />
  <copy prop="endpoint" target="_ray3" assignNames="v3t" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let x1 = 1,
      y1 = 0;
    let x2 = 3,
      y2 = 2;
    let x3 = -1,
      y3 = 4;

    cy.get(cesc("#\\/v1h")).should(
      "contain.text",
      `(${nInDOM(x2)},${nInDOM(y2)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([x1, y1]);
      expect(stateVariables["/_ray1"].stateValues.through).eqls([x2, y2]);
      expect(stateVariables["/_ray2"].stateValues.endpoint).eqls([x3, y3]);
      expect(stateVariables["/_ray2"].stateValues.through).eqls([x2, y2]);
      expect(stateVariables["/_ray3"].stateValues.endpoint).eqls([x3, y3]);
      expect(stateVariables["/_ray3"].stateValues.through).eqls([x1, y1]);
    });

    cy.log("move through of ray 1");
    cy.window().then(async (win) => {
      x2 = 7;
      y2 = -3;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/v1h",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/v1h")).should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([x1, y1]);
        expect(stateVariables["/_ray1"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray2"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray2"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray3"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray3"].stateValues.through).eqls([x1, y1]);
      });
    });

    cy.log("move endpoint of ray 1");
    cy.window().then(async (win) => {
      x1 = -1;
      y1 = -4;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/v1t",
        args: { x: x1, y: y1 },
      });

      cy.get(cesc("#\\/v1t")).should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([x1, y1]);
        expect(stateVariables["/_ray1"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray2"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray2"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray3"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray3"].stateValues.through).eqls([x1, y1]);
      });
    });

    cy.log("move endpoint of ray 2");
    cy.window().then(async (win) => {
      x3 = 9;
      y3 = -8;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/v2t",
        args: { x: x3, y: y3 },
      });

      cy.get(cesc("#\\/v2t")).should(
        "contain.text",
        `(${nInDOM(x3)},${nInDOM(y3)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([x1, y1]);
        expect(stateVariables["/_ray1"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray2"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray2"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray3"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray3"].stateValues.through).eqls([x1, y1]);
      });
    });

    cy.log("move through of ray 2");
    cy.window().then(async (win) => {
      x2 = 3;
      y2 = 2;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/v2h",
        args: { x: x2, y: y2 },
      });

      cy.get(cesc("#\\/v2h")).should(
        "contain.text",
        `(${nInDOM(x2)},${nInDOM(y2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([x1, y1]);
        expect(stateVariables["/_ray1"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray2"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray2"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray3"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray3"].stateValues.through).eqls([x1, y1]);
      });
    });

    cy.log("move through of ray 3");
    cy.window().then(async (win) => {
      x1 = -5;
      y1 = 8;
      win.callAction1({
        actionName: "movePoint",
        componentName: "/v3h",
        args: { x: x1, y: y1 },
      });

      cy.get(cesc("#\\/v3h")).should(
        "contain.text",
        `(${nInDOM(x1)},${nInDOM(y1)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([x1, y1]);
        expect(stateVariables["/_ray1"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray2"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray2"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray3"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray3"].stateValues.through).eqls([x1, y1]);
      });
    });

    cy.log("move endpoint of ray 3");
    cy.window().then(async (win) => {
      x3 = 0;
      y3 = -5;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/v3t",
        args: { x: x3, y: y3 },
      });

      cy.get(cesc("#\\/v3t")).should(
        "contain.text",
        `(${nInDOM(x3)},${nInDOM(y3)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([x1, y1]);
        expect(stateVariables["/_ray1"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray2"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray2"].stateValues.through).eqls([x2, y2]);
        expect(stateVariables["/_ray3"].stateValues.endpoint).eqls([x3, y3]);
        expect(stateVariables["/_ray3"].stateValues.through).eqls([x1, y1]);
      });
    });
  });

  it("ray with direction and endpoint, move just endpoint", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray direction="(-8,1)" endpoint="(4,1)" />
  </graph>
  <copy prop="direction" target="_ray1" assignNames="v1a" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let endpointx = 4;
      let endpointy = 1;
      let throughx = -4;
      let throughy = 2;
      let directionx = throughx - endpointx;
      let directiony = throughy - endpointy;

      expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([
        endpointx,
        endpointy,
      ]);
      expect(stateVariables["/_ray1"].stateValues.through).eqls([
        throughx,
        throughy,
      ]);
      expect(stateVariables["/_ray1"].stateValues.direction).eqls([
        directionx,
        directiony,
      ]);

      cy.get(cesc("#\\/v1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(directionx)},${nInDOM(directiony)})`,
      );
    });

    cy.log(`move endpoint, make sure through doesn't move`);
    cy.window().then(async (win) => {
      let endpointx = -3;
      let endpointy = 7;
      let throughx = -4;
      let throughy = 2;
      let directionx = throughx - endpointx;
      let directiony = throughy - endpointy;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: { endpointcoords: [endpointx, endpointy] },
      });

      cy.get(cesc("#\\/v1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(directionx)},${nInDOM(directiony)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([
          endpointx,
          endpointy,
        ]);
        expect(stateVariables["/_ray1"].stateValues.through).eqls([
          throughx,
          throughy,
        ]);
        expect(stateVariables["/_ray1"].stateValues.direction).eqls([
          directionx,
          directiony,
        ]);
      });
    });
  });

  it("ray with direction and through, move just through", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray direction="(-8,1)" through="(-4,2)" />
  </graph>
  <copy prop="direction" target="_ray1" assignNames="v1a" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let endpointx = 4;
      let endpointy = 1;
      let throughx = -4;
      let throughy = 2;
      let directionx = throughx - endpointx;
      let directiony = throughy - endpointy;

      expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([
        endpointx,
        endpointy,
      ]);
      expect(stateVariables["/_ray1"].stateValues.through).eqls([
        throughx,
        throughy,
      ]);
      expect(stateVariables["/_ray1"].stateValues.direction).eqls([
        directionx,
        directiony,
      ]);

      cy.get(cesc("#\\/v1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(directionx)},${nInDOM(directiony)})`,
      );
    });

    cy.log(`move endpoint, make sure through doesn't move`);
    cy.window().then(async (win) => {
      let endpointx = 4;
      let endpointy = 1;
      let throughx = 3;
      let throughy = 5;
      let directionx = throughx - endpointx;
      let directiony = throughy - endpointy;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: { throughcoords: [throughx, throughy] },
      });

      cy.get(cesc("#\\/v1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(directionx)},${nInDOM(directiony)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([
          endpointx,
          endpointy,
        ]);
        expect(stateVariables["/_ray1"].stateValues.through).eqls([
          throughx,
          throughy,
        ]);
        expect(stateVariables["/_ray1"].stateValues.direction).eqls([
          directionx,
          directiony,
        ]);
      });
    });
  });

  it("ray with direction, move just endpoint", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <ray direction="(-8,1)" />
  </graph>
  <copy prop="direction" target="_ray1" assignNames="v1a" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let endpointx = 0;
      let endpointy = 0;
      let throughx = -8;
      let throughy = 1;
      let directionx = throughx - endpointx;
      let directiony = throughy - endpointy;

      expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([
        endpointx,
        endpointy,
      ]);
      expect(stateVariables["/_ray1"].stateValues.through).eqls([
        throughx,
        throughy,
      ]);
      expect(stateVariables["/_ray1"].stateValues.direction).eqls([
        directionx,
        directiony,
      ]);

      cy.get(cesc("#\\/v1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(directionx)},${nInDOM(directiony)})`,
      );
    });

    cy.log(`move endpoint, make sure through doesn't move`);
    cy.window().then(async (win) => {
      let endpointx = -3;
      let endpointy = 7;
      let throughx = -8;
      let throughy = 1;
      let directionx = throughx - endpointx;
      let directiony = throughy - endpointy;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: { endpointcoords: [endpointx, endpointy] },
      });

      cy.get(cesc("#\\/v1a") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(directionx)},${nInDOM(directiony)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_ray1"].stateValues.endpoint).eqls([
          endpointx,
          endpointy,
        ]);
        expect(stateVariables["/_ray1"].stateValues.through).eqls([
          throughx,
          throughy,
        ]);
        expect(stateVariables["/_ray1"].stateValues.direction).eqls([
          directionx,
          directiony,
        ]);
      });
    });
  });

  it("mutual dependence among entire through, endpoint, direction", () => {
    // this could be made more interesting once have operations on rays
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
    <ray name="v1" through="$(v1.endpoint)" endpoint="(3,4)" />
  </graph>

  <graph>
    <ray name="v2" through="$(v2.direction)" direction="(3,4)" />
  </graph>

  <graph>
    <ray name="v3" endpoint="$(v3.through)" through="(3,4)" />
  </graph>

  <graph>
    <ray name="v4" endpoint="$(v4.direction)" direction="(3,4)" />
  </graph>

  <graph>
    <ray name="v5" direction="$(v5.through)" through="(3,4)" />
  </graph>

  <graph>
    <ray name="v6" direction="$(v6.endpoint)" endpoint="(3,4)" />
  </graph>
  <copy target="v1" prop="through" assignNames="v1h" />
  <copy target="v2" prop="through" assignNames="v2h" />
  <copy target="v3" prop="through" assignNames="v3h" />
  <copy target="v4" prop="through" assignNames="v4h" />
  <copy target="v5" prop="through" assignNames="v5h" />
  <copy target="v6" prop="through" assignNames="v6h" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.get(cesc("#\\/v1h") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(3)},${nInDOM(4)})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/v1"].stateValues.through).eqls([3, 4]);
      expect(stateVariables["/v1"].stateValues.endpoint).eqls([3, 4]);
      expect(stateVariables["/v1"].stateValues.direction).eqls([0, 0]);

      expect(stateVariables["/v2"].stateValues.through).eqls([3, 4]);
      expect(stateVariables["/v2"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/v2"].stateValues.direction).eqls([3, 4]);

      expect(stateVariables["/v3"].stateValues.through).eqls([3, 4]);
      expect(stateVariables["/v3"].stateValues.endpoint).eqls([3, 4]);
      expect(stateVariables["/v3"].stateValues.direction).eqls([0, 0]);

      expect(stateVariables["/v4"].stateValues.through).eqls([6, 8]);
      expect(stateVariables["/v4"].stateValues.endpoint).eqls([3, 4]);
      expect(stateVariables["/v4"].stateValues.direction).eqls([3, 4]);

      expect(stateVariables["/v5"].stateValues.through).eqls([3, 4]);
      expect(stateVariables["/v5"].stateValues.endpoint).eqls([0, 0]);
      expect(stateVariables["/v5"].stateValues.direction).eqls([3, 4]);

      expect(stateVariables["/v6"].stateValues.through).eqls([6, 8]);
      expect(stateVariables["/v6"].stateValues.endpoint).eqls([3, 4]);
      expect(stateVariables["/v6"].stateValues.direction).eqls([3, 4]);
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v1",
        args: { throughcoords: [1, 2] },
      });

      cy.get(cesc("#\\/v1h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(1)},${nInDOM(2)})`,
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v1"].stateValues.through).eqls([1, 2]);
        expect(stateVariables["/v1"].stateValues.endpoint).eqls([1, 2]);
        expect(stateVariables["/v1"].stateValues.direction).eqls([0, 0]);
      });
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v1",
        args: { endpointcoords: [-4, 5] },
      });

      cy.get(cesc("#\\/v1h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-4)},${nInDOM(5)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v1"].stateValues.through).eqls([-4, 5]);
        expect(stateVariables["/v1"].stateValues.endpoint).eqls([-4, 5]);
        expect(stateVariables["/v1"].stateValues.direction).eqls([0, 0]);
      });
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v3",
        args: { throughcoords: [1, 2] },
      });

      cy.get(cesc("#\\/v3h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(1)},${nInDOM(2)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v3"].stateValues.through).eqls([1, 2]);
        expect(stateVariables["/v3"].stateValues.endpoint).eqls([1, 2]);
        expect(stateVariables["/v3"].stateValues.direction).eqls([0, 0]);
      });
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v3",
        args: { endpointcoords: [-4, 5] },
      });

      cy.get(cesc("#\\/v3h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-4)},${nInDOM(5)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v3"].stateValues.through).eqls([-4, 5]);
        expect(stateVariables["/v3"].stateValues.endpoint).eqls([-4, 5]);
        expect(stateVariables["/v3"].stateValues.direction).eqls([0, 0]);
      });
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v2",
        args: { throughcoords: [1, 2] },
      });

      cy.get(cesc("#\\/v2h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(1)},${nInDOM(2)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v2"].stateValues.through).eqls([1, 2]);
        expect(stateVariables["/v2"].stateValues.endpoint).eqls([0, 0]);
        expect(stateVariables["/v2"].stateValues.direction).eqls([1, 2]);
      });
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v2",
        args: { endpointcoords: [5, 7] },
      });

      cy.get(cesc("#\\/v2h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-4)},${nInDOM(-5)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v2"].stateValues.through).eqls([-4, -5]);
        expect(stateVariables["/v2"].stateValues.endpoint).eqls([0, 0]);
        expect(stateVariables["/v2"].stateValues.direction).eqls([-4, -5]);
      });
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v5",
        args: { throughcoords: [1, 2] },
      });
      cy.get(cesc("#\\/v5h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(1)},${nInDOM(2)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v5"].stateValues.through).eqls([1, 2]);
        expect(stateVariables["/v5"].stateValues.endpoint).eqls([0, 0]);
        expect(stateVariables["/v5"].stateValues.direction).eqls([1, 2]);
      });
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v5",
        args: { endpointcoords: [5, 7] },
      });
      cy.get(cesc("#\\/v5h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-4)},${nInDOM(-5)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v5"].stateValues.through).eqls([-4, -5]);
        expect(stateVariables["/v5"].stateValues.endpoint).eqls([0, 0]);
        expect(stateVariables["/v5"].stateValues.direction).eqls([-4, -5]);
      });
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v4",
        args: { throughcoords: [-1, 1] },
      });
      cy.get(cesc("#\\/v4h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-8)},${nInDOM(-6)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v4"].stateValues.through).eqls([-8, -6]);
        expect(stateVariables["/v4"].stateValues.endpoint).eqls([-4, -3]);
        expect(stateVariables["/v4"].stateValues.direction).eqls([-4, -3]);
      });
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v4",
        args: { endpointcoords: [-10, -2] },
      });

      // since based on endpoint and direction
      // Ray sets direction to try to keep through in the same place

      cy.get(cesc("#\\/v4h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(4)},${nInDOM(-8)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v4"].stateValues.through).eqls([4, -8]);
        expect(stateVariables["/v4"].stateValues.endpoint).eqls([2, -4]);
        expect(stateVariables["/v4"].stateValues.direction).eqls([2, -4]);
      });
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v6",
        args: { throughcoords: [-1, 1] },
      });

      cy.get(cesc("#\\/v6h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(-8)},${nInDOM(-6)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v6"].stateValues.through).eqls([-8, -6]);
        expect(stateVariables["/v6"].stateValues.endpoint).eqls([-4, -3]);
        expect(stateVariables["/v6"].stateValues.direction).eqls([-4, -3]);
      });
    });

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveRay",
        componentName: "/v6",
        args: { endpointcoords: [-10, -2] },
      });

      // since based on endpoint and direction
      // Ray sets direction to try to keep through in the same place

      cy.get(cesc("#\\/v6h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(4)},${nInDOM(-8)})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/v6"].stateValues.through).eqls([4, -8]);
        expect(stateVariables["/v6"].stateValues.endpoint).eqls([2, -4]);
        expect(stateVariables["/v6"].stateValues.direction).eqls([2, -4]);
      });
    });
  });

  it("ray with no arguments, copy and specify attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph name="g0" newNamespace>
    <ray name="v0" />
    <copy target="v0" through="(3,4)" assignNames="v1" />
    <copy target="v1" endpoint="(-1,0)" assignNames="v2" />
    <copy target="v0" endpoint="(2,-6)" assignNames="v3" />
    <copy target="v3" direction="(-3,4)" assignNames="v4" />
    <copy target="v0" direction="(5,-1)" assignNames="v5" />
    <copy target="v5" through="(6,2)" assignNames="v6" />
  </graph>

  <copy target="g0" assignNames="g1" />

  <copy target="g0/v0" prop="endpoint" assignNames="v0t" />
  <copy target="g0/v0" prop="through" assignNames="v0h" />
  <copy target="g0/v1" prop="endpoint" assignNames="v1t" />
  <copy target="g0/v1" prop="through" assignNames="v1h" />
  <copy target="g0/v2" prop="endpoint" assignNames="v2t" />
  <copy target="g0/v2" prop="through" assignNames="v2h" />
  <copy target="g0/v3" prop="endpoint" assignNames="v3t" />
  <copy target="g0/v3" prop="through" assignNames="v3h" />
  <copy target="g0/v4" prop="endpoint" assignNames="v4t" />
  <copy target="g0/v4" prop="through" assignNames="v4h" />
  <copy target="g0/v5" prop="endpoint" assignNames="v5t" />
  <copy target="g0/v5" prop="through" assignNames="v5h" />
  <copy target="g0/v6" prop="endpoint" assignNames="v6t" />
  <copy target="g0/v6" prop="through" assignNames="v6h" />

  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let endpoints = [
      [0, 0],
      [0, 0],
      [-1, 0],
      [2, -6],
      [2, -6],
      [0, 0],
      [1, 3],
    ];

    let throughs = [
      [1, 0],
      [3, 4],
      [3, 4],
      [3, -6],
      [-1, -2],
      [5, -1],
      [6, 2],
    ];

    let directions = throughs.map((v, i) => [
      v[0] - endpoints[i][0],
      v[1] - endpoints[i][1],
    ]);

    cy.get(cesc("#\\/v0t") + " .mjx-mrow").should(
      "contain.text",
      `(${nInDOM(endpoints[0][0])},${nInDOM(endpoints[0][1])})`,
    );

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 2; j++) {
          expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
            endpoints[i],
          );
          expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
            throughs[i],
          );
          expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
            directions[i],
          );
        }
      }
    });

    cy.log("move endpoint of g0/v0");

    cy.window().then(async (win) => {
      endpoints[0] = endpoints[1] = endpoints[5] = [3, 5];
      throughs[5] = [
        endpoints[5][0] + directions[5][0],
        endpoints[5][1] + directions[5][1],
      ];
      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);
      throughs[3] = [
        endpoints[3][0] + directions[0][0],
        endpoints[3][1] + directions[0][1],
      ];
      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g0/v0",
        args: { endpointcoords: endpoints[0] },
      });

      cy.get(cesc("#\\/v0t") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(endpoints[0][0])},${nInDOM(endpoints[0][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move through of g1/v0");

    cy.window().then(async (win) => {
      throughs[0] = [-2, 8];

      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);
      throughs[3] = [
        endpoints[3][0] + directions[0][0],
        endpoints[3][1] + directions[0][1],
      ];
      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g1/v0",
        args: { throughcoords: throughs[0] },
      });

      cy.get(cesc("#\\/v0h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(throughs[0][0])},${nInDOM(throughs[0][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move through of g0/v1");

    cy.window().then(async (win) => {
      throughs[1] = throughs[2] = [-9, -1];

      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g0/v1",
        args: { throughcoords: throughs[1] },
      });

      cy.get(cesc("#\\/v1h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(throughs[1][0])},${nInDOM(throughs[1][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move endpoint of g1/v1");

    cy.window().then(async (win) => {
      endpoints[0] = endpoints[1] = endpoints[5] = [5, -3];
      throughs[0] = [
        endpoints[0][0] + directions[0][0],
        endpoints[0][1] + directions[0][1],
      ];
      throughs[5] = [
        endpoints[5][0] + directions[5][0],
        endpoints[5][1] + directions[5][1],
      ];
      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g1/v1",
        args: { endpointcoords: endpoints[1] },
      });

      cy.get(cesc("#\\/v1t") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(endpoints[1][0])},${nInDOM(endpoints[1][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move endpoint of g0/v2");

    cy.window().then(async (win) => {
      endpoints[2] = [7, 9];

      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g0/v2",
        args: { endpointcoords: endpoints[2] },
      });

      cy.get(cesc("#\\/v2t") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(endpoints[2][0])},${nInDOM(endpoints[2][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move through of g1/v2");

    cy.window().then(async (win) => {
      throughs[1] = throughs[2] = [8, 4];

      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g1/v2",
        args: { throughcoords: throughs[2] },
      });

      cy.get(cesc("#\\/v2h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(throughs[2][0])},${nInDOM(throughs[2][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move through of g0/v3");

    cy.window().then(async (win) => {
      throughs[3] = [-4, -7];
      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);
      throughs[0] = [
        endpoints[0][0] + directions[3][0],
        endpoints[0][1] + directions[3][1],
      ];
      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g0/v3",
        args: { throughcoords: throughs[3] },
      });

      cy.get(cesc("#\\/v3h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(throughs[3][0])},${nInDOM(throughs[3][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move endpoint of g1/v3");

    cy.window().then(async (win) => {
      endpoints[3] = endpoints[4] = [-6, 2];
      throughs[4] = [
        endpoints[4][0] + directions[4][0],
        endpoints[4][1] + directions[4][1],
      ];

      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);
      throughs[0] = [
        endpoints[0][0] + directions[3][0],
        endpoints[0][1] + directions[3][1],
      ];
      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g1/v3",
        args: { endpointcoords: endpoints[3] },
      });

      cy.get(cesc("#\\/v3t") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(endpoints[3][0])},${nInDOM(endpoints[3][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move endpoint of g0/v4");

    cy.window().then(async (win) => {
      endpoints[3] = endpoints[4] = [-2, 3];
      throughs[3] = [
        endpoints[3][0] + directions[3][0],
        endpoints[3][1] + directions[3][1],
      ];

      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g0/v4",
        args: { endpointcoords: endpoints[4] },
      });

      cy.get(cesc("#\\/v4t") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(endpoints[4][0])},${nInDOM(endpoints[4][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move through of g1/v4");

    cy.window().then(async (win) => {
      throughs[4] = [2, 0];

      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g1/v4",
        args: { throughcoords: throughs[4] },
      });

      cy.get(cesc("#\\/v4h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(throughs[4][0])},${nInDOM(throughs[4][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move through of g0/v5");

    cy.window().then(async (win) => {
      throughs[5] = [-9, -8];

      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);
      endpoints[6] = [
        throughs[6][0] - directions[5][0],
        throughs[6][1] - directions[5][1],
      ];
      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g0/v5",
        args: { throughcoords: throughs[5] },
      });

      cy.get(cesc("#\\/v5h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(throughs[5][0])},${nInDOM(throughs[5][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move endpoint of g1/v5");

    cy.window().then(async (win) => {
      endpoints[0] = endpoints[1] = endpoints[5] = [3, 7];

      throughs[0] = [
        endpoints[0][0] + directions[0][0],
        endpoints[0][1] + directions[0][1],
      ];

      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);
      endpoints[6] = [
        throughs[6][0] - directions[5][0],
        throughs[6][1] - directions[5][1],
      ];
      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g1/v5",
        args: { endpointcoords: endpoints[5] },
      });

      cy.get(cesc("#\\/v5t") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(endpoints[5][0])},${nInDOM(endpoints[5][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move endpoint of g0/v6");

    cy.window().then(async (win) => {
      endpoints[6] = [8, -7];

      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);
      throughs[5] = [
        endpoints[5][0] + directions[6][0],
        endpoints[5][1] + directions[6][1],
      ];
      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g0/v6",
        args: { endpointcoords: endpoints[6] },
      });

      cy.get(cesc("#\\/v6t") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(endpoints[6][0])},${nInDOM(endpoints[6][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });

    cy.log("move through of g1/v6");

    cy.window().then(async (win) => {
      throughs[6] = [9, -5];

      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);
      throughs[5] = [
        endpoints[5][0] + directions[6][0],
        endpoints[5][1] + directions[6][1],
      ];
      directions = throughs.map((v, i) => [
        v[0] - endpoints[i][0],
        v[1] - endpoints[i][1],
      ]);

      win.callAction1({
        actionName: "moveRay",
        componentName: "/g1/v6",
        args: { throughcoords: throughs[6] },
      });

      cy.get(cesc("#\\/v6h") + " .mjx-mrow").should(
        "contain.text",
        `(${nInDOM(throughs[6][0])},${nInDOM(throughs[6][1])})`,
      );
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 2; j++) {
            expect(stateVariables[`/g${j}/v${i}`].stateValues.endpoint).eqls(
              endpoints[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.through).eqls(
              throughs[i],
            );
            expect(stateVariables[`/g${j}/v${i}`].stateValues.direction).eqls(
              directions[i],
            );
          }
        }
      });
    });
  });

  it("change ray by binding to values", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <ray name="v" />
  <ray name="v2" copySource="v" />

  <p>
  <copy source="v.through" assignNames="vThrough" />
  <copy source="v.endpoint" assignNames="vEndpoint" />
  <copy source="v.direction" assignNames="vDirection" />
  </p>

  <p>
  <copy source="v2.through" assignNames="v2Through" />
  <copy source="v2.endpoint" assignNames="v2Endpoint" />
  <copy source="v2.direction" assignNames="v2Direction" />
  </p>

  <p>
  <mathinput bindValueTo="$v.through" name="mivt" />
  <mathinput bindValueTo="$v.endpoint" name="mive" />
  <mathinput bindValueTo="$v.direction" name="mivd" />
  </p>

  <p>
  <mathinput bindValueTo="$v2.through" name="miv2t" />
  <mathinput bindValueTo="$v2.endpoint" name="miv2e" />
  <mathinput bindValueTo="$v2.direction" name="miv2d" />
  </p>

  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow").should(
      "contain.text",
      "(1,0)",
    );

    cy.get(cesc("#\\/vThrough") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,0)");
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,0)");
    cy.get(cesc("#\\/v2Through") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,0)");
    cy.get(cesc("#\\/v2Endpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/v2Direction") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,0)");

    cy.log("change head using alt vector");
    cy.get(cesc("#\\/mivt") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}\\langle 6,9{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/vThrough") + " .mjx-mrow").should("contain.text", "(6,9)");

    cy.get(cesc("#\\/vThrough") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,9)");
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,9)");
    cy.get(cesc("#\\/v2Through") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,9)");
    cy.get(cesc("#\\/v2Endpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");
    cy.get(cesc("#\\/v2Direction") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,9)");

    cy.log("change tail using alt vector");
    cy.get(cesc("#\\/mive") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}\\langle -3,7{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow").should(
      "contain.text",
      "(−3,7)",
    );

    cy.get(cesc("#\\/vThrough") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,16)");
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,7)");
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,9)");
    cy.get(cesc("#\\/v2Through") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,16)");
    cy.get(cesc("#\\/v2Endpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,7)");
    cy.get(cesc("#\\/v2Direction") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,9)");

    cy.log("change displacement using alt vector");
    cy.get(cesc("#\\/mivd") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}\\langle -4,1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow").should(
      "contain.text",
      "(−4,1)",
    );

    cy.get(cesc("#\\/vThrough") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−7,8)");
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,7)");
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−4,1)");
    cy.get(cesc("#\\/v2Through") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−7,8)");
    cy.get(cesc("#\\/v2Endpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,7)");
    cy.get(cesc("#\\/v2Direction") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−4,1)");

    cy.log("cannot change dimnension through displacement");
    cy.get(cesc("#\\/mivd") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(9,8,7{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow").should(
      "contain.text",
      "(9,8)",
    );

    cy.get(cesc("#\\/vThrough") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,15)");
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,7)");
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,8)");
    cy.get(cesc("#\\/v2Through") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,15)");
    cy.get(cesc("#\\/v2Endpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−3,7)");
    cy.get(cesc("#\\/v2Direction") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,8)");

    cy.log("cannot change dimnension through tail");
    cy.get(cesc("#\\/mive") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(-5,-6,-7{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow").should(
      "contain.text",
      "(−5,−6)",
    );

    cy.get(cesc("#\\/vThrough") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,2)");
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−5,−6)");
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,8)");
    cy.get(cesc("#\\/v2Through") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,2)");
    cy.get(cesc("#\\/v2Endpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−5,−6)");
    cy.get(cesc("#\\/v2Direction") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,8)");

    cy.log("cannot change dimnension through head");
    cy.get(cesc("#\\/mivt") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}(9,-9,7{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/vThrough") + " .mjx-mrow").should(
      "contain.text",
      "(9,−9)",
    );

    cy.get(cesc("#\\/vThrough") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,−9)");
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−5,−6)");
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(14,−3)");
    cy.get(cesc("#\\/v2Through") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(9,−9)");
    cy.get(cesc("#\\/v2Endpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−5,−6)");
    cy.get(cesc("#\\/v2Direction") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(14,−3)");

    cy.log("cannot change dimnension through copied head");
    cy.get(cesc("#\\/miv2t") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}\\langle 0,1,2,3{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/vThrough") + " .mjx-mrow").should("contain.text", "(0,1)");

    cy.get(cesc("#\\/vThrough") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−5,−6)");
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/v2Through") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,1)");
    cy.get(cesc("#\\/v2Endpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−5,−6)");
    cy.get(cesc("#\\/v2Direction") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");

    cy.log("cannot change dimnension through copied tail");
    cy.get(cesc("#\\/miv2e") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}\\langle 2, 4, 6, 8{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow").should(
      "contain.text",
      "(2,4)",
    );

    cy.get(cesc("#\\/vThrough") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,11)");
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,4)");
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");
    cy.get(cesc("#\\/v2Through") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(7,11)");
    cy.get(cesc("#\\/v2Endpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,4)");
    cy.get(cesc("#\\/v2Direction") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,7)");

    cy.log("cannot change dimnension through copied displacement");
    cy.get(cesc("#\\/miv2d") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}\\langle -8, -6, =4, -2{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow").should(
      "contain.text",
      "(−8,−6)",
    );

    cy.get(cesc("#\\/vThrough") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−6,−2)");
    cy.get(cesc("#\\/vEndpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,4)");
    cy.get(cesc("#\\/vDirection") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−6)");
    cy.get(cesc("#\\/v2Through") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−6,−2)");
    cy.get(cesc("#\\/v2Endpoint") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2,4)");
    cy.get(cesc("#\\/v2Direction") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−8,−6)");
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
      <ray name="A" styleNumber="1" labelIsName endpoint="(0,0)" through="(1,2)" />
      <ray name="B" styleNumber="2" labelIsName endpoint="(2,2)" through="(3,4)" />
      <ray name="C" styleNumber="5" labelIsName endpoint="(4,4)" through="(5,6)" />
    </graph>
    <p name="Adescrip">Ray A is $A.styleDescription.</p>
    <p name="Bdescrip">B is a $B.styleDescriptionWithNoun.</p>
    <p name="Cdescrip">C is a $C.styleDescriptionWithNoun.</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/Adescrip")).should("have.text", "Ray A is thick brown.");
    cy.get(cesc("#\\/Bdescrip")).should("have.text", "B is a dark red ray.");
    cy.get(cesc("#\\/Cdescrip")).should("have.text", "C is a thin black ray.");

    cy.log("set dark mode");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_darkmode").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.get(cesc("#\\/Adescrip")).should("have.text", "Ray A is thick yellow.");
    cy.get(cesc("#\\/Bdescrip")).should("have.text", "B is a light red ray.");
    cy.get(cesc("#\\/Cdescrip")).should("have.text", "C is a thin white ray.");
  });

  it("ray with through and endpoint, endpoint constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point name="P">(4,1)
    <constraints>
      <constrainToGrid dx="5" dy="3" />
    </constraints>
  </point>
  <point name="Q">(-4,2)</point>
  <ray endpoint="$P" through="$Q" />
  </graph>

  <graph>
  <copy prop="endpoint" target="_ray1" assignNames="endpoint" />
  <copy prop="through" target="_ray1" assignNames="through" />
  <copy prop="direction" target="_ray1" assignNames="direction" />
  </graph>
  
  <copy prop="endpoint" target="_ray1" assignNames="endpoint2" />
  <copy prop="through" target="_ray1" assignNames="through2" />
  <copy prop="direction" target="_ray1" assignNames="direction2" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let endpointx = 5;
    let endpointy = 0;
    let throughx = -4;
    let throughy = 2;
    let directionEndpointShiftx = 0;
    let directionEndpointShifty = 0;

    cy.window().then(async (win) => {
      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move ray up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: {
          endpointcoords: [endpointx, endpointy],
          throughcoords: [throughx, throughy],
        },
      });

      // adjust for constraints
      moveX = 2;
      moveY = 1;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied through");
    cy.window().then(async (win) => {
      throughx = -5;
      throughy = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/through",
        args: { x: throughx, y: throughy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied endpoint");
    cy.window().then(async (win) => {
      endpointx = -3;
      endpointy = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/endpoint",
        args: { x: endpointx, y: endpointy },
      });

      // adjust for constraints
      endpointx = -5;
      endpointy = -9;

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied direction");
    cy.window().then(async (win) => {
      let directionEndpointShiftx = -4;
      let directionEndpointShifty = -5;

      let directionx = 2;
      let directiony = -3;

      throughx = endpointx + directionx;
      throughy = endpointy + directiony;

      let directionthroughx = directionEndpointShiftx + directionx;
      let directionthroughy = directionEndpointShifty + directiony;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/direction",
        args: {
          tailcoords: [directionEndpointShiftx, directionEndpointShifty],
          headcoords: [directionthroughx, directionthroughy],
        },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });
  });

  it("ray with through and endpoint, through point constrained to grid", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <graph>
  <point name="P">(4,1)</point>
  <point name="Q">(-4,2)
    <constraints>
      <constrainToGrid dx="5" dy="3" />
    </constraints>
  </point>
  <ray endpoint="$P" through="$Q" />
  </graph>

  <graph>
  <copy prop="endpoint" target="_ray1" assignNames="endpoint" />
  <copy prop="through" target="_ray1" assignNames="through" />
  <copy prop="direction" target="_ray1" assignNames="direction" />
  </graph>
  
  <copy prop="endpoint" target="_ray1" assignNames="endpoint2" />
  <copy prop="through" target="_ray1" assignNames="through2" />
  <copy prop="direction" target="_ray1" assignNames="direction2" />
  `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let endpointx = 4;
    let endpointy = 1;
    let throughx = -5;
    let throughy = 3;
    let directionEndpointShiftx = 0;
    let directionEndpointShifty = 0;

    cy.window().then(async (win) => {
      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move ray up and to the right");
    cy.window().then(async (win) => {
      let moveX = 3;
      let moveY = 2;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      win.callAction1({
        actionName: "moveRay",
        componentName: "/_ray1",
        args: {
          endpointcoords: [endpointx, endpointy],
          throughcoords: [throughx, throughy],
        },
      });

      // adjust for constraints
      moveX = 2;
      moveY = 1;
      endpointx += moveX;
      throughx += moveX;
      endpointy += moveY;
      throughy += moveY;

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied through");
    cy.window().then(async (win) => {
      throughx = -5;
      throughy = 7;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/through",
        args: { x: throughx, y: throughy },
      });

      // adjust for constraints
      throughx = -5;
      throughy = 6;

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied endpoint");
    cy.window().then(async (win) => {
      endpointx = -3;
      endpointy = -9;

      win.callAction1({
        actionName: "movePoint",
        componentName: "/endpoint",
        args: { x: endpointx, y: endpointy },
      });

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });

    cy.log("move copied direction");
    cy.window().then(async (win) => {
      let directionEndpointShiftx = -4;
      let directionEndpointShifty = -5;

      let directionx = 2;
      let directiony = -3;

      throughx = endpointx + directionx;
      throughy = endpointy + directiony;

      let directionthroughx = directionEndpointShiftx + directionx;
      let directionthroughy = directionEndpointShifty + directiony;

      win.callAction1({
        actionName: "moveVector",
        componentName: "/direction",
        args: {
          tailcoords: [directionEndpointShiftx, directionEndpointShifty],
          headcoords: [directionthroughx, directionthroughy],
        },
      });

      // adjust for constraints
      throughx = Math.round(throughx / 5) * 5;
      throughy = Math.round(throughy / 3) * 3;
      throughx = throughx === 0 ? 0 : throughx; // change -0 to 0
      directionx = throughx - endpointx;
      directiony = throughy - endpointy;

      await testRayCopiedHTD({
        throughx,
        throughy,
        endpointx,
        endpointy,
        directionEndpointShiftx,
        directionEndpointShifty,
      });
    });
  });

  it("round vector", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <ray endpoint="(2.58106823,510.523950183)" through="(5.2164162,623.5234601)" name="r1"/>

    $r1.direction{assignNames="r1d"}
    $r1.endpoint{assignNames="r1t"}
    $r1.through{assignNames="r1h"}
    
    <p>
      <ray copysource="r1" name="r2" displayDigits="6" />
      
      $r2.direction{assignNames="r2d"}
      $r2.endpoint{assignNames="r2t"}
      $r2.through{assignNames="r2h"}
    </p>

    <ray copysource="r1" name="r3" displayDecimals="0" ignoreDisplayDigits />
    
    $r3.direction{assignNames="r3d"}
    $r3.endpoint{assignNames="r3t"}
    $r3.through{assignNames="r3h"}

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/r1d") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2.64,113)");
    cy.get(cesc2("#/r1t") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2.58,510.52)");
    cy.get(cesc2("#/r1h") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5.22,623.52)");

    cy.get(cesc2("#/r2d") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2.63535,113)");
    cy.get(cesc2("#/r2t") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(2.58107,510.524)");
    cy.get(cesc2("#/r2h") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5.21642,623.523)");

    cy.get(cesc2("#/r3d") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,113)");
    cy.get(cesc2("#/r3t") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(3,511)");
    cy.get(cesc2("#/r3h") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(5,624)");
  });
});
