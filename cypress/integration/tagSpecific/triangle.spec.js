describe('Triangle Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })


  it('triangle with no children', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle/>
    <ref name="vertex1" prop="vertex1">_triangle1</ref>
    <ref name="vertex2" prop="vertex2">_triangle1</ref>
    <ref name="vertex3" prop="vertex3">_triangle1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let v1x = 0, v1y = 1;
      let v2x = 1, v2y = 0;
      let v3x = 0, v3y = 0;

      let vertices = [
        components["/vertex1"].replacements[0],
        components["/vertex2"].replacements[0],
        components["/vertex3"].replacements[0],
      ]

      cy.window().then((win) => {
        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }
      })

      cy.log('move triangle up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let moveX = 3;
        let moveY = 2;

        let desiredVertices = [];
        for (let i = 0; i < components['/_triangle1'].stateValues.nVertices; i++) {
          desiredVertices.push([
            components['/_triangle1'].stateValues.vertices[i].get_component(0).add(moveX),
            components['/_triangle1'].stateValues.vertices[i].get_component(1).add(moveY)
          ])
        }

        components['/_triangle1'].movePolygon(desiredVertices);

        v1x += moveX;
        v2x += moveX;
        v3x += moveX;
        v1y += moveY;
        v2y += moveY;
        v3y += moveY;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < vertices.length; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }

      })


      cy.log('move each point')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        v1x = 7, v2x = -5, v3x = -1;
        v1y = -4, v2y = -9, v3y = 8;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          vertices[i].movePoint({ x: pxs[i], y: pys[i] })
        }

        for (let i = 0; i < 3; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }

      })
    })

  })

  it('triangle with empty vertices', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle><vertices/></triangle>
    <ref name="vertex1" prop="vertex1">_triangle1</ref>
    <ref name="vertex2" prop="vertex2">_triangle1</ref>
    <ref name="vertex3" prop="vertex3">_triangle1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let v1x = 0, v1y = 1;
      let v2x = 1, v2y = 0;
      let v3x = 0, v3y = 0;

      let vertices = [
        components["/vertex1"].replacements[0],
        components["/vertex2"].replacements[0],
        components["/vertex3"].replacements[0],
      ]

      cy.window().then((win) => {
        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }
      })

      cy.log('move triangle up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let moveX = 3;
        let moveY = 2;

        let desiredVertices = [];
        for (let i = 0; i < components['/_triangle1'].stateValues.nVertices; i++) {
          desiredVertices.push([
            components['/_triangle1'].stateValues.vertices[i].get_component(0).add(moveX),
            components['/_triangle1'].stateValues.vertices[i].get_component(1).add(moveY)
          ])
        }

        components['/_triangle1'].movePolygon(desiredVertices);

        v1x += moveX;
        v2x += moveX;
        v3x += moveX;
        v1y += moveY;
        v2y += moveY;
        v3y += moveY;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < vertices.length; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }

      })


      cy.log('move each point')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        v1x = 7, v2x = -5, v3x = -1;
        v1y = -4, v2y = -9, v3y = 8;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          vertices[i].movePoint({ x: pxs[i], y: pys[i] })
        }

        for (let i = 0; i < 3; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }

      })
    })

  })

  it('triangle with one vertex specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle><vertices>
      (-8,5)
    </vertices></triangle>
    <ref name="vertex1" prop="vertex1">_triangle1</ref>
    <ref name="vertex2" prop="vertex2">_triangle1</ref>
    <ref name="vertex3" prop="vertex3">_triangle1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let v1x = -8, v1y = 5;
      let v2x = 1, v2y = 0;
      let v3x = 0, v3y = 0;

      let vertices = [
        components["/vertex1"].replacements[0],
        components["/vertex2"].replacements[0],
        components["/vertex3"].replacements[0],
      ]

      cy.window().then((win) => {
        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }
      })

      cy.log('move triangle up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let moveX = 3;
        let moveY = 2;

        let desiredVertices = [];
        for (let i = 0; i < components['/_triangle1'].stateValues.nVertices; i++) {
          desiredVertices.push([
            components['/_triangle1'].stateValues.vertices[i].get_component(0).add(moveX),
            components['/_triangle1'].stateValues.vertices[i].get_component(1).add(moveY)
          ])
        }

        components['/_triangle1'].movePolygon(desiredVertices);

        v1x += moveX;
        v2x += moveX;
        v3x += moveX;
        v1y += moveY;
        v2y += moveY;
        v3y += moveY;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < vertices.length; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }

      })


      cy.log('move each point')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        v1x = 7, v2x = -5, v3x = -1;
        v1y = -4, v2y = -9, v3y = 8;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          vertices[i].movePoint({ x: pxs[i], y: pys[i] })
        }

        for (let i = 0; i < 3; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }

      })
    })

  })

  it('triangle with two vertices specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle><vertices>
      (-8,5), (6,2)
    </vertices></triangle>
    <ref name="vertex1" prop="vertex1">_triangle1</ref>
    <ref name="vertex2" prop="vertex2">_triangle1</ref>
    <ref name="vertex3" prop="vertex3">_triangle1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let v1x = -8, v1y = 5;
      let v2x = 6, v2y = 2;
      let v3x = 0, v3y = 0;

      let vertices = [
        components["/vertex1"].replacements[0],
        components["/vertex2"].replacements[0],
        components["/vertex3"].replacements[0],
      ]

      cy.window().then((win) => {
        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }
      })

      cy.log('move triangle up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let moveX = 3;
        let moveY = 2;

        let desiredVertices = [];
        for (let i = 0; i < components['/_triangle1'].stateValues.nVertices; i++) {
          desiredVertices.push([
            components['/_triangle1'].stateValues.vertices[i].get_component(0).add(moveX),
            components['/_triangle1'].stateValues.vertices[i].get_component(1).add(moveY)
          ])
        }

        components['/_triangle1'].movePolygon(desiredVertices);

        v1x += moveX;
        v2x += moveX;
        v3x += moveX;
        v1y += moveY;
        v2y += moveY;
        v3y += moveY;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < vertices.length; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }

      })


      cy.log('move each point')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        v1x = 7, v2x = -5, v3x = -1;
        v1y = -4, v2y = -9, v3y = 8;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          vertices[i].movePoint({ x: pxs[i], y: pys[i] })
        }

        for (let i = 0; i < 3; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }

      })
    })

  })

  it('triangle with three vertices specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle><vertices>
      (-8,5), (6,2), (5,-4)
    </vertices></triangle>
    <ref name="vertex1" prop="vertex1">_triangle1</ref>
    <ref name="vertex2" prop="vertex2">_triangle1</ref>
    <ref name="vertex3" prop="vertex3">_triangle1</ref>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let v1x = -8, v1y = 5;
      let v2x = 6, v2y = 2;
      let v3x = 5, v3y = -4;

      let vertices = [
        components["/vertex1"].replacements[0],
        components["/vertex2"].replacements[0],
        components["/vertex3"].replacements[0],
      ]

      cy.window().then((win) => {
        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }
      })

      cy.log('move triangle up and to the right')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        let moveX = 3;
        let moveY = 2;

        let desiredVertices = [];
        for (let i = 0; i < components['/_triangle1'].stateValues.nVertices; i++) {
          desiredVertices.push([
            components['/_triangle1'].stateValues.vertices[i].get_component(0).add(moveX),
            components['/_triangle1'].stateValues.vertices[i].get_component(1).add(moveY)
          ])
        }

        components['/_triangle1'].movePolygon(desiredVertices);

        v1x += moveX;
        v2x += moveX;
        v3x += moveX;
        v1y += moveY;
        v2y += moveY;
        v3y += moveY;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < vertices.length; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }

      })


      cy.log('move each point')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);

        v1x = 7, v2x = -5, v3x = -1;
        v1y = -4, v2y = -9, v3y = 8;

        let pxs = [v1x, v2x, v3x];
        let pys = [v1y, v2y, v3y];

        for (let i = 0; i < 3; i++) {
          vertices[i].movePoint({ x: pxs[i], y: pys[i] })
        }

        for (let i = 0; i < 3; i++) {
          expect(components['/_triangle1'].stateValues.vertices[i].tree).eqls(['vector', pxs[i], pys[i]]);
          expect(vertices[i].stateValues.coords.tree).eqls(['vector', pxs[i], pys[i]]);
        }

      })
    })

  })

  it('constrain to triangle', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle>
      (0,0),(6,0),(0,6)
    </triangle>
    <point>
      (10,10)
      <constrainTo><ref>_triangle1</ref></constrainTo>
    </point>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', 0, 0]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 6, 0]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', 0, 6]);
      expect(components['/_point1'].stateValues.xs[0].tree).eq(3);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(3);


    })

    cy.log("move point upper left")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -3, y: 8 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(0);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(6);
    })

    cy.log("move point to left")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -5, y: 4 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(0);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(4);
    })

    cy.log("move point to lower left")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -7, y: -3 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(0);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(0);
    })

    cy.log("move point to lower right")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 8, y: -8 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(6);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(0);
    })

    cy.log("move point to right")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 8, y: 4 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(5);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(1);
    })

    cy.log("move point to middle")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.5, y: 3.5 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(2);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(4);
    })

    cy.log("move point a little left")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1, y: 3 });
      expect(components['/_point1'].stateValues.xs[0].tree).eq(0);
      expect(components['/_point1'].stateValues.xs[1].tree).eq(3);
    })


  })

  it('reflect triangle via individual vertices', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle>(1,2),(3,4),(-5,6)</triangle>

  <triangle>
    <point>
      <x>
        <extract prop="y"><ref prop="vertex1">_triangle1</ref></extract>
      </x>
      <y>
        <extract prop="x"><ref prop="vertex1">_triangle1</ref></extract>
      </y>
    </point>
    <point>
      (<extract prop="y"><ref prop="vertex2">_triangle1</ref></extract>,
        <extract prop="x"><ref prop="vertex2">_triangle1</ref></extract>)
    </point>
    <ref>flip3</ref>
  </triangle>
  </graph>

  <point name="flip3">
  <x>
    <extract prop="y"><ref prop="vertex3">_triangle1</ref></extract>
  </x>
  <y>
    <extract prop="x"><ref prop="vertex3">_triangle1</ref></extract>
  </y>
  </point>

  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', 1, 2]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 3, 4]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', -5, 6]);
      expect(components['/_triangle2'].stateValues.vertices[0].tree).eqls(['vector', 2, 1]);
      expect(components['/_triangle2'].stateValues.vertices[1].tree).eqls(['vector', 4, 3]);
      expect(components['/_triangle2'].stateValues.vertices[2].tree).eqls(['vector', 6, -5]);
    })

    cy.log('move first triangle verticies')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x1 = 8, y1 = -1;
      let x2 = 0, y2 = -5;
      let x3 = 7, y3 = 9;

      let vertices = [
        [x1, y1],
        [x2, y2],
        [x3, y3],
      ];

      components['/_triangle1'].movePolygon(vertices);

      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', x1, y1]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', x2, y2]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', x3, y3]);
      expect(components['/_triangle2'].stateValues.vertices[0].tree).eqls(['vector', y1, x1]);
      expect(components['/_triangle2'].stateValues.vertices[1].tree).eqls(['vector', y2, x2]);
      expect(components['/_triangle2'].stateValues.vertices[2].tree).eqls(['vector', y3, x3]);

    })

    cy.log('move second triangle verticies')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x1 = -5, y1 = 2;
      let x2 = -8, y2 = 9;
      let x3 = 3, y3 = -6;

      let vertices = [
        [y1, x1],
        [y2, x2],
        [y3, x3],
      ];

      components['/_triangle2'].movePolygon(vertices);

      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', x1, y1]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', x2, y2]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', x3, y3]);
      expect(components['/_triangle2'].stateValues.vertices[0].tree).eqls(['vector', y1, x1]);
      expect(components['/_triangle2'].stateValues.vertices[1].tree).eqls(['vector', y2, x2]);
      expect(components['/_triangle2'].stateValues.vertices[2].tree).eqls(['vector', y3, x3]);

    })

  })

  it('reflect triangle via individual vertices, one vertex specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle>(1,2)</triangle>

  <triangle>
    <point>
      <x>
        <extract prop="y"><ref prop="vertex1">_triangle1</ref></extract>
      </x>
      <y>
        <extract prop="x"><ref prop="vertex1">_triangle1</ref></extract>
      </y>
    </point>
    <point>
      (<extract prop="y"><ref prop="vertex2">_triangle1</ref></extract>,
        <extract prop="x"><ref prop="vertex2">_triangle1</ref></extract>)
    </point>
    <ref>flip3</ref>
  </triangle>
  </graph>

  <point name="flip3">
  <x>
    <extract prop="y"><ref prop="vertex3">_triangle1</ref></extract>
  </x>
  <y>
    <extract prop="x"><ref prop="vertex3">_triangle1</ref></extract>
  </y>
  </point>

  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', 1, 2]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 1, 0]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', 0, 0]);
      expect(components['/_triangle2'].stateValues.vertices[0].tree).eqls(['vector', 2, 1]);
      expect(components['/_triangle2'].stateValues.vertices[1].tree).eqls(['vector', 0, 1]);
      expect(components['/_triangle2'].stateValues.vertices[2].tree).eqls(['vector', 0, 0]);
    })

    cy.log('move first triangle verticies')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x1 = 8, y1 = -1;
      let x2 = 0, y2 = -5;
      let x3 = 7, y3 = 9;

      let vertices = [
        [x1, y1],
        [x2, y2],
        [x3, y3],
      ];

      components['/_triangle1'].movePolygon(vertices);

      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', x1, y1]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', x2, y2]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', x3, y3]);
      expect(components['/_triangle2'].stateValues.vertices[0].tree).eqls(['vector', y1, x1]);
      expect(components['/_triangle2'].stateValues.vertices[1].tree).eqls(['vector', y2, x2]);
      expect(components['/_triangle2'].stateValues.vertices[2].tree).eqls(['vector', y3, x3]);

    })

    cy.log('move second triangle verticies')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let x1 = -5, y1 = 2;
      let x2 = -8, y2 = 9;
      let x3 = 3, y3 = -6;

      let vertices = [
        [y1, x1],
        [y2, x2],
        [y3, x3],
      ];

      components['/_triangle2'].movePolygon(vertices);

      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', x1, y1]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', x2, y2]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', x3, y3]);
      expect(components['/_triangle2'].stateValues.vertices[0].tree).eqls(['vector', y1, x1]);
      expect(components['/_triangle2'].stateValues.vertices[1].tree).eqls(['vector', y2, x2]);
      expect(components['/_triangle2'].stateValues.vertices[2].tree).eqls(['vector', y3, x3]);

    })

  })

  it('triangle with one vertex refection of other', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle>
    <point name="A">
      <x><ref prop="y">B</ref></x>
      <y><ref prop="x">B</ref></y>
    </point>
    <point name="B">(3,5)</point>
    <point name="C">(-5,2)</point>
  </triangle>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', 5, 3]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 3, 5]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', -5, 2]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 0: [-1, 4] });
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', -1, 4]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 4, -1]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', -5, 2]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 1: [7, -8] });
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', -8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', -5, 2]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 2: [0, 6] });
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', -8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', 0, 6]);
    })

  })

  it('triangle with one vertex refection of other with interval references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle>
    <point>
      <x><extract prop="y"><ref prop="vertex2">_triangle1</ref></extract></x>
      <y><extract prop="x"><ref prop="vertex2">_triangle1</ref></extract></y>
    </point>
    <point>(3,5)</point>
    <point>(-5,2)</point>
  </triangle>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', 5, 3]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 3, 5]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', -5, 2]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 0: [-1, 4] });
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', -1, 4]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 4, -1]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', -5, 2]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 1: [7, -8] });
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', -8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', -5, 2]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 2: [0, 6] });
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', -8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', 0, 6]);
    })

  })

  it('triangle with one vertex refection of other with interval references, one vertex specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle>
    <point>
      <x><extract prop="y"><ref prop="vertex2">_triangle1</ref></extract></x>
      <y><extract prop="x"><ref prop="vertex2">_triangle1</ref></extract></y>
    </point>
  </triangle>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', 0, 1]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 1, 0]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', 0, 0]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 0: [-1, 4] });
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', -1, 4]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 4, -1]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', 0, 0]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 1: [7, -8] });
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', -8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', 0, 0]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 2: [0, 6] });
      expect(components['/_triangle1'].stateValues.vertices[0].tree).eqls(['vector', -8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].tree).eqls(['vector', 7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].tree).eqls(['vector', 0, 6]);
    })

  })


});