describe('Polyline Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })


  it('Polyline vertices and copied points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point>(3,5)</point>
    <point>(-4,-1)</point>
    <point>(5,2)</point>
    <point>(-3,4)</point>
    <polyline vertices="$_point1 $_point2 $_point3 $_point4" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([3, 5]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([-4, -1]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([5, 2]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([-3, 4]);
    })

    cy.log('move individual vertex')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_polyline1'].movePolyline({ pointCoords: { 1: [4, 7] } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([3, 5]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([4, 7]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([5, 2]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([-3, 4]);

    })


    cy.log('move polyline up and to the right')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          components['/_polyline1'].stateValues.vertices[i][0],
          components['/_polyline1'].stateValues.vertices[i][1]
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      await components['/_polyline1'].movePolyline({ pointCoords: vertices });

      let pxs = [];
      let pys = [];
      for (let i = 0; i < vertices.length; i++) {
        pxs.push(vertices[i][0]);
        pys.push(vertices[i][1]);
      }

      for (let i = 0; i < vertices.length; i++) {
        expect((await components['/_polyline1'].stateValues.vertices)[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
      }

    })
  })

  it('Polyline string points in vertices', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <math>-1</math>
  <graph>
    <polyline vertices="(3,5) (-4,$_math1)(5,2)(-3,4)" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([3, 5]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([-4, -1]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([5, 2]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([-3, 4]);
    })

    cy.log('move individual vertex')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components['/_polyline1'].movePolyline({ pointCoords: { 1: [4, 7] } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([3, 5]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([4, 7]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([5, 2]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([-3, 4]);

    })


    cy.log('move polyline up and to the right')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          components['/_polyline1'].stateValues.vertices[i][0],
          components['/_polyline1'].stateValues.vertices[i][1]
        ])
      }

      let moveX = 3;
      let moveY = 2;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      await components['/_polyline1'].movePolyline({ pointCoords: vertices });

      let pxs = [];
      let pys = [];
      for (let i = 0; i < vertices.length; i++) {
        pxs.push(vertices[i][0]);
        pys.push(vertices[i][1]);
      }

      for (let i = 0; i < vertices.length; i++) {
        expect((await components['/_polyline1'].stateValues.vertices)[i].map(x => x.tree)).eqls([pxs[i], pys[i]]);
      }

    })
  })

  it('dynamic polyline with vertices from copied map, initially zero, copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <mathinput name="length" prefill="0" />
  <graph>
  <map>
    <template><point>($x, 5sin($x))</point></template>
    <sources alias="x"><sequence from="0" length="$length" /></sources>
  </map>
  <polyline vertices="$_map1" />
  </graph>
  
  <graph>
  <copy name="polyline2" target="_polyline1" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(0);
        expect(polyline2.stateValues.nVertices).eq(0);
      })

      cy.get('#\\/length textarea').type("{end}{backspace}1{enter}", { force: true });
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 1;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].tree).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i][1].tree).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/length textarea').type("{end}{backspace}2{enter}", { force: true });
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 2;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/length textarea').type("{end}{backspace}3{enter}", { force: true });
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 3;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/length textarea').type("{end}{backspace}2{enter}", { force: true });
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 2;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })


      cy.get('#\\/length textarea').type("{end}{backspace}0{enter}", { force: true });
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 0;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/length textarea').type("{end}{backspace}5{enter}", { force: true });
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 5;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })
    })

    cy.log("start over and begin with big increment")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>

  <mathinput name="length" prefill="0" />
  <graph>
  <map>
    <template><point>($x, 5sin($x))</point></template>
    <sources alias="x"><sequence from="0" length="$length" /></sources>
  </map>
  <polyline vertices="$_map1" />
  </graph>
  
  <graph>
  <copy name="polyline2" target="_polyline1" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(0);
        expect(polyline2.stateValues.nVertices).eq(0);
      })


      cy.get('#\\/length textarea').type("{end}{backspace}10{enter}", { force: true });
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 10;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })

      cy.get('#\\/length textarea').type("{end}{backspace}{backspace}1{enter}", { force: true });
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let nVertices = 1;
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }

      })
    })

  })

  it('polyline with initially undefined point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput/>
  <graph>
  <polyline vertices="(1,2) (-1,5) ($_mathinput1,7)(3,-5)(-4,-3)"/>
  </graph>
  
  <graph>
  <copy name="polyline2" target="_polyline1" />
  </graph>  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];

      let polylines = [components["/_polyline1"], polyline2]
      cy.window().then(async (win) => {
        for (let polyline of polylines) {
          expect(polyline.stateValues.nVertices).eq(5);
          expect((await polyline.stateValues.vertices)[0][0].tree).eq(1);
          expect((await polyline.stateValues.vertices)[0][1].tree).eq(2);
          expect((await polyline.stateValues.vertices)[1][0].tree).eq(-1);
          expect((await polyline.stateValues.vertices)[1][1].tree).eq(5);
          expect((await polyline.stateValues.vertices)[2][0].tree).eq('\uFF3F');
          expect((await polyline.stateValues.vertices)[2][1].tree).eq(7);
          expect((await polyline.stateValues.vertices)[3][0].tree).eq(3);
          expect((await polyline.stateValues.vertices)[3][1].tree).eq(-5);
          expect((await polyline.stateValues.vertices)[4][0].tree).eq(-4);
          expect((await polyline.stateValues.vertices)[4][1].tree).eq(-3);
        }
      })

      cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}-2{enter}", { force: true });
      cy.window().then(async (win) => {
        for (let polyline of polylines) {
          expect(polyline.stateValues.nVertices).eq(5);
          expect((await polyline.stateValues.vertices)[0][0].tree).eq(1);
          expect((await polyline.stateValues.vertices)[0][1].tree).eq(2);
          expect((await polyline.stateValues.vertices)[1][0].tree).eq(-1);
          expect((await polyline.stateValues.vertices)[1][1].tree).eq(5);
          expect((await polyline.stateValues.vertices)[2][0].tree).eq(-2);
          expect((await polyline.stateValues.vertices)[2][1].tree).eq(7);
          expect((await polyline.stateValues.vertices)[3][0].tree).eq(3);
          expect((await polyline.stateValues.vertices)[3][1].tree).eq(-5);
          expect((await polyline.stateValues.vertices)[4][0].tree).eq(-4);
          expect((await polyline.stateValues.vertices)[4][1].tree).eq(-3);
        }
      })
    })
  })

  it(`can't move polyline based on map`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
  <map hide>
    <template><point>($x, 5sin($x))</point></template>
    <sources alias="x"><sequence from="-5" to="5"/></sources>
  </map>
  <polyline vertices="$_map1" />
  </graph>
  
  <graph>
  <copy name="polyline2" target="_polyline1" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];
      let points = components["/_map1"].replacements.map(x => x.replacements[0]);

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(11);
        expect(polyline2.stateValues.nVertices).eq(11);
        for (let i = -5; i <= 5; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i + 5][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i + 5][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i + 5][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i + 5][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await points[i + 5].stateValues.xs)[0].tree).eq(i);
          expect((await points[i + 5].stateValues.xs)[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);

        }
      })

      cy.log("can't move points")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await points[0].movePoint({ x: 9, y: -8 });
        await points[8].movePoint({ x: -8, y: 4 });
        expect(components['/_polyline1'].stateValues.nVertices).eq(11);
        expect(polyline2.stateValues.nVertices).eq(11);
        for (let i = -5; i <= 5; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i + 5][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i + 5][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i + 5][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i + 5][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await points[i + 5].stateValues.xs)[0].tree).eq(i);
          expect((await points[i + 5].stateValues.xs)[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }
      })


      cy.log("can't move polyline1")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let vertices = [];
        for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
          vertices.push([
            components['/_polyline1'].stateValues.vertices[i][0],
            components['/_polyline1'].stateValues.vertices[i][1]
          ])
        }

        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
          vertices[i][0] = vertices[i][0].add(moveX);
          vertices[i][1] = vertices[i][1].add(moveY);
        }

        await components['/_polyline1'].movePolyline({ pointCoords: vertices });

        expect(components['/_polyline1'].stateValues.nVertices).eq(11);
        expect(polyline2.stateValues.nVertices).eq(11);
        for (let i = -5; i <= 5; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i + 5][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i + 5][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i + 5][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i + 5][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await points[i + 5].stateValues.xs)[0].tree).eq(i);
          expect((await points[i + 5].stateValues.xs)[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }
      })

      cy.log("can't move polyline2")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let vertices = [];
        for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
          vertices.push([
            components['/_polyline1'].stateValues.vertices[i][0],
            components['/_polyline1'].stateValues.vertices[i][1]
          ])
        }

        let moveX = -5;
        let moveY = 6;

        for (let i = 0; i < vertices.length; i++) {
          vertices[i][0] = vertices[i][0].add(moveX);
          vertices[i][1] = vertices[i][1].add(moveY);
        }

        await polyline2.movePolyline({ pointCoords: vertices });

        expect(components['/_polyline1'].stateValues.nVertices).eq(11);
        expect(polyline2.stateValues.nVertices).eq(11);
        for (let i = -5; i <= 5; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i + 5][0].tree).eq(i);
          expect((await components['/_polyline1'].stateValues.vertices)[i + 5][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await polyline2.stateValues.vertices)[i + 5][0].tree).eq(i);
          expect((await polyline2.stateValues.vertices)[i + 5][1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
          expect((await points[i + 5].stateValues.xs)[0].tree).eq(i);
          expect((await points[i + 5].stateValues.xs)[1].evaluate_to_constant()).closeTo(5 * Math.sin(i), 1E-12);
        }
      })
    })
  })

  it(`create moveable polyline based on map`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <graph>
  <map hide>
    <template><point>($x + <math>0</math>, 5sin($x) + <math>0</math>)</point></template>
    <sources alias="x"><sequence from="-5" to="5"/></sources>
  </map>
  <polyline vertices='$_map1' />
  </graph>
  
  <graph>
  <copy name="polyline2" target="_polyline1" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let polyline2 = components["/polyline2"].replacements[0];
      let points = components["/_map1"].replacements.map(x => x.replacements[0]);

      let xs = [], ys = [];
      for (let i = -5; i <= 5; i++) {
        xs.push(i);
        ys.push(5 * Math.sin(i))
      }

      let nVertices = 11;

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(xs[i]);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(xs[i]);
          expect((await polyline2.stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect((await points[i].stateValues.xs)[0].tree).eq(xs[i]);
          expect((await points[i].stateValues.xs)[1].evaluate_to_constant()).closeTo(ys[i], 1E-12);

        }
      })

      cy.log("can move points")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        xs[0] = 9;
        ys[0] = -8;
        await points[0].movePoint({ x: xs[0], y: ys[0] });
        xs[8] = -8;
        ys[8] = -4;
        await points[8].movePoint({ x: xs[8], y: ys[8] });

        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(xs[i]);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(xs[i]);
          expect((await polyline2.stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect((await points[i].stateValues.xs)[0].tree).eq(xs[i]);
          expect((await points[i].stateValues.xs)[1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
        }
      })


      cy.log("can move polyline1")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let vertices = [];
        for (let i = 0; i < nVertices; i++) {
          vertices.push([
            components['/_polyline1'].stateValues.vertices[i][0],
            components['/_polyline1'].stateValues.vertices[i][1]
          ])
        }

        let moveX = 3;
        let moveY = 2;

        for (let i = 0; i < nVertices; i++) {
          vertices[i][0] = vertices[i][0].add(moveX);
          vertices[i][1] = vertices[i][1].add(moveY);
          xs[i] += moveX;
          ys[i] += moveY;
        }

        await components['/_polyline1'].movePolyline({ pointCoords: vertices });

        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(xs[i]);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(xs[i]);
          expect((await polyline2.stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect((await points[i].stateValues.xs)[0].tree).eq(xs[i]);
          expect((await points[i].stateValues.xs)[1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
        }
      })

      cy.log("can move polyline2")
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let vertices = [];
        for (let i = 0; i < nVertices; i++) {
          vertices.push([
            components['/_polyline1'].stateValues.vertices[i][0],
            components['/_polyline1'].stateValues.vertices[i][1]
          ])
        }

        let moveX = -5;
        let moveY = 6;

        for (let i = 0; i < vertices.length; i++) {
          vertices[i][0] = vertices[i][0].add(moveX);
          vertices[i][1] = vertices[i][1].add(moveY);
          xs[i] += moveX;
          ys[i] += moveY;
        }

        await polyline2.movePolyline({ pointCoords: vertices });

        expect(components['/_polyline1'].stateValues.nVertices).eq(nVertices);
        expect(polyline2.stateValues.nVertices).eq(nVertices);
        for (let i = 0; i < nVertices; i++) {
          expect((await components['/_polyline1'].stateValues.vertices)[i][0].tree).eq(xs[i]);
          expect((await components['/_polyline1'].stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect((await polyline2.stateValues.vertices)[i][0].tree).eq(xs[i]);
          expect((await polyline2.stateValues.vertices)[i][1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
          expect((await points[i].stateValues.xs)[0].tree).eq(xs[i]);
          expect((await points[i].stateValues.xs)[1].evaluate_to_constant()).closeTo(ys[i], 1E-12);
        }
      })
    })
  })

  it('copy vertices of polyline', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="(-3,-1)(1,2)(3,4)(6,-2)" />
  </graph>
  <graph>
  <copy name="v1" prop="vertex1" target="_polyline1" />
  <copy name="v2" prop="vertex2" target="_polyline1" />
  <copy name="v3" prop="vertex3" target="_polyline1" />
  <copy name="v4" prop="vertex4" target="_polyline1" />
  </graph>
  <graph>
  <copy name="vs" prop="vertices" target="_polyline1" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let polylineVs = components["/_polyline1"].attributes.vertices.component.activeChildren;
      let v1 = components["/v1"].replacements[0];
      let v2 = components["/v2"].replacements[0];
      let v3 = components["/v3"].replacements[0];
      let v4 = components["/v4"].replacements[0];
      let vs = components["/vs"].replacements;
      let pointnames = [
        [polylineVs[0].componentName, v1.componentName, vs[0].componentName],
        [polylineVs[1].componentName, v2.componentName, vs[1].componentName],
        [polylineVs[2].componentName, v3.componentName, vs[2].componentName],
        [polylineVs[3].componentName, v4.componentName, vs[3].componentName]
      ];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let ps = [[-3, -1], [1, 2], [3, 4], [6, -2]];

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 3; j++) {
            expect((await components[pointnames[i][j]].stateValues.xs)[0].tree).eq(ps[i][0]);
            expect((await components[pointnames[i][j]].stateValues.xs)[1].tree).eq(ps[i][1]);
          }
        }
      })

      cy.log('move individually copied vertices');
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let ps = [[-5, 3], [-2, 7], [0, -8], [9, -6]];

        for (let i = 0; i < 4; i++) {
          await components[pointnames[i][1]].movePoint({ x: ps[i][0], y: ps[i][1] });
        }

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 3; j++) {
            expect((await components[pointnames[i][j]].stateValues.xs)[0].tree).eq(ps[i][0]);
            expect((await components[pointnames[i][j]].stateValues.xs)[1].tree).eq(ps[i][1]);
          }
        }

      })

      cy.log('move array-copied vertices');
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let ps = [[-7, -1], [-3, 5], [2, 4], [6, 0]];

        for (let i = 0; i < 4; i++) {
          await components[pointnames[i][2]].movePoint({ x: ps[i][0], y: ps[i][1] });
        }

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 3; j++) {
            expect((await components[pointnames[i][j]].stateValues.xs)[0].tree).eq(ps[i][0]);
            expect((await components[pointnames[i][j]].stateValues.xs)[1].tree).eq(ps[i][1]);
          }
        }

      })
    })
  })

  it('new polyline from copied vertices of polyline', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="(-9,6)(-3,7)(4,0)(8,5)" />
  </graph>
  <graph>
  <polyline vertices="$(_polyline1{prop='vertices'})" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let polyline1Vs = components["/_polyline1"].attributes.vertices.component.activeChildren;
      let polyline2Vs = components["/_polyline2"].attributes.vertices.component.activeChildren;
      let pointnames = [
        [polyline1Vs[0].componentName, polyline2Vs[0].componentName],
        [polyline1Vs[1].componentName, polyline2Vs[1].componentName],
        [polyline1Vs[2].componentName, polyline2Vs[2].componentName],
        [polyline1Vs[3].componentName, polyline2Vs[3].componentName]
      ];

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 2; j++) {
            expect((await components[pointnames[i][j]].stateValues.xs)[0].tree).eq(ps[i][0]);
            expect((await components[pointnames[i][j]].stateValues.xs)[1].tree).eq(ps[i][1]);
            expect((await components['/_polyline1'].stateValues.vertices)[i].map(x => x.tree)).eqls([ps[i][0], ps[i][1]]);
            expect((await components['/_polyline2'].stateValues.vertices)[i].map(x => x.tree)).eqls([ps[i][0], ps[i][1]]);
          }
        }
      })

      cy.log('move first polyline up and to the right')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];

        let vertices = [];
        for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
          vertices.push([
            components['/_polyline1'].stateValues.vertices[i][0],
            components['/_polyline1'].stateValues.vertices[i][1]
          ])
        }

        let moveX = 4;
        let moveY = 2;

        for (let i = 0; i < vertices.length; i++) {
          vertices[i][0] = vertices[i][0].add(moveX);
          vertices[i][1] = vertices[i][1].add(moveY);
        }

        await components['/_polyline1'].movePolyline({ pointCoords: vertices });

        for (let i = 0; i < vertices.length; i++) {
          ps[i][0] += moveX;
          ps[i][1] += moveY;
        }

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 2; j++) {
            expect((await components[pointnames[i][j]].stateValues.xs)[0].tree).eq(ps[i][0]);
            expect((await components[pointnames[i][j]].stateValues.xs)[1].tree).eq(ps[i][1]);
            expect((await components['/_polyline1'].stateValues.vertices)[i].map(x => x.tree)).eqls([ps[i][0], ps[i][1]]);
            expect((await components['/_polyline2'].stateValues.vertices)[i].map(x => x.tree)).eqls([ps[i][0], ps[i][1]]);
          }
        }

      })


      cy.log('move second line segment up and to the left')
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let vertices = [];
        for (let i = 0; i < components['/_polyline2'].stateValues.nVertices; i++) {
          vertices.push([
            components['/_polyline2'].stateValues.vertices[i][0],
            components['/_polyline2'].stateValues.vertices[i][1]
          ])
        }

        let moveX = -7;
        let moveY = 3;

        for (let i = 0; i < vertices.length; i++) {
          vertices[i][0] = vertices[i][0].add(moveX);
          vertices[i][1] = vertices[i][1].add(moveY);
        }

        await components['/_polyline2'].movePolyline({ pointCoords: vertices });

        let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];

        for (let i = 0; i < vertices.length; i++) {
          ps[i][0] += 4 + moveX;
          ps[i][1] += 2 + moveY;
        }

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 2; j++) {
            expect((await components[pointnames[i][j]].stateValues.xs)[0].tree).eq(ps[i][0]);
            expect((await components[pointnames[i][j]].stateValues.xs)[1].tree).eq(ps[i][1]);
            expect((await components['/_polyline1'].stateValues.vertices)[i].map(x => x.tree)).eqls([ps[i][0], ps[i][1]]);
            expect((await components['/_polyline2'].stateValues.vertices)[i].map(x => x.tree)).eqls([ps[i][0], ps[i][1]]);
          }
        }

      })
    })

  })

  it('new polyline from copied vertices, some flipped', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="(-9,6)(-3,7)(4,0)(8,5)" />
  </graph>
  <graph>
  <polyline vertices="$(_polyline1{prop='vertex1'}) ($(_polyline1{prop='vertexX2_2'}), $(_polyline1{prop='vertexX2_1'})) $(_polyline1{prop='vertex3'}) ($(_polyline1{prop='vertexX4_2'}), $(_polyline1{prop='vertexX4_1'}))" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let ps = [[-9, 6], [-3, 7], [4, 0], [8, 5]];
      let psflipped = [[-9, 6], [7, -3], [4, 0], [5, 8]];
      let components = Object.assign({}, win.state.components);
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...ps[0]]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...ps[1]]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...ps[2]]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...ps[3]]);
      expect((await components['/_polyline2'].stateValues.vertices)[0].map(x => x.tree)).eqls([...psflipped[0]]);
      expect((await components['/_polyline2'].stateValues.vertices)[1].map(x => x.tree)).eqls([...psflipped[1]]);
      expect((await components['/_polyline2'].stateValues.vertices)[2].map(x => x.tree)).eqls([...psflipped[2]]);
      expect((await components['/_polyline2'].stateValues.vertices)[3].map(x => x.tree)).eqls([...psflipped[3]]);
    })

    cy.log('move first polyline verticies')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[7, 2], [1, -3], [2, 9], [-4, -3]];
      let psflipped = [[7, 2], [-3, 1], [2, 9], [-3, -4]];

      await components['/_polyline1'].movePolyline({ pointCoords: ps });

      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...ps[0]]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...ps[1]]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...ps[2]]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...ps[3]]);
      expect((await components['/_polyline2'].stateValues.vertices)[0].map(x => x.tree)).eqls([...psflipped[0]]);
      expect((await components['/_polyline2'].stateValues.vertices)[1].map(x => x.tree)).eqls([...psflipped[1]]);
      expect((await components['/_polyline2'].stateValues.vertices)[2].map(x => x.tree)).eqls([...psflipped[2]]);
      expect((await components['/_polyline2'].stateValues.vertices)[3].map(x => x.tree)).eqls([...psflipped[3]]);

    })

    cy.log('move second polyline verticies')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let ps = [[-1, 9], [7, 5], [-8, 1], [6, -7]];
      let psflipped = [[-1, 9], [5, 7], [-8, 1], [-7, 6]];

      await components['/_polyline2'].movePolyline({ pointCoords: psflipped });

      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...ps[0]]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...ps[1]]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...ps[2]]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...ps[3]]);
      expect((await components['/_polyline2'].stateValues.vertices)[0].map(x => x.tree)).eqls([...psflipped[0]]);
      expect((await components['/_polyline2'].stateValues.vertices)[1].map(x => x.tree)).eqls([...psflipped[1]]);
      expect((await components['/_polyline2'].stateValues.vertices)[2].map(x => x.tree)).eqls([...psflipped[2]]);
      expect((await components['/_polyline2'].stateValues.vertices)[3].map(x => x.tree)).eqls([...psflipped[3]]);

    })


  })

  it('four vertex polyline based on three points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="(1,2) (3,4) (-5,6) ($(_polyline1{fixed prop='vertexX3_1'})+$(_polyline1{fixed prop='vertexX2_1'})-$(_polyline1{prop='vertexX1_1'}), $(_polyline1{fixed prop='vertexX3_2'})+$(_polyline1{fixed prop='vertexX2_2'})-$(_polyline1{prop='vertexX1_2'}))" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...D]);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -1];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 0: A } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...D]);
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 1: B } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...D]);
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];
      D = [C[0] + B[0] - A[0], C[1] + B[1] - A[1]];

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 2: C } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...D]);
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      D = [7, 0];
      A = [C[0] + B[0] - D[0], C[1] + B[1] - D[1]];
      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 3: D } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...D]);
    })

  })

  it('fourth vertex depends on internal ref of first vertex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="(1,2) (3,4)(-5,6) $(_polyline1{prop='vertex1' componentType='point'})" />
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -1];

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 0: A } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 1: B } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 2: C } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 3: A } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
    })

  })

  it('first vertex depends on internal ref of fourth vertex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="$(_polyline1{prop='vertex4' componentType='point'}) (3,4) (-5,6) (1,2)" />
  </graph>
  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -1];

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 0: A } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 1: B } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 2: C } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 3: A } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
    })

  })

  it('first vertex depends fourth, formula for fifth', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline vertices="$(_polyline1{prop='vertex4' componentType='point'}) (3,4)(-5,6) (1,2) ($(_polyline1{prop='vertexX1_1'})+1,2)" />
  </graph>
  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [1, 2];
    let B = [3, 4];
    let C = [-5, 6];
    let D = [A[0] + 1, 2];
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -1];
      D[0] = A[0] + 1;

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 0: A } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 1: B } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 2: C } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      A = [7, 0];
      D[0] = A[0] + 1;
      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 3: A } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
    })


    cy.log('move fifth vertex')
    cy.window().then(async (win) => {
      D = [-5, 9];
      A[0] = D[0] - 1;
      let components = Object.assign({}, win.state.components);
      await components['/_polyline1'].movePolyline({ pointCoords: { 4: D } });
      expect((await components['/_polyline1'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/_polyline1'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/_polyline1'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/_polyline1'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
    })

  })

  it('first, fourth, seventh vertex depends on fourth, seventh, tenth', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline name="P" vertices="$(P{prop='vertex4' componentType='point'}) (1,2) (3,4) $(P{prop='vertex7' componentType='point'}) (5,7) (-5,7) $(P{prop='vertex10' componentType='point'}) (3,1) (5,0) (-5,-1)" />
  </graph>
  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [-5, -1];
    let B = [1, 2];
    let C = [3, 4];
    let D = [5, 7];
    let E = [-5, 7];
    let F = [3, 1];
    let G = [5, 0];
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -9];

      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 0: A } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 1: B } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 2: C } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      A = [7, 0];
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 3: A } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move fifth vertex')
    cy.window().then(async (win) => {
      D = [-9, 1];
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 4: D } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move sixth vertex')
    cy.window().then(async (win) => {
      E = [-3, 6];
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 5: E } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move seventh vertex')
    cy.window().then(async (win) => {
      A = [2, -4];
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 6: A } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move eighth vertex')
    cy.window().then(async (win) => {
      F = [6, 7];
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 7: F } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move nineth vertex')
    cy.window().then(async (win) => {
      G = [1, -8];
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 8: G } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move tenth vertex')
    cy.window().then(async (win) => {
      A = [-6, 10];
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 9: A } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

  })

  it('first, fourth, seventh vertex depends on shifted fourth, seventh, tenth', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
  <polyline name="P" vertices="($(P{prop='vertexX4_1'})+1,$(P{prop='vertexX4_2'})+1) (1,2) (3,4) ($(P{prop='vertexX7_1'})+1,$(P{prop='vertexX7_2'})+1) (5,7) (-5,7) ($(P{prop='vertexX10_1'})+1,$(P{prop='vertexX10_2'})+1) (3,1) (5,0) (-5,-1)" />
  </graph>
  
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let A = [-5, -1];
    let B = [1, 2];
    let C = [3, 4];
    let D = [5, 7];
    let E = [-5, 7];
    let F = [3, 1];
    let G = [5, 0];
    let A1 = [A[0] + 1, A[1] + 1];
    let A2 = [A[0] + 2, A[1] + 2];
    let A3 = [A[0] + 3, A[1] + 3];
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A3]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A2]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A1]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move first vertex')
    cy.window().then(async (win) => {
      A = [-4, -9];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 0: A3 } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A3]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A2]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A1]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move second vertex')
    cy.window().then(async (win) => {
      B = [8, 9];

      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 1: B } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A3]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A2]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A1]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move third vertex')
    cy.window().then(async (win) => {
      C = [-3, 7];

      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 2: C } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A3]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A2]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A1]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move fourth vertex')
    cy.window().then(async (win) => {
      A = [7, 0];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 3: A2 } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A3]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A2]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A1]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move fifth vertex')
    cy.window().then(async (win) => {
      D = [-9, 1];
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 4: D } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A3]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A2]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A1]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move sixth vertex')
    cy.window().then(async (win) => {
      E = [-3, 6];
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 5: E } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A3]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A2]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A1]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move seventh vertex')
    cy.window().then(async (win) => {
      A = [2, -4];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 6: A1 } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A3]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A2]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A1]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move eighth vertex')
    cy.window().then(async (win) => {
      F = [6, 7];
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 7: F } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A3]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A2]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A1]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move nineth vertex')
    cy.window().then(async (win) => {
      G = [1, -8];
      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 8: G } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A3]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A2]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A1]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

    cy.log('move tenth vertex')
    cy.window().then(async (win) => {
      A = [-6, 7];
      A1 = [A[0] + 1, A[1] + 1];
      A2 = [A[0] + 2, A[1] + 2];
      A3 = [A[0] + 3, A[1] + 3];

      let components = Object.assign({}, win.state.components);
      await components['/P'].movePolyline({ pointCoords: { 9: A } });
      expect((await components['/P'].stateValues.vertices)[0].map(x => x.tree)).eqls([...A3]);
      expect((await components['/P'].stateValues.vertices)[1].map(x => x.tree)).eqls([...B]);
      expect((await components['/P'].stateValues.vertices)[2].map(x => x.tree)).eqls([...C]);
      expect((await components['/P'].stateValues.vertices)[3].map(x => x.tree)).eqls([...A2]);
      expect((await components['/P'].stateValues.vertices)[4].map(x => x.tree)).eqls([...D]);
      expect((await components['/P'].stateValues.vertices)[5].map(x => x.tree)).eqls([...E]);
      expect((await components['/P'].stateValues.vertices)[6].map(x => x.tree)).eqls([...A1]);
      expect((await components['/P'].stateValues.vertices)[7].map(x => x.tree)).eqls([...F]);
      expect((await components['/P'].stateValues.vertices)[8].map(x => x.tree)).eqls([...G]);
      expect((await components['/P'].stateValues.vertices)[9].map(x => x.tree)).eqls([...A]);
    })

  })

  it('attract to polyline', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <polyline vertices=" (3,5) (-4,-1)(5,2)" />
    <point x="7" y="8">
      <constraints>
        <attractTo><copy target="_polyline1" /></attractTo>
      </constraints>
    </point>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let x1 = 3, x2 = -4, x3 = 5;
    let y1 = 5, y2 = -1, y3 = 2;

    cy.log('point originally not attracted')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', 7, 8]);
    })

    cy.log('move point near segment 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = 1;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

    })


    cy.log('move point near segment 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = 3;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.4;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)

    })

    cy.log('move point near segment between first and last vertices')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = 4;
      let mseg3 = (y1 - y3) / (x1 - x3);
      let y = mseg3 * (x - x3) + y3 + 0.2;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x, 1E-6);
      expect(py).closeTo(y, 1E-6);

    })

    cy.log('move point just past first vertex')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = x1 + 0.2;
      let y = y1 + 0.3;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x1, 1E-6);
      expect(py).closeTo(y1, 1E-6);

    })

    cy.log('point not attracted along extension of first segment')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = 4;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x, 1E-6);
      expect(py).closeTo(y, 1E-6);


      x = -5;
      y = mseg1 * (x - x1) + y1 - 0.3;
      await components['/_point1'].movePoint({ x, y });
      px = components['/_point1'].stateValues.xs[0].tree;
      py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x, 1E-6);
      expect(py).closeTo(y, 1E-6);

    })


    cy.log('move point just past second vertex')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = x2 - 0.2;
      let y = y2 - 0.3;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x2, 1E-6);
      expect(py).closeTo(y2, 1E-6);

    })


    cy.log('point not attracted along extension of second segment')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = 6;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.3;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x, 1E-6);
      expect(py).closeTo(y, 1E-6);


      x = -5;
      y = mseg2 * (x - x2) + y2 - 0.3;
      await components['/_point1'].movePoint({ x, y });
      px = components['/_point1'].stateValues.xs[0].tree;
      py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x, 1E-6);
      expect(py).closeTo(y, 1E-6);

    })



    cy.log('move polyline so point attracts to first segment')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < await components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          (await components['/_polyline1'].stateValues.vertices)[i][0],
          (await components['/_polyline1'].stateValues.vertices)[i][1]
        ])
      }

      let moveX = -3;
      let moveY = -2;

      x1 += moveX;
      x2 += moveX;
      x3 += moveX;
      y1 += moveY;
      y2 += moveY;
      y3 += moveY;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      await components['/_polyline1'].movePolyline({ pointCoords: vertices });

      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      let mseg1 = (y2 - y1) / (x2 - x1);

      expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

    })


    cy.log('move second vertex so point attracts to second segment')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < await components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          (await components['/_polyline1'].stateValues.vertices)[i][0],
          (await components['/_polyline1'].stateValues.vertices)[i][1]
        ])
      }

      let moveX = -1;
      let moveY = 1;

      x2 += moveX;
      y2 += moveY;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      await components['/_polyline1'].movePolyline({ pointCoords: { 1: [x2, y2] } });

      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      let mseg2 = (y2 - y3) / (x2 - x3);

      expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)

    })
  })

  it('constrain to polyline', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <polyline vertices=" (3,5) (-4,-1)(5,2)" />
    <point x="7" y="8">
      <constraints>
        <constrainTo><copy target="_polyline1" /></constrainTo>
      </constraints>
    </point>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let x1 = 3, x2 = -4, x3 = 5;
    let y1 = 5, y2 = -1, y3 = 2;

    cy.log('point originally constrained')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_point1'].stateValues.coords.tree).eqls(['vector', x1, y1]);
    })

    cy.log('move point near segment 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = 1;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

    })


    cy.log('move point near segment 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = 3;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.4;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)

    })

    cy.log('move point near segment between first and last vertices')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = 4;
      let mseg3 = (y1 - y3) / (x1 - x3);
      let y = mseg3 * (x - x3) + y3 + 0.2;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;
      let mseg1 = (y2 - y1) / (x2 - x1);
      expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

    })

    cy.log('move point just past first vertex')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = x1 + 0.2;
      let y = y1 + 0.3;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x1, 1E-6);
      expect(py).closeTo(y1, 1E-6);

    })

    cy.log('point along extension of first segment constrained to endpoint')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = 4;
      let mseg1 = (y2 - y1) / (x2 - x1);
      let y = mseg1 * (x - x1) + y1 + 0.3;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x1, 1E-6);
      expect(py).closeTo(y1, 1E-6);


      x = -5;
      y = mseg1 * (x - x1) + y1 - 0.3;
      await components['/_point1'].movePoint({ x, y });
      px = components['/_point1'].stateValues.xs[0].tree;
      py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x2, 1E-6);
      expect(py).closeTo(y2, 1E-6);

    })


    cy.log('move point just past second vertex')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = x2 - 0.2;
      let y = y2 - 0.3;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x2, 1E-6);
      expect(py).closeTo(y2, 1E-6);

    })


    cy.log('point along extension of second segment constrained to endpoint')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let x = 6;
      let mseg2 = (y2 - y3) / (x2 - x3);
      let y = mseg2 * (x - x2) + y2 + 0.3;
      await components['/_point1'].movePoint({ x, y });
      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x3, 1E-6);
      expect(py).closeTo(y3, 1E-6);


      x = -5;
      y = mseg2 * (x - x2) + y2 - 0.3;
      await components['/_point1'].movePoint({ x, y });
      px = components['/_point1'].stateValues.xs[0].tree;
      py = components['/_point1'].stateValues.xs[1].tree;

      expect(px).closeTo(x2, 1E-6);
      expect(py).closeTo(y2, 1E-6);

    })



    cy.log('move polyline so point constrained to first segment')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          components['/_polyline1'].stateValues.vertices[i][0],
          components['/_polyline1'].stateValues.vertices[i][1]
        ])
      }

      let moveX = -3;
      let moveY = -5;

      x1 += moveX;
      x2 += moveX;
      x3 += moveX;
      y1 += moveY;
      y2 += moveY;
      y3 += moveY;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      await components['/_polyline1'].movePolyline({ pointCoords: vertices });

      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      let mseg1 = (y2 - y1) / (x2 - x1);

      expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

    })


    cy.log('move second vertex so point constrained to second segment')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let vertices = [];
      for (let i = 0; i < await components['/_polyline1'].stateValues.nVertices; i++) {
        vertices.push([
          (await components['/_polyline1'].stateValues.vertices)[i][0],
          (await components['/_polyline1'].stateValues.vertices)[i][1]
        ])
      }

      let moveX = -1;
      let moveY = 8;

      x2 += moveX;
      y2 += moveY;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i][0] = vertices[i][0].add(moveX).simplify().tree;
        vertices[i][1] = vertices[i][1].add(moveY).simplify().tree;
      }

      await components['/_polyline1'].movePolyline({ pointCoords: { 1: [x2, y2] } });

      let px = components['/_point1'].stateValues.xs[0].tree;
      let py = components['/_point1'].stateValues.xs[1].tree;

      let mseg2 = (y2 - y3) / (x2 - x3);

      expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)

    })
  })

  it('constrain to polyline, different scales from graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph xmin="-110" xmax="110" ymin="-0.11" ymax="0.11">
    <polyline vertices="(-50,-0.02) (-40,0.07) (70,0.06) (10,-0.01)" name="p" />
    <point x="0" y="0.01" name="A">
      <constraints baseOnGraph="_graph1">
        <constrainTo><copy target="p" /></constrainTo>
      </constraints>
    </point>
  </graph>
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let x1 = -50, x2 = -40, x3 = 70, x4 = 10;
    let y1 = -0.02, y2 = 0.07, y3 = 0.06, y4 = -0.01;

    cy.log('point originally on segment 3')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let mseg3 = (y4 - y3) / (x4 - x3);

      let px = components['/A'].stateValues.xs[0].tree;
      let py = components['/A'].stateValues.xs[1].tree;

      expect(py).closeTo(mseg3 * (px - x3) + y3, 1E-6)

    })

    cy.log('move point near segment 1')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let mseg1 = (y2 - y1) / (x2 - x1);
      await components['/A'].movePoint({ x: -20, y: 0.02 });
      let px = components['/A'].stateValues.xs[0].tree;
      let py = components['/A'].stateValues.xs[1].tree;

      expect(py).closeTo(mseg1 * (px - x1) + y1, 1E-6)

    })


    cy.log('move point near segment 2')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let mseg2 = (y2 - y3) / (x2 - x3);
      await components['/A'].movePoint({ x: 0, y: 0.04 });
      let px = components['/A'].stateValues.xs[0].tree;
      let py = components['/A'].stateValues.xs[1].tree;

      expect(py).closeTo(mseg2 * (px - x2) + y2, 1E-6)

    })

  })
});