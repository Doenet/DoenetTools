describe('Triangle Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })


  it('triangle with no children', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <triangle/>
    <copy name="vertex1" prop="vertex1" tname="_triangle1" />
    <copy name="vertex2" prop="vertex2" tname="_triangle1" />
    <copy name="vertex3" prop="vertex3" tname="_triangle1" />
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
            components['/_triangle1'].stateValues.vertices[i][0].add(moveX),
            components['/_triangle1'].stateValues.vertices[i][1].add(moveY)
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
    <triangle vertices="" />
    <copy name="vertex1" prop="vertex1" tname="_triangle1" />
    <copy name="vertex2" prop="vertex2" tname="_triangle1" />
    <copy name="vertex3" prop="vertex3" tname="_triangle1" />
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
            components['/_triangle1'].stateValues.vertices[i][0].add(moveX),
            components['/_triangle1'].stateValues.vertices[i][1].add(moveY)
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
    <triangle vertices="(-8,5)" />
    <copy name="vertex1" prop="vertex1" tname="_triangle1" />
    <copy name="vertex2" prop="vertex2" tname="_triangle1" />
    <copy name="vertex3" prop="vertex3" tname="_triangle1" />
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
            components['/_triangle1'].stateValues.vertices[i][0].add(moveX),
            components['/_triangle1'].stateValues.vertices[i][1].add(moveY)
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
    <triangle vertices="(-8,5) (6,2)" />
    <copy name="vertex1" prop="vertex1" tname="_triangle1" />
    <copy name="vertex2" prop="vertex2" tname="_triangle1" />
    <copy name="vertex3" prop="vertex3" tname="_triangle1" />
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
            components['/_triangle1'].stateValues.vertices[i][0].add(moveX),
            components['/_triangle1'].stateValues.vertices[i][1].add(moveY)
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
    <triangle vertices="(-8,5) (6,2) (5,-4)" />
    <copy name="vertex1" prop="vertex1" tname="_triangle1" />
    <copy name="vertex2" prop="vertex2" tname="_triangle1" />
    <copy name="vertex3" prop="vertex3" tname="_triangle1" />
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
            components['/_triangle1'].stateValues.vertices[i][0].add(moveX),
            components['/_triangle1'].stateValues.vertices[i][1].add(moveY)
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
          expect(components['/_triangle1'].stateValues.vertices[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
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
    <triangle vertices="(0,0) (6,0) (0,6)" />
    <point x="10" y="10">
      <constraints>
      <constrainTo><copy tname="_triangle1" /></constrainTo>
      </constraints>
    </point>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([0, 0]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([6, 0]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([0, 6]);
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
      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(5, 1E-14);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(1, 1E-14);
    })

    cy.log("move point to middle")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1.5, y: 3.5 });
      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(2, 1E-14);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(4, 1E-14);
    })

    cy.log("move point a little left")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: 1, y: 3 });
      expect(components['/_point1'].stateValues.xs[0].tree).closeTo(0, 1E-14);
      expect(components['/_point1'].stateValues.xs[1].tree).closeTo(3, 1E-14);
    })


  })

  it('reflect triangle via individual vertices', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle vertices="(1,2) (3,4) (-5,6)" />

  <triangle vertices="($(_triangle1{prop='vertexX1_2'}), $(_triangle1{prop='vertexX1_1'})) ($(_triangle1{prop='vertexX2_2'}), $(_triangle1{prop='vertexX2_1'})) $flip3" />
  </graph>

  <point name="flip3">
    (<extract prop="y"><copy prop="vertex3" tname="_triangle1" /></extract>,
    <extract prop="x"><copy prop="vertex3" tname="_triangle1" /></extract>)
  </point>

  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([1, 2]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([3, 4]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([-5, 6]);
      expect(components['/_triangle2'].stateValues.vertices[0].map(x => x.tree)).eqls([2, 1]);
      expect(components['/_triangle2'].stateValues.vertices[1].map(x => x.tree)).eqls([4, 3]);
      expect(components['/_triangle2'].stateValues.vertices[2].map(x => x.tree)).eqls([6, -5]);
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

      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([x1, y1]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_triangle2'].stateValues.vertices[0].map(x => x.tree)).eqls([y1, x1]);
      expect(components['/_triangle2'].stateValues.vertices[1].map(x => x.tree)).eqls([y2, x2]);
      expect(components['/_triangle2'].stateValues.vertices[2].map(x => x.tree)).eqls([y3, x3]);

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

      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([x1, y1]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_triangle2'].stateValues.vertices[0].map(x => x.tree)).eqls([y1, x1]);
      expect(components['/_triangle2'].stateValues.vertices[1].map(x => x.tree)).eqls([y2, x2]);
      expect(components['/_triangle2'].stateValues.vertices[2].map(x => x.tree)).eqls([y3, x3]);

    })

  })

  it('reflect triangle via individual vertices, one vertex specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle vertices="(1,2)" />

  <triangle vertices="($(_triangle1{prop='vertexX1_2'}), $(_triangle1{prop='vertexX1_1'})) ($(_triangle1{prop='vertexX2_2'}), $(_triangle1{prop='vertexX2_1'})) $flip3" />
  </graph>

  <point name="flip3">
    (<extract prop="y"><copy prop="vertex3" tname="_triangle1" /></extract>,
    <extract prop="x"><copy prop="vertex3" tname="_triangle1" /></extract>)
  </point>

  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([1, 2]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([1, 0]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([0, 0]);
      expect(components['/_triangle2'].stateValues.vertices[0].map(x => x.tree)).eqls([2, 1]);
      expect(components['/_triangle2'].stateValues.vertices[1].map(x => x.tree)).eqls([0, 1]);
      expect(components['/_triangle2'].stateValues.vertices[2].map(x => x.tree)).eqls([0, 0]);
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

      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([x1, y1]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_triangle2'].stateValues.vertices[0].map(x => x.tree)).eqls([y1, x1]);
      expect(components['/_triangle2'].stateValues.vertices[1].map(x => x.tree)).eqls([y2, x2]);
      expect(components['/_triangle2'].stateValues.vertices[2].map(x => x.tree)).eqls([y3, x3]);

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

      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([x1, y1]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([x2, y2]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([x3, y3]);
      expect(components['/_triangle2'].stateValues.vertices[0].map(x => x.tree)).eqls([y1, x1]);
      expect(components['/_triangle2'].stateValues.vertices[1].map(x => x.tree)).eqls([y2, x2]);
      expect(components['/_triangle2'].stateValues.vertices[2].map(x => x.tree)).eqls([y3, x3]);

    })

  })

  it('triangle with one vertex refection of other', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point name="A" hide>
    (<copy prop="y" tname="B" />,
    <copy prop="x" tname="B" />)
  </point>
  <point name="B" hide>(3,5)</point>
  <point name="C" hide>(-5,2)</point>
  <triangle vertices="$A $B $C" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([5, 3]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([3, 5]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([-5, 2]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 0: [-1, 4] });
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([-1, 4]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([4, -1]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([-5, 2]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 1: [7, -8] });
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([-8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([-5, 2]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 2: [0, 6] });
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([-8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([0, 6]);
    })

  })

  it('triangle with one vertex refection of other with internal references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle vertices="($(_triangle1{prop='vertexX2_2'}), $(_triangle1{prop='vertexX2_1'})) (3,5) (-5,2)" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([5, 3]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([3, 5]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([-5, 2]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 0: [-1, 4] });
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([-1, 4]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([4, -1]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([-5, 2]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 1: [7, -8] });
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([-8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([-5, 2]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 2: [0, 6] });
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([-8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([0, 6]);
    })

  })

  it('triangle with one vertex refection of other with internal references, one vertex specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <triangle vertices="($(_triangle1{prop='vertexX2_2'}), $(_triangle1{prop='vertexX2_1'}))" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([0, 1]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([1, 0]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([0, 0]);
    })

    cy.log('move first vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 0: [-1, 4] });
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([-1, 4]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([4, -1]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([0, 0]);
    })

    cy.log('move second vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 1: [7, -8] });
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([-8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([0, 0]);
    })

    cy.log('move third vertex')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_triangle1'].movePolygon({ 2: [0, 6] });
      expect(components['/_triangle1'].stateValues.vertices[0].map(x => x.tree)).eqls([-8, 7]);
      expect(components['/_triangle1'].stateValues.vertices[1].map(x => x.tree)).eqls([7, -8]);
      expect(components['/_triangle1'].stateValues.vertices[2].map(x => x.tree)).eqls([0, 6]);
    })

  })


});