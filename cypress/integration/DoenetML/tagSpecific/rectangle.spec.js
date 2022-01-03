describe('Rectangle Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('rectangle with no parameters (gives unit square)', () => {

    setupScene({
      rectangleProperties: "",
      rectangleChildren: "",
    });

    runTests({
      v0x: 0,
      v0y: 0,
      v2x: 1,
      v2y: 1,
      cornerDependencyState: 1
    });

  });

  it('rectangle with only height', () => {

    setupScene({
      rectangleProperties: 'height="-3"',
      rectangleChildren: "",
    });

    runTests({
      v0x: 0,
      v0y: 0,
      v2x: 1,
      v2y: -3,
      cornerDependencyState: 1
    });
  });

  it('rectangle with only width and height', () => {

    setupScene({
      rectangleProperties: 'width="3" height="5"',
      rectangleChildren: "",
    });

    runTests({
      v0x: 0,
      v0y: 0,
      v2x: 3,
      v2y: 5,
      cornerDependencyState: 1
    });
  });

  it('rectangle with only center', () => {

    setupScene({
      rectangleProperties: 'center="(-1,5)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -1.5,
      v0y: 4.5,
      v2x: -0.5,
      v2y: 5.5,
      cornerDependencyState: 0
    });
  });

  it('rectangle with only center and width', () => {

    setupScene({
      rectangleProperties: 'width="-2" center="(-4,2)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -3,
      v0y: 1.5,
      v2x: -5,
      v2y: 2.5,
      cornerDependencyState: 0
    });
  });

  it('rectangle with only 1 vertex', () => {

    setupScene({
      rectangleProperties: 'vertices="(2,3)"',
      rectangleChildren: '',
    });

    runTests({
      v0x: 2,
      v0y: 3,
      v2x: 3,
      v2y: 4,
      cornerDependencyState: 1
    });
  });

  it('rectangle with only 1 vertex and height', () => {

    setupScene({
      rectangleProperties: 'height="6" vertices="(-3,4)"',
      rectangleChildren: '',
    });

    runTests({
      v0x: -3,
      v0y: 4,
      v2x: -2,
      v2y: 10,
      cornerDependencyState: 1
    });
  });

  it('rectangle with center, width and height', () => {

    setupScene({
      rectangleProperties: 'width="6" height="-3" center="(-3,-4)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -6,
      v0y: -2.5,
      v2x: 0,
      v2y: -5.5,
      cornerDependencyState: 0
    });
  });

  it('rectangle with vertex, width and height', () => {

    setupScene({
      rectangleProperties: 'width="7" height="4" vertices="(-1,2)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -1,
      v0y: 2,
      v2x: 6,
      v2y: 6,
      cornerDependencyState: 1
    });
  });

  it('rectangle with 1 vertex and center', () => {

    setupScene({
      rectangleProperties: 'vertices="(-2,-4)" center="(1,-1)"',
      rectangleChildren: "",
    });

    runTests({
      v0x: -2,
      v0y: -4,
      v2x: 4,
      v2y: 2,
      cornerDependencyState: 2
    });
  });

  it('rectangle with 2 vertices', () => {

    setupScene({
      rectangleProperties: 'vertices="(-5,-9) (-1,-2)"',
      rectangleChildren: '',
    });

    runTests({
      v0x: -5,
      v0y: -9,
      v2x: -1,
      v2y: -2,
      cornerDependencyState: 0
    });
  });
});

function setupScene({ rectangleProperties, rectangleChildren }) {
  cy.window().then(async (win) => {
    win.postMessage({
      doenetML: `
  <text>a</text>

  <graph>
  <rectangle ` + rectangleProperties + `>
  ` + rectangleChildren + `
  </rectangle>
  </graph>

  <graph>
  <copy name="centerPoint" target="_rectangle1" prop="center"/>
  <copy name="v1" target="_rectangle1" prop="vertex1"/>
  <copy name="v2" target="_rectangle1" prop="vertex2"/>
  <copy name="v3" target="_rectangle1" prop="vertex3"/>
  <copy name="v4" target="_rectangle1" prop="vertex4"/>
  </graph>

  <mathinput bindValueTo="$(_rectangle1{prop='width'})" />
  <mathinput bindValueTo="$(_rectangle1{prop='height'})" />

  <graph name="graph3">
    <copy name="rectangleCopy" target="_rectangle1"/>
  </graph>
  
  <copy name="graph4" target="graph3" />
  `}, "*");
  });
}

function runTests({ v0x, v0y, v2x, v2y, cornerDependencyState }) {
  cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

  cy.window().then(async (win) => {
    let components = Object.assign({}, win.state.components);

    let rectangle = components["/_rectangle1"];
    let centerPoint = components["/centerPoint"].replacements[0];
    let v0 = components["/v1"].replacements[0];
    let v1 = components["/v2"].replacements[0];
    let v2 = components["/v3"].replacements[0];
    let v3 = components["/v4"].replacements[0];
    let rectangleCopy = components["/rectangleCopy"].replacements[0];
    let rectangleCopy2 = components["/graph4"].replacements[0].activeChildren[0];
    let widthInput = components["/_mathinput1"];
    let heightInput = components["/_mathinput2"];

    let inputs = {
      rectangles: [rectangle, rectangleCopy, rectangleCopy2],
      vertices: [v0, v1, v2, v3],
      widthInput,
      heightInput,
      centerPoint
    }

    cy.window().then(async (win) => {
      await checkRectangleValues(
        inputs,
        {
          v0x,
          v0y,
          v2x,
          v2y,
        }
      );
    })

    cy.log("move rectangle points individually");
    cy.window().then(async (win) => {
      await rectangle.movePolygon({ pointCoords: { 0: [2, -1] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: -1,
          v2x,
          v2y,
        }
      );

      await rectangle.movePolygon({ pointCoords: { 1: [0, 2] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: 0,
          v2y,
        }
      );

      await rectangle.movePolygon({ pointCoords: { 2: [-4, -5] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: -4,
          v2y: -5,
        }
      );

      await rectangle.movePolygon({ pointCoords: { 3: [3, 4] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 3,
          v0y: 2,
          v2x: -4,
          v2y: 4,
        }
      );
    })

    cy.log("move rectangle points together");
    cy.window().then(async (win) => {
      await rectangle.movePolygon({
        pointCoords: {
          0: [4, 3],
          1: [-3, 3],
          2: [-3, 5],
          3: [4, 5]
        }
      })
      await checkRectangleValues(
        inputs,
        {
          v0x: 4,
          v0y: 3,
          v2x: -3,
          v2y: 5,
        }
      );
    })

    cy.log("move center point");
    cy.window().then(async (win) => {
      await centerPoint.movePoint({ x: 0, y: 0 });
      await checkRectangleValues(
        inputs,
        {
          v0x: 3.5,
          v0y: -1,
          v2x: -3.5,
          v2y: 1,
        }
      );
    })

    cy.log("move copied vertices");
    cy.window().then(async (win) => {
      if (cornerDependencyState === 0) {
        // natural behaviour

        await v0.movePoint({ x: 0, y: 0 });
        await checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: 0,
            v2x: -3.5,
            v2y: 1,
          }
        );

        await v1.movePoint({ x: 1, y: -1 });
        await checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 1,
            v2y: 1,
          }
        );

        await v2.movePoint({ x: 2.25, y: 2.25 });
        await checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 2.25,
            v2y: 2.25,
          }
        );

        await v3.movePoint({ x: -1, y: -5 });
        await checkRectangleValues(
          inputs,
          {
            v0x: -1,
            v0y: -1,
            v2x: 2.25,
            v2y: -5,
          }
        );
      } else if (cornerDependencyState === 1) {
        // corner, width and height

        await v0.movePoint({ x: 0, y: 0 });
        await checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: 0,
            v2x: -7,
            v2y: 2,
          }
        );

        await v1.movePoint({ x: 1, y: -1 });
        await checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 1,
            v2y: 1,
          }
        );

        await v2.movePoint({ x: 2.25, y: 2.25 });
        await checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 2.25,
            v2y: 2.25,
          }
        );

        await v3.movePoint({ x: -1, y: -5 });
        await checkRectangleValues(
          inputs,
          {
            v0x: -1,
            v0y: -1,
            v2x: 1.25,
            v2y: -5,
          }
        );
      } else if (cornerDependencyState === 2) {
        //TODO: corner and center

        await v0.movePoint({ x: 0, y: 0 });
        await checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: 0,
            v2x: 0,
            v2y: 0,
          }
        );

        await v1.movePoint({ x: 1, y: -1 });
        await checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 1,
            v2y: 1,
          }
        );

        await v2.movePoint({ x: 2.25, y: 2.25 });
        await checkRectangleValues(
          inputs,
          {
            v0x: 0,
            v0y: -1,
            v2x: 2.25,
            v2y: 2.25,
          }
        );

        await v3.movePoint({ x: -1, y: -5 });
        await checkRectangleValues(
          inputs,
          {
            v0x: -1,
            v0y: -1,
            v2x: 3.25,
            v2y: -5,
          }
        );
      }
    })

    cy.log("rectangleCopy together");
    cy.window().then(async (win) => {
      await rectangleCopy.movePolygon({
        pointCoords: {
          0: [0, 0],
          1: [1, 0],
          2: [1, 1],
          3: [0, 1]
        }
      })
      await checkRectangleValues(
        inputs,
        {
          v0x: 0,
          v0y: 0,
          v2x: 1,
          v2y: 1,
        }
      );
    })

    cy.log("rectangleCopy individually");
    cy.window().then(async (win) => {
      await rectangleCopy.movePolygon({ pointCoords: { 0: [2, -1] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: -1,
          v2x: 1,
          v2y: 1,
        }
      );

      await rectangleCopy.movePolygon({ pointCoords: { 1: [0, 2] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: 0,
          v2y: 1,
        }
      );

      await rectangleCopy.movePolygon({ pointCoords: { 2: [-4, -5] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: -4,
          v2y: -5,
        }
      );

      await rectangleCopy.movePolygon({ pointCoords: { 3: [3, 4] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 3,
          v0y: 2,
          v2x: -4,
          v2y: 4,
        }
      );
    })

    cy.log("rectangleCopy2 together");
    cy.window().then(async (win) => {
      await rectangleCopy2.movePolygon({
        pointCoords: {
          0: [0, 0],
          1: [1, 0],
          2: [1, 1],
          3: [0, 1]
        }
      })
      await checkRectangleValues(
        inputs,
        {
          v0x: 0,
          v0y: 0,
          v2x: 1,
          v2y: 1,
        }
      );
    })

    cy.log("rectangleCopy2 individually");
    cy.window().then(async (win) => {
      await rectangleCopy2.movePolygon({ pointCoords: { 0: [2, -1] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: -1,
          v2x: 1,
          v2y: 1,
        }
      );

      await rectangleCopy2.movePolygon({ pointCoords: { 1: [0, 2] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: 0,
          v2y: 1,
        }
      );

      await rectangleCopy2.movePolygon({ pointCoords: { 2: [-4, -5] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 2,
          v0y: 2,
          v2x: -4,
          v2y: -5,
        }
      );

      await rectangleCopy2.movePolygon({ pointCoords: { 3: [3, 4] } })
      await checkRectangleValues(
        inputs,
        {
          v0x: 3,
          v0y: 2,
          v2x: -4,
          v2y: 4,
        }
      );

      // reset polygon
      await rectangle.movePolygon({
        pointCoords: {
          0: [0, 0],
          1: [1, 0],
          2: [1, 1],
          3: [0, 1]
        }
      })
    })

  })
}

async function checkRectangleValues({
  rectangles,
  vertices,
  widthInput,
  heightInput,
  centerPoint
}, {
  v0x,
  v0y,
  v2x,
  v2y
}) {

  let vertexCoords = [[v0x, v0y], [v2x, v0y], [v2x, v2y], [v0x, v2y]];
  let centerCoords = [(v0x + v2x) / 2, (v0y + v2y) / 2];
  let widthValue = Math.abs(v2x - v0x);
  let heightValue = Math.abs(v2y - v0y);

  for (let rectangle of rectangles) {
    expect((await rectangle.stateValues.vertices).map(x => x.map(y => y.evaluate_to_constant()))).eqls(vertexCoords);
    expect((await rectangle.stateValues.center).map(x => x.evaluate_to_constant())).eqls(centerCoords);
    expect((await rectangle.stateValues.width)).eq(widthValue);
    expect((await rectangle.stateValues.height)).eq(heightValue);
  }

  for (let [index, vertex] of vertices.entries()) {
    expect((await vertex.stateValues.xs).map(x => x.evaluate_to_constant())).eqls(vertexCoords[index]);
  }

  expect((await centerPoint.stateValues.xs).map(x => x.evaluate_to_constant())).eqls(centerCoords);
  // expect(widthInput.stateValues.value.tree).eq(widthValue);
  // expect(heightInput.stateValues.value.tree).eq(heightValue);
}