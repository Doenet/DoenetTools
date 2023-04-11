import { cesc } from '../../../../src/_utils/url';

describe('Regular Polygon Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })

  it('specify radius for square', () => {

    setupScene({
      attributes: {
        nVertices: "4",
        radius: "7",
        center: "(-6,-2)"
      },
    });

    runTests({
      nVertices: 4,
      vertex1: [-6 + 7, -2],
      center: [-6, -2],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });

  });

  it('specify center for pentagon', () => {

    setupScene({
      attributes: {
        nVertices: "5",
        center: "(-5,-3)"
      },
    });

    runTests({
      nVertices: 5,
      vertex1: [-5 + 1, -3],
      center: [-5, -3],
      conservedWhenChangeNvertices: "circumradius"
    });

  });

  it('specify one vertex for square', () => {

    setupScene({
      attributes: {
        nVertices: 4,
        vertices: "(2,-5)"
      },
    });

    runTests({
      nVertices: 4,
      vertex1: [2, -5],
      center: [1, -5],
      conservedWhenChangeNvertices: "circumradius"
    });

  });

  it('specify two vertices for pentagon', () => {

    setupScene({
      attributes: {
        nVertices: "5",
        vertices: "(2,-5) (5,1)"
      },
    });

    let nVertices = 5;

    let vertex1 = [2, -5];
    let vertex2 = [5, 1];

    let sideVector = [vertex2[0] - vertex1[0], vertex2[1] - vertex1[1]];
    let midpoint = [(vertex1[0] + vertex2[0]) / 2, (vertex1[1] + vertex2[1]) / 2];
    let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
    let inradius = sideLength / (2 * Math.tan(Math.PI / nVertices));

    let inradiusDirection = [-sideVector[1] / sideLength, sideVector[0] / sideLength];

    let center = [midpoint[0] + inradiusDirection[0] * inradius, midpoint[1] + inradiusDirection[1] * inradius];


    runTests({
      nVertices,
      vertex1,
      center,
      conservedWhenChangeNvertices: "twoVertices"
    });

  });

  it('specify center and one vertex for triangle', () => {

    setupScene({
      attributes: {
        nVertices: "3",
        vertices: "(2,-5)",
        center: "(-1,-3)"
      },
    });

    runTests({
      nVertices: 3,
      vertex1: [2, -5],
      center: [-1, -3],
      conservedWhenChangeNvertices: "circumradius"
    });

  });

  it('specify center and two vertices for triangle, ignore second vertex', () => {

    setupScene({
      attributes: {
        nVertices: "3",
        vertices: "(2,-5) (10,12)",
        center: "(-1,-3)"
      },
    });

    runTests({
      nVertices: 3,
      vertex1: [2, -5],
      center: [-1, -3],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });

  });

  it('specify center and vertex for triangle, ignore all size attributes', () => {

    setupScene({
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

    runTests({
      nVertices: 3,
      vertex1: [2, -5],
      center: [-1, -3],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });

  })

  it('specify center and circumradius for triangle, ignore all other size attributes', () => {

    setupScene({
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

    runTests({
      nVertices: 3,
      vertex1: [10, -3],
      center: [-1, -3],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });


  });

  it('specify vertex and circumradius for triangle, ignore all other size attributes', () => {

    setupScene({
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

    runTests({
      nVertices: 3,
      vertex1: [2, -5],
      center: [-9, -5],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });


  });

  it('specify two vertices for triangle, ingnore all size attributes', () => {

    setupScene({
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
    let midpoint = [(vertex1[0] + vertex2[0]) / 2, (vertex1[1] + vertex2[1]) / 2];
    let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
    let inradius = sideLength / (2 * Math.tan(Math.PI / nVertices));

    let inradiusDirection = [-sideVector[1] / sideLength, sideVector[0] / sideLength];

    let center = [midpoint[0] + inradiusDirection[0] * inradius, midpoint[1] + inradiusDirection[1] * inradius];


    runTests({
      nVertices,
      vertex1,
      center,
      conservedWhenChangeNvertices: "twoVertices",
      abbreviated: true,
    });

  });

  it('specify circumradius for triangle, ignore all other size attributes', () => {

    setupScene({
      attributes: {
        nVertices: "3",
        circumradius: "11",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runTests({
      nVertices: 3,
      vertex1: [11, 0],
      center: [0, 0],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });


  });

  it('specify radius for triangle, ignore all other size attributes', () => {

    setupScene({
      attributes: {
        nVertices: "3",
        radius: "11",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runTests({
      nVertices: 3,
      vertex1: [11, 0],
      center: [0, 0],
      conservedWhenChangeNvertices: "circumradius",
      abbreviated: true,
    });


  });

  it('specify inradius for triangle, ignore all other size attributes', () => {

    setupScene({
      attributes: {
        nVertices: "3",
        inradius: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runTests({
      nVertices: 3,
      vertex1: [3 / (Math.cos(Math.PI / 3)), 0],
      center: [0, 0],
      conservedWhenChangeNvertices: "inradius",
      abbreviated: true,
    });


  });

  it('specify center and apothem for triangle, ignore all other size attributes', () => {

    setupScene({
      attributes: {
        nVertices: "3",
        center: "(-1,-3)",
        apothem: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runTests({
      nVertices: 3,
      vertex1: [-1 + 3 / (Math.cos(Math.PI / 3)), -3],
      center: [-1, -3],
      conservedWhenChangeNvertices: "inradius",
      abbreviated: true,
    });


  });

  it('specify sideLength for triangle, ignore all other size attributes', () => {

    setupScene({
      attributes: {
        nVertices: "3",
        sideLength: "5",
        perimeter: "10",
        area: "99",
      },
    });

    runTests({
      nVertices: 3,
      vertex1: [5 / (2 * Math.sin(Math.PI / 3)), 0],
      center: [0, 0],
      conservedWhenChangeNvertices: "sideLength",
      abbreviated: true,
    });


  });

  it('specify center and perimeter for triangle, ignore area', () => {

    setupScene({
      attributes: {
        nVertices: "3",
        center: "(-1,-3)",
        perimeter: "10",
        area: "99",
      },
    });

    runTests({
      nVertices: 3,
      vertex1: [-1 + 10 / (3 * 2 * Math.sin(Math.PI / 3)), -3],
      center: [-1, -3],
      conservedWhenChangeNvertices: "perimeter",
      abbreviated: true,
    });


  });

  it('draggable, vertices draggable', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <graph>
    <regularpolygon vertices="(1,3) (5,7)" name="p" draggable="$draggable" verticesDraggable="$verticesDraggable" />
  </graph>
  <p>To wait: <booleaninput name="bi" /> <boolean copySource="bi" name="bi2" /></p>
  <p>draggable: <booleaninput name="draggable" /> <boolean copySource="p.draggable" name="d2" /></p>
  <p>vertices draggable: <booleaninput name="verticesDraggable" /> <boolean copySource="p.verticesDraggable" name="vd2" /></p>
  <p name="pvert">two vertices: $p.vertex1 $p.vertex2</p>
  `}, "*");
    });

    cy.get(cesc("#\\/d2")).should('have.text', 'false')
    cy.get(cesc("#\\/vd2")).should('have.text', 'false')
    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(0).should('have.text', '(1,3)')
    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(2).should('have.text', '(5,7)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p'].stateValues.draggable).eq(false);
      expect(stateVariables['/p'].stateValues.verticesDraggable).eq(false);
    })

    cy.log('cannot move single vertex')
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: { 0: [4, 7] }
        }
      })
    })


    // wait for core to process click
    cy.get(cesc('#\\/bi')).click()
    cy.get(cesc('#\\/bi2')).should('have.text', 'true')

    cy.get(cesc("#\\/d2")).should('have.text', 'false')
    cy.get(cesc("#\\/vd2")).should('have.text', 'false')

    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(0).should('have.text', '(1,3)')
    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(2).should('have.text', '(5,7)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p'].stateValues.draggable).eq(false);
      expect(stateVariables['/p'].stateValues.verticesDraggable).eq(false);
    })



    cy.log('cannot move all vertices')
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [[4, 7], [8, 10], [1, 9]]
        }
      })
    })


    // wait for core to process click
    cy.get(cesc('#\\/bi')).click()
    cy.get(cesc('#\\/bi2')).should('have.text', 'false')

    cy.get(cesc("#\\/d2")).should('have.text', 'false')
    cy.get(cesc("#\\/vd2")).should('have.text', 'false')

    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(0).should('have.text', '(1,3)')
    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(2).should('have.text', '(5,7)')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p'].stateValues.draggable).eq(false);
      expect(stateVariables['/p'].stateValues.verticesDraggable).eq(false);
    })


    cy.log('only vertices draggable')

    cy.get(cesc('#\\/verticesDraggable')).click()
    cy.get(cesc('#\\/vd2')).should('have.text', 'true')


    cy.log('can move single vertex')
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: { 0: [4, 7] }
        }
      })
    })


    cy.get(cesc("#\\/pvert") + " .mjx-mrow").should('contain.text', '(4,7)')

    cy.get(cesc("#\\/d2")).should('have.text', 'false')
    cy.get(cesc("#\\/vd2")).should('have.text', 'true')

    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(0).should('have.text', '(4,7)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p'].stateValues.draggable).eq(false);
      expect(stateVariables['/p'].stateValues.verticesDraggable).eq(true);
    })



    cy.log('cannot move all vertices')
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [[3, 8], [8, 10], [1, 9]]
        }
      })
    })


    // wait for core to process click
    cy.get(cesc('#\\/bi')).click()
    cy.get(cesc('#\\/bi2')).should('have.text', 'true')

    cy.get(cesc("#\\/d2")).should('have.text', 'false')
    cy.get(cesc("#\\/vd2")).should('have.text', 'true')


    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(0).should('have.text', '(4,7)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/p'].stateValues.vertices)[0]).eqls([4, 7]);
      expect(stateVariables['/p'].stateValues.draggable).eq(false);
      expect(stateVariables['/p'].stateValues.verticesDraggable).eq(true);
    })



    cy.log('vertices and polygon draggable')

    cy.get(cesc('#\\/draggable')).click()
    cy.get(cesc('#\\/d2')).should('have.text', 'true')


    cy.log('can move single vertex')
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: { 1: [-3, 2] }
        }
      })
    })


    cy.get(cesc("#\\/pvert") + " .mjx-mrow").should('contain.text', '(−3,2)')

    cy.get(cesc("#\\/d2")).should('have.text', 'true')
    cy.get(cesc("#\\/vd2")).should('have.text', 'true')

    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(2).should('have.text', '(−3,2)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p'].stateValues.draggable).eq(true);
      expect(stateVariables['/p'].stateValues.verticesDraggable).eq(true);
    })



    cy.log('can move all vertices')
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [[3, 8], [5, 8], [4, 8 + Math.sqrt(3)]]
        }
      })
    })


    cy.get(cesc("#\\/pvert") + " .mjx-mrow").should('contain.text', '(3,8)')


    cy.get(cesc("#\\/d2")).should('have.text', 'true')
    cy.get(cesc("#\\/vd2")).should('have.text', 'true')


    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(0).should('have.text', '(3,8)')
    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(2).should('have.text', '(5,8)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p'].stateValues.draggable).eq(true);
      expect(stateVariables['/p'].stateValues.verticesDraggable).eq(true);
    })


    cy.log('polygon but not vertices draggable')

    cy.get(cesc('#\\/verticesDraggable')).click()
    cy.get(cesc('#\\/vd2')).should('have.text', 'false')


    cy.log('cannot move single vertex')
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: { 0: [9, 3] }
        }
      })
    })

    // wait for core to process click
    cy.get(cesc('#\\/bi')).click()
    cy.get(cesc('#\\/bi2')).should('have.text', 'false')


    cy.get(cesc("#\\/d2")).should('have.text', 'true')
    cy.get(cesc("#\\/vd2")).should('have.text', 'false')

    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(0).should('have.text', '(3,8)')
    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(2).should('have.text', '(5,8)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p'].stateValues.draggable).eq(true);
      expect(stateVariables['/p'].stateValues.verticesDraggable).eq(false);
    })



    cy.log('can move all vertices')
    cy.window().then(async (win) => {

      await win.callAction1({
        actionName: "movePolygon",
        componentName: "/p",
        args: {
          pointCoords: [[-4, 1], [-4, 5], [-4 - 2 * Math.sqrt(3), 3]]
        }
      })
    })


    cy.get(cesc("#\\/pvert") + " .mjx-mrow").should('contain.text', '(−4,1)')


    cy.get(cesc("#\\/d2")).should('have.text', 'true')
    cy.get(cesc("#\\/vd2")).should('have.text', 'false')


    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(0).should('have.text', '(−4,1)')
    cy.get(cesc("#\\/pvert") + " .mjx-mrow").eq(2).should('have.text', '(−4,5)')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/p'].stateValues.draggable).eq(true);
      expect(stateVariables['/p'].stateValues.verticesDraggable).eq(false);
    })



  })


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
  cy.get(cesc('#\\/_text1')).should('have.text', 'a'); // to wait for page to load

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

      cy.get(cesc("#\\/micr") + " textarea").type(`{home}{shift+end}{backspace}${circumradius}{enter}`, { force: true })
      cy.get(cesc("#\\/cr")).should('have.text', `${circumradius}`)

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

        cy.get(cesc("#\\/mir") + " textarea").type(`{home}{shift+end}{backspace}${radius}{enter}`, { force: true })
        cy.get(cesc("#\\/r")).should('have.text', `${radius}`)

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

        cy.get(cesc("#\\/miir") + " textarea").type(`{home}{shift+end}{backspace}${inradius}{enter}`, { force: true })
        cy.get(cesc("#\\/ir")).should('have.text', `${inradius}`)

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

        cy.get(cesc("#\\/miap") + " textarea").type(`{home}{shift+end}{backspace}${apothem}{enter}`, { force: true })
        cy.get(cesc("#\\/ap")).should('have.text', `${apothem}`)

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

        cy.get(cesc("#\\/misl") + " textarea").type(`{home}{shift+end}{backspace}${sideLength}{enter}`, { force: true })
        cy.get(cesc("#\\/sl")).should('have.text', `${sideLength}`)

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

        cy.get(cesc("#\\/mip") + " textarea").type(`{home}{shift+end}{backspace}${perimeter}{enter}`, { force: true })
        cy.get(cesc("#\\/p")).should('have.text', `${perimeter}`)

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

        cy.get(cesc("#\\/miar") + " textarea").type(`{home}{shift+end}{backspace}${area}{enter}`, { force: true })
        cy.get(cesc("#\\/ar")).should('have.text', `${area}`)

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

      cy.get(cesc("#\\/minv") + " textarea").type(`{end}+2{enter}`, { force: true })
      cy.get(cesc("#\\/nv")).should('have.text', `${nVertices}`)


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

        cy.get(cesc("#\\/minv") + " textarea").type(`{end}-1{enter}`, { force: true })
        cy.get(cesc("#\\/nv")).should('have.text', `${nVertices}`)


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