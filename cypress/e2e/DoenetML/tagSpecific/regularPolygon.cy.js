
describe('Regular Polygon Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })

  it('regular polygon with no parameters (gives triangle)', () => {

    setupScene({
      attributes: {},
    });

    runTests({
      nVertices: 3,
      vertex1: [1, 0],
      center: [0, 0],
      conservedWhenChangeNvertices: "circumradius"
    });

  });

  it('specify area for square', () => {

    setupScene({
      attributes: {
        nVertices: "4",
        area: "100"
      },
    });

    runTests({
      nVertices: 4,
      vertex1: [Math.sqrt(2) * 5, 0],
      center: [0, 0],
      conservedWhenChangeNvertices: "area"
    });

  });

  it('specify sidelength, center for pentegon', () => {

    setupScene({
      attributes: {
        nVertices: "5",
        sideLength: "2",
        center: "(4,2)"
      },
    });

    runTests({
      nVertices: 5,
      vertex1: [4 + 2 / (2 * Math.sin(Math.PI / 5)), 2],
      center: [4, 2],
      conservedWhenChangeNvertices: "sideLength"
    });

  });

  it('specify inRadius, center for hexagon', () => {

    setupScene({
      attributes: {
        nVertices: "6",
        inRadius: "3",
        center: "(-2,5)"
      },
    });

    runTests({
      nVertices: 6,
      vertex1: [-2 + 3 / (Math.cos(Math.PI / 6)), 5],
      center: [-2, 5],
      conservedWhenChangeNvertices: "inradius"
    });

  });

  it('specify apothem for heptagon', () => {

    setupScene({
      attributes: {
        nVertices: "7",
        apothem: "4",
      },
    });

    runTests({
      nVertices: 7,
      vertex1: [0 + 4 / (Math.cos(Math.PI / 7)), 0],
      center: [0, 0],
      conservedWhenChangeNvertices: "inradius",
      abbreviated: true,
    });

  });

  it('specify perimeter, center for octagon', () => {

    setupScene({
      attributes: {
        nVertices: "8",
        perimeter: "20",
        center: "(-4,7)"
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

  it('specify circumradius, center for triangle', () => {

    setupScene({
      attributes: {
        nVertices: "3",
        circumradius: "6",
        center: "(-5,8)"
      },
    });

    runTests({
      nVertices: 3,
      vertex1: [-5 + 6, 8],
      center: [-5, 8],
      conservedWhenChangeNvertices: "circumradius"
    });

  });



});

function setupScene({ attributes }) {

  let attributesString = Object.keys(attributes).map(attr => `${attr} = "${attributes[attr]}"`).join(" ");

  cy.window().then(async (win) => {
    win.postMessage({
      doenetML: `
  <text>a</text>

  <graph name="g1">
    <regularPolygon name="rp" ` + attributesString + `/>
  </graph>

  <graph name="g2">
    <point name="centerPoint" copySource="rp.center" />
    <copy source="rp.vertices" assignNames="v1 v2 v3 v4 v5 v6 v7 v8 v9 v10" />
  </graph>


  <p>circumradius: <mathinput name="micr" bindValueTo="$rp.circumradius" /> <number copySource="rp.circumradius" name="cr" /></p>
  <p>radius: <mathinput name="mir" bindValueTo="$rp.radius" /> <number copySource="rp.radius" name="r" /></p>

  <p>inradius: <mathinput name="miir" bindValueTo="$rp.inradius" /> <number copySource="rp.inradius" name="ir" /></p>
  <p>apothem: <mathinput name="miap" bindValueTo="$rp.apothem" /> <number copySource="rp.apothem" name="ap" /></p>

  <p>side length: <mathinput name="misl" bindValueTo="$rp.sideLength" /> <number copySource="rp.sideLength" name="sl" /></p>
  <p>perimeter: <mathinput name="mip" bindValueTo="$rp.perimeter" /> <number copySource="rp.perimeter" name="p" /></p>


  <p>area: <mathinput name="miar" bindValueTo="$rp.area" /> <number copySource="rp.area" name="ar" /></p>

  <p>n vertices: <mathinput name="minv" bindValueTo="$rp.nVertices" /> <number copySource="rp.nVertices" name="nv" /></p>


  <graph name="g3">
    <regularPolygon name="rp2" copySource="rp" />
  </graph>
  
  <graph name="g4" copySource="g3" newNamespace />
  `}, "*");
  });
}

function runTests({ center, vertex1, nVertices, conservedWhenChangeNvertices = "radius", abbreviated = false }) {
  cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

  cy.window().then(async (win) => {
    let stateVariables = await win.returnAllStateVariables1();

    let polygonName = "/rp";
    let centerPointName = "/centerPoint";
    let allVertexNames = ["/v1", "/v2", "/v3", "/v4", "/v5", "/v6", "/v7", "/v8", "/v9", "/v10"];
    let polygonCopyName = "/rp2";
    let polygonCopy2Name = "/g4/rp2";

    let inputs = {
      polygonNames: [polygonName, polygonCopyName, polygonCopy2Name],
      vertexNames: allVertexNames.slice(0, nVertices),
      centerPointName
    }

    cy.window().then(async (win) => {
      checkPolygonValues(
        inputs,
        {
          nVertices,
          vertex1,
          center,
        },
        stateVariables
      );
    })


    cy.log("move vertices individually");

    for (let i = 0; i < 3; i++) {
      let index = (i * Math.round(nVertices / 3)) % nVertices;

      cy.window().then(async (win) => {

        let vertex = [index, index + 1];

        await win.callAction1({
          actionName: "movePolygon",
          componentName: polygonName,
          args: {
            pointCoords: { [index]: vertex }
          }
        })

        stateVariables = await win.returnAllStateVariables1();

        let angle = -index * 2 * Math.PI / nVertices;
        let c = Math.cos(angle);
        let s = Math.sin(angle);


        let directionWithRadius = [vertex[0] - center[0], vertex[1] - center[1]];

        vertex1 = [directionWithRadius[0] * c - directionWithRadius[1] * s + center[0], directionWithRadius[0] * s + directionWithRadius[1] * c + center[1]]


        checkPolygonValues(
          inputs,
          {
            nVertices,
            vertex1,
            center,
          },
          stateVariables
        );
      })

    }


    if (!abbreviated) {
      cy.log("move polygon points together");
      cy.window().then(async (win) => {

        stateVariables = await win.returnAllStateVariables1();

        let dx = 3, dy = -2;

        let currentVertices = stateVariables[polygonName].stateValues.vertices;
        let pointCoords = {};

        for (let i = 0; i < nVertices; i++) {
          pointCoords[i] = [currentVertices[i][0] + dx, currentVertices[i][1] + dy]
        }

        vertex1 = pointCoords[0];
        center = [center[0] + dx, center[1] + dy]


        await win.callAction1({
          actionName: "movePolygon",
          componentName: polygonName,
          args: {
            pointCoords
          }
        })
        stateVariables = await win.returnAllStateVariables1();
        checkPolygonValues(
          inputs,
          {
            nVertices,
            vertex1,
            center,
          },
          stateVariables
        );
      })

      cy.log("move center point");
      cy.window().then(async (win) => {

        vertex1 = [vertex1[0] - center[0], vertex1[1] - center[1]]
        center = [0, 0];

        await win.callAction1({
          actionName: "movePoint",
          componentName: centerPointName,
          args: { x: center[0], y: center[1] }
        });



        stateVariables = await win.returnAllStateVariables1();
        checkPolygonValues(
          inputs,
          {
            nVertices,
            vertex1,
            center,
          },
          stateVariables
        );
      })


      cy.log("move copied vertices");
      for (let i = 0; i < 3; i++) {
        let index = (i * Math.round(nVertices / 3) + 1) % nVertices;
        cy.window().then(async (win) => {

          let vertex = [index / 2 + 3, -1.5 * index];

          await win.callAction1({
            actionName: "movePoint",
            componentName: allVertexNames[index],
            args: { x: vertex[0], y: vertex[1] }
          });


          stateVariables = await win.returnAllStateVariables1();

          let angle = -index * 2 * Math.PI / nVertices;
          let c = Math.cos(angle);
          let s = Math.sin(angle);


          let directionWithRadius = [vertex[0] - center[0], vertex[1] - center[1]];

          vertex1 = [directionWithRadius[0] * c - directionWithRadius[1] * s + center[0], directionWithRadius[0] * s + directionWithRadius[1] * c + center[1]]


          checkPolygonValues(
            inputs,
            {
              nVertices,
              vertex1,
              center,
            },
            stateVariables
          );
        })

      }


      cy.log("move polygonCopy vertices individually");
      for (let i = 0; i < 3; i++) {
        let index = (i * Math.round(nVertices / 3) + 2) % nVertices;

        cy.window().then(async (win) => {

          let vertex = [-index - 1, 2 * index];

          await win.callAction1({
            actionName: "movePolygon",
            componentName: polygonCopyName,
            args: {
              pointCoords: { [index]: vertex }
            }
          })

          stateVariables = await win.returnAllStateVariables1();

          let angle = -index * 2 * Math.PI / nVertices;
          let c = Math.cos(angle);
          let s = Math.sin(angle);


          let directionWithRadius = [vertex[0] - center[0], vertex[1] - center[1]];

          vertex1 = [directionWithRadius[0] * c - directionWithRadius[1] * s + center[0], directionWithRadius[0] * s + directionWithRadius[1] * c + center[1]]


          checkPolygonValues(
            inputs,
            {
              nVertices,
              vertex1,
              center,
            },
            stateVariables
          );
        })

      }
    }

    cy.log("polygonCopy vertices together");
    cy.window().then(async (win) => {

      stateVariables = await win.returnAllStateVariables1();

      let dx = -2, dy = -4;

      let currentVertices = stateVariables[polygonCopyName].stateValues.vertices;
      let pointCoords = {};

      for (let i = 0; i < nVertices; i++) {
        pointCoords[i] = [currentVertices[i][0] + dx, currentVertices[i][1] + dy]
      }

      vertex1 = pointCoords[0];
      center = [center[0] + dx, center[1] + dy]



      await win.callAction1({
        actionName: "movePolygon",
        componentName: polygonCopyName,
        args: {
          pointCoords
        }
      })
      stateVariables = await win.returnAllStateVariables1();
      checkPolygonValues(
        inputs,
        {
          nVertices,
          vertex1,
          center,
        },
        stateVariables
      );
    })


    if (!abbreviated) {

      cy.log("move polygonCopy2 vertices individually");
      for (let i = 0; i < 3; i++) {
        let index = (i * Math.round(nVertices / 3) + 3) % nVertices;
        cy.window().then(async (win) => {

          let vertex = [-2 * index - 1, index + 4];

          await win.callAction1({
            actionName: "movePolygon",
            componentName: polygonCopy2Name,
            args: {
              pointCoords: { [index]: vertex }
            }
          })

          stateVariables = await win.returnAllStateVariables1();

          let angle = -index * 2 * Math.PI / nVertices;
          let c = Math.cos(angle);
          let s = Math.sin(angle);


          let directionWithRadius = [vertex[0] - center[0], vertex[1] - center[1]];

          vertex1 = [directionWithRadius[0] * c - directionWithRadius[1] * s + center[0], directionWithRadius[0] * s + directionWithRadius[1] * c + center[1]]


          checkPolygonValues(
            inputs,
            {
              nVertices,
              vertex1,
              center,
            },
            stateVariables
          );
        })

      }


      cy.log("polygonCopy2 vertices together");
      cy.window().then(async (win) => {

        stateVariables = await win.returnAllStateVariables1();

        let dx = 1, dy = -3;

        let currentVertices = stateVariables[polygonCopyName].stateValues.vertices;
        let pointCoords = {};

        for (let i = 0; i < nVertices; i++) {
          pointCoords[i] = [currentVertices[i][0] + dx, currentVertices[i][1] + dy]
        }

        vertex1 = pointCoords[0];
        center = [center[0] + dx, center[1] + dy]



        await win.callAction1({
          actionName: "movePolygon",
          componentName: polygonCopy2Name,
          args: {
            pointCoords
          }
        })
        stateVariables = await win.returnAllStateVariables1();
        checkPolygonValues(
          inputs,
          {
            nVertices,
            vertex1,
            center,
          },
          stateVariables
        );
      })
    }


    cy.log("Change circumradius")
    cy.window().then(async (win) => {

      stateVariables = await win.returnAllStateVariables1();

      let oldCr = stateVariables[polygonName].stateValues.circumradius;

      let circumradius = 1;

      cy.get("#\\/micr textarea").type(`{home}{shift+end}{backspace}${circumradius}{enter}`, { force: true })
      cy.get("#\\/cr").should('have.text', `${circumradius}`)

      vertex1 = [
        (vertex1[0] - center[0]) * circumradius / oldCr + center[0],
        (vertex1[1] - center[1]) * circumradius / oldCr + center[1]
      ]

      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();
        checkPolygonValues(
          inputs,
          {
            nVertices,
            vertex1,
            center,
          },
          stateVariables
        );
      })
    })


    if (!abbreviated) {

      cy.log("Change radius")
      cy.window().then(async (win) => {

        stateVariables = await win.returnAllStateVariables1();

        let oldR = stateVariables[polygonName].stateValues.circumradius;

        let radius = 3;

        cy.get("#\\/mir textarea").type(`{home}{shift+end}{backspace}${radius}{enter}`, { force: true })
        cy.get("#\\/r").should('have.text', `${radius}`)

        vertex1 = [
          (vertex1[0] - center[0]) * radius / oldR + center[0],
          (vertex1[1] - center[1]) * radius / oldR + center[1]
        ]

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              nVertices,
              vertex1,
              center,
            },
            stateVariables
          );
        })
      })


      cy.log("Change inradius")
      cy.window().then(async (win) => {

        stateVariables = await win.returnAllStateVariables1();

        let oldIr = stateVariables[polygonName].stateValues.inradius;

        let inradius = 5;

        cy.get("#\\/miir textarea").type(`{home}{shift+end}{backspace}${inradius}{enter}`, { force: true })
        cy.get("#\\/ir").should('have.text', `${inradius}`)

        vertex1 = [
          (vertex1[0] - center[0]) * inradius / oldIr + center[0],
          (vertex1[1] - center[1]) * inradius / oldIr + center[1]
        ]

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              nVertices,
              vertex1,
              center,
            },
            stateVariables
          );
        })
      })


      cy.log("Change apothem")
      cy.window().then(async (win) => {

        stateVariables = await win.returnAllStateVariables1();

        let oldAp = stateVariables[polygonName].stateValues.inradius;

        let apothem = 4;

        cy.get("#\\/miap textarea").type(`{home}{shift+end}{backspace}${apothem}{enter}`, { force: true })
        cy.get("#\\/ap").should('have.text', `${apothem}`)

        vertex1 = [
          (vertex1[0] - center[0]) * apothem / oldAp + center[0],
          (vertex1[1] - center[1]) * apothem / oldAp + center[1]
        ]

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              nVertices,
              vertex1,
              center,
            },
            stateVariables
          );
        })
      })


      cy.log("Change sideLength")
      cy.window().then(async (win) => {

        stateVariables = await win.returnAllStateVariables1();

        let oldSl = stateVariables[polygonName].stateValues.sideLength;

        let sideLength = 2;

        cy.get("#\\/misl textarea").type(`{home}{shift+end}{backspace}${sideLength}{enter}`, { force: true })
        cy.get("#\\/sl").should('have.text', `${sideLength}`)

        vertex1 = [
          (vertex1[0] - center[0]) * sideLength / oldSl + center[0],
          (vertex1[1] - center[1]) * sideLength / oldSl + center[1]
        ]

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              nVertices,
              vertex1,
              center,
            },
            stateVariables
          );
        })
      })


      cy.log("Change perimeter")
      cy.window().then(async (win) => {

        stateVariables = await win.returnAllStateVariables1();

        let oldSl = stateVariables[polygonName].stateValues.perimeter;

        let perimeter = 9;

        cy.get("#\\/mip textarea").type(`{home}{shift+end}{backspace}${perimeter}{enter}`, { force: true })
        cy.get("#\\/p").should('have.text', `${perimeter}`)

        vertex1 = [
          (vertex1[0] - center[0]) * perimeter / oldSl + center[0],
          (vertex1[1] - center[1]) * perimeter / oldSl + center[1]
        ]

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              nVertices,
              vertex1,
              center,
            },
            stateVariables
          );
        })
      })


      cy.log("Change area")
      cy.window().then(async (win) => {

        stateVariables = await win.returnAllStateVariables1();

        let oldAr = stateVariables[polygonName].stateValues.area;

        let area = 13;

        cy.get("#\\/miar textarea").type(`{home}{shift+end}{backspace}${area}{enter}`, { force: true })
        cy.get("#\\/ar").should('have.text', `${area}`)

        vertex1 = [
          (vertex1[0] - center[0]) * Math.sqrt(area / oldAr) + center[0],
          (vertex1[1] - center[1]) * Math.sqrt(area / oldAr) + center[1]
        ]

        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              nVertices,
              vertex1,
              center,
            },
            stateVariables
          );
        })
      })


    }



    cy.log("Add two vertices")
    cy.window().then(async (win) => {


      let result = adjustVertex1CenterWhenChangeNVertices(vertex1, center, nVertices, nVertices + 2, conservedWhenChangeNvertices);

      vertex1 = result.vertex1;
      center = result.center;

      nVertices += 2;

      cy.get("#\\/minv textarea").type(`{end}+2{enter}`, { force: true })
      cy.get("#\\/nv").should('have.text', `${nVertices}`)


      inputs.vertexNames = allVertexNames.slice(0, nVertices);


      cy.window().then(async (win) => {
        stateVariables = await win.returnAllStateVariables1();
        checkPolygonValues(
          inputs,
          {
            nVertices,
            vertex1,
            center,
          },
          stateVariables
        );
      })
    })



    if (!abbreviated) {

      cy.log("Remove a vertex")
      cy.window().then(async (win) => {

        let result = adjustVertex1CenterWhenChangeNVertices(vertex1, center, nVertices, nVertices - 1, conservedWhenChangeNvertices);

        vertex1 = result.vertex1;
        center = result.center;


        nVertices -= 1;

        cy.get("#\\/minv textarea").type(`{end}-1{enter}`, { force: true })
        cy.get("#\\/nv").should('have.text', `${nVertices}`)


        inputs.vertexNames = allVertexNames.slice(0, nVertices);


        cy.window().then(async (win) => {
          stateVariables = await win.returnAllStateVariables1();
          checkPolygonValues(
            inputs,
            {
              nVertices,
              vertex1,
              center,
            },
            stateVariables
          );
        })
      })
    }



  })
}

function adjustVertex1CenterWhenChangeNVertices(vertex1, center, nVerticesOld, nVerticesNew, conservedWhenChangeNvertices) {

  let radiusRatio = 1;

  if (conservedWhenChangeNvertices === "inradius") {

    radiusRatio = Math.cos(Math.PI / nVerticesOld) / Math.cos(Math.PI / nVerticesNew)

  } else if (conservedWhenChangeNvertices === "sideLength") {

    radiusRatio = (2 * Math.sin(Math.PI / nVerticesOld)) / (2 * Math.sin(Math.PI / nVerticesNew))

  } else if (conservedWhenChangeNvertices === "perimeter") {

    radiusRatio = (2 * nVerticesOld * Math.sin(Math.PI / nVerticesOld)) / (2 * nVerticesNew * Math.sin(Math.PI / nVerticesNew))

  } else if (conservedWhenChangeNvertices === "area") {
    radiusRatio = Math.sqrt((nVerticesOld / 2 * Math.sin(2 * Math.PI / nVerticesOld))
      / (nVerticesNew / 2 * Math.sin(2 * Math.PI / nVerticesNew)))

  } else if (conservedWhenChangeNvertices === "twoVertices") {


    // calculate vertex2
    let directionWithRadius = [vertex1[0] - center[0], vertex1[1] - center[1]];

    let angleOld = 2 * Math.PI / nVerticesOld;
    let c = Math.cos(angleOld);
    let s = Math.sin(angleOld);

    let vertex2 = [directionWithRadius[0] * c - directionWithRadius[1] * s + center[0], directionWithRadius[0] * s + directionWithRadius[1] * c + center[1]];

    // calculate center based on this vertex 2 and new nVertices
    let sideVector = [vertex2[0] - vertex1[0], vertex2[1] - vertex1[1]];
    let midpoint = [(vertex1[0] + vertex2[0]) / 2, (vertex1[1] + vertex2[1]) / 2];
    let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
    let inradius = sideLength / (2 * Math.tan(Math.PI / nVerticesNew));

    let inradiusDirection = [-sideVector[1] / sideLength, sideVector[0] / sideLength];

    center = [midpoint[0] + inradiusDirection[0] * inradius, midpoint[1] + inradiusDirection[1] * inradius];

  }


  vertex1 = [
    (vertex1[0] - center[0]) * radiusRatio + center[0],
    (vertex1[1] - center[1]) * radiusRatio + center[1]
  ]

  return { vertex1, center };

}


function checkPolygonValues({
  polygonNames,
  vertexNames,
  centerPointName
}, {
  nVertices,
  center,
  vertex1,
},
  stateVariables
) {


  let vertexCoords = [vertex1];

  let directionWithRadius = [vertex1[0] - center[0], vertex1[1] - center[1]];

  let circumradius = Math.sqrt(directionWithRadius[0] ** 2 + directionWithRadius[1] ** 2);
  let inradius = circumradius * Math.cos(Math.PI / nVertices);
  let sideLength = circumradius * (2 * Math.sin(Math.PI / nVertices));
  let perimeter = circumradius * (2 * nVertices * Math.sin(Math.PI / nVertices));
  let area = circumradius ** 2 * (nVertices / 2 * Math.sin(2 * Math.PI / nVertices))



  for (let i = 1; i < nVertices; i++) {
    let angle = i * 2 * Math.PI / nVertices;
    let c = Math.cos(angle);
    let s = Math.sin(angle);

    vertexCoords.push([directionWithRadius[0] * c - directionWithRadius[1] * s + center[0], directionWithRadius[0] * s + directionWithRadius[1] * c + center[1]])

  }

  for (let polygonName of polygonNames) {
    let polygon = stateVariables[polygonName];
    for (let i = 0; i < nVertices; i++) {
      expect(polygon.stateValues.vertices[i][0]).closeTo(vertexCoords[i][0], 1E-14 * Math.abs(vertexCoords[i][0]) + 1E-14)
      expect(polygon.stateValues.vertices[i][1]).closeTo(vertexCoords[i][1], 1E-14 * Math.abs(vertexCoords[i][1]) + 1E-14)
    }
    expect(polygon.stateValues.center[0]).closeTo(center[0], 1E-14 * Math.abs(center[0]) + 1E-14);
    expect(polygon.stateValues.center[1]).closeTo(center[1], 1E-14 * Math.abs(center[1]) + 1E-14);

    expect((polygon.stateValues.nVertices)).eq(nVertices);

    expect((polygon.stateValues.circumradius)).closeTo(circumradius, 1E-14 * circumradius);
    expect((polygon.stateValues.inradius)).closeTo(inradius, 1E-14 * inradius);
    expect((polygon.stateValues.sideLength)).closeTo(sideLength, 1E-14 * sideLength);
    expect((polygon.stateValues.perimeter)).closeTo(perimeter, 1E-14 * perimeter);
    expect((polygon.stateValues.area)).closeTo(area, 1E-14 * area);

  }

  if (vertexNames) {
    for (let [i, vertexName] of vertexNames.entries()) {
      let vertex = stateVariables[vertexName];
      expect(vertex.stateValues.xs[0]).closeTo(vertexCoords[i][0], 1E-14 * Math.abs(vertexCoords[i][0]) + 1E-14)
      expect(vertex.stateValues.xs[1]).closeTo(vertexCoords[i][1], 1E-14 * Math.abs(vertexCoords[i][1]) + 1E-14)
    }
  }

  if (centerPointName) {
    let centerPoint = stateVariables[centerPointName];
    expect(centerPoint.stateValues.xs[0]).closeTo(center[0], 1E-14 * Math.abs(center[0]) + 1E-14);
    expect(centerPoint.stateValues.xs[1]).closeTo(center[1], 1E-14 * Math.abs(center[1]) + 1E-14);

  }
}