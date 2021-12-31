describe('LineSegment Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('lineSegment with no children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <lineSegment/>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('initial values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([1, 0]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([0, 0]);
    })


    cy.log('move first point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_linesegment1'].moveLineSegment({
        point1coords: [3, -5],
      });

      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([3, -5]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([0, 0]);
    })


    cy.log('move second point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_linesegment1'].moveLineSegment({
        point2coords: [-7, -1],
      });

      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([3, -5]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([-7, -1]);
    })

  })

  it('lineSegment with one point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <lineSegment endpoints="(3,-8)" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('initial values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([3, -8]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([0, 0]);
    })


    cy.log('move first point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_linesegment1'].moveLineSegment({
        point1coords: [3, -5],
      });

      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([3, -5]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([0, 0]);
    })


    cy.log('move second point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_linesegment1'].moveLineSegment({
        point2coords: [-7, -1],
      });

      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([3, -5]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([-7, -1]);
    })

  })

  it('lineSegment with copied points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point label='P'>(3,5)</point>
  <point label='Q'>(-4,-1)</point>
    <lineSegment endpoints="$_point1 $_point2" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('move point P to (5,-5)')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_point1'].movePoint({ x: 5, y: -5 });
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(5)
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(-5)
      expect((await components['/_point1'].stateValues.coords).tree).eqls(['vector', 5, -5])
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(-4)
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(-1)
      expect((await components['/_point2'].stateValues.coords).tree).eqls(['vector', -4, -1])
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([5, -5]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([-4, -1]);
    })

    cy.log('move line segment up and to the right')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        (await components['/_linesegment1'].stateValues.endpoints)[0][0],
        (await components['/_linesegment1'].stateValues.endpoints)[0][1],
      ];
      let point2coords = [
        (await components['/_linesegment1'].stateValues.endpoints)[1][0],
        (await components['/_linesegment1'].stateValues.endpoints)[1][1],
      ];

      let moveX = 3;
      let moveY = 2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      await components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(p1x)
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(p1y)
      expect((await components['/_point1'].stateValues.coords).tree).eqls(['vector', p1x, p1y])
      expect((await components['/_point2'].stateValues.xs)[0].tree).eq(p2x)
      expect((await components['/_point2'].stateValues.xs)[1].tree).eq(p2y)
      expect((await components['/_point2'].stateValues.coords).tree).eqls(['vector', p2x, p2y])
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([p1x, p1y]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([p2x, p2y]);

    })
  })

  it('lineSegment with endpoints containing sugared string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <lineSegment endpoints="(3,5) (-4,9)" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let point1 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[0];
      let point2 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[1];

      cy.log('Test location')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await point1.stateValues.xs)[0].tree).eq(3)
        expect((await point1.stateValues.xs)[1].tree).eq(5)
        expect((await point2.stateValues.xs)[0].tree).eq(-4)
        expect((await point2.stateValues.xs)[1].tree).eq(9)
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([3, 5]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([-4, 9]);

      })

      cy.log('move line segment up and to the left')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          (await components['/_linesegment1'].stateValues.endpoints)[0][0],
          (await components['/_linesegment1'].stateValues.endpoints)[0][1],
        ];
        let point2coords = [
          (await components['/_linesegment1'].stateValues.endpoints)[1][0],
          (await components['/_linesegment1'].stateValues.endpoints)[1][1],
        ];

        let moveX = -3;
        let moveY = 2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        await components['/_linesegment1'].moveLineSegment({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let p1x = point1coords[0].simplify().tree;
        let p1y = point1coords[1].simplify().tree;
        let p2x = point2coords[0].simplify().tree;
        let p2y = point2coords[1].simplify().tree;

        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point1.stateValues.coords).tree).eqls(['vector', p1x, p1y])
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await point2.stateValues.coords).tree).eqls(['vector', p2x, p2y])
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([p2x, p2y]);

      })
    })
  })

  it('lineSegment with strings and copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <number>3</number>
  <graph>
  <point>(-2,1)</point>
  <linesegment endpoints="($_number1, $(_point1{prop='x'})) ($(_point1{prop='y'}),5) "/>
  </graph>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('Test location')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([3, -2]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([1, 5]);
      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(-2);
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(1);
      expect(await components['/_number1'].stateValues.value).eq(3);

    })

    cy.log('move line segment up and to the left')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let point1coords = [
        (await components['/_linesegment1'].stateValues.endpoints)[0][0],
        (await components['/_linesegment1'].stateValues.endpoints)[0][1],
      ];
      let point2coords = [
        (await components['/_linesegment1'].stateValues.endpoints)[1][0],
        (await components['/_linesegment1'].stateValues.endpoints)[1][1],
      ];

      let moveX = -3;
      let moveY = 2;

      point1coords[0] = point1coords[0].add(moveX);
      point1coords[1] = point1coords[1].add(moveY);
      point2coords[0] = point2coords[0].add(moveX);
      point2coords[1] = point2coords[1].add(moveY);

      await components['/_linesegment1'].moveLineSegment({
        point1coords: point1coords,
        point2coords: point2coords
      });

      let p1x = point1coords[0].simplify().tree;
      let p1y = point1coords[1].simplify().tree;
      let p2x = point2coords[0].simplify().tree;
      let p2y = point2coords[1].simplify().tree;

      expect((await components['/_point1'].stateValues.xs)[0].tree).eq(p1y)
      expect((await components['/_point1'].stateValues.xs)[1].tree).eq(p2x)
      expect(await components['/_number1'].stateValues.value).eq(p1x)
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([p1x, p1y]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([p2x, p2y]);

    })
  })

  it('lineSegment with endpoints based on sugared strings 2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <lineSegment endpoints="(-1,2) (-2,3)" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let point1 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[0];
      let point2 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[1];

      cy.log('move point1 via segment to (-2,-3)')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/_linesegment1'].moveLineSegment({
          point1coords: [-2, -3],
          point2coords: [-2, 3]
        });
        expect((await point1.stateValues.xs)[0].tree).eq(-2)
        expect((await point1.stateValues.xs)[1].tree).eq(-3)
        expect((await point1.stateValues.coords).tree).eqls(['vector', -2, -3])
        expect((await point2.stateValues.xs)[0].tree).eq(-2)
        expect((await point2.stateValues.xs)[1].tree).eq(3)
        expect((await point2.stateValues.coords).tree).eqls(['vector', -2, 3])
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([-2, -3]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([-2, 3]);

      })

      cy.log('move line segment up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          (await components['/_linesegment1'].stateValues.endpoints)[0][0],
          (await components['/_linesegment1'].stateValues.endpoints)[0][1],
        ];
        let point2coords = [
          (await components['/_linesegment1'].stateValues.endpoints)[1][0],
          (await components['/_linesegment1'].stateValues.endpoints)[1][1],
        ];

        let moveX = 3;
        let moveY = 2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        await components['/_linesegment1'].moveLineSegment({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let p1x = point1coords[0].simplify().tree;
        let p1y = point1coords[1].simplify().tree;
        let p2x = point2coords[0].simplify().tree;
        let p2y = point2coords[1].simplify().tree;

        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point1.stateValues.coords).tree).eqls(['vector', p1x, p1y])
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await point2.stateValues.coords).tree).eqls(['vector', p2x, p2y])
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([p2x, p2y]);

      })
    })
  })

  it('lineSegment with multiple layers of copied points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <point>(2,1)</point>
  <point>(-2,-5)</point>
  <copy target="_point1" />
  <copy target="_point2" />
  <copy target="_copy1" />
  <copy target="_copy2" />
  <copy target="_copy3" />
  <copy target="_copy4" />
  
  <graph>
    <lineSegment endpoints="$_copy5 $_copy6" />
  </graph>
  <copy prop="y" target="_point1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let point1 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[0];
      let point2 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[1];

      cy.log('move point 10 to (0,-3)')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await point2.movePoint({ x: 0, y: -3 });
        expect((await point1.stateValues.xs)[0].tree).eq(2)
        expect((await point1.stateValues.xs)[1].tree).eq(1)
        expect((await point2.stateValues.xs)[0].tree).eq(0)
        expect((await point2.stateValues.xs)[1].tree).eq(-3)
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([2, 1]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([0, -3]);

      })

      cy.log('move line segment down and to the left')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          (await components['/_linesegment1'].stateValues.endpoints)[0][0],
          (await components['/_linesegment1'].stateValues.endpoints)[0][1],
        ];
        let point2coords = [
          (await components['/_linesegment1'].stateValues.endpoints)[1][0],
          (await components['/_linesegment1'].stateValues.endpoints)[1][1],
        ];

        let moveX = -3;
        let moveY = -2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        await components['/_linesegment1'].moveLineSegment({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let p1x = point1coords[0].simplify().tree;
        let p1y = point1coords[1].simplify().tree;
        let p2x = point2coords[0].simplify().tree;
        let p2y = point2coords[1].simplify().tree;

        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([p2x, p2y]);

      })
    })
  })

  it('copied line segments', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <linesegment endpoints="(-1,2) (-2,3)" />
    <point>(-4,7)</point>
    <point>(3,5)</point>
    <linesegment endpoints="$_point1 $_point2" />
    <linesegment endpoints="(-9,-1) (-3,6) "/>
  </graph>

  <graph>
    <copy name="ls1a" target="_linesegment1" />
    <copy name="ls2a" target="_linesegment2" />
    <copy name="ls3a" target="_linesegment3" />
  </graph>

  <copy name="g3" target="_graph2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let ls1a = components["/ls1a"].replacements[0];
      let ls2a = components["/ls2a"].replacements[0];
      let ls3a = components["/ls3a"].replacements[0];
      let lsbs = components["/g3"].replacements[0].activeChildren;

      let linesegment1s = ['/_linesegment1', ls1a.componentName, lsbs[0].componentName];
      let linesegment2s = ['/_linesegment2', ls2a.componentName, lsbs[1].componentName];
      let linesegment3s = ['/_linesegment3', ls3a.componentName, lsbs[2].componentName];

      cy.log("initial state")

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
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

        for (let name of linesegment1s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v1tx, v1ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v2tx, v2ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v3tx, v3ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v3hx, v3hy]);
        }

      })

      cy.log('move linesegment1')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = 5;
        let v1ty = -8;
        let v1hx = 4;
        let v1hy = -9;
        await components['/_linesegment1'].moveLineSegment({
          point1coords: [v1tx, v1ty],
          point2coords: [v1hx, v1hy]
        });
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v1tx, v1ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v2tx, v2ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v3tx, v3ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move linesegment1a')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = 2;
        let v1ty = 6;
        let v1hx = -2;
        let v1hy = -4;
        await ls1a.moveLineSegment({
          point1coords: [v1tx, v1ty],
          point2coords: [v1hx, v1hy]
        });
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v1tx, v1ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v2tx, v2ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v3tx, v3ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move linesegment1b')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        await lsbs[0].moveLineSegment({
          point1coords: [v1tx, v1ty],
          point2coords: [v1hx, v1hy]
        });
        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v1tx, v1ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v2tx, v2ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v3tx, v3ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move linesegment2')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = -4;
        let v2ty = 7;
        let v2hx = 3;
        let v2hy = 5;

        await components['/_linesegment2'].moveLineSegment({
          point1coords: [v2tx, v2ty],
          point2coords: [v2hx, v2hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v1tx, v1ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v2tx, v2ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v3tx, v3ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move linesegment2a')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = 6;
        let v2ty = -2;
        let v2hx = 1;
        let v2hy = -7;

        await ls2a.moveLineSegment({
          point1coords: [v2tx, v2ty],
          point2coords: [v2hx, v2hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v1tx, v1ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v2tx, v2ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v3tx, v3ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move linesegment2b')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v2tx = -3;
        let v2ty = -6;
        let v2hx = 5;
        let v2hy = -9;

        await lsbs[1].moveLineSegment({
          point1coords: [v2tx, v2ty],
          point2coords: [v2hx, v2hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v3tx = -9;
        let v3ty = -1;
        let v3hx = -3;
        let v3hy = 6;
        for (let name of linesegment1s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v1tx, v1ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v2tx, v2ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v3tx, v3ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move linesegment3')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = 6;
        let v3ty = -8;
        let v3hx = -1;
        let v3hy = 0;

        await components['/_linesegment3'].moveLineSegment({
          point1coords: [v3tx, v3ty],
          point2coords: [v3hx, v3hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v2ty = -6;
        let v2tx = -3;
        let v2hx = 5;
        let v2hy = -9;
        for (let name of linesegment1s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v1tx, v1ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v2tx, v2ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v3tx, v3ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move linesegment3a')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = 3;
        let v3ty = 1;
        let v3hx = -7;
        let v3hy = -2;

        await ls3a.moveLineSegment({
          point1coords: [v3tx, v3ty],
          point2coords: [v3hx, v3hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v2ty = -6;
        let v2tx = -3;
        let v2hx = 5;
        let v2hy = -9;
        for (let name of linesegment1s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v1tx, v1ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v2tx, v2ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v3tx, v3ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

      cy.log('move linesegment3b')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let v3tx = -2;
        let v3ty = 7;
        let v3hx = 5;
        let v3hy = -6;

        await lsbs[2].moveLineSegment({
          point1coords: [v3tx, v3ty],
          point2coords: [v3hx, v3hy]
        });
        let v1tx = -3;
        let v1ty = 9;
        let v1hx = 6;
        let v1hy = -8;
        let v2ty = -6;
        let v2tx = -3;
        let v2hx = 5;
        let v2hy = -9;
        for (let name of linesegment1s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v1tx, v1ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v1hx, v1hy]);
        }
        for (let name of linesegment2s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v2tx, v2ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v2hx, v2hy]);
        }
        for (let name of linesegment3s) {
          expect((await components[name].stateValues.endpoints)[0].map(x => x.tree)).eqls([v3tx, v3ty]);
          expect((await components[name].stateValues.endpoints)[1].map(x => x.tree)).eqls([v3hx, v3hy]);
        }
      })

    })
  })

  it('initially non-numeric point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="x" prefill="q"/>
  <graph>
    <lineSegment endpoints="($x,2) (-2,3)" />
  </graph>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('check initial values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls(["q", 2]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([-2, 3]);
    });

    cy.log('change point to be numeric');
    cy.get('#\\/x textarea').type("{end}{backspace}5{enter}", { force: true });

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([5, 2]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([-2, 3]);

    })
  })

  it('constrain to linesegment', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <linesegment endpoints="$_point1 $_point2" />

  <point x="-5" y="2">
    <constraints>
      <constrainTo><copy target="_linesegment1" /></constrainTo>
    </constraints>
  </point>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('check initial values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([1, 2]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([3, 4]);
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(1);
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(2);
    });

    cy.log('move line segment to 45 degrees')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_linesegment1'].moveLineSegment({
        point1coords: [-4, 4],
        point2coords: [4, -4],
      })
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([-4, 4]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([4, -4]);

      let xorig = -5;
      let yorig = 2;
      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect((await components['/_point3'].stateValues.xs)[0].tree).closeTo(p5x, 1E-12);
      expect((await components['/_point3'].stateValues.xs)[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 10;
      let yorig = 1;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect((await components['/_point3'].stateValues.xs)[0].tree).closeTo(p5x, 1E-12);
      expect((await components['/_point3'].stateValues.xs)[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 9;
      let yorig = 7;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect((await components['/_point3'].stateValues.xs)[0].tree).closeTo(p5x, 1E-12);
      expect((await components['/_point3'].stateValues.xs)[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -9;
      let yorig = 7;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect((await components['/_point3'].stateValues.xs)[0].tree).closeTo(p5x, 1E-12);
      expect((await components['/_point3'].stateValues.xs)[1].tree).closeTo(p5y, 1E-12);
    });


  })

  it('attract to linesegment', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <point>(1,2)</point>
  <point>(3,4)</point>
  <linesegment endpoints="$_point1 $_point2" />

  <point x="-5" y="2">
    <constraints>
      <attractTo><copy target="_linesegment1" /></attractTo>
    </constraints>
  </point>
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.log('check initial values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([1, 2]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([3, 4]);
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(-5);
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(2);
    });

    cy.log('move line segment to 45 degrees')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/_linesegment1'].moveLineSegment({
        point1coords: [-4, 4],
        point2coords: [4, -4],
      })
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([-4, 4]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([4, -4]);
      expect((await components['/_point3'].stateValues.xs)[0].tree).eq(-5)
      expect((await components['/_point3'].stateValues.xs)[1].tree).eq(2)
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 3.3;
      let yorig = -3.6;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect((await components['/_point3'].stateValues.xs)[0].tree).closeTo(p5x, 1E-12);
      expect((await components['/_point3'].stateValues.xs)[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = 4.3;
      let yorig = -4.6;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

      expect((await components['/_point3'].stateValues.xs)[0].tree).closeTo(4.3, 1E-12);
      expect((await components['/_point3'].stateValues.xs)[1].tree).closeTo(-4.6, 1E-12);
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -2.4;
      let yorig = 2.8;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect((await components['/_point3'].stateValues.xs)[0].tree).closeTo(p5x, 1E-12);
      expect((await components['/_point3'].stateValues.xs)[1].tree).closeTo(p5y, 1E-12);
    });

    cy.log('move point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let xorig = -4.2;
      let yorig = 4.3;

      await components['/_point3'].movePoint({ x: xorig, y: yorig });

      let temp = (xorig - yorig) / 2;
      if (temp > 4) {
        temp = 4;
      } else if (temp < -4) {
        temp = -4;
      }
      let p5x = temp;
      let p5y = -temp;

      expect((await components['/_point3'].stateValues.xs)[0].tree).closeTo(p5x, 1E-12);
      expect((await components['/_point3'].stateValues.xs)[1].tree).closeTo(p5y, 1E-12);
    });


  })

  it('constrain to linesegment, different scales from graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <linesegment endpoints="(-1,-0.05) (1,0.05)" name="l" />
    <point x="100" y="0" name="P">
      <constraints scalesFromGraph="_graph1">
        <constrainTo><copy target="l" /></constrainTo>
      </constraints>
    </point>
  </graph>
  `}, "*");
    });

    // use this to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log(`point on line segment, close to origin`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let x = (await components['/P'].stateValues.xs)[0].tree;
      let y = (await components['/P'].stateValues.xs)[1].tree;

      expect(y).greaterThan(0);
      expect(y).lessThan(0.01);

      expect(x).closeTo(20*y, 1E-10)
    })

    cy.log(`move point`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -100, y: 0.05 });
      let x = (await components['/P'].stateValues.xs)[0].tree;
      let y = (await components['/P'].stateValues.xs)[1].tree;
      expect(y).lessThan(0.05);
      expect(y).greaterThan(0.04);
      expect(x).closeTo(20*y, 1E-10)
    })

    cy.log(`move point past endpoint`);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePoint({ x: -100, y: 0.1 });
      let x = (await components['/P'].stateValues.xs)[0].tree;
      let y = (await components['/P'].stateValues.xs)[1].tree;
      expect(y).eq(0.05);
      expect(x).closeTo(20*y, 1E-10)
    })

  });

  it('copy endpoints of line segment', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <linesegment endpoints="(1,2)(3,4)"/>
  </graph>
  <graph>
  <copy prop="endpoint1" name="point3" target="_linesegment1" />
  <copy prop="endpoint2" name="point4" target="_linesegment1" />
  </graph>
  <graph>
  <copy prop="endpoints" name="points56" target="_linesegment1" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let point1 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[0];
      let point2 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[1];
      let point3 = components["/point3"].replacements[0]
      let point4 = components["/point4"].replacements[0]
      let point5 = components["/points56"].replacements[0]
      let point6 = components["/points56"].replacements[1]

      cy.window().then(async (win) => {
        let p1x = 1;
        let p1y = 2;
        let p2x = 3;
        let p2y = 4;
        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await point3.stateValues.xs)[0].tree).eq(p1x)
        expect((await point3.stateValues.xs)[1].tree).eq(p1y)
        expect((await point4.stateValues.xs)[0].tree).eq(p2x)
        expect((await point4.stateValues.xs)[1].tree).eq(p2y)
        expect((await point5.stateValues.xs)[0].tree).eq(p1x)
        expect((await point5.stateValues.xs)[1].tree).eq(p1y)
        expect((await point6.stateValues.xs)[0].tree).eq(p2x)
        expect((await point6.stateValues.xs)[1].tree).eq(p2y)
      })

      cy.log('move first individually copied endpoint');
      cy.window().then(async (win) => {
        let p1x = -2;
        let p1y = -5;
        await point3.movePoint({ x: p1x, y: p1y });
        let p2x = 3;
        let p2y = 4;
        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await point3.stateValues.xs)[0].tree).eq(p1x)
        expect((await point3.stateValues.xs)[1].tree).eq(p1y)
        expect((await point4.stateValues.xs)[0].tree).eq(p2x)
        expect((await point4.stateValues.xs)[1].tree).eq(p2y)
        expect((await point5.stateValues.xs)[0].tree).eq(p1x)
        expect((await point5.stateValues.xs)[1].tree).eq(p1y)
        expect((await point6.stateValues.xs)[0].tree).eq(p2x)
        expect((await point6.stateValues.xs)[1].tree).eq(p2y)
      })

      cy.log('move second individually copied endpoint');
      cy.window().then(async (win) => {
        let p2x = 8;
        let p2y = -1;
        await point4.movePoint({ x: p2x, y: p2y });
        let p1x = -2;
        let p1y = -5;
        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await point3.stateValues.xs)[0].tree).eq(p1x)
        expect((await point3.stateValues.xs)[1].tree).eq(p1y)
        expect((await point4.stateValues.xs)[0].tree).eq(p2x)
        expect((await point4.stateValues.xs)[1].tree).eq(p2y)
        expect((await point5.stateValues.xs)[0].tree).eq(p1x)
        expect((await point5.stateValues.xs)[1].tree).eq(p1y)
        expect((await point6.stateValues.xs)[0].tree).eq(p2x)
        expect((await point6.stateValues.xs)[1].tree).eq(p2y)
      })

      cy.log('move second array-copied endpoint');
      cy.window().then(async (win) => {
        let p2x = -6;
        let p2y = 4;
        await point6.movePoint({ x: p2x, y: p2y });
        let p1x = -2;
        let p1y = -5;
        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await point3.stateValues.xs)[0].tree).eq(p1x)
        expect((await point3.stateValues.xs)[1].tree).eq(p1y)
        expect((await point4.stateValues.xs)[0].tree).eq(p2x)
        expect((await point4.stateValues.xs)[1].tree).eq(p2y)
        expect((await point5.stateValues.xs)[0].tree).eq(p1x)
        expect((await point5.stateValues.xs)[1].tree).eq(p1y)
        expect((await point6.stateValues.xs)[0].tree).eq(p2x)
        expect((await point6.stateValues.xs)[1].tree).eq(p2y)
      })

      cy.log('move first array-copied endpoint');
      cy.window().then(async (win) => {
        let p1x = 0;
        let p1y = 7;
        await point5.movePoint({ x: p1x, y: p1y });
        let p2x = -6;
        let p2y = 4;
        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await point3.stateValues.xs)[0].tree).eq(p1x)
        expect((await point3.stateValues.xs)[1].tree).eq(p1y)
        expect((await point4.stateValues.xs)[0].tree).eq(p2x)
        expect((await point4.stateValues.xs)[1].tree).eq(p2y)
        expect((await point5.stateValues.xs)[0].tree).eq(p1x)
        expect((await point5.stateValues.xs)[1].tree).eq(p1y)
        expect((await point6.stateValues.xs)[0].tree).eq(p2x)
        expect((await point6.stateValues.xs)[1].tree).eq(p2y)
      })

      cy.log('move line segment up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          (await components['/_linesegment1'].stateValues.endpoints)[0][0],
          (await components['/_linesegment1'].stateValues.endpoints)[0][1],
        ];
        let point2coords = [
          (await components['/_linesegment1'].stateValues.endpoints)[1][0],
          (await components['/_linesegment1'].stateValues.endpoints)[1][1],
        ];

        let moveX = 4;
        let moveY = 2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        await components['/_linesegment1'].moveLineSegment({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let p1x = point1coords[0].simplify().tree;
        let p1y = point1coords[1].simplify().tree;
        let p2x = point2coords[0].simplify().tree;
        let p2y = point2coords[1].simplify().tree;

        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await point3.stateValues.xs)[0].tree).eq(p1x)
        expect((await point3.stateValues.xs)[1].tree).eq(p1y)
        expect((await point4.stateValues.xs)[0].tree).eq(p2x)
        expect((await point4.stateValues.xs)[1].tree).eq(p2y)
        expect((await point5.stateValues.xs)[0].tree).eq(p1x)
        expect((await point5.stateValues.xs)[1].tree).eq(p1y)
        expect((await point6.stateValues.xs)[0].tree).eq(p2x)
        expect((await point6.stateValues.xs)[1].tree).eq(p2y)

      })
    })

  })

  it('new linesegment from copied endpoints of line segment', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <linesegment endpoints="(-1,-2) (-3,-4)" />
  </graph>
  <graph>
  <linesegment endpoints="$(_linesegment1{prop='endpoints'})" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let point1 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[0];
      let point2 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[1];
      let point3 = components["/_linesegment2"].attributes["endpoints"].component.activeChildren[0];
      let point4 = components["/_linesegment2"].attributes["endpoints"].component.activeChildren[1];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let p1x = -1;
        let p1y = -2;
        let p2x = -3;
        let p2y = -4;
        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await point3.stateValues.xs)[0].tree).eq(p1x)
        expect((await point3.stateValues.xs)[1].tree).eq(p1y)
        expect((await point4.stateValues.xs)[0].tree).eq(p2x)
        expect((await point4.stateValues.xs)[1].tree).eq(p2y)
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([p2x, p2y]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[1].map(x => x.tree)).eqls([p2x, p2y]);
      })

      cy.log('move first line segment up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          (await components['/_linesegment1'].stateValues.endpoints)[0][0],
          (await components['/_linesegment1'].stateValues.endpoints)[0][1],
        ];
        let point2coords = [
          (await components['/_linesegment1'].stateValues.endpoints)[1][0],
          (await components['/_linesegment1'].stateValues.endpoints)[1][1],
        ];

        let moveX = 4;
        let moveY = 2;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        await components['/_linesegment1'].moveLineSegment({
          point1coords: point1coords,
          point2coords: point2coords
        });

        let p1x = -1 + moveX;
        let p1y = -2 + moveY;
        let p2x = -3 + moveX;
        let p2y = -4 + moveY;

        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await point3.stateValues.xs)[0].tree).eq(p1x)
        expect((await point3.stateValues.xs)[1].tree).eq(p1y)
        expect((await point4.stateValues.xs)[0].tree).eq(p2x)
        expect((await point4.stateValues.xs)[1].tree).eq(p2y)
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([p2x, p2y]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[1].map(x => x.tree)).eqls([p2x, p2y]);

      })


      cy.log('move second line segment up and to the left')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let point1coords = [
          (await components['/_linesegment2'].stateValues.endpoints)[0][0],
          (await components['/_linesegment2'].stateValues.endpoints)[0][1],
        ];
        let point2coords = [
          (await components['/_linesegment2'].stateValues.endpoints)[1][0],
          (await components['/_linesegment2'].stateValues.endpoints)[1][1],
        ];

        let moveX = -7;
        let moveY = 3;

        point1coords[0] = point1coords[0].add(moveX);
        point1coords[1] = point1coords[1].add(moveY);
        point2coords[0] = point2coords[0].add(moveX);
        point2coords[1] = point2coords[1].add(moveY);

        await components['/_linesegment2'].moveLineSegment({
          point1coords: point1coords,
          point2coords: point2coords
        });


        moveX = 4 + moveX;
        moveY = 2 + moveY;
        let p1x = -1 + moveX;
        let p1y = -2 + moveY;
        let p2x = -3 + moveX;
        let p2y = -4 + moveY;

        expect((await point1.stateValues.xs)[0].tree).eq(p1x)
        expect((await point1.stateValues.xs)[1].tree).eq(p1y)
        expect((await point2.stateValues.xs)[0].tree).eq(p2x)
        expect((await point2.stateValues.xs)[1].tree).eq(p2y)
        expect((await point3.stateValues.xs)[0].tree).eq(p1x)
        expect((await point3.stateValues.xs)[1].tree).eq(p1y)
        expect((await point4.stateValues.xs)[0].tree).eq(p2x)
        expect((await point4.stateValues.xs)[1].tree).eq(p2y)
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([p2x, p2y]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[0].map(x => x.tree)).eqls([p1x, p1y]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[1].map(x => x.tree)).eqls([p2x, p2y]);

      })
    })

  })

  it('extracting endpoint coordinates of symmetric linesegment', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <linesegment endpoints="(1,2) ($(_linesegment1{prop='endpointX1_2'}), $(_linesegment1{prop='endpointX1_1'}))" />
  <point name="x1">
    (<extract prop="x"><copy prop="endpoint1" target="_linesegment1" /></extract>,
    <math fixed>3</math>)
  </point>
  <point name="x2">
    (<extract prop="x"><copy prop="endpoint2" target="_linesegment1" /></extract>,
    <math fixed>4</math>)
  </point>
  <point name="y1">
    (<math fixed>3</math>,
    <extract prop="y"><copy prop="endpoint1" target="_linesegment1" /></extract>)
  </point>
  <point name="y2">
    (<math fixed>4</math>,
    <extract prop="y"><copy prop="endpoint2" target="_linesegment1" /></extract>)
  </point>
</graph>
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let x = 1, y = 2;

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x, y]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([y, x]);
      expect((await components['/x1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/x2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/y1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/y2'].stateValues.xs)[1].tree).eq(x);
    })

    cy.log("move x point 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      x = 3;
      await components['/x1'].movePoint({ x: x });
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x, y]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([y, x]);
      expect((await components['/x1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/x2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/y1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/y2'].stateValues.xs)[1].tree).eq(x);
    })

    cy.log("move x point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      y = 4;
      await components['/x2'].movePoint({ x: y });
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x, y]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([y, x]);
      expect((await components['/x1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/x2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/y1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/y2'].stateValues.xs)[1].tree).eq(x);
    })

    cy.log("move y point 1")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      y = -6;
      await components['/y1'].movePoint({ y: y });
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x, y]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([y, x]);
      expect((await components['/x1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/x2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/y1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/y2'].stateValues.xs)[1].tree).eq(x);
    })

    cy.log("move y point 2")
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      x = -8;
      await components['/y2'].movePoint({ y: x });
      expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x, y]);
      expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([y, x]);
      expect((await components['/x1'].stateValues.xs)[0].tree).eq(x);
      expect((await components['/x2'].stateValues.xs)[0].tree).eq(y);
      expect((await components['/y1'].stateValues.xs)[1].tree).eq(y);
      expect((await components['/y2'].stateValues.xs)[1].tree).eq(x);
    })


  })

  it('three linesegments with mutual references', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <linesegment endpoints="$(_linesegment2{prop='endpoint2' componentType='point'}) (1,0)" />
  <linesegment endpoints="$(_linesegment3{prop='endpoint2' componentType='point'}) (3,2)" />
  <linesegment endpoints="$(_linesegment1{prop='endpoint2' componentType='point'}) (-1,4)" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let point1 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[0];
      let point2 = components["/_linesegment1"].attributes["endpoints"].component.activeChildren[1];
      let point3 = components["/_linesegment2"].attributes["endpoints"].component.activeChildren[0];
      let point4 = components["/_linesegment2"].attributes["endpoints"].component.activeChildren[1];
      let point5 = components["/_linesegment3"].attributes["endpoints"].component.activeChildren[0];
      let point6 = components["/_linesegment3"].attributes["endpoints"].component.activeChildren[1];

      let x1 = 1, y1 = 0;
      let x2 = 3, y2 = 2;
      let x3 = -1, y3 = 4;

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x3, y3]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 1 of line segment 1")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        x2 = 7;
        y2 = -3;
        await point1.movePoint({ x: x2, y: y2 });
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x3, y3]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 2 of line segment 1")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        x1 = -1;
        y1 = -4;
        await point2.movePoint({ x: x1, y: y1 });
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x3, y3]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 1 of line segment 2")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        x3 = 9;
        y3 = -8;
        await point3.movePoint({ x: x3, y: y3 });
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x3, y3]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 2 of line segment 2")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        x2 = 3;
        y2 = 2;
        await point4.movePoint({ x: x2, y: y2 });
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x3, y3]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 1 of line segment 3")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        x1 = -5;
        y1 = 8;
        await point5.movePoint({ x: x1, y: y1 });
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x3, y3]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x3, y3]);

      })

      cy.log("move point 2 of line segment 3")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        x3 = 0;
        y3 = -5;
        await point6.movePoint({ x: x3, y: y3 });
        expect((await components['/_linesegment1'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment1'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x3, y3]);
        expect((await components['/_linesegment2'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x2, y2]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[0].map(x => x.tree)).eqls([x1, y1]);
        expect((await components['/_linesegment3'].stateValues.endpoints)[1].map(x => x.tree)).eqls([x3, y3]);

      })

    })
  })
});